import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES, PRODUCTS } from '../data/products'
import { getProductsEvidenceCopy } from '../data/productsEvidenceLibraryI18n'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { shouldShowMembershipBadge } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { getUi } from '../i18n/ui'
import '../styles/membership-badge.css'
import { pickCatalogLocale } from '../lib/productCatalogLocale'
import ProductCatalogImage from '../components/ProductCatalogImage'
import ModuleAccessHint from '../components/ModuleAccessHint'
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
  const { user, getToken } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const ui = getUi(lang)
  const ev = getProductsEvidenceCopy(lang)
  const originLabel = { zh: '产地', en: 'Origin', ar: 'المنشأ' }[lang] || '产地'

  const [activeCategory, setActiveCategory] = useState(PRODUCT_CATEGORIES[0]?.id || 'supplement')
  const [catalogItems, setCatalogItems] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const headers = {}
        const token = getToken?.()
        if (token) headers.Authorization = `Bearer ${token}`
        const res = await fetch(`/api/product-catalog?ts=${Date.now()}`, {
          cache: 'no-store',
          headers,
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
      .map((row) => {
        const loc = pickCatalogLocale(row, lang)
        return {
          id: row.id,
          title: loc.title,
          category: row.category,
          price: Number(row.price_amount),
          currency: row.currency || 'CNY',
          desc: loc.desc,
          unit: row.unit || '件',
          origin: loc.origin,
          catalog: true,
          gallery_count: row.gallery_count || 0,
          skus: row.skus || [],
          can_view: row.can_view !== false,
          required_level: row.required_level,
          content_level: row.content_level,
        }
      })
    const staticList = isAdmin
      ? PRODUCTS.filter((p) => p.category === activeCategory).map((p) => ({
          ...p,
          title: p.title,
          desc: p.desc,
          origin: '',
          catalog: false,
          gallery_count: 0,
          skus: [],
        }))
      : []
    return [...fromDb, ...staticList]
  }, [catalogItems, activeCategory, lang, isAdmin])

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
        <aside className="products-role-disclaimer page-callout page-callout--warn" role="note">
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

        {isAdmin ? (
          <>
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
          </>
        ) : (
          <ModuleAccessHint moduleKey="products" />
        )}
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
        <div className="product-grid content-card-grid">
          {mergedForCategory.map((product) => {
            const canView = product.can_view !== false
            const showBadge = shouldShowMembershipBadge(product.required_level)
            const badgeLevel = product.content_level || product.required_level
            return (
            <article key={String(product.id)} className="product-card content-card">
              <div className="product-card-visual">
                {canView ? (
                  <ProductCatalogImage
                    productId={product.catalog ? product.id : ''}
                    galleryCount={product.gallery_count}
                    slot={0}
                    className="product-card-img"
                    alt={product.title}
                  />
                ) : (
                  <div className="product-card-img product-card-img-locked" aria-hidden="true" />
                )}
              </div>
              <div className="product-info">
                <span className="product-category">
                  {PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.label}
                  {product.catalog ? <span className="product-badge-managed"> 上架</span> : null}
                  {showBadge ? (
                    <span className={`membership-badge membership-${badgeLevel}`}>
                      {getMembershipLevelLabel(badgeLevel, lang)}
                    </span>
                  ) : null}
                </span>
                <h3>{product.title}</h3>
                {canView ? (
                  <>
                    <p>{product.desc}</p>
                    {product.skus?.length ? (
                      <p className="product-sku-hint">{product.skus.length} SKU</p>
                    ) : null}
                    {product.origin ? (
                      <p className="product-origin"><span className="product-origin-label">{originLabel}</span>{product.origin}</p>
                    ) : null}
                  </>
                ) : null}
              </div>
              <div className="product-footer">
                {canView ? (
                  <span className="product-price">
                    {formatPriceSymbol(product.currency)}{product.price}
                    <small>/{product.unit}</small>
                  </span>
                ) : (
                  <span className="product-price product-price-locked">—</span>
                )}
                <Link to={`/products/${product.id}`} className="btn-detail">
                  {ui.details}
                </Link>
              </div>
            </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
