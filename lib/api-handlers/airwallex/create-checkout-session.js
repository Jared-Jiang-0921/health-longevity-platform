/**
 * Airwallex 占位路由：POST /api/airwallex/create-checkout-session
 * 当前阶段仅提供可切换骨架；后续接入空中云汇 SDK / API 后替换 TODO 分支。
 */
import { verifyToken } from '../../auth.js'
import { PLANS } from '../../plans.js'

function resolveCurrency() {
  const raw = process.env.PAYMENT_CURRENCY || process.env.VITE_PAYMENT_CURRENCY || 'usd'
  return String(raw).toLowerCase().trim()
}

function resolveAllowedCurrencies(defaultCurrency) {
  const raw = process.env.PAYMENT_CURRENCY_OPTIONS || process.env.VITE_PAYMENT_CURRENCY_OPTIONS || defaultCurrency
  return String(raw)
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter((v, i, arr) => /^[a-z]{3}$/.test(v) && arr.indexOf(v) === i)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: '请先登录' })
  }

  const userId = await verifyToken(token)
  if (!userId) {
    return res.status(401).json({ error: '登录已过期' })
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const plan = body.plan || 'standard_monthly'
  if (!PLANS[plan]) {
    return res.status(400).json({ error: '无效的套餐' })
  }
  const defaultCurrency = resolveCurrency()
  const allowedCurrencies = resolveAllowedCurrencies(defaultCurrency)
  const requestedCurrency = String(body.currency || '').toLowerCase().trim()
  const currency = allowedCurrencies.includes(requestedCurrency) ? requestedCurrency : defaultCurrency

  const origin = body.origin || req.headers.origin || ''
  if (!origin || !origin.startsWith('http')) {
    return res.status(400).json({ error: 'Missing valid origin' })
  }

  // TODO: 接入 Airwallex Hosted Payment Page / Payment Links 后返回真实跳转地址。
  const mockRedirect = process.env.AIRWALLEX_MOCK_REDIRECT_URL?.trim()
  if (mockRedirect) {
    const qs = new URLSearchParams({
      provider: 'airwallex',
      plan,
      user_id: String(userId),
      currency,
    })
    const sep = mockRedirect.includes('?') ? '&' : '?'
    return res.status(200).json({ url: `${mockRedirect}${sep}${qs.toString()}` })
  }

  return res.status(501).json({
    error: 'Airwallex checkout route is scaffolded but not implemented yet',
    provider: 'airwallex',
  })
}
