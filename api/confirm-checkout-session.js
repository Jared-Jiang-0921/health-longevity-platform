/**
 * 支付成功页备用：用 Stripe Checkout Session ID 拉取会话并更新会员
 * 与 Webhook 共用 applyMembershipFromPlan；Webhook 失败或延迟时由本接口兜底
 * POST /api/confirm-checkout-session  body: { session_id }
 */
import Stripe from 'stripe'
import { verifyToken, getUserById } from '../lib/auth.js'
import { applyMembershipFromPlan } from '../lib/membershipCheckout.js'
import { PLANS } from '../lib/plans.js'
import { claimSessionPaid, upsertPaymentLog } from '../lib/paymentOps.js'

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
    }

    const auth = req.headers.authorization
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    const userIdFromJwt = await verifyToken(token)
    if (!userIdFromJwt) {
      return fail(401, 'AUTH_REQUIRED', '请先登录')
    }

    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    } catch {
      return fail(400, 'INVALID_JSON', '请求数据格式不正确')
    }

    const sessionId = body.session_id
    if (!sessionId || typeof sessionId !== 'string') {
      return fail(400, 'MISSING_SESSION_ID', '缺少 session_id')
    }

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      return fail(500, 'PAYMENT_CONFIG_MISSING', '支付配置缺失，请联系管理员')
    }

    const stripe = new Stripe(secret)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const currency = String(session.currency || '').toLowerCase()

    if (session.payment_status !== 'paid') {
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: `checkout_session_paid:${sessionId}`,
        source: 'confirm_checkout',
        userId: String(userIdFromJwt),
        sessionId,
        status: 'payment_not_completed',
      })
      return fail(400, 'PAYMENT_NOT_COMPLETED', '支付尚未完成')
    }

    const refId = session.client_reference_id || session.metadata?.user_id
    const plan = (session.metadata?.plan || 'standard_monthly').trim()

    if (!refId || String(refId) !== String(userIdFromJwt)) {
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: `checkout_session_paid:${sessionId}`,
        source: 'confirm_checkout',
        userId: String(userIdFromJwt),
        sessionId,
        plan,
        currency,
        status: 'forbidden_user_mismatch',
        errorCode: 'SESSION_USER_MISMATCH',
      })
      return fail(403, 'SESSION_USER_MISMATCH', '该订单不属于当前登录账号')
    }

    if (!PLANS[plan]) {
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: `checkout_session_paid:${sessionId}`,
        source: 'confirm_checkout',
        userId: String(userIdFromJwt),
        sessionId,
        plan,
        currency,
        status: 'invalid_plan',
        errorCode: 'INVALID_PLAN',
      })
      return fail(400, 'INVALID_PLAN', '无效套餐')
    }

    const claim = await claimSessionPaid('stripe', sessionId, 'confirm_checkout', {
      userId: String(userIdFromJwt),
      plan,
      currency,
    })
    if (!claim.claimed) {
      const user = await getUserById(userIdFromJwt)
      return res.status(200).json({ ok: true, idempotent: true, user })
    }

    const { applied } = await applyMembershipFromPlan(userIdFromJwt, plan)
    if (!applied) {
      await upsertPaymentLog({
        provider: 'stripe',
        eventKey: claim.eventKey,
        source: 'confirm_checkout',
        userId: String(userIdFromJwt),
        sessionId,
        plan,
        currency,
        status: 'membership_apply_failed',
        errorCode: 'MEMBERSHIP_APPLY_FAILED',
      })
      return fail(500, 'MEMBERSHIP_APPLY_FAILED', '会员更新失败，请稍后重试')
    }

    await upsertPaymentLog({
      provider: 'stripe',
      eventKey: claim.eventKey,
      source: 'confirm_checkout',
      userId: String(userIdFromJwt),
      sessionId,
      plan,
      currency,
      status: 'membership_applied',
    })

    const user = await getUserById(userIdFromJwt)
    return res.status(200).json({ ok: true, user })
  } catch (e) {
    console.error('confirm-checkout-session', e)
    return fail(500, 'CONFIRM_CHECKOUT_FAILED', '确认支付失败，请稍后重试')
  }
}
