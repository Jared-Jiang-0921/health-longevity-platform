import { randomUUID } from 'node:crypto'
import { verifyToken } from '../../auth.js'
import { PLANS } from '../../plans.js'
import {
  buildAirwallexHostedCheckoutUrl,
  createAirwallexPaymentIntent,
  resolveAirwallexSdkEnv,
} from '../../airwallex.js'
import { upsertPaymentLog } from '../../paymentOps.js'

const METHOD_ALIASES = {
  wechat: 'wechat',
  wechatpay: 'wechat',
  weixin: 'wechat',
  alipay: 'alipay',
  alipaycn: 'alipay',
  card: 'card',
  cards: 'card',
  auto: 'auto',
}

function resolveCheckoutMethod(req, body) {
  const fromBody = String(body?.method || body?.payment_method || '').toLowerCase().trim()
  if (METHOD_ALIASES[fromBody]) return METHOD_ALIASES[fromBody]
  let path = ''
  try {
    path = new URL(req.url || '/', 'http://localhost').pathname.toLowerCase()
  } catch {
    path = String(req.url || '').toLowerCase()
  }
  if (path.includes('wechat')) return 'wechat'
  if (path.includes('alipay')) return 'alipay'
  return 'auto'
}

function checkoutOptionsForMethod(method) {
  if (method === 'wechat') return { methods: ['wechatpay'], countryCode: 'CN' }
  if (method === 'alipay') return { methods: ['alipaycn'], countryCode: 'CN' }
  if (method === 'card') return { methods: ['card'], countryCode: '' }
  return { methods: ['wechatpay', 'alipaycn', 'card'], countryCode: 'CN' }
}

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

function majorFromMinor(minor, currency) {
  const factor = minorFactor(currency)
  if (factor === 1) return Math.round(minor)
  return Number((Number(minor) / factor).toFixed(2))
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

  const method = resolveCheckoutMethod(req, body)
  const methodOpts = checkoutOptionsForMethod(method)
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
      method,
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
    const amount = majorFromMinor(convertedMinor, currency)
    const currencyUpper = currency.toUpperCase()
    const intentPayload = {
      request_id: requestId,
      merchant_order_id: requestId,
      amount,
      currency: currencyUpper,
      return_url: successUrl,
      metadata: {
        plan,
        user_id: String(userId),
        payment_method: method,
        origin,
      },
      order: {
        products: [{
          name: planConfig.name,
          desc: `${planConfig.months} month membership`,
          quantity: 1,
          unit_price: amount,
        }],
      },
    }
    const created = await createAirwallexPaymentIntent(intentPayload)
    const intentId = created?.id || created?.payment_intent_id || ''
    const clientSecret = created?.client_secret || created?.clientSecret || ''
    const sdkEnv = resolveAirwallexSdkEnv()
    const checkout = {
      env: sdkEnv,
      intent_id: intentId,
      client_secret: clientSecret,
      currency: currencyUpper,
      methods: methodOpts.methods,
      country_code: methodOpts.countryCode || undefined,
      successUrl,
      cancelUrl,
    }
    const url = (intentId && clientSecret)
      ? buildAirwallexHostedCheckoutUrl({
          env: sdkEnv,
          intentId,
          clientSecret,
          currency: currencyUpper,
          successUrl,
          methods: methodOpts.methods,
          countryCode: methodOpts.countryCode,
        })
      : null

    if (!url) {
      await upsertPaymentLog({
        provider: 'airwallex',
        eventKey,
        source: 'create_checkout',
        userId: String(userId),
        sessionId: String(intentId || requestId),
        plan,
        currency,
        status: 'session_create_failed',
        errorCode: 'MISSING_CHECKOUT_URL',
        errorMessage: 'Airwallex create payment intent success but no checkout url',
      })
      return fail(502, 'PAYMENT_PROVIDER_ERROR', 'Airwallex did not return checkout url')
    }

    await upsertPaymentLog({
      provider: 'airwallex',
      eventKey,
      source: 'create_checkout',
      userId: String(userId),
      sessionId: String(intentId || requestId),
      plan,
      currency,
      status: 'session_created',
    })
    return res.status(200).json({ url, checkout, method })
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
    if (e?.code === 'PAYMENT_CONFIG_MISSING' || /AIRWALLEX_CLIENT_ID|AIRWALLEX_API_KEY is missing/i.test(String(e?.message || ''))) {
      return fail(503, 'PAYMENT_CONFIG_MISSING', '空中云汇收款尚未配置完成，暂时无法跳转支付。请联系站点管理员。')
    }
    return fail(502, 'PAYMENT_PROVIDER_ERROR', e?.message || 'Airwallex request failed')
  }
}
