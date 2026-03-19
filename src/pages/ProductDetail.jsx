import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getProductById, PRODUCT_CATEGORIES } from '../data/products'
import './ProductDetail.css'

export default function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="page-content">
        <p>{t('products.notFound')}</p>
        <Link to="/products">{t('products.backToList')}</Link>
      </div>
    )
  }

  const category = PRODUCT_CATEGORIES.find((c) => c.id === product.category)
  const title = t('products.' + product.id + '.title', { defaultValue: product.title })
  const desc = t('products.' + product.id + '.desc', { defaultValue: product.desc })

  return (
    <div className="page-product-detail">
      <Link to="/products" className="back-link">← {t('products.backToList')}</Link>

      <div className="product-detail-card">
        <div className="product-detail-header">
          <span className="product-category-tag">{category ? t('products.' + product.category) : ''}</span>
          <h1>{title}</h1>
          <p className="product-desc">{desc}</p>
        </div>

        <div className="product-detail-price">
          <span className="price">¥{product.price}</span>
          <span className="unit">/{product.unit}</span>
        </div>

        <div className="product-detail-actions">
          <Link
            to="/payment"
            state={{ product: { id: product.id, title, price: product.price, currency: product.currency } }}
            className="btn-primary"
          >
            {t('products.goPayment')}
          </Link>
        </div>
      </div>
    </div>
  )
}
