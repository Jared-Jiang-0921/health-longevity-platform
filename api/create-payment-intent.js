/**
 * Vercel Serverless：POST /api/create-payment-intent
 * 需在 Vercel 环境变量中配置 STRIPE_SECRET_KEY（sk_test_ 或 sk_live_）
 */
import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return res.status(500).json({ error: 'Server missing STRIPE_SECRET_KEY' })
  }

  let body = {}
  try {
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body || '{}')
    } else if (req.body && typeof req.body === 'object') {
      body = req.body
    }
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const stripe = new Stripe(secret)
  try {
    const amount = body.amount ?? 1999
    const currency = String(body.currency || 'usd').toLowerCase()
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    })
    return res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Stripe error' })
  }
}
