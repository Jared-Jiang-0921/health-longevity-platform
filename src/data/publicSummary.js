/**
 * 公开、可引用的站点说明。关于页、方案页 FAQ、预渲染正文和 llms.txt 共用这里的句子，
 * 以便和已经上线的免责声明、咨询边界保持一致。
 */
import { HOME_MODULES } from './homePageContent.js'
import { getLongevityNewsModuleCopy } from './longevityNewsModuleI18n.js'
import {
  PUBLIC_LIVE_ORIGIN,
  PUBLIC_SUMMARY_UPDATED,
  SITE_ORIGIN,
  absoluteUrl,
} from './seo.js'
import { SITE_LEGAL } from './siteLegal.js'

function pickLang(lang) {
  if (lang === 'en' || lang === 'ar') return lang
  return 'zh'
}

function pick(map, lang) {
  const key = pickLang(lang)
  return map?.[key] || map?.zh || ''
}

const FOOTER_DISCLAIMER = {
  zh: '本平台内容仅供健康教育与生活方式参考，不替代专业诊疗、处方或紧急医疗处置；特殊人群（妊娠、儿童、慢病用药者等）请咨询医生。',
  en: 'Content is for education and lifestyle guidance only—not medical diagnosis or treatment. Consult a clinician for special populations.',
  ar: 'المحتوى تعليمي فقط وليس بديلاً عن الرعاية الطبية.',
}

const CONSULT_DISCLAIMER = {
  zh: '本平台提供的健康信息仅供参考，不构成医疗诊断、治疗建议或处方依据。如有健康问题，请及时就诊于执业医疗机构，遵从执业医师的专业判断。',
  en: 'The health information provided on this platform is for reference only and does not constitute medical diagnosis, treatment advice, or prescription guidance. If you have health concerns, please consult a licensed medical professional.',
  ar: 'المعلومات الصحية المقدمة على هذه المنصة هي للإشارة فقط ولا تشكل تشخيصًا طبيًا أو نصيحة علاجية. إذا كانت لديك مخاوف صحية، يرجى استشارة طبيب مرخص.',
}

const SOLUTIONS_DISCLAIMER = {
  zh: '本平台提供健康教育与辅助决策信息，不替代医生诊断、治疗和处方。',
  en: 'This platform provides health education and decision-support information only. It does not replace a physician’s diagnosis, treatment, or prescriptions.',
  ar: 'تقدم المنصة تعليماً صحياً ومعلومات داعمة للقرار فقط، ولا تحل محل تشخيص أو علاج أو وصفات الطبيب.',
}

export function getFaqHeading(lang) {
  if (lang === 'en') return 'Questions'
  if (lang === 'ar') return 'أسئلة'
  return '常见问题'
}

