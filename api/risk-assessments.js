/**
 * 网站风险评估（登录用户）
 * GET  /api/risk-assessments  各类型最近一次
 * POST /api/risk-assessments  { kind, input, consentHealthData }
 *
 * 仅写本站 Postgres，不调用营养代谢小程序。
 */
import { verifyToken, getUserById } from '../lib/auth.js'
import { canViewContent } from '../lib/contentAccess.js'
import { sql } from '../lib/db.js'
import { SITE_LEGAL } from '../src/data/siteLegal.js'
import { computeRiskAssessment, isRiskKind, resultToSummary } from '../src/lib/riskModels/index.js'

let tableReady = false

function getToken(req) {
  const auth = req.headers.authorization
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
}

async function ensureTable() {
  if (tableReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS risk_assessments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      input_json JSONB NOT NULL,
      result_json JSONB NOT NULL,
      summary_text TEXT NOT NULL,
      legal_version TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_kind ON risk_assessments(user_id, kind, created_at DESC)`
  tableReady = true
}

function publicResult(result) {
  if (!result?.ok) return null
  const { input: _input, ...rest } = result
  return rest
}

export default async function handler(req, res) {
  const token = getToken(req)
  if (!token) return res.status(401).json({ error: '未登录' })
  const userId = await verifyToken(token)
  if (!userId) return res.status(401).json({ error: '登录已过期' })
  const user = await getUserById(userId)
  if (!user || !canViewContent(user.level, 'standard', { isGuest: false })) {
    return res.status(403).json({ error: '三项评估仅向标准会员及以上开放' })
  }

  try {
    await ensureTable()
  } catch (e) {
    return res.status(500).json({ error: e.message || '数据库未就绪' })
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT DISTINCT ON (kind)
        id, kind, input_json, result_json, summary_text, created_at, updated_at
      FROM risk_assessments
      WHERE user_id = ${userId}
      ORDER BY kind, created_at DESC
    `
    const latest = {}
    for (const row of rows) {
      latest[row.kind] = {
        id: row.id,
        kind: row.kind,
        input: row.input_json,
        result: row.result_json,
        summary: row.summary_text,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    }
    const summaries = ['china_par', 'diabetes', 'lifestyle']
      .map((kind) => latest[kind]?.summary)
      .filter(Boolean)
    return res.status(200).json({
      latest,
      riskSummary: summaries.join('；').slice(0, 800),
    })
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    if (body.consentHealthData !== true) {
      return res.status(400).json({ error: '提交前请先同意健康数据告知' })
    }
    const kind = String(body.kind || '')
    if (!isRiskKind(kind)) return res.status(400).json({ error: '未知评估类型' })

    const computed = computeRiskAssessment(kind, body.input || {})
    if (!computed.ok) return res.status(400).json({ error: computed.error || '评估参数不完整' })

    const summary = resultToSummary(computed)
    const storedResult = publicResult(computed)
    const rows = await sql`
      INSERT INTO risk_assessments (
        user_id, kind, input_json, result_json, summary_text, legal_version
      ) VALUES (
        ${userId},
        ${kind},
        ${JSON.stringify(computed.input)}::jsonb,
        ${JSON.stringify(storedResult)}::jsonb,
        ${summary},
        ${SITE_LEGAL.lastUpdated}
      )
      RETURNING id, created_at, updated_at
    `

    return res.status(200).json({
      ok: true,
      id: rows[0]?.id || null,
      createdAt: rows[0]?.created_at || null,
      kind,
      input: computed.input,
      result: storedResult,
      summary,
    })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
