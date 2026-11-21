/**
 * 前沿医学资讯 — 正式栏目（上传亚类与会员阅读目录共用）
 * requiredLevel: 该栏目默认建议门槛（单条上传仍可单独覆盖）
 */
export const LONGEVITY_NEWS_COLUMNS = [
  {
    id: 'weekly-digest',
    label: '每周长寿研究速递',
    names: { en: 'Weekly longevity digest' },
    requiredLevel: 'free',
    blurb: {
      zh: '精选新近同行评审论文要点与适用边界',
      en: 'Curated takeaways from recent peer-reviewed papers',
    },
  },
  {
    id: 'evidence-explainer',
    label: '研究证据解读',
    names: { en: 'Evidence explainers' },
    requiredLevel: 'free',
    blurb: {
      zh: '把复杂研究转化为证据强度、局限与可读结论',
      en: 'Translate studies into evidence strength and limits',
    },
  },
  {
    id: 'controversy-watch',
    label: '争议研究观察',
    names: { en: 'Controversy watch' },
    requiredLevel: 'standard',
    blurb: {
      zh: '对热点干预保持审慎：区分机制研究与临床证据',
      en: 'Cautious coverage of hot interventions—mechanism vs clinical gap',
    },
  },
  {
    id: 'trial-tracker',
    label: '临床试验追踪',
    names: { en: 'Trial tracker' },
    requiredLevel: 'standard',
    blurb: {
      zh: '衰老与长寿相关试验注册与阶段性结果',
      en: 'Longevity-related trials: registries and milestones',
    },
  },
  {
    id: 'guideline-updates',
    label: '指南与共识更新',
    names: { en: 'Guideline updates' },
    requiredLevel: 'premium',
    blurb: {
      zh: '权威机构新版建议与证据等级变化',
      en: 'New or revised recommendations from authoritative bodies',
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

/** 展示名。存储键仍是中文 label。 */
export function columnDisplayLabel(labelOrId, lang = 'zh') {
  const column = labelOrId && typeof labelOrId === 'object'
    ? labelOrId
    : getLongevityNewsColumn(labelOrId)
  if (!column) return String(labelOrId || '')
  if (!lang || lang === 'zh') return column.label
  return column.names?.[lang] || column.label
}

export function getLongevityNewsColumnBlurb(column, lang = 'zh') {
  if (!column?.blurb) return ''
  const k = lang === 'en' ? lang : 'zh'
  return column.blurb[k] || column.blurb.zh
}
