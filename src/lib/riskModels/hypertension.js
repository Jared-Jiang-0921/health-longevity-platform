/**
 * Framingham 4 年新发高血压风险（教育计算）
 *
 * Parikh et al., Ann Intern Med 2008;148:102–110. PMID 18195335.
 * 官方 Weibull 系数：https://www.framinghamheartstudy.org/fhs-risk-functions/hypertension/
 *
 * 适用：20–69 岁、尚未达到高血压诊断、无糖尿病的人群。
 * 分层沿用原文：4 年风险 <5% 低、5–10% 中、>10% 高。
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

function parentalCount(raw) {
  if (raw === 2 || raw === '2' || raw === 'both') return 2
  if (raw === 1 || raw === '1' || raw === 'one') return 1
  if (raw === 0 || raw === '0' || raw === 'none') return 0
  if (toTriBool(raw) === true) return 1
  if (toTriBool(raw) === false) return 0
  return null
}

export function normalizeHypertensionInput(raw = {}) {
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    age: toNumber(raw.age),
    heightCm: toNumber(raw.heightCm),
    weightKg: toNumber(raw.weightKg),
    sbp: toNumber(raw.sbp),
    dbp: toNumber(raw.dbp),
    smoking: toTriBool(raw.smoking) ?? (raw.nicotine === 'current'),
    treatedHypertension: toTriBool(raw.treatedHypertension) ?? toTriBool(raw.bpMedication),
    diabetes: toTriBool(raw.diabetes) ?? (raw.glucose === 'diabetes'),
    parentalHypertension: parentalCount(raw.parentalHypertension),
  }
}

export function validateHypertensionInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < 20 || input.age > 69) return 'Framingham 高血压模型适用于 20–69 岁'
  if (!Number.isFinite(input.heightCm) || input.heightCm < 120 || input.heightCm > 220) return '请填写合理身高（cm）'
  if (!Number.isFinite(input.weightKg) || input.weightKg < 30 || input.weightKg > 250) return '请填写合理体重（kg）'
  if (!Number.isFinite(input.sbp) || input.sbp < 70 || input.sbp > 250) return '请填写合理收缩压（mmHg）'
  if (!Number.isFinite(input.dbp) || input.dbp < 40 || input.dbp > 160) return '请填写合理舒张压（mmHg）'
  if (input.smoking == null || input.treatedHypertension == null || input.parentalHypertension == null) {
    return '请完成吸烟、降压药与父母高血压史'
  }
  return ''
}

function bandForPercent(percent) {
  if (percent > 10) return { id: 'high', label: '高危', adviseClinician: true }
  if (percent >= 5) return { id: 'intermediate', label: '中危', adviseClinician: false }
  return { id: 'low', label: '低危', adviseClinician: false }
}

export function computeFraminghamHypertension(raw = {}) {
  const input = normalizeHypertensionInput(raw)
  const error = validateHypertensionInput(input)
  if (error) return { ok: false, error, kind: 'hypertension' }

  const alreadyHypertensive = input.treatedHypertension || input.sbp >= 140 || input.dbp >= 90
  if (alreadyHypertensive) {
    return {
      ok: true,
      kind: 'hypertension',
      model: 'Framingham 4-year hypertension (Parikh 2008)',
      alreadyHypertensive: true,
      percent: null,
      bmi: Number(calcBmi(input.heightCm, input.weightKg).toFixed(1)),
      band: { id: 'high', label: '已达高血压阈值 / 正在服药', adviseClinician: true },
      summary: '当前血压或服药情况已符合高血压定义，Framingham 新发风险模型不再适用，建议按高血压管理随访。',
      disclaimer: '仅供健康教育。模型来自 Framingham 白人队列，不能诊断或调整用药。',
      input,
    }
  }
  if (input.diabetes) {
    return {
      ok: false,
      error: '该模型推导时排除糖尿病患者，已诊断糖尿病时请直接与医生讨论血压目标',
      kind: 'hypertension',
    }
  }

  const bmi = calcBmi(input.heightCm, input.weightKg)
  const sex = input.sex === 'female' ? 1 : 0
  const smoking = input.smoking ? 1 : 0
  const sumXb = (
    -0.15641 * input.age
    + -0.20293 * sex
    + -0.05933 * input.sbp
    + -0.12847 * input.dbp
    + -0.19073 * smoking
    + -0.16612 * input.parentalHypertension
    + -0.03388 * bmi
    + 0.00162 * input.age * input.dbp
  )
  const inner = (Math.log(4) - (22.94954 + sumXb)) / 0.87692
  const percent = (1 - Math.exp(-Math.exp(inner))) * 100
  const rounded = Math.round(percent * 10) / 10
  const band = bandForPercent(rounded)

  return {
    ok: true,
    kind: 'hypertension',
    model: 'Framingham 4-year hypertension (Parikh 2008)',
    alreadyHypertensive: false,
    percent: rounded,
    bmi: Number(bmi.toFixed(1)),
    band,
    summary: `Framingham 4 年新发高血压约 ${rounded}%（${band.label}）。父母高血压史 ${input.parentalHypertension} 位。`,
    disclaimer: '仅供健康教育。推导人群为无糖尿病的白人，对中国人群可能高估或低估，不能替代诊室血压诊断。',
    input,
  }
}
