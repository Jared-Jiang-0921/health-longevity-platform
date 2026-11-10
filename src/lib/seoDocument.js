import { getPageFaqs } from '../data/publicSummary.js'
import { SITE_LEGAL } from '../data/siteLegal.js'
import {
  DEFAULT_OG_IMAGE,
  PUBLIC_SUMMARY_UPDATED,
  SEO_BRAND,
  SEO_LANGS,
  SITE_ORIGIN,
  absoluteUrl,
  findSeoPage,
  pageIndexable,
} from '../data/seo.js'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function langSpec(lang) {
  return SEO_LANGS.find((item) => item.id === lang) || SEO_LANGS[0]
}

export function resolveSeo(pathname, lang) {
  const page = findSeoPage(pathname)
  const brand = SEO_BRAND[lang] || SEO_BRAND.zh
  const indexable = pageIndexable(pathname)
  const title = page?.title?.[lang] || page?.title?.zh || brand.name
  const description = page?.description?.[lang] || page?.description?.zh || brand.description
  const canonical = absoluteUrl(lang, page?.path || pathname || '/')
  const robots = indexable
    ? 'index,follow,max-snippet:-1,max-image-preview:large'
    : 'noindex,nofollow'
  return { page, title, description, canonical, robots, indexable }
}

const EDUCATION_DISCLAIMER = {
  zh: '仅供健康教育与生活方式参考，不替代专业诊疗、处方或紧急医疗处置。',
  en: 'For education and lifestyle reference only—not diagnosis, prescriptions, or emergency care.',
  ar: 'للتعليم ونمط الحياة فقط، وليس بديلاً عن التشخيص أو الوصفات أو الطوارئ.',
}

export function buildJsonLd({ lang, pathname, title, description, canonical }) {
  const spec = langSpec(lang)
  const brand = SEO_BRAND[lang] || SEO_BRAND.zh
  const page = findSeoPage(pathname)
  const inLanguage = spec.htmlLang
  const usageInfo = EDUCATION_DISCLAIMER[lang] || EDUCATION_DISCLAIMER.zh
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: brand.name,
    description: brand.description,
    inLanguage: ['zh-Hans', 'en', 'ar'],
    publisher: { '@id': `${SITE_ORIGIN}/#org` },
  }
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#org`,
    name: brand.name,
    legalName: SITE_LEGAL.legalEntityName,
    description: brand.description,
    url: `${SITE_ORIGIN}/`,
    logo: DEFAULT_OG_IMAGE,
    email: SITE_LEGAL.contactEmail,
  }
  const webPage = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    publisher: { '@id': `${SITE_ORIGIN}/#org` },
    about: {
      '@type': 'Thing',
      name: lang === 'zh' ? '健康长寿与预防保健' : 'Health, longevity and prevention',
    },
    usageInfo,
    disclaimer: usageInfo,
  }
  if (page?.path === '/about') webPage.dateModified = PUBLIC_SUMMARY_UPDATED
  const graph = [org, website, webPage]
  const faqs = getPageFaqs(page?.path || pathname, lang)
  if (faqs.length) {
    const faqId = `${canonical}#faq`
    webPage.mainEntity = { '@id': faqId }
    graph.push({
      '@type': 'FAQPage',
      '@id': faqId,
      url: canonical,
      inLanguage,
      isPartOf: { '@id': `${canonical}#webpage` },
      usageInfo,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    })
  }
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function buildHeadTags({ lang, pathname }) {
  const spec = langSpec(lang)
  const seo = resolveSeo(pathname, lang)
  const jsonLd = buildJsonLd({ lang, pathname, ...seo })
  const alternates = SEO_LANGS.map((item) => ({
    hreflang: item.hreflang,
    href: absoluteUrl(item.id, seo.page?.path || pathname || '/'),
  }))
  alternates.push({
    hreflang: 'x-default',
    href: absoluteUrl('zh', seo.page?.path || pathname || '/'),
  })
  return { spec, seo, jsonLd, alternates }
}

