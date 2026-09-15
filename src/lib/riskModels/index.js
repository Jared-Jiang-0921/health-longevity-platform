import { computeChinaPar } from './chinaPar.js'
import { computeDiabetesBundle } from './diabetes.js'
import { computeLifestyle } from './lifestyle.js'
import { computeFraminghamHypertension } from './hypertension.js'
import { computeCaide } from './dementia.js'
import { computeParkinson } from './parkinson.js'
import { computeOsta } from './osteoporosis.js'
import { computeSarcF } from './sarcopenia.js'

export const RISK_KINDS = [
  'china_par',
  'diabetes',
  'hypertension',
  'dementia',
  'parkinson',
  'osteoporosis',
  'sarcopenia',
  'lifestyle',
]

/** disease | aging | lifestyle — 新增评估必须归入一类，并只收专项字段 */
export const RISK_TOOL_SCOPES = {
  china_par: 'disease',
  diabetes: 'disease',
  lifestyle: 'lifestyle',
  hypertension: 'disease',
  dementia: 'aging',
  parkinson: 'disease',
  osteoporosis: 'aging',
  sarcopenia: 'aging',
}

const COMPUTE = {
  china_par: computeChinaPar,
  diabetes: computeDiabetesBundle,
  lifestyle: computeLifestyle,
  hypertension: computeFraminghamHypertension,
  dementia: computeCaide,
  parkinson: computeParkinson,
  osteoporosis: computeOsta,
  sarcopenia: computeSarcF,
}

export function isRiskKind(kind) {
  return RISK_KINDS.includes(kind)
}

export function computeRiskAssessment(kind, input) {
  const fn = COMPUTE[kind]
  if (!fn) return { ok: false, error: '未知评估类型', kind }
  return fn(input)
}

export function resultToSummary(result) {
  if (!result?.ok) return ''
  return String(result.summary || '').slice(0, 400)
}
