import { useTranslation } from 'react-i18next'
import { RESEARCH_UPDATES, getMonthLabel } from '../data/longevityNews'
import './LongevityNews.css'

export default function LongevityNews() {
  const { t } = useTranslation()
  return (
    <div className="page-longevity-news">
      <section className="news-header">
        <h1>{t('longevityNews.title')}</h1>
        <p>{t('longevityNews.subtitle')}</p>
      </section>

      <section className="news-list">
        {RESEARCH_UPDATES.map((item) => (
          <article key={item.id} className="news-card">
            <div className="news-meta">
              <span className="news-journal">{item.journal}</span>
              <span className="news-if">IF {item.impactFactor}</span>
              <span className="news-month">{getMonthLabel(item.month)}</span>
            </div>
            <h3>{t('longevityNews.' + item.id + '.title', { defaultValue: item.title })}</h3>
            <p>{t('longevityNews.' + item.id + '.summary', { defaultValue: item.summary })}</p>
            {item.url && (
              <a href={item.url} className="news-link" target="_blank" rel="noopener noreferrer">
                {t('longevityNews.readMore')} →
              </a>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
