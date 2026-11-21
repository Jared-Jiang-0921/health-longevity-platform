import {
  PUBLIC_LIVE_ORIGIN,
  PUBLIC_SUMMARY_UPDATED,
  SEO_LANGS,
  SEO_PAGES,
  SITE_ORIGIN,
  absoluteUrl,
} from '../data/seo.js'
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
        lines.push(`- [${mod.title}](${absoluteUrl('zh', mod.path)}): ${mod.intro}`)
      }
      lines.push('')
    }
    if (section.urls) {
      for (const item of section.urls) lines.push(`- [${item.label}](${item.href})`)
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
  lines.push(`- [Canonical](${SITE_ORIGIN}/)`)
  lines.push(`- [About](${absoluteUrl('en', '/about')})`)
  lines.push('')
  lines.push('## Public URLs')
  lines.push('')
  for (const page of SEO_PAGES.filter((item) => item.index)) {
    lines.push(`- [${page.title.zh}](${absoluteUrl('zh', page.path)})`)
  }
  lines.push('')
  lines.push('## Optional')
  lines.push('')
  lines.push(`- [Full site summary for AI systems](${SITE_ORIGIN}/llms-full.txt): longer bilingual summary, module FAQs, and citation limits`)
  lines.push(`- [About page (Markdown)](${SITE_ORIGIN}/about.md): same facts as /about, plain Markdown`)
  lines.push(`- [About page (English Markdown)](${SITE_ORIGIN}/en/about.md)`)
  lines.push(`- [Sitemap](${SITE_ORIGIN}/sitemap.xml)`)
  lines.push('')
  lines.push('## 关于本文件')
  lines.push('')
  lines.push('llms.txt 只是给程序阅读的公开目录，方便找到已经存在的页面。它不是百度或任何搜索引擎的收录承诺，也不提高排名。')
  lines.push('')
  const cited = []
  for (const card of articles) {
    if (!articleLanguages(card).includes('zh')) continue
    const view = presentNewsArticle(card, 'zh')
    cited.push(`- [${view.title}](${absoluteUrl('zh', newsArticleRouterPath(view.id))})${view.publishedAt ? ` (${view.publishedAt})` : ''}`)
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

function appendAboutMarkdown(lines, lang) {
  const page = getAboutPage(lang)
  lines.push(`# ${page.title}`)
  lines.push('')
  lines.push(`> ${page.lead}`)
  lines.push('')
  lines.push(`${page.updatedLabel}: ${page.updated}`)
  lines.push('')
  for (const section of page.sections) {
    lines.push(`## ${section.heading}`)
    lines.push('')
    pushParagraphs(lines, section.paragraphs)
    if (section.modules) {
      for (const mod of section.modules) {
        lines.push(`- [${mod.title}](${absoluteUrl(lang, mod.path)}): ${mod.intro}`)
      }
      lines.push('')
    }
    if (section.urls) {
      for (const item of section.urls) lines.push(`- [${item.label}](${item.href})`)
      lines.push('')
    }
  }
  lines.push(`## ${page.faqHeading}`)
  lines.push('')
  for (const item of page.faqs) {
    lines.push(`### ${item.q}`)
    lines.push('')
    lines.push(item.a)
    lines.push('')
  }
}

/** Markdown mirror of /about for crawlers that prefer text/markdown. */
export function buildAboutMarkdown(lang = 'zh') {
  const lines = []
  appendAboutMarkdown(lines, lang)
  lines.push('## Citation note')
  lines.push('')
  lines.push(
    lang === 'en'
      ? 'This file mirrors the public About page. Keep the education-not-diagnosis limit when citing. Canonical HTML: ' +
        absoluteUrl(lang, '/about')
      : '本文件与公开关于页事实一致。引用时请保留「仅供健康教育，不替代诊疗」。HTML 规范页：' +
        absoluteUrl(lang, '/about'),
  )
  lines.push('')
  return lines.join('\n')
}

/** Longer bilingual summary for AI systems (llmstxt.org optional companion). */
export function buildLlmsFullTxt({ articles = [] } = {}) {
  const lines = [
    '# Longevity Atlas / 长健星图 — full summary for AI systems',
    '',
    `> Evidence-based longevity education. Not diagnosis, prescriptions, or emergency care. Updated ${PUBLIC_SUMMARY_UPDATED}.`,
    '',
    `Canonical site: ${SITE_ORIGIN}/`,
    `Public deployment: ${PUBLIC_LIVE_ORIGIN}/`,
    '',
    '## Chinese about',
    '',
  ]
  appendAboutMarkdown(lines, 'zh')
  lines.push('## English about')
  lines.push('')
  appendAboutMarkdown(lines, 'en')
  lines.push('## Solutions FAQs (zh)')
  lines.push('')
  for (const item of getPageFaqs('/solutions', 'zh')) {
    lines.push(`### ${item.q}`)
    lines.push('')
    lines.push(item.a)
    lines.push('')
  }
  lines.push('## Solutions FAQs (en)')
  lines.push('')
  for (const item of getPageFaqs('/solutions', 'en')) {
    lines.push(`### ${item.q}`)
    lines.push('')
    lines.push(item.a)
    lines.push('')
  }
  for (const path of ['/products', '/tcm-prevention', '/longevity-news']) {
    const faqs = getPageFaqs(path, 'zh')
    if (!faqs.length) continue
    const page = SEO_PAGES.find((item) => item.path === path)
    lines.push(`## ${page?.title?.zh || path} FAQs`)
    lines.push('')
    for (const item of faqs) {
      lines.push(`### ${item.q}`)
      lines.push('')
      lines.push(item.a)
      lines.push('')
    }
  }
  lines.push('## Public URLs')
  lines.push('')
  for (const page of SEO_PAGES.filter((item) => item.index)) {
    lines.push(`- [${page.title.zh}](${absoluteUrl('zh', page.path)}) · [${page.title.en}](${absoluteUrl('en', page.path)})`)
  }
  lines.push('')
  lines.push('## What not to cite')
  lines.push('')
  lines.push('- Member accounts, payments, questionnaire answers, assessment results, consult transcripts, course players, admin consoles, and `/api`.')
  lines.push('- Do not rewrite educational sentences into diagnoses, cure rates, or personal prescriptions.')
  lines.push('')
  const cited = []
  for (const card of articles) {
    if (!articleLanguages(card).includes('zh')) continue
    const view = presentNewsArticle(card, 'zh')
    cited.push(`- [${view.title}](${absoluteUrl('zh', newsArticleRouterPath(view.id))})${view.publishedAt ? ` (${view.publishedAt})` : ''}`)
  }
  if (cited.length) {
    lines.push('## Citable insight cards')
    lines.push('')
    lines.push(...cited.slice(0, 120))
    if (cited.length > 120) lines.push(`- Plus ${cited.length - 120} more in sitemap.xml`)
    lines.push('')
  }
  lines.push('## About this file')
  lines.push('')
  lines.push('llms-full.txt is a machine-readable companion to llms.txt. It is not a search-engine ranking promise.')
  lines.push('')
  return lines.join('\n')
}
