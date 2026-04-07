/**
 * 合并 Airwallex 占位路由，减少 Vercel Serverless Functions 数量。
 * 覆盖：/api/airwallex/webhook、/api/airwallex/create-checkout-session
 */
import createCheckoutSession from '../../lib/api-handlers/airwallex/create-checkout-session.js'
import webhook from '../../lib/api-handlers/airwallex/webhook.js'

const ROUTES = {
  webhook,
  'create-checkout-session': createCheckoutSession,
}

function resolvePath(req) {
  const q = req.query?.path
  if (Array.isArray(q)) return q.filter(Boolean).join('/')
  if (typeof q === 'string' && q.trim()) return q.trim()
  try {
    const u = new URL(req.url || '/', 'http://localhost')
    return u.pathname.replace(/^\/api\/airwallex\/?/i, '').replace(/\/$/, '') || ''
  } catch {
    return ''
  }
}

export default async function handler(req, res) {
  const p = resolvePath(req)
  const key = String(p)
    .split('/')
    .filter(Boolean)[0]
    ?.toLowerCase()
    .trim()
  const fn = key ? ROUTES[key] : null
  if (!fn) {
    return res.status(404).json({ error: 'Not found' })
  }
  return fn(req, res)
}
