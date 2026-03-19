import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS, canAccess } from '../data/membership'
import LanguageSwitcher from './LanguageSwitcher'
import './Layout.css'

const navItems = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/health-skills', labelKey: 'nav.healthSkills' },
  { path: '/solutions', labelKey: 'nav.solutions' },
  { path: '/products', labelKey: 'nav.products' },
  { path: '/longevity-news', labelKey: 'nav.longevityNews' },
  { path: '/tcm-prevention', labelKey: 'nav.tcmPrevention' },
  { path: '/account', labelKey: 'nav.account' },
  { path: '/favorites', labelKey: 'nav.favorites' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const visibleNavItems = navItems.filter((item) => canAccess(item.path, user?.level))
  const levelName = user?.level ? t(`membership.${user.level}`) : ''

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Health Longevity Platform
          </Link>
          <nav className="nav">
            {visibleNavItems.map(({ path, labelKey }) => {
              const active = location.pathname === path || (path !== '/' && path !== '/favorites' && location.pathname.startsWith(path))
              return (
                <Link
                  key={path}
                  to={path}
                  className={active ? 'active' : ''}
                >
                  {t(labelKey)}
                </Link>
              )
            })}
            <LanguageSwitcher />
            <span className="nav-auth">
              {user ? (
                <>
                  <span className="nav-user">{user.name}（{levelName}）</span>
                  <button type="button" className="btn-logout" onClick={logout}>{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link to="/login">{t('nav.login')}</Link>
                  <span className="nav-sep">|</span>
                  <Link to="/register">{t('nav.register')}</Link>
                </>
              )}
            </span>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  )
}
