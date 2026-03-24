import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS } from '../data/membership'

const PAYMENT_PROVIDER = String(import.meta.env.VITE_PAYMENT_PROVIDER || 'stripe').toLowerCase().trim()
const CHECKOUT_API =
  import.meta.env.VITE_CHECKOUT_API ||
  (PAYMENT_PROVIDER === 'airwallex'
    ? '/api/airwallex/create-checkout-session'
    : '/api/create-checkout-session')
const PAYMENT_BASE_CURRENCY = String(import.meta.env.VITE_PAYMENT_BASE_CURRENCY || 'USD').toUpperCase().trim()
const PAYMENT_CURRENCY = String(import.meta.env.VITE_PAYMENT_CURRENCY || 'USD').toUpperCase().trim()
const PAYMENT_CURRENCY_OPTIONS = String(import.meta.env.VITE_PAYMENT_CURRENCY_OPTIONS || PAYMENT_CURRENCY)
  .split(',')
  .map((v) => v.trim().toUpperCase())
  .filter((v, i, arr) => /^[A-Z]{3}$/.test(v) && arr.indexOf(v) === i)
const MANUAL_RATES_RAW = String(import.meta.env.VITE_PAYMENT_MANUAL_RATES || 'USD:1')
const CURRENCY_LABELS = {
  USD: '美元',
  EUR: '欧元',
  CNY: '人民币',
  HKD: '港币',
  SGD: '新加坡元',
  GBP: '英镑',
  JPY: '日元',
  AUD: '澳元',
}

const PLANS = [
  { id: 'standard_monthly', name: '标准会员 · 月度', amount: 999, desc: '1 个月' },
  { id: 'standard_yearly', name: '标准会员 · 年度', amount: 9999, desc: '12 个月，省约 17%' },
  { id: 'premium_monthly', name: '高级会员 · 月度', amount: 1999, desc: '1 个月' },
  { id: 'premium_yearly', name: '高级会员 · 年度', amount: 19999, desc: '12 个月，省约 17%' },
]

const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW'])

function minorFactor(currency) {
  return ZERO_DECIMAL_CURRENCIES.has(String(currency).toUpperCase()) ? 1 : 100
}

function parseManualRates(raw, baseCurrency) {
  const map = { [baseCurrency]: 1 }
  const parts = String(raw || '').split(',')
  for (const part of parts) {
    const [k, v] = part.split(':')
    const code = String(k || '').trim().toUpperCase()
    const num = Number(String(v || '').trim())
    if (/^[A-Z]{3}$/.test(code) && Number.isFinite(num) && num > 0) {
      map[code] = num
    }
  }
  return map
}

const MANUAL_RATES = parseManualRates(MANUAL_RATES_RAW, PAYMENT_BASE_CURRENCY)

function convertFromBaseMinor(baseMinorAmount, targetCurrency) {
  const baseRate = MANUAL_RATES[PAYMENT_BASE_CURRENCY] || 1
  const targetRate = MANUAL_RATES[targetCurrency]
  if (!targetRate) return null
  const baseMajor = Number(baseMinorAmount) / minorFactor(PAYMENT_BASE_CURRENCY)
  const targetMajor = (baseMajor / baseRate) * targetRate
  return Math.round(targetMajor * minorFactor(targetCurrency))
}

function formatPlanPrice(baseMinorAmount, targetCurrency) {
  const convertedMinor = convertFromBaseMinor(baseMinorAmount, targetCurrency)
  if (convertedMinor == null) return `${targetCurrency} -`
  const amount = Number(convertedMinor) / minorFactor(targetCurrency)
  const decimals = minorFactor(targetCurrency) === 1 ? 0 : 2
  return `${targetCurrency} ${amount.toFixed(decimals)}`
}

export default function Payment() {
  const { user, loading: authLoading, getToken } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('standard_monthly')
  const [selectedCurrency, setSelectedCurrency] = useState(PAYMENT_CURRENCY_OPTIONS[0] || PAYMENT_CURRENCY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const selectedCurrencyRateMissing = !MANUAL_RATES[selectedCurrency]

  const handlePay = async () => {
    const token = getToken()
    if (!user || !token) {
      setError('请先登录')
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
      setError(data.error || '无法创建支付会话')
    } catch (e) {
      setError('网络错误：' + (e.message || '请稍后重试'))
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="page-content">
        <h1>在线全球化支付结算</h1>
        <p>加载中…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content">
        <h1>在线全球化支付结算</h1>
        <p>升级会员需先登录。</p>
        <p>
          <Link to="/login" className="btn-primary">登录</Link>
          <span className="page-sep"> </span>
          <Link to="/register" className="btn-secondary">注册</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <h1>在线全球化支付结算</h1>
      <p>当前：{user.name}（{MEMBERSHIP_LEVELS[user.level]?.name || user.level}）</p>
      <p className="payment-note">当前支付通道：{PAYMENT_PROVIDER === 'airwallex' ? '空中云汇（Airwallex）' : 'Stripe'}</p>
      <p className="payment-note">当前结算币种：{selectedCurrency}</p>
      <p className="payment-note">手动汇率基准：{PAYMENT_BASE_CURRENCY}</p>
      <p className="payment-desc">选择套餐后跳转到对应支付通道完成支付，支付成功后自动升级会员。</p>

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
          币种选择：
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
          <p className="payment-error">
            当前币种 {selectedCurrency} 未配置手动汇率，请调整环境变量 VITE_PAYMENT_MANUAL_RATES / PAYMENT_MANUAL_RATES。
          </p>
        ) : null}
        <div className="plan-grid">
          {PLANS.map((plan) => (
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
            disabled={loading || selectedCurrencyRateMissing}
          >
            {loading ? '跳转中…' : '去支付'}
          </button>
        </div>
        {error && <div className="payment-error">{error}</div>}
      </section>

      <p className="payment-note">
        若跳转失败，请检查网络与支付环境变量配置（Stripe 或 Airwallex）。
      </p>
    </div>
  )
}
