import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import './Auth.css'

const I18N = {
  zh: { title: '会员登录', email: '邮箱', password: '密码', login: '登录', logging: '登录中…', forgot: '忘记密码？', noAcc: '还没有账号？', register: '注册', twofa: '双重验证', code: '验证码', verify: '确认登录', verifying: '验证中…', back: '返回重新输入密码', phPwd: '请输入密码', phCode: '000000', note2fa: '请输入身份验证器 App（如 Google Authenticator）中显示的 6 位代码。', errEmail: '请输入有效邮箱，例如：name@example.com', errPwd: '请输入密码', errCode: '请输入验证器中的 6 位数字', errLogin: '登录失败', errVerify: '验证失败' },
  en: { title: 'Login', email: 'Email', password: 'Password', login: 'Login', logging: 'Signing in…', forgot: 'Forgot password?', noAcc: "Don't have an account?", register: 'Sign up', twofa: 'Two-Factor Verification', code: 'Code', verify: 'Verify & Login', verifying: 'Verifying…', back: 'Back to password login', phPwd: 'Enter password', phCode: '000000', note2fa: 'Enter the 6-digit code from your authenticator app.', errEmail: 'Please enter a valid email, e.g. name@example.com', errPwd: 'Please enter your password', errCode: 'Please enter a valid 6-digit code', errLogin: 'Login failed', errVerify: 'Verification failed' },
  ar: { title: 'تسجيل الدخول', email: 'البريد الإلكتروني', password: 'كلمة المرور', login: 'دخول', logging: 'جار تسجيل الدخول…', forgot: 'هل نسيت كلمة المرور؟', noAcc: 'ليس لديك حساب؟', register: 'إنشاء حساب', twofa: 'التحقق بخطوتين', code: 'الرمز', verify: 'تأكيد الدخول', verifying: 'جار التحقق…', back: 'العودة لإدخال كلمة المرور', phPwd: 'أدخل كلمة المرور', phCode: '000000', note2fa: 'أدخل رمز التحقق المكون من 6 أرقام من تطبيق المصادقة.', errEmail: 'يرجى إدخال بريد إلكتروني صحيح', errPwd: 'يرجى إدخال كلمة المرور', errCode: 'يرجى إدخال رمز صحيح من 6 أرقام', errLogin: 'فشل تسجيل الدخول', errVerify: 'فشل التحقق' },
}

export default function Login() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = I18N[lang] || I18N.zh
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [step, setStep] = useState('password')
  const [preAuthToken, setPreAuthToken] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, login2fa } = useAuth()
  const navigate = useNavigate()

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!emailOk(email)) {
      setError(t.errEmail)
      return
    }
    if (!password) {
      setError(t.errPwd)
      return
    }
    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)
    if (result.ok && result.requires2fa && result.preAuthToken) {
      setPreAuthToken(result.preAuthToken)
      setStep('2fa')
      return
    }
    if (result.ok) {
      navigate('/')
      return
    }
    setError(result.error || t.errLogin)
  }

  const handle2faSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const code = totpCode.replace(/\s/g, '')
    if (!/^\d{6}$/.test(code)) {
      setError(t.errCode)
      return
    }
    setSubmitting(true)
    const result = await login2fa(preAuthToken, code)
    setSubmitting(false)
    if (result.ok) {
      navigate('/')
      return
    }
    setError(result.error || t.errVerify)
  }

  if (step === '2fa') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>{t.twofa}</h1>
          <p className="auth-note">{t.note2fa}</p>
          <form onSubmit={handle2faSubmit} noValidate>
            <label>
              <span>{t.code}</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="000000"
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? t.verifying : t.verify}</button>
          </form>
          <p className="auth-switch">
            <button
              type="button"
              className="btn-linkish"
              onClick={() => {
                setStep('password')
                setTotpCode('')
                setPreAuthToken('')
                setError('')
              }}
            >
              {t.back}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t.title}</h1>
        <form onSubmit={handlePasswordSubmit} noValidate>
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
          <label>
            <span>{t.password}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.phPwd}
            />
          </label>
          <p className="auth-forgot-wrap">
            <Link to="/forgot-password">{t.forgot}</Link>
          </p>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? t.logging : ui.login}</button>
        </form>
        <p className="auth-switch">
          {t.noAcc}<Link to="/register">{ui.register}</Link>
        </p>
      </div>
    </div>
  )
}
