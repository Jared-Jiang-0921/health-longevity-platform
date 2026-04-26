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
  const isAbsolute = /^https?:\/\//i.test(base)
  const fallbackOrigin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost'
  let u
  try {
    u = new URL(base, fallbackOrigin)
  } catch {
    return base
  }
  const params = u.searchParams
  const levelNorm = normalizeLevel(user?.level)
  const levelRank = { free: 0, standard: 1, premium: 2 }
  params.set('source', 'healthlongevityplatform')
  params.set('level', levelNorm)
  params.set('hl_membership_level', levelNorm)
  params.set('hl_level', String(levelRank[levelNorm] ?? 0))

  if (options.consultEntry) {
    const entryRaw = String(options.consultEntry || '').trim().toLowerCase()
    const entry = entryRaw === 'professional' ? 'professional' : 'general'
    params.set('hl_channel', 'consult')
    params.set('hl_consult_entry', entry)
    // 兼容咨询端常见路由参数
    params.set('mode', entry)
    params.set('consult_mode', entry)
    params.set('entry', entry)
    params.set('consultation_mode', entry)
    params.set('role', entry)
    params.set('hl_mode', entry)
    if (entry === 'professional') {
      params.set('persona', 'professional_advisor')
      params.set('advisor_mode', '1')
      params.set('expert', '1')
    } else {
      params.set('persona', 'general_wellness')
      params.set('advisor_mode', '0')
      params.set('expert', '0')
    }
    // 部分咨询站对 /consult/general|professional 返回 404，统一收敛到 /consult 再靠 mode 分流
    const path = (u.pathname || '').replace(/\/+$/, '')
    if (path === '/consult/general' || path === '/consult/professional') {
      u.pathname = '/consult'
    }
  } else if (options.channel === 'content') {
    params.set('hl_channel', 'content')
  } else if (options.channel === 'consult') {
    params.set('hl_channel', 'consult')
  }
  const langRaw = String(options.lang || '').trim().toLowerCase()
  if (langRaw) {
    const langMap = {
      zh: { short: 'zh', locale: 'zh-CN' },
      en: { short: 'en', locale: 'en-US' },
      ar: { short: 'ar', locale: 'ar' },
    }
    const mapped = langMap[langRaw] || { short: langRaw, locale: langRaw }
    params.set('lang', mapped.short)
    params.set('hl_lang', mapped.short)
    params.set('language', mapped.short)
    params.set('locale', mapped.locale)
    params.set('ui_locale', mapped.locale)
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
  if (isAbsolute) return u.toString()
  return `${u.pathname}${u.search}${u.hash}`
}
