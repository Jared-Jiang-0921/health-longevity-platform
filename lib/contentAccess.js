/**
 * 内容条目级会员可见（与模块入口 MODULE_ACCESS 分离）
 * - 未标注 / public / free：游客与全体会员可看正文
 * - standard：标准会员、高级会员可看
 * - premium：仅高级会员可看
 */

export const LEVEL_ORDER = ['free', 'standard', 'premium']

export function normalizeLevel(raw) {
  const s = String(raw || '').toLowerCase().trim()
  return LEVEL_ORDER.includes(s) ? s : 'free'
}

/** @returns {null | 'standard' | 'premium'} null 表示公开（含游客） */
export function parseContentRequiredLevel(raw) {
  const s = String(raw ?? '').trim().toLowerCase()
  if (!s || s === 'public' || s === 'open' || s === 'all' || s === 'free' || s === '普通会员' || s === '免费') {
    return null
  }
  if (s === 'standard' || s === '标准会员') return 'standard'
  if (s === 'premium' || s === '高级会员') return 'premium'
  return null
}

/** @param {boolean} [isGuest] 未登录为 true */
export function canViewContent(userLevel, requiredLevel, { isGuest = false } = {}) {
  const required = parseContentRequiredLevel(requiredLevel)
  if (!required) return true
  if (isGuest) return false
  const u = normalizeLevel(userLevel)
  const userOrder = LEVEL_ORDER.indexOf(u)
  const requiredOrder = LEVEL_ORDER.indexOf(required)
  if (requiredOrder < 0) return true
  return userOrder >= requiredOrder
}

export function shouldShowMembershipBadge(requiredLevel) {
  const required = parseContentRequiredLevel(requiredLevel)
  return required === 'standard' || required === 'premium'
}

/** 管理端上传：公开存 public */
export function normalizeContentLevelForStorage(raw) {
  const parsed = parseContentRequiredLevel(raw)
  if (!parsed) return 'public'
  return parsed
}
