export const TCM_CONSULT_DRAFT_KEY = 'tcm-constitution-consult-draft'

const ASK = {
  zh: '请根据下面这份体质自评，给出生活方式上的调养建议，并说明依据的是哪一种体质的常见调养方向。这是教育参考，不是当场辨证。不要写成已经确诊，不要写可执行的个人用药或剂量。',
  en: 'Using the constitution self-check below, give lifestyle care suggestions and say which type’s usual care direction you are following. This is education only, not an in-person pattern diagnosis. Do not write a confirmed diagnosis or an executable personal medicine dose.',
  ar: 'اعتماداً على تقييم نمط الجسم أدناه، أعطِ اقتراحات عناية في أسلوب الحياة واذكر اتجاه العناية المعتاد لأي نمط. هذا تعليمي فقط وليس تمييزاً حضورياً. لا تكتب تشخيصاً مؤكداً ولا جرعة دواء تنفيذية.',
}

export function constitutionConsultDraft(summary, lang = 'zh') {
  const text = String(summary || '').trim()
  if (!text) return ''
  const ask = ASK[lang] || ASK.zh
  return `${ask}\n\n${text}`
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
