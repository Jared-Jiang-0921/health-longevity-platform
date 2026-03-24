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

    const members = await sql`
      SELECT
        m.id,
        m.user_id,
        m.role,
        m.status,
        m.created_at,
        u.email,
        u.name
      FROM org_members m
      JOIN users u ON u.id = m.user_id
      WHERE m.org_id = ${op.org_id}
      ORDER BY m.created_at ASC
    `
    return res.status(200).json({ ok: true, members })
  } catch (e) {
    console.error('org/members', e)
    return fail(500, 'ORG_MEMBERS_QUERY_FAILED', '查询成员失败，请稍后重试')
  }
}
