/** 路径和问答。给 sitemap、llms 和 JSON-LD 用，不把整篇证据正文打进每个页面。 */
export const VITAMIN_D_EVIDENCE_PATH = '/products/evidence/vitamin-d'
export const VITAMIN_D_EVIDENCE_UPDATED = '2026-11-22'

const FAQS = {
  zh: [
    {
      q: '这一页是在推荐维生素 D 产品吗？',
      a: '不是。它只说明已核对的人体研究和监管文本能说到哪一步，不推荐品牌，不提供用量，也不链到购物页面。',
    },
    {
      q: '补充维生素 D 是否已经证明能预防癌症或心血管疾病？',
      a: '不能从本页引用的 VITAL 主要结果得出这个结论。那项试验报告，维生素 D3 补充没有比安慰剂更少地发生侵袭性癌症或主要心血管事件。',
    },
    {
      q: '补充维生素 D 是否已经证明能预防骨折？',
      a: 'VITAL 的骨折附属分析报告，在未按缺乏、低骨量或骨质疏松入选的中老年一般人群中，维生素 D3 没有显著降低骨折。Cochrane 综述写道，单独使用维生素 D 在已测试的剂型里不太可能预防髋部骨折；维生素 D 加钙在汇总试验里与髋部骨折有小幅减少有关。那是综述自己的归纳，不是本页给出的用法，也不是某个商品的疗效。',
    },
    {
      q: '哪些人不应按这一页自行使用？',
      a: '妊娠、哺乳、儿童，已有高钙血症、肾结石或肾脏疾病，以及正在接受骨质疏松或其他处方治疗的人，都不应按本页自行开始或停药。本页不能判断某一个人能不能用。',
    },
  ],
  en: [
    {
      q: 'Does this page recommend a vitamin D product?',
      a: 'No. It states how far the checked human studies and regulatory texts go. It recommends no brand, gives no dose, and does not link to a shop.',
    },
    {
      q: 'Do supplements prevent cancer or cardiovascular disease?',
      a: 'The VITAL primary results cited here do not show that. Vitamin D3 supplementation did not result in a lower incidence of invasive cancer or cardiovascular events than placebo.',
    },
    {
      q: 'Do supplements prevent fractures?',
      a: 'In the VITAL fracture ancillary study, vitamin D3 did not significantly lower fractures among generally healthy midlife and older adults who were not selected for deficiency, low bone mass, or osteoporosis. A Cochrane review said vitamin D alone was unlikely to prevent hip fracture in the formats tested, and that vitamin D plus calcium was associated with a small reduction in hip fracture in the pooled trials. That is the review’s summary, not a dose from this page and not a product effect.',
    },
    {
      q: 'Who should not start a product from this page?',
      a: 'Pregnancy, lactation, children, people with high blood calcium, kidney stones, or kidney disease, and people already treated for osteoporosis or with another prescription. Do not stop a prescribed medicine because of this page. This page cannot tell one person whether they may use a product.',
    },
  ],
}

export function getVitaminDEvidenceFaqs(lang) {
  return lang === 'en' ? FAQS.en : FAQS.zh
}
