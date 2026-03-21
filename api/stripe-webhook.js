/**
 * Stripe Webhook：POST /api/stripe-webhook
 * 监听 checkout.session.completed，支付成功后更新用户会员等级
 * 需在 Stripe Dashboard 配置 Webhook 端点，并设置 STRIPE_WEBHOOK_SECRET
 */
import Stripe from 'stripe'
import { sql } from '../lib/db.js'
import { getExpiresAt } from '../lib/plans.js'

export const config = {
  api: { bodyParser: false },
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !webhookSecret) {
    return res.status(500).json({ error: 'Missing Stripe config' })
  }

  const rawBody = await getRawBody(req)
  let event
  try {
    const sig = req.headers['stripe-signature']
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (e) {
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.client_reference_id || session.metadata?.user_id
    const plan = session.metadata?.plan || 'standard_monthly'

    const { PLANS } = await import('../lib/plans.js')
    const planConfig = PLANS[plan]
    if (!userId || !planConfig) {
      return res.status(200).json({ received: true })
    }

    const months = planConfig.months
    const expiresAt = getExpiresAt(months)

    try {
      await sql`
        UPDATE users
        SET level = ${planConfig.level}, expires_at = ${expiresAt}, updated_at = NOW()
        WHERE id = ${userId}
      `
    } catch (e) {
      console.error('Webhook update user failed:', e)
      return res.status(500).json({ error: 'Database update failed' })
    }
  }

  return res.status(200).json({ received: true })
}
