/**
 * 构建后预渲染公开页 HTML（含 meta / hreflang / JSON-LD / 正文），供不执行 JS 的爬虫读取。
 * 语言前缀：中文默认路径，英文 /en，阿拉伯语 /ar。
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HOME_MODULES, getHomeCopy } from '../../src/data/homePageContent.js'
import { getLongevityNewsArticles } from '../../src/data/longevityNewsArticles.js'
import { LONGEVITY_NEWS_COLUMNS } from '../../src/data/longevityNewsColumns.js'
import { SEO_LANGS, SEO_PAGES, SITE_ORIGIN, absoluteUrl } from '../../src/data/seo.js'
import { toNewsSearchCard } from '../../src/lib/longevityNewsCard.js'
import { langSpec, renderHeadSnippet, resolveSeo } from '../../src/lib/seoDocument.js'

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
  `
}

async function loadLongevityNewsCards() {
  const staticCards = getLongevityNewsArticles().map((item) => toNewsSearchCard(item))
  const origin = String(process.env.SEO_NEWS_API || 'http://127.0.0.1:3000').replace(/\/$/, '')
  let uploads = []
  try {
    const res = await fetch(`${origin}/api/module-assets?module=longevity-news`, {
      signal: AbortSignal.timeout(12000),
    })
    if (res.ok) {
      const data = await res.json()
      uploads = (Array.isArray(data.items) ? data.items : []).map((item) =>
        toNewsSearchCard({
          id: `upload-${item.id}`,
          column: item.subcategory,
          title: item.title,
          summary: item.summary,
          external_url: item.external_url,
          created_at: item.created_at,
        }),
      )
    } else {
      console.warn(`[seo] longevity-news assets HTTP ${res.status} from ${origin}`)
    }
  } catch (err) {
    console.warn(`[seo] longevity-news assets skipped: ${err.message}`)
  }
  return [...uploads, ...staticCards].filter((card) => card.title)
}

function newsJsonLd(lang, cards) {
  const canonical = absoluteUrl(lang, '/longevity-news')
  const keywords = [...new Set(cards.flatMap((card) => card.keywords))].slice(0, 48)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'zh' ? '前沿医学资讯检索卡片' : 'Longevity insight cards',
    url: canonical,
    numberOfItems: cards.length,
    itemListElement: cards.slice(0, 200).map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        headline: card.title,
        keywords: card.keywords.join(', '),
        description: card.excerpt || card.title,
        url: `${canonical}#${encodeURIComponent(card.id)}`,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        ...(card.url ? { isBasedOn: card.url } : {}),
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
    grouped.get(label).push(card)
  }
  const sections = []
  for (const [label, items] of grouped) {
    if (!items.length) continue
    const articles = items
      .map((card) => {
        const kws = card.keywords.length
          ? `<p>关键词：${escapeHtml(card.keywords.join('、'))}</p>`
          : ''
        const excerpt = card.excerpt ? `<p>${escapeHtml(card.excerpt)}</p>` : ''
        return `<article id="${escapeHtml(card.id)}"><h3>${escapeHtml(card.title)}</h3>${kws}${excerpt}</article>`
      })
      .join('')
    sections.push(`<section><h2>${escapeHtml(label)}</h2>${articles}</section>`)
  }
  return `<h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p>${moduleIntro('/longevity-news', lang)}${sections.join('')}`
}

function pageBody(page, lang, newsCards) {
  if (page.type === 'home') return homeBody(lang)
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
}

function injectHtml(template, { lang, pathname, body, extraHead = '' }) {
  const spec = langSpec(lang)
  const head = renderHeadSnippet({ lang, pathname })
  const langs = langLinks(pathname, lang)
  const root = `<div id="root">
      <main class="seo-prerender" lang="${escapeHtml(spec.htmlLang)}" dir="${escapeHtml(spec.dir)}">
        ${langs}
        ${body}
      </main>
    </div>`
  let html = stripBaselineSeo(template)
  html = html.replace(/<html([^>]*)>/i, `<html lang="${spec.htmlLang}" dir="${spec.dir}">`)
  html = html.replace('</head>', `    ${head}\n    ${extraHead}\n  </head>`)
  html = html.replace(/<div id="root"><\/div>/, root)
  return html
}

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = SEO_PAGES.filter((page) => page.index).map((page) => {
    const loc = absoluteUrl('zh', page.path)
    const alts = SEO_LANGS.map(
      (item) =>
        `    <xhtml:link rel="alternate" hreflang="${item.hreflang}" href="${absoluteUrl(item.id, page.path)}"/>`,
    )
    alts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl('zh', page.path)}"/>`)
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alts.join('\n')}
  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  const newsCards = await loadLongevityNewsCards()
  console.log(`[seo] longevity-news cards: ${newsCards.length}`)
  let count = 0
  for (const page of SEO_PAGES) {
    for (const spec of SEO_LANGS) {
      const extraHead =
        page.path === '/longevity-news'
          ? `<script type="application/ld+json" data-seo-news="1">${JSON.stringify(newsJsonLd(spec.id, newsCards))}</script>`
          : ''
      const html = injectHtml(template, {
        lang: spec.id,
        pathname: page.path,
        body: pageBody(page, spec.id, newsCards),
        extraHead,
      })
      const dest = distFileFor(spec.id, page.path)
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.writeFile(dest, html, 'utf8')
      count += 1
    }
  }
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml(), 'utf8')
  console.log(`[seo] prerendered ${count} HTML pages + sitemap.xml → ${distDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
