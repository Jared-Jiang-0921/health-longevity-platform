import { useState } from 'react'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import './TCMPrevention.css'

const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

export default function TCMPrevention() {
  const [activeTab, setActiveTab] = useState(TAB_HERBS)

  return (
    <div className="page-tcm-prevention">
      <section className="tcm-header">
        <h1>中医药特色 · 治未病</h1>
        <p>展示治未病相关中草药单药的药性、功效、适宜人群、注意事项，以及中国传统经典治未病处方与出处。</p>
      </section>

      <div className="tcm-tabs">
        <button
          type="button"
          className={activeTab === TAB_HERBS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_HERBS)}
        >
          中草药单药
        </button>
        <button
          type="button"
          className={activeTab === TAB_PRESCRIPTIONS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_PRESCRIPTIONS)}
        >
          经典处方
        </button>
      </div>

      {activeTab === TAB_HERBS && (
        <section className="tcm-section">
          <h2>治未病相关中草药单药</h2>
          <div className="tcm-list">
            {TCM_HERBS.map((herb) => (
              <article key={herb.id} className="tcm-card herb-card">
                <h3>{herb.name}</h3>
                <dl>
                  <dt>药性</dt>
                  <dd>{herb.property}</dd>
                  <dt>功效</dt>
                  <dd>{herb.efficacy}</dd>
                  <dt>适宜人群</dt>
                  <dd>{herb.suitableFor}</dd>
                  <dt>注意事项</dt>
                  <dd>{herb.caution}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_PRESCRIPTIONS && (
        <section className="tcm-section">
          <h2>中国传统经典治未病处方</h2>
          <div className="tcm-list">
            {TCM_PRESCRIPTIONS.map((rx) => (
              <article key={rx.id} className="tcm-card prescription-card">
                <h3>{rx.name}</h3>
                <dl>
                  <dt>功效</dt>
                  <dd>{rx.efficacy}</dd>
                  <dt>适宜人群</dt>
                  <dd>{rx.suitableFor}</dd>
                  <dt>出处</dt>
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
