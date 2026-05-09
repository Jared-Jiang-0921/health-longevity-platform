import { useEffect, useRef, useState } from 'react'

/** 带 Authorization 拉取商品主图，避免 <img src> 无法带 JWT */
export default function ProductCatalogImage({ productId, hasImage, getToken, className, alt = '' }) {
  const [src, setSrc] = useState(null)
  const urlRef = useRef('')

  useEffect(() => {
    if (!productId || !hasImage) {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = ''
      }
      setSrc(null)
      return undefined
    }
    let cancelled = false

    ;(async () => {
      try {
        const token = getToken?.()
        const res = await fetch(`/api/product-catalog/${productId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (cancelled || !res.ok) return
        const blob = await res.blob()
        if (cancelled) return
        const u = URL.createObjectURL(blob)
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        urlRef.current = u
        setSrc(u)
      } catch {
        if (!cancelled) {
          if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current)
            urlRef.current = ''
          }
          setSrc(null)
        }
      }
    })()

    return () => {
      cancelled = true
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = ''
      }
      setSrc(null)
    }
  }, [productId, hasImage, getToken])

  if (!hasImage) {
    return <div className={className ? `${className} product-catalog-image-ph` : 'product-catalog-image-ph'} aria-hidden />
  }
  if (!src) {
    return <div className={className ? `${className} product-catalog-image-ph` : 'product-catalog-image-ph'} aria-hidden />
  }
  return <img src={src} alt={alt} className={className} />
}
