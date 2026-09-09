/** 语言前缀：中文为默认路径，英文 /en，阿拉伯语 /ar（便于爬虫分语言收录） */

export const LOCALE_PREFIX = {
  zh: '',
  en: '/en',
  ar: '/ar',
}

export function detectLangFromPathname(pathname) {
  const p = String(pathname || '')
  if (p === '/en' || p.startsWith('/en/')) return 'en'
  if (p === '/ar' || p.startsWith('/ar/')) return 'ar'
  return 'zh'
}

export function getRouterBasename() {
  if (typeof window === 'undefined') return ''
  return LOCALE_PREFIX[detectLangFromPathname(window.location.pathname)] || ''
}

export function pathWithLocale(lang, routerPath, search = '', hash = '') {
  const prefix = LOCALE_PREFIX[lang] || ''
  const raw = routerPath && routerPath !== '/' ? routerPath : '/'
  const path = raw === '/' ? prefix || '/' : `${prefix}${raw}`
  return `${path}${search || ''}${hash || ''}`
}
