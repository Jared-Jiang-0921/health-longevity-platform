/**
 * 会员等级与模块权限
 * free: 普通会员  standard: 标准会员  premium: 高级会员
 *
 * 普通会员：长寿知识技能部分免费、循证健康产品大部分、前沿长寿医学资讯大部分、
 *           转化应用机遇部分免费
 * 标准会员：普通会员 + 长寿知识技能大部分、转化应用机遇全部、治未病全部、综合长寿方案
 * 高级会员：所有模块与内容
 */
export const MEMBERSHIP_LEVELS = {
  free: { id: 'free', name: '普通会员', order: 0 },
  standard: { id: 'standard', name: '标准会员', order: 1 },
  premium: { id: 'premium', name: '高级会员', order: 2 },
}

const LEVEL_ORDER = ['free', 'standard', 'premium']

/** 各模块所需最低会员等级（路径前缀匹配） */
export const MODULE_ACCESS = {
  '/health-skills': 'free',
  '/solutions': 'standard',
  '/products': 'free',
  '/longevity-news': 'free',
  '/tcm-prevention': 'standard',
  '/translation-opportunities': 'free',
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
