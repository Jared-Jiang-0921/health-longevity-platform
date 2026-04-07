import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES, PRODUCTS } from '../data/products'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import './Products.css'

export default function Products() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { title: '循证健康产品', desc: '精选循证健康产品与用品，支持跳转至支付结算。' },
    en: { title: 'Evidence-Based Products', desc: 'Selected evidence-based health products with checkout support.' },
    ar: { title: 'منتجات مبنية على الدليل', desc: 'منتجات صحية مختارة قائمة على الدليل مع دعم الدفع.' },
  }[lang || 'zh']
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <div className="page-products">
      <section className="products-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </section>

      <section className="categories">
        <div className="category-tabs">
          {PRODUCT_CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              className={activeCategory === id ? 'active' : ''}
              onClick={() => setActiveCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="product-list">
        <div className="product-grid">
          {filtered.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-info">
                <span className="product-category">
                  {PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.label}
                </span>
                <h3>{product.title}</h3>
                <p>{product.desc}</p>
              </div>
              <div className="product-footer">
                <span className="product-price">
                  ¥{product.price}
                  <small>/{product.unit}</small>
                </span>
                <Link to={`/products/${product.id}`} className="btn-detail">
                  {ui.details}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
