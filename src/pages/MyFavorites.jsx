import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useFavorites'
import { getCourseById, CATEGORIES } from '../data/courses'
import './MyFavorites.css'

export default function MyFavorites() {
  const { t } = useTranslation()
  const { favorites, toggle } = useFavorites()
  const courses = favorites.map((id) => getCourseById(id)).filter(Boolean)

  if (courses.length === 0) {
    return (
      <div className="page-content">
        <h1>{t('myFavorites.title')}</h1>
        <p className="empty-msg">
          {t('myFavorites.empty')}
          <Link to="/health-skills">{t('myFavorites.healthSkillsLink')}</Link>
          {t('myFavorites.emptySuffix')}
        </p>
      </div>
    )
  }

  return (
    <div className="page-my-favorites">
      <h1>{t('myFavorites.title')}</h1>
      <p className="subtitle">{t('myFavorites.count', { count: courses.length })}</p>
      <div className="favorites-grid">
        {courses.map((course) => (
          <article key={course.id} className="favorite-card">
            <div className="favorite-meta">
              <span className="course-category">
                {t('healthSkills.' + course.category)}
              </span>
              <button
                type="button"
                className="btn-unfavorite"
                onClick={() => toggle(course.id)}
                aria-label={t('myFavorites.unfavorite')}
              >
                ♥ {t('myFavorites.unfavorite')}
              </button>
            </div>
            <h3>{t('courses.' + course.id + '.title', { defaultValue: course.title })}</h3>
            <p>{t('courses.' + course.id + '.desc', { defaultValue: course.desc })}</p>
            <div className="favorite-actions">
              <Link to={`/health-skills/${course.id}`}>{t('myFavorites.viewDetail')}</Link>
              <Link to={`/health-skills/${course.id}/learn`} className="btn-learn">
                {t('myFavorites.goLearn')}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
