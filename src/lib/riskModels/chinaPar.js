/**
 * China-PAR 10 年 ASCVD 风险（教育计算）
 *
 * 系数与公式取自江苏省预防医学会团体标准 T/JPMA 024—2024 附录 C/D
 * （社区人群心血管病风险筛查技术规范），该标准引用 Yang et al., Circulation 2016。
 * 官方在线工具：https://www.cvdrisk.com.cn/
 *
 * 论文工作示例（Circulation 2016）：60 岁、未治收缩压 130、TC 210 mg/dL、HDL 55、
 * 腰围 80 cm、不吸烟、有糖尿病、北方城市、无 ASCVD 家族史
 * → 男性约 11.0%，女性约 10.1%。本实现对应约 10.8% / 10.2%。
 *
 * 本工具仅供健康教育，不替代诊疗或官方计算器。
 */

export const CHINA_PAR_MGDL_PER_MMOL = 38.6
export const CHINA_PAR_AGE_MIN = 20
export const CHINA_PAR_AGE_MAX = 85

const COEF = {
  male: {
    lnAge: 31.967,
    lnSbpTreated: 27.388,
    lnSbpUntreated: 26.148,
    lnTc: 0.621,
    lnHdl: -0.695,
    lnWc: -0.712,
    smoking: 3.955,
    diabetes: 0.357,
    north: 0.475,
    urban: -0.164,
    familyAscvd: 6.221,
    lnAgeLnSbpTreated: -6.018,
    lnAgeLnSbpUntreated: -5.731,
    lnAgeSmoking: -0.939,
    lnAgeFamily: -1.534,
    meanX: 140.68,
    s10: 0.9707,
  },
  female: {
    lnAge: 24.874,
    lnSbpTreated: 20.709,
    lnSbpUntreated: 19.982,
    lnTc: 0.058,
    lnHdl: -0.217,
    lnWc: 1.475,
    smoking: 0.495,
    diabetes: 0.567,
    north: 0.544,
    urban: 0,
    familyAscvd: 0,
    lnAgeLnSbpTreated: -4.528,
    lnAgeLnSbpUntreated: -4.360,
    lnAgeSmoking: 0,
    lnAgeFamily: 0,
    meanX: 117.26,
    s10: 0.9851,
  },
}

export const CHINA_PAR_PAPER_EXAMPLE = {
  age: 60,
  sbp: 130,
  treatedHypertension: false,
  tc: 210,
  tcUnit: 'mgdl',
  hdl: 55,
  hdlUnit: 'mgdl',
  waistCm: 80,
  smoking: false,
  diabetes: true,
  north: true,
  urban: true,
  familyAscvd: false,
}

function toNumber(value, fallback = NaN) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  return Number.isFinite(n) ? n : fallback
}

function toTriBool(value) {
  if (value === true || value === 'true' || value === 1 || value === '1' || value === 'yes') return true
  if (value === false || value === 'false' || value === 0 || value === '0' || value === 'no') return false
  return null
}

function toMgDl(value, unit) {
  const n = toNumber(value)
  if (!Number.isFinite(n)) return NaN
  return unit === 'mmol' ? n * CHINA_PAR_MGDL_PER_MMOL : n
}

export function normalizeChinaParInput(raw = {}) {
  const sex = raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : ''
  return {
    sex,
    age: toNumber(raw.age),
    sbp: toNumber(raw.sbp),
    treatedHypertension: toTriBool(raw.treatedHypertension),
    tc: toNumber(raw.tc),
    tcUnit: raw.tcUnit === 'mmol' ? 'mmol' : 'mgdl',
    hdl: toNumber(raw.hdl),
    hdlUnit: raw.hdlUnit === 'mmol' ? 'mmol' : 'mgdl',
    waistCm: toNumber(raw.waistCm),
    smoking: toTriBool(raw.smoking),
    diabetes: toTriBool(raw.diabetes),
    north: toTriBool(raw.north),
    urban: toTriBool(raw.urban),
    familyAscvd: toTriBool(raw.familyAscvd),
  }
}

