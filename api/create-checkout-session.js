/**
 * POST /api/create-checkout-session
 * 需登录，带上 plan（standard_monthly | standard_yearly | premium_monthly | premium_yearly）
 */
import Stripe from 'stripe'
import { randomUUID } from 'node:crypto'
import { verifyToken } from '../lib/auth.js'
import { PLANS } from '../lib/plans.js'
import { upsertPaymentLog } from '../lib/paymentOps.js'

function resolveCurrency() {
  const raw = process.env.PAYMENT_CURRENCY || process.env.VITE_PAYMENT_CURRENCY || 'usd'
  return String(raw).toLowerCase().trim()
}

function resolveBaseCurrency(defaultCurrency) {
  const raw = process.env.PAYMENT_BASE_CURRENCY || process.env.VITE_PAYMENT_BASE_CURRENCY || defaultCurrency
  return String(raw).toLowerCase().trim()
}

function resolveAllowedCurrencies(defaultCurrency) {
  const raw = process.env.PAYMENT_CURRENCY_OPTIONS || process.env.VITE_PAYMENT_CURRENCY_OPTIONS || defaultCurrency
  return String(raw)
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter((v, i, arr) => /^[a-z]{3}$/.test(v) && arr.indexOf(v) === i)
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

function resolveCheckoutMethod(body) {
  const raw = String(body?.method || body?.payment_method || 'card').toLowerCase().trim()
  if (raw === 'wechat' || raw === 'wechat_pay' || raw === 'weixin') return 'wechat'
  if (raw === 'alipay' || raw === 'alipaycn') return 'alipay'
  if (raw === 'auto') return 'auto'
  return 'card'
}

/** 香港等地 Stripe 账户：WeChat Pay / Alipay 仅支持 CNY、HKD，USD 会直接被拒。 */
const WALLET_CURRENCIES = {
  wechat: ['cny', 'hkd'],
  alipay: ['cny', 'hkd'],
}

function resolvePresentmentCurrency({ method, requested, rates }) {
  const wallet = WALLET_CURRENCIES[method]
  if (!wallet) return requested
  const usable = (code) => Boolean(code && wallet.includes(code) && rates[code] > 0)
  const forced = String(process.env.PAYMENT_WALLET_CURRENCY || '').toLowerCase().trim()
  if (usable(forced)) return forced
  if (usable(requested)) return requested
  for (const code of wallet) {
    if (usable(code)) return code
  }
  return requested
}

function stripeMethodConfig(method) {
  if (method === 'wechat') {
    return {
      payment_method_types: ['wechat_pay'],
      payment_method_options: { wechat_pay: { client: 'web' } },
    }
  }
  if (method === 'alipay') {
    return { payment_method_types: ['alipay'] }
  }
  if (method === 'auto') {
    return {
      payment_method_types: ['card', 'alipay', 'wechat_pay'],
      payment_method_options: { wechat_pay: { client: 'web' } },
    }
  }
  return { payment_method_types: ['card'] }
}

function friendlyStripeError(e, method) {
  const msg = String(e?.message || '')
  if (/currency provided/i.test(msg) || /support the following currencies/i.test(msg) || /invalid.*currenc/i.test(msg)) {
    return '当前展示币种无法用于微信/支付宝。本收款账户仅支持人民币或港币结算，请改选 CNY/HKD，或先用银行卡。'
  }
  if (/not activated|not enabled|has not been activated/i.test(msg) && /wechat/i.test(msg)) {
    return '微信支付尚未在收款账户中开通。请到 Stripe Dashboard → 设置 → 支付方式 启用 WeChat Pay，或先使用银行卡。'
  }
  if (/not activated|not enabled|has not been activated/i.test(msg) && /alipay/i.test(msg)) {
    return '支付宝尚未在收款账户中开通。请到 Stripe Dashboard → 设置 → 支付方式 启用 Alipay，或先使用银行卡。'
  }
  if (method === 'wechat') {
    return '无法创建微信支付会话。请改选人民币结算后再试，或先使用银行卡。'
  }
  if (method === 'alipay') {
    return '无法创建支付宝会话。请改选人民币结算后再试，或先使用银行卡。'
  }
  return '支付通道暂时不可用，请稍后重试'
}

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
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

  const secret = String(process.env.STRIPE_SECRET_KEY || '').trim()
  if (!secret) {
    return fail(500, 'PAYMENT_CONFIG_MISSING', '支付配置缺失，请联系管理员')
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return fail(400, 'INVALID_JSON', '请求数据格式不正确')
  }

  const plan = body.plan || 'standard_monthly'
  const planConfig = PLANS[plan]
  if (!planConfig) {
    return fail(400, 'INVALID_PLAN', '无效的套餐')
  }

  const origin = body.origin || req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || ''
  if (!origin || !origin.startsWith('http')) {
    return fail(400, 'INVALID_ORIGIN', '请求来源地址无效')
  }

  const method = resolveCheckoutMethod(body)
  const stripe = new Stripe(secret)
  try {
    const requestEventKey = `checkout_create:${randomUUID()}`
    const defaultCurrency = resolveCurrency()
    const baseCurrency = resolveBaseCurrency(defaultCurrency)
    const allowedCurrencies = resolveAllowedCurrencies(defaultCurrency)
    const manualRates = resolveManualRates(baseCurrency)
    const requestedCurrency = String(body.currency || '').toLowerCase().trim()
    const displayCurrency = allowedCurrencies.includes(requestedCurrency) ? requestedCurrency : defaultCurrency
    const currency = resolvePresentmentCurrency({
      method,
      requested: displayCurrency,
      rates: manualRates,
    })
    const convertedUnitAmount = convertFromBaseMinor(planConfig.amount, baseCurrency, currency, manualRates)
    if (!convertedUnitAmount || convertedUnitAmount <= 0) {
      return fail(400, 'INVALID_MANUAL_RATE', '手动汇率配置无效，请联系管理员')
    }
    await upsertPaymentLog({
      provider: 'stripe',
      eventKey: requestEventKey,
      source: 'create_checkout',
      userId: String(userId),
      plan,
      currency,
      status: 'requested',
      errorCode: method,
    })
    const methodCfg = stripeMethodConfig(method)
    const session = await stripe.checkout.sessions.create({
      ...methodCfg,
      locale: 'auto',
      client_reference_id: userId,
      metadata: {
        plan,
        user_id: userId,
        payment_method: method,
        requested_currency: displayCurrency,
        presentment_currency: currency,
      },
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: planConfig.name,
            description: `${planConfig.months} 个月`,
          },
          unit_amount: convertedUnitAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment`,
    })
    await upsertPaymentLog({
      provider: 'stripe',
      eventKey: requestEventKey,
      source: 'create_checkout',
      userId: String(userId),
      sessionId: session.id,
      plan,
      currency,
      status: 'session_created',
    })
    return res.status(200).json({ url: session.url, method })
  } catch (e) {
    console.error('create-checkout-session', e?.message || e)
    await upsertPaymentLog({
      provider: 'stripe',
      eventKey: `checkout_create_error:${randomUUID()}`,
      source: 'create_checkout',
      userId: String(userId),
      plan,
      status: 'provider_error',
      errorCode: String(e?.code || method || 'STRIPE_ERROR'),
      errorMessage: String(e?.message || ''),
    }).catch(() => {})
    return fail(502, 'PAYMENT_PROVIDER_ERROR', friendlyStripeError(e, method))
  }
}
