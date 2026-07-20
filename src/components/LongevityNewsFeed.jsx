import { useEffect, useMemo, useState } from 'react'
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

/**
 * 正式资讯阅读：栏目（像书架分区）→ 条目目录 → 点开阅读/打开资料
 */
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
      columns: '资讯栏目',
      toc: '本栏目目录',
      empty: '本栏目暂无正式稿件。管理员可在下方上传区按栏目归档。',
      loading: '加载中…',
      read: '阅读本篇',
      back: '返回目录',
      open: '打开/下载资料',
      source: '来源与检索',
      takeaways: '阅读要点',
      uploaded: '上传资料',
      link: '公众号/外链',
      editorial: '编辑稿',
      openWechat: '打开微信原文',
      login: '登录',
      upgrade: '升级会员',
    },
    en: {
      columns: 'Columns',
      toc: 'In this column',
      empty: 'No articles in this column yet.',
      loading: 'Loading…',
      read: 'Read',
      back: 'Back to list',
      open: 'Open / download',
      source: 'Sources',
      takeaways: 'Takeaways',
      uploaded: 'Uploaded file',
      link: 'External link',
      editorial: 'Editorial',
      openWechat: 'Open original',
      login: 'Login',
      upgrade: 'Upgrade',
    },
    ar: {
      columns: 'الأعمدة',
      toc: 'في هذا العمود',
      empty: 'لا مقالات بعد.',
      loading: 'جارٍ التحميل…',
      read: 'اقرأ',
      back: 'عودة للقائمة',
      open: 'فتح / تنزيل',
      source: 'المصادر',
      takeaways: 'نقاط',
      uploaded: 'ملف مرفوع',
      link: 'رابط خارجي',
      editorial: 'مقال تحريري',
      openWechat: 'فتح الأصل',
      login: 'تسجيل الدخول',
      upgrade: 'ترقية',
    },
  }[lang || 'zh']

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const token = getToken()
    ;(async () => {
      try {
        const res = await fetch(`/api/module-assets?module=longevity-news&ts=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))
        if (!cancelled && res.ok) setUploads(Array.isArray(data.items) ? data.items : [])
        else if (!cancelled) setUploads([])
      } catch {
        if (!cancelled) setUploads([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [getToken])

  const columnMeta = getLongevityNewsColumn(activeColumn)

  const entries = useMemo(() => {
    const staticOnes = getLongevityNewsArticles()
      .filter((a) => a.column === activeColumn)
      .map((a) => ({
        kind: 'editorial',
        id: a.id,
        title: a.title,
        summary: a.summary,
        takeaways: a.takeaways || [],
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
          takeaways: [],
          sourceNote: isLink ? '原文发布于外链（如微信公众号），完整内容以原文为准。' : '',
          url: extUrl,
          publishedAt: item.created_at ? String(item.created_at).slice(0, 10) : '',
          requiredLevel: item.content_level || item.required_level || columnMeta?.requiredLevel || 'free',
          canView: item.can_view !== false,
          mime: item.mime_type,
          rawRequired: item.required_level,
        }
      })
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))

    return [...staticOnes, ...uploadOnes]
  }, [activeColumn, uploads, user, columnMeta])

  const active = entries.find((e) => e.id === activeId) || null

  useEffect(() => {
    setActiveId('')
  }, [activeColumn])

  return (
    <section className="longevity-news-feed" aria-labelledby="ln-feed-columns">
      <h2 id="ln-feed-columns" className="longevity-news-feed-heading">
        {t.columns}
      </h2>
      <div className="longevity-news-feed-tabs" role="tablist">
        {LONGEVITY_NEWS_COLUMNS.map((col) => (
          <button
            key={col.id}
            type="button"
            role="tab"
            aria-selected={activeColumn === col.label}
            className={`longevity-news-feed-tab ${activeColumn === col.label ? 'active' : ''}`}
            onClick={() => setActiveColumn(col.label)}
          >
            {col.label}
            {shouldShowMembershipBadge(col.requiredLevel) ? (
              <span className={`membership-badge membership-${col.requiredLevel}`}>
                {getMembershipLevelLabel(col.requiredLevel, lang)}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {columnMeta ? (
        <p className="longevity-news-feed-blurb">{getLongevityNewsColumnBlurb(columnMeta, lang)}</p>
      ) : null}

      {loading ? <p className="longevity-news-feed-muted">{t.loading}</p> : null}

      {active ? (
        <article className="longevity-news-reader content-card content-card--padded">
          <button type="button" className="longevity-news-back" onClick={() => setActiveId('')}>
            ← {t.back}
          </button>
          <p className="longevity-news-feed-muted">
            {active.kind === 'link' ? t.link : active.kind === 'upload' ? t.uploaded : t.editorial}
            {active.publishedAt ? ` · ${active.publishedAt}` : ''}
          </p>
          <h3>{active.title}</h3>
          {!active.canView ? (
            <ContentLockNotice requiredLevel={active.rawRequired || active.requiredLevel} user={user} />
          ) : (
            <>
              {active.summary ? <p className="longevity-news-body">{active.summary}</p> : null}
              {active.takeaways?.length ? (
                <div className="longevity-news-takeaways">
                  <h4>{t.takeaways}</h4>
                  <ul>
                    {active.takeaways.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {active.sourceNote ? (
                <p className="longevity-news-feed-muted">
                  {t.source}：{active.sourceNote}
                </p>
              ) : null}
              {active.url ? (
                <p>
                  <a href={active.url} target="_blank" rel="noopener noreferrer" className="news-link">
                    {active.kind === 'link' ? t.openWechat : t.open} →
                  </a>
                </p>
              ) : null}
              {active.kind === 'upload' && active.assetId ? (
                isVideo(active.mime) ? (
                  <video
                    controls
                    className="longevity-news-media"
                    src={moduleAssetUrl(active.assetId, mediaToken)}
                    preload="metadata"
                  />
                ) : isImage(active.mime) ? (
                  <img
                    className="longevity-news-media"
                    src={moduleAssetUrl(active.assetId, mediaToken)}
                    alt={active.title}
                  />
                ) : (
                  <p>
                    <a
                      href={moduleAssetUrl(active.assetId, mediaToken)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      {t.open} →
                    </a>
                  </p>
                )
              ) : null}
            </>
          )}
        </article>
      ) : (
        <>
          <h3 className="longevity-news-toc-title">{t.toc}</h3>
          {!loading && !entries.length ? (
            <p className="longevity-news-feed-muted">{t.empty}</p>
          ) : (
            <ol className="longevity-news-toc">
              {entries.map((item, index) => (
                <li key={item.id} className="longevity-news-toc-item content-card content-card--padded">
                  <div className="longevity-news-toc-head">
                    <span className="longevity-news-toc-num">{index + 1}</span>
                    {shouldShowMembershipBadge(item.requiredLevel) ? (
                      <span className={`membership-badge membership-${item.requiredLevel}`}>
                        {getMembershipLevelLabel(item.requiredLevel, lang)}
                      </span>
                    ) : null}
                    <span className="longevity-news-kind">
                      {item.kind === 'link' ? t.link : item.kind === 'upload' ? t.uploaded : t.editorial}
                    </span>
                  </div>
                  <h4>{item.title}</h4>
                  {item.summary ? <p className="longevity-news-feed-muted">{item.summary}</p> : null}
                  {!item.canView ? (
                    <p className="longevity-news-lock-line">
                      {!user ? (
                        <Link to="/login">{t.login}</Link>
                      ) : (
                        <Link to="/payment">{t.upgrade}</Link>
                      )}
                    </p>
                  ) : (
                    <button type="button" className="btn-primary" onClick={() => setActiveId(item.id)}>
                      {t.read}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  )
}
