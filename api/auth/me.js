import { verifyToken, getUserById } from '../../lib/auth.js'
import { getOrgContextsByUserId } from '../../lib/orgs.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: '未登录' })
  }

  const userId = await verifyToken(token)
  if (!userId) {
    return res.status(401).json({ error: '登录已过期' })
  }

  const user = await getUserById(userId)
  if (!user) {
    return res.status(401).json({ error: '用户不存在' })
  }

  const orgs = await getOrgContextsByUserId(userId)
  const org = orgs.length ? orgs[0] : null
  return res.status(200).json({ user: { ...user, org, orgs } })
}
