import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TOKEN_KEY = 'health-platform-token'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const { refreshUser } = useAuth()
  const [syncHint, setSyncHint] = useState('正在同步会员信息…')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const token = localStorage.getItem(TOKEN_KEY)

    async function syncMembership() {
      if (sessionId && token) {
        try {
          const res = await fetch('/api/confirm-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) {
            setSyncHint(data.error ? `同步提示：${data.error}` : '同步未完成，请刷新页面重试')
            await refreshUser()
            return
          }
        } catch {
          setSyncHint('网络异常，请刷新页面')
        }
      }
      await refreshUser()
      setSyncHint('')
    }

    syncMembership()
  }, [searchParams, refreshUser])

  return (
    <div className="page-content">
      <h1>支付成功</h1>
      <p>感谢您的支付，订单已确认。</p>
      {syncHint && <p className="payment-note">{syncHint}</p>}
      <p>
        <Link to="/" className="btn-primary">返回首页</Link>
      </p>
    </div>
  )
}