export function renderHeadSnippet({ lang, pathname, seo, jsonLd, alternates }) {
  const built = seo
    ? { spec: langSpec(lang), seo, jsonLd, alternates: alternates || [] }
    : buildHeadTags({ lang, pathname })
  return renderHeadFromParts(built)
}

function renderHeadFromParts({ spec, seo, jsonLd, alternates }) {
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${seo.robots}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    ...alternates.map(
      (item) =>
        `<link rel="alternate" hreflang="${escapeHtml(item.hreflang)}" href="${escapeHtml(item.href)}" />`,
    ),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SEO_BRAND.zh.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}" />`,
    `<meta property="og:locale" content="${spec.ogLocale}" />`,
    ...SEO_LANGS.filter((item) => item.id !== spec.id).map(
      (item) => `<meta property="og:locale:alternate" content="${item.ogLocale}" />`,
    ),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}" />`,
    `<link rel="alternate" type="text/plain" href="${escapeHtml(`${SITE_ORIGIN}/llms.txt`)}" title="llms.txt" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
  return lines.join('\n    ')
}

const MANAGED = 'data-seo-managed'

export function applySeoToDocument({ lang, pathname, seo, jsonLd, alternates, replaceUnmanaged = false }) {
  if (typeof document === 'undefined') return
  const built = seo
    ? { spec: langSpec(lang), seo, jsonLd, alternates: alternates || [] }
    : buildHeadTags({ lang, pathname })
  const { spec, seo: resolved, jsonLd: resolvedJson, alternates: resolvedAlts } = {
    spec: built.spec,
    seo: built.seo,
    jsonLd: built.jsonLd,
    alternates: built.alternates,
  }
  document.documentElement.lang = spec.htmlLang
  document.documentElement.dir = spec.dir
  document.title = resolved.title

  const head = document.head
  head.querySelectorAll(`[${MANAGED}]`).forEach((el) => el.remove())
  if (replaceUnmanaged) {
    head.querySelectorAll(
      'meta[name="description"], meta[name="robots"], link[rel="canonical"], script[type="application/ld+json"]',
    ).forEach((el) => {
      if (!el.hasAttribute(MANAGED)) el.remove()
    })
  }

  const appendMeta = (attr, key, value, prop = 'name') => {
    const el = document.createElement('meta')
    el.setAttribute(MANAGED, attr)
    el.setAttribute(prop, key)
    el.setAttribute('content', value)
    head.appendChild(el)
  }
  const appendLink = (rel, href, extra = {}) => {
    const el = document.createElement('link')
    el.setAttribute(MANAGED, rel)
    el.rel = rel
    el.href = href
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v))
    head.appendChild(el)
  }

  appendMeta('robots', 'robots', resolved.robots)
  appendMeta('description', 'description', resolved.description)
  appendLink('canonical', resolved.canonical)
  resolvedAlts.forEach((item) => appendLink('alternate', item.href, { hreflang: item.hreflang }))
  appendMeta('og:type', 'og:type', 'website', 'property')
  appendMeta('og:site_name', 'og:site_name', SEO_BRAND.zh.name, 'property')
  appendMeta('og:title', 'og:title', resolved.title, 'property')
  appendMeta('og:description', 'og:description', resolved.description, 'property')
  appendMeta('og:url', 'og:url', resolved.canonical, 'property')
  appendMeta('og:image', 'og:image', DEFAULT_OG_IMAGE, 'property')
  appendMeta('og:locale', 'og:locale', spec.ogLocale, 'property')
  appendMeta('twitter:card', 'twitter:card', 'summary_large_image')
  appendMeta('twitter:title', 'twitter:title', resolved.title)
  appendMeta('twitter:description', 'twitter:description', resolved.description)
  appendMeta('twitter:image', 'twitter:image', DEFAULT_OG_IMAGE)
  appendLink('alternate', `${SITE_ORIGIN}/llms.txt`, { type: 'text/plain', title: 'llms.txt' })

  if (resolvedJson) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(MANAGED, 'ld+json')
    script.textContent = JSON.stringify(resolvedJson)
    head.appendChild(script)
  }
}
