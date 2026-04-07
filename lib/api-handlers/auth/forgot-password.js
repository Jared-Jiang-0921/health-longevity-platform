import { sql } from '../../db.js'
import { sendPasswordResetEmail } from '../../email.js'
import { generateRawResetToken, hashResetToken } from '../../passwordResetToken.js'

const RESET_MINUTES = 60

function resolvePublicOrigin(req, body) {
  const fromBody = String(body.origin || '').trim()
  if (fromBody && fromBody.startsWith('http')) return fromBody.replace(/\/$/, '')
  const h = req.headers.origin || req.headers.referer
  if (h) {
    try {
      const u = new URL(h)
      return `${u.protocol}//${u.host}`
    } catch {
      /* ignore */
    }
  }
  const env = String(process.env.APP_PUBLIC_URL || '').trim()
  if (env && env.startsWith('http')) return env.replace(/\/$/, '')
  return ''
}

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

  const email = String(body.email || '')
    .toLowerCase()
    .trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(200).json({ ok: true, message: 'If an account exists, we sent reset instructions.' })
  }

  try {
    const rows = await sql`SELECT id, email FROM users WHERE email = ${email} LIMIT 1`
    if (!rows.length) {
      return res.status(200).json({ ok: true, message: 'If an account exists, we sent reset instructions.' })
    }

    const raw = generateRawResetToken()
    const tokenHash = hashResetToken(raw)
    const expires = new Date(Date.now() + RESET_MINUTES * 60 * 1000)

    await sql`
      UPDATE users
      SET password_reset_token_hash = ${tokenHash},
          password_reset_expires_at = ${expires.toISOString()},
          updated_at = NOW()
      WHERE id = ${rows[0].id}
    `

    const origin = resolvePublicOrigin(req, body)
    const base = origin || 'https://example.com'
    const resetUrl = `${base}/reset-password?token=${encodeURIComponent(raw)}`

    const brand = String(process.env.EMAIL_BRAND_NAME || 'Health Longevity Platform').trim()
    const send = await sendPasswordResetEmail({ to: email, resetUrl, brandName: brand })

    if (!send.ok && send.reason === 'not_configured') {
      console.warn(
        '[forgot-password] SMTP not configured; set SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM. Reset URL (dev only):',
        resetUrl,
      )
    }

    return res.status(200).json({ ok: true, message: 'If an account exists, we sent reset instructions.' })
  } catch (e) {
    console.error('forgot-password', e)
    return res.status(500).json({ error: e.message || 'Request failed' })
  }
}
