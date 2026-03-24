import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './OrgConsole.css'

function inferDomain(email) {
  const e = String(email || '').trim().toLowerCase()
  const idx = e.lastIndexOf('@')
  return idx > -1 ? e.slice(idx + 1) : ''
}

export default function OrgConsole() {
  const { user, loading, getToken, refreshUser } = useAuth()
  const defaultDomain = useMemo(() => inferDomain(user?.email), [user?.email])
  const [orgName, setOrgName] = useState('')
  const [domain, setDomain] = useState(defaultDomain)
  const [submitting, setSubmitting] = useState(false)
  const [inviteSubmitting, setInviteSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteLink, setInviteLink] = useState('')
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [listLoading, setListLoading] = useState(false)

  const currentOrg = user?.org
  const canManageInvite = ['owner', 'admin'].includes(String(currentOrg?.role || '').toLowerCase())

  const loadOrgData = async () => {
    if (!currentOrg) return
    setListLoading(true)
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [membersRes, invitesRes] = await Promise.all([
        fetch('/api/org/members', { headers }),
        fetch('/api/org/invites', { headers }),
      ])
      const membersData = await membersRes.json().catch(() => ({}))
      const invitesData = await invitesRes.json().catch(() => ({}))
      if (!membersRes.ok) throw new Error(membersData.error || membersData.code || '加载成员失败')
      if (!invitesRes.ok) throw new Error(invitesData.error || invitesData.code || '加载邀请失败')
      setMembers(Array.isArray(membersData.members) ? membersData.members : [])
      setInvites(Array.isArray(invitesData.invites) ? invitesData.invites : [])
    } catch (e) {
      setError(e.message || '加载数据失败')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && currentOrg) loadOrgData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentOrg?.id])

  const createOrg = async () => {
    setSubmitting(true)
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch('/api/org/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: orgName, domain }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || '创建失败')
      await refreshUser()
      setHint('企业创建成功。')
    } catch (e) {
      setError(e.message || '创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  const createInvite = async () => {
    setInviteSubmitting(true)
    setError('')
    setHint('')
    setInviteLink('')
    try {
      const token = getToken()
      const res = await fetch('/api/org/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          origin: window.location.origin,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || '邀请失败')
      setHint(`已创建邀请：${data.invite?.email || inviteEmail}`)
      setInviteLink(data.invite?.invite_url || '')
      setInviteEmail('')
      await loadOrgData()
    } catch (e) {
      setError(e.message || '邀请失败')
    } finally {
      setInviteSubmitting(false)
    }
  }

  const revokeInvite = async (inviteId) => {
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch('/api/org/invite-revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invite_id: inviteId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || '撤销失败')
      setHint('邀请已撤销。')
      await loadOrgData()
    } catch (e) {
      setError(e.message || '撤销失败')
    }
  }

  const resendInvite = async (inviteId) => {
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch('/api/org/invite-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invite_id: inviteId, origin: window.location.origin }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || '重发失败')
      setInviteLink(data.invite?.invite_url || '')
      setHint(`已重发邀请：${data.invite?.email || ''}`)
      await loadOrgData()
    } catch (e) {
      setError(e.message || '重发失败')
    }
  }

  if (loading) {
    return (
      <div className="page-content org-console-page">
        <h1>企业管理</h1>
        <p>加载中…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content org-console-page">
        <h1>企业管理</h1>
        <p>请先登录后使用。</p>
      </div>
    )
  }

  return (
    <div className="page-content org-console-page">
      <h1>企业管理</h1>
      <p className="org-note">MVP 第二阶段：支持管理员生成邀请链接，成员按链接加入企业。</p>

      {currentOrg ? (
        <>
          <section className="org-card">
            <h2>当前组织</h2>
            <dl className="org-dl">
              <div><dt>组织名称</dt><dd>{currentOrg.name}</dd></div>
              <div><dt>绑定域名</dt><dd>{currentOrg.domain}</dd></div>
              <div><dt>组织角色</dt><dd>{currentOrg.role}</dd></div>
              <div><dt>组织状态</dt><dd>{currentOrg.status}</dd></div>
            </dl>
          </section>

          {canManageInvite ? (
            <section className="org-card org-invite-card">
              <h2>邀请成员</h2>
              <label>
                <span>成员邮箱（必须同域：{currentOrg.domain}）</span>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={`例如：name@${currentOrg.domain}`}
                />
              </label>
              <label>
                <span>角色</span>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="member">member（普通成员）</option>
                  <option value="admin">admin（管理员）</option>
                </select>
              </label>
              <button type="button" className="btn-primary" disabled={inviteSubmitting} onClick={createInvite}>
                {inviteSubmitting ? '生成中…' : '生成邀请链接'}
              </button>
              {inviteLink ? (
                <p className="org-hint">
                  邀请链接：<a href={inviteLink} target="_blank" rel="noreferrer">{inviteLink}</a>
                </p>
              ) : null}
            </section>
          ) : null}

          <section className="org-card org-list-card">
            <h2>成员列表</h2>
            {listLoading ? (
              <p className="org-note">加载中…</p>
            ) : (
              <div className="org-table-wrap">
                <table className="org-table">
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>邮箱</th>
                      <th>角色</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length ? members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.name || '—'}</td>
                        <td>{m.email || '—'}</td>
                        <td>{m.role || '—'}</td>
                        <td>{m.status || '—'}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4}>暂无成员数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {canManageInvite ? (
            <section className="org-card org-list-card">
              <h2>邀请记录</h2>
              {listLoading ? (
                <p className="org-note">加载中…</p>
              ) : (
                <div className="org-table-wrap">
                  <table className="org-table">
                    <thead>
                      <tr>
                        <th>邮箱</th>
                        <th>角色</th>
                        <th>状态</th>
                        <th>过期时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites.length ? invites.map((inv) => (
                        <tr key={inv.id}>
                          <td>{inv.email || '—'}</td>
                          <td>{inv.role || '—'}</td>
                          <td>{inv.status || '—'}</td>
                          <td>{inv.expires_at ? new Date(inv.expires_at).toLocaleString('zh-CN') : '—'}</td>
                          <td>
                            <div className="org-actions">
                              <button
                                type="button"
                                onClick={() => resendInvite(inv.id)}
                                disabled={inviteSubmitting}
                              >
                                重发
                              </button>
                              <button
                                type="button"
                                onClick={() => revokeInvite(inv.id)}
                                disabled={inviteSubmitting || inv.status !== 'pending'}
                              >
                                撤销
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5}>暂无邀请记录</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : null}
        </>
      ) : (
        <section className="org-card">
          <h2>创建企业组织</h2>
          <label>
            <span>组织名称</span>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="例如：健康长寿科技（上海）有限公司"
            />
          </label>
          <label>
            <span>企业域名（默认当前登录邮箱域名）</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="例如：yourcompany.com"
            />
          </label>
          <button type="button" className="btn-primary" disabled={submitting} onClick={createOrg}>
            {submitting ? '创建中…' : '创建企业'}
          </button>
        </section>
      )}
      {error ? <p className="org-error">{error}</p> : null}
      {hint ? <p className="org-hint">{hint}</p> : null}
    </div>
  )
}
