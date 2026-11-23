/**
 * 公开、可引用的站点说明。关于页、方案页 FAQ、预渲染正文和 llms.txt 共用这里的句子，
 * 以便和已经上线的免责声明、咨询边界保持一致。
 */
import { HOME_MODULES } from './homePageContent.js'
import { NMN_EVIDENCE_PATH, getNmnEvidenceFaqs } from './nmnEvidenceMeta.js'
import { OMEGA3_EVIDENCE_PATH, getOmega3EvidenceFaqs } from './omega3EvidenceMeta.js'
import { VITAMIN_D_EVIDENCE_PATH, getVitaminDEvidenceFaqs } from './vitaminDEvidenceMeta.js'
import { CREATINE_EVIDENCE_PATH, getCreatineEvidenceFaqs } from './creatineEvidenceMeta.js'
import { MAGNESIUM_EVIDENCE_PATH, getMagnesiumEvidenceFaqs } from './magnesiumEvidenceMeta.js'
import { getPublicFaqPage } from './publicFaq.js'
import { getLongevityNewsModuleCopy } from './longevityNewsModuleI18n.js'
import {
  PUBLIC_SUMMARY_UPDATED,
  SITE_ORIGIN,
  absoluteUrl,
} from './seo.js'
import { SITE_LEGAL } from './siteLegal.js'

function pickLang(lang) {
  if (lang === 'en') return lang
  return 'zh'
}

function pick(map, lang) {
  const key = pickLang(lang)
  return map?.[key] || map?.zh || ''
}

const FOOTER_DISCLAIMER = {
  zh: '本平台内容仅供健康教育与生活方式参考，不替代专业诊疗、处方或紧急医疗处置；特殊人群（妊娠、儿童、慢病用药者等）请咨询医生。',
  en: 'Content is for education and lifestyle guidance only—not medical diagnosis or treatment. Consult a clinician for special populations.',
}

const CONSULT_DISCLAIMER = {
  zh: '本平台提供的健康信息仅供参考，不构成医疗诊断、治疗建议或处方依据。如有健康问题，请及时就诊于执业医疗机构，遵从执业医师的专业判断。',
  en: 'The health information provided on this platform is for reference only and does not constitute medical diagnosis, treatment advice, or prescription guidance. If you have health concerns, please consult a licensed medical professional.',
}

const SOLUTIONS_DISCLAIMER = {
  zh: '本平台提供健康教育与辅助决策信息，不替代医生诊断、治疗和处方。',
  en: 'This platform provides health education and decision-support information only. It does not replace a physician’s diagnosis, treatment, or prescriptions.',
}

export function getFaqHeading(lang) {
  if (lang === 'en') return 'Questions'
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
  }
  return { ...copy[key], faqHeading: getFaqHeading(key), faqs: getPageFaqs('/solutions', key) }
}

