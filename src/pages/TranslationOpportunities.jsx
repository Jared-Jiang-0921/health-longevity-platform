import './TranslationOpportunities.css'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getTranslationOpportunitiesModuleCopy } from '../data/translationOpportunitiesModuleI18n'

export default function TranslationOpportunities() {
  const { lang } = useLocale()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const mod = getTranslationOpportunitiesModuleCopy(lang)

  return (
    <div className="page-content page-translation-opportunities">
      <section className="opportunities-header">
        <h1>{mod.title}</h1>
        <p className="opportunities-audience">{mod.audience}</p>
        <p className="opportunities-core">{mod.core}</p>

        {isAdmin ? (
          <>
            <section className="opportunities-columns" aria-labelledby="opportunities-columns-heading">
              <h2 id="opportunities-columns-heading" className="opportunities-section-title">{mod.columnsTitle}</h2>
              <div className="opportunities-table-wrap">
                <table className="opportunities-columns-table">
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

            <section className="opportunities-monetization" aria-labelledby="opportunities-money-heading">
              <h2 id="opportunities-money-heading" className="opportunities-section-title">{mod.monetizationTitle}</h2>
              <p className="opportunities-monetization-body">{mod.monetizationBody}</p>
            </section>
          </>
        ) : null}
      </section>

      {isAdmin ? (
        <section className="opportunities-body">
          <p className="opportunities-assets-note">{mod.assetsNote}</p>
        </section>
      ) : null}
    </div>
  )
}
