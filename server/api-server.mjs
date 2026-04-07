import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

function toStringBody(buf) {
  if (!buf || !buf.length) return ''
  return buf.toString('utf8')
}

function parseQuery(reqUrl) {
  const u = new URL(reqUrl, 'http://localhost')
  const out = {}
  for (const [k, v] of u.searchParams.entries()) {
    // 这里按你现有代码习惯：取单值；同名多值场景不做复杂合并
    out[k] = v
  }
  return out
}

function matchSegments(patternSegs, requestSegs) {
  if (patternSegs.length !== requestSegs.length) return null
  const params = {}
  for (let i = 0; i < patternSegs.length; i += 1) {
    const ps = patternSegs[i]
    const rs = requestSegs[i]
    if (ps.startsWith(':')) {
      params[ps.slice(1)] = rs
    } else if (ps !== rs) {
      return null
    }
  }
  return params
}

/** 匹配末尾为 :param 的 catch-all（如 api/auth/[...path].js → ['auth', ':path']） */
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

function routeFromApiFile(relApiPath) {
  // relApiPath: org/[action].js 或 auth/[...path].js
  const noExt = relApiPath.replace(/\.js$/, '')
  const parts = noExt.split(path.sep).filter(Boolean)
  let catchAll = false
  const segments = parts.map((p) => {
    const restM = p.match(/^\[\.\.\.(.+)\]$/)
    if (restM) {
      catchAll = true
      return `:${restM[1]}`
    }
    const m = p.match(/^\[(.+)\]$/)
    return m ? `:${m[1]}` : p
  })

  const paramKeys = segments.filter((s) => s.startsWith(':')).map((s) => s.slice(1))

  return { segments, paramKeys, catchAll }
}

async function walkJsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...(await walkJsFiles(full)))
    else if (ent.isFile() && ent.name.endsWith('.js')) out.push(full)
  }
  return out
}

async function buildRouteTable(apiDirAbs) {
  const apiDirAbsNorm = apiDirAbs
  const files = await walkJsFiles(apiDirAbsNorm)

  const routes = []
  for (const absFile of files) {
    const rel = path.relative(apiDirAbsNorm, absFile)
    const { segments, paramKeys, catchAll } = routeFromApiFile(rel)
    // 请求路径：/api/<segments...>
    // 所以 pattern segments 不含 api 前缀
    routes.push({
      segments,
      paramKeys,
      catchAll,
      absFile,
    })
  }

  return routes
}

function augmentRes(res) {
  res.status = (code) => {
    res.statusCode = Number(code) || 200
    return res
  }
  res.setHeader('Content-Type', res.getHeader('Content-Type') || 'application/json')
  res.json = (obj) => {
    if (res.writableEnded) return res
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(obj ?? {}))
    return res
  }
  res.send = (content) => {
    if (res.writableEnded) return res
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end(typeof content === 'string' ? content : JSON.stringify(content ?? {}))
    return res
  }
  return res
}

async function readBodyBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

const PORT = Number(process.env.PORT || 3000)

const apiDirAbs = path.join(process.cwd(), 'api')
const routeTable = await buildRouteTable(apiDirAbs)

const moduleCache = new Map()

async function importHandler(absFile) {
  if (moduleCache.has(absFile)) return moduleCache.get(absFile)
  const url = pathToFileURL(absFile).href
  const mod = await import(url)
  const fn = mod?.default || mod?.handler || mod
  moduleCache.set(absFile, { mod, fn })
  return { mod, fn }
}

const server = http.createServer(async (req, res) => {
  try {
    // 只处理 /api/*
    const u = new URL(req.url, 'http://localhost')
    const pathname = u.pathname || ''
    if (!pathname.startsWith('/api/')) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const reqSegs = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
    // 去掉开头的 'api'
    const requestSegments = reqSegs.slice(1)

    let matched = null
    let params = null
    for (const r of routeTable) {
      params = r.catchAll
        ? matchCatchAll(r.segments, requestSegments)
        : matchSegments(r.segments, requestSegments)
      if (params) {
        matched = r
        break
      }
    }
    if (!matched) {
      res.statusCode = 404
      res.end(JSON.stringify({ code: 'ROUTE_NOT_FOUND', error: 'API 路由不存在' }))
      return
    }

    // augment res 让你现有 handler 支持 res.status(...).json(...)
    augmentRes(res)

    req.query = parseQuery(req.url)
    if (matched.paramKeys?.length) {
      for (const k of Object.keys(params || {})) req.query[k] = params[k]
    }

    // stripe webhook 必须保留 raw stream，由 handler 自行读取
    const isStripeWebhook = pathname === '/api/stripe-webhook'
    if (!isStripeWebhook) {
      const method = String(req.method || '').toUpperCase()
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const buf = await readBodyBuffer(req)
        // 你现有 parseJson 逻辑：当 req.body 是 string 时再 JSON.parse
        req.body = toStringBody(buf)
      }
    }

    const { fn } = await importHandler(matched.absFile)
    if (typeof fn !== 'function') {
      res.status(500).json({ code: 'HANDLER_NOT_FOUND', error: '未找到 handler 函数导出' })
      return
    }

    await fn(req, res)
  } catch (e) {
    if (res.writableEnded) return
    res.statusCode = 500
    res.end(JSON.stringify({ code: 'API_SERVER_FAILED', error: e?.message || 'Internal Server Error' }))
  }
})

server.listen(PORT, () => {
  console.log(`[api-server] listening on :${PORT}`)
  console.log(`[api-server] routes loaded: ${routeTable.length}`)
})

