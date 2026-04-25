import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CATEGORIES, COURSES } from '../data/courses'
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

function normalizeSubcategoryValue(moduleKey, rawValue) {
  const value = String(rawValue || '').trim()
  if (!value) return 'general'

  if (moduleKey === 'health-skills') {
    const hit = CATEGORIES.find((c) => c.id === value || c.label === value)
    return hit?.label || value
  }
  if (moduleKey === 'products') {
    const hit = PRODUCT_CATEGORIES.find((c) => c.id === value || c.label === value)
    return hit?.label || value
  }
  return value
}

function resolveLinkedSubcategory(moduleKey, payload, options) {
  if (!payload) return ''
  const rawId = String(payload.categoryId || '').trim()
  const rawLabel = String(payload.categoryLabel || '').trim()
  if (rawId === 'all' || rawLabel === '全部') return ''

  const normalizedByLabel = normalizeSubcategoryValue(moduleKey, rawLabel)
  if (normalizedByLabel && options.includes(normalizedByLabel)) return normalizedByLabel

  const normalizedById = normalizeSubcategoryValue(moduleKey, rawId)
  if (normalizedById && options.includes(normalizedById)) return normalizedById

  return ''
}

function getSubtopicOptions(moduleKey, subcategoryLabel) {
  const label = String(subcategoryLabel || '').trim()
  if (!label) return []
  if (moduleKey === 'health-skills') {
    const category = CATEGORIES.find((c) => c.label === label || c.id === label)
    if (!category) return []
    return COURSES
      .filter((course) => course.category === category.id)
      .map((course) => course.title)
  }
  if (moduleKey === 'products') return ['产品详情资料']
  return []
}

