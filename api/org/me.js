import { verifyToken } from '../../lib/auth.js'
import { getOrgContextByUserId } from '../../lib/orgs.js'

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
    if (!userId) {
      return fail(401, 'AUTH_REQUIRED', '请先登录')
    }

    const org = await getOrgContextByUserId(userId)
    return res.status(200).json({ ok: true, org })
  } catch (e) {
    console.error('org/me', e)
    return fail(500, 'ORG_QUERY_FAILED', '查询企业信息失败，请稍后重试')
  }
}
