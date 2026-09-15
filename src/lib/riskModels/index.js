import { computeChinaPar } from './chinaPar.js'
import { computeDiabetesBundle } from './diabetes.js'
import { computeLifestyle } from './lifestyle.js'

export const RISK_KINDS = ['china_par', 'diabetes', 'lifestyle']

/** disease | aging | lifestyle — 新增评估必须归入一类，并只收专项字段 */
export const RISK_TOOL_SCOPES = {
  china_par: 'disease',
  diabetes: 'disease',
  lifestyle: 'lifestyle',
}

export function isRiskKind(kind) {
  return RISK_KINDS.includes(kind)
}

export function computeRiskAssessment(kind, input) {
  if (kind === 'china_par') return computeChinaPar(input)
  if (kind === 'diabetes') return computeDiabetesBundle(input)
  if (kind === 'lifestyle') return computeLifestyle(input)
  return { ok: false, error: '未知评估类型', kind }
}

export function resultToSummary(result) {
  if (!result?.ok) return ''
  return String(result.summary || '').slice(0, 400)
}
