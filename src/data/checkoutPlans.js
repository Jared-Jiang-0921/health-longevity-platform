/**
 * 与后端 lib/plans.js 的 plan id、金额（基准币种最小单位）保持一致
 */
export const CHECKOUT_PLANS = [
  { id: 'standard_monthly', tier: 'standard', name: '标准会员 · 月度', amount: 999, desc: '1 个月' },
  { id: 'standard_yearly', tier: 'standard', name: '标准会员 · 年度', amount: 9999, desc: '12 个月，省约 17%' },
  { id: 'premium_monthly', tier: 'premium', name: '高级会员 · 月度', amount: 1999, desc: '1 个月' },
  { id: 'premium_yearly', tier: 'premium', name: '高级会员 · 年度', amount: 19999, desc: '12 个月，省约 17%' },
]

/** 注册时「免费」选项，无 plan id */
export const REGISTER_FREE_ID = 'free'
