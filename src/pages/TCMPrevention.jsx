import { useState } from 'react'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import { useLocale } from '../context/LocaleContext'
import './TCMPrevention.css'

const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

export default function TCMPrevention() {
  const { lang } = useLocale()
  const t = {
    zh: { title: '中医药特色 · 治未病', desc: '展示治未病相关中草药单药的药性、功效、适宜人群、注意事项，以及中国传统经典治未病处方与出处。', herbs: '中草药单药', rx: '经典处方' },
    en: { title: 'TCM Prevention', desc: 'Herbs and classic preventive formulas from Traditional Chinese Medicine.', herbs: 'Herbs', rx: 'Classical Formulas' },
    ar: { title: 'الطب الصيني الوقائي', desc: 'أعشاب ووصفات وقائية تقليدية من الطب الصيني.', herbs: 'الأعشاب', rx: 'الوصفات الكلاسيكية' },
  }[lang || 'zh']
  const [activeTab, setActiveTab] = useState(TAB_HERBS)

  return (
    <div className="page-tcm-prevention">
      <section className="tcm-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </section>

      <div className="tcm-tabs">
        <button
          type="button"
          className={activeTab === TAB_HERBS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_HERBS)}
        >
          {t.herbs}
        </button>
        <button
          type="button"
          className={activeTab === TAB_PRESCRIPTIONS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_PRESCRIPTIONS)}
        >
          {t.rx}
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
