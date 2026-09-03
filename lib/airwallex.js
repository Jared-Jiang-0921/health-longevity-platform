import { createHmac, timingSafeEqual } from 'node:crypto'

const DEFAULT_BASE_URL = 'https://api.airwallex.com'

let cachedToken = null
let cachedTokenExpireAt = 0

function normalizeBaseUrl() {
  const raw = String(process.env.AIRWALLEX_API_BASE || DEFAULT_BASE_URL).trim()
  return raw.replace(/\/+$/, '')
}

function getCredentials() {
  const clientId = String(process.env.AIRWALLEX_CLIENT_ID || '').trim()
  const apiKey = String(process.env.AIRWALLEX_API_KEY || '').trim()
  return { clientId, apiKey }
}

function normalizeHex(v) {
  return String(v || '').trim().replace(/^0x/i, '').toLowerCase()
}

function safeHexEqual(a, b) {
  const ah = normalizeHex(a)
  const bh = normalizeHex(b)
  if (!ah || !bh || ah.length !== bh.length) return false
  try {
    return timingSafeEqual(Buffer.from(ah, 'hex'), Buffer.from(bh, 'hex'))
  } catch {
    return false
  }
}

async function requestWithToken(path, { method = 'GET', body, token, headers = {} } = {}) {
  const url = `${normalizeBaseUrl()}${path}`
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body == null ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Airwallex request failed: ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function getAirwallexAccessToken() {
  const now = Date.now()
  if (cachedToken && cachedTokenExpireAt - now > 30_000) {
    return cachedToken
  }
  const { clientId, apiKey } = getCredentials()
  if (!clientId || !apiKey) {
    const err = new Error('PAYMENT_CONFIG_MISSING')
    err.code = 'PAYMENT_CONFIG_MISSING'
    throw err
  }

  const url = `${normalizeBaseUrl()}/api/v1/authentication/login`
  const loginAs = String(process.env.AIRWALLEX_LOGIN_AS || process.env.AIRWALLEX_ACCOUNT_ID || '').trim()
  const headers = {
    'Content-Type': 'application/json',
    'x-client-id': clientId,
    'x-api-key': apiKey,
  }
  if (loginAs) headers['x-login-as'] = loginAs
  const res = await fetch(url, {
    method: 'POST',
    headers,
  })
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }
  if (!res.ok || !data?.token) {
    throw new Error(data?.message || data?.error || 'Airwallex auth failed')
  }

  cachedToken = String(data.token)
  const expireAtRaw = data.expires_at || data.expired_at
  const expireAtTs = expireAtRaw ? Date.parse(expireAtRaw) : NaN
  cachedTokenExpireAt = Number.isFinite(expireAtTs) ? expireAtTs : now + 15 * 60 * 1000
  return cachedToken
}

export async function airwallexRequest(path, options = {}) {
  const token = await getAirwallexAccessToken()
  return requestWithToken(path, { ...options, token })
}

export function resolveAirwallexSdkEnv() {
  const explicit = String(process.env.AIRWALLEX_ENV || '').trim().toLowerCase()
  if (explicit === 'demo' || explicit === 'sandbox') return 'demo'
  const base = String(process.env.AIRWALLEX_API_BASE || '').toLowerCase()
  if (base.includes('demo') || base.includes('sandbox')) return 'demo'
  return 'prod'
}

export async function createAirwallexPaymentLink(payload) {
  return airwallexRequest('/api/v1/pa/payment_links/create', {
    method: 'POST',
    body: payload,
  })
}

export async function createAirwallexPaymentIntent(payload) {
  return airwallexRequest('/api/v1/pa/payment_intents/create', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Hosted Payment Page 直达链接（与 Airwallex.js redirectToCheckout 同源参数）。
 * 有密钥时前端可 window.location 跳转，不必先等 SDK。
 */
export function buildAirwallexHostedCheckoutUrl({
  env,
  intentId,
  clientSecret,
  currency,
  successUrl,
  methods,
  countryCode,
} = {}) {
  const host = env === 'demo'
    ? 'https://checkout-demo.airwallex.com'
    : 'https://checkout.airwallex.com'
  const params = new URLSearchParams({
    intent_id: String(intentId || ''),
    client_secret: String(clientSecret || ''),
    currency: String(currency || '').toUpperCase(),
  })
  if (successUrl) params.set('successUrl', String(successUrl))
  if (countryCode) params.set('country_code', String(countryCode))
  if (Array.isArray(methods) && methods.length) {
    params.set('methods', methods.join(','))
  }
  return `${host}/#/standalone/checkout?${params.toString()}`
}

/**
 * Airwallex webhook signature:
 * - commonly uses x-signature (+ optional x-timestamp)
 * - older/community integrations may expose x-airwallex-signature
 */
export function verifyAirwallexWebhookSignature(rawBody, headers, webhookSecret) {
  const secret = String(webhookSecret || '').trim()
  if (!secret) return false

  const signature =
    headers?.['x-signature'] ||
    headers?.['X-Signature'] ||
    headers?.['x-airwallex-signature'] ||
    headers?.['X-Airwallex-Signature']
  if (!signature) return false

  const timestamp = headers?.['x-timestamp'] || headers?.['X-Timestamp']
  const bodyText = String(rawBody || '')
  const sigA = createHmac('sha256', secret).update(bodyText, 'utf8').digest('hex')
  if (safeHexEqual(signature, sigA)) return true

  if (timestamp) {
    const sigB = createHmac('sha256', secret).update(`${timestamp}${bodyText}`, 'utf8').digest('hex')
    if (safeHexEqual(signature, sigB)) return true
  }
  return false
}
