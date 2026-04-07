const PAYMENT_PROVIDER = String(import.meta.env.VITE_PAYMENT_PROVIDER || 'stripe').toLowerCase().trim()

export const CHECKOUT_API =
  import.meta.env.VITE_CHECKOUT_API ||
  (PAYMENT_PROVIDER === 'airwallex'
    ? '/api/airwallex/create-checkout-session'
    : '/api/create-checkout-session')

export function getProviderDisplayName(provider) {
  return provider === 'airwallex' ? '空中云汇（骨架联调）' : 'Stripe（生产可用）'
}

export { PAYMENT_PROVIDER }
