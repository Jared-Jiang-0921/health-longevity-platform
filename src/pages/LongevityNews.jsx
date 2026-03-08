import { RESEARCH_UPDATES, getMonthLabel } from '../data/longevityNews'
import './LongevityNews.css'

export default function LongevityNews() {
  return (
    <div className="page-longevity-news">
      <section className="news-header">
        <h1>前沿长寿医学资讯</h1>
        <p>国际权威期刊每月更新的高影响因子健康长寿研究资讯，供参考学习。</p>
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
                阅读原文 →
              </a>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
