import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { EventEmitter } from 'node:events'

let manifestCache = null
let moduleCache = new Map()

function normalizeHeaders(headers) {
  const out = {}
  for (const [k, v] of Object.entries(headers || {})) {
    out[String(k).toLowerCase()] = v
  }
  return out
}

function parseEvent(event) {
  // Built-in HTTP trigger usually passes an object. Some runtimes may pass Buffer/string.
  if (!event) return {}
  if (Buffer.isBuffer(event)) {
    try {
      return JSON.parse(event.toString('utf8'))
    } catch {
      return {}
    }
  }
  if (typeof event === 'string') {
    try {
      return JSON.parse(event)
    } catch {
      return {}
    }
  }
  return event
}

async function loadManifest() {
  if (manifestCache) return manifestCache
  const manifestPath = fileURLToPath(new URL('./route-manifest.json', import.meta.url))
  const raw = await fs.readFile(manifestPath, 'utf8')
  manifestCache = JSON.parse(raw)
  return manifestCache
}

function matchCatchAll(patternSegs, requestSegs) {
  if (!patternSegs.length) return null
  const last = patternSegs[patternSegs.length - 1]
  if (!last.startsWith(':')) return null
  const staticPrefix = patternSegs.slice(0, -1)
  if (requestSegs.length < staticPrefix.length + 1) return null
  for (let i = 0; i < staticPrefix.length; i += 1) {
    if (staticPrefix[i] !== requestSegs[i]) return null
  }
  const rest = requestSegs.slice(staticPrefix.length)
  const paramName = last.slice(1)
  return { [paramName]: rest.join('/') }
}

function matchRoute(manifest, requestPath) {
  const p = String(requestPath || '').split('?')[0].replace(/\/+$/, '') || '/'
  let segs = p.split('/').filter(Boolean)
  if (segs[0] === 'api') segs = segs.slice(1)

  for (const r of manifest.routes || []) {
    const routeSegs = r.segments || []
    if (r.catchAll) {
      const params = matchCatchAll(routeSegs, segs)
      if (params) return { route: r, params }
      continue
    }
    if (routeSegs.length !== segs.length) continue

    const params = {}
    let ok = true
    for (let i = 0; i < routeSegs.length; i += 1) {
      const rs = routeSegs[i]
      const s = segs[i]
      if (rs.startsWith(':')) {
        params[rs.slice(1)] = s
      } else if (rs !== s) {
        ok = false
        break
      }
    }
    if (!ok) continue
    return { route: r, params }
  }
  return null
}

function makeBodyBuffer(event) {
  const body = event?.body
  if (body == null) return Buffer.alloc(0)

  if (event?.isBase64Encoded) {
    return Buffer.from(String(body), 'base64')
  }
  if (Buffer.isBuffer(body)) return body
  if (typeof body === 'string') return Buffer.from(body, 'utf8')
  // FC might map other types; stringify as last resort.
  return Buffer.from(String(body), 'utf8')
}

function createReqRes({ event, matched, params, bodyBuffer }) {
  const req = new EventEmitter()
  const resState = {
    statusCode: 200,
    headers: {},
    body: undefined,
  }

  req.method = event?.requestContext?.http?.method || 'GET'
  const rawHeaders = normalizeHeaders(event?.headers || {})
  req.headers = rawHeaders

  const queryParameters = event?.queryParameters || {}
  // FC maps queryParameters to object<string, string>. Keep values as string.
  req.query = { ...(queryParameters || {}) }

  // For routes like /api/org/:action, current handler reads req.query.action.
  if (matched?.route?.paramKeys?.length) {
    for (const key of matched.route.paramKeys) {
      if (params?.[key] != null) req.query[key] = params[key]
    }
  } else {
    Object.assign(req.query, params || {})
  }

  // Keep the raw text body for JSON helpers (parseJson in your APIs reads req.body).
  const bodyText = bodyBuffer.length ? bodyBuffer.toString('utf8') : ''
  req.body = bodyText

  let resolveResponse
  const responsePromise = new Promise((resolve) => {
    resolveResponse = resolve
  })

  const res = {
    status(code) {
      resState.statusCode = Number(code) || 200
      return res
    },
    setHeader(name, value) {
      if (!name) return
      resState.headers[String(name)] = String(value)
    },
    json(obj) {
      resState.body = obj
      // Default content-type for JSON.
      if (!resState.headers['Content-Type']) resState.headers['Content-Type'] = 'application/json'
      resolveResponse()
      return res
    },
    // Some handlers might return strings/others; keep this for robustness.
    send(content) {
      resState.body = content
      if (!resState.headers['Content-Type'] && typeof content === 'string') {
        resState.headers['Content-Type'] = 'text/plain; charset=utf-8'
      }
      resolveResponse()
      return res
    },
  }

  // Stream body chunks for webhook handlers (they call req.on('data') / 'end').
  function startStreaming() {
    if (!bodyBuffer?.length) {
      setImmediate(() => req.emit('end'))
      return
    }
    const chunkSize = 16 * 1024
    let offset = 0
    const next = () => {
      if (offset >= bodyBuffer.length) {
        req.emit('end')
        return
      }
      const chunk = bodyBuffer.slice(offset, offset + chunkSize)
      offset += chunk.length
      req.emit('data', chunk)
      setImmediate(next)
    }
    setImmediate(next)
  }

  return { req, res, resState, responsePromise, startStreaming }
}

async function importHandler(modulePath) {
  if (moduleCache.has(modulePath)) return moduleCache.get(modulePath)
  const abs = new URL(modulePath, import.meta.url)
  const mod = await import(abs.href)
  moduleCache.set(modulePath, mod)
  return mod
}

export const handler = async (event, context) => {
  const eventObj = parseEvent(event)
  const manifest = await loadManifest()

  const requestPath =
    eventObj?.requestContext?.http?.path ||
    eventObj?.rawPath ||
    ''

  const matched = matchRoute(manifest, requestPath)
  if (!matched?.route?.modulePath) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ROUTE_NOT_FOUND', error: 'API 路由不存在' }),
      isBase64Encoded: false,
    }
  }

  const bodyBuffer = makeBodyBuffer(eventObj)

  const { req, res, resState, responsePromise, startStreaming } = createReqRes({
    event: eventObj,
    matched,
    params: matched.params,
    bodyBuffer,
  })

  startStreaming()

  try {
    const mod = await importHandler(matched.route.modulePath)
    const fn = mod?.default || mod?.handler || mod
    if (typeof fn !== 'function') {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'HANDLER_NOT_FOUND', error: '未找到 handler 函数导出' }),
        isBase64Encoded: false,
      }
    }

    await fn(req, res)

    // If handler didn't call res.json/res.send, fall back to empty JSON.
    // (Your Vercel-style APIs always use res.status().json().)
    await Promise.race([
      responsePromise,
      new Promise((resolve) => setTimeout(resolve, 50)),
    ])

    const body = resState.body
    const bodyStr =
      body == null
        ? ''
        : typeof body === 'string'
          ? body
          : JSON.stringify(body)

    return {
      statusCode: resState.statusCode,
      headers: resState.headers,
      body: bodyStr,
      isBase64Encoded: false,
    }
  } catch (e) {
    const message = e?.message || 'Internal Server Error'
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FC_BACKEND_ENTRY_FAILED', error: message }),
      isBase64Encoded: false,
    }
  }
}

