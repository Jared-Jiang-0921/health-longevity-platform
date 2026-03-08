import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../data/courses'
import './CourseLearn.css'

export default function CourseLearn() {
  const { id } = useParams()
  const course = getCourseById(id)
  const modules = course?.modules || []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeModule = modules[activeIndex]

  if (!course) {
    return (
      <div className="page-content">
        <p>未找到该课程</p>
        <Link to="/health-skills">返回课程列表</Link>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="page-content">
        <p>该课程暂无学习内容</p>
        <Link to={`/health-skills/${id}`}>返回课程详情</Link>
      </div>
    )
  }

  return (
    <div className="page-course-learn">
      <div className="learn-header">
        <Link to={`/health-skills/${id}`} className="back-link">← 返回课程详情</Link>
        <h1>{course.title}</h1>
      </div>

      <div className="learn-layout">
        <aside className="learn-sidebar">
          <h3>课程模块</h3>
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
                <iframe
                  title={activeModule.title}
                  src={activeModule.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activeModule.duration && (
                <p className="video-duration">时长：{activeModule.duration}</p>
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
