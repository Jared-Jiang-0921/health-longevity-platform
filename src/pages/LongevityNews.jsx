import { RESEARCH_UPDATES, getMonthLabel } from '../data/longevityNews'
import { getLongevityNewsModuleCopy } from '../data/longevityNewsModuleI18n'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import LongevityNewsFeed from '../components/LongevityNewsFeed'
import './LongevityNews.css'

export default function LongevityNews() {
  const { lang } = useLocale()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const mod = getLongevityNewsModuleCopy(lang)
  const t = {
    zh: { read: '阅读原文' },
    en: { read: 'Read source' },
    ar: { read: 'قراءة المصدر' },
  }[lang || 'zh']

  return (
    <div className="page-longevity-news">
      <section className="news-header">
        <h1>{mod.title}</h1>
        <p className="news-lead">{mod.lead}</p>

        <aside className="news-caveat page-callout page-callout--info" role="note">
          <h2 className="news-caveat-title">{mod.caveatTitle}</h2>
          <p className="news-caveat-phrase">{mod.caveatPhrase}</p>
        </aside>

        {isAdmin ? (
          <>
            <section className="news-sources" aria-labelledby="news-sources-heading">
              <h2 id="news-sources-heading" className="news-section-heading">{mod.sourcesTitle}</h2>
              <p className="news-sources-body">{mod.sourcesBody}</p>
            </section>

            <section className="news-columns" aria-labelledby="news-columns-heading">
              <h2 id="news-columns-heading" className="news-section-heading">{mod.columnsTitle}</h2>
              <div className="news-table-wrap">
                <table className="news-columns-table">
                  <thead>
                    <tr>
                      <th scope="col">{mod.colColumn}</th>
                      <th scope="col">{mod.colContent}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.columnRows.map((row) => (
                      <tr key={row.column}>
                        <td>{row.column}</td>
                        <td>{row.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="news-list-intro">{mod.listIntro}</p>
          </>
        ) : null}
      </section>

      {/* 正式内容：栏目目录 → 点开阅读（按条目会员等级） */}
      <LongevityNewsFeed />

      {isAdmin ? (
        <section className="news-list content-card-stack">
          <h2 className="news-section-heading">{mod.listIntro}</h2>
          {RESEARCH_UPDATES.map((item) => (
            <article key={item.id} className="news-card content-card content-card--padded">
              <div className="news-meta">
                <span className="news-journal">{item.journal}</span>
                <span className="news-if">IF {item.impactFactor}</span>
                <span className="news-month">{getMonthLabel(item.month, lang)}</span>
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
      ) : null}
    </div>
  )
}
