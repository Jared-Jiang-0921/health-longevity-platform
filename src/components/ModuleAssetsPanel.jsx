import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import './ModuleAssetsPanel.css'

function formatSize(bytes) {
  const n = Number(bytes || 0)
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(mime) {
  return String(mime || '').startsWith('image/')
}
function isAudio(mime) {
  return String(mime || '').startsWith('audio/')
}
function isVideo(mime) {
  return String(mime || '').startsWith('video/')
}

export default function ModuleAssetsPanel({ moduleKey }) {
  const { user, getToken } = useAuth()
  const { lang } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const isAdmin = Boolean(user?.site_admin)
  const t = useMemo(() => ({
    zh: {
      section: '模块资料',
      empty: '暂无资料。',
      loading: '加载中…',
      uploadTitle: '管理员上传',
      title: '标题',
      summary: '摘要（可选）',
      choose: '选择文件',
      upload: '上传',
      uploading: '上传中…',
      open: '打开/下载',
      uploadOk: '上传成功',
      uploadFail: '上传失败',
      invalid: '请填写标题并选择文件（支持图片/音频/视频/PDF/Word/Excel/PPT/TXT，<=50MB）',
    },
    en: {
      section: 'Module Assets',
      empty: 'No files yet.',
      loading: 'Loading…',
      uploadTitle: 'Admin Upload',
      title: 'Title',
      summary: 'Summary (optional)',
      choose: 'Choose file',
      upload: 'Upload',
      uploading: 'Uploading…',
      open: 'Open / Download',
      uploadOk: 'Upload successful',
      uploadFail: 'Upload failed',
      invalid: 'Please provide title and file (image/audio/video/PDF/Word/Excel/PPT/TXT, <=50MB).',
    },
    ar: {
      section: 'ملفات الوحدة',
      empty: 'لا توجد ملفات بعد.',
      loading: 'جارٍ التحميل…',
      uploadTitle: 'رفع المسؤول',
      title: 'العنوان',
      summary: 'الملخص (اختياري)',
      choose: 'اختر ملفًا',
      upload: 'رفع',
      uploading: 'جارٍ الرفع…',
      open: 'فتح / تنزيل',
      uploadOk: 'تم الرفع بنجاح',
      uploadFail: 'فشل الرفع',
      invalid: 'يرجى إدخال عنوان واختيار ملف (صور/صوت/فيديو/PDF/Word/Excel/PPT/TXT حتى 50MB).',
    },
  }[lang] || {}), [lang])

  async function loadItems() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/module-assets?module=${encodeURIComponent(moduleKey)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'load failed')
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e) {
      setError(e.message || 'load failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setHint('')
    if (!isAdmin) return
    if (!title.trim() || !file || file.size > 50 * 1024 * 1024) {
      setError(t.invalid)
      return
    }
    setSubmitting(true)
    try {
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
      const contentBase64 = btoa(binary)
      const token = getToken()
      const res = await fetch('/api/module-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          module: moduleKey,
          title: title.trim(),
          summary: summary.trim(),
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          contentBase64,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.uploadFail)
      setTitle('')
      setSummary('')
      setFile(null)
      setHint(t.uploadOk)
      await loadItems()
    } catch (err) {
      setError(err.message || t.uploadFail)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="module-assets-panel">
      <h3>{t.section}</h3>
      {loading ? <p className="module-assets-muted">{t.loading}</p> : null}
      {!loading && !items.length ? <p className="module-assets-muted">{t.empty}</p> : null}
      {items.length ? (
        <ul className="module-assets-list">
          {items.map((item) => (
            <li key={item.id}>
              <div className="module-assets-head">
                <strong>{item.title}</strong>
                <span className="module-assets-size">{formatSize(item.file_size)}</span>
              </div>
              {item.summary ? <p className="module-assets-muted">{item.summary}</p> : null}
              {isImage(item.mime_type) ? <img src={`/api/module-assets/${item.id}`} alt={item.title} className="module-assets-image" /> : null}
              {isAudio(item.mime_type) ? <audio controls src={`/api/module-assets/${item.id}`} className="module-assets-media" /> : null}
              {isVideo(item.mime_type) ? <video controls src={`/api/module-assets/${item.id}`} className="module-assets-media" /> : null}
              <a href={`/api/module-assets/${item.id}`} target="_blank" rel="noreferrer">{t.open}</a>
            </li>
          ))}
        </ul>
      ) : null}

      {isAdmin ? (
        <form className="module-assets-upload" onSubmit={onSubmit}>
          <h4>{t.uploadTitle}</h4>
          <label>
            <span>{t.title}</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span>{t.summary}</span>
            <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </label>
          <label>
            <span>{t.choose}</span>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {error ? <p className="module-assets-error">{error}</p> : null}
          {hint ? <p className="module-assets-hint">{hint}</p> : null}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? t.uploading : t.upload}
          </button>
        </form>
      ) : null}
    </section>
  )
}
