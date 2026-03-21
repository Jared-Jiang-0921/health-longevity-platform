/**
 * Vercel Serverless：POST /api/create-checkout-session
 * Stripe Checkout 重定向模式（跳转到 checkout.stripe.com），比嵌入 Payment Element 更稳定
 * 需配置 STRIPE_SECRET_KEY
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

  const amount = body.amount ?? 1999
  const currency = String(body.currency || 'usd').toLowerCase()
  const origin = body.origin || req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || ''

  if (!origin || !origin.startsWith('http')) {
    return res.status(400).json({ error: 'Missing valid origin' })
  }

  const stripe = new Stripe(secret)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: '健康长寿平台消费',
            description: '示例：19.99 USD',
          },
          unit_amount: amount,
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
