/**
 * Stripe Webhook：POST /api/stripe-webhook
 * 监听 checkout.session.completed，支付成功后更新用户会员等级
 * 需在 Stripe Dashboard 配置 Webhook 端点，并设置 STRIPE_WEBHOOK_SECRET
 */
import Stripe from 'stripe'
import { applyMembershipFromPlan } from '../lib/membershipCheckout.js'
import { PLANS } from '../lib/plans.js'
import { claimSessionPaid, upsertPaymentLog } from '../lib/paymentOps.js'

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
  const fail = (status, code, error) => res.status(status).json({ code, error })
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }

  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !webhookSecret) {
    return fail(500, 'PAYMENT_CONFIG_MISSING', '支付配置缺失，请联系管理员')
  }

  const rawBody = await getRawBody(req)
  let event
  try {
    const sig = req.headers['stripe-signature']
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (e) {
    return fail(400, 'WEBHOOK_SIGNATURE_INVALID', 'Webhook 验签失败')
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const sessionId = session.id
    const userId = session.client_reference_id || session.metadata?.user_id
    const plan = (session.metadata?.plan || 'standard_monthly').trim()
    const currency = String(session.currency || '').toLowerCase()

    if (!userId || !PLANS[plan]) {
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: event.id,
        source: 'stripe_webhook',
        userId: userId ? String(userId) : null,
        sessionId,
        plan,
        currency,
        status: 'ignored_invalid_payload',
        errorCode: 'INVALID_WEBHOOK_PAYLOAD',
      })
      return res.status(200).json({ received: true })
    }

    try {
      const claim = await claimSessionPaid('stripe', sessionId, 'stripe_webhook', {
        userId: String(userId),
        plan,
        currency,
      })
      if (!claim.claimed) {
        await upsertPaymentLog({
          provider: 'stripe',
          eventKey: event.id,
          source: 'stripe_webhook',
          userId: String(userId),
          sessionId,
          plan,
          currency,
          status: 'idempotent_skip',
        })
        return res.status(200).json({ received: true, idempotent: true })
      }

      await applyMembershipFromPlan(userId, plan)
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: claim.eventKey,
        source: 'stripe_webhook',
        userId: String(userId),
        sessionId,
        plan,
        currency,
        status: 'membership_applied',
      })
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: event.id,
        source: 'stripe_webhook',
        userId: String(userId),
        sessionId,
        plan,
        currency,
        status: 'event_processed',
      })
    } catch (e) {
      console.error('Webhook update user failed:', e)
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: event.id,
        source: 'stripe_webhook',
        userId: userId ? String(userId) : null,
        sessionId,
        plan,
        currency,
        status: 'membership_apply_failed',
        errorCode: 'MEMBERSHIP_APPLY_FAILED',
        errorMessage: String(e?.message || ''),
      })
      return fail(500, 'MEMBERSHIP_APPLY_FAILED', '会员更新失败，请稍后重试')
    }
  }

  return res.status(200).json({ received: true })
}
