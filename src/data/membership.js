/**
 * 会员等级与模块权限
 * free: 免费会员  standard: 标准会员  premium: 高级会员
 */
export const MEMBERSHIP_LEVELS = {
  free: { id: 'free', name: '免费会员', order: 0 },
  standard: { id: 'standard', name: '标准会员', order: 1 },
  premium: { id: 'premium', name: '高级会员', order: 2 },
}

const LEVEL_ORDER = ['free', 'standard', 'premium']

/** 各模块所需最低会员等级（路径前缀匹配） */
export const MODULE_ACCESS = {
  '/health-skills': 'free',
  '/solutions': 'standard',
  '/products': 'standard',
  '/longevity-news': 'free',
  '/tcm-prevention': 'free',
  '/favorites': 'premium',
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
  const userOrder = level ? LEVEL_ORDER.indexOf(level) : -1
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
