import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'
import { getCourseById } from '../src/data/courses.js'

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS course_modules_custom (
      course_id INTEGER PRIMARY KEY,
      modules_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

function parseJson(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.status(400).json({ error: '请求数据格式不正确' })
    return null
  }
}

function normalizeModule(item) {
  const type = item?.type === 'video' ? 'video' : 'document'
  const title = String(item?.title || '').trim().slice(0, 200)
  const duration = String(item?.duration || '').trim().slice(0, 40)
  const content = String(item?.content || '').trim().slice(0, 12000)
  const videoUrl = String(item?.videoUrl || '').trim().slice(0, 2000)
  const embedUrl = String(item?.embedUrl || '').trim().slice(0, 2000)
  return {
    type,
    title,
    ...(duration ? { duration } : {}),
    ...(content ? { content } : {}),
    ...(videoUrl ? { videoUrl } : {}),
    ...(embedUrl ? { embedUrl } : {}),
  }
}

function resolveCourseId(req, body) {
  const fromQuery = Number(req.query?.courseId)
  if (Number.isInteger(fromQuery) && fromQuery > 0) return fromQuery
  const fromBody = Number(body?.courseId)
  if (Number.isInteger(fromBody) && fromBody > 0) return fromBody
  return 0
}

async function readModules(courseId) {
  const rows = await sql`
    SELECT modules_json
    FROM course_modules_custom
    WHERE course_id = ${courseId}
    LIMIT 1
  `
  if (rows.length) {
    const custom = rows[0]?.modules_json
    return Array.isArray(custom) ? custom.map(normalizeModule) : []
  }
  const base = getCourseById(courseId)
  return Array.isArray(base?.modules) ? base.modules.map(normalizeModule) : []
}

export default async function handler(req, res) {
  try {
    await ensureSchema()
    if (req.method === 'GET') {
      const courseId = resolveCourseId(req)
      if (!courseId) return res.status(400).json({ error: '缺少有效 courseId' })
      const modules = await readModules(courseId)
      return res.status(200).json({ ok: true, courseId, modules })
    }

    if (req.method === 'PATCH') {
      const auth = await authorizeSiteAdmin(req)
      if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })
      const body = parseJson(req, res)
      if (!body) return
      const courseId = resolveCourseId(req, body)
      if (!courseId) return res.status(400).json({ error: '缺少有效 courseId' })
      if (!Array.isArray(body.modules)) return res.status(400).json({ error: 'modules 必须是数组' })
      const modules = body.modules.map(normalizeModule).filter((m) => m.title)
      await sql`
        INSERT INTO course_modules_custom (course_id, modules_json, updated_at)
        VALUES (${courseId}, ${JSON.stringify(modules)}::jsonb, NOW())
        ON CONFLICT (course_id)
        DO UPDATE SET modules_json = EXCLUDED.modules_json, updated_at = NOW()
      `
      return res.status(200).json({ ok: true, courseId, modules })
    }

    res.setHeader('Allow', 'GET, PATCH')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('course-modules api error', e)
    return res.status(500).json({ error: e?.message || '课程模块接口失败' })
  }
}

