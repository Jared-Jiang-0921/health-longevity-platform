import { PUBLIC_SUMMARY_UPDATED, SEO_LANGS, SEO_PAGES, SITE_ORIGIN, absoluteUrl } from '../data/seo.js'
import { getAboutPage, getPageFaqs } from '../data/publicSummary.js'
import { articleLanguages, newsArticleRouterPath, presentNewsArticle } from './newsArticleSeo.js'

function hreflangLinks(path, langs) {
  const allowed = new Set(langs || SEO_LANGS.map((item) => item.id))
  const lines = SEO_LANGS.filter((item) => allowed.has(item.id)).map(
    (item) => `    <xhtml:link rel="alternate" hreflang="${item.hreflang}" href="${absoluteUrl(item.id, path)}"/>`,
  )
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl('zh', path)}"/>`)
  return lines
}

function urlEntry({ path, lastmod, changefreq, priority, langs }) {
  const loc = absoluteUrl('zh', path)
  const last = lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''
  return `  <url>
    <loc>${loc}</loc>
${last}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks(path, langs).join('\n')}
  </url>`
}

export function buildSitemapXml(options = {}) {
  const extra = Array.isArray(options.extra) ? options.extra : []
  const newsLastmod = options.newsLastmod || ''
  const pages = SEO_PAGES.filter((page) => page.index).map((page) => urlEntry({
    path: page.path,
    lastmod: page.path === '/longevity-news' && newsLastmod ? newsLastmod : PUBLIC_SUMMARY_UPDATED,
    changefreq: page.changefreq,
    priority: page.priority,
  }))
  const articles = extra.map((item) => urlEntry(item))
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...pages, ...articles].join('\n')}
</urlset>
`
}

function pushParagraphs(lines, paragraphs) {
  for (const paragraph of paragraphs || []) {
    lines.push(paragraph)
    lines.push('')
  }
}

export function buildLlmsTxt({ articles = [] } = {}) {
  const zh = getAboutPage('zh')
  const en = getAboutPage('en')
  const lines = [
    `# ${zh.kicker}`,
    '',
    `> ${zh.lead}`,
    '',
    `${zh.updatedLabel}: ${zh.updated}`,
    '',
  ]
  for (const section of zh.sections) {
    lines.push(`## ${section.heading}`)
    lines.push('')
    pushParagraphs(lines, section.paragraphs)
    if (section.modules) {
      for (const mod of section.modules) {
        lines.push(`- ${mod.title} (${absoluteUrl('zh', mod.path)}): ${mod.intro}`)
      }
      lines.push('')
    }
    if (section.urls) {
      for (const item of section.urls) lines.push(`- ${item.label}: ${item.href}`)
      lines.push('')
    }
  }
  lines.push(`## ${zh.faqHeading}`)
  lines.push('')
  for (const item of zh.faqs) {
    lines.push(`### ${item.q}`)
    lines.push('')
    lines.push(item.a)
    lines.push('')
  }
  lines.push('## 方案页常见问题')
  lines.push('')
  for (const item of getPageFaqs('/solutions', 'zh')) {
    lines.push(`### ${item.q}`)
    lines.push('')
    lines.push(item.a)
    lines.push('')
  }
  lines.push('## English summary')
  lines.push('')
  lines.push(en.lead)
  lines.push('')
  lines.push(`Canonical: ${SITE_ORIGIN}/`)
  lines.push(`About: ${absoluteUrl('en', '/about')}`)
  lines.push('')
  lines.push('## Public URLs')
  lines.push('')
  for (const page of SEO_PAGES.filter((item) => item.index)) {
    lines.push(`- ${page.title.zh}: ${absoluteUrl('zh', page.path)}`)
  }
  lines.push('')
  lines.push('## 关于本文件')
  lines.push('')
  lines.push('llms.txt 只是给程序阅读的公开目录，方便找到已经存在的页面。它不是百度或任何搜索引擎的收录承诺，也不提高排名。')
  lines.push('')
  const cited = []
  for (const card of articles) {
    if (!articleLanguages(card).includes('zh')) continue
    const view = presentNewsArticle(card, 'zh')
    cited.push(`- ${view.title}${view.publishedAt ? ` (${view.publishedAt})` : ''}: ${absoluteUrl('zh', newsArticleRouterPath(view.id))}`)
  }
  if (cited.length) {
    lines.push('## 可单独引用的资讯卡片')
    lines.push('')
    lines.push('只有本站已经写了摘要或阅读要点的条目才有单独网址。只有标题的卡片仍留在栏目页，不另建空页。')
    lines.push('')
    lines.push(...cited.slice(0, 80))
    if (cited.length > 80) lines.push(`- 其余 ${cited.length - 80} 条见 sitemap.xml`)
    lines.push('')
  }
  return lines.join('\n')
}
