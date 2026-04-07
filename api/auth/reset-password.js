import { sql } from '../../lib/db.js'
import { hashPassword } from '../../lib/auth.js'
import { hashResetToken } from '../../lib/passwordResetToken.js'

export default async function handler(req, res) {
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

  const token = String(body.token || '').trim()
  const password = String(body.password || '')
  if (!token || !password || password.length < 6) {
    return res.status(400).json({ error: 'Invalid token or password (min 6 characters)' })
  }

  const tokenHash = hashResetToken(token)

  try {
    const rows = await sql`
      SELECT id FROM users
      WHERE password_reset_token_hash = ${tokenHash}
        AND password_reset_expires_at IS NOT NULL
        AND password_reset_expires_at > NOW()
      LIMIT 1
    `
    if (!rows.length) {
      return res.status(400).json({ error: 'Invalid or expired reset link' })
    }

    const password_hash = await hashPassword(password)
    await sql`
      UPDATE users
      SET password_hash = ${password_hash},
          password_reset_token_hash = NULL,
          password_reset_expires_at = NULL,
          updated_at = NOW()
      WHERE id = ${rows[0].id}
    `

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('reset-password', e)
    return res.status(500).json({ error: e.message || 'Reset failed' })
  }
}
