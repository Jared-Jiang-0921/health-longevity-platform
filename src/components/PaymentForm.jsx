import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ])
}

export default function PaymentForm({ clientSecret }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setLoading(true)
    setError(null)

    try {
      const { error: elementError } = await withTimeout(
        elements.submit(),
        45000,
        '表单校验超时，请刷新页面后重试'
      )
      if (elementError) {
        setError(elementError.message)
        return
      }

      const { error: confirmError, paymentIntent } = await withTimeout(
        stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success`,
          },
          redirect: 'if_required',
        }),
        120000,
        '确认支付超时：请检查网络或换网络后再试（国内访问 Stripe 可能较慢）'
      )

      if (confirmError) {
        setError(confirmError.message)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        window.location.assign(`${window.location.origin}/payment/success`)
        return
      }

      if (paymentIntent?.status === 'processing') {
        setError('银行正在处理中，请稍候查看扣款结果或邮箱通知。')
        return
      }

      const { paymentIntent: retrieved } = await stripe.retrievePaymentIntent(clientSecret)
      if (retrieved?.status === 'succeeded') {
        window.location.assign(`${window.location.origin}/payment/success`)
        return
      }

      setError('请按 Stripe 弹窗完成验证；若已关闭弹窗，请刷新页面后重试。')
    } catch (err) {
      setError(err?.message || '支付异常，请重试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div className="payment-error">{error}</div>}
      <button type="submit" disabled={!stripe || loading} className="btn-primary">
        {loading ? '处理中…' : '支付'}
      </button>
    </form>
  )
}
