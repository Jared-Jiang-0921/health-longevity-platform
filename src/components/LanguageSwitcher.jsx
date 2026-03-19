import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="language-switcher">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${i18n.language === code || i18n.language.startsWith(code) ? 'active' : ''}`}
          onClick={() => i18n.changeLanguage(code)}
          title={label}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
