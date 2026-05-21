/**
 * 会员等级与模块权限
 * free: 普通会员  standard: 标准会员  premium: 高级会员
 *
 * 模块入口：下列路径对游客开放浏览；具体课程/资料在条目级用 requiredMembership / required_level 控制。
 * 内容未标注等级：游客与全体会员可看正文；标注 standard / premium 的仅对应等级及以上可看正文（标题均可见）。
 */
export const MEMBERSHIP_LEVELS = {
  free: { id: 'free', name: '普通会员', order: 0 },
  standard: { id: 'standard', name: '标准会员', order: 1 },
  premium: { id: 'premium', name: '高级会员', order: 2 },
}

const LEVEL_ORDER = ['free', 'standard', 'premium']

/**
 * 各模块入口最低等级；null 表示不拦模块（游客可进页看标题，正文由条目级控制）
 * 仅保留需登录的模块在页面内自行处理（如收藏夹）
 */
export const MODULE_ACCESS = {
  '/health-skills': null,
  '/solutions': null,
  '/products': null,
  '/longevity-news': null,
  '/tcm-prevention': null,
  '/translation-opportunities': null,
  '/favorites': null,
}

/** @returns {null | 'standard' | 'premium'} 未标注为 null（公开） */
export function parseContentRequiredLevel(raw) {
  const s = String(raw ?? '').trim().toLowerCase()
  if (!s || s === 'public' || s === 'open' || s === 'all' || s === 'free') return null
  if (s === 'standard' || s === '标准会员') return 'standard'
  if (s === 'premium' || s === '高级会员') return 'premium'
  return null
}

/** 是否展示会员角标（仅标准/高级受限内容展示） */
export function shouldShowMembershipBadge(requiredLevel) {
  const required = parseContentRequiredLevel(requiredLevel)
  return required === 'standard' || required === 'premium'
}

export function canAccess(path, level) {
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
  const l = level.toLowerCase().trim()
  return LEVEL_ORDER.includes(l) ? l : 'free'
}

/**
 * 判断能否查看内容正文（标题列表仍全部展示）
 * @param {string | null | undefined} userLevel 未登录传 null/undefined
 * @param {string | null | undefined} requiredLevel 未标注 / public / free 视为公开
 * @param {{ isGuest?: boolean }} [options]
 */
export function hasLevelAccess(userLevel, requiredLevel, options = {}) {
  const required = parseContentRequiredLevel(requiredLevel)
  if (!required) return true
  const isGuest = options.isGuest ?? (userLevel == null || userLevel === '')
  if (isGuest) return false
  const u = normalizeLevel(userLevel)
  const userOrder = LEVEL_ORDER.indexOf(u)
  const requiredOrder = LEVEL_ORDER.indexOf(required)
  if (requiredOrder < 0) return true
  return userOrder >= requiredOrder
}
