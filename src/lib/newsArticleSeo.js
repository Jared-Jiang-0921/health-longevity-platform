/**
 * 资讯卡片的稳定网址。只给已有摘要或阅读要点的条目单独建页，
 * 避免把只有标题的检索卡片再做成一批空页面。
 */
import { getLongevityNewsArticles, articleDisplay } from '../data/longevityNewsArticles.js'
import { PUBLIC_SUMMARY_UPDATED, SEO_LANGS, absoluteUrl } from '../data/seo.js'
import { getPageFaqs } from '../data/publicSummary.js'
import { newsCardExcerpt } from './longevityNewsCard.js'

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
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  const article = getLongevityNewsArticles().find((item) => item.id === card?.id)
  const view = article ? articleDisplay(article, key) : null
  const summary = view?.summary || card?.summary || ''
  const title = String(view?.title || card?.title || '').trim()
  return {
    id: card?.id || '',
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
}

export function isSubstantiveNewsCard(card, lang = 'zh') {
  const view = card?.excerpt !== undefined && card?.takeaways ? card : presentNewsArticle(card, lang)
  if (!view.title || !NEWS_ID_RE.test(view.id || card?.id || '')) return false
  const takes = (view.takeaways || []).filter(Boolean)
  return view.excerpt.length >= EXCERPT_MIN || takes.length > 0
}

export function articleLanguages(card) {
  return ['zh', 'en', 'ar'].filter((lang) => {
    const view = presentNewsArticle(card, lang)
    if (!isSubstantiveNewsCard(view, lang)) return false
    if (lang !== 'zh' && view.zhOnly) return false
    return true
  })
}

/** 栏目页补上证据说明的日期。条目自己的日期另计，不随每次构建刷新。 */
export const NEWS_HUB_COPY_UPDATED = '2026-11-10'

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
    entries.push({
      path: newsArticleRouterPath(view.id),
      lastmod: view.publishedAt,
      changefreq: 'yearly',
      priority: '0.5',
      langs,
    })
  }
  return entries
}

export function newsArticleJsonLd(view, lang) {
  const canonical = absoluteUrl(lang, newsArticleRouterPath(view.id))
  const article = {
    '@type': 'Article',
    headline: view.title,
    description: view.excerpt || view.takeaways.filter(Boolean).join(' '),
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
  const path = newsArticleRouterPath(card.id)
  const alternates = SEO_LANGS.filter((item) => langs.includes(item.id)).map((item) => ({
    hreflang: item.hreflang,
    href: absoluteUrl(item.id, path),
  }))
  alternates.push({ hreflang: 'x-default', href: absoluteUrl('zh', path) })
  return alternates
}

export function newsArticleSeoFields(view, lang) {
  const path = newsArticleRouterPath(view.id)
  const brand = lang === 'zh' ? '长健星图' : 'Longevity Atlas'
  const description = (view.excerpt || view.takeaways.filter(Boolean)[0] || view.title).slice(0, 180)
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
