/** 爬虫可读 SEO：公开页 meta、hreflang、结构化数据。默认规范域名为 www。 */

export const SITE_ORIGIN = 'https://www.healthlongevity.cn'
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/logo-longevity-atlas.png`

export const SEO_LANGS = [
  { id: 'zh', hreflang: 'zh-Hans', prefix: '', htmlLang: 'zh-Hans', ogLocale: 'zh_CN', dir: 'ltr', label: '简体中文' },
  { id: 'en', hreflang: 'en', prefix: '/en', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr', label: 'English' },
  { id: 'ar', hreflang: 'ar', prefix: '/ar', htmlLang: 'ar', ogLocale: 'ar_AE', dir: 'rtl', label: 'العربية' },
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
  ar: {
    name: 'Longevity Atlas',
    description: 'منصة طول عمر قائمة على الأدلة. المحتوى تعليمي فقط وليس بديلاً عن الرعاية الطبية.',
  },
}

/**
 * path 为 React Router 路径（不含 /en /ar 前缀）
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
      ar: 'Longevity Atlas | منصة طول العمر القائمة على الأدلة',
    },
    description: {
      zh: '基于指南与研究证据，结合中医体质与四时养生，提供可执行的生活方式与风险提示。教育信息，不替代诊疗。',
      en: 'Guideline-informed longevity insights with constitution and seasonal framing. Education only—not medical care.',
      ar: 'رؤى طول عمر مستندة إلى الأدلة. للتعليم فقط وليس بديلاً عن الرعاية الطبية.',
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
      ar: 'مدرب طول العمر بالذكاء الاصطناعي',
    },
    description: {
      zh: '基于健康画像生成分层行动建议：风险识别、优先级、报告解读与就医提示，并标注证据等级。仅供健康教育。',
      en: 'Tiered action plans from your health profile—risks, priorities, and care prompts with evidence grades. Education only.',
      ar: 'خطط عمل متدرجة من صورتك الصحية مع درجات الأدلة. للتعليم فقط.',
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
      ar: 'مكتبة أدلة المنتجات',
    },
    description: {
      zh: '健康产品与补充剂的成分、研究证据、监管信息与相互作用提示，帮助购买前完成证据核对。',
      en: 'Ingredients, research evidence, regulatory context and interactions—evidence-first, not sold as treatment.',
      ar: 'مكونات وأدلة وتنظيم وتفاعلات للمنتجات الصحية.',
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
      ar: 'الوقاية بالطب الصيني',
    },
    description: {
      zh: '中医治未病结合现代预防：体质、四时、饮食、情志与导引。教育参考，不替代辨证论治。',
      en: 'TCM preventive care plus modern prevention—constitution, seasons, diet and movement. Education only.',
      ar: 'وقاية بالطب الصيني مع طب وقائي حديث. تعليمي فقط.',
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
      ar: 'مستجدات طبية',
    },
    description: {
      zh: '长寿与预防医学前沿资讯卡片：公众号解读的标题、关键词与摘要可被检索；完整正文打开微信原文。覆盖衰老时钟、NMN、运动、睡眠与临床试验。',
      en: 'Longevity insight cards with titles, keywords and summaries for search; full WeChat posts stay on the original page.',
      ar: 'بطاقات رؤى طول العمر بعناوين وكلمات مفتاحية للبحث. النص الكامل يبقى في المصدر.',
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
      ar: 'فرص التحويل',
    },
    description: {
      zh: '健康长寿领域的转化与应用机会梳理，供研究与产业参考。',
      en: 'Translation and commercialization opportunities in longevity, for research and industry reference.',
      ar: 'فرص التحويل والتطبيق في مجال طول العمر.',
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
      ar: 'مهارات طول العمر',
    },
    description: {
      zh: '长寿知识技能课程与系列视频，注册会员后按等级观看。教育内容，不替代诊疗。',
      en: 'Longevity skills courses and video series for registered members. Education only.',
      ar: 'دورات مهارات طول العمر للأعضاء المسجلين. تعليمي فقط.',
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
      ar: 'استشارة طول العمر',
    },
    description: {
      zh: '站内 AI 健康长寿咨询。需登录会员使用，内容仅供教育参考，不替代专业诊疗。',
      en: 'In-site AI longevity consultation for members. Educational only—not medical care.',
      ar: 'استشارة طول العمر بالذكاء الاصطناعي للأعضاء. تعليمي فقط.',
    },
  },
  {
    path: '/login',
    type: 'auth',
    changefreq: 'monthly',
    priority: '0.3',
    index: true,
    title: {
      zh: '会员登录 | 长健星图',
      en: 'Member login | Longevity Atlas',
      ar: 'تسجيل الدخول',
    },
    description: {
      zh: '使用注册邮箱登录长健星图，管理会员与健康长寿服务。',
      en: 'Sign in with your registered email to access Longevity Atlas membership services.',
      ar: 'سجّل الدخول بالبريد الإلكتروني المسجّل.',
    },
  },
  {
    path: '/register',
    type: 'auth',
    changefreq: 'monthly',
    priority: '0.4',
    index: true,
    title: {
      zh: '注册会员 | 长健星图',
      en: 'Create an account | Longevity Atlas',
      ar: 'إنشاء حساب',
    },
    description: {
      zh: '注册成为长健星图会员，使用循证长寿教育与相关模块。',
      en: 'Register for Longevity Atlas to use evidence-based longevity education modules.',
      ar: 'أنشئ حسابًا للوصول إلى وحدات التعليم القائمة على الأدلة.',
    },
  },
  {
    path: '/terms',
    type: 'legal',
    legalKey: 'LEGAL_TERMS',
    changefreq: 'yearly',
    priority: '0.4',
    index: true,
    title: { zh: '用户服务协议 | 长健星图', en: 'Terms of Service | Longevity Atlas', ar: 'شروط الخدمة' },
    description: {
      zh: '长健星图用户服务协议，说明使用本平台的权利与义务。',
      en: 'Terms of Service for Longevity Atlas.',
      ar: 'شروط خدمة منصة Longevity Atlas.',
    },
  },
  {
    path: '/privacy',
    type: 'legal',
    legalKey: 'LEGAL_PRIVACY',
    changefreq: 'yearly',
    priority: '0.4',
    index: true,
    title: { zh: '隐私政策 | 长健星图', en: 'Privacy Policy | Longevity Atlas', ar: 'سياسة الخصوصية' },
    description: {
      zh: '长健星图如何收集、使用与保护个人信息。',
      en: 'How Longevity Atlas collects, uses and protects personal information.',
      ar: 'كيف نجمع المعلومات الشخصية ونستخدمها ونحميها.',
    },
  },
  {
    path: '/disclaimer',
    type: 'legal',
    legalKey: 'LEGAL_HEALTH_DISCLAIMER',
    changefreq: 'yearly',
    priority: '0.5',
    index: true,
    title: { zh: '健康与医疗免责声明 | 长健星图', en: 'Health Disclaimer | Longevity Atlas', ar: 'إخلاء المسؤولية الصحية' },
    description: {
      zh: '本平台内容仅供健康教育与生活方式参考，不替代专业诊疗。',
      en: 'Content is for health education and lifestyle reference only—not medical care.',
      ar: 'المحتوى تعليمي فقط وليس بديلاً عن الرعاية الطبية.',
    },
  },
  {
    path: '/legal/sale',
    type: 'legal',
    legalKey: 'LEGAL_SALE',
    changefreq: 'yearly',
    priority: '0.3',
    index: true,
    title: { zh: '销售条款 | 长健星图', en: 'Terms of Sale | Longevity Atlas', ar: 'شروط البيع' },
    description: {
      zh: '会员订阅与付费相关的销售条款。',
      en: 'Terms of sale for membership subscriptions.',
      ar: 'شروط البيع لاشتراكات العضوية.',
    },
  },
  {
    path: '/legal/health-data',
    type: 'legal',
    legalKey: 'LEGAL_HEALTH_DATA',
    changefreq: 'yearly',
    priority: '0.3',
    index: true,
    title: { zh: '健康信息与问卷说明 | 长健星图', en: 'Health Data Notice | Longevity Atlas', ar: 'إشعار المعلومات الصحية' },
    description: {
      zh: '问卷与健康相关信息的处理说明。',
      en: 'How we handle questionnaire and health-related information.',
      ar: 'كيف نتعامل مع معلومات الاستبيان والصحة.',
    },
  },
  {
    path: '/legal/cookies',
    type: 'legal',
    legalKey: 'LEGAL_COOKIES',
    changefreq: 'yearly',
    priority: '0.3',
    index: true,
    title: { zh: 'Cookie 说明 | 长健星图', en: 'Cookie Notice | Longevity Atlas', ar: 'إشعار ملفات تعريف الارتباط' },
    description: {
      zh: '本站使用的必要存储与 Cookie 说明。',
      en: 'Notice about cookies and similar storage used on this site.',
      ar: 'إشعار حول ملفات تعريف الارتباط والتخزين المشابه.',
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
  '/health-monitor',
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
