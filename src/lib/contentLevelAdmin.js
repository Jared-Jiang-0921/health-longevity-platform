/** 管理端表单：会员等级下拉取值 */
export function adminLevelValue(raw) {
  const s = String(raw || '').trim().toLowerCase()
  if (s === 'standard' || s === 'premium') return s
  return 'public'
}
