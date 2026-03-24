import { randomUUID } from 'node:crypto'
import { sql } from '../../lib/db.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { ensureOrgTables, extractDomainFromEmail } from '../../lib/orgs.js'

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
    if (!userId) return fail(401, 'AUTH_REQUIRED', '请先登录')

    const user = await getUserById(userId)
    if (!user) return fail(401, 'USER_NOT_FOUND', '用户不存在')

    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    } catch {
      return fail(400, 'INVALID_JSON', '请求数据格式不正确')
    }

    const inviteEmail = String(body.email || '').trim().toLowerCase()
    const role = String(body.role || 'member').trim().toLowerCase()
    const origin = String(body.origin || '').trim()
    if (!inviteEmail || !inviteEmail.includes('@')) {
      return fail(400, 'INVITE_EMAIL_INVALID', '邀请邮箱格式不正确')
    }
    if (!['member', 'admin'].includes(role)) {
      return fail(400, 'INVITE_ROLE_INVALID', '邀请角色仅支持 member 或 admin')
    }
    if (!origin || !origin.startsWith('http')) {
      return fail(400, 'INVITE_ORIGIN_INVALID', '邀请来源地址无效')
    }

    await ensureOrgTables()

    const operatorRows = await sql`
      SELECT o.id AS org_id, o.domain, m.role, m.status
      FROM org_members m
      JOIN orgs o ON o.id = m.org_id
      WHERE m.user_id = ${userId}
      ORDER BY m.created_at DESC
      LIMIT 1
    `
    if (!operatorRows.length) {
      return fail(403, 'ORG_REQUIRED', '请先创建或加入企业组织')
    }
    const operator = operatorRows[0]
    if (operator.status !== 'active') {
      return fail(403, 'ORG_MEMBER_INACTIVE', '当前组织成员状态不可用')
    }
    if (!['owner', 'admin'].includes(String(operator.role || '').toLowerCase())) {
      return fail(403, 'ORG_PERMISSION_DENIED', '仅企业管理员可邀请成员')
    }

    const inviteDomain = extractDomainFromEmail(inviteEmail)
    if (inviteDomain !== String(operator.domain).toLowerCase()) {
      return fail(400, 'INVITE_DOMAIN_MISMATCH', '仅可邀请企业同域邮箱')
    }

    const targetUsers = await sql`SELECT id FROM users WHERE email = ${inviteEmail} LIMIT 1`
    if (targetUsers.length) {
      const targetUserId = targetUsers[0].id
      const memberRows = await sql`
        SELECT id, status FROM org_members WHERE org_id = ${operator.org_id} AND user_id = ${targetUserId} LIMIT 1
      `
      if (memberRows.length && memberRows[0].status === 'active') {
        return fail(409, 'ORG_MEMBER_ALREADY_EXISTS', '该邮箱已是企业成员')
      }
    }

    const tokenValue = randomUUID().replace(/-/g, '')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    await sql`
      INSERT INTO org_invites (org_id, email, role, invite_token, expires_at, status)
      VALUES (${operator.org_id}, ${inviteEmail}, ${role}, ${tokenValue}, ${expiresAt}, 'pending')
    `

    const inviteUrl = `${origin.replace(/\/$/, '')}/org/invite/accept?token=${encodeURIComponent(tokenValue)}`
    return res.status(201).json({
      ok: true,
      invite: {
        email: inviteEmail,
        role,
        expires_at: expiresAt,
        invite_url: inviteUrl,
      },
    })
  } catch (e) {
    console.error('org/invite', e)
    return fail(500, 'ORG_INVITE_FAILED', '创建邀请失败，请稍后重试')
  }
}
