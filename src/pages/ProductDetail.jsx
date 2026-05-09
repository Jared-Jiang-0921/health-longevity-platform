import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById, PRODUCT_CATEGORIES, isCatalogProductId } from '../data/products'
import { getProductsEvidenceCopy } from '../data/productsEvidenceLibraryI18n'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { getUi } from '../i18n/ui'
import ProductCatalogImage from '../components/ProductCatalogImage'
import './ProductDetail.css'

function formatPriceSymbol(currency) {
  const c = String(currency || 'CNY').toUpperCase()
  if (c === 'CNY') return '¥'
  if (c === 'USD') return '$'
  if (c === 'EUR') return '€'
  return `${c} `
}

export default function ProductDetail() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const { getToken } = useAuth()
  const ev = getProductsEvidenceCopy(lang)
  const t = {
    zh: { notFound: '未找到该产品', back: '返回长寿产品证据库', pay: '去支付', origin: '产地' },
    en: { notFound: 'Product not found', back: 'Back to evidence library', pay: 'Checkout', origin: 'Origin' },
    ar: { notFound: 'المنتج غير موجود', back: 'العودة إلى مكتبة الأدلة', pay: 'الدفع', origin: 'المنشأ' },
  }[lang || 'zh']
  const { id } = useParams()
  const staticProduct = getProductById(id)
  const [catalogProduct, setCatalogProduct] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(() => Boolean(id && isCatalogProductId(id)))

  useEffect(() => {
    if (!id || !isCatalogProductId(id)) {
      setCatalogProduct(null)
      setCatalogLoading(false)
      return undefined
    }
    let cancelled = false
    setCatalogLoading(true)
    const token = getToken?.()
    ;(async () => {
      try {
        const res = await fetch(`/api/product-catalog?id=${encodeURIComponent(id)}&ts=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (res.ok && data.item) setCatalogProduct(data.item)
        else setCatalogProduct(null)
      } catch {
        if (!cancelled) setCatalogProduct(null)
      } finally {
        if (!cancelled) setCatalogLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, getToken])

  const product = catalogProduct
    ? {
        id: catalogProduct.id,
        title: catalogProduct.title,
        category: catalogProduct.category,
        price: Number(catalogProduct.price_amount),
        currency: catalogProduct.currency || 'CNY',
        desc: catalogProduct.description || '',
        unit: catalogProduct.unit || '件',
        origin: catalogProduct.origin || '',
        catalog: true,
        has_image: Boolean(catalogProduct.has_image),
      }
    : staticProduct
      ? {
          ...staticProduct,
          origin: '',
          catalog: false,
          has_image: false,
        }
      : null

  if (catalogLoading && !product) {
    return (
      <div className="page-content">
        <p>{ui.loading || '…'}</p>
      </div>
    )
  }

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

      <aside className="product-detail-notice" role="note">
        <p className="product-detail-notice-strong">{ev.roleDisclaimer}</p>
        <p><strong>{ev.cnRegTitle}：</strong>{ev.cnRegBody}</p>
        <p><strong>{ev.intlTitle}：</strong>{ev.intlBody}</p>
      </aside>

      <div className="product-detail-card">
        <div className="product-detail-visual">
          <ProductCatalogImage
            productId={product.catalog ? product.id : ''}
            hasImage={Boolean(product.catalog && product.has_image)}
            getToken={getToken}
            className="product-detail-img"
            alt={product.title}
          />
        </div>
        <div className="product-detail-header">
          <span className="product-category-tag">{category?.label}</span>
          {product.catalog ? <span className="product-badge-managed product-detail-badge">上架商品</span> : null}
          <h1>{product.title}</h1>
          <p className="product-desc">{product.desc}</p>
          {product.origin ? (
            <p className="product-detail-origin"><strong>{t.origin}：</strong>{product.origin}</p>
          ) : null}
        </div>

        <div className="product-detail-price">
          <span className="price">{formatPriceSymbol(product.currency)}{product.price}</span>
          <span className="unit">/{product.unit}</span>
        </div>

        <div className="product-detail-actions">
          <Link
            to="/payment"
            state={{
              product: {
                id: product.id,
                title: product.title,
                price: product.price,
                currency: product.currency,
              },
            }}
            className="btn-primary"
          >
            {t.pay}
          </Link>
        </div>
      </div>
    </div>
  )
}
