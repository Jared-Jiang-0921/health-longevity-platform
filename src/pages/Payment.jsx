import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from '../components/PaymentForm'

const stripePk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = stripePk ? loadStripe(stripePk) : null

// 后端创建 PaymentIntent 的接口（需自行部署）
const PAYMENT_INTENT_API = import.meta.env.VITE_PAYMENT_INTENT_API || '/api/create-payment-intent'

export default function Payment() {
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!stripePk) return
    setLoading(true)
    fetch(PAYMENT_INTENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1999, currency: 'usd' }), // 示例：19.99 USD
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setError(data.error || '无法创建支付会话')
      })
      .catch(() => setError('网络错误，请确认后端已启动'))
      .finally(() => setLoading(false))
  }, [])

  if (!stripePk) {
    return (
      <div className="page-content">
        <h1>在线全球化支付结算</h1>
        <p>使用 Stripe 安全完成支付。需要配置公钥（测试环境用 <code>pk_test_</code> 开头）：</p>
        <ul>
          <li><strong>本地开发</strong>：在项目根目录创建 <code>.env</code>，写入 <code>VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx</code> 后重启 <code>npm run dev</code>。</li>
          <li><strong>Vercel 等线上</strong>：项目 → <strong>Settings → Environment Variables</strong>，新增同名变量，值为 Stripe 里的公钥，保存后 <strong>Redeploy</strong> 一次。</li>
        </ul>
        <p>完成支付还需后端创建 PaymentIntent，并配置：</p>
        <pre>VITE_PAYMENT_INTENT_API=https://你的后端地址/create-payment-intent</pre>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-content">
        <h1>在线全球化支付结算</h1>
        <p>正在准备支付…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <h1>在线全球化支付结算</h1>
        <p>{error}</p>
        <p>
          请确认能访问 <code>POST {PAYMENT_INTENT_API}</code> 并返回 <code>{"{ clientSecret }"}</code>。
          若部署在 Vercel 且未单独配置 <code>VITE_PAYMENT_INTENT_API</code>，请使用仓库内 <code>api/create-payment-intent.js</code>，并在 Vercel 环境变量中设置 <code>STRIPE_SECRET_KEY</code>（与公钥同一 Stripe 账号下的 Secret key）。
        </p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="page-content">
        <h1>在线全球化支付结算</h1>
        <p>无法获取支付会话，请检查后端与 .env 配置。</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <h1>在线全球化支付结算</h1>
      <p>使用 Stripe 安全完成支付，支持多币种与多地区。</p>
      <section className="payment-section">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm />
        </Elements>
      </section>
    </div>
  )
}
