import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById, CATEGORIES } from '../data/courses'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import { hasLevelAccess } from '../data/membership'
import './CourseLearn.css'

export default function CourseLearn() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { nf: '未找到该课程', backList: '返回课程列表', backDetail: '返回课程详情', modules: '课程模块', back: '返回课程详情', noVideo: '未配置视频地址（请在课程数据中为该课时设置 videoUrl 或 embedUrl）。', duration: '时长：', notSupport: '您的浏览器不支持视频播放。' },
    en: { nf: 'Course not found', backList: 'Back to list', backDetail: 'Back to details', modules: 'Modules', back: 'Back to details', noVideo: 'No video URL configured (set videoUrl or embedUrl in course data).', duration: 'Duration: ', notSupport: 'Your browser does not support video playback.' },
    ar: { nf: 'الدورة غير موجودة', backList: 'العودة للقائمة', backDetail: 'العودة للتفاصيل', modules: 'وحدات الدورة', back: 'العودة للتفاصيل', noVideo: 'لم يتم إعداد رابط فيديو (اضبط videoUrl أو embedUrl).', duration: 'المدة: ', notSupport: 'متصفحك لا يدعم تشغيل الفيديو.' },
  }[lang || 'zh']
  const { id } = useParams()
  const course = getCourseById(id)
  const { user, getToken } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const [modules, setModules] = useState(course?.modules || [])
  const [modulesLoading, setModulesLoading] = useState(false)
  const [modulesSaving, setModulesSaving] = useState(false)
  const [modulesError, setModulesError] = useState('')
  const [modulesHint, setModulesHint] = useState('')
  const [editingModuleIdx, setEditingModuleIdx] = useState(-1)
  const [editDraft, setEditDraft] = useState({ title: '', duration: '', content: '', videoUrl: '', embedUrl: '' })
  const [activeIndex, setActiveIndex] = useState(0)
  const activeModule = modules[Math.min(activeIndex, Math.max(modules.length - 1, 0))]

  if (!course) {
    return (
      <div className="page-content">
        <p>{t.nf}</p>
        <Link to="/health-skills">{t.backList}</Link>
      </div>
    )
  }

  const requiredMembership = course.requiredMembership || 'free'
  const allowed = hasLevelAccess(user?.level, requiredMembership)

  useEffect(() => {
    if (!course) return
    const selected = CATEGORIES.find((c) => c.id === course.category)
    window.dispatchEvent(new CustomEvent('module-category-change', {
      detail: {
        moduleKey: 'health-skills',
        categoryId: course.category,
        categoryLabel: selected?.label || '',
        subtopicLabel: course.title,
      },
    }))
  }, [course])

  useEffect(() => {
    if (!course?.id) return
    let cancelled = false
    async function loadModules() {
      setModulesLoading(true)
      setModulesError('')
      try {
        const res = await fetch(`/api/course-modules?courseId=${course.id}`)
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'load failed')
        if (!cancelled) {
          const next = Array.isArray(data.modules) ? data.modules : []
          setModules(next)
          setActiveIndex((v) => Math.min(v, Math.max(next.length - 1, 0)))
        }
      } catch (e) {
        if (!cancelled) setModulesError(e.message || 'load failed')
      } finally {
        if (!cancelled) setModulesLoading(false)
      }
    }
    loadModules()
    return () => { cancelled = true }
  }, [course?.id])

  async function saveModules(nextModules) {
    if (!isAdmin || !course?.id) return
    setModulesSaving(true)
    setModulesError('')
    setModulesHint('')
    try {
      const token = getToken()
      const res = await fetch('/api/course-modules', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ courseId: course.id, modules: nextModules }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'save failed')
      const normalized = Array.isArray(data.modules) ? data.modules : nextModules
      setModules(normalized)
      setEditingModuleIdx(-1)
      setActiveIndex((v) => Math.min(v, Math.max(normalized.length - 1, 0)))
      setModulesHint(lang === 'en' ? 'Saved' : lang === 'ar' ? 'تم الحفظ' : '保存成功')
    } catch (e) {
      setModulesError(e.message || 'save failed')
    } finally {
      setModulesSaving(false)
    }
  }

  function startEditModule(idx) {
    const mod = modules[idx]
    if (!mod) return
    setEditingModuleIdx(idx)
    setEditDraft({
      title: mod.title || '',
      duration: mod.duration || '',
      content: mod.content || '',
      videoUrl: mod.videoUrl || '',
      embedUrl: mod.embedUrl || '',
    })
  }

  async function submitEditModule() {
    if (editingModuleIdx < 0) return
    const next = modules.map((m, i) => (i === editingModuleIdx ? {
      ...m,
      title: editDraft.title,
      duration: editDraft.duration,
      content: editDraft.content,
      videoUrl: editDraft.videoUrl,
      embedUrl: editDraft.embedUrl,
    } : m))
    await saveModules(next)
  }

  async function removeModule(idx) {
    if (!isAdmin) return
    const confirmed = window.confirm(lang === 'en' ? 'Delete this built-in module?' : lang === 'ar' ? 'حذف هذه الوحدة؟' : '确定删除该原有资料吗？')
    if (!confirmed) return
    const next = modules.filter((_, i) => i !== idx)
    await saveModules(next)
  }

  if (!allowed) {
    const requiredLabel = getMembershipLevelLabel(requiredMembership, lang)
    return (
      <div className="page-content">
        <h1>{course.title}</h1>
        <p>{lang === 'en' ? `This course requires ${requiredLabel}.` : lang === 'ar' ? `هذه الدورة تتطلب ${requiredLabel}.` : `该课程需${requiredLabel}。`}</p>
        {!user ? (
          <p>
            <Link to="/login">{lang === 'en' ? 'Login' : lang === 'ar' ? 'تسجيل الدخول' : '登录'}</Link>
            <span className="page-sep"> </span>
            <Link to="/register">{lang === 'en' ? 'Sign up' : lang === 'ar' ? 'إنشاء حساب' : '注册'}</Link>
          </p>
        ) : (
          <p><Link to="/payment">{lang === 'en' ? 'Upgrade Membership' : lang === 'ar' ? 'ترقية العضوية' : '升级会员'}</Link></p>
        )}
        <p><Link to={`/health-skills/${id}`}>{t.backDetail}</Link></p>
      </div>
    )
  }

  if (!modulesLoading && modules.length === 0) {
    return (
      <div className="page-content">
        <p>{ui.noData}</p>
        <Link to={`/health-skills/${id}`}>{t.backDetail}</Link>
      </div>
    )
  }

  return (
    <div className="page-course-learn">
      <div className="learn-header">
        <Link to={`/health-skills/${id}`} className="back-link">← {t.back}</Link>
        <h1>{course.title}</h1>
      </div>

      <div className="learn-layout">
        <aside className="learn-sidebar">
          <h3>{t.modules}</h3>
          {modulesLoading ? <p className="video-missing">{lang === 'en' ? 'Loading modules...' : lang === 'ar' ? 'جارٍ تحميل الوحدات...' : '加载模块中…'}</p> : null}
          {modulesError ? <p className="video-missing">{modulesError}</p> : null}
          {modulesHint ? <p className="video-duration">{modulesHint}</p> : null}
          <ul className="module-list">
            {modules.map((mod, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className={idx === activeIndex ? 'active' : ''}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="module-type">{mod.type === 'video' ? '▶' : '📄'}</span>
                  <span className="module-title">{mod.title}</span>
                  {mod.duration && <span className="module-duration">{mod.duration}</span>}
                </button>
                {isAdmin ? (
                  <div className="module-admin-actions">
                    <button type="button" onClick={() => startEditModule(idx)}>
                      {lang === 'en' ? 'Edit' : lang === 'ar' ? 'تعديل' : '编辑'}
                    </button>
                    <button type="button" onClick={() => removeModule(idx)} disabled={modulesSaving}>
                      {lang === 'en' ? 'Delete' : lang === 'ar' ? 'حذف' : '删除'}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </aside>

        <main className="learn-main">
          {activeModule.type === 'video' ? (
            <section className="learn-video">
              <h2>{activeModule.title}</h2>
              {activeModule.videoUrl ? (
                <div className="video-wrapper video-wrapper-native">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    src={activeModule.videoUrl}
                  >
                    {t.notSupport}
                  </video>
                </div>
              ) : activeModule.embedUrl ? (
                <div className="video-wrapper">
                  <iframe
                    title={activeModule.title}
                    src={activeModule.embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="video-missing">{t.noVideo}</p>
              )}
              {activeModule.duration && (
                <p className="video-duration">{t.duration}{activeModule.duration}</p>
              )}
            </section>
          ) : (
            <section className="learn-document">
              <h2>{activeModule.title}</h2>
              <div className="document-content">{activeModule.content}</div>
            </section>
          )}
        </main>
      </div>
      {isAdmin && editingModuleIdx >= 0 ? (
        <section className="learn-document module-edit-panel">
          <h2>{lang === 'en' ? 'Edit Built-in Material' : lang === 'ar' ? 'تعديل مادة مدمجة' : '编辑原有资料'}</h2>
          <div className="module-edit-grid">
            <input value={editDraft.title} onChange={(e) => setEditDraft((v) => ({ ...v, title: e.target.value }))} placeholder={lang === 'en' ? 'Title' : lang === 'ar' ? 'العنوان' : '标题'} />
            <input value={editDraft.duration} onChange={(e) => setEditDraft((v) => ({ ...v, duration: e.target.value }))} placeholder={lang === 'en' ? 'Duration' : lang === 'ar' ? 'المدة' : '时长'} />
            <textarea rows={4} value={editDraft.content} onChange={(e) => setEditDraft((v) => ({ ...v, content: e.target.value }))} placeholder={lang === 'en' ? 'Document content' : lang === 'ar' ? 'محتوى المستند' : '文档内容'} />
            <input value={editDraft.videoUrl} onChange={(e) => setEditDraft((v) => ({ ...v, videoUrl: e.target.value }))} placeholder="videoUrl" />
            <input value={editDraft.embedUrl} onChange={(e) => setEditDraft((v) => ({ ...v, embedUrl: e.target.value }))} placeholder="embedUrl" />
            <div>
              <button type="button" className="btn-primary" onClick={submitEditModule} disabled={modulesSaving}>
                {modulesSaving ? (lang === 'en' ? 'Saving...' : lang === 'ar' ? 'جارٍ الحفظ...' : '保存中…') : (lang === 'en' ? 'Save' : lang === 'ar' ? 'حفظ' : '保存')}
              </button>
              <button type="button" className="btn-favorite" style={{ marginLeft: 8 }} onClick={() => setEditingModuleIdx(-1)}>
                {lang === 'en' ? 'Cancel' : lang === 'ar' ? 'إلغاء' : '取消'}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
