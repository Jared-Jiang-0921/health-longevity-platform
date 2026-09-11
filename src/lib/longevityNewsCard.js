/**
 * 把公众号链接稿收成可检索卡片：标题、关键词、摘要。
 * 微信不允许转载全文，本站只归档主题词与要点。
 */

const LEXICON = [
  'DNA甲基化', '甲基化时钟', '甲基化', '表观遗传衰老', '表观遗传', '衰老时钟', '生物年龄', '生物韧性',
  '衰老细胞', '僵尸细胞', '细胞衰老', '细胞重编程', '超级干细胞', '干细胞外泌体', '外泌体', '干细胞',
  '端粒酶', '端粒缩短', '端粒',
  '烟酰胺单核苷酸', '烟酰胺核糖', 'NAD⁺', 'NAD+',
  '司美格鲁肽', '二甲双胍', '雷帕霉素', '阿司匹林', '氨基葡萄糖',
  '维生素D3', '维生素D', '维生素A', '胡萝卜素',
  'Omega-3', 'omega-3', '鱼油', 'DHA', 'EPA',
  '白藜芦醇', '辅酶Q10', '谷胱甘肽', '硫辛酸', '褪黑素', '虾青素', '番茄红素',
  '绿原酸', '柚皮素', '杨梅素', '类黄酮', '原花青素', '茶红素', '银杏叶',
  '南非醉茄', '大豆异黄酮', '石榴籽油',
  '间歇性禁食', '禁食', '昼夜节律', '生物钟',
  '阿尔茨海默', '痴呆', '认知训练', '认知下降',
  '脂肪肝', '线粒体', '肠道菌群', '肠道', '卵巢', '肌肉衰老', '握力',
  '随机对照', '随机试验', '系统综述', '临床试验',
  'Nature Aging', 'Nature Medicine', 'Nature Communications', 'JAMA Neurology',
  'Protein & Cell', 'Aging Cell', 'Science', 'Nature', 'Cell', '柳叶刀', 'Lancet',
  'ClinicalTrials', 'PubMed', 'WHO', 'FDA', 'NIH', 'NMPA',
  'Klotho', 'SIRT6', 'APOE4', 'DunedinPACE', 'NMN', 'NR4A1', 'GABA', 'NAC', 'HMB',
  'Zone 2', 'RCT', '运动', '睡眠', '抗衰老', '自噬', '队列研究', '大脑衰老',
]

const GENERIC_SUMMARY = /来自公众号|打开微信原文|完整内容以微信/

export function isGenericNewsSummary(summary) {
  const s = String(summary || '').trim()
  if (!s) return true
  return GENERIC_SUMMARY.test(s)
}

export function newsCardExcerpt(summary) {
  const s = String(summary || '').trim()
  if (!s || isGenericNewsSummary(s)) return ''
  return s
}

function canonicalize(term) {
  const t = String(term || '').trim()
  if (!t) return ''
  if (/^nad\+?$/i.test(t) || t === 'NAD⁺') return 'NAD+'
  if (/^omega-?3$/i.test(t)) return 'Omega-3'
  if (/^nmn$/i.test(t)) return 'NMN'
  if (/^rct$/i.test(t)) return 'RCT'
  return t
}

export function extractLongevityKeywords(title, summary = '') {
  const text = `${title || ''} ${isGenericNewsSummary(summary) ? '' : summary || ''}`
  const found = []
  const seen = new Set()

  const push = (raw) => {
    const term = canonicalize(raw)
    if (!term || term.length < 2) return
    const key = term.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    found.push(term)
  }

  const sorted = [...LEXICON].sort((a, b) => b.length - a.length)
  for (const term of sorted) {
    const ascii = !/[\u4e00-\u9fff]/.test(term)
    if (ascii) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (new RegExp(`(?:^|[^A-Za-z0-9])${escaped}(?:[^A-Za-z0-9]|$)`, 'i').test(text)) push(term)
    } else if (text.includes(term)) {
      push(term)
    }
  }

  for (const m of text.matchAll(/《([^》]{2,40})》/g)) push(m[1])
  for (const m of text.matchAll(/【([^】]{2,20})】/g)) push(m[1])
  for (const m of text.matchAll(/\b([A-Z][A-Z0-9+]{2,11})\b/g)) {
    if (!['THE', 'AND', 'FOR'].includes(m[1])) push(m[1])
  }

  if (!found.length) push('长寿研究')
  return found.slice(0, 8)
}

export function toNewsSearchCard(item) {
  const title = String(item?.title || '').trim()
  const summary = String(item?.summary || '')
  const excerpt = newsCardExcerpt(summary)
  const keywords = Array.isArray(item?.keywords) && item.keywords.length
    ? item.keywords
    : extractLongevityKeywords(title, summary)
  return {
    id: item.id,
    column: item.column || item.subcategory || '',
    title,
    summary,
    excerpt,
    keywords,
    url: item.url || item.external_url || '',
    publishedAt: item.publishedAt || (item.created_at ? String(item.created_at).slice(0, 10) : ''),
    sourceNote: item.sourceNote || '',
  }
}
