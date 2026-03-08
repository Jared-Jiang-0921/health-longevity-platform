import { Link, useParams } from 'react-router-dom'
import { getProductById, PRODUCT_CATEGORIES } from '../data/products'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="page-content">
        <p>未找到该产品</p>
        <Link to="/products">返回产品列表</Link>
      </div>
    )
  }

  const category = PRODUCT_CATEGORIES.find((c) => c.id === product.category)

  return (
    <div className="page-product-detail">
      <Link to="/products" className="back-link">← 返回产品列表</Link>

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
            去支付
          </Link>
        </div>
      </div>
    </div>
  )
}
