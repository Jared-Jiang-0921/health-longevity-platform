/**
 * 会员等级与模块权限
 * free: 免费会员  standard: 标准会员  premium: 高级会员
 */
export const MEMBERSHIP_LEVELS = {
  free: {
    id: 'free',
    name: '免费会员',
    order: 0,
    benefits: ['健康技能课程（部分免费课程）', '前沿长寿医学资讯', '治未病模块', '健康咨询 5 次免费试用'],
  },
  standard: {
    id: 'standard',
    name: '标准会员',
    order: 1,
    benefits: ['全部健康技能课程（含标准会员课程）', '健康长寿方案咨询不限次', '健康产品模块', '前沿资讯、治未病'],
  },
  premium: {
    id: 'premium',
    name: '高级会员',
    order: 2,
    benefits: ['平台全部功能', '高级健康技能课程', '健康长寿方案咨询不限次', '我的收藏', '健康产品、前沿资讯、治未病等'],
  },
}

const LEVEL_ORDER = ['free', 'standard', 'premium']

/** 各模块所需最低会员等级（路径前缀匹配） */
export const MODULE_ACCESS = {
  '/health-skills': 'free',
  '/solutions': 'free', // 免费用户可进入，5 次试用后需升级
  '/products': 'standard',
  '/longevity-news': 'free',
  '/tcm-prevention': 'free',
  '/account': 'free',
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

/** 根据当前等级推荐升级方案 planId */
export function getRecommendedUpgradePlan(currentLevel) {
  if (!currentLevel || currentLevel === 'premium') return null
  if (currentLevel === 'free') return 'member-basic'
  if (currentLevel === 'standard') return 'member-premium'
  return 'member-basic'
}

export function getRequiredLevel(path) {
  const normalized = path.replace(/\/$/, '') || '/'
  if (normalized === '/') return null
  for (const [prefix, req] of Object.entries(MODULE_ACCESS)) {
    if (normalized === prefix || normalized.startsWith(prefix + '/')) return req
  }
  return null
}
