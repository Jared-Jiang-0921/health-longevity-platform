import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CATEGORIES } from '../data/courses'
import ContentLockNotice from './ContentLockNotice'
import './CourseSeriesVideos.css'

function isVideo(mime) {
  return String(mime || '').startsWith('video/')
}

/**
 * 课程页展示归入该系列合集（subtopic = 课程标题）的模块资料视频
 */
export default function CourseSeriesVideos({ course }) {
  const { lang } = useLocale()
  const { user, getToken } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categoryLabel = useMemo(
    () => CATEGORIES.find((c) => c.id === course?.category)?.label || '',
    [course?.category],
  )

  const seriesItems = useMemo(() => {
    const title = String(course?.title || '').trim()
    return items
      .filter((item) => {
        const sub = String(item.subcategory || '').trim()
        const topic = String(item.subtopic || '').trim()
        return topic === title && (!categoryLabel || sub === categoryLabel)
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [items, course?.title, categoryLabel])

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
      heading: '系列视频',
      empty: '本系列暂无视频，管理员可在页面底部资料区上传并选择对应「系列合集」。',
      loading: '加载中…',
      videoOnly: '以下为该系列收录的视频',
      open: '打开资料',
    },
    en: {
      heading: 'Series videos',
      empty: 'No videos in this series yet. Admins can upload under this series name in the assets panel below.',
      loading: 'Loading…',
      videoOnly: 'Videos in this collection',
      open: 'Open file',
    },
    ar: {
      heading: 'فيديوهات السلسلة',
      empty: 'لا توجد فيديوهات بعد.',
      loading: 'جارٍ التحميل…',
      videoOnly: 'فيديوهات هذه المجموعة',
      open: 'فتح',
    },
  }[lang || 'zh']

  return (
    <section className="course-series-videos" aria-labelledby="course-series-videos-heading">
      <h2 id="course-series-videos-heading">{t.heading}</h2>
      <p className="course-series-videos-lead">{t.videoOnly}</p>
      {loading ? <p className="course-series-videos-muted">{t.loading}</p> : null}
      {error ? <p className="course-series-videos-error">{error}</p> : null}
      {!loading && !seriesItems.length ? (
        <p className="course-series-videos-muted">{t.empty}</p>
      ) : (
        <ul className="course-series-videos-list">
          {seriesItems.map((item) => (
            <li key={item.id} className="course-series-videos-card">
              <h3 className="course-series-videos-title">{item.title}</h3>
              {item.summary ? <p className="course-series-videos-summary">{item.summary}</p> : null}
              {item.can_view === false ? (
                <ContentLockNotice requiredLevel={item.required_level} user={user} />
              ) : isVideo(item.mime_type) ? (
                <video
                  controls
                  className="course-series-videos-player"
                  src={`/api/module-assets/${item.id}`}
                  preload="metadata"
                />
              ) : (
                <p className="course-series-videos-muted">
                  <a href={`/api/module-assets/${item.id}`} target="_blank" rel="noreferrer">
                    {t.open}
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
