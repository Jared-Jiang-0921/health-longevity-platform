/**
 * 公开的 EPA / DHA 成分证据页。不是商品详情，不提供用量，也不把研究写成预防或治疗。
 */
import { getOmega3EvidenceFaqs } from './omega3EvidenceMeta.js'

export { OMEGA3_EVIDENCE_PATH, OMEGA3_EVIDENCE_UPDATED } from './omega3EvidenceMeta.js'

const PAGES = {
  zh: {
    kicker: '成分证据 · 教育说明',
    title: 'EPA 与 DHA（Omega-3）：人体证据、监管表述与不能外推的边界',
    updatedLabel: '最近更新',
    lead:
      '这一页只讨论二十碳五烯酸（EPA）和二十二碳六烯酸（DHA）。它们常被称作海洋来源的 Omega-3 脂肪酸，出现在多脂鱼和一些鱼油制剂里。页面区分：一项试验实际报告了什么，一种处方制剂和零售鱼油是不是同一种东西，以及监管机构允许标签怎么写。它不是商品页，不推荐品牌，也不提供用量。',
    disclaimer:
      '仅供健康教育参考，不构成医疗建议、诊断、治疗、预防或处方。某一次试验里事件更少，不能外推成鱼油胶囊已经能够预防心脏病、癌症或衰老。不要按本页停用他汀或其他已开具的药物。妊娠、哺乳、儿童、正在抗凝，以及有心房颤动病史的人，不要按本页自行使用相关产品。',
    sections: [
      {
        id: 'what',
        heading: 'EPA、DHA 和市售鱼油不是同一个说法',
        paragraphs: [
          'EPA 和 DHA 是两种长链脂肪酸。多脂鱼的肉里可以含有它们，胶囊里也可以配成不同比例。高度纯化的 EPA 乙酯是另一类制剂，临床试验里作为药物来研究。羧酸型 EPA 加 DHA 又是一种试验用制剂。这三件事不能互相代替。',
          '广告里的「鱼油」「Omega-3」「护心」通常是商品声称。它不等于某一篇论文的主要终点，也不等于监管机构已经认定该商品能治疗或预防疾病。吃鱼和吞胶囊也不是同一件事，本页不安排饮食。',
        ],
      },
      {
        id: 'evidence',
        heading: '现有人体证据，以及它停在哪里',
        paragraphs: [
          'Bhatt 等人 2019 年报告了 REDUCE-IT（PMID 30415628）。这是一项随机、双盲、安慰剂对照试验，纳入 8179 名已经在使用他汀的人。他们甘油三酯偏高，并有已确诊的心血管疾病，或有糖尿病并伴其他风险因素。约七成是为了减少再次发生的心血管事件而纳入的。随访中位数 4.9 年。与安慰剂相比，使用高度纯化 EPA 乙酯（icosapent ethyl）的一组，缺血事件更少，心血管死亡也更少。同一试验里，这一组因心房颤动或心房扑动住院的比例更高。论文的结果只说明这种药物、在这组已经用药的人里、这一段随访中的差异。它不是零售鱼油胶囊的预防证据，本页也不建议任何人使用该药。',
          'Nicholls 等人 2020 年报告了 STRENGTH（PMID 33190147）。13 078 名正在使用他汀、心血管风险高、并有高甘油三酯和较低高密度脂蛋白胆固醇的人，被随机分到一种羧酸型 EPA 加 DHA，或玉米油。试验因中期分析显示获益可能性低而提前停止。主要复合终点没有显著差异。论文写明：这些结果不支持用这一制剂来减少高风险患者的主要不良心血管事件。胃肠道不良事件在该制剂一组更多。这仍然是那一种试验制剂的结果，不是对所有鱼油商品的鉴定，也不是购买建议。',
          'Manson 等人 2019 年报告了 VITAL（PMID 30415637）。25 871 名美国中老年成人参加这项一级预防试验，比较海洋 n-3 脂肪酸与安慰剂。中位随访 5.3 年。补充没有比安慰剂更少地发生主要心血管事件，也没有比安慰剂更少地发生癌症。这是该项试验自己的主要结论。不能把它改写成「普通人补充就能预防心脏病或癌症」。',
          'Abdelhamid 等人 2020 年的 Cochrane 系统综述（PMID 32114706）纳入 86 项至少持续 12 个月的随机试验。对增加长链 Omega-3 而言，全因死亡几乎没有影响，心血管事件也几乎没有影响，这两项的证据确定性为高。综述同时报告血清甘油三酯下降。甘油三酯是化验指标，不是死亡或心血管事件这些终点。冠心病死亡和冠心病事件上有一点减少的信号，但证据确定性为低。低确定性的信号不能写成商品已经能够预防冠心病。',
          '把上面四份材料放在一起：一种纯化 EPA 药物在一组已经用他汀的高风险人里看到缺血事件更少；另一种 EPA 加 DHA 试验制剂在高风险人里没有看到主要心血管复合终点的差异；一般风险的中老年人补充海洋 n-3 没有降低主要心血管事件或癌症的发生率；跨试验汇总后，死亡和心血管事件几乎没有减少。任何一条都不能单独变成「鱼油有效」或「鱼油无效所以人人不该吃鱼」。',
        ],
      },
      {
        id: 'regulation',
        heading: '监管表述：合格声称不是疗效认定',
        paragraphs: [
          '美国：FDA 2019 年 6 月 19 日的 constituent update 是机构自己的说明。它写道，现有证据没有达到授权健康声称所要求的「显著科学共识」，只达到合格健康声称所用的「可信证据」标准；关于血压和冠心病，证据不一致、没有定论。FDA 表示，在标签同时写明这一限度、并且符合其执法裁量信里的条件时，不打算反对某些限定措辞。这不是药品批准，也不是认定某个胶囊能够治疗或预防疾病。本页不采用那些限定措辞作为自己的结论。原文见下面的 FDA 链接，不是转述。',
          '中国：本页不判断某一个鱼油或 EPA/DHA 商品在中国是药品、注册保健食品还是普通食品。国外试验、美国的合格声称、以及商品页上的「护心」用语，都不是中国的药品许可。是否获准、声称是否越界，以国家卫生健康委、市场监管总局和国家药监局的现行公告以及该商品自己的注册或备案信息为准。保健食品不是药物，不能代替药物治疗疾病。',
        ],
      },
      {
        id: 'caution',
        heading: '谁需要更谨慎',
        paragraphs: [
          '下列情况不应按营销页或本页自行开始使用含 EPA 或 DHA 的产品：妊娠或可能妊娠、哺乳、儿童和青少年；正在使用抗凝药或抗血小板药，或有出血倾向；已有心房颤动或心房扑动，或正在因为心律问题就医；即将手术；已经在使用他汀或其他处方药。REDUCE-IT 报告那种 EPA 乙酯增加了心房颤动或扑动的住院，这不能自动套到每一种鱼油上，但也说明不该把「鱼油很安全」当成已经证明的话。',
          '公开试验没有把药物相互作用研究完。没有看到某一种相互作用的报道，不等于不存在。不要因为读到一项试验就停用他汀、抗凝药或其他已开具的药物。许多 EPA/DHA 制剂来自鱼；对鱼或甲壳类过敏的人不能凭本页判断某种产品是否安全。',
        ],
      },
      {
        id: 'boundary',
        heading: '明确不能外推的边界',
        paragraphs: [
          '本页不提供用量，不比较品牌，不链接购物车。论文里的用量是那一次试验的设计，不是给读者的用法。标签上的「每份若干」也不是本页的建议。',
          '不能把 REDUCE-IT 写成零售鱼油预防心肌梗死或中风。不能把甘油三酯下降写成已经减少死亡。不能把 VITAL 或 STRENGTH 的主要结果改成相反的广告句。不能把 FDA 的合格声称写成本站认为可以预防高血压或冠心病。不能写成抗衰老。',
          'NMN / NR 那一页用的是另一套证据和同一条界限：研究归研究，商品声称归商品声称。两页都不提供用法。',
        ],
      },
    ],
    sourcesHeading: '本页依据的公开来源',
    sourcesNote:
      '只列本页实际使用、并且核对过摘要或机构原文的页面。没有把未读过的试验写进来。监管状态请复查主管部门现行文本。',
    sources: [
      {
        label: 'Bhatt 等，N Engl J Med，2019（PMID 30415628）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30415628/',
        note: 'REDUCE-IT。纯化 EPA 乙酯，已用他汀且甘油三酯偏高的高风险成人。缺血事件更少，心房颤动或扑动住院更多。',
      },
      {
        label: 'Nicholls 等，JAMA，2020（PMID 33190147）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/33190147/',
        note: 'STRENGTH。羧酸型 EPA 加 DHA 与玉米油比较，主要心血管复合终点没有显著差异，试验提前停止。',
      },
      {
        label: 'Manson 等，N Engl J Med，2019（PMID 30415637）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30415637/',
        note: 'VITAL。一级预防人群中，海洋 n-3 没有降低主要心血管事件或癌症的发生率。',
      },
      {
        label: 'Abdelhamid 等，Cochrane Database Syst Rev，2020（PMID 32114706）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/32114706/',
        note: '系统综述。全因死亡和心血管事件几乎没有影响（高确定性）；甘油三酯下降不等于这些终点改善。',
      },
      {
        label: 'FDA：EPA 与 DHA 合格健康声称的 constituent update（2019-06-19）',
        href: 'https://www.fda.gov/food/fda-updates-food/fda-announces-new-qualified-health-claims-epa-and-dha-omega-3-consumption-and-risk-hypertension-and',
        note: 'FDA 自己的说明。证据未达授权健康声称的标准，且被写为不一致、没有定论。不是药品批准。',
      },
    ],
    relatedHeading: '站内相关页',
    related: [
      { path: '/methodology', label: '证据如何核对与呈现' },
      { path: '/faq', label: '常见问题' },
      { path: '/products/evidence/nmn', label: '另一页成分证据：NMN / NR' },
      { path: '/products', label: '产品证据库：购买前如何核对' },
      { path: '/longevity-news/ln-static-2', label: '资讯：怎样给一篇论文分证据档' },
      { path: '/disclaimer', label: '健康与医疗免责声明' },
    ],
  },
  en: {
    kicker: 'Ingredient evidence · education',
    title: 'EPA and DHA (omega-3): human evidence, regulatory wording, and limits',
    updatedLabel: 'Updated',
    lead:
      'This page is only about eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA), the marine omega-3 fatty acids found in oily fish and in some fish-oil preparations. It separates what a trial reported, whether a prescription preparation is the same thing as a retail fish oil, and what a regulator allows a label to say. It is not a product page, it recommends no brand, and it gives no dose.',
    disclaimer:
      'For education only. It is not medical advice, a diagnosis, treatment, prevention, or a prescription. Fewer events in one trial are not proof that a fish-oil capsule prevents heart disease, cancer, or aging. Do not stop a statin or another prescribed medicine because of this page. Pregnancy, lactation, children, anticoagulation, and a history of atrial fibrillation are not situations to start a product from this page.',
    sections: [
      {
        id: 'what',
        heading: 'EPA, DHA, and a retail fish oil are not one phrase',
        paragraphs: [
          'EPA and DHA are two long-chain fatty acids. Oily fish can contain them. Capsules can mix them in different proportions. A highly purified EPA ethyl ester is a different preparation, studied as a drug. A carboxylic-acid mix of EPA plus DHA is another investigational preparation. These are not interchangeable.',
          '“Fish oil,” “omega-3,” and “heart health” on a label are product claims. They are not a trial’s primary endpoint, and they are not a finding that the product treats or prevents disease. Eating fish and swallowing a capsule are not the same act. This page does not prescribe a diet.',
        ],
      },
      {
        id: 'evidence',
        heading: 'Human evidence, and where it stops',
        paragraphs: [
          'Bhatt and colleagues reported REDUCE-IT in 2019 (PMID 30415628), a randomized, double-blind, placebo-controlled trial in 8,179 people already taking a statin. Triglycerides were elevated, and participants had established cardiovascular disease or diabetes plus other risk factors. About 70 percent were enrolled for secondary prevention. Median follow-up was 4.9 years. Ischemic events, including cardiovascular death, were lower with a highly purified EPA ethyl ester (icosapent ethyl) than with placebo. Hospitalization for atrial fibrillation or flutter was higher in that group. The result is about that drug, in those medicated people, over that follow-up. It is not evidence that a retail fish-oil capsule prevents disease, and this page does not recommend the drug.',
          'Nicholls and colleagues reported STRENGTH in 2020 (PMID 33190147). 13,078 statin-treated people at high cardiovascular risk, with high triglycerides and low HDL cholesterol, were randomized to a carboxylic-acid EPA plus DHA or to corn oil. The trial stopped early after an interim analysis showed a low probability of benefit. The primary cardiovascular composite did not differ significantly. The paper says the findings do not support using this formulation to reduce major adverse cardiovascular events in high-risk patients. Gastrointestinal adverse events were more common with the omega-3 preparation. That is a result for that formulation, not a verdict on every fish-oil product, and not a buying instruction.',
          'Manson and colleagues reported VITAL in 2019 (PMID 30415637). 25,871 older adults in the United States were in this primary-prevention trial of marine n-3 fatty acids versus placebo. Median follow-up was 5.3 years. Supplementation did not result in a lower incidence of major cardiovascular events or of cancer than placebo. That is the trial’s own primary conclusion. It is not a claim that supplements prevent heart disease or cancer in the general population.',
          'Abdelhamid and colleagues’ 2020 Cochrane review (PMID 32114706) included 86 randomized trials lasting at least 12 months. For long-chain omega-3, it found little or no effect on all-cause mortality and little or no effect on cardiovascular events, both with high-certainty evidence. The review also reported lower serum triglycerides. A triglyceride change is a laboratory result, not fewer deaths. A small signal for coronary deaths and coronary events was low-certainty evidence. Low-certainty evidence is not a product claim that coronary disease has been prevented.',
          'Read together: one purified EPA drug showed fewer ischemic events in a statin-treated, high-risk group; another EPA-plus-DHA formulation showed no difference on the primary cardiovascular composite in a high-risk group; marine n-3 supplements did not lower major cardiovascular events or cancer in a primary-prevention population; and the pooled trials show little or no reduction in deaths or cardiovascular events. None of these sentences becomes “fish oil works” or “nobody should eat fish.”',
        ],
      },
      {
        id: 'regulation',
        heading: 'Regulatory wording is not an efficacy finding',
        paragraphs: [
          'United States: the FDA constituent update of 19 June 2019 is the agency’s own text. It says the evidence did not meet the significant-scientific-agreement standard for an authorized health claim, and met only the credible-evidence standard for a qualified claim. On blood pressure and coronary heart disease, FDA called the evidence inconsistent and inconclusive. FDA said it did not intend to object to certain qualified label wording when the label also states that limit and matches the factors in the enforcement-discretion letter. That is not a drug approval, and it is not a finding that a capsule treats or prevents disease. This page does not adopt that wording as its own conclusion. The link below is the FDA page, not a retelling.',
          'China: this page does not decide whether a given fish-oil or EPA/DHA product is a drug, a registered health food, or an ordinary food in China. A foreign trial, a U.S. qualified claim, and a “heart” slogan are not a Chinese drug license. Current notices from the National Health Commission, SAMR, and the drug regulator, plus that product’s own registration, are what decide the legal identity. A health food is not a drug and cannot replace drug treatment.',
        ],
      },
      {
        id: 'caution',
        heading: 'Who should be more cautious',
        paragraphs: [
          'Do not start an EPA or DHA product from a marketing page or from this page in pregnancy or possible pregnancy, lactation, childhood or adolescence, while taking an anticoagulant or antiplatelet drug, with a bleeding tendency, with atrial fibrillation or flutter, before surgery, or while taking a statin or another prescription medicine. REDUCE-IT reported more hospitalizations for atrial fibrillation or flutter with that EPA ethyl ester. That does not transfer automatically to every fish oil, and it does mean “fish oil is safe” is not an established sentence.',
          'The trials cited here do not finish the question of drug interactions. Silence is not proof of safety. Do not stop a statin, an anticoagulant, or another prescribed medicine because of a trial. Many EPA/DHA preparations come from fish. This page cannot tell someone with a fish or shellfish allergy whether a product is safe.',
        ],
      },
      {
        id: 'boundary',
        heading: 'What must not be extrapolated',
        paragraphs: [
          'This page gives no dose, compares no brands, and does not link to a cart. A dose in a paper belongs to that trial. A “per serving” line on a label is not advice from this page.',
          'REDUCE-IT is not evidence that a retail fish oil prevents myocardial infarction or stroke. A lower triglyceride is not fewer deaths. The primary results of VITAL and STRENGTH are not advertising copy with the sign flipped. FDA’s qualified wording is not this site’s conclusion that hypertension or coronary disease is prevented. There is no anti-aging claim.',
          'The NMN / NR page uses different evidence and the same limit: a study is not a product claim. Neither page gives a dose.',
        ],
      },
    ],
    sourcesHeading: 'Public sources used on this page',
    sourcesNote:
      'Only pages whose abstracts or agency text were checked are listed. Trials that were not read are not included. Recheck regulators for current status.',
    sources: [
      {
        label: 'Bhatt et al., N Engl J Med, 2019 (PMID 30415628)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30415628/',
        note: 'REDUCE-IT. Purified EPA ethyl ester in statin-treated adults with elevated triglycerides and high risk. Fewer ischemic events; more atrial fibrillation or flutter hospitalizations.',
      },
      {
        label: 'Nicholls et al., JAMA, 2020 (PMID 33190147)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/33190147/',
        note: 'STRENGTH. EPA plus DHA carboxylic acid versus corn oil. No significant difference on the primary cardiovascular composite; trial stopped early.',
      },
      {
        label: 'Manson et al., N Engl J Med, 2019 (PMID 30415637)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30415637/',
        note: 'VITAL. In primary prevention, marine n-3 fatty acids did not lower major cardiovascular events or cancer.',
      },
      {
        label: 'Abdelhamid et al., Cochrane Database Syst Rev, 2020 (PMID 32114706)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/32114706/',
        note: 'Systematic review. Little or no effect on all-cause mortality and cardiovascular events (high certainty). A triglyceride change is not those endpoints.',
      },
      {
        label: 'FDA constituent update on EPA and DHA qualified health claims (19 June 2019)',
        href: 'https://www.fda.gov/food/fda-updates-food/fda-announces-new-qualified-health-claims-epa-and-dha-omega-3-consumption-and-risk-hypertension-and',
        note: 'FDA’s own update. Evidence did not meet the authorized-claim standard and was called inconsistent and inconclusive. Not a drug approval.',
      },
    ],
    relatedHeading: 'On this site',
    related: [
      { path: '/methodology', label: 'How evidence is checked' },
      { path: '/faq', label: 'Questions' },
      { path: '/products/evidence/nmn', label: 'Other ingredient page: NMN / NR' },
      { path: '/products', label: 'Evidence library: how a claim is checked' },
      { path: '/longevity-news/ln-static-2', label: 'Insight: grading a paper' },
      { path: '/disclaimer', label: 'Health disclaimer' },
    ],
  },
}

export function getOmega3EvidencePage(lang) {
  const page = lang === 'en' ? PAGES.en : PAGES.zh
  return { ...page, faqs: getOmega3EvidenceFaqs(lang) }
}
