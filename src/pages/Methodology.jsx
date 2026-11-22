import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getPublicMethodologyPage } from '../data/publicMethodology'
import './About.css'

export default function Methodology() {
  const { lang } = useLocale()
  const page = getPublicMethodologyPage(lang)

  return (
    <article className="page-content page-about">
      <header className="page-header">
        <p className="about-kicker">{page.kicker}</p>
        <h1>{page.title}</h1>
        <p className="about-lead">{page.lead}</p>
      </header>
      <aside className="page-callout page-callout--warn" role="note">
        <p>{page.disclaimer}</p>
      </aside>
      {page.sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>
      ))}
      <section>
        <h2>{page.relatedHeading}</h2>
        <ul className="about-urls">
          {page.related.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
