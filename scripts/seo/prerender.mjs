/**
 * 构建后预渲染公开页 HTML（含 meta / hreflang / JSON-LD / 正文），供不执行 JS 的爬虫读取。
 * 语言前缀：中文默认路径，英文 /en，阿拉伯语 /ar。
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HOME_MODULES, getHomeCopy } from '../../src/data/homePageContent.js'
import { articleDisplay, getLongevityNewsArticles } from '../../src/data/longevityNewsArticles.js'
import { LONGEVITY_NEWS_COLUMNS, columnDisplayLabel } from '../../src/data/longevityNewsColumns.js'
import { PUBLIC_CRAWL_NAV, getAboutPage, getSolutionsPublicCopy } from '../../src/data/publicSummary.js'
import { SEO_LANGS, SEO_PAGES, SITE_ORIGIN, absoluteUrl } from '../../src/data/seo.js'
import { extractLongevityKeywords, newsCardExcerpt, toNewsSearchCard } from '../../src/lib/longevityNewsCard.js'
import { langSpec, renderHeadSnippet, resolveSeo } from '../../src/lib/seoDocument.js'
import { buildLlmsTxt, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const distDir = path.join(rootDir, 'dist')

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function langLinks(routerPath, lang) {
  const items = SEO_LANGS.map((item) => {
    const href = absoluteUrl(item.id, routerPath)
    const current = item.id === lang ? ' aria-current="true"' : ''
    return `<a href="${escapeHtml(href)}" hreflang="${escapeHtml(item.hreflang)}" lang="${escapeHtml(item.htmlLang)}"${current}>${escapeHtml(item.label)}</a>`
  })
  return `<nav class="seo-prerender-langs" aria-label="Languages">${items.join(' · ')}</nav>`
}

function moduleIntro(routerPath, lang) {
  const mod = HOME_MODULES.find((item) => item.path === routerPath)
  if (!mod) return ''
  const title = mod.title[lang] || mod.title.zh
  const intro = mod.intro[lang] || mod.intro.zh
  return `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p>`
}

function legalBody(page, lang) {
  const seo = resolveSeo(page.path, lang)
  return `<h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p>`
}

function homeBody(lang) {
  const copy = getHomeCopy(lang)
  const modules = HOME_MODULES.map((mod) => {
    const title = mod.title[lang] || mod.title.zh
    const intro = mod.intro[lang] || mod.intro.zh
    return `<article><h3><a href="${escapeHtml(absoluteUrl(lang, mod.path))}">${escapeHtml(title)}</a></h3><p>${escapeHtml(intro)}</p></article>`
  }).join('')
  return `
    <h1>${escapeHtml(copy.heroH1)}</h1>
    <p>${escapeHtml(copy.heroSub)}</p>
    <p><a href="${escapeHtml(absoluteUrl(lang, '/register'))}">${escapeHtml(copy.ctaPrimary)}</a>
       · <a href="${escapeHtml(absoluteUrl(lang, '/products'))}">${escapeHtml(copy.ctaSecondary)}</a></p>
    <h2>${escapeHtml(copy.modulesTitle)}</h2>
    <p>${escapeHtml(copy.modulesLead)}</p>
    ${modules}
    <p><a href="${escapeHtml(absoluteUrl(lang, '/about'))}">${escapeHtml(navLabel('/about', lang))}</a></p>
  `
}

function navLabel(routerPath, lang) {
  const item = PUBLIC_CRAWL_NAV.find((entry) => entry.path === routerPath)
  return item?.label?.[lang] || item?.label?.zh || routerPath
}

function crawlNav(lang) {
  const items = PUBLIC_CRAWL_NAV.map((item) => {
    const href = absoluteUrl(lang, item.path)
    return `<a href="${escapeHtml(href)}">${escapeHtml(navLabel(item.path, lang))}</a>`
  })
  return `<nav class="seo-prerender-nav" aria-label="Public pages">${items.join(' · ')}</nav>`
}

function faqBlock(heading, faqs) {
  const articles = faqs
    .map((item) => `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`)
    .join('')
  return `<section><h2>${escapeHtml(heading)}</h2>${articles}</section>`
}

function aboutBody(lang) {
  const page = getAboutPage(lang)
  const sections = page.sections.map((section) => {
    const paragraphs = (section.paragraphs || []).map((text) => `<p>${escapeHtml(text)}</p>`).join('')
    const modules = (section.modules || [])
      .map(
        (mod) =>
          `<article><h3><a href="${escapeHtml(absoluteUrl(lang, mod.path))}">${escapeHtml(mod.title)}</a></h3><p>${escapeHtml(mod.intro)}</p></article>`,
      )
      .join('')
    const urls = (section.urls || [])
      .map(
        (item) =>
          `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>：${escapeHtml(item.href)}</li>`,
      )
      .join('')
    const list = urls ? `<ul>${urls}</ul>` : ''
    return `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${modules}${list}</section>`
  }).join('')
  return `
    <h1>${escapeHtml(page.title)}</h1>
    <p>${escapeHtml(page.updatedLabel)}：<time datetime="${escapeHtml(page.updated)}">${escapeHtml(page.updated)}</time></p>
    <p>${escapeHtml(page.lead)}</p>
    ${sections}
    ${faqBlock(page.faqHeading, page.faqs)}
  `
}

function solutionsBody(lang) {
  const page = getSolutionsPublicCopy(lang)
  const seo = resolveSeo('/solutions', lang)
  return `
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.lead)}</p>
    <p>${escapeHtml(page.medicalDisclaimer)}</p>
    <h2>${escapeHtml(lang === 'zh' ? '咨询' : lang === 'ar' ? 'الاستشارة' : 'Consults')}</h2>
    <p>${escapeHtml(page.consultLead)}</p>
    <article><h3>${escapeHtml(page.general.title)}</h3><p>${escapeHtml(page.general.body)}</p></article>
    <article><h3>${escapeHtml(page.professional.title)}</h3><p>${escapeHtml(page.professional.body)}</p></article>
    <article><h3>${escapeHtml(page.tcm.title)}</h3><p>${escapeHtml(page.tcm.body)}</p></article>
    <p>${escapeHtml(page.assessment)}</p>
    <p>${escapeHtml(seo.description)}</p>
    ${faqBlock(page.faqHeading, page.faqs)}
  `
}

const NEWS_ASSET_ATTEMPTS = 4
const NEWS_ASSET_BACKOFF_MS = [300, 700, 1500]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function briefBody(text) {
  const oneLine = String(text || '').replace(/\s+/g, ' ').trim()
  if (!oneLine) return ''
  const snippet = oneLine.length > 180 ? `${oneLine.slice(0, 180)}…` : oneLine
  return ` body=${JSON.stringify(snippet)}`
}

function errorDetail(err) {
  const code = err?.cause?.code || err?.cause?.message
  return code ? `${err.message} (${code})` : err.message
}

function uploadsFromPayload(data) {
  return (Array.isArray(data?.items) ? data.items : []).map((item) =>
    toNewsSearchCard({
      id: `upload-${item.id}`,
      column: item.subcategory,
      title: item.title,
      summary: item.summary,
      external_url: item.external_url,
      created_at: item.created_at,
    }),
  )
}

async function fetchLongevityNewsUploads(origin) {
  const url = `${origin}/api/module-assets?module=longevity-news`
  for (let attempt = 1; attempt <= NEWS_ASSET_ATTEMPTS; attempt++) {
    const last = attempt === NEWS_ASSET_ATTEMPTS
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
      if (res.ok) {
        return uploadsFromPayload(await res.json())
      }
      const snippet = briefBody(await res.text().catch(() => ''))
      const retryable = res.status >= 500 && res.status <= 599
      if (!retryable || last) {
        console.warn(`[seo] longevity-news assets HTTP ${res.status} from ${origin}${snippet}`)
        return []
      }
      console.warn(
        `[seo] longevity-news assets HTTP ${res.status} from ${origin}; retry ${attempt}/${NEWS_ASSET_ATTEMPTS - 1}${snippet}`,
      )
    } catch (err) {
      const detail = errorDetail(err)
      if (last) {
        console.warn(`[seo] longevity-news assets skipped: ${detail}`)
        return []
      }
      console.warn(
        `[seo] longevity-news assets skipped: ${detail}; retry ${attempt}/${NEWS_ASSET_ATTEMPTS - 1}`,
      )
    }
    await sleep(NEWS_ASSET_BACKOFF_MS[attempt - 1] ?? 1500)
  }
  return []
}

async function loadLongevityNewsCards() {
  const staticCards = getLongevityNewsArticles().map((item) => toNewsSearchCard(item))
  const origin = String(process.env.SEO_NEWS_API || 'http://127.0.0.1:3000').replace(/\/$/, '')
  const uploads = await fetchLongevityNewsUploads(origin)
  return [...uploads, ...staticCards].filter((card) => card.title)
}

function hasChinese(value) {
  return /[\u4e00-\u9fff]/.test(String(value || ''))
}

function displayKeywords(title, summary, lang) {
  const found = extractLongevityKeywords(title, summary)
  if (!lang || lang === 'zh') return found
  const fallback = lang === 'ar' ? 'بحث طول العمر' : 'longevity research'
  return found
    .map((term) => (term === '长寿研究' ? fallback : term))
    .filter((term) => !hasChinese(term))
}

function presentNewsCard(card, lang) {
  const article = getLongevityNewsArticles().find((item) => item.id === card.id)
  if (article) {
    const view = articleDisplay(article, lang)
    return {
      ...card,
      title: view.title,
      excerpt: newsCardExcerpt(view.summary),
      keywords: displayKeywords(view.title, view.summary, lang),
      columnLabel: columnDisplayLabel(card.column, lang),
      zhOnly: view.zhOnly,
    }
  }
  const zhOnly = lang !== 'zh' && hasChinese(`${card.title || ''} ${card.excerpt || ''}`)
  return {
    ...card,
    keywords: displayKeywords(card.title, card.excerpt || card.summary, lang),
    columnLabel: columnDisplayLabel(card.column, lang) || card.column,
    zhOnly,
  }
}

function newsJsonLd(lang, cards) {
  const canonical = absoluteUrl(lang, '/longevity-news')
  const shownCards = cards.slice(0, 200).map((card) => presentNewsCard(card, lang))
  const keywords = [...new Set(shownCards.flatMap((card) => card.keywords || []))].slice(0, 48)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'zh' ? '前沿医学资讯检索卡片' : 'Longevity insight cards',
    url: canonical,
    numberOfItems: cards.length,
    itemListElement: shownCards.map((shown, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        headline: shown.title,
        keywords: (shown.keywords || []).join(', '),
        description: shown.excerpt || shown.title,
        url: `${canonical}#${encodeURIComponent(shown.id)}`,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        ...(shown.url ? { isBasedOn: shown.url } : {}),
      },
    })),
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
  }
}

function newsBody(lang, cards) {
  const seo = resolveSeo('/longevity-news', lang)
  const grouped = new Map()
  for (const col of LONGEVITY_NEWS_COLUMNS) grouped.set(col.label, [])
  for (const card of cards) {
    const label = card.column || '其他'
    if (!grouped.has(label)) grouped.set(label, [])
    grouped.get(label).push(presentNewsCard(card, lang))
  }
  const keywordLabel = lang === 'en' ? 'Keywords' : lang === 'ar' ? 'كلمات مفتاحية' : '关键词'
  const sections = []
  for (const [label, items] of grouped) {
    if (!items.length) continue
    const articles = items
      .map((card) => {
        const kws = card.keywords.length
          ? `<p>${escapeHtml(keywordLabel)}: ${escapeHtml(card.keywords.join(', '))}</p>`
          : ''
        const excerpt = card.excerpt ? `<p>${escapeHtml(card.excerpt)}</p>` : ''
        const onlyZh = card.zhOnly ? `<p>${escapeHtml(lang === 'ar' ? 'هذا المحتوى بالصينية فقط' : 'This item is in Chinese only')}</p>` : ''
        return `<article id="${escapeHtml(card.id)}"><h3>${escapeHtml(card.title)}</h3>${onlyZh}${kws}${excerpt}</article>`
      })
      .join('')
    sections.push(`<section><h2>${escapeHtml(columnDisplayLabel(label, lang))}</h2>${articles}</section>`)
  }
  return `<h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p>${moduleIntro('/longevity-news', lang)}${sections.join('')}`
}

function pageBody(page, lang, newsCards) {
  if (page.type === 'home') return homeBody(lang)
  if (page.path === '/about') return aboutBody(lang)
  if (page.path === '/solutions') return solutionsBody(lang)
  if (page.type === 'legal') return legalBody(page, lang)
  if (page.path === '/longevity-news') return newsBody(lang, newsCards)
  const seo = resolveSeo(page.path, lang)
  const extra = moduleIntro(page.path, lang)
  return `<h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p>${extra}`
}

function distFileFor(lang, routerPath) {
  const spec = langSpec(lang)
  const rel = routerPath === '/' ? 'index.html' : `${routerPath.replace(/^\//, '')}/index.html`
  return path.join(distDir, spec.prefix.replace(/^\//, ''), rel)
}

function stripBaselineSeo(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="(?:description|robots|twitter:[^"]+)"[\s\S]*?>\s*/gi, '')
    .replace(/<meta\s+property="(?:og:[^"]+)"[\s\S]*?>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[\s\S]*?>\s*/gi, '')
    .replace(/<link\s+rel="alternate"[\s\S]*?>\s*/gi, '')
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi, '')
}

