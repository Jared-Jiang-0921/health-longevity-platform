import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { CHECKOUT_PLANS, REGISTER_FREE_ID } from '../data/checkoutPlans.js'
import {
  CURRENCY_LABELS,
  formatPlanPrice,
  getDefaultPaymentCurrency,
  isCurrencyRateMissing,
  membershipLevelLabel,
  paymentCurrencyOptions,
} from '../lib/paymentFormat.js'
import { getProviderDisplayName, PAYMENT_PROVIDER } from '../lib/checkoutApi.js'
import './Auth.css'

const STANDARD_PLANS = CHECKOUT_PLANS.filter((p) => p.tier === 'standard')
const PREMIUM_PLANS = CHECKOUT_PLANS.filter((p) => p.tier === 'premium')
const I18N = {
  zh: { title: '会员注册', login: '登录', hasAcc: '已有账号？', forgot: '忘记密码？', email: '邮箱', nickname: '昵称（可选）', password: '密码', confirm: '确认密码', register: '注册', registering: '注册中…', toPay: '注册并去支付', toPaying: '注册成功，正在进入支付页…', choose: '选择会员类型', payCurrency: '支付币种（与结算页一致）' },
  en: { title: 'Sign Up', login: 'Login', hasAcc: 'Already have an account?', forgot: 'Forgot password?', email: 'Email', nickname: 'Display name (optional)', password: 'Password', confirm: 'Confirm password', register: 'Sign up', registering: 'Signing up…', toPay: 'Sign up & Pay', toPaying: 'Opening checkout…', choose: 'Choose membership tier', payCurrency: 'Payment currency' },
  ar: { title: 'إنشاء حساب', login: 'تسجيل الدخول', hasAcc: 'لديك حساب بالفعل؟', forgot: 'هل نسيت كلمة المرور؟', email: 'البريد الإلكتروني', nickname: 'الاسم المعروض (اختياري)', password: 'كلمة المرور', confirm: 'تأكيد كلمة المرور', register: 'إنشاء الحساب', registering: 'جار إنشاء الحساب…', toPay: 'إنشاء الحساب والدفع', toPaying: 'جار فتح صفحة الدفع…', choose: 'اختر نوع العضوية', payCurrency: 'عملة الدفع' },
}

export default function Register() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = I18N[lang] || I18N.zh
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedPath, setSelectedPath] = useState(REGISTER_FREE_ID)
  const [selectedCurrency, setSelectedCurrency] = useState(getDefaultPaymentCurrency())
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [agreeLegal, setAgreeLegal] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const PAYMENT_CURRENCY_OPTIONS = useMemo(() => paymentCurrencyOptions(), [])
  const selectedCurrencyRateMissing = isCurrencyRateMissing(selectedCurrency)
  const isPaid = selectedPath !== REGISTER_FREE_ID

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!emailOk(email)) {
      setError('请输入有效邮箱，例如：name@example.com')
      return
    }
    if (!password || password.length < 6) {
      setError('密码至少 6 位')
      return
    }
    if (password !== confirm) {
      setError('两次密码不一致')
      return
    }
    if (!agreeLegal) {
      setError('请勾选并同意 Terms of Service 与 Privacy Policy（见英文法律页）')
      return
    }
    if (isPaid && !CHECKOUT_PLANS.some((p) => p.id === selectedPath)) {
      setError('请选择有效的付费套餐')
      return
    }

    setSubmitting(true)
    const { ok, error: err } = await register(email, password, name || undefined)
    if (!ok) {
      setSubmitting(false)
      setError(err || '注册失败')
      return
    }

    if (!isPaid) {
      setSubmitting(false)
      navigate('/')
      return
    }

    const qs = new URLSearchParams({ plan: selectedPath, currency: selectedCurrency })
    navigate(`/payment?${qs.toString()}`)
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-register">
        <h1>{t.title}</h1>
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="register-tiers">
            <legend className="register-tiers-legend">{t.choose}</legend>
            <p className="auth-note register-tiers-intro">
              普通会员免费；标准/高级会员注册成功后进入与咨询升级相同的支付页，可选微信支付、支付宝或银行卡（{getProviderDisplayName(PAYMENT_PROVIDER)}）。
            </p>

            <label className={`plan-card register-tier-card ${selectedPath === REGISTER_FREE_ID ? 'selected' : ''}`}>
              <input
                type="radio"
                name="register_tier"
                value={REGISTER_FREE_ID}
                checked={selectedPath === REGISTER_FREE_ID}
                onChange={() => setSelectedPath(REGISTER_FREE_ID)}
              />
              <div className="plan-name">{membershipLevelLabel('free')}</div>
              <div className="plan-price">免费</div>
              <div className="plan-desc">注册即可体验部分模块与内容</div>
            </label>

            <div className="register-tier-block">
              <div className="register-tier-block-title">{membershipLevelLabel('standard')}</div>
              <div className="plan-grid register-plan-grid">
                {STANDARD_PLANS.map((plan) => (
                  <label
                    key={plan.id}
                    className={`plan-card ${selectedPath === plan.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="register_tier"
                      value={plan.id}
                      checked={selectedPath === plan.id}
                      onChange={() => setSelectedPath(plan.id)}
                    />
                    <div className="plan-name">{plan.name.replace(/^标准会员 · /, '')}</div>
                    <div className="plan-price">{formatPlanPrice(plan.amount, selectedCurrency)}</div>
                    <div className="plan-desc">{plan.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="register-tier-block">
              <div className="register-tier-block-title">{membershipLevelLabel('premium')}</div>
              <div className="plan-grid register-plan-grid">
                {PREMIUM_PLANS.map((plan) => (
                  <label
                    key={plan.id}
                    className={`plan-card ${selectedPath === plan.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="register_tier"
                      value={plan.id}
                      checked={selectedPath === plan.id}
                      onChange={() => setSelectedPath(plan.id)}
                    />
                    <div className="plan-name">{plan.name.replace(/^高级会员 · /, '')}</div>
                    <div className="plan-price">{formatPlanPrice(plan.amount, selectedCurrency)}</div>
                    <div className="plan-desc">{plan.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {isPaid ? (
            <label className="register-currency-row">
              <span>{t.payCurrency}</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                disabled={submitting}
              >
                {PAYMENT_CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency} value={currency}>
                    {`${currency} - ${CURRENCY_LABELS[currency] || currency}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {isPaid && selectedCurrencyRateMissing ? (
            <p className="auth-note">
              未配置 {selectedCurrency} 汇率时将显示基准币种参考价，实际扣款以支付通道为准。
            </p>
          ) : null}

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
            <span>{t.nickname}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="显示名称"
            />
          </label>
          <label>
            <span>{t.password}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              autoComplete="new-password"
            />
          </label>
          <label>
            <span>{t.confirm}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="再次输入密码"
              autoComplete="new-password"
            />
          </label>

          <label className="register-legal-consent">
            <input
              type="checkbox"
              checked={agreeLegal}
              onChange={(e) => setAgreeLegal(e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
              . I have read the{' '}
              <Link to="/disclaimer" target="_blank" rel="noopener noreferrer">
                Health Disclaimer
              </Link>
              . Legal pages offer English, 简体中文, and العربية.
            </span>
          </label>

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? (isPaid ? t.toPaying : t.registering) : isPaid ? t.toPay : ui.register}</button>
        </form>
        <p className="auth-switch">
          {t.hasAcc}<Link to="/login">{ui.login}</Link>
        </p>
      </div>
    </div>
  )
}
