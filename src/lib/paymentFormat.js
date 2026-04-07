import { MEMBERSHIP_LEVELS } from '../data/membership'

const PAYMENT_BASE_CURRENCY = String(import.meta.env.VITE_PAYMENT_BASE_CURRENCY || 'USD').toUpperCase().trim()
const PAYMENT_CURRENCY = String(import.meta.env.VITE_PAYMENT_CURRENCY || 'USD').toUpperCase().trim()
const PAYMENT_CURRENCY_OPTIONS = String(import.meta.env.VITE_PAYMENT_CURRENCY_OPTIONS || PAYMENT_CURRENCY)
  .split(',')
  .map((v) => v.trim().toUpperCase())
  .filter((v, i, arr) => /^[A-Z]{3}$/.test(v) && arr.indexOf(v) === i)
const MANUAL_RATES_RAW = String(import.meta.env.VITE_PAYMENT_MANUAL_RATES || 'USD:1')

const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW'])

export const CURRENCY_LABELS = {
  USD: '美元',
  EUR: '欧元',
  CNY: '人民币',
  HKD: '港币',
  SGD: '新加坡元',
  GBP: '英镑',
  JPY: '日元',
  AUD: '澳元',
}

export function minorFactor(currency) {
  return ZERO_DECIMAL_CURRENCIES.has(String(currency).toUpperCase()) ? 1 : 100
}

function parseManualRates(raw, baseCurrency) {
  const map = { [baseCurrency]: 1 }
  const parts = String(raw || '').split(',')
  for (const part of parts) {
    const [k, v] = part.split(':')
    const code = String(k || '').trim().toUpperCase()
    const num = Number(String(v || '').trim())
    if (/^[A-Z]{3}$/.test(code) && Number.isFinite(num) && num > 0) {
      map[code] = num
    }
  }
  return map
}

const MANUAL_RATES = parseManualRates(MANUAL_RATES_RAW, PAYMENT_BASE_CURRENCY)

function convertFromBaseMinor(baseMinorAmount, targetCurrency) {
  const baseRate = MANUAL_RATES[PAYMENT_BASE_CURRENCY] || 1
  const targetRate = MANUAL_RATES[targetCurrency]
  if (!targetRate) return null
  const baseMajor = Number(baseMinorAmount) / minorFactor(PAYMENT_BASE_CURRENCY)
  const targetMajor = (baseMajor / baseRate) * targetRate
  return Math.round(targetMajor * minorFactor(targetCurrency))
}

export function formatPlanPrice(baseMinorAmount, targetCurrency) {
  const convertedMinor = convertFromBaseMinor(baseMinorAmount, targetCurrency)
  if (convertedMinor == null) {
    const baseAmount = Number(baseMinorAmount) / minorFactor(PAYMENT_BASE_CURRENCY)
    const baseDecimals = minorFactor(PAYMENT_BASE_CURRENCY) === 1 ? 0 : 2
    return `约 ${PAYMENT_BASE_CURRENCY} ${baseAmount.toFixed(baseDecimals)}`
  }
  const amount = Number(convertedMinor) / minorFactor(targetCurrency)
  const decimals = minorFactor(targetCurrency) === 1 ? 0 : 2
  return `${targetCurrency} ${amount.toFixed(decimals)}`
}

export function getDefaultPaymentCurrency() {
  return PAYMENT_CURRENCY_OPTIONS[0] || PAYMENT_CURRENCY
}

export function paymentCurrencyOptions() {
  return PAYMENT_CURRENCY_OPTIONS
}

export function isCurrencyRateMissing(currency) {
  return !MANUAL_RATES[String(currency).toUpperCase()]
}

export function membershipLevelLabel(levelId) {
  return MEMBERSHIP_LEVELS[levelId]?.name || levelId
}
