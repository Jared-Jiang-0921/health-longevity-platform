import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getLongevityNewsArticles } from '../data/longevityNewsArticles'
import { getLongevityNewsModuleCopy } from '../data/longevityNewsModuleI18n'
import { toNewsSearchCard } from '../lib/longevityNewsCard'
import {
  isSubstantiveNewsCard,
  newsArticleAlternates,
  newsArticleJsonLd,
  newsArticleRouterPath,
  newsArticleSeoFields,
  presentNewsArticle,
} from '../lib/newsArticleSeo'
import { applySeoToDocument } from '../lib/seoDocument'
import './LongevityNews.css'

const STATIC_CARDS = getLongevityNewsArticles().map((item) => toNewsSearchCard(item))

const LABEL = {
  zh: { back: '返回前沿医学资讯', missing: '未找到这条资讯', source: '来源页', thin: '这条目前只有标题，完整说明仍在栏目页。' },
  en: { back: 'Back to medical insights', missing: 'This insight was not found', source: 'Source page', thin: 'This card only has a title. The column page has the rest.' },
  ar: { back: 'العودة إلى المستجدات', missing: 'لم يُعثر على هذه البطاقة', source: 'صفحة المصدر', thin: 'هذه البطاقة عنوان فقط. الباقي في صفحة العمود.' },
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

  const card = STATIC_CARDS.find((item) => item.id === articleId)
    || uploads.map(uploadCard).find((item) => item.id === articleId)
  const view = card ? presentNewsArticle(card, lang) : null
  const substantive = Boolean(view && isSubstantiveNewsCard(view, lang) && !(lang !== 'zh' && view.zhOnly))

  useEffect(() => {
    const known = Boolean(STATIC_CARDS.find((item) => item.id === articleId) || (ready && card))
    const missing = ready && !card
    if (!known && !missing) return
    if (view && substantive) {
      applySeoToDocument({
        lang,
        pathname: newsArticleRouterPath(view.id),
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
  }, [articleId, card, copy.missing, lang, mod.lead, ready, substantive, view])

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
          {substantive ? (
            <>
              {view.excerpt ? <p>{view.excerpt}</p> : null}
              {view.takeaways?.filter(Boolean).length ? (
                <>
                  <h2>{lang === 'zh' ? '阅读要点' : lang === 'ar' ? 'نقاط' : 'Takeaways'}</h2>
                  <ul>
                    {view.takeaways.filter(Boolean).map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </>
              ) : null}
              {view.sourceNote ? <p>{view.sourceNote}</p> : null}
              {view.url && /^https?:\/\//i.test(view.url) ? (
                <p>{copy.source}：<a href={view.url}>{view.url}</a></p>
              ) : null}
            </>
          ) : (
            <p>{copy.thin}</p>
          )}
          <p>{mod.caveatPhrase}</p>
        </>
      ) : null}
    </article>
  )
}
