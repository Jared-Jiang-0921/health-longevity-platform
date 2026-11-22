/**
 * 公开抓取回归：静态卡片即可跑，不依赖线上接口。
 * 确认单独资讯页、真实 lastmod，以及没有编造的作者或审稿人。
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { NMN_EVIDENCE_PATH } from '../../src/data/nmnEvidenceMeta.js'
import { OMEGA3_EVIDENCE_PATH } from '../../src/data/omega3EvidenceMeta.js'
import { PUBLIC_SUMMARY_UPDATED, pageIndexable } from '../../src/data/seo.js'
import { getPageFaqs } from '../../src/data/publicSummary.js'
import { toNewsSearchCard } from '../../src/lib/longevityNewsCard.js'
import {
  isPublicNewsCard,
  isSubstantiveNewsCard,
  newsHubLastmod,
  newsSitemapEntries,
} from '../../src/lib/newsArticleSeo.js'
import { buildLlmsTxt, buildNewsAtom, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'
import {
  apexRedirectRules,
  documentStatus,
  netlifySpaRedirects,
  spaRewriteRules,
} from '../../src/lib/sitePaths.js'
import { getLongevityNewsArticles } from '../../src/data/longevityNewsArticles.js'
import { renderNewsArticleHtml, renderRouteHtml, renderSpaShellHtml, staticNewsCards } from './prerender.mjs'

const cards = staticNewsCards()
const failures = []

function expect(cond, message) {
  if (!cond) failures.push(message)
}

const thin = toNewsSearchCard({ id: 'upload-11111111-2222-3333-4444-555555555555', title: '只有标题', summary: '来自公众号' })
expect(!isSubstantiveNewsCard(thin), 'title-only card has no author-written abstract')
expect(isPublicNewsCard(thin), 'title-only card still gets a public permalink')
expect(isSubstantiveNewsCard(cards.find((card) => card.id === 'ln-static-1')), 'static article 1 is substantive')

const xml = buildSitemapXml({
  extra: newsSitemapEntries([...cards, thin]),
  newsLastmod: newsHubLastmod(cards),
})
expect(xml.includes(`<lastmod>${PUBLIC_SUMMARY_UPDATED}</lastmod>`), 'editorial pages use the summary date')
expect(!xml.includes('/login<') && !xml.includes('/login</loc>') && !xml.includes('https://www.healthlongevity.cn/login'), 'login is not a sitemap URL')
expect(!xml.includes('https://www.healthlongevity.cn/register'), 'register is not a sitemap URL')
for (const card of cards) {
  expect(xml.includes(`<loc>https://www.healthlongevity.cn/longevity-news/${card.id}</loc>`), `${card.id} has a Chinese loc`)
  expect(xml.includes(`https://www.healthlongevity.cn/en/longevity-news/${card.id}`), `${card.id} has an English alternate`)
}
expect(xml.includes(`<loc>https://www.healthlongevity.cn/longevity-news/${thin.id}</loc>`), 'title-only card has a stable URL')
expect(xml.includes('<lastmod>2026-07-01</lastmod>'), 'article lastmod uses its own date')
const homeLastmod = xml.match(/<loc>https:\/\/www\.healthlongevity\.cn\/<\/loc>\s*<lastmod>([^<]+)/)
expect(homeLastmod && homeLastmod[1] === PUBLIC_SUMMARY_UPDATED, 'home lastmod stays the editorial date')
const newsHub = xml.match(/<loc>https:\/\/www\.healthlongevity\.cn\/longevity-news<\/loc>\s*<lastmod>([^<]+)/)
expect(newsHub && newsHub[1] === '2026-11-22', 'news hub lastmod follows the permalink copy date')

const faqs = getPageFaqs('/longevity-news', 'zh').map((item) => item.a).join('\n')
expect(faqs.includes('请勿将单篇前沿研究'), 'news FAQ reuses the existing evidence caveat')

const llms = buildLlmsTxt({ articles: [...cards, thin] })
expect(llms.includes('不是百度'), 'llms.txt says it is not a ranking promise')
expect(llms.includes(PUBLIC_SUMMARY_UPDATED), 'llms.txt date is the summary date')
expect(llms.includes('https://www.healthlongevity.cn/longevity-news/ln-static-1'), 'llms.txt lists the stable article URL')
expect(llms.includes(`https://www.healthlongevity.cn/longevity-news/${thin.id}`), 'llms.txt lists the title-only card')
expect(llms.includes('https://www.healthlongevity.cn/en/longevity-news/ln-static-1'), 'llms.txt lists the English permalink')
expect(llms.includes('healthlongevityplatform.vercel.app'), 'llms.txt still names the parallel host')
expect(llms.includes('并行入口') && llms.includes('https://www.healthlongevity.cn/'), 'llms.txt tells citations to use the .cn host')
expect(!llms.includes('https://www.healthlongevity.cn/login'), 'llms.txt does not list login')
expect(!llms.includes('https://www.healthlongevity.cn/register'), 'llms.txt does not list register')
expect(llms.includes('/longevity-news/feed.xml'), 'llms.txt lists the news feed')

const template = `<!DOCTYPE html><html lang="zh-Hans"><head><title>old</title><meta name="robots" content="index,follow" /></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`
const articleHtml = renderNewsArticleHtml(template, { lang: 'zh', card: cards.find((card) => card.id === 'ln-static-1') })
expect(articleHtml && articleHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/longevity-news/ln-static-1"'), 'article canonical is its own URL')
expect(articleHtml && articleHtml.includes('请勿将单篇前沿研究'), 'article page repeats the evidence caveat')
expect(articleHtml && !articleHtml.includes('"author"') && !articleHtml.includes('reviewedBy'), 'article JSON-LD has no invented author or reviewer')
const articleBody = articleHtml.slice(articleHtml.indexOf('<body'), articleHtml.indexOf('<script type="module"'))
expect(articleBody.includes('请勿将单篇前沿研究'), 'article abstract is in HTML before any script')

const thinHtml = renderNewsArticleHtml(template, { lang: 'zh', card: thin })
expect(Boolean(thinHtml), 'title-only card renders its own page')
expect(thinHtml.includes(`rel="canonical" href="https://www.healthlongevity.cn/longevity-news/${thin.id}"`), 'thin canonical is the permalink')
expect(thinHtml.includes('不转载微信公众号全文'), 'thin page uses an original educational abstract')
const thinJson = JSON.parse(thinHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
const thinArticle = thinJson['@graph'][0]
expect(thinArticle.url === `https://www.healthlongevity.cn/longevity-news/${thin.id}`, 'JSON-LD url is the permalink')
expect(thinArticle.description && thinArticle.description !== '只有标题', 'JSON-LD description is the abstract')
expect(thinArticle.description.includes('不转载微信公众号全文'), 'JSON-LD description is not the WeChat post')
const thinBody = thinHtml.slice(thinHtml.indexOf('<body'), thinHtml.indexOf('<script type="module"'))
expect(thinBody.includes('不转载微信公众号全文'), 'crawler-visible body contains the abstract')

const newsHtml = renderRouteHtml(template, { lang: 'zh', pathname: '/longevity-news', newsCards: [...cards, thin] })
expect(newsHtml.includes('href="https://www.healthlongevity.cn/longevity-news/ln-static-1"'), 'news index links to the stable article')
expect(newsHtml.includes(`href="https://www.healthlongevity.cn/longevity-news/${thin.id}"`), 'news index links title-only cards with a real href')
expect(!newsHtml.includes(`href="https://www.healthlongevity.cn/longevity-news#${thin.id}"`), 'news index does not use a hash as the article url')
expect(newsHtml.includes('请勿将单篇前沿研究'), 'news index includes the evidence caveat in HTML')
expect(newsHtml.includes('application/atom+xml'), 'news index links the atom feed')

const productsHtml = renderRouteHtml(template, { lang: 'zh', pathname: '/products' })
expect(productsHtml.includes('不是公开可抓取语料'), 'product overview says items are not a public corpus')
expect(productsHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/products"'), 'product overview canonical is the overview')
const shell = renderSpaShellHtml(template, { lang: 'zh' })
expect(shell.includes('noindex,nofollow'), 'spa shell is noindex')
expect(!shell.includes('index,follow'), 'spa shell is not index,follow')
expect(!shell.includes('rel="canonical" href="https://www.healthlongevity.cn/"'), 'spa shell has no homepage canonical')
expect(shell.includes('不是可引用的公开页面'), 'spa shell body is not the homepage')
expect(shell.includes('<script type="module"'), 'spa shell still boots the app')

const evidenceHtml = renderRouteHtml(template, { lang: 'zh', pathname: NMN_EVIDENCE_PATH })
const evidenceText = String(evidenceHtml || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
expect(Boolean(evidenceHtml), 'pilot evidence page prerenders')
expect(evidenceHtml.includes('<title>NMN 与 NR：人体证据、监管状态与不能外推的边界 | 长健星图</title>'), 'pilot title is unique')
expect(evidenceHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/products/evidence/nmn"'), 'pilot canonical is its own URL')
expect(evidenceHtml.includes('content="index,follow,max-snippet:-1,max-image-preview:large"'), 'pilot robots is index,follow')
expect(!evidenceHtml.includes('noindex') && !evidenceHtml.includes('no-store'), 'pilot html has no noindex or no-store')
expect(!evidenceHtml.includes('"author"') && !evidenceHtml.includes('reviewedBy'), 'pilot JSON-LD invents no author or reviewer')
expect(!/\d+\s*mg/i.test(evidenceHtml) && !evidenceHtml.includes('毫克'), 'pilot page does not state a dose')
expect(evidenceHtml.includes('不提供用量'), 'pilot page says it gives no dose')
expect(evidenceHtml.includes('39531138') && evidenceHtml.includes('samr.gov.cn'), 'pilot cites the meta-analysis and the SAMR reply')
expect(evidenceHtml.includes('/longevity-news/ln-static-3'), 'pilot links the existing NMN note')
expect(evidenceText.length > 1800, 'pilot body is substantial')
const evidenceEn = renderRouteHtml(template, { lang: 'en', pathname: NMN_EVIDENCE_PATH })
expect(evidenceEn.includes('rel="canonical" href="https://www.healthlongevity.cn/en/products/evidence/nmn"'), 'english pilot has its own canonical')
expect(evidenceEn.includes('hreflang="zh-Hans"') && evidenceEn.includes('hreflang="en"'), 'pilot emits hreflang')
expect(!/\d+\s*mg/i.test(evidenceEn) && evidenceEn.includes('No dose'), 'english pilot does not state a dose')
expect(renderRouteHtml(template, { lang: 'zh', pathname: '/products/nmn' }) == null, 'product slug is not prerendered')
expect(renderRouteHtml(template, { lang: 'zh', pathname: '/products/1' }) == null, 'numeric product route is not prerendered')
expect(pageIndexable(NMN_EVIDENCE_PATH) && pageIndexable(OMEGA3_EVIDENCE_PATH) && !pageIndexable('/products/nmn') && !pageIndexable('/products/1') && !pageIndexable('/products/omega-3'), 'ingredient pages are indexable and product slugs are not')
expect(!pageIndexable('/products/evidence/other') && !pageIndexable('/health-skills/course-1'), 'neighbors and courses stay noindex')
const productsText = productsHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
expect(productsText.length > 800 && productsHtml.includes('/products/evidence/nmn'), 'products page explains the check and links the pilot')
expect(!productsHtml.includes('维生素 D') && !productsHtml.includes('Omega-3'), 'public products page does not name demo SKUs')
expect(xml.includes('<loc>https://www.healthlongevity.cn/products/evidence/nmn</loc>'), 'sitemap lists the pilot URL')
expect(!xml.includes('/products/nmn<') && !xml.includes('/products/1<'), 'sitemap does not list product-app URLs')
expect(llms.includes('https://www.healthlongevity.cn/products/evidence/nmn'), 'llms.txt names the pilot page')
const omegaHtml = renderRouteHtml(template, { lang: 'zh', pathname: OMEGA3_EVIDENCE_PATH })
const omegaText = String(omegaHtml || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
expect(omegaHtml.includes('<title>EPA 与 DHA（Omega-3）：人体证据、监管表述与不能外推的边界 | 长健星图</title>'), 'omega-3 title is unique')
expect(omegaHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/products/evidence/omega-3"'), 'omega-3 canonical')
expect(omegaHtml.includes('content="index,follow,max-snippet:-1,max-image-preview:large"'), 'omega-3 is index,follow')
expect(!/name="robots" content="[^"]*noindex/.test(omegaHtml), 'omega-3 robots meta is not noindex')
expect(!omegaHtml.includes('"author"') && !omegaHtml.includes('reviewedBy'), 'omega-3 invents no author or reviewer')
expect(!/\d+\s*mg/i.test(omegaHtml) && !omegaHtml.includes('毫克') && !/\d+\s*g\/d/i.test(omegaHtml), 'omega-3 page states no dose')
expect(omegaHtml.includes('30415628') && omegaHtml.includes('33190147') && omegaHtml.includes('30415637') && omegaHtml.includes('32114706'), 'omega-3 cites the checked trials')
expect(omegaHtml.includes('fda.gov'), 'omega-3 cites the FDA update')
expect(omegaHtml.includes('/products/evidence/nmn') && omegaHtml.includes('/methodology'), 'omega-3 links existing public pages')
expect(omegaText.length > 1800, 'omega-3 body is substantial')
expect(renderRouteHtml(template, { lang: 'zh', pathname: '/products/omega-3' }) == null, 'omega-3 product slug is not prerendered')
expect(xml.includes('<loc>https://www.healthlongevity.cn/products/evidence/omega-3</loc>'), 'sitemap lists the omega-3 page')
expect(!xml.includes('/products/omega-3<'), 'sitemap does not list an omega-3 product URL')
expect(llms.includes('https://www.healthlongevity.cn/products/evidence/omega-3'), 'llms.txt names the omega-3 page')
expect(llms.includes('逐条商品'), 'llms.txt still keeps individual products out of the corpus')

function visibleText(html) {
  return String(html || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
const faqHtml = renderRouteHtml(template, { lang: 'zh', pathname: '/faq' })
const methodHtml = renderRouteHtml(template, { lang: 'zh', pathname: '/methodology' })
const aboutHtml = renderRouteHtml(template, { lang: 'zh', pathname: '/about' })
expect(faqHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/faq"'), 'faq canonical')
expect(faqHtml.includes('content="index,follow,max-snippet:-1,max-image-preview:large"'), 'faq is index,follow')
expect(faqHtml.includes('"@type":"FAQPage"') && !faqHtml.includes('"author"'), 'faq uses FAQPage and invents no author')
expect(!/name="robots" content="[^"]*noindex/.test(faqHtml) && !/\d+\s*mg/i.test(faqHtml) && !faqHtml.includes('毫克'), 'faq robots stay indexable and the page gives no dose')
expect(visibleText(faqHtml).length > 800, 'faq body is citeable')
expect(methodHtml.includes('rel="canonical" href="https://www.healthlongevity.cn/methodology"'), 'methodology canonical')
expect(methodHtml.includes('"@type":"WebPage"') && !methodHtml.includes('FAQPage'), 'methodology stays a WebPage')
expect(!methodHtml.includes('"author"') && !methodHtml.includes('reviewedBy'), 'methodology invents no author or reviewer')
expect(methodHtml.includes('/products/evidence/nmn') && methodHtml.includes('PMID'), 'methodology points at the NMN page and the PMID habit')
expect(!/\d+\s*mg/i.test(methodHtml) && !methodHtml.includes('毫克'), 'methodology gives no dose')
expect(visibleText(methodHtml).length > 800, 'methodology body is citeable')
const faqEn = renderRouteHtml(template, { lang: 'en', pathname: '/faq' })
const methodEn = renderRouteHtml(template, { lang: 'en', pathname: '/methodology' })
expect(faqEn.includes('https://www.healthlongevity.cn/en/faq') && faqEn.includes('hreflang="en"'), 'english faq has hreflang')
expect(methodEn.includes('https://www.healthlongevity.cn/en/methodology'), 'english methodology canonical')
expect(aboutHtml.includes('编辑责任') && aboutHtml.includes('不设具名医学审稿人') && aboutHtml.includes('恒悦生国际有限公司'), 'about names the operator and no reviewer')
expect(!aboutHtml.includes('/authors'), 'about does not invent an authors URL')
expect(xml.includes('<loc>https://www.healthlongevity.cn/faq</loc>'), 'sitemap lists faq')
expect(xml.includes('<loc>https://www.healthlongevity.cn/methodology</loc>'), 'sitemap lists methodology')
expect(xml.includes('<loc>https://www.healthlongevity.cn/products/evidence/nmn</loc>'), 'sitemap still lists the NMN page')
expect(llms.includes('https://www.healthlongevity.cn/faq') && llms.includes('https://www.healthlongevity.cn/methodology'), 'llms.txt points to faq and methodology')

const feed = buildNewsAtom({ articles: [...cards, thin] })
expect(feed.includes(`https://www.healthlongevity.cn/longevity-news/${thin.id}`), 'feed lists the title-only permalink')
expect(feed.includes('https://www.healthlongevity.cn/longevity-news/ln-static-1'), 'feed lists the static article')
expect(feed.includes('不转载微信公众号全文'), 'feed summary is the educational abstract')

const statusFor = (pathname) => documentStatus(pathname, { cards })
expect(statusFor('/longevity-news/not-a-real-id') === 'missing', 'unknown news id is not a document')
expect(statusFor('/en/not-a-page') === 'missing', 'unknown english path is not a document')
expect(statusFor('/not-a-page') === 'missing', 'unknown site path is not a document')
expect(statusFor('/') === 'ok' && statusFor('/en') === 'ok', 'locale homepages stay')
expect(statusFor('/about') === 'ok' && statusFor('/en/about') === 'ok', 'prerendered pages stay')
expect(statusFor('/consult') === 'ok' && statusFor('/en/consult') === 'ok', 'consult shell stays')
expect(statusFor('/solutions/risk') === 'ok' && statusFor('/en/account') === 'ok', 'private spa routes stay')
expect(statusFor('/products/example') === 'ok' && statusFor('/health-skills/course-1/learn') === 'ok', 'dynamic routes stay')
expect(statusFor('/longevity-news/ln-static-1') === 'ok', 'eligible static article stays')
expect(statusFor('/faq') === 'ok' && statusFor('/en/faq') === 'ok', 'faq is a public document')
expect(statusFor('/methodology') === 'ok' && statusFor('/en/methodology') === 'ok', 'methodology is a public document')
expect(statusFor('/authors') === 'missing', 'no fabricated authors directory')
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
expect(vercel.rewrites.every((rule) => String(rule.destination).endsWith('spa-shell.html')), 'spa rewrites land on the noindex shell')
expect(!vercel.rewrites.some((rule) => rule.destination === '/index.html' || rule.destination === '/en/index.html'), 'spa rewrites do not serve the homepage')
const productRule = vercel.rewrites.find((rule) => rule.source === '/products/(.*)')
expect(productRule && productRule.destination === '/spa-shell.html', '/products/nmn-style paths do not prerender as the homepage')

const netlify = fs.readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8')
expect(!netlify.includes('from = "/*"'), 'netlify splat no longer returns the homepage')
expect(!netlify.includes('to = "/index.html"'), 'netlify spa fallback is not the Chinese homepage')
expect(netlify.includes('to = "/en/index.html"'), 'netlify keeps the English homepage file')
expect(netlify.includes('to = "/spa-shell.html"') && netlify.includes('to = "/en/spa-shell.html"'), 'netlify spa paths use the noindex shell')
expect(!netlify.includes('longevity-news/*'), 'netlify does not spa-fallback unknown articles')
for (const rule of netlifySpaRedirects()) {
  expect(netlify.includes(`from = "${rule.from}"`), `netlify keeps ${rule.from}`)
}
const evidenceRedirect = netlify.indexOf('from = "/products/evidence/nmn"')
const productWildcard = netlify.indexOf('from = "/products/*"')
const evidenceEnRedirect = netlify.indexOf('from = "/en/products/evidence/nmn"')
const productEnWildcard = netlify.indexOf('from = "/en/products/*"')
expect(evidenceRedirect > 0 && evidenceRedirect < productWildcard, 'netlify serves the evidence file before the product shell')
expect(evidenceEnRedirect > 0 && evidenceEnRedirect < productEnWildcard, 'netlify serves the english evidence file before the product shell')

const nginx = fs.readFileSync(new URL('../../deploy/nginx-healthlongevity.conf.example', import.meta.url), 'utf8')
expect(nginx.includes('return 301 https://www.healthlongevity.cn$request_uri;'), 'nginx example 301 keeps path and query')
expect(nginx.includes('error_page 404 /404.html;'), 'nginx example uses a real 404')
expect(!nginx.includes('try_files $uri $uri/index.html $uri/ /index.html'), 'nginx example does not fall unknown paths back to the homepage')
expect(!nginx.includes('try_files $uri $uri/index.html /index.html'), 'nginx example does not fall product or course paths back to the homepage')
expect(!nginx.includes('try_files $uri $uri/index.html /en/index.html'), 'nginx example does not fall english spa paths back to the english homepage')
expect(nginx.includes('try_files $uri $uri/index.html /spa-shell.html'), 'nginx example falls unknown product paths to the noindex shell')
expect(nginx.includes('try_files $uri $uri/index.html /en/spa-shell.html'), 'nginx example falls localized spa paths to the english shell')
expect(nginx.includes('location ~ ^/products/.+'), 'nginx example still names product item paths')
expect(nginx.includes('/products/evidence/nmn'), 'nginx example notes the allowlisted evidence file')
expect(nginx.includes('不带 X-Robots-Tag noindex'), 'nginx example says the evidence file is not the noindex shell')
expect(nginx.includes('public, max-age=600'), 'nginx example gives the homepage a short public cache')
for (const [iconPath, mime] of [
  ['/favicon.ico', 'image/x-icon'],
  ['/favicon.png', 'image/png'],
  ['/favicon.svg', 'image/svg+xml'],
  ['/apple-touch-icon.png', 'image/png'],
]) {
  expect(nginx.includes(`location = ${iconPath}`), `nginx example matches ${iconPath} exactly`)
  expect(nginx.includes(`try_files ${iconPath} =404`), `nginx example serves ${iconPath} as a file`)
  expect(nginx.includes(mime), `nginx example sets ${mime}`)
}
expect(nginx.includes('application/atom+xml'), 'nginx example types the news feed')
expect(!nginx.includes('GPTBot') && !nginx.includes('Bytespider'), 'nginx example does not special-case AI crawlers')
expect(!nginx.includes('server_name healthlongevity.cn www.healthlongevity.cn'), 'apex and www are not the same server')
for (const name of ['account', 'payment', 'favorites', 'health-skills', 'health-questionnaire', 'forgot-password', 'reset-password', 'ops', 'org', 'tax']) {
  expect(nginx.includes(name), `nginx example keeps /${name}`)
}

const robots = fs.readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8')
expect(robots.includes('User-agent: *') && robots.includes('Allow: /'), 'robots allows every crawler by default')
expect(robots.includes('Disallow: /health-skills/') && robots.includes('Disallow: /en/health-skills/'), 'robots still blocks course pages')
expect(!robots.includes('Disallow: /products'), 'robots does not block the public products or evidence pages')
for (const name of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Bytespider', 'DeepSeek']) {
  expect(robots.includes(name), `robots keeps ${name} allowed`)
  expect(!new RegExp(`User-agent:\\s*${name}[\\s\\S]*?Disallow:\\s*/`).test(robots), `${name} is not disallowed`)
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
