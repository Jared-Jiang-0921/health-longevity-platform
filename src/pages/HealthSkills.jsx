import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES, COURSES } from '../data/courses'
import { useFavorites } from '../hooks/useFavorites'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { useAuth } from '../context/AuthContext'
import './HealthSkills.css'

export default function HealthSkills() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const { isFavorite, toggle } = useFavorites()
  const { getPercent, isCompleted } = useCourseProgress()
  const { user } = useAuth()

  const userLevel = user?.level || 'free'
  const levelOrder = { free: 0, standard: 1, premium: 2 }

  const filtered =
    activeCategory === 'all'
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory)

  return (
    <div className="page-health-skills">
      <section className="health-skills-header">
        <h1>{t('healthSkills.title')}</h1>
        <p>{t('healthSkills.subtitle')}</p>
      </section>

      <section className="categories">
        <div className="category-tabs">
          {CATEGORIES.map(({ id }) => (
            <button
              key={id}
              className={activeCategory === id ? 'active' : ''}
              onClick={() => setActiveCategory(id)}
            >
              {t(`healthSkills.${id}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="course-list">
        <div className="course-grid">
          {filtered.map((course) => {
            const favorite = isFavorite(course.id)
            const totalModules = course.modules ? course.modules.length : 0
            const percent = getPercent(course.id, totalModules)
            const completed = isCompleted(course.id, totalModules)
            const required = course.accessLevel || 'free'
            const locked = levelOrder[userLevel] < levelOrder[required]
            return (
              <article key={course.id} className={`course-card ${locked ? 'locked' : ''}`}>
                <div className="course-meta">
                  <span className="course-category">
                    {t(`healthSkills.${course.category}`)}
                  </span>
                  <button
                    type="button"
                    className={`btn-favorite-icon ${favorite ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggle(course.id) }}
                    aria-label={favorite ? t('healthSkills.unfavorite') : t('healthSkills.favorite')}
                  >
                    {favorite ? '♥' : '♡'}
                  </button>
                </div>
                <h3>{t('courses.' + course.id + '.title', { defaultValue: course.title })}</h3>
                <p>{t('courses.' + course.id + '.desc', { defaultValue: course.desc })}</p>
                <p className="course-access">
                  {required === 'free'
                    ? t('healthSkills.freeCourse')
                    : required === 'standard'
                      ? t('healthSkills.standardCourse')
                      : t('healthSkills.premiumCourse')}
                </p>
                <p className="course-progress">
                  {completed ? t('healthSkills.progressDone') : t('healthSkills.progressPercent', { percent: percent || 0 })}
                </p>
                <div className="course-footer">
                  <span className="course-level">{t('healthSkills.' + ({ '初级': 'levelPrimary', '中级': 'levelIntermediate', '高级': 'levelAdvanced' }[course.level] || 'levelPrimary'))}</span>
                  {locked ? (
                    <Link to="/payment" className="btn-learn">
                      {t('courseDetail.needUpgrade')}
                    </Link>
                  ) : (
                    <Link to={`/health-skills/${course.id}`} className="btn-learn">
                      {t('healthSkills.goLearn')}
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
