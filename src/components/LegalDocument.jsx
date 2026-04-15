import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { LEGAL_META_I18N, normalizeLegalLang } from '../data/legalDocumentsI18n'
import '../pages/LegalPages.css'

export default function LegalDocument({ doc }) {
  const { lang: currentLang } = useLocale()
  const lang = normalizeLegalLang(currentLang)
  const bundle = doc[lang] || doc.en
  const meta = LEGAL_META_I18N[lang] || LEGAL_META_I18N.en
  const isRtl = lang === 'ar'

  return (
    <div
      className={`page-content page-legal${isRtl ? ' legal-rtl' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={lang === 'zh' ? 'zh-Hans' : lang === 'ar' ? 'ar' : 'en'}
    >
      <p className="legal-meta">
        {lang === 'zh' ? '最后更新：' : lang === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
        {meta.lastUpdated}
        {' · '}
        <span className="legal-meta-muted">{meta.governingLawNote}</span>
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

      <p className="legal-counsel-note">
        {lang === 'zh'
          ? '以上文本为结构化模板，供律师按各司法辖区审阅、修改与定稿，不构成正式法律意见。'
          : lang === 'ar'
            ? 'هذه النصوص نماذج منظّمة للمراجعة القانونية ولا تشكل استشارة قانونية رسمية.'
            : 'This document is a structured template for legal review. It is not a substitute for advice from a qualified attorney in your markets.'}
      </p>

      <p className="legal-back">
        <Link to="/">{lang === 'zh' ? '首页' : lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
      </p>
    </div>
  )
}
