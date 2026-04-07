import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import './OrgInviteAccept.css'

export default function OrgInviteAccept() {
  const { lang } = useLocale()
  const t = {
    zh: { title: '接受企业邀请', loading: '加载中…', needLogin: '请先登录后接受邀请。', current: '当前登录邮箱：', tokenMissing: '邀请链接缺少 token，请确认链接完整。', handling: '处理中…', accept: '接受邀请', fail: '接受邀请失败', joined: '已加入企业：' },
    en: { title: 'Accept Organization Invite', loading: 'Loading…', needLogin: 'Please login first to accept the invite.', current: 'Current account: ', tokenMissing: 'Invite token missing. Please verify the full link.', handling: 'Processing…', accept: 'Accept Invite', fail: 'Failed to accept invite', joined: 'Joined organization: ' },
    ar: { title: 'قبول دعوة المؤسسة', loading: 'جار التحميل…', needLogin: 'يرجى تسجيل الدخول أولاً.', current: 'الحساب الحالي: ', tokenMissing: 'رابط الدعوة يفتقد token.', handling: 'جار المعالجة…', accept: 'قبول الدعوة', fail: 'فشل قبول الدعوة', joined: 'تم الانضمام إلى المؤسسة: ' },
  }[lang || 'zh']
  const [search] = useSearchParams()
  const token = useMemo(() => String(search.get('token') || '').trim(), [search])
  const { user, loading, getToken, refreshUser } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')

  const acceptInvite = async () => {
    setSubmitting(true)
    setError('')
    setHint('')
    try {
      const jwt = getToken()
      const res = await fetch('/api/org/invite-accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ token }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || t.fail)
      await refreshUser()
      setHint(`${t.joined}${data.org?.name || ''}`)
    } catch (e) {
      setError(e.message || t.fail)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-content org-invite-accept-page">
        <h1>{t.title}</h1>
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content org-invite-accept-page">
        <h1>{t.title}</h1>
        <p>{t.needLogin}</p>
      </div>
    )
  }

  return (
    <div className="page-content org-invite-accept-page">
      <h1>{t.title}</h1>
      <p className="org-note">{t.current}{user.email}</p>
      {!token ? (
        <p className="org-error">{t.tokenMissing}</p>
      ) : (
        <button type="button" className="btn-primary" disabled={submitting} onClick={acceptInvite}>
          {submitting ? t.handling : t.accept}
        </button>
      )}
      {error ? <p className="org-error">{error}</p> : null}
      {hint ? <p className="org-hint">{hint}</p> : null}
    </div>
  )
}
