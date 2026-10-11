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
 * 同一题目收进一张课题卡；点开后再并列显示播放器与各集目录。
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
      heading: '本课题内容',
      empty: '本合集暂无内容，管理员可在页面底部资料区上传并选择对应「系列合集」。',
      loading: '加载中…',
      lead: '同一题目的视频收在这张卡片里，点开一集后可在旁边切换并列各集。',
      chapter: (n) => `第 ${n} 集`,
      open: '打开资料',
      watch: '观看',
      backToc: '收起播放',
      playing: '正在播放',
      siblings: '并列各集',
      prev: '上一集',
      next: '下一集',
      episodes: (n) => `共 ${n} 集`,
    },
    en: {
      heading: 'This topic',
      empty: 'No episodes yet. Admins can upload under this series in the assets panel.',
      loading: 'Loading…',
      lead: 'All videos for this topic sit in one card. Open an episode to see the playlist beside the player.',
      chapter: (n) => `Episode ${n}`,
      open: 'Open file',
      watch: 'Watch',
      backToc: 'Close player',
      playing: 'Now playing',
      siblings: 'Episodes',
      prev: 'Previous',
      next: 'Next',
      episodes: (n) => `${n} episodes`,
    },
    ar: {
      heading: 'هذا الموضوع',
      empty: 'لا توجد حلقات بعد.',
      loading: 'جارٍ التحميل…',
      lead: 'كل فيديوهات الموضوع في بطاقة واحدة.',
      chapter: (n) => `الحلقة ${n}`,
      open: 'فتح',
      watch: 'مشاهدة',
      backToc: 'إغلاق',
      playing: 'يتم التشغيل',
      siblings: 'الحلقات',
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

  const renderEpisodeButton = (item, index) => {
    const locked = item.can_view === false
    const isActive = activeItem && String(activeItem.id) === String(item.id)
    return (
      <li key={item.id}>
        <button
          type="button"
          className={`course-series-ep ${isActive ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`}
          onClick={() => { if (!locked) openChapter(item.id) }}
          disabled={locked}
        >
          <span className="course-series-toc-num">{t.chapter(index + 1)}</span>
          <span className="course-series-ep-title">{item.title}</span>
        </button>
      </li>
    )
  }

  return (
    <section className="course-series-videos" aria-labelledby="course-series-videos-heading">
      <article className="course-series-topic content-card content-card--padded">
        <header className="course-series-topic-head">
          <div>
            <h2 id="course-series-videos-heading">{t.heading}</h2>
            <p className="course-series-videos-lead">
              {t.lead}
            </p>
          </div>
          {!loading ? <p className="course-series-count">{t.episodes(seriesItems.length)}</p> : null}
        </header>

        {loading ? <p className="course-series-videos-muted">{t.loading}</p> : null}
        {error ? <p className="course-series-videos-error">{error}</p> : null}

        {!loading && !seriesItems.length ? (
          <p className="course-series-videos-muted">{t.empty}</p>
        ) : activeItem ? (
          <div className="course-series-split">
            <div className="course-series-player-col">
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
                <div className="course-series-player-frame">
                  <video
                    key={activeItem.id}
                    controls
                    className="course-series-videos-player"
                    src={moduleAssetUrl(activeItem.id, mediaToken)}
                    preload="metadata"
                    playsInline
                  />
                </div>
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
            <aside className="course-series-siblings" aria-label={t.siblings}>
              <h3>{t.siblings}</h3>
              <ol className="course-series-toc">
                {seriesItems.map((item, index) => renderEpisodeButton(item, index))}
              </ol>
            </aside>
          </div>
        ) : (
          <ol className="course-series-toc">
            {seriesItems.map((item, index) => renderEpisodeButton(item, index))}
          </ol>
        )}
      </article>
    </section>
  )
}
