import { verifyToken } from '../../auth.js'
import { sql } from '../../db.js'
import { verifyTotpToken } from '../../totp.js'

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

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const secret = String(body.secret || '').trim()
  const code = String(body.code || '').trim()
  if (!secret || !code) {
    return res.status(400).json({ error: 'secret and code required' })
  }

  if (!verifyTotpToken(secret, code)) {
    return res.status(400).json({ error: 'Invalid code' })
  }

  try {
    await sql`
      UPDATE users
      SET totp_secret = ${secret},
          totp_enabled = true,
          updated_at = NOW()
      WHERE id = ${userId}
    `
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('totp-enable', e)
    return res.status(500).json({ error: e.message || 'Failed' })
  }
}
