import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS, MODULE_ACCESS, getRecommendedUpgradePlan } from '../data/membership'
import { getPaymentHistory } from '../data/storageKeys'

const pathToModuleKey = {
  '/health-skills': 'account.moduleHealthSkills',
  '/solutions': 'account.moduleSolutions',
  '/products': 'account.moduleProducts',
  '/longevity-news': 'account.moduleNews',
  '/tcm-prevention': 'account.moduleTcm',
  '/favorites': 'account.moduleFavorites',
}

export default function Account() {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="page-content">
        <h1>{t('account.title')}</h1>
        <p>{t('account.pleaseLogin')}</p>
        <p>
          <Link to="/login" className="btn-primary">{t('nav.login')}</Link>
          {' '}
          {t('common.or')}
          {' '}
          <Link to="/register">{t('account.registerNew')}</Link>
        </p>
      </div>
    )
  }

  const levelInfo = MEMBERSHIP_LEVELS[user.level] || MEMBERSHIP_LEVELS.free
  const levelName = t(`membership.${user.level}`)
  const benefits = t(`membership.benefits.${user.level}`, { returnObjects: true })
  const benefitsList = Array.isArray(benefits) ? benefits : []
  const upgradePlanId = getRecommendedUpgradePlan(user.level)
  const upgradeHref = upgradePlanId ? `/payment?plan=${upgradePlanId}` : '/payment'
  const paymentHistory = getPaymentHistory()

  const accessibleModules = Object.entries(MODULE_ACCESS)
    .filter(([, required]) => {
      const requiredOrder = ['free', 'standard', 'premium'].indexOf(required)
      const userOrder = ['free', 'standard', 'premium'].indexOf(user.level || 'free')
      return userOrder >= requiredOrder
    })
    .map(([path]) => path)

  return (
    <div className="page-content">
      <h1>{t('account.title')}</h1>

      <section className="account-section">
        <h2>{t('account.info')}</h2>
        <p><strong>{t('account.email')}</strong>{user.email}</p>
        <p><strong>{t('account.currentLevel')}</strong>{levelName}</p>
        {upgradePlanId && (
          <p>
            <Link to={upgradeHref} className="btn-primary">
              {t('account.upgrade')}
            </Link>
          </p>
        )}
      </section>

      <section className="account-section">
        <h2>{t('account.myBenefits')}</h2>
        <ul className="benefits-list">
          {benefitsList.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="account-section">
        <h2>{t('account.accessibleModules')}</h2>
        <ul>
          <li>{t('account.moduleHome')}</li>
          {accessibleModules.includes('/health-skills') && <li>{t('account.moduleHealthSkills')}</li>}
          {accessibleModules.includes('/solutions') && <li>{t('account.moduleSolutions')}</li>}
          {accessibleModules.includes('/products') && <li>{t('account.moduleProducts')}</li>}
          {accessibleModules.includes('/longevity-news') && <li>{t('account.moduleNews')}</li>}
          {accessibleModules.includes('/tcm-prevention') && <li>{t('account.moduleTcm')}</li>}
          {accessibleModules.includes('/favorites') && <li>{t('account.moduleFavorites')}</li>}
        </ul>
      </section>

      <section className="account-section">
        <h2>{t('account.paymentHistory')}</h2>
        {paymentHistory.length > 0 ? (
          <ul className="payment-history-list">
            {paymentHistory.map((item, i) => (
              <li key={i} className="payment-history-item">
                <span>{item.category === 'membership' ? t('account.membershipFee') : t('account.serviceFee')}</span>
                <span>{item.label}</span>
                <span>US${((item.amount || 0) / 100).toFixed(2)}</span>
                <span>{item.completedAt ? new Date(item.completedAt).toLocaleString() : ''}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t('account.noPaymentHistory')}</p>
        )}
        <p>
          <Link to="/payment">{t('common.goToPayment')}</Link>
        </p>
      </section>
    </div>
  )
}
