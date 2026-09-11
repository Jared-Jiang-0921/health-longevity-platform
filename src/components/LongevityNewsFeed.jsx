import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import {
  LONGEVITY_NEWS_COLUMNS,
  getLongevityNewsColumn,
  getLongevityNewsColumnBlurb,
} from '../data/longevityNewsColumns'
import { getLongevityNewsArticles } from '../data/longevityNewsArticles'
import { hasLevelAccess, shouldShowMembershipBadge } from '../data/membership'
import { extractLongevityKeywords, newsCardExcerpt } from '../lib/longevityNewsCard'
import { getMembershipLevelLabel } from '../i18n/terms'
import ContentLockNotice from './ContentLockNotice'
import { moduleAssetUrl } from '../lib/moduleAssetUrl'
import '../styles/membership-badge.css'
import './LongevityNewsFeed.css'

function isVideo(mime) {
  return String(mime || '').startsWith('video/')
}

function isImage(mime) {
  return String(mime || '').startsWith('image/')
}

function kindLabel(kind, t) {
  if (kind === 'link') return t.link
  if (kind === 'upload') return t.uploaded
  return t.editorial
}

function formatDate(iso) {
  const s = String(iso || '').slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return ''
  const [y, m, d] = s.split('-')
  return `${y}.${m}.${d}`
}

