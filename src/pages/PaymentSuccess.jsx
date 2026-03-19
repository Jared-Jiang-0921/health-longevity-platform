import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { CHECKOUT_STORAGE_KEY, appendPaymentHistory, getPaymentHistory } from '../data/storageKeys'

export default function PaymentSuccess() {
  const { t } = useTranslation()
  const { user, upgradeMembership } = useAuth()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      const hist = getPaymentHistory()
      const alreadyRecorded = hist[0]?.label === data.label && hist[0]?.amount === data.amount && (Date.now() - (hist[0]?.completedAt || 0)) < 120000
      if (!alreadyRecorded) appendPaymentHistory(data)

      // 升级会员：普通 → standard，高级 → premium
      if (user && data?.category === 'membership') {
        if (data.planId === 'member-basic') {
          upgradeMembership('standard')
        } else if (data.planId === 'member-premium') {
          upgradeMembership('premium')
        }
      }

      setSummary(data)
    } catch {
      // ignore
    }
  }, [user, upgradeMembership])

  const title =
    summary?.category === 'membership'
      ? t('paymentSuccess.titleMembership')
      : summary?.category === 'service'
        ? t('paymentSuccess.titleService')
        : t('paymentSuccess.titleDefault')

  return (
    <div className="page-content">
      <h1>{title}</h1>
      {summary ? (
        <>
          <p>
            {t('paymentSuccess.completed')}
            <br />
            {t('paymentSuccess.type')}：{summary.category === 'membership' ? t('paymentSuccess.typeMembership') : t('paymentSuccess.typeService')}
            <br />
            {t('paymentSuccess.item')}：{summary.planId ? t(`payment.plans.${summary.planId}.label`) : summary.label}
            <br />
            {t('paymentSuccess.amount')}：HK${(summary.amount / 100).toFixed(2)}
          </p>
          {summary.category === 'membership' && user && (
            <p>{t('paymentSuccess.accountDone', { email: user.email })}</p>
          )}
          {summary.category === 'membership' && !user && (
            <p>{t('paymentSuccess.needLogin')}</p>
          )}
        </>
      ) : (
        <p>{t('paymentSuccess.thanks')}</p>
      )}
      <Link to="/" className="btn-primary">{t('paymentSuccess.backHome')}</Link>
    </div>
  )
}
