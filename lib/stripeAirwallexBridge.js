/**
 * Stripe 收单成功后，可选向「万里汇 / 自建中台」发一条 HTTP 通知，便于对账或与 Airwallex API 二次联动。
 *
 * 资金进入万里汇的主路径仍是：Stripe 余额 → 在 Stripe Dashboard 将「提现银行账户」设为万里汇提供的收款账户。
 * 本模块不替代 Stripe 入账，也不调用万里汇收单 API（收单已由 Stripe Checkout 完成）。
 */

function bridgeEnabled() {
  const v = String(process.env.STRIPE_AIRWALLEX_BRIDGE_ENABLED || '').trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

function notifyUrl() {
  return String(process.env.STRIPE_AIRWALLEX_NOTIFY_URL || '').trim()
}

/**
 * @param {Record<string, any>} session Stripe Checkout Session（已支付）
 * @param {{ source: string }} meta
 * @returns {Promise<{ skipped: boolean, reason?: string, ok?: boolean, error?: string }>}
 */
export async function maybeNotifyAfterStripeCheckoutSuccess(session, meta) {
  if (!bridgeEnabled()) {
    return { skipped: true, reason: 'bridge_disabled' }
  }
  const url = notifyUrl()
  if (!url.startsWith('http')) {
    return { skipped: true, reason: 'missing_or_invalid_url' }
  }

  const secret = String(process.env.STRIPE_AIRWALLEX_NOTIFY_SECRET || '').trim()
  const userId = session.client_reference_id || session.metadata?.user_id
  const plan = String(session.metadata?.plan || 'standard_monthly').trim()

  const payload = {
    kind: 'stripe_checkout_completed',
    source: meta.source,
    stripe_session_id: session.id,
    payment_status: session.payment_status,
    amount_total: session.amount_total ?? null,
    currency: session.currency ? String(session.currency).toLowerCase() : null,
    plan,
    user_id: userId != null ? String(userId) : null,
    payment_intent: session.payment_intent || null,
    customer: session.customer || null,
    customer_email:
      session.customer_details?.email || session.customer_email || null,
    livemode: Boolean(session.livemode),
  }

  const headers = { 'Content-Type': 'application/json' }
  if (secret) {
    headers.Authorization = `Bearer ${secret}`
  }

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12_000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
    const text = await res.text().catch(() => '')
    if (!res.ok) {
      return {
        skipped: false,
        ok: false,
        error: `HTTP ${res.status}: ${text.slice(0, 500)}`,
      }
    }
    return { skipped: false, ok: true }
  } catch (e) {
    return {
      skipped: false,
      ok: false,
      error: e?.name === 'AbortError' ? 'notify_timeout' : String(e?.message || e),
    }
  } finally {
    clearTimeout(t)
  }
}
