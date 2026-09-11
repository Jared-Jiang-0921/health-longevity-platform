import { getLongevityNewsModuleCopy } from '../data/longevityNewsModuleI18n'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
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

      <LongevityNewsFeed />

      {isAdmin ? null : <ModuleAccessHint moduleKey="longevity-news" className="module-access-hint--page-end" />}
    </div>
  )
}
