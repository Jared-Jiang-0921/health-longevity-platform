import { Link, useParams } from 'react-router-dom'
import { getCourseById, CATEGORIES } from '../data/courses'
import { useFavorites } from '../hooks/useFavorites'
import './CourseDetail.css'

export default function CourseDetail() {
  const { id } = useParams()
  const course = getCourseById(id)
  const { isFavorite, toggle } = useFavorites()

  if (!course) {
    return (
      <div className="page-content">
        <p>未找到该课程</p>
        <Link to="/health-skills">返回课程列表</Link>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === course.category)
  const favorite = isFavorite(course.id)

  return (
    <div className="page-course-detail">
      <Link to="/health-skills" className="back-link">← 返回课程列表</Link>

      <header className="course-detail-header">
        <div className="course-detail-meta">
          <span className="course-category-tag">{category?.label}</span>
          <span className="course-duration">{course.duration}</span>
          <span className="course-level">{course.level}</span>
        </div>
        <h1>{course.title}</h1>
        <p className="course-desc">{course.desc}</p>
      </header>

      <section className="course-detail-content">
        <h2>课程简介</h2>
        <p>{course.content}</p>
      </section>

      <section className="course-detail-actions">
        <button
          type="button"
          className={`btn-favorite ${favorite ? 'active' : ''}`}
          onClick={() => toggle(course.id)}
          aria-label={favorite ? '取消收藏' : '收藏'}
        >
          {favorite ? '♥ 已收藏' : '♡ 收藏'}
        </button>
        <Link to={`/health-skills/${course.id}/learn`} className="btn-primary">
          开始学习
        </Link>
      </section>
    </div>
  )
}
