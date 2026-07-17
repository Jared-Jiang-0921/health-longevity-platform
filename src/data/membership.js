/**
 * 会员等级与模块权限
 * free: 普通会员  standard: 标准会员  premium: 高级会员
 *
 * 条目级可见性逻辑与 lib/contentAccess.js 共用；本文件保留模块入口 MODULE_ACCESS。
 */
import {
  LEVEL_ORDER,
  canViewContent,
  normalizeLevel as normalizeContentLevel,
  parseContentRequiredLevel,
  shouldShowMembershipBadge,
} from '../../lib/contentAccess.js'

export { LEVEL_ORDER, parseContentRequiredLevel, shouldShowMembershipBadge }

export const MEMBERSHIP_LEVELS = {
  free: { id: 'free', name: '普通会员', order: 0 },
  standard: { id: 'standard', name: '标准会员', order: 1 },
  premium: { id: 'premium', name: '高级会员', order: 2 },
}

/**
 * 各模块入口最低等级；null 表示不拦模块（游客可进页看标题，正文由条目级控制）
 */
export const MODULE_ACCESS = {
  /** 至少普通会员（已注册登录）；游客不可看课程 */
  '/health-skills': 'free',
  '/solutions': null,
  '/products': null,
  '/longevity-news': null,
  '/tcm-prevention': null,
  '/translation-opportunities': null,
  '/favorites': null,
}

/**
 * @param {string} path
 * @param {string | null | undefined} level
 * @param {{ isGuest?: boolean }} [options]
 */
export function canAccess(path, level, options = {}) {
  const normalized = path.replace(/\/$/, '') || '/'
  if (normalized === '/') return true
  let required = null
  for (const [prefix, req] of Object.entries(MODULE_ACCESS)) {
    if (normalized === prefix || normalized.startsWith(prefix + '/')) {
      required = req
      break
    }
  }
  if (!required) return true
  const isGuest = options.isGuest ?? (level == null || level === '')
  // 模块一旦设置最低等级，游客必须先注册/登录（normalizeLevel 会把空值当成 free，不能直接放行）
  if (isGuest) return false
  const u = normalizeLevel(level)
  const userOrder = LEVEL_ORDER.indexOf(u)
  const requiredOrder = LEVEL_ORDER.indexOf(required)
  return userOrder >= requiredOrder
}

export function getRequiredLevel(path) {
  const normalized = path.replace(/\/$/, '') || '/'
  if (normalized === '/') return null
  for (const [prefix, req] of Object.entries(MODULE_ACCESS)) {
    if (normalized === prefix || normalized.startsWith(prefix + '/')) return req
  }
  return null
}

/** 统一为小写，避免接口返回大小写不一致导致权限误判 */
export function normalizeLevel(level) {
  if (!level || typeof level !== 'string') return 'free'
  return normalizeContentLevel(level)
}

/**
 * 判断能否查看内容正文（标题列表仍全部展示）
 * @param {string | null | undefined} userLevel 未登录传 null/undefined
 * @param {{ isGuest?: boolean }} [options] isGuest 未传时按 userLevel 是否为空推断
 */
export function hasLevelAccess(userLevel, requiredLevel, options = {}) {
  const isGuest = options.isGuest ?? (userLevel == null || userLevel === '')
  return canViewContent(userLevel, requiredLevel, { isGuest })
}
