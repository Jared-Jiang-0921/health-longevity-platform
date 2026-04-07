/** 解析 SITE_ADMIN_EMAILS（与 siteAdminAuth 共用，避免与 auth 循环依赖） */
export function parseSiteAdminEmails() {
  return String(process.env.SITE_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isSiteAdminEmail(email) {
  if (!email) return false
  const e = String(email).toLowerCase().trim()
  return parseSiteAdminEmails().includes(e)
}
