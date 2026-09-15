/**
 * 生活方式评估（教育计算）
 *
 * - 简化版 AHA Life’s Essential 8（8 项 0–100，再取均分）
 * - Mifflin–St Jeor 基础代谢与 TDEE
 * - 中国成人超重/肥胖切点 BMI 24 / 28
 *
 * 不是营养代谢小程序的移植，也不调用其接口。
 */

function toNumber(value, fallback = NaN) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  return Number.isFinite(n) ? n : fallback
}

export const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
}

export function normalizeLifestyleInput(raw = {}) {
  const activity = ACTIVITY_FACTORS[raw.activityLevel] ? raw.activityLevel : 'light'
  const nicotine = ['never', 'former', 'recent', 'current'].includes(raw.nicotine) ? raw.nicotine : ''
  const diet = ['poor', 'fair', 'good', 'excellent'].includes(raw.diet) ? raw.diet : ''
  const glucose = ['normal', 'prediabetes', 'diabetes', 'unknown'].includes(raw.glucose) ? raw.glucose : 'unknown'
  const lipids = ['optimal', 'borderline', 'high', 'unknown'].includes(raw.lipids) ? raw.lipids : 'unknown'
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    age: toNumber(raw.age),
    heightCm: toNumber(raw.heightCm),
    weightKg: toNumber(raw.weightKg),
    waistCm: toNumber(raw.waistCm, 0),
    activityMinutes: toNumber(raw.activityMinutes, 0),
    activityLevel: activity,
    nicotine,
    diet,
    sleepHours: toNumber(raw.sleepHours),
    sbp: toNumber(raw.sbp),
    dbp: toNumber(raw.dbp),
    glucose,
    lipids,
  }
}

export function validateLifestyleInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < 18 || input.age > 90) return '请填写 18–90 岁年龄'
  if (!Number.isFinite(input.heightCm) || input.heightCm < 120 || input.heightCm > 220) return '请填写合理身高（cm）'
  if (!Number.isFinite(input.weightKg) || input.weightKg < 30 || input.weightKg > 250) return '请填写合理体重（kg）'
  if (!Number.isFinite(input.sleepHours) || input.sleepHours < 3 || input.sleepHours > 14) return '请填写睡眠时长（小时）'
  if (!Number.isFinite(input.sbp) || input.sbp < 70 || input.sbp > 250) return '请填写收缩压'
  if (!Number.isFinite(input.dbp) || input.dbp < 40 || input.dbp > 160) return '请填写舒张压'
  if (!input.diet) return '请选择饮食质量'
  if (!input.nicotine) return '请选择吸烟情况'
  if (!Number.isFinite(input.activityMinutes) || input.activityMinutes < 0 || input.activityMinutes > 2000) {
    return '请填写每周中等强度活动分钟数'
  }
  return ''
}

export function calcBmi(heightCm, weightKg) {
  return weightKg / ((heightCm / 100) ** 2)
}

export function chinaBmiBand(bmi) {
  if (bmi < 18.5) return { id: 'under', label: '偏瘦', adviseClinician: false }
  if (bmi < 24) return { id: 'normal', label: '正常', adviseClinician: false }
  if (bmi < 28) return { id: 'overweight', label: '超重', adviseClinician: false }
  return { id: 'obese', label: '肥胖', adviseClinician: true }
}

export function computeMifflinStJeor(input) {
  const bmr = input.sex === 'male'
    ? 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + 5
    : 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age - 161
  const factor = ACTIVITY_FACTORS[input.activityLevel] || ACTIVITY_FACTORS.light
  const tdee = bmr * factor
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    factor,
    formula: 'Mifflin–St Jeor',
  }
}

function scoreDiet(diet) {
  if (diet === 'excellent') return 100
  if (diet === 'good') return 80
  if (diet === 'fair') return 50
  return 25
}

function scoreActivity(minutes) {
  if (minutes >= 300) return 100
  if (minutes >= 150) return 80
  if (minutes >= 60) return 50
  if (minutes >= 30) return 25
  return 0
}

function scoreNicotine(nicotine) {
  if (nicotine === 'never') return 100
  if (nicotine === 'former') return 75
  if (nicotine === 'recent') return 50
  return 0
}

function scoreSleep(hours) {
  if (hours >= 7 && hours < 10) return 100
  if (hours >= 6 && hours < 7) return 70
  if (hours >= 10 && hours <= 11) return 40
  return 20
}

function scoreBmiChina(bmi) {
  if (bmi >= 18.5 && bmi < 24) return 100
  if (bmi < 18.5) return 70
  if (bmi < 28) return 70
  if (bmi < 32) return 30
  return 0
}

function scoreBp(sbp, dbp) {
  if (sbp < 120 && dbp < 80) return 100
  if (sbp < 130 && dbp < 80) return 75
  if (sbp < 140 && dbp < 90) return 50
  if (sbp < 160 && dbp < 100) return 25
  return 0
}

function scoreGlucose(glucose) {
  if (glucose === 'normal') return 100
  if (glucose === 'unknown') return 50
  if (glucose === 'prediabetes') return 40
  return 0
}

function scoreLipids(lipids) {
  if (lipids === 'optimal') return 100
  if (lipids === 'unknown') return 50
  if (lipids === 'borderline') return 60
  return 20
}

function le8Band(score) {
  if (score >= 80) return { id: 'high', label: '较理想' }
  if (score >= 50) return { id: 'moderate', label: '中等' }
  return { id: 'low', label: '待改善' }
}

export function computeLifestyle(rawInput) {
  const input = normalizeLifestyleInput(rawInput)
  const error = validateLifestyleInput(input)
  if (error) return { ok: false, error, kind: 'lifestyle' }

  const bmi = Number(calcBmi(input.heightCm, input.weightKg).toFixed(1))
  const bmiBand = chinaBmiBand(bmi)
  const energy = computeMifflinStJeor(input)
  const components = [
    { id: 'diet', name: '饮食', score: scoreDiet(input.diet) },
    { id: 'activity', name: '身体活动', score: scoreActivity(input.activityMinutes) },
    { id: 'nicotine', name: '烟草暴露', score: scoreNicotine(input.nicotine) },
    { id: 'sleep', name: '睡眠', score: scoreSleep(input.sleepHours) },
    { id: 'bmi', name: '体重（中国 BMI 切点）', score: scoreBmiChina(bmi) },
    { id: 'lipids', name: '血脂', score: scoreLipids(input.lipids) },
    { id: 'glucose', name: '血糖', score: scoreGlucose(input.glucose) },
    { id: 'bp', name: '血压', score: scoreBp(input.sbp, input.dbp) },
  ]
  const le8 = Math.round(components.reduce((sum, row) => sum + row.score, 0) / components.length)
  const band = le8Band(le8)
  const central = input.waistCm > 0
    && ((input.sex === 'male' && input.waistCm >= 90) || (input.sex === 'female' && input.waistCm >= 85))

  return {
    ok: true,
    kind: 'lifestyle',
    input,
    bmi,
    bmiBand,
    centralObesity: central,
    energy,
    le8,
    le8Band: band,
    components,
    adviseClinician: bmiBand.adviseClinician || le8 < 50 || input.glucose === 'diabetes',
    summary: `生活方式 LE8 ${le8}/100（${band.label}）；BMI ${bmi}（${bmiBand.label}）；BMR ${energy.bmr} kcal，TDEE ${energy.tdee} kcal`,
    disclaimer:
      '教育评估：LE8 为简化自评分，BMR 用 Mifflin–St Jeor，BMI 用中国成人 24/28 切点。不替代营养或临床评估。',
  }
}
