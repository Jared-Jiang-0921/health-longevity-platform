import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getMembershipLevelLabel } from '../i18n/terms'
import HomeAtmosphere from '../components/HomeAtmosphere'
import {
  HOME_MODULES,
  HOME_STATS,
  HOME_TODAY_FRONTIER,
  HOME_HOT_EVIDENCE,
  getHomeCopy,
} from '../data/homePageContent'
import {
  getModuleVisualByPath,
  getModuleVisualAlt,
  getVisualAssetUrl,
  getVisualAlt,
} from '../data/visualAssets'
import './Home.css'

function EvidenceChip({ grade }) {
  return <span className="home-chip home-chip--evidence">证据 {grade}</span>
}

export default function Home() {
  const { lang } = useLocale()
  const copy = getHomeCopy(lang)
  const { user } = useAuth()

  const primaryTo = user ? '/solutions' : '/login'
  const primaryState = user ? undefined : { from: { pathname: '/solutions' } }

  return (
    <div className="page-home">
      {/* Hero */}
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <HomeAtmosphere />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1 id="home-hero-heading">{copy.heroH1}</h1>
            <p className="home-hero-sub">{copy.heroSub}</p>
            <div className="home-hero-actions">
              <Link to={primaryTo} state={primaryState} className="home-btn home-btn--primary">
                {copy.ctaPrimary}
              </Link>
              <Link to="/products" className="home-btn home-btn--secondary">
                {copy.ctaSecondary}
              </Link>
            </div>
            {user ? (
              <p className="home-hero-user">
                {copy.welcome}，{user.name}（{getMembershipLevelLabel(user.level, lang)}）
              </p>
            ) : null}
          </div>
          <figure className="home-hero-visual">
            <img
              src={getVisualAssetUrl('heroCockpit')}
              alt={getVisualAlt('heroCockpit', lang)}
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              className="home-hero-visual-img"
            />
            <figcaption className="home-hero-visual-caption">
              {lang === 'en' ? 'Digital health twin · Live metrics' : '数字健康孪生 · 实时指标'}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Modules */}
      <section className="home-modules" aria-labelledby="home-modules-heading">
        <header className="home-section-header">
          <h2 id="home-modules-heading">{copy.modulesTitle}</h2>
          <p>{copy.modulesLead}</p>
        </header>
        <div className="home-module-grid">
          {HOME_MODULES.map((mod) => {
            const title = mod.title[lang] || mod.title.zh
            const desc = mod.desc[lang] || mod.desc.zh
            const chips = mod.chips[lang] || mod.chips.zh
            const disclaimer = mod.disclaimer?.[lang] || mod.disclaimer?.zh
            const coverSrc = getModuleVisualByPath(mod.path)
            const coverAlt = getModuleVisualAlt(mod.path, lang)
            return (
              <article
                key={mod.path}
                className={`home-module-card${mod.muted ? ' home-module-card--muted' : ''}${mod.accent ? ' home-module-card--tcm' : ''}`}
              >
                <div className="home-module-cover">
                  <img
                    src={coverSrc}
                    alt={coverAlt}
                    loading="lazy"
                    decoding="async"
                    className="home-module-cover-img"
                  />
                  <div className="home-module-cover-shade" aria-hidden="true" />
                </div>
                <div className="home-module-body">
                  <h3>{title}</h3>
                  <p className="home-module-desc">{desc}</p>
                  <ul className="home-module-chips">
                    {chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                  {disclaimer ? (
                    <p className="home-module-disclaimer">{disclaimer}</p>
                  ) : null}
                  <Link to={mod.path} className="home-btn home-btn--card">
                    {copy.moduleEnter}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Today updates */}
      <section className="home-today" aria-labelledby="home-today-heading">
        <header className="home-section-header">
          <h2 id="home-today-heading">{copy.todayTitle}</h2>
          <p className="home-curated-note">{copy.todayCurated}</p>
        </header>
        <div className="home-today-grid">
          <div className="home-today-col">
            <h3>{copy.todayFrontier}</h3>
            <ul className="home-today-list">
              {HOME_TODAY_FRONTIER.map((item) => (
                <li key={item.id} className="home-today-item">
                  <div className="home-today-item-head">
                    <Link to="/longevity-news" className="home-today-link">
                      {item.title}
                    </Link>
                    <EvidenceChip grade={item.evidence} />
                  </div>
                  <span className="home-today-source">{item.source}</span>
                  <p>{item.summary}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="home-today-col">
            <h3>{copy.todayHot}</h3>
            <ul className="home-today-list">
              {HOME_HOT_EVIDENCE.map((item) => (
                <li key={item.id} className="home-today-item">
                  <div className="home-today-item-head">
                    <Link to="/products" className="home-today-link">
                      {item.name}
                    </Link>
                    <EvidenceChip grade={item.evidence} />
                  </div>
                  <p className="home-today-meta">
                    <span>适用：{item.audience}</span>
                  </p>
                  <p className="home-today-risk">
                    <span className="home-today-risk-label">注意</span>
                    {item.risk}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="home-steps" aria-labelledby="home-steps-heading">
        <h2 id="home-steps-heading" className="home-section-title">
          {copy.stepsTitle}
        </h2>
        <ol className="home-steps-list">
          {copy.steps.map((step, i) => (
            <li key={step.title} className="home-step-card">
              <span className="home-step-num">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="home-steps-note">{copy.stepNote}</p>
        <Link to={primaryTo} state={primaryState} className="home-btn home-btn--primary home-steps-cta">
          {copy.ctaPrimary}
        </Link>
      </section>

      {/* Trust */}
      <section className="home-trust" aria-labelledby="home-trust-heading">
        <h2 id="home-trust-heading" className="home-section-title home-section-title--compact">
          {copy.trustTitle}
        </h2>
        <div className="home-trust-grid">
          <article className="home-trust-card">
            <h3>{copy.trustEvidence}</h3>
            <p>{copy.trustEvidenceDesc}</p>
          </article>
          <article className="home-trust-card">
            <h3>{copy.trustAudience}</h3>
            <p>{copy.trustAudienceDesc}</p>
          </article>
          <article className="home-trust-card">
            <h3>{copy.trustRisk}</h3>
            <p>{copy.trustRiskDesc}</p>
          </article>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats" aria-labelledby="home-stats-heading">
        <header className="home-section-header">
          <h2 id="home-stats-heading">{copy.statsTitle}</h2>
          <p>{copy.statsLead}</p>
        </header>
        <div className="home-stats-grid">
          {HOME_STATS.map((stat) => (
            <article key={stat.id} className="home-stat-card">
              <p className="home-stat-value">{stat.value}</p>
              <p className="home-stat-label">{stat.label[lang] || stat.label.zh}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
