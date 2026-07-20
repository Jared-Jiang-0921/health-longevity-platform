/**
 * 前沿医学资讯 — 首批正式稿（静态上线；后续以管理员上传 PDF/图文为主）
 * requiredMembership: free | standard | premium
 * 表述遵守「研究提示、非治疗结论」约定；外链尽量指向公开可检索页面。
 */
export const LONGEVITY_NEWS_ARTICLES = [
  {
    id: 'ln-static-1',
    column: '每周长寿研究速递',
    requiredMembership: 'free',
    publishedAt: '2026-07-01',
    title: '衰老细胞清除（Senolytics）：早期人体研究读什么、不读什么',
    summary:
      '部分小样本人体研究观察到达沙替尼联合槲皮素等方案对衰老相关标志物与体能指标的变化。当前证据仍 preliminarily：样本量有限、终点多为替代指标，远不足以支持「抗衰老用药」结论。',
    takeaways: [
      '优先关注试验设计（随机、对照、终点是否临床相关）',
      '媒体「逆转衰老」标题通常过度外推',
      '个体用药必须在执业医师评估下进行，本平台不做处方建议',
    ],
    sourceNote: '可检索关键词：senolytics human trial dasatinib quercetin（PubMed）',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=senolytics+human+trial',
  },
  {
    id: 'ln-static-2',
    column: '研究证据解读',
    requiredMembership: 'free',
    publishedAt: '2026-07-02',
    title: '如何给一篇长寿论文「定证据档」：机制、观察、干预三层',
    summary:
      '读前沿资讯时，建议把论文先归到三层：① 细胞/动物机制；② 人群观察关联；③ 人体干预试验。只有第③层且终点扎实，才更接近「可讨论临床意义」；前两层最多说明「值得继续研究」。',
    takeaways: [
      '关联 ≠ 因果：观察研究易受混杂因素影响',
      '替代终点（生物标志物）改善不等于硬终点（发病/死亡）改善',
      '本站默认表述：目前研究提示可能相关，但仍需更多高质量临床证据',
    ],
    sourceNote: '方法学参考：证据金字塔与临床试验分期（公开教材/Cochrane 介绍页）',
    url: 'https://www.cochrane.org/evidence',
  },
  {
    id: 'ln-static-3',
    column: '争议研究观察',
    requiredMembership: 'standard',
    publishedAt: '2026-07-03',
    title: 'NMN / NR 与「补 NAD+」叙事：证据缺口清单',
    summary:
      '烟酰胺单核苷酸（NMN）与烟酰胺核糖（NR）在动物与早期人体研究中被讨论用于影响 NAD+ 代谢。争议点在于：人体剂量、长期安全性、功能终点（体能、代谢病结局）是否稳健复现，以及商业宣传是否越过证据边界。',
    takeaways: [
      '「提升 NAD+」不等于已证明延长人类健康寿命',
      '关注注册试验与独立重复，而非单一公司新闻稿',
      '特殊人群（孕期、慢病、用药中）应先咨询医生',
    ],
    sourceNote: '可检索：nicotinamide riboside OR NMN clinical trial（PubMed / ClinicalTrials.gov）',
    url: 'https://clinicaltrials.gov/search?term=NMN%20OR%20nicotinamide%20riboside',
  },
  {
    id: 'ln-static-4',
    column: '临床试验追踪',
    requiredMembership: 'standard',
    publishedAt: '2026-07-04',
    title: '如何用 ClinicalTrials.gov 跟踪「衰老/长寿」相关试验',
    summary:
      '公开试验注册库可用来核对：是否在招募、主要终点是什么、有无结果摘要。建议用 aging / senescence / longevity / rapamycin 等词组合检索，并记录 NCT 编号以便复查更新。',
    takeaways: [
      '「正在进行」≠「已证明有效」',
      '优先看主要终点与样本量，再看媒体解读',
      '结果未发表前，避免把注册页当成疗效证据',
    ],
    sourceNote: 'ClinicalTrials.gov',
    url: 'https://clinicaltrials.gov/',
  },
  {
    id: 'ln-static-5',
    column: '指南与共识更新',
    requiredMembership: 'premium',
    publishedAt: '2026-07-05',
    title: '把「指南更新」读成行动清单：适用人群、证据等级、本地化',
    summary:
      '卫健与学会指南通常比单篇前沿论文更适合指导公共卫生与临床路径，但仍受发布地区、适用人群与更新周期限制。阅读时建议同时记下：推荐强度、证据质量，以及是否已被你所在地区监管/学会采纳。',
    takeaways: [
      '指南服务的是群体路径，不能替代个体诊疗',
      '跨国指南迁移到本地前，需考虑可及性与监管差异',
      '本栏目后续将跟进公开可检索的权威更新摘要',
    ],
    sourceNote: '示例入口：WHO 指南库（公开）',
    url: 'https://www.who.int/publications/who-guidelines',
  },
]

export function getLongevityNewsArticles() {
  return LONGEVITY_NEWS_ARTICLES.slice()
}
