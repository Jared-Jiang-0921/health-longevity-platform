import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PRODUCT_CATEGORIES, PRODUCTS } from '../data/products'
import './Products.css'

export default function Products() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <div className="page-products">
      <section className="products-header">
        <h1>{t('products.title')}</h1>
        <p>{t('products.subtitle')}</p>
      </section>

      <section className="categories">
        <div className="category-tabs">
          {PRODUCT_CATEGORIES.map(({ id }) => (
            <button
              key={id}
              className={activeCategory === id ? 'active' : ''}
              onClick={() => setActiveCategory(id)}
            >
              {t(`products.${id}`)}
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
                  {t(`products.${product.category}`)}
                </span>
                <h3>{t('products.' + product.id + '.title', { defaultValue: product.title })}</h3>
                <p>{t('products.' + product.id + '.desc', { defaultValue: product.desc })}</p>
              </div>
              <div className="product-footer">
                <span className="product-price">
                  ¥{product.price}
                  <small>/{product.unit}</small>
                </span>
                <Link to={`/products/${product.id}`} className="btn-detail">
                  {t('products.viewDetail')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
