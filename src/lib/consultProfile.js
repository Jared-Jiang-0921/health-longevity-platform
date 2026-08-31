/**
 * 将主站健康问卷与设备监测摘要映射为咨询请求里的 profile 字段。
 */

const FIELD_MAX = 800

const PAIRS = [
  ['ageRange', 'age_range'],
  ['sex', 'sex'],
  ['region', 'region'],
  ['goals', 'goals'],
  ['concerns', 'concerns'],
  ['medicalHistory', 'medical_history'],
  ['medications', 'medications'],
  ['allergies', 'allergies'],
  ['lifestyle', 'lifestyle'],
  ['sleep', 'sleep'],
]

export function mapSubmissionToProfile(submission) {
  if (!submission) return null
  if (submission.consent_health_data === false || submission.consentHealthData === false) {
    return null
  }
  const out = {}
  for (const [camel, snake] of PAIRS) {
    const raw = submission[camel] ?? submission[snake] ?? ''
    const text = String(raw || '').trim().slice(0, FIELD_MAX)
    if (text) out[camel] = text
  }
  return Object.keys(out).length ? out : null
}

export async function fetchConsultProfile(token, { timeoutMs = 3000 } = {}) {
  if (!token) return { profile: null, status: 'missing' }
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), timeoutMs)
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const [qRes, snapRes] = await Promise.all([
      fetch('/api/health-questionnaire', { headers, signal: ac.signal }),
      fetch('/api/health-monitor/snapshot', { headers, signal: ac.signal }).catch(() => null),
    ])
    if (!qRes.ok && qRes.status !== 401) {
      // 问卷失败仍尝试设备摘要
    }
    const data = qRes.ok ? await qRes.json().catch(() => ({})) : {}
    const profile = mapSubmissionToProfile(data.submission) || {}
    if (snapRes && snapRes.ok) {
      const snap = await snapRes.json().catch(() => ({}))
      const summary = String(snap.summaryText || '').trim().slice(0, FIELD_MAX)
      if (summary) profile.deviceSummary = summary
    }
    const has = Object.keys(profile).length > 0
    return {
      profile: has ? profile : null,
      status: has ? 'ready' : (qRes.ok ? 'missing' : 'error'),
      updatedAt: data.submission?.updated_at || data.submission?.created_at || '',
    }
  } catch {
    return { profile: null, status: 'error' }
  } finally {
    clearTimeout(timer)
  }
}
