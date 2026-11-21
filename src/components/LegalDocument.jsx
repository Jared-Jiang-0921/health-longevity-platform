import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { LEGAL_META_I18N, normalizeLegalLang } from '../data/legalDocumentsI18n'
import '../pages/LegalPages.css'

export default function LegalDocument({ doc }) {
  const { lang: currentLang } = useLocale()
  const lang = normalizeLegalLang(currentLang)
  const bundle = doc[lang] || doc.en
  const meta = LEGAL_META_I18N[lang] || LEGAL_META_I18N.en

  return (
    <div className="page-content page-legal" lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
      <p className="legal-meta">
        {lang === 'zh' ? '最后更新：' : 'Last updated: '}
        {meta.lastUpdated}
      </p>

      <h1>{bundle.title}</h1>

      {bundle.sections.map((section, si) => (
        <section key={`${section.heading}-${si}`}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}

      <p className="legal-back">
        <Link to="/">{lang === 'zh' ? '首页' : 'Home'}</Link>
      </p>
    </div>
  )
}
