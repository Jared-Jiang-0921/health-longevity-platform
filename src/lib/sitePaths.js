/**
 * 公开页靠预渲染文件提供。这里只列出必须回退到前端壳的动态或登录后路径。
 * 不存在的资讯 id、未知栏目、缺失的脚本和图片不在此列，应返回 404。
 */
import { SEO_PAGES } from '../data/seo.js'
import { articleLanguages, newsArticleIdFromPath } from './newsArticleSeo.js'
import { composeVercelRedirects, newsPublicId } from './newsSlug.js'
import { vercelRedirectRules } from './siteCanonical.js'

const LOCALES = [
  { prefix: '', shell: '/spa-shell.html' },
  { prefix: '/en', shell: '/en/spa-shell.html' },
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
  // 商品详情仍回退到 noindex 壳。已预渲染的成分证据页同时出现在 SEO_PAGES 里，
  // 有文件时静态文件优先；文件不存在时仍回到这层壳，避免变成首页。
  return routerPath.startsWith('/products/') && routerPath.length > '/products/'.length
}

export function isPrerenderedDocumentPath(pathname, cards = []) {
  const { locale, routerPath } = splitSitePath(pathname)
  if (SEO_PAGES.some((page) => page.path === routerPath)) return true
  const id = newsArticleIdFromPath(routerPath)
  if (!id) return false
  const card = (cards || []).find((item) => newsPublicId(item.id) === id)
  if (!card) return false
  const lang = locale === 'en' ? locale : 'zh'
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

export { vercelRedirectRules as apexRedirectRules }

export function vercelPublicRedirectRules() {
  return composeVercelRedirects(vercelRedirectRules())
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
