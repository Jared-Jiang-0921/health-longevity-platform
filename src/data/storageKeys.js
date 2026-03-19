/** 前端存储 key 统一管理 */
export const CHECKOUT_STORAGE_KEY = 'health-platform-last-checkout'
export const PAYMENT_HISTORY_KEY = 'health-platform-payment-history'
export const CONSULT_TRIAL_PREFIX = 'health-platform-consult-trial'

const MAX_HISTORY = 50

export function getPaymentHistory() {
  try {
    const raw = localStorage.getItem(PAYMENT_HISTORY_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list.slice(0, MAX_HISTORY) : []
  } catch {
    return []
  }
}

export function appendPaymentHistory(record) {
  const list = getPaymentHistory()
  list.unshift({ ...record, completedAt: Date.now() })
  localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)))
}

export function getConsultTrialCount(email) {
  if (!email) return 0
  try {
    const raw = localStorage.getItem(`${CONSULT_TRIAL_PREFIX}:${email}`)
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0
  } catch {
    return 0
  }
}

export function incrementConsultTrial(email) {
  if (!email) return 0
  const n = getConsultTrialCount(email) + 1
  localStorage.setItem(`${CONSULT_TRIAL_PREFIX}:${email}`, String(n))
  return n
}
