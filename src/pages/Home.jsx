import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccess, getRequiredLevel, MEMBERSHIP_LEVELS } from '../data/membership'
import './Home.css'

const modules = [
  {
    path: '/health-skills',
    title: '高级健康技能学习',
    desc: '系统化健康知识与技能课程',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  },
  {
    path: '/solutions',
    title: '数字化健康长寿方案',
    desc: '个性化健康管理与长寿方案',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
  },
  {
    path: '/products',
    title: '优质健康产品推荐',
    desc: '精选健康产品与用品',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  {
    path: '/longevity-news',
    title: '前沿长寿医学资讯',
    desc: '国际权威期刊高影响因子健康长寿研究月更',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  },
  {
    path: '/tcm-prevention',
    title: '中医药特色 · 治未病',
    desc: '中草药单药与经典治未病处方：药性、功效、适宜人群、出处',
    image: 'https://images.pexels.com/photos/2064359/pexels-photo-2064359.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <h1>Health Longevity Platform</h1>
          <p className="tagline">高级健康技能 · 数字化长寿方案 · 优质健康产品 · 前沿医学资讯</p>
          <div className="hero-auth">
            {user ? (
              <span className="hero-user">欢迎，{user.name}（{MEMBERSHIP_LEVELS[user.level]?.name}）</span>
            ) : (
              <>
                <Link to="/login" className="btn-hero btn-login">登录</Link>
                <Link to="/register" className="btn-hero btn-register">注册</Link>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="modules">
        <h2>服务模块</h2>
        <div className="module-grid">
          {modules.map(({ path, title, desc, image }) => {
            const allowed = canAccess(path, user?.level)
            const requiredLevel = getRequiredLevel(path)
            const requiredName = requiredLevel ? MEMBERSHIP_LEVELS[requiredLevel]?.name : null

            if (allowed) {
              return (
                <Link key={path} to={path} className="module-card">
                  <div className="module-card-image" style={{ backgroundImage: `url(${image})` }} />
                  <div className="module-card-body">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </Link>
              )
            }
            return (
              <div key={path} className="module-card module-card-locked">
                <div className="module-card-image" style={{ backgroundImage: `url(${image})` }} />
                <div className="module-card-body">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <p className="module-lock">需{requiredName}及以上</p>
                  <Link to="/register" className="btn-upgrade">升级会员</Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
