import http from 'node:http'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import {
  buildApiRouteTable,
  matchApiRoute,
  routeFromApiFile,
} from '../lib/apiRouteTable.js'

// 相对本文件定位项目根（避免 pm2 / systemd 下 cwd 不是仓库目录时读不到 .env.prod）
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envProdPath = path.join(projectRoot, '.env.prod')
if (fsSync.existsSync(envProdPath)) {
  // override: true — pm2 / shell 里若已有同名空变量，dotenv 默认不会覆盖，会导致 STRIPE_SECRET_KEY 仍为假值
  loadEnv({ path: envProdPath, override: true })
}

const _stripeSk = String(process.env.STRIPE_SECRET_KEY || '').trim()
console.log(
  `[api-server] env loaded from ${envProdPath}; STRIPE_SECRET_KEY ${ _stripeSk ? `ok (len=${_stripeSk.length})` : 'MISSING' }`,
)

function toStringBody(buf) {
  if (!buf || !buf.length) return ''
  return buf.toString('utf8')
}

function parseQuery(reqUrl) {
  const u = new URL(reqUrl, 'http://localhost')
  const out = {}
  for (const [k, v] of u.searchParams.entries()) {
    out[k] = v
  }
  return out
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
    if (Buffer.isBuffer(content)) {
      res.end(content)
      return res
    }
    if (content instanceof Uint8Array) {
      res.end(Buffer.from(content))
      return res
    }
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
/** JSON 上传含 base64 时约为原文件的 4/3；与 Nginx client_max_body_size 对齐 */
const MAX_API_BODY_BYTES = Number(process.env.MAX_API_BODY_BYTES || 150 * 1024 * 1024)

// 与上方 projectRoot / .env 一致：勿依赖 process.cwd()（pm2、systemd 下 cwd 常非仓库根目录）
const apiDirAbs = path.join(projectRoot, 'api')
const routeTable = await buildApiRouteTable(apiDirAbs)

/** 个别环境下 walk 未收录关键路由时兜底注册（避免 /api 列表不全导致 ROUTE_NOT_FOUND） */
;(function ensureApiRouteFromFile(relFromApi /* 相对 api/，如 product-catalog.js */) {
  const absFile = path.normalize(path.join(apiDirAbs, relFromApi))
  if (!fsSync.existsSync(absFile) || !fsSync.statSync(absFile).isFile()) return
  const relNative = path.relative(apiDirAbs, absFile)
  const { segments, paramKeys, catchAll } = routeFromApiFile(relNative)
  const dup = routeTable.some(
    (r) =>
      r.catchAll === catchAll &&
      r.segments.length === segments.length &&
      r.segments.every((s, i) => s === segments[i]),
  )
  if (dup) return
  routeTable.push({ segments, paramKeys, catchAll, absFile })
  console.warn(`[api-server] ensured route /api/${segments.join('/')} (${relFromApi})`)
})('product-catalog.js')
;(function ensureApiRouteFromFile(relFromApi) {
  const absFile = path.normalize(path.join(apiDirAbs, relFromApi))
  if (!fsSync.existsSync(absFile) || !fsSync.statSync(absFile).isFile()) return
  const relNative = path.relative(apiDirAbs, absFile)
  const { segments, paramKeys, catchAll } = routeFromApiFile(relNative)
  const dup = routeTable.some(
    (r) =>
      r.catchAll === catchAll &&
      r.segments.length === segments.length &&
      r.segments.every((s, i) => s === segments[i]),
  )
  if (dup) return
  routeTable.push({ segments, paramKeys, catchAll, absFile })
  console.warn(`[api-server] ensured route /api/${segments.join('/')} (${relFromApi})`)
})('product-evidence.js')

const moduleCache = new Map()

async function importHandler(absFile) {
  let mtimeMs = 0
  try {
    mtimeMs = (await fs.stat(absFile)).mtimeMs
  } catch {
    /* use 0 */
  }
  const cacheKey = `${absFile}:${mtimeMs}`
  if (moduleCache.has(cacheKey)) return moduleCache.get(cacheKey)
  const url = `${pathToFileURL(absFile).href}?mtime=${mtimeMs}`
  const mod = await import(url)
  const fn = mod?.default || mod?.handler || mod
  moduleCache.set(cacheKey, { mod, fn })
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
    const hit = matchApiRoute(routeTable, requestSegments)
    if (hit) {
      matched = hit.route
      params = hit.params
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
        if (buf.length > MAX_API_BODY_BYTES) {
          res.status(413).json({
            error: `请求体超过 ${Math.floor(MAX_API_BODY_BYTES / (1024 * 1024))}MB 限制，请压缩视频后重试`,
          })
          return
        }
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
    console.error('[api-server] unhandled', req.method, req.url, e?.stack || e)
    res.statusCode = 500
    res.end(JSON.stringify({ code: 'API_SERVER_FAILED', error: e?.message || 'Internal Server Error' }))
  }
})

server.on('error', (err) => {
  console.error('[api-server] server.listen error:', err?.code || err?.message, err)
  process.exit(1)
})

server.listen(PORT, () => {
  const serverFile = fileURLToPath(import.meta.url)
  const hasProductCatalog = routeTable.some(
    (r) => !r.catchAll && r.segments.join('/') === 'product-catalog',
  )
  console.log(`[api-server] listening on :${PORT} pid=${process.pid}`)
  console.log(`[api-server] server file: ${serverFile}`)
  console.log(`[api-server] api dir: ${apiDirAbs}`)
  console.log(`[api-server] routes loaded: ${routeTable.length}`)
  console.log(`[api-server] route /api/product-catalog: ${hasProductCatalog ? 'ok' : 'MISSING'}`)
  const pcHandler = routeTable.find((r) => !r.catchAll && r.segments.join('/') === 'product-catalog')
  if (pcHandler) console.log(`[api-server] product-catalog absFile: ${pcHandler.absFile}`)
})

