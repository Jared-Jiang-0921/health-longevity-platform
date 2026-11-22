/**
 * 公开的站点问答。只说明页面边界和引用方式，不提供用量或治疗建议。
 */
import { NMN_EVIDENCE_PATH } from './nmnEvidenceMeta.js'
import { OMEGA3_EVIDENCE_PATH } from './omega3EvidenceMeta.js'
import { VITAMIN_D_EVIDENCE_PATH } from './vitaminDEvidenceMeta.js'
import { CREATINE_EVIDENCE_PATH } from './creatineEvidenceMeta.js'
import { MAGNESIUM_EVIDENCE_PATH } from './magnesiumEvidenceMeta.js'
import { SITE_LEGAL } from './siteLegal.js'
import { absoluteUrl } from './seo.js'

const PAGES = {
  zh: {
    kicker: '站点问答',
    title: '常见问题',
    lead: '这里回答本站公开页面是什么、哪些内容可以引用、来源怎么写、以及它们和登录后商品页的差别。不讨论某种成分该不该用，也不提供用量。',
    disclaimer:
      '本页仅供了解站点范围。它不是医疗建议、诊断、治疗或处方。公开页面不给出用量，也不把研究结果写成治疗或抗衰老疗效。',
    faqs: [
      {
        q: '长健星图是什么？',
        a: `长健星图（Longevity Atlas）是循证健康长寿教育平台，由${SITE_LEGAL.legalEntityName}运营。它把公开说明、成分证据核对和生活方式参考放在一起，仅供健康教育，不替代专业诊疗、处方或紧急医疗处置。更完整的介绍在关于页：${absoluteUrl('zh', '/about')}。`,
      },
      {
        q: '哪些页面可以公开引用，哪些需要登录？',
        a: `可以引用的是已经预渲染的公开页：首页、关于、本问答、证据核对说明、AI 长寿方案师的公开说明、产品证据库的栏目说明、中医治未病的栏目说明、前沿医学资讯及其已有网址的卡片、转化应用机会的栏目说明，以及用户协议、隐私政策和免责声明。课程正文在 /health-skills/ 下，需登录后按会员等级观看，不在公开语料里。初步体质辨识、问卷答案、风险评估和衰老评估结果、咨询对话、会员账户和支付页面也不公开。`,
      },
      {
        q: '公开页怎样引用来源？',
        a: `讨论一项人体研究时，页面写出论文并给出 PMID，链到 PubMed，不把论文里的用量抄成给读者的用法。监管状态链到主管部门的公开答复；别人转述机构信件时，标明那不是政府原文。具体做法写在证据核对说明：${absoluteUrl('zh', '/methodology')}。`,
      },
      {
        q: '公开页会给用量或治疗建议吗？',
        a: `不会。公开页不写用量，不推荐品牌，也不把细胞、动物或短期人体试验写成治疗、预防或抗衰老已经成立。血液里某个标志物的变化不是疾病结局。健康与医疗免责声明见 ${absoluteUrl('zh', '/disclaimer')}。成分页怎样守住这条边界，见 ${absoluteUrl('zh', NMN_EVIDENCE_PATH)}。`,
      },
      {
        q: '怎样联系本站？',
        a: `站点联系邮箱是 ${SITE_LEGAL.contactEmail}。这是运营联系方式，不是诊疗、处方或紧急医疗入口。个人健康问题请咨询执业医师。`,
      },
      {
        q: '公开的成分证据页和登录后的商品页有什么不同？',
        a: `目前公开的成分证据有五页：NMN / NR（${absoluteUrl('zh', NMN_EVIDENCE_PATH)}）、EPA/DHA（${absoluteUrl('zh', OMEGA3_EVIDENCE_PATH)}）、维生素 D（${absoluteUrl('zh', VITAMIN_D_EVIDENCE_PATH)}）、肌酸（${absoluteUrl('zh', CREATINE_EVIDENCE_PATH)}）和镁（${absoluteUrl('zh', MAGNESIUM_EVIDENCE_PATH)}）。它们说明证据限度和监管信息，不是在售商品。/products/nmn、/products/1 以及其他商品详情仍是站内功能，爬虫看到的是 noindex 壳，规格和购物页也不进入站点地图。产品证据库栏目页只说明购买前如何核对，不把目录当成公开商品清单：${absoluteUrl('zh', '/products')}。`,
      },
      {
        q: '本站有署名作者或医学审稿人吗？',
        a: `没有。公开页不署个人作者，也不设具名医学审稿人，因此不另设作者名录。出版责任在运营主体 ${SITE_LEGAL.legalEntityName}。结构化数据使用网页和问答类型，不编造作者或审稿人。说明见关于页的编辑责任一节。`,
      },
    ],
  },
  en: {
    kicker: 'Site questions',
    title: 'Questions',
    lead: 'These answers cover what the public pages are, what may be cited, how sources are named, and how that differs from signed-in product pages. They do not discuss whether to use an ingredient, and they give no dose.',
    disclaimer:
      'This page only explains the scope of the site. It is not medical advice, a diagnosis, a treatment, or a prescription. Public pages give no dose and do not turn research into treatment or an anti-aging effect.',
    faqs: [
      {
        q: 'What is Longevity Atlas?',
        a: `Longevity Atlas (长健星图) is an evidence-based longevity education platform operated by ${SITE_LEGAL.legalEntityName}. It publishes educational pages, ingredient-evidence notes, and lifestyle reference. It does not replace diagnosis, prescriptions, or emergency care. The longer account is ${absoluteUrl('en', '/about')}.`,
      },
      {
        q: 'Which pages are public, and which require sign-in?',
        a: 'Public, prerendered pages may be cited: home, about, this FAQ, the methodology note, the public overview of the AI coach, the product-evidence overview, the TCM prevention overview, medical-insight cards that already have URLs, the translation overview, and the legal pages. Course bodies under /health-skills/ require a signed-in member and are not public. Constitution checks, questionnaire answers, risk and aging results, consult transcripts, accounts, and payments are not public.',
      },
      {
        q: 'How do public pages cite sources?',
        a: `When a page discusses a human study, it names the paper, gives the PMID, and links to PubMed. It does not copy a trial dose into advice for a reader. Regulatory status links to the agency’s own text. A retelling of an agency letter is labeled as not the original. The habit is described at ${absoluteUrl('en', '/methodology')}.`,
      },
      {
        q: 'Do public pages give a dose or treatment advice?',
        a: `No. They give no dose, recommend no brand, and do not turn cell, animal, or short human studies into treatment, prevention, or an anti-aging effect. A change in a blood marker is not a disease outcome. The health disclaimer is ${absoluteUrl('en', '/disclaimer')}. The ingredient page that keeps this boundary is ${absoluteUrl('en', NMN_EVIDENCE_PATH)}.`,
      },
      {
        q: 'How do I contact the site?',
        a: `The site contact is ${SITE_LEGAL.contactEmail}. That is an operator mailbox, not a clinic, a prescription line, or emergency care. For a personal health question, ask a licensed clinician.`,
      },
      {
        q: 'How is a public ingredient page different from a signed-in product page?',
        a: `Five ingredient evidence pages are public: NMN / NR (${absoluteUrl('en', NMN_EVIDENCE_PATH)}), EPA/DHA (${absoluteUrl('en', OMEGA3_EVIDENCE_PATH)}), vitamin D (${absoluteUrl('en', VITAMIN_D_EVIDENCE_PATH)}), creatine (${absoluteUrl('en', CREATINE_EVIDENCE_PATH)}), and magnesium (${absoluteUrl('en', MAGNESIUM_EVIDENCE_PATH)}). They state limits and regulatory context. They are not products for sale. /products/nmn, /products/1, and other product details stay in-app; crawlers receive a noindex shell, and SKUs are not in the sitemap. The product overview explains how to check a claim and is not a public catalog: ${absoluteUrl('en', '/products')}.`,
      },
      {
        q: 'Does the site name authors or a medical reviewer?',
        a: `No. Public pages do not name a personal author or a medical reviewer, and the site does not publish an author directory. The publisher is the operator, ${SITE_LEGAL.legalEntityName}. Structured data uses WebPage and FAQPage types and does not invent an author or a reviewer. The about page states this editorial limit.`,
      },
    ],
  },
}

export function getPublicFaqPage(lang) {
  return lang === 'en' ? PAGES.en : PAGES.zh
}
