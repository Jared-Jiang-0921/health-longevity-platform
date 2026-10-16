/**
 * 前沿医学资讯 — 首批正式稿（静态上线；后续以管理员上传 PDF/图文为主）
 * requiredMembership: free | standard | premium
 * 表述遵守「研究提示、非治疗结论」约定；外链尽量指向公开可检索页面。
 */
export const LONGEVITY_NEWS_ARTICLES = [
  {
    id: 'ln-static-1',
    column: '每周长寿研究速递',
    requiredMembership: 'free',
    publishedAt: '2026-07-01',
    title: '衰老细胞清除（Senolytics）：早期人体研究读什么、不读什么',
    summary:
      '部分小样本人体研究观察到达沙替尼联合槲皮素等方案对衰老相关标志物与体能指标的变化。当前证据仍 preliminarily：样本量有限、终点多为替代指标，远不足以支持「抗衰老用药」结论。',
    takeaways: [
      '优先关注试验设计（随机、对照、终点是否临床相关）',
      '媒体「逆转衰老」标题通常过度外推',
      '个体用药必须在执业医师评估下进行，本平台不做处方建议',
    ],
    sourceNote: '可检索关键词：senolytics human trial dasatinib quercetin（PubMed）',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=senolytics+human+trial',
  },
  {
    id: 'ln-static-2',
    column: '研究证据解读',
    requiredMembership: 'free',
    publishedAt: '2026-07-02',
    title: '如何给一篇长寿论文「定证据档」：机制、观察、干预三层',
    summary:
      '读前沿资讯时，建议把论文先归到三层：① 细胞/动物机制；② 人群观察关联；③ 人体干预试验。只有第③层且终点扎实，才更接近「可讨论临床意义」；前两层最多说明「值得继续研究」。',
    takeaways: [
      '关联 ≠ 因果：观察研究易受混杂因素影响',
      '替代终点（生物标志物）改善不等于硬终点（发病/死亡）改善',
      '本站默认表述：目前研究提示可能相关，但仍需更多高质量临床证据',
    ],
    sourceNote: '方法学参考：证据金字塔与临床试验分期（公开教材/Cochrane 介绍页）',
    url: 'https://www.cochrane.org/evidence',
  },
  {
    id: 'ln-static-3',
    column: '争议研究观察',
    requiredMembership: 'standard',
    publishedAt: '2026-07-03',
    title: 'NMN / NR 与「补 NAD+」叙事：证据缺口清单',
    summary:
      '烟酰胺单核苷酸（NMN）与烟酰胺核糖（NR）在动物与早期人体研究中被讨论用于影响 NAD+ 代谢。争议点在于：人体剂量、长期安全性、功能终点（体能、代谢病结局）是否稳健复现，以及商业宣传是否越过证据边界。',
    takeaways: [
      '「提升 NAD+」不等于已证明延长人类健康寿命',
      '关注注册试验与独立重复，而非单一公司新闻稿',
      '特殊人群（孕期、慢病、用药中）应先咨询医生',
    ],
    sourceNote: '可检索：nicotinamide riboside OR NMN clinical trial（PubMed / ClinicalTrials.gov）',
    url: 'https://clinicaltrials.gov/search?term=NMN%20OR%20nicotinamide%20riboside',
  },
  {
    id: 'ln-static-4',
    column: '临床试验追踪',
    requiredMembership: 'standard',
    publishedAt: '2026-07-04',
    title: '如何用 ClinicalTrials.gov 跟踪「衰老/长寿」相关试验',
    summary:
      '公开试验注册库可用来核对：是否在招募、主要终点是什么、有无结果摘要。建议用 aging / senescence / longevity / rapamycin 等词组合检索，并记录 NCT 编号以便复查更新。',
    takeaways: [
      '「正在进行」≠「已证明有效」',
      '优先看主要终点与样本量，再看媒体解读',
      '结果未发表前，避免把注册页当成疗效证据',
    ],
    sourceNote: 'ClinicalTrials.gov',
    url: 'https://clinicaltrials.gov/',
  },
  {
    id: 'ln-static-5',
    column: '指南与共识更新',
    requiredMembership: 'premium',
    publishedAt: '2026-07-05',
    title: '把「指南更新」读成行动清单：适用人群、证据等级、本地化',
    summary:
      '卫健与学会指南通常比单篇前沿论文更适合指导公共卫生与临床路径，但仍受发布地区、适用人群与更新周期限制。阅读时建议同时记下：推荐强度、证据质量，以及是否已被你所在地区监管/学会采纳。',
    takeaways: [
      '指南服务的是群体路径，不能替代个体诊疗',
      '跨国指南迁移到本地前，需考虑可及性与监管差异',
      '本栏目后续将跟进公开可检索的权威更新摘要',
    ],
    sourceNote: '示例入口：WHO 指南库（公开）',
    url: 'https://www.who.int/publications/who-guidelines',
  },
]

