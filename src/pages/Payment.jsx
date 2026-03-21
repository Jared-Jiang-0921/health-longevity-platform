import { useState } from 'react'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API || '/api/create-checkout-session'

export default function Payment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1999,
          currency: 'usd',
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

  return (
    <div className="page-content">
      <h1>在线全球化支付结算</h1>
      <p>使用 Stripe 安全完成支付，支持多币种与多地区。</p>
      <p className="payment-desc">点击下方按钮将跳转到 Stripe 官方支付页面完成支付，支付完成后自动返回。</p>

      <section className="payment-section">
        <div className="payment-summary">
          <p><strong>示例金额：</strong>19.99 USD</p>
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
        若跳转失败，请检查 Vercel 环境变量 <code>STRIPE_SECRET_KEY</code> 是否已配置，并确保后端 API 正常。
      </p>
    </div>
  )
}
