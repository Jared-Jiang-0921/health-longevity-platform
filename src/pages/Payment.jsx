import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from '../components/PaymentForm'

const stripePk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = stripePk ? loadStripe(stripePk) : null

// 后端创建 PaymentIntent 的接口（需自行部署）
const PAYMENT_INTENT_API = import.meta.env.VITE_PAYMENT_INTENT_API || '/api/create-payment-intent'

const CHECKOUT_STORAGE_KEY = 'health-platform-last-checkout'

// 示例会员方案（金额为示例，可根据需要调整，单位：分）
const MEMBERSHIP_PLANS = [
  {
    id: 'member-basic',
    label: '普通会员（月付）',
    desc: '原价 HK$399/月，现价 HK$199/月。可查看健康技能课程的文本与视频内容，以及前沿长寿资讯模块内容（示例说明，具体以实际会员规则为准）。',
    amount: 19900, // HK$199.00
  },
  {
    id: 'member-premium',
    label: '高级会员（月付）',
    desc: '原价 HK$999/月，现价 HK$599/月。可使用平台全部功能，包括所有健康技能课程、前沿资讯、长寿咨询入口与治未病模块等（示例说明，具体以实际会员规则为准）。',
    amount: 59900, // HK$599.00
  },
]

// 示例单次服务方案（金额为示例，可根据需要调整，单位：分）
const SERVICE_PLANS = [
  {
    id: 'consult',
    label: '长寿健康专项咨询（月度服务）',
    desc: '按月度计费的长寿健康专项咨询服务，在当月内提供多次针对性健康长寿问题交流与建议（示例）。',
    amount: 59900, // HK$599.00
  },
  {
    id: 'course-bundle',
    label: '健康技能课程（月度访问）',
    desc: '按月度计费，在当月内可持续访问若干门精选健康技能课程内容（示例）。',
    amount: 29900, // HK$299.00
  },
  {
    id: 'tcm',
    label: '治未病方案评估与指导（月度服务）',
    desc: '按月度计费的“治未病”理念结构化评估与指导服务，当月内可多次获得评估与建议更新（示例）。',
    amount: 39900, // HK$399.00
  },
]

export default function Payment() {
  const [searchParams] = useSearchParams()
  const planFromUrl = searchParams.get('plan')
  const catFromUrl = searchParams.get('category') || 'membership'
  const initialPlan =
    MEMBERSHIP_PLANS.find((p) => p.id === planFromUrl)?.id ||
    SERVICE_PLANS.find((p) => p.id === planFromUrl)?.id ||
    MEMBERSHIP_PLANS[0].id
  const initialCat = MEMBERSHIP_PLANS.some((p) => p.id === planFromUrl)
    ? 'membership'
    : SERVICE_PLANS.some((p) => p.id === planFromUrl)
      ? 'service'
      : catFromUrl

  const { t } = useTranslation()
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState(initialCat)
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlan)

  useEffect(() => {
    if (!stripePk) return
    const list = category === 'membership' ? MEMBERSHIP_PLANS : SERVICE_PLANS
    const plan = list.find((p) => p.id === selectedPlanId) || list[0]
    setLoading(true)
    setError(null)
    setClientSecret(null)

    // 记录本次结算选择，供支付成功后升级会员或展示用
    try {
      const now = Date.now()
      // 简单按“30 天后”为到期时间（仅前端演示用）
      const expiresAt = now + 30 * 24 * 60 * 60 * 1000
      const payload = {
        category,
        planId: plan.id,
        label: plan.label,
        amount: plan.amount,
        createdAt: now,
        expiresAt,
      }
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }

    fetch(PAYMENT_INTENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: plan.amount,
        currency: 'usd', // 以美元结算
        description: plan.label,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setError(data.error || '无法创建支付会话')
      })
      .catch(() => setError('网络错误，请确认后端已启动'))
      .finally(() => setLoading(false))
  }, [selectedPlanId, category])

  if (!stripePk) {
    return (
      <div className="page-content">
        <h1>{t('payment.title')}</h1>
        <p>{t('payment.stripeConfig')}</p>
        <pre>VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx</pre>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-content">
        <h1>{t('payment.title')}</h1>
        <p>{t('payment.creating')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <h1>{t('payment.title')}</h1>
        <p>{error}</p>
        <p>{t('payment.errorBackend')}</p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="page-content">
        <h1>{t('payment.title')}</h1>
        <p>{t('payment.errorBackend')}</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <h1>{t('payment.title')}</h1>
      <p>{t('payment.subtitle')}</p>
      <p>
        {t('payment.tip')}
        {' '}
        <a href="/offline-payment">{t('payment.offlineLink')}</a>.
      </p>

      <section className="payment-section">
        <div className="payment-tabs">
          <button
            type="button"
            className={category === 'membership' ? 'active' : ''}
            onClick={() => {
              setCategory('membership')
              setSelectedPlanId(MEMBERSHIP_PLANS[0].id)
            }}
          >
            {t('payment.membershipTab')}
          </button>
          <button
            type="button"
            className={category === 'service' ? 'active' : ''}
            onClick={() => {
              setCategory('service')
              setSelectedPlanId(SERVICE_PLANS[0].id)
            }}
          >
            {t('payment.serviceTab')}
          </button>
        </div>

        <div className="service-plans">
          {(category === 'membership' ? MEMBERSHIP_PLANS : SERVICE_PLANS).map((plan) => (
            <label key={plan.id} className={`service-plan ${plan.id === selectedPlanId ? 'active' : ''}`}>
              <input
                type="radio"
                name="service-plan"
                value={plan.id}
                checked={plan.id === selectedPlanId}
                onChange={() => setSelectedPlanId(plan.id)}
              />
              <div className="service-plan-body">
                <div className="service-plan-row">
                  <span className="service-plan-label">{t(`payment.plans.${plan.id}.label`)}</span>
                  <span className="service-plan-amount">
                    US${(plan.amount / 100).toFixed(2)}
                  </span>
                </div>
                <p className="service-plan-desc">{t(`payment.plans.${plan.id}.desc`)}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="payment-form-wrapper">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm />
          </Elements>
        </div>
      </section>
    </div>
  )
}
