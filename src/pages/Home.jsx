import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getMembershipLevelLabel } from '../i18n/terms'
import {
  HOME_MODULES,
  HOME_TODAY_FRONTIER,
  HOME_HOT_EVIDENCE,
  getHomeCopy,
} from '../data/homePageContent'
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
          <aside className="home-demo-card" aria-label={copy.demoLabel}>
            <span className="home-demo-badge">{copy.demoLabel}</span>
            <div className="home-demo-block">
              <h3>{copy.demoRisk}</h3>
              <p>{copy.demoRiskVal}</p>
            </div>
            <div className="home-demo-block">
              <h3>{copy.demoAdvice}</h3>
              <p>{copy.demoAdviceVal}</p>
            </div>
            <div className="home-demo-tags">
              <span className="home-chip home-chip--evidence">证据 B</span>
              <span className="home-chip home-chip--audience">一般成人</span>
              <span className="home-chip home-chip--warn">需个体化</span>
            </div>
          </aside>
        </div>
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
            return (
              <article
                key={mod.path}
                className={`home-module-card${mod.muted ? ' home-module-card--muted' : ''}${mod.accent ? ' home-module-card--tcm' : ''}`}
              >
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
                  <p className="home-today-risk">⚠ {item.risk}</p>
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
    </div>
  )
}
