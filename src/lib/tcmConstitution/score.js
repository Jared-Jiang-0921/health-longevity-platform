/**
 * 教育用体质计分。转化分与判定门槛对应 ZYYXH/T157-2009：
 * 转化分 = (原始分 − 条目数) / (条目数 × 4) × 100
 * 偏颇体质：≥40 是，30–39 倾向，<30 否
 * 平和质：≥60 且其余八种均 <30 为是；≥60 且其余均 <40 为基本是；否则否
 * 舌象只生成对照，不改任何分数。
 */
import { CONSTITUTION_GROUPS, CONSTITUTION_QUESTION_IDS } from '../../data/tcmConstitutionSurvey.js'

const BIASED_IDS = CONSTITUTION_GROUPS.map((group) => group.id).filter((id) => id !== 'balanced')

export const TONGUE_COLORS = ['pale', 'pink', 'red', 'dark']
export const TONGUE_COATINGS = ['thin-white', 'white-greasy', 'yellow-greasy', 'little']
export const TONGUE_MARKS = ['teeth', 'cracks', 'spots', 'plump']

/**
 * 对照只用 ZYYXH/T157-2009 常见表现里写明的舌象组合。
 * 裂纹可记录，不参与对照。特禀质没有特定舌象。
 */
export function tongueComparison(features) {
  const color = features?.tongueColor || ''
  const coating = features?.coating || ''
  const marks = new Set(features?.marks || [])
  const has = (mark) => marks.has(mark)
  const supported = []
  const notes = []

  if (color === 'pink' && has('teeth')) supported.push('qi-deficiency')
  else if (has('teeth')) notes.push('teeth-without-pink')

  if (color === 'pale' && has('plump')) supported.push('yang-deficiency')
  else if (color === 'pale') notes.push('pale-without-plump')

  if (color === 'red' && coating === 'little') supported.push('yin-deficiency')
  else if (color === 'red' && coating !== 'yellow-greasy') notes.push('red-without-scanty')

  if (coating === 'white-greasy') supported.push('phlegm-dampness')

  if (color === 'red' && coating === 'yellow-greasy') supported.push('damp-heat')
  else if (coating === 'yellow-greasy') notes.push('yellow-without-red')

  if (color === 'dark' || has('spots')) supported.push('blood-stasis')

  const plain = color === 'pink' && coating === 'thin-white' && !has('teeth') && !has('spots') && !has('plump')
  if (plain) {
    supported.push('balanced', 'qi-stagnation')
    notes.push('pink-thin-white')
  }

  if (has('cracks')) notes.push('cracks-not-compared')
  return { supported, notes }
}

function round1(n) {
  return Math.round(n * 10) / 10
}

export function convertedScore(values) {
  const n = values.length
  if (!n) return null
  const raw = values.reduce((sum, v) => sum + v, 0)
  return { raw, score: round1(((raw - n) / (n * 4)) * 100) }
}

export function judgeBiased(score) {
  if (score >= 40) return 'yes'
  if (score >= 30) return 'tendency'
  return 'no'
}

export function judgeBalanced(score, biasedScores) {
  if (score >= 60 && biasedScores.every((s) => s < 30)) return 'yes'
  if (score >= 60 && biasedScores.every((s) => s < 40)) return 'basic'
  return 'no'
}

export function normalizeTongue(raw) {
  if (!raw || raw.confirmed !== true) return null
  const tongueColor = TONGUE_COLORS.includes(raw.tongueColor) ? raw.tongueColor : ''
  const coating = TONGUE_COATINGS.includes(raw.coating) ? raw.coating : ''
  const marks = Array.isArray(raw.marks)
    ? [...new Set(raw.marks.filter((mark) => TONGUE_MARKS.includes(mark)))]
    : []
  if (!tongueColor && !coating && !marks.length) return null
  return { tongueColor, coating, marks, confirmed: true }
}

