import * as jose from 'jose'
import { sql } from './db.js'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-me-in-production'
)

const TOKEN_EXP = '7d'

export async function hashPassword(password) {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}

export async function createToken(userId) {
  return new jose.SignJWT({ sub: userId })
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

export async function getUserById(userId) {
  const rows = await sql`
    SELECT id, email, name, level, expires_at, created_at
    FROM users WHERE id = ${userId}
  `
  if (!rows.length) return null
  const u = rows[0]
  const now = new Date()
  let level = u.level
  if (u.expires_at && new Date(u.expires_at) < now) {
    level = 'free'
  }
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    level,
  }
}
