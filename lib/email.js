import nodemailer from 'nodemailer'

function getTransport() {
  const host = String(process.env.SMTP_HOST || '').trim()
  const user = String(process.env.SMTP_USER || '').trim()
  const pass = String(process.env.SMTP_PASS || '').trim()
  if (!host || !user || !pass) return null
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

/**
 * 发送密码重置邮件。未配置 SMTP 时返回 { ok: false, reason: 'not_configured' }，由调用方记录日志。
 */
export async function sendPasswordResetEmail({ to, resetUrl, brandName = 'Account' }) {
  const from = String(process.env.EMAIL_FROM || process.env.SMTP_USER || '').trim()
  const transport = getTransport()
  if (!transport || !from) {
    return { ok: false, reason: 'not_configured' }
  }
  const subject = `${brandName} — Password reset`
  const text = `Reset your password by opening this link (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`
  const html = `<p>Reset your password by clicking the link below (valid for 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, ignore this email.</p>`
  await transport.sendMail({ from, to, subject, text, html })
  return { ok: true }
}
