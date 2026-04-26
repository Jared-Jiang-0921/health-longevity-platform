import { normalizeLevel } from '../data/membership'
import { SITE_LEGAL } from '../data/siteLegal'

/** 与会员信息一致：优先昵称，否则用邮箱 @ 前本地部分 */
export function getExternalDisplayName(user) {
  if (!user) return ''
  const n = user.name?.trim()
  if (n) return n
  const em = user.email?.trim()
  if (em?.includes('@')) return em.split('@')[0]
  return ''
}

/**
 * 在外链后附加当前用户与来源参数，供 Manus / 自建落地页识别身份。
 * @param {'content'|'consult'} channel - content：内容资源；consult：咨询（会带 hl_consult_entry）
 */
export function appendExternalEntryParams(url, user, options = {}) {
  if (!url?.trim()) return ''
  const base = url.trim()
  const sep = base.includes('?') ? '&' : '?'
  const params = new URLSearchParams()
  const levelNorm = normalizeLevel(user?.level)
  const levelRank = { free: 0, standard: 1, premium: 2 }
  params.set('source', 'healthlongevityplatform')
  params.set('level', levelNorm)
  params.set('hl_membership_level', levelNorm)
  params.set('hl_level', String(levelRank[levelNorm] ?? 0))

  if (options.consultEntry) {
    params.set('hl_channel', 'consult')
    params.set('hl_consult_entry', options.consultEntry)
  } else if (options.channel === 'content') {
    params.set('hl_channel', 'content')
  } else if (options.channel === 'consult') {
    params.set('hl_channel', 'consult')
  }
  const query = String(options.query || '').trim()
  if (query) {
    // 兼容不同咨询端实现：常见读取 q，也保留平台前缀参数
    params.set('q', query)
    params.set('hl_query', query)
  }

  if (user?.email) params.set('email', user.email)
  if (user?.id) params.set('user_id', String(user.id))
  const display = getExternalDisplayName(user)
  if (display) {
    params.set('name', display)
    params.set('display_name', display)
    params.set('nickname', display)
    params.set('hl_display', display)
  }
  params.set('hl_brand', SITE_LEGAL.brandName)
  if (typeof window !== 'undefined' && window.location?.hostname) {
    params.set('hl_origin', window.location.hostname)
  }
  params.set('hl_ts', String(Date.now()))
  return `${base}${sep}${params.toString()}`
}
