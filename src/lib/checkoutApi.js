const PAYMENT_PROVIDER = String(import.meta.env.VITE_PAYMENT_PROVIDER || 'stripe').toLowerCase().trim()

export const CHECKOUT_API =
  import.meta.env.VITE_CHECKOUT_API || '/api/create-checkout-session'

/** 本站会员升级走 Stripe Checkout；微信/支付宝是 Stripe 支付方式，不是空中云汇。 */
export function checkoutApiForMethod() {
  return CHECKOUT_API
}

export function getProviderDisplayName() {
  return 'Stripe（银行卡 / 微信 / 支付宝）'
}

export { PAYMENT_PROVIDER }
