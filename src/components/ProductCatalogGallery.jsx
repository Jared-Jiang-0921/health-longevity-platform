import { useState } from 'react'
import './ProductCatalogGallery.css'

export default function ProductCatalogGallery({ productId, galleryCount, altBase = '' }) {
  const count = Number(galleryCount || 0)
  const [slot, setSlot] = useState(0)
  if (!productId || count <= 0) return null

  const mainSrc = `/api/product-catalog/${encodeURIComponent(productId)}?slot=${slot}`

  return (
    <div className="product-catalog-gallery">
      <div className="product-catalog-gallery-main">
        <img src={mainSrc} alt={`${altBase} ${slot + 1}/${count}`} loading="lazy" decoding="async" />
      </div>
      {count > 1 ? (
        <div className="product-catalog-gallery-thumbs" role="tablist" aria-label="商品图集">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={slot === i}
              className={slot === i ? 'active' : ''}
              onClick={() => setSlot(i)}
            >
              <img
                src={`/api/product-catalog/${encodeURIComponent(productId)}?slot=${i}`}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
