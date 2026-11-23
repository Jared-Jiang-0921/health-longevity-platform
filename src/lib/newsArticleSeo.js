/**
 * 资讯卡片的稳定网址。每条有标题的公开卡片都有 /longevity-news/<id>。
 * 已写摘要或阅读要点的用原文；只有标题的用本站撰写的教育性说明，不转载微信全文。
 */
import { getLongevityNewsArticles, articleDisplay } from '../data/longevityNewsArticles.js'
import { PUBLIC_SUMMARY_UPDATED, SEO_LANGS, absoluteUrl } from '../data/seo.js'
import { getPageFaqs } from '../data/publicSummary.js'
import { extractLongevityKeywords, newsCardExcerpt } from './longevityNewsCard.js'
import { newsPublicId } from './newsSlug.js'

export const NEWS_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,80}$/
const EXCERPT_MIN = 40

export function validContentDate(value) {
  const s = String(value || '').slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : ''
}

export function newsArticleIdFromPath(pathname) {
  const match = String(pathname || '').match(/^\/longevity-news\/([^/]+)$/)
  if (!match) return ''
  let id = match[1]
  try {
    id = decodeURIComponent(id)
  } catch {
    return ''
  }
  return NEWS_ID_RE.test(id) ? id : ''
}

export function isNewsArticlePath(pathname) {
  return Boolean(newsArticleIdFromPath(pathname))
}

export function newsArticleRouterPath(id) {
  return `/longevity-news/${id}`
}

function hasChinese(value) {
  return /[\u4e00-\u9fff]/.test(String(value || ''))
}

export function presentNewsArticle(card, lang) {
  const key = lang === 'en' ? lang : 'zh'
  const article = getLongevityNewsArticles().find((item) => item.id === card?.id)
  const view = article ? articleDisplay(article, key) : null
  const summary = view?.summary || card?.summary || ''
  const title = String(view?.title || card?.title || '').trim()
  const base = {
    id: card?.id || '',
    publicId: newsPublicId(card?.id || ''),
    column: card?.column || '',
    title,
    summary,
    excerpt: newsCardExcerpt(summary),
    takeaways: view?.takeaways || card?.takeaways || [],
    sourceNote: view?.sourceNote || card?.sourceNote || '',
    url: card?.url || '',
    publishedAt: validContentDate(card?.publishedAt),
    zhOnly: view ? view.zhOnly : key !== 'zh' && hasChinese(`${title} ${summary}`),
  }
  return { ...base, abstract: newsArticleAbstract(base, key) }
}

export function usableNewsExcerpt(view) {
  const excerpt = String(view?.excerpt || '').trim()
  const title = String(view?.title || '').trim()
  if (!excerpt || excerpt === title) return ''
  if (excerpt.length < EXCERPT_MIN) return ''
  return excerpt
}

function columnPhrase(view, lang) {
  const column = String(view?.column || '').trim()
  if (!column) return ''
  if (lang === 'en' && hasChinese(column)) return ''
  return column
}

function topicWords(view) {
  const found = extractLongevityKeywords(view?.title || '', '')
  return found.filter((term) => term !== '长寿研究')
}

function generatedEducationalAbstract(view, lang) {
  const title = String(view?.title || '').trim()
  const column = columnPhrase(view, lang)
  const words = topicWords(view)
  if (lang === 'en') {
    const place = column ? ` in “${column}”` : ''
    const topics = words.length
      ? ` Topic words taken from the title: ${words.join(', ')}. They are index terms, not findings.`
      : ''
    return `Educational index card for “${title}”${place}. Longevity Atlas does not republish WeChat full text. This URL keeps the title, topic words, and this original note so the item can be cited on its own.${topics} Read a source as one of three layers: a mechanism in cells or animals, an association in people, or a human intervention. Current research may suggest a possible link; a single report is not proof of a treatment. Open the source page for the original.`
  }
  const place = column ? `，栏目为「${column}」` : ''
  const topics = words.length
    ? `主题词取自标题：${words.join('、')}。这些词只供检索，不是这篇报道的研究结论。`
    : ''
  return `「${title}」是长健星图前沿医学资讯中的一条教育性检索卡片${place}。本站不转载微信公众号全文，只在这个独立网址上保留标题、主题词和这段原创说明，供检索与引用。${topics}阅读时请把材料分成三层：细胞或动物里的机制、人群里的观察关联、人体干预试验。目前研究提示可能相关，但仍需要更多高质量临床证据，不能把单篇报道当成已经证实的治疗结论。原文请打开来源页。`
}

const TOPIC_LINKS = [
  { test: (text) => /(?:^|[^A-Za-z0-9])(?:NMN|NAD\+|NAD⁺|NR)(?:[^A-Za-z0-9]|$)/i.test(text) || text.includes('烟酰胺'), path: '/products/evidence/nmn', zh: '成分证据：NMN / NR', en: 'Ingredient evidence: NMN / NR' },
  { test: (text) => /(?:^|[^A-Za-z0-9])(?:Omega-3|omega-3|DHA|EPA)(?:[^A-Za-z0-9]|$)/.test(text) || text.includes('鱼油'), path: '/products/evidence/omega-3', zh: '成分证据：EPA 与 DHA', en: 'Ingredient evidence: EPA and DHA' },
  { test: (text) => /维生素\s*D/i.test(text) || /(?:^|[^A-Za-z0-9])vitamin\s*D(?:[^A-Za-z0-9]|$)/i.test(text), path: '/products/evidence/vitamin-d', zh: '成分证据：维生素 D', en: 'Ingredient evidence: vitamin D' },
  { test: (text) => text.includes('肌酸') || /(?:^|[^A-Za-z0-9])creatine(?:[^A-Za-z0-9]|$)/i.test(text), path: '/products/evidence/creatine', zh: '成分证据：肌酸', en: 'Ingredient evidence: creatine' },
  { test: (text) => text.includes('镁') || /(?:^|[^A-Za-z0-9])magnesium(?:[^A-Za-z0-9]|$)/i.test(text), path: '/products/evidence/magnesium', zh: '成分证据：镁', en: 'Ingredient evidence: magnesium' },
]

