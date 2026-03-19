import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { canAccess, getRequiredLevel, MEMBERSHIP_LEVELS } from '../data/membership'
import './Home.css'

const modulePathToKey = {
  '/health-skills': { title: 'home.moduleHealthSkills', desc: 'home.moduleHealthSkillsDesc' },
  '/solutions': { title: 'home.moduleSolutions', desc: 'home.moduleSolutionsDesc' },
  '/products': { title: 'home.moduleProducts', desc: 'home.moduleProductsDesc' },
  '/longevity-news': { title: 'home.moduleNews', desc: 'home.moduleNewsDesc' },
  '/tcm-prevention': { title: 'home.moduleTcm', desc: 'home.moduleTcmDesc' },
}

const modulePaths = Object.keys(modulePathToKey)
const moduleImages = {
  '/health-skills': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  '/solutions': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
  '/products': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  '/longevity-news': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  '/tcm-prevention': 'https://images.pexels.com/photos/2064359/pexels-photo-2064359.jpeg?auto=compress&cs=tinysrgb&w=400',
}

export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <h1>{t('home.title')}</h1>
          <p className="hero-slogan">{t('home.slogan')}</p>
          <p className="tagline">{t('home.tagline')}</p>
          <p className="hero-intro">
            <strong>{t('home.intro1')}</strong>
            <br />
            {t('home.intro2')}
            <br />
            {t('home.intro3')}
            <br />
            {t('home.intro4')}
          </p>
          <div className="hero-auth">
            {user ? (
              <span className="hero-user">
                {t('home.welcome', { name: user.name, level: t(`membership.${user.level}`) })}
              </span>
            ) : (
              <>
                <Link to="/login" className="btn-hero btn-login">{t('nav.login')}</Link>
                <Link to="/register" className="btn-hero btn-register">{t('nav.register')}</Link>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="modules">
        <h2>{t('home.modulesTitle')}</h2>
        <div className="module-grid">
          {modulePaths.map((path) => {
            const keys = modulePathToKey[path]
            const allowed = canAccess(path, user?.level)
            const requiredLevel = getRequiredLevel(path)
            const requiredName = requiredLevel ? t(`membership.${requiredLevel}`) : null

            if (allowed) {
              return (
                <Link key={path} to={path} className="module-card">
                  <div className="module-card-image" style={{ backgroundImage: `url(${moduleImages[path]})` }} />
                  <div className="module-card-body">
                    <h3>{t(keys.title)}</h3>
                    <p>{t(keys.desc)}</p>
                  </div>
                </Link>
              )
            }
            return (
              <div key={path} className="module-card module-card-locked">
                <div className="module-card-image" style={{ backgroundImage: `url(${moduleImages[path]})` }} />
                <div className="module-card-body">
                  <h3>{t(keys.title)}</h3>
                  <p>{t(keys.desc)}</p>
                  <p className="module-lock">{t('home.moduleLock', { level: requiredName })}</p>
                  <Link to="/register" className="btn-upgrade">{t('common.upgradeMember')}</Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
