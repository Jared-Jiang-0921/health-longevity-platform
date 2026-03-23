import * as jose from 'jose'
import bcrypt from 'bcryptjs'
import { sql } from './db.js'

const jwtSecretRaw = process.env.JWT_SECRET?.trim()
if (!jwtSecretRaw && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
  throw new Error('JWT_SECRET must be set in production / on Vercel')
}
const JWT_SECRET = new TextEncoder().encode(
  jwtSecretRaw || 'dev-only-unsafe-change-me'
)

const TOKEN_EXP = '7d'

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export async function createToken(userId) {
  const sub = String(userId ?? '').trim()
  if (!sub) {
    throw new Error('createToken: empty user id')
  }
  return new jose.SignJWT({})
    .setSubject(sub)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXP)
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return payload.sub
  } catch {
    return null
  }
}

/** 与前端 normalizeLevel 一致：接口与外链只输出 free | standard | premium */
function coerceUserLevel(raw) {
  if (raw == null || raw === '') return 'free'
  const s = String(raw).toLowerCase().trim()
  if (s === 'free' || s === 'standard' || s === 'premium') return s
  return 'free'
}

export async function getUserById(userId) {
  const rows = await sql`
    SELECT id, email, name, level, expires_at, created_at
    FROM users WHERE id = ${userId}
  `
  if (!rows.length) return null
  const u = rows[0]
  const now = new Date()
  let level = coerceUserLevel(u.level)
  if (u.expires_at && new Date(u.expires_at) < now) {
    level = 'free'
  }
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    level,
    /** ISO 8601，付费会员到期时间；未开通或普通会员为 null */
    expires_at: u.expires_at ? new Date(u.expires_at).toISOString() : null,
  }
}
