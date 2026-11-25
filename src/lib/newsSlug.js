/** 上传资讯的公开路径。静态稿 id 不变；已建表的 upload- id 用可读 slug。 */
import { NEWS_LEGACY_SLUGS } from '../data/newsLegacySlugs.js'
import { CANONICAL_ORIGIN } from './siteCanonical.js'

export function newsPublicId(id) {
  const value = String(id || '')
  return NEWS_LEGACY_SLUGS[value] || value
}

/** 旧 upload 地址回到中文规范 slug。/en/ 与 /ar/ 前缀都算，没有对照表时不跳。 */
export function newsLegacyLocation(pathname) {
  const path = String(pathname || '').split('?')[0].split('#')[0]
  const match = path.match(/^\/(?:ar\/)?(?:en\/)?longevity-news\/(upload-[A-Za-z0-9-]+)\/?$/)
  if (!match) return ''
  const slug = NEWS_LEGACY_SLUGS[match[1]]
  if (!slug) return ''
  return `/longevity-news/${slug}`
}

const NGINX_UPLOAD_PREFIXES = [
  '/longevity-news/',
  '/en/longevity-news/',
  '/ar/longevity-news/',
  '/ar/en/longevity-news/',
]

/** Nginx 精确匹配。/ar/ 前缀必须单独列出，否则会先被通用 /ar/ 正则剥掉，再跳一次。 */
export function nginxNewsRedirectConf(map = NEWS_LEGACY_SLUGS) {
  const lines = [
    '# 由 scripts/seo/build-news-slugs.mjs 生成。',
    '# 这是仓库里的跳转片段，不会自动写进正在监听的 Nginx。',
    '# 把本文件放到示例配置 include 的路径后，再 nginx -t 并重载。',
    '# /ar/longevity-news/upload-… 用精确匹配，一跳到中文 slug，避免先落到无 /ar 的旧地址。',
  ]
  for (const id of Object.keys(map).sort()) {
    const dest = `${CANONICAL_ORIGIN}/longevity-news/${map[id]}`
    for (const prefix of NGINX_UPLOAD_PREFIXES) {
      lines.push(`location = ${prefix}${id} { return 301 ${dest}; }`)
      if (prefix.startsWith('/ar/')) {
        lines.push(`location = ${prefix}${id}/ { return 301 ${dest}; }`)
      }
    }
  }
  return `${lines.join('\n')}\n`
}

export function newsLegacyRedirectRules() {
  const rules = []
  for (const id of Object.keys(NEWS_LEGACY_SLUGS).sort()) {
    const destination = `${CANONICAL_ORIGIN}/longevity-news/${NEWS_LEGACY_SLUGS[id]}`
    rules.push({ source: `/longevity-news/${id}`, destination, statusCode: 301 })
    rules.push({ source: `/en/longevity-news/${id}`, destination, statusCode: 301 })
  }
  return rules
}

/** 资讯旧地址插在主机通配之前，让预览域名一跳到最终中文 slug。 */
export function composeVercelRedirects(canonicalRules) {
  const news = newsLegacyRedirectRules()
  const hostAt = canonicalRules.findIndex((rule) => (rule.has || []).some((item) => item.type === 'host'))
  if (hostAt < 0) return [...canonicalRules, ...news]
  return [...canonicalRules.slice(0, hostAt), ...news, ...canonicalRules.slice(hostAt)]
}
