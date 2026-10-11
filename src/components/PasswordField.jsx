import { useState } from 'react'
import { useLocale } from '../context/LocaleContext'

const I18N = {
  zh: { show: '显示', hide: '隐藏' },
  en: { show: 'Show', hide: 'Hide' },
  ar: { show: 'إظهار', hide: 'إخفاء' },
}

export default function PasswordField({
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  id,
  name,
}) {
  const { lang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-password-wrap">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? t.hide : t.show}
      >
        {visible ? t.hide : t.show}
      </button>
    </div>
  )
}
