/**
 * AI 长寿师咨询：仅这些账号上传图片和 PDF 时，不按张数、不按单文件大小拒绝。
 * 不授予整站管理员权限。Word / TXT 的份数和 5MB 上限对所有人不变。
 *
 * 核对（仓库内，无生产用户表）：
 * - `fsjy_2001@163.cm` 与 `fsjy_2001@163.com` 都没有出现在用户种子、
 *   SITE_ADMIN_EMAILS、PAYMENT_LOGS_ADMIN_EMAILS、登录标识或其它配置里。
 * - 站长原文是 fsjy_2001@163.cm。163.cm 不是网易邮箱域名，按笔误处理。
 * - 两边都查不到，因此白名单同时包含核对后的 fsjy_2001@163.com，
 *   以及站长原文 fsjy_2001@163.cm（避免账号若按原文注册就匹配不到）。
 * 比较时忽略大小写和首尾空白。
 */
export const CONSULT_UNLIMITED_UPLOAD_EMAILS = Object.freeze([
  'fsjy_2001@163.com',
  'fsjy_2001@163.cm',
])

export function normalizeConsultEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function isConsultUnlimitedUploadEmail(email) {
  const normalized = normalizeConsultEmail(email)
  if (!normalized) return false
  return CONSULT_UNLIMITED_UPLOAD_EMAILS.includes(normalized)
}

/**
 * 咨询附件策略。整站管理员只放开图片/PDF 张数；白名单账号同时放开张数和单文件大小。
 */
export function consultAttachmentPolicy({ email, siteAdmin = false } = {}) {
  const exempt = isConsultUnlimitedUploadEmail(email)
  const admin = Boolean(siteAdmin)
  return {
    exempt,
    unlimitedImages: admin || exempt,
    unlimitedPdfs: admin || exempt,
    unlimitedImageBytes: exempt,
    unlimitedPdfBytes: exempt,
  }
}
