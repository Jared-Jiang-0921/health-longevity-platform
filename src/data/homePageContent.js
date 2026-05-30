/** 首页静态内容（中文为主；EN/AR 为简化占位） */

export const HOME_MODULES = [
  {
    path: '/solutions',
    title: { zh: 'AI长寿师', en: 'AI Longevity Coach', ar: 'مدرب طول العمر' },
    desc: {
      zh: '输入情况，生成分层建议与就医提示',
      en: 'Enter your context for tiered guidance and care prompts.',
      ar: 'أدخل وضعك للحصول على إرشادات.',
    },
    chips: {
      zh: ['个性化', '可解释', '不替代诊疗'],
      en: ['Personalized', 'Explainable', 'Not medical care'],
      ar: ['شخصي', 'قابل للتفسير', 'ليس رعاية'],
    },
  },
  {
    path: '/health-skills',
    title: { zh: '长寿知识技能', en: 'Health Skills', ar: 'مهارات الصحة' },
    desc: {
      zh: '把医学证据变成可执行清单',
      en: 'Turn evidence into actionable checklists.',
      ar: 'حوّل الأدلة إلى قوائم عمل.',
    },
    chips: {
      zh: ['证据等级', '实践步骤', '风险提示'],
      en: ['Evidence grade', 'Steps', 'Risk notes'],
      ar: ['درجة الأدلة', 'خطوات', 'مخاطر'],
    },
  },
  {
    path: '/products',
    title: { zh: '长寿产品证据库', en: 'Evidence Library', ar: 'مكتبة الأدلة' },
    desc: {
      zh: '成分—证据—风险—适用人群一页看懂',
      en: 'Ingredients, evidence, risks, and audience in one view.',
      ar: 'مكونات وأدلة ومخاطر في صفحة واحدة.',
    },
    chips: {
      zh: ['监管信息', '相互作用', '证据分级'],
      en: ['Regulatory', 'Interactions', 'Grading'],
      ar: ['تنظيمي', 'تفاعلات', 'تصنيف'],
    },
  },
  {
    path: '/tcm-prevention',
    title: { zh: '中医治未病', en: 'Preventive TCM', ar: 'الوقاية الصينية' },
    desc: {
      zh: '体质辨识 × 四时养生：构建你的日常预防方案',
      en: 'Constitution × seasonal care for daily prevention.',
      ar: 'نمط الجسم والوقاية الموسمية.',
    },
    chips: {
      zh: ['体质评估', '四季调养', '食养与起居'],
      en: ['Constitution', 'Seasons', 'Diet & lifestyle'],
      ar: ['نمط', 'فصول', 'تغذية'],
    },
    accent: true,
    disclaimer: {
      zh: '教育/生活方式信息，不替代诊疗',
      en: 'Education only—not medical care',
      ar: 'تعليمي فقط',
    },
  },
  {
    path: '/longevity-news',
    title: { zh: '前沿医学资讯', en: 'Medical Insights', ar: 'مستجدات طبية' },
    desc: {
      zh: '指南/顶刊/试验进展，按证据解读',
      en: 'Guidelines, journals, trials—with evidence framing.',
      ar: 'إرشادات ودوريات وتجارب.',
    },
    chips: {
      zh: ['PubMed', '指南速递', '试验追踪'],
      en: ['PubMed', 'Guidelines', 'Trials'],
      ar: ['PubMed', 'إرشادات', 'تجارب'],
    },
  },
  {
    path: '/translation-opportunities',
    title: { zh: '转化应用机会', en: 'Commercialization', ar: 'فرص التطبيق' },
    desc: {
      zh: '从研究到场景：机会、合规与落地路径',
      en: 'Research to market: opportunities and compliance paths.',
      ar: 'من البحث إلى السوق.',
    },
    chips: {
      zh: ['产业趋势', '合规风险', '场景库'],
      en: ['Trends', 'Compliance', 'Use cases'],
      ar: ['اتجاهات', 'امتثال', 'سيناريوهات'],
    },
    muted: true,
  },
]

export const HOME_TODAY_FRONTIER = [
  {
    id: 1,
    title: 'Senolytic drugs reduce biomarkers of aging in humans',
    source: 'Nature Medicine',
    evidence: 'B',
    summary: '早期人体试验显示衰老细胞清除与炎症指标改善相关，尚不足以作为临床常规推荐。',
  },
  {
    id: 2,
    title: 'Intermittent fasting and cardiovascular outcomes: 5-year follow-up',
    source: 'Lancet Healthy Longevity',
    evidence: 'C',
    summary: '观察性队列提示时间限制进食与心血管事件关联，需更多随机对照验证。',
  },
  {
    id: 3,
    title: 'Gut microbiome and longevity: meta-analysis of centenarian cohorts',
    source: 'Cell',
    evidence: 'B',
    summary: '百岁老人菌群特征具一致性，但因果与干预路径仍待明确。',
  },
]

export const HOME_HOT_EVIDENCE = [
  {
    id: 1,
    name: '维生素 D3 + K2',
    audience: '日照不足、骨骼健康关注者',
    risk: '高钙血症、抗凝用药者需咨询医生',
    evidence: 'B',
  },
  {
    id: 2,
    name: 'Omega-3 鱼油',
    audience: '心血管与认知健康关注者',
    risk: '抗凝/手术前后需评估出血风险',
    evidence: 'A',
  },
  {
    id: 3,
    name: '间歇性断食（16:8）',
    audience: '代谢健康、体重管理者',
    risk: '糖尿病、妊娠、进食障碍不适用；需个体化',
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
    modulesTitle: '六大模块',
    modulesLead: '从 AI 建议到证据清单，一站式预防保健入口',
    moduleEnter: '进入模块',
    todayTitle: '今日更新',
    todayCurated: '编辑精选 · 非实时推送',
    todayFrontier: '今日前沿',
    todayHot: '热门证据条目',
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
    modulesTitle: 'Six modules',
    modulesLead: 'From AI guidance to evidence checklists',
    moduleEnter: 'Enter module',
    todayTitle: 'Updates',
    todayCurated: 'Editor’s picks · not live feed',
    todayFrontier: 'Frontier highlights',
    todayHot: 'Popular evidence entries',
    stepsTitle: 'Get started in 3 steps',
    steps: [
      { title: 'Choose a goal', desc: 'Sleep, metabolism, exercise, cognition, labs' },
      { title: 'Generate guidance', desc: 'Priorities, risks, evidence grades' },
      { title: 'Add to plan', desc: 'Weekly checklist + tracking (sign in)' },
    ],
    stepNote: 'Reports, favorites, and plans require sign-in',
    welcome: 'Welcome',
  }
  const ar = { ...en, welcome: 'مرحبًا' }
  if (lang === 'en') return en
  if (lang === 'ar') return ar
  return zh
}
