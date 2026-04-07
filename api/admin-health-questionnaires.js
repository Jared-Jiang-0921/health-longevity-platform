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

export default async function handler(req, res) {
  const authz = await authorizeSiteAdmin(req)
  if (!authz.ok) {
    return fail(res, authz.status, authz.code, authz.error)
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return fail(res, 405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }

  try {
    const q = String(req.query.q || '').trim()
    const limit = parseLimit(req.query.limit)
    const offset = parseOffset(req.query.offset)
    const like = q ? `%${q}%` : null

    let totalRows
    let rows
    if (like) {
      totalRows = await sql`
        SELECT COUNT(*)::int AS c
        FROM health_questionnaires hq
        INNER JOIN users u ON u.id = hq.user_id
        WHERE u.email ILIKE ${like} OR u.name ILIKE ${like}
      `
      rows = await sql`
        SELECT
          hq.id,
          hq.user_id,
          u.email,
          u.name,
          hq.age_range,
          hq.sex,
          hq.region,
          hq.goals,
          hq.concerns,
          hq.medical_history,
          hq.medications,
          hq.allergies,
          hq.lifestyle,
          hq.sleep,
          hq.consent_health_data,
          hq.consent_care_plan,
          hq.consent_contact,
          hq.legal_version,
          hq.created_at,
          hq.updated_at
        FROM health_questionnaires hq
        INNER JOIN users u ON u.id = hq.user_id
        WHERE u.email ILIKE ${like} OR u.name ILIKE ${like}
        ORDER BY hq.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      totalRows = await sql`SELECT COUNT(*)::int AS c FROM health_questionnaires`
      rows = await sql`
        SELECT
          hq.id,
          hq.user_id,
          u.email,
          u.name,
          hq.age_range,
          hq.sex,
          hq.region,
          hq.goals,
          hq.concerns,
          hq.medical_history,
          hq.medications,
          hq.allergies,
          hq.lifestyle,
          hq.sleep,
          hq.consent_health_data,
          hq.consent_care_plan,
          hq.consent_contact,
          hq.legal_version,
          hq.created_at,
          hq.updated_at
        FROM health_questionnaires hq
        INNER JOIN users u ON u.id = hq.user_id
        ORDER BY hq.created_at DESC
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
      submissions: rows,
    })
  } catch (e) {
    console.error('admin-health-questionnaires', e)
    return fail(res, 500, 'ADMIN_HQ_FAILED', e?.message || '问卷管理接口失败')
  }
}