export function getSolutionsPublicCopy(lang) {
  const key = pickLang(lang)
  const copy = {
    zh: {
      heading: 'AI长寿方案师',
      lead: '结合问卷与多维度信息，协助您形成健康画像、识别主要风险，并给出营养、运动、睡眠等方面的综合建议与分阶段行动计划；异常时提示就医。以下为能力范围说明。',
      medicalDisclaimer: SOLUTIONS_DISCLAIMER.zh,
      consultLead: '两种咨询分开使用，检索范围不同，不能互相替代。自我健康促进面向日常管理；专业咨询面向有医学背景的使用者。',
      general: {
        title: '自我健康促进咨询',
        body: '面向普通人群。检索生活方式、营养、运动、睡眠、情绪与大众向长寿科普；不含药理、免疫学教材、内外科等专科知识，也不检索 PubMed / Cochrane / 欧洲 PMC。登录会员即可使用。不替代诊疗与处方。',
      },
      professional: {
        title: '专业健康长寿咨询',
        body: '面向专业人士。知识库覆盖基础医学、临床医学、功能医学、长寿学等全书；可按需检索 PubMed、Cochrane、欧洲 PMC。需高级会员。仍不替代诊疗与处方。',
      },
      tcm: {
        title: 'AI 中医养生保健',
        body: '在中医治未病页，不在本方案页。只检索本站已入库的中医书，按证候方向、病机和方义说明。不使用西医书，也不调用文献库。未经当场辨证，不能作为用药依据。书里的克数不是你的服量。需高级会员。教育参考，不替代个体辨证论治与执业医师处方。',
      },
      assessment: '健康风险评估与衰老评估向标准会员及以上开放，需先登录。结果只保存在本账户，供咨询引用，不连接营养代谢微信小程序。这些工具是教育筛查或对已有报告的解读，不能诊断疾病，也不替代执业医师的判断。异常或高风险时只提示就医。',
    },
    en: {
      heading: 'AI Longevity Coach',
      lead: 'Combines questionnaires and multi-dimensional signals to help you build a health profile, surface key risks, and receive integrated guidance (nutrition, exercise, sleep, etc.) with phased action plans—plus prompts to seek care when appropriate.',
      medicalDisclaimer: SOLUTIONS_DISCLAIMER.en,
      consultLead: 'These are separate consults with different sources. Self-care is for everyday health. Professional consult is for people with a medical background.',
      general: {
        title: 'Self-care longevity consultation',
        body: 'For the general public. Lifestyle, nutrition, movement, sleep, and popular longevity sources. No specialty textbooks and no PubMed / Cochrane / Europe PMC. Signed-in members can use it. Not a substitute for diagnosis or prescriptions.',
      },
      professional: {
        title: 'Professional longevity consultation',
        body: 'For professionals. Full knowledge base: basic, clinical, functional, and longevity medicine. Optional PubMed, Cochrane, and Europe PMC. Requires Premium. Not a substitute for diagnosis or prescriptions.',
      },
      tcm: {
        title: 'AI TCM wellness consult',
        body: 'It lives on the TCM preventive-care page, not on this coach page. It searches only the TCM books already in this site, and explains by pattern direction, mechanism, and formula meaning. Western medical books and literature databases are not used. Without an in-person assessment, it cannot be a basis for taking medicine. Amounts in a book are not your dose. Requires Premium. Education only—not pattern differentiation or a prescription.',
      },
      assessment: 'Health risk assessments and aging clocks are for Standard members and above, and require sign-in. Results stay on this account for consults and are not connected to the nutrition mini-program. They are educational screens or interpretations of an existing report. They do not diagnose disease and do not replace a clinician. Abnormal or high-risk results only prompt you to seek care.',
    },
    ar: {
      heading: 'مدرب طول العمر بالذكاء الاصطناعي',
      lead: 'يجمع الاستبيان ومؤشرات متعددة لمساعدتك على بناء صورة صحية واستخلاص المخاطر وتقديم إرشادات متكاملة وخطط عمل مرحلية، مع تذكير بمراجعة الطبيب عند الحاجة.',
      medicalDisclaimer: SOLUTIONS_DISCLAIMER.ar,
      consultLead: 'الاستشارتان منفصلتان ومصادرهما مختلفة. تعزيز الصحة الذاتية للإدارة اليومية، والاستشارة المهنية لمن لديهم خلفية طبية.',
      general: {
        title: 'استشارة تعزيز الصحة الذاتية',
        body: 'للجمهور: نمط الحياة والتغذية والحركة والنوم وطول العمر الموجّه للعامة. بدون كتب تخصصية وبدون PubMed / Cochrane / Europe PMC. متاحة بعد تسجيل الدخول. لا تغني عن التشخيص أو الوصفات.',
      },
      professional: {
        title: 'استشارة طول العمر المهنية',
        body: 'للمتخصصين: قاعدة المعرفة كاملة (الطب الأساسي والسريري والوظيفي وعلوم طول العمر)، مع خيار PubMed وCochrane وEurope PMC. تتطلب عضوية مميزة. لا تغني عن التشخيص أو الوصفات.',
      },
      tcm: {
        title: 'استشارة العناية بالطب الصيني',
        body: 'توجد في صفحة الوقاية بالطب الصيني وليس في هذه الصفحة. تبحث فقط في كتب الطب الصيني الموجودة في الموقع. لا تستخدم كتب الطب الغربي ولا قواعد الأدبيات. بلا معاينة حضورية لا تُعد أساساً لتناول الدواء. مقادير الكتاب ليست جرعتك. تتطلب عضوية مميزة. تعليمي فقط وليس بديلاً عن التمييز الحضوري أو وصفة الطبيب.',
      },
      assessment: 'تقييمات المخاطر وساعات الشيخوخة للأعضاء القياسيين فأعلى وتتطلب تسجيل الدخول. تُحفظ النتائج في هذا الحساب للاستشارة، دون ارتباط بالبرنامج المصغر. هي فرز تعليمي أو تفسير لتقرير موجود، ولا تشخّص المرض ولا تغني عن الطبيب. النتيجة الشاذة أو عالية الخطر تذكّر فقط بمراجعة الطبيب.',
    },
  }
  return { ...copy[key], faqHeading: getFaqHeading(key), faqs: getPageFaqs('/solutions', key) }
}

