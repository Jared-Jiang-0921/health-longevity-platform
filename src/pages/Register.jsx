import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import { CHECKOUT_PLANS, REGISTER_FREE_ID } from '../data/checkoutPlans.js'
import {
  formatPlanPrice,
  getDefaultPaymentCurrency,
  isCurrencyRateMissing,
  paymentCurrencyOptions,
} from '../lib/paymentFormat.js'
import './Auth.css'

const STANDARD_PLANS = CHECKOUT_PLANS.filter((p) => p.tier === 'standard')
const PREMIUM_PLANS = CHECKOUT_PLANS.filter((p) => p.tier === 'premium')
const CURRENCIES = {
  zh: { USD: '美元', EUR: '欧元', CNY: '人民币', HKD: '港币', SGD: '新加坡元', GBP: '英镑', JPY: '日元', AUD: '澳元' },
  en: { USD: 'US dollar', EUR: 'Euro', CNY: 'Chinese yuan', HKD: 'Hong Kong dollar', SGD: 'Singapore dollar', GBP: 'Pound sterling', JPY: 'Yen', AUD: 'Australian dollar' },
  ar: { USD: 'دولار أمريكي', EUR: 'يورو', CNY: 'يوان صيني', HKD: 'دولار هونغ كونغ', SGD: 'دولار سنغافوري', GBP: 'جنيه إسترليني', JPY: 'ين', AUD: 'دولار أسترالي' },
}

const I18N = {
  zh: {
    title: '会员注册', login: '登录', hasAcc: '已有账号？', forgot: '忘记密码？', email: '邮箱', nickname: '昵称（可选）', password: '密码', confirm: '确认密码', register: '注册', registering: '注册中…', toPay: '注册并去支付', toPaying: '注册成功，正在进入支付页…', choose: '选择会员类型', payCurrency: '支付币种（与结算页一致）',
    intro: '普通会员免费；标准/高级会员注册成功后进入与咨询升级相同的支付页，可选微信支付、支付宝或银行卡（Stripe（银行卡 / 微信 / 支付宝））。',
    freePrice: '免费', freeDesc: '注册即可体验部分模块与内容',
    namePh: '显示名称', passwordPh: '请输入密码', confirmPh: '再次输入密码', approx: '约',
    errEmail: '请输入有效邮箱，例如：name@example.com', errPassword: '密码至少 6 位', errMatch: '两次密码不一致', errLegal: '请勾选并同意 Terms of Service 与 Privacy Policy', errPlan: '请选择有效的付费套餐', errFail: '注册失败',
    rateMissing: (code) => `未配置 ${code} 汇率时将显示基准币种参考价，实际扣款以支付通道为准。`,
    apiErrors: {
      '该邮箱已注册': '该邮箱已注册',
      '邮箱和密码必填': '邮箱和密码必填',
      '邮箱格式不正确': '邮箱格式不正确',
      '该企业域名已启用企业管理，请联系管理员邀请加入': '该企业域名已启用企业管理，请联系管理员邀请加入',
      '注册失败：未写入用户': '注册失败：未写入用户',
      '注册失败': '注册失败',
    },
    plans: {
      standard_monthly: { period: '月度', desc: '1 个月' },
      standard_yearly: { period: '年度', desc: '12 个月，省约 17%' },
      premium_monthly: { period: '月度', desc: '1 个月' },
      premium_yearly: { period: '年度', desc: '12 个月，省约 17%' },
    },
  },
  en: {
    title: 'Sign Up', login: 'Login', hasAcc: 'Already have an account?', forgot: 'Forgot password?', email: 'Email', nickname: 'Display name (optional)', password: 'Password', confirm: 'Confirm password', register: 'Sign up', registering: 'Signing up…', toPay: 'Sign up & Pay', toPaying: 'Opening checkout…', choose: 'Choose membership tier', payCurrency: 'Payment currency',
    intro: 'Member is free. Standard and Premium continue to the same checkout as an upgrade, with WeChat Pay, Alipay, or card (Stripe: card / WeChat Pay / Alipay).',
    freePrice: 'Free', freeDesc: 'Sign up to try some modules and content',
    namePh: 'Display name', passwordPh: 'Password', confirmPh: 'Enter the password again', approx: 'about',
    errEmail: 'Enter a valid email, for example name@example.com', errPassword: 'Password must be at least 6 characters', errMatch: 'The two passwords do not match', errLegal: 'Please agree to the Terms of Service and Privacy Policy', errPlan: 'Choose a valid paid plan', errFail: 'Sign-up failed',
    rateMissing: (code) => `No rate is configured for ${code}. The card shows the base-currency reference price; the charge follows the payment channel.`,
    apiErrors: {
      '该邮箱已注册': 'This email is already registered',
      '邮箱和密码必填': 'Email and password are required',
      '邮箱格式不正确': 'The email format is not valid',
      '该企业域名已启用企业管理，请联系管理员邀请加入': 'This company domain uses organization accounts. Ask an admin for an invite',
      '注册失败：未写入用户': 'Sign-up failed: the account was not saved',
      '注册失败': 'Sign-up failed',
    },
    plans: {
      standard_monthly: { period: 'Monthly', desc: '1 month' },
      standard_yearly: { period: 'Yearly', desc: '12 months, about 17% off' },
      premium_monthly: { period: 'Monthly', desc: '1 month' },
      premium_yearly: { period: 'Yearly', desc: '12 months, about 17% off' },
    },
  },
  ar: {
    title: 'إنشاء حساب', login: 'تسجيل الدخول', hasAcc: 'لديك حساب بالفعل؟', forgot: 'هل نسيت كلمة المرور؟', email: 'البريد الإلكتروني', nickname: 'الاسم المعروض (اختياري)', password: 'كلمة المرور', confirm: 'تأكيد كلمة المرور', register: 'إنشاء الحساب', registering: 'جار إنشاء الحساب…', toPay: 'إنشاء الحساب والدفع', toPaying: 'جار فتح صفحة الدفع…', choose: 'اختر نوع العضوية', payCurrency: 'عملة الدفع',
    intro: 'العضوية العادية مجانية. القياسي والمميز ينتقلان إلى صفحة الدفع نفسها، مع WeChat Pay أو Alipay أو البطاقة (Stripe: بطاقة / WeChat Pay / Alipay).',
    freePrice: 'مجاني', freeDesc: 'أنشئ حسابًا لتجربة بعض الأقسام والمحتوى',
    namePh: 'الاسم المعروض', passwordPh: 'كلمة المرور', confirmPh: 'أعد إدخال كلمة المرور', approx: 'حوالي',
    errEmail: 'أدخل بريدًا صالحًا، مثل name@example.com', errPassword: 'كلمة المرور 6 أحرف على الأقل', errMatch: 'كلمتا المرور غير متطابقتين', errLegal: 'يرجى الموافقة على Terms of Service و Privacy Policy', errPlan: 'اختر خطة مدفوعة صالحة', errFail: 'تعذر إنشاء الحساب',
    rateMissing: (code) => `لا يوجد سعر لـ ${code}. تعرض البطاقة سعر العملة الأساسية؛ الخصم الفعلي حسب قناة الدفع.`,
    apiErrors: {
      '该邮箱已注册': 'هذا البريد مسجّل بالفعل',
      '邮箱和密码必填': 'البريد وكلمة المرور مطلوبان',
      '邮箱格式不正确': 'صيغة البريد غير صالحة',
      '该企业域名已启用企业管理，请联系管理员邀请加入': 'نطاق الشركة هذا يستخدم حسابات مؤسسة. اطلب دعوة من المسؤول',
      '注册失败：未写入用户': 'تعذر إنشاء الحساب: لم يُحفظ',
      '注册失败': 'تعذر إنشاء الحساب',
    },
    plans: {
      standard_monthly: { period: 'شهري', desc: 'شهر واحد' },
      standard_yearly: { period: 'سنوي', desc: '12 شهرًا، خصم نحو 17%' },
      premium_monthly: { period: 'شهري', desc: 'شهر واحد' },
      premium_yearly: { period: 'سنوي', desc: '12 شهرًا، خصم نحو 17%' },
    },
  },
}

