import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PaymentSuccess() {
  const { refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <div className="page-content">
      <h1>支付成功</h1>
      <p>感谢您的支付，会员已升级，订单已确认。</p>
      <Link to="/" className="btn-primary">返回首页</Link>
    </div>
  )
}