const SOLUTION_FAQS = {
  zh: [
    {
      q: 'AI 长寿方案师会做诊断、治疗或开处方吗？',
      a: '不会。本平台提供健康教育与辅助决策信息，不替代医生诊断、治疗和处方。出现异常指标或高风险情况时，只提示就医，由执业医师判断。',
    },
    {
      q: '自我健康促进咨询和专业健康长寿咨询有什么区别？',
      a: '两种咨询分开使用，检索范围不同，不能互相替代。自我健康促进面向普通人群的日常管理，检索生活方式、营养、运动、睡眠、情绪与大众向长寿科普，不含药理、免疫学教材、内外科等专科知识，也不检索 PubMed、Cochrane 或欧洲 PMC；登录会员即可使用。专业健康长寿咨询面向有医学背景的使用者，知识库覆盖基础医学、临床医学、功能医学、长寿学等全书，可按需检索 PubMed、Cochrane、欧洲 PMC；需高级会员。两者都不替代诊疗与处方。',
    },
    {
      q: '中医养生保健咨询检索什么？',
      a: '「AI 中医养生保健」在中医治未病页，不在方案页。它只检索本站已入库的中医书，按证候方向、病机和方义说明。不使用西医书，也不调用文献库。未经当场辨证，不能作为用药依据。书里的克数不是你的服量。需高级会员。教育参考，不替代个体辨证论治与执业医师处方。',
    },
    {
      q: '风险评估和衰老评估能诊断疾病吗？',
      a: '不能。健康风险评估与衰老评估向标准会员及以上开放，需先登录。结果只保存在本账户，供咨询引用，不连接营养代谢微信小程序。它们是教育筛查或对已有报告的解读，不能诊断疾病，也不替代执业医师的判断。异常或高风险时只提示就医。',
    },
  ],
  en: [
    {
      q: 'Does the AI Longevity Coach diagnose, treat, or prescribe?',
      a: 'No. This platform provides health education and decision-support information only. It does not replace a physician’s diagnosis, treatment, or prescriptions. Abnormal or high-risk results only prompt you to seek care.',
    },
    {
      q: 'How do self-care and professional consults differ?',
      a: 'They are separate and not interchangeable. Self-care is for everyday health and searches lifestyle, nutrition, movement, sleep, and popular longevity sources. It does not search specialty textbooks or PubMed, Cochrane, or Europe PMC, and signed-in members can use it. Professional consult is for people with a medical background. Its library covers basic, clinical, functional, and longevity medicine, with optional PubMed, Cochrane, and Europe PMC, and it requires Premium. Neither replaces diagnosis or prescriptions.',
    },
    {
      q: 'What does the TCM wellness consult search?',
      a: 'AI TCM wellness consult is on the TCM preventive-care page. It searches only TCM books already in this site. It does not use Western medical books or literature databases. Without an in-person assessment it cannot be a basis for taking medicine. Amounts in a book are not your dose. It requires Premium and does not replace pattern differentiation or a licensed prescription.',
    },
    {
      q: 'Can the risk and aging tools diagnose disease?',
      a: 'No. They are for Standard members and above and require sign-in. Results stay on this account for consults and are not connected to the nutrition mini-program. They are educational screens or interpretations of an existing report. They do not diagnose disease. Abnormal or high-risk results only prompt you to seek care.',
    },
  ],
  ar: [
    {
      q: 'هل يشخص مدرب طول العمر أو يعالج أو يصف دواء؟',
      a: 'لا. تقدم المنصة تعليماً صحياً ومعلومات داعمة للقرار فقط، ولا تحل محل تشخيص أو علاج أو وصفات الطبيب. النتيجة الشاذة أو عالية الخطر تذكّر فقط بمراجعة الطبيب.',
    },
    {
      q: 'ما الفرق بين استشارة تعزيز الصحة الذاتية والاستشارة المهنية؟',
      a: 'هما منفصلتان ولا تحل إحداهما محل الأخرى. تعزيز الصحة الذاتية للإدارة اليومية ويبحث في نمط الحياة والتغذية والحركة والنوم والمصادر الموجّهة للعامة، بدون PubMed أو Cochrane أو Europe PMC، ومتاح بعد تسجيل الدخول. الاستشارة المهنية لمن لديهم خلفية طبية، وتغطي الطب الأساسي والسريري والوظيفي وعلوم طول العمر مع خيار قواعد الأدبيات، وتتطلب عضوية مميزة. لا تغني أي منهما عن التشخيص أو الوصفات.',
    },
    {
      q: 'ماذا تبحث استشارة الطب الصيني؟',
      a: 'استشارة العناية بالطب الصيني في صفحة الوقاية بالطب الصيني. تبحث فقط في كتب الطب الصيني الموجودة في الموقع، ولا تستخدم كتب الطب الغربي ولا قواعد الأدبيات. بلا معاينة حضورية لا تُعد أساساً لتناول الدواء، ومقادير الكتاب ليست جرعتك. تتطلب عضوية مميزة ولا تغني عن التمييز الحضوري أو وصفة الطبيب.',
    },
    {
      q: 'هل تشخّص تقييمات المخاطر والشيخوخة المرض؟',
      a: 'لا. هي للأعضاء القياسيين فأعلى وتتطلب تسجيل الدخول. تُحفظ النتائج في هذا الحساب للاستشارة دون ارتباط بالبرنامج المصغر. هي فرز تعليمي أو تفسير لتقرير موجود، ولا تشخّص المرض. النتيجة الشاذة أو عالية الخطر تذكّر فقط بمراجعة الطبيب.',
    },
  ],
}

