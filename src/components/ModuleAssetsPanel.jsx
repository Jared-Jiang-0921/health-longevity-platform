import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CATEGORIES } from '../data/courses'
import { PRODUCT_CATEGORIES } from '../data/products'
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

function getSubcategoryOptions(moduleKey) {
  const courseCategories = CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.label)
  const productCategories = PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.label)
  const map = {
    'health-skills': courseCategories,
    products: productCategories,
    // 与页面现有结构/文案尽量一一对应
    'longevity-news': ['Nature Medicine', 'Cell', 'Lancet Healthy Longevity', 'Science', 'Aging Cell', 'Nature Aging'],
    'tcm-prevention': ['中草药单药', '经典处方'],
    'translation-opportunities': ['可转化项目', '商业模型', '合作机会', '投研资料', '政策与合规'],
    solutions: ['专业健康长寿咨询', '自我健康促进咨询', '内容资源', '健康问卷与评估'],
    'health-questionnaire': ['基础信息', '健康目标与关注', '病史与用药', '生活方式', '法律同意'],
    favorites: ['长寿知识技能收藏', '产品收藏', '资讯收藏', '精选推荐'],
    payment: ['会员套餐', '支付指引', '账单与发票', '退款与售后'],
    account: ['账号资料', '安全设置', '双因素认证', '登录与设备'],
    tax: ['税务说明', '税率规则', '申报模板', '地区政策'],
  }
  return map[moduleKey] || ['通用资料', '教程', '案例', '下载文件']
}

export default function ModuleAssetsPanel({ moduleKey }) {
  const { user, getToken } = useAuth()
  const { lang } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [subcategory, setSubcategory] = useState('general')
  const [requiredLevel, setRequiredLevel] = useState('free')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const isAdmin = Boolean(user?.site_admin)
  const subcategoryOptions = useMemo(() => getSubcategoryOptions(moduleKey), [moduleKey])
  const t = useMemo(() => ({
    zh: {
      section: '模块资料',
      empty: '暂无资料。',
      loading: '加载中…',
      uploadTitle: '管理员上传',
      title: '标题',
      summary: '摘要（可选）',
      subcategory: '亚类（例如：基础知识 / 课程 / 案例）',
      requiredLevel: '可见会员等级',
      choose: '选择文件',
      upload: '上传',
      uploading: '上传中…',
      open: '打开/下载',
      videoRestricted: '视频资源仅管理员可下载',
      levelTag: { free: '普通会员', standard: '标准会员', premium: '高级会员' },
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
      subcategory: 'Subcategory (e.g. basics/course/cases)',
      requiredLevel: 'Required member level',
      choose: 'Choose file',
      upload: 'Upload',
      uploading: 'Uploading…',
      open: 'Open / Download',
      videoRestricted: 'Video files are restricted to admins.',
      levelTag: { free: 'Free', standard: 'Standard', premium: 'Premium' },
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
      subcategory: 'تصنيف فرعي (مثل أساسيات/دورات/حالات)',
      requiredLevel: 'الحد الأدنى للعضوية',
      choose: 'اختر ملفًا',
      upload: 'رفع',
      uploading: 'جارٍ الرفع…',
      open: 'فتح / تنزيل',
      videoRestricted: 'ملفات الفيديو متاحة للتنزيل للمسؤول فقط.',
      levelTag: { free: 'مجاني', standard: 'قياسي', premium: 'متميز' },
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

  useEffect(() => {
    setSubcategory(subcategoryOptions[0] || 'general')
  }, [subcategoryOptions])

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
          subcategory: subcategory.trim() || 'general',
          requiredLevel,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          contentBase64,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.uploadFail)
      setTitle('')
      setSummary('')
      setSubcategory(subcategoryOptions[0] || 'general')
      setRequiredLevel('free')
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
              <p className="module-assets-meta">
                [{item.subcategory || 'general'}] · {t.levelTag?.[item.required_level] || item.required_level}
              </p>
              {item.summary ? <p className="module-assets-muted">{item.summary}</p> : null}
              {isImage(item.mime_type) ? <img src={`/api/module-assets/${item.id}`} alt={item.title} className="module-assets-image" /> : null}
              {isAudio(item.mime_type) ? <audio controls src={`/api/module-assets/${item.id}`} className="module-assets-media" /> : null}
              {isVideo(item.mime_type) ? (
                isAdmin ? <video controls src={`/api/module-assets/${item.id}`} className="module-assets-media" /> : <p className="module-assets-muted">{t.videoRestricted}</p>
              ) : null}
              {!isVideo(item.mime_type) || isAdmin ? (
                <a href={`/api/module-assets/${item.id}`} target="_blank" rel="noreferrer">{t.open}</a>
              ) : null}
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
            <span>{t.subcategory}</span>
            <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
              {subcategoryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.requiredLevel}</span>
            <select value={requiredLevel} onChange={(e) => setRequiredLevel(e.target.value)}>
              <option value="free">{t.levelTag?.free || 'free'}</option>
              <option value="standard">{t.levelTag?.standard || 'standard'}</option>
              <option value="premium">{t.levelTag?.premium || 'premium'}</option>
            </select>
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
