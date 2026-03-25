import { sql } from '../../lib/db.js'
import { verifyPassword, createToken, getUserById } from '../../lib/auth.js'
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

    const { email, password } = body
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码必填' })
    }

    const rows = await sql`
      SELECT id, password_hash FROM users WHERE email = ${email.toLowerCase().trim()}
    `
    if (!rows.length) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const ok = await verifyPassword(password, rows[0].password_hash)
    if (!ok) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const token = await createToken(String(rows[0].id))
    const user = await getUserById(rows[0].id)
    const orgs = await getOrgContextsByUserId(rows[0].id)
    const org = orgs.length ? orgs[0] : null
    return res.status(200).json({ user: { ...user, org, orgs }, token })
  } catch (e) {
    console.error('login error', e)
    return res.status(500).json({ error: e.message || '登录失败' })
  }
}
