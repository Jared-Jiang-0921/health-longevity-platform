/**
 * 帕金森病相对风险（教育计算）
 *
 * 乘子取自 Noyce et al., Ann Neurol 2012;72:893–901. PMID 23071076。
 * PREDICT-PD 基础算法（Noyce et al., JNNP 2014;85:31–37）使用同一荟萃分析。
 *
 * 本工具只输出相对风险倍数，不输出“患帕金森病的百分概率”：
 * MDS 前驱期标准需要嗅觉测验、PSG 等，网站问卷无法完成。
 *
 * 明确写入该荟萃分析的效应量才纳入乘子；RBD / 嗅觉减退仅作前驱提示。
 */

function toTriBool(value) {
  if (value === true || value === 'true' || value === 1 || value === '1' || value === 'yes') return true
  if (value === false || value === 'false' || value === 0 || value === '0' || value === 'no') return false
  return null
}

/** 论文给出的点估计 */
export const NOYCE_2012 = {
  familyFirstDegree: 3.23,
  constipation: 2.34,
  currentSmoking: 0.44,
  formerSmoking: 0.78,
  coffee: 0.67,
  pesticide: 1.78,
  moodDisorder: 2.0,
  male: 1.5,
}

export function normalizeParkinsonInput(raw = {}) {
  const nicotine = ['never', 'former', 'recent', 'current'].includes(raw.nicotine)
    ? raw.nicotine
    : (toTriBool(raw.smoking) ? 'current' : '')
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    nicotine,
    familyPd: toTriBool(raw.familyPd),
    constipation: toTriBool(raw.constipation),
    drinksCoffee: toTriBool(raw.drinksCoffee),
    pesticide: toTriBool(raw.pesticide),
    moodDisorder: toTriBool(raw.moodDisorder),
    rbd: toTriBool(raw.rbd),
    hyposmia: toTriBool(raw.hyposmia),
  }
}

export function validateParkinsonInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!input.nicotine) return '请填写烟草暴露'
  if (
    input.familyPd == null
    || input.constipation == null
    || input.drinksCoffee == null
    || input.pesticide == null
    || input.moodDisorder == null
    || input.rbd == null
    || input.hyposmia == null
  ) {
    return '请完成帕金森专项问题'
  }
  return ''
}

function smokingFactor(nicotine) {
  if (nicotine === 'current') return NOYCE_2012.currentSmoking
  if (nicotine === 'former' || nicotine === 'recent') return NOYCE_2012.formerSmoking
  return 1
}

function bandForRr(rr) {
  if (rr >= 3) return { id: 'high', label: '相对风险明显升高', adviseClinician: true }
  if (rr >= 1.5) return { id: 'intermediate', label: '相对风险升高', adviseClinician: true }
  if (rr >= 0.7) return { id: 'low', label: '接近参考组合', adviseClinician: false }
  return { id: 'low', label: '相对风险较低', adviseClinician: false }
}

export function computeParkinson(raw = {}) {
  const input = normalizeParkinsonInput(raw)
  const error = validateParkinsonInput(input)
  if (error) return { ok: false, error, kind: 'parkinson' }

  const parts = [
    { id: 'sex', name: '男性（约 1.5 倍）', factor: input.sex === 'male' ? NOYCE_2012.male : 1, applied: input.sex === 'male' },
    { id: 'family', name: '一级亲属帕金森病', factor: input.familyPd ? NOYCE_2012.familyFirstDegree : 1, applied: input.familyPd },
    { id: 'constipation', name: '便秘', factor: input.constipation ? NOYCE_2012.constipation : 1, applied: input.constipation },
    { id: 'smoking', name: '吸烟史', factor: smokingFactor(input.nicotine), applied: input.nicotine !== 'never' },
    { id: 'coffee', name: '喝咖啡', factor: input.drinksCoffee ? NOYCE_2012.coffee : 1, applied: input.drinksCoffee },
    { id: 'pesticide', name: '农药暴露', factor: input.pesticide ? NOYCE_2012.pesticide : 1, applied: input.pesticide },
    { id: 'mood', name: '焦虑或抑郁史', factor: input.moodDisorder ? NOYCE_2012.moodDisorder : 1, applied: input.moodDisorder },
  ]
  const relativeRisk = parts.reduce((acc, row) => acc * row.factor, 1)
  const rounded = Math.round(relativeRisk * 100) / 100
  const prodromalFlags = [
    input.rbd ? '可能的 RBD（睡眠中有梦境行为）' : null,
    input.hyposmia ? '嗅觉明显减退' : null,
  ].filter(Boolean)
  const band = prodromalFlags.length ? { id: 'high', label: '有前驱提示，建议神经科评估', adviseClinician: true } : bandForRr(rounded)

  return {
    ok: true,
    kind: 'parkinson',
    model: 'Noyce 2012 / PREDICT-PD basic relative risk',
    relativeRisk: rounded,
    parts,
    prodromalFlags,
    band,
    summary: `帕金森相对风险约 ${rounded} 倍（Noyce 2012 乘子）${prodromalFlags.length ? `；前驱提示：${prodromalFlags.join('、')}` : ''}。`,
    disclaimer: '仅供健康教育。这是相对风险倍数，不是患病概率，也不能诊断帕金森病。有梦境行为或嗅觉明显减退时，请看神经科，不要自行停药。',
    input,
  }
}
