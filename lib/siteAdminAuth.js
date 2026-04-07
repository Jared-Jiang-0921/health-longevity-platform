import { verifyToken, getUserById } from './auth.js'
import { parseSiteAdminEmails } from './siteAdminEmails.js'

/**
 * 整站用户管理接口鉴权（与支付巡检 PAYMENT_LOGS_* 独立，可分别配置）
 * 1) SITE_ADMIN_TOKEN + 请求头 x-site-admin-token
 * 2) SITE_ADMIN_EMAILS 邮箱白名单 + 已登录 JWT
 */
export async function authorizeSiteAdmin(req) {
  const adminToken = String(process.env.SITE_ADMIN_TOKEN || '').trim()
  const requestToken = String(req.headers['x-site-admin-token'] || '').trim()
  if (adminToken && requestToken && requestToken === adminToken) {
    return { ok: true, admin: 'site_admin_token' }
  }

  const auth = req.headers.authorization
  const jwt = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!jwt) {
    return { ok: false, status: 401, code: 'AUTH_REQUIRED', error: '请先登录' }
  }

  const userId = await verifyToken(jwt)
  if (!userId) {
    return { ok: false, status: 401, code: 'AUTH_EXPIRED', error: '登录已过期' }
  }

  const user = await getUserById(userId)
  if (!user?.email) {
    return { ok: false, status: 403, code: 'SITE_ADMIN_FORBIDDEN', error: '无整站管理权限' }
  }

  const allow = parseSiteAdminEmails()
  if (!allow.includes(String(user.email).toLowerCase().trim())) {
    return { ok: false, status: 403, code: 'SITE_ADMIN_FORBIDDEN', error: '无整站管理权限' }
  }

  return { ok: true, admin: user.email }
}
