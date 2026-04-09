import { applyMembershipFromPlan } from '../../membershipCheckout.js'
import { PLANS } from '../../plans.js'
import { claimSessionPaid, upsertPaymentLog } from '../../paymentOps.js'
import { verifyAirwallexWebhookSignature } from '../../airwallex.js'

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function normalizeStatus(eventType, objectStatus) {
  const s = `${eventType || ''}|${objectStatus || ''}`.toLowerCase()
  return (
    s.includes('succeeded') ||
    s.includes('success') ||
    s.includes('paid') ||
    s.includes('captured')
  )
}

function extractData(payload) {
  const root = payload || {}
  const eventType = root.name || root.type || ''
  const obj = root.data?.object || root.data || {}
  const metadata = obj.metadata || obj.merchant_metadata || {}
  const userId = metadata.user_id || metadata.userId || obj.customer_id || obj.client_reference_id || null
  const plan = String(metadata.plan || metadata.plan_key || '').trim()
  const sessionId = String(
    obj.id ||
    obj.payment_intent_id ||
    obj.payment_link_id ||
    root.id ||
    '',
  ).trim()
  const currency = String(obj.currency || metadata.currency || '').toLowerCase().trim()
  const objectStatus = String(obj.status || obj.payment_status || '').trim()
  return { eventType, objectStatus, userId, plan, sessionId, currency, obj }
}

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(405, 'METHOD_NOT_ALLOWED', 'Method not allowed')
  }

  const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET?.trim()
  if (!webhookSecret) {
    return fail(500, 'PAYMENT_CONFIG_MISSING', 'AIRWALLEX_WEBHOOK_SECRET is missing')
  }

  const rawBody = await getRawBody(req)
  const ok = verifyAirwallexWebhookSignature(rawBody, req.headers || {}, webhookSecret)
  if (!ok) {
    return fail(400, 'WEBHOOK_SIGNATURE_INVALID', 'Webhook signature invalid')
  }

  let payload = {}
  try {
    payload = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    return fail(400, 'INVALID_JSON', 'Invalid JSON')
  }

  const eventId = String(payload.id || '').trim() || `airwallex_event:${Date.now()}`
  const { eventType, objectStatus, userId, plan, sessionId, currency } = extractData(payload)

  if (!normalizeStatus(eventType, objectStatus)) {
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey: eventId,
      source: 'airwallex_webhook',
      userId: userId ? String(userId) : null,
      sessionId,
      plan,
      currency,
      status: 'ignored_non_success_event',
      errorCode: 'NON_SUCCESS_EVENT',
    })
    return res.status(200).json({ received: true, ignored: true })
  }

  if (!userId || !PLANS[plan]) {
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey: eventId,
      source: 'airwallex_webhook',
      userId: userId ? String(userId) : null,
      sessionId,
      plan,
      currency,
      status: 'ignored_invalid_payload',
      errorCode: 'INVALID_WEBHOOK_PAYLOAD',
    })
    return res.status(200).json({ received: true, ignored: true })
  }

  const claim = await claimSessionPaid('airwallex', sessionId || eventId, 'airwallex_webhook', {
    userId: String(userId),
    plan,
    currency,
  })
  if (!claim.claimed) {
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey: eventId,
      source: 'airwallex_webhook',
      userId: String(userId),
      sessionId,
      plan,
      currency,
      status: 'idempotent_skip',
    })
    return res.status(200).json({ received: true, idempotent: true })
  }

  try {
    const { applied } = await applyMembershipFromPlan(String(userId), plan)
    if (!applied) {
      await upsertPaymentLog({
        provider: 'airwallex',
        eventKey: claim.eventKey,
        source: 'airwallex_webhook',
        userId: String(userId),
        sessionId,
        plan,
        currency,
        status: 'membership_apply_failed',
        errorCode: 'MEMBERSHIP_APPLY_FAILED',
      })
      return fail(500, 'MEMBERSHIP_APPLY_FAILED', '会员更新失败，请稍后重试')
    }

    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey: claim.eventKey,
      source: 'airwallex_webhook',
      userId: String(userId),
      sessionId,
      plan,
      currency,
      status: 'membership_applied',
    })
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey: eventId,
      source: 'airwallex_webhook',
      userId: String(userId),
      sessionId,
      plan,
      currency,
      status: 'event_processed',
    })
    return res.status(200).json({ received: true })
  } catch (e) {
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey: eventId,
      source: 'airwallex_webhook',
      userId: String(userId),
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
