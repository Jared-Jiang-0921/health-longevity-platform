import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, COURSES } from '../data/courses'
import { getHealthSkillsContentApproach } from '../data/healthSkillsContentApproach'
import { useFavorites } from '../hooks/useFavorites'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import { shouldShowMembershipBadge } from '../data/membership'
import '../styles/membership-badge.css'
import './HealthSkills.css'

export default function HealthSkills() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { title: '长寿知识技能', desc: '系统化健康知识与技能课程，支持多语言与全球化学习。', cancel: '取消收藏', fav: '收藏', series: '视频系列' },
    en: { title: 'Health Skills', desc: 'Structured health knowledge and skill courses with multilingual learning.', cancel: 'Remove favorite', fav: 'Favorite', series: 'Video series' },
    ar: { title: 'مهارات الصحة', desc: 'دورات منهجية للمعرفة والمهارات الصحية مع دعم متعدد اللغات.', cancel: 'إزالة من المفضلة', fav: 'إضافة للمفضلة', series: 'سلسلة فيديو' },
  }[lang || 'zh']
  const methodologyLine = getHealthSkillsContentApproach(lang)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || 'basics')
  const { isFavorite, toggle } = useFavorites()

  const filtered = COURSES.filter((c) => c.category === activeCategory)

  useEffect(() => {
    const selected = CATEGORIES.find((c) => c.id === activeCategory)
    window.dispatchEvent(new CustomEvent('module-category-change', {
      detail: {
        moduleKey: 'health-skills',
        categoryId: activeCategory,
        categoryLabel: selected?.label || '',
      },
    }))
  }, [activeCategory])

  return (
    <div className="page-health-skills">
      <section className="health-skills-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
        <p className="health-skills-methodology">{methodologyLine}</p>
      </section>

      <section className="categories">
        <div className="category-tabs">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              className={activeCategory === id ? 'active' : ''}
              onClick={() => setActiveCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="course-list">
        <div className="course-grid content-card-grid">
          {filtered.map((course) => {
            const favorite = isFavorite(course.id)
            const requiredMembership = course.requiredMembership
            const showBadge = shouldShowMembershipBadge(requiredMembership)
            return (
              <article key={course.id} className="course-card content-card content-card--padded">
                <div className="course-meta">
                  <span className="course-category">
                    {CATEGORIES.find((c) => c.id === course.category)?.label}
                    {course.videoSeries ? (
                      <span className="course-badge-series"> · {t.series}</span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    className={`btn-favorite-icon ${favorite ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggle(course.id) }}
                    aria-label={favorite ? t.cancel : t.fav}
                  >
                    {favorite ? '♥' : '♡'}
                  </button>
                </div>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>
                <div className="course-footer">
                  {showBadge ? (
                    <span className={`membership-badge membership-${requiredMembership}`}>
                      {getMembershipLevelLabel(requiredMembership, lang)}
                    </span>
                  ) : null}
                  <span className="course-level">{course.level}</span>
                  <Link to={`/health-skills/${course.id}`} className="btn-learn">
                    {ui.learn}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
