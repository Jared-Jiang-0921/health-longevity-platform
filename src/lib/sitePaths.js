/**
 * 公开页靠预渲染文件提供。这里只列出必须回退到前端壳的动态或登录后路径。
 * 不存在的资讯 id、未知栏目、缺失的脚本和图片不在此列，应返回 404。
 */
import { SEO_PAGES } from '../data/seo.js'
import { articleLanguages, newsArticleIdFromPath } from './newsArticleSeo.js'

const LOCALES = [
  { prefix: '', shell: '/index.html' },
  { prefix: '/en', shell: '/en/index.html' },
  { prefix: '/ar', shell: '/ar/index.html' },
]

/** 这些前缀本身或其子路径没有一份静态文件能覆盖全部地址。 */
const SPA_EXACT = [
  'account',
  'payment',
  'favorites',
  'health-skills',
  'health-questionnaire',
  'forgot-password',
  'reset-password',
  'ops',
  'org',
  'tax',
  'solutions/risk',
  'solutions/aging',
  'tcm-prevention/constitution',
]

export function normalizeSitePath(pathname) {
  const raw = String(pathname || '/').split('?')[0].split('#')[0]
  if (!raw || raw === '/') return '/'
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash
}

export function splitSitePath(pathname) {
  const p = normalizeSitePath(pathname)
  if (p === '/en' || p.startsWith('/en/')) {
    const rest = p.slice(3) || '/'
    return { locale: 'en', routerPath: rest.startsWith('/') ? rest : `/${rest}` }
  }
  if (p === '/ar' || p.startsWith('/ar/')) {
    const rest = p.slice(3) || '/'
    return { locale: 'ar', routerPath: rest.startsWith('/') ? rest : `/${rest}` }
  }
  return { locale: 'zh', routerPath: p }
}

function matchesPrefix(routerPath, prefix) {
  return routerPath === prefix || routerPath.startsWith(`${prefix}/`)
}

export function isPassthroughPath(pathname) {
  const p = normalizeSitePath(pathname)
  return p === '/api' || p.startsWith('/api/')
    || p === '/mcp' || p.startsWith('/mcp/')
    || p.startsWith('/.well-known/')
}

export function isSpaDocumentPath(pathname) {
  const { routerPath } = splitSitePath(pathname)
  if (SPA_EXACT.some((rel) => matchesPrefix(routerPath, `/${rel}`))) return true
  return routerPath.startsWith('/products/') && routerPath.length > '/products/'.length
}

export function isPrerenderedDocumentPath(pathname, cards = []) {
  const { locale, routerPath } = splitSitePath(pathname)
  if (SEO_PAGES.some((page) => page.path === routerPath)) return true
  const id = newsArticleIdFromPath(routerPath)
  if (!id) return false
  const card = (cards || []).find((item) => item.id === id)
  if (!card) return false
  const lang = locale === 'en' || locale === 'ar' ? locale : 'zh'
  return articleLanguages(card).includes(lang)
}

export function isDevPreviewPath(pathname) {
  return splitSitePath(pathname).routerPath === '/dev/consult-composer'
}

/** ok：预渲染文件或前端壳。missing：应返回 404。passthrough：交给接口代理。 */
export function documentStatus(pathname, { cards = [], allowDevPreview = false } = {}) {
  if (isPassthroughPath(pathname)) return 'passthrough'
  if (isPrerenderedDocumentPath(pathname, cards) || isSpaDocumentPath(pathname)) return 'ok'
  if (allowDevPreview && isDevPreviewPath(pathname)) return 'ok'
  return 'missing'
}

/** Vercel path-to-regexp 6.1 可编译的回退。静态文件优先，所以已预渲染的栏目不会被这些规则改写。 */
export function spaRewriteRules() {
  const rules = []
  for (const { prefix, shell } of LOCALES) {
    for (const rel of SPA_EXACT) {
      rules.push({ source: `${prefix}/${rel}`, destination: shell })
      rules.push({ source: `${prefix}/${rel}/(.*)`, destination: shell })
    }
    rules.push({ source: `${prefix}/products/(.*)`, destination: shell })
  }
  return rules
}

export function apexRedirectRules() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'healthlongevity.cn' }],
      destination: 'https://www.healthlongevity.cn/:path*',
      statusCode: 301,
    },
  ]
}

export function netlifySpaRedirects() {
  const rules = []
  for (const { prefix, shell } of LOCALES) {
    for (const rel of SPA_EXACT) {
      rules.push({ from: `${prefix}/${rel}`, to: shell, status: 200 })
      rules.push({ from: `${prefix}/${rel}/*`, to: shell, status: 200 })
    }
    rules.push({ from: `${prefix}/products/*`, to: shell, status: 200 })
  }
  return rules
}
