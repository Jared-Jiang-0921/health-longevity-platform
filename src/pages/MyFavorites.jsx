import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { getCourseById, CATEGORIES } from '../data/courses'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import '../styles/membership-badge.css'
import './MyFavorites.css'

export default function MyFavorites() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { title: '我的收藏', empty: '暂无收藏课程，去', add: '长寿知识技能', count: '共', lessons: '门课程', unfav: '取消收藏' },
    en: { title: 'My Favorites', empty: 'No favorite courses yet. Go to', add: 'Health Skills', count: 'Total', lessons: 'courses', unfav: 'Remove favorite' },
    ar: { title: 'مفضلتي', empty: 'لا توجد دورات مفضلة بعد. اذهب إلى', add: 'مهارات الصحة', count: 'الإجمالي', lessons: 'دورات', unfav: 'إزالة' },
  }[lang || 'zh']
  const { favorites, toggle } = useFavorites()
  const courses = favorites.map((id) => getCourseById(id)).filter(Boolean)

  if (courses.length === 0) {
    return (
      <div className="page-content">
        <h1>{t.title}</h1>
        <p className="empty-msg">{t.empty} <Link to="/health-skills">{t.add}</Link>.</p>
      </div>
    )
  }

  return (
    <div className="page-my-favorites">
      <h1>{t.title}</h1>
      <p className="subtitle">{t.count} {courses.length} {t.lessons}</p>
      <div className="favorites-grid">
        {courses.map((course) => (
          <article key={course.id} className="favorite-card">
            {(() => {
              const requiredMembership = course.requiredMembership || 'free'
              return (
                <p className={`favorite-membership membership-badge membership-${requiredMembership}`}>
                  {getMembershipLevelLabel(requiredMembership, lang)}
                </p>
              )
            })()}
            <div className="favorite-meta">
              <span className="course-category">
                {CATEGORIES.find((c) => c.id === course.category)?.label}
              </span>
              <button
                type="button"
                className="btn-unfavorite"
                onClick={() => toggle(course.id)}
                aria-label={t.unfav}
              >
                ♥ {t.unfav}
              </button>
            </div>
            <h3>{course.title}</h3>
            <p>{course.desc}</p>
            <div className="favorite-actions">
              <Link to={`/health-skills/${course.id}`}>{ui.details}</Link>
              <Link to={`/health-skills/${course.id}/learn`} className="btn-learn">
                {ui.learn}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
