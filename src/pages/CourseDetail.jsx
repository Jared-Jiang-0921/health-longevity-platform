import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourseById, CATEGORIES } from '../data/courses'
import { useFavorites } from '../hooks/useFavorites'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { useAuth } from '../context/AuthContext'
import './CourseDetail.css'

export default function CourseDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const course = getCourseById(id)
  const { isFavorite, toggle } = useFavorites()
  const { getPercent, isCompleted, resetCourse } = useCourseProgress()
  const { user } = useAuth()

  if (!course) {
    return (
      <div className="page-content">
        <p>{t('healthSkills.notFound')}</p>
        <Link to="/health-skills">{t('courseDetail.backToList')}</Link>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === course.category)
  const favorite = isFavorite(course.id)
  const totalModules = course.modules ? course.modules.length : 0
  const percent = getPercent(course.id, totalModules)
  const completed = isCompleted(course.id, totalModules)
  const levelOrder = { free: 0, standard: 1, premium: 2 }
  const required = course.accessLevel || 'free'
  const userLevel = user?.level || 'free'
  const locked = levelOrder[userLevel] < levelOrder[required]
  const requiredLabel = required === 'standard' ? t('courseDetail.requiredStandard') : required === 'premium' ? t('courseDetail.requiredPremium') : t('courseDetail.requiredFree')
  const currentLabel = userLevel === 'free' ? t('courseDetail.currentFree') : userLevel === 'standard' ? t('courseDetail.currentStandard') : t('courseDetail.currentPremium')
  const courseTitle = t('courses.' + course.id + '.title', { defaultValue: course.title })
  const courseDesc = t('courses.' + course.id + '.desc', { defaultValue: course.desc })
  const courseContent = t('courses.' + course.id + '.content', { defaultValue: course.content })

  return (
    <div className="page-course-detail">
      <Link to="/health-skills" className="back-link">← {t('courseDetail.backToList')}</Link>

      <header className="course-detail-header">
        <div className="course-detail-meta">
          <span className="course-category-tag">{category ? t('healthSkills.' + course.category) : ''}</span>
          <span className="course-duration">{course.duration}</span>
          <span className="course-level">{t('healthSkills.' + ({ '初级': 'levelPrimary', '中级': 'levelIntermediate', '高级': 'levelAdvanced' }[course.level] || 'levelPrimary'))}</span>
          {totalModules > 0 && (
            <span className="course-progress-tag">
              {completed ? t('courseLearn.completed') : `${t('courseLearn.progress')}：${percent || 0}%`}
            </span>
          )}
        </div>
        <h1>{courseTitle}</h1>
        <p className="course-desc">{courseDesc}</p>
      </header>

      <section className="course-detail-content">
        <h2>{t('courseDetail.intro')}</h2>
        {locked ? (
          <>
            <p>{courseContent}</p>
            <p className="course-locked-hint">
              {t('courseDetail.lockedHint', { required: requiredLabel, current: currentLabel })}
            </p>
          </>
        ) : (
          <p>{courseContent}</p>
        )}
      </section>

      <section className="course-detail-actions">
        <button
          type="button"
          className={`btn-favorite ${favorite ? 'active' : ''}`}
          onClick={() => toggle(course.id)}
          aria-label={favorite ? t('healthSkills.unfavorite') : t('courseDetail.favorite')}
        >
          {favorite ? '♥ ' + t('courseDetail.favorited') : '♡ ' + t('courseDetail.favorite')}
        </button>
        {totalModules > 0 && !locked && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => resetCourse(course.id)}
          >
            {t('courseDetail.resetProgress')}
          </button>
        )}
        {locked ? (
          <Link to="/payment" className="btn-primary">
            {t('courseDetail.goUpgrade')}
          </Link>
        ) : (
          <Link to={`/health-skills/${course.id}/learn`} className="btn-primary">
            {t('courseDetail.startLearn')}
          </Link>
        )}
      </section>
    </div>
  )
}