export default function LongevityNewsFeed() {
  const { lang } = useLocale()
  const { user, getToken } = useAuth()
  const mediaToken = getToken()
  const [activeColumn, setActiveColumn] = useState(LONGEVITY_NEWS_COLUMNS[0]?.label || '')
  const [activeId, setActiveId] = useState('')
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)

  const t = {
    zh: {
      kicker: '长寿医学简报',
      columns: '栏目',
      empty: '本栏目还没有稿件。管理员可在页面底部用「发布链接」或「批量导入」归档公众号文章。',
      loading: '加载中…',
      read: '阅读本篇',
      back: '返回目录',
      open: '打开资料',
      source: '来源',
      takeaways: '阅读要点',
      keywords: '关键词',
      uploaded: '站内资料',
      link: '微信原文',
      editorial: '编辑稿',
      openWechat: '打开微信原文',
      login: '登录后阅读',
      upgrade: '升级后阅读',
      count: (n) => `${n} 篇`,
    },
    en: {
      kicker: 'Medical briefing',
      columns: 'Columns',
      empty: 'No pieces in this column yet.',
      loading: 'Loading…',
      read: 'Read',
      back: 'Back',
      open: 'Open file',
      source: 'Source',
      takeaways: 'Takeaways',
      keywords: 'Keywords',
      uploaded: 'File',
      link: 'Original',
      editorial: 'Editorial',
      openWechat: 'Open original',
      login: 'Log in to read',
      upgrade: 'Upgrade to read',
      count: (n) => `${n}`,
    },
    ar: {
      kicker: 'موجز طبي',
      columns: 'الأعمدة',
      empty: 'لا مقالات بعد.',
      loading: 'جارٍ التحميل…',
      read: 'اقرأ',
      back: 'عودة',
      open: 'فتح',
      source: 'المصدر',
      takeaways: 'نقاط',
      keywords: 'كلمات مفتاحية',
      uploaded: 'ملف',
      link: 'الأصل',
      editorial: 'تحريري',
      openWechat: 'فتح الأصل',
      login: 'سجّل لل قراءة',
      upgrade: 'رقِّ ل القراءة',
      count: (n) => `${n}`,
    },
  }[lang || 'zh']

  const loadUploads = useCallback(async () => {
    const token = getToken()
    const res = await fetch(`/api/module-assets?module=longevity-news&ts=${Date.now()}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'load failed')
    return Array.isArray(data.items) ? data.items : []
  }, [getToken])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadUploads()
      .then((items) => { if (!cancelled) setUploads(items) })
      .catch(() => { if (!cancelled) setUploads([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    const onUpdated = (e) => {
      if (e.detail?.module && e.detail.module !== 'longevity-news') return
      loadUploads().then((items) => { if (!cancelled) setUploads(items) }).catch(() => {})
    }
    window.addEventListener('module-assets-updated', onUpdated)
    return () => {
      cancelled = true
      window.removeEventListener('module-assets-updated', onUpdated)
    }
  }, [loadUploads])

  const columnMeta = getLongevityNewsColumn(activeColumn)

  const columnCounts = useMemo(() => {
    const staticAll = getLongevityNewsArticles()
    const map = {}
    for (const col of LONGEVITY_NEWS_COLUMNS) {
      const nStatic = staticAll.filter((a) => a.column === col.label).length
      const nUp = uploads.filter((item) => String(item.subcategory || '').trim() === col.label).length
      map[col.label] = nStatic + nUp
    }
    return map
  }, [uploads])

  const entries = useMemo(() => {
    const staticOnes = getLongevityNewsArticles()
      .filter((a) => a.column === activeColumn)
      .map((a) => ({
        kind: 'editorial',
        id: a.id,
        title: a.title,
        summary: a.summary,
        takeaways: a.takeaways || [],
        keywords: extractLongevityKeywords(a.title, a.summary),
        excerpt: newsCardExcerpt(a.summary),
        sourceNote: a.sourceNote || '',
        url: a.url || '',
        publishedAt: a.publishedAt || '',
        requiredLevel: a.requiredMembership || columnMeta?.requiredLevel || 'free',
        canView: hasLevelAccess(user?.level, a.requiredMembership || 'free', { isGuest: !user }),
      }))

    const uploadOnes = uploads
      .filter((item) => String(item.subcategory || '').trim() === activeColumn)
      .map((item) => {
        const extUrl = String(item.external_url || '').trim()
        const isLink = Boolean(extUrl) && (!item.file_size || item.mime_type === 'text/uri-list')
        return {
          kind: isLink ? 'link' : 'upload',
          id: `upload-${item.id}`,
          assetId: item.id,
          title: item.title,
          summary: item.summary || '',
          excerpt: newsCardExcerpt(item.summary),
          keywords: extractLongevityKeywords(item.title, item.summary),
          takeaways: [],
          sourceNote: isLink ? '原文在微信公众号，完整内容以微信页面为准。' : '',
          url: extUrl,
          publishedAt: item.created_at ? String(item.created_at).slice(0, 10) : '',
          requiredLevel: item.content_level || item.required_level || columnMeta?.requiredLevel || 'free',
          canView: item.can_view !== false,
          mime: item.mime_type,
          rawRequired: item.required_level,
        }
      })
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))

    return [...uploadOnes, ...staticOnes]
  }, [activeColumn, uploads, user, columnMeta])

  const active = entries.find((e) => e.id === activeId) || null

  useEffect(() => {
    setActiveId('')
  }, [activeColumn])

  const renderCard = (item) => {
    const locked = !item.canView
    const open = () => { if (!locked) setActiveId(item.id) }
    return (
      <article
        key={item.id}
        className={`ln-card ${locked ? 'is-locked' : ''}`}
      >
        <div className="ln-card-meta">
          <span className="ln-card-kind">{kindLabel(item.kind, t)}</span>
          {item.publishedAt ? <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time> : null}
          {shouldShowMembershipBadge(item.requiredLevel) ? (
            <span className={`membership-badge membership-${item.requiredLevel}`}>
              {getMembershipLevelLabel(item.requiredLevel, lang)}
            </span>
          ) : null}
        </div>
        <h3 className="ln-card-title">{item.title}</h3>
        {item.keywords?.length ? (
          <ul className="ln-keywords" aria-label={t.keywords}>
            {item.keywords.map((kw) => (
              <li key={kw}>{kw}</li>
            ))}
          </ul>
        ) : null}
        {item.excerpt ? <p className="ln-card-excerpt">{item.excerpt}</p> : null}
        {locked ? (
          <p className="ln-card-cta">
            {!user ? <Link to="/login">{t.login}</Link> : <Link to="/payment">{t.upgrade}</Link>}
          </p>
        ) : (
          <button type="button" className="ln-card-cta-btn" onClick={open}>
            {t.read} →
          </button>
        )}
      </article>
    )
  }

  return (
    <section className="ln-desk" aria-labelledby="ln-desk-kicker">
      <p id="ln-desk-kicker" className="visually-hidden">{t.kicker}</p>

      <div className="ln-toolbar" aria-label={t.columns}>
        <div className="ln-cols" role="tablist" aria-label={t.columns}>
          {LONGEVITY_NEWS_COLUMNS.map((col) => (
            <button
              key={col.id}
              type="button"
              role="tab"
              aria-selected={activeColumn === col.label}
              className={`ln-col ${activeColumn === col.label ? 'is-active' : ''}`}
              onClick={() => setActiveColumn(col.label)}
            >
              <span className="ln-col-name">{col.label}</span>
              <span className="ln-col-count">{t.count(columnCounts[col.label] || 0)}</span>
              {shouldShowMembershipBadge(col.requiredLevel) ? (
                <span className={`membership-badge membership-${col.requiredLevel}`}>
                  {getMembershipLevelLabel(col.requiredLevel, lang)}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      {columnMeta ? (
        <p className="ln-blurb">{getLongevityNewsColumnBlurb(columnMeta, lang)}</p>
      ) : null}

      {loading ? <p className="ln-muted">{t.loading}</p> : null}

      {active ? (
        <article className="ln-essay">
          <button type="button" className="ln-back" onClick={() => setActiveId('')}>
            ← {t.back}
          </button>
          <p className="ln-essay-kicker">
            {kindLabel(active.kind, t)}
            {active.publishedAt ? ` · ${formatDate(active.publishedAt)}` : ''}
          </p>
          <h2 className="ln-essay-title">{active.title}</h2>
          {!active.canView ? (
            <ContentLockNotice requiredLevel={active.rawRequired || active.requiredLevel} user={user} />
          ) : (
            <>
              {active.keywords?.length ? (
                <ul className="ln-keywords ln-keywords--essay" aria-label={t.keywords}>
                  {active.keywords.map((kw) => (
                    <li key={kw}>{kw}</li>
                  ))}
                </ul>
              ) : null}
              {active.excerpt ? (
                <p className="ln-essay-lede">{active.excerpt}</p>
              ) : null}
              {active.takeaways?.length ? (
                <div className="ln-takeaways">
                  <h3>{t.takeaways}</h3>
                  <ul>
                    {active.takeaways.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {active.sourceNote ? (
                <p className="ln-muted">{t.source}：{active.sourceNote}</p>
              ) : null}
              {active.url ? (
                <a href={active.url} target="_blank" rel="noopener noreferrer" className="ln-wechat">
                  {active.kind === 'link' ? t.openWechat : t.open}
                </a>
              ) : null}
              {active.kind === 'upload' && active.assetId ? (
                isVideo(active.mime) ? (
                  <video
                    controls
                    className="ln-media"
                    src={moduleAssetUrl(active.assetId, mediaToken)}
                    preload="metadata"
                  />
                ) : isImage(active.mime) ? (
                  <img
                    className="ln-media"
                    src={moduleAssetUrl(active.assetId, mediaToken)}
                    alt={active.title}
                  />
                ) : !active.url ? (
                  <p>
                    <a
                      href={moduleAssetUrl(active.assetId, mediaToken)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ln-wechat ln-wechat--ghost"
                    >
                      {t.open}
                    </a>
                  </p>
                ) : null
              ) : null}
            </>
          )}
        </article>
      ) : (
        <>
          <div className="ln-list-heading">
            <h2>{activeColumn}</h2>
            <p>{t.count(entries.length)}</p>
          </div>
          {!loading && !entries.length ? (
            <p className="ln-empty">{t.empty}</p>
          ) : (
            <div className="ln-grid">
              {entries.map((item) => renderCard(item))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
