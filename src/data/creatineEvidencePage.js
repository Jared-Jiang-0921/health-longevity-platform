/**
 * 公开的肌酸成分证据页。不是商品详情，不提供用量，也不把研究写成预防、治疗或运动表现保证。
 */
import { getCreatineEvidenceFaqs } from './creatineEvidenceMeta.js'

export { CREATINE_EVIDENCE_PATH, CREATINE_EVIDENCE_UPDATED } from './creatineEvidenceMeta.js'

const PAGES = {
  zh: {
    kicker: '成分证据 · 教育说明',
    title: '肌酸：人体证据、监管表述与不能外推的边界',
    updatedLabel: '最近更新',
    lead:
      '这一页讨论肌酸，重点是试验和监管文件里写明的一水肌酸（creatine monohydrate）。盐酸肌酸、肌酸乙酯、缓冲肌酸和其他商品名是不同的说法。本页不把那些商品当成下面这些试验的同等证据。它不是商品页，不推荐品牌，也不提供用量。',
    disclaimer:
      '仅供健康教育参考，不构成医疗建议、诊断、治疗、预防或处方。抗阻训练试验里的组间差值、一篇有争议的记忆力综述、或一份食品标签许可，都不能外推成某个胶囊已经能够增肌、提高运动表现、治疗帕金森病或肌病，或减慢衰老。不要按本页停用已经开具的药物。',
    sections: [
      {
        id: 'what',
        heading: '一水肌酸、其他商品形式和广告句不是同一句话',
        paragraphs: [
          '肌酸是肌肉和其他组织里参与能量转移的一种化合物。人体可以自己合成，肉和鱼里也有。磷酸肌酸是它在细胞内的储存形式。血液或肌肉里这种物质的变化是化验或研究指标，不是力量、骨折、记忆或疾病这些终点。',
          '标签上的「增肌」「爆发力」「抗衰老」「护脑」是商品声称。它不等于一项试验的主要终点，也不等于监管机构认定该商品能治疗疾病或保证运动表现。本页不安排训练计划，也不判断一个人要不要检测血肌酐。',
        ],
      },
      {
        id: 'evidence',
        heading: '现有人体证据，以及它停在哪里',
        paragraphs: [
          'Chilibeck 等人 2017 年的系统综述和荟萃分析（PMID 29138605）纳入 22 项随机对照试验、721 名男性和女性。各项研究的平均年龄在 57 至 70 岁。比较的是抗阻训练期间补充肌酸或安慰剂。训练大约每周 2 至 3 天，持续 7 至 52 周。综述报告，肌酸一组的瘦组织增加更多，合并均数差为 1.37 kg（95% 置信区间 0.97 至 1.76）；胸推和腿举的力量差值也偏向肌酸一组。作者写明，肌酸借以产生这些差异的机制还没有被充分检验。这是「训练加肌酸」相对「同样训练加安慰剂」的汇总。它不是不参加抗阻训练的人的结果，不是运动表现保证，不是肌少症的治疗试验，也不是衰老被减慢的证据。1.37 kg 是那篇综述的合并差值，不是读者应当追求的数字，更不是用量。本页不转述各试验使用的具体数量。',
          'Forbes 等人 2018 年的简短荟萃分析（PMID 29740583）看的是另一件事：50 岁以上或绝经后成人，在抗阻训练的同时补充肌酸，骨密度是否高于只做同样训练。5 项至少 3 个月的试验、共 193 人符合纳入。其中两项单独报告了有利于肌酸的骨指标，但合并之后，全身、髋部、股骨颈和腰椎骨密度都没有显示出显著差异。试验数量少。这不是骨折终点，也不是骨质疏松的治疗试验。不能把力量或瘦组织上的差值写成骨骼已经获益。',
          'Prokopidis 等人 2023 年的系统综述和荟萃分析（PMID 35984306）讨论健康人的记忆测验。10 项随机试验进入综述，8 项进入合并。合并后记忆指标偏向肌酸，标准化均数差 0.29。按年龄分层时，66 至 76 岁一组的差值较大，但异质性高；11 至 31 岁一组的差值接近于零，置信区间跨过无差异。Eckert 与 Pascher 随后去信（PMID 36644917），认为统计上的重复计数可能导致假阳性。作者有一封回复（PMID 36644912）。回复不是一项新试验，本页也不把原综述的合并差写成记忆力已经提高。年轻一组里出现 11 岁，不是给儿童使用的许可。这些都是健康志愿者的测验分数，不是痴呆诊断，不是疾病预防，也不是抗衰老疗效。本页不转述综述里出现的用量。',
          '肌肉疾病是另一个问题。Kley 等人 2013 年的 Cochrane 综述（PMID 23740606）纳入 14 项试验、364 名已有遗传性肌肉疾病或特发性炎性肌病的人，比较肌酸与安慰剂。综述自己的结论是：在肌营养不良的短期和中期试验里，肌酸一组的肌力更高；在代谢性肌病，有限的证据没有显示出肌力的显著改善。同一综述写到，McArdle 病的一项试验在其所用方案下，日常生活活动变差，肌肉疼痛增多。这些句子只属于那些诊断、那些试验。本页不建议用肌酸治疗任何肌病，也不把它们外推成健康人零售补充剂的效果，更不抄写用量。',
          '帕金森病同样不能写成商品用途。Xiao 等人 2014 年的 Cochrane 综述（PMID 24934384）只纳入 2 项试验、194 人，没有看到运动功能、日常生活活动或生活质量的明确差异，并写明当时的证据不能作为治疗决定的可靠依据。其后，美国国立神经疾病与卒中研究所的 NET-PD 长期研究（PMID 25668262）在美国和加拿大 45 个中心纳入 1741 名诊断五年内、已经在使用多巴胺能药物的帕金森病成人，比较一水肌酸与安慰剂。试验因中期分析显示获益可能性低而提前停止。中位随访 4 年。在至少入组五年的 955 人里，综合临床结局没有更好。论文写明：这些结果不支持在帕金森病人中使用一水肌酸。本页守住这条边界：不建议该用途，不把试验里的数量抄成用法，也不把一项阴性的疾病试验改写成健康人补充剂「因此无效」或「因此可以抗衰老」。',
        ],
      },
      {
        id: 'regulation',
        heading: '监管表述：许可声称和「没有问题」都不是疗效认定',
        paragraphs: [
          '欧盟：委员会条例 (EU) No 432/2012 的合并文本列出允许用在食品上的健康声称，标题写明这份清单不是降低疾病风险的声称，也不是儿童发育与健康声称。肌酸项下有两句。一句是连续、短时、高强度运动中的体能表现，并且只可用于面向从事高强度运动的成人的食品。另一句是每日使用肌酸可以增强抗阻训练对 55 岁以上成人肌力的影响，并且只可用于面向正在规律抗阻训练的该年龄组的食品。附件写了摄入条件和训练条件，并标出 EFSA Journal 2011;9(7):2303 与 2016;14(2):4400。2016 年的意见是应一份申请作出的：小组认为，在 55 岁以上成人，肌酸与规律抗阻训练合在一起，与肌力改善之间建立了因果关系；只在训练日使用时没有看到这种差异。那是意见书在其条件下的结论。本页不采用声称原句，不把因果关系写成运动表现保证或疾病治疗，也不抄写附件和意见书里的数量。食品声称不是药品批准。',
          '美国：FDA 对 GRN 000931 的更正答复（更正信日期为 2020 年 12 月 3 日；GRAS 通知库存写明 2020 年 11 月 12 日结案，并指向这封更正信）讨论的是一水肌酸作为常规食品配料。通知人列出的用途包括能量饮料、蛋白棒和蛋白粉、奶昔、代餐粉和代餐棒、肉类类似物和固体饮料粉，不包括婴儿配方食品，也不包括美国农业部管辖的食品。FDA 的结论是：对该通知人在这些拟定使用条件下的 GRAS 结论，机构没有问题。「没有问题」不是药品批准，不是认定膳食补充剂胶囊已经 GRAS，也不是认定任何产品可以诊断、治疗、治愈或预防疾病。膳食补充剂不是药品。通知里写了添加量，本页不抄。',
          '中国：卫生部 2008 年 8 月 11 日《关于对以「肌酸」为原料的食品发放卫生许可证问题的批复》（卫监督函〔2008〕323号）写明，以肌酸为原料制成的产品不得作为普通食品管理，生产经营单位申请食品卫生许可证应不予受理。批复的理由里写了增强肌肉耐力和有一定副作用。那是这份批复自己的句子。本页不把它当成疗效结论，也不把它写成运动表现保证。副作用没有在批复里逐项列出，本页不补写。国家卫生健康委 2023 年第 4 号公告汇总的是 2009 年至 2021 年已公告的新食品原料，肌酸不在该目录中。此后有没有新的公告，以卫生健康委和市场监管总局的现行文本为准。本页不判断某一个肌酸商品在中国是药品、注册保健食品还是其他身份。欧盟食品声称、美国 GRAS 信件和跨境上架，都不是中国的药品许可。保健食品不是药物，不能代替药物治疗疾病。',
        ],
      },
      {
        id: 'caution',
        heading: '谁需要更谨慎',
        paragraphs: [
          '下列情况不应按营销页或本页自行开始使用肌酸产品：妊娠或可能妊娠、哺乳、儿童和青少年；已知肾脏疾病；已经在接受帕金森病、肌病或其他疾病的治疗；即将手术；正在使用处方药。Dickinson 等人 2014 年的 Cochrane 综述（PMID 25523279）计划评估妊娠期使用肌酸是否能为胎儿提供神经保护，检索后没有找到可以纳入的随机试验，因此不能从那篇综述得出实践建议。动物实验不是人体证据。本页不把此后是否出现新试验写成可以在妊娠期自行开始使用。',
          'Tsiaras 等人 2026 年的系统综述和荟萃分析（PMID 42035842）汇总了肌酸补充的随机试验，主要看血清肌酐、尿素和估算肾小球滤过率。肌酐在合并后更高。尿素没有显著差异。估算肾小球滤过率的合并差值也没有达到统计学显著，置信区间同时包括下降和上升。作者写明，肌酐升高本身不等于尿素或估算肾小球滤过率已经发生显著改变，并且仍需要长于一年的试验。摘要里的肌酐差值带有实验室单位，本页不转写那个数字，避免被读成用量。这篇综述不是对已知肾病患者的许可。肌酐又是临床用来观察肾功能的指标，数值升高会改变化验单的样子。本页不能解释某一个人的结果。',
          '上面的疾病试验和训练试验都没有把药物相互作用研究完。没有看到某一种相互作用的报道，不等于不存在。不要因为读到瘦组织、力量或记忆测验的差值，就停用多巴胺能药物或其他已开具的药物。一水肌酸的试验不能凭本页套到盐酸盐、乙酯或其他商品形式上。',
        ],
      },
      {
        id: 'boundary',
        heading: '明确不能外推的边界',
        paragraphs: [
          '本页不提供用量，不比较品牌，不链接购物车。论文、EFSA 意见和法规附件里的数量是那一次试验或那一条标签规则的条件，不是给读者的用法。1.37 kg 也不是目标。',
          '不能把 Chilibeck 的汇总写成不训练也能增肌，或写成运动表现已经得到保证。不能把 Forbes 的骨密度合并结果写成预防骨折。不能把有争议的记忆综述写成预防痴呆或抗衰老。不能把肌营养不良试验或帕金森病试验写成零售胶囊的用途；本页不建议把肌酸当作这些疾病的治疗。不能把欧盟的许可声称或 FDA 的「没有问题」写成治愈、预防或长寿疗效。不能把 2008 年中国批复里的「肌肉耐力」写成广告句。',
          'NMN / NR、EPA / DHA、维生素 D 和镁那几页用的是别的证据、同一条界限：研究归研究，商品声称归商品声称。这些页面都不提供用法。',
        ],
      },
    ],
    sourcesHeading: '本页依据的公开来源',
    sourcesNote:
      '只列本页实际核对过摘要、综述结论或机构原文的页面。法规附件和意见书里的数量没有抄进正文。2023 年的新食品原料目录只覆盖其写明的 2009 年至 2021 年公告，此后的文本请复查主管部门现行页面。',
    sources: [
      {
        label: 'Chilibeck 等，Open Access J Sports Med，2017（PMID 29138605）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/29138605/',
        note: '22 项试验、721 名平均年龄约 57 至 70 岁的成人。抗阻训练期间补充肌酸，瘦组织和力量的合并差值大于安慰剂。不是不训练者的结果。',
      },
      {
        label: 'Forbes 等，Front Nutr，2018（PMID 29740583）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/29740583/',
        note: '5 项试验、193 名 50 岁以上或绝经后成人。肌酸加抗阻训练对比单独训练，全身和常见部位骨密度没有显著差异。',
      },
      {
        label: 'Prokopidis 等，Nutr Rev，2023（PMID 35984306）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/35984306/',
        note: '健康人记忆测验的荟萃分析。年长亚组的差值较大但异质性高，较年轻亚组没有明确差值。不是痴呆预防。',
      },
      {
        label: 'Eckert 与 Pascher 的读者来信，Nutr Rev，2023（PMID 36644917）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/36644917/',
        note: '指出上述记忆综述可能因重复计数而得出假阳性。作者回复（PMID 36644912）不是新的试验。',
      },
      {
        label: 'Kley 等，Cochrane Database Syst Rev，2013（PMID 23740606）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/23740606/',
        note: '已有肌肉疾病的人。肌营养不良试验中肌力更高；代谢性肌病没有显著肌力改善。本页不建议据此治疗。',
      },
      {
        label: 'Xiao 等，Cochrane Database Syst Rev，2014（PMID 24934384）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/24934384/',
        note: '帕金森病。当时两项小试验不能作为治疗决定的可靠依据。',
      },
      {
        label: 'NET-PD 写作组，JAMA，2015（PMID 25668262）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/25668262/',
        note: '1741 名早期、已用多巴胺能药物的帕金森病成人。一水肌酸对比安慰剂，因无效可能高而提前停止，临床结局没有更好。',
      },
      {
        label: 'Dickinson 等，Cochrane Database Syst Rev，2014（PMID 25523279）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/25523279/',
        note: '计划评估妊娠期肌酸与胎儿神经保护。没有找到可纳入的随机试验。',
      },
      {
        label: 'Tsiaras 等，J Ren Nutr，2026（PMID 42035842）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/42035842/',
        note: '随机试验汇总：血清肌酐更高；尿素和估算肾小球滤过率没有显著差异。作者要求更长的试验。不是肾病患者的许可。',
      },
      {
        label: '欧盟委员会条例 (EU) No 432/2012 合并文本',
        href: 'https://eur-lex.europa.eu/eli/reg/2012/432/2024-08-19/eng',
        note: '食品健康声称清单。肌酸有两句限定声称。不是降低疾病风险的声称，也不是药品批准。',
      },
      {
        label: 'EFSA Journal 2016;14(2):4400',
        href: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2016.4400',
        note: '应申请作出的意见：55 岁以上成人中，肌酸与规律抗阻训练合在一起与肌力有关。只在训练日使用时没有看到该差异。不是本页的用法。',
      },
      {
        label: 'EFSA Journal 2011;9(7):2303',
        href: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2011.2303',
        note: '条例附件为短时、高强度、重复运动声称标出的意见编号。本页不采用声称原句。',
      },
      {
        label: 'FDA：GRN 000931 更正答复信',
        href: 'https://www.fda.gov/media/144598/download',
        note: '对一水肌酸在通知所列常规食品用途下的 GRAS 结论，FDA 没有问题。不是补充剂或药品的批准。',
      },
      {
        label: 'FDA：膳食补充剂',
        href: 'https://www.fda.gov/food/dietary-supplements',
        note: '补充剂不是药品。本链接不是 GRN 000931 的原文。',
      },
      {
        label: '卫生部关于以肌酸为原料的食品卫生许可的批复',
        href: 'https://www.nhc.gov.cn/zwgkzt/pwsjd1/200808/37529.shtml',
        note: '卫监督函〔2008〕323号。当时不得作为普通食品管理。本页不采用其中的耐力表述。',
      },
      {
        label: '国家卫生健康委 2023 年第 4 号公告',
        href: 'https://zwfw.nhc.gov.cn/kzx/tzgg/sptjjxpzsp_224/202305/t20230515_2517.html',
        note: '汇总 2009 年至 2021 年已公告的新食品原料。肌酸不在该目录中。以后的公告以现行文本为准。',
      },
    ],
    relatedHeading: '站内相关页',
    related: [
      { path: '/methodology', label: '证据如何核对与呈现' },
      { path: '/faq', label: '常见问题' },
      { path: '/products/evidence/nmn', label: '另一页成分证据：NMN / NR' },
      { path: '/products/evidence/omega-3', label: '另一页成分证据：EPA 与 DHA' },
      { path: '/products/evidence/vitamin-d', label: '另一页成分证据：维生素 D' },
      { path: '/products/evidence/magnesium', label: '另一页成分证据：镁' },
      { path: '/products', label: '产品证据库：购买前如何核对' },
      { path: '/longevity-news/ln-static-2', label: '资讯：怎样给一篇论文分证据档' },
      { path: '/disclaimer', label: '健康与医疗免责声明' },
    ],
  },
  en: {
    kicker: 'Ingredient evidence · education',
    title: 'Creatine: human evidence, regulation, and limits',
    updatedLabel: 'Updated',
    lead:
      'This page is about creatine, and about creatine monohydrate where a trial or a regulator names that form. Creatine hydrochloride, creatine ethyl ester, buffered creatine, and other label names are different phrases. This page does not treat those products as the same evidence as the studies below. It is not a product page, it recommends no brand, and it gives no dose.',
    disclaimer:
      'For education only. It is not medical advice, a diagnosis, treatment, prevention, or a prescription. A between-group difference in a resistance-training trial, a disputed memory review, or a permitted food claim is not proof that a capsule builds muscle, guarantees sports performance, treats Parkinson disease or a muscle disease, or slows aging. Do not stop a prescribed medicine because of this page.',
    sections: [
      {
        id: 'what',
        heading: 'Creatine monohydrate, another product form, and a slogan are not one sentence',
        paragraphs: [
          'Creatine is a compound used in energy transfer in muscle and in other tissues. The body makes it, and meat and fish contain it. Phosphocreatine is the stored form inside cells. A change in that pool is a laboratory or study measure. It is not strength, a fracture, a memory diagnosis, or a disease endpoint.',
          '“Muscle gain,” “power,” “anti-aging,” and “brain health” on a label are product claims. They are not a trial’s primary endpoint, and they are not a regulator’s finding that the product treats disease or guarantees sports performance. This page does not set a training plan and does not decide whether one person should have a creatinine test.',
        ],
      },
      {
        id: 'evidence',
        heading: 'Human evidence, and where it stops',
        paragraphs: [
          'Chilibeck and colleagues’ 2017 systematic review and meta-analysis (PMID 29138605) included 22 randomized trials and 721 men and women. Mean age across studies was 57 to 70 years. The comparison was creatine or placebo during resistance training, about 2 to 3 days a week for 7 to 52 weeks. The review reported a greater increase in lean tissue with creatine, a mean difference of 1.37 kg (95% CI 0.97 to 1.76), and strength differences that also favored creatine for chest press and leg press. The authors wrote that the mechanisms had not been evaluated extensively. That is a pool of “training plus creatine” versus “the same training plus placebo.” It is not a result for people who do not do resistance training, not a sports guarantee, not a treatment trial of sarcopenia, and not evidence that aging slowed. The 1.37 kg figure is the review’s pooled difference, not a target for a reader and not a dose. This page does not repeat the amounts used in the trials.',
          'Forbes and colleagues’ 2018 brief meta-analysis (PMID 29740583) asked a different question: whether creatine plus resistance training produced higher bone mineral density than the same training alone, in adults over 50 or after menopause. Five trials of at least 3 months, 193 people, met the criteria. Two of them reported a bone finding that favored creatine. The pool did not: whole-body, hip, femoral-neck, and lumbar-spine bone mineral density did not differ significantly. The trial count is small. These are not fracture endpoints and not a treatment trial of osteoporosis. A difference in strength or lean tissue is not a bone benefit.',
          'Prokopidis and colleagues’ 2023 systematic review and meta-analysis (PMID 35984306) looked at memory tests in healthy people. Ten randomized trials were reviewed and eight were pooled. The pool favored creatine, with a standardized mean difference of 0.29. In the subgroup aged 66 to 76 the difference was larger and heterogeneity was high. In the subgroup aged 11 to 31 the difference was near zero and the confidence interval crossed no difference. Eckert and Pascher then wrote (PMID 36644917) that double-counting could have produced a false-positive result. The authors replied (PMID 36644912). The reply is not a new trial, and this page does not treat the original pooled difference as established memory improvement. An 11-year-old inside the younger subgroup is not permission to give a product to a child. The outcomes are test scores in healthy volunteers. They are not a dementia diagnosis, not disease prevention, and not an anti-aging effect. This page does not repeat doses printed in the review.',
          'Muscle disease is a separate question. Kley and colleagues’ 2013 Cochrane review (PMID 23740606) included 14 trials and 364 people who already had a hereditary muscle disease or an idiopathic inflammatory myopathy, comparing creatine with placebo. The review’s own conclusion is that short- and medium-term trials in muscular dystrophies showed higher muscle strength with creatine, and that limited evidence in metabolic myopathies did not show a significant strength difference. The same review says that, in one trial in McArdle disease, activities of daily living worsened and muscle pain increased on the regimen used there. Those sentences belong to those diagnoses and those trials. This page does not recommend creatine for any muscle disease, does not transfer the results to a retail supplement for healthy people, and does not copy a dose.',
          'Parkinson disease is not a product use either. Xiao and colleagues’ 2014 Cochrane review (PMID 24934384) included two trials and 194 people, found no clear difference in motor function, activities of daily living, or quality of life, and said the evidence then was not a reliable basis for treatment decisions. The later NET-PD long-term study (PMID 25668262), from the U.S. National Institute of Neurological Disorders and Stroke, enrolled 1,741 adults at 45 sites in the United States and Canada with Parkinson disease diagnosed within five years and already treated with dopaminergic therapy. Creatine monohydrate was compared with placebo. The trial stopped early for futility. Median follow-up was 4 years. Among 955 participants who had been enrolled for at least five years, the global clinical outcome was not better. The paper says the findings do not support use of creatine monohydrate in patients with Parkinson disease. This page keeps that limit: it does not recommend that use, it does not copy the trial amount, and it does not rewrite a negative disease trial as “therefore a supplement does nothing” or “therefore it slows aging.”',
        ],
      },
      {
        id: 'regulation',
        heading: 'A permitted claim, or “no questions,” is not an efficacy finding',
        paragraphs: [
          'European Union: the consolidated text of Commission Regulation (EU) No 432/2012 lists health claims that may be made on foods. Its title says the list is other than claims referring to the reduction of disease risk and to children’s development and health. Two creatine claims appear. One is about physical performance in successive bursts of short-term, high-intensity exercise, and it may be used only for foods targeting adults performing high-intensity exercise. The other says daily creatine consumption can enhance the effect of resistance training on muscle strength in adults over 55, and it may be used only for foods targeting adults over 55 who do regular resistance training. The annex states intake and training conditions and cites EFSA Journal 2011;9(7):2303 and 2016;14(2):4400. The 2016 opinion was written on an application. The panel concluded that a cause-and-effect relationship had been established between creatine combined with regular resistance training and muscle strength in adults over 55, and that the same pattern was not seen when creatine was given only on training days. That is the opinion’s conclusion under its conditions. This page does not adopt the claim sentences, does not turn the cause-and-effect sentence into a sports guarantee or a disease treatment, and does not copy the amounts in the annex or the opinion. A food claim is not a drug approval.',
          'United States: FDA’s corrected response to GRN 000931 (the corrected letter is dated 3 December 2020; the GRAS notice inventory records closure on 12 November 2020 and points to that correction) is about creatine monohydrate as an ingredient in conventional foods. The uses named by the notifier include energy drinks, protein bars and powders, milk shakes, meal-replacement powders and bars, meat analogs, and powdered drink mixes. Infant formula is excluded, and so are foods under the U.S. Department of Agriculture. FDA’s conclusion is that the agency had no questions about the notifier’s GRAS conclusion for those intended conditions of use. “No questions” is not a drug approval, not a finding that a dietary-supplement capsule is GRAS, and not a finding that any product diagnoses, treats, cures, or prevents disease. Dietary supplements are not drugs. The notice states a use level. This page does not copy it.',
          'China: on 11 August 2008 the Ministry of Health replied, in Wei Jian Du Han [2008] No. 323, that products made with creatine as a raw material were not to be managed as ordinary food, and that an application for a food-hygiene license was not to be accepted. The reply’s reasons include a phrase about muscle endurance and a phrase about certain side effects. Those are the reply’s own sentences. This page does not adopt them as an efficacy finding and does not turn them into a sports guarantee. The reply does not itemize the side effects, and this page does not fill them in. National Health Commission announcement No. 4 of 2023 compiles new food ingredients announced from 2009 through 2021. Creatine is not in that list. Later notices, if any, are whatever the National Health Commission and SAMR publish now. This page does not decide whether a given creatine product in China is a drug, a registered health food, or another legal identity. An EU food claim, a U.S. GRAS letter, and a cross-border listing are not a Chinese drug license. A health food is not a drug and cannot replace drug treatment.',
        ],
      },
      {
        id: 'caution',
        heading: 'Who should be more cautious',
        paragraphs: [
          'Do not start a creatine product from a marketing page or from this page in pregnancy or possible pregnancy, lactation, childhood or adolescence, with known kidney disease, while being treated for Parkinson disease, a muscle disease, or another illness, before surgery, or while taking a prescription medicine. Dickinson and colleagues’ 2014 Cochrane review (PMID 25523279) set out to assess creatine in pregnancy for fetal neuroprotection and found no randomized trials to include, so that review supplies no practice recommendation. Animal studies are not human evidence. This page does not treat any later trial as a reason to start creatine in pregnancy on one’s own.',
          'Tsiaras and colleagues’ 2026 systematic review and meta-analysis (PMID 42035842) pooled randomized trials of creatine supplementation and looked at serum creatinine, urea, and estimated glomerular filtration rate. Creatinine was higher in the pool. Urea did not differ significantly. The pooled difference in estimated glomerular filtration rate was not statistically significant, and the confidence interval included both a decrease and an increase. The authors say the creatinine increase is not itself a significant change in urea or estimated glomerular filtration rate, and that trials longer than a year are still needed. The abstract prints the creatinine difference with a laboratory unit. This page does not copy that number, so it is not read as a dose. The review is not permission for people who already have kidney disease. Creatinine is also a number clinicians use to look at kidney function, so a higher result changes how a lab report looks. This page cannot interpret one person’s result.',
          'The disease trials and the training trials cited here do not finish the question of drug interactions. Silence about an interaction is not proof of safety. Do not stop a dopaminergic medicine or another prescribed medicine because of a difference in lean tissue, strength, or a memory test. A creatine monohydrate trial is not established here as a substitute for a hydrochloride, an ethyl ester, or another product form.',
        ],
      },
      {
        id: 'boundary',
        heading: 'What must not be extrapolated',
        paragraphs: [
          'This page gives no dose, compares no brands, and does not link to a cart. A number in a paper, an EFSA opinion, or a regulation annex is a condition of that trial or that labeling rule. It is not an instruction for a reader. The 1.37 kg figure is not a target.',
          'The Chilibeck pool is not evidence of muscle gain without training and not a sports guarantee. The Forbes bone-density pool is not fracture prevention. The disputed memory review is not dementia prevention and not an anti-aging effect. Trials in muscular dystrophy and in Parkinson disease are not uses for a retail capsule. This page does not recommend creatine as treatment for those diseases. An EU permitted claim and FDA’s “no questions” letter are not a cure, a prevention claim, or a longevity effect. The 2008 Chinese reply’s phrase about muscle endurance is not advertising copy.',
          'The NMN / NR, EPA / DHA, vitamin D, and magnesium pages use other evidence and the same limit: a study is not a product claim. None of these pages gives a dose.',
        ],
      },
    ],
    sourcesHeading: 'Public sources used on this page',
    sourcesNote:
      'Only abstracts, review conclusions, or agency pages that were checked are listed. Amounts in the regulation annex and the opinions are not copied into the body. The 2023 new-food-ingredient list covers the 2009–2021 announcements it names. Recheck regulators for later text.',
    sources: [
      {
        label: 'Chilibeck et al., Open Access J Sports Med, 2017 (PMID 29138605)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/29138605/',
        note: '22 trials, 721 adults with mean ages about 57 to 70. During resistance training, pooled lean tissue and strength favored creatine over placebo. Not a result without training.',
      },
      {
        label: 'Forbes et al., Front Nutr, 2018 (PMID 29740583)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/29740583/',
        note: 'Five trials, 193 adults over 50 or postmenopausal. Creatine plus resistance training versus training alone: no significant difference in whole-body or common-site bone mineral density.',
      },
      {
        label: 'Prokopidis et al., Nutr Rev, 2023 (PMID 35984306)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/35984306/',
        note: 'Meta-analysis of memory tests in healthy people. A larger difference in an older subgroup, with high heterogeneity, and no clear difference in a younger subgroup. Not dementia prevention.',
      },
      {
        label: 'Letter from Eckert and Pascher, Nutr Rev, 2023 (PMID 36644917)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/36644917/',
        note: 'Argues that double-counting could have produced a false-positive result in the memory review. The authors’ reply (PMID 36644912) is not a new trial.',
      },
      {
        label: 'Kley et al., Cochrane Database Syst Rev, 2013 (PMID 23740606)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/23740606/',
        note: 'People who already had a muscle disease. Higher strength in muscular-dystrophy trials; no significant strength difference in metabolic myopathies. Not a treatment recommendation from this page.',
      },
      {
        label: 'Xiao et al., Cochrane Database Syst Rev, 2014 (PMID 24934384)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/24934384/',
        note: 'Parkinson disease. Two small trials were not a reliable basis for treatment decisions at that time.',
      },
      {
        label: 'Writing Group for the NET-PD Investigators, JAMA, 2015 (PMID 25668262)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/25668262/',
        note: '1,741 adults with early Parkinson disease already on dopaminergic therapy. Creatine monohydrate versus placebo stopped early for futility and did not improve clinical outcomes.',
      },
      {
        label: 'Dickinson et al., Cochrane Database Syst Rev, 2014 (PMID 25523279)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/25523279/',
        note: 'Set out to assess creatine in pregnancy for fetal neuroprotection. No randomized trials were found to include.',
      },
      {
        label: 'Tsiaras et al., J Ren Nutr, 2026 (PMID 42035842)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/42035842/',
        note: 'Pooled randomized trials: higher serum creatinine; no significant difference in urea or estimated glomerular filtration rate. The authors call for longer trials. Not a clearance for kidney disease.',
      },
      {
        label: 'Consolidated Commission Regulation (EU) No 432/2012',
        href: 'https://eur-lex.europa.eu/eli/reg/2012/432/2024-08-19/eng',
        note: 'The food health-claim list. Two qualified creatine claims. Not a disease-risk-reduction claim and not a drug approval.',
      },
      {
        label: 'EFSA Journal 2016;14(2):4400',
        href: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2016.4400',
        note: 'Opinion on an application: in adults over 55, creatine plus regular resistance training was linked to muscle strength. Use only on training days did not show that difference. Not a dose from this page.',
      },
      {
        label: 'EFSA Journal 2011;9(7):2303',
        href: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2011.2303',
        note: 'The journal number the annex cites for the short-term, high-intensity, repeated-exercise claim. This page does not adopt the claim sentence.',
      },
      {
        label: 'FDA corrected response letter, GRN 000931',
        href: 'https://www.fda.gov/media/144598/download',
        note: 'FDA had no questions about a GRAS conclusion for creatine monohydrate in the conventional foods named in the notice. Not an approval of a supplement or a drug.',
      },
      {
        label: 'FDA: dietary supplements',
        href: 'https://www.fda.gov/food/dietary-supplements',
        note: 'Supplements are not drugs. This link is not the text of GRN 000931.',
      },
      {
        label: 'Ministry of Health reply on food-hygiene licenses for creatine as a food raw material',
        href: 'https://www.nhc.gov.cn/zwgkzt/pwsjd1/200808/37529.shtml',
        note: 'Wei Jian Du Han [2008] No. 323. At that time, not to be managed as ordinary food. This page does not adopt the reply’s endurance phrase.',
      },
      {
        label: 'National Health Commission announcement No. 4 of 2023',
        href: 'https://zwfw.nhc.gov.cn/kzx/tzgg/sptjjxpzsp_224/202305/t20230515_2517.html',
        note: 'Compiles new food ingredients announced from 2009 through 2021. Creatine is not in that list. Later notices are the current texts.',
      },
    ],
    relatedHeading: 'On this site',
    related: [
      { path: '/methodology', label: 'How evidence is checked' },
      { path: '/faq', label: 'Questions' },
      { path: '/products/evidence/nmn', label: 'Other ingredient page: NMN / NR' },
      { path: '/products/evidence/omega-3', label: 'Other ingredient page: EPA and DHA' },
      { path: '/products/evidence/vitamin-d', label: 'Other ingredient page: vitamin D' },
      { path: '/products/evidence/magnesium', label: 'Other ingredient page: magnesium' },
      { path: '/products', label: 'Evidence library: how a claim is checked' },
      { path: '/longevity-news/ln-static-2', label: 'Insight: grading a paper' },
      { path: '/disclaimer', label: 'Health disclaimer' },
    ],
  },
}

export function getCreatineEvidencePage(lang) {
  const page = lang === 'en' ? PAGES.en : PAGES.zh
  return { ...page, faqs: getCreatineEvidenceFaqs(lang) }
}
