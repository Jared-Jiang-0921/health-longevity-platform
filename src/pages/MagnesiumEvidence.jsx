import { Link } from 'react-router-dom'
import { MAGNESIUM_EVIDENCE_UPDATED, getMagnesiumEvidencePage } from '../data/magnesiumEvidencePage'
import { useLocale } from '../context/LocaleContext'
import './NmnEvidence.css'

export default function MagnesiumEvidence() {
  const { lang } = useLocale()
  const page = getMagnesiumEvidencePage(lang)

  return (
    <article className="page-content page-nmn-evidence">
      <header className="page-header">
        <p className="nmn-kicker">{page.kicker}</p>
        <h1>{page.title}</h1>
        <p className="nmn-updated">
          {page.updatedLabel}：<time dateTime={MAGNESIUM_EVIDENCE_UPDATED}>{MAGNESIUM_EVIDENCE_UPDATED}</time>
        </p>
        <p className="nmn-lead">{page.lead}</p>
      </header>

      <aside className="page-callout page-callout--warn" role="note">
        <p>{page.disclaimer}</p>
      </aside>

      {page.sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`magnesium-${section.id}`}>
          <h2 id={`magnesium-${section.id}`}>{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>
      ))}

      <section id="sources" aria-labelledby="magnesium-sources">
        <h2 id="magnesium-sources">{page.sourcesHeading}</h2>
        <p>{page.sourcesNote}</p>
        <ul className="nmn-sources">
          {page.sources.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="related" aria-labelledby="magnesium-related">
        <h2 id="magnesium-related">{page.relatedHeading}</h2>
        <ul>
          {page.related.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="magnesium-faq">
        <h2 id="magnesium-faq">{lang === 'en' ? 'Questions' : '常见问题'}</h2>
        {page.faqs.map((item) => (
          <article key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </section>
    </article>
  )
}
