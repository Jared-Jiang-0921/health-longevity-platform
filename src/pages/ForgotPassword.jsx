import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMessages } from '../i18n/messages'
import './Auth.css'

const I18N = {
  zh: { title: '忘记密码', note: '输入注册邮箱，我们将发送重置链接（有效期约 1 小时）。', email: '邮箱', send: '发送重置邮件', sending: '发送中…', back: '返回登录', okTitle: '检查您的邮箱', okNote: '若该邮箱已注册且服务器已配置发信（SMTP），您将收到重置链接。未收到时请检查垃圾箱，或确认管理员已配置 SMTP。', errEmail: '请输入有效邮箱', errReq: '请求失败' },
  en: { title: 'Forgot Password', note: 'Enter your registered email and we will send a reset link (about 1 hour validity).', email: 'Email', send: 'Send Reset Email', sending: 'Sending…', back: 'Back to login', okTitle: 'Check your inbox', okNote: 'If the email exists and SMTP is configured, you will receive a reset link soon.', errEmail: 'Please enter a valid email', errReq: 'Request failed' },
  ar: { title: 'نسيت كلمة المرور', note: 'أدخل بريدك المسجل وسنرسل رابط إعادة تعيين (صالح تقريبًا لمدة ساعة).', email: 'البريد الإلكتروني', send: 'إرسال رابط التعيين', sending: 'جار الإرسال…', back: 'العودة لتسجيل الدخول', okTitle: 'تحقق من بريدك', okNote: 'إذا كان البريد مسجلاً وتم إعداد SMTP فستصلك رسالة إعادة التعيين قريبًا.', errEmail: 'يرجى إدخال بريد إلكتروني صحيح', errReq: 'فشل الطلب' },
}

export default function ForgotPassword() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const msg = getMessages(lang)
  const t = I18N[lang] || I18N.zh
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!emailOk(email)) {
      setError(t.errEmail)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || msg.requestFail)
      setDone(true)
    } catch (err) {
      setError(err.message || msg.requestFail)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>{t.okTitle}</h1>
          <p className="auth-note">{t.okNote}</p>
          <p className="auth-switch">
            <Link to="/login">{t.back}</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t.title}</h1>
        <p className="auth-note">{t.note}</p>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            <span>{t.email}</span>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? t.sending : t.send}</button>
        </form>
        <p className="auth-switch">
          <Link to="/login">{ui.login}</Link>
        </p>
      </div>
    </div>
  )
}
