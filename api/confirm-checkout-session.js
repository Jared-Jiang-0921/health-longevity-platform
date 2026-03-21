/**
 * 支付成功页备用：用 Stripe Checkout Session ID 拉取会话并更新会员
 * 与 Webhook 共用 applyMembershipFromPlan；Webhook 失败或延迟时由本接口兜底
 * POST /api/confirm-checkout-session  body: { session_id }
 */
import Stripe from 'stripe'
import { verifyToken, getUserById } from '../lib/auth.js'
import { applyMembershipFromPlan } from '../lib/membershipCheckout.js'
import { PLANS } from '../lib/plans.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = req.headers.authorization
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    const userIdFromJwt = await verifyToken(token)
    if (!userIdFromJwt) {
      return res.status(401).json({ error: '请先登录' })
    }

    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }

    const sessionId = body.session_id
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: '缺少 session_id' })
    }

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      return res.status(500).json({ error: '缺少 STRIPE_SECRET_KEY' })
    }

    const stripe = new Stripe(secret)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: '支付未完成' })
    }

    const refId = session.client_reference_id || session.metadata?.user_id
    const plan = (session.metadata?.plan || 'standard_monthly').trim()

    if (!refId || String(refId) !== String(userIdFromJwt)) {
      return res.status(403).json({ error: '该订单不属于当前登录账号' })
    }

    if (!PLANS[plan]) {
      return res.status(400).json({ error: '无效套餐' })
    }

    const { applied } = await applyMembershipFromPlan(userIdFromJwt, plan)
    if (!applied) {
      return res.status(500).json({ error: '会员写入失败' })
    }

    const user = await getUserById(userIdFromJwt)
    return res.status(200).json({ ok: true, user })
  } catch (e) {
    console.error('confirm-checkout-session', e)
    return res.status(500).json({ error: e.message || '确认失败' })
  }
}
