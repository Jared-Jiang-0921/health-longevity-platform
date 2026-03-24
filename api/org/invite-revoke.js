import { sql } from '../../lib/db.js'
import { verifyToken } from '../../lib/auth.js'
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

    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    } catch {
      return fail(400, 'INVALID_JSON', '请求数据格式不正确')
    }
    const inviteId = String(body.invite_id || '').trim()
    if (!inviteId) return fail(400, 'INVITE_ID_REQUIRED', '缺少 invite_id')

    await ensureOrgTables()
    const opRows = await sql`
      SELECT org_id, role, status
      FROM org_members
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `
    if (!opRows.length) return fail(403, 'ORG_REQUIRED', '请先创建或加入企业组织')
    const op = opRows[0]
    if (op.status !== 'active') return fail(403, 'ORG_MEMBER_INACTIVE', '当前组织成员状态不可用')
    if (!['owner', 'admin'].includes(String(op.role || '').toLowerCase())) {
      return fail(403, 'ORG_PERMISSION_DENIED', '仅企业管理员可执行该操作')
    }

    const rows = await sql`
      UPDATE org_invites
      SET status = 'revoked', updated_at = NOW()
      WHERE id = ${inviteId}
        AND org_id = ${op.org_id}
        AND status = 'pending'
      RETURNING id
    `
    if (!rows.length) return fail(404, 'INVITE_NOT_FOUND', '未找到可撤销的邀请')
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('org/invite-revoke', e)
    return fail(500, 'ORG_INVITE_REVOKE_FAILED', '撤销邀请失败，请稍后重试')
  }
}
