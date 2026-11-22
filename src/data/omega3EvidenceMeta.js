/** 路径和问答。给 sitemap、llms 和 JSON-LD 用，不把整篇证据正文打进每个页面。 */
export const OMEGA3_EVIDENCE_PATH = '/products/evidence/omega-3'
export const OMEGA3_EVIDENCE_UPDATED = '2026-11-22'

const FAQS = {
  zh: [
    {
      q: '这一页是在推荐鱼油或 Omega-3 产品吗？',
      a: '不是。它只说明 EPA 与 DHA 的公开研究能说到哪一步，不推荐品牌，不提供用量，也不链到购物页面。',
    },
    {
      q: 'REDUCE-IT 里缺血事件更少，是不是说明鱼油胶囊能预防心脏病？',
      a: '不是。那一项试验用的是高度纯化的 EPA 乙酯，对象是已经在用他汀、甘油三酯偏高、且有心血管疾病或糖尿病并伴其他风险的人。结果属于那一种药物和那一组人，不能写成零售鱼油的预防效果，本页也不建议使用该药。',
    },
    {
      q: '普通人群补充 Omega-3 是否已经证明能预防心血管病或癌症？',
      a: '不能从本页引用的试验得出这个结论。VITAL 的主要结果是，海洋 n-3 脂肪酸补充没有比安慰剂更少地发生主要心血管事件或癌症。Cochrane 2020 年综述对全因死亡和心血管事件的判断是几乎没有影响，证据确定性较高。',
    },
    {
      q: '哪些人不应按这一页自行使用？',
      a: '正在使用抗凝或抗血小板药、有出血倾向、有心房颤动或心房扑动病史、妊娠、哺乳、儿童，以及正在使用他汀或其他处方药的人，都不应按本页自行开始使用。不要因此停用已经开具的药物。本页不能判断某一个人能不能用。',
    },
  ],
  en: [
    {
      q: 'Does this page recommend fish oil or an omega-3 product?',
      a: 'No. It states how far the public evidence on EPA and DHA goes. It recommends no brand, gives no dose, and does not link to a shop.',
    },
    {
      q: 'REDUCE-IT reported fewer ischemic events. Does that mean a fish-oil capsule prevents heart disease?',
      a: 'No. That trial used a highly purified EPA ethyl ester in people already taking a statin, with elevated triglycerides, and with cardiovascular disease or diabetes plus other risk factors. The result belongs to that drug and that group. It is not a prevention claim for a retail fish-oil capsule, and this page does not recommend the drug.',
    },
    {
      q: 'Do supplements prevent cardiovascular disease or cancer in the general population?',
      a: 'The trials cited here do not establish that. In VITAL, marine n-3 fatty acids did not result in a lower incidence of major cardiovascular events or cancer than placebo. A 2020 Cochrane review judged little or no effect on all-cause mortality and on cardiovascular events, with high-certainty evidence.',
    },
    {
      q: 'Who should not start a product from this page?',
      a: 'People on anticoagulants or antiplatelet drugs, people with a bleeding tendency, people with atrial fibrillation or flutter, pregnancy, lactation, children, and people taking a statin or another prescription medicine. Do not stop a prescribed medicine because of this page. This page cannot tell one person whether they may use a product.',
    },
  ],
}

export function getOmega3EvidenceFaqs(lang) {
  return lang === 'en' ? FAQS.en : FAQS.zh
}
