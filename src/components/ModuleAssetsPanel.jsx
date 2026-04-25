import { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CATEGORIES, COURSES, getCourseById } from '../data/courses'
import { PRODUCT_CATEGORIES, getProductById } from '../data/products'
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

function resolveLinkedSubtopic(payload) {
  return String(payload?.subtopicLabel || '').trim()
}

/** 与列表过滤、上传落库展示一致 */
function normalizeSubtopicValue(raw) {
  const s = String(raw || '').trim()
  return s || '待归类'
}

function normalizeAssetItem(moduleKey, item) {
  if (!item || typeof item !== 'object') return item
  return {
    ...item,
    subcategory: normalizeSubcategoryValue(moduleKey, item.subcategory),
    subtopic: normalizeSubtopicValue(item.subtopic),
  }
}

function resolveSubmitSubtopic(moduleKey, subcategoryValue, rawSubtopic) {
  const options = getSubtopicOptions(moduleKey, subcategoryValue)
  const normalized = normalizeSubtopicValue(rawSubtopic)
  if (!options.length) return normalized
  // 有预设细分类时，空值或不匹配都落到第一个合法项，避免进入“待归类”导致用户在目标细分类看不到
  return options.includes(normalized) ? normalized : options[0]
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
  const location = useLocation()
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
  const [editForm, setEditForm] = useState({ title: '', fileName: '', summary: '', subcategory: 'general', subtopic: '', requiredLevel: 'free' })
  const [savedItemId, setSavedItemId] = useState('')
  const [activeSubcategory, setActiveSubcategory] = useState('')
  const [activeSubtopic, setActiveSubtopic] = useState('')
  /** 上传成功后锁定亚类/细分类，避免 loadItems 后 routeBinding 把视图刷回当前路由课程 */
  const [pinnedSelection, setPinnedSelection] = useState(null)
  const lastRouteBindingKeyRef = useRef('')
  const isAdmin = Boolean(user?.site_admin)
  const subcategoryOptions = useMemo(() => getSubcategoryOptions(moduleKey), [moduleKey])
  const subtopicOptions = useMemo(() => getSubtopicOptions(moduleKey, subcategory), [moduleKey, subcategory])
  const editSubtopicOptions = useMemo(() => getSubtopicOptions(moduleKey, editForm.subcategory), [moduleKey, editForm.subcategory])
  const availableSubcategories = useMemo(() => {
    const normalizedPreset = subcategoryOptions.map((opt) => normalizeSubcategoryValue(moduleKey, opt))
    const fromItems = items.map((item) => normalizeSubcategoryValue(moduleKey, item.subcategory))
    return Array.from(new Set([...normalizedPreset, ...fromItems])).filter(Boolean)
  }, [items, moduleKey, subcategoryOptions])
  const latestItem = items[0] || null
  const routeBinding = useMemo(() => {
    if (moduleKey === 'health-skills') {
      const detailMatch = matchPath('/health-skills/:id', location.pathname)
      const learnMatch = matchPath('/health-skills/:id/learn', location.pathname)
      const id = detailMatch?.params?.id || learnMatch?.params?.id
      if (!id) return null
      const course = getCourseById(id)
      if (!course) return null
      const category = CATEGORIES.find((c) => c.id === course.category)
      return {
        subcategory: category?.label || '',
        subtopic: course.title || '',
      }
    }
    if (moduleKey === 'products') {
      const m = matchPath('/products/:id', location.pathname)
      if (!m?.params?.id) return null
      const product = getProductById(m.params.id)
      if (!product) return null
      const category = PRODUCT_CATEGORIES.find((c) => c.id === product.category)
      return {
        subcategory: category?.label || '',
        subtopic: '产品详情资料',
      }
    }
    return null
  }, [moduleKey, location.pathname])
  const visibleItems = useMemo(() => {
    if (!activeSubcategory) return []
    if (!activeSubtopic) return []
    return items.filter((item) => {
      const sub = normalizeSubcategoryValue(moduleKey, item.subcategory)
      const topic = normalizeSubtopicValue(item.subtopic)
      return sub === activeSubcategory && topic === activeSubtopic
    })
  }, [activeSubcategory, activeSubtopic, items, moduleKey])
  const activeSubtopicOptions = useMemo(() => {
    if (!activeSubcategory) return []
    const fromPreset = getSubtopicOptions(moduleKey, activeSubcategory)
    const fromItems = items
      .filter((item) => normalizeSubcategoryValue(moduleKey, item.subcategory) === activeSubcategory)
      .map((item) => normalizeSubtopicValue(item.subtopic))
    return Array.from(new Set([...fromItems, ...fromPreset]))
  }, [moduleKey, activeSubcategory, items])
  const t = useMemo(() => ({
    zh: {
      section: '模块资料',
      empty: '暂无资料。',
      loading: '加载中…',
      uploadTitle: '管理员上传',
      title: '标题',
      fileName: '资料名称',
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
      invalid: '请填写标题并选择文件',
      titleRequired: '请填写标题',
      fileRequired: '请选择文件',
      fileTooLarge: '文件超过 100MB，请压缩后再上传',
      uncategorized: '未分类',
      subcategoryContent: '按亚类查看资料',
      subtopicContent: '再选择二层分类后显示材料',
      emptySubtopic: '请选择二层分类查看对应资料',
      debugMapping: '当前映射',
    },
    en: {
      section: 'Module Assets',
      empty: 'No files yet.',
      loading: 'Loading…',
      uploadTitle: 'Admin Upload',
      title: 'Title',
      fileName: 'File Name',
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
      invalid: 'Please provide title and file.',
      titleRequired: 'Please provide a title.',
      fileRequired: 'Please choose a file.',
      fileTooLarge: 'File exceeds 100MB, please compress and retry.',
      uncategorized: 'Uncategorized',
      subcategoryContent: 'Browse by subcategory',
      subtopicContent: 'Select a second-level category to view materials',
      emptySubtopic: 'Please select a second-level category',
      debugMapping: 'Current Mapping',
    },
    ar: {
      section: 'ملفات الوحدة',
      empty: 'لا توجد ملفات بعد.',
      loading: 'جارٍ التحميل…',
      uploadTitle: 'رفع المسؤول',
      title: 'العنوان',
      fileName: 'اسم المادة',
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
      invalid: 'يرجى إدخال عنوان واختيار ملف.',
      titleRequired: 'يرجى إدخال العنوان.',
      fileRequired: 'يرجى اختيار ملف.',
      fileTooLarge: 'حجم الملف يتجاوز 100MB، يرجى ضغطه ثم إعادة الرفع.',
      uncategorized: 'غير مصنف',
      subcategoryContent: 'تصفح حسب التصنيف الفرعي',
      subtopicContent: 'اختر تصنيفًا فرعيًا أدق لعرض المواد',
      emptySubtopic: 'يرجى اختيار التصنيف الأدق',
      debugMapping: 'التعيين الحالي',
    },
  }[lang] || {}), [lang])

  async function loadItems() {
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      const res = await fetch(`/api/module-assets?module=${encodeURIComponent(moduleKey)}&ts=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'load failed')
      const normalized = Array.isArray(data.items)
        ? data.items.map((item) => normalizeAssetItem(moduleKey, item))
        : []
      setItems(normalized)
    } catch (e) {
      setError(e.message || 'load failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPinnedSelection(null)
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey])

  useEffect(() => {
    setPinnedSelection(null)
  }, [location.pathname])

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
    if (pinnedSelection) {
      if (activeSubcategory !== pinnedSelection.subcategory) {
        setActiveSubcategory(pinnedSelection.subcategory)
      }
      if (activeSubtopic !== pinnedSelection.subtopic) {
        setActiveSubtopic(pinnedSelection.subtopic)
      }
      return
    }
    if (availableSubcategories.length) {
      const exists = availableSubcategories.includes(activeSubcategory)
      if (!exists) {
        const latestSubcategory = normalizeSubcategoryValue(moduleKey, latestItem?.subcategory)
        const preferred = availableSubcategories.includes(latestSubcategory) ? latestSubcategory : ''
        setActiveSubcategory(preferred || availableSubcategories[0])
        setActiveSubtopic('')
      }
    } else {
      setActiveSubcategory('')
      setActiveSubtopic('')
    }
  }, [availableSubcategories, activeSubcategory, latestItem, moduleKey, pinnedSelection])

  useEffect(() => {
    const routeKey = `${moduleKey}:${location.pathname}`
    const isNewRoute = lastRouteBindingKeyRef.current !== routeKey
    if (!isNewRoute) return
    lastRouteBindingKeyRef.current = routeKey
    if (!routeBinding?.subcategory) return
    if (pinnedSelection) return
    setActiveSubcategory(routeBinding.subcategory)
    setActiveSubtopic(normalizeSubtopicValue(routeBinding.subtopic))
  }, [moduleKey, location.pathname, pinnedSelection, routeBinding])

  useEffect(() => {
    if (pinnedSelection) return
    if (!activeSubtopicOptions.length) {
      setActiveSubtopic('')
      return
    }
    if (!activeSubtopicOptions.includes(activeSubtopic)) {
      const latestSubtopic = normalizeSubtopicValue(latestItem?.subtopic)
      const preferred = activeSubtopicOptions.includes(latestSubtopic) ? latestSubtopic : activeSubtopicOptions[0]
      setActiveSubtopic(preferred)
    }
  }, [activeSubtopicOptions, activeSubtopic, latestItem, pinnedSelection])

  useEffect(() => {
    function onLinkedCategoryChange(event) {
      const detail = event?.detail || {}
      if (detail.moduleKey !== moduleKey) return
      const next = resolveLinkedSubcategory(moduleKey, detail, subcategoryOptions)
      if (!next) return
      setPinnedSelection(null)
      setActiveSubcategory(next)
      const linkedSubtopic = resolveLinkedSubtopic(detail)
      setActiveSubtopic(normalizeSubtopicValue(linkedSubtopic))
    }
    window.addEventListener('module-category-change', onLinkedCategoryChange)
    return () => window.removeEventListener('module-category-change', onLinkedCategoryChange)
  }, [moduleKey, subcategoryOptions])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setHint('')
    if (!isAdmin) return
    if (!title.trim()) {
      setError(t.titleRequired || t.invalid)
      return
    }
    if (!file) {
      setError(t.fileRequired || t.invalid)
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setError(t.fileTooLarge || t.invalid)
      return
    }
    setSubmitting(true)
    try {
      const submittedSubcategory = normalizeSubcategoryValue(moduleKey, subcategory.trim() || 'general')
      const submittedSubtopic = resolveSubmitSubtopic(moduleKey, submittedSubcategory, subtopic)
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
          subcategory: submittedSubcategory,
          subtopic: submittedSubtopic,
          requiredLevel,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          contentBase64,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.uploadFail)
      if (data?.item?.id) {
        const uploadedItem = normalizeAssetItem(moduleKey, data.item)
        setItems((prev) => [uploadedItem, ...prev.filter((it) => it.id !== uploadedItem.id)])
      }
      setTitle('')
      setSummary('')
      setSubcategory(subcategoryOptions[0] || 'general')
      const uploadedSubcategory = normalizeSubcategoryValue(moduleKey, data?.item?.subcategory || submittedSubcategory)
      const uploadedSubtopic = normalizeSubtopicValue(data?.item?.subtopic || submittedSubtopic)
      setPinnedSelection({ subcategory: uploadedSubcategory, subtopic: uploadedSubtopic })
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
      fileName: item.file_name || '',
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
      const savedSc = normalizeSubcategoryValue(moduleKey, editForm.subcategory)
      const savedSt = resolveSubmitSubtopic(moduleKey, savedSc, editForm.subtopic)
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
          fileName: editForm.fileName.trim(),
          summary: editForm.summary.trim(),
          subcategory: savedSc,
          subtopic: savedSt,
          requiredLevel: editForm.requiredLevel,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.saveFail)
      if (data?.item?.id) {
        const updatedItem = normalizeAssetItem(moduleKey, data.item)
        setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)))
      }
      const finalSc = normalizeSubcategoryValue(moduleKey, data?.item?.subcategory || savedSc)
      const finalSt = normalizeSubtopicValue(data?.item?.subtopic || savedSt)
      setPinnedSelection({ subcategory: finalSc, subtopic: finalSt })
      setActiveSubcategory(finalSc)
      setActiveSubtopic(finalSt)
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
      {isAdmin ? (
        <p className="module-assets-debug">
          <strong>{t.debugMapping}:</strong> module=`{moduleKey}` / subcategory=`{activeSubcategory || '-'}`
          {' '} / subtopic=`{activeSubtopic || '-'}`
        </p>
      ) : null}
      {isAdmin ? (
        <p className="module-assets-debug">
          items={items.length} / matched={visibleItems.length}
          {items[0] ? ` / latest=${items[0].subcategory || '-'} > ${items[0].subtopic || '-'}` : ''}
        </p>
      ) : null}
      {!loading && !items.length ? <p className="module-assets-muted">{t.empty}</p> : null}
      {availableSubcategories.length ? (
        <>
          <section className="module-assets-subtabs">
            <p className="module-assets-muted">{t.subcategoryContent}</p>
            <div className="module-assets-subtabs-row">
              {availableSubcategories.map((groupName) => (
                <button
                  key={groupName}
                  type="button"
                  className={`module-assets-subtab ${activeSubcategory === groupName ? 'active' : ''}`}
                  onClick={() => {
                    setPinnedSelection(null)
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
                  onClick={() => {
                    setPinnedSelection(null)
                    setActiveSubtopic(topic)
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>
          {!activeSubtopic ? <p className="module-assets-muted">{t.emptySubtopic}</p> : null}
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
                  item.subtopic || '待归类'
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
                    <span>{t.fileName}</span>
                    <input value={editForm.fileName} onChange={(e) => setEditForm((v) => ({ ...v, fileName: e.target.value }))} />
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
