/** 首页静态内容（中文为主；EN 为简化占位） */

/**
 * 长寿科学观察站数字：来自生产 Qdrant（2026-08-28）
 * consult_zh 387,899 片段 / 1,072 书目
 * consult_en 531,726 片段 / 294 书目
 */
export const HOME_STATS = [
  {
    id: 'books',
    value: { zh: '1,366', en: '1,366' },
    label: { zh: '入库书目', en: 'Works indexed' },
  },
  {
    id: 'passages',
    value: { zh: '91.9万', en: '919,000+' },
    label: { zh: '知识片段', en: 'Knowledge passages' },
  },
  {
    id: 'zh-corpus',
    value: { zh: '38.8万', en: '388,000+' },
    label: { zh: '中文知识库', en: 'Chinese corpus' },
  },
  {
    id: 'en-corpus',
    value: { zh: '53.2万', en: '532,000+' },
    label: { zh: '英文知识库', en: 'English corpus' },
  },
]

export const HOME_MODULES = [
  {
    path: '/solutions',
    title: { zh: 'AI 长寿方案师', en: 'AI Longevity Coach' },
    intro: {
      zh: '基于您的健康画像与目标，生成分层行动建议：风险识别、优先级排序、报告解读与就医提示。全程标注证据等级与适用边界，仅供健康教育，不替代诊疗。',
      en: 'Builds a health profile and tiered action plan—risks, priorities, lab context, and care prompts—with evidence grades and clear boundaries. Education only, not medical care.',
    },
    chips: {
      zh: ['健康画像', '可解释建议', '就医提示'],
      en: ['Health profile', 'Explainable', 'Care prompts'],
    },
  },
  {
    path: '/products',
    title: { zh: '长寿产品证据库', en: 'Product Evidence Library' },
    intro: {
      zh: '公开说明如何核对成分、研究证据、监管信息与相互作用。逐条商品不是公开可抓取语料。成分证据目前只公开 NMN / NR 一页。不把商品包装成治疗方案。',
      en: 'Public overview of how to check ingredients, evidence, regulatory context, and interactions. Individual products are not a public crawlable corpus. One ingredient page, NMN / NR, is public. Not sold as treatment.',
    },
    chips: {
      zh: ['成分证据', '监管信息', '相互作用'],
      en: ['Ingredients', 'Regulatory', 'Interactions'],
    },
  },
  {
    path: '/tcm-prevention',
    title: { zh: '中医药特色 · 治未病', en: 'TCM Preventive Care' },
    intro: {
      zh: '以中医治未病思想结合现代预防医学的公开说明：体质、四时、饮食、情志与导引。体质辨识需登录，不是公开可抓取语料。教育参考，不替代辨证论治与处方。',
      en: 'Public overview of TCM preventive care plus modern prevention. The constitution check requires sign-in and is not a public crawlable corpus. Education only.',
    },
    chips: {
      zh: ['体质调养', '四时养生', '药食同源'],
      en: ['Constitution', 'Seasons', 'Food therapy'],
    },
    accent: true,
    disclaimer: {
      zh: '教育/生活方式信息，不替代诊疗',
      en: 'Education only—not medical care',
    },
  },
  {
    path: '/health-skills',
    title: { zh: '长寿知识技能', en: 'Health Skills' },
    intro: {
      zh: '将循证医学与生活方式干预拆解为可学可练的结构：知识卡片、实操清单、证据等级、适用人群与风险提示。覆盖睡眠、代谢、运动、营养等主题，支持系列课程与视频学习。',
      en: 'Structured learning—cards, checklists, evidence grades, audience fit, and risk notes—on sleep, metabolism, exercise, and nutrition, with courses and video series.',
    },
    chips: {
      zh: ['系列课程', '证据等级', '实操清单'],
      en: ['Course series', 'Evidence grade', 'Checklists'],
    },
  },
  {
    path: '/longevity-news',
    title: { zh: '前沿医学资讯', en: 'Frontier Medical Insights' },
    intro: {
      zh: '追踪 PubMed、顶刊与临床指南中的长寿与慢病相关进展，提供证据解读与试验动态。统一审慎表述，区分「前沿发现」与「已证实有效」，避免夸大疗效。',
      en: 'Digests from PubMed, leading journals, and guidelines—with evidence framing and trial updates. Frontier findings are not equated with proven efficacy.',
    },
    chips: {
      zh: ['指南速递', '顶刊解读', '试验追踪'],
      en: ['Guidelines', 'Journal digests', 'Trials'],
    },
  },
  {
    path: '/translation-opportunities',
    title: { zh: '转化应用机遇', en: 'Translation & Commercialization' },
    intro: {
      zh: '面向创业者、投资人与产业团队的公开说明：从研究与指南中提示技术、产品与服务形态，以及监管、证据与获客风险。机会条目没有逐条公开永久链接。',
      en: 'Public overview for founders and industry: translational signals and regulatory, evidence, and adoption risks. Individual opportunities are not published as public permalinks.',
    },
    chips: {
      zh: ['产业趋势', '商业模式', '合规风险'],
      en: ['Trends', 'Business models', 'Compliance'],
    },
  },
]

