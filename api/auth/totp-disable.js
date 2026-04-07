import { verifyToken, verifyPassword } from '../../lib/auth.js'
import { sql } from '../../lib/db.js'

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

  const password = String(body.password || '')
  if (!password) {
    return res.status(400).json({ error: 'password required' })
  }

  try {
    const rows = await sql`
      SELECT password_hash FROM users WHERE id = ${userId} LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    const ok = await verifyPassword(password, rows[0].password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Incorrect password' })
    }

    await sql`
      UPDATE users
      SET totp_secret = NULL,
          totp_enabled = false,
          updated_at = NOW()
      WHERE id = ${userId}
    `
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('totp-disable', e)
    return res.status(500).json({ error: e.message || 'Failed' })
  }
}
