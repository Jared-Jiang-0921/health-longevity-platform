import { Link } from 'react-router-dom'
import { getLongevityNewsModuleCopy } from '../data/longevityNewsModuleI18n'
import { getFaqHeading, getPageFaqs } from '../data/publicSummary'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import IngredientEvidenceLinks from '../components/IngredientEvidenceLinks'
import LongevityNewsFeed from '../components/LongevityNewsFeed'
import ModuleAccessHint from '../components/ModuleAccessHint'
import ModulePageHero from '../components/ModulePageHero'
import './LongevityNews.css'

export default function LongevityNews() {
  const { lang } = useLocale()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const mod = getLongevityNewsModuleCopy(lang)

  return (
    <div className="page-longevity-news">
      <ModulePageHero path="/longevity-news" title={mod.title}>
        <p className="module-page-hero-line">{mod.lead}</p>
      </ModulePageHero>

      <IngredientEvidenceLinks lang={lang} />
      <p>
        <Link to="/methodology">{lang === 'en' ? 'How evidence is checked' : '证据核对说明'}</Link>
      </p>

      <section className="ln-public-faq" aria-labelledby="ln-faq-heading">
        <h2 id="ln-faq-heading">{getFaqHeading(lang)}</h2>
        {getPageFaqs('/longevity-news', lang).map((item) => (
          <article key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </section>

      <LongevityNewsFeed />

      {isAdmin ? null : <ModuleAccessHint moduleKey="longevity-news" className="module-access-hint--page-end" />}
    </div>
  )
}
