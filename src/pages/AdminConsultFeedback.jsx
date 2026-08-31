import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { fetchConsultFeedbackAdmin } from '../lib/consultApi'
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

export default function AdminConsultFeedback() {
  const { lang } = useLocale()
  const t = {
    zh: {
      title: '咨询点踩',
      note: '用户点「没用」的回答会列在这里，供抽查知识库和提示词。仅摘要，不含检查单全文。',
      token: '整站管理 Token（可选）',
      tokenPh: '未配置时可留空，仅用管理员邮箱登录',
      refresh: '刷新',
      total: '共',
      rows: '条',
      created: '时间',
      reason: '原因',
      user: '用户',
      question: '问题摘要',
      answer: '回答摘要',
      sources: '来源',
      empty: '暂无点踩记录。',
      loadFail: '加载失败',
      none: '未选',
      off_topic: '答偏了',
      no_source: '没依据',
      too_long: '太长',
      unclear: '看不懂',
      other: '其他',
    },
    en: {
      title: 'Consult downvotes',
      note: 'Answers marked not helpful appear here. Summaries only.',
      token: 'Site admin token (optional)',
      tokenPh: 'Leave empty if logged in as admin',
      refresh: 'Refresh',
      total: 'Total',
      rows: '',
      created: 'Time',
      reason: 'Reason',
      user: 'User',
      question: 'Question',
      answer: 'Answer',
      sources: 'Sources',
      empty: 'No downvotes yet.',
      loadFail: 'Failed to load',
      none: 'None',
      off_topic: 'Off topic',
      no_source: 'No sources',
      too_long: 'Too long',
      unclear: 'Unclear',
      other: 'Other',
    },
    ar: {
      title: 'تقييمات سلبية',
      note: 'الإجابات التي وُسمت بغير مفيدة تظهر هنا.',
      token: 'رمز الإدارة (اختياري)',
      tokenPh: 'اتركه فارغًا إذا سجلت كمسؤول',
      refresh: 'تحديث',
      total: 'الإجمالي',
      rows: '',
      created: 'الوقت',
      reason: 'السبب',
      user: 'المستخدم',
      question: 'السؤال',
      answer: 'الإجابة',
      sources: 'المصادر',
      empty: 'لا تقييمات بعد.',
      loadFail: 'فشل التحميل',
      none: 'بدون',
      off_topic: 'خارج الموضوع',
      no_source: 'بلا مصدر',
      too_long: 'طويل',
      unclear: 'غير واضح',
      other: 'أخرى',
    },
  }[lang || 'zh']

  const { user, loading: authLoading, getToken } = useAuth()
  const [siteAdminToken, setSiteAdminToken] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem('site_admin_token') || '' : '',
  )
  const [offset, setOffset] = useState(0)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const data = await fetchConsultFeedbackAdmin(headers, { limit: LIMIT, offset })
      setList(Array.isArray(data.items) ? data.items : [])
      setTotal(typeof data.total === 'number' ? data.total : 0)
    } catch (err) {
      setError(err.message || t.loadFail)
      setList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [headers, offset, t.loadFail])

  useEffect(() => {
    if (!authLoading && user) load()
  }, [authLoading, user, load])

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
              <th>{t.reason}</th>
              <th>{t.user}</th>
              <th>{t.question}</th>
              <th>{t.answer}</th>
              <th>{t.sources}</th>
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
                <td>{t[row.reason] || t.none}</td>
                <td>{row.email || row.user_id || '—'}</td>
                <td>{row.question || '—'}</td>
                <td>{row.answer || '—'}</td>
                <td>{Array.isArray(row.sources) && row.sources.length ? row.sources.join('；') : '—'}</td>
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
