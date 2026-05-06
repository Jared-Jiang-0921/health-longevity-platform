/**
 * 「长寿产品证据库」模块：定位、合规提示、类型与评分维度（Products / ProductDetail 共用）
 */
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
    scoringTitle: '建议自建的产品信息与评分维度（示例）',
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
    scoringTitle: 'Suggested internal scoring dimensions',
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
  ar: {
    title: 'مكتبة أدلة منتجات طول العمر',
    lead:
      'فرص تجارية كبيرة لكن سهلة الأخطاء في المطالبات والامتثال. نركز على تلخيص الأدلة والسياق التنظيمي ودعم قرار الشراء دون تقديم أي منتج كخطة علاجية للأمراض. قد تتغير القائمة؛ اعتمد على أحدث إفصاحات الجهات والمصنعين.',
    roleDisclaimer:
      'المحتوى تعليمي ومعلومات سوقية وليس نصيحة طبية أو خطة علاج أو وعداً علاجياً، ولا يحل محل تشخيص أو علاج أو وصفات الطبيب.',
    cnRegTitle: 'تسميات سوق الصين (الأغذية الصحية)',
    cnRegBody:
      'يجب إبراز أن الأغذية الصحية ليست أدوية ولا يمكن أن تحل محل العلاج الدوائي للأمراض. اقرأ الملصقات والنشرات ولا تستخدم الغذاء كدواء.',
    intlTitle: 'الجهات التنظيمية والحدود الدولية',
    intlBody:
      'تنشر جهات مثل FDA تحذيرات وحالات احتيال صحي محتملة؛ قد تحمل بعض المنتجات عبر الإنترنت مطالبات غير مصرح بها أو مكونات غير معلنة. تحقق من البائع والملصق والامتثال عند الشراء عبر الحدود.',
    productTypesTitle: 'أمثلة لفئات المنتجات',
    productTypes: [
      'مكملات غذائية',
      'خدمات فحص',
      'أجهزة قابلة للارتداء',
      'أدوات إعادة تأهيل وحركة',
      'منتجات النوم',
      'خدمات إدارة الصحة',
      'عناصر طب صيني تقليدي غذاء-دواء',
      'أغذية وظيفية',
      'حزم فحوصات',
    ],
    scoringTitle: 'أبعاد تقييم داخلية مقترحة',
    colDimension: 'البعد',
    colExplain: 'المعنى',
    scoringRows: [
      { dimension: 'درجة الدليل', explain: 'مراجعات منهجية، RCT، إرشادات، إجماع خبراء' },
      { dimension: 'الوضع التنظيمي', explain: 'تسجيل، إيداع، شهادات، موافقات يمكن التحقق منها' },
      { dimension: 'الفئة المناسبة', explain: 'عامة، كبار سن، رياضيون، مخاطر أيضية…' },
      { dimension: 'مخاطر', explain: 'موانع، تفاعلات دوائية، جرعات زائدة' },
      { dimension: 'القيمة', explain: 'تكلفة لكل جرعة فعالة، تكلفة الاستخدام الطويل' },
      { dimension: 'الشفافية', explain: 'إفصاح المكونات والجرعات، تقارير فحص، مؤهلات التصنيع' },
    ],
    listFooterNote: 'البطاقات أدناه للعرض التجريبي لمسار الدفع—استبدلها بعناصر مُدقّقة قبل الإطلاق.',
  },
}

export function getProductsEvidenceCopy(lang) {
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  return COPY[key] || COPY.zh
}
