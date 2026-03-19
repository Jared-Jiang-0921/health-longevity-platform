import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { canAccess, getRequiredLevel } from '../data/membership'

export default function ProtectedModule({ children }) {
  const location = useLocation()
  const { t } = useTranslation()
  const { user } = useAuth()
  const path = location.pathname
  const allowed = canAccess(path, user?.level)
  const required = getRequiredLevel(path)

  if (allowed) return children

  const levelName = required ? t(`membership.${required}`) : t('nav.login')

  return (
    <div className="page-content">
      <h1>{t('protected.insufficientTitle')}</h1>
      <p>
        {user
          ? t('protected.insufficientMember', { level: levelName })
          : t('protected.insufficientLogin')}
      </p>
      {!user ? (
        <p>
          <Link to="/login">{t('nav.login')}</Link>
          {' · '}
          <Link to="/register">{t('nav.register')}</Link>
        </p>
      ) : (
        <p><Link to="/">{t('protected.backHome')}</Link></p>
      )}
    </div>
  )
}
