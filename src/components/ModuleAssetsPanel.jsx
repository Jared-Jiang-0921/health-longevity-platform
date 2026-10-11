import { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CATEGORIES, getCourseById } from '../data/courses'
import { getCanonicalSeriesSubtopic } from '../data/healthSkillsSeries'
import {
  getModuleAssetFieldLabels,
  getModuleAssetSubcategories,
  getModuleAssetSubtopics,
} from '../data/moduleAssetTaxonomy'
import ContentLockNotice from './ContentLockNotice'
import { shouldShowMembershipBadge } from '../data/membership'
import { fileToBase64 } from '../lib/fileBase64'
import { adminLevelValue } from '../lib/contentLevelAdmin'
import { moduleAssetUrl } from '../lib/moduleAssetUrl'
import './ModuleAssetsPanel.css'

function notifyModuleAssetsUpdated(moduleKey) {
  window.dispatchEvent(new CustomEvent('module-assets-updated', { detail: { module: moduleKey } }))
}

/** 批量导入：每行「标题 | https://...」或「标题 https://...」 */
function parseBulkLinkLines(text) {
  const rows = []
  const errors = []
  String(text || '').split(/\r?\n/).forEach((raw, idx) => {
    const line = raw.trim()
    if (!line || line.startsWith('#')) return
    let title = ''
    let url = ''
    if (line.includes('|')) {
      const parts = line.split('|').map((s) => s.trim()).filter(Boolean)
      url = parts[parts.length - 1] || ''
      title = parts.slice(0, -1).join(' | ')
    } else {
      const m = line.match(/^(.*?)(https?:\/\/\S+)\s*$/i)
      if (m) {
        title = m[1].trim()
        url = m[2].trim()
      }
    }
    const n = idx + 1
    if (!url || !/^https?:\/\//i.test(url)) {
      errors.push(`第 ${n} 行：缺少有效链接`)
      return
    }
    if (!title) {
      errors.push(`第 ${n} 行：缺少标题`)
      return
    }
    rows.push({ title: title.slice(0, 200), url: url.slice(0, 2000) })
  })
  return { rows, errors }
}

function uploadErrorMessage(err, t, lang) {
  const msg = String(err?.message || '')
  if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.includes('Load failed')) {
    return t.uploadNetworkFail || t.uploadFail
  }
  return msg || t.uploadFail
}

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
  return getModuleAssetSubcategories(moduleKey)
}

