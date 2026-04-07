import { sql } from '../../db.js'
import { hashPassword, createToken, getUserById } from '../../auth.js'
import { extractDomainFromEmail, ensureOrgTables } from '../../orgs.js'

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
    const emailNormalized = email.toLowerCase().trim()
    const emailDomain = extractDomainFromEmail(emailNormalized)
    if (!emailDomain) {
      return res.status(400).json({ error: '邮箱格式不正确' })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${emailNormalized}`
    if (existing.length) {
      return res.status(400).json({ error: '该邮箱已注册' })
    }

    // 企业域名已绑定时，只允许受邀邮箱注册（后续 org_invites 完成后可放开）
    await ensureOrgTables()
    const orgRows = await sql`SELECT id FROM orgs WHERE domain = ${emailDomain} LIMIT 1`
    if (orgRows.length) {
      return res.status(403).json({ error: '该企业域名已启用企业管理，请联系管理员邀请加入' })
    }

    const password_hash = await hashPassword(password)
    const displayName = (name || email.split('@')[0] || '用户').trim().slice(0, 50)

    const rows = await sql`
      INSERT INTO users (email, name, password_hash, level)
      VALUES (${emailNormalized}, ${displayName}, ${password_hash}, 'free')
      RETURNING id
    `
    const row = rows[0]
    if (!row?.id) {
      return res.status(500).json({ error: '注册失败：未写入用户' })
    }
    const token = await createToken(String(row.id))
    const user = await getUserById(row.id)
    return res.status(201).json({ user: { ...user, org: null, orgs: [] }, token })
  } catch (e) {
    console.error('register error', e)
    return res.status(500).json({ error: e.message || '注册失败' })
  }
}
