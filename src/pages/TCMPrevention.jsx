import { useState } from 'react'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import { getTcmPreventionModuleCopy } from '../data/tcmPreventionModuleI18n'
import { useLocale } from '../context/LocaleContext'
import './TCMPrevention.css'

const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

export default function TCMPrevention() {
  const { lang } = useLocale()
  const mod = getTcmPreventionModuleCopy(lang)
  const [activeTab, setActiveTab] = useState(TAB_HERBS)

  return (
    <div className="page-tcm-prevention">
      <section className="tcm-header">
        <h1>{mod.title}</h1>
        <p className="tcm-differentiation">{mod.differentiation}</p>
        <p className="tcm-positioning">{mod.positioning}</p>

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
          <div className="tcm-list">
            {TCM_HERBS.map((herb) => (
              <article key={herb.id} className="tcm-card herb-card">
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
          <div className="tcm-list">
            {TCM_PRESCRIPTIONS.map((rx) => (
              <article key={rx.id} className="tcm-card prescription-card">
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