export function validateChinaParInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < CHINA_PAR_AGE_MIN || input.age > CHINA_PAR_AGE_MAX) {
    return `年龄需在 ${CHINA_PAR_AGE_MIN}–${CHINA_PAR_AGE_MAX} 岁`
  }
  if (!Number.isFinite(input.sbp) || input.sbp < 70 || input.sbp > 250) return '请填写合理的收缩压（mmHg）'
  if (!Number.isFinite(input.waistCm) || input.waistCm < 50 || input.waistCm > 150) return '请填写合理的腰围（cm）'
  const tc = toMgDl(input.tc, input.tcUnit)
  const hdl = toMgDl(input.hdl, input.hdlUnit)
  if (!Number.isFinite(tc) || tc < 80 || tc > 500) return '请填写合理的总胆固醇'
  if (!Number.isFinite(hdl) || hdl < 15 || hdl > 130) return '请填写合理的 HDL-C'
  if (
    input.treatedHypertension == null
    || input.smoking == null
    || input.diabetes == null
    || input.north == null
    || input.urban == null
    || input.familyAscvd == null
  ) {
    return '请完成吸烟、糖尿病、南北方、城乡、降压药与家族史选项'
  }
  return ''
}

export function chinaParBand(percent) {
  if (percent < 5) return { id: 'low', label: '低危', adviseClinician: false }
  if (percent < 10) return { id: 'intermediate', label: '中危', adviseClinician: false }
  return { id: 'high', label: '高危', adviseClinician: true }
}

export function computeChinaPar(rawInput) {
  const input = normalizeChinaParInput(rawInput)
  const error = validateChinaParInput(input)
  if (error) return { ok: false, error, kind: 'china_par' }

  const coef = COEF[input.sex]
  const lnAge = Math.log(input.age)
  const lnSbp = Math.log(input.sbp)
  const lnTc = Math.log(toMgDl(input.tc, input.tcUnit))
  const lnHdl = Math.log(toMgDl(input.hdl, input.hdlUnit))
  const lnWc = Math.log(input.waistCm)
  const smoke = input.smoking ? 1 : 0
  const dm = input.diabetes ? 1 : 0
  const north = input.north ? 1 : 0
  const urban = input.sex === 'male' && input.urban ? 1 : 0
  const family = input.sex === 'male' && input.familyAscvd ? 1 : 0
  const treated = input.treatedHypertension

  const x =
    coef.lnAge * lnAge +
    (treated ? coef.lnSbpTreated : coef.lnSbpUntreated) * lnSbp +
    coef.lnTc * lnTc +
    coef.lnHdl * lnHdl +
    coef.lnWc * lnWc +
    coef.smoking * smoke +
    coef.diabetes * dm +
    coef.north * north +
    coef.urban * urban +
    coef.familyAscvd * family +
    (treated ? coef.lnAgeLnSbpTreated : coef.lnAgeLnSbpUntreated) * lnAge * lnSbp +
    coef.lnAgeSmoking * lnAge * smoke +
    coef.lnAgeFamily * lnAge * family

  const y = Math.exp(x - coef.meanX)
  const risk = 1 - coef.s10 ** y
  const percent = Math.max(0, Math.min(99.9, risk * 100))
  const band = chinaParBand(percent)
  const rounded = Number(percent.toFixed(1))

  return {
    ok: true,
    kind: 'china_par',
    input,
    percent: rounded,
    band,
    summary: `China-PAR 10年ASCVD风险 ${rounded}%（${band.label}）`,
    disclaimer:
      '教育评估，依据 China-PAR / T/JPMA 024—2024 公开系数，不替代国家心血管病中心官方工具或医生诊断。高危请就医。',
    source: 'T/JPMA 024—2024；Yang et al., Circulation 2016;134:1430-1440',
  }
}
