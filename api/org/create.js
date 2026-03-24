import { sql } from '../../lib/db.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { extractDomainFromEmail, normalizeDomain, ensureOrgTables } from '../../lib/orgs.js'

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
    }

    const auth = req.headers.authorization
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    const userId = await verifyToken(token)
    if (!userId) {
      return fail(401, 'AUTH_REQUIRED', '请先登录')
    }

    const user = await getUserById(userId)
    if (!user) {
      return fail(401, 'USER_NOT_FOUND', '用户不存在')
    }

    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    } catch {
      return fail(400, 'INVALID_JSON', '请求数据格式不正确')
    }

    const orgName = String(body.name || '').trim()
    const inputDomain = normalizeDomain(body.domain)
    const emailDomain = extractDomainFromEmail(user.email)
    const domain = inputDomain || emailDomain
    if (!orgName) {
      return fail(400, 'ORG_NAME_REQUIRED', '企业名称必填')
    }
    if (!domain) {
      return fail(400, 'ORG_DOMAIN_REQUIRED', '企业域名必填')
    }
    if (!domain.includes('.')) {
      return fail(400, 'ORG_DOMAIN_INVALID', '企业域名格式不正确')
    }
    if (domain !== emailDomain) {
      return fail(403, 'ORG_DOMAIN_MISMATCH', '仅可使用当前登录邮箱域名创建企业')
    }

    await ensureOrgTables()
    const existing = await sql`SELECT id FROM orgs WHERE domain = ${domain} LIMIT 1`
    if (existing.length) {
      return fail(409, 'ORG_DOMAIN_EXISTS', '该企业域名已被绑定')
    }

    const orgRows = await sql`
      INSERT INTO orgs (name, domain, owner_user_id, status)
      VALUES (${orgName.slice(0, 100)}, ${domain}, ${userId}, 'active')
      RETURNING id, name, domain, status, owner_user_id, created_at
    `
    const org = orgRows[0]
    await sql`
      INSERT INTO org_members (org_id, user_id, role, status)
      VALUES (${org.id}, ${userId}, 'owner', 'active')
      ON CONFLICT (org_id, user_id) DO NOTHING
    `

    return res.status(201).json({
      ok: true,
      org: {
        id: org.id,
        name: org.name,
        domain: org.domain,
        status: org.status,
        role: 'owner',
      },
    })
  } catch (e) {
    console.error('org/create', e)
    return fail(500, 'ORG_CREATE_FAILED', '创建企业失败，请稍后重试')
  }
}
