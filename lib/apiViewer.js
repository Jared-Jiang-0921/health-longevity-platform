import { authorizeSiteAdmin } from './siteAdminAuth.js'
import { verifyToken, getUserById } from './auth.js'
import { parseSiteAdminEmails } from './siteAdminEmails.js'

/** 从 Authorization 或（可选）?access_token= 读取 JWT */
export function readJwtFromRequest(req, { allowQueryToken = false } = {}) {
  const auth = req.headers?.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  if (!allowQueryToken) return null
  const q = req.query?.access_token
  const raw = Array.isArray(q) ? q[0] : q
  const fromQuery = String(raw || '').trim()
  return fromQuery || null
}

/**
 * 解析当前请求查看者：整站管理员 / 站点 token / 登录会员 / 游客
 * @param {import('http').IncomingMessage} req
 * @param {{ allowQueryToken?: boolean }} [options] 媒体 GET 需 true（video/audio 标签）
 */
export async function getApiViewer(req, { allowQueryToken = false } = {}) {
  const adminAuth = await authorizeSiteAdmin(req)
  if (adminAuth.ok) {
    return { isAdmin: true, level: 'premium', isGuest: false }
  }

  const requestAdminToken = String(req.headers['x-site-admin-token'] || '').trim()
  const configAdminToken = String(process.env.SITE_ADMIN_TOKEN || '').trim()
  if (configAdminToken && requestAdminToken && requestAdminToken === configAdminToken) {
    return { isAdmin: true, level: 'premium', isGuest: false }
  }

  const jwt = readJwtFromRequest(req, { allowQueryToken })
  if (!jwt) return { isAdmin: false, level: 'free', isGuest: true }

  const userId = await verifyToken(jwt)
  if (!userId) return { isAdmin: false, level: 'free', isGuest: true }

  const user = await getUserById(userId)
  if (!user) return { isAdmin: false, level: 'free', isGuest: true }

  const allow = parseSiteAdminEmails()
  const isAdmin = allow.includes(String(user.email || '').toLowerCase().trim())
  return { isAdmin, level: user.level || 'free', isGuest: false }
}
