import { verifyToken } from '../lib/auth.js'
import { sql } from '../lib/db.js'
import { SITE_LEGAL } from '../src/data/siteLegal.js'

function getToken(req) {
  const auth = req.headers.authorization
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
}

function normalizeText(value, max = 4000) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function normalizePayload(body = {}) {
  return {
    ageRange: normalizeText(body.ageRange, 64),
    sex: normalizeText(body.sex, 32),
    region: normalizeText(body.region, 120),
    goals: normalizeText(body.goals),
    concerns: normalizeText(body.concerns),
    medicalHistory: normalizeText(body.medicalHistory),
    medications: normalizeText(body.medications),
    allergies: normalizeText(body.allergies),
    lifestyle: normalizeText(body.lifestyle),
    sleep: normalizeText(body.sleep),
    consentHealthData: body.consentHealthData === true,
    consentCarePlan: body.consentCarePlan === true,
    consentContact: body.consentContact === true,
  }
}

function validatePayload(payload) {
  if (!payload.goals) return '请填写您的健康目标'
  if (!payload.concerns) return '请填写当前最关注的问题'
  if (!payload.consentHealthData) return '提交前请先同意健康数据告知'
  return ''
}

export default async function handler(req, res) {
  const token = getToken(req)
  if (!token) {
    return res.status(401).json({ error: '未登录' })
  }

  const userId = await verifyToken(token)
  if (!userId) {
    return res.status(401).json({ error: '登录已过期' })
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT
        id,
        age_range,
        sex,
        region,
        goals,
        concerns,
        medical_history,
        medications,
        allergies,
        lifestyle,
        sleep,
        consent_health_data,
        consent_care_plan,
        consent_contact,
        legal_version,
        created_at,
        updated_at
      FROM health_questionnaires
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `
    return res.status(200).json({ submission: rows[0] || null })
  }

  if (req.method === 'POST') {
    const payload = normalizePayload(req.body)
    const error = validatePayload(payload)
    if (error) {
      return res.status(400).json({ error })
    }

    const rows = await sql`
      INSERT INTO health_questionnaires (
        user_id,
        age_range,
        sex,
        region,
        goals,
        concerns,
        medical_history,
        medications,
        allergies,
        lifestyle,
        sleep,
        consent_health_data,
        consent_care_plan,
        consent_contact,
        legal_version
      ) VALUES (
        ${userId},
        ${payload.ageRange},
        ${payload.sex},
        ${payload.region},
        ${payload.goals},
        ${payload.concerns},
        ${payload.medicalHistory},
        ${payload.medications},
        ${payload.allergies},
        ${payload.lifestyle},
        ${payload.sleep},
        ${payload.consentHealthData},
        ${payload.consentCarePlan},
        ${payload.consentContact},
        ${SITE_LEGAL.lastUpdated}
      )
      RETURNING id, created_at
    `

    return res.status(200).json({
      ok: true,
      submissionId: rows[0]?.id || null,
      createdAt: rows[0]?.created_at || null,
    })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
