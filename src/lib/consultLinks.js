import { findConsultUrls } from '../../lib/consultLinkText.js'

export { findConsultUrls }

const CODE_KEY = {
  BLOCKED_ADDRESS: 'linkUnsafe',
  BAD_PORT: 'linkUnsafe',
  CREDENTIALS: 'linkUnsafe',
  DOWNGRADE: 'linkUnsafe',
  REDIRECT_LIMIT: 'linkUnsafe',
  DNS_FAIL: 'linkFail',
  HTTP_403: 'linkBlocked',
  HTTP_429: 'linkBlocked',
  HTTP_401: 'linkPaywall',
  HTTP_402: 'linkPaywall',
  HTTP_407: 'linkPaywall',
  PAYWALL: 'linkPaywall',
  SCANNED_PDF: 'linkScanned',
  TOO_LARGE: 'linkTooLarge',
  TOO_MANY: 'linkTooMany',
  RATE_LIMIT: 'linkBusy',
  BUSY: 'linkBusy',
}

export function consultLinkMessage(code, copy) {
  const key = CODE_KEY[code] || 'linkFail'
  return copy?.[key] || copy?.linkFail || ''
}

export async function fetchConsultSources(token, { urls, question }) {
  const res = await fetch('/api/consult-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({ urls, question }),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) {
    const err = new Error(data?.error || 'link')
    err.code = data?.code || `HTTP_${res.status}`
    throw err
  }
  return data
}
