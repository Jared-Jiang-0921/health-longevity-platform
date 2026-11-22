/**
 * 公开的证据核对说明。描述引用习惯，不新增未经本站页面核对的研究结论。
 */
import { NMN_EVIDENCE_PATH } from './nmnEvidenceMeta.js'

const PAGES = {
  zh: {
    kicker: '引用说明',
    title: '证据如何核对与呈现',
    lead: '这一页说明公开页面怎样引用、怎样把研究发现和商品宣传分开。它是信任和引用说明，不是研究方法论文，也不在这里增加新的研究结论。',
    disclaimer:
      '本页不提供用量，不评价某种成分能否治疗疾病，也不写抗衰老疗效。需要看一个已经按此写法完成的例子时，请打开成分证据页，而不是把本页当成那篇研究的摘要。',
    sections: [
      {
        id: 'separate',
        heading: '先分开三种句子',
        paragraphs: [
          '公开页上的句子分成三类：一篇论文实际报告了什么，一个商品或广告声称什么，以及一份监管文件当时写了什么。三类不互相代替。论文里的标志物变化不是商品疗效，监管身份也不是临床结论。',
          '产品证据库的栏目页用同一套分层：细胞或动物机制、人群观察、人体干预。只有人体干预，而且终点和问题直接相关，才接近可以讨论临床意义。该页不列出在售规格。',
        ],
      },
      {
        id: 'papers',
        heading: '怎样引用同行评议论文',
        paragraphs: [
          '当公开页讨论一项已经核对过的人体研究时，它写出论文、PMID，并链到 PubMed。PMID 用来让读者找到原文，不是给本站加一个作者。页面不把试验方案里的用量写成读者的用法，也不把一次短期试验写成疾病治疗。',
          '资讯栏目里已有一篇方法说明，讲怎样把论文分成机制、观察和干预三层。成分证据页则是把这个习惯用在一个具体成分上的例子：只引用该页已经列出的论文，不在本页再添一篇新的研究。',
        ],
      },
      {
        id: 'regulators',
        heading: '怎样使用监管原文和转述',
        paragraphs: [
          '许可状态以主管部门自己的公开答复或公告为准，并链到那个页面。答复有日期。页面写明那是答复当时的说法，以后是否变化要看现行公告，不把旧答复写成永久许可，也不把申请被受理写成已经批准。',
          '若公开材料只是行业协会、律所或媒体对一封机构信件的转述，页面标明它不是政府原文，不能代替阅读信件本身。成分证据页里对美国膳食补充剂身份的写法就是这样做的：转述和 FDA 的一般说明页分开，且不把它当成疗效认定。',
        ],
      },
      {
        id: 'people',
        heading: '不编造作者或审稿人',
        paragraphs: [
          '本站没有公开的作者名录，也没有具名医学审稿人。公开页的结构化数据使用网页、问答或文章类型，出版方是运营主体，不添加作者、审稿人或职称。资讯单篇同样不写作者或审稿人。',
          '本站不另开作者目录。关于页的编辑责任一节重复这条界限，避免把机构页面读成某位医师的署名文章。',
        ],
      },
      {
        id: 'limits',
        heading: '公开页不写用量和治疗结论',
        paragraphs: [
          '无论论文摘要里有没有用量，公开页都不把它抄成建议。也不把研究结果写成诊断、治疗、预防或抗衰老疗效。保健食品不是药物；膳食补充剂不是治疗方案。',
          '登录后的课程正文、商品规格、问卷、评估和咨询对话不使用这一套公开网址，也不能把公开页上的句子改成个性化处方。',
        ],
      },
    ],
    relatedHeading: '本站已有页面',
    related: [
      { path: NMN_EVIDENCE_PATH, label: '成分证据示例：NMN / NR' },
      { path: '/products', label: '产品证据库：购买前如何核对' },
      { path: '/longevity-news/ln-static-2', label: '资讯：怎样给一篇论文分证据档' },
      { path: '/longevity-news/ln-static-3', label: '资讯：NMN / NR 证据缺口的短说明' },
      { path: '/faq', label: '常见问题' },
      { path: '/about', label: '关于本站与编辑责任' },
      { path: '/disclaimer', label: '健康与医疗免责声明' },
    ],
  },
  en: {
    kicker: 'Citation note',
    title: 'How evidence is checked and presented',
    lead: 'This page describes how public pages cite sources and how they keep a study finding apart from a product claim. It is a trust and citation note, not a methods paper, and it adds no new study conclusion.',
    disclaimer:
      'This page gives no dose, does not judge whether an ingredient treats a disease, and states no anti-aging effect. For a page that already follows these habits, open the ingredient evidence page rather than treating this note as a summary of that research.',
    sections: [
      {
        id: 'separate',
        heading: 'Separate three kinds of sentence',
        paragraphs: [
          'A sentence on a public page is one of three things: what a paper reported, what a product or advertisement claims, or what a regulator wrote. They do not stand in for one another. A marker change in a paper is not a product effect, and a regulatory status is not a clinical result.',
          'The product-evidence overview uses the same layers: a cell or animal mechanism, an association in people, and a human intervention. Only a human intervention, and only when the endpoint matches the question, is close to a clinical discussion. That overview does not list SKUs for sale.',
        ],
      },
      {
        id: 'papers',
        heading: 'How a peer-reviewed paper is cited',
        paragraphs: [
          'When a public page discusses a human study it has checked, it names the paper, gives the PMID, and links to PubMed. The PMID lets a reader find the paper. It does not add an author to this site. The page does not turn a trial dose into instructions, and it does not turn one short trial into treatment of a disease.',
          'The insights section already has a note on sorting a paper into mechanism, observation, and intervention. The ingredient evidence page is the example of that habit applied to one ingredient. This methodology page does not add another study.',
        ],
      },
      {
        id: 'regulators',
        heading: 'Official replies and secondary accounts',
        paragraphs: [
          'Regulatory status is taken from the agency’s own public reply or notice, with a link and a date. The page says that was the text at that time. Later changes depend on the current notice. An application accepted for review is not an approval.',
          'If the public record is an industry association, law firm, or news account of an agency letter, the page says it is not the government original and is not a substitute for the letter. The ingredient page treats the United States supplement status that way: the retelling is separate from FDA’s general supplement page, and neither is an efficacy finding.',
        ],
      },
      {
        id: 'people',
        heading: 'No invented author or reviewer',
        paragraphs: [
          'The site publishes no author roster and no named medical reviewer. Structured data on public pages uses WebPage, FAQPage, or Article types. The publisher is the operator. Those objects do not add an author, a reviewer, or a credential. Insight articles likewise have no author or reviewer.',
          'The site does not publish an author directory. The editorial note on the about page repeats this limit so an institutional page is not read as a signed article by a physician.',
        ],
      },
      {
        id: 'limits',
        heading: 'No dose and no treatment conclusion',
        paragraphs: [
          'Even when a paper’s abstract prints a dose, a public page does not copy it as advice. Research is not rewritten as diagnosis, treatment, prevention, or an anti-aging effect. A health food is not a drug. A dietary supplement is not a treatment plan.',
          'Signed-in course text, product variants, questionnaires, assessments, and consult transcripts are not these public URLs. A sentence on a public page is not a personal prescription.',
        ],
      },
    ],
    relatedHeading: 'Pages already on this site',
    related: [
      { path: NMN_EVIDENCE_PATH, label: 'Ingredient example: NMN / NR' },
      { path: '/products', label: 'Evidence library: how a claim is checked' },
      { path: '/longevity-news/ln-static-2', label: 'Insight: grading a paper' },
      { path: '/longevity-news/ln-static-3', label: 'Insight: the short NMN / NR note' },
      { path: '/faq', label: 'Questions' },
      { path: '/about', label: 'About and editorial responsibility' },
      { path: '/disclaimer', label: 'Health disclaimer' },
    ],
  },
}

export function getPublicMethodologyPage(lang) {
  return lang === 'en' ? PAGES.en : PAGES.zh
}
