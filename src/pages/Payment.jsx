import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getMembershipLevelLabel } from '../i18n/terms'
import { CHECKOUT_PLANS } from '../data/checkoutPlans.js'
import {
  formatPlanPrice,
  getDefaultPaymentCurrency,
  isCurrencyRateMissing,
  paymentCurrencyOptions,
} from '../lib/paymentFormat.js'
import { checkoutApiForMethod } from '../lib/checkoutApi.js'

const I18N = {
  zh: { title: '在线全球化支付结算', loading: '加载中…', needLogin: '升级会员需先登录。', login: '登录', register: '注册', current: '当前：', levelOpen: '（', levelClose: '）', pay: '去支付', paying: '跳转中…', wechat: '微信支付', alipay: '支付宝', card: '银行卡', method: '支付方式', note: '选择套餐后，请点下方「微信支付」「支付宝」或「银行卡」。支付成功后自动升级会员。', walletHint: '微信支付和支付宝由本收款账户按人民币或港币结算。若当前展示为美元等其他币种，点击后会按汇率自动转为人民币收款，会员权益不变。', currency: '币种选择：', failed: '支付完成后将自动升级会员；若未能打开收款页，请稍后重试或联系本站支持。', errLogin: '请先登录', errCreate: '无法创建支付会话', errNet: '网络错误：', tierSep: '：', provider: '当前支付通道：', providerName: 'Stripe（银行卡 / 微信 / 支付宝）', currencyNow: '当前结算币种：', rateBase: '手动汇率基准：', approx: '约', rateMissing: (code) => `当前页面未读取到 ${code} 的前端汇率配置，卡片金额将显示基准币种参考价；实际下单金额以支付通道返回为准。`, benefitsTitle: '会员权益说明', tierFreeTitle: '普通会员', tierFreeNote: '注册即得', tierFreeBody: '长寿知识技能部分免费、长寿产品证据库大部分、前沿医学资讯大部分、转化应用机遇部分免费；可试用「自我健康促进咨询」，每日 2 万 token（北京时间 0 点恢复）。专业健康长寿咨询需高级会员。', tierStandardTitle: '标准会员', tierStandardBody: '在普通会员基础上增加长寿知识技能大部分、转化应用机遇全部、治未病全部，以及 AI 长寿师下的健康风险评估（China-PAR、糖尿病、高血压、痴呆、帕金森相对风险、骨质疏松、肌少症、生活方式）和衰老评估（Horvath 与 iCAS 生物学年龄、GrimAge2、DunedinPACE）；「自我健康促进咨询」每日 20 万 token。专业健康长寿咨询需高级会员。', tierPremiumTitle: '高级会员', tierPremiumBody: '所有模块与内容；两个咨询均可进入，每日合计 40 万 token。', currencies: { USD: '美元', EUR: '欧元', CNY: '人民币', HKD: '港币', SGD: '新加坡元', GBP: '英镑', JPY: '日元', AUD: '澳元' }, plans: { standard_monthly: { name: '标准会员 · 月度', desc: '1 个月' }, standard_yearly: { name: '标准会员 · 年度', desc: '12 个月，省约 17%' }, premium_monthly: { name: '高级会员 · 月度', desc: '1 个月' }, premium_yearly: { name: '高级会员 · 年度', desc: '12 个月，省约 17%' } } },
  en: { title: 'Global Checkout', loading: 'Loading…', needLogin: 'Please login before upgrading.', login: 'Login', register: 'Sign up', current: 'Current: ', levelOpen: ' (', levelClose: ')', pay: 'Pay Now', paying: 'Redirecting…', wechat: 'WeChat Pay', alipay: 'Alipay', card: 'Card', method: 'Payment method', note: 'Choose a plan, then tap WeChat Pay, Alipay, or Card. Membership upgrades automatically after success.', walletHint: 'WeChat Pay and Alipay settle in CNY or HKD on this account. If another currency is selected, checkout converts to CNY at the configured rate.', currency: 'Currency:', failed: 'Membership upgrades automatically after payment. If checkout does not open, retry later or contact support.', errLogin: 'Please login first', errCreate: 'Failed to create checkout session', errNet: 'Network error: ', tierSep: ': ', provider: 'Payment channel: ', providerName: 'Stripe (card / WeChat Pay / Alipay)', currencyNow: 'Settlement currency: ', rateBase: 'Manual rate base: ', approx: 'about', rateMissing: (code) => `No front-end rate is set for ${code}. Cards show the base-currency reference. The amount charged is what the payment provider returns.`, benefitsTitle: 'What each membership includes', tierFreeTitle: 'Member', tierFreeNote: 'included when you register', tierFreeBody: 'Part of Health Skills, most of the Product Evidence Library, most of Medical Insights, and part of Commercialization. Self-care consult is a trial: 20,000 tokens a day, resetting at 00:00 Beijing time. Professional consult requires Premium.', tierStandardTitle: 'Standard', tierStandardBody: 'Adds most of Health Skills, all of Commercialization, all of Preventive TCM, plus the health risk tools (China-PAR, diabetes, hypertension, dementia, Parkinson relative risk, osteoporosis, sarcopenia, lifestyle) and the aging clocks (Horvath and iCAS biological age, GrimAge2, DunedinPACE). Self-care consult is 200,000 tokens a day. Professional consult requires Premium.', tierPremiumTitle: 'Premium', tierPremiumBody: 'All modules and content. Both consult modes, 400,000 tokens a day combined.', currencies: { USD: 'US dollar', EUR: 'Euro', CNY: 'Chinese yuan', HKD: 'Hong Kong dollar', SGD: 'Singapore dollar', GBP: 'Pound sterling', JPY: 'Yen', AUD: 'Australian dollar' }, plans: { standard_monthly: { name: 'Standard · Monthly', desc: '1 month' }, standard_yearly: { name: 'Standard · Yearly', desc: '12 months, about 17% off' }, premium_monthly: { name: 'Premium · Monthly', desc: '1 month' }, premium_yearly: { name: 'Premium · Yearly', desc: '12 months, about 17% off' } } },
  ar: { title: 'الدفع العالمي', loading: 'جار التحميل…', needLogin: 'يرجى تسجيل الدخول قبل ترقية العضوية.', login: 'تسجيل الدخول', register: 'إنشاء حساب', current: 'الحالي: ', levelOpen: ' (', levelClose: ')', pay: 'الدفع الآن', paying: 'جار التحويل…', wechat: 'WeChat Pay', alipay: 'Alipay', card: 'بطاقة', method: 'طريقة الدفع', note: 'اختر الخطة ثم اضغط WeChat Pay أو Alipay أو البطاقة. ستتم الترقية تلقائيًا بعد نجاح الدفع.', walletHint: 'WeChat Pay و Alipay تتم تسويتهما بـ CNY أو HKD. إذا اخترت عملة أخرى فسيتم التحويل إلى CNY.', currency: 'العملة:', failed: 'ستتم الترقية تلقائيًا بعد الدفع. إذا لم تُفتح صفحة التحصيل، أعد المحاولة أو تواصل مع الدعم.', errLogin: 'يرجى تسجيل الدخول أولاً', errCreate: 'تعذر إنشاء جلسة الدفع', errNet: 'خطأ في الشبكة: ', tierSep: ': ', provider: 'قناة الدفع: ', providerName: 'Stripe (بطاقة / WeChat Pay / Alipay)', currencyNow: 'عملة التسوية: ', rateBase: 'أساس سعر الصرف اليدوي: ', approx: 'حوالي', rateMissing: (code) => `لا يوجد سعر أمامي لـ ${code}. تعرض البطاقات سعر العملة الأساسية. المبلغ المحصّل هو ما يعيده مزود الدفع.`, benefitsTitle: 'ما تشمله العضوية', tierFreeTitle: 'عضو', tierFreeNote: 'عند التسجيل', tierFreeBody: 'جزء من مهارات الصحة، ومعظم مكتبة أدلة المنتجات، ومعظم المستجدات الطبية، وجزء من فرص التحويل. استشارة العناية الذاتية تجريبية: 20,000 رمز يوميًا، وتُستعاد عند 00:00 بتوقيت بكين. الاستشارة المهنية تتطلب العضوية المميزة.', tierStandardTitle: 'قياسي', tierStandardBody: 'يضيف معظم مهارات الصحة، وكل فرص التحويل، وكل الوقاية بالطب الصيني، وتقييمات المخاطر (China-PAR والسكري وارتفاع الضغط والخرف وخطر باركنسون النسبي وهشاشة العظام وضمور العضلات ونمط الحياة) وساعات الشيخوخة (العمر البيولوجي Horvath و iCAS، و GrimAge2 و DunedinPACE). استشارة العناية الذاتية 200,000 رمز يوميًا. الاستشارة المهنية تتطلب العضوية المميزة.', tierPremiumTitle: 'مميز', tierPremiumBody: 'كل الوحدات والمحتوى. وضعا الاستشارة، بمجموع 400,000 رمز يوميًا.', currencies: { USD: 'دولار أمريكي', EUR: 'يورو', CNY: 'يوان صيني', HKD: 'دولار هونغ كونغ', SGD: 'دولار سنغافوري', GBP: 'جنيه إسترليني', JPY: 'ين', AUD: 'دولار أسترالي' }, plans: { standard_monthly: { name: 'قياسي · شهري', desc: 'شهر واحد' }, standard_yearly: { name: 'قياسي · سنوي', desc: '12 شهرًا، خصم نحو 17%' }, premium_monthly: { name: 'مميز · شهري', desc: 'شهر واحد' }, premium_yearly: { name: 'مميز · سنوي', desc: '12 شهرًا، خصم نحو 17%' } } },
}

