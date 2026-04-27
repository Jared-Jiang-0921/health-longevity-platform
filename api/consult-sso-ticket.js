import * as jose from 'jose'
import { verifyToken, getUserById } from '../lib/auth.js'

const TTL_SECONDS = 90

function getSecret() {
  const raw = String(process.env.CONSULT_SSO_SECRET || '').trim()
  return raw ? new TextEncoder().encode(raw) : null
}

function parseBearer(req) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return ''
  return auth.slice(7).trim()
}

function normalizeEntry(raw) {
  const s = String(raw || '').trim().toLowerCase()
  return s === 'professional' ? 'professional' : 'general'
}

function normalizeLang(raw) {
  const s = String(raw || '').trim().toLowerCase()
  if (s === 'zh' || s === 'zh-cn') return 'zh-CN'
  if (s === 'ar') return 'ar'
  return 'en'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const secret = getSecret()
  if (!secret) {
    return res.status(503).json({ error: 'CONSULT_SSO_SECRET 未配置' })
  }
  const jwt = parseBearer(req)
  if (!jwt) return res.status(401).json({ error: '请先登录' })
  const userId = await verifyToken(jwt)
  if (!userId) return res.status(401).json({ error: '登录已过期' })
  const user = await getUserById(userId)
  if (!user) return res.status(401).json({ error: '用户不存在' })

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  } catch {
    return res.status(400).json({ error: '请求数据格式不正确' })
  }
  const entry = normalizeEntry(body.entry)
  const consultType = entry === 'professional' ? 'professional advisor' : 'general wellness'
  const lang = normalizeLang(body.lang)
  const now = Math.floor(Date.now() / 1000)
  const token = await new jose.SignJWT({
    uid: String(user.id),
    email: String(user.email || ''),
    name: String(user.name || ''),
    level: String(user.level || 'free'),
    entry,
    consult_type: consultType,
    advisor_type: consultType,
    persona: entry === 'professional' ? 'professional_advisor' : 'general_wellness',
    lang,
  })
    .setIssuer('healthlongevity')
    .setAudience('longevityconsult')
    .setIssuedAt(now)
    .setExpirationTime(now + TTL_SECONDS)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(secret)

  return res.status(200).json({
    ok: true,
    token,
    expires_in: TTL_SECONDS,
    entry,
    lang,
  })
}

