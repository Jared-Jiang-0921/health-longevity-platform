import { Link, useParams } from 'react-router-dom'
import { getProductById, PRODUCT_CATEGORIES } from '../data/products'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import './ProductDetail.css'

export default function ProductDetail() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { notFound: '未找到该产品', back: '返回产品列表', pay: '去支付' },
    en: { notFound: 'Product not found', back: 'Back to products', pay: 'Checkout' },
    ar: { notFound: 'المنتج غير موجود', back: 'العودة للمنتجات', pay: 'الدفع' },
  }[lang || 'zh']
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="page-content">
        <p>{t.notFound || ui.notFound}</p>
        <Link to="/products">{t.back}</Link>
      </div>
    )
  }

  const category = PRODUCT_CATEGORIES.find((c) => c.id === product.category)

  return (
    <div className="page-product-detail">
      <Link to="/products" className="back-link">← {t.back}</Link>

      <div className="product-detail-card">
        <div className="product-detail-header">
          <span className="product-category-tag">{category?.label}</span>
          <h1>{product.title}</h1>
          <p className="product-desc">{product.desc}</p>
        </div>

        <div className="product-detail-price">
          <span className="price">¥{product.price}</span>
          <span className="unit">/{product.unit}</span>
        </div>

        <div className="product-detail-actions">
          <Link
            to="/payment"
            state={{ product: { id: product.id, title: product.title, price: product.price, currency: product.currency } }}
            className="btn-primary"
          >
            {t.pay}
          </Link>
        </div>
      </div>
    </div>
  )
}