const ABOUT_FAQS = {
  zh: [
    {
      q: '长健星图是什么？',
      a: `长健星图（Longevity Atlas）是循证健康长寿教育平台，由${SITE_LEGAL.legalEntityName}运营。它融合现代医学证据与中医治未病框架，提供健康教育、产品证据核对与生活方式参考。本平台内容仅供健康教育与生活方式参考，不替代专业诊疗、处方或紧急医疗处置。`,
    },
    {
      q: '网站面向谁？',
      a: '面向关注睡眠、代谢、运动、营养与预防保健的公众，需要在购买前核对成分与证据的产品使用者，以及有医学背景、希望在明确文献边界内检索的会员。妊娠、儿童、慢病用药等特殊人群请咨询医生。本站不提供紧急医疗处置。',
    },
    {
      q: '哪些内容可以引用，哪些不能？',
      a: '可以引用公开说明页：首页、关于本站、AI 长寿方案师、长寿知识技能入口说明、产品证据库、中医治未病、前沿医学资讯、转化应用机会，以及用户协议、隐私政策、免责声明等法律页。引用时请保留「仅供健康教育，不替代诊疗」的界限，并链回规范网址。会员账户、支付与订单、问卷答案、评估结果、咨询对话、课程学习页、管理后台和 /api 不在公开引用范围内。',
    },
    {
      q: '规范网址是哪一个？',
      a: `规范站点为 ${SITE_ORIGIN}/ 。当前公开部署亦可通过 ${PUBLIC_LIVE_ORIGIN}/ 访问，内容与规范站点一致。关于本站的说明见 ${SITE_ORIGIN}/about ，最近更新日期为 ${PUBLIC_SUMMARY_UPDATED}。`,
    },
  ],
  en: [
    {
      q: 'What is Longevity Atlas?',
      a: `Longevity Atlas (长健星图) is an evidence-based longevity education platform operated by ${SITE_LEGAL.legalEntityName}. It combines modern medical evidence with a preventive TCM frame, and offers health education, product-evidence checks, and lifestyle reference. Content is for education and lifestyle reference only. It does not replace diagnosis, prescriptions, or emergency care.`,
    },
    {
      q: 'Who is it for?',
      a: 'People following sleep, metabolism, movement, nutrition, and prevention; shoppers who want to check ingredients and evidence before buying; and members with a medical background who want retrieval inside a stated literature boundary. Pregnancy, children, and people on long-term medication should ask a clinician. This site does not provide emergency care.',
    },
    {
      q: 'What may be cited?',
      a: 'Public pages may be cited: home, about, the AI coach overview, the health-skills entry, the product evidence library, TCM prevention, medical insights, translation opportunities, and the legal pages. Keep the education-not-diagnosis limit and link the canonical URL. Accounts, payments, questionnaire answers, assessment results, consult transcripts, course players, admin, and /api are not public.',
    },
    {
      q: 'Which URL should be cited?',
      a: `Cite ${SITE_ORIGIN}/ . The public deployment ${PUBLIC_LIVE_ORIGIN}/ serves the same content. The about page is ${SITE_ORIGIN}/about and was last updated ${PUBLIC_SUMMARY_UPDATED}.`,
    },
  ],
  ar: [
    {
      q: 'ما هي المنصة؟',
      a: `لونجيفتي أطلس (长健星图) منصة تعليم لطول العمر قائمة على الأدلة، وتشغّلها ${SITE_LEGAL.legalEntityName}. تجمع أدلة الطب الحديث مع إطار الوقاية في الطب الصيني. المحتوى للتعليم ونمط الحياة فقط، وليس بديلاً عن التشخيص أو الوصفات أو الطوارئ.`,
    },
    {
      q: 'لمن هذا الموقع؟',
      a: 'للجمهور المهتم بالنوم والأيض والحركة والتغذية والوقاية، ولمن يريد مراجعة المكونات والأدلة قبل الشراء، وللأعضاء ذوي الخلفية الطبية. الحمل والأطفال ومن يستخدم أدوية مزمنة يسألون الطبيب. الموقع لا يقدّم رعاية طارئة.',
    },
    {
      q: 'ماذا يمكن اقتباسه؟',
      a: 'يمكن اقتباس الصفحات العامة: الرئيسية وحول المنصة ومدرب الذكاء الاصطناعي ومدخل المهارات ومكتبة الأدلة والوقاية الصينية والمستجدات وفرص التحويل والصفحات القانونية. أبقِ حد «تعليم لا تشخيص» واربط العنوان المعياري. الحساب والدفع وإجابات الاستبيان ونتائج التقييم ونصوص الاستشارة والدروس والإدارة و /api ليست عامة.',
    },
    {
      q: 'أي عنوان يُذكر؟',
      a: `العنوان المعياري ${SITE_ORIGIN}/ . النشر العام ${PUBLIC_LIVE_ORIGIN}/ يقدّم المحتوى نفسه. صفحة حول المنصة ${SITE_ORIGIN}/about وآخر تحديث ${PUBLIC_SUMMARY_UPDATED}.`,
    },
  ],
}

