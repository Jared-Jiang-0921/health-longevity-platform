/**
 * 各模块「普通 / 标准 / 高级」可见性说明（与 Payment 权益口径对齐；不展示示例正文）
 */
const HINTS = {
  'health-skills': {
    zh: {
      title: '本模块内容分级',
      lead: '正式课程与资料按会员等级开放；示例与管理员上传区不对游客及其他会员展示。',
      tiers: {
        free: '部分免费课程与基础资料',
        standard: '大部分课程与系列视频',
        premium: '全部课程与专属资料',
      },
    },
    en: {
      title: 'Content by membership',
      lead: 'Courses and assets unlock by membership. Examples and admin upload UI are hidden from guests and members.',
      tiers: {
        free: 'Some free courses and basics',
        standard: 'Most courses and series videos',
        premium: 'All courses and exclusive assets',
      },
    },
    ar: {
      title: 'المحتوى حسب العضوية',
      lead: 'الدورات والملفات حسب مستوى العضوية. الأمثلة وواجهة الرفع للمسؤول مخفية عن الزوار والأعضاء.',
      tiers: {
        free: 'بعض الدورات المجانية والأساسيات',
        standard: 'معظم الدورات ومقاطع السلسلة',
        premium: 'كل الدورات والملفات الحصرية',
      },
    },
  },
  products: {
    zh: {
      title: '本模块内容分级',
      lead: '上架商品与证据资料按会员等级开放；示例商品与管理员上传区不对游客及其他会员展示。',
      tiers: {
        free: '大部分公开商品与基础介绍',
        standard: '标准会员专属商品与资料',
        premium: '高级会员专属商品与完整证据材料',
      },
    },
    en: {
      title: 'Content by membership',
      lead: 'Catalog items unlock by membership. Demo listings and admin upload UI are hidden from guests and members.',
      tiers: {
        free: 'Most public products and basics',
        standard: 'Standard-only products and assets',
        premium: 'Premium-only products and full evidence packs',
      },
    },
    ar: {
      title: 'المحتوى حسب العضوية',
      lead: 'عناصر الكتالوج حسب العضوية. العروض التجريبية وواجهة الرفع مخفية عن الزوار والأعضاء.',
      tiers: {
        free: 'معظم المنتجات العامة والأساسيات',
        standard: 'منتجات وملفات للأعضاء القياسيين',
        premium: 'منتجات ومواد أدلة حصرية للمميزين',
      },
    },
  },
  'longevity-news': {
    zh: {
      title: '本模块内容分级',
      lead: '正式资讯与资料按会员等级开放；示例条目与管理员上传区不对游客及其他会员展示。',
      tiers: {
        free: '大部分公开资讯摘要',
        standard: '标准会员专属栏目与深度解读',
        premium: '高级会员专属报告与完整资料',
      },
    },
    en: {
      title: 'Content by membership',
      lead: 'Editorial content unlocks by membership. Sample cards and admin upload UI are hidden from guests and members.',
      tiers: {
        free: 'Most public news summaries',
        standard: 'Standard-only columns and deep dives',
        premium: 'Premium reports and full assets',
      },
    },
    ar: {
      title: 'المحتوى حسب العضوية',
      lead: 'المحتوى التحريري حسب العضوية. البطاقات التجريبية وواجهة الرفع مخفية عن الزوار والأعضاء.',
      tiers: {
        free: 'معظم ملخصات الأخبار العامة',
        standard: 'أعمدة وتحليلات للأعضاء القياسيين',
        premium: 'تقارير وملفات حصرية للمميزين',
      },
    },
  },
  'tcm-prevention': {
    zh: {
      title: '本模块内容分级',
      lead: '治未病正式资料按会员等级开放；栏目规划示例与管理员上传区不对游客及其他会员展示。',
      tiers: {
        free: '模块介绍与定位说明',
        standard: '中草药单药、经典处方等全部治未病库',
        premium: '全部治未病内容与专属扩展资料',
      },
    },
    en: {
      title: 'Content by membership',
      lead: 'Preventive TCM library unlocks by membership. Planning samples and admin upload UI are hidden from guests and members.',
      tiers: {
        free: 'Module intro and positioning',
        standard: 'Full herb and classic-formula library',
        premium: 'Full library plus exclusive extensions',
      },
    },
    ar: {
      title: 'المحتوى حسب العضوية',
      lead: 'مكتبة الطب الوقائي حسب العضوية. عينات التخطيط وواجهة الرفع مخفية عن الزوار والأعضاء.',
      tiers: {
        free: 'مقدمة الوحدة وتحديد الموقع',
        standard: 'مكتبة الأعشاب والوصفات الكلاسيكية كاملة',
        premium: 'المكتبة كاملة مع امتدادات حصرية',
      },
    },
  },
  'translation-opportunities': {
    zh: {
      title: '本模块内容分级',
      lead: '转化与产业资料按会员等级开放；建议栏目示例与管理员上传区不对游客及其他会员展示。',
      tiers: {
        free: '部分公开趋势与入门说明',
        standard: '全部栏目与商业化方向资料',
        premium: '全部内容与专属研究/报告类资料',
      },
    },
    en: {
      title: 'Content by membership',
      lead: 'Commercialization assets unlock by membership. Suggested-column samples and admin upload UI are hidden from guests and members.',
      tiers: {
        free: 'Some public trends and primers',
        standard: 'All columns and commercialization materials',
        premium: 'Everything plus exclusive research packs',
      },
    },
    ar: {
      title: 'المحتوى حسب العضوية',
      lead: 'مواد التحويل حسب العضوية. عينات الأعمدة وواجهة الرفع مخفية عن الزوار والأعضاء.',
      tiers: {
        free: 'بعض الاتجاهات العامة والمقدمات',
        standard: 'كل الأعمدة ومواد التسويق',
        premium: 'الكل مع حزم بحث حصرية',
      },
    },
  },
  home: {
    zh: {
      title: '今日内容分级',
      lead: '首页正式策展将按资讯与产品会员等级开放；当前示例策展不对游客及其他会员展示。',
      tiers: {
        free: '部分公开前沿摘要与产品提示',
        standard: '标准会员策展与证据标注条目',
        premium: '高级会员专属策展与完整解读',
      },
    },
    en: {
      title: 'Today by membership',
      lead: 'Homepage curation will unlock by news/product membership. Sample curation is hidden from guests and members.',
      tiers: {
        free: 'Some public frontier and product tips',
        standard: 'Standard curated items with evidence tags',
        premium: 'Premium curation and full briefings',
      },
    },
    ar: {
      title: 'اليوم حسب العضوية',
      lead: 'محتوى الصفحة الرئيسية حسب العضوية. العينات مخفية عن الزوار والأعضاء.',
      tiers: {
        free: 'بعض الملخصات العامة ونصائح المنتجات',
        standard: 'عناصر منسقة للأعضاء القياسيين',
        premium: 'تنسيق وملخصات حصرية للمميزين',
      },
    },
  },
}

const UI = {
  zh: {
    login: '登录',
    register: '注册',
    upgrade: '升级会员',
  },
  en: {
    login: 'Login',
    register: 'Sign up',
    upgrade: 'Upgrade',
  },
  ar: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    upgrade: 'ترقية العضوية',
  },
}

export function getModuleAccessHint(moduleKey, lang = 'zh') {
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  const pack = HINTS[moduleKey]
  if (!pack) return null
  return pack[key] || pack.zh
}

export function getModuleAccessHintUi(lang = 'zh') {
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  return UI[key] || UI.zh
}
