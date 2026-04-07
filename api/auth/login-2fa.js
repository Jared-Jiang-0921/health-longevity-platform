import { sql } from '../../lib/db.js'
import { createToken, getUserById, verifyPreAuthToken } from '../../lib/auth.js'
import { verifyTotpToken } from '../../lib/totp.js'
import { getOrgContextsByUserId } from '../../lib/orgs.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }

    const preAuthToken = String(body.preAuthToken || '').trim()
    const code = String(body.code || '').trim()
    if (!preAuthToken || !code) {
      return res.status(400).json({ error: 'preAuthToken and code required' })
    }

    const userId = await verifyPreAuthToken(preAuthToken)
    if (!userId) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' })
    }

    const rows = await sql`
      SELECT id, totp_secret, totp_enabled FROM users WHERE id = ${userId} LIMIT 1
    `
    if (!rows.length || !rows[0].totp_enabled || !rows[0].totp_secret) {
      return res.status(400).json({ error: 'Two-factor authentication is not enabled for this account' })
    }

    if (!verifyTotpToken(rows[0].totp_secret, code)) {
      return res.status(401).json({ error: 'Invalid authenticator code' })
    }

    const token = await createToken(String(rows[0].id))
    const user = await getUserById(rows[0].id)
    const orgs = await getOrgContextsByUserId(rows[0].id)
    const org = orgs.length ? orgs[0] : null
    return res.status(200).json({ user: { ...user, org, orgs }, token })
  } catch (e) {
    console.error('login-2fa error', e)
    return res.status(500).json({ error: e.message || 'Login failed' })
  }
}
