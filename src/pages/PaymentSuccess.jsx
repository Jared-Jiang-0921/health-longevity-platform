import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getUi } from '../i18n/ui'

const TOKEN_KEY = 'health-platform-token'

export default function PaymentSuccess() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { syncing: '正在同步会员信息…', syncHint: '同步提示：', notDone: '同步未完成，请刷新页面重试', net: '网络异常，请刷新页面', title: '支付成功', thanks: '感谢您的支付，订单已确认。', home: '返回首页' },
    en: { syncing: 'Syncing membership…', syncHint: 'Sync note: ', notDone: 'Sync not completed. Please refresh.', net: 'Network error, please refresh', title: 'Payment Success', thanks: 'Thank you for your payment. Your order is confirmed.', home: 'Back Home' },
    ar: { syncing: 'جار مزامنة العضوية…', syncHint: 'ملاحظة المزامنة: ', notDone: 'لم تكتمل المزامنة، يرجى التحديث', net: 'خطأ في الشبكة، يرجى التحديث', title: 'تم الدفع بنجاح', thanks: 'شكرًا لك، تم تأكيد طلبك.', home: 'العودة للرئيسية' },
  }[lang || 'zh']
  const [searchParams] = useSearchParams()
  const { refreshUser } = useAuth()
  const [syncHint, setSyncHint] = useState(t.syncing || ui.loading)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const token = localStorage.getItem(TOKEN_KEY)

    async function syncMembership() {
      if (sessionId && token) {
        try {
          const res = await fetch('/api/confirm-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) {
            setSyncHint(data.error ? `${t.syncHint}${data.error}` : t.notDone)
            await refreshUser()
            return
          }
        } catch {
          setSyncHint(t.net)
        }
      }
      await refreshUser()
      setSyncHint('')
    }

    syncMembership()
  }, [searchParams, refreshUser])

  return (
    <div className="page-content">
      <h1>{t.title}</h1>
      <p>{t.thanks}</p>
      {syncHint && <p className="payment-note">{syncHint}</p>}
      <p>
        <Link to="/" className="btn-primary">{t.home}</Link>
      </p>
    </div>
  )
}
