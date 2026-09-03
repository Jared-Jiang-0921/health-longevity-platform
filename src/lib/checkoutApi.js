const PAYMENT_PROVIDER = 'stripe'

export const CHECKOUT_API =
  import.meta.env.VITE_CHECKOUT_API || '/api/create-checkout-session'

/** 会员升级走 Stripe Checkout（银行卡 / 微信 / 支付宝）。 */
export function checkoutApiForMethod() {
  return CHECKOUT_API
}

export function getProviderDisplayName() {
  return 'Stripe（银行卡 / 微信 / 支付宝）'
}

export { PAYMENT_PROVIDER }
