import { Link, useParams } from 'react-router-dom'
import { getCourseById, CATEGORIES } from '../data/courses'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import { hasLevelAccess } from '../data/membership'
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

  if (!course) {
    return (
      <div className="page-content">
        <p>{t.nf}</p>
        <Link to="/health-skills">{t.back}</Link>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === course.category)
  const favorite = isFavorite(course.id)
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
          <span className={`membership-badge membership-${requiredMembership}`}>
            {getMembershipLevelLabel(requiredMembership, lang)}
          </span>
        </div>
        <p className="course-desc">{course.desc}</p>
      </header>

      <section className="course-detail-content">
        <h2>{t.intro}</h2>
        <p>{course.content}</p>
      </section>

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
