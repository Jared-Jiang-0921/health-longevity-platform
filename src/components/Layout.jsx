import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS, canAccess } from '../data/membership'
import './Layout.css'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/health-skills', label: '健康技能学习' },
  { path: '/solutions', label: '健康长寿方案' },
  { path: '/products', label: '健康产品' },
  { path: '/longevity-news', label: '前沿长寿医学资讯' },
  { path: '/tcm-prevention', label: '治未病' },
  { path: '/favorites', label: '我的收藏' },
  { path: '/payment', label: '支付结算' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const visibleNavItems = navItems.filter((item) => canAccess(item.path, user?.level))

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Health Longevity Platform
          </Link>
          <nav className="nav">
            {visibleNavItems.map(({ path, label }) => {
            const active = location.pathname === path || (path !== '/' && path !== '/favorites' && location.pathname.startsWith(path))
            return (
              <Link
                key={path}
                to={path}
                className={active ? 'active' : ''}
              >
                {label}
              </Link>
            )
            })}
            <span className="nav-auth">
              {user ? (
                <>
                  <span className="nav-user">{user.name}（{MEMBERSHIP_LEVELS[user.level]?.name || user.level}）</span>
                  <button type="button" className="btn-logout" onClick={logout}>退出</button>
                </>
              ) : (
                <>
                  <Link to="/login">登录</Link>
                  <span className="nav-sep">|</span>
                  <Link to="/register">注册</Link>
                </>
              )}
            </span>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p>© Health Longevity Platform. 健康技能 · 长寿方案 · 健康产品.</p>
        </div>
      </footer>
    </>
  )
}
