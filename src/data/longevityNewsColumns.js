/**
 * 前沿医学资讯 — 正式栏目（上传亚类与会员阅读目录共用）
 * requiredLevel: 该栏目默认建议门槛（单条上传仍可单独覆盖）
 */
export const LONGEVITY_NEWS_COLUMNS = [
  {
    id: 'weekly-digest',
    label: '每周长寿研究速递',
    requiredLevel: 'free',
    blurb: {
      zh: '精选新近同行评审论文要点与适用边界',
      en: 'Curated takeaways from recent peer-reviewed papers',
      ar: 'ملخصات مختارة من أوراق محكمة حديثة',
    },
  },
  {
    id: 'evidence-explainer',
    label: '研究证据解读',
    requiredLevel: 'free',
    blurb: {
      zh: '把复杂研究转化为证据强度、局限与可读结论',
      en: 'Translate studies into evidence strength and limits',
      ar: 'ترجمة الدراسات إلى قوة دليل وحدود',
    },
  },
  {
    id: 'controversy-watch',
    label: '争议研究观察',
    requiredLevel: 'standard',
    blurb: {
      zh: '对热点干预保持审慎：区分机制研究与临床证据',
      en: 'Cautious coverage of hot interventions—mechanism vs clinical gap',
      ar: 'تغطية حذرة للتدخلات الساخنة',
    },
  },
  {
    id: 'trial-tracker',
    label: '临床试验追踪',
    requiredLevel: 'standard',
    blurb: {
      zh: '衰老与长寿相关试验注册与阶段性结果',
      en: 'Longevity-related trials: registries and milestones',
      ar: 'تجارب مرتبطة بطول العمر والسجلات',
    },
  },
  {
    id: 'guideline-updates',
    label: '指南与共识更新',
    requiredLevel: 'premium',
    blurb: {
      zh: '权威机构新版建议与证据等级变化',
      en: 'New or revised recommendations from authoritative bodies',
      ar: 'توصيات وإرشادات محدّثة من جهات موثوقة',
    },
  },
]

export const LONGEVITY_NEWS_COLUMN_LABELS = LONGEVITY_NEWS_COLUMNS.map((c) => c.label)

export function getLongevityNewsColumn(labelOrId) {
  const key = String(labelOrId || '').trim()
  return (
    LONGEVITY_NEWS_COLUMNS.find((c) => c.label === key || c.id === key) || null
  )
}

export function getLongevityNewsColumnBlurb(column, lang = 'zh') {
  if (!column?.blurb) return ''
  const k = lang === 'en' || lang === 'ar' ? lang : 'zh'
  return column.blurb[k] || column.blurb.zh
}