/** 咨询说明页可公开抓取。对话本身仍需登录，这段文字不要求登录。 */
export function getConsultPublicCopy(lang) {
  const key = pickLang(lang)
  const solutions = getSolutionsPublicCopy(key)
  if (key === 'en') {
    return {
      heading: 'AI longevity consult',
      lead: 'This page explains the consult. Search engines can read it without an account. The conversation itself asks you to sign in.',
      who: 'Self-care is for signed-in members managing everyday health. Professional consult and the TCM wellness consult are for Premium members, and the professional one is meant for people with a medical background.',
      process: 'You choose a mode, optionally attach images, PDFs, or public links, and the reply stays inside that mode’s sources. A public link is read only after this site extracts the text. The model is not asked to guess from the URL alone.',
      boundary: `${solutions.consultLead} ${solutions.medicalDisclaimer}`,
      general: solutions.general,
      professional: solutions.professional,
      tcm: solutions.tcm,
    }
  }
  return {
    heading: 'AI 健康长寿咨询',
    lead: '本页说明咨询能做什么。搜索引擎不登录也能读到这些话。真正的对话仍需要登录。',
    who: '自我健康促进面向已登录会员的日常管理。专业咨询和中医养生保健咨询面向高级会员；专业咨询还面向有医学背景的使用者。',
    process: '先选择一种咨询，可以附上图片、PDF，或粘贴公开网页和 PDF 链接。链接会先由本站抽出正文，再交给模型，不会只凭网址猜测。回答只走该模式自己的资料范围。',
    boundary: `${solutions.consultLead}${solutions.medicalDisclaimer}`,
    general: solutions.general,
    professional: solutions.professional,
    tcm: solutions.tcm,
  }
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
      a: `可以引用公开说明页：首页、关于本站、常见问题（${absoluteUrl('zh', '/faq')}）、证据核对说明（${absoluteUrl('zh', '/methodology')}）、AI 长寿方案师、长寿知识技能入口说明、产品证据库、中医治未病、前沿医学资讯、转化应用机会，以及用户协议、隐私政策、免责声明等法律页。前沿医学资讯的每条公开卡片另有独立网址。成分证据目前可以引用五页：NMN / NR（${absoluteUrl('zh', '/products/evidence/nmn')}）、EPA/DHA（${absoluteUrl('zh', '/products/evidence/omega-3')}）、维生素 D（${absoluteUrl('zh', '/products/evidence/vitamin-d')}）、肌酸（${absoluteUrl('zh', '/products/evidence/creatine')}）和镁（${absoluteUrl('zh', '/products/evidence/magnesium')}）。逐条商品、购物页和商品详情，以及体质辨识和机会条目，仍不是公开可抓取语料。引用时请保留「仅供健康教育，不替代诊疗」的界限，并链回规范网址。登录、注册、会员账户、支付与订单、问卷答案、评估结果、咨询对话、课程学习页、管理后台和 /api 不在公开引用范围内。`,
    },
    {
      q: '规范网址是哪一个？',
      a: `引用请使用 ${SITE_ORIGIN}/ 。这是唯一的规范站点。关于本站的说明见 ${SITE_ORIGIN}/about ，最近更新日期为 ${PUBLIC_SUMMARY_UPDATED}。`,
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
      a: `Public pages may be cited: home, about, questions (${absoluteUrl('en', '/faq')}), how evidence is checked (${absoluteUrl('en', '/methodology')}), the AI coach overview, the health-skills entry, the product evidence library, TCM prevention, medical insights, translation opportunities, and the legal pages. Each public medical-insight card also has its own URL. Five ingredient evidence pages may also be cited: NMN / NR (${absoluteUrl('en', '/products/evidence/nmn')}), EPA/DHA (${absoluteUrl('en', '/products/evidence/omega-3')}), vitamin D (${absoluteUrl('en', '/products/evidence/vitamin-d')}), creatine (${absoluteUrl('en', '/products/evidence/creatine')}), and magnesium (${absoluteUrl('en', '/products/evidence/magnesium')}). Individual products, shopping and detail pages, constitution checks, and opportunity rows are still not a public crawlable corpus. Keep the education-not-diagnosis limit and link the canonical URL. Login, registration, accounts, payments, questionnaire answers, assessment results, consult transcripts, course players, admin, and /api are not public.`,
    },
    {
      q: 'Which URL should be cited?',
      a: `Cite ${SITE_ORIGIN}/ . That is the only canonical site. The about page is ${SITE_ORIGIN}/about and was last updated ${PUBLIC_SUMMARY_UPDATED}.`,
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
      '只有标题的卡片有没有独立网址？',
    ],
    en: [
      'Are the insight cards the full text?',
      'Do these titles mean a treatment is already proven?',
      'Does a title-only card have its own URL?',
    ],
  }
  const prompts = questions[key] || questions.zh
  return [
    { q: prompts[0], a: mod.lead },
    { q: prompts[1], a: mod.caveatPhrase },
    {
      q: prompts[2],
      a: key === 'en'
        ? 'WeChat does not allow republishing a full post. Every public card still has its own URL. Cards that already have a summary or takeaways use that text. Title-only cards use an original educational note on this site, plus a link to the source page.'
        : '微信不允许转载公众号全文。每条公开卡片仍有独立网址：已经写了摘要或阅读要点的用原文，只有标题的用本站撰写的教育性说明，并链回来源页。',
    },
  ]
}

