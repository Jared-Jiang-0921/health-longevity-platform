/** 路径和问答。给 sitemap、llms 和 JSON-LD 用，不把整篇证据正文打进每个页面。 */
export const MAGNESIUM_EVIDENCE_PATH = '/products/evidence/magnesium'
export const MAGNESIUM_EVIDENCE_UPDATED = '2026-11-22'

const FAQS = {
  zh: [
    {
      q: '这一页是在推荐镁产品吗？',
      a: '不是。它只说明已核对的人体研究和监管文本能说到哪一步，不推荐品牌，不提供用量，也不链到购物页面。',
    },
    {
      q: '血压数值上的差值，是不是说明镁已经能治疗高血压，或预防中风和心肌梗死？',
      a: '不是。2025 年的荟萃分析报告的是血压计上的合并差值，而且异质性高；血压正常的一组没有达到统计学显著。血压不是中风、心肌梗死或死亡。FDA 2022 年的信件把相关证据写成不一致、没有定论，那是一份合格声称的执法裁量，不是授权健康声称，也不是药品批准。',
    },
    {
      q: '镁是否已经证明能治疗失眠、抽筋、糖尿病，或减慢衰老？',
      a: '不能从本页引用的材料得出这些结论。老年人失眠的综述只有三项试验，作者把证据质量评为低到极低，并写明文献不足以作出有充分依据的使用建议。抽筋的 Cochrane 综述写明，镁不太可能为有骨骼肌抽筋的老年人提供有临床意义的预防。血糖和胰岛素敏感性是化验指标，不是糖尿病发病、并发症或死亡。这些都不是抗衰老疗效。',
    },
    {
      q: '哪些人不应按这一页自行使用？',
      a: '妊娠、哺乳、儿童，肾功能下降，以及正在使用处方药的人，都不应按本页自行开始或停药。肾功能明显下降时，补充剂、泻药或抗酸药带来的高镁血症可以很严重。本页不能判断某一个人能不能用，也不能解释某一次血镁或血压结果。不要因为读到血压差值就停用已经开具的降压药。',
    },
  ],
  en: [
    {
      q: 'Does this page recommend a magnesium product?',
      a: 'No. It states how far the checked human studies and regulatory texts go. It recommends no brand, gives no dose, and does not link to a shop.',
    },
    {
      q: 'A trial found a difference in blood pressure. Does that mean magnesium treats hypertension or prevents stroke and heart attack?',
      a: 'No. The 2025 meta-analysis reports a pooled difference on a blood-pressure measurement, with high heterogeneity, and the normotensive subgroup did not reach statistical significance. Blood pressure is not stroke, myocardial infarction, or death. FDA’s 2022 letter called the evidence inconsistent and inconclusive. That letter is enforcement discretion for a qualified claim. It is not an authorized health claim and not a drug approval.',
    },
    {
      q: 'Does magnesium treat insomnia, cramps, or diabetes, or slow aging?',
      a: 'The materials cited here do not show that. The review in older adults with insomnia had three trials. Its authors rated the evidence low to very low and said the literature was not enough for a well-informed recommendation. The Cochrane review of cramps says magnesium is unlikely to provide clinically meaningful cramp prophylaxis for older adults with skeletal muscle cramps. Glucose and insulin-sensitivity markers are laboratory measures, not diabetes incidence, complications, or death. None of this is an anti-aging effect.',
    },
    {
      q: 'Who should not start a product from this page?',
      a: 'Pregnancy, lactation, children, people with reduced kidney function, and people on prescription medicines. Do not stop a prescribed medicine, including a blood-pressure medicine, because of this page. With substantially decreased kidney function, hypermagnesemia from supplements, cathartics, or antacids can be severe. This page cannot tell one person whether they may use a product, and it cannot interpret one magnesium or blood-pressure result.',
    },
  ],
}

export function getMagnesiumEvidenceFaqs(lang) {
  return lang === 'en' ? FAQS.en : FAQS.zh
}