export const HOME_TODAY_FRONTIER = [
  {
    id: 1,
    title: 'Senolytic drugs reduce biomarkers of aging in humans',
    source: 'Nature Medicine',
    evidence: 'B',
    summary: {
      zh: '早期人体试验显示衰老细胞清除与炎症指标改善相关，尚不足以作为临床常规推荐。',
      en: 'Early human trials link senescent-cell clearance with changes in inflammatory markers. That is not enough for routine clinical use.',
    },
  },
  {
    id: 2,
    title: 'Intermittent fasting and cardiovascular outcomes: 5-year follow-up',
    source: 'Lancet Healthy Longevity',
    evidence: 'C',
    summary: {
      zh: '观察性队列提示时间限制进食与心血管事件关联，需更多随机对照验证。',
      en: 'An observational cohort suggests a link between time-restricted eating and cardiovascular events. More randomized trials are needed.',
    },
  },
  {
    id: 3,
    title: 'Gut microbiome and longevity: meta-analysis of centenarian cohorts',
    source: 'Cell',
    evidence: 'B',
    summary: {
      zh: '百岁老人菌群特征具一致性，但因果与干预路径仍待明确。',
      en: 'Centenarian microbiome patterns look consistent, but cause and any intervention path are still unclear.',
    },
  },
]

export const HOME_HOT_EVIDENCE = [
  {
    id: 1,
    name: { zh: '维生素 D3 + K2', en: 'Vitamin D3 + K2' },
    audience: {
      zh: '日照不足、骨骼健康关注者',
      en: 'People with little sun who are watching bone health',
    },
    risk: {
      zh: '高钙血症、抗凝用药者需咨询医生',
      en: 'People with high blood calcium, or on anticoagulants, should ask a clinician',
    },
    evidence: 'B',
  },
  {
    id: 2,
    name: { zh: 'Omega-3 鱼油', en: 'Omega-3 fish oil' },
    audience: {
      zh: '心血管与认知健康关注者',
      en: 'People watching cardiovascular and cognitive health',
    },
    risk: {
      zh: '抗凝/手术前后需评估出血风险',
      en: 'Bleeding risk should be reviewed around anticoagulants or surgery',
    },
    evidence: 'A',
  },
  {
    id: 3,
    name: { zh: '间歇性断食（16:8）', en: 'Time-restricted eating (16:8)' },
    audience: {
      zh: '代谢健康、体重管理者',
      en: 'People managing metabolic health or weight',
    },
    risk: {
      zh: '糖尿病、妊娠、进食障碍不适用；需个体化',
      en: 'Not for diabetes, pregnancy, or eating disorders; needs an individual plan',
    },
    evidence: 'C',
  },
]

