import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById, CATEGORIES } from '../data/courses'
import { getHealthSkillsContentApproach } from '../data/healthSkillsContentApproach'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import { hasLevelAccess, shouldShowMembershipBadge } from '../data/membership'
import ContentLockNotice from '../components/ContentLockNotice'
import CourseSeriesVideos from '../components/CourseSeriesVideos'
import '../styles/membership-badge.css'
import './CourseDetail.css'

export default function CourseDetail() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { nf: '未找到该课程', back: '返回课程列表', intro: '课程简介', cancel: '取消收藏', fav: '收藏', faved: '已收藏' },
    en: { nf: 'Course not found', back: 'Back to course list', intro: 'Course Overview', cancel: 'Remove favorite', fav: 'Favorite', faved: 'Favorited' },
    ar: { nf: 'الدورة غير موجودة', back: 'العودة للدورات', intro: 'مقدمة الدورة', cancel: 'إزالة من المفضلة', fav: 'مفضلة', faved: 'مفضلة' },
  }[lang || 'zh']
  const { id } = useParams()
  const course = getCourseById(id)
  const { isFavorite, toggle } = useFavorites()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)

  if (!course) {
    return (
      <div className="page-content">
        <p>{t.nf}</p>
        <Link to="/health-skills">{t.back}</Link>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === course.category)
  const methodologyLine = getHealthSkillsContentApproach(lang)
  const favorite = isFavorite(course.id)
  const requiredMembership = course.requiredMembership
  const allowed = hasLevelAccess(user?.level, requiredMembership, { isGuest: !user })
  const showBadge = shouldShowMembershipBadge(requiredMembership)

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

  if (!allowed) {
    return (
      <div className="page-content page-course-detail">
        <Link to="/health-skills" className="back-link">← {t.back}</Link>
        <header className="course-detail-header">
          <h1>{course.title}</h1>
          {showBadge ? (
            <span className={`membership-badge membership-${requiredMembership}`}>
              {getMembershipLevelLabel(requiredMembership, lang)}
            </span>
          ) : null}
          <p className="course-desc">{course.desc}</p>
        </header>
        <ContentLockNotice requiredLevel={requiredMembership} user={user} />
        <p><Link to="/health-skills">{t.back}</Link></p>
      </div>
    )
  }

  return (
    <div className="page-course-detail">
      <Link to="/health-skills" className="back-link">← {t.back}</Link>

      <header className="course-detail-header">
        <div className="course-detail-meta">
          <span className="course-category-tag">{category?.label}</span>
          <span className="course-duration">{course.duration}</span>
          <span className="course-level">{course.level}</span>
        </div>
        <div className="course-title-row">
          <h1>{course.title}</h1>
          {showBadge ? (
            <span className={`membership-badge membership-${requiredMembership}`}>
              {getMembershipLevelLabel(requiredMembership, lang)}
            </span>
          ) : null}
        </div>
        <p className="course-desc">{course.desc}</p>
        {isAdmin ? <p className="course-methodology">{methodologyLine}</p> : null}
      </header>

      <section className="course-detail-content">
        <h2>{t.intro}</h2>
        <p>{course.content}</p>
      </section>

      <CourseSeriesVideos course={course} />

      <section className="course-detail-actions">
        <button
          type="button"
          className={`btn-favorite ${favorite ? 'active' : ''}`}
          onClick={() => toggle(course.id)}
          aria-label={favorite ? t.cancel : t.fav}
        >
          {favorite ? `♥ ${t.faved}` : `♡ ${t.fav}`}
        </button>
        <Link to={`/health-skills/${course.id}/learn`} className="btn-primary">
          {ui.learn}
        </Link>
      </section>
    </div>
  )
}