function injectHtml(template, { lang, pathname, body, extraHead = '' }) {
  const spec = langSpec(lang)
  const head = renderHeadSnippet({ lang, pathname })
  const langs = langLinks(pathname, lang)
  const root = `<div id="root">
      <main class="seo-prerender" lang="${escapeHtml(spec.htmlLang)}" dir="${escapeHtml(spec.dir)}">
        ${langs}
        ${crawlNav(lang)}
        ${body}
      </main>
    </div>`
  let html = stripBaselineSeo(template)
  html = html.replace(/<html([^>]*)>/i, `<html lang="${spec.htmlLang}" dir="${spec.dir}">`)
  html = html.replace('</head>', `    ${head}\n    ${extraHead}\n  </head>`)
  html = html.replace(/<div id="root"><\/div>/, root)
  return html
}

export function staticNewsCards() {
  return getLongevityNewsArticles().map((item) => toNewsSearchCard(item)).filter((card) => card.title)
}

export function renderRouteHtml(template, { lang, pathname, newsCards = [] }) {
  const page = SEO_PAGES.find((item) => item.path === pathname)
  if (!page) return null
  const cards = page.path === '/longevity-news' && newsCards.length === 0 ? staticNewsCards() : newsCards
  const extraHead =
    page.path === '/longevity-news'
      ? `<script type="application/ld+json" data-seo-news="1">${JSON.stringify(newsJsonLd(lang, cards)).replace(/</g, '\\u003c')}</script>`
      : ''
  return injectHtml(template, {
    lang,
    pathname: page.path,
    body: pageBody(page, lang, cards),
    extraHead,
  })
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  const newsCards = await loadLongevityNewsCards()
  const apiCards = newsCards.filter((card) => String(card.id || '').startsWith('upload-')).length
  console.log(`[seo] longevity-news cards: ${newsCards.length} (api ${apiCards})`)
  let count = 0
  for (const page of SEO_PAGES) {
    for (const spec of SEO_LANGS) {
      const html = renderRouteHtml(template, {
        lang: spec.id,
        pathname: page.path,
        newsCards,
      })
      const dest = distFileFor(spec.id, page.path)
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.writeFile(dest, html, 'utf8')
      count += 1
    }
  }
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(), 'utf8')
  await fs.writeFile(path.join(distDir, 'llms.txt'), buildLlmsTxt(), 'utf8')
  console.log(`[seo] prerendered ${count} HTML pages + sitemap.xml + llms.txt → ${distDir}`)
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
