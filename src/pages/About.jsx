import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getAboutPage } from '../data/publicSummary'
import './About.css'

export default function About() {
  const { lang } = useLocale()
  const page = getAboutPage(lang)
  const rtl = lang === 'ar'

  return (
    <article className={`page-content page-about${rtl ? ' page-about--rtl' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
      <header className="page-header">
        <p className="about-kicker">{page.kicker}</p>
        <h1>{page.title}</h1>
        <p className="about-updated">
          {page.updatedLabel}：<time dateTime={page.updated}>{page.updated}</time>
        </p>
        <p className="about-lead">{page.lead}</p>
      </header>

      {page.sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`about-${section.id}`}>
          <h2 id={`about-${section.id}`}>{section.heading}</h2>
          {(section.paragraphs || []).map((text) => (
            <p key={text}>{text}</p>
          ))}
          {section.modules ? (
            <div className="about-modules">
              {section.modules.map((mod) => (
                <article key={mod.path}>
                  <h3>
                    <Link to={mod.path}>{mod.title}</Link>
                  </h3>
                  <p>{mod.intro}</p>
                </article>
              ))}
            </div>
          ) : null}
          {section.urls ? (
            <ul className="about-urls">
              {section.urls.map((item) => (
                <li key={item.href}>
                  {item.path ? <Link to={item.path}>{item.label}</Link> : <a href={item.href}>{item.label}</a>}
                  <span className="about-url-text">{item.href}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="about-faq" aria-labelledby="about-faq-heading">
        <h2 id="about-faq-heading">{page.faqHeading}</h2>
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
