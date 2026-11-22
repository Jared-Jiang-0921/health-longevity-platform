/** 路径和问答。给 sitemap、llms 和 JSON-LD 用，不把整篇证据正文打进每个页面。 */
export const NMN_EVIDENCE_PATH = '/products/evidence/nmn'
export const NMN_EVIDENCE_UPDATED = '2026-11-22'

const FAQS = {
  zh: [
    {
      q: '这一页是在推荐 NMN 或 NR 吗？',
      a: '不是。它只整理公开文献和监管文件能说明的范围，不推荐品牌，不提供用量，也不链到购物页面。',
    },
    {
      q: '血液里 NAD+ 升高，是不是已经证明抗衰老或能够治疗疾病？',
      a: '不是。标志物变化不是疾病结局。现有人体试验样本小、时间短，不能外推成治疗、预防或抗衰老疗效。',
    },
    {
      q: '中国是否已经批准 NMN 作为药品或保健食品？',
      a: '市场监管总局 2021 年的答复写明，当时没有新食品原料、食品添加剂、保健食品和药品许可。以后是否变化，以卫生健康、市场监管和药品监管部门的现行公告为准。申请被受理不是批准。',
    },
    {
      q: '哪些人不应按这一页自行使用？',
      a: '妊娠、哺乳、儿童和青少年，正在接受肿瘤治疗的人，肝肾疾病、即将手术，以及正在使用处方药的人，都不应按本页自行使用。本页不能判断某一个人能不能用。',
    },
  ],
  en: [
    {
      q: 'Does this page recommend NMN or NR?',
      a: 'No. It states the limits of public studies and regulatory texts. It recommends no brand, gives no dose, and does not link to a shop.',
    },
    {
      q: 'Does a higher blood NAD+ prove an anti-aging effect or a treatment?',
      a: 'No. A marker is not a disease outcome. The human trials are small and short, and they do not establish treatment, prevention, or an anti-aging effect.',
    },
    {
      q: 'Has China approved NMN as a drug or a health food?',
      a: 'The 2021 SAMR reply said there was no approval then as a new food ingredient, food additive, health food, or drug. Later changes depend on current notices from the health, market, and drug regulators. Acceptance of an application is not approval.',
    },
    {
      q: 'Who should not start a product from this page?',
      a: 'People who are pregnant, lactating, children or adolescents, people in cancer treatment, people with liver or kidney disease, people facing surgery, and people on prescription medicines. This page cannot tell one person whether they may use a product.',
    },
  ],
}

export function getNmnEvidenceFaqs(lang) {
  return lang === 'en' ? FAQS.en : FAQS.zh
}
