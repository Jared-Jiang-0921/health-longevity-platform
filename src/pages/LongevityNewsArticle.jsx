import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getLongevityNewsArticles } from '../data/longevityNewsArticles'
import { getLongevityNewsModuleCopy } from '../data/longevityNewsModuleI18n'
import { toNewsSearchCard } from '../lib/longevityNewsCard'
import {
  isPublicNewsCard,
  newsArticleAlternates,
  newsArticleJsonLd,
  newsArticleRouterPath,
  newsArticleSeoFields,
  newsRelatedLinks,
  presentNewsArticle,
} from '../lib/newsArticleSeo'
import { newsPublicId } from '../lib/newsSlug'
import { applySeoToDocument } from '../lib/seoDocument'
import './LongevityNews.css'

const STATIC_CARDS = getLongevityNewsArticles().map((item) => toNewsSearchCard(item))

const LABEL = {
  zh: { back: '返回前沿医学资讯', missing: '未找到这条资讯', source: '来源页', takeaways: '阅读要点' },
  en: { back: 'Back to medical insights', missing: 'This insight was not found', source: 'Source page', takeaways: 'Takeaways' },
}

function uploadCard(item) {
  return toNewsSearchCard({
    id: `upload-${item.id}`,
    column: item.subcategory,
    title: item.title,
    summary: item.summary,
    external_url: item.external_url,
    created_at: item.created_at,
  })
}

export default function LongevityNewsArticle() {
  const { articleId = '' } = useParams()
  const { lang } = useLocale()
  const copy = LABEL[lang] || LABEL.zh
  const mod = getLongevityNewsModuleCopy(lang)
  const [uploads, setUploads] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/module-assets?module=longevity-news')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled) setUploads(Array.isArray(data.items) ? data.items : [])
      })
      .catch(() => {
        if (!cancelled) setUploads([])
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allCards = [...STATIC_CARDS, ...uploads.map(uploadCard)]
  const card = allCards.find((item) => item.id === articleId || newsPublicId(item.id) === articleId)
  const publicId = card ? newsPublicId(card.id) : ''
  const view = card ? presentNewsArticle(card, lang) : null
  const published = Boolean(view && isPublicNewsCard(view, lang) && !(lang !== 'zh' && view.zhOnly))

  useEffect(() => {
    const known = Boolean(
      STATIC_CARDS.find((item) => item.id === articleId || newsPublicId(item.id) === articleId)
      || (ready && card),
    )
    const missing = ready && !card
    if (!known && !missing) return
    if (view && published) {
      applySeoToDocument({
        lang,
        pathname: newsArticleRouterPath(publicId),
        seo: newsArticleSeoFields(view, lang),
        jsonLd: newsArticleJsonLd(view, lang),
        alternates: newsArticleAlternates(card),
        replaceUnmanaged: true,
      })
      return
    }
    applySeoToDocument({
      lang,
      pathname: '/longevity-news',
      seo: {
        title: `${copy.missing} | ${lang === 'zh' ? '长健星图' : 'Longevity Atlas'}`,
        description: mod.lead,
        canonical: 'https://www.healthlongevity.cn/longevity-news',
        robots: 'noindex,nofollow',
        indexable: false,
        page: { path: '/longevity-news' },
      },
      jsonLd: null,
      alternates: [],
      replaceUnmanaged: true,
    })
  }, [articleId, card, copy.missing, lang, mod.lead, publicId, ready, published, view])

  if (card && publicId && publicId !== articleId) {
    return <Navigate to={newsArticleRouterPath(publicId)} replace />
  }

  const related = view && published ? newsRelatedLinks(view, lang) : []

  return (
    <article className="page-longevity-news ln-essay">
      <p>
        <Link to="/longevity-news">{copy.back}</Link>
      </p>
      {!card && ready ? <h1>{copy.missing}</h1> : null}
      {view ? (
        <>
          <h1>{view.title}</h1>
          {view.publishedAt ? <p><time dateTime={view.publishedAt}>{view.publishedAt}</time></p> : null}
          {view.contentUpdated ? (
            <p>{lang === 'zh' ? '说明更新' : 'Note updated'}：<time dateTime={view.contentUpdated}>{view.contentUpdated}</time></p>
          ) : null}
          {published ? (
            <>
              {view.abstract ? <p>{view.abstract}</p> : null}
              {view.takeaways?.filter(Boolean).length && view.abstract !== view.takeaways.filter(Boolean).join(lang === 'en' ? ' ' : '；') ? (
                <>
                  <h2>{copy.takeaways}</h2>
                  <ul>
                    {view.takeaways.filter(Boolean).map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </>
              ) : null}
              {related.length ? (
                <>
                  <h2>{lang === 'en' ? 'Related pages' : '相关页面'}</h2>
                  <ul>
                    {related.map((item) => (
                      <li key={item.path}><Link to={item.path}>{item.label}</Link></li>
                    ))}
                  </ul>
                </>
              ) : null}
              {view.sourceNote ? <p>{view.sourceNote}</p> : null}
              {view.url && /^https?:\/\//i.test(view.url) ? (
                <p>{copy.source}：<a href={view.url}>{view.url}</a></p>
              ) : null}
              {view.sourceLinks?.length ? (
                <>
                  <h2>{lang === 'zh' ? '原始文献' : 'Primary sources'}</h2>
                  <ul>
                    {view.sourceLinks.map((item) => (
                      <li key={item.url}><a href={item.url}>{item.label || item.url}</a></li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          ) : (
            <p>{lang === 'en' && view.zhOnly ? 'This item is in Chinese only.' : copy.missing}</p>
          )}
          <p>{mod.caveatPhrase}</p>
        </>
      ) : null}
    </article>
  )
}
