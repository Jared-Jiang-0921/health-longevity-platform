import { useState } from 'react'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import { getTcmPreventionModuleCopy } from '../data/tcmPreventionModuleI18n'
import VisualImage from '../components/VisualImage'
import { getVisualAssetSources, getVisualAlt } from '../data/visualAssets'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import ModuleAccessHint from '../components/ModuleAccessHint'
import './TCMPrevention.css'

const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

export default function TCMPrevention() {
  const { lang } = useLocale()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const mod = getTcmPreventionModuleCopy(lang)
  const [activeTab, setActiveTab] = useState(TAB_HERBS)

  return (
    <div className="page-tcm-prevention">
      <section className="tcm-hero-banner" aria-labelledby="tcm-banner-title">
        <VisualImage
          pictureClassName="tcm-hero-banner-bg"
          className="tcm-hero-banner-bg"
          sources={getVisualAssetSources('bannerTcmPrevention')}
          alt=""
          decoding="async"
        />
        <div className="tcm-hero-banner-overlay" aria-hidden="true" />
        <div className="tcm-hero-banner-content">
          <h1 id="tcm-banner-title">{mod.bannerTitle}</h1>
          <p className="tcm-hero-banner-line">{mod.bannerLine1}</p>
          <p className="tcm-hero-banner-line">{mod.bannerLine2}</p>
        </div>
        <span className="visually-hidden">{getVisualAlt('bannerTcmPrevention', lang)}</span>
      </section>

      <section className="tcm-header">
        <h2 className="tcm-page-title">{mod.title}</h2>
        <p className="tcm-differentiation">{mod.differentiation}</p>
        <p className="tcm-positioning page-callout">{mod.positioning}</p>

        {isAdmin ? (
          <>
            <section className="tcm-columns" aria-labelledby="tcm-columns-heading">
              <h2 id="tcm-columns-heading" className="tcm-section-title">{mod.columnsTitle}</h2>
              <div className="tcm-table-wrap">
                <table className="tcm-columns-table">
                  <thead>
                    <tr>
                      <th scope="col">{mod.colModule}</th>
                      <th scope="col">{mod.colContent}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.columnRows.map((row) => (
                      <tr key={row.module}>
                        <td>{row.module}</td>
                        <td>{row.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="tcm-bridge">{mod.bridgeTabs}</p>
          </>
        ) : (
          <ModuleAccessHint moduleKey="tcm-prevention" />
        )}
      </section>

      <div className="tcm-tabs">
        <button
          type="button"
          className={activeTab === TAB_HERBS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_HERBS)}
        >
          {mod.herbs}
        </button>
        <button
          type="button"
          className={activeTab === TAB_PRESCRIPTIONS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_PRESCRIPTIONS)}
        >
          {mod.rx}
        </button>
      </div>

      {activeTab === TAB_HERBS && (
        <section className="tcm-section">
          <h2>{mod.herbsH2}</h2>
          <div className="tcm-list content-card-stack">
            {TCM_HERBS.map((herb) => (
              <article key={herb.id} className="tcm-card herb-card content-card content-card--padded">
                <h3>{herb.name}</h3>
                <dl>
                  <dt>{mod.dtProperty}</dt>
                  <dd>{herb.property}</dd>
                  <dt>{mod.dtEfficacy}</dt>
                  <dd>{herb.efficacy}</dd>
                  <dt>{mod.dtSuitableFor}</dt>
                  <dd>{herb.suitableFor}</dd>
                  <dt>{mod.dtCaution}</dt>
                  <dd>{herb.caution}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_PRESCRIPTIONS && (
        <section className="tcm-section">
          <h2>{mod.rxH2}</h2>
          <div className="tcm-list content-card-stack">
            {TCM_PRESCRIPTIONS.map((rx) => (
              <article key={rx.id} className="tcm-card prescription-card content-card content-card--padded">
                <h3>{rx.name}</h3>
                <dl>
                  <dt>{mod.dtEfficacy}</dt>
                  <dd>{rx.efficacy}</dd>
                  <dt>{mod.dtSuitableFor}</dt>
                  <dd>{rx.suitableFor}</dd>
                  <dt>{mod.dtSource}</dt>
                  <dd>{rx.source}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
