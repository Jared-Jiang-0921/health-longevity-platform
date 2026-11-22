/**
 * 公开的镁成分证据页。不是商品详情，不提供用量，也不把研究写成预防、治疗或抗衰老疗效。
 */
import { getMagnesiumEvidenceFaqs } from './magnesiumEvidenceMeta.js'

export { MAGNESIUM_EVIDENCE_PATH, MAGNESIUM_EVIDENCE_UPDATED } from './magnesiumEvidenceMeta.js'

const PAGES = {
  zh: {
    kicker: '成分证据 · 教育说明',
    title: '镁：人体证据、监管表述与不能外推的边界',
    updatedLabel: '最近更新',
    lead:
      '这一页讨论镁。氧化镁、柠檬酸镁、氯化镁、甘氨酸镁、硫酸镁、乳酸镁、天冬氨酸镁、氢氧化镁，以及食物里本来就有的镁，是不同的说法。试验或法规写明哪一种，句子就只属于那一种。本页不把这些商品当成同一份证据。它不是商品页，不推荐品牌，也不提供用量。',
    disclaimer:
      '仅供健康教育参考，不构成医疗建议、诊断、治疗、预防或处方。血压计上的差值、化验指标的变化、一份食品标签许可，或一封写明证据不一致的监管信件，都不能外推成某个胶囊已经能够治疗高血压、失眠、抽筋或糖尿病，保证运动表现，或减慢衰老。不要按本页停用已经开具的药物。',
    sections: [
      {
        id: 'what',
        heading: '食物里的镁、补充剂里的盐，和广告句不是同一句话',
        paragraphs: [
          '镁是一种人体必需的矿物质，肾脏参与维持它的平衡。血清镁是化验指标。它不是血压、抽筋次数、睡眠时间、血糖、骨折或死亡这些终点。化验数值升高或降低，本身也不是某一种病已经被治疗。',
          '标签上的「助眠」「防抽筋」「稳血压」「抗衰老」「提升运动表现」是商品声称。它不等于一项试验的主要终点，也不等于监管机构认定该商品能治疗疾病。本页不安排用法，也不判断一个人要不要检测血镁。',
        ],
      },
      {
        id: 'evidence',
        heading: '现有人体证据，以及它停在哪里',
        paragraphs: [
          'Argeros 等人 2025 年的系统综述和荟萃分析（PMID 41000008）纳入 38 项至少 4 周的随机对照试验、2709 人，中位干预 12 周。相对安慰剂，收缩压的合并差为 −2.81 毫米汞柱（95% 置信区间 −4.32 至 −1.29），舒张压为 −2.05 毫米汞柱（95% 置信区间 −3.23 至 −0.88）。正在服用降压药的高血压人群，收缩压和舒张压的合并差更大，分别为 −7.68 与 −2.96 毫米汞柱；低镁血症亚组为 −5.97 与 −4.75 毫米汞柱。血压正常的一组没有达到统计学显著。研究之间异质性高。作者没有发现剂量—反应关系（所有相关 P 值至少为 0.20），并写明这些结果应谨慎解释，还需要更大、设计更清楚的试验。这些是血压计上的汇总差值，不是中风、心肌梗死或死亡，不是读者应当追求的数字，也不是用量。本页不转述摘要里的摄入量范围。正在服药的亚组差值更大，不是停用降压药的理由。',
          'Zhang 等人 2016 年更早的荟萃分析（PMID 27402922）纳入 34 项随机双盲安慰剂对照试验、2028 名血压正常或高血压的成人，中位持续 3 个月。收缩压比安慰剂低 2.00 毫米汞柱（95% 置信区间 0.43 至 3.58），舒张压低 1.78 毫米汞柱（95% 置信区间 0.73 至 2.82），同时血清镁高出 0.05 mmol/L（95% 置信区间 0.03 至 0.07）。作者写过「表明镁补充对降低成人血压有因果效应」，并写明仍可能有残余异质性，需要进一步试验。那是 2016 年那篇综述自己的句子。本页不采用它作为结论：2025 年的汇总试验更多，异质性仍高，血压正常一组没有显著差值，也没有剂量—反应关系。0.05 mmol/L 是化验汇总，不是目标，更不是用量。本页不转述 2016 年摘要里的剂量。',
          'Veronese 等人 2021 年的系统综述和荟萃分析（PMID 34836329）看的是另一件事：已有糖尿病或处于糖尿病高风险的人，口服镁相对安慰剂，血糖和胰岛素敏感性指标有没有差别。摘要报告，糖尿病患者的空腹血糖更低；高风险人群的血糖本身，以及口服糖耐量试验 2 小时的血糖，有改善；胰岛素敏感性标志物也有改善。论文标题里的 treating 指的是这些代谢指标。摘要没有给出试验篇数，本页不补写。这些是化验指标。它们不是糖尿病发病率，不是并发症，不是死亡，也不是本页给出的治疗。关联或短期指标变化不能外推到没被研究的人群、终点、镁盐和场景。本页不转述用量。',
          'Mah 与 Pitre 2021 年的系统综述和荟萃分析（PMID 33865376）只讨论有失眠的老年人。3 项随机试验、3 个国家、151 人，比较口服镁与安慰剂。合并后，入睡潜伏期少 17.36 分钟（95% 置信区间 −27.27 至 −7.44）。总睡眠时间的点估计多 16.06 分钟，但没有达到统计学显著。全部试验的偏倚风险为中到高，证据质量为低到极低。作者写明，现有文献的质量不足以让医生作出有充分依据的使用建议。摘要后半又写到，因为口服镁便宜且容易获得，随机试验证据或许支持把它用于失眠症状，并写了一个数量。本页不采用这后半句，也不抄那个数量。2024 年 12 月 19 日的更正（PMID 39702257）不是一项新试验。本页读到的更正说明改的是缩写、检索计数、一个数据库名称，并要求删去一处把结果写成睡眠参数已经改善的措辞；更正没有给出新的合并差值。因此本页不把 17.36 分钟写成失眠已经被治疗，也不把它外推给儿童、没有失眠的人，或当成抗衰老疗效。',
          '抽筋是另一个问题。Garrison 等人 2020 年的 Cochrane 综述（PMID 32956536）是 2012 年综述的更新，纳入 11 项试验、735 人，其中 118 名交叉试验参与者另外充当自身对照。特发性抽筋、主要是老年人（各项平均年龄 61.6 至 69.3 岁）里，镁与安慰剂在抽筋频率上的差别小，没有统计学显著，异质性很低。主要终点是 4 周时每周抽筋次数相对基线的百分比变化，均数差 −9.59%（95% 置信区间 −23.14% 至 3.97%；3 项研究、177 人；中等确定性），置信区间跨过无差异。每周抽筋次数的差为 −0.18 次（95% 置信区间 −0.84 至 0.49；5 项研究、307 人）。综述自己的结论是：镁补充不太可能为发生骨骼肌抽筋的老年人提供有临床意义的预防。妊娠相关静息抽筋的文献互相冲突，还需要进一步研究。除肝硬化里一项小的、没有定论的研究外，没有找到评估运动相关抽筋，或其他疾病状态下抽筋的随机试验。可以合并的轻微不良事件更多是胃肠道反应，例如腹泻。这些句子只属于那些试验。本页不建议用镁预防抽筋，不把它写成运动表现保证，也不抄写用量。',
        ],
      },
      {
        id: 'regulation',
        heading: '监管表述：许可声称和合格声称都不是疗效认定',
        paragraphs: [
          '欧盟：委员会条例 (EU) No 432/2012 的合并文本（本页核对的是 2025 年 8 月 20 日版）列出允许用在食品上的健康声称。标题写明这份清单不是降低疾病风险的声称，也不是儿童发育与健康声称。镁在附件里有十句，每句都只可用于达到 (EC) No 1924/2006 附件里「镁来源」条件的食品。本页不抄写该条件里的数量。英文原句是：Magnesium contributes to a reduction of tiredness and fatigue；Magnesium contributes to electrolyte balance；Magnesium contributes to normal energy-yielding metabolism；Magnesium contributes to normal functioning of the nervous system；Magnesium contributes to normal muscle function；Magnesium contributes to normal protein synthesis；Magnesium contributes to normal psychological function；Magnesium contributes to the maintenance of normal bones；Magnesium contributes to the maintenance of normal teeth；Magnesium has a role in the process of cell division。附件标出的意见编号是 EFSA Journal 2009;7(9):1216 与 2010;8(10):1807。下面的中文只是阅读对照，不是欧盟的正式中文文本：减轻疲倦和疲劳，电解质平衡，正常的能量代谢，神经系统的正常功能，正常的肌肉功能，正常的蛋白质合成，正常的心理功能，维持正常骨骼，维持正常牙齿，以及在细胞分裂过程中起作用。这些是食品声称。它们不是抽筋预防，不是运动表现保证，不是抗衰老，也不是药品批准。',
          '美国：FDA 对案卷 FDA-2016-Q-3770 的答复信，讨论的是有人申请把「镁与降低高血压风险」写成健康声称。2022 年 1 月 10 日的 constituent update 宣布了这封执法裁量信。申请人提出的「supportive but inconclusive」（支持性的但没有定论）被 FDA 认为夸大了证据。信件写明，部分干预研究发现的血压下降，被更多没有发现血压效应的证据削弱；正常血压、血压升高、高血压以及已有心血管疾病的研究里，结果都不一致。FDA 的结论是：有一些可信证据提示，来自常规食品和膳食补充剂的镁摄入也许能通过降低血压来降低高血压风险，但这些证据没有定论、也不一致。合格声称仍须符合法定要求，但明确排除两项：不要求达到「显著科学共识」（significant scientific agreement），也不要求已经有一条授权法规。因此它不是授权健康声称，不是药品批准。信件准备考虑执法裁量的三句是：“Inconsistent and inconclusive scientific evidence suggests that diets with adequate magnesium may reduce the risk of high blood pressure (hypertension), a condition associated with many factors.” “Consuming diets with adequate magnesium may reduce the risk of high blood pressure (hypertension). However, FDA has concluded that the evidence is inconsistent and inconclusive.” “Some scientific evidence suggests that diets with adequate magnesium may reduce the risk of high blood pressure (hypertension), a condition associated with many factors. FDA has concluded that the scientific evidence supporting this claim is inconsistent and not conclusive.” 中文对照：不一致且没有定论的科学证据提示，镁充足的膳食可能降低高血压（一种与许多因素有关的情况）的风险；摄入镁充足的膳食可能降低高血压风险，但 FDA 认为证据不一致、没有定论；一些科学证据提示镁充足的膳食可能降低高血压风险，FDA 认为支持该声称的科学证据不一致、不是结论性的。信件还写了使用条件，包括食品里要含有多少镁。本页不抄那些数量。2025 年的血压荟萃分析晚于这封信，但它自己写了高异质性和需要更多试验。后发表的汇总不能把这封信改写成授权声称或治疗结论。膳食补充剂不是药品。',
          '中国：卫生部 2011 年 10 月 12 日发布、2013 年 1 月 1 日实施的《食品安全国家标准 预包装食品营养标签通则》（GB 28050—2011）附录 D.21 的标准用语是：「镁是能量代谢、组织形成和骨骼发育的重要成分。」标准写明，它不适用于保健食品及预包装特殊膳食用食品的营养标签标示。这是营养标签上的营养成分功能声称，不是疾病治疗声称，也不是某一个胶囊已经获批的结论。国家卫生健康委 2025 年 9 月 25 日发布的 GB 28050—2025 问答写明，营养标签标准将于 2027 年 3 月 16 日实施。该问答没有引用镁的声称原句，本页也不从其他网站转抄 2025 年文本里的镁句子。标签究竟用哪一版，以生产时适用的现行标准为准。本页不判断某一个镁商品在中国是药品、注册保健食品还是其他身份。欧盟食品声称、美国合格声称和跨境上架，都不是中国的药品许可。保健食品不是药物，不能代替药物治疗疾病。',
        ],
      },
      {
        id: 'caution',
        heading: '谁需要更谨慎',
        paragraphs: [
          '下列情况不应按营销页或本页自行开始使用镁产品：妊娠或可能妊娠、哺乳、儿童和青少年；已知肾脏疾病或肾功能下降；正在使用处方药。Makrides 等人 2014 年的 Cochrane 综述（PMID 24696187）纳入 10 项试验、9090 名孕妇及其婴儿，比较口服镁与对照。全部试验合并后，围产儿死亡（风险比 1.10，95% 置信区间 0.72 至 1.67；5 项试验、5903 名婴儿）、小于胎龄儿（0.76，0.54 至 1.07；3 项试验、1291 名婴儿）和子痫前期（0.87，0.58 至 1.32；3 项试验、1042 名妇女）都没有显著差异。没有试验报告产妇死亡。次要结局里，出院前新生儿死亡的风险比是 2.21（95% 置信区间 1.02 至 4.75；4 项试验、5373 名婴儿）。综述写明，一项试验贡献了该分析七成以上的参与者，作者认为补充组较多的严重先天异常不太可能归因于镁，还有两对出生体重很低的双胞胎死亡，因此这个结果应谨慎解释；若排除该试验中死于严重先天异常的婴儿，升高的风险不再出现。10 项试验里只有 2 项被评为总体高质量。只保留这两项时，围产儿死亡、小于胎龄儿和子痫前期都没有显著差异。综述的结论是：没有足够的高质量证据表明妊娠期补充镁有益。本页不把任何次要结局写成收益，也不建议据此在妊娠期自行开始使用。摘要里的剂量没有抄。',
          'Van Laecke 2019 年的叙述性综述（PMID 30220246）不是一项随机试验。它写明，严重高镁血症可以危及生命，但几乎只出现在肾功能已经明显下降、同时又从补充剂、含镁泻药或抗酸药摄入较多镁的人。同一篇综述还写到，静脉镁用于尖端扭转型室速和子痫前期，是医院里的治疗，而且不论原先有没有低镁血症。那是静脉药物和特定急症，不是口服补充剂，也不是读者按本页自行开始的用途。欧洲委员会科学委员会 2001 年 10 月 11 日定稿的意见（SCF/CS/NUT/UPPLEV/54 Final，意见表达于 2001 年 9 月 26 日）把轻度腹泻定为易解离镁盐最敏感的不良效应。该可耐受上限针对的是补充剂、水或添加到食品饮料中的易解离盐（意见举例包括氯化物、硫酸盐、天冬氨酸盐、乳酸盐）以及氧化镁，不包括食物和饮料里本来就有的镁。意见写明，这种腹泻在肾功能完好的人通常可逆，不构成重大健康风险；严重肾功能损害是高镁血症的另一项风险因素。1 至 3 岁没有订出上限。意见把成人上限的适用范围写到包括妊娠和哺乳的妇女，以及 4 岁及以上儿童。那不是自行使用的许可。妊娠期那篇 Cochrane 综述仍然没有显示出主要结局的益处。本页不抄写意见里的任何数量。',
          '科学委员会的意见还写到，尿液碱化可能改变弱酸或弱碱药物的肾脏清除。本页不把这句话扩成一份药品名单。上面的试验也没有把药物相互作用研究完。没有看到某一种相互作用的报道，不等于不存在。不要因为读到血压、血糖或睡眠测验的差值，就停用降压药或其他已开具的药物。一种镁盐的试验不能凭本页套到另一种盐，也不能套到食物里的镁。',
        ],
      },
      {
        id: 'boundary',
        heading: '明确不能外推的边界',
        paragraphs: [
          '本页不提供用量，不比较品牌，不链接购物车。论文、FDA 信件、欧盟附件和可耐受上限意见里的数量，是那一次试验或那一条规则的条件，不是给读者的用法。毫米汞柱和分钟也不是目标。',
          '不能把 Argeros 或 Zhang 的血压汇总写成治疗高血压、预防中风或心肌梗死。不能把 FDA 的合格声称改写成授权健康声称或疗效。不能把 Veronese 的化验指标写成治疗糖尿病。不能把低质量的失眠综述写成治疗失眠或抗衰老。不能把 Cochrane 的抽筋综述写成预防抽筋或运动表现保证；综述自己的句子是「不太可能」有临床意义的预防。不能把欧盟的「正常肌肉功能」或「细胞分裂」写成这些用途。不能把 GB 28050—2011 的营养标签用语写成保健食品或药品的疗效。',
          'NMN / NR、EPA / DHA、维生素 D 和肌酸那几页用的是别的证据、同一条界限：研究归研究，商品声称归商品声称。这些页面都不提供用法。',
        ],
      },
    ],
    sourcesHeading: '本页依据的公开来源',
    sourcesNote:
      '只列本页实际核对过摘要、综述结论或机构原文的页面。试验、信件和意见书里的具体数量没有抄进正文。GB 28050—2025 的问答没有引用镁的声称原句，因此本页只引用 2011 年版里读到的那一句。',
    sources: [
      {
        label: 'Argeros 等，Hypertension，2025（PMID 41000008）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/41000008/',
        note: '38 项至少 4 周的随机试验、2709 人。血压有合并差值，正常血压一组不显著，异质性高，没有剂量—反应关系。不是心血管事件终点。',
      },
      {
        label: 'Zhang 等，Hypertension，2016（PMID 27402922）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/27402922/',
        note: '更早的 34 项试验、2028 人。作者写过因果效应。本页不采用这句，因为后来的汇总更谨慎。',
      },
      {
        label: 'Veronese 等，Nutrients，2021（PMID 34836329）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/34836329/',
        note: '糖尿病或高风险人群的血糖和胰岛素敏感性指标。不是发病、并发症或死亡。',
      },
      {
        label: 'Mah 与 Pitre，BMC Complement Med Ther，2021（PMID 33865376）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/33865376/',
        note: '151 名有失眠的老年人，3 项试验。证据质量低到极低。不是失眠治疗。',
      },
      {
        label: 'Mah 与 Pitre 的更正，2024（PMID 39702257）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/39702257/',
        note: '不是新试验。更正说明改的是措辞和检索计数，没有新的合并差值。',
      },
      {
        label: 'Garrison 等，Cochrane Database Syst Rev，2020（PMID 32956536）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/32956536/',
        note: '骨骼肌抽筋。老年人不太可能获得有临床意义的预防。没有运动相关抽筋的随机试验。',
      },
      {
        label: 'Makrides 等，Cochrane Database Syst Rev，2014（PMID 24696187）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/24696187/',
        note: '妊娠期口服镁。主要结局没有显著差异。没有足够的高质量证据表明有益。',
      },
      {
        label: 'Van Laecke，Acta Clin Belg，2019（PMID 30220246）',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30220246/',
        note: '叙述性综述。严重高镁血症几乎只见于肾功能明显下降并同时摄入较多镁的人。静脉用药不是口服补充剂。',
      },
      {
        label: '欧盟委员会条例 (EU) No 432/2012 合并文本（2025-08-20）',
        href: 'https://eur-lex.europa.eu/eli/reg/2012/432/2025-08-20/eng',
        note: '食品健康声称清单。镁有十句限定声称。不是降低疾病风险的声称，也不是药品批准。',
      },
      {
        label: '欧洲委员会科学委员会：镁的可耐受上限意见',
        href: 'https://ec.europa.eu/food/fs/sc/scf/out105_en.pdf',
        note: 'SCF/CS/NUT/UPPLEV/54 Final。易解离盐的上限不包括食物中的镁。严重肾功能损害是另一项风险。本页不抄数量。',
      },
      {
        label: 'FDA：镁与高血压风险的合格声称答复信',
        href: 'https://www.fda.gov/media/155304/download',
        note: '案卷 FDA-2016-Q-3770。证据不一致、没有定论。不是显著科学共识下的授权声称。',
      },
      {
        label: 'FDA constituent update（2022-01-10）',
        href: 'https://www.fda.gov/food/hfp-constituent-updates/fda-announces-qualified-health-claim-magnesium-and-reduced-risk-high-blood-pressure',
        note: '宣布上述执法裁量信。合格声称不是药品批准。',
      },
      {
        label: 'FDA：膳食补充剂',
        href: 'https://www.fda.gov/food/dietary-supplements',
        note: '补充剂不是药品。本链接不是那封答复信的原文。',
      },
      {
        label: 'GB 28050—2011 预包装食品营养标签通则',
        href: 'https://www.nhc.gov.cn/sps/c100088/201111/714fdca49f15450580fc03a2ee3163f9/files/1732844863395_24655.pdf',
        note: '附录 D.21 只有一句镁的功能声称。标准不适用于保健食品和特殊膳食用食品。',
      },
      {
        label: '国家卫生健康委：GB 28050—2025 问答',
        href: 'https://www.nhc.gov.cn/sps/c100087/202509/470fa4ff5de14dd38619223cce9da4e7.shtml',
        note: '2025-09-25。写明营养标签标准于 2027-03-16 实施。问答没有引用镁的声称原句。',
      },
    ],
    relatedHeading: '站内相关页',
    related: [
      { path: '/methodology', label: '证据如何核对与呈现' },
      { path: '/faq', label: '常见问题' },
      { path: '/products/evidence/nmn', label: '另一页成分证据：NMN / NR' },
      { path: '/products/evidence/omega-3', label: '另一页成分证据：EPA 与 DHA' },
      { path: '/products/evidence/vitamin-d', label: '另一页成分证据：维生素 D' },
      { path: '/products/evidence/creatine', label: '另一页成分证据：肌酸' },
      { path: '/products', label: '产品证据库：购买前如何核对' },
      { path: '/longevity-news/ln-static-2', label: '资讯：怎样给一篇论文分证据档' },
      { path: '/disclaimer', label: '健康与医疗免责声明' },
    ],
  },
  en: {
    kicker: 'Ingredient evidence · education',
    title: 'Magnesium: human evidence, regulation, and limits',
    updatedLabel: 'Updated',
    lead:
      'This page is about magnesium. Magnesium oxide, citrate, chloride, glycinate, sulfate, lactate, aspartate, hydroxide, and magnesium already present in food are different phrases. A sentence belongs only to the form a trial or a regulator names. This page does not treat those products as the same evidence. It is not a product page, it recommends no brand, and it gives no dose.',
    disclaimer:
      'For education only. It is not medical advice, a diagnosis, treatment, prevention, or a prescription. A difference on a blood-pressure cuff, a laboratory change, a permitted food claim, or a letter that calls the evidence inconsistent is not proof that a capsule treats hypertension, insomnia, cramps, or diabetes, guarantees sports performance, or slows aging. Do not stop a prescribed medicine because of this page.',
    sections: [
      {
        id: 'what',
        heading: 'Magnesium in food, a salt in a supplement, and a slogan are not one sentence',
        paragraphs: [
          'Magnesium is an essential mineral, and the kidneys take part in its balance. Serum magnesium is a laboratory measure. It is not blood pressure, a cramp count, sleep time, glucose, a fracture, or death. A higher or lower laboratory number is not itself a disease treated.',
          '“Sleep,” “no cramps,” “blood pressure,” “anti-aging,” and “sports performance” on a label are product claims. They are not a trial’s primary endpoint, and they are not a regulator’s finding that the product treats disease. This page does not set a use and does not decide whether one person should have a magnesium test.',
        ],
      },
      {
        id: 'evidence',
        heading: 'Human evidence, and where it stops',
        paragraphs: [
          'Argeros and colleagues’ 2025 systematic review and meta-analysis (PMID 41000008) included 38 randomized trials of at least 4 weeks and 2,709 participants. Median intervention was 12 weeks. Compared with placebo, the pooled difference was −2.81 mm Hg in systolic pressure (95% CI −4.32 to −1.29) and −2.05 mm Hg in diastolic pressure (95% CI −3.23 to −0.88). The difference was larger in hypertensive participants who were taking blood-pressure medicine, −7.68 and −2.96 mm Hg, and in a hypomagnesemia subgroup, −5.97 and −4.75 mm Hg. In normotensive groups, statistical significance was not reached. Heterogeneity was high. The authors found no dose-response relationship (all relevant P values at least 0.20) and wrote that the findings should be read with caution and that larger, clearer trials are needed. These are pooled differences on a blood-pressure measurement. They are not stroke, myocardial infarction, or death, not a target for a reader, and not a dose. This page does not repeat the intake range in the abstract. A larger difference in people already on medicine is not a reason to stop that medicine.',
          'Zhang and colleagues’ earlier 2016 meta-analysis (PMID 27402922) included 34 randomized, double-blind, placebo-controlled trials and 2,028 normotensive or hypertensive adults, with a median duration of 3 months. Systolic pressure was 2.00 mm Hg lower than placebo (95% CI 0.43 to 3.58) and diastolic pressure was 1.78 mm Hg lower (95% CI 0.73 to 2.82), with serum magnesium 0.05 mmol/L higher (95% CI 0.03 to 0.07). The authors wrote that the findings indicate a causal effect of magnesium supplementation on lowering blood pressure in adults, and also that residual heterogeneity might remain and that further trials were warranted. That causal sentence is theirs. This page does not adopt it. The 2025 pool has more trials, heterogeneity is still high, the normotensive subgroup was not significant, and there was no dose-response relationship. The 0.05 mmol/L figure is a pooled laboratory difference, not a target and not a dose. This page does not repeat the dose in the 2016 abstract.',
          'Veronese and colleagues’ 2021 systematic review and meta-analysis (PMID 34836329) asked a different question: whether oral magnesium differed from placebo on glucose and insulin-sensitivity measures in people with diabetes or at high risk of diabetes. The abstract reports lower fasting glucose in people with diabetes, a difference in plasma glucose and in glucose after a two-hour oral glucose tolerance test in people at high risk, and a difference in insulin-sensitivity markers. The word “treating” in the title refers to those metabolic measures. The abstract does not give a trial count, and this page does not fill one in. These are laboratory measures. They are not diabetes incidence, not complications, not death, and not a treatment from this page. A short-term marker change cannot be moved outside the people, the endpoint, the salt, and the setting that were studied. This page does not repeat a dose.',
          'Mah and Pitre’s 2021 systematic review and meta-analysis (PMID 33865376) is only about older adults with insomnia. Three randomized trials in three countries, 151 people, compared oral magnesium with placebo. Pooled sleep-onset latency was 17.36 minutes shorter (95% CI −27.27 to −7.44). The point estimate for total sleep time was 16.06 minutes longer and was not statistically significant. All trials were at moderate-to-high risk of bias, and the evidence was low to very low quality. The authors wrote that the literature was not good enough for a physician to make a well-informed recommendation. The abstract then says that, because oral magnesium is cheap and widely available, trial evidence may support its use for insomnia symptoms, and it prints an amount. This page does not adopt that sentence and does not copy the amount. The correction of 19 December 2024 (PMID 39702257) is not a new trial. The notice this page read changes an abbreviation, search counts, a database name, and asks that a phrase describing sleep parameters as already improved be deleted. It does not publish a new pooled estimate. This page therefore does not treat 17.36 minutes as insomnia treated, and it does not move the result to children, to people without insomnia, or to an anti-aging effect.',
          'Cramps are a separate question. Garrison and colleagues’ 2020 Cochrane review (PMID 32956536), an update of the 2012 review, included 11 trials and 735 people, with 118 crossover participants also serving as their own controls. For idiopathic cramps, largely in older adults (mean ages 61.6 to 69.3 years), differences in cramp frequency between magnesium and placebo were small, not statistically significant, and heterogeneity was minimal. The primary endpoint, percentage change from baseline in cramps per week at four weeks, had a mean difference of −9.59% (95% CI −23.14% to 3.97%; 3 studies, 177 participants; moderate certainty). The interval crosses no difference. The difference in cramps per week was −0.18 (95% CI −0.84 to 0.49; 5 studies, 307 participants). The review’s own conclusion is that magnesium supplementation is unlikely to provide clinically meaningful cramp prophylaxis to older adults experiencing skeletal muscle cramps. For pregnancy-associated rest cramps the literature is conflicting and further research is needed. No randomized trials of exercise-associated cramps, or of cramps in other disease states, were found, other than one small inconclusive study in liver cirrhosis. Minor adverse events that could be pooled were mostly gastrointestinal, for example diarrhoea. Those sentences belong to those trials. This page does not recommend magnesium to prevent cramps, does not turn it into a sports guarantee, and does not copy a dose.',
        ],
      },
      {
        id: 'regulation',
        heading: 'A permitted claim, or a qualified claim, is not an efficacy finding',
        paragraphs: [
          'European Union: the consolidated text of Commission Regulation (EU) No 432/2012, in the 20 August 2025 edition checked for this page, lists health claims that may be made on foods. Its title says the list is other than claims referring to the reduction of disease risk and to children’s development and health. Ten magnesium claims appear. Each may be used only for food which is at least a source of magnesium as referred to in Regulation (EC) No 1924/2006. This page does not copy the amount in that condition. The sentences are: magnesium contributes to a reduction of tiredness and fatigue; to electrolyte balance; to normal energy-yielding metabolism; to normal functioning of the nervous system; to normal muscle function; to normal protein synthesis; to normal psychological function; to the maintenance of normal bones; to the maintenance of normal teeth; and magnesium has a role in the process of cell division. The annex cites EFSA Journal 2009;7(9):1216 and 2010;8(10):1807. These are food claims. They are not cramp prevention, not a sports guarantee, not an anti-aging claim, and not a drug approval.',
          'United States: FDA’s response in docket FDA-2016-Q-3770 answers a petition to make a health claim about magnesium and a reduced risk of high blood pressure. The constituent update of 10 January 2022 announces that letter of enforcement discretion. FDA said the petitioner’s phrase “supportive but inconclusive” overstates the evidence. The letter says blood-pressure lowering in a minority of intervention studies is undermined by a larger body of evidence that found no effect, and that results were inconsistent in people with normal or elevated blood pressure, in hypertension, and in people who already had cardiovascular disease. FDA’s conclusion is that there is some credible evidence suggesting that magnesium from conventional foods and dietary supplements may reduce the risk of hypertension by lowering blood pressure, but the evidence is inconclusive and inconsistent. A qualified claim must still meet statutory requirements, with two stated exceptions: it need not meet the significant-scientific-agreement standard, and it need not be made under an authorizing regulation. It is therefore not an authorized health claim and not a drug approval. The three sentences for which FDA said it would consider enforcement discretion are: “Inconsistent and inconclusive scientific evidence suggests that diets with adequate magnesium may reduce the risk of high blood pressure (hypertension), a condition associated with many factors.” “Consuming diets with adequate magnesium may reduce the risk of high blood pressure (hypertension). However, FDA has concluded that the evidence is inconsistent and inconclusive.” “Some scientific evidence suggests that diets with adequate magnesium may reduce the risk of high blood pressure (hypertension), a condition associated with many factors. FDA has concluded that the scientific evidence supporting this claim is inconsistent and not conclusive.” The letter also states conditions of use, including how much magnesium a food would need to contain. This page does not copy those amounts. The 2025 blood-pressure meta-analysis is later than the letter, and it still reports high heterogeneity and a need for more trials. A later pool does not rewrite the letter into an authorized claim or a treatment. Dietary supplements are not drugs.',
          'China: GB 28050—2011, the nutrition-labelling standard for prepackaged foods, was issued by the Ministry of Health on 12 October 2011 and took effect on 1 January 2013. Appendix D.21 gives one standard sentence, in Chinese: 「镁是能量代谢、组织形成和骨骼发育的重要成分。」 A reading gloss, not an official English text of the standard, is that magnesium is an important component of energy metabolism, tissue formation, and bone development. The standard says it does not apply to nutrition labels on health foods or on prepackaged foods for special dietary uses. That is a nutrient-function sentence for a nutrition label. It is not a disease-treatment claim and not a finding that a capsule is approved. The National Health Commission’s questions and answers on GB 28050—2025, published on 25 September 2025, say the nutrition-labelling standard will take effect on 16 March 2027. Those questions and answers do not quote a magnesium claim, and this page does not copy magnesium sentences for the 2025 text from another website. Which edition a label uses is the standard that applies when the food is produced. This page does not decide whether a given magnesium product in China is a drug, a registered health food, or another legal identity. An EU food claim, a U.S. qualified claim, and a cross-border listing are not a Chinese drug license. A health food is not a drug and cannot replace drug treatment.',
        ],
      },
      {
        id: 'caution',
        heading: 'Who should be more cautious',
        paragraphs: [
          'Do not start a magnesium product from a marketing page or from this page in pregnancy or possible pregnancy, lactation, childhood or adolescence, with known kidney disease or reduced kidney function, or while taking a prescription medicine. Makrides and colleagues’ 2014 Cochrane review (PMID 24696187) included 10 trials and 9,090 pregnant women and their babies, comparing oral magnesium with control. Across all trials there was no significant difference in perinatal mortality (risk ratio 1.10, 95% CI 0.72 to 1.67; five trials, 5,903 infants), small-for-gestational age (0.76, 0.54 to 1.07; three trials, 1,291 infants), or pre-eclampsia (0.87, 0.58 to 1.32; three trials, 1,042 women). No trial reported maternal mortality. Among secondary outcomes, neonatal death before discharge had a risk ratio of 2.21 (95% CI 1.02 to 4.75; four trials, 5,373 infants). The review says one trial contributed more than 70 percent of the participants to that analysis, that the trial authors thought the severe congenital anomalies were unlikely to be attributable to magnesium, and that two sets of very-low-birthweight twins also died, so the result should be read with caution. Excluding deaths from severe congenital anomalies in that trial removed the increased risk. Only two of the ten trials were judged high quality overall. Restricted to those two, perinatal mortality, small-for-gestational age, and pre-eclampsia were not significantly different. The review’s conclusion is that there is not enough high-quality evidence to show that dietary magnesium supplementation during pregnancy is beneficial. This page does not turn a secondary outcome into a benefit and does not suggest starting magnesium in pregnancy from this page. Doses in the abstract are not copied.',
          'Van Laecke’s 2019 narrative review (PMID 30220246) is not a randomized trial. It says severe hypermagnesemia can be life-threatening but is almost exclusively seen in people with substantially decreased kidney function who also take in magnesium from supplements or from magnesium-containing cathartics or antacids. The same review says intravenous magnesium is used in hospital for torsades de pointes and pre-eclampsia, whether or not hypomagnesemia was already present. That is an intravenous medicine and a specific emergency. It is not an oral supplement and not a use a reader starts from this page. The European Commission Scientific Committee on Food opinion finalized on 11 October 2001 (SCF/CS/NUT/UPPLEV/54 Final, expressed on 26 September 2001) identifies mild diarrhoea as the most sensitive undesirable effect of readily dissociable magnesium salts. The upper level applies to those salts in supplements, water, or food and drink to which they are added. The opinion’s examples include chloride, sulphate, aspartate, lactate, and oxide. The level does not include magnesium normally present in foods and beverages. The opinion says this diarrhoea is reversible and is not a significant health risk when renal function is intact, and that severely impaired renal function is another risk factor for hypermagnesaemia. No upper level was set for ages 1 to 3. The opinion extends the adult level to pregnant and lactating women and to children from 4 years of age. That is not permission to start a product. The Cochrane pregnancy review still did not show a benefit on its primary outcomes. This page does not copy any number in the opinion.',
          'The same opinion says alkalinization of the urine can affect renal clearance of drugs that are weak acids or bases. This page does not turn that sentence into a list of medicines. The trials cited above do not finish the question of drug interactions. Silence about an interaction is not proof of safety. Do not stop a blood-pressure medicine or another prescribed medicine because of a difference in blood pressure, glucose, or a sleep measure. A trial of one magnesium salt is not established here as a substitute for another salt, or for magnesium in food.',
        ],
      },
      {
        id: 'boundary',
        heading: 'What must not be extrapolated',
        paragraphs: [
          'This page gives no dose, compares no brands, and does not link to a cart. A number in a paper, the FDA letter, the EU annex, or the upper-level opinion is a condition of that trial or that rule. It is not an instruction for a reader. A millimetre of mercury, or a minute of sleep latency, is not a target.',
          'The Argeros and Zhang blood-pressure pools are not treatment of hypertension and not prevention of stroke or myocardial infarction. FDA’s qualified claim is not an authorized health claim and not efficacy. The Veronese laboratory measures are not treatment of diabetes. The low-quality insomnia review is not treatment of insomnia and not an anti-aging effect. The Cochrane cramp review is not cramp prevention and not a sports guarantee. Its own sentence is that clinically meaningful prophylaxis is unlikely. The EU phrases “normal muscle function” and “cell division” are not those uses. The GB 28050—2011 nutrition-label sentence is not efficacy for a health food or a drug.',
          'The NMN / NR, EPA / DHA, vitamin D, and creatine pages use other evidence and the same limit: a study is not a product claim. None of these pages gives a dose.',
        ],
      },
    ],
    sourcesHeading: 'Public sources used on this page',
    sourcesNote:
      'Only abstracts, review conclusions, or agency pages that were checked are listed. Amounts in the trials, the letter, and the opinion are not copied into the body. The GB 28050—2025 questions and answers do not quote a magnesium claim, so this page quotes only the 2011 sentence it read.',
    sources: [
      {
        label: 'Argeros et al., Hypertension, 2025 (PMID 41000008)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/41000008/',
        note: '38 randomized trials of at least 4 weeks, 2,709 people. A pooled blood-pressure difference, no significant difference in normotensive groups, high heterogeneity, and no dose-response. Not a cardiovascular-event endpoint.',
      },
      {
        label: 'Zhang et al., Hypertension, 2016 (PMID 27402922)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/27402922/',
        note: 'Earlier pool of 34 trials and 2,028 people. The authors wrote a causal-effect sentence. This page does not adopt it, because the later pool is more cautious.',
      },
      {
        label: 'Veronese et al., Nutrients, 2021 (PMID 34836329)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/34836329/',
        note: 'Glucose and insulin-sensitivity measures in diabetes or high risk. Not incidence, complications, or death.',
      },
      {
        label: 'Mah and Pitre, BMC Complement Med Ther, 2021 (PMID 33865376)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/33865376/',
        note: '151 older adults with insomnia, three trials. Evidence low to very low quality. Not insomnia treatment.',
      },
      {
        label: 'Correction by Mah and Pitre, 2024 (PMID 39702257)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/39702257/',
        note: 'Not a new trial. The notice changes wording and search counts and does not give a new pooled estimate.',
      },
      {
        label: 'Garrison et al., Cochrane Database Syst Rev, 2020 (PMID 32956536)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/32956536/',
        note: 'Skeletal muscle cramps. Clinically meaningful prophylaxis is unlikely in older adults. No randomized trials of exercise-associated cramps.',
      },
      {
        label: 'Makrides et al., Cochrane Database Syst Rev, 2014 (PMID 24696187)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/24696187/',
        note: 'Oral magnesium in pregnancy. No significant difference on the primary outcomes. Not enough high-quality evidence of benefit.',
      },
      {
        label: 'Van Laecke, Acta Clin Belg, 2019 (PMID 30220246)',
        href: 'https://pubmed.ncbi.nlm.nih.gov/30220246/',
        note: 'Narrative review. Severe hypermagnesemia is almost exclusive to substantially decreased kidney function plus high intake. Intravenous use is not an oral supplement.',
      },
      {
        label: 'Consolidated Commission Regulation (EU) No 432/2012 (20 August 2025)',
        href: 'https://eur-lex.europa.eu/eli/reg/2012/432/2025-08-20/eng',
        note: 'The food health-claim list. Ten qualified magnesium claims. Not a disease-risk-reduction claim and not a drug approval.',
      },
      {
        label: 'Scientific Committee on Food opinion on the tolerable upper intake level of magnesium',
        href: 'https://ec.europa.eu/food/fs/sc/scf/out105_en.pdf',
        note: 'SCF/CS/NUT/UPPLEV/54 Final. The level for readily dissociable salts does not include magnesium in food. Severely impaired renal function is a separate risk. No number is copied here.',
      },
      {
        label: 'FDA response letter, qualified health claim on magnesium and high blood pressure',
        href: 'https://www.fda.gov/media/155304/download',
        note: 'Docket FDA-2016-Q-3770. Evidence inconsistent and inconclusive. Not an authorized claim under significant scientific agreement.',
      },
      {
        label: 'FDA constituent update (10 January 2022)',
        href: 'https://www.fda.gov/food/hfp-constituent-updates/fda-announces-qualified-health-claim-magnesium-and-reduced-risk-high-blood-pressure',
        note: 'Announces the enforcement-discretion letter. A qualified claim is not a drug approval.',
      },
      {
        label: 'FDA: dietary supplements',
        href: 'https://www.fda.gov/food/dietary-supplements',
        note: 'Supplements are not drugs. This link is not the text of the response letter.',
      },
      {
        label: 'GB 28050—2011 nutrition labelling of prepackaged foods',
        href: 'https://www.nhc.gov.cn/sps/c100088/201111/714fdca49f15450580fc03a2ee3163f9/files/1732844863395_24655.pdf',
        note: 'Appendix D.21 has one magnesium function sentence. The standard does not apply to health foods or foods for special dietary uses.',
      },
      {
        label: 'National Health Commission questions and answers on GB 28050—2025',
        href: 'https://www.nhc.gov.cn/sps/c100087/202509/470fa4ff5de14dd38619223cce9da4e7.shtml',
        note: '25 September 2025. States that the nutrition-labelling standard takes effect on 16 March 2027. It does not quote a magnesium claim.',
      },
    ],
    relatedHeading: 'On this site',
    related: [
      { path: '/methodology', label: 'How evidence is checked' },
      { path: '/faq', label: 'Questions' },
      { path: '/products/evidence/nmn', label: 'Other ingredient page: NMN / NR' },
      { path: '/products/evidence/omega-3', label: 'Other ingredient page: EPA and DHA' },
      { path: '/products/evidence/vitamin-d', label: 'Other ingredient page: vitamin D' },
      { path: '/products/evidence/creatine', label: 'Other ingredient page: creatine' },
      { path: '/products', label: 'Evidence library: how a claim is checked' },
      { path: '/longevity-news/ln-static-2', label: 'Insight: grading a paper' },
      { path: '/disclaimer', label: 'Health disclaimer' },
    ],
  },
}

export function getMagnesiumEvidencePage(lang) {
  const page = lang === 'en' ? PAGES.en : PAGES.zh
  return { ...page, faqs: getMagnesiumEvidenceFaqs(lang) }
}
