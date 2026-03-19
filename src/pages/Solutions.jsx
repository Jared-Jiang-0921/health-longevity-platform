import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getConsultTrialCount, incrementConsultTrial } from '../data/storageKeys'
import './Solutions.css'

const MANUS_DEFAULT_URL = 'https://longevityconsult.vip'
const MANUS_PROFESSIONAL_URL = import.meta.env.VITE_MANUS_PROFESSIONAL_URL || MANUS_DEFAULT_URL
const MANUS_SELF_URL = import.meta.env.VITE_MANUS_SELF_URL || MANUS_DEFAULT_URL
const FREE_TRIAL_LIMIT = 5

export default function Solutions() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isFreeUser = !user || user.level === 'free'
  const trialUsed = isFreeUser ? getConsultTrialCount(user?.email || '') : 0
  const trialExhausted = isFreeUser && trialUsed >= FREE_TRIAL_LIMIT
  const manusUrl = MANUS_PROFESSIONAL_URL || MANUS_SELF_URL || MANUS_DEFAULT_URL
  const embedRef = useRef(null)

  // 对于免费用户：由于 iframe 默认自动加载，我们这里在本次会话首次展示时消耗 1 次试用次数。
  useEffect(() => {
    if (trialExhausted) return
    if (!isFreeUser) return
    if (!manusUrl) return

    const email = user?.email || ''
    if (!email) return // 未登录/无邮箱时，不做试用计数（与原逻辑保持一致）

    const sessionKey = `health-platform-consult-trial-viewed:${email}`
    if (sessionStorage.getItem(sessionKey)) return

    incrementConsultTrial(email)
    sessionStorage.setItem(sessionKey, '1')
  }, [trialExhausted, isFreeUser, manusUrl, user?.email])

  const handleButtonClick = () => {
    embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page-solutions">
      <h1>
        {t('solutions.title')}（单入口）
      </h1>
      <p className="subtitle">{t('solutions.subtitle')}</p>

      {isFreeUser && (
        <p className="trial-remaining">
          {t('solutions.trialRemaining', { count: FREE_TRIAL_LIMIT - trialUsed })}
        </p>
      )}

      {trialExhausted ? (
        <div className="solutions-trial-exhausted">
          <p>{t('solutions.trialExhaustedText')}</p>
          <Link to="/payment?plan=member-basic" className="btn-primary">
            {t('common.upgradeMember')}
          </Link>
        </div>
      ) : (
        <div className="solutions-single-consult">
          <button type="button" className="solutions-link-btn solutions-consult-btn" onClick={handleButtonClick}>
            健康长寿咨询
          </button>

          <section className="manus-embed" ref={embedRef}>
            <iframe
              title="manus-consult"
              src={manusUrl}
              className="manus-embed-frame"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-read; clipboard-write"
            />
          </section>
        </div>
      )}
    </div>
  )
}
