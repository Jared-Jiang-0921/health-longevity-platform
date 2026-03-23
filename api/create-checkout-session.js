/**
 * POST /api/create-checkout-session
 * 需登录，带上 plan（standard_monthly | standard_yearly | premium_monthly | premium_yearly）
 */
import Stripe from 'stripe'
import { randomUUID } from 'node:crypto'
import { verifyToken } from '../lib/auth.js'
import { PLANS } from '../lib/plans.js'
import { upsertPaymentLog } from '../lib/paymentOps.js'

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
  const fail = (status, code, error) => res.status(status).json({ code, error })
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return fail(401, 'AUTH_REQUIRED', '请先登录')
  }

  const userId = await verifyToken(token)
  if (!userId) {
    return fail(401, 'AUTH_EXPIRED', '登录已过期')
  }

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return fail(500, 'PAYMENT_CONFIG_MISSING', '支付配置缺失，请联系管理员')
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return fail(400, 'INVALID_JSON', '请求数据格式不正确')
  }

  const plan = body.plan || 'standard_monthly'
  const planConfig = PLANS[plan]
  if (!planConfig) {
    return fail(400, 'INVALID_PLAN', '无效的套餐')
  }

  const origin = body.origin || req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || ''
  if (!origin || !origin.startsWith('http')) {
    return fail(400, 'INVALID_ORIGIN', '请求来源地址无效')
  }

  const stripe = new Stripe(secret)
  try {
    const requestEventKey = `checkout_create:${randomUUID()}`
    const defaultCurrency = resolveCurrency()
    const allowedCurrencies = resolveAllowedCurrencies(defaultCurrency)
    const requestedCurrency = String(body.currency || '').toLowerCase().trim()
    const currency = allowedCurrencies.includes(requestedCurrency) ? requestedCurrency : defaultCurrency
    await upsertPaymentLog({
      provider: 'stripe',
      eventKey: requestEventKey,
      source: 'create_checkout',
      userId: String(userId),
      plan,
      currency,
      status: 'requested',
    })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: userId,
      metadata: { plan, user_id: userId },
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: planConfig.name,
            description: `${planConfig.months} 个月`,
          },
          unit_amount: planConfig.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment`,
    })
    await upsertPaymentLog({
      provider: 'stripe',
      eventKey: requestEventKey,
      source: 'create_checkout',
      userId: String(userId),
      sessionId: session.id,
      plan,
      currency,
      status: 'session_created',
    })
    return res.status(200).json({ url: session.url })
  } catch (e) {
    console.error('create-checkout-session', e)
    return fail(500, 'PAYMENT_PROVIDER_ERROR', '支付通道暂时不可用，请稍后重试')
  }
}
