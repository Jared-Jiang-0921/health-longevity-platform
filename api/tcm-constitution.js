/**
 * 体质辨识（标准会员及以上）
 * GET  /api/tcm-constitution  最近一次
 * POST /api/tcm-constitution { answers, tongue, consentHealthData, redFlagNow }
 * 舌象只存用户确认过的特征，不存照片，也不改问卷分数。
 */
import { verifyToken, getUserById } from '../lib/auth.js'
import { canViewContent } from '../lib/contentAccess.js'
import { sql } from '../lib/db.js'
import { SITE_LEGAL } from '../src/data/siteLegal.js'
import { constitutionSummary, scoreConstitution } from '../src/lib/tcmConstitution/score.js'

let tableReady = false

function getToken(req) {
  const auth = req.headers.authorization
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
}

async function ensureTable() {
  if (tableReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS tcm_constitution_assessments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      answers_json JSONB NOT NULL,
      tongue_json JSONB,
      result_json JSONB NOT NULL,
      summary_text TEXT NOT NULL,
      legal_version TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_tcm_constitution_user ON tcm_constitution_assessments(user_id, created_at DESC)`
  tableReady = true
}

async function requireStandard(req, res) {
  const token = getToken(req)
  if (!token) {
    res.status(401).json({ error: '未登录' })
    return null
  }
  const userId = await verifyToken(token)
  if (!userId) {
    res.status(401).json({ error: '登录已过期' })
    return null
  }
  const user = await getUserById(userId)
  if (!user || !canViewContent(user.level, 'standard', { isGuest: false })) {
    res.status(403).json({ error: '体质辨识仅向标准会员及以上开放' })
    return null
  }
  return userId
}

export default async function handler(req, res) {
  const userId = await requireStandard(req, res)
  if (!userId) return

  try {
    await ensureTable()
  } catch (e) {
    return res.status(500).json({ error: e.message || '数据库未就绪' })
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT id, answers_json, tongue_json, result_json, summary_text, created_at, updated_at
      FROM tcm_constitution_assessments
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `
    const row = rows[0]
    return res.status(200).json({
      latest: row
        ? {
          id: row.id,
          answers: row.answers_json,
          tongue: row.tongue_json,
          result: row.result_json,
          summary: row.summary_text,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }
        : null,
      constitutionSummary: row?.summary_text || '',
    })
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    if (body.consentHealthData !== true) {
      return res.status(400).json({ error: '提交前请先同意健康数据告知' })
    }
    if (body.redFlagNow === true) {
      return res.status(400).json({
        error: '你描述的是正在发生的急症。请先联系急救或去急诊，这次不生成体质结果。',
        code: 'RED_FLAG',
      })
    }
    if (body.redFlagNow !== false) {
      return res.status(400).json({ error: '请先确认现在没有急症表现' })
    }

    const computed = scoreConstitution(body.answers || {}, body.tongue || null)
    if (!computed.ok) return res.status(400).json({ error: computed.error || '题目未完成' })
    const summary = constitutionSummary(computed)
    const tongue = computed.tongue
    const rows = await sql`
      INSERT INTO tcm_constitution_assessments (
        user_id, answers_json, tongue_json, result_json, summary_text, legal_version
      ) VALUES (
        ${userId},
        ${JSON.stringify(body.answers)}::jsonb,
        ${JSON.stringify(tongue)}::jsonb,
        ${JSON.stringify(computed)}::jsonb,
        ${summary},
        ${SITE_LEGAL.lastUpdated}
      )
      RETURNING id, created_at
    `
    return res.status(200).json({
      ok: true,
      id: rows[0]?.id || null,
      createdAt: rows[0]?.created_at || null,
      result: computed,
      summary,
    })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
