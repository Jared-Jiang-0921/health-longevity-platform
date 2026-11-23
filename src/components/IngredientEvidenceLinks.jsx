import { Link } from 'react-router-dom'
import { ingredientEvidenceLinks } from '../data/productsEvidenceLibraryI18n'

const COPY = {
  zh: {
    heading: '成分证据',
    note: '这五页可以公开阅读。不提供用量，也不把研究写成治疗、预防或抗衰老疗效。',
  },
  en: {
    heading: 'Ingredient evidence',
    note: 'These five pages are public. They give no dose and do not turn research into treatment, prevention, or an anti-aging effect.',
  },
}

export default function IngredientEvidenceLinks({ lang }) {
  const copy = COPY[lang] || COPY.zh
  const links = ingredientEvidenceLinks(lang)
  return (
    <nav aria-label={copy.heading}>
      <h2>{copy.heading}</h2>
      <p>{copy.note}</p>
      <ul>
        {links.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
