import { useLocale } from '../context/LocaleContext'
import VisualImage from './VisualImage'
import { getModuleVisualAlt, getModuleVisualSourcesByPath } from '../data/visualAssets'
import './ModulePageHero.css'

/**
 * 模块内页顶部：与首页模块封面同一张图，轻模糊铺底，标题叠在上端。
 * @param {{ path: string, title: string, children?: import('react').ReactNode }} props
 */
export default function ModulePageHero({ path, title, children }) {
  const { lang } = useLocale()
  const sources = getModuleVisualSourcesByPath(path)
  const alt = getModuleVisualAlt(path, lang)
  if (!sources?.fallback) return null

  return (
    <section className="module-page-hero" aria-labelledby="module-page-hero-title">
      <VisualImage
        pictureClassName="module-page-hero-media"
        className="module-page-hero-img"
        sources={sources}
        alt=""
        decoding="async"
      />
      <div className="module-page-hero-overlay" aria-hidden="true" />
      <div className="module-page-hero-content">
        <h1 id="module-page-hero-title">{title}</h1>
        {children}
      </div>
      {alt ? <span className="visually-hidden">{alt}</span> : null}
    </section>
  )
}
