import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      const { error: elementError } = await elements.submit()
      if (elementError) {
        setError(elementError.message)
        return
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        setError(confirmError.message)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        navigate('/payment/success')
        return
      }

      if (paymentIntent?.status === 'processing') {
        setError('银行正在处理中，请稍候查看扣款结果或邮箱通知。')
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
      <PaymentElement />
      {error && <div className="payment-error">{error}</div>}
      <button type="submit" disabled={!stripe || loading} className="btn-primary">
        {loading ? '处理中…' : '支付'}
      </button>
    </form>
  )
}
