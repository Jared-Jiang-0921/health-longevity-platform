/**
 * POST /api/create-checkout-session
 * 需登录，带上 plan（standard_monthly | standard_yearly | premium_monthly | premium_yearly）
 */
import Stripe from 'stripe'
import { verifyToken } from '../lib/auth.js'
import { PLANS } from '../lib/plans.js'

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

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return res.status(500).json({ error: 'Server missing STRIPE_SECRET_KEY' })
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const plan = body.plan || 'standard_monthly'
  const planConfig = PLANS[plan]
  if (!planConfig) {
    return res.status(400).json({ error: '无效的套餐' })
  }

  const origin = body.origin || req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || ''
  if (!origin || !origin.startsWith('http')) {
    return res.status(400).json({ error: 'Missing valid origin' })
  }

  const stripe = new Stripe(secret)
  try {
    const defaultCurrency = resolveCurrency()
    const allowedCurrencies = resolveAllowedCurrencies(defaultCurrency)
    const requestedCurrency = String(body.currency || '').toLowerCase().trim()
    const currency = allowedCurrencies.includes(requestedCurrency) ? requestedCurrency : defaultCurrency
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

    return res.status(200).json({ url: session.url })
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Stripe error' })
  }
}
