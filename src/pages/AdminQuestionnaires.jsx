import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
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

function preview(text, max = 80) {
  const s = String(text || '').replace(/\s+/g, ' ').trim()
  if (!s) return '—'
  return s.length > max ? `${s.slice(0, max)}…` : s
}

function toJsonSafe(res) {
  return res.json().catch(() => ({}))
}

export default function AdminQuestionnaires() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const msg = getMessages(lang)
  const adminUi = getAdminUi(lang)
  const t = {
    zh: { title: '健康问卷记录', loading: ui.loading, needLogin: '请先登录后再访问；若使用邮箱白名单，请用管理员账号登录。', note: '仅整站管理员可查看。数据含敏感健康信息，请勿截屏外传。鉴权与', sameAs: '用户管理', token: '整站管理 Token（可选）', tokenPh: '未配置时可留空，仅用管理员邮箱登录', searchLabel: '搜索用户邮箱或姓名', search: ui.search, refresh: ui.refresh, total: '共', submitted: '条提交；本页', loadingMark: '（加载中）', created: '提交时间', email: '邮箱', name: '姓名', goals: '目标摘要', consent: '同意', action: adminUi.actions, data: '数据✓', plan: '方案✓', contact: '联系✓', collapse: '收起', detail: ui.details, userId: '用户 ID：', legal: '法律版本：', age: '年龄范围', sex: '性别', region: '地区', concerns: '关注问题', history: '病史 / 诊断 / 手术', meds: '用药与补充剂', allergies: '过敏', lifestyle: '生活方式', sleep: '睡眠', prev: ui.prev, next: ui.next },
    en: { title: 'Health Questionnaire Records', loading: ui.loading, needLogin: 'Please login first. If using allowlist, login with admin account.', note: 'Only site admins can view. This data may contain sensitive health information. Do not share screenshots. Auth is same as', sameAs: 'Users Admin', token: 'Site admin token (optional)', tokenPh: 'Leave empty if logging in as admin', searchLabel: 'Search by user email or name', search: ui.search, refresh: ui.refresh, total: 'Total', submitted: 'submissions; this page', loadingMark: ' (loading)', created: 'Submitted at', email: 'Email', name: 'Name', goals: 'Goals summary', consent: 'Consent', action: adminUi.actions, data: 'Data✓', plan: 'Plan✓', contact: 'Contact✓', collapse: 'Collapse', detail: ui.details, userId: 'User ID: ', legal: 'Legal version: ', age: 'Age range', sex: 'Sex', region: 'Region', concerns: 'Concerns', history: 'History / Diagnosis / Surgery', meds: 'Medications / Supplements', allergies: 'Allergies', lifestyle: 'Lifestyle', sleep: 'Sleep', prev: ui.prev, next: ui.next },
    ar: { title: 'سجلات الاستبيان الصحي', loading: ui.loading, needLogin: 'يرجى تسجيل الدخول أولاً؛ إذا كنت تستخدم قائمة السماح فادخل بحساب مسؤول.', note: 'عرض للمسؤول فقط. قد تتضمن البيانات معلومات صحية حساسة. لا تشارك لقطات الشاشة. التحقق مماثل لـ', sameAs: 'إدارة المستخدمين', token: 'رمز إدارة الموقع (اختياري)', tokenPh: 'اتركه فارغًا إذا سجلت كمسؤول', searchLabel: 'البحث ببريد المستخدم أو الاسم', search: ui.search, refresh: ui.refresh, total: 'الإجمالي', submitted: 'إرسالًا؛ في هذه الصفحة', loadingMark: ' (جار التحميل)', created: 'وقت الإرسال', email: 'البريد', name: 'الاسم', goals: 'ملخص الأهداف', consent: 'الموافقات', action: adminUi.actions, data: 'بيانات✓', plan: 'خطة✓', contact: 'تواصل✓', collapse: 'إخفاء', detail: ui.details, userId: 'معرف المستخدم: ', legal: 'نسخة الشروط: ', age: 'الفئة العمرية', sex: 'الجنس', region: 'المنطقة', concerns: 'المشكلات', history: 'التاريخ/التشخيص/الجراحة', meds: 'الأدوية/المكملات', allergies: 'الحساسية', lifestyle: 'نمط الحياة', sleep: 'النوم', prev: ui.prev, next: ui.next },
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
  const [expandedId, setExpandedId] = useState(null)

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
      const res = await fetch(`/api/admin-health-questionnaires?${qs}`, { headers })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || data.code || msg.loadFail)
      setList(Array.isArray(data.submissions) ? data.submissions : [])
      setTotal(typeof data.total === 'number' ? data.total : 0)
    } catch (e) {
      setError(e.message || msg.loadFail)
      setList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [headers, offset, q])

  useEffect(() => {
    if (!authLoading && user) load()
  }, [authLoading, user, load])

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
      <h1>{t.title}</h1>
      <p className="ops-note">
        {t.note}
        <Link to="/ops/users">{t.sameAs}</Link>（<code>SITE_ADMIN_EMAILS</code> 或{' '}
        <code>x-site-admin-token</code>）。
      </p>

      <div className="ops-toolbar">
        <label className="ops-token">
          <span>{t.token}</span>
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
        {t.total} <strong>{total}</strong> {t.submitted} {list.length}
        {loading ? t.loadingMark : ''}
      </p>

      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>{t.created}</th>
              <th>{t.email}</th>
              <th>{t.name}</th>
              <th>{t.goals}</th>
              <th>{t.consent}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => {
              const open = expandedId === row.id
              return (
                <Fragment key={row.id}>
                  <tr>
                    <td>{fmtTime(row.created_at)}</td>
                    <td className="cell-mono">{row.email}</td>
                    <td>{row.name}</td>
                    <td>{preview(row.goals)}</td>
                    <td>
                      {row.consent_health_data ? t.data : '—'}
                      {row.consent_care_plan ? ` ${t.plan}` : ''}
                      {row.consent_contact ? ` ${t.contact}` : ''}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-users-btn small"
                        onClick={() => setExpandedId(open ? null : row.id)}
                      >
                        {open ? t.collapse : t.detail}
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr className="admin-hq-detail-row">
                      <td colSpan={6}>
                        <div className="admin-hq-detail">
                          <p className="admin-hq-meta">
                            {t.userId}{row.user_id} · {t.legal}{row.legal_version || '—'}
                          </p>
                          <dl className="admin-hq-dl">
                            <div>
                              <dt>{t.age}</dt>
                              <dd>{row.age_range || '—'}</dd>
                            </div>
                            <div>
                              <dt>{t.sex}</dt>
                              <dd>{row.sex || '—'}</dd>
                            </div>
                            <div>
                              <dt>{t.region}</dt>
                              <dd>{row.region || '—'}</dd>
                            </div>
                          </dl>
                          <section>
                            <h3>{t.goals}</h3>
                            <pre className="admin-hq-pre">{row.goals || '—'}</pre>
                          </section>
                          <section>
                            <h3>{t.concerns}</h3>
                            <pre className="admin-hq-pre">{row.concerns || '—'}</pre>
                          </section>
                          <section>
                            <h3>{t.history}</h3>
                            <pre className="admin-hq-pre">{row.medical_history || '—'}</pre>
                          </section>
                          <section>
                            <h3>{t.meds}</h3>
                            <pre className="admin-hq-pre">{row.medications || '—'}</pre>
                          </section>
                          <section>
                            <h3>{t.allergies}</h3>
                            <pre className="admin-hq-pre">{row.allergies || '—'}</pre>
                          </section>
                          <section>
                            <h3>{t.lifestyle}</h3>
                            <pre className="admin-hq-pre">{row.lifestyle || '—'}</pre>
                          </section>
                          <section>
                            <h3>{t.sleep}</h3>
                            <pre className="admin-hq-pre">{row.sleep || '—'}</pre>
                          </section>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
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
    </div>
  )
}
