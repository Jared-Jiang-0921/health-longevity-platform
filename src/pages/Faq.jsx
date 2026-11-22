import { useLocale } from '../context/LocaleContext'
import { getPublicFaqPage } from '../data/publicFaq'
import './About.css'

export default function Faq() {
  const { lang } = useLocale()
  const page = getPublicFaqPage(lang)

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
      {page.faqs.map((item) => (
        <section key={item.q}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </section>
      ))}
    </article>
  )
}
