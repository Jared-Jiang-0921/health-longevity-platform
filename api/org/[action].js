import { randomUUID } from 'node:crypto'
import { sql } from '../../lib/db.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { ensureOrgTables, extractDomainFromEmail, getOrgContextByUserId, normalizeDomain } from '../../lib/orgs.js'

function fail(res, status, code, error) {
  return res.status(status).json({ code, error })
}

function getAction(req) {
  const a = req.query?.action
  if (Array.isArray(a)) return String(a[0] || '').trim().toLowerCase()
  return String(a || '').trim().toLowerCase()
}

async function requireUser(req, res) {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  const userId = await verifyToken(token)
  if (!userId) {
    fail(res, 401, 'AUTH_REQUIRED', '请先登录')
    return null
  }
  const user = await getUserById(userId)
  if (!user) {
    fail(res, 401, 'USER_NOT_FOUND', '用户不存在')
    return null
  }
  return { userId, user }
}

function parseJson(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    fail(res, 400, 'INVALID_JSON', '请求数据格式不正确')
    return null
  }
}

async function getOperatorOrg(userId) {
  const rows = await sql`
    SELECT o.id AS org_id, o.domain, m.role, m.status
    FROM org_members m
    JOIN orgs o ON o.id = m.org_id
    WHERE m.user_id = ${userId}
    ORDER BY m.created_at DESC
    LIMIT 1
  `
  if (!rows.length) return null
  return rows[0]
}

function ensureOrgManager(res, operator) {
  if (!operator) return fail(res, 403, 'ORG_REQUIRED', '请先创建或加入企业组织')
  if (operator.status !== 'active') return fail(res, 403, 'ORG_MEMBER_INACTIVE', '当前组织成员状态不可用')
  if (!['owner', 'admin'].includes(String(operator.role || '').toLowerCase())) {
    return fail(res, 403, 'ORG_PERMISSION_DENIED', '仅企业管理员可执行该操作')
  }
  return null
}

async function handleCreate(req, res, authUser) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const body = parseJson(req, res)
  if (!body) return
  const orgName = String(body.name || '').trim()
  const inputDomain = normalizeDomain(body.domain)
  const emailDomain = extractDomainFromEmail(authUser.user.email)
  const domain = inputDomain || emailDomain
  if (!orgName) return fail(res, 400, 'ORG_NAME_REQUIRED', '企业名称必填')
  if (!domain) return fail(res, 400, 'ORG_DOMAIN_REQUIRED', '企业域名必填')
  if (!domain.includes('.')) return fail(res, 400, 'ORG_DOMAIN_INVALID', '企业域名格式不正确')
  if (domain !== emailDomain) return fail(res, 403, 'ORG_DOMAIN_MISMATCH', '仅可使用当前登录邮箱域名创建企业')

  const existing = await sql`SELECT id FROM orgs WHERE domain = ${domain} LIMIT 1`
  if (existing.length) return fail(res, 409, 'ORG_DOMAIN_EXISTS', '该企业域名已被绑定')

  const orgRows = await sql`
    INSERT INTO orgs (name, domain, owner_user_id, status)
    VALUES (${orgName.slice(0, 100)}, ${domain}, ${authUser.userId}, 'active')
    RETURNING id, name, domain, status
  `
  const org = orgRows[0]
  await sql`
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (${org.id}, ${authUser.userId}, 'owner', 'active')
    ON CONFLICT (org_id, user_id) DO NOTHING
  `
  return res.status(201).json({
    ok: true,
    org: { id: org.id, name: org.name, domain: org.domain, status: org.status, role: 'owner' },
  })
}

async function handleMe(req, res, authUser) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const org = await getOrgContextByUserId(authUser.userId)
  return res.status(200).json({ ok: true, org })
}

