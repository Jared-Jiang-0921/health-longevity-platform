import { randomUUID } from 'node:crypto'
import { verifyToken } from '../../auth.js'
import { PLANS } from '../../plans.js'
import { createAirwallexPaymentLink } from '../../airwallex.js'
import { upsertPaymentLog } from '../../paymentOps.js'

function resolveCurrency() {
  const raw = process.env.PAYMENT_CURRENCY || process.env.VITE_PAYMENT_CURRENCY || 'usd'
  return String(raw).toLowerCase().trim()
}

function resolveAllowedCurrencies(defaultCurrency) {
  const raw = process.env.PAYMENT_CURRENCY_OPTIONS || process.env.VITE_PAYMENT_CURRENCY_OPTIONS || defaultCurrency
  return String(raw)
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter((v, i, arr) => /^[a-z]{3}$/.test(v) && arr.indexOf(v) === i)
}

function resolveBaseCurrency(defaultCurrency) {
  const raw = process.env.PAYMENT_BASE_CURRENCY || process.env.VITE_PAYMENT_BASE_CURRENCY || defaultCurrency
  return String(raw).toLowerCase().trim()
}

function resolveManualRates(baseCurrency) {
  const raw = process.env.PAYMENT_MANUAL_RATES || process.env.VITE_PAYMENT_MANUAL_RATES || `${baseCurrency}:1`
  const map = { [baseCurrency]: 1 }
  for (const part of String(raw).split(',')) {
    const [k, v] = String(part).split(':')
    const code = String(k || '').trim().toLowerCase()
    const num = Number(String(v || '').trim())
    if (/^[a-z]{3}$/.test(code) && Number.isFinite(num) && num > 0) {
      map[code] = num
    }
  }
  return map
}

const ZERO_DECIMAL_CURRENCIES = new Set(['jpy', 'krw'])
function minorFactor(currency) {
  return ZERO_DECIMAL_CURRENCIES.has(String(currency).toLowerCase()) ? 1 : 100
}

function convertFromBaseMinor(baseMinorAmount, baseCurrency, targetCurrency, rates) {
  const baseRate = rates[baseCurrency] || 1
  const targetRate = rates[targetCurrency]
  if (!targetRate) return null
  const baseMajor = Number(baseMinorAmount) / minorFactor(baseCurrency)
  const targetMajor = (baseMajor / baseRate) * targetRate
  return Math.round(targetMajor * minorFactor(targetCurrency))
}

function moneyStringFromMinor(minor, currency) {
  const factor = minorFactor(currency)
  if (factor === 1) return String(Math.round(minor))
  return (Number(minor) / factor).toFixed(2)
}

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(405, 'METHOD_NOT_ALLOWED', 'Method not allowed')
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return fail(401, 'AUTH_REQUIRED', '请先登录')
  }

  const userId = await verifyToken(token)
  if (!userId) {
    return fail(401, 'AUTH_EXPIRED', '登录已过期')
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return fail(400, 'INVALID_JSON', 'Invalid JSON')
  }

  const plan = body.plan || 'standard_monthly'
  const planConfig = PLANS[plan]
  if (!planConfig) {
    return fail(400, 'INVALID_PLAN', '无效的套餐')
  }
  const defaultCurrency = resolveCurrency()
  const baseCurrency = resolveBaseCurrency(defaultCurrency)
  const allowedCurrencies = resolveAllowedCurrencies(defaultCurrency)
  const manualRates = resolveManualRates(baseCurrency)
  const requestedCurrency = String(body.currency || '').toLowerCase().trim()
  const currency = allowedCurrencies.includes(requestedCurrency) ? requestedCurrency : defaultCurrency
  const convertedMinor = convertFromBaseMinor(planConfig.amount, baseCurrency, currency, manualRates)
  if (!convertedMinor || convertedMinor <= 0) {
    return fail(400, 'INVALID_MANUAL_RATE', '手动汇率配置无效，请联系管理员')
  }

  const origin = body.origin || req.headers.origin || ''
  if (!origin || !origin.startsWith('http')) {
    return fail(400, 'INVALID_ORIGIN', 'Missing valid origin')
  }

  const successUrl = String(process.env.AIRWALLEX_SUCCESS_URL || `${origin}/payment/success`).trim()
  const cancelUrl = String(process.env.AIRWALLEX_CANCEL_URL || `${origin}/payment`).trim()
  const eventKey = `airwallex_create:${randomUUID()}`
  await upsertPaymentLog({
    provider: 'airwallex',
    eventKey,
    source: 'create_checkout',
    userId: String(userId),
    plan,
    currency,
    status: 'requested',
  })

  // 保留 mock 分支，便于生产联调回滚。
  const mockRedirect = process.env.AIRWALLEX_MOCK_REDIRECT_URL?.trim()
  if (mockRedirect) {
    const qs = new URLSearchParams({
      provider: 'airwallex',
      plan,
      user_id: String(userId),
      currency,
    })
    const sep = mockRedirect.includes('?') ? '&' : '?'
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey,
      source: 'create_checkout',
      userId: String(userId),
      sessionId: `mock:${plan}:${Date.now()}`,
      plan,
      currency,
      status: 'session_created_mock',
    })
    return res.status(200).json({ url: `${mockRedirect}${sep}${qs.toString()}` })
  }

  try {
    const requestId = randomUUID()
    const payload = {
      request_id: requestId,
      title: planConfig.name,
      description: `${planConfig.months} month membership`,
      reusable: false,
      amount: moneyStringFromMinor(convertedMinor, currency),
      currency: currency.toUpperCase(),
      return_url: successUrl,
      metadata: {
        plan,
        user_id: String(userId),
        cancel_url: cancelUrl,
        origin,
      },
    }
    const created = await createAirwallexPaymentLink(payload)
    const url =
      created?.url ||
      created?.short_url ||
      created?.payment_link?.url ||
      created?.data?.url ||
      null
    const sessionId =
      created?.id ||
      created?.payment_link_id ||
      created?.payment_link?.id ||
      created?.request_id ||
      requestId

    if (!url) {
      await upsertPaymentLog({
        provider: 'airwallex',
        eventKey,
        source: 'create_checkout',
        userId: String(userId),
        sessionId: String(sessionId),
        plan,
        currency,
        status: 'session_create_failed',
        errorCode: 'MISSING_CHECKOUT_URL',
        errorMessage: 'Airwallex create payment link success but no url field',
      })
      return fail(502, 'PAYMENT_PROVIDER_ERROR', 'Airwallex did not return checkout url')
    }

    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey,
      source: 'create_checkout',
      userId: String(userId),
      sessionId: String(sessionId),
      plan,
      currency,
      status: 'session_created',
    })
    return res.status(200).json({ url })
  } catch (e) {
    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey,
      source: 'create_checkout',
      userId: String(userId),
      plan,
      currency,
      status: 'provider_error',
      errorCode: String(e?.status || 'AIRWALLEX_ERROR'),
      errorMessage: String(e?.message || ''),
    })
    return fail(502, 'PAYMENT_PROVIDER_ERROR', e?.message || 'Airwallex request failed')
  }
}
