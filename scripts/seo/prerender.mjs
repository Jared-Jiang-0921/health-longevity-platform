/**
 * 构建后预渲染公开页 HTML（含 meta / hreflang / JSON-LD / 正文），供不执行 JS 的爬虫读取。
 * 语言前缀：中文默认路径，英文 /en。
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HOME_MODULES, getHomeCopy } from '../../src/data/homePageContent.js'
import { getLongevityNewsArticles } from '../../src/data/longevityNewsArticles.js'
import { LONGEVITY_NEWS_COLUMNS, columnDisplayLabel } from '../../src/data/longevityNewsColumns.js'
import { getLongevityNewsModuleCopy } from '../../src/data/longevityNewsModuleI18n.js'
import { PUBLIC_CRAWL_NAV, getAboutPage, getConsultPublicCopy, getFaqHeading, getSolutionsPublicCopy } from '../../src/data/publicSummary.js'
import {
  articleLanguages,
  isPublicNewsCard,
  newsArticleAlternates,
  newsArticleJsonLd,
  newsArticleRouterPath,
  newsArticleSeoFields,
  newsHubLastmod,
  newsReadingFaqs,
  newsRelatedLinks,
  newsSitemapEntries,
  presentNewsArticle,
} from '../../src/lib/newsArticleSeo.js'
import { newsPublicId } from '../../src/lib/newsSlug.js'
import { NMN_EVIDENCE_UPDATED } from '../../src/data/nmnEvidenceMeta.js'
import { OMEGA3_EVIDENCE_PATH, OMEGA3_EVIDENCE_UPDATED, getOmega3EvidencePage } from '../../src/data/omega3EvidencePage.js'
import { VITAMIN_D_EVIDENCE_PATH, VITAMIN_D_EVIDENCE_UPDATED, getVitaminDEvidencePage } from '../../src/data/vitaminDEvidencePage.js'
import { CREATINE_EVIDENCE_PATH, CREATINE_EVIDENCE_UPDATED, getCreatineEvidencePage } from '../../src/data/creatineEvidencePage.js'
import { MAGNESIUM_EVIDENCE_PATH, MAGNESIUM_EVIDENCE_UPDATED, getMagnesiumEvidencePage } from '../../src/data/magnesiumEvidencePage.js'
import { NMN_EVIDENCE_PATH, getNmnEvidencePage } from '../../src/data/nmnEvidencePage.js'
import { getPublicFaqPage } from '../../src/data/publicFaq.js'
import { getPublicMethodologyPage } from '../../src/data/publicMethodology.js'
import { getProductsEvidenceCopy, ingredientEvidenceLinks } from '../../src/data/productsEvidenceLibraryI18n.js'
import { SEO_LANGS, SEO_PAGES, SITE_ORIGIN, absoluteUrl } from '../../src/data/seo.js'
import { extractLongevityKeywords, toNewsSearchCard } from '../../src/lib/longevityNewsCard.js'
import { langSpec, renderHeadSnippet, resolveSeo } from '../../src/lib/seoDocument.js'
import { buildLlmsTxt, buildNewsAtom, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'

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
    ${evidenceNav(lang)}
  `
}

function evidenceNav(lang) {
  const heading = lang === 'en' ? 'Ingredient evidence' : '成分证据'
  const note = lang === 'en'
    ? 'These five pages are public. They give no dose and do not turn research into treatment, prevention, or an anti-aging effect.'
    : '这五页可以公开阅读。不提供用量，也不把研究写成治疗、预防或抗衰老疗效。'
  const items = ingredientEvidenceLinks(lang)
    .map((item) => `<li><a href="${escapeHtml(absoluteUrl(lang, item.path))}">${escapeHtml(item.label)}</a></li>`)
    .join('')
  return `<nav><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(note)}</p><ul>${items}</ul></nav>`
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

function consultBody(lang) {
  const page = getConsultPublicCopy(lang)
  return `
    <article>
      <h1>${escapeHtml(page.heading)}</h1>
      <p>${escapeHtml(page.lead)}</p>
      <h2>${escapeHtml(lang === 'zh' ? '适合谁' : 'Who it is for')}</h2>
      <p>${escapeHtml(page.who)}</p>
      <h2>${escapeHtml(lang === 'zh' ? '怎么进行' : 'How it works')}</h2>
      <p>${escapeHtml(page.process)}</p>
      <article><h3>${escapeHtml(page.general.title)}</h3><p>${escapeHtml(page.general.body)}</p></article>
      <article><h3>${escapeHtml(page.professional.title)}</h3><p>${escapeHtml(page.professional.body)}</p></article>
      <article><h3>${escapeHtml(page.tcm.title)}</h3><p>${escapeHtml(page.tcm.body)}</p></article>
      <h2>${escapeHtml(lang === 'zh' ? '边界' : 'Limits')}</h2>
      <p>${escapeHtml(page.boundary)}</p>
    </article>
  `
}

function solutionsBody(lang) {
  const page = getSolutionsPublicCopy(lang)
  const seo = resolveSeo('/solutions', lang)
  return `
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.lead)}</p>
    <p>${escapeHtml(page.medicalDisclaimer)}</p>
    <h2>${escapeHtml(lang === 'zh' ? '咨询' : 'Consults')}</h2>
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
  const fallback = 'longevity research'
  return found
    .map((term) => (term === '长寿研究' ? fallback : term))
    .filter((term) => !hasChinese(term))
}

function presentNewsCard(card, lang) {
  const base = presentNewsArticle(card, lang)
  return {
    ...base,
    keywords: displayKeywords(base.title, base.excerpt || base.summary, lang),
    columnLabel: columnDisplayLabel(base.column, lang) || base.column,
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
        description: shown.abstract || shown.excerpt || shown.title,
        url: isPublicNewsCard(shown, lang) && articleLanguages(shown).includes(lang)
          ? absoluteUrl(lang, newsArticleRouterPath(newsPublicId(shown.id)))
          : absoluteUrl('zh', newsArticleRouterPath(newsPublicId(shown.id))),
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
  const keywordLabel = lang === 'en' ? 'Keywords' : '关键词'
  const sections = []
  for (const [label, items] of grouped) {
    if (!items.length) continue
    const articles = items
      .map((card) => {
        const kws = card.keywords.length
          ? `<p>${escapeHtml(keywordLabel)}: ${escapeHtml(card.keywords.join(', '))}</p>`
          : ''
        const blurb = card.excerpt || String(card.abstract || '').slice(0, 220)
        const excerpt = blurb ? `<p>${escapeHtml(blurb)}</p>` : ''
        const onlyZh = card.zhOnly ? `<p>${escapeHtml('This item is in Chinese only')}</p>` : ''
        const hrefLang = articleLanguages(card).includes(lang) ? lang : 'zh'
        const heading = isPublicNewsCard(card, lang)
          ? `<a href="${escapeHtml(absoluteUrl(hrefLang, newsArticleRouterPath(newsPublicId(card.id))))}">${escapeHtml(card.title)}</a>`
          : escapeHtml(card.title)
        const dated = card.publishedAt ? `<p><time datetime="${escapeHtml(card.publishedAt)}">${escapeHtml(card.publishedAt)}</time></p>` : ''
        return `<article id="${escapeHtml(card.id)}"><h3>${heading}</h3>${dated}${onlyZh}${kws}${excerpt}</article>`
      })
      .join('')
    sections.push(`<section><h2>${escapeHtml(columnDisplayLabel(label, lang))}</h2>${articles}</section>`)
  }
  const mod = getLongevityNewsModuleCopy(lang)
  const faqs = newsReadingFaqs(lang).map((item) => `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`).join('')
  return `<h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p><p>${escapeHtml(mod.caveatPhrase)}</p>${evidenceNav(lang)}<p><a href="${escapeHtml(absoluteUrl(lang, '/methodology'))}">${escapeHtml(lang === 'en' ? 'How evidence is checked' : '证据核对说明')}</a></p>${moduleIntro('/longevity-news', lang)}<section><h2>${escapeHtml(getFaqHeading(lang))}</h2>${faqs}</section>${sections.join('')}`
}

function productsBody(lang) {
  const ev = getProductsEvidenceCopy(lang)
  const seo = resolveSeo('/products', lang)
  const steps = ev.checkSteps
    .map((step) => `<article><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.body)}</p></article>`)
    .join('')
  const scores = ev.scoringRows
    .map((row) => `<dt>${escapeHtml(row.dimension)}</dt><dd>${escapeHtml(row.explain)}</dd>`)
    .join('')
  const types = ev.productTypes.map((name) => `<li>${escapeHtml(name)}</li>`).join('')
  return `
    <h1>${escapeHtml(seo.title)}</h1>
    <p>${escapeHtml(seo.description)}</p>
    <p>${escapeHtml(ev.lead)}</p>
    <p>${escapeHtml(ev.roleDisclaimer)}</p>
    ${evidenceNav(lang)}
    <section><h2>${escapeHtml(ev.checkTitle)}</h2><p>${escapeHtml(ev.checkIntro)}</p>${steps}</section>
    <section><h2>${escapeHtml(ev.cnRegTitle)}</h2><p>${escapeHtml(ev.cnRegBody)}</p></section>
    <section><h2>${escapeHtml(ev.intlTitle)}</h2><p>${escapeHtml(ev.intlBody)}</p></section>
    <section><h2>${escapeHtml(ev.productTypesTitle)}</h2><ul>${types}</ul></section>
    <section><h2>${escapeHtml(ev.scoringTitle)}</h2><dl>${scores}</dl></section>
    <section><h2>${escapeHtml(ev.boundaryTitle)}</h2><p>${escapeHtml(ev.boundaryBody)}</p>
      <p><a href="${escapeHtml(absoluteUrl(lang, ev.pilotPath))}">${escapeHtml(ev.pilotLabel)}</a></p>
      <p><a href="${escapeHtml(absoluteUrl(lang, ev.secondPilotPath))}">${escapeHtml(ev.secondPilotLabel)}</a></p>
      <p><a href="${escapeHtml(absoluteUrl(lang, ev.thirdPilotPath))}">${escapeHtml(ev.thirdPilotLabel)}</a></p>
      <p><a href="${escapeHtml(absoluteUrl(lang, ev.fourthPilotPath))}">${escapeHtml(ev.fourthPilotLabel)}</a></p>
      <p><a href="${escapeHtml(absoluteUrl(lang, ev.fifthPilotPath))}">${escapeHtml(ev.fifthPilotLabel)}</a></p>
    </section>
  `
}

function evidenceBody(lang, page, updated) {
  const sections = page.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('')
      return `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.heading)}</h2>${paragraphs}</section>`
    })
    .join('')
  const sources = page.sources
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a><p>${escapeHtml(item.note)}</p></li>`,
    )
    .join('')
  const related = page.related
    .map(
      (item) =>
        `<li><a href="${escapeHtml(absoluteUrl(lang, item.path))}">${escapeHtml(item.label)}</a></li>`,
    )
    .join('')
  const faqs = page.faqs
    .map((item) => `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`)
    .join('')
  return `
    <article>
      <p>${escapeHtml(page.kicker)}</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p><time datetime="${escapeHtml(updated)}">${escapeHtml(page.updatedLabel)}：${escapeHtml(updated)}</time></p>
      <p>${escapeHtml(page.lead)}</p>
      <p>${escapeHtml(page.disclaimer)}</p>
      ${sections}
      <section><h2>${escapeHtml(page.sourcesHeading)}</h2><p>${escapeHtml(page.sourcesNote)}</p><ul>${sources}</ul></section>
      <section><h2>${escapeHtml(page.relatedHeading)}</h2><ul>${related}</ul></section>
      <section><h2>${escapeHtml(lang === 'en' ? 'Questions' : '常见问题')}</h2>${faqs}</section>
    </article>
  `
}

function faqBody(lang) {
  const page = getPublicFaqPage(lang)
  const seo = resolveSeo('/faq', lang)
  const faqs = page.faqs
    .map((item) => `<article><h2>${escapeHtml(item.q)}</h2><p>${escapeHtml(item.a)}</p></article>`)
    .join('')
  return `
    <article>
      <p>${escapeHtml(page.kicker)}</p>
      <h1>${escapeHtml(seo.title)}</h1>
      <p>${escapeHtml(page.lead)}</p>
      <p>${escapeHtml(page.disclaimer)}</p>
      ${faqs}
    </article>
  `
}

function methodologyBody(lang) {
  const page = getPublicMethodologyPage(lang)
  const seo = resolveSeo('/methodology', lang)
  const sections = page.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('')
      return `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.heading)}</h2>${paragraphs}</section>`
    })
    .join('')
  const related = page.related
    .map((item) => `<li><a href="${escapeHtml(absoluteUrl(lang, item.path))}">${escapeHtml(item.label)}</a></li>`)
    .join('')
  return `
    <article>
      <p>${escapeHtml(page.kicker)}</p>
      <h1>${escapeHtml(seo.title)}</h1>
      <p>${escapeHtml(page.lead)}</p>
      <p>${escapeHtml(page.disclaimer)}</p>
      ${sections}
      <section><h2>${escapeHtml(page.relatedHeading)}</h2><ul>${related}</ul></section>
    </article>
  `
}

function pageBody(page, lang, newsCards) {
  if (page.type === 'home') return homeBody(lang)
  if (page.path === '/about') return aboutBody(lang)
  if (page.path === '/solutions') return solutionsBody(lang)
  if (page.path === '/consult') return consultBody(lang)
  if (page.path === '/products') return productsBody(lang)
  if (page.path === NMN_EVIDENCE_PATH) return evidenceBody(lang, getNmnEvidencePage(lang), NMN_EVIDENCE_UPDATED)
  if (page.path === OMEGA3_EVIDENCE_PATH) return evidenceBody(lang, getOmega3EvidencePage(lang), OMEGA3_EVIDENCE_UPDATED)
  if (page.path === VITAMIN_D_EVIDENCE_PATH) return evidenceBody(lang, getVitaminDEvidencePage(lang), VITAMIN_D_EVIDENCE_UPDATED)
  if (page.path === CREATINE_EVIDENCE_PATH) return evidenceBody(lang, getCreatineEvidencePage(lang), CREATINE_EVIDENCE_UPDATED)
  if (page.path === MAGNESIUM_EVIDENCE_PATH) return evidenceBody(lang, getMagnesiumEvidencePage(lang), MAGNESIUM_EVIDENCE_UPDATED)
  if (page.path === '/faq') return faqBody(lang)
  if (page.path === '/methodology') return methodologyBody(lang)
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

function newsArticleBody(view, lang) {
  const mod = getLongevityNewsModuleCopy(lang)
  const takes = (view.takeaways || []).filter(Boolean)
  const abstract = view.abstract || ''
  const takesAreAbstract = takes.length > 0 && abstract === takes.join(lang === 'en' ? ' ' : '；')
  const list = takes.length && !takesAreAbstract
    ? `<h2>${escapeHtml(lang === 'zh' ? '阅读要点' : 'Takeaways')}</h2><ul>${takes.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
    : ''
  const dated = view.publishedAt ? `<p><time datetime="${escapeHtml(view.publishedAt)}">${escapeHtml(view.publishedAt)}</time></p>` : ''
  const revised = view.contentUpdated
    ? `<p>${escapeHtml(lang === 'zh' ? '说明更新' : 'Note updated')}：<time datetime="${escapeHtml(view.contentUpdated)}">${escapeHtml(view.contentUpdated)}</time></p>`
    : ''
  const excerpt = abstract ? `<p>${escapeHtml(abstract)}</p>` : ''
  const source = view.url && /^https?:\/\//i.test(view.url)
    ? `<p>${escapeHtml(lang === 'zh' ? '来源页' : 'Source page')}：<a href="${escapeHtml(view.url)}">${escapeHtml(view.url)}</a></p>`
    : ''
  const papers = (view.sourceLinks || []).filter((item) => item?.url && /^https?:\/\//i.test(item.url))
  const paperHtml = papers.length
    ? `<h2>${escapeHtml(lang === 'zh' ? '原始文献' : 'Primary sources')}</h2><ul>${papers.map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label || item.url)}</a></li>`).join('')}</ul>`
    : ''
  const note = view.sourceNote ? `<p>${escapeHtml(view.sourceNote)}</p>` : ''
  const related = newsRelatedLinks(view, lang)
  const relatedHtml = related.length
    ? `<h2>${escapeHtml(lang === 'zh' ? '相关页面' : 'Related pages')}</h2><ul>${related.map((item) => `<li><a href="${escapeHtml(absoluteUrl(lang, item.path))}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>`
    : ''
  const back = `<p><a href="${escapeHtml(absoluteUrl(lang, '/longevity-news'))}">${escapeHtml(navLabel('/longevity-news', lang))}</a></p>`
  return `<article><h1>${escapeHtml(view.title)}</h1>${dated}${revised}${excerpt}${list}${note}${source}${paperHtml}${relatedHtml}<p>${escapeHtml(mod.caveatPhrase)}</p>${back}</article>`
}

function injectHtml(template, { lang, pathname, body, extraHead = '', head }) {
  const spec = langSpec(lang)
  const headHtml = head
    ? renderHeadSnippet({ lang, pathname, ...head })
    : renderHeadSnippet({ lang, pathname })
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
  html = html.replace('</head>', `    ${headHtml}\n    ${extraHead}\n  </head>`)
  html = html.replace(/<div id="root"><\/div>/, root)
  return html
}

export function staticNewsCards() {
  return getLongevityNewsArticles().map((item) => toNewsSearchCard(item)).filter((card) => card.title)
}

const SPA_SHELL_COPY = {
  zh: {
    title: '站内功能 | 长健星图',
    description: '这个地址是站内功能或未公开的条目，不是可引用的公开页面。商品详情、购物页和课程仍不是公开语料。已单独预渲染的成分证据页不使用这个壳。',
  },
  en: {
    title: 'In-app route | Longevity Atlas',
    description: 'This address is an in-app route or an unpublished item, not a public page to cite. Product details, shopping pages, and courses are not a public corpus. A separately prerendered ingredient page does not use this shell.',
  },
}

export function renderSpaShellHtml(template, { lang }) {
  const copy = SPA_SHELL_COPY[lang] || SPA_SHELL_COPY.zh
  return injectHtml(template, {
    lang,
    pathname: '/',
    body: `<h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.description)}</p>`,
    head: {
      seo: {
        title: copy.title,
        description: copy.description,
        canonical: '',
        robots: 'noindex,nofollow',
        indexable: false,
      },
      jsonLd: null,
      alternates: [],
    },
  })
}

export function renderNewsArticleHtml(template, { lang, card }) {
  const view = presentNewsArticle(card, lang)
  if (!articleLanguages(card).includes(lang) || !isPublicNewsCard(view, lang)) return null
  return injectHtml(template, {
    lang,
    pathname: newsArticleRouterPath(newsPublicId(view.id)),
    body: newsArticleBody(view, lang),
    head: {
      seo: newsArticleSeoFields(view, lang),
      jsonLd: newsArticleJsonLd(view, lang),
      alternates: newsArticleAlternates(card),
    },
  })
}

export function renderRouteHtml(template, { lang, pathname, newsCards = [] }) {
  const page = SEO_PAGES.find((item) => item.path === pathname)
  if (!page) return null
  const cards = page.path === '/longevity-news' && newsCards.length === 0 ? staticNewsCards() : newsCards
  const feedHref = `${SITE_ORIGIN}/longevity-news/feed.xml`
  const extraHead =
    page.path === '/longevity-news'
      ? `<link rel="alternate" type="application/atom+xml" href="${feedHref}" title="前沿医学资讯" />\n    <script type="application/ld+json" data-seo-news="1">${JSON.stringify(newsJsonLd(lang, cards)).replace(/</g, '\\u003c')}</script>`
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
  for (const card of newsCards) {
    for (const lang of articleLanguages(card)) {
      const html = renderNewsArticleHtml(template, { lang, card })
      if (!html) continue
      const dest = distFileFor(lang, newsArticleRouterPath(newsPublicId(card.id)))
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.writeFile(dest, html, 'utf8')
      count += 1
    }
  }
  for (const spec of SEO_LANGS) {
    const shell = renderSpaShellHtml(template, { lang: spec.id })
    const shellPath = spec.prefix
      ? path.join(distDir, spec.prefix.replace(/^\//, ''), 'spa-shell.html')
      : path.join(distDir, 'spa-shell.html')
    await fs.mkdir(path.dirname(shellPath), { recursive: true })
    await fs.writeFile(shellPath, shell, 'utf8')
  }
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml({
    extra: newsSitemapEntries(newsCards),
    newsLastmod: newsHubLastmod(newsCards),
  }), 'utf8')
  await fs.writeFile(path.join(distDir, 'llms.txt'), buildLlmsTxt({ articles: newsCards }), 'utf8')
  const feedPath = path.join(distDir, 'longevity-news', 'feed.xml')
  await fs.mkdir(path.dirname(feedPath), { recursive: true })
  await fs.writeFile(feedPath, buildNewsAtom({ articles: newsCards }), 'utf8')
  console.log(`[seo] prerendered ${count} HTML pages + spa shells + sitemap.xml + llms.txt + feed.xml → ${distDir}`)
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
