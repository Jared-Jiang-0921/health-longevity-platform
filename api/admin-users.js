import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'
import { hashPassword } from '../lib/auth.js'
import { isSiteAdminEmail } from '../lib/siteAdminEmails.js'

function fail(res, status, code, error) {
  return res.status(status).json({ code, error })
}

function parseLimit(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 50
  return Math.min(200, Math.floor(n))
}

function parseOffset(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

function coerceLevel(raw) {
  if (raw == null || raw === '') return null
  const s = String(raw).toLowerCase().trim()
  if (s === 'free' || s === 'standard' || s === 'premium') return s
  return null
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(s) {
  return typeof s === 'string' && UUID_RE.test(s)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-z0-9_\u4e00-\u9fff][a-z0-9_\-\u4e00-\u9fff]{1,31}$/

function normalizeLoginId(raw) {
  return String(raw || '').trim().toLowerCase()
}

function loginIdError(loginId) {
  if (!loginId) return '请填写用户名或邮箱'
  if (loginId.includes('@')) {
    return EMAIL_RE.test(loginId) ? null : '邮箱格式不正确'
  }
  if (!USERNAME_RE.test(loginId)) {
    return '用户名须为 2–32 位，可用字母、数字、下划线或中文，不能有空格'
  }
  return null
}

function parseExpiresAt(raw) {
  if (raw === null || raw === '') return { ok: true, value: null }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return { ok: false }
  return { ok: true, value: d.toISOString() }
}

function parseExpiresInDays(raw) {
  if (raw == null || raw === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0 || n > 3650) return undefined
  return new Date(Date.now() + Math.floor(n) * 24 * 60 * 60 * 1000).toISOString()
}

function publicUserRow(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    level: row.level,
    expires_at: row.expires_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export default async function handler(req, res) {
  const authz = await authorizeSiteAdmin(req)
  if (!authz.ok) {
    return fail(res, authz.status, authz.code, authz.error)
  }

  try {
    if (req.method === 'GET') {
      const q = String(req.query.q || '').trim()
      const limit = parseLimit(req.query.limit)
      const offset = parseOffset(req.query.offset)
      const like = q ? `%${q}%` : null

      let totalRows
      let rows
      if (like) {
        totalRows = await sql`
          SELECT COUNT(*)::int AS c FROM users
          WHERE email ILIKE ${like} OR name ILIKE ${like}
        `
        rows = await sql`
          SELECT id, email, name, level, expires_at, created_at, updated_at
          FROM users
          WHERE email ILIKE ${like} OR name ILIKE ${like}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      } else {
        totalRows = await sql`SELECT COUNT(*)::int AS c FROM users`
        rows = await sql`
          SELECT id, email, name, level, expires_at, created_at, updated_at
          FROM users
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      }

      const total = totalRows[0]?.c ?? 0
      return res.status(200).json({
        ok: true,
        admin: authz.admin,
        total,
        limit,
        offset,
        users: rows,
      })
    }

    if (req.method === 'PATCH') {
      let body = {}
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      } catch {
        return fail(res, 400, 'INVALID_JSON', '请求数据格式不正确')
      }

      const userId = String(body.user_id || '').trim()
      if (!userId) return fail(res, 400, 'USER_ID_REQUIRED', '缺少 user_id')
      if (!isUuid(userId)) return fail(res, 400, 'USER_ID_INVALID', 'user_id 不是有效 UUID')

      const existing = await sql`SELECT id FROM users WHERE id = ${userId} LIMIT 1`
      if (!existing.length) return fail(res, 404, 'USER_NOT_FOUND', '用户不存在')

      const updates = []
      if (body.name !== undefined) {
        const name = String(body.name || '').trim().slice(0, 80)
        if (!name) return fail(res, 400, 'NAME_INVALID', '姓名不能为空')
        await sql`UPDATE users SET name = ${name}, updated_at = NOW() WHERE id = ${userId}`
        updates.push('name')
      }
      if (body.level !== undefined) {
        const level = coerceLevel(body.level)
        if (!level) return fail(res, 400, 'LEVEL_INVALID', 'level 仅支持 free / standard / premium')
        await sql`UPDATE users SET level = ${level}, updated_at = NOW() WHERE id = ${userId}`
        updates.push('level')
      }
      if (body.expires_at !== undefined) {
        if (body.expires_at === null || body.expires_at === '') {
          await sql`UPDATE users SET expires_at = NULL, updated_at = NOW() WHERE id = ${userId}`
        } else {
          const d = new Date(body.expires_at)
          if (Number.isNaN(d.getTime())) {
            return fail(res, 400, 'EXPIRES_AT_INVALID', 'expires_at 格式无效，请使用 ISO 8601')
          }
          await sql`UPDATE users SET expires_at = ${d.toISOString()}, updated_at = NOW() WHERE id = ${userId}`
        }
        updates.push('expires_at')
      }

      if (!updates.length) {
        return fail(res, 400, 'NO_FIELDS', '未提供可更新字段（name / level / expires_at）')
      }

      const urows = await sql`
        SELECT id, email, name, level, expires_at, created_at, updated_at
        FROM users WHERE id = ${userId} LIMIT 1
      `
      return res.status(200).json({ ok: true, user: publicUserRow(urows[0]), updated: updates })
    }

    if (req.method === 'POST') {
      let body = {}
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      } catch {
        return fail(res, 400, 'INVALID_JSON', '请求数据格式不正确')
      }

      const email = normalizeLoginId(body.username || body.email)
      const password = String(body.password || '')
      const name = String(body.name || email.split('@')[0] || email || '用户').trim().slice(0, 80)
      const level = coerceLevel(body.level) || 'free'

      const idErr = loginIdError(email)
      if (idErr) {
        return fail(res, 400, 'LOGIN_ID_INVALID', idErr)
      }
      if (!password || password.length < 6) {
        return fail(res, 400, 'PASSWORD_INVALID', '密码至少 6 位')
      }
      if (!name) {
        return fail(res, 400, 'NAME_INVALID', '姓名不能为空')
      }

      const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
      if (existing.length) {
        return fail(res, 409, 'EMAIL_TAKEN', '该账号已存在')
      }

      let expiresIso = null
      if (body.expires_at !== undefined) {
        const parsed = parseExpiresAt(body.expires_at)
        if (!parsed.ok) return fail(res, 400, 'EXPIRES_AT_INVALID', 'expires_at 格式无效，请使用 ISO 8601')
        expiresIso = parsed.value
      } else if (body.expires_in_days != null && body.expires_in_days !== '') {
        const fromDays = parseExpiresInDays(body.expires_in_days)
        if (fromDays === undefined) {
          return fail(res, 400, 'EXPIRES_IN_DAYS_INVALID', 'expires_in_days 须为 1–3650 的正整数')
        }
        expiresIso = fromDays
      }

      const password_hash = await hashPassword(password)
      const rows = await sql`
        INSERT INTO users (email, name, password_hash, level, expires_at)
        VALUES (${email}, ${name}, ${password_hash}, ${level}, ${expiresIso})
        RETURNING id, email, name, level, expires_at, created_at, updated_at
      `
      return res.status(201).json({ ok: true, user: publicUserRow(rows[0]) })
    }

    if (req.method === 'DELETE') {
      let body = {}
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      } catch {
        body = {}
      }
      const userId = String(body.user_id || req.query.user_id || '').trim()
      if (!userId) return fail(res, 400, 'USER_ID_REQUIRED', '缺少 user_id')
      if (!isUuid(userId)) return fail(res, 400, 'USER_ID_INVALID', 'user_id 不是有效 UUID')

      const existing = await sql`SELECT id, email FROM users WHERE id = ${userId} LIMIT 1`
      if (!existing.length) return fail(res, 404, 'USER_NOT_FOUND', '用户不存在')

      const targetEmail = String(existing[0].email || '').toLowerCase().trim()
      if (isSiteAdminEmail(targetEmail)) {
        return fail(res, 403, 'CANNOT_DELETE_SITE_ADMIN', '不能删除整站管理员账号')
      }
      if (authz.admin && String(authz.admin).toLowerCase() === targetEmail) {
        return fail(res, 403, 'CANNOT_DELETE_SELF', '不能删除当前登录的管理员账号')
      }

      await sql`DELETE FROM users WHERE id = ${userId}`
      return res.status(200).json({ ok: true, deleted_id: userId })
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  } catch (e) {
    console.error('admin-users', e)
    return fail(res, 500, 'ADMIN_USERS_FAILED', e?.message || '用户管理接口失败')
  }
}
