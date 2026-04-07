import { generateSecret, verifySync, generateURI } from 'otplib'

export function generateTotpSecret() {
  return generateSecret()
}

export function buildKeyUri(email, issuer, secret) {
  return generateURI({ issuer, label: email, secret })
}

export function verifyTotpToken(secret, token) {
  const t = String(token || '').replace(/\s/g, '')
  if (!t || !secret) return false
  const result = verifySync({ secret, token: t })
  return Boolean(result && (result === true || result.valid === true))
}
