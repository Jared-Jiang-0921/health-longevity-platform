/**
 * Vercel 只部署这一个 Serverless Function。
 * Hobby 计划每个 Deployment 最多 12 个函数；原先 api/ 下每个文件都算一个，部署会在构建成功后被拒绝。
 * 具体接口在 lib/http-api。ECS 和函数计算改为扫描这个目录，对外 URL 不变。
 */
import { matchApiRoute, routeFromApiFile } from '../lib/apiRouteTable.js'

const FILES = [
  "admin-health-questionnaires.js",
  "admin-users.js",
  "aging-assessments.js",
  "auth/[...path].js",
  "confirm-checkout-session.js",
  "consult-sso-ticket.js",
  "course-modules.js",
  "create-checkout-session.js",
  "create-payment-intent.js",
  "health-questionnaire.js",
  "health.js",
  "init-db.js",
  "module-assets.js",
  "module-assets/[id].js",
  "org/[action].js",
  "payment-event-logs.js",
  "product-catalog.js",
  "product-catalog/[id].js",
  "product-evidence.js",
  "risk-assessments.js",
  "stripe-webhook.js",
  "tcm-constitution-tongue.js",
  "tcm-constitution.js",
  "translation-pdfs.js",
  "translation-pdfs/[id].js",
]

const LOADERS = {
  "admin-health-questionnaires.js": () => import("../lib/http-api/admin-health-questionnaires.js"),
  "admin-users.js": () => import("../lib/http-api/admin-users.js"),
  "aging-assessments.js": () => import("../lib/http-api/aging-assessments.js"),
  "auth/[...path].js": () => import("../lib/http-api/auth/[...path].js"),
  "confirm-checkout-session.js": () => import("../lib/http-api/confirm-checkout-session.js"),
  "consult-sso-ticket.js": () => import("../lib/http-api/consult-sso-ticket.js"),
  "course-modules.js": () => import("../lib/http-api/course-modules.js"),
  "create-checkout-session.js": () => import("../lib/http-api/create-checkout-session.js"),
  "create-payment-intent.js": () => import("../lib/http-api/create-payment-intent.js"),
  "health-questionnaire.js": () => import("../lib/http-api/health-questionnaire.js"),
  "health.js": () => import("../lib/http-api/health.js"),
  "init-db.js": () => import("../lib/http-api/init-db.js"),
  "module-assets.js": () => import("../lib/http-api/module-assets.js"),
  "module-assets/[id].js": () => import("../lib/http-api/module-assets/[id].js"),
  "org/[action].js": () => import("../lib/http-api/org/[action].js"),
  "payment-event-logs.js": () => import("../lib/http-api/payment-event-logs.js"),
  "product-catalog.js": () => import("../lib/http-api/product-catalog.js"),
  "product-catalog/[id].js": () => import("../lib/http-api/product-catalog/[id].js"),
  "product-evidence.js": () => import("../lib/http-api/product-evidence.js"),
  "risk-assessments.js": () => import("../lib/http-api/risk-assessments.js"),
  "stripe-webhook.js": () => import("../lib/http-api/stripe-webhook.js"),
  "tcm-constitution-tongue.js": () => import("../lib/http-api/tcm-constitution-tongue.js"),
  "tcm-constitution.js": () => import("../lib/http-api/tcm-constitution.js"),
  "translation-pdfs.js": () => import("../lib/http-api/translation-pdfs.js"),
  "translation-pdfs/[id].js": () => import("../lib/http-api/translation-pdfs/[id].js"),
}

const routes = FILES.map((rel) => ({ rel, ...routeFromApiFile(rel) }))

function requestSegments(req) {
  const raw = req.url || '/'
  let pathname = raw
  try {
    pathname = new URL(raw, 'http://localhost').pathname
  } catch {
    pathname = String(raw).split('?')[0]
  }
  const segs = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  if (segs[0] === 'api') segs.shift()
  return segs
}

export default async function handler(req, res) {
  const hit = matchApiRoute(routes, requestSegments(req))
  if (!hit) {
    res.statusCode = 404
    if (typeof res.json === 'function') return res.json({ code: 'ROUTE_NOT_FOUND', error: 'API 路由不存在' })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ code: 'ROUTE_NOT_FOUND', error: 'API 路由不存在' }))
    return
  }
  req.query = { ...(req.query || {}) }
  delete req.query.path
  for (const [key, value] of Object.entries(hit.params || {})) req.query[key] = value
  const load = LOADERS[hit.route.rel]
  const mod = await load()
  const fn = mod?.default || mod?.handler
  if (typeof fn !== 'function') {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ code: 'HANDLER_NOT_FOUND', error: '未找到 handler 函数导出' }))
    return
  }
  return fn(req, res)
}
