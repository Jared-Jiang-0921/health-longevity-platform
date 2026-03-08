import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <div className="page-content">
      <h1>支付成功</h1>
      <p>感谢您的支付，订单已确认。</p>
      <Link to="/" className="btn-primary">返回首页</Link>
    </div>
  )
}
