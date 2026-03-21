import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MEMBERSHIP_LEVELS } from '../data/membership'
import './Account.css'

function formatExpires(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

export default function Account() {
  const { user, loading, refreshUser } = useAuth()

  if (loading) {
    return (
      <div className="page-content account-page">
        <p className="account-muted">加载中…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content account-page">
        <h1>会员信息</h1>
        <p>请先登录后查看。</p>
        <p>
          <Link to="/login" className="btn-primary">登录</Link>
        </p>
      </div>
    )
  }

  const levelName = MEMBERSHIP_LEVELS[user.level]?.name || user.level

  let expiresDisplay = formatExpires(user.expires_at)
  if (user.level === 'free' && user.expires_at) {
    const end = new Date(user.expires_at)
    if (!Number.isNaN(end.getTime()) && end < new Date()) {
      expiresDisplay = `已过期（${formatExpires(user.expires_at)}）`
    }
  } else if (user.level === 'free' && !user.expires_at) {
    expiresDisplay = '免费会员（未开通付费）'
  }

  return (
    <div className="page-content account-page">
      <div className="account-toolbar">
        <h1>会员信息</h1>
        <button type="button" className="btn-refresh" onClick={() => refreshUser()}>
          刷新
        </button>
      </div>
      <dl className="account-dl">
        <div className="account-row">
          <dt>昵称</dt>
          <dd>{user.name}</dd>
        </div>
        <div className="account-row">
          <dt>登录邮箱</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="account-row">
          <dt>会员等级</dt>
          <dd>{levelName}</dd>
        </div>
        <div className="account-row">
          <dt>有效期至</dt>
          <dd>{expiresDisplay}</dd>
        </div>
      </dl>
      <p className="account-hint">
        支付成功后若未更新，请点击「刷新」或重新登录。升级会员请前往{' '}
        <Link to="/payment">支付结算</Link>。
      </p>
    </div>
  )
}