/** 标题里已有的成分词，链到对应证据页。不新增疗效说法。 */
export function newsRelatedLinks(view, lang = 'zh') {
  const text = `${view?.title || ''} ${(view?.keywords || topicWords(view)).join(' ')}`
  const key = lang === 'en' ? 'en' : 'zh'
  const links = []
  const seen = new Set()
  for (const item of TOPIC_LINKS) {
    if (!item.test(text) || seen.has(item.path)) continue
    seen.add(item.path)
    links.push({ path: item.path, label: item[key] })
  }
  if (!usableNewsExcerpt(view) && !(view?.takeaways || []).filter(Boolean).length) {
    links.push({
      path: '/methodology',
      label: key === 'en' ? 'How evidence is checked' : '证据核对说明',
    })
  }
  return links
}

/** 单篇页和 JSON-LD 使用的说明。与标题相同的句子不算摘要。 */
export function newsArticleAbstract(view, lang = 'zh') {
  const excerpt = usableNewsExcerpt(view)
  if (excerpt) return excerpt
  const takes = (view?.takeaways || []).map((line) => String(line || '').trim()).filter(Boolean)
  if (takes.length) return takes.join(lang === 'en' ? ' ' : '；')
  return generatedEducationalAbstract(view, lang)
}

export function isSubstantiveNewsCard(card, lang = 'zh') {
  const view = card?.excerpt !== undefined && card?.takeaways ? card : presentNewsArticle(card, lang)
  if (!view.title || !NEWS_ID_RE.test(view.id || card?.id || '')) return false
  const takes = (view.takeaways || []).filter(Boolean)
  return String(view.excerpt || '').trim().length >= EXCERPT_MIN || takes.length > 0
}

/** 有标题、id 合法的公开卡片都建独立页，包括只有标题的条目。 */
export function isPublicNewsCard(card, lang = 'zh') {
  const view = card?.title ? card : presentNewsArticle(card, lang)
  return Boolean(String(view?.title || '').trim() && NEWS_ID_RE.test(view?.id || card?.id || ''))
}

export function articleLanguages(card) {
  return ['zh', 'en'].filter((lang) => {
    const view = presentNewsArticle(card, lang)
    if (!isPublicNewsCard(view, lang)) return false
    if (lang !== 'zh' && view.zhOnly) return false
    return true
  })
}

/** 栏目页补上「每条卡片都有独立网址」说明的日期。条目自己的日期另计。 */
export const NEWS_HUB_COPY_UPDATED = '2026-11-22'

export function newsHubLastmod(cards) {
  const dates = [
    NEWS_HUB_COPY_UPDATED,
    ...(cards || []).map((card) => validContentDate(card.publishedAt)),
  ].filter(Boolean).sort()
  return dates.at(-1) || PUBLIC_SUMMARY_UPDATED
}

export function newsSitemapEntries(cards) {
  const entries = []
  for (const card of cards || []) {
    const langs = articleLanguages(card)
    if (!langs.includes('zh')) continue
    const view = presentNewsArticle(card, 'zh')
    const ownDate = view.publishedAt || PUBLIC_SUMMARY_UPDATED
    const lastmod = isSubstantiveNewsCard(view, 'zh')
      ? ownDate
      : [ownDate, NEWS_HUB_COPY_UPDATED].sort().at(-1)
    entries.push({
      path: newsArticleRouterPath(newsPublicId(view.id)),
      lastmod,
      changefreq: 'yearly',
      priority: '0.5',
      langs,
    })
  }
  return entries
}

export function newsArticleJsonLd(view, lang) {
  const canonical = absoluteUrl(lang, newsArticleRouterPath(newsPublicId(view.id)))
  const article = {
    '@type': 'Article',
    headline: view.title,
    description: view.abstract || newsArticleAbstract(view, lang),
    inLanguage: lang === 'zh' ? 'zh-Hans' : lang,
    url: canonical,
    mainEntityOfPage: canonical,
    isPartOf: { '@id': `${absoluteUrl('zh', '/longevity-news')}#webpage` },
  }
  if (view.publishedAt) article.datePublished = view.publishedAt
  if (view.url && /^https?:\/\//i.test(view.url)) article.isBasedOn = view.url
  return {
    '@context': 'https://schema.org',
    '@graph': [article],
  }
}

export function newsArticleAlternates(card) {
  const langs = articleLanguages(card)
  const path = newsArticleRouterPath(newsPublicId(card.id))
  const alternates = SEO_LANGS.filter((item) => langs.includes(item.id)).map((item) => ({
    hreflang: item.hreflang,
    href: absoluteUrl(item.id, path),
  }))
  alternates.push({ hreflang: 'x-default', href: absoluteUrl('zh', path) })
  return alternates
}

export function newsArticleSeoFields(view, lang) {
  const path = newsArticleRouterPath(newsPublicId(view.id))
  const brand = lang === 'zh' ? '长健星图' : 'Longevity Atlas'
  const description = (view.abstract || newsArticleAbstract(view, lang)).slice(0, 180)
  return {
    title: `${view.title} | ${brand}`,
    description,
    canonical: absoluteUrl(lang, path),
    robots: 'index,follow,max-snippet:-1,max-image-preview:large',
    indexable: true,
    page: { path },
  }
}

export function newsReadingFaqs(lang) {
  return getPageFaqs('/longevity-news', lang)
}
