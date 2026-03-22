import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS, canAccess } from '../data/membership'
import { SITE_LEGAL } from '../data/siteLegal'
import './Layout.css'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/health-skills', label: '长寿知识技能' },
  { path: '/solutions', label: '综合长寿方案' },
  { path: '/products', label: '循证健康产品' },
  { path: '/longevity-news', label: '前沿长寿医学资讯' },
  { path: '/tcm-prevention', label: '治未病' },
  { path: '/translation-opportunities', label: '转化应用机遇' },
  { path: '/favorites', label: '我的收藏' },
  { path: '/payment', label: '支付结算' },
  { path: '/account', label: '会员信息', authOnly: true },
]

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const visibleNavItems = navItems.filter(
    (item) => (!item.authOnly || user) && canAccess(item.path, user?.level),
  )

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            {SITE_LEGAL.brandName}
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
          <p className="footer-copy">© {SITE_LEGAL.brandName}. 长寿知识 · 综合方案 · 循证产品.</p>
          <nav className="footer-legal" aria-label="法律与合规">
            <Link to="/terms">用户协议（简）</Link>
            <span className="footer-sep">·</span>
            <Link to="/privacy">隐私政策（简）</Link>
            <span className="footer-sep">·</span>
            <Link to="/disclaimer">健康免责声明（简）</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
