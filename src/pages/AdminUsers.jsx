import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { MEMBERSHIP_LEVELS } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { getUi } from '../i18n/ui'
import { getMessages } from '../i18n/messages'
import { getAdminUi } from '../i18n/adminUi'
import './PaymentOpsMonitor.css'
import './AdminUsers.css'

const LIMIT = 50

function fmtTime(v) {
  if (!v) return '—'
  try {
    return new Date(v).toLocaleString('zh-CN')
  } catch {
    return String(v)
  }
}

function toDatetimeLocalValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromDatetimeLocalValue(s) {
  const t = String(s || '').trim()
  if (!t) return null
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function toJsonSafe(res) {
  return res.json().catch(() => ({}))
}

export default function AdminUsers() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const msg = getMessages(lang)
  const adminUi = getAdminUi(lang)
  const t = {
    zh: {
      title: '用户管理', allTitle: '整站用户管理', loading: ui.loading, needLogin: '请先登录后再访问；若使用邮箱白名单，请用管理员账号登录。', note: '需配置服务端', tokenLabel: '整站管理 Token（可选，与 JWT 二选一即可）', tokenPh: '未配置时可留空，仅用管理员邮箱登录', searchLabel: '搜索邮箱或姓名', search: ui.search, refresh: ui.refresh, total: '共', rows: '条；本页', loadingMark: '（加载中）', email: '邮箱', name: '姓名', level: '等级', expires: '到期', created: '注册', action: adminUi.actions, edit: adminUi.edit, clear: '清空到期', prev: ui.prev, next: ui.next, editUser: '编辑用户', userId: 'ID：', save: ui.save, saving: ui.saving, cancel: ui.cancel, invalidTime: '到期时间格式无效', saveFail: msg.saveFail, opFail: msg.operationFail, clearConfirm: '清空 {email} 的会员到期时间？', levelLabel: '会员等级', nameLabel: '姓名', expiresLabel: '会员到期（留空表示不设到期）'
    },
    en: {
      title: 'Users Admin', allTitle: 'Site-wide User Management', loading: ui.loading, needLogin: 'Please login first. If using email allowlist, login with admin account.', note: 'Server requires', tokenLabel: 'Site admin token (optional, can use JWT instead)', tokenPh: 'Leave empty if logging in with admin email', searchLabel: 'Search by email or name', search: ui.search, refresh: ui.refresh, total: 'Total', rows: '; this page', loadingMark: ' (loading)', email: 'Email', name: 'Name', level: 'Level', expires: 'Expires', created: 'Created', action: adminUi.actions, edit: adminUi.edit, clear: 'Clear expiry', prev: ui.prev, next: ui.next, editUser: 'Edit User', userId: 'ID: ', save: ui.save, saving: ui.saving, cancel: ui.cancel, invalidTime: 'Invalid expiration time format', saveFail: msg.saveFail, opFail: msg.operationFail, clearConfirm: 'Clear membership expiry for {email}?', levelLabel: 'Membership level', nameLabel: 'Name', expiresLabel: 'Membership expiry (empty = no expiry)'
    },
    ar: {
      title: 'إدارة المستخدمين', allTitle: 'إدارة مستخدمي الموقع', loading: ui.loading, needLogin: 'يرجى تسجيل الدخول أولاً؛ إذا كنت تستخدم قائمة السماح فادخل بحساب مسؤول.', note: 'يتطلب الخادم', tokenLabel: 'رمز إدارة الموقع (اختياري، أو JWT)', tokenPh: 'اتركه فارغًا إذا سجلت ببريد المسؤول', searchLabel: 'البحث بالبريد أو الاسم', search: ui.search, refresh: ui.refresh, total: 'الإجمالي', rows: '؛ في هذه الصفحة', loadingMark: ' (جار التحميل)', email: 'البريد', name: 'الاسم', level: 'المستوى', expires: 'الانتهاء', created: 'تاريخ التسجيل', action: adminUi.actions, edit: adminUi.edit, clear: 'مسح الانتهاء', prev: ui.prev, next: ui.next, editUser: 'تعديل المستخدم', userId: 'المعرّف: ', save: ui.save, saving: ui.saving, cancel: ui.cancel, invalidTime: 'تنسيق وقت الانتهاء غير صالح', saveFail: msg.saveFail, opFail: msg.operationFail, clearConfirm: 'مسح انتهاء العضوية لـ {email}؟', levelLabel: 'مستوى العضوية', nameLabel: 'الاسم', expiresLabel: 'انتهاء العضوية (فارغ = بلا انتهاء)'
    },
  }[lang || 'zh']
  const { user, loading: authLoading, getToken } = useAuth()
  const [siteAdminToken, setSiteAdminToken] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('site_admin_token') || '' : '',
  )
  const [q, setQ] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [offset, setOffset] = useState(0)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [edit, setEdit] = useState(null)

  const headers = useMemo(() => {
    const h = { 'Content-Type': 'application/json' }
    const jwt = getToken()
    if (jwt) h.Authorization = `Bearer ${jwt}`
    const t = siteAdminToken.trim()
    if (t) h['x-site-admin-token'] = t
    return h
  }, [siteAdminToken, getToken])

  const persistToken = (t) => {
    setSiteAdminToken(t)
    try {
      if (t.trim()) localStorage.setItem('site_admin_token', t.trim())
      else localStorage.removeItem('site_admin_token')
    } catch {
      /* ignore */
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams({
        limit: String(LIMIT),
        offset: String(offset),
      })
      if (q.trim()) qs.set('q', q.trim())
      const res = await fetch(`/api/admin-users?${qs}`, { headers })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || data.code || '加载失败')
      setList(Array.isArray(data.users) ? data.users : [])
      setTotal(typeof data.total === 'number' ? data.total : 0)
    } catch (e) {
      setError(e.message || '加载失败')
      setList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [headers, offset, q])

  useEffect(() => {
    if (!authLoading && user) load()
  }, [authLoading, user, load])

  const startEdit = (u) => {
    setEdit({
      id: u.id,
      name: u.name || '',
      level: u.level || 'free',
      expiresLocal: toDatetimeLocalValue(u.expires_at),
    })
  }

  const cancelEdit = () => setEdit(null)

  const saveEdit = async () => {
    if (!edit) return
    setSavingId(edit.id)
    setError('')
    try {
      const expiresIso = fromDatetimeLocalValue(edit.expiresLocal)
      if (expiresIso === undefined) {
        throw new Error(t.invalidTime)
      }
      const body = {
        user_id: edit.id,
        name: edit.name.trim(),
        level: edit.level,
        expires_at: expiresIso,
      }
      const res = await fetch('/api/admin-users', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || data.code || t.saveFail)
      setEdit(null)
      await load()
    } catch (e) {
      setError(e.message || t.saveFail)
    } finally {
      setSavingId(null)
    }
  }

  const clearExpires = async (u) => {
    if (!window.confirm(t.clearConfirm.replace('{email}', u.email))) return
    setSavingId(u.id)
    setError('')
    try {
      const res = await fetch('/api/admin-users', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ user_id: u.id, expires_at: null }),
      })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || data.code || t.opFail)
      if (edit?.id === u.id) setEdit((e) => (e ? { ...e, expiresLocal: '' } : e))
      await load()
    } catch (e) {
      setError(e.message || t.opFail)
    } finally {
      setSavingId(null)
    }
  }

  const applySearch = () => {
    setOffset(0)
    setQ(searchInput)
  }

  if (authLoading) {
    return (
      <div className="page-content admin-users-page">
        <h1>{t.title}</h1>
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content admin-users-page">
        <h1>{t.title}</h1>
        <p>{t.needLogin}</p>
      </div>
    )
  }

  const canPrev = offset > 0
  const canNext = offset + list.length < total

  return (
    <div className="page-content admin-users-page">
      <h1>{t.allTitle}</h1>
      <p className="ops-note">
        {t.note} <code>SITE_ADMIN_EMAILS</code>（管理员登录 JWT）或 <code>SITE_ADMIN_TOKEN</code>
        （请求头 <code>x-site-admin-token</code>）。与支付巡检配置相互独立。
      </p>

      <div className="ops-toolbar">
        <label className="ops-token">
          <span>{t.tokenLabel}</span>
          <input
            type="password"
            autoComplete="off"
            value={siteAdminToken}
            onChange={(e) => persistToken(e.target.value)}
            placeholder={t.tokenPh}
          />
        </label>
        <label>
          <span>{t.searchLabel}</span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
          />
        </label>
        <div>
          <button type="button" className="admin-users-btn" onClick={applySearch}>
            {t.search}
          </button>
          <button type="button" className="admin-users-btn secondary" onClick={load} disabled={loading}>
            {t.refresh}
          </button>
        </div>
      </div>

      {error ? <p className="ops-error">{error}</p> : null}

      <p className="ops-note">
        {t.total} <strong>{total}</strong> {t.rows} {list.length}
        {loading ? t.loadingMark : ''}
      </p>

      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>{t.email}</th>
              <th>{t.name}</th>
              <th>{t.level}</th>
              <th>{t.expires}</th>
              <th>{t.created}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td className="cell-mono">{u.email}</td>
                <td>{u.name}</td>
                <td>{getMembershipLevelLabel(u.level, lang)}</td>
                <td>{fmtTime(u.expires_at)}</td>
                <td>{fmtTime(u.created_at)}</td>
                <td>
                  <button
                    type="button"
                    className="admin-users-btn small"
                    onClick={() => startEdit(u)}
                    disabled={!!savingId}
                  >
                    {t.edit}
                  </button>
                  <button
                    type="button"
                    className="admin-users-btn small secondary"
                    onClick={() => clearExpires(u)}
                    disabled={!!savingId || !u.expires_at}
                  >
                    {t.clear}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-users-pager">
        <button
          type="button"
          className="admin-users-btn secondary"
          disabled={!canPrev || loading}
          onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
        >
          {t.prev}
        </button>
        <button
          type="button"
          className="admin-users-btn secondary"
          disabled={!canNext || loading}
          onClick={() => setOffset((o) => o + LIMIT)}
        >
          {t.next}
        </button>
      </div>

      {edit ? (
        <div className="ops-card admin-users-edit">
          <h2>{t.editUser}</h2>
          <p className="ops-note">{t.userId}{edit.id}</p>
          <div className="admin-users-edit-grid">
            <label>
              <span>{t.nameLabel}</span>
              <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </label>
            <label>
              <span>{t.levelLabel}</span>
              <select value={edit.level} onChange={(e) => setEdit({ ...edit, level: e.target.value })}>
                {Object.values(MEMBERSHIP_LEVELS).map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {getMembershipLevelLabel(lv.id, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="span-2">
              <span>{t.expiresLabel}</span>
              <input
                type="datetime-local"
                value={edit.expiresLocal}
                onChange={(e) => setEdit({ ...edit, expiresLocal: e.target.value })}
              />
            </label>
          </div>
          <div className="admin-users-edit-actions">
            <button type="button" className="admin-users-btn" onClick={saveEdit} disabled={!!savingId}>
              {savingId ? t.saving : t.save}
            </button>
            <button type="button" className="admin-users-btn secondary" onClick={cancelEdit} disabled={!!savingId}>
              {t.cancel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