async function handleInvite(req, res, authUser) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const body = parseJson(req, res)
  if (!body) return
  const inviteEmail = String(body.email || '').trim().toLowerCase()
  const role = String(body.role || 'member').trim().toLowerCase()
  const origin = String(body.origin || '').trim()
  if (!inviteEmail || !inviteEmail.includes('@')) return fail(res, 400, 'INVITE_EMAIL_INVALID', '邀请邮箱格式不正确')
  if (!['member', 'admin'].includes(role)) return fail(res, 400, 'INVITE_ROLE_INVALID', '邀请角色仅支持 member 或 admin')
  if (!origin || !origin.startsWith('http')) return fail(res, 400, 'INVITE_ORIGIN_INVALID', '邀请来源地址无效')

  const operator = await getOperatorOrg(authUser.userId)
  const denied = ensureOrgManager(res, operator)
  if (denied) return denied

  const inviteDomain = extractDomainFromEmail(inviteEmail)
  if (inviteDomain !== String(operator.domain).toLowerCase()) {
    return fail(res, 400, 'INVITE_DOMAIN_MISMATCH', '仅可邀请企业同域邮箱')
  }

  const targetUsers = await sql`SELECT id FROM users WHERE email = ${inviteEmail} LIMIT 1`
  if (targetUsers.length) {
    const memberRows = await sql`
      SELECT id, status FROM org_members WHERE org_id = ${operator.org_id} AND user_id = ${targetUsers[0].id} LIMIT 1
    `
    if (memberRows.length && memberRows[0].status === 'active') {
      return fail(res, 409, 'ORG_MEMBER_ALREADY_EXISTS', '该邮箱已是企业成员')
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
    invite: { email: inviteEmail, role, expires_at: expiresAt, invite_url: inviteUrl },
  })
}

async function handleInviteAccept(req, res, authUser) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const body = parseJson(req, res)
  if (!body) return
  const inviteToken = String(body.token || '').trim()
  if (!inviteToken) return fail(res, 400, 'INVITE_TOKEN_REQUIRED', '缺少邀请 token')

  const rows = await sql`
    SELECT i.id, i.org_id, i.email, i.role, i.status, i.expires_at, o.name AS org_name, o.domain AS org_domain
    FROM org_invites i
    JOIN orgs o ON o.id = i.org_id
    WHERE i.invite_token = ${inviteToken}
    LIMIT 1
  `
  if (!rows.length) return fail(res, 404, 'INVITE_NOT_FOUND', '邀请不存在或已失效')
  const invite = rows[0]
  if (invite.status !== 'pending') return fail(res, 409, 'INVITE_ALREADY_USED', '该邀请已被使用或失效')
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await sql`UPDATE org_invites SET status = 'expired', updated_at = NOW() WHERE id = ${invite.id}`
    return fail(res, 410, 'INVITE_EXPIRED', '邀请已过期')
  }
  if (String(invite.email).toLowerCase() !== String(authUser.user.email).toLowerCase()) {
    return fail(res, 403, 'INVITE_EMAIL_MISMATCH', '该邀请不属于当前登录邮箱')
  }

  await sql`
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (${invite.org_id}, ${authUser.userId}, ${invite.role}, 'active')
    ON CONFLICT (org_id, user_id)
    DO UPDATE SET role = EXCLUDED.role, status = 'active', updated_at = NOW()
  `
  await sql`UPDATE org_invites SET status = 'accepted', updated_at = NOW() WHERE id = ${invite.id}`
  return res.status(200).json({
    ok: true,
    org: { id: invite.org_id, name: invite.org_name, domain: invite.org_domain, role: invite.role },
  })
}

async function handleMembers(req, res, authUser) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const operator = await getOperatorOrg(authUser.userId)
  if (!operator) return fail(res, 403, 'ORG_REQUIRED', '请先创建或加入企业组织')
  if (operator.status !== 'active') return fail(res, 403, 'ORG_MEMBER_INACTIVE', '当前组织成员状态不可用')

  const members = await sql`
    SELECT m.id, m.user_id, m.role, m.status, m.created_at, u.email, u.name
    FROM org_members m
    JOIN users u ON u.id = m.user_id
    WHERE m.org_id = ${operator.org_id}
    ORDER BY m.created_at ASC
  `
  return res.status(200).json({ ok: true, members })
}

