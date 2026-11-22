/**
 * 公开的维生素 D 成分证据页。不是商品详情，不提供用量，也不把研究写成预防或治疗。
 */
import { getVitaminDEvidenceFaqs } from './vitaminDEvidenceMeta.js'

export { VITAMIN_D_EVIDENCE_PATH, VITAMIN_D_EVIDENCE_UPDATED } from './vitaminDEvidenceMeta.js'

const PAGES = {
  zh: {
    kicker: '成分证据 · 教育说明',
    title: '维生素 D：人体证据、监管表述与不能外推的边界',
    updatedLabel: '最近更新',
    lead:
      '这一页讨论维生素 D。正文里的大型试验使用的是维生素 D3，也就是胆钙化醇（cholecalciferol）。维生素 D2（麦角钙化醇，ergocalciferol）是另一种化合物。本页不把 D2 商品当成这些 D3 试验的同等证据。它不是商品页，不推荐品牌，也不提供用量。',
    disclaimer:
      '仅供健康教育参考，不构成医疗建议、诊断、治疗、预防或处方。某一次试验没有减少事件，或一篇综述写到小幅减少，都不能外推成某个胶囊已经能够预防骨折、癌症、心血管病或衰老。不要按本页停用已经开具的骨质疏松药物或其他处方。',
    sections: [
      {
        id: 'what',
        heading: '维生素 D3、维生素 D2 和商品声称不是同一句话',
        paragraphs: [
          '维生素 D 是一类脂溶性维生素的总称。D3 来自皮肤在紫外线下的合成路径，也可以做成补充剂。D2 来自另一条来源，化学结构不同。血液里常测的 25-羟维生素 D 是一种化验指标，不是骨折或癌症这些临床终点。',
          '标签上的「补钙」「强骨」「抗衰老」是商品声称。它不等于一项试验的主要终点，也不等于监管机构认定该商品能治疗骨质疏松或预防骨折。本页不安排晒太阳的时间，也不判断一个人要不要检测。',
        ],
      },
      {
        id: 'evidence',
        heading: '现有人体证据，以及它停在哪里',
        paragraphs: [
          'Manson 等人 2019 年报告了 VITAL 里维生素 D 与安慰剂的比较（PMID 30415629）。这是一项全美随机、安慰剂对照试验，25 871 名中老年成人参加，所用的是维生素 D3。中位随访 5.3 年。主要终点是任何类型的侵袭性癌症，以及主要心血管事件（心肌梗死、中风或心血管原因死亡）。补充维生素 D 与这两个主要终点的较低风险都没有关联。论文的结论是：与安慰剂相比，维生素 D 补充没有带来更低的侵袭性癌症或心血管事件发生率。这不能改写成「补充维生素 D 能预防癌症或心脏病」。',
          'LeBoff 等人 2022 年报告了同一试验的骨折附属分析（PMID 35939577）。参加者不是按维生素 D 缺乏、低骨量或骨质疏松招募的。中位随访 5.3 年，确认了 1991 次骨折。与安慰剂相比，维生素 D3 对全部骨折、非椎体骨折或髋部骨折都没有显著影响。论文写明：在未按缺乏、低骨量或骨质疏松挑选的一般健康中老年成人中，维生素 D3 补充没有显著降低骨折风险。这不是对已经确诊骨质疏松或明确缺乏的人的治疗试验。',
          'Avenell 等人 2014 年的 Cochrane 系统综述（PMID 24729336）纳入 53 项试验、共 91 791 名绝经后女性和老年男性，看维生素 D 或相关化合物、加或不加钙，与骨折的关系。综述写道：有高质量证据表明，单独使用维生素 D，在当时测试过的剂型和方案里，不太可能预防髋部骨折或任何新发骨折。维生素 D 加钙与髋部骨折风险的小幅下降有关，也与任何类型骨折的风险下降有关。同一综述报告，接受维生素 D 或类似物的人更常出现高钙血症，胃肠道症状和肾脏疾病也有小幅增加，死亡风险没有显示因此升高。这些是汇总试验的归纳。本页不把它换成「应当一起补充钙和维生素 D」，也不把它当成某个商品已经证明能预防骨折。',
          '三份材料不能合成一句广告。一般人群里的 D3 补充没有降低 VITAL 的癌症和心血管主要终点，也没有降低该试验里未按骨病入选者的骨折。跨试验汇总后，单独维生素 D 不太可能预防髋部骨折；维生素 D 加钙在综述里与较少骨折有关，同时伴随高钙血症等不良情况更多。化验指标变化、商品口号和这些终点不是一回事。',
        ],
      },
      {
        id: 'regulation',
        heading: '监管表述：授权声称不是治疗认定',
        paragraphs: [
          '美国食品标签：FDA 把钙与骨质疏松，以及钙加维生素 D 与骨质疏松，列为达到「显著科学共识」标准的授权健康声称，依据是 2008 年最终规则和 21 CFR 101.72。授权声称讨论的是作为健康饮食一部分时与骨质疏松风险的关系，而且必须符合该规则里的条件。它不是药品批准，不是对骨折的声称，也不是认定某一个补充剂能够治疗骨质疏松。本页不把法规里的示例句子当作自己的结论。原文见下面的 FDA 页面。',
          '美国预防服务工作组：2018 年 4 月 17 日的最终建议讨论社区居住成人用维生素 D、钙或二者预防骨折。它建议不要用它所写明的较低补充水平的维生素 D 加钙，去为社区居住的绝经后女性做骨折的一级预防；对更高水平，以及对男性和绝经前女性，认为证据不足。该建议不适用于已有骨质疏松性骨折、跌倒风险增加、骨质疏松或维生素 D 缺乏的人。工作组写明，其建议独立于美国政府，不应理解成卫生与公众服务部或医疗保健研究与质量局的官方立场。2024 年 12 月另有一份草案，在定稿前不是现行最终建议。本页不把草案当成已经生效的结论，也不把建议书里的数量抄成用法。',
          '中国：本页不判断某一个维生素 D 商品在中国是药品、注册保健食品还是普通食品。国外试验和美国标签规则都不是中国的药品许可。是否获准、声称是否越界，以国家卫生健康委、市场监管总局和国家药监局的现行公告以及该商品自己的注册或备案信息为准。保健食品不是药物，不能代替药物治疗疾病。',
        ],
      },
      {
        id: 'caution',
        heading: '谁需要更谨慎',
        paragraphs: [
          '下列情况不应按营销页或本页自行开始使用维生素 D 产品：妊娠或可能妊娠、哺乳、儿童和青少年；已有高钙血症、肾结石或肾脏疾病；正在使用治疗骨质疏松的处方药，或正在使用其他处方药。Cochrane 综述报告维生素 D 或类似物更常伴随高钙血症，维生素 D 加钙还与胃肠道症状和肾脏疾病的小幅增加有关。美国预防服务工作组 2018 年的最终建议也写到，维生素 D 加钙会增加肾结石，它把这一危害的幅度评为小。',
          '这些试验大多不是为妊娠、儿童或已经确诊的骨质疏松治疗而做的。没有在本页看到某种相互作用，不等于不存在。不要因为读到一项试验就停用已开具的药物。D2 商品不能凭本页当成 D3 试验的替代品。',
        ],
      },
      {
        id: 'boundary',
        heading: '明确不能外推的边界',
        paragraphs: [
          '本页不提供用量，不比较品牌，不链接购物车。论文和法规里出现的数量是那一次试验或那一条标签规则的条件，不是给读者的用法。',
          '不能把 VITAL 写成补充维生素 D 预防癌症或心血管病。不能把骨折附属分析写成对骨质疏松患者的治疗结论。不能把 Cochrane 里维生素 D 加钙的小幅减少写成某个鱼油式胶囊或单独维生素 D 已经能够预防骨折。不能把 FDA 的授权声称写成抗衰老或治愈骨质疏松。',
          'NMN / NR 页、EPA / DHA 页和肌酸页用的是别的证据、同一条界限：研究归研究，商品声称归商品声称。这些页面都不提供用法。',
        ],
      },
    ],
    sourcesHeading: '本页依据的公开来源',
    sourcesNote:
      '只列本页实际核对过摘要或机构原文的页面。2024 年的工作组文本是草案，不作为现行最终建议引用其结论。监管状态请复查现行文本。',
    sources: [
      {
        label: 'Manson 等，N Engl J Med，2019（PMID 30415629）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30415629/',
        note: 'VITAL。维生素 D3 与安慰剂比较，侵袭性癌症和主要心血管事件都没有更低的发生率。',
      },
      {
        label: 'LeBoff 等，N Engl J Med，2022（PMID 35939577）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/35939577/',
        note: 'VITAL 骨折附属分析。未按缺乏或骨质疏松入选的中老年成人中，维生素 D3 没有显著降低骨折。',
      },
      {
        label: 'Avenell 等，Cochrane Database Syst Rev，2014（PMID 24729336）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/24729336/',
        note: '系统综述。单独维生素 D 不太可能预防髋部骨折；维生素 D 加钙与较少骨折有关，同时高钙血症等更多。',
      },
      {
        label: 'FDA：达到显著科学共识的授权健康声称',
        href: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/authorized-health-claims-meet-significant-scientific-agreement-ssa-standard',
        note: '列出钙、维生素 D 与骨质疏松。这是标签规则索引，不是对某个商品的治疗认定。',
      },
      {
        label: 'FDA：钙、维生素 D 与骨质疏松声称的小型企业合规指南',
        href: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/small-entity-compliance-guide-health-claims-calcium-and-osteoporosis-and-calcium-vitamin-d-and',
        note: '复述 21 CFR 101.72。授权声称有条件，而且指南本身写明不单独构成可执行义务。',
      },
      {
        label: 'USPSTF 2018 年最终建议：社区居住成人预防骨折',
        href: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/vitamin-d-calcium-or-combined-supplementation-for-the-primary-prevention-of-fractures-in-adults-preventive-medication',
        note: '工作组自己的最终建议。它写明该建议不是美国政府的官方立场。不适用于已有骨质疏松、骨质疏松性骨折、跌倒风险增加或维生素 D 缺乏的人。',
      },
    ],
    relatedHeading: '站内相关页',
    related: [
      { path: '/methodology', label: '证据如何核对与呈现' },
      { path: '/faq', label: '常见问题' },
      { path: '/products/evidence/nmn', label: '另一页成分证据：NMN / NR' },
      { path: '/products/evidence/omega-3', label: '另一页成分证据：EPA 与 DHA' },
      { path: '/products/evidence/creatine', label: '另一页成分证据：肌酸' },
      { path: '/products', label: '产品证据库：购买前如何核对' },
      { path: '/longevity-news/ln-static-2', label: '资讯：怎样给一篇论文分证据档' },
      { path: '/disclaimer', label: '健康与医疗免责声明' },
    ],
  },
  en: {
    kicker: 'Ingredient evidence · education',
    title: 'Vitamin D: human evidence, regulatory wording, and limits',
    updatedLabel: 'Updated',
    lead:
      'This page is about vitamin D. The large trials below used vitamin D3, cholecalciferol. Vitamin D2, ergocalciferol, is a different compound. This page does not treat a D2 product as the same evidence as those D3 trials. It is not a product page, it recommends no brand, and it gives no dose.',
    disclaimer:
      'For education only. It is not medical advice, a diagnosis, treatment, prevention, or a prescription. A trial that found no fewer events, or a review that reported a small reduction, is not proof that a capsule prevents fractures, cancer, cardiovascular disease, or aging. Do not stop a prescribed osteoporosis medicine or another prescription because of this page.',
    sections: [
      {
        id: 'what',
        heading: 'Vitamin D3, vitamin D2, and a label slogan are not one sentence',
        paragraphs: [
          'Vitamin D is a family name. D3 is the form made in skin under ultraviolet light and the form used in the trials cited here. D2 is a different molecule. A serum 25-hydroxyvitamin D result is a laboratory measure. It is not a fracture or a cancer endpoint.',
          '“Bone strength,” “with calcium,” and “anti-aging” on a label are product claims. They are not a trial’s primary endpoint, and they are not a regulator’s finding that the product treats osteoporosis or prevents fractures. This page does not set a sun schedule and does not decide whether one person should be tested.',
        ],
      },
      {
        id: 'evidence',
        heading: 'Human evidence, and where it stops',
        paragraphs: [
          'Manson and colleagues reported the vitamin D comparison in VITAL in 2019 (PMID 30415629), a nationwide randomized, placebo-controlled trial in 25,871 midlife and older adults. The supplement was vitamin D3. Median follow-up was 5.3 years. Primary endpoints were invasive cancer of any type and major cardiovascular events. Supplementation was not associated with a lower risk of either primary endpoint. The paper’s conclusion is that vitamin D did not result in a lower incidence of invasive cancer or cardiovascular events than placebo. That is not a claim that supplements prevent cancer or heart disease.',
          'LeBoff and colleagues reported the fracture ancillary study in 2022 (PMID 35939577). Participants were not recruited for vitamin D deficiency, low bone mass, or osteoporosis. Over a median of 5.3 years, 1,991 fractures were confirmed. Vitamin D3, compared with placebo, did not significantly affect total fractures, nonvertebral fractures, or hip fractures. The paper says supplementation did not result in a significantly lower risk of fractures among generally healthy midlife and older adults who were not selected for those conditions. It is not a treatment trial of people with diagnosed osteoporosis.',
          'Avenell and colleagues’ 2014 Cochrane review (PMID 24729336) included 53 trials and 91,791 postmenopausal women and older men. It compared vitamin D or related compounds, with or without calcium, and fracture outcomes. The review says there is high-quality evidence that vitamin D alone, in the formats tested, is unlikely to prevent hip fracture or any new fracture. Vitamin D plus calcium was associated with a small reduction in hip fracture and with a reduction in any fracture. The same review reported that hypercalcaemia was more common with vitamin D or an analogue, with a small increase in gastrointestinal symptoms and renal disease, and no increase in death. Those are summaries of pooled trials. This page does not turn them into an instruction to take calcium with vitamin D, or into proof that a product prevents fractures.',
          'The three sources do not add up to a slogan. In a general older population, D3 did not lower VITAL’s cancer or cardiovascular primary endpoints, and it did not lower fractures in people not selected for bone disease. Across trials, vitamin D alone was unlikely to prevent hip fracture. Vitamin D plus calcium was linked to fewer fractures in the review and also to more hypercalcaemia and related harms. A laboratory change, a label, and these endpoints are not the same thing.',
        ],
      },
      {
        id: 'regulation',
        heading: 'Regulatory wording is not a treatment finding',
        paragraphs: [
          'Food labeling in the United States: FDA lists calcium and osteoporosis, and calcium plus vitamin D and osteoporosis, among authorized health claims that meet the significant-scientific-agreement standard, under the 2008 final rule and 21 CFR 101.72. An authorized claim is about osteoporosis risk when intake is part of a healthful diet, and only if the rule’s conditions are met. It is not a drug approval, not a fracture claim, and not a finding that a supplement treats osteoporosis. This page does not adopt the regulation’s model sentence as its own conclusion. The FDA pages below are the agency’s text.',
          'The U.S. Preventive Services Task Force final recommendation of 17 April 2018 discusses vitamin D, calcium, or both to prevent fractures in community-dwelling adults. It recommends against vitamin D plus calcium at the lower supplementation level named in that statement for primary prevention of fractures in community-dwelling postmenopausal women, and it finds the evidence insufficient for higher levels and for men and premenopausal women. It does not apply to people with a prior osteoporotic fracture, increased fall risk, osteoporosis, or vitamin D deficiency. The task force states that its recommendations are independent of the U.S. government and are not an official position of the Department of Health and Human Services. A December 2024 draft is not the current final recommendation. This page does not treat the draft as final and does not copy amounts from either document as instructions.',
          'China: this page does not decide whether a given vitamin D product is a drug, a registered health food, or an ordinary food in China. A foreign trial and a U.S. labeling rule are not a Chinese drug license. Current notices from the National Health Commission, SAMR, and the drug regulator, plus that product’s own registration, decide the legal identity. A health food is not a drug and cannot replace drug treatment.',
        ],
      },
      {
        id: 'caution',
        heading: 'Who should be more cautious',
        paragraphs: [
          'Do not start a vitamin D product from a marketing page or from this page in pregnancy or possible pregnancy, lactation, childhood or adolescence, with high blood calcium, kidney stones, or kidney disease, or while taking a prescription medicine for osteoporosis or any other prescription. The Cochrane review reported more hypercalcaemia with vitamin D or an analogue, and a small increase in gastrointestinal symptoms and renal disease with vitamin D plus calcium. The 2018 USPSTF statement says vitamin D plus calcium increases kidney stones and rates that harm as small.',
          'These trials were not, in general, treatment studies of pregnancy, children, or diagnosed osteoporosis. Silence about an interaction is not proof of safety. Do not stop a prescribed medicine because of a paper. A D2 product is not established here as a substitute for the D3 trials.',
        ],
      },
      {
        id: 'boundary',
        heading: 'What must not be extrapolated',
        paragraphs: [
          'This page gives no dose, compares no brands, and does not link to a cart. A number in a paper or a labeling rule is a condition of that trial or that rule. It is not an instruction for a reader.',
          'VITAL is not evidence that vitamin D prevents cancer or cardiovascular disease. The fracture ancillary study is not a treatment result for people with osteoporosis. The Cochrane finding on vitamin D plus calcium is not proof that vitamin D alone, or a named capsule, prevents fractures. FDA’s authorized wording is not an anti-aging claim and not a cure for osteoporosis.',
          'The NMN / NR, EPA / DHA, and creatine pages use other evidence and the same limit: a study is not a product claim. None of these pages gives a dose.',
        ],
      },
    ],
    sourcesHeading: 'Public sources used on this page',
    sourcesNote:
      'Only abstracts or agency pages that were checked are listed. The 2024 task-force text is a draft and is not used here as a final recommendation. Recheck regulators for current status.',
    sources: [
      {
        label: 'Manson et al., N Engl J Med, 2019 (PMID 30415629)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30415629/',
        note: 'VITAL. Vitamin D3 versus placebo did not lower invasive cancer or major cardiovascular events.',
      },
      {
        label: 'LeBoff et al., N Engl J Med, 2022 (PMID 35939577)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/35939577/',
        note: 'VITAL fracture ancillary study. No significant fracture reduction in midlife and older adults not selected for deficiency or osteoporosis.',
      },
      {
        label: 'Avenell et al., Cochrane Database Syst Rev, 2014 (PMID 24729336)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/24729336/',
        note: 'Systematic review. Vitamin D alone was unlikely to prevent hip fracture. Vitamin D plus calcium was associated with fewer fractures and with more hypercalcaemia.',
      },
      {
        label: 'FDA: authorized health claims that meet the significant scientific agreement standard',
        href: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/authorized-health-claims-meet-significant-scientific-agreement-ssa-standard',
        note: 'Lists calcium, vitamin D, and osteoporosis. An index of labeling rules, not a treatment finding for a product.',
      },
      {
        label: 'FDA small-entity compliance guide: calcium, vitamin D, and osteoporosis',
        href: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/small-entity-compliance-guide-health-claims-calcium-and-osteoporosis-and-calcium-vitamin-d-and',
        note: 'Restates 21 CFR 101.72. The authorized claim has conditions, and the guide says it does not itself create enforceable duties.',
      },
      {
        label: 'USPSTF final recommendation, 17 April 2018: fracture prevention in community-dwelling adults',
        href: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/vitamin-d-calcium-or-combined-supplementation-for-the-primary-prevention-of-fractures-in-adults-preventive-medication',
        note: 'The task force’s own final statement. It says the recommendation is not an official U.S. government position. It does not apply to osteoporosis, prior osteoporotic fracture, increased fall risk, or vitamin D deficiency.',
      },
    ],
    relatedHeading: 'On this site',
    related: [
      { path: '/methodology', label: 'How evidence is checked' },
      { path: '/faq', label: 'Questions' },
      { path: '/products/evidence/nmn', label: 'Other ingredient page: NMN / NR' },
      { path: '/products/evidence/omega-3', label: 'Other ingredient page: EPA and DHA' },
      { path: '/products/evidence/creatine', label: 'Other ingredient page: creatine' },
      { path: '/products', label: 'Evidence library: how a claim is checked' },
      { path: '/longevity-news/ln-static-2', label: 'Insight: grading a paper' },
      { path: '/disclaimer', label: 'Health disclaimer' },
    ],
  },
}

export function getVitaminDEvidencePage(lang) {
  const page = lang === 'en' ? PAGES.en : PAGES.zh
  return { ...page, faqs: getVitaminDEvidenceFaqs(lang) }
}
