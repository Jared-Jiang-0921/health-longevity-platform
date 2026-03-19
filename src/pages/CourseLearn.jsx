import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourseById } from '../data/courses'
import { useCourseProgress } from '../hooks/useCourseProgress'
import './CourseLearn.css'

export default function CourseLearn() {
  const { t } = useTranslation()
  const { id } = useParams()
  const course = getCourseById(id)
  const modules = course?.modules || []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeModule = modules[activeIndex]
  const { updateModule, getPercent, isCompleted } = useCourseProgress()

  useEffect(() => {
    if (course && modules.length > 0) {
      updateModule(course.id, activeIndex)
    }
  }, [course, modules.length, activeIndex, updateModule])

  if (!course) {
    return (
      <div className="page-content">
        <p>{t('healthSkills.notFound')}</p>
        <Link to="/health-skills">{t('healthSkills.backToList')}</Link>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="page-content">
        <p>{t('healthSkills.noContent')}</p>
        <Link to={`/health-skills/${id}`}>{t('courseLearn.backToDetail')}</Link>
      </div>
    )
  }

  const percent = getPercent(course.id, modules.length)
  const completed = isCompleted(course.id, modules.length)

  return (
    <div className="page-course-learn">
      <div className="learn-header">
        <Link to={`/health-skills/${id}`} className="back-link">← {t('courseLearn.backToDetail')}</Link>
        <div className="learn-header-main">
          <h1>{t('courses.' + course.id + '.title', { defaultValue: course.title })}</h1>
          <div className="learn-progress">
            <span>{completed ? t('courseLearn.completed') : `${t('courseLearn.progress')}：${percent || 0}%`}</span>
          </div>
        </div>
      </div>

      <div className="learn-layout">
        <aside className="learn-sidebar">
          <h3>{t('courseLearn.courseModules')}</h3>
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
              <div className="video-wrapper">
                {activeModule.embedUrl && /\.mp4(\?|$)/i.test(activeModule.embedUrl) ? (
                  <video
                    controls
                    preload="metadata"
                    src={activeModule.embedUrl}
                    title={activeModule.title}
                  >
                    {t('courseLearn.videoNotSupported')}
                  </video>
                ) : (
                  <iframe
                    title={activeModule.title}
                    src={activeModule.embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              {activeModule.duration && (
                <p className="video-duration">{t('courseLearn.duration')}：{activeModule.duration}</p>
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
