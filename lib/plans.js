/** 会员产品与价格（分/月） */
export const PLANS = {
  standard_monthly: { level: 'standard', months: 1, amount: 999, name: '标准会员 · 月度' },
  standard_yearly: { level: 'standard', months: 12, amount: 9999, name: '标准会员 · 年度' },
  premium_monthly: { level: 'premium', months: 1, amount: 1999, name: '高级会员 · 月度' },
  premium_yearly: { level: 'premium', months: 12, amount: 19999, name: '高级会员 · 年度' },
}

export function getExpiresAt(months) {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}