function resolvePlanId(raw) {
  const id = String(raw || '').trim()
  return CHECKOUT_PLANS.some((p) => p.id === id) ? id : 'standard_monthly'
}

function resolveCurrencyCode(raw) {
  const code = String(raw || '').toUpperCase().trim()
  const options = paymentCurrencyOptions()
  return options.includes(code) ? code : getDefaultPaymentCurrency()
}

export default function Payment() {
  const { lang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const { user, loading: authLoading, getToken } = useAuth()
  const [searchParams] = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState(() => resolvePlanId(searchParams.get('plan')))
  const [selectedCurrency, setSelectedCurrency] = useState(() => resolveCurrencyCode(searchParams.get('currency')))
  const [loading, setLoading] = useState(false)
  const [loadingMethod, setLoadingMethod] = useState(null)
  const [error, setError] = useState(null)
  const selectedCurrencyRateMissing = isCurrencyRateMissing(selectedCurrency)
  const PAYMENT_CURRENCY_OPTIONS = paymentCurrencyOptions()

  const handlePay = async (method = 'auto') => {
    const token = getToken()
    if (!user || !token) {
      setError(t.errLogin)
      return
    }

    setLoading(true)
    setLoadingMethod(method)
    setError(null)
    try {
      const res = await fetch(checkoutApiForMethod(method), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
          currency: selectedCurrency,
          method,
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
      setLoadingMethod(null)
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
      <p>{t.current}{user.name}{t.levelOpen}{getMembershipLevelLabel(user.level, lang)}{t.levelClose}</p>
      <p className="payment-note">{t.provider}{t.providerName}</p>
      <p className="payment-note">{t.currencyNow}{selectedCurrency}</p>
      <p className="payment-note">{t.rateBase}{String(import.meta.env.VITE_PAYMENT_BASE_CURRENCY || 'USD').toUpperCase()}</p>
      <p className="payment-desc">{t.note}</p>

      <details className="payment-tier-desc">
        <summary>{t.benefitsTitle}</summary>
        <ul>
          <li><strong>{t.tierFreeTitle}</strong>{t.levelOpen}{t.tierFreeNote}{t.levelClose}{t.tierSep}{t.tierFreeBody}</li>
          <li><strong>{t.tierStandardTitle}</strong>{t.tierSep}{t.tierStandardBody}</li>
          <li><strong>{t.tierPremiumTitle}</strong>{t.tierSep}{t.tierPremiumBody}</li>
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
                {`${currency} - ${t.currencies[currency] || currency}`}
              </option>
            ))}
          </select>
        </p>
        {selectedCurrencyRateMissing ? (
          <p className="payment-note">{t.rateMissing(selectedCurrency)}</p>
        ) : null}
        <div className="plan-grid">
          {CHECKOUT_PLANS.map((plan) => {
            const copy = t.plans[plan.id] || plan
            return (
            <label key={plan.id} className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="plan"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={(e) => setSelectedPlan(e.target.value)}
              />
              <div className="plan-name">{copy.name}</div>
              <div className="plan-price">{formatPlanPrice(plan.amount, selectedCurrency, t.approx)}</div>
              <div className="plan-desc">{copy.desc}</div>
            </label>
            )
          })}
        </div>
        <div className="payment-summary">
          <p className="payment-method-label">{t.method}</p>
          <p className="payment-note">{t.walletHint}</p>
          <div className="pay-method-grid">
            <button
              type="button"
              className="pay-method-btn pay-method-btn--wechat"
              onClick={() => handlePay('wechat')}
              disabled={loading}
            >
              {loadingMethod === 'wechat' ? t.paying : t.wechat}
            </button>
            <button
              type="button"
              className="pay-method-btn pay-method-btn--alipay"
              onClick={() => handlePay('alipay')}
              disabled={loading}
            >
              {loadingMethod === 'alipay' ? t.paying : t.alipay}
            </button>
            <button
              type="button"
              className="pay-method-btn"
              onClick={() => handlePay('card')}
              disabled={loading}
            >
              {loadingMethod === 'card' ? t.paying : t.card}
            </button>
          </div>
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
