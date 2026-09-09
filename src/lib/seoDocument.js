import {
  DEFAULT_OG_IMAGE,
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
  const robots = indexable ? 'index,follow' : 'noindex,nofollow'
  return { page, title, description, canonical, robots, indexable }
}

export function buildJsonLd({ lang, pathname, title, description, canonical }) {
  const spec = langSpec(lang)
  const brand = SEO_BRAND[lang] || SEO_BRAND.zh
  const page = findSeoPage(pathname)
  const inLanguage = spec.htmlLang
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: brand.name,
    inLanguage,
    publisher: { '@id': `${SITE_ORIGIN}/#org` },
  }
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#org`,
    name: brand.name,
    url: `${SITE_ORIGIN}/`,
    logo: DEFAULT_OG_IMAGE,
  }
  const webPage = {
    '@type': page?.type === 'module' ? 'MedicalWebPage' : 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    about: {
      '@type': 'Thing',
      name: lang === 'zh' ? '健康长寿与预防保健' : 'Health, longevity and prevention',
    },
  }
  if (page?.type === 'module' || page?.type === 'home') {
    webPage.disclaimer = lang === 'zh'
      ? '仅供健康教育与生活方式参考，不替代专业诊疗。'
      : 'For education and lifestyle reference only—not medical care.'
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [org, website, webPage],
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

export function renderHeadSnippet({ lang, pathname }) {
  const { spec, seo, jsonLd, alternates } = buildHeadTags({ lang, pathname })
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
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
  return lines.join('\n    ')
}

const MANAGED = 'data-seo-managed'

export function applySeoToDocument({ lang, pathname }) {
  if (typeof document === 'undefined') return
  const { spec, seo, jsonLd, alternates } = buildHeadTags({ lang, pathname })
  document.documentElement.lang = spec.htmlLang
  document.documentElement.dir = spec.dir
  document.title = seo.title

  const head = document.head
  head.querySelectorAll(`[${MANAGED}]`).forEach((el) => el.remove())

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

  appendMeta('robots', 'robots', seo.robots)
  appendMeta('description', 'description', seo.description)
  appendLink('canonical', seo.canonical)
  alternates.forEach((item) => appendLink('alternate', item.href, { hreflang: item.hreflang }))
  appendMeta('og:type', 'og:type', 'website', 'property')
  appendMeta('og:site_name', 'og:site_name', SEO_BRAND.zh.name, 'property')
  appendMeta('og:title', 'og:title', seo.title, 'property')
  appendMeta('og:description', 'og:description', seo.description, 'property')
  appendMeta('og:url', 'og:url', seo.canonical, 'property')
  appendMeta('og:image', 'og:image', DEFAULT_OG_IMAGE, 'property')
  appendMeta('og:locale', 'og:locale', spec.ogLocale, 'property')
  appendMeta('twitter:card', 'twitter:card', 'summary_large_image')
  appendMeta('twitter:title', 'twitter:title', seo.title)
  appendMeta('twitter:description', 'twitter:description', seo.description)

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute(MANAGED, 'ld+json')
  script.textContent = JSON.stringify(jsonLd)
  head.appendChild(script)
}
