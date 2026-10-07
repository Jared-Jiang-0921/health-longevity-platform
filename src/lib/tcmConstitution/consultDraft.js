export const TCM_CONSULT_DRAFT_KEY = 'tcm-constitution-consult-draft'

const ASK = {
  zh: '请根据下面这份体质自评，给出生活方式上的调养建议，并列出与这些体质相关的经典方剂和单药，作为学习对照。每味方剂或单药写清它通常对应哪一种体质或证候方向，以及方义要点。注明仅供参考，并非确诊。不要写成已经确诊，不要写给这个人抓药的克数、煎服次数，或让其自行服用。',
  en: 'Using the constitution self-check below, give lifestyle care suggestions and list related classical formulas and single herbs as study references. For each one, say which constitution or pattern it is usually linked to, and the formula’s main idea. Mark them as reference only, not a confirmed diagnosis. Do not write a personal dose, decoction schedule, or tell this person to take it.',
  ar: 'اعتماداً على تقييم نمط الجسم أدناه، أعطِ اقتراحات لنمط الحياة واذكر الوصفات الكلاسيكية والأعشاب المفردة المرتبطة بها كمرجع دراسي. لكل واحدة اذكر النمط أو اتجاه المتلازمة المعتاد وفكرة الوصفة. وضّح أنها للمرجعية فقط وليست تشخيصاً مؤكداً. لا تكتب جرعة شخصية أو عدد مرات الغلي أو تطلب من هذا الشخص تناولها.',
}

const CLOSE = {
  zh: '体质是否成立、选用哪首方剂或单药、以及药量多少，都需要就医后由执业医师当面确定。',
  en: 'Whether this constitution applies, which formula or herb to use, and what dose to take all need to be decided in person by a licensed clinician.',
  ar: 'هل ينطبق هذا النمط، وأي وصفة أو عشب يُختار، وما مقدار الجرعة، كل ذلك يحدده طبيب مرخص بعد المعاينة.',
}

export function constitutionConsultDraft(summary, lang = 'zh') {
  const text = String(summary || '').trim()
  if (!text) return ''
  const ask = ASK[lang] || ASK.zh
  const close = CLOSE[lang] || CLOSE.zh
  return `${ask}\n\n${text}\n\n${close}`
}

export function saveConstitutionConsultDraft(summary, lang) {
  const draft = constitutionConsultDraft(summary, lang)
  if (!draft || typeof sessionStorage === 'undefined') return draft
  sessionStorage.setItem(TCM_CONSULT_DRAFT_KEY, draft)
  return draft
}

export function takeConstitutionConsultDraft() {
  if (typeof sessionStorage === 'undefined') return ''
  const draft = sessionStorage.getItem(TCM_CONSULT_DRAFT_KEY) || ''
  if (draft) sessionStorage.removeItem(TCM_CONSULT_DRAFT_KEY)
  return draft
}
