import { useCallback, useEffect, useState } from 'react'
import { MEMBERSHIP_LEVELS } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import './AdminUsers.css'

const LIMIT = 20

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

function daysFromNowLocal(days) {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toJsonSafe(res) {
  return res.json().catch(() => ({}))
}

const EMPTY_CREATE = {
  email: '',
  password: '',
  name: '',
  level: 'premium',
  expiresLocal: daysFromNowLocal(7),
}

export default function AccountMemberAdmin({ getToken }) {
  const [mode, setMode] = useState('add')
  const [createForm, setCreateForm] = useState(EMPTY_CREATE)
  const [createMsg, setCreateMsg] = useState('')
  const [creating, setCreating] = useState(false)

  const [q, setQ] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [offset, setOffset] = useState(0)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [edit, setEdit] = useState(null)

  const authHeaders = useCallback(() => {
    const h = { 'Content-Type': 'application/json' }
    const jwt = getToken()
    if (jwt) h.Authorization = `Bearer ${jwt}`
    return h
  }, [getToken])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) })
      if (q) qs.set('q', q)
      const res = await fetch(`/api/admin-users?${qs}`, { headers: authHeaders() })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || '加载失败')
      setList(data.users || [])
      setTotal(data.total || 0)
    } catch (e) {
      setError(e.message || '加载失败')
      setList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [authHeaders, offset, q])

  useEffect(() => {
    if (mode === 'manage') load()
  }, [mode, load])

  const setCreateField = (key, value) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }))
  }

  const applyExpiryPreset = (days) => {
    if (days == null) {
      setCreateField('expiresLocal', '')
      return
    }
    setCreateField('expiresLocal', daysFromNowLocal(days))
  }

  const createMember = async (e) => {
    e.preventDefault()
    setCreateMsg('')
    setCreating(true)
    try {
      const expiresIso = fromDatetimeLocalValue(createForm.expiresLocal)
      if (createForm.expiresLocal && expiresIso === undefined) {
        throw new Error('有效期时间格式无效')
      }
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          email: createForm.email.trim(),
          password: createForm.password,
          name: createForm.name.trim(),
          level: createForm.level,
          expires_at: expiresIso,
        }),
      })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || '创建失败')
      setCreateForm(EMPTY_CREATE)
      setCreateMsg(`已增加：${data.user?.email || createForm.email}`)
    } catch (err) {
      setCreateMsg(err.message || '创建失败')
    } finally {
      setCreating(false)
    }
  }

  const saveEdit = async () => {
    if (!edit) return
    const expiresIso = fromDatetimeLocalValue(edit.expiresLocal)
    if (edit.expiresLocal && expiresIso === undefined) {
      setError('有效期时间格式无效')
      return
    }
    setSavingId(edit.id)
    setError('')
    try {
      const res = await fetch('/api/admin-users', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({
          user_id: edit.id,
          name: edit.name.trim(),
          level: edit.level,
          expires_at: expiresIso,
        }),
      })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || '保存失败')
      setEdit(null)
      await load()
    } catch (err) {
      setError(err.message || '保存失败')
    } finally {
      setSavingId(null)
    }
  }

  const deleteMember = async (row) => {
    if (!window.confirm(`确定删除会员「${row.email}」？此操作不可恢复。`)) return
    setSavingId(row.id)
    setError('')
    try {
      const res = await fetch(`/api/admin-users?user_id=${encodeURIComponent(row.id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      const data = await toJsonSafe(res)
      if (!res.ok) throw new Error(data.error || '删除失败')
      if (edit?.id === row.id) setEdit(null)
      await load()
    } catch (err) {
      setError(err.message || '删除失败')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="account-member-admin">
      <h2 className="account-member-admin-title">会员管理（仅管理员可见）</h2>
      <p className="account-muted">可增加或删除会员，并设置等级与有效期。高级会员权益整站生效。</p>

      <div className="account-member-admin-modes" role="tablist">
        <button
          type="button"
          className={`account-member-admin-mode${mode === 'add' ? ' is-active' : ''}`}
          onClick={() => setMode('add')}
        >
          增加会员
        </button>
        <button
          type="button"
          className={`account-member-admin-mode${mode === 'manage' ? ' is-active' : ''}`}
          onClick={() => setMode('manage')}
        >
          删除 / 调整会员
        </button>
      </div>

      {mode === 'add' ? (
        <form className="account-member-admin-form" onSubmit={createMember}>
          <label>
            登录账号（用户名或邮箱）
            <input
              type="text"
              required
              minLength={2}
              maxLength={80}
              value={createForm.email}
              onChange={(e) => setCreateField('email', e.target.value)}
              autoComplete="off"
              placeholder="tester01 或 name@example.com"
            />
          </label>
          <label>
            初始密码（至少 6 位）
            <input
              type="text"
              required
              minLength={6}
              value={createForm.password}
              onChange={(e) => setCreateField('password', e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label>
            姓名 / 昵称
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateField('name', e.target.value)}
              placeholder="可留空，默认用用户名"
            />
          </label>
          <label>
            会员等级
            <select value={createForm.level} onChange={(e) => setCreateField('level', e.target.value)}>
              {Object.values(MEMBERSHIP_LEVELS).map((lv) => (
                <option key={lv.id} value={lv.id}>
                  {lv.name}
                </option>
              ))}
            </select>
          </label>
          <label className="span-2">
            有效期至（留空表示不设到期）
            <input
              type="datetime-local"
              value={createForm.expiresLocal}
              onChange={(e) => setCreateField('expiresLocal', e.target.value)}
            />
          </label>
          <div className="account-member-admin-presets span-2">
            <span>快捷有效期：</span>
            <button type="button" onClick={() => applyExpiryPreset(7)}>7 天</button>
            <button type="button" onClick={() => applyExpiryPreset(30)}>30 天</button>
            <button type="button" onClick={() => applyExpiryPreset(365)}>1 年</button>
            <button type="button" onClick={() => applyExpiryPreset(null)}>不设到期</button>
          </div>
          <div className="account-member-admin-actions span-2">
            <button type="submit" className="admin-users-btn" disabled={creating}>
              {creating ? '正在增加…' : '增加会员'}
            </button>
            {createMsg ? <span className="account-muted">{createMsg}</span> : null}
          </div>
        </form>
      ) : (
        <>
          <div className="account-member-admin-search">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="搜索账号或姓名"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setOffset(0)
                  setQ(searchInput.trim())
                }
              }}
            />
            <button
              type="button"
              className="admin-users-btn"
              onClick={() => {
                setOffset(0)
                setQ(searchInput.trim())
              }}
            >
              搜索
            </button>
            <button type="button" className="admin-users-btn secondary" onClick={load} disabled={loading}>
              刷新
            </button>
          </div>
          {error ? <p className="account-member-admin-error">{error}</p> : null}
          <p className="account-muted">
            共 {total} 条{loading ? '（加载中）' : ''}
          </p>
          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>登录账号</th>
                  <th>姓名</th>
                  <th>等级</th>
                  <th>有效期</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.id}>
                    <td className="cell-mono">{row.email}</td>
                    <td>{row.name}</td>
                    <td>{getMembershipLevelLabel(row.level, 'zh')}</td>
                    <td>{fmtTime(row.expires_at)}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-users-btn small"
                        onClick={() =>
                          setEdit({
                            id: row.id,
                            email: row.email,
                            name: row.name || '',
                            level: row.level || 'free',
                            expiresLocal: toDatetimeLocalValue(row.expires_at),
                          })
                        }
                      >
                        调整
                      </button>
                      <button
                        type="button"
                        className="admin-users-btn small secondary"
                        onClick={() => deleteMember(row)}
                        disabled={savingId === row.id}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
                {!list.length && !loading ? (
                  <tr>
                    <td colSpan={5}>没有匹配的会员</td>
                  </tr>
                ) : null}
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
              上一页
            </button>
            <button
              type="button"
              className="admin-users-btn secondary"
              disabled={offset + LIMIT >= total || loading}
              onClick={() => setOffset(offset + LIMIT)}
            >
              下一页
            </button>
          </div>
          {edit ? (
            <div className="ops-card admin-users-edit">
              <h3>调整会员 · {edit.email}</h3>
              <div className="admin-users-edit-grid">
                <label>
                  姓名
                  <input
                    value={edit.name}
                    onChange={(e) => setEdit((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </label>
                <label>
                  会员等级
                  <select
                    value={edit.level}
                    onChange={(e) => setEdit((prev) => ({ ...prev, level: e.target.value }))}
                  >
                    {Object.values(MEMBERSHIP_LEVELS).map((lv) => (
                      <option key={lv.id} value={lv.id}>
                        {lv.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="span-2">
                  有效期至（留空表示不设到期）
                  <input
                    type="datetime-local"
                    value={edit.expiresLocal}
                    onChange={(e) => setEdit((prev) => ({ ...prev, expiresLocal: e.target.value }))}
                  />
                </label>
              </div>
              <div className="account-member-admin-presets">
                <span>快捷有效期：</span>
                <button type="button" onClick={() => setEdit((p) => ({ ...p, expiresLocal: daysFromNowLocal(7) }))}>
                  7 天
                </button>
                <button type="button" onClick={() => setEdit((p) => ({ ...p, expiresLocal: daysFromNowLocal(30) }))}>
                  30 天
                </button>
                <button type="button" onClick={() => setEdit((p) => ({ ...p, expiresLocal: daysFromNowLocal(365) }))}>
                  1 年
                </button>
                <button type="button" onClick={() => setEdit((p) => ({ ...p, expiresLocal: '' }))}>
                  不设到期
                </button>
              </div>
              <div className="admin-users-edit-actions">
                <button type="button" className="admin-users-btn" onClick={saveEdit} disabled={!!savingId}>
                  {savingId ? '保存中…' : '保存'}
                </button>
                <button type="button" className="admin-users-btn secondary" onClick={() => setEdit(null)} disabled={!!savingId}>
                  取消
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
