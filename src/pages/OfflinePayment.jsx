import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function OfflinePayment() {
  const { t } = useTranslation()
  return (
    <div className="page-content">
      <h1>{t('offlinePayment.title')}</h1>
      <p>{t('offlinePayment.intro')}</p>

      <section>
        <h2>{t('offlinePayment.section1Title')}</h2>
        <p>{t('offlinePayment.section1Body')}</p>
      </section>

      <section>
        <h2>{t('offlinePayment.section2Title')}</h2>
        <p>{t('offlinePayment.section2Body')}</p>
        <p>{t('offlinePayment.section2ListTitle')}</p>
        <ul>
          <li>{t('offlinePayment.section2Item1')}</li>
          <li>{t('offlinePayment.section2Item2')}</li>
          <li>{t('offlinePayment.section2Item3')}</li>
        </ul>
      </section>

      <section>
        <h2>{t('offlinePayment.section3Title')}</h2>
        <p>{t('offlinePayment.section3Body')}</p>
        <ul>
          <li>{t('offlinePayment.section3Item1')}</li>
          <li>{t('offlinePayment.section3Item2')}</li>
        </ul>
        <p>{t('offlinePayment.section3Note')}</p>
      </section>

      <section>
        <h2>{t('offlinePayment.section4Title')}</h2>
        <p>{t('offlinePayment.section4Body')}</p>
        <ul>
          <li>{t('offlinePayment.section4Item1')}</li>
          <li>{t('offlinePayment.section4Item2')}</li>
        </ul>
      </section>

      <section>
        <h2>{t('offlinePayment.section5Title')}</h2>
        <p>{t('offlinePayment.section5Body')}</p>
      </section>

      <p>
        {t('offlinePayment.backOnline')}
        {' '}
        <Link to="/payment">{t('offlinePayment.onlineLink')}</Link>
        {t('offlinePayment.backOnlineSuffix')}
      </p>
    </div>
  )
}

