import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import './TCMPrevention.css'

const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

export default function TCMPrevention() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(TAB_HERBS)

  return (
    <div className="page-tcm-prevention">
      <section className="tcm-header">
        <h1>{t('tcmPrevention.title')}</h1>
        <p>{t('tcmPrevention.subtitle')}</p>
      </section>

      <div className="tcm-tabs">
        <button
          type="button"
          className={activeTab === TAB_HERBS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_HERBS)}
        >
          {t('tcmPrevention.tabHerbs')}
        </button>
        <button
          type="button"
          className={activeTab === TAB_PRESCRIPTIONS ? 'active' : ''}
          onClick={() => setActiveTab(TAB_PRESCRIPTIONS)}
        >
          {t('tcmPrevention.tabPrescriptions')}
        </button>
      </div>

      {activeTab === TAB_HERBS && (
        <section className="tcm-section">
          <h2>{t('tcmPrevention.sectionHerbs')}</h2>
          <div className="tcm-list">
            {TCM_HERBS.map((herb) => (
              <article key={herb.id} className="tcm-card herb-card">
                <h3>{t('tcmPrevention.herbs.' + herb.id + '.name', { defaultValue: herb.name })}</h3>
                <dl>
                  <dt>{t('tcmPrevention.property')}</dt>
                  <dd>{t('tcmPrevention.herbs.' + herb.id + '.property', { defaultValue: herb.property })}</dd>
                  <dt>{t('tcmPrevention.efficacy')}</dt>
                  <dd>{t('tcmPrevention.herbs.' + herb.id + '.efficacy', { defaultValue: herb.efficacy })}</dd>
                  <dt>{t('tcmPrevention.suitableFor')}</dt>
                  <dd>{t('tcmPrevention.herbs.' + herb.id + '.suitableFor', { defaultValue: herb.suitableFor })}</dd>
                  <dt>{t('tcmPrevention.caution')}</dt>
                  <dd>{t('tcmPrevention.herbs.' + herb.id + '.caution', { defaultValue: herb.caution })}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_PRESCRIPTIONS && (
        <section className="tcm-section">
          <h2>{t('tcmPrevention.sectionPrescriptions')}</h2>
          <div className="tcm-list">
            {TCM_PRESCRIPTIONS.map((rx) => (
              <article key={rx.id} className="tcm-card prescription-card">
                <h3>{t('tcmPrevention.prescriptions.' + rx.id + '.name', { defaultValue: rx.name })}</h3>
                <dl>
                  <dt>{t('tcmPrevention.efficacy')}</dt>
                  <dd>{t('tcmPrevention.prescriptions.' + rx.id + '.efficacy', { defaultValue: rx.efficacy })}</dd>
                  <dt>{t('tcmPrevention.suitableFor')}</dt>
                  <dd>{t('tcmPrevention.prescriptions.' + rx.id + '.suitableFor', { defaultValue: rx.suitableFor })}</dd>
                  <dt>{t('tcmPrevention.source')}</dt>
                  <dd>{t('tcmPrevention.prescriptions.' + rx.id + '.source', { defaultValue: rx.source })}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
