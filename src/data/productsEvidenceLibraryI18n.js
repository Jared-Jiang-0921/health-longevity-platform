/**
 * 「长寿产品证据库」模块：定位、合规提示、类型与评分维度（Products / ProductDetail 共用）
 */
import { NMN_EVIDENCE_PATH } from './nmnEvidenceMeta.js'
import { OMEGA3_EVIDENCE_PATH } from './omega3EvidenceMeta.js'
import { VITAMIN_D_EVIDENCE_PATH } from './vitaminDEvidenceMeta.js'
import { CREATINE_EVIDENCE_PATH } from './creatineEvidenceMeta.js'
const COPY = {
  zh: {
    title: '长寿产品证据库',
    lead:
      '本模块商业化潜力大，但在证据表述与合规上容易踩坑。我们只提供证据梳理、监管信息与购买决策辅助，不把任何商品包装为疾病治疗方案；列表中的条目仍可能更新，请以监管机构与厂商最新披露为准。',
    roleDisclaimer:
      '本平台呈现的产品与成分信息属于健康教育与市场信息整理，不构成医疗建议、诊疗方案或对疗效的承诺；不能替代医生诊断、治疗或处方。',
    cnRegTitle: '中国市场合规提示',
    cnRegBody:
      '依据市场监管部门对网络经营保健食品的要求，平台须显著提示：保健食品不是药物，不能代替药物治疗疾病。选购时请阅读标签与说明书，勿将普通食品或保健食品当作药品使用。',
    intlTitle: '跨境与境外监管提示',
    intlBody:
      '美国 FDA 等机构持续发布与健康产品相关的警示与「健康欺诈」类公开信息；部分线上销售产品可能存在未经批准宣称、夸大预防/治疗疾病效果，或含有未申报成分等风险。跨境购买时请甄别销售渠道、标签与合规状态。',
    productTypesTitle: '可纳入梳理的产品类型（示例）',
    productTypes: [
      '营养补充剂',
      '检测服务',
      '可穿戴设备',
      '运动康复工具',
      '睡眠产品',
      '健康管理服务',
      '中医药食同源产品',
      '功能食品',
      '体检套餐等',
    ],
    checkTitle: '购买前如何核对',
    checkIntro:
      '这一页说明核对方法，不是在售清单。逐条商品、规格和购物详情仍只在站内目录里，没有公开永久链接，也不会写进站点地图。',
    checkSteps: [
      {
        title: '先把证据分层',
        body: '把材料分成三层：细胞或动物里的机制、人群里的观察关联、人体干预试验。只有第三层，而且终点和要回答的健康问题直接相关，才接近可以讨论临床意义。前两层最多说明这个问题值得继续研究。关联不是因果，标志物变化也不是发病或死亡这些硬终点。',
      },
      {
        title: '先看试验设计，再看广告',
        body: '优先看是否随机、是否有对照、主要终点是什么、样本量和随访时间。临床试验注册页只说明试验是否存在，不说明已经有效。单一公司新闻稿不能代替独立重复。',
      },
      {
        title: '核对监管身份，而不是宣传词',
        body: '把药品、保健食品、普通食品、膳食补充剂和化妆品原料分开。另一国家的补充剂身份、化妆品备案或申请被受理，都不等于境内口服产品已经获批，更不等于可以治疗疾病。保健食品不是药物，不能代替药物治疗疾病。',
      },
      {
        title: '写下不该自行开始的情形',
        body: '标签没写相互作用，不代表没有。妊娠、哺乳、儿童、肿瘤治疗、肝肾疾病、即将手术，以及正在使用处方药的人，不应凭商品页自行开始使用。本站不提供用量，也不把任何成分页写成治疗方案。',
      },
    ],
    boundaryTitle: '公开页到此为止',
    boundaryBody:
      '上面是核对方法。成分证据目前公开 NMN / NR、EPA/DHA、维生素 D 与肌酸四页，用来展示同一套边界：有哪些人体研究、限度在哪里、监管文件怎么读、哪些人应先问医生。其余商品详情保持不可抓取。',
    pilotLabel: '阅读 NMN / NR 成分证据',
    pilotPath: NMN_EVIDENCE_PATH,
    secondPilotLabel: '阅读 EPA 与 DHA 成分证据',
    secondPilotPath: OMEGA3_EVIDENCE_PATH,
    thirdPilotLabel: '阅读维生素 D 成分证据',
    thirdPilotPath: VITAMIN_D_EVIDENCE_PATH,
    fourthPilotLabel: '阅读肌酸成分证据',
    fourthPilotPath: CREATINE_EVIDENCE_PATH,
    scoringTitle: '核对时使用的信息维度',
    colDimension: '维度',
    colExplain: '说明',
    scoringRows: [
      { dimension: '证据等级', explain: '是否有系统综述、RCT、指南或专家共识等支持' },
      { dimension: '监管状态', explain: '注册、备案、认证或权威机构审批等可核验信息' },
      { dimension: '适用人群', explain: '如普通人、老年人、运动人群、代谢异常人群等' },
      { dimension: '风险提示', explain: '禁忌人群、药物相互作用、过量或误用风险' },
      { dimension: '性价比', explain: '单位剂量成本、长期使用成本等' },
      { dimension: '透明度', explain: '成分与剂量披露、检测报告、生产资质等可查证程度' },
    ],
    listFooterNote: '以下为示例商品卡片，便于演示结算流程；上线前请替换为经上述维度核验后的真实条目。',
  },
  en: {
    title: 'Longevity Product Evidence Library',
    lead:
      'High commercial upside, but easy to mis-step on claims and compliance. This area focuses on evidence summaries, regulatory context, and purchase decision support—never packaging a SKU as a disease treatment plan. Entries may change; rely on regulators and manufacturers for the latest disclosures.',
    roleDisclaimer:
      'Content here is educational market information, not medical advice or a treatment plan, and not a promise of therapeutic benefit. It does not replace a clinician’s diagnosis, treatment, or prescriptions.',
    cnRegTitle: 'China market labeling (health foods)',
    cnRegBody:
      'For health-food style products sold online in China, platforms should prominently state: health foods are not drugs and cannot replace drug therapy for diseases. Read labels and instructions; do not use foods or health foods as medicines.',
    intlTitle: 'Cross-border / overseas regulators',
    intlBody:
      'Agencies such as the FDA publish alerts and health-fraud related information. Some online products may carry unapproved claims, overstated disease prevention/treatment language, or undeclared ingredients. Check seller, labeling, and compliance when buying cross-border.',
    productTypesTitle: 'Example product categories',
    productTypes: [
      'Dietary supplements',
      'Testing services',
      'Wearables',
      'Rehab & movement tools',
      'Sleep products',
      'Health management services',
      'TCM food-medicine homologous items',
      'Functional foods',
      'Check-up bundles',
    ],
    checkTitle: 'How to check a claim before buying',
    checkIntro:
      'This page is the method, not a sales list. Individual products, variants, and shopping details stay in the in-app catalog. They have no public permalink and they are not in the sitemap.',
    checkSteps: [
      {
        title: 'Sort the evidence',
        body: 'Put a source in one of three layers: a mechanism in cells or animals, an association in people, or a human intervention trial. Only the third, and only when the endpoint matches the health question, is close to a clinical discussion. The first two at most say the question deserves more study. Association is not causation, and a biomarker is not a hard endpoint such as disease or death.',
      },
      {
        title: 'Read the trial before the advertisement',
        body: 'Look for randomization, a control, the primary endpoint, the sample size, and how long people were followed. A trial-registry page shows that a study exists. It does not show that the study worked. A company press release is not an independent replication.',
      },
      {
        title: 'Check the legal identity, not the slogan',
        body: 'Keep drugs, health foods, ordinary foods, dietary supplements, and cosmetic ingredients apart. A supplement status in another country, a cosmetic filing, or an application accepted for review is not approval of an oral product here, and it is not permission to treat disease. Health foods are not drugs and cannot replace drug treatment.',
      },
      {
        title: 'Write down who should not start from a product page',
        body: 'A label that is silent on interactions is not proof there are none. Pregnancy, lactation, children, cancer treatment, liver or kidney disease, upcoming surgery, and people on prescription medicines should not start a product from a listing. This site gives no dose and does not turn an ingredient page into a treatment plan.',
      },
    ],
    boundaryTitle: 'What stays public',
    boundaryBody:
      'The text above is the checking method. Four ingredient pages are public, NMN / NR, EPA/DHA, vitamin D, and creatine, and they use the same limits: which human studies exist, where they stop, how to read a regulator’s text, and who should ask a clinician first. Other product pages stay out of the crawlable corpus.',
    pilotLabel: 'Read the NMN / NR evidence page',
    pilotPath: NMN_EVIDENCE_PATH,
    secondPilotLabel: 'Read the EPA and DHA evidence page',
    secondPilotPath: OMEGA3_EVIDENCE_PATH,
    thirdPilotLabel: 'Read the vitamin D evidence page',
    thirdPilotPath: VITAMIN_D_EVIDENCE_PATH,
    fourthPilotLabel: 'Read the creatine evidence page',
    fourthPilotPath: CREATINE_EVIDENCE_PATH,
    scoringTitle: 'Dimensions used in a check',
    colDimension: 'Dimension',
    colExplain: 'What it covers',
    scoringRows: [
      { dimension: 'Evidence grade', explain: 'Systematic reviews, RCTs, guidelines, consensus statements, etc.' },
      { dimension: 'Regulatory status', explain: 'Registration, filing, certifications, or authority approvals you can verify' },
      { dimension: 'Who it fits', explain: 'General adults, older adults, athletes, metabolic risk groups, etc.' },
      { dimension: 'Risk notes', explain: 'Contraindications, drug interactions, overdose/misuse risks' },
      { dimension: 'Value', explain: 'Cost per active dose, long-run use cost' },
      { dimension: 'Transparency', explain: 'Ingredient/dose disclosure, test reports, manufacturing credentials' },
    ],
    listFooterNote: 'Cards below are demo listings for checkout wiring—replace with vetted items before production.',
  },
}

export function getProductsEvidenceCopy(lang) {
  const key = lang === 'en' ? lang : 'zh'
  return COPY[key] || COPY.zh
}
