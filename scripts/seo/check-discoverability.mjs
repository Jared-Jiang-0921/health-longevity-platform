/**
 * 公开抓取回归：静态卡片即可跑，不依赖线上接口。
 * 确认单独资讯页、真实 lastmod，以及没有编造的作者或审稿人。
 */
import { PUBLIC_SUMMARY_UPDATED } from '../../src/data/seo.js'
import { getPageFaqs } from '../../src/data/publicSummary.js'
import { toNewsSearchCard } from '../../src/lib/longevityNewsCard.js'
import {
  isSubstantiveNewsCard,
  newsHubLastmod,
  newsSitemapEntries,
} from '../../src/lib/newsArticleSeo.js'
import { buildLlmsTxt, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'
import { getLongevityNewsArticles } from '../../src/data/longevityNewsArticles.js'
import { renderNewsArticleHtml, renderRouteHtml, staticNewsCards } from './prerender.mjs'

const cards = staticNewsCards()
const failures = []

function expect(cond, message) {
  if (!cond) failures.push(message)
}

const thin = toNewsSearchCard({ id: 'upload-11111111-2222-3333-4444-555555555555', title: '只有标题', summary: '来自公众号' })
expect(!isSubstantiveNewsCard(thin), 'title-only card must not get its own page')
expect(isSubstantiveNewsCard(cards.find((card) => card.id === 'ln-static-1')), 'static article 1 is substantive')

const xml = buildSitemapXml({
  extra: newsSitemapEntries(cards),
  newsLastmod: newsHubLastmod(cards),
})
expect(xml.includes('<lastmod>2026-11-07</lastmod>'), 'editorial pages keep the published summary date')
expect(xml.includes('<loc>https://www.healthlongevity.cn/longevity-news/ln-static-1</loc>'), 'static article has a stable URL')
expect(xml.includes('<lastmod>2026-07-01</lastmod>'), 'article lastmod uses its own date')
expect(!xml.includes(`/longevity-news/${thin.id}`), 'thin card is absent from the sitemap')
const homeLastmod = xml.match(/<loc>https:\/\/www\.healthlongevity\.cn\/<\/loc>\s*<lastmod>([^<]+)/)
expect(homeLastmod && homeLastmod[1] === PUBLIC_SUMMARY_UPDATED, 'home lastmod stays the editorial date')

const faqs = getPageFaqs('/longevity-news', 'zh').map((item) => item.a).join('\n')
expect(faqs.includes('请勿将单篇前沿研究'), 'news FAQ reuses the existing evidence caveat')

const llms = buildLlmsTxt({ articles: cards })
expect(llms.includes('不是百度'), 'llms.txt says it is not a ranking promise')
expect(llms.includes('https://www.healthlongevity.cn/longevity-news/ln-static-1'), 'llms.txt lists the stable article URL')

const template = `<!DOCTYPE html><html lang="zh-Hans"><head><title>old</title></head><body><div id="root"></div></body></html>`
const articleHtml = renderNewsArticleHtml(template, { lang: 'zh', card: cards.find((card) => card.id === 'ln-static-1') })
expect(articleHtml && articleHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/longevity-news/ln-static-1"'), 'article canonical is its own URL')
expect(articleHtml && articleHtml.includes('请勿将单篇前沿研究'), 'article page repeats the evidence caveat')
expect(articleHtml && !articleHtml.includes('"author"') && !articleHtml.includes('reviewedBy'), 'article JSON-LD has no invented author or reviewer')
expect(!renderNewsArticleHtml(template, { lang: 'zh', card: thin }), 'thin card does not render an indexable page')

const newsHtml = renderRouteHtml(template, { lang: 'zh', pathname: '/longevity-news', newsCards: cards })
expect(newsHtml.includes('href="https://www.healthlongevity.cn/longevity-news/ln-static-1"'), 'news index links to the stable article')
expect(newsHtml.includes('请勿将单篇前沿研究'), 'news index includes the evidence caveat in HTML')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('[seo:check] static article URLs, lastmod, and disclaimer ok')
