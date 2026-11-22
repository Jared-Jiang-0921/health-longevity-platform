/** 爬虫可读 SEO：公开页 meta、hreflang、结构化数据。默认规范域名为 www。 */

export const SITE_ORIGIN = 'https://www.healthlongevity.cn'
/** 当前公开部署。规范网址仍是 SITE_ORIGIN，此地址只在关于页与 llms.txt 中标明。 */
export const PUBLIC_LIVE_ORIGIN = 'https://healthlongevityplatform.vercel.app'
/** 关于页与 AI 摘要的编辑日期（不是每次构建时间）。 */
export const PUBLIC_SUMMARY_UPDATED = '2026-11-22'
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/logo-longevity-atlas.png`

export const SEO_LANGS = [
  { id: 'zh', hreflang: 'zh-Hans', prefix: '', htmlLang: 'zh-Hans', ogLocale: 'zh_CN', dir: 'ltr', label: '简体中文' },
  { id: 'en', hreflang: 'en', prefix: '/en', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr', label: 'English' },
]

export const SEO_BRAND = {
  zh: {
    name: '长健星图 Longevity Atlas',
    description:
      '循证长寿医学平台：融合现代医学与中医治未病，提供健康教育、产品证据与生活方式建议，不替代专业诊疗。',
  },
  en: {
    name: 'Longevity Atlas',
    description:
      'Evidence-based longevity platform combining modern medicine and preventive TCM. Educational information only—not a substitute for medical care.',
  },
}

/**
 * path 为 React Router 路径（不含 /en 前缀）
 * index: 是否写入 sitemap
 */
export const SEO_PAGES = [
  {
    path: '/',
    type: 'home',
    changefreq: 'weekly',
    priority: '1.0',
    index: true,
    title: {
      zh: '长健星图 Longevity Atlas | 循证健康长寿平台',
      en: 'Longevity Atlas | Evidence-based health & longevity',
    },
    description: {
      zh: '基于指南与研究证据，结合中医体质与四时养生，提供可执行的生活方式与风险提示。教育信息，不替代诊疗。',
      en: 'Guideline-informed longevity insights with constitution and seasonal framing. Education only—not medical care.',
    },
  },
  {
    path: '/about',
    type: 'about',
    changefreq: 'monthly',
    priority: '0.8',
    index: true,
    title: {
      zh: '关于长健星图 | 循证健康长寿教育平台',
      en: 'About Longevity Atlas | Evidence-based longevity education',
    },
    description: {
      zh: `长健星图是什么、面向谁、公开模块、两类长寿咨询与中医养生保健咨询、合规边界和规范网址。编辑责任在运营主体，不设具名审稿人。仅供健康教育，不替代诊疗。最近更新 ${PUBLIC_SUMMARY_UPDATED}。`,
      en: `What Longevity Atlas is, who it is for, public modules, consult types, compliance limits, and the canonical URL. Editorial responsibility sits with the operator; no named reviewer. Education only—not medical care. Updated ${PUBLIC_SUMMARY_UPDATED}.`,
    },
  },
  {
    path: '/faq',
    type: 'faq',
    changefreq: 'monthly',
    priority: '0.6',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: '常见问题 | 长健星图',
      en: 'Questions | Longevity Atlas',
    },
    description: {
      zh: '本站公开页与登录后内容的差别、来源如何引用、为何不提供用量或治疗建议，以及如何联系运营主体。不是医疗建议。',
      en: 'What is public versus sign-in only, how sources are cited, why pages give no dose or treatment advice, and how to contact the operator. Not medical advice.',
    },
  },
  {
    path: '/methodology',
    type: 'methodology',
    changefreq: 'monthly',
    priority: '0.6',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: '证据如何核对与呈现 | 长健星图',
      en: 'How evidence is checked | Longevity Atlas',
    },
    description: {
      zh: '公开页如何引用带 PMID 的论文、如何区分研究发现与商品宣传、如何标注监管原文和转述，以及为何不编造作者或审稿人。不提供用量。',
      en: 'How public pages cite papers by PMID, separate study findings from product claims, label official texts and secondary accounts, and avoid inventing authors or reviewers. No dose.',
    },
  },
  {
    path: '/solutions',
    type: 'module',
    changefreq: 'weekly',
    priority: '0.9',
    index: true,
    title: {
      zh: 'AI 长寿方案师 | 长健星图',
      en: 'AI Longevity Coach | Longevity Atlas',
    },
    description: {
      zh: '基于健康画像生成分层行动建议：风险识别、优先级、报告解读与就医提示，并标注证据等级。仅供健康教育。',
      en: 'Tiered action plans from your health profile—risks, priorities, and care prompts with evidence grades. Education only.',
    },
  },
  {
    path: '/products',
    type: 'module',
    changefreq: 'weekly',
    priority: '0.9',
    index: true,
    title: {
      zh: '长寿产品证据库 | 长健星图',
      en: 'Product Evidence Library | Longevity Atlas',
    },
    lastmod: '2026-11-22',
    description: {
      zh: '公开说明购买前如何核对成分、研究证据、监管身份和相互作用。逐条商品仍不是公开可抓取语料。成分证据目前公开 NMN / NR、EPA/DHA、维生素 D、肌酸与镁五页。不把商品包装成治疗方案。',
      en: 'Public note on how to check ingredients, research, regulatory status, and interactions before buying. Individual products stay out of the public corpus. Five ingredient pages are public: NMN / NR, EPA/DHA, vitamin D, creatine, and magnesium. Not sold as treatment.',
    },
  },
  {
    path: '/products/evidence/nmn',
    type: 'evidence',
    changefreq: 'monthly',
    priority: '0.7',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: 'NMN 与 NR：人体证据、监管状态与不能外推的边界 | 长健星图',
      en: 'NMN and NR: human evidence, regulation, and limits | Longevity Atlas',
    },
    description: {
      zh: '烟酰胺单核苷酸（NMN）和烟酰胺核糖（NR）的教育说明：与 NAD+ 的关系、现有人体研究及其限度、监管信息，以及妊娠、用药等人群的谨慎边界。不提供用量，不把研究结果写成治疗或抗衰老疗效。',
      en: 'Educational note on nicotinamide mononucleotide (NMN) and nicotinamide riboside (NR): relation to NAD+, what human studies do and do not show, regulatory context, and who should be cautious. No dose. Not a treatment or anti-aging claim.',
    },
  },
  {
    path: '/products/evidence/omega-3',
    type: 'evidence',
    changefreq: 'monthly',
    priority: '0.7',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: 'EPA 与 DHA（Omega-3）：人体证据、监管表述与不能外推的边界 | 长健星图',
      en: 'EPA and DHA (omega-3): human evidence, regulation, and limits | Longevity Atlas',
    },
    description: {
      zh: '二十碳五烯酸（EPA）与二十二碳六烯酸（DHA）的教育说明：处方制剂试验、一般人群补充试验和系统综述各自说明什么，以及 FDA 合格声称不是疗效认定。不提供用量，不写成预防或治疗。',
      en: 'Educational note on EPA and DHA: what prescription-drug trials, a primary-prevention trial, and a systematic review each show, and why an FDA qualified claim is not efficacy. No dose. Not prevention or treatment.',
    },
  },
  {
    path: '/products/evidence/vitamin-d',
    type: 'evidence',
    changefreq: 'monthly',
    priority: '0.7',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: '维生素 D：人体证据、监管表述与不能外推的边界 | 长健星图',
      en: 'Vitamin D: human evidence, regulation, and limits | Longevity Atlas',
    },
    description: {
      zh: '维生素 D3（胆钙化醇）的教育说明：VITAL 的癌症、心血管和骨折结果，Cochrane 对骨折的综述，以及 FDA 授权声称和 USPSTF 最终建议各自说明什么。不提供用量，不写成预防或治疗。',
      en: 'Educational note on vitamin D3 (cholecalciferol): what VITAL found for cancer, cardiovascular events, and fractures, what a Cochrane review found, and what FDA and USPSTF texts say. No dose. Not prevention or treatment.',
    },
  },
  {
    path: '/products/evidence/creatine',
    type: 'evidence',
    changefreq: 'monthly',
    priority: '0.7',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: '肌酸：人体证据、监管表述与不能外推的边界 | 长健星图',
      en: 'Creatine: human evidence, regulation, and limits | Longevity Atlas',
    },
    description: {
      zh: '一水肌酸的教育说明：抗阻训练试验里的瘦组织和力量差值、骨密度合并结果、有争议的记忆综述、肌肉疾病和帕金森病试验各自说明什么，以及欧盟食品声称、FDA 的 GRAS 答复和中国 2008 年批复各自不是疗效认定。不提供用量，不写成预防、治疗或运动表现保证。',
      en: 'Educational note on creatine monohydrate: what training trials, a bone-density pool, a disputed memory review, and disease trials each show, and why an EU food claim, an FDA GRAS letter, and a 2008 Chinese reply are not efficacy. No dose. Not prevention, treatment, or a sports guarantee.',
    },
  },
  {
    path: '/products/evidence/magnesium',
    type: 'evidence',
    changefreq: 'monthly',
    priority: '0.7',
    index: true,
    lastmod: '2026-11-22',
    title: {
      zh: '镁：人体证据、监管表述与不能外推的边界 | 长健星图',
      en: 'Magnesium: human evidence, regulation, and limits | Longevity Atlas',
    },
    description: {
      zh: '镁的教育说明：血压汇总差值、血糖化验指标、低质量的失眠综述和抽筋综述各自说明什么，以及欧盟食品声称、FDA 合格声称和中国营养标签用语各自不是疗效认定。不提供用量，不写成预防、治疗或抗衰老疗效。',
      en: 'Educational note on magnesium: what blood-pressure pools, laboratory glucose measures, a low-quality insomnia review, and a cramp review each show, and why an EU food claim, an FDA qualified claim, and a Chinese nutrition-label sentence are not efficacy. No dose. Not prevention, treatment, or an anti-aging effect.',
    },
  },
  {
    path: '/tcm-prevention',
    type: 'module',
    changefreq: 'weekly',
    priority: '0.8',
    index: true,
    title: {
      zh: '中医治未病 | 长健星图',
      en: 'TCM Preventive Care | Longevity Atlas',
    },
    description: {
      zh: '中医治未病结合现代预防的公开说明：体质、四时、饮食、情志与导引。体质辨识和方药条目需登录，不是公开可抓取语料。教育参考，不替代辨证论治。',
      en: 'Public overview of TCM preventive care plus modern prevention. Constitution checks and formula entries require sign-in and are not a public crawlable corpus. Education only.',
    },
  },
  {
    path: '/longevity-news',
    type: 'module',
    changefreq: 'daily',
    priority: '0.8',
    index: true,
    title: {
      zh: '前沿医学资讯 | 长健星图',
      en: 'Medical Insights | Longevity Atlas',
    },
    description: {
      zh: '每条公开资讯卡片都有独立网址和教育性摘要。已写摘要的用原文；只有标题的用本站说明。不转载微信公众号全文，完整正文打开来源页。',
      en: 'Each public insight card has its own URL and an educational abstract. Author-written summaries are kept; title-only cards get an original note. WeChat full text stays on the source page.',
    },
  },
  {
    path: '/translation-opportunities',
    type: 'module',
    changefreq: 'weekly',
    priority: '0.6',
    index: true,
    title: {
      zh: '转化应用机会 | 长健星图',
      en: 'Translation Opportunities | Longevity Atlas',
    },
    description: {
      zh: '健康长寿领域转化与应用的公开说明，供研究与产业参考。机会条目没有逐条公开永久链接，本页不是可抓取的项目库。',
      en: 'Public overview of translation and commercialization in longevity, for research and industry reference. Individual opportunities are not published as a crawlable item corpus.',
    },
  },
  {
    path: '/health-skills',
    type: 'module',
    changefreq: 'weekly',
    priority: '0.8',
    index: true,
    title: {
      zh: '长寿知识技能 | 长健星图',
      en: 'Health Skills | Longevity Atlas',
    },
    description: {
      zh: '长寿知识技能课程与系列视频，注册会员后按等级观看。教育内容，不替代诊疗。',
      en: 'Longevity skills courses and video series for registered members. Education only.',
    },
  },
  {
    path: '/consult',
    type: 'module',
    changefreq: 'weekly',
    priority: '0.8',
    index: true,
    title: {
      zh: 'AI 健康长寿咨询 | 长健星图',
      en: 'AI Longevity Consult | Longevity Atlas',
    },
    description: {
      zh: '站内 AI 健康长寿咨询。需登录会员使用，内容仅供教育参考，不替代专业诊疗。',
      en: 'In-site AI longevity consultation for members. Educational only—not medical care.',
    },
  },
  {
    path: '/login',
    type: 'auth',
    changefreq: 'monthly',
    priority: '0.3',
    index: false,
    title: {
      zh: '会员登录 | 长健星图',
      en: 'Member login | Longevity Atlas',
    },
    description: {
      zh: '使用注册邮箱登录长健星图，管理会员与健康长寿服务。',
      en: 'Sign in with your registered email to access Longevity Atlas membership services.',
    },
  },
  {
    path: '/register',
    type: 'auth',
    changefreq: 'monthly',
    priority: '0.4',
    index: false,
    title: {
      zh: '注册会员 | 长健星图',
      en: 'Create an account | Longevity Atlas',
    },
    description: {
      zh: '注册成为长健星图会员，使用循证长寿教育与相关模块。',
      en: 'Register for Longevity Atlas to use evidence-based longevity education modules.',
    },
  },
  {
    path: '/terms',
    type: 'legal',
    legalKey: 'LEGAL_TERMS',
    changefreq: 'yearly',
    priority: '0.4',
    index: true,
    title: { zh: '用户服务协议 | 长健星图', en: 'Terms of Service | Longevity Atlas' },
    description: {
      zh: '长健星图用户服务协议，说明使用本平台的权利与义务。',
      en: 'Terms of Service for Longevity Atlas.',
    },
  },
  {
    path: '/privacy',
    type: 'legal',
    legalKey: 'LEGAL_PRIVACY',
    changefreq: 'yearly',
    priority: '0.4',
    index: true,
    title: { zh: '隐私政策 | 长健星图', en: 'Privacy Policy | Longevity Atlas' },
    description: {
      zh: '长健星图如何收集、使用与保护个人信息。',
      en: 'How Longevity Atlas collects, uses and protects personal information.',
    },
  },
  {
    path: '/disclaimer',
    type: 'legal',
    legalKey: 'LEGAL_HEALTH_DISCLAIMER',
    changefreq: 'yearly',
    priority: '0.5',
    index: true,
    title: { zh: '健康与医疗免责声明 | 长健星图', en: 'Health Disclaimer | Longevity Atlas' },
    description: {
      zh: '本平台内容仅供健康教育与生活方式参考，不替代专业诊疗。',
      en: 'Content is for health education and lifestyle reference only—not medical care.',
    },
  },
  {
    path: '/legal/sale',
    type: 'legal',
    legalKey: 'LEGAL_SALE',
    changefreq: 'yearly',
    priority: '0.3',
    index: true,
    title: { zh: '销售条款 | 长健星图', en: 'Terms of Sale | Longevity Atlas' },
    description: {
      zh: '会员订阅与付费相关的销售条款。',
      en: 'Terms of sale for membership subscriptions.',
    },
  },
  {
    path: '/legal/health-data',
    type: 'legal',
    legalKey: 'LEGAL_HEALTH_DATA',
    changefreq: 'yearly',
    priority: '0.3',
    index: true,
    title: { zh: '健康信息与问卷说明 | 长健星图', en: 'Health Data Notice | Longevity Atlas' },
    description: {
      zh: '问卷与健康相关信息的处理说明。',
      en: 'How we handle questionnaire and health-related information.',
    },
  },
  {
    path: '/legal/cookies',
    type: 'legal',
    legalKey: 'LEGAL_COOKIES',
    changefreq: 'yearly',
    priority: '0.3',
    index: true,
    title: { zh: 'Cookie 说明 | 长健星图', en: 'Cookie Notice | Longevity Atlas' },
    description: {
      zh: '本站使用的必要存储与 Cookie 说明。',
      en: 'Notice about cookies and similar storage used on this site.',
    },
  },
]

export const SEO_NOINDEX_PREFIXES = [
  '/payment',
  '/account',
  '/ops',
  '/org',
  '/favorites',
  '/forgot-password',
  '/reset-password',
  '/health-questionnaire',
  '/tcm-prevention/constitution',
  '/solutions/risk',
  '/solutions/aging',
]

export function findSeoPage(pathname) {
  const p = String(pathname || '/').replace(/\/$/, '') || '/'
  return SEO_PAGES.find((page) => page.path === p) || null
}

export function pageIndexable(pathname) {
  const p = String(pathname || '/').replace(/\/$/, '') || '/'
  if (SEO_NOINDEX_PREFIXES.some((pre) => p === pre || p.startsWith(`${pre}/`))) return false
  const page = findSeoPage(p)
  if (page) return page.index !== false
  return false
}

export function absoluteUrl(lang, routerPath) {
  const spec = SEO_LANGS.find((item) => item.id === lang) || SEO_LANGS[0]
  const raw = routerPath && routerPath !== '/' ? routerPath : '/'
  if (raw === '/') return spec.prefix ? `${SITE_ORIGIN}${spec.prefix}/` : `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${spec.prefix}${raw}`
}
