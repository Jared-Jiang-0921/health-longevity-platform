/** 公开图片 URL，无需 JWT（全员可读策略） */
export default function ProductCatalogImage({
  productId,
  galleryCount,
  slot = 0,
  className,
  alt = '',
}) {
  const count = Number(galleryCount || 0)
  const has = Boolean(productId && count > 0 && slot >= 0 && slot < count)
  if (!has) {
    return <div className={className ? `${className} product-catalog-image-ph` : 'product-catalog-image-ph'} aria-hidden />
  }
  const src = `/api/product-catalog/${encodeURIComponent(productId)}?slot=${slot}`
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
}
