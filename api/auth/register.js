import { sql } from '../../lib/db.js'
import { hashPassword, createToken, getUserById } from '../../lib/auth.js'

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

    const { email, password, name } = body
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码必填' })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`
    if (existing.length) {
      return res.status(400).json({ error: '该邮箱已注册' })
    }

    const password_hash = await hashPassword(password)
    const displayName = (name || email.split('@')[0] || '用户').trim().slice(0, 50)

    const rows = await sql`
      INSERT INTO users (email, name, password_hash, level)
      VALUES (${email.toLowerCase().trim()}, ${displayName}, ${password_hash}, 'free')
      RETURNING id
    `
    const row = rows[0]
    if (!row?.id) {
      return res.status(500).json({ error: '注册失败：未写入用户' })
    }
    const token = await createToken(String(row.id))
    const user = await getUserById(row.id)
    return res.status(201).json({ user, token })
  } catch (e) {
    console.error('register error', e)
    return res.status(500).json({ error: e.message || '注册失败' })
  }
}
