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
export const TONGUE_MARKS = ['teeth', 'cracks', 'spots']

const TONGUE_LINKS = [
  { match: (f) => f.tongueColor === 'pale', types: ['qi-deficiency', 'yang-deficiency'] },
  { match: (f) => f.tongueColor === 'red', types: ['yin-deficiency'] },
  { match: (f) => f.tongueColor === 'dark', types: ['blood-stasis'] },
  { match: (f) => f.coating === 'white-greasy', types: ['phlegm-dampness'] },
  { match: (f) => f.coating === 'yellow-greasy', types: ['damp-heat'] },
  { match: (f) => f.coating === 'little', types: ['yin-deficiency'] },
  { match: (f) => f.marks.includes('teeth'), types: ['qi-deficiency'] },
  { match: (f) => f.marks.includes('cracks'), types: ['yin-deficiency'] },
  { match: (f) => f.marks.includes('spots'), types: ['blood-stasis'] },
]

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
  const linked = new Set()
  for (const rule of TONGUE_LINKS) {
    if (rule.match(features)) {
      for (const id of rule.types) linked.add(id)
    }
  }
  const aligned = []
  const divergent = []
  for (const id of linked) {
    const judgment = judgments[id]
    if (judgment === 'yes' || judgment === 'tendency') aligned.push(id)
    else divergent.push(id)
  }
  return {
    features,
    aligned,
    divergent,
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
  let tongue = '未做舌象对照'
  if (result.tongue) {
    const aligned = result.tongue.aligned.map((id) => name[id] || id)
    const divergent = result.tongue.divergent.map((id) => name[id] || id)
    const parts = []
    if (aligned.length) parts.push(`与问卷同向：${aligned.join('、')}`)
    if (divergent.length) parts.push(`与问卷不一致：${divergent.join('、')}`)
    tongue = parts.length ? parts.join('；') : '已确认舌象，未见与偏颇体质对应的特征'
  }
  return `体质自评（教育参考，非辨证）：${head}。舌象对照（不改变问卷分数）：${tongue}。未经当场辨证，不能作为用药依据。`.slice(0, 800)
}
