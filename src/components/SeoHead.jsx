import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { applySeoToDocument } from '../lib/seoDocument.js'

export default function SeoHead() {
  const { lang } = useLocale()
  const location = useLocation()

  useEffect(() => {
    applySeoToDocument({ lang, pathname: location.pathname })
  }, [lang, location.pathname])

  return null
}
