import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { fetchConsultReviews, updateConsultReview } from '../lib/consultApi'
import './AdminUsers.css'

const LIMIT = 30

function fmtTime(v) {
  if (!v) return '—'
  try {
    return new Date(v).toLocaleString('zh-CN')
  } catch {
    return String(v)
  }
}

export default function AdminConsultReviews() {
  const { lang } = useLocale()
  const t = {
    zh: {
      title: '咨询拦截审核',
      note: '安全策略拦截的提问会进入此队列。仅整站管理员可看。请勿外传用户原文。',
      token: '整站管理 Token（可选）',
      tokenPh: '未配置时可留空，仅用管理员邮箱登录',
      status: '状态',
      all: '全部',
      pending: '待审',
      reviewing: '审阅中',
      resolved: '已处理',
      dismissed: '已忽略',
      refresh: '刷新',
      total: '共',
      rows: '条',
      created: '时间',
      reason: '原因',
      user: '用户',
      message: '原文摘要',
      action: '操作',
      empty: '暂无记录。',
      loadFail: '加载失败',
      markReviewing: '开始审阅',
      markResolved: '已处理',
      markDismissed: '忽略',
    },
    en: {
      title: 'Consult review queue',
      note: 'Blocked consult questions land here. Site admins only. Do not share user text.',
      token: 'Site admin token (optional)',
      tokenPh: 'Leave empty if logged in as admin',
      status: 'Status',
      all: 'All',
      pending: 'Pending',
      reviewing: 'Reviewing',
      resolved: 'Resolved',
      dismissed: 'Dismissed',
      refresh: 'Refresh',
      total: 'Total',
      rows: '',
      created: 'Time',
      reason: 'Reason',
      user: 'User',
      message: 'Message',
      action: 'Actions',
      empty: 'No records.',
      loadFail: 'Failed to load',
      markReviewing: 'Start review',
      markResolved: 'Resolved',
      markDismissed: 'Dismiss',
    },
    ar: {
      title: 'مراجعة الاستشارات المحظورة',
      note: 'الأسئلة المحظورة تظهر هنا. للمسؤولين فقط.',
      token: 'رمز الإدارة (اختياري)',
      tokenPh: 'اتركه فارغًا إذا سجلت كمسؤول',
      status: 'الحالة',
      all: 'الكل',
      pending: 'معلق',
      reviewing: 'قيد المراجعة',
      resolved: 'تم',
      dismissed: 'مُتجاهل',
      refresh: 'تحديث',
      total: 'الإجمالي',
      rows: '',
      created: 'الوقت',
      reason: 'السبب',
      user: 'المستخدم',
      message: 'النص',
      action: 'إجراءات',
      empty: 'لا سجلات.',
      loadFail: 'فشل التحميل',
      markReviewing: 'بدء المراجعة',
      markResolved: 'تم',
      markDismissed: 'تجاهل',
    },
  }[lang || 'zh']

  const { user, loading: authLoading, getToken } = useAuth()
  const [siteAdminToken, setSiteAdminToken] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('site_admin_token') || '' : '',
  )
  const [status, setStatus] = useState('pending')
  const [offset, setOffset] = useState(0)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')

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
    try {
      const data = await fetchConsultReviews(headers, { status, limit: LIMIT, offset })
      setList(Array.isArray(data.items) ? data.items : [])
      setTotal(typeof data.total === 'number' ? data.total : 0)
    } catch (err) {
      setError(err.message || t.loadFail)
      setList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [headers, status, offset, t.loadFail])

  useEffect(() => {
    if (!authLoading && user) load()
  }, [authLoading, user, load])

  async function setItemStatus(id, next) {
    if (!id || savingId) return
    setSavingId(id)
    setError('')
    try {
      await updateConsultReview(headers, id, { status: next })
      await load()
    } catch (err) {
      setError(err.message || t.loadFail)
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
          {t.status}
          {' '}
          <select
            value={status}
            onChange={(e) => {
              setOffset(0)
              setStatus(e.target.value)
            }}
          >
            <option value="pending">{t.pending}</option>
            <option value="reviewing">{t.reviewing}</option>
            <option value="resolved">{t.resolved}</option>
            <option value="dismissed">{t.dismissed}</option>
            <option value="">{t.all}</option>
          </select>
        </label>
        {' '}
        <button type="button" className="admin-users-btn secondary" onClick={load} disabled={loading}>
          {t.refresh}
        </button>
        <span> {t.total} {total} {t.rows}</span>
      </p>
      {error ? <p className="chat-error" role="alert">{error}</p> : null}
      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>{t.created}</th>
              <th>{t.status}</th>
              <th>{t.reason}</th>
              <th>{t.user}</th>
              <th>{t.message}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {loading && !list.length ? (
              <tr><td colSpan={6}>…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6}>{t.empty}</td></tr>
            ) : list.map((row) => (
              <tr key={row.id}>
                <td>{fmtTime(row.created_at)}</td>
                <td>{t[row.status] || row.status}</td>
                <td className="cell-mono">{row.reason}</td>
                <td className="cell-mono">{row.user_id || '—'}</td>
                <td>{row.payload?.message || '—'}</td>
                <td>
                  {row.status === 'pending' ? (
                    <button
                      type="button"
                      className="admin-users-btn small"
                      disabled={savingId === row.id}
                      onClick={() => setItemStatus(row.id, 'reviewing')}
                    >
                      {t.markReviewing}
                    </button>
                  ) : null}
                  {row.status === 'pending' || row.status === 'reviewing' ? (
                    <>
                      <button
                        type="button"
                        className="admin-users-btn small"
                        disabled={savingId === row.id}
                        onClick={() => setItemStatus(row.id, 'resolved')}
                      >
                        {t.markResolved}
                      </button>
                      <button
                        type="button"
                        className="admin-users-btn small secondary"
                        disabled={savingId === row.id}
                        onClick={() => setItemStatus(row.id, 'dismissed')}
                      >
                        {t.markDismissed}
                      </button>
                    </>
                  ) : null}
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
          disabled={offset <= 0 || loading}
          onClick={() => setOffset(Math.max(0, offset - LIMIT))}
        >
          ‹
        </button>
        <button
          type="button"
          className="admin-users-btn secondary"
          disabled={offset + LIMIT >= total || loading}
          onClick={() => setOffset(offset + LIMIT)}
        >
          ›
        </button>
      </div>
    </div>
  )
}
