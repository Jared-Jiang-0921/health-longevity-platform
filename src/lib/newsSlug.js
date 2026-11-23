/** 上传资讯的公开路径。静态稿 id 不变；已建表的 upload- id 用可读 slug。 */
import { NEWS_LEGACY_SLUGS } from '../data/newsLegacySlugs.js'
import { CANONICAL_ORIGIN } from './siteCanonical.js'

export function newsPublicId(id) {
  const value = String(id || '')
  return NEWS_LEGACY_SLUGS[value] || value
}

/** 旧 upload 地址（含 /en/ 前缀）回到中文规范 slug。没有对照表时不跳。 */
export function newsLegacyLocation(pathname) {
  const path = String(pathname || '').split('?')[0].split('#')[0]
  const match = path.match(/^\/(?:en\/)?longevity-news\/(upload-[A-Za-z0-9-]+)\/?$/)
  if (!match) return ''
  const slug = NEWS_LEGACY_SLUGS[match[1]]
  if (!slug) return ''
  return `/longevity-news/${slug}`
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
