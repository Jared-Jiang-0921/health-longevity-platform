/** 公开网址的规范形式：https://www.healthlongevity.cn ，除首页和 /en/ 外不带尾部斜杠。 */

export const CANONICAL_HOST = 'www.healthlongevity.cn'
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`
export const VERCEL_PUBLIC_HOST = 'healthlongevityplatform.vercel.app'

const ALIAS_HOSTS = new Set([
  'healthlongevity.cn',
  VERCEL_PUBLIC_HOST,
  `www.${VERCEL_PUBLIC_HOST}`,
])

function stripSlash(path) {
  if (!path || path === '/') return '/'
  if (path === '/en' || path === '/en/') return '/en/'
  return path.replace(/\/+$/, '') || '/'
}

function stripArabic(path) {
  if (path === '/ar' || path === '/ar/') return '/'
  if (path.startsWith('/ar/')) return path.slice(3) || '/'
  return path
}

function applyLang(path, lang) {
  const value = String(lang || '').trim().toLowerCase().replace(/_/g, '-')
  if (!value) return path
  const wantsEn = value === 'en' || value.startsWith('en-')
  const wantsZh = value === 'zh' || value.startsWith('zh-') || value === 'ar' || value.startsWith('ar-')
  if (wantsEn) {
    if (path === '/' || path === '/en' || path === '/en/') return '/en/'
    if (path.startsWith('/en/')) return path
    return `/en${path.startsWith('/') ? path : `/${path}`}`
  }
  if (wantsZh) {
    if (path === '/en' || path === '/en/') return '/'
    if (path.startsWith('/en/')) return path.slice(3) || '/'
  }
  return path
}

/**
 * 已经是规范地址时返回 null。否则返回应 301 到的地址。
 * 本地开发主机只改路径，不把浏览器送去正式站。
 */
export function canonicalRedirectTarget({ host = '', pathname = '/', search = '' } = {}) {
  const rawPath = String(pathname || '/').split('?')[0] || '/'
  if (
    rawPath.startsWith('/api/')
    || rawPath === '/api'
    || rawPath.startsWith('/assets/')
    || rawPath.startsWith('/images/')
    || rawPath.startsWith('/mcp')
    || rawPath.startsWith('/.well-known/')
  ) {
    return null
  }
  let path = stripArabic(rawPath.startsWith('/') ? rawPath : `/${rawPath}`)
  const params = new URLSearchParams(String(search || '').replace(/^\?/, ''))
  const lang = params.get('lang')
  if (lang != null) params.delete('lang')
  path = applyLang(path, lang)
  path = stripSlash(path)
  const query = params.toString()
  const destPath = `${path}${query ? `?${query}` : ''}`
  const bareHost = String(host || '').split(':')[0].toLowerCase()
  const alias = ALIAS_HOSTS.has(bareHost)
  const onCanonical = bareHost === CANONICAL_HOST
  const samePath = rawPath === path && String(search || '') === (query ? `?${query}` : '') && !String(search || '').includes('lang=')
  if ((onCanonical || !bareHost) && rawPath === path && (String(search || '') === (query ? `?${query}` : ''))) {
    return null
  }
  if (!alias && !onCanonical && !bareHost) return null
  if (!alias && !onCanonical) {
    if (rawPath === path && String(search || '') === (query ? `?${query}` : '')) return null
    return destPath
  }
  if (onCanonical && samePath) return null
  return `${CANONICAL_ORIGIN}${destPath}`
}

export function vercelRedirectRules() {
  const www = CANONICAL_ORIGIN
  const host = (value) => [{ type: 'host', value }]
  const lang = (value) => [{ type: 'query', key: 'lang', value }]
  return [
    { source: '/ar', destination: `${www}/`, statusCode: 301 },
    { source: '/ar/', destination: `${www}/`, statusCode: 301 },
    { source: '/ar/:path*/', destination: `${www}/:path*`, statusCode: 301 },
    { source: '/ar/:path*', destination: `${www}/:path*`, statusCode: 301 },
    { source: '/', has: lang('en'), destination: `${www}/en/`, statusCode: 301 },
    { source: '/:path*', has: lang('en'), destination: `${www}/en/:path*`, statusCode: 301 },
    { source: '/', has: lang('zh'), destination: `${www}/`, statusCode: 301 },
    { source: '/en', has: lang('zh'), destination: `${www}/`, statusCode: 301 },
    { source: '/en/', has: lang('zh'), destination: `${www}/`, statusCode: 301 },
    { source: '/en/:path*', has: lang('zh'), destination: `${www}/:path*`, statusCode: 301 },
    { source: '/:path*', has: lang('zh'), destination: `${www}/:path*`, statusCode: 301 },
    { source: '/', has: lang('ar'), destination: `${www}/`, statusCode: 301 },
    { source: '/:path*', has: lang('ar'), destination: `${www}/:path*`, statusCode: 301 },
    { source: '/en', destination: `${www}/en/`, statusCode: 301 },
    { source: '/en/:path+/', destination: `${www}/en/:path+`, statusCode: 301 },
    { source: '/', has: host(VERCEL_PUBLIC_HOST), destination: `${www}/`, statusCode: 301 },
    { source: '/:path*', has: host(VERCEL_PUBLIC_HOST), destination: `${www}/:path*`, statusCode: 301 },
    { source: '/', has: host('healthlongevity.cn'), destination: `${www}/`, statusCode: 301 },
    { source: '/:path*', has: host('healthlongevity.cn'), destination: `${www}/:path*`, statusCode: 301 },
  ]
}
