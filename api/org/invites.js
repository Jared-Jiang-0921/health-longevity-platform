import { sql } from '../../lib/db.js'
import { verifyToken } from '../../lib/auth.js'
import { ensureOrgTables } from '../../lib/orgs.js'

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
    }

    const auth = req.headers.authorization
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    const userId = await verifyToken(token)
    if (!userId) return fail(401, 'AUTH_REQUIRED', '请先登录')

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
      return fail(403, 'ORG_PERMISSION_DENIED', '仅企业管理员可查看邀请记录')
    }

    const invites = await sql`
      SELECT id, email, role, invite_token, expires_at, status, created_at, updated_at
      FROM org_invites
      WHERE org_id = ${op.org_id}
      ORDER BY created_at DESC
      LIMIT 300
    `
    return res.status(200).json({ ok: true, invites })
  } catch (e) {
    console.error('org/invites', e)
    return fail(500, 'ORG_INVITES_QUERY_FAILED', '查询邀请记录失败，请稍后重试')
  }
}
