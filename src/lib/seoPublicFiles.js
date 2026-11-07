import { SEO_LANGS, SEO_PAGES, SITE_ORIGIN, absoluteUrl } from '../data/seo.js'
import { getAboutPage, getPageFaqs } from '../data/publicSummary.js'

export function buildSitemapXml(now = new Date()) {
  const today = now.toISOString().slice(0, 10)
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

function pushParagraphs(lines, paragraphs) {
  for (const paragraph of paragraphs || []) {
    lines.push(paragraph)
    lines.push('')
  }
}

export function buildLlmsTxt() {
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
  return lines.join('\n')
}
