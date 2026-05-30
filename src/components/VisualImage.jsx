/**
 * 视觉图：优先 WebP，PNG fallback；Image2 CDN 时单 URL
 */
export default function VisualImage({
  sources,
  alt = '',
  className,
  pictureClassName,
  loading,
  decoding = 'async',
  width,
  height,
  ...rest
}) {
  if (!sources?.fallback) return null

  const imgProps = {
    alt,
    className,
    loading,
    decoding,
    width,
    height,
    ...rest,
  }

  if (sources.isCdn || !sources.webp) {
    return <img src={sources.fallback} {...imgProps} />
  }

  return (
    <picture className={pictureClassName}>
      <source srcSet={sources.webp} type="image/webp" />
      <img src={sources.fallback} {...imgProps} />
    </picture>
  )
}
