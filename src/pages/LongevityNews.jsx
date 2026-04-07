import { RESEARCH_UPDATES, getMonthLabel } from '../data/longevityNews'
import { useLocale } from '../context/LocaleContext'
import './LongevityNews.css'

export default function LongevityNews() {
  const { lang } = useLocale()
  const t = {
    zh: { title: '前沿长寿医学资讯', desc: '国际权威期刊每月更新的高影响因子健康长寿研究资讯，供参考学习。', read: '阅读原文' },
    en: { title: 'Frontier Longevity News', desc: 'Monthly high-impact longevity research updates from leading journals.', read: 'Read source' },
    ar: { title: 'مستجدات طب طول العمر', desc: 'تحديثات شهرية عالية التأثير من الدوريات العلمية الرائدة.', read: 'قراءة المصدر' },
  }[lang || 'zh']
  return (
    <div className="page-longevity-news">
      <section className="news-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </section>

      <section className="news-list">
        {RESEARCH_UPDATES.map((item) => (
          <article key={item.id} className="news-card">
            <div className="news-meta">
              <span className="news-journal">{item.journal}</span>
              <span className="news-if">IF {item.impactFactor}</span>
              <span className="news-month">{getMonthLabel(item.month)}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            {item.url && (
              <a href={item.url} className="news-link" target="_blank" rel="noopener noreferrer">
                {t.read} →
              </a>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
