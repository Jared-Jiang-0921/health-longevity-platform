/**
 * 构建后预渲染公开页 HTML（含 meta / hreflang / JSON-LD / 正文），供不执行 JS 的爬虫读取。
 * 语言前缀：中文默认路径，英文 /en，阿拉伯语 /ar。
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HOME_MODULES, getHomeCopy } from '../../src/data/homePageContent.js'
import { SEO_LANGS, SEO_PAGES, absoluteUrl } from '../../src/data/seo.js'
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

function pageBody(page, lang) {
  if (page.type === 'home') return homeBody(lang)
  if (page.type === 'legal') return legalBody(page, lang)
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

function injectHtml(template, { lang, pathname, body }) {
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
  html = html.replace('</head>', `    ${head}\n  </head>`)
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
  let count = 0
  for (const page of SEO_PAGES) {
    for (const spec of SEO_LANGS) {
      const html = injectHtml(template, {
        lang: spec.id,
        pathname: page.path,
        body: pageBody(page, spec.id),
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