export function compareTongue(features, judgments) {
  if (!features) return null
  const { supported, notes } = tongueComparison(features)
  const aligned = []
  const divergent = []
  for (const id of supported) {
    const judgment = judgments?.[id]
    const agrees = id === 'balanced'
      ? judgment === 'yes' || judgment === 'basic'
      : judgment === 'yes' || judgment === 'tendency'
    if (id === 'balanced' || id === 'qi-stagnation') {
      if (agrees) aligned.push(id)
      continue
    }
    if (agrees) aligned.push(id)
    else divergent.push(id)
  }
  return {
    features,
    aligned,
    divergent,
    notes,
    changesScore: false,
  }
}

export function scoreConstitution(answers, tongueRaw) {
  const values = {}
  for (const id of CONSTITUTION_QUESTION_IDS) {
    const n = Number(answers?.[id])
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return { ok: false, error: '请完成全部题目（每题 1–5 分）' }
    }
    values[id] = n
  }

  const types = CONSTITUTION_GROUPS.map((group) => {
    const picked = group.items.map((item) => values[item.id])
    const scored = convertedScore(picked)
    return { id: group.id, raw: scored.raw, score: scored.score, judgment: 'no' }
  })
  const byId = Object.fromEntries(types.map((row) => [row.id, row]))
  const biasedScores = BIASED_IDS.map((id) => byId[id].score)
  for (const id of BIASED_IDS) byId[id].judgment = judgeBiased(byId[id].score)
  byId.balanced.judgment = judgeBalanced(byId.balanced.score, biasedScores)

  const judgments = Object.fromEntries(types.map((row) => [row.id, row.judgment]))
  const tongue = compareTongue(normalizeTongue(tongueRaw), judgments)
  const ranked = types
    .filter((row) => row.id !== 'balanced' && (row.judgment === 'yes' || row.judgment === 'tendency'))
    .sort((a, b) => b.score - a.score)

  return {
    ok: true,
    types,
    primary: ranked.filter((row) => row.judgment === 'yes').map((row) => row.id),
    tendencies: ranked.filter((row) => row.judgment === 'tendency').map((row) => row.id),
    balanced: byId.balanced.judgment,
    tongue,
  }
}

const JUDGMENT_ZH = { yes: '是', basic: '基本是', tendency: '倾向', no: '否' }

export function constitutionSummary(result) {
  if (!result?.ok) return ''
  const name = {
    balanced: '平和质',
    'qi-deficiency': '气虚质',
    'yang-deficiency': '阳虚质',
    'yin-deficiency': '阴虚质',
    'phlegm-dampness': '痰湿质',
    'damp-heat': '湿热质',
    'blood-stasis': '血瘀质',
    'qi-stagnation': '气郁质',
    special: '特禀质',
  }
  const lines = result.types
    .filter((row) => row.judgment !== 'no')
    .map((row) => `${name[row.id] || row.id}${JUDGMENT_ZH[row.judgment] || row.judgment}（转化分 ${row.score}）`)
  const head = lines.length ? lines.join('，') : '九种体质均未达到倾向'
  const noteZh = {
    'pale-without-plump': '只见舌色淡、未见胖嫩，不对照阳虚质',
    'teeth-without-pink': '只见齿痕、舌色不是淡红，不对照气虚质',
    'red-without-scanty': '只见舌红、未见少津，不对照阴虚质',
    'yellow-without-red': '只见黄腻苔、舌质未见偏红，不对照湿热质',
    'cracks-not-compared': '裂纹只作记录，不参与体质对照',
    'pink-thin-white': '舌淡红、苔薄白，与平和质和气郁质的常见舌象描述相同',
  }
  let tongue = '未做舌象对照'
  if (result.tongue) {
    const aligned = result.tongue.aligned.map((id) => name[id] || id)
    const divergent = result.tongue.divergent.map((id) => name[id] || id)
    const notes = (result.tongue.notes || []).map((code) => noteZh[code]).filter(Boolean)
    const parts = []
    if (aligned.length) parts.push(`与问卷同向：${aligned.join('、')}`)
    if (divergent.length) parts.push(`与问卷不一致：${divergent.join('、')}`)
    if (notes.length) parts.push(notes.join('；'))
    tongue = parts.length ? parts.join('；') : '已确认舌象，未见与体质标准舌象原文对应的组合'
  }
  return `体质自评（教育参考，非辨证）：${head}。舌象对照（不改变问卷分数）：${tongue}。未经当场辨证，不能作为用药依据。`.slice(0, 800)
}
