/**
 * 公开抓取回归：静态卡片即可跑，不依赖线上接口。
 * 确认单独资讯页、真实 lastmod，以及没有编造的作者或审稿人。
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { PUBLIC_SUMMARY_UPDATED } from '../../src/data/seo.js'
import { getPageFaqs } from '../../src/data/publicSummary.js'
import { toNewsSearchCard } from '../../src/lib/longevityNewsCard.js'
import {
  isSubstantiveNewsCard,
  newsHubLastmod,
  newsSitemapEntries,
} from '../../src/lib/newsArticleSeo.js'
import { buildLlmsTxt, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'
import {
  apexRedirectRules,
  documentStatus,
  netlifySpaRedirects,
  spaRewriteRules,
} from '../../src/lib/sitePaths.js'
import { getHomeCopy } from '../../src/data/homePageContent.js'
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

const arHome = renderRouteHtml(template, { lang: 'ar', pathname: '/', newsCards: cards })
const arCopy = getHomeCopy('ar')
expect(arHome.includes('lang="ar"') && arHome.includes('dir="rtl"'), 'arabic home keeps lang and rtl')
expect(arHome.includes(arCopy.heroH1) && /[\u0600-\u06FF]/.test(arCopy.heroH1), 'arabic home h1 is Arabic')
expect(arHome.includes(arCopy.heroSub) && /[\u0600-\u06FF]/.test(arCopy.heroSub), 'arabic home intro is Arabic')
expect(!arHome.includes('Evidence-based longevity platform'), 'arabic home does not keep the English hero')
expect(!arCopy.heroH1.includes('Evidence-based') && !arCopy.heroSub.includes('Guideline-informed'), 'arabic copy is not the English spread')

const statusFor = (pathname) => documentStatus(pathname, { cards })
expect(statusFor('/longevity-news/not-a-real-id') === 'missing', 'unknown news id is not a document')
expect(statusFor('/en/not-a-page') === 'missing', 'unknown english path is not a document')
expect(statusFor('/not-a-page') === 'missing', 'unknown site path is not a document')
expect(statusFor('/') === 'ok' && statusFor('/en') === 'ok' && statusFor('/ar') === 'ok', 'locale homepages stay')
expect(statusFor('/about') === 'ok' && statusFor('/en/about') === 'ok', 'prerendered pages stay')
expect(statusFor('/consult') === 'ok' && statusFor('/en/consult') === 'ok', 'consult shell stays')
expect(statusFor('/solutions/risk') === 'ok' && statusFor('/ar/account') === 'ok', 'private spa routes stay')
expect(statusFor('/products/example') === 'ok' && statusFor('/health-skills/course-1/learn') === 'ok', 'dynamic routes stay')
expect(statusFor('/longevity-news/ln-static-1') === 'ok', 'eligible static article stays')
expect(statusFor('/api/health') === 'passthrough', 'api is not turned into a 404 page')

const notFound = fs.readFileSync(new URL('../../public/404.html', import.meta.url), 'utf8')
expect(notFound.includes('noindex, nofollow') && notFound.includes('未找到该页面'), '404 page is a real not-found document')
expect(!notFound.includes('循证长寿医学平台：融合现代医学'), '404 page is not the homepage')

const indexHtml = fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
for (const icon of ['/favicon.ico', '/favicon.png', '/favicon.svg', '/apple-touch-icon.png']) {
  expect(indexHtml.includes(icon), `index declares ${icon}`)
  const bytes = fs.readFileSync(new URL(`../../public${icon}`, import.meta.url))
  const head = bytes.subarray(0, 15).toString('utf8')
  expect(!head.startsWith('<!DOCTYPE') && !head.startsWith('<html'), `${icon} is not homepage html`)
}
const ico = fs.readFileSync(new URL('../../public/favicon.ico', import.meta.url))
expect(ico[0] === 0 && ico[1] === 0 && ico[2] === 1 && ico[3] === 0, 'favicon.ico has an icon header')
const png = fs.readFileSync(new URL('../../public/favicon.png', import.meta.url))
expect(png[0] === 0x89 && png[1] === 0x50, 'favicon.png is a png')
const svg = fs.readFileSync(new URL('../../public/favicon.svg', import.meta.url), 'utf8')
expect(svg.includes('<svg') && svg.includes('image'), 'favicon.svg embeds the logo')

const vercel = JSON.parse(fs.readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))
expect(JSON.stringify(vercel.rewrites) === JSON.stringify(spaRewriteRules()), 'vercel rewrites match the spa list')
expect(JSON.stringify(vercel.redirects) === JSON.stringify(apexRedirectRules()), 'apex redirect is host-only 301')
expect(!JSON.stringify(vercel.rewrites).includes('(?!api/)'), 'blanket homepage rewrite is gone')
expect(!vercel.rewrites.some((rule) => rule.source.includes('longevity-news')), 'unknown news ids are not rewritten to the homepage')
const require = createRequire(import.meta.url)
const { pathToRegexp } = require('path-to-regexp')
expect(String(require('path-to-regexp/package.json').version).startsWith('6.'), 'route compiler is path-to-regexp 6, same major as Vercel')
function matches(source, pathname) {
  return pathToRegexp(source).test(pathname)
}
for (const rule of vercel.rewrites) {
  let compiled = true
  try { pathToRegexp(rule.source) } catch { compiled = false }
  expect(compiled, `vercel source compiles: ${rule.source}`)
}
expect(vercel.redirects.every((rule) => rule.statusCode === 301 && rule.has?.[0]?.value === 'healthlongevity.cn'), 'redirect is 301 for the apex host only')
expect(matches('/:path*', '/about') && matches('/:path*', '/'), 'apex redirect pattern covers / and nested paths')
expect(!vercel.rewrites.some((rule) => matches(rule.source, '/longevity-news/not-a-real-id')), 'no rewrite matches an unknown article')
expect(!vercel.rewrites.some((rule) => matches(rule.source, '/en/not-a-page')), 'no rewrite matches an unknown english page')
expect(!vercel.rewrites.some((rule) => matches(rule.source, '/assets/missing-file.js')), 'missing assets are not rewritten to html')
expect(!vercel.rewrites.some((rule) => matches(rule.source, '/api/health')), 'api paths are not rewritten to html')
expect(vercel.rewrites.some((rule) => matches(rule.source, '/solutions/risk')), 'risk assessment stays a spa route')
expect(vercel.rewrites.some((rule) => matches(rule.source, '/en/products/example')), 'localized product detail stays a spa route')

const netlify = fs.readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8')
expect(!netlify.includes('from = "/*"'), 'netlify splat no longer returns the homepage')
expect(!netlify.includes('longevity-news/*'), 'netlify does not spa-fallback unknown articles')
for (const rule of netlifySpaRedirects()) {
  expect(netlify.includes(`from = "${rule.from}"`), `netlify keeps ${rule.from}`)
}

const nginx = fs.readFileSync(new URL('../../deploy/nginx-healthlongevity.conf.example', import.meta.url), 'utf8')
expect(nginx.includes('return 301 https://www.healthlongevity.cn$request_uri;'), 'nginx example 301 keeps path and query')
expect(nginx.includes('error_page 404 /404.html;'), 'nginx example uses a real 404')
expect(!nginx.includes('try_files $uri $uri/index.html $uri/ /index.html'), 'nginx example does not fall unknown paths back to the homepage')
expect(!nginx.includes('server_name healthlongevity.cn www.healthlongevity.cn'), 'apex and www are not the same server')
for (const name of ['account', 'payment', 'favorites', 'health-skills', 'health-questionnaire', 'forgot-password', 'reset-password', 'ops', 'org', 'tax']) {
  expect(nginx.includes(name), `nginx example keeps /${name}`)
}

const consult = fs.readFileSync(new URL('../../src/pages/Consult.jsx', import.meta.url), 'utf8')
const setEntry = consult.slice(consult.indexOf('function setEntry'), consult.indexOf('function newChat'))
expect(setEntry.includes("sp.delete('session')") && setEntry.includes("sp.set('entry', next)"), 'switching mode leaves the saved chat and only changes the url')
expect(!setEntry.includes('renameConsultSession') && !setEntry.includes('fetch('), 'switching mode does not rewrite the stored session')
const chat = fs.readFileSync(new URL('../../src/components/consult/ChatWindow.jsx', import.meta.url), 'utf8')
expect(chat.includes('isProfessional ?') && chat.includes('sessionModeNote'), 'literature switches stay behind professional mode and the history note is shown')
const css = fs.readFileSync(new URL('../../src/pages/Consult.css', import.meta.url), 'utf8')
expect(css.includes('min-height: 9.5rem') && css.includes('resize: vertical'), 'composer textarea is taller and resizable')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('[seo:check] static article URLs, lastmod, and disclaimer ok')
