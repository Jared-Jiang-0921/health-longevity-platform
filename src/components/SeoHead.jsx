import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { isNewsArticlePath } from '../lib/newsArticleSeo.js'
import { applySeoToDocument } from '../lib/seoDocument.js'

export default function SeoHead() {
  const { lang } = useLocale()
  const location = useLocation()

  useEffect(() => {
    if (isNewsArticlePath(location.pathname)) return
    applySeoToDocument({ lang, pathname: location.pathname })
  }, [lang, location.pathname])

  return null
}
