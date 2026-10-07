import { useState } from 'react'
import { TCM_CONSTITUTION_SOURCE, TCM_CONSTITUTIONS } from '../data/tcmConstitutions'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import { getTcmPreventionModuleCopy } from '../data/tcmPreventionModuleI18n'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import ModuleAccessHint from '../components/ModuleAccessHint'
import ModulePageHero from '../components/ModulePageHero'
import './TCMPrevention.css'

const TAB_CONSTITUTION = 'constitution'
const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

function localeText(field, lang) {
  if (!field) return ''
  if (lang === 'en' || lang === 'ar') return field[lang] || field.zh
  return field.zh
}

export default function TCMPrevention() {
  const { lang } = useLocale()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const mod = getTcmPreventionModuleCopy(lang)
  const [activeTab, setActiveTab] = useState(TAB_CONSTITUTION)

  return (
    <div className="page-tcm-prevention">
      <ModulePageHero path="/tcm-prevention" title={mod.bannerTitle}>
        <p className="module-page-hero-line">{mod.bannerLine1}</p>
        <p className="module-page-hero-line">{mod.bannerLine2}</p>
      </ModulePageHero>

      <section className="tcm-header">
        <h2 className="tcm-page-title">{mod.title}</h2>
        <p className="tcm-differentiation">{mod.differentiation}</p>
        <p className="tcm-positioning page-callout">{mod.positioning}</p>
      </section>

      <section className="tcm-toolbar" aria-label={mod.constitution}>
        <div className="tcm-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_CONSTITUTION}
            className={activeTab === TAB_CONSTITUTION ? 'active' : ''}
            onClick={() => setActiveTab(TAB_CONSTITUTION)}
          >
            {mod.constitution}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_HERBS}
            className={activeTab === TAB_HERBS ? 'active' : ''}
            onClick={() => setActiveTab(TAB_HERBS)}
          >
            {mod.herbs}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_PRESCRIPTIONS}
            className={activeTab === TAB_PRESCRIPTIONS ? 'active' : ''}
            onClick={() => setActiveTab(TAB_PRESCRIPTIONS)}
          >
            {mod.rx}
          </button>
        </div>
      </section>

      {activeTab === TAB_CONSTITUTION && (
        <section className="tcm-section" role="tabpanel">
          <div className="tcm-list-heading">
            <h2>{mod.constitutionH2}</h2>
            <p>
              {lang === 'en'
                ? `${TCM_CONSTITUTIONS.length} types`
                : lang === 'ar'
                  ? `${TCM_CONSTITUTIONS.length}`
                  : `${TCM_CONSTITUTIONS.length} 种`}
            </p>
          </div>
          <p className="tcm-constitution-lead">{mod.constitutionLead}</p>
          <p className="tcm-constitution-source">{localeText(TCM_CONSTITUTION_SOURCE, lang)}</p>
          <div className="tcm-grid tcm-grid--constitutions">
            {TCM_CONSTITUTIONS.map((item) => (
              <article
                key={item.id}
                className={`tcm-card constitution-card content-card content-card--padded${item.id === 'balanced' ? ' is-reference' : ''}`}
              >
                <h3>{localeText(item.name, lang)}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtSummary}</dt>
                    <dd>{localeText(item.summary, lang)}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSigns}</dt>
                    <dd>{localeText(item.signs, lang)}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtCare}</dt>
                    <dd>{localeText(item.care, lang)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_HERBS && (
        <section className="tcm-section">
          <div className="tcm-list-heading">
            <h2>{mod.herbsH2}</h2>
            <p>
              {lang === 'en'
                ? `${TCM_HERBS.length} herbs`
                : lang === 'ar'
                  ? `${TCM_HERBS.length}`
                  : `${TCM_HERBS.length} 味`}
            </p>
          </div>
          <div className="tcm-grid">
            {TCM_HERBS.map((herb) => (
              <article key={herb.id} className="tcm-card herb-card content-card content-card--padded">
                <h3>{herb.name}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtProperty}</dt>
                    <dd>{herb.property}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtEfficacy}</dt>
                    <dd>{herb.efficacy}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSuitableFor}</dt>
                    <dd>{herb.suitableFor}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtCaution}</dt>
                    <dd>{herb.caution}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_PRESCRIPTIONS && (
        <section className="tcm-section">
          <div className="tcm-list-heading">
            <h2>{mod.rxH2}</h2>
            <p>
              {lang === 'en'
                ? `${TCM_PRESCRIPTIONS.length} formulas`
                : lang === 'ar'
                  ? `${TCM_PRESCRIPTIONS.length}`
                  : `${TCM_PRESCRIPTIONS.length} 首`}
            </p>
          </div>
          <div className="tcm-grid">
            {TCM_PRESCRIPTIONS.map((rx) => (
              <article key={rx.id} className="tcm-card prescription-card content-card content-card--padded">
                <h3>{rx.name}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtEfficacy}</dt>
                    <dd>{rx.efficacy}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSuitableFor}</dt>
                    <dd>{rx.suitableFor}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSource}</dt>
                    <dd>{rx.source}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {isAdmin ? null : <ModuleAccessHint moduleKey="tcm-prevention" className="module-access-hint--page-end" />}
    </div>
  )
}
