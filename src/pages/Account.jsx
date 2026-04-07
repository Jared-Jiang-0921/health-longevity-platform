import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { MEMBERSHIP_LEVELS } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
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

function AccountTotpSection({ user, getToken, refreshUser }) {
  const [setup, setSetup] = useState(null)
  const [code, setCode] = useState('')
  const [disablePwd, setDisablePwd] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const startSetup = async () => {
    setMsg('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/totp-setup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '无法获取密钥')
      setSetup({ secret: data.secret, otpauthUrl: data.otpauthUrl, issuer: data.issuer })
      setCode('')
    } catch (e) {
      setMsg(e.message || '失败')
    } finally {
      setBusy(false)
    }
  }

  const enable = async () => {
    if (!setup) return
    setMsg('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/totp-enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ secret: setup.secret, code: code.replace(/\s/g, '') }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '启用失败')
      setSetup(null)
      setCode('')
      setMsg('已启用双重验证')
      await refreshUser()
    } catch (e) {
      setMsg(e.message || '失败')
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    setMsg('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/totp-disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ password: disablePwd }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '关闭失败')
      setDisablePwd('')
      setMsg('已关闭双重验证')
      await refreshUser()
    } catch (e) {
      setMsg(e.message || '失败')
    } finally {
      setBusy(false)
    }
  }

  if (user.totp_enabled) {
    return (
      <section className="account-totp">
        <h2 className="account-totp-title">双重验证（2FA）</h2>
        <p className="account-muted">已启用 TOTP 验证器（Google Authenticator、Microsoft Authenticator 等）。</p>
        <label className="account-totp-label">
          <span>输入登录密码以关闭 2FA</span>
          <input
            type="password"
            value={disablePwd}
            onChange={(e) => setDisablePwd(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="button" className="account-totp-btn" onClick={disable} disabled={busy}>
          {busy ? '处理中…' : '关闭双重验证'}
        </button>
        {msg ? <p className="account-totp-msg">{msg}</p> : null}
      </section>
    )
  }

  return (
    <section className="account-totp">
      <h2 className="account-totp-title">双重验证（2FA）</h2>
      <p className="account-muted">启用后，登录除密码外还需输入验证器中的 6 位数字。</p>
      {!setup ? (
        <button type="button" className="account-totp-btn primary" onClick={startSetup} disabled={busy}>
          {busy ? '请稍候…' : '开始启用'}
        </button>
      ) : (
        <>
          <p className="account-muted">用验证器扫描下方二维码，或手动输入密钥。</p>
          <div className="account-totp-qr">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setup.otpauthUrl)}`}
              alt="QR"
              width={180}
              height={180}
            />
          </div>
          <p className="account-totp-secret">
            <code>{setup.secret}</code>
          </p>
          <label className="account-totp-label">
            <span>输入验证器中显示的 6 位数字以确认</span>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={8}
            />
          </label>
          <div className="account-totp-actions">
            <button type="button" className="account-totp-btn primary" onClick={enable} disabled={busy}>
              {busy ? '确认中…' : '确认启用'}
            </button>
            <button
              type="button"
              className="account-totp-btn"
              onClick={() => {
                setSetup(null)
                setCode('')
              }}
              disabled={busy}
            >
              取消
            </button>
          </div>
        </>
      )}
      {msg ? <p className="account-totp-msg">{msg}</p> : null}
    </section>
  )
}

export default function Account() {
  const { lang } = useLocale()
  const T = {
    zh: { title: '会员信息', loading: '加载中…', needLogin: '请先登录后查看。', login: '登录', refresh: '刷新', name: '昵称', email: '登录邮箱', level: '会员等级', expires: '有效期至', hint: '支付成功后若未更新，请点击「刷新」或重新登录。升级会员请前往' },
    en: { title: 'Account', loading: 'Loading…', needLogin: 'Please login first.', login: 'Login', refresh: 'Refresh', name: 'Name', email: 'Email', level: 'Membership', expires: 'Expires at', hint: 'If payment status is not updated, click refresh or login again. Upgrade at ' },
    ar: { title: 'الحساب', loading: 'جار التحميل…', needLogin: 'يرجى تسجيل الدخول أولاً.', login: 'تسجيل الدخول', refresh: 'تحديث', name: 'الاسم', email: 'البريد الإلكتروني', level: 'العضوية', expires: 'تاريخ الانتهاء', hint: 'إذا لم يتم تحديث الحالة بعد الدفع، اضغط تحديث أو سجّل الدخول مجددًا. للترقية انتقل إلى ' },
  }
  const t = T[lang] || T.zh
  const { user, loading, refreshUser, getToken } = useAuth()

  if (loading) {
    return (
      <div className="page-content account-page">
        <p className="account-muted">{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content account-page">
        <h1>{t.title}</h1>
        <p>{t.needLogin}</p>
        <p>
          <Link to="/login" className="btn-primary">{t.login}</Link>
        </p>
      </div>
    )
  }

  const levelName = getMembershipLevelLabel(user.level, lang)

  let expiresDisplay = formatExpires(user.expires_at)
  if (user.site_admin) {
    expiresDisplay = user.expires_at
      ? `库内记录 ${formatExpires(user.expires_at)}（整站管理员不受付费到期限制）`
      : '—（整站管理员不受付费到期限制）'
  } else if (user.level === 'free' && user.expires_at) {
    const end = new Date(user.expires_at)
    if (!Number.isNaN(end.getTime()) && end < new Date()) {
      expiresDisplay = `已过期（${formatExpires(user.expires_at)}）`
    }
  } else if (user.level === 'free' && !user.expires_at) {
    expiresDisplay = '普通会员（未开通付费）'
  }

  return (
    <div className="page-content account-page">
      <div className="account-toolbar">
        <h1>{t.title}</h1>
        <button type="button" className="btn-refresh" onClick={() => refreshUser()}>
          {t.refresh}
        </button>
      </div>
      <dl className="account-dl">
        <div className="account-row">
          <dt>{t.name}</dt>
          <dd>{user.name}</dd>
        </div>
        <div className="account-row">
          <dt>{t.email}</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="account-row">
          <dt>{t.level}</dt>
          <dd>
            {levelName}
            {user.site_admin ? <span className="account-muted">（整站管理员 · 全模块按高级会员开放）</span> : null}
          </dd>
        </div>
        <div className="account-row">
          <dt>{t.expires}</dt>
          <dd>{expiresDisplay}</dd>
        </div>
      </dl>
      <p className="account-hint">
        {t.hint}
        <Link to="/payment">支付结算</Link>。
      </p>

      <AccountTotpSection user={user} getToken={getToken} refreshUser={refreshUser} />
    </div>
  )
}
