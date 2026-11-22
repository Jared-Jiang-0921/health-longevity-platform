/**
 * 公开的 NMN / NR 成分证据页。不是商品详情，不提供用量，也不把研究写成治疗结论。
 * 预渲染和站内页面共用这里的句子。
 */
import { getNmnEvidenceFaqs } from './nmnEvidenceMeta.js'

export { NMN_EVIDENCE_PATH, NMN_EVIDENCE_UPDATED } from './nmnEvidenceMeta.js'

const PAGES = {
  zh: {
    kicker: '成分证据 · 教育说明',
    title: 'NMN 与 NR：人体证据、监管状态与不能外推的边界',
    updatedLabel: '最近更新',
    lead:
      '这一页只讨论烟酰胺单核苷酸（nicotinamide mononucleotide，NMN）和烟酰胺核糖（nicotinamide riboside，NR）作为成分时，公开文献和监管文件能说明什么、不能说明什么。它不是商品页，不推荐品牌，也不提供用量。',
    disclaimer:
      '仅供健康教育与生活方式参考，不构成医疗建议、诊断、治疗或处方，也不能替代执业医师的判断。血检或研究终点的变化，不能外推成疾病治疗、预防，或“抗衰老”已经成立。妊娠、哺乳、儿童、正在接受肿瘤治疗、肝肾疾病，以及正在使用处方药的人，不要按本页自行使用相关产品。',
    sections: [
      {
        id: 'what',
        heading: 'NMN、NR 和 NAD+ 分别是什么',
        paragraphs: [
          'NMN 和 NR 是与维生素 B3（烟酸、烟酰胺这一族）相关的小分子。研究文献把它们称作 NAD+ 生物合成路径上的前体。NAD+（烟酰胺腺嘌呤二核苷酸）是细胞里的一种辅酶，参与氧化还原反应，也是一些酶的底物。',
          '“与 NAD+ 的生成有关”只是生物化学上的归类。它不等于补充 NMN 或 NR 已经能够治疗某种病，也不等于能够延长人的健康寿命。动物或细胞实验里看到的变化，不能直接当成人体疗效。',
          '商业页面常用“提升 NAD+”“抗衰老”来描述这些成分。本页不采用这种疗效说法。下面只区分：标志物有没有变化，以及这种变化有没有被证明等于临床受益。',
        ],
      },
      {
        id: 'evidence',
        heading: '现有人体证据，以及它的限度',
        paragraphs: [
          '人体研究目前主要是小样本、随访数周到数月的随机试验，对象多为相对健康的中老年人。比较常见的测量是血液里 NAD+ 或相关代谢物。标志物上升，只说明这条路径在该次试验的人群和时间内被测到了变化。',
          'NR 方面，Martens 等人 2018 年发表的随机、双盲、安慰剂对照交叉试验，在健康的中老年成人中观察了两个各约六周的阶段。论文报告 NR 可以耐受，并且 NAD+ 代谢指标上升。作者建议以后的试验再看血压和动脉僵硬度。这是对后续研究的建议，不是已经证明 NR 能治疗心血管疾病。',
          'NMN 方面，Yi 等人 2023 年报告了一项 60 天、80 名健康中年成人的随机、双盲、安慰剂对照试验。与安慰剂相比，血液 NAD 更高，六分钟步行距离也有差异；胰岛素抵抗指标 HOMA-IR 没有明显差异。试验本身对安全性监测的描述限于这组健康成人、这段时间。一次短期试验不能证明长期安全，也不能证明可以治疗疾病。本页不转述该试验使用的具体用量。',
          'Chen 等人 2024 年的系统综述和荟萃分析纳入 8 项 NMN 随机对照试验、共 342 名中老年成人，多数没有糖尿病。合并之后，空腹血糖、空腹胰岛素、糖化血红蛋白、HOMA-IR 和血脂指标都没有显示出显著获益。试验数量少、时间短，所以“没有看到显著获益”也不是对所有人群、所有终点的最终否定，只是现有血糖和血脂证据并不支持把 NMN 说成已经改善了这些指标。',
          'Song 等人 2023 年的综述写明：NMN 的大部分研究仍在细胞或动物模型里，人体补充的安全性和生理影响仍是未完成的问题。那篇综述的英文标题使用了 antiaging（抗衰老）一词。标题用词不是临床结论，本页不把它当成疗效。',
          '临床试验注册库可以核对一项试验是否存在、主要终点是什么、有没有结果摘要。注册本身不是疗效证据。本站更短的一条说明见前沿医学资讯《NMN / NR 与「补 NAD+」叙事：证据缺口清单》。',
        ],
      },
      {
        id: 'regulation',
        heading: '监管信息：许可身份会变，疗效认定不会跟着广告一起变',
        paragraphs: [
          '中国：市场监管总局 2021 年 7 月 5 日对十三届全国人大四次会议第 1067 号建议的答复（公开页发布于 2021 年 12 月 30 日）写明，当时 NMN 尚未获得新食品原料、食品添加剂、保健食品和药品许可，不能作为食品和药品进行生产经营；作为保健食品原料的条件也不成熟。这是那份答复里的原意。此后有没有新的许可，以国家卫生健康委、市场监管总局和国家药监局的现行公告为准。申请被受理、化妆品原料备案，或在跨境页面上架，都不等于口服产品已经获准作为保健食品或药品，更不等于可以治疗疾病。',
          '美国：2022 年，FDA 曾告知部分新膳食成分申报人，认为 NMN 因已被作为新药研究，而被排除在膳食补充剂定义之外。美国天然产品协会 2025 年 12 月的说明转述了 FDA 日期为 2025 年 9 月 29 日的信件：该机构改变这一解释，不再把 NMN 排除出膳食补充剂定义，同时仍把它视为新膳食成分，上市前通常需要新膳食成分通报。这是行业协会对信件的转述，不是 FDA 网站上的原文，也不能代替阅读信件本身。无论身份如何变化，膳食补充剂都不是药品；成分可以合法讨论，不等于任何产品被认定能够诊断、治疗、治愈或预防疾病。',
          '不同国家的食品、补充剂、化妆品和药品规则不能互相替代。本页不判断某一个品牌、某一个销售链接是否合法，也不把境外补充剂身份写成中国境内的许可。',
        ],
      },
      {
        id: 'caution',
        heading: '谁需要更谨慎，以及相互作用',
        paragraphs: [
          '本页没有足够的人体证据去判断下列情况是否适合使用含 NMN 或 NR 的产品，因此这些人群不应按营销页或本页自行开始使用：妊娠或可能妊娠、哺乳、儿童和青少年；正在接受肿瘤治疗或有尚未稳定的恶性肿瘤；肝脏或肾脏疾病；即将手术；已经在使用处方药，尤其是与代谢、血压或肿瘤相关的药物。',
          '公开试验几乎没有回答药物相互作用。没有看到某一种相互作用的报道，不等于不存在。不要因为读到 NAD+ 或“抗衰老”的介绍就停用医生已经开具的药物。烟酸类物质在部分人可以引起潮红等反应；NMN、NR 与烟酸不是同一种产品，不能互相套用耐受性。同时使用多种声称“补充 NAD+”的产品，也没有在本页引用的试验里被当作安全组合来研究。',
        ],
      },
      {
        id: 'boundary',
        heading: '明确不能外推的边界',
        paragraphs: [
          '本页不提供用量，不比较品牌，不链接购物车。研究论文里出现的用量是那一次试验的设计，不是给读者的用法。',
          '不能从细胞、动物或一项短期人体试验，外推出治疗糖尿病、心血管疾病、神经退行性疾病，或减慢、逆转衰老。不能把血液 NAD+ 升高写成健康寿命已经延长。不能把步行距离、问卷分数或生物年龄计算器的变化，写成疾病结局已经改善。',
          '保健食品不是药物，不能代替药物治疗疾病。普通食品、化妆品原料和膳食补充剂也都不是治疗方案。',
        ],
      },
    ],
    sourcesHeading: '本页依据的公开来源',
    sourcesNote:
      '只列本页实际使用的页面。写作时用 “nicotinamide riboside OR nicotinamide mononucleotide” 检索 Cochrane 系统评价，没有得到可引用的综述，因此这里不写 Cochrane 结论。监管状态请复查主管部门现行文本。',
    sources: [
      {
        label: 'Song 等，Adv Nutr，2023（PMID 37619764）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/37619764/',
        note: '综述。指出多数 NMN 研究仍在细胞或动物模型，人体安全性和生理影响仍未完成。',
      },
      {
        label: 'Chen 等，Curr Diab Rep，2024（PMID 39531138）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/39531138/',
        note: '8 项随机对照试验的系统综述和荟萃分析。血糖和血脂指标没有显著获益。',
      },
      {
        label: 'Yi 等，GeroScience，2023（PMID 36482258）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/36482258/',
        note: '80 名健康中年成人、60 天。血液 NAD 与步行距离有组间差异，HOMA-IR 没有。',
      },
      {
        label: 'Martens 等，Nat Commun，2018（PMID 29599478）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/29599478/',
        note: '健康中老年成人的 NR 交叉试验。报告耐受和 NAD+ 代谢变化，并建议以后再研究心血管指标。',
      },
      {
        label: 'ClinicalTrials.gov：NMN 或 nicotinamide riboside',
        href: 'https://clinicaltrials.gov/search?term=NMN%20OR%20nicotinamide%20riboside',
        note: '试验注册检索。注册不是结果，也不是疗效。',
      },
      {
        label: '市场监管总局对第 1067 号建议的答复',
        href: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/tssps/art/2023/art_9da176b2f8244a00a239996f863470e1.html',
        note: '2021 年答复当时的许可状态。以后的公告以主管部门现行页面为准。',
      },
      {
        label: '美国天然产品协会对 FDA 2025 年 9 月 29 日信件的转述',
        href: 'https://www.npanational.org/news/fda-reinstates-nmn-as-dietary-supplement-after-npa-lawsuit/',
        note: '行业组织的转述，不是 FDA 原文。膳食补充剂的一般说明见 FDA。',
      },
      {
        label: 'FDA：膳食补充剂',
        href: 'https://www.fda.gov/food/dietary-supplements',
        note: '补充剂不是药品。本链接不是前述信件的原文。',
      },
    ],
    relatedHeading: '站内相关页',
    related: [
      { path: '/longevity-news/ln-static-3', label: '更短的说明：NMN / NR 与「补 NAD+」叙事' },
      { path: '/products/evidence/creatine', label: '另一页成分证据：肌酸' },
      { path: '/products/evidence/magnesium', label: '另一页成分证据：镁' },
      { path: '/products', label: '产品证据库：购买前如何核对证据' },
      { path: '/disclaimer', label: '健康与医疗免责声明' },
    ],
  },
  en: {
    kicker: 'Ingredient evidence · education',
    title: 'NMN and NR: human evidence, regulation, and limits on extrapolation',
    updatedLabel: 'Updated',
    lead:
      'This page describes what public studies and regulatory texts can and cannot say about nicotinamide mononucleotide (NMN) and nicotinamide riboside (NR) as ingredients. It is not a product page, it recommends no brand, and it gives no dose.',
    disclaimer:
      'For education and lifestyle reference only. It is not medical advice, a diagnosis, a treatment, or a prescription, and it does not replace a clinician. A change in a lab marker or a study endpoint is not treatment, prevention, or proof of an anti-aging effect. Pregnancy, lactation, children, cancer treatment, liver or kidney disease, and people taking prescription medicines should not start a product from this page.',
    sections: [
      {
        id: 'what',
        heading: 'What NMN, NR, and NAD+ refer to',
        paragraphs: [
          'NMN and NR are small molecules related to vitamin B3 (the niacin and nicotinamide family). Papers describe them as precursors on a pathway that makes NAD+ (nicotinamide adenine dinucleotide), a coenzyme used in redox reactions and as a substrate for some enzymes.',
          'A place in NAD+ biochemistry is not evidence that taking NMN or NR treats a disease or lengthens healthy human life. Findings in cells or animals are not human efficacy.',
          'Marketing often says “NAD+ boost” or “anti-aging.” This page does not use those phrases as claims. It separates a change in a measured marker from proof of clinical benefit.',
        ],
      },
      {
        id: 'evidence',
        heading: 'Human evidence, and how far it goes',
        paragraphs: [
          'Human studies so far are mostly small randomized trials lasting weeks to a few months, often in relatively healthy middle-aged and older adults. A frequent measurement is NAD+ or a related metabolite in blood. A higher marker means that pathway changed in that group and that time window.',
          'For NR, Martens and colleagues reported a randomized, double-blind, placebo-controlled crossover trial in healthy middle-aged and older adults, with two periods of about six weeks (2018). The paper says NR was tolerated and that markers of NAD+ metabolism rose. The authors said later trials should look at blood pressure and arterial stiffness. That is a proposal for future work, not evidence that NR treats cardiovascular disease.',
          'For NMN, Yi and colleagues reported a 60-day randomized, double-blind, placebo-controlled trial in 80 healthy middle-aged adults (2023). Blood NAD was higher than placebo, and six-minute walk distance also differed. HOMA-IR, a measure of insulin resistance, did not. The trial’s own safety description is limited to that healthy group and that duration. One short trial does not show long-term safety or treatment of disease. This page does not repeat the doses used.',
          'Chen and colleagues (2024) pooled 8 NMN randomized trials in 342 middle-aged or older adults, most without diabetes. Fasting glucose, fasting insulin, HbA1c, HOMA-IR, and the lipid profile did not show a significant benefit. Few and short trials mean this is not a final answer for every group or endpoint. It does mean current glucose and lipid evidence does not support a claim that NMN has already improved those markers.',
          'A 2023 review by Song and colleagues states that most NMN research is still in cells or animals, and that human safety and physiological effects remain unfinished questions. The review title uses the word “antiaging.” A title is not a clinical result, and this page does not treat it as one.',
          'A trial registry can show whether a study exists, what the primary endpoint is, and whether a results summary has been posted. Registration is not evidence of benefit. A shorter note on this site is the insight card “NMN, NR, and the NAD+ boost story.”',
        ],
      },
      {
        id: 'regulation',
        heading: 'Regulation: market status can change; advertising does not create efficacy',
        paragraphs: [
          'China: On 5 July 2021 the State Administration for Market Regulation replied to proposal No. 1067 of the National People’s Congress (the public copy is dated 30 December 2021). The reply said that, at that time, NMN had not been approved as a new food ingredient, a food additive, a health food, or a drug, and could not be manufactured or sold as food or as a drug. It also said NMN was not ready to be listed as a health-food ingredient. Later approvals, if any, are whatever the National Health Commission, SAMR, and the drug regulator publish now. Acceptance of an application, a cosmetic-ingredient filing, or a cross-border listing is not approval of an oral health food or a drug, and it is not permission to treat disease.',
          'United States: In 2022, FDA told some new-dietary-ingredient notifiers that NMN was excluded from the dietary-supplement definition because it was under investigation as a drug. In December 2025 the Natural Products Association described FDA letters dated 29 September 2025 that reversed that exclusion, while still treating NMN as a new dietary ingredient that generally needs a premarket notification. That account is an industry association’s description of the letters, not the text on FDA’s site, and it is not a substitute for reading the letters. A change in ingredient status is not a finding that any product diagnoses, treats, cures, or prevents disease. Dietary supplements are not drugs.',
          'Food, supplement, cosmetic, and drug rules do not travel from one country to another. This page does not decide whether a brand or a sales link is lawful, and it does not treat a foreign supplement status as a Chinese approval.',
        ],
      },
      {
        id: 'caution',
        heading: 'Who should be cautious, and interactions',
        paragraphs: [
          'This page does not have human evidence that would let a reader decide the following situations are suitable for an NMN or NR product. People in these groups should not start one from a marketing page or from this page: pregnancy or possible pregnancy, lactation, children and adolescents, current cancer treatment or an unstable cancer, liver or kidney disease, upcoming surgery, and people already taking prescription medicines, especially for metabolism, blood pressure, or cancer.',
          'The trials cited here do not answer drug interactions. Absence of a published interaction is not proof of safety. Do not stop a prescribed medicine because of an NAD+ or “anti-aging” claim. Niacin can cause flushing in some people; NMN and NR are not the same substance, and tolerability does not transfer. Combinations of products that all claim to raise NAD+ were not studied as a safe stack in the trials cited here.',
        ],
      },
      {
        id: 'boundary',
        heading: 'What must not be extrapolated',
        paragraphs: [
          'This page gives no dose, compares no brands, and does not link to a cart. A dose printed in a paper belongs to that trial. It is not an instruction for a reader.',
          'Cell, animal, or single short human studies do not establish treatment of diabetes, cardiovascular disease, or neurodegenerative disease, and they do not show that aging has been slowed or reversed. A higher blood NAD+ is not a longer healthy life. A walk test, a questionnaire, or a biological-age calculator is not a disease outcome.',
          'Health foods are not drugs and cannot replace drug treatment. Ordinary foods, cosmetic ingredients, and dietary supplements are not treatment plans either.',
        ],
      },
    ],
    sourcesHeading: 'Public sources used on this page',
    sourcesNote:
      'Only pages this text actually uses are listed. A search of Cochrane reviews for “nicotinamide riboside OR nicotinamide mononucleotide” returned none to cite, so this page states no Cochrane conclusion. Recheck regulators for current status.',
    sources: [
      {
        label: 'Song et al., Adv Nutr, 2023 (PMID 37619764)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/37619764/',
        note: 'Review. Most NMN work was still preclinical; human safety and physiological effects were unfinished.',
      },
      {
        label: 'Chen et al., Curr Diab Rep, 2024 (PMID 39531138)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/39531138/',
        note: 'Systematic review and meta-analysis of 8 randomized trials. No significant glucose or lipid benefit.',
      },
      {
        label: 'Yi et al., GeroScience, 2023 (PMID 36482258)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/36482258/',
        note: '80 healthy middle-aged adults, 60 days. Blood NAD and walk distance differed from placebo; HOMA-IR did not.',
      },
      {
        label: 'Martens et al., Nat Commun, 2018 (PMID 29599478)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/29599478/',
        note: 'NR crossover trial in healthy middle-aged and older adults. Tolerability and NAD+ metabolism; later trials suggested for cardiovascular measures.',
      },
      {
        label: 'ClinicalTrials.gov search: NMN or nicotinamide riboside',
        href: 'https://clinicaltrials.gov/search?term=NMN%20OR%20nicotinamide%20riboside',
        note: 'Registry search. A listing is not a result and not evidence of benefit.',
      },
      {
        label: 'SAMR reply to proposal No. 1067',
        href: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/tssps/art/2023/art_9da176b2f8244a00a239996f863470e1.html',
        note: 'The 2021 reply’s status at that time. Later notices are whatever the agencies publish now.',
      },
      {
        label: 'Natural Products Association note on FDA letters dated 29 September 2025',
        href: 'https://www.npanational.org/news/fda-reinstates-nmn-as-dietary-supplement-after-npa-lawsuit/',
        note: 'An industry association’s account, not the FDA original. General supplement information is on FDA’s site.',
      },
      {
        label: 'FDA: dietary supplements',
        href: 'https://www.fda.gov/food/dietary-supplements',
        note: 'Supplements are not drugs. This link is not the text of the letters above.',
      },
    ],
    relatedHeading: 'On this site',
    related: [
      { path: '/longevity-news/ln-static-3', label: 'Shorter note: NMN, NR, and the NAD+ story' },
      { path: '/products/evidence/creatine', label: 'Other ingredient page: creatine' },
      { path: '/products/evidence/magnesium', label: 'Other ingredient page: magnesium' },
      { path: '/products', label: 'Evidence library: how claims are checked' },
      { path: '/disclaimer', label: 'Health disclaimer' },
    ],
  },
}

export function getNmnEvidencePage(lang) {
  const page = lang === 'en' ? PAGES.en : PAGES.zh
  return { ...page, faqs: getNmnEvidenceFaqs(lang) }
}
