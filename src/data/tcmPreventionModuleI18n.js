/**
 * 「治未病」模块：差异化定位、栏目规划与页面标签（中英阿）
 */
const COPY = {
  zh: {
    title: '中医药特色 · 治未病',
    differentiation:
      '许多健康长寿类站点偏重西方「抗衰老」叙事；本模块以中医治未病为根基，并与现代预防医学、生活方式医学对照融合，形成具有中国特色的差异化内容路径。',
    positioning:
      '以中医治未病思想为基础，结合现代预防医学和生活方式医学，帮助用户在疾病发生之前识别风险、调整状态、改善长期健康。',
    columnsTitle: '建议栏目（内容扩展方向）',
    colModule: '模块',
    colContent: '内容',
    columnRows: [
      { module: '体质识别', content: '平和质、气虚质、阳虚质、阴虚质、痰湿质等分型与调养要点（教育参考，非线上辨证结论）' },
      { module: '四季养生', content: '春养肝、夏养心、秋养肺、冬养肾等节律与起居要点' },
      { module: '饮食调养', content: '药食同源、节气饮食、脾胃养护与膳食原则' },
      { module: '情志调摄', content: '压力、睡眠、情绪与身心健康的传统认识与现代证据对照' },
      { module: '中医运动', content: '八段锦、太极、导引、站桩等可执行练习与注意事项' },
      { module: '中西医对照', content: '用现代语言解释治未病、整体观、辨证施养等核心概念' },
    ],
    bridgeTabs:
      '下方「中草药单药」「经典处方」为当前资料库；上表栏目将作为图文、课程或工具等形式逐步上线。呈现内容仅供健康教育参考，不替代个体辨证论治与执业医师处方。',
    herbs: '中草药单药',
    rx: '经典处方',
    herbsH2: '治未病相关中草药单药',
    rxH2: '中国传统经典治未病处方',
    dtProperty: '药性',
    dtEfficacy: '功效',
    dtSuitableFor: '适宜人群',
    dtCaution: '注意事项',
    dtSource: '出处',
  },
  en: {
    title: 'TCM · Preventive Care (治未病)',
    differentiation:
      'Many longevity sites lean heavily on Western “anti-aging” framing. Here we anchor on TCM preventive care (治未病) and pair it with modern preventive and lifestyle medicine for a distinctly Chinese-differentiated path.',
    positioning:
      'Grounded in TCM preventive thought, combined with modern preventive and lifestyle medicine, to help users spot risks, tune habits, and support long-term health before illness emerges.',
    columnsTitle: 'Planned columns',
    colModule: 'Track',
    colContent: 'What it covers',
    columnRows: [
      { module: 'Constitution patterns', content: 'Balanced, Qi-deficiency, Yang-deficiency, Yin-deficiency, phlegm-dampness, etc.—wellness cues (education only, not online diagnosis).' },
      { module: 'Seasonal care', content: 'Spring liver, summer heart, autumn lung, winter kidney—rhythm and daily living guidance.' },
      { module: 'Dietary tuning', content: 'Food-medicine homology, solar-term eating, spleen–stomach care.' },
      { module: 'Mind–emotion regulation', content: 'Stress, sleep, mood—classical views plus modern evidence context.' },
      { module: 'TCM movement', content: 'Baduanjin, tai chi, daoyin, standing practice—how-to and cautions.' },
      { module: 'East–West bridge', content: 'Plain-language explainers for 治未病, holism, and pattern-based wellness.' },
    ],
    bridgeTabs:
      'Tabs below list herbs and classical formulas today; the table above outlines future columns (articles, courses, tools). Content is educational—not a substitute for individualized pattern diagnosis or prescriptions.',
    herbs: 'Herbs',
    rx: 'Classical formulas',
    herbsH2: 'Single herbs for preventive TCM',
    rxH2: 'Classical preventive formulas',
    dtProperty: 'Nature/flavor',
    dtEfficacy: 'Traditional uses',
    dtSuitableFor: 'Who it may suit',
    dtCaution: 'Cautions',
    dtSource: 'Source',
  },
  ar: {
    title: 'الطب الصيني · الوقاية قبل المرض',
    differentiation:
      'كثير من مواقع طول العمر تركز على «مكافحة الشيخوخة» بمنظور غربي. هنا نركز على الوقاية الصينية قبل المرض ونربطها بالطب الوقائي الحديث وطب نمط الحياة لمسار مميز.',
    positioning:
      'قائم على فكر الوقاية في الطب الصيني، مع الوقاية الحديثة وطب نمط الحياة، لمساعدة المستخدم على رصد المخاطر وضبط الحالة قبل المرض.',
    columnsTitle: 'أعمدة مقترحة',
    colModule: 'المسار',
    colContent: 'المحتوى',
    columnRows: [
      { module: 'أنماط الجسم', content: 'مثل التوازن، نقص تشي، برودة يانغ، حرارة يين، بلغم-رطوبة—إرشادات تعليمية لا تشخيصاً عبر الإنترنت.' },
      { module: 'العناية الموسمية', content: 'كبد الربيع، قلب الصيف، رئة الخريف، كلية الشتاء.' },
      { module: 'التغذية', content: 'غذاء-دواء، أكل حسب الشمس، العناية بالطحال والمعدة.' },
      { module: 'الضغط والمزاج', content: 'الضغط والنوم والمزاج—نظرة تقليدية وسياق أدلة حديثة.' },
      { module: 'حركة صينية', content: 'بادوانجين، تاي تشي، دايوين، الوقوف—تنفيذ وتحذيرات.' },
      { module: 'جسر شرقي-غربي', content: 'شرح مبسط للوقاية قبل المرض والنظرة الشمولية والعناية حسب النمط.' },
    ],
    bridgeTabs:
      'علامات التبويب أدناه تعرض الأعشاب والوصفات حالياً؛ الجدول يصف توسعات لاحقة. المحتوى تعليمي وليس بديلاً عن التشخيص الفردي أو الوصفات.',
    herbs: 'الأعشاب',
    rx: 'وصفات كلاسيكية',
    herbsH2: 'أعشاب مفردة للوقاية',
    rxH2: 'وصفات وقائية كلاسيكية',
    dtProperty: 'الطبيعة/المذاق',
    dtEfficacy: 'الاستخدامات التقليدية',
    dtSuitableFor: 'من قد يناسبه',
    dtCaution: 'تحذيرات',
    dtSource: 'المصدر',
  },
}

export function getTcmPreventionModuleCopy(lang) {
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  return COPY[key] || COPY.zh
}
