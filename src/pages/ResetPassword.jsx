import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMessages } from '../i18n/messages'
import './Auth.css'

const I18N = {
  zh: { title: '设置新密码', pwd: '新密码', confirm: '确认新密码', save: '保存新密码', saving: '保存中…', back: '返回登录', okTitle: '密码已更新', okNote: '即将跳转到登录页…', loginNow: '立即登录', errLink: '链接无效，请从邮件中重新打开', errLen: '密码至少 6 位', errMatch: '两次密码不一致', errFail: '重置失败', invalid: '链接无效或已过期，请重新申请忘记密码。' },
  en: { title: 'Set New Password', pwd: 'New password', confirm: 'Confirm new password', save: 'Save Password', saving: 'Saving…', back: 'Back to login', okTitle: 'Password updated', okNote: 'Redirecting to login…', loginNow: 'Login now', errLink: 'Invalid link, please reopen from email', errLen: 'Password must be at least 6 characters', errMatch: 'Passwords do not match', errFail: 'Reset failed', invalid: 'This link is invalid or expired. Please request a new reset link.' },
  ar: { title: 'تعيين كلمة مرور جديدة', pwd: 'كلمة المرور الجديدة', confirm: 'تأكيد كلمة المرور', save: 'حفظ كلمة المرور', saving: 'جار الحفظ…', back: 'العودة لتسجيل الدخول', okTitle: 'تم تحديث كلمة المرور', okNote: 'سيتم التحويل إلى صفحة الدخول…', loginNow: 'تسجيل الدخول الآن', errLink: 'الرابط غير صالح، افتحه من البريد مجددًا', errLen: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', errMatch: 'كلمتا المرور غير متطابقتين', errFail: 'فشلت إعادة التعيين', invalid: 'الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.' },
}

export default function ResetPassword() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const msg = getMessages(lang)
  const t = I18N[lang] || I18N.zh
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!token) {
      setError(t.errLink)
      return
    }
    if (!password || password.length < 6) {
      setError(t.errLen)
      return
    }
    if (password !== confirm) {
      setError(t.errMatch)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || msg.requestFail)
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
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
            <Link to="/login">{t.loginNow}</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t.title}</h1>
        {!token ? (
          <p className="auth-error">{t.invalid}</p>
        ) : null}
        <form onSubmit={handleSubmit} noValidate>
          <label>
            <span>{t.pwd}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label>
            <span>{t.confirm}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting || !token}>{submitting ? ui.saving : t.save}</button>
        </form>
        <p className="auth-switch">
          <Link to="/login">{ui.login}</Link>
        </p>
      </div>
    </div>
  )
}
