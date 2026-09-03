const PAYMENT_PROVIDER = String(import.meta.env.VITE_PAYMENT_PROVIDER || 'stripe').toLowerCase().trim()

export const CHECKOUT_API =
  import.meta.env.VITE_CHECKOUT_API ||
  (PAYMENT_PROVIDER === 'airwallex'
    ? '/api/airwallex/create-checkout-session'
    : '/api/create-checkout-session')

export function checkoutApiForMethod(method) {
  if (PAYMENT_PROVIDER === 'airwallex') {
    if (method === 'wechat') return '/api/airwallex/create-wechat-session'
    if (method === 'alipay') return '/api/airwallex/create-alipay-session'
  }
  return CHECKOUT_API
}

export function getProviderDisplayName(provider) {
  if (provider === 'airwallex') return '空中云汇'
  return 'Stripe（银行卡 / 微信 / 支付宝）'
}

export { PAYMENT_PROVIDER }