export function getPageFaqs(pathname, lang) {
  const key = pickLang(lang)
  const path = String(pathname || '/').replace(/\/$/, '') || '/'
  if (path === '/longevity-news') return newsFaqs(key)
  if (path === NMN_EVIDENCE_PATH) return getNmnEvidenceFaqs(key)
  if (path === OMEGA3_EVIDENCE_PATH) return getOmega3EvidenceFaqs(key)
  if (path === VITAMIN_D_EVIDENCE_PATH) return getVitaminDEvidenceFaqs(key)
  if (path === CREATINE_EVIDENCE_PATH) return getCreatineEvidenceFaqs(key)
  if (path === MAGNESIUM_EVIDENCE_PATH) return getMagnesiumEvidenceFaqs(key)
  if (path === '/faq') return getPublicFaqPage(key).faqs
  const table = path === '/about' ? ABOUT_FAQS : path === '/solutions' ? SOLUTION_FAQS : null
  if (!table) return []
  return table[key] || table.zh
}

export const PUBLIC_CRAWL_NAV = [
  { path: '/', label: { zh: '首页', en: 'Home' } },
  { path: '/about', label: { zh: '关于本站', en: 'About' } },
  { path: '/faq', label: { zh: '常见问题', en: 'Questions' } },
  { path: '/methodology', label: { zh: '证据核对', en: 'Methodology' } },
  { path: '/solutions', label: { zh: 'AI长寿方案师', en: 'AI Coach' } },
  { path: '/consult', label: { zh: 'AI咨询', en: 'Consult' } },
  { path: '/health-skills', label: { zh: '长寿知识技能', en: 'Health Skills' } },
  { path: '/products', label: { zh: '产品证据库', en: 'Evidence Library' } },
  { path: '/tcm-prevention', label: { zh: '中医治未病', en: 'Preventive TCM' } },
  { path: '/longevity-news', label: { zh: '前沿医学资讯', en: 'Medical Insights' } },
  { path: '/disclaimer', label: { zh: '免责声明', en: 'Disclaimer' } },
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
    { label: key === 'zh' ? '规范站点' : 'Canonical site', href: `${SITE_ORIGIN}/`, path: '/' },
    { label: key === 'zh' ? '关于本站' : 'About this site', href: absoluteUrl(key, '/about'), path: '/about' },
    { label: key === 'zh' ? '常见问题' : 'Questions', href: absoluteUrl(key, '/faq'), path: '/faq' },
    { label: key === 'zh' ? '证据核对说明' : 'How evidence is checked', href: absoluteUrl(key, '/methodology'), path: '/methodology' },
    { label: key === 'zh' ? '健康与医疗免责声明' : 'Health disclaimer', href: absoluteUrl(key, '/disclaimer'), path: '/disclaimer' },
    { label: key === 'zh' ? '隐私政策' : 'Privacy policy', href: absoluteUrl(key, '/privacy'), path: '/privacy' },
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
            `下列模块介绍可以公开阅读。长寿知识技能的课程正文需注册登录后按会员等级观看。初步体质辨识需登录，且向标准会员及以上开放。产品证据库、中医治未病和转化应用机会的公开页是栏目说明。逐条商品、购物页和商品详情仍不是公开可抓取语料；成分证据目前公开五页：NMN / NR（${absoluteUrl('zh', '/products/evidence/nmn')}）、EPA/DHA（${absoluteUrl('zh', '/products/evidence/omega-3')}）、维生素 D（${absoluteUrl('zh', '/products/evidence/vitamin-d')}）、肌酸（${absoluteUrl('zh', '/products/evidence/creatine')}）和镁（${absoluteUrl('zh', '/products/evidence/magnesium')}）。体质辨识和机会条目也不是公开可抓取语料。问卷答案、评估结果和咨询对话不公开。`,
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
          id: 'editorial',
          heading: '编辑责任',
          paragraphs: [
            '公开页面由运营主体发布，不署个人作者，也不设具名医学审稿人。页眉、页脚和结构化数据里的组织名称就是这一主体；本站没有作者名录。',
            `运营主体是${SITE_LEGAL.legalEntityName}。联系邮箱：${SITE_LEGAL.contactEmail}。这是站点联系方式，不是诊疗入口。关于页上方的更新日期仍是已发布的说明日期 ${PUBLIC_SUMMARY_UPDATED}，本段不另设审稿日期。`,
            `常见问题：${absoluteUrl('zh', '/faq')}。证据核对说明：${absoluteUrl('zh', '/methodology')}。成分证据的现例：NMN / NR（${absoluteUrl('zh', '/products/evidence/nmn')}）、EPA/DHA（${absoluteUrl('zh', '/products/evidence/omega-3')}）、维生素 D（${absoluteUrl('zh', '/products/evidence/vitamin-d')}）、肌酸（${absoluteUrl('zh', '/products/evidence/creatine')}）和镁（${absoluteUrl('zh', '/products/evidence/magnesium')}）。这些页面不提供用量，也不把研究写成治疗、预防或抗衰老疗效。`,
            '登录后的商品详情、课程正文、问卷答案、评估结果和咨询对话不是上述公开页。',
          ],
        },
        {
          id: 'urls',
          heading: '站点地址',
          paragraphs: [
            `请引用规范站点 ${SITE_ORIGIN}/ 。不要把其他域名上的副本写成另一份站点。`,
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
            `The introductions below are public. Health-skills course bodies require a signed-in member, by level. The constitution check requires sign-in and Standard membership or higher. The product, TCM, and translation overviews are section explanations. Individual products, shopping pages, and product details are not a public crawlable corpus. Five ingredient evidence pages are public: NMN / NR at ${absoluteUrl('en', '/products/evidence/nmn')}, EPA/DHA at ${absoluteUrl('en', '/products/evidence/omega-3')}, vitamin D at ${absoluteUrl('en', '/products/evidence/vitamin-d')}, creatine at ${absoluteUrl('en', '/products/evidence/creatine')}, and magnesium at ${absoluteUrl('en', '/products/evidence/magnesium')}. Constitution checks and opportunity rows are not a public crawlable corpus. Questionnaire answers, assessment results, and consult transcripts are not public.`,
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
          id: 'editorial',
          heading: 'Editorial responsibility',
          paragraphs: [
            'Public pages are published by the operator. They do not name a personal author or a medical reviewer. The organization in the header, footer, and structured data is that operator. There is no author roster.',
            `The operator is ${SITE_LEGAL.legalEntityName}. Contact: ${SITE_LEGAL.contactEmail}. That is a site mailbox, not a clinic. The date at the top of this page remains the published summary date ${PUBLIC_SUMMARY_UPDATED}. This note does not add a review date.`,
            `Questions: ${absoluteUrl('en', '/faq')}. How evidence is checked: ${absoluteUrl('en', '/methodology')}. Ingredient examples: NMN / NR (${absoluteUrl('en', '/products/evidence/nmn')}), EPA/DHA (${absoluteUrl('en', '/products/evidence/omega-3')}), vitamin D (${absoluteUrl('en', '/products/evidence/vitamin-d')}), creatine (${absoluteUrl('en', '/products/evidence/creatine')}), and magnesium (${absoluteUrl('en', '/products/evidence/magnesium')}). Those pages give no dose and do not turn research into treatment, prevention, or an anti-aging effect.`,
            'Signed-in product details, course text, questionnaire answers, assessment results, and consult transcripts are not those public pages.',
          ],
        },
        {
          id: 'urls',
          heading: 'Site URLs',
          paragraphs: [
            `Cite ${SITE_ORIGIN}/ . Do not treat a copy on another hostname as a second site.`,
          ],
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
