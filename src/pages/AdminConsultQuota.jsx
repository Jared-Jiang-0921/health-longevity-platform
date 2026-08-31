import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { fetchConsultQuotaAdmin, grantConsultQuota } from '../lib/consultApi'
import './AdminUsers.css'

const LIMIT = 30

function todayShanghai() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function fmtNum(n) {
  const v = Math.max(0, Number(n) || 0)
  return v.toLocaleString('zh-CN')
}

export default function AdminConsultQuota() {
  const { lang } = useLocale()
  const t = {
    zh: {
      title: '咨询额度',
      note: '按北京时间自然日查看用量。补额度只增加当天上限，次日仍按会员档位恢复。',
      token: '整站管理 Token（可选）',
      tokenPh: '未配置时可留空，仅用管理员邮箱登录',
      day: '日期',
      search: '搜索邮箱或姓名',
      searchBtn: '查询',
      refresh: '刷新',
      total: '共',
      rows: '条',
      email: '邮箱',
      name: '姓名',
      level: '档位',
      used: '已用',
      bonus: '补发',
      limit: '当日上限',
      remaining: '剩余',
      action: '操作',
      grant: '补额度',
      grantPh: '数量',
      empty: '这一天还没有用量记录。可用上方搜索按邮箱补发。',
      loadFail: '加载失败',
      grantFail: '补发失败',
      grantOk: '已补发',
      grantConfirm: (email, n) => `给 ${email || '该用户'} 补 ${n} token？仅对所选日期有效。`,
      unlimited: '不限',
    },
    en: {
      title: 'Consult quota',
      note: 'Usage is counted by Beijing calendar day. Grants only raise that day’s cap.',
      token: 'Site admin token (optional)',
      tokenPh: 'Leave empty if logged in as admin',
      day: 'Day',
      search: 'Search email or name',
      searchBtn: 'Search',
      refresh: 'Refresh',
      total: 'Total',
      rows: '',
      email: 'Email',
      name: 'Name',
      level: 'Level',
      used: 'Used',
      bonus: 'Grant',
      limit: 'Day cap',
      remaining: 'Left',
      action: 'Actions',
      grant: 'Add quota',
      grantPh: 'Amount',
      empty: 'No usage this day. Search by email to grant.',
      loadFail: 'Failed to load',
      grantFail: 'Grant failed',
      grantOk: 'Granted',
      grantConfirm: (email, n) => `Add ${n} tokens for ${email || 'this user'} on the selected day?`,
      unlimited: 'Unlimited',
    },
    ar: {
      title: 'حصة الاستشارة',
      note: 'الاستخدام يُحسب حسب يوم بكين. الزيادة لليوم المحدد فقط.',
      token: 'رمز الإدارة (اختياري)',
      tokenPh: 'اتركه فارغًا إذا سجلت كمسؤول',
      day: 'اليوم',
      search: 'بحث بالبريد أو الاسم',
      searchBtn: 'بحث',
      refresh: 'تحديث',
      total: 'الإجمالي',
      rows: '',
      email: 'البريد',
      name: 'الاسم',
      level: 'المستوى',
      used: 'المستخدم',
      bonus: 'إضافة',
      limit: 'الحد',
      remaining: 'المتبقي',
      action: 'إجراءات',
      grant: 'زيادة الحصة',
      grantPh: 'الكمية',
      empty: 'لا استخدام في هذا اليوم.',
      loadFail: 'فشل التحميل',
      grantFail: 'فشل الإضافة',
      grantOk: 'تمت',
      grantConfirm: (email, n) => `إضافة ${n} لـ ${email || 'المستخدم'}؟`,
      unlimited: 'بلا حد',
    },
  }[lang || 'zh']

  const { user, loading: authLoading, getToken } = useAuth()
  const [siteAdminToken, setSiteAdminToken] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('site_admin_token') || '' : '',
  )
  const [day, setDay] = useState(todayShanghai)
  const [searchInput, setSearchInput] = useState('')
  const [q, setQ] = useState('')
  const [offset, setOffset] = useState(0)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [savingId, setSavingId] = useState('')
  const [amounts, setAmounts] = useState({})

  const token = getToken()
  const headers = useMemo(() => {
    const h = { Authorization: `Bearer ${token}` }
    const tkn = siteAdminToken.trim()
    if (tkn) h['x-site-admin-token'] = tkn
    return h
  }, [siteAdminToken, token])

  const persistToken = (value) => {
    setSiteAdminToken(value)
    try {
      if (value.trim()) localStorage.setItem('site_admin_token', value.trim())
      else localStorage.removeItem('site_admin_token')
    } catch {
      /* ignore */
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const data = await fetchConsultQuotaAdmin(headers, { day, q, limit: LIMIT, offset })
      setList(Array.isArray(data.items) ? data.items : [])
      setTotal(typeof data.total === 'number' ? data.total : 0)
    } catch (err) {
      setError(err.message || t.loadFail)
      setList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [headers, day, q, offset, t.loadFail])

  useEffect(() => {
    if (!authLoading && user) load()
  }, [authLoading, user, load])

  async function grantRow(row) {
    if (!row?.user_id || savingId) return
    const n = Math.ceil(Number(amounts[row.user_id] || 20000))
    if (!(n > 0)) return
    if (!window.confirm(t.grantConfirm(row.email, n))) return
    setSavingId(row.user_id)
    setError('')
    setNotice('')
    try {
      await grantConsultQuota(headers, { userId: row.user_id, tokens: n, day })
      setNotice(t.grantOk)
      await load()
    } catch (err) {
      setError(err.message || t.grantFail)
    } finally {
      setSavingId('')
    }
  }

  return (
    <div className="page-content admin-users-page">
      <h1>{t.title}</h1>
      <p>{t.note}</p>
      <p>
        <label>
          {t.token}
          <input
            type="password"
            value={siteAdminToken}
            placeholder={t.tokenPh}
            onChange={(e) => persistToken(e.target.value)}
            autoComplete="off"
            style={{ marginLeft: '0.5rem', minWidth: '16rem' }}
          />
        </label>
      </p>
      <p>
        <label>
          {t.day}
          {' '}
          <input
            type="date"
            value={day}
            onChange={(e) => {
              setOffset(0)
              setDay(e.target.value || todayShanghai())
            }}
          />
        </label>
        {' '}
        <input
          type="search"
          value={searchInput}
          placeholder={t.search}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setOffset(0)
              setQ(searchInput.trim())
            }
          }}
          style={{ minWidth: '14rem' }}
        />
        {' '}
        <button
          type="button"
          className="admin-users-btn"
          onClick={() => {
            setOffset(0)
            setQ(searchInput.trim())
          }}
        >
          {t.searchBtn}
        </button>
        <button type="button" className="admin-users-btn secondary" onClick={load} disabled={loading}>
          {t.refresh}
        </button>
        <span> {t.total} {total} {t.rows}</span>
      </p>
      {error ? <p className="chat-error" role="alert">{error}</p> : null}
      {notice ? <p role="status">{notice}</p> : null}
      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>{t.email}</th>
              <th>{t.name}</th>
              <th>{t.level}</th>
              <th>{t.used}</th>
              <th>{t.bonus}</th>
              <th>{t.limit}</th>
              <th>{t.remaining}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {loading && !list.length ? (
              <tr><td colSpan={8}>…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={8}>{t.empty}</td></tr>
            ) : list.map((row) => (
              <tr key={row.user_id}>
                <td>{row.email || row.user_id}</td>
                <td>{row.name || '—'}</td>
                <td>{row.unlimited ? t.unlimited : row.level}</td>
                <td>{fmtNum(row.used)}</td>
                <td>{fmtNum(row.bonus)}</td>
                <td>{row.unlimited ? t.unlimited : fmtNum(row.limit)}</td>
                <td>{row.unlimited ? t.unlimited : fmtNum(row.remaining)}</td>
                <td>
                  {row.unlimited ? '—' : (
                    <>
                      <input
                        type="number"
                        min="1"
                        step="1000"
                        placeholder={t.grantPh}
                        value={amounts[row.user_id] ?? '20000'}
                        onChange={(e) => setAmounts((prev) => ({ ...prev, [row.user_id]: e.target.value }))}
                        style={{ width: '7rem', marginRight: '0.35rem' }}
                      />
                      <button
                        type="button"
                        className="admin-users-btn small"
                        disabled={savingId === row.user_id}
                        onClick={() => grantRow(row)}
                      >
                        {t.grant}
                      </button>
                    </>
                  )}
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
          disabled={offset <= 0 || loading || Boolean(q)}
          onClick={() => setOffset(Math.max(0, offset - LIMIT))}
        >
          ‹
        </button>
        <button
          type="button"
          className="admin-users-btn secondary"
          disabled={offset + LIMIT >= total || loading || Boolean(q)}
          onClick={() => setOffset(offset + LIMIT)}
        >
          ›
        </button>
      </div>
    </div>
  )
}
