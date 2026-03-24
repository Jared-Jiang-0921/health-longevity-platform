import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './OrgInviteAccept.css'

export default function OrgInviteAccept() {
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
      if (!res.ok) throw new Error(data.error || data.code || '接受邀请失败')
      await refreshUser()
      setHint(`已加入企业：${data.org?.name || ''}`)
    } catch (e) {
      setError(e.message || '接受邀请失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-content org-invite-accept-page">
        <h1>接受企业邀请</h1>
        <p>加载中…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content org-invite-accept-page">
        <h1>接受企业邀请</h1>
        <p>请先登录后接受邀请。</p>
      </div>
    )
  }

  return (
    <div className="page-content org-invite-accept-page">
      <h1>接受企业邀请</h1>
      <p className="org-note">当前登录邮箱：{user.email}</p>
      {!token ? (
        <p className="org-error">邀请链接缺少 token，请确认链接完整。</p>
      ) : (
        <button type="button" className="btn-primary" disabled={submitting} onClick={acceptInvite}>
          {submitting ? '处理中…' : '接受邀请'}
        </button>
      )}
      {error ? <p className="org-error">{error}</p> : null}
      {hint ? <p className="org-hint">{hint}</p> : null}
    </div>
  )
}