function newsFaqs(lang) {
  const key = pickLang(lang)
  const mod = getLongevityNewsModuleCopy(key)
  const questions = {
    zh: [
      '前沿医学资讯页面上的卡片是全文吗？',
      '这些标题可以理解成已经证实有效的治疗结论吗？',
      '为什么很多条目只有标题和关键词？',
    ],
    en: [
      'Are the insight cards the full text?',
      'Do these titles mean a treatment is already proven?',
      'Why do many cards only have a title and keywords?',
    ],
    ar: [
      'هل بطاقات المستجدات هي النص الكامل؟',
      'هل تعني العناوين أن العلاج مثبت؟',
      'لماذا كثير من البطاقات عنوان وكلمات فقط؟',
    ],
  }
  const prompts = questions[key] || questions.zh
  return [
    { q: prompts[0], a: mod.lead },
    { q: prompts[1], a: mod.caveatPhrase },
    { q: prompts[2], a: mod.wechatBody },
  ]
}

export function getPageFaqs(pathname, lang) {
  const key = pickLang(lang)
  const path = String(pathname || '/').replace(/\/$/, '') || '/'
  if (path === '/longevity-news') return newsFaqs(key)
  const table = path === '/about' ? ABOUT_FAQS : path === '/solutions' ? SOLUTION_FAQS : null
  if (!table) return []
  return table[key] || table.zh
}