export default function ModuleAssetsPanel({ moduleKey }) {
  const { user, getToken } = useAuth()
  const { lang } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [subcategory, setSubcategory] = useState('general')
  const [subtopic, setSubtopic] = useState('')
  const [requiredLevel, setRequiredLevel] = useState('free')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState({ title: '', summary: '', subcategory: 'general', subtopic: '', requiredLevel: 'free' })
  const [savedItemId, setSavedItemId] = useState('')
  const [activeSubcategory, setActiveSubcategory] = useState('')
  const [activeSubtopic, setActiveSubtopic] = useState('')
  const isAdmin = Boolean(user?.site_admin)
  const subcategoryOptions = useMemo(() => getSubcategoryOptions(moduleKey), [moduleKey])
  const subtopicOptions = useMemo(() => getSubtopicOptions(moduleKey, subcategory), [moduleKey, subcategory])
  const editSubtopicOptions = useMemo(() => getSubtopicOptions(moduleKey, editForm.subcategory), [moduleKey, editForm.subcategory])
  const groupedItems = useMemo(() => {
    const buckets = new Map()
    subcategoryOptions.forEach((opt) => buckets.set(opt, []))
    items.forEach((item) => {
      const key = String(item.subcategory || '').trim() || 'general'
      if (!buckets.has(key)) buckets.set(key, [])
      buckets.get(key).push(item)
    })
    return Array.from(buckets.entries()).filter(([, list]) => list.length)
  }, [items, subcategoryOptions])
  const visibleItems = useMemo(() => {
    if (!activeSubcategory) return []
    const subcategoryMatched = items.filter((item) => {
      const sub = String(item.subcategory || '').trim() || 'general'
      return sub === activeSubcategory
    })
    // 管理员默认可见当前一级分类下全部内容；选择二层后再精确筛选
    if (isAdmin && !activeSubtopic) return subcategoryMatched
    if (!activeSubtopic) return []
    return subcategoryMatched.filter((item) => {
      const topic = String(item.subtopic || '').trim() || '未细分'
      return topic === activeSubtopic
    })
  }, [activeSubcategory, activeSubtopic, items, isAdmin])
  const activeSubtopicOptions = useMemo(() => {
    if (!activeSubcategory) return []
    const fromPreset = getSubtopicOptions(moduleKey, activeSubcategory)
    const fromItems = items
      .filter((item) => String(item.subcategory || '').trim() === activeSubcategory)
      .map((item) => String(item.subtopic || '').trim() || '未细分')
    return Array.from(new Set([...fromPreset, ...fromItems]))
  }, [moduleKey, activeSubcategory, items])
  const t = useMemo(() => ({
    zh: {
      section: '模块资料',
      empty: '暂无资料。',
      loading: '加载中…',
      uploadTitle: '管理员上传',
      title: '标题',
      summary: '摘要（可选）',
      subcategory: '亚类（例如：基础知识 / 课程 / 案例）',
      subtopic: '二级维度（例如：长寿基础知识入门）',
      requiredLevel: '可见会员等级',
      choose: '选择文件',
      upload: '上传',
      uploading: '上传中…',
      open: '打开/下载',
      edit: '编辑',
      save: '保存',
      saving: '保存中…',
      cancel: '取消',
      remove: '删除',
      removing: '删除中…',
      removeConfirm: '确定删除该资料吗？删除后不可恢复。',
      saveOk: '保存成功',
      removeOk: '删除成功',
      removeFail: '删除失败',
      saveFail: '保存失败',
      videoRestricted: '视频资源仅管理员可下载',
      levelTag: { free: '普通会员', standard: '标准会员', premium: '高级会员' },
      uploadOk: '上传成功',
      uploadFail: '上传失败',
      invalid: '请填写标题并选择文件（支持图片/音频/视频/PDF/Word/Excel/PPT/TXT，<=50MB）',
      uncategorized: '未分类',
      subcategoryContent: '按亚类查看资料',
      subtopicContent: '再选择二层分类后显示材料',
      emptySubtopic: '请选择二层分类查看对应资料',
      adminAllVisible: '管理员：当前显示该一级分类下全部资料；选择二层可继续筛选。',
    },
    en: {
      section: 'Module Assets',
      empty: 'No files yet.',
      loading: 'Loading…',
      uploadTitle: 'Admin Upload',
      title: 'Title',
      summary: 'Summary (optional)',
      subcategory: 'Subcategory (e.g. basics/course/cases)',
      subtopic: 'Subtopic (e.g. Longevity Basics Intro)',
      requiredLevel: 'Required member level',
      choose: 'Choose file',
      upload: 'Upload',
      uploading: 'Uploading…',
      open: 'Open / Download',
      edit: 'Edit',
      save: 'Save',
      saving: 'Saving…',
      cancel: 'Cancel',
      remove: 'Delete',
      removing: 'Deleting…',
      removeConfirm: 'Delete this material? This action cannot be undone.',
      saveOk: 'Saved',
      removeOk: 'Deleted',
      removeFail: 'Delete failed',
      saveFail: 'Save failed',
      videoRestricted: 'Video files are restricted to admins.',
      levelTag: { free: 'Free', standard: 'Standard', premium: 'Premium' },
      uploadOk: 'Upload successful',
      uploadFail: 'Upload failed',
      invalid: 'Please provide title and file (image/audio/video/PDF/Word/Excel/PPT/TXT, <=50MB).',
      uncategorized: 'Uncategorized',
      subcategoryContent: 'Browse by subcategory',
      subtopicContent: 'Select a second-level category to view materials',
      emptySubtopic: 'Please select a second-level category',
      adminAllVisible: 'Admin: all materials in this subcategory are shown; select a subtopic to filter.',
    },
    ar: {
      section: 'ملفات الوحدة',
      empty: 'لا توجد ملفات بعد.',
      loading: 'جارٍ التحميل…',
      uploadTitle: 'رفع المسؤول',
      title: 'العنوان',
      summary: 'الملخص (اختياري)',
      subcategory: 'تصنيف فرعي (مثل أساسيات/دورات/حالات)',
      subtopic: 'تصنيف أدق (مثل مقدمة أساسيات طول العمر)',
      requiredLevel: 'الحد الأدنى للعضوية',
      choose: 'اختر ملفًا',
      upload: 'رفع',
      uploading: 'جارٍ الرفع…',
      open: 'فتح / تنزيل',
      edit: 'تعديل',
      save: 'حفظ',
      saving: 'جارٍ الحفظ…',
      cancel: 'إلغاء',
      remove: 'حذف',
      removing: 'جارٍ الحذف…',
      removeConfirm: 'هل تريد حذف هذه المادة؟ لا يمكن التراجع عن هذا الإجراء.',
      saveOk: 'تم الحفظ',
      removeOk: 'تم الحذف',
      removeFail: 'فشل الحذف',
      saveFail: 'فشل الحفظ',
      videoRestricted: 'ملفات الفيديو متاحة للتنزيل للمسؤول فقط.',
      levelTag: { free: 'مجاني', standard: 'قياسي', premium: 'متميز' },
      uploadOk: 'تم الرفع بنجاح',
      uploadFail: 'فشل الرفع',
      invalid: 'يرجى إدخال عنوان واختيار ملف (صور/صوت/فيديو/PDF/Word/Excel/PPT/TXT حتى 50MB).',
      uncategorized: 'غير مصنف',
      subcategoryContent: 'تصفح حسب التصنيف الفرعي',
      subtopicContent: 'اختر تصنيفًا فرعيًا أدق لعرض المواد',
      emptySubtopic: 'يرجى اختيار التصنيف الأدق',
      adminAllVisible: 'للمسؤول: يتم عرض كل مواد هذا التصنيف الفرعي؛ اختر تصنيفًا أدق للتصفية.',
    },
  }[lang] || {}), [lang])

  async function loadItems() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/module-assets?module=${encodeURIComponent(moduleKey)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'load failed')
      const normalized = Array.isArray(data.items)
        ? data.items.map((item) => ({
          ...item,
          subcategory: normalizeSubcategoryValue(moduleKey, item.subcategory),
        }))
        : []
      setItems(normalized)
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

  useEffect(() => {
    if (!subtopicOptions.length) {
      setSubtopic('')
      return
    }
    const exists = subtopicOptions.includes(subtopic)
    if (!exists) setSubtopic(subtopicOptions[0])
  }, [subtopicOptions, subtopic])

  useEffect(() => {
    if (!editingId) return
    if (!editSubtopicOptions.length) {
      setEditForm((v) => ({ ...v, subtopic: '' }))
      return
    }
    if (!editSubtopicOptions.includes(editForm.subtopic)) {
      setEditForm((v) => ({ ...v, subtopic: editSubtopicOptions[0] }))
    }
  }, [editingId, editSubtopicOptions, editForm.subtopic])

  useEffect(() => {
    if (groupedItems.length) {
      const exists = groupedItems.some(([name]) => name === activeSubcategory)
      if (!exists) {
        setActiveSubcategory(groupedItems[0][0])
        setActiveSubtopic('')
      }
    } else {
      setActiveSubcategory('')
      setActiveSubtopic('')
    }
  }, [groupedItems, activeSubcategory])

  useEffect(() => {
    if (!activeSubtopicOptions.length) {
      setActiveSubtopic('')
      return
    }
    if (!activeSubtopicOptions.includes(activeSubtopic)) {
      setActiveSubtopic('')
    }
  }, [activeSubtopicOptions, activeSubtopic])

  useEffect(() => {
    function onLinkedCategoryChange(event) {
      const detail = event?.detail || {}
      if (detail.moduleKey !== moduleKey) return
      const next = resolveLinkedSubcategory(moduleKey, detail, subcategoryOptions)
      if (!next) return
      setActiveSubcategory(next)
      setActiveSubtopic('')
    }
    window.addEventListener('module-category-change', onLinkedCategoryChange)
    return () => window.removeEventListener('module-category-change', onLinkedCategoryChange)
  }, [moduleKey, subcategoryOptions])

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
          subtopic: subtopic.trim(),
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
      const uploadedSubcategory = subcategory.trim() || 'general'
      const uploadedSubtopic = subtopic.trim() || '未细分'
      setActiveSubcategory(uploadedSubcategory)
      setActiveSubtopic(uploadedSubtopic)
      setSubtopic('')
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

  function startEdit(item) {
    setError('')
    setHint('')
    setSavedItemId('')
    setEditingId(item.id)
    setEditForm({
      title: item.title || '',
      summary: item.summary || '',
      subcategory: normalizeSubcategoryValue(moduleKey, item.subcategory) || subcategoryOptions[0] || 'general',
      subtopic: item.subtopic || '',
      requiredLevel: item.required_level || 'free',
    })
  }

  async function saveEdit() {
    if (!editingId) return
    setError('')
    setHint('')
    setSavedItemId('')
    if (!editForm.title.trim()) {
      setError(t.invalid)
      return
    }
    setSavingEdit(true)
    try {
      const token = getToken()
      const res = await fetch('/api/module-assets', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: editingId,
          title: editForm.title.trim(),
          summary: editForm.summary.trim(),
          subcategory: editForm.subcategory,
          subtopic: editForm.subtopic,
          requiredLevel: editForm.requiredLevel,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.saveFail)
      setHint(t.saveOk)
      setSavedItemId(editingId)
      await loadItems()
    } catch (e) {
      setError(e.message || t.saveFail)
    } finally {
      setSavingEdit(false)
    }
  }

  async function removeItem(id) {
    if (!id || !isAdmin) return
    if (!window.confirm(t.removeConfirm)) return
    setError('')
    setHint('')
    setDeletingId(id)
    try {
      const token = getToken()
      const res = await fetch(`/api/module-assets/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.removeFail)
      if (editingId === id) setEditingId('')
      setHint(t.removeOk)
      await loadItems()
    } catch (e) {
      setError(e.message || t.removeFail)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <section className="module-assets-panel">
      <h3>{t.section}</h3>
      {loading ? <p className="module-assets-muted">{t.loading}</p> : null}
      {!loading && !items.length ? <p className="module-assets-muted">{t.empty}</p> : null}
      {groupedItems.length ? (
        <>
          <section className="module-assets-subtabs">
            <p className="module-assets-muted">{t.subcategoryContent}</p>
            <div className="module-assets-subtabs-row">
              {groupedItems.map(([groupName]) => (
                <button
                  key={groupName}
                  type="button"
                  className={`module-assets-subtab ${activeSubcategory === groupName ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSubcategory(groupName)
                    setActiveSubtopic('')
                  }}
                >
                  {groupName === 'general' ? t.uncategorized : groupName}
                </button>
              ))}
            </div>
          </section>
          <section className="module-assets-subtabs">
            <p className="module-assets-muted">{t.subtopicContent}</p>
            <div className="module-assets-subtabs-row">
              {activeSubtopicOptions.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className={`module-assets-subtab ${activeSubtopic === topic ? 'active' : ''}`}
                  onClick={() => setActiveSubtopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>
          {isAdmin && !activeSubtopic ? <p className="module-assets-muted">{t.adminAllVisible}</p> : null}
          {!isAdmin && !activeSubtopic ? <p className="module-assets-muted">{t.emptySubtopic}</p> : null}
          <ul className="module-assets-list">
            {visibleItems.map((item) => (
              <li key={item.id} className="module-assets-card">
              <div className="module-assets-head">
                <strong className="module-assets-title">{item.title}</strong>
                <span className="module-assets-size module-assets-pill">{formatSize(item.file_size)}</span>
              </div>
              {isAdmin ? (
                <p className="module-assets-actions">
                  <button type="button" className="btn-linkish" onClick={() => startEdit(item)}>{t.edit}</button>
                  <button
                    type="button"
                    className="btn-linkish btn-linkish-danger"
                    onClick={() => removeItem(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? t.removing : t.remove}
                  </button>
                </p>
              ) : null}
              <p className="module-assets-meta">
                <span className="module-assets-pill">{
                  item.subcategory || 'general'
                }</span>
                <span className="module-assets-pill">{
                  item.subtopic || '未细分'
                }</span>
                <span className="module-assets-pill module-assets-pill-level">{t.levelTag?.[item.required_level] || item.required_level}</span>
              </p>
              {isAdmin && savedItemId === item.id ? <p className="module-assets-hint">{t.saveOk}</p> : null}
              {item.summary ? <p className="module-assets-muted">{item.summary}</p> : null}
              {isImage(item.mime_type) ? <img src={`/api/module-assets/${item.id}`} alt={item.title} className="module-assets-image" /> : null}
              {isAudio(item.mime_type) ? <audio controls src={`/api/module-assets/${item.id}`} className="module-assets-media" /> : null}
              {isVideo(item.mime_type) ? (
                isAdmin ? <video controls src={`/api/module-assets/${item.id}`} className="module-assets-media" /> : <p className="module-assets-muted">{t.videoRestricted}</p>
              ) : null}
              {!isVideo(item.mime_type) || isAdmin ? (
                <p className="module-assets-actions">
                  <a className="module-assets-open-link" href={`/api/module-assets/${item.id}`} target="_blank" rel="noreferrer">{t.open}</a>
                </p>
              ) : null}
              {isAdmin && editingId === item.id ? (
                <form className="module-assets-upload module-assets-edit-inline" onSubmit={(e) => { e.preventDefault(); saveEdit() }}>
                  <h4>{t.edit}</h4>
                  <label>
                    <span>{t.title}</span>
                    <input value={editForm.title} onChange={(e) => setEditForm((v) => ({ ...v, title: e.target.value }))} />
                  </label>
                  <label>
                    <span>{t.summary}</span>
                    <textarea rows={3} value={editForm.summary} onChange={(e) => setEditForm((v) => ({ ...v, summary: e.target.value }))} />
                  </label>
                  <label>
                    <span>{t.subcategory}</span>
                    <select value={editForm.subcategory} onChange={(e) => setEditForm((v) => ({ ...v, subcategory: e.target.value }))}>
                      {subcategoryOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{t.subtopic}</span>
                    <select
                      value={editForm.subtopic}
                      onChange={(e) => setEditForm((v) => ({ ...v, subtopic: e.target.value }))}
                      disabled={!editSubtopicOptions.length}
                    >
                      {!editSubtopicOptions.length ? <option value="">-</option> : null}
                      {editSubtopicOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{t.requiredLevel}</span>
                    <select value={editForm.requiredLevel} onChange={(e) => setEditForm((v) => ({ ...v, requiredLevel: e.target.value }))}>
                      <option value="free">{t.levelTag?.free || 'free'}</option>
                      <option value="standard">{t.levelTag?.standard || 'standard'}</option>
                      <option value="premium">{t.levelTag?.premium || 'premium'}</option>
                    </select>
                  </label>
                  <p className="module-assets-actions">
                    <button type="submit" className="btn-primary" disabled={savingEdit}>
                      {savingEdit ? t.saving : t.save}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setEditingId('')}>{t.cancel}</button>
                  </p>
                  {error ? <p className="module-assets-error">{error}</p> : null}
                  {hint ? <p className="module-assets-hint">{hint}</p> : null}
                </form>
              ) : null}
              </li>
            ))}
          </ul>
        </>
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
            <span>{t.subtopic}</span>
            <select value={subtopic} onChange={(e) => setSubtopic(e.target.value)} disabled={!subtopicOptions.length}>
              {!subtopicOptions.length ? <option value="">-</option> : null}
              {subtopicOptions.map((opt) => (
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
