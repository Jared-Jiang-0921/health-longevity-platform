/**
 * 「前沿医学资讯」模块：定位、来源、栏目与证据表述（LongevityNews 页共用）
 */
const COPY = {
  zh: {
    title: '前沿医学资讯',
    lead:
      '围绕经同行评审的文献与权威机构公开信息做精选与解读，帮助建立证据层级意识。正式稿按栏目上线：先选栏目，再点开单篇阅读；管理员可继续上传 PDF/图文归档到对应栏目。',
    sourcesTitle: '内容来源（示例）',
    sourcesBody:
      'PubMed；Nature、Science、Cell、The Lancet、NEJM、JAMA、BMJ 等学术期刊与子刊；Cochrane 系统综述；WHO、FDA、NMPA 等监管机构公开信息；国家卫健委、中华医学会等发布的指南与共识（以公开可检索版本为准）。',
    caveatTitle: '证据表述约定',
    caveatPhrase:
      '目前研究提示可能相关，但仍需要更多高质量临床证据验证。请勿将单篇前沿研究或媒体报道直接理解为「已在人体证实有效」的治疗结论。',
    columnsTitle: '建议栏目结构',
    colColumn: '栏目',
    colContent: '内容',
    columnRows: [
      { column: '每周长寿研究速递', content: '总结最新论文要点与适用边界' },
      { column: '研究证据解读', content: '把复杂论文转化为大众可理解的证据强度与局限' },
      { column: '争议研究观察', content: '对 NMN、二甲双胍、雷帕霉素、干细胞、外泌体等热点保持审慎，区分机制研究与临床证据差距' },
      { column: '临床试验追踪', content: '跟踪正在进行的长寿与衰老相关临床试验注册信息与阶段性结果' },
      { column: '指南与共识更新', content: '关注权威机构发布的新版建议与证据等级变化' },
    ],
    listIntro: '以下为示例条目（演示排版与外链形态），后续将按上表栏目与证据约定替换为真实策划稿。',
  },
  en: {
    title: 'Frontier Medical Insights',
    lead:
      'Curated interpretation of peer-reviewed literature and authoritative public sources. Browse by column, then open each piece. Admins can upload PDFs and media into the matching column.',
    sourcesTitle: 'Sources (examples)',
    sourcesBody:
      'PubMed; journals such as Nature, Science, Cell, The Lancet, NEJM, JAMA, BMJ and their family titles; Cochrane reviews; regulator communications (e.g., WHO, FDA, NMPA); national guidelines and society consensus where publicly retrievable.',
    caveatTitle: 'How we phrase evidence',
    caveatPhrase:
      'Current research suggests possible relevance, but higher-quality clinical evidence is still needed. Do not treat a single frontier paper or headline as proof of efficacy in humans.',
    columnsTitle: 'Planned columns',
    colColumn: 'Column',
    colContent: 'Focus',
    columnRows: [
      { column: 'Weekly longevity digest', content: 'Short takeaways from new papers with scope and limits' },
      { column: 'Evidence explainers', content: 'Translate complex studies into strength-of-evidence and caveats' },
      { column: 'Controversy watch', content: 'Cautious coverage of NMN, metformin, rapamycin, stem cells, exosomes, etc.—mechanism vs. clinical gap' },
      { column: 'Trial tracker', content: 'Ongoing longevity-related trials: registries and milestone readouts' },
      { column: 'Guideline updates', content: 'New or revised recommendations from authoritative bodies' },
    ],
    listIntro: 'Cards below are placeholders for layout; replace with editorial content following the plan above.',
  },
  ar: {
    title: 'مستجدات طبية رائدة',
    lead:
      'تلخيص وقراءة منظّمة للأدبيات المحكمة والمصادر الرسمية. تصفّح حسب العمود ثم افتح كل مقال. يمكن للمسؤولين رفع ملفات إلى العمود المناسب.',
    sourcesTitle: 'مصادر (أمثلة)',
    sourcesBody:
      'PubMed؛ دوريات مثل Nature وScience وCell وThe Lancet وNEJM وJAMA وBMJ؛ مراجعات كوكران؛ تعاميم منظمات مثل WHO وFDA وNMPA؛ إرشادات وطنية وجمعيات عند توفرها علناً.',
    caveatTitle: 'صياغة الأدلة',
    caveatPhrase:
      'البحث الحالي يشير إلى احتمال صلة، لكن يلزم المزيد من أدلة سريرية عالية الجودة. لا تعامل ورقة واحدة أو عنواناً إعلامياً كدليل على الفعالية في الإنسان.',
    columnsTitle: 'هيكل أعمدة مقترح',
    colColumn: 'العمود',
    colContent: 'المحتوى',
    columnRows: [
      { column: 'ملخص أسبوعي', content: 'تلخيص أحدث الأوراق مع حدود التطبيق' },
      { column: 'شرح الأدلة', content: 'ترجمة الدراسات المعقدة إلى قوة دليل وقيود' },
      { column: 'مراقبة الجدل', content: 'حذر مع NMN وميتفورمين ورابامايسين والخلايا الجذعية والحويصلات الخارجية' },
      { column: 'متابعة التجارب', content: 'تجارب طول العمر الجارية والسجلات والمراحل' },
      { column: 'تحديثات الإرشادات', content: 'توصيات جديدة أو معدّلة من جهات موثوقة' },
    ],
    listIntro: 'البطاقات أدناه للعرض التجريبي—استبدلها بمحتوى تحريري لاحقاً.',
  },
}

export function getLongevityNewsModuleCopy(lang) {
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  return COPY[key] || COPY.zh
}