function localizeApiError(err, t) {
  const text = String(err || '').trim()
  return t.apiErrors[text] || text || t.errFail
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
      setError(t.errEmail)
      return
    }
    if (!password || password.length < 6) {
      setError(t.errPassword)
      return
    }
    if (password !== confirm) {
      setError(t.errMatch)
      return
    }
    if (!agreeLegal) {
      setError(t.errLegal)
      return
    }
    if (isPaid && !CHECKOUT_PLANS.some((p) => p.id === selectedPath)) {
      setError(t.errPlan)
      return
    }

    setSubmitting(true)
    const { ok, error: err } = await register(email, password, name || undefined)
    if (!ok) {
      setSubmitting(false)
      setError(localizeApiError(err, t))
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
            <p className="auth-note register-tiers-intro">{t.intro}</p>

            <label className={`plan-card register-tier-card ${selectedPath === REGISTER_FREE_ID ? 'selected' : ''}`}>
              <input
                type="radio"
                name="register_tier"
                value={REGISTER_FREE_ID}
                checked={selectedPath === REGISTER_FREE_ID}
                onChange={() => setSelectedPath(REGISTER_FREE_ID)}
              />
              <div className="plan-name">{getMembershipLevelLabel('free', lang)}</div>
              <div className="plan-price">{t.freePrice}</div>
              <div className="plan-desc">{t.freeDesc}</div>
            </label>

            <div className="register-tier-block">
              <div className="register-tier-block-title">{getMembershipLevelLabel('standard', lang)}</div>
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
                    <div className="plan-name">{(t.plans[plan.id] || {}).period || plan.name}</div>
                    <div className="plan-price">{formatPlanPrice(plan.amount, selectedCurrency, t.approx)}</div>
                    <div className="plan-desc">{(t.plans[plan.id] || {}).desc || plan.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="register-tier-block">
              <div className="register-tier-block-title">{getMembershipLevelLabel('premium', lang)}</div>
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
                    <div className="plan-name">{(t.plans[plan.id] || {}).period || plan.name}</div>
                    <div className="plan-price">{formatPlanPrice(plan.amount, selectedCurrency, t.approx)}</div>
                    <div className="plan-desc">{(t.plans[plan.id] || {}).desc || plan.desc}</div>
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
                    {`${currency} - ${(CURRENCIES[lang] || CURRENCIES.zh)[currency] || currency}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {isPaid && selectedCurrencyRateMissing ? (
            <p className="auth-note">
              {t.rateMissing(selectedCurrency)}
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
              placeholder={t.namePh}
            />
          </label>
          <label>
            <span>{t.password}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPh}
              autoComplete="new-password"
            />
          </label>
          <label>
            <span>{t.confirm}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t.confirmPh}
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
