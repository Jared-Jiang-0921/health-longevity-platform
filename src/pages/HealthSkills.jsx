import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, COURSES } from '../data/courses'
import { useFavorites } from '../hooks/useFavorites'
import './HealthSkills.css'

export default function HealthSkills() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { isFavorite, toggle } = useFavorites()

  const filtered =
    activeCategory === 'all'
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory)

  return (
    <div className="page-health-skills">
      <section className="health-skills-header">
        <h1>长寿知识技能</h1>
        <p>系统化健康知识与技能课程，支持多语言与全球化学习。</p>
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
        <div className="course-grid">
          {filtered.map((course) => {
            const favorite = isFavorite(course.id)
            return (
              <article key={course.id} className="course-card">
                <div className="course-meta">
                  <span className="course-category">
                    {CATEGORIES.find((c) => c.id === course.category)?.label}
                  </span>
                  <button
                    type="button"
                    className={`btn-favorite-icon ${favorite ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggle(course.id) }}
                    aria-label={favorite ? '取消收藏' : '收藏'}
                  >
                    {favorite ? '♥' : '♡'}
                  </button>
                </div>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>
                <div className="course-footer">
                  <span className="course-level">{course.level}</span>
                  <Link to={`/health-skills/${course.id}`} className="btn-learn">
                    去学习
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
