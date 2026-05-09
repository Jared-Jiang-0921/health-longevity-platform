import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById, PRODUCT_CATEGORIES, isCatalogProductId } from '../data/products'
import { getProductsEvidenceCopy } from '../data/productsEvidenceLibraryI18n'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { getUi } from '../i18n/ui'
import { pickCatalogLocale, pickSkuLocale } from '../lib/productCatalogLocale'
import ProductCatalogGallery from '../components/ProductCatalogGallery'
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
    zh: {
      notFound: '未找到该产品',
      back: '返回长寿产品证据库',
      pay: '去支付',
      origin: '产地',
      sku: '规格与 SKU',
      code: '编码',
      spec: '规格',
      price: '价格',
    },
    en: {
      notFound: 'Product not found',
      back: 'Back to evidence library',
      pay: 'Checkout',
      origin: 'Origin',
      sku: 'SKUs',
      code: 'Code',
      spec: 'Spec',
      price: 'Price',
    },
    ar: {
      notFound: 'المنتج غير موجود',
      back: 'العودة إلى مكتبة الأدلة',
      pay: 'الدفع',
      origin: 'المنشأ',
      sku: 'المواصفات',
      code: 'الرمز',
      spec: 'المواصفات',
      price: 'السعر',
    },
  }[lang || 'zh']
  const { id } = useParams()
  const staticProduct = getProductById(id)
  const [catalogRow, setCatalogRow] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(() => Boolean(id && isCatalogProductId(id)))

  useEffect(() => {
    if (!id || !isCatalogProductId(id)) {
      setCatalogRow(null)
      setCatalogLoading(false)
      return undefined
    }
    let cancelled = false
    setCatalogLoading(true)
    const headers = {}
    const token = getToken?.()
    if (token) headers.Authorization = `Bearer ${token}`
    ;(async () => {
      try {
        const res = await fetch(`/api/product-catalog?id=${encodeURIComponent(id)}&ts=${Date.now()}`, {
          cache: 'no-store',
          headers,
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (res.ok && data.item) setCatalogRow(data.item)
        else setCatalogRow(null)
      } catch {
        if (!cancelled) setCatalogRow(null)
      } finally {
        if (!cancelled) setCatalogLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, getToken])

  const product = catalogRow
    ? (() => {
        const loc = pickCatalogLocale(catalogRow, lang)
        return {
          id: catalogRow.id,
          title: loc.title,
          category: catalogRow.category,
          price: Number(catalogRow.price_amount),
          currency: catalogRow.currency || 'CNY',
          desc: loc.desc,
          unit: catalogRow.unit || '件',
          origin: loc.origin,
          catalog: true,
          gallery_count: catalogRow.gallery_count || 0,
          skus: catalogRow.skus || [],
        }
      })()
    : staticProduct
      ? {
          ...staticProduct,
          title: staticProduct.title,
          desc: staticProduct.desc,
          origin: '',
          catalog: false,
          gallery_count: 0,
          skus: [],
        }
      : null

  if (catalogLoading && !product) {
    return (
      <div className="page-content">
        <p>{ui.loading}</p>
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
        {product.catalog && product.gallery_count > 0 ? (
          <ProductCatalogGallery
            productId={product.id}
            galleryCount={product.gallery_count}
            altBase={product.title}
          />
        ) : null}

        <div className="product-detail-header">
          <span className="product-category-tag">{category?.label}</span>
          {product.catalog ? <span className="product-badge-managed product-detail-badge">上架商品</span> : null}
          <h1>{product.title}</h1>
          <p className="product-desc">{product.desc}</p>
          {product.origin ? (
            <p className="product-detail-origin"><strong>{t.origin}：</strong>{product.origin}</p>
          ) : null}
        </div>

        {product.skus?.length ? (
          <div className="product-detail-skus">
            <h2 className="product-detail-skus-title">{t.sku}</h2>
            <div className="product-detail-table-wrap">
              <table className="product-detail-sku-table">
                <thead>
                  <tr>
                    <th>{t.code}</th>
                    <th>{t.spec}</th>
                    <th>{t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.skus.map((sku, i) => (
                    <tr key={`${sku.code}-${i}`}>
                      <td>{sku.code || '—'}</td>
                      <td>{pickSkuLocale(sku, lang) || '—'}</td>
                      <td>
                        {sku.price != null && Number.isFinite(Number(sku.price))
                          ? `${formatPriceSymbol(sku.currency || product.currency)}${sku.price}`
                          : (lang === 'zh' ? '同基础价' : 'Base')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="product-detail-price">
          <span className="price">{formatPriceSymbol(product.currency)}{product.price}</span>
          <span className="unit">/{product.unit}</span>
          {product.skus?.length ? (
            <span className="product-detail-base-note">{lang === 'zh' ? '（基础标价；SKU 可能有单独定价）' : '(Base price; SKU may override)'}</span>
          ) : null}
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
