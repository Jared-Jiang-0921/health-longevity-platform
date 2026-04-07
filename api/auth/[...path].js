/**
 * 合并认证相关 API，避免 Vercel Hobby 单项目 Serverless Functions 数量上限。
 * 覆盖路径：/api/auth/*
 */
import forgotPassword from '../../lib/api-handlers/auth/forgot-password.js'
import login from '../../lib/api-handlers/auth/login.js'
import login2fa from '../../lib/api-handlers/auth/login-2fa.js'
import me from '../../lib/api-handlers/auth/me.js'
import register from '../../lib/api-handlers/auth/register.js'
import resetPassword from '../../lib/api-handlers/auth/reset-password.js'
import totpDisable from '../../lib/api-handlers/auth/totp-disable.js'
import totpEnable from '../../lib/api-handlers/auth/totp-enable.js'
import totpSetup from '../../lib/api-handlers/auth/totp-setup.js'

const ROUTES = {
  login,
  register,
  me,
  'login-2fa': login2fa,
  'forgot-password': forgotPassword,
  'reset-password': resetPassword,
  'totp-setup': totpSetup,
  'totp-enable': totpEnable,
  'totp-disable': totpDisable,
}

function resolvePath(req) {
  const q = req.query?.path
  if (Array.isArray(q)) return q.filter(Boolean).join('/')
  if (typeof q === 'string' && q.trim()) return q.trim()
  try {
    const u = new URL(req.url || '/', 'http://localhost')
    return u.pathname.replace(/^\/api\/auth\/?/i, '').replace(/\/$/, '') || ''
  } catch {
    return ''
  }
}

export default async function handler(req, res) {
  const p = resolvePath(req)
  const key = String(p)
    .split('/')
    .filter(Boolean)[0]
    ?.toLowerCase()
    .trim()
  const fn = key ? ROUTES[key] : null
  if (!fn) {
    return res.status(404).json({ error: 'Not found' })
  }
  return fn(req, res)
}
