import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'

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
      return res.status(200).json({ ok: true, user: urows[0], updated: updates })
    }

    res.setHeader('Allow', 'GET, PATCH')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  } catch (e) {
    console.error('admin-users', e)
    return fail(res, 500, 'ADMIN_USERS_FAILED', e?.message || '用户管理接口失败')
  }
}
