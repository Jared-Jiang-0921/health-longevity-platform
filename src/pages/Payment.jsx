import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS } from '../data/membership'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API || '/api/create-checkout-session'

const PLANS = [
  { id: 'standard_monthly', name: '标准会员 · 月度', price: '9.99', desc: '1 个月' },
  { id: 'standard_yearly', name: '标准会员 · 年度', price: '99.99', desc: '12 个月，省约 17%' },
  { id: 'premium_monthly', name: '高级会员 · 月度', price: '19.99', desc: '1 个月' },
  { id: 'premium_yearly', name: '高级会员 · 年度', price: '199.99', desc: '12 个月，省约 17%' },
]

export default function Payment() {
  const { user, loading: authLoading, getToken } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('standard_monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      <p className="payment-desc">选择套餐后跳转到 Stripe 完成支付，支付成功后自动升级会员。</p>

      <details className="payment-tier-desc">
        <summary>会员权益说明</summary>
        <ul>
          <li><strong>普通会员</strong>（注册即得）：长寿知识技能部分免费、循证健康产品大部分、前沿长寿医学资讯大部分、转化应用机遇部分免费。</li>
          <li><strong>标准会员</strong>：在普通会员基础上增加长寿知识技能大部分内容、转化应用机遇全部、中医药特色治未病全部、综合长寿方案。</li>
          <li><strong>高级会员</strong>：所有模块与内容。</li>
        </ul>
      </details>

      <section className="payment-section">
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
              <div className="plan-price">${plan.price}</div>
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
            {loading ? '跳转中…' : '去支付'}
          </button>
        </div>
        {error && <div className="payment-error">{error}</div>}
      </section>

      <p className="payment-note">
        若跳转失败，请检查网络与 Vercel 环境变量（STRIPE_SECRET_KEY、DATABASE_URL 等）。
      </p>
    </div>
  )
}