export const PUBLIC_CRAWL_NAV = [
  { path: '/', label: { zh: '首页', en: 'Home', ar: 'الرئيسية' } },
  { path: '/about', label: { zh: '关于本站', en: 'About', ar: 'حول المنصة' } },
  { path: '/solutions', label: { zh: 'AI长寿方案师', en: 'AI Coach', ar: 'مدرب AI' } },
  { path: '/health-skills', label: { zh: '长寿知识技能', en: 'Health Skills', ar: 'مهارات' } },
  { path: '/products', label: { zh: '产品证据库', en: 'Evidence Library', ar: 'مكتبة الأدلة' } },
  { path: '/tcm-prevention', label: { zh: '中医治未病', en: 'Preventive TCM', ar: 'وقاية صينية' } },
  { path: '/longevity-news', label: { zh: '前沿医学资讯', en: 'Medical Insights', ar: 'مستجدات' } },
  { path: '/disclaimer', label: { zh: '免责声明', en: 'Disclaimer', ar: 'إخلاء المسؤولية' } },
]

export function getAboutPage(lang) {
  const key = pickLang(lang)
  const solutions = getSolutionsPublicCopy(key)
  const modules = HOME_MODULES.map((mod) => ({
    path: mod.path,
    title: pick(mod.title, key),
    intro: pick(mod.intro, key),
  }))
  const urls = [
    { label: key === 'zh' ? '规范站点' : key === 'ar' ? 'العنوان المعياري' : 'Canonical site', href: `${SITE_ORIGIN}/`, path: '/' },
    { label: key === 'zh' ? '公开访问' : key === 'ar' ? 'الوصول العام' : 'Public deployment', href: `${PUBLIC_LIVE_ORIGIN}/` },
    { label: key === 'zh' ? '关于本站' : key === 'ar' ? 'حول المنصة' : 'About this site', href: absoluteUrl(key, '/about'), path: '/about' },
    { label: key === 'zh' ? '健康与医疗免责声明' : key === 'ar' ? 'إخلاء المسؤولية الصحية' : 'Health disclaimer', href: absoluteUrl(key, '/disclaimer'), path: '/disclaimer' },
    { label: key === 'zh' ? '隐私政策' : key === 'ar' ? 'الخصوصية' : 'Privacy policy', href: absoluteUrl(key, '/privacy'), path: '/privacy' },
    { label: 'llms.txt', href: `${SITE_ORIGIN}/llms.txt` },
  ]

  const localized = {
    zh: {
      kicker: SITE_LEGAL.brandName,
      title: '关于长健星图',
      updatedLabel: '最近更新',
      lead: '长健星图（Longevity Atlas）是循证健康长寿教育平台，融合现代医学证据与中医治未病框架，提供健康教育、产品证据核对与生活方式参考。本平台内容仅供健康教育与生活方式参考，不替代专业诊疗、处方或紧急医疗处置。',
      sections: [
        {
          id: 'what',
          heading: '这是什么',
          paragraphs: [
            `长健星图面向健康教育，不提供诊断、治疗、处方或紧急医疗处置。运营主体是${SITE_LEGAL.legalEntityName}。联系邮箱：${SITE_LEGAL.contactEmail}。`,
            '站点把指南与研究证据、产品成分与监管信息、中医体质和四时养生放在同一套说明里，并尽量标明证据等级、适用人群和不宜自行处理的情形。',
          ],
        },
        {
          id: 'audience',
          heading: '面向谁',
          paragraphs: [
            '公众：关注睡眠、代谢、运动、营养和预防保健，希望先看清证据边界再决定生活方式。',
            '产品使用者：在购买健康产品或补充剂前，核对成分、研究证据、监管信息和相互作用提示。本站不把产品包装成治疗方案。',
            '有医学背景的会员：在专业咨询中检索基础医学、临床医学、功能医学和长寿学文献，并可选 PubMed、Cochrane、欧洲 PMC。检索结果仍不是诊疗意见。',
            '产业读者：转化应用机会页面向创业、投资与产业团队，提示监管、证据和获客风险，不是投资建议。',
            '妊娠、儿童、慢病用药者等特殊人群请咨询医生。',
          ],
        },
        {
          id: 'modules',
          heading: '公开模块',
          paragraphs: [
            '下列模块介绍可以公开阅读。长寿知识技能的课程正文需注册登录后按会员等级观看。初步体质辨识需登录，且向标准会员及以上开放。问卷答案、评估结果和咨询对话不公开。',
          ],
          modules,
        },
        {
          id: 'consult',
          heading: '咨询概览',
          paragraphs: [
            solutions.consultLead,
            `${solutions.general.title}：${solutions.general.body}`,
            `${solutions.professional.title}：${solutions.professional.body}`,
            `${solutions.tcm.title}：${solutions.tcm.body}`,
            solutions.assessment,
          ],
        },
        {
          id: 'compliance',
          heading: '合规与引用界限',
          paragraphs: [
            `全站页脚声明：${FOOTER_DISCLAIMER.zh}`,
            `方案页声明：${SOLUTIONS_DISCLAIMER.zh}`,
            `咨询声明：${CONSULT_DISCLAIMER.zh}`,
            '中医内容为教育参考，不替代个体辨证论治与执业医师处方。未经当场辨证，不能作为用药依据。',
            '引用公开页面时，请同时保留上述教育界限，并链接规范网址。不要把本站句子改写成诊断、治愈率或个性化处方。',
          ],
        },
        {
          id: 'urls',
          heading: '站点地址',
          paragraphs: [
            '请优先引用规范站点。公开部署与规范站点是同一套内容，供当前访问使用。',
          ],
          urls,
        },
      ],
    },
    en: {
      kicker: 'Longevity Atlas',
      title: 'About Longevity Atlas',
      updatedLabel: 'Last updated',
      lead: 'Longevity Atlas is an evidence-based longevity education platform. It combines modern medical evidence with preventive TCM, and offers health education, product-evidence checks, and lifestyle reference. Content is for education and lifestyle reference only—not diagnosis, prescriptions, or emergency care.',
      sections: [
        {
          id: 'what',
          heading: 'What it is',
          paragraphs: [
            `The operator is ${SITE_LEGAL.legalEntityName}. Contact: ${SITE_LEGAL.contactEmail}.`,
            'The site puts guideline and research context, product ingredients and regulatory information, and TCM constitution and seasonal framing in one place, with evidence grades, audience fit, and situations that should not be handled alone.',
          ],
        },
        {
          id: 'audience',
          heading: 'Who it is for',
          paragraphs: [
            'The public: people watching sleep, metabolism, movement, nutrition, and prevention who want the evidence boundary first.',
            'Shoppers: people checking ingredients, research, regulatory context, and interactions before buying. Products are not packaged as treatment.',
            'Members with a medical background: professional consult searches basic, clinical, functional, and longevity sources, with optional PubMed, Cochrane, and Europe PMC. Results are still not medical advice.',
            'Industry readers: the translation page is for founders and operators and flags regulatory, evidence, and adoption risks. It is not investment advice.',
            'Pregnancy, children, and people on long-term medication should ask a clinician.',
          ],
        },
        {
          id: 'modules',
          heading: 'Public modules',
          paragraphs: [
            'The introductions below are public. Health-skills course bodies require a signed-in member, by level. The constitution check requires sign-in and Standard membership or higher. Questionnaire answers, assessment results, and consult transcripts are not public.',
          ],
          modules,
        },
        {
          id: 'consult',
          heading: 'Consult overview',
          paragraphs: [
            solutions.consultLead,
            `${solutions.general.title}: ${solutions.general.body}`,
            `${solutions.professional.title}: ${solutions.professional.body}`,
            `${solutions.tcm.title}: ${solutions.tcm.body}`,
            solutions.assessment,
          ],
        },
        {
          id: 'compliance',
          heading: 'Compliance and citation',
          paragraphs: [
            `Footer notice: ${FOOTER_DISCLAIMER.en}`,
            `Coach page: ${SOLUTIONS_DISCLAIMER.en}`,
            `Consult notice: ${CONSULT_DISCLAIMER.en}`,
            'TCM material is education. It does not replace in-person pattern differentiation or a licensed prescription, and it is not a basis for taking medicine without that assessment.',
            'When you cite a public page, keep that education limit and link the canonical URL. Do not rewrite a sentence into a diagnosis, a cure rate, or a personal prescription.',
          ],
        },
        {
          id: 'urls',
          heading: 'Site URLs',
          paragraphs: [
            'Cite the canonical site. The public deployment serves the same content for current access.',
          ],
          urls,
        },
      ],
    },
    ar: {
      kicker: 'Longevity Atlas',
      title: 'حول المنصة',
      updatedLabel: 'آخر تحديث',
      lead: 'المنصة تعليم لطول العمر قائم على الأدلة، تجمع أدلة الطب الحديث مع الوقاية في الطب الصيني، وتقدّم تعليماً صحياً ومراجعة لأدلة المنتجات ومرجعاً لنمط الحياة. المحتوى للتعليم فقط وليس تشخيصاً أو وصفة أو رعاية طارئة.',
      sections: [
        {
          id: 'what',
          heading: 'ما هي',
          paragraphs: [
            `المشغّل ${SITE_LEGAL.legalEntityName}. البريد: ${SITE_LEGAL.contactEmail}.`,
            'يعرض الموقع سياق الأدلة ومكونات المنتجات والتنظيم وإطار الطب الصيني الوقائي، مع حدود الاستخدام.',
          ],
        },
        {
          id: 'audience',
          heading: 'الجمهور',
          paragraphs: [
            'الجمهور المهتم بالنوم والأيض والحركة والتغذية والوقاية.',
            'من يراجع المكونات والأدلة والتنظيم والتفاعلات قبل الشراء. المنتجات ليست علاجاً.',
            'الأعضاء ذوو الخلفية الطبية في الاستشارة المهنية. النتائج ليست رأياً علاجياً.',
            'قرّاء الصناعة في صفحة فرص التحويل. ليست نصيحة استثمار.',
            'الحمل والأطفال ومن يستخدم أدوية مزمنة يسألون الطبيب.',
          ],
        },
        {
          id: 'modules',
          heading: 'الوحدات العامة',
          paragraphs: [
            'المقدمات أدناه عامة. متن الدورات يتطلب عضوية. التمييز الأولي لنمط الجسم يتطلب تسجيل الدخول وعضوية قياسية أو أعلى. إجابات الاستبيان ونتائج التقييم ونصوص الاستشارة ليست عامة.',
          ],
          modules,
        },
        {
          id: 'consult',
          heading: 'الاستشارة',
          paragraphs: [
            solutions.consultLead,
            `${solutions.general.title}: ${solutions.general.body}`,
            `${solutions.professional.title}: ${solutions.professional.body}`,
            `${solutions.tcm.title}: ${solutions.tcm.body}`,
            solutions.assessment,
          ],
        },
        {
          id: 'compliance',
          heading: 'الامتثال والاقتباس',
          paragraphs: [
            `تذييل الموقع: ${FOOTER_DISCLAIMER.ar}`,
            `صفحة المدرب: ${SOLUTIONS_DISCLAIMER.ar}`,
            `تنبيه الاستشارة: ${CONSULT_DISCLAIMER.ar}`,
            'محتوى الطب الصيني تعليمي فقط، ولا يغني عن المعاينة الحضورية أو وصفة الطبيب.',
            'عند الاقتباس أبقِ حد التعليم واربط العنوان المعياري. لا تحوّل الجملة إلى تشخيص أو معدل شفاء أو وصفة شخصية.',
          ],
        },
        {
          id: 'urls',
          heading: 'العناوين',
          paragraphs: ['اذكر العنوان المعياري. النشر العام يقدّم المحتوى نفسه.'],
          urls,
        },
      ],
    },
  }[key]

  return {
    ...localized,
    updated: PUBLIC_SUMMARY_UPDATED,
    faqHeading: getFaqHeading(key),
    faqs: getPageFaqs('/about', key),
    contactEmail: SITE_LEGAL.contactEmail,
  }
}
