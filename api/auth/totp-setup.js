import { verifyToken } from '../../lib/auth.js'
import { sql } from '../../lib/db.js'
import { generateTotpSecret, buildKeyUri } from '../../lib/totp.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization
  const jwt = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!jwt) {
    return res.status(401).json({ error: '请先登录' })
  }

  const userId = await verifyToken(jwt)
  if (!userId) {
    return res.status(401).json({ error: '登录已过期' })
  }

  try {
    const rows = await sql`SELECT email, totp_enabled FROM users WHERE id = ${userId} LIMIT 1`
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    if (rows[0].totp_enabled) {
      return res.status(400).json({ error: 'Two-factor authentication is already enabled. Disable it first.' })
    }

    const secret = generateTotpSecret()
    const issuer = String(process.env.TOTP_ISSUER || 'Longvity').trim()
    const otpauthUrl = buildKeyUri(rows[0].email, issuer, secret)

    return res.status(200).json({ secret, otpauthUrl, issuer })
  } catch (e) {
    console.error('totp-setup', e)
    return res.status(500).json({ error: e.message || 'Failed' })
  }
}