function normalizeSubcategoryValue(moduleKey, rawValue) {
  const value = String(rawValue || '').trim()
  if (!value) return 'general'

  if (moduleKey === 'health-skills') {
    const hit = CATEGORIES.find((c) => c.id === value || c.label === value)
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
  if (!s) return '待归类'
  return s
}

function canonicalSubtopic(moduleKey, raw) {
  if (moduleKey !== 'health-skills') return normalizeSubtopicValue(raw)
  const c = getCanonicalSeriesSubtopic(raw)
  return c || normalizeSubtopicValue(raw)
}

function normalizeAssetItem(moduleKey, item) {
  if (!item || typeof item !== 'object') return item
  return {
    ...item,
    subcategory: normalizeSubcategoryValue(moduleKey, item.subcategory),
    subtopic: canonicalSubtopic(moduleKey, item.subtopic),
  }
}

function resolveSubmitSubtopic(moduleKey, subcategoryValue, rawSubtopic) {
  if (moduleKey === 'health-skills') {
    return getCanonicalSeriesSubtopic(rawSubtopic) || ''
  }
  const normalized = normalizeSubtopicValue(rawSubtopic)
  const options = getSubtopicOptions(moduleKey, subcategoryValue)
  if (!options.length) return normalized
  return options.includes(normalized) ? normalized : options[0]
}

function getSubtopicOptions(moduleKey, subcategoryLabel) {
  return getModuleAssetSubtopics(moduleKey, subcategoryLabel)
}

function mergeSubtopicOptions(moduleKey, subcategoryLabel, baseOptions, items) {
  if (moduleKey !== 'health-skills') return baseOptions
  const label = normalizeSubcategoryValue(moduleKey, subcategoryLabel)
  const fromItems = items
    .filter((item) => normalizeSubcategoryValue(moduleKey, item.subcategory) === label)
    .map((item) => canonicalSubtopic(moduleKey, item.subtopic))
    .filter((t) => t && t !== '待归类')
  return Array.from(new Set([...baseOptions, ...fromItems]))
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
  const [requiredLevel, setRequiredLevel] = useState('public')
  const [file, setFile] = useState(null)
  const [externalUrl, setExternalUrl] = useState('')
  const [uploadMode, setUploadMode] = useState(() => (moduleKey === 'longevity-news' ? 'link' : 'file'))
  const [bulkText, setBulkText] = useState('')
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState({
    title: '',
    fileName: '',
    summary: '',
    subcategory: 'general',
    subtopic: '',
    requiredLevel: 'public',
    externalUrl: '',
  })
  const [savedItemId, setSavedItemId] = useState('')
  const [activeSubcategory, setActiveSubcategory] = useState('')
  const [activeSubtopic, setActiveSubtopic] = useState('')
  /** 上传成功后锁定亚类/细分类，避免 loadItems 后 routeBinding 把视图刷回当前路由课程 */
  const [pinnedSelection, setPinnedSelection] = useState(null)
  const lastRouteBindingKeyRef = useRef('')
  const isAdmin = Boolean(user?.site_admin)
  const subcategoryOptions = useMemo(() => getSubcategoryOptions(moduleKey), [moduleKey])
  const subtopicOptions = useMemo(
    () => mergeSubtopicOptions(moduleKey, subcategory, getSubtopicOptions(moduleKey, subcategory), items),
    [moduleKey, subcategory, items],
  )
  const editSubtopicOptions = useMemo(
    () => mergeSubtopicOptions(moduleKey, editForm.subcategory, getSubtopicOptions(moduleKey, editForm.subcategory), items),
    [moduleKey, editForm.subcategory, items],
  )
  /** 非管理员只看到已有实际上传资料的亚类；规划/示例预设仅管理员用于上传分类 */
  const availableSubcategories = useMemo(() => {
    const fromItems = items.map((item) => normalizeSubcategoryValue(moduleKey, item.subcategory))
    if (!isAdmin) {
      return Array.from(new Set(fromItems)).filter(Boolean)
    }
    const normalizedPreset = subcategoryOptions.map((opt) => normalizeSubcategoryValue(moduleKey, opt))
    return Array.from(new Set([...normalizedPreset, ...fromItems])).filter(Boolean)
  }, [items, moduleKey, subcategoryOptions, isAdmin])
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
    return null
  }, [moduleKey, location.pathname])
  const visibleItems = useMemo(() => {
    if (!activeSubcategory) return []
    if (!activeSubtopic) return []
    return items.filter((item) => {
      const sub = normalizeSubcategoryValue(moduleKey, item.subcategory)
      const topic = canonicalSubtopic(moduleKey, item.subtopic)
      const activeTopic = canonicalSubtopic(moduleKey, activeSubtopic)
      return sub === activeSubcategory && topic === activeTopic
    })
  }, [activeSubcategory, activeSubtopic, items, moduleKey])
  const activeSubtopicOptions = useMemo(() => {
    if (!activeSubcategory) return []
    const fromItems = items
      .filter((item) => normalizeSubcategoryValue(moduleKey, item.subcategory) === activeSubcategory)
      .map((item) => canonicalSubtopic(moduleKey, item.subtopic))
    if (!isAdmin) {
      return Array.from(new Set(fromItems)).filter((t) => t && t !== '待归类')
    }
    const fromPreset = getSubtopicOptions(moduleKey, activeSubcategory)
    return Array.from(new Set([...fromItems, ...fromPreset])).filter((t) => t && t !== '待归类')
  }, [moduleKey, activeSubcategory, items, isAdmin])
  const t = useMemo(() => {
    const pack = {
    zh: {
      section: '模块资料',
      empty: '暂无资料。',
      loading: '加载中…',
      uploadTitle: '管理员上传',
      uploadModeFile: '上传文件',
      uploadModeLink: '发布链接',
      externalUrl: '文章链接（微信公众号等）',
      externalUrlPh: 'https://mp.weixin.qq.com/...',
      externalUrlRequired: '请填写 http/https 链接',
      linkHint: '适合公众号文章：填标题与原文链接即可。请把研究主题写进标题（如 NMN、衰老时钟），本站会自动抽出关键词做成检索卡片；微信全文无法嵌进本站。',
      uploadModeBulk: '批量导入',
      bulkHint: '每行一篇。格式：文章标题 | https://mp.weixin.qq.com/s/……  栏目与会员等级用下面的下拉框统一设置。',
      bulkPh: '睡眠与长寿：最新综述怎么读 | https://mp.weixin.qq.com/s/xxxx\nNMN 争议观察 | https://mp.weixin.qq.com/s/yyyy',
      bulkEmpty: '请粘贴至少一行「标题 | 链接」。',
      bulkResult: (ok, fail) => `完成：成功 ${ok} 篇${fail ? `，失败 ${fail} 篇` : ''}。`,
      openLink: '打开原文',
      linkTag: '外链',
      title: '标题',
      fileName: '资料名称',
      summary: '摘要（可选）',
      subcategory: '课程大类（亚类）',
      subtopic: '系列合集（如：老年人7分钟力量训练）',
      seriesHint: '上传视频时请选择与课程系列一致的「系列合集」，视频会显示在该系列课程页。',
      seriesRequired: '请选择系列合集',
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
      levelTag: { public: '公开（游客可看）', standard: '标准会员', premium: '高级会员' },
      uploadOk: '上传成功',
      uploadFail: '上传失败',
      invalid: '请填写标题并选择文件',
      titleRequired: '请填写标题',
      fileRequired: '请选择文件',
      fileTooLarge: '文件超过 100MB，请压缩后再上传',
      uploadNetworkFail: '上传失败：视频/大文件请压缩到约 40MB 以内；若仍失败，需服务器 Nginx 放开上传大小（client_max_body_size ≥ 120m）',
      uncategorized: '未分类',
      subcategoryContent: '按亚类查看资料',
      subtopicContent: '再选择二层分类后显示材料',
      emptySubtopic: '请选择二层分类查看对应资料',
    },
    en: {
      section: 'Module Assets',
      empty: 'No files yet.',
      loading: 'Loading…',
      uploadTitle: 'Admin Upload',
      uploadModeFile: 'Upload file',
      uploadModeLink: 'Publish link',
      externalUrl: 'Article URL (WeChat etc.)',
      externalUrlPh: 'https://mp.weixin.qq.com/...',
      externalUrlRequired: 'Please enter an http/https URL',
      linkHint: 'For WeChat posts: title, summary, and original URL—no file needed. Full articles cannot be embedded; readers open the original.',
      uploadModeBulk: 'Bulk import',
      bulkHint: 'One article per line: Title | https://mp.weixin.qq.com/s/…  Column and membership use the dropdowns below.',
      bulkPh: 'Sleep and longevity | https://mp.weixin.qq.com/s/xxxx',
      bulkEmpty: 'Paste at least one “title | URL” line.',
      bulkResult: (ok, fail) => `Done: ${ok} published${fail ? `, ${fail} failed` : ''}.`,
      openLink: 'Open original',
      linkTag: 'Link',
      title: 'Title',
      fileName: 'File Name',
      summary: 'Summary (optional)',
      subcategory: 'Category',
      subtopic: 'Series collection',
      seriesHint: 'Pick the series name; videos appear on that series course page.',
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
      levelTag: { public: 'Public (guests OK)', standard: 'Standard', premium: 'Premium' },
      uploadOk: 'Upload successful',
      uploadFail: 'Upload failed',
      invalid: 'Please provide title and file.',
      titleRequired: 'Please provide a title.',
      fileRequired: 'Please choose a file.',
      fileTooLarge: 'File exceeds 100MB, please compress and retry.',
      uploadNetworkFail: 'Upload failed: compress video to ~40MB or less; server may need larger Nginx client_max_body_size (≥120m).',
      uncategorized: 'Uncategorized',
      subcategoryContent: 'Browse by subcategory',
      subtopicContent: 'Select a second-level category to view materials',
      emptySubtopic: 'Please select a second-level category',
    },
    ar: {
      section: 'ملفات الوحدة',
      empty: 'لا توجد ملفات بعد.',
      loading: 'جارٍ التحميل…',
      uploadTitle: 'رفع المسؤول',
      uploadModeFile: 'رفع ملف',
      uploadModeLink: 'نشر رابط',
      externalUrl: 'رابط المقال',
      externalUrlPh: 'https://mp.weixin.qq.com/...',
      externalUrlRequired: 'يرجى إدخال رابط http/https',
      linkHint: 'لمقالات WeChat: العنوان والملخص والرابط دون ملف. لا يمكن تضمين المقال كاملاً.',
      uploadModeBulk: 'استيراد جماعي',
      bulkHint: 'سطر لكل مقال: العنوان | https://mp.weixin.qq.com/s/…',
      bulkPh: 'النوم وطول العمر | https://mp.weixin.qq.com/s/xxxx',
      bulkEmpty: 'الصق سطرًا واحدًا على الأقل: عنوان | رابط.',
      bulkResult: (ok, fail) => `تم: نُشر ${ok}${fail ? ` وفشل ${fail}` : ''}.`,
      openLink: 'فتح الأصل',
      linkTag: 'رابط',
      title: 'العنوان',
      fileName: 'اسم المادة',
      summary: 'الملخص (اختياري)',
      subcategory: 'التصنيف',
      subtopic: 'مجموعة السلسلة',
      seriesHint: 'اختر اسم السلسلة لعرض الفيديو في صفحة الدورة.',
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
      levelTag: { public: 'عام (للزوار)', standard: 'قياسي', premium: 'متميز' },
      uploadOk: 'تم الرفع بنجاح',
      uploadFail: 'فشل الرفع',
      invalid: 'يرجى إدخال عنوان واختيار ملف.',
      titleRequired: 'يرجى إدخال العنوان.',
      fileRequired: 'يرجى اختيار ملف.',
      fileTooLarge: 'حجم الملف يتجاوز 100MB، يرجى ضغطه ثم إعادة الرفع.',
      uploadNetworkFail: 'فشل الرفع: اضغط الفيديو إلى ~40MB أو زِد حد رفع Nginx على الخادم.',
      uncategorized: 'غير مصنف',
      subcategoryContent: 'تصفح حسب التصنيف الفرعي',
      subtopicContent: 'اختر تصنيفًا فرعيًا أدق لعرض المواد',
      emptySubtopic: 'يرجى اختيار التصنيف الأدق',
    },
    }
    const base = pack[lang] || pack.zh
    const fields = getModuleAssetFieldLabels(moduleKey, lang)
    return {
      ...base,
      subcategory: fields.subcategory,
      subtopic: fields.subtopic,
      subcategoryContent: fields.subcategoryContent,
      seriesHint: fields.hint || '',
    }
  }, [lang, moduleKey])

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
    if (!isAdmin) {
      setItems([])
      setLoading(false)
      return
    }
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, isAdmin])

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
    if (uploadMode !== 'bulk' && !title.trim()) {
      setError(t.titleRequired || t.invalid)
      return
    }
    const useLink = uploadMode === 'link' || (moduleKey === 'longevity-news' && !file && externalUrl.trim())
    if (uploadMode === 'bulk') {
      const parsed = parseBulkLinkLines(bulkText)
      if (!parsed.rows.length) {
        setError(parsed.errors[0] || t.bulkEmpty)
        return
      }
      const submittedSubcategory = normalizeSubcategoryValue(moduleKey, subcategory.trim() || 'general')
      const submittedSubtopic = resolveSubmitSubtopic(moduleKey, submittedSubcategory, subtopic) || '文章'
      setSubmitting(true)
      try {
        const token = getToken()
        let ok = 0
        let fail = parsed.errors.length
        const uploaded = []
        for (const row of parsed.rows) {
          try {
            const res = await fetch('/api/module-assets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                module: moduleKey,
                title: row.title,
                summary: '',
                subcategory: submittedSubcategory,
                subtopic: submittedSubtopic,
                requiredLevel,
                externalUrl: row.url,
              }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.error || t.uploadFail)
            ok += 1
            if (data?.item?.id) uploaded.push(normalizeAssetItem(moduleKey, data.item))
          } catch {
            fail += 1
          }
        }
        if (uploaded.length) {
          setItems((prev) => {
            const rest = prev.filter((it) => !uploaded.some((u) => u.id === it.id))
            return [...uploaded, ...rest]
          })
        }
        setBulkText('')
        setPinnedSelection({ subcategory: submittedSubcategory, subtopic: submittedSubtopic })
        setActiveSubcategory(submittedSubcategory)
        setActiveSubtopic(submittedSubtopic)
        setHint(typeof t.bulkResult === 'function' ? t.bulkResult(ok, fail) : t.uploadOk)
        if (parsed.errors.length) setError(parsed.errors.slice(0, 5).join('；'))
        notifyModuleAssetsUpdated(moduleKey)
        await loadItems()
      } catch (err) {
        setError(uploadErrorMessage(err, t, lang))
      } finally {
        setSubmitting(false)
      }
      return
    }
    if (useLink) {
      const url = externalUrl.trim()
      if (!url) {
        setError(t.externalUrlRequired || t.invalid)
        return
      }
      const seriesName = resolveSubmitSubtopic(moduleKey, subcategory, subtopic) || (moduleKey === 'longevity-news' ? '文章' : '')
      if (moduleKey === 'health-skills' && !seriesName) {
        setError(t.seriesRequired || '请选择系列合集')
        return
      }
      setSubmitting(true)
      try {
        const submittedSubcategory = normalizeSubcategoryValue(moduleKey, subcategory.trim() || 'general')
        const submittedSubtopic = resolveSubmitSubtopic(moduleKey, submittedSubcategory, subtopic) || seriesName || '文章'
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
            externalUrl: url,
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
        setExternalUrl('')
        setSubcategory(subcategoryOptions[0] || 'general')
        const uploadedSubcategory = normalizeSubcategoryValue(moduleKey, data?.item?.subcategory || submittedSubcategory)
        const uploadedSubtopic = normalizeSubtopicValue(data?.item?.subtopic || submittedSubtopic)
        setPinnedSelection({ subcategory: uploadedSubcategory, subtopic: uploadedSubtopic })
        setActiveSubcategory(uploadedSubcategory)
        setActiveSubtopic(uploadedSubtopic)
        setSubtopic('')
        setRequiredLevel('public')
        setHint(t.uploadOk)
        notifyModuleAssetsUpdated(moduleKey)
        await loadItems()
      } catch (err) {
        setError(uploadErrorMessage(err, t, lang))
      } finally {
        setSubmitting(false)
      }
      return
    }
    if (!file) {
      setError(t.fileRequired || t.invalid)
      return
    }
    const seriesName = resolveSubmitSubtopic(moduleKey, subcategory, subtopic)
    if (moduleKey === 'health-skills' && !seriesName) {
      setError(t.seriesRequired || '请选择系列合集')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setError(t.fileTooLarge || t.invalid)
      return
    }
    setSubmitting(true)
    try {
      const submittedSubcategory = normalizeSubcategoryValue(moduleKey, subcategory.trim() || 'general')
      const submittedSubtopic = resolveSubmitSubtopic(moduleKey, submittedSubcategory, subtopic) || seriesName
      const contentBase64 = await fileToBase64(file)
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
          ...(externalUrl.trim() ? { externalUrl: externalUrl.trim() } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 413) throw new Error(data.error || t.uploadNetworkFail)
      if (!res.ok) throw new Error(data.error || t.uploadFail)
      if (data?.item?.id) {
        const uploadedItem = normalizeAssetItem(moduleKey, data.item)
        setItems((prev) => [uploadedItem, ...prev.filter((it) => it.id !== uploadedItem.id)])
      }
      setTitle('')
      setSummary('')
      setExternalUrl('')
      setSubcategory(subcategoryOptions[0] || 'general')
      const uploadedSubcategory = normalizeSubcategoryValue(moduleKey, data?.item?.subcategory || submittedSubcategory)
      const uploadedSubtopic = normalizeSubtopicValue(data?.item?.subtopic || submittedSubtopic)
      setPinnedSelection({ subcategory: uploadedSubcategory, subtopic: uploadedSubtopic })
      setActiveSubcategory(uploadedSubcategory)
      setActiveSubtopic(uploadedSubtopic)
      setSubtopic('')
      setRequiredLevel('public')
      setFile(null)
      setHint(t.uploadOk)
      notifyModuleAssetsUpdated(moduleKey)
      await loadItems()
    } catch (err) {
      setError(uploadErrorMessage(err, t, lang))
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
      requiredLevel: adminLevelValue(item.required_level),
      externalUrl: item.external_url || '',
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
          fileName: editForm.fileName.trim() || 'external-link',
          summary: editForm.summary.trim(),
          subcategory: savedSc,
          subtopic: savedSt,
          requiredLevel: editForm.requiredLevel,
          externalUrl: editForm.externalUrl?.trim() || '',
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

  if (!isAdmin) return null

  const uploadForm = (
        <form className="module-assets-upload" onSubmit={onSubmit}>
          <h4>{t.uploadTitle}</h4>
          {moduleKey === 'longevity-news' ? (
            <div className="module-assets-subtabs-row" style={{ marginBottom: '0.75rem' }}>
              <button
                type="button"
                className={`module-assets-subtab ${uploadMode === 'link' ? 'active' : ''}`}
                onClick={() => setUploadMode('link')}
              >
                {t.uploadModeLink}
              </button>
              <button
                type="button"
                className={`module-assets-subtab ${uploadMode === 'file' ? 'active' : ''}`}
                onClick={() => setUploadMode('file')}
              >
                {t.uploadModeFile}
              </button>
              <button
                type="button"
                className={`module-assets-subtab ${uploadMode === 'bulk' ? 'active' : ''}`}
                onClick={() => setUploadMode('bulk')}
              >
                {t.uploadModeBulk}
              </button>
            </div>
          ) : null}
          {uploadMode === 'link' ? (
            <p className="module-assets-hint">{t.linkHint}</p>
          ) : null}
          {uploadMode === 'bulk' ? (
            <>
              <p className="module-assets-hint">{t.bulkHint}</p>
              <label>
                <span>{t.uploadModeBulk}</span>
                <textarea
                  rows={8}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={t.bulkPh}
                />
              </label>
            </>
          ) : (
            <>
          <label>
            <span>{t.title}</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span>{t.summary}</span>
            <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </label>
          {uploadMode === 'link' || moduleKey === 'longevity-news' ? (
            <label>
              <span>{t.externalUrl}</span>
              <input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder={t.externalUrlPh}
              />
            </label>
          ) : null}
            </>
          )}
          <label>
            <span>{t.subcategory}</span>
            <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
              {subcategoryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          {t.seriesHint ? (
            <p className="module-assets-hint module-assets-series-hint">{t.seriesHint}</p>
          ) : null}
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
              <option value="public">{t.levelTag?.public || 'public'}</option>
              <option value="standard">{t.levelTag?.standard || 'standard'}</option>
              <option value="premium">{t.levelTag?.premium || 'premium'}</option>
            </select>
          </label>
          {uploadMode === 'file' ? (
            <label>
              <span>{t.choose}</span>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          ) : null}
          {error ? <p className="module-assets-error">{error}</p> : null}
          {hint ? <p className="module-assets-hint">{hint}</p> : null}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? t.uploading
              : uploadMode === 'link'
                ? t.uploadModeLink
                : uploadMode === 'bulk'
                  ? t.uploadModeBulk
                  : t.upload}
          </button>
        </form>
  )

  if (moduleKey === 'health-skills') {
    return (
      <section className="module-assets-panel module-assets-panel--upload-only">
        {uploadForm}
      </section>
    )
  }

  return (
    <section className="module-assets-panel">
      {loading ? <p className="module-assets-muted">{t.loading}</p> : null}
      <h3>{t.section}</h3>
      {isAdmin && !loading && !items.length ? <p className="module-assets-muted">{t.empty}</p> : null}
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
            {visibleItems.map((item) => {
              const canView = item.can_view !== false
              const showLevelBadge = shouldShowMembershipBadge(item.required_level)
              const badgeLevel = item.content_level || item.required_level
              const isLinkItem = Boolean(String(item.external_url || '').trim())
                && (!Number(item.file_size) || item.mime_type === 'text/uri-list')
              const openHref = isLinkItem
                ? String(item.external_url).trim()
                : moduleAssetUrl(item.id, getToken())
              return (
              <li key={item.id} className="module-assets-card">
              <div className="module-assets-head">
                <strong className="module-assets-title">{item.title}</strong>
                <span className="module-assets-size module-assets-pill">
                  {isLinkItem ? (t.linkTag || '外链') : formatSize(item.file_size)}
                </span>
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
                {showLevelBadge ? (
                  <span className={`module-assets-pill module-assets-pill-level membership-badge membership-${badgeLevel}`}>
                    {t.levelTag?.[badgeLevel] || badgeLevel}
                  </span>
                ) : null}
              </p>
              {isAdmin && savedItemId === item.id ? <p className="module-assets-hint">{t.saveOk}</p> : null}
              {canView ? (
                <>
                  {item.summary ? <p className="module-assets-muted">{item.summary}</p> : null}
                  {!isLinkItem && isImage(item.mime_type) ? (
                    <img src={moduleAssetUrl(item.id, getToken())} alt={item.title} className="module-assets-image" />
                  ) : null}
                  {!isLinkItem && isAudio(item.mime_type) ? (
                    <audio controls src={moduleAssetUrl(item.id, getToken())} className="module-assets-media" />
                  ) : null}
                  {!isLinkItem && isVideo(item.mime_type) ? (
                    <video controls src={moduleAssetUrl(item.id, getToken())} className="module-assets-media" preload="metadata" />
                  ) : null}
                  <p className="module-assets-actions">
                    <a className="module-assets-open-link" href={openHref} target="_blank" rel="noreferrer">
                      {isLinkItem ? (t.openLink || t.open) : t.open}
                    </a>
                  </p>
                </>
              ) : (
                <ContentLockNotice requiredLevel={item.required_level} user={user} />
              )}
              {isAdmin && editingId === item.id ? (
                <form className="module-assets-upload module-assets-edit-inline" onSubmit={(e) => { e.preventDefault(); saveEdit() }}>
                  <h4>{t.edit}</h4>
                  <label>
                    <span>{t.title}</span>
                    <input value={editForm.title} onChange={(e) => setEditForm((v) => ({ ...v, title: e.target.value }))} />
                  </label>
                  {!isLinkItem ? (
                    <label>
                      <span>{t.fileName}</span>
                      <input value={editForm.fileName} onChange={(e) => setEditForm((v) => ({ ...v, fileName: e.target.value }))} />
                    </label>
                  ) : null}
                  <label>
                    <span>{t.summary}</span>
                    <textarea rows={3} value={editForm.summary} onChange={(e) => setEditForm((v) => ({ ...v, summary: e.target.value }))} />
                  </label>
                  <label>
                    <span>{t.externalUrl || '外链'}</span>
                    <input
                      value={editForm.externalUrl || ''}
                      onChange={(e) => setEditForm((v) => ({ ...v, externalUrl: e.target.value }))}
                      placeholder={t.externalUrlPh}
                    />
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
                      <option value="public">{t.levelTag?.public || 'public'}</option>
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
              )
            })}
          </ul>
        </>
      ) : null}

      {uploadForm}
    </section>
  )
}
