/** 路径和问答。给 sitemap、llms 和 JSON-LD 用，不把整篇证据正文打进每个页面。 */
export const CREATINE_EVIDENCE_PATH = '/products/evidence/creatine'
export const CREATINE_EVIDENCE_UPDATED = '2026-11-22'

const FAQS = {
  zh: [
    {
      q: '这一页是在推荐肌酸产品吗？',
      a: '不是。它只说明已核对的人体研究和监管文本能说到哪一步，不推荐品牌，不提供用量，也不链到购物页面。',
    },
    {
      q: '抗阻训练试验里瘦体重或力量的差值，是不是说明肌酸胶囊保证增肌或提高运动表现？',
      a: '不是。Chilibeck 等人的综述汇总的是平均年龄约 57 至 70 岁、同时在做抗阻训练的人，比较的是训练加肌酸和训练加安慰剂。差值属于那些试验。它不是不训练的人的结果，不是运动表现保证，也不是本页给出的用法。',
    },
    {
      q: '肌酸是否已经证明能治疗帕金森病、肌病，或减慢衰老？',
      a: '不能从本页引用的材料得出这些结论。一项纳入早期、已在使用多巴胺能药物的帕金森病人的大型试验因无效可能高而提前停止，没有显示出临床结局更好。肌肉疾病的 Cochrane 综述讨论的是已经患病的人，本页不把它当成零售补充剂的用途，也不建议用肌酸治疗。健康人记忆测验上的一篇荟萃分析存在统计争议，不是痴呆预防，也不是抗衰老疗效。',
    },
    {
      q: '哪些人不应按这一页自行使用？',
      a: '妊娠、哺乳、儿童，已知肾脏疾病，已经在治疗帕金森病或其他疾病，以及正在使用处方药的人，都不应按本页自行开始或停药。本页不能判断某一个人能不能用，也不能解释某一次血肌酐结果。',
    },
  ],
  en: [
    {
      q: 'Does this page recommend a creatine product?',
      a: 'No. It states how far the checked human studies and regulatory texts go. It recommends no brand, gives no dose, and does not link to a shop.',
    },
    {
      q: 'A training trial found a difference in lean mass or strength. Does that mean a capsule guarantees muscle gain or sports performance?',
      a: 'No. The Chilibeck review pooled adults whose mean ages across studies were about 57 to 70, and who were also doing resistance training. It compared training plus creatine with training plus placebo. The difference belongs to those trials. It is not a result for people who do not train, not a sports guarantee, and not a dose from this page.',
    },
    {
      q: 'Does creatine treat Parkinson disease or a muscle disease, or slow aging?',
      a: 'The materials cited here do not show that. A large trial in early Parkinson disease, in people already on dopaminergic therapy, stopped early for futility and did not show better clinical outcomes. A Cochrane review of muscle diseases is about people who already had those diseases. This page does not turn it into a use for a retail supplement and does not recommend creatine as treatment. A meta-analysis of memory tests in healthy people is disputed on statistical grounds. It is not prevention of dementia and not an anti-aging effect.',
    },
    {
      q: 'Who should not start a product from this page?',
      a: 'Pregnancy, lactation, children, people with known kidney disease, people already treated for Parkinson disease or another illness, and people on prescription medicines. Do not stop a prescribed medicine because of this page. This page cannot tell one person whether they may use a product, and it cannot interpret one creatinine result.',
    },
  ],
}

export function getCreatineEvidenceFaqs(lang) {
  return lang === 'en' ? FAQS.en : FAQS.zh
}