const ARTICLE_I18N = {
  en: {
    'ln-static-1': {
      title: 'Senolytics: what early human studies do and do not show',
      summary:
        'Some small human studies have looked at changes in aging-related markers and physical measures with regimens such as dasatinib plus quercetin. The evidence is still preliminary: samples are small, and most endpoints are surrogates. That is not enough to call these drugs anti-aging medicines.',
      takeaways: [
        'Look first at the design: randomized, controlled, and whether the endpoint matters clinically',
        'Headlines about “reversing aging” usually overreach',
        'Any personal use of a drug needs a licensed clinician. This site does not prescribe',
      ],
      sourceNote: 'Search terms: senolytics human trial dasatinib quercetin (PubMed)',
    },
    'ln-static-2': {
      title: 'How to grade a longevity paper: mechanism, observation, intervention',
      summary:
        'Sort a paper into three layers: (1) a cell or animal mechanism; (2) an association in people; (3) a human intervention trial. Only layer 3, with a solid endpoint, is close to a discussion of clinical meaning. The first two at most say the question is worth more study.',
      takeaways: [
        'Association is not causation. Observational studies are open to confounding',
        'A better biomarker is not the same as a better hard endpoint, such as disease or death',
        'Default wording here: current research suggests a possible link, and higher-quality clinical evidence is still needed',
      ],
      sourceNote: 'Methods background: the evidence pyramid and trial phases (public teaching pages / Cochrane)',
    },
    'ln-static-3': {
      title: 'NMN, NR, and the “NAD+ boost” story: where the evidence is thin',
      summary:
        'Nicotinamide mononucleotide (NMN) and nicotinamide riboside (NR) are discussed in animal work and early human studies for effects on NAD+ metabolism. Open questions include human dose, long-term safety, whether functional endpoints such as fitness or metabolic-disease outcomes replicate, and whether marketing goes past the evidence.',
      takeaways: [
        'Raising NAD+ is not proof of a longer healthy human life',
        'Prefer registered trials and independent replication over a single company press release',
        'Pregnancy, chronic illness, and people already on medicines should ask a clinician first',
      ],
      sourceNote: 'Search: nicotinamide riboside OR NMN clinical trial (PubMed / ClinicalTrials.gov)',
    },
    'ln-static-4': {
      title: 'How to follow aging and longevity trials on ClinicalTrials.gov',
      summary:
        'A public registry can show whether a trial is recruiting, what the primary endpoint is, and whether a results summary exists. Search combinations such as aging, senescence, longevity, and rapamycin, and keep the NCT number so you can check for updates.',
      takeaways: [
        'Ongoing is not the same as proven effective',
        'Read the primary endpoint and the sample size before the press coverage',
        'Until results are published, do not treat the registry page as evidence of benefit',
      ],
      sourceNote: 'ClinicalTrials.gov',
    },
    'ln-static-5': {
      title: 'Reading a guideline update: who it applies to, evidence grade, local use',
      summary:
        'Health-authority and society guidelines usually guide public-health and clinical pathways more than a single frontier paper does. They are still limited by region, population, and how often they are updated. Note the strength of the recommendation, the quality of the evidence, and whether your local regulator or society has adopted it.',
      takeaways: [
        'A guideline is a path for a population. It does not replace care for one person',
        'Moving a guideline across countries needs a check on access and regulation',
        'This column will follow publicly retrievable updates from authoritative bodies',
      ],
      sourceNote: 'Example entry: the WHO guidelines library (public)',
    },
  },
  ar: {
    'ln-static-1': {
      title: 'إزالة الخلايا الهرمة: ماذا تُظهر الدراسات البشرية المبكرة وماذا لا تُظهر',
      summary:
        'رصدت بعض الدراسات البشرية الصغيرة تغيّر واسمات مرتبطة بالشيخوخة ومقاييس بدنية مع نظم مثل داساتينيب مع كيرسيتين. الدليل ما زال أوليًا: العينات صغيرة، وأكثر النهايات بديلة. هذا لا يكفي لاستنتاج أنها أدوية مضادة للشيخوخة.',
      takeaways: [
        'انظر أولًا إلى التصميم: عشوائي، وله شاهد، وهل النهاية مهمة سريريًا',
        'عناوين «عكس الشيخوخة» غالبًا تبالغ',
        'أي استخدام شخصي لدواء يحتاج طبيبًا مرخّصًا. هذا الموقع لا يصف دواء',
      ],
      sourceNote: 'كلمات البحث: senolytics human trial dasatinib quercetin (PubMed)',
    },
    'ln-static-2': {
      title: 'كيف تُقدّر ورقة عن طول العمر: آلية، ملاحظة، تدخل',
      summary:
        'رتّب الورقة في ثلاث طبقات: (1) آلية في خلية أو حيوان؛ (2) ارتباط في البشر؛ (3) تجربة تدخل على البشر. الطبقة الثالثة فقط، مع نهاية صلبة، تقترب من نقاش المعنى السريري. الطبقتان الأوليان تقولان على الأكثر إن السؤال يستحق مزيدًا من البحث.',
      takeaways: [
        'الارتباط ليس سببية. الدراسات الرصدية عرضة للخلط',
        'تحسّن واسم حيوي ليس تحسّن نهاية صلبة مثل المرض أو الوفاة',
        'الصياغة هنا: البحث الحالي يشير إلى صلة ممكنة، وما زال يلزم دليل سريري أعلى جودة',
      ],
      sourceNote: 'خلفية المنهج: هرم الأدلة ومراحل التجارب (صفحات تعليمية عامة / Cochrane)',
    },
    'ln-static-3': {
      title: 'NMN وNR وقصة «رفع NAD+»: أين يرقّ الدليل',
      summary:
        'يُناقش أحادي نيوكليوتيد النيكوتيناميد (NMN) وريبوزيد النيكوتيناميد (NR) في عمل حيواني ودراسات بشرية مبكرة لأثرهما على أيض NAD+. الأسئلة المفتوحة: الجرعة البشرية، والسلامة طويلة الأمد، وهل تتكرر النهايات الوظيفية مثل اللياقة أو حصائل المرض الأيضي، وهل يجاوز التسويق الدليل.',
      takeaways: [
        'رفع NAD+ ليس دليلًا على عمر بشري صحي أطول',
        'فضّل التجارب المسجّلة والتكرار المستقل على بيان شركة واحد',
        'الحمل والمرض المزمن ومن يتناول دواءً يسأل الطبيب أولًا',
      ],
      sourceNote: 'بحث: nicotinamide riboside OR NMN clinical trial (PubMed / ClinicalTrials.gov)',
    },
    'ln-static-4': {
      title: 'كيف تتابع تجارب الشيخوخة وطول العمر على ClinicalTrials.gov',
      summary:
        'يُظهر سجل عام ما إذا كانت التجربة تجنّد، وما النهاية الأولية، وهل يوجد ملخص نتائج. ابحث بتركيبات مثل aging وsenescence وlongevity وrapamycin، واحتفظ برقم NCT لمراجعة التحديث.',
      takeaways: [
        '«جارية» ليست «ثبتت فعاليتها»',
        'اقرأ النهاية الأولية وحجم العينة قبل التغطية الصحفية',
        'قبل نشر النتائج، لا تعامل صفحة التسجيل كدليل على الفائدة',
      ],
      sourceNote: 'ClinicalTrials.gov',
    },
    'ln-static-5': {
      title: 'قراءة تحديث إرشادي: لمن ينطبق، ودرجة الدليل، والاستخدام المحلي',
      summary:
        'إرشادات الجهات الصحية والجمعيات توجه عادة مسار الصحة العامة والعيادة أكثر من ورقة واحدة. لكنها تبقى محدودة بالمنطقة والسكان ودورة التحديث. دوّن قوة التوصية وجودة الدليل، وهل تبنّتها جهة التنظيم أو الجمعية حيث تعيش.',
      takeaways: [
        'الإرشاد مسار لجماعة. لا يغني عن رعاية شخص بعينه',
        'نقل إرشاد بين البلدان يحتاج فحص الإتاحة والتنظيم',
        'سيتابع هذا العمود التحديثات العلنية من جهات موثوقة',
      ],
      sourceNote: 'مدخل مثال: مكتبة إرشادات منظمة الصحة العالمية (علنية)',
    },
  },
}

export function getLongevityNewsArticles() {
  return LONGEVITY_NEWS_ARTICLES.slice()
}

export function articleDisplay(article, lang = 'zh') {
  if (!article) return { title: '', summary: '', takeaways: [], sourceNote: '', zhOnly: false }
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  if (key === 'zh') {
    return {
      title: article.title || '',
      summary: article.summary || '',
      takeaways: article.takeaways || [],
      sourceNote: article.sourceNote || '',
      zhOnly: false,
    }
  }
  const pack = ARTICLE_I18N[key]?.[article.id]
  if (!pack) {
    return {
      title: article.title || '',
      summary: article.summary || '',
      takeaways: article.takeaways || [],
      sourceNote: article.sourceNote || '',
      zhOnly: true,
    }
  }
  return {
    title: pack.title || article.title || '',
    summary: pack.summary || article.summary || '',
    takeaways: pack.takeaways || article.takeaways || [],
    sourceNote: pack.sourceNote || article.sourceNote || '',
    zhOnly: false,
  }
}