async function handleInvites(req, res, authUser) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const operator = await getOperatorOrg(authUser.userId)
  const denied = ensureOrgManager(res, operator)
  if (denied) return denied
  const invites = await sql`
    SELECT id, email, role, invite_token, expires_at, status, created_at, updated_at
    FROM org_invites
    WHERE org_id = ${operator.org_id}
    ORDER BY created_at DESC
    LIMIT 300
  `
  return res.status(200).json({ ok: true, invites })
}

async function handleInviteRevoke(req, res, authUser) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const body = parseJson(req, res)
  if (!body) return
  const inviteId = String(body.invite_id || '').trim()
  if (!inviteId) return fail(res, 400, 'INVITE_ID_REQUIRED', '缺少 invite_id')

  const operator = await getOperatorOrg(authUser.userId)
  const denied = ensureOrgManager(res, operator)
  if (denied) return denied
  const rows = await sql`
    UPDATE org_invites
    SET status = 'revoked', updated_at = NOW()
    WHERE id = ${inviteId}
      AND org_id = ${operator.org_id}
      AND status = 'pending'
    RETURNING id
  `
  if (!rows.length) return fail(res, 404, 'INVITE_NOT_FOUND', '未找到可撤销的邀请')
  return res.status(200).json({ ok: true })
}

async function handleInviteResend(req, res, authUser) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }
  const body = parseJson(req, res)
  if (!body) return
  const inviteId = String(body.invite_id || '').trim()
  const origin = String(body.origin || '').trim()
  if (!inviteId) return fail(res, 400, 'INVITE_ID_REQUIRED', '缺少 invite_id')
  if (!origin || !origin.startsWith('http')) return fail(res, 400, 'INVITE_ORIGIN_INVALID', '邀请来源地址无效')

  const operator = await getOperatorOrg(authUser.userId)
  const denied = ensureOrgManager(res, operator)
  if (denied) return denied

  const tokenValue = randomUUID().replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const rows = await sql`
    UPDATE org_invites
    SET status = 'pending',
        invite_token = ${tokenValue},
        expires_at = ${expiresAt},
        updated_at = NOW()
    WHERE id = ${inviteId}
      AND org_id = ${operator.org_id}
    RETURNING email, role
  `
  if (!rows.length) return fail(res, 404, 'INVITE_NOT_FOUND', '未找到邀请记录')
  const inviteUrl = `${origin.replace(/\/$/, '')}/org/invite/accept?token=${encodeURIComponent(tokenValue)}`
  return res.status(200).json({
    ok: true,
    invite: { email: rows[0].email, role: rows[0].role, expires_at: expiresAt, invite_url: inviteUrl },
  })
}

export default async function handler(req, res) {
  try {
    await ensureOrgTables()
    const action = getAction(req)
    const authUser = await requireUser(req, res)
    if (!authUser) return

    if (action === 'create') return handleCreate(req, res, authUser)
    if (action === 'me') return handleMe(req, res, authUser)
    if (action === 'invite') return handleInvite(req, res, authUser)
    if (action === 'invite-accept') return handleInviteAccept(req, res, authUser)
    if (action === 'members') return handleMembers(req, res, authUser)
    if (action === 'invites') return handleInvites(req, res, authUser)
    if (action === 'invite-revoke') return handleInviteRevoke(req, res, authUser)
    if (action === 'invite-resend') return handleInviteResend(req, res, authUser)

    res.setHeader('Allow', 'GET,POST')
    return fail(res, 404, 'ORG_ACTION_NOT_FOUND', '企业接口不存在')
  } catch (e) {
    console.error('org/[action]', e)
    return fail(res, 500, 'ORG_API_FAILED', '企业接口处理失败，请稍后重试')
  }
}
