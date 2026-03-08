import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
        receipt_email: undefined, // 可按需从表单读取
      },
    })
    if (submitError) {
      setError(submitError.message)
      setLoading(false)
      return
    }
    setLoading(false)
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
