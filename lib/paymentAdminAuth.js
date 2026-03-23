import { verifyToken, getUserById } from './auth.js'

function parseAdminEmails() {
  return String(process.env.PAYMENT_LOGS_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function authorizePaymentLogsAdmin(req) {
  const adminToken = String(process.env.PAYMENT_LOGS_ADMIN_TOKEN || '').trim()
  const requestAdminToken = String(req.headers['x-admin-token'] || '').trim()
  if (adminToken && requestAdminToken && requestAdminToken === adminToken) {
    return { ok: true, admin: 'admin_token' }
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return { ok: false, status: 401, code: 'AUTH_REQUIRED', error: '请先登录管理员账号' }
  }

  const userId = await verifyToken(token)
  if (!userId) {
    return { ok: false, status: 401, code: 'AUTH_EXPIRED', error: '登录已过期' }
  }

  const user = await getUserById(userId)
  if (!user?.email) {
    return { ok: false, status: 403, code: 'ADMIN_FORBIDDEN', error: '仅管理员可访问' }
  }

  const allowEmails = parseAdminEmails()
  if (!allowEmails.includes(String(user.email).toLowerCase().trim())) {
    return { ok: false, status: 403, code: 'ADMIN_FORBIDDEN', error: '仅管理员可访问' }
  }

  return { ok: true, admin: user.email }
}
