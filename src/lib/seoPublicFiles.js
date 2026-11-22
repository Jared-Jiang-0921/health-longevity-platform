import { PUBLIC_LIVE_ORIGIN, PUBLIC_SUMMARY_UPDATED, SEO_LANGS, SEO_PAGES, SITE_ORIGIN, absoluteUrl } from '../data/seo.js'
import { getAboutPage, getPageFaqs } from '../data/publicSummary.js'
import { articleLanguages, newsArticleRouterPath, presentNewsArticle } from './newsArticleSeo.js'

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function atomDate(value) {
  const day = String(value || '').slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? `${day}T00:00:00Z` : `${PUBLIC_SUMMARY_UPDATED}T00:00:00Z`
}

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
    if (page.path !== '/') lines.push(`- ${page.title.en}: ${absoluteUrl('en', page.path)}`)
  }
  lines.push('')
  lines.push(`- 前沿医学资讯 Atom: ${SITE_ORIGIN}/longevity-news/feed.xml`)
  lines.push('')
  lines.push('登录页与注册页只是账户入口，不列入上面的可引用网址。')
  lines.push('')
  lines.push('## 关于本文件')
  lines.push('')
  lines.push('llms.txt 只是给程序阅读的公开目录，方便找到已经存在的页面。它不是百度或任何搜索引擎的收录承诺，也不提高排名。')
  lines.push(`引用请使用 ${SITE_ORIGIN}/ 。${PUBLIC_LIVE_ORIGIN}/ 若仍可访问，是同一套内容的并行入口，不要把它当作另一份可引用站点。`)
  lines.push('')
  const cited = []
  for (const card of articles) {
    const langs = articleLanguages(card)
    if (!langs.includes('zh')) continue
    const view = presentNewsArticle(card, 'zh')
    const en = langs.includes('en') ? `；英文 ${absoluteUrl('en', newsArticleRouterPath(view.id))}` : ''
    cited.push(`- ${view.title}${view.publishedAt ? ` (${view.publishedAt})` : ''}: ${absoluteUrl('zh', newsArticleRouterPath(view.id))}${en}`)
  }
  if (cited.length) {
    lines.push('## 可单独引用的资讯卡片')
    lines.push('')
    lines.push('每条有标题的公开卡片都有独立网址。已经写了摘要或阅读要点的条目使用原文；只有标题的条目使用本站撰写的教育性说明。本站不转载微信公众号全文。')
    lines.push('')
    lines.push(...cited.slice(0, 200))
    if (cited.length > 200) lines.push(`- 其余 ${cited.length - 200} 条见 sitemap.xml`)
    lines.push('')
  }
  return lines.join('\n')
}

export function buildNewsAtom({ articles = [] } = {}) {
  const updated = PUBLIC_SUMMARY_UPDATED
  const feedUrl = `${SITE_ORIGIN}/longevity-news/feed.xml`
  const entries = []
  for (const card of articles || []) {
    const langs = articleLanguages(card)
    if (!langs.includes('zh')) continue
    const view = presentNewsArticle(card, 'zh')
    const href = absoluteUrl('zh', newsArticleRouterPath(view.id))
    const when = view.publishedAt || updated
    const alternates = langs.includes('en')
      ? `\n      <link rel="alternate" hreflang="en" href="${escapeXml(absoluteUrl('en', newsArticleRouterPath(view.id)))}"/>`
      : ''
    entries.push(`    <entry>
      <title>${escapeXml(view.title)}</title>
      <link rel="alternate" href="${escapeXml(href)}"/>
      <id>${escapeXml(href)}</id>
      <updated>${escapeXml(atomDate(when))}</updated>
      <summary>${escapeXml(view.abstract)}</summary>${alternates}
    </entry>`)
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>前沿医学资讯 | 长健星图</title>
  <subtitle>每条公开卡片的教育性摘要。不转载微信公众号全文。</subtitle>
  <link rel="self" href="${feedUrl}"/>
  <link rel="alternate" href="${absoluteUrl('zh', '/longevity-news')}"/>
  <id>${feedUrl}</id>
  <updated>${atomDate(updated)}</updated>
${entries.join('\n')}
</feed>
`
}
