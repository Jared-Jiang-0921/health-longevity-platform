import { sql } from './db.js'
import { PLANS, getExpiresAt } from './plans.js'

/**
 * 支付成功后写入会员等级与到期时间。
 * Stripe Webhook 与 confirm-checkout-session 共用，避免两处 UPDATE 逻辑不一致。
 */
export async function applyMembershipFromPlan(userId, planKey) {
  const key = typeof planKey === 'string' ? planKey.trim() : planKey
  const planConfig = PLANS[key]
  if (!userId || !planConfig) {
    return { applied: false }
  }
  const expiresAt = getExpiresAt(planConfig.months)
  await sql`
    UPDATE users
    SET level = ${planConfig.level}, expires_at = ${expiresAt}, updated_at = NOW()
    WHERE id = ${userId}
  `
  return { applied: true }
}
