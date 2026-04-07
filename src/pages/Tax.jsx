import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import './Tax.css'

export default function Tax() {
  const { lang } = useLocale()
  const t = {
    zh: { title: '税费缴纳', sub: '跨境消费相关税费说明与缴纳入口。', intro: '说明', introText: '在平台购买健康产品、课程或服务时，根据您所在国家/地区可能涉及增值税（VAT）、商品及服务税（GST）或关税等。结算页将按收货地显示含税价，您可在支付环节一并完成税费缴纳。', action: '缴纳入口', actionText: '请先完成订单或选择需缴费项，在支付结算页会显示应缴税额并支持一并支付。', go: '前往支付结算' },
    en: { title: 'Tax & Duties', sub: 'Cross-border tax explanation and payment entry.', intro: 'Overview', introText: 'When purchasing products, courses, or services, VAT/GST/custom duties may apply based on your country or region.', action: 'Payment Entry', actionText: 'Complete the order and pay the displayed tax amount during checkout.', go: 'Go to Checkout' },
    ar: { title: 'الضرائب والرسوم', sub: 'شرح الضرائب للمدفوعات العابرة للحدود.', intro: 'توضيح', introText: 'عند شراء منتجات أو دورات أو خدمات، قد تنطبق ضريبة القيمة المضافة/ضريبة السلع والخدمات/الرسوم الجمركية حسب بلدك.', action: 'بوابة السداد', actionText: 'أكمل الطلب وسيظهر مبلغ الضريبة أثناء الدفع ويمكن سداده مباشرة.', go: 'الانتقال إلى الدفع' },
  }[lang || 'zh']
  return (
    <div className="page-tax">
      <h1>{t.title}</h1>
      <p className="subtitle">{t.sub}</p>

      <section className="tax-intro">
        <h2>{t.intro}</h2>
        <p>{t.introText}</p>
      </section>

      <section className="tax-actions">
        <h2>{t.action}</h2>
        <p>{t.actionText}</p>
        <Link to="/payment" className="btn-primary">{t.go}</Link>
      </section>
    </div>
  )
}