export function getHomeCopy(lang) {
  const zh = {
    heroH1: '循证长寿医学平台：融合现代医学与中医治未病的预防保健方案',
    heroSub:
      '基于指南与研究证据，结合中医体质与四时养生框架，生成可执行的生活方式与风险提示。教育信息，不替代诊疗；明确标注证据等级与适用人群。',
    ctaPrimary: '1分钟生成我的行动建议',
    ctaSecondary: '浏览证据库',
    demoLabel: '示例报告',
    demoRisk: '风险概览',
    demoRiskVal: '代谢 · 睡眠 · 中等关注',
    demoAdvice: '建议摘要',
    demoAdviceVal: '优先调整睡眠节律；增加每周 150 分钟中等强度活动；补充证据等级 B 的营养策略。',
    demoEvidence: '证据等级',
    trustTitle: '我们如何呈现信息',
    trustEvidence: '证据等级',
    trustEvidenceDesc: 'A–D 分级标注，区分指南、RCT 与观察性研究',
    trustAudience: '适用人群',
    trustAudienceDesc: '明确谁可能受益、谁应谨慎或避免',
    trustRisk: '风险与相互作用',
    trustRiskDesc: '提示就医指征、药物相互作用与特殊人群',
    modulesTitle: '六大服务模块',
    modulesLead: '每项模块均配有专属封面与主要内容介绍，点击进入对应能力',
    statsTitle: '长寿科学观察站',
    statsLead: '数字来自已入库知识库（中英文），随收录更新',
    moduleEnter: '进入模块',
    todayTitle: '今日更新',
    todayCurated: '编辑精选 · 非实时推送',
    todayFrontier: '今日前沿',
    todayHot: '热门证据条目',
    evidenceLabel: '证据',
    appliesLabel: '适用：',
    cautionLabel: '注意',
    stepsTitle: '三步上手',
    steps: [
      { title: '选择目标', desc: '睡眠 / 代谢 / 运动 / 认知 / 体检解读' },
      { title: '生成建议', desc: '优先级 + 风险提示 + 证据等级' },
      { title: '加入计划', desc: '每周行动清单 + 追踪（登录后）' },
    ],
    stepNote: '收藏、生成报告与计划追踪需登录后使用',
    welcome: '欢迎',
  }
  const en = {
    heroH1: 'Evidence-based longevity platform: modern medicine meets preventive TCM',
    heroSub:
      'Guideline-informed insights with constitution and seasonal framing. Educational only—not a substitute for medical care.',
    ctaPrimary: 'Get my action plan',
    ctaSecondary: 'Browse evidence library',
    demoLabel: 'Sample report',
    demoRisk: 'Risk overview',
    demoRiskVal: 'Metabolic · Sleep · Moderate',
    demoAdvice: 'Summary',
    demoAdviceVal: 'Prioritize sleep; 150 min/week moderate activity; grade-B nutrition strategies.',
    demoEvidence: 'Evidence',
    trustTitle: 'How we present information',
    trustEvidence: 'Evidence grades',
    trustEvidenceDesc: 'A–D labels for guidelines, RCTs, and observational data',
    trustAudience: 'Who it applies to',
    trustAudienceDesc: 'Who may benefit vs. who should be cautious',
    trustRisk: 'Risks & interactions',
    trustRiskDesc: 'Care prompts, interactions, special populations',
    modulesTitle: 'Six service modules',
    modulesLead: 'Each module has a cover image and a main introduction—tap to explore',
    statsTitle: 'Longevity Science Observatory',
    statsLead: 'Counts from the indexed Chinese and English knowledge base',
    moduleEnter: 'Enter module',
    todayTitle: 'Updates',
    todayCurated: 'Editor’s picks · not live feed',
    todayFrontier: 'Frontier highlights',
    todayHot: 'Popular evidence entries',
    evidenceLabel: 'Evidence',
    appliesLabel: 'For: ',
    cautionLabel: 'Note',
    stepsTitle: 'Get started in 3 steps',
    steps: [
      { title: 'Choose a goal', desc: 'Sleep, metabolism, exercise, cognition, labs' },
      { title: 'Generate guidance', desc: 'Priorities, risks, evidence grades' },
      { title: 'Add to plan', desc: 'Weekly checklist + tracking (sign in)' },
    ],
    stepNote: 'Reports, favorites, and plans require sign-in',
    welcome: 'Welcome',
  }
  if (lang === 'en') return en
  return zh
}
