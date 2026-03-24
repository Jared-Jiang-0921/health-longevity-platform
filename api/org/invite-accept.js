import { sql } from '../../lib/db.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { ensureOrgTables } from '../../lib/orgs.js'

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

    const inviteToken = String(body.token || '').trim()
    if (!inviteToken) return fail(400, 'INVITE_TOKEN_REQUIRED', '缺少邀请 token')

    await ensureOrgTables()

    const rows = await sql`
      SELECT
        i.id,
        i.org_id,
        i.email,
        i.role,
        i.status,
        i.expires_at,
        o.name AS org_name,
        o.domain AS org_domain
      FROM org_invites i
      JOIN orgs o ON o.id = i.org_id
      WHERE i.invite_token = ${inviteToken}
      LIMIT 1
    `
    if (!rows.length) return fail(404, 'INVITE_NOT_FOUND', '邀请不存在或已失效')
    const invite = rows[0]

    if (invite.status !== 'pending') {
      return fail(409, 'INVITE_ALREADY_USED', '该邀请已被使用或失效')
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      await sql`UPDATE org_invites SET status = 'expired', updated_at = NOW() WHERE id = ${invite.id}`
      return fail(410, 'INVITE_EXPIRED', '邀请已过期')
    }

    if (String(invite.email).toLowerCase() !== String(user.email).toLowerCase()) {
      return fail(403, 'INVITE_EMAIL_MISMATCH', '该邀请不属于当前登录邮箱')
    }

    await sql`
      INSERT INTO org_members (org_id, user_id, role, status)
      VALUES (${invite.org_id}, ${userId}, ${invite.role}, 'active')
      ON CONFLICT (org_id, user_id)
      DO UPDATE SET
        role = EXCLUDED.role,
        status = 'active',
        updated_at = NOW()
    `

    await sql`
      UPDATE org_invites
      SET status = 'accepted', updated_at = NOW()
      WHERE id = ${invite.id}
    `

    return res.status(200).json({
      ok: true,
      org: {
        id: invite.org_id,
        name: invite.org_name,
        domain: invite.org_domain,
        role: invite.role,
      },
    })
  } catch (e) {
    console.error('org/invite-accept', e)
    return fail(500, 'ORG_INVITE_ACCEPT_FAILED', '接受邀请失败，请稍后重试')
  }
}
