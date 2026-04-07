import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { MEMBERSHIP_LEVELS } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { CHECKOUT_PLANS } from '../data/checkoutPlans.js'
import {
  CURRENCY_LABELS,
  formatPlanPrice,
  getDefaultPaymentCurrency,
  isCurrencyRateMissing,
  paymentCurrencyOptions,
} from '../lib/paymentFormat.js'
import { CHECKOUT_API, getProviderDisplayName, PAYMENT_PROVIDER } from '../lib/checkoutApi.js'

const I18N = {
  zh: { title: '在线全球化支付结算', loading: '加载中…', needLogin: '升级会员需先登录。', login: '登录', register: '注册', current: '当前', pay: '去支付', paying: '跳转中…', note: '选择套餐后跳转到对应支付通道完成支付，支付成功后自动升级会员。', currency: '币种选择：', failed: '若跳转失败，请检查网络与支付环境变量配置（Stripe 或 Airwallex）。', errLogin: '请先登录', errCreate: '无法创建支付会话', errNet: '网络错误：' },
  en: { title: 'Global Checkout', loading: 'Loading…', needLogin: 'Please login before upgrading.', login: 'Login', register: 'Sign up', current: 'Current', pay: 'Pay Now', paying: 'Redirecting…', note: 'Choose a plan and complete payment in the provider checkout. Membership upgrades automatically after success.', currency: 'Currency:', failed: 'If redirect fails, check network and payment env config (Stripe or Airwallex).', errLogin: 'Please login first', errCreate: 'Failed to create checkout session', errNet: 'Network error: ' },
  ar: { title: 'الدفع العالمي', loading: 'جار التحميل…', needLogin: 'يرجى تسجيل الدخول قبل ترقية العضوية.', login: 'تسجيل الدخول', register: 'إنشاء حساب', current: 'الحالي', pay: 'الدفع الآن', paying: 'جار التحويل…', note: 'اختر الخطة ثم أكمل الدفع في بوابة المزود. ستتم الترقية تلقائيًا بعد نجاح الدفع.', currency: 'العملة:', failed: 'إذا فشل التحويل، تحقق من الشبكة ومتغيرات بيئة الدفع (Stripe أو Airwallex).', errLogin: 'يرجى تسجيل الدخول أولاً', errCreate: 'تعذر إنشاء جلسة الدفع', errNet: 'خطأ في الشبكة: ' },
}

export default function Payment() {
  const { lang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const { user, loading: authLoading, getToken } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('standard_monthly')
  const [selectedCurrency, setSelectedCurrency] = useState(getDefaultPaymentCurrency())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const selectedCurrencyRateMissing = isCurrencyRateMissing(selectedCurrency)
  const PAYMENT_CURRENCY_OPTIONS = paymentCurrencyOptions()

  const handlePay = async () => {
    const token = getToken()
    if (!user || !token) {
      setError(t.errLogin)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
          currency: selectedCurrency,
          origin: window.location.origin,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || t.errCreate)
    } catch (e) {
      setError(t.errNet + (e.message || 'please retry'))
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="page-content">
        <h1>{t.title}</h1>
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content">
        <h1>{t.title}</h1>
        <p>{t.needLogin}</p>
        <p>
          <Link to="/login" className="btn-primary">{t.login}</Link>
          <span className="page-sep"> </span>
          <Link to="/register" className="btn-secondary">{t.register}</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <h1>{t.title}</h1>
      <p>{t.current}：{user.name}（{getMembershipLevelLabel(user.level, lang)}）</p>
      <p className="payment-note">当前支付通道：{getProviderDisplayName(PAYMENT_PROVIDER)}</p>
      <p className="payment-note">当前结算币种：{selectedCurrency}</p>
      <p className="payment-note">手动汇率基准：{String(import.meta.env.VITE_PAYMENT_BASE_CURRENCY || 'USD').toUpperCase()}</p>
      <p className="payment-desc">{t.note}</p>

      <details className="payment-tier-desc">
        <summary>会员权益说明</summary>
        <ul>
          <li><strong>普通会员</strong>（注册即得）：长寿知识技能部分免费、循证健康产品大部分、前沿长寿医学资讯大部分、转化应用机遇部分免费；可打开「综合长寿方案」页面，但<strong>两个咨询入口均需升级会员</strong>。</li>
          <li><strong>标准会员</strong>：在普通会员基础上增加长寿知识技能大部分、转化应用机遇全部、治未病全部；综合长寿方案中<strong>仅可进入「自我健康促进咨询」</strong>，专业健康长寿咨询需高级会员。</li>
          <li><strong>高级会员</strong>：所有模块与内容；综合长寿方案中<strong>两个咨询均可进入</strong>。</li>
        </ul>
      </details>

      <section className="payment-section">
        <p className="payment-note">
          {t.currency}
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            disabled={loading}
            style={{ marginLeft: '0.5rem' }}
          >
            {PAYMENT_CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency}>
                {`${currency} - ${CURRENCY_LABELS[currency] || currency}`}
              </option>
            ))}
          </select>
        </p>
        {selectedCurrencyRateMissing ? (
          <p className="payment-note">
            当前页面未读取到 {selectedCurrency} 的前端汇率配置，卡片金额将显示基准币种参考价；实际下单金额以支付通道返回为准。
          </p>
        ) : null}
        <div className="plan-grid">
          {CHECKOUT_PLANS.map((plan) => (
            <label key={plan.id} className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="plan"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={(e) => setSelectedPlan(e.target.value)}
              />
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{formatPlanPrice(plan.amount, selectedCurrency)}</div>
              <div className="plan-desc">{plan.desc}</div>
            </label>
          ))}
        </div>
        <div className="payment-summary">
          <button
            type="button"
            className="btn-primary"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? t.paying : t.pay}
          </button>
        </div>
        {error && <div className="payment-error">{error}</div>}
      </section>

      <p className="payment-note">
        <Link to="/legal/sale">Terms of Sale</Link>
        <span className="page-sep"> · </span>
        <Link to="/privacy">Privacy Policy</Link>
        <span className="page-sep"> · </span>
        <Link to="/terms">Terms of Service</Link>
      </p>

      <p className="payment-note">
        {t.failed}
      </p>
    </div>
  )
}
