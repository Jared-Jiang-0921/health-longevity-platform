import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'health-platform-lang'
const SUPPORTED = ['zh', 'en', 'ar']

function normalizeLang(raw) {
  const s = String(raw || '').toLowerCase().trim()
  if (s === 'zh' || s === 'zh-cn' || s === 'zh-hans') return 'zh'
  if (s === 'ar' || s === 'ar-sa' || s === 'ar-ae') return 'ar'
  return 'en'
}

function resolveInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return normalizeLang(saved)
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined') {
    const browser = normalizeLang(navigator.language)
    if (SUPPORTED.includes(browser)) return browser
  }
  return 'zh'
}

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [lang, setLangState] = useState(resolveInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    }
  }, [lang])

  const setLang = (next) => setLangState(normalizeLang(next))

  const value = useMemo(() => ({ lang, setLang }), [lang])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
