import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES, PRODUCTS } from '../data/products'
import { getProductsEvidenceCopy } from '../data/productsEvidenceLibraryI18n'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { getUi } from '../i18n/ui'
import ProductCatalogImage from '../components/ProductCatalogImage'
import './Products.css'

function formatPriceSymbol(currency) {
  const c = String(currency || 'CNY').toUpperCase()
  if (c === 'CNY') return '¥'
  if (c === 'USD') return '$'
  if (c === 'EUR') return '€'
  return `${c} `
}

export default function Products() {
  const { lang } = useLocale()
  const { getToken } = useAuth()
  const ui = getUi(lang)
  const ev = getProductsEvidenceCopy(lang)
  const [activeCategory, setActiveCategory] = useState(PRODUCT_CATEGORIES[0]?.id || 'supplement')
  const [catalogItems, setCatalogItems] = useState([])

  useEffect(() => {
    const token = getToken?.()
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/product-catalog?ts=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled || !res.ok) return
        setCatalogItems(Array.isArray(data.items) ? data.items : [])
      } catch {
        if (!cancelled) setCatalogItems([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [getToken])

  const mergedForCategory = useMemo(() => {
    const fromDb = catalogItems
      .filter((row) => row.category === activeCategory)
      .map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        price: Number(row.price_amount),
        currency: row.currency || 'CNY',
        desc: row.description || '',
        unit: row.unit || '件',
        origin: row.origin || '',
        catalog: true,
        has_image: Boolean(row.has_image),
      }))
    const staticList = PRODUCTS.filter((p) => p.category === activeCategory).map((p) => ({
      ...p,
      catalog: false,
      origin: '',
      has_image: false,
    }))
    return [...fromDb, ...staticList]
  }, [catalogItems, activeCategory])

  useEffect(() => {
    const selected = PRODUCT_CATEGORIES.find((c) => c.id === activeCategory)
    window.dispatchEvent(new CustomEvent('module-category-change', {
      detail: {
        moduleKey: 'products',
        categoryId: activeCategory,
        categoryLabel: selected?.label || '',
      },
    }))
  }, [activeCategory])

  return (
    <div className="page-products">
      <section className="products-header">
        <h1>{ev.title}</h1>
        <p className="products-lead">{ev.lead}</p>
        <aside className="products-role-disclaimer" role="note">
          <p>{ev.roleDisclaimer}</p>
        </aside>
        <section className="products-reg-block" aria-labelledby="products-cn-reg">
          <h2 id="products-cn-reg" className="products-reg-heading">{ev.cnRegTitle}</h2>
          <p>{ev.cnRegBody}</p>
        </section>
        <section className="products-reg-block" aria-labelledby="products-intl-reg">
          <h2 id="products-intl-reg" className="products-reg-heading">{ev.intlTitle}</h2>
          <p>{ev.intlBody}</p>
        </section>

        <section className="products-types" aria-labelledby="products-types-heading">
          <h2 id="products-types-heading" className="products-section-heading">{ev.productTypesTitle}</h2>
          <ul className="products-types-list">
            {ev.productTypes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="products-scoring" aria-labelledby="products-scoring-heading">
          <h2 id="products-scoring-heading" className="products-section-heading">{ev.scoringTitle}</h2>
          <div className="products-table-wrap">
            <table className="products-scoring-table">
              <thead>
                <tr>
                  <th scope="col">{ev.colDimension}</th>
                  <th scope="col">{ev.colExplain}</th>
                </tr>
              </thead>
              <tbody>
                {ev.scoringRows.map((row) => (
                  <tr key={row.dimension}>
                    <td>{row.dimension}</td>
                    <td>{row.explain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="products-list-note">{ev.listFooterNote}</p>
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
          {mergedForCategory.map((product) => (
            <article key={String(product.id)} className="product-card">
              <div className="product-card-visual">
                <ProductCatalogImage
                  productId={product.catalog ? product.id : ''}
                  hasImage={Boolean(product.catalog && product.has_image)}
                  getToken={getToken}
                  className="product-card-img"
                  alt={product.title}
                />
              </div>
              <div className="product-info">
                <span className="product-category">
                  {PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.label}
                  {product.catalog ? <span className="product-badge-managed"> 上架</span> : null}
                </span>
                <h3>{product.title}</h3>
                <p>{product.desc}</p>
                {product.origin ? (
                  <p className="product-origin"><span className="product-origin-label">产地</span>{product.origin}</p>
                ) : null}
              </div>
              <div className="product-footer">
                <span className="product-price">
                  {formatPriceSymbol(product.currency)}{product.price}
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
