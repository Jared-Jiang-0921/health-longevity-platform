/**
 * SARC-F 肌少症筛查（教育计算）
 *
 * Malmstrom & Morley, J Am Med Dir Assoc 2013;14:531–532.
 * AWGS 2019 将 SARC-F ≥4 作为社区筛查阳性切点（需再测肌力/肌量，不能单独诊断）。
 */

function toScore(value, max = 2) {
  if (value === '' || value == null) return null
  const n = typeof value === 'number' ? value : Number(String(value).trim())
  if (!Number.isInteger(n) || n < 0 || n > max) return null
  return n
}

export function normalizeSarcopeniaInput(raw = {}) {
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    age: Number(raw.age),
    strength: toScore(raw.sarcStrength),
    walking: toScore(raw.sarcWalking),
    rise: toScore(raw.sarcRise),
    climb: toScore(raw.sarcClimb),
    falls: toScore(raw.sarcFalls),
  }
}

export function validateSarcopeniaInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < 60 || input.age > 110) {
    return 'SARC-F / AWGS 筛查主要用于 60 岁及以上'
  }
  if ([input.strength, input.walking, input.rise, input.climb, input.falls].some((v) => v == null)) {
    return '请完成 SARC-F 五项'
  }
  return ''
}

export function computeSarcF(raw = {}) {
  const input = normalizeSarcopeniaInput(raw)
  const error = validateSarcopeniaInput(input)
  if (error) return { ok: false, error, kind: 'sarcopenia' }

  const score = input.strength + input.walking + input.rise + input.climb + input.falls
  const positive = score >= 4
  const band = positive
    ? { id: 'high', label: '筛查阳性（≥4）', adviseClinician: true }
    : { id: 'low', label: '筛查未达切点', adviseClinician: false }

  return {
    ok: true,
    kind: 'sarcopenia',
    model: 'SARC-F (Malmstrom 2013) / AWGS 2019 screen',
    score,
    max: 10,
    parts: {
      strength: input.strength,
      walking: input.walking,
      rise: input.rise,
      climb: input.climb,
      falls: input.falls,
    },
    band,
    summary: `SARC-F ${score}/10，AWGS 2019 筛查${positive ? '阳性，建议评估肌力与肌量' : '未达切点'}。`,
    disclaimer: '仅供健康教育。SARC-F 阳性不是肌少症诊断，需要握力、小腿围或 DXA/BIA 等再评估。',
    input,
  }
}
