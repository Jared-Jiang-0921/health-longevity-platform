import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../data/courses'
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
  const { user } = useAuth()
  const modules = course?.modules || []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeModule = modules[activeIndex]

  if (!course) {
    return (
      <div className="page-content">
        <p>{t.nf}</p>
        <Link to="/health-skills">{t.backList}</Link>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="page-content">
        <p>{ui.noData}</p>
        <Link to={`/health-skills/${id}`}>{t.backDetail}</Link>
      </div>
    )
  }

  const requiredMembership = course.requiredMembership || 'free'
  const allowed = hasLevelAccess(user?.level, requiredMembership)
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

  return (
    <div className="page-course-learn">
      <div className="learn-header">
        <Link to={`/health-skills/${id}`} className="back-link">← {t.back}</Link>
        <h1>{course.title}</h1>
      </div>

      <div className="learn-layout">
        <aside className="learn-sidebar">
          <h3>{t.modules}</h3>
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
    </div>
  )
}
