import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { getCourseById, CATEGORIES } from '../data/courses'
import './MyFavorites.css'

export default function MyFavorites() {
  const { favorites, toggle } = useFavorites()
  const courses = favorites.map((id) => getCourseById(id)).filter(Boolean)

  if (courses.length === 0) {
    return (
      <div className="page-content">
        <h1>我的收藏</h1>
        <p className="empty-msg">暂无收藏课程，去 <Link to="/health-skills">长寿知识技能</Link> 添加吧。</p>
      </div>
    )
  }

  return (
    <div className="page-my-favorites">
      <h1>我的收藏</h1>
      <p className="subtitle">共 {courses.length} 门课程</p>
      <div className="favorites-grid">
        {courses.map((course) => (
          <article key={course.id} className="favorite-card">
            <div className="favorite-meta">
              <span className="course-category">
                {CATEGORIES.find((c) => c.id === course.category)?.label}
              </span>
              <button
                type="button"
                className="btn-unfavorite"
                onClick={() => toggle(course.id)}
                aria-label="取消收藏"
              >
                ♥ 取消收藏
              </button>
            </div>
            <h3>{course.title}</h3>
            <p>{course.desc}</p>
            <div className="favorite-actions">
              <Link to={`/health-skills/${course.id}`}>查看详情</Link>
              <Link to={`/health-skills/${course.id}/learn`} className="btn-learn">
                去学习
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
