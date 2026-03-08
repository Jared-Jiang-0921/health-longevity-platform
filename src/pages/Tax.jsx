import { Link } from 'react-router-dom'
import './Tax.css'

export default function Tax() {
  return (
    <div className="page-tax">
      <h1>税费缴纳</h1>
      <p className="subtitle">跨境消费相关税费说明与缴纳入口。</p>

      <section className="tax-intro">
        <h2>说明</h2>
        <p>在平台购买健康产品、课程或服务时，根据您所在国家/地区可能涉及增值税（VAT）、商品及服务税（GST）或关税等。结算页将按收货地显示含税价，您可在支付环节一并完成税费缴纳。</p>
      </section>

      <section className="tax-actions">
        <h2>缴纳入口</h2>
        <p>请先完成订单或选择需缴费项，在支付结算页会显示应缴税额并支持一并支付。</p>
        <Link to="/payment" className="btn-primary">前往支付结算</Link>
      </section>
    </div>
  )
}
