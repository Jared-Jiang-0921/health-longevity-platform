/**
 * 糖尿病筛查评分（教育计算）
 *
 * 1) 中国糖尿病风险评分（NCDRS / 杨文英等，Diabetes Care 2013；指南筛查切点 ≥25）
 * 2) FINDRISC（Lindström & Tuomilehto, 2003）
 *
 * 两者都是筛查工具，不是诊断。
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

export function normalizeDiabetesInput(raw = {}) {
  const familyFindrisc = ['none', 'second', 'first'].includes(raw.familyFindrisc)
    ? raw.familyFindrisc
    : toTriBool(raw.familyDiabetes)
      ? 'first'
      : 'none'
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    age: toNumber(raw.age),
    heightCm: toNumber(raw.heightCm),
    weightKg: toNumber(raw.weightKg),
    waistCm: toNumber(raw.waistCm),
    sbp: toNumber(raw.sbp),
    familyDiabetes: toTriBool(raw.familyDiabetes) ?? (familyFindrisc === 'first'),
    familyFindrisc,
    dailyActivity30: toTriBool(raw.dailyActivity30),
    dailyVegetables: toTriBool(raw.dailyVegetables),
    bpMedication: toTriBool(raw.bpMedication),
    historyHighGlucose: toTriBool(raw.historyHighGlucose),
  }
}

export function validateDiabetesInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < 18 || input.age > 90) return '请填写 18–90 岁年龄'
  if (!Number.isFinite(input.heightCm) || input.heightCm < 120 || input.heightCm > 220) return '请填写合理身高（cm）'
  if (!Number.isFinite(input.weightKg) || input.weightKg < 30 || input.weightKg > 250) return '请填写合理体重（kg）'
  if (!Number.isFinite(input.waistCm) || input.waistCm < 50 || input.waistCm > 160) return '请填写合理腰围（cm）'
  if (!Number.isFinite(input.sbp) || input.sbp < 70 || input.sbp > 250) return '请填写合理收缩压（mmHg）'
  if (
    input.familyDiabetes == null
    || input.dailyActivity30 == null
    || input.dailyVegetables == null
    || input.bpMedication == null
    || input.historyHighGlucose == null
  ) {
    return '请完成家族史、活动、蔬菜、降压药与血糖史选项'
  }
  return ''
}

function chinaAgePoints(age) {
  if (age < 25) return 0
  if (age < 35) return 4
  if (age < 40) return 8
  if (age < 45) return 11
  if (age < 50) return 12
  if (age < 55) return 13
  if (age < 60) return 15
  if (age < 65) return 16
  return 18
}

function chinaBmiPoints(bmi) {
  if (bmi < 22) return 0
  if (bmi < 24) return 1
  if (bmi < 30) return 3
  return 5
}

function chinaWaistPoints(sex, waist) {
  const cuts = sex === 'male'
    ? [75, 80, 85, 90, 95]
    : [70, 75, 80, 85, 90]
  const pts = [0, 3, 5, 7, 8, 10]
  for (let i = 0; i < cuts.length; i += 1) {
    if (waist < cuts[i]) return pts[i]
  }
  return pts[5]
}

function chinaSbpPoints(sbp) {
  if (sbp < 110) return 0
  if (sbp < 120) return 1
  if (sbp < 130) return 3
  if (sbp < 140) return 6
  if (sbp < 150) return 7
  if (sbp < 160) return 8
  return 10
}

export function computeChinaDiabetesScore(input) {
  const bmi = calcBmi(input.heightCm, input.weightKg)
  const parts = {
    age: chinaAgePoints(input.age),
    sex: input.sex === 'male' ? 2 : 0,
    bmi: chinaBmiPoints(bmi),
    waist: chinaWaistPoints(input.sex, input.waistCm),
    sbp: chinaSbpPoints(input.sbp),
    family: input.familyDiabetes ? 6 : 0,
  }
  const score = Object.values(parts).reduce((a, b) => a + b, 0)
  const high = score >= 25
  return {
    id: 'china_diabetes',
    name: '中国糖尿病风险评分',
    score,
    max: 51,
    high,
    band: high ? '高危（建议进一步查血糖/OGTT）' : '未达筛查切点',
    adviseClinician: high,
    parts,
    bmi: Number(bmi.toFixed(1)),
    cutoff: 25,
    source: 'Zhou / Yang et al., Diabetes Care 2013；中国 2 型糖尿病防治指南筛查表',
  }
}

function findriscAge(age) {
  if (age < 45) return 0
  if (age < 55) return 2
  if (age < 65) return 3
  return 4
}

function findriscBmi(bmi) {
  if (bmi < 25) return 0
  if (bmi < 30) return 1
  return 3
}

function findriscWaist(sex, waist) {
  if (sex === 'male') {
    if (waist < 94) return 0
    if (waist <= 102) return 3
    return 4
  }
  if (waist < 80) return 0
  if (waist <= 88) return 3
  return 4
}

export function findriscBand(score) {
  if (score < 7) return { id: 'low', label: '低', tenYearApprox: '约 1%' }
  if (score <= 11) return { id: 'slightly', label: '略升高', tenYearApprox: '约 4%' }
  if (score <= 14) return { id: 'moderate', label: '中等', tenYearApprox: '约 17%' }
  if (score <= 20) return { id: 'high', label: '高', tenYearApprox: '约 33%' }
  return { id: 'very_high', label: '很高', tenYearApprox: '约 50%' }
}

export function computeFindrisc(input) {
  const bmi = calcBmi(input.heightCm, input.weightKg)
  const familyPts = input.familyFindrisc === 'first' ? 5 : input.familyFindrisc === 'second' ? 3 : 0
  const parts = {
    age: findriscAge(input.age),
    bmi: findriscBmi(bmi),
    waist: findriscWaist(input.sex, input.waistCm),
    activity: input.dailyActivity30 ? 0 : 2,
    vegetables: input.dailyVegetables ? 0 : 1,
    bpMedication: input.bpMedication ? 2 : 0,
    historyHighGlucose: input.historyHighGlucose ? 5 : 0,
    family: familyPts,
  }
  const score = Object.values(parts).reduce((a, b) => a + b, 0)
  const band = findriscBand(score)
  return {
    id: 'findrisc',
    name: 'FINDRISC',
    score,
    max: 26,
    high: score >= 12,
    band: `${band.label}（10 年糖尿病风险 ${band.tenYearApprox}）`,
    adviseClinician: score >= 15,
    parts,
    bmi: Number(bmi.toFixed(1)),
    source: 'Lindström & Tuomilehto, Diabetes Care 2003',
  }
}

export function computeDiabetesBundle(rawInput) {
  const input = normalizeDiabetesInput(rawInput)
  const error = validateDiabetesInput(input)
  if (error) return { ok: false, error, kind: 'diabetes' }

  const china = computeChinaDiabetesScore(input)
  const findrisc = computeFindrisc(input)
  const adviseClinician = china.adviseClinician || findrisc.adviseClinician
  const summary = `中国糖尿病风险评分 ${china.score} 分（${china.band}）；FINDRISC ${findrisc.score} 分（${findrisc.band}）`

  return {
    ok: true,
    kind: 'diabetes',
    input,
    china,
    findrisc,
    adviseClinician,
    summary,
    disclaimer:
      '教育筛查评分，用于提示是否值得进一步检测血糖，不能诊断糖尿病。高危请就医做空腹血糖/OGTT 等检查。',
  }
}
