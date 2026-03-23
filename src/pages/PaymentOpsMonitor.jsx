import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './PaymentOpsMonitor.css'

function fmtTime(v) {
  if (!v) return '—'
  try {
    return new Date(v).toLocaleString('zh-CN')
  } catch {
    return String(v)
  }
}

function toJsonSafe(res) {
  return res.json().catch(() => ({}))
}

export default function PaymentOpsMonitor() {
  const { user, loading: authLoading, getToken } = useAuth()
  const [hours, setHours] = useState(24)
  const [provider, setProvider] = useState('stripe')
  const [adminToken, setAdminToken] = useState('')
  const [summary, setSummary] = useState(null)
  const [failedLogs, setFailedLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const headers = useMemo(() => {
    const h = {}
    const jwt = getToken()
    if (jwt) h.Authorization = `Bearer ${jwt}`
    const t = adminToken.trim()
    if (t) h['x-admin-token'] = t
    return h
  }, [adminToken, getToken])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const p = provider ? `&provider=${encodeURIComponent(provider)}` : ''
      const [summaryRes, failedRes] = await Promise.all([
        fetch(`/api/payment-event-logs-summary?hours=${encodeURIComponent(hours)}${p}`, { headers }),
        fetch(`/api/payment-event-logs?failed_only=1&limit=100${p}`, { headers }),
      ])
      const summaryJson = await toJsonSafe(summaryRes)
      const failedJson = await toJsonSafe(failedRes)
      if (!summaryRes.ok) {
        throw new Error(summaryJson.error || summaryJson.code || '汇总接口请求失败')
      }
      if (!failedRes.ok) {
        throw new Error(failedJson.error || failedJson.code || '失败日志接口请求失败')
      }
      setSummary(summaryJson)
      setFailedLogs(Array.isArray(failedJson.logs) ? failedJson.logs : [])
    } catch (e) {
      setError(e.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  if (authLoading) {
    return (
      <div className="page-content payment-ops-page">
        <h1>支付运营巡检</h1>
        <p>加载中…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content payment-ops-page">
        <h1>支付运营巡检</h1>
        <p>请先登录管理员账号。</p>
      </div>
    )
  }

  return (
    <div className="page-content payment-ops-page">
      <h1>支付运营巡检</h1>
      <p className="ops-note">只读看板：汇总 + 失败明细（需要管理员权限）。</p>

      <div className="ops-toolbar">
        <label>
          时间窗口（小时）
          <input
            type="number"
            min={1}
            max={720}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value || 24))}
          />
        </label>
        <label>
          支付通道
          <select value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="">全部</option>
            <option value="stripe">stripe</option>
            <option value="airwallex">airwallex</option>
          </select>
        </label>
        <label className="ops-token">
          管理员 Token（可选）
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="若已登录管理员邮箱可留空"
          />
        </label>
        <button type="button" className="btn-primary" onClick={loadData} disabled={loading}>
          {loading ? '刷新中…' : '刷新数据'}
        </button>
      </div>

      {error ? <p className="ops-error">加载失败：{error}</p> : null}

      {summary ? (
        <section className="ops-card">
          <h2>汇总指标</h2>
          <div className="ops-kpi-grid">
            <div><span>总数</span><strong>{summary.total ?? 0}</strong></div>
            <div><span>成功</span><strong>{summary.success ?? 0}</strong></div>
            <div><span>失败</span><strong>{summary.failed ?? 0}</strong></div>
            <div><span>幂等跳过</span><strong>{summary.idempotent_skip ?? 0}</strong></div>
          </div>
        </section>
      ) : null}

      <section className="ops-card">
        <h2>失败明细（最近 100 条）</h2>
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>provider</th>
                <th>status</th>
                <th>error_code</th>
                <th>session_id</th>
                <th>user_id</th>
              </tr>
            </thead>
            <tbody>
              {failedLogs.length ? failedLogs.map((row) => (
                <tr key={row.id}>
                  <td>{fmtTime(row.created_at)}</td>
                  <td>{row.provider || '—'}</td>
                  <td>{row.status || '—'}</td>
                  <td>{row.error_code || '—'}</td>
                  <td>{row.session_id || '—'}</td>
                  <td>{row.user_id || '—'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>暂无失败日志</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
