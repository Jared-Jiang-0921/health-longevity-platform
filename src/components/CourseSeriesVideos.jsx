import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CATEGORIES } from '../data/courses'
import { assetMatchesCourseSeries } from '../data/healthSkillsSeries'
import ContentLockNotice from './ContentLockNotice'
import { moduleAssetUrl } from '../lib/moduleAssetUrl'
import './CourseSeriesVideos.css'

function isVideo(mime) {
  return String(mime || '').startsWith('video/')
}

/**
 * 合集（书）目录：先列各集，点进一集后再播放；不在同页铺开全部播放器。
 */
export default function CourseSeriesVideos({ course }) {
  const { lang } = useLocale()
  const { user, getToken } = useAuth()
  const mediaToken = getToken()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categoryLabel = useMemo(
    () => CATEGORIES.find((c) => c.id === course?.category)?.label || '',
    [course?.category],
  )

  const seriesItems = useMemo(() => {
    return items
      .filter((item) => assetMatchesCourseSeries(item, course, categoryLabel))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }, [items, course, categoryLabel])

  const activeId = String(searchParams.get('v') || '').trim()
  const activeItem = useMemo(
    () => seriesItems.find((item) => String(item.id) === activeId) || null,
    [seriesItems, activeId],
  )
  const activeIndex = activeItem
    ? seriesItems.findIndex((item) => String(item.id) === String(activeItem.id))
    : -1

  useEffect(() => {
    if (!course?.title) return undefined
    let cancelled = false
    setLoading(true)
    setError('')
    const token = getToken()
    ;(async () => {
      try {
        const res = await fetch(`/api/module-assets?module=health-skills&ts=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'load failed')
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : [])
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'load failed')
          setItems([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [course?.title, getToken])

  if (!course?.videoSeries && seriesItems.length === 0 && !loading) return null

  const t = {
    zh: {
      heading: '合集目录',
      empty: '本合集暂无内容，管理员可在页面底部资料区上传并选择对应「系列合集」。',
      loading: '加载中…',
      lead: '本合集像一本书：先选章节，再观看该集内容。',
      chapter: (n) => `第 ${n} 集`,
      open: '打开资料',
      watch: '观看本集',
      backToc: '返回目录',
      playing: '正在播放',
      prev: '上一集',
      next: '下一集',
      episodes: (n) => `共 ${n} 集`,
    },
    en: {
      heading: 'Table of contents',
      empty: 'No episodes yet. Admins can upload under this series in the assets panel.',
      loading: 'Loading…',
      lead: 'This series works like a book: pick a chapter, then watch.',
      chapter: (n) => `Episode ${n}`,
      open: 'Open file',
      watch: 'Watch',
      backToc: 'Back to contents',
      playing: 'Now playing',
      prev: 'Previous',
      next: 'Next',
      episodes: (n) => `${n} episodes`,
    },
    ar: {
      heading: 'فهرس المجموعة',
      empty: 'لا توجد حلقات بعد.',
      loading: 'جارٍ التحميل…',
      lead: 'هذه المجموعة مثل كتاب: اختر فصلاً ثم شاهد.',
      chapter: (n) => `الحلقة ${n}`,
      open: 'فتح',
      watch: 'مشاهدة',
      backToc: 'العودة للفهرس',
      playing: 'يتم التشغيل',
      prev: 'السابق',
      next: 'التالي',
      episodes: (n) => `${n} حلقات`,
    },
  }[lang || 'zh']

  const openChapter = (id) => {
    setSearchParams({ v: String(id) }, { replace: false })
  }

  const clearChapter = () => {
    setSearchParams({}, { replace: false })
  }

  const goRelative = (delta) => {
    if (activeIndex < 0) return
    const next = seriesItems[activeIndex + delta]
    if (next) openChapter(next.id)
  }

  return (
    <section className="course-series-videos" aria-labelledby="course-series-videos-heading">
      <h2 id="course-series-videos-heading">{t.heading}</h2>
      <p className="course-series-videos-lead">
        {t.lead}
        {!loading && seriesItems.length ? ` · ${t.episodes(seriesItems.length)}` : ''}
      </p>
      {loading ? <p className="course-series-videos-muted">{t.loading}</p> : null}
      {error ? <p className="course-series-videos-error">{error}</p> : null}

      {activeItem ? (
        <div className="course-series-reader">
          <button type="button" className="course-series-back-toc" onClick={clearChapter}>
            ← {t.backToc}
          </button>
          <p className="course-series-videos-muted">
            {t.playing}
            {activeIndex >= 0 ? ` · ${t.chapter(activeIndex + 1)}` : ''}
          </p>
          <h3 className="course-series-videos-title">{activeItem.title}</h3>
          {activeItem.summary ? (
            <p className="course-series-videos-summary">{activeItem.summary}</p>
          ) : null}
          {activeItem.can_view === false ? (
            <ContentLockNotice requiredLevel={activeItem.required_level} user={user} />
          ) : isVideo(activeItem.mime_type) ? (
            <video
              key={activeItem.id}
              controls
              className="course-series-videos-player"
              src={moduleAssetUrl(activeItem.id, mediaToken)}
              preload="metadata"
            />
          ) : (
            <p className="course-series-videos-muted">
              <a href={moduleAssetUrl(activeItem.id, mediaToken)} target="_blank" rel="noreferrer">
                {t.open}
              </a>
            </p>
          )}
          <div className="course-series-nav">
            <button
              type="button"
              className="btn-secondary"
              disabled={activeIndex <= 0}
              onClick={() => goRelative(-1)}
            >
              {t.prev}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={activeIndex < 0 || activeIndex >= seriesItems.length - 1}
              onClick={() => goRelative(1)}
            >
              {t.next}
            </button>
          </div>
        </div>
      ) : null}

      {!loading && !seriesItems.length ? (
        <p className="course-series-videos-muted">{t.empty}</p>
      ) : !activeItem ? (
        <ol className="course-series-toc">
          {seriesItems.map((item, index) => (
            <li key={item.id} className="course-series-toc-item content-card content-card--padded">
              <div className="course-series-toc-head">
                <span className="course-series-toc-num">{t.chapter(index + 1)}</span>
                <h3 className="course-series-videos-title">{item.title}</h3>
              </div>
              {item.summary ? <p className="course-series-videos-summary">{item.summary}</p> : null}
              {item.can_view === false ? (
                <ContentLockNotice requiredLevel={item.required_level} user={user} />
              ) : (
                <button type="button" className="btn-primary course-series-toc-open" onClick={() => openChapter(item.id)}>
                  {t.watch}
                </button>
              )}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  )
}
