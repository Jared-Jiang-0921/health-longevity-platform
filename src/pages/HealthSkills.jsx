import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, COURSES } from '../data/courses'
import { categoryDisplayLabel, courseDisplay, moduleDisplay } from '../data/courseLocale'
import { assetMatchesCourseSeries } from '../data/healthSkillsSeries'
import { getHealthSkillsContentApproach } from '../data/healthSkillsContentApproach'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'
import { getMembershipLevelLabel } from '../i18n/terms'
import { shouldShowMembershipBadge } from '../data/membership'
import ModuleAccessHint from '../components/ModuleAccessHint'
import ModulePageHero from '../components/ModulePageHero'
import '../styles/membership-badge.css'
import './HealthSkills.css'

export default function HealthSkills() {
  const { lang } = useLocale()
  const { user, getToken } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const ui = getUi(lang)
  const t = {
    zh: {
      title: '长寿知识技能',
      desc: '系统化健康知识与技能课程，支持多语言与全球化学习。同一系列合集像一本书，点进后再观看各集视频。',
      cancel: '取消收藏',
      fav: '收藏',
      series: '视频合集',
      openBook: '打开合集',
      moreEps: (n) => `还有 ${n} 集`,
      epCount: (n) => `${n} 集`,
      lessonCount: (n) => `${n} 课时`,
    },
    en: {
      title: 'Health Skills',
      desc: 'Structured courses. A video series works like a book—open it, then watch each episode.',
      cancel: 'Remove favorite',
      fav: 'Favorite',
      series: 'Video collection',
      openBook: 'Open',
      moreEps: (n) => `+${n} more`,
      epCount: (n) => `${n} episodes`,
      lessonCount: (n) => `${n} lessons`,
    },
    ar: {
      title: 'مهارات الصحة',
      desc: 'دورات منهجية. المجموعة مثل كتاب: افتحها ثم شاهد كل حلقة.',
      cancel: 'إزالة من المفضلة',
      fav: 'إضافة للمفضلة',
      series: 'مجموعة فيديو',
      openBook: 'فتح',
      moreEps: (n) => `+${n}`,
      epCount: (n) => `${n}`,
      lessonCount: (n) => `${n}`,
    },
  }[lang || 'zh']
  const methodologyLine = getHealthSkillsContentApproach(lang)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || 'basics')
  const [assets, setAssets] = useState([])
  const { isFavorite, toggle } = useFavorites()

  const filtered = COURSES.filter((c) => c.category === activeCategory)

  useEffect(() => {
    let cancelled = false
    const token = getToken?.()
    ;(async () => {
      try {
        const res = await fetch(`/api/module-assets?module=health-skills&ts=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))
        if (!cancelled && res.ok) setAssets(Array.isArray(data.items) ? data.items : [])
      } catch {
        if (!cancelled) setAssets([])
      }
    })()
    return () => { cancelled = true }
  }, [getToken])

  function lessonsForCourse(course) {
    const categoryLabel = CATEGORIES.find((c) => c.id === course.category)?.label || ''
    const uploaded = assets
      .filter((item) => assetMatchesCourseSeries(item, course, categoryLabel))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    if (uploaded.length) return uploaded.map((item) => item.title)
    return (course.modules || []).map((mod) => moduleDisplay(mod, lang).title).filter(Boolean)
  }

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
      <ModulePageHero path="/health-skills" title={t.title}>
        <p className="module-page-hero-line">{t.desc}</p>
      </ModulePageHero>

      {isAdmin ? (
        <section className="health-skills-header">
          <p className="health-skills-methodology page-callout">{methodologyLine}</p>
        </section>
      ) : null}

      <section className="health-skills-toolbar" aria-label={lang === 'en' ? 'Course categories' : lang === 'ar' ? 'فئات الدورات' : '课程分类'}>
        <div className="category-tabs health-skills-tabs">
          {CATEGORIES.map(({ id }) => (
            <button
              key={id}
              type="button"
              className={activeCategory === id ? 'active' : ''}
              onClick={() => setActiveCategory(id)}
            >
              {categoryDisplayLabel(id, lang)}
            </button>
          ))}
        </div>
      </section>

      <section className="course-list">
        <div className="course-list-heading">
          <h2>
            {categoryDisplayLabel(activeCategory, lang)}
          </h2>
          <p>
            {lang === 'en'
              ? `${filtered.length} courses`
              : lang === 'ar'
                ? `${filtered.length} دورات`
                : `${filtered.length} 门课程`}
          </p>
        </div>
        {filtered.length === 0 ? (
          <p className="course-list-empty">{ui.noData}</p>
        ) : (
          <div className="course-grid">
            {filtered.map((course) => {
              const favorite = isFavorite(course.id)
              const requiredMembership = course.requiredMembership
              const showBadge = shouldShowMembershipBadge(requiredMembership)
              const lessons = lessonsForCourse(course)
              const view = courseDisplay(course, lang)
              return (
                <article key={course.id} className="course-card content-card content-card--padded">
                  <div className="course-meta">
                    <span className="course-category">
                      {categoryDisplayLabel(course.category, lang)}
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
                  <h3>{view.title}</h3>
                  <p className="course-card-desc">{view.desc}</p>
                  {lessons.length ? (
                    <ul className="course-card-lessons">
                      {lessons.slice(0, 3).map((title) => (
                        <li key={title}>{title}</li>
                      ))}
                      {lessons.length > 3 ? (
                        <li className="course-card-lessons-more">{t.moreEps(lessons.length - 3)}</li>
                      ) : null}
                    </ul>
                  ) : null}
                  <div className="course-footer">
                    <div className="course-footer-meta">
                      {showBadge ? (
                        <span className={`membership-badge membership-${requiredMembership}`}>
                          {getMembershipLevelLabel(requiredMembership, lang)}
                        </span>
                      ) : null}
                      {lessons.length ? (
                        <span className="course-duration">
                          {course.videoSeries ? t.epCount(lessons.length) : t.lessonCount(lessons.length)}
                        </span>
                      ) : view.duration ? (
                        <span className="course-duration">{view.duration}</span>
                      ) : null}
                      <span className="course-level">{view.level}</span>
                    </div>
                    <Link to={`/health-skills/${course.id}`} className="btn-learn">
                      {course.videoSeries ? t.openBook : ui.learn}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {isAdmin ? null : <ModuleAccessHint moduleKey="health-skills" className="module-access-hint--page-end" />}
    </div>
  )
}
