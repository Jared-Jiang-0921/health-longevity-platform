/**
 * CAIDE 20 年痴呆风险评分（教育计算）
 *
 * Kivipelto et al., Lancet Neurol 2006;5:735–741. PMID 16914401.
 * 中年血管危险因素预测晚年痴呆；不含 APOE 的 0–15 分版本。
 *
 * 20 年风险：0–5 分 1.0%；6–7 分 1.9%；8–9 分 4.2%；10–11 分 7.4%；12–15 分 16.4%。
 * 切点 ≥9 分：原文灵敏度 0.77、特异度 0.63。
 */

function toNumber(value, fallback = NaN) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  return Number.isFinite(n) ? n : fallback
}

function toTriBool(value) {
  if (value === true || value === 'true' || value === 1 || value === '1' || value === 'yes') return true
  if (value === false || value === 'false' || value === 0 || value === '0' || value === 'no') return false
  return null
}

export function calcBmi(heightCm, weightKg) {
  const h = toNumber(heightCm)
  const w = toNumber(weightKg)
  if (!Number.isFinite(h) || !Number.isFinite(w) || h < 80 || h > 250 || w < 20 || w > 300) return NaN
  return w / ((h / 100) ** 2)
}

function tcMmol(raw) {
  const n = toNumber(raw.tc)
  if (!Number.isFinite(n)) return NaN
  if (raw.tcUnit === 'mgdl') return n / 38.6
  return n
}

export function normalizeDementiaInput(raw = {}) {
  const minutes = toNumber(raw.activityMinutes)
  const active = toTriBool(raw.caideActive)
    ?? (Number.isFinite(minutes) ? minutes >= 150 : null)
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    age: toNumber(raw.age),
    heightCm: toNumber(raw.heightCm),
    weightKg: toNumber(raw.weightKg),
    sbp: toNumber(raw.sbp),
    educationYears: toNumber(raw.educationYears),
    tcMmol: tcMmol(raw),
    caideActive: active,
  }
}

export function validateDementiaInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < 39 || input.age > 64) {
    return 'CAIDE 针对中年（约 39–64 岁）血管危险因素预测 20 年痴呆风险'
  }
  if (!Number.isFinite(input.heightCm) || input.heightCm < 120 || input.heightCm > 220) return '请填写合理身高（cm）'
  if (!Number.isFinite(input.weightKg) || input.weightKg < 30 || input.weightKg > 250) return '请填写合理体重（kg）'
  if (!Number.isFinite(input.sbp) || input.sbp < 70 || input.sbp > 250) return '请填写合理收缩压（mmHg）'
  if (!Number.isFinite(input.educationYears) || input.educationYears < 0 || input.educationYears > 30) {
    return '请填写受教育年限'
  }
  if (!Number.isFinite(input.tcMmol) || input.tcMmol < 2 || input.tcMmol > 15) return '请填写总胆固醇'
  if (input.caideActive == null) return '请确认是否达到每周 ≥150 分钟中等强度活动'
  return ''
}

function agePoints(age) {
  if (age < 47) return 0
  if (age <= 53) return 3
  return 4
}

function educationPoints(years) {
  if (years >= 10) return 0
  if (years >= 7) return 2
  return 3
}

function riskFromScore(score) {
  if (score <= 5) return 1.0
  if (score <= 7) return 1.9
  if (score <= 9) return 4.2
  if (score <= 11) return 7.4
  return 16.4
}

export function computeCaide(raw = {}) {
  const input = normalizeDementiaInput(raw)
  const error = validateDementiaInput(input)
  if (error) return { ok: false, error, kind: 'dementia' }

  const bmi = calcBmi(input.heightCm, input.weightKg)
  const parts = {
    age: agePoints(input.age),
    education: educationPoints(input.educationYears),
    sex: input.sex === 'male' ? 1 : 0,
    sbp: input.sbp > 140 ? 2 : 0,
    bmi: bmi > 30 ? 2 : 0,
    cholesterol: input.tcMmol > 6.5 ? 2 : 0,
    inactivity: input.caideActive ? 0 : 1,
  }
  const score = Object.values(parts).reduce((a, b) => a + b, 0)
  const percent = riskFromScore(score)
  const high = score >= 9
  const band = high
    ? { id: 'high', label: '偏高（≥9 分）', adviseClinician: true }
    : score >= 6
      ? { id: 'intermediate', label: '中等', adviseClinician: false }
      : { id: 'low', label: '较低', adviseClinician: false }

  return {
    ok: true,
    kind: 'dementia',
    model: 'CAIDE (Kivipelto 2006, without APOE)',
    score,
    max: 15,
    percent,
    parts,
    bmi: Number(bmi.toFixed(1)),
    band,
    summary: `CAIDE 痴呆风险 ${score}/15，对应原文 20 年风险约 ${percent}%（${band.label}）。`,
    disclaimer: '仅供健康教育。CAIDE 来自芬兰中年队列，预测的是全因痴呆而非单指阿尔茨海默病诊断，不能替代认知测评。',
    input,
  }
}
