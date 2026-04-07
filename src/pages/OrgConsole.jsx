import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getOrgRoleLabel } from '../i18n/terms'
import { getUi } from '../i18n/ui'
import { getMessages } from '../i18n/messages'
import { getAdminUi } from '../i18n/adminUi'
import './OrgConsole.css'

function inferDomain(email) {
  const e = String(email || '').trim().toLowerCase()
  const idx = e.lastIndexOf('@')
  return idx > -1 ? e.slice(idx + 1) : ''
}

export default function OrgConsole() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const msg = getMessages(lang)
  const adminUi = getAdminUi(lang)
  const t = {
    zh: { loadMemberFail: msg.loadFail, loadInviteFail: msg.loadFail, loadDataFail: msg.loadFail, createFail: msg.requestFail, createOk: '企业创建成功。', inviteFail: msg.requestFail, inviteOk: '已创建邀请：', revokeFail: msg.operationFail, revokeOk: '邀请已撤销。', resendFail: msg.requestFail, resendOk: '已重发邀请：', roleFail: msg.operationFail, roleOk: '成员角色已更新。', statusFail: msg.operationFail, statusOk: '成员状态已更新。', cannotKickSelf: '不能踢出自己。', kickConfirm: '确认踢出该成员？被踢出的成员将无法继续访问本企业。', kickFail: msg.operationFail, kickOk: '成员已被踢出企业。', title: '企业管理', loading: ui.loading, loginFirst: '请先登录后使用。', loadingOrg: '加载组织信息中…', note: 'MVP 第二阶段：支持管理员生成邀请链接，成员按链接加入企业。', current: '当前组织', switchOrg: '切换组织', orgName: '组织名称', domain: '绑定域名', role: '组织角色', status: '组织状态', invite: '邀请成员', memberEmail: '成员邮箱（必须同域：', roleLabel: '角色', generating: ui.refreshing, generate: '生成邀请链接', inviteLink: '邀请链接：', members: '成员列表', name: '姓名', email: '邮箱', action: adminUi.actions, setAdmin: '设管理员', setMember: '设成员', kick: '踢出', disable: adminUi.disable, enable: adminUi.enable, noMembers: '暂无成员数据', invites: '邀请记录', expiresAt: '过期时间', resend: adminUi.resend, revoke: adminUi.revoke, noInvites: '暂无邀请记录', createOrg: '创建企业组织', domainHint: '企业域名（默认当前登录邮箱域名）', creating: ui.refreshing, createBtn: '创建企业' },
    en: { loadMemberFail: msg.loadFail, loadInviteFail: msg.loadFail, loadDataFail: msg.loadFail, createFail: msg.requestFail, createOk: 'Organization created.', inviteFail: msg.requestFail, inviteOk: 'Invite created: ', revokeFail: msg.operationFail, revokeOk: 'Invite revoked.', resendFail: msg.requestFail, resendOk: 'Invite resent: ', roleFail: msg.operationFail, roleOk: 'Member role updated.', statusFail: msg.operationFail, statusOk: 'Member status updated.', cannotKickSelf: 'Cannot remove yourself.', kickConfirm: 'Remove this member from the organization?', kickFail: msg.operationFail, kickOk: 'Member removed.', title: 'Organization Console', loading: ui.loading, loginFirst: 'Please login first.', loadingOrg: 'Loading organization data…', note: 'MVP phase 2: admins can generate invite links, members join by link.', current: 'Current Organization', switchOrg: 'Switch organization', orgName: 'Organization name', domain: 'Domain', role: 'Role', status: 'Status', invite: 'Invite Members', memberEmail: 'Member email (must match domain: ', roleLabel: 'Role', generating: ui.refreshing, generate: 'Generate invite link', inviteLink: 'Invite link: ', members: 'Members', name: 'Name', email: 'Email', action: adminUi.actions, setAdmin: 'Set admin', setMember: 'Set member', kick: 'Remove', disable: adminUi.disable, enable: adminUi.enable, noMembers: 'No member data', invites: 'Invites', expiresAt: 'Expires at', resend: adminUi.resend, revoke: adminUi.revoke, noInvites: 'No invite records', createOrg: 'Create Organization', domainHint: 'Organization domain (default from your email)', creating: ui.refreshing, createBtn: 'Create organization' },
    ar: { loadMemberFail: msg.loadFail, loadInviteFail: msg.loadFail, loadDataFail: msg.loadFail, createFail: msg.requestFail, createOk: 'تم إنشاء المؤسسة.', inviteFail: msg.requestFail, inviteOk: 'تم إنشاء الدعوة: ', revokeFail: msg.operationFail, revokeOk: 'تم إلغاء الدعوة.', resendFail: msg.requestFail, resendOk: 'تمت إعادة الدعوة: ', roleFail: msg.operationFail, roleOk: 'تم تحديث دور العضو.', statusFail: msg.operationFail, statusOk: 'تم تحديث الحالة.', cannotKickSelf: 'لا يمكنك إخراج نفسك.', kickConfirm: 'تأكيد إخراج هذا العضو من المؤسسة؟', kickFail: msg.operationFail, kickOk: 'تم إخراج العضو.', title: 'إدارة المؤسسة', loading: ui.loading, loginFirst: 'يرجى تسجيل الدخول أولاً.', loadingOrg: 'جار تحميل بيانات المؤسسة…', note: 'المرحلة الثانية: يمكن للمسؤول إنشاء روابط دعوة وينضم الأعضاء عبر الرابط.', current: 'المؤسسة الحالية', switchOrg: 'تبديل المؤسسة', orgName: 'اسم المؤسسة', domain: 'النطاق', role: 'الدور', status: 'الحالة', invite: 'دعوة أعضاء', memberEmail: 'بريد العضو (يجب أن يطابق النطاق: ', roleLabel: 'الدور', generating: ui.refreshing, generate: 'إنشاء رابط دعوة', inviteLink: 'رابط الدعوة: ', members: 'الأعضاء', name: 'الاسم', email: 'البريد', action: adminUi.actions, setAdmin: 'تعيين مسؤول', setMember: 'تعيين عضو', kick: 'إخراج', disable: adminUi.disable, enable: adminUi.enable, noMembers: 'لا توجد بيانات أعضاء', invites: 'الدعوات', expiresAt: 'تاريخ الانتهاء', resend: adminUi.resend, revoke: adminUi.revoke, noInvites: 'لا توجد دعوات', createOrg: 'إنشاء مؤسسة', domainHint: 'نطاق المؤسسة (افتراضيًا من بريدك)', creating: ui.refreshing, createBtn: 'إنشاء المؤسسة' },
  }[lang || 'zh']
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

  const orgs = useMemo(() => {
    if (Array.isArray(user?.orgs)) return user.orgs
    if (user?.org) return [user.org]
    return []
  }, [user?.org, user?.orgs])

  const [activeOrgId, setActiveOrgId] = useState(() => user?.org?.id || orgs[0]?.id || '')
  const currentOrg = orgs.find((o) => String(o.id) === String(activeOrgId)) || null
  const canManageInvite = ['owner', 'admin'].includes(String(currentOrg?.role || '').toLowerCase())

  const loadOrgData = async () => {
    if (!activeOrgId) return
    setListLoading(true)
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const orgId = encodeURIComponent(activeOrgId)
      const [membersRes, invitesRes] = await Promise.all([
        fetch(`/api/org/members?org_id=${orgId}`, { headers }),
        fetch(`/api/org/invites?org_id=${orgId}&pending_only=1`, { headers }),
      ])
      const membersData = await membersRes.json().catch(() => ({}))
      const invitesData = await invitesRes.json().catch(() => ({}))
      if (!membersRes.ok) throw new Error(membersData.error || membersData.code || t.loadMemberFail)
      if (!invitesRes.ok) throw new Error(invitesData.error || invitesData.code || t.loadInviteFail)
      setMembers(Array.isArray(membersData.members) ? membersData.members : [])
      setInvites(Array.isArray(invitesData.invites) ? invitesData.invites : [])
    } catch (e) {
      setError(e.message || t.loadDataFail)
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !activeOrgId && orgs.length) setActiveOrgId(orgs[0].id)
    if (!loading && activeOrgId) loadOrgData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activeOrgId, orgs])

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
      if (!res.ok) throw new Error(data.error || data.code || t.createFail)
      await refreshUser()
      setHint(t.createOk)
    } catch (e) {
      setError(e.message || t.createFail)
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
      const res = await fetch(`/api/org/invite?org_id=${encodeURIComponent(activeOrgId)}`, {
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
      if (!res.ok) throw new Error(data.error || data.code || t.inviteFail)
      setHint(`${t.inviteOk}${data.invite?.email || inviteEmail}`)
      setInviteLink(data.invite?.invite_url || '')
      setInviteEmail('')
      await loadOrgData()
    } catch (e) {
      setError(e.message || t.inviteFail)
    } finally {
      setInviteSubmitting(false)
    }
  }

  const revokeInvite = async (inviteId) => {
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch(`/api/org/invite-revoke?org_id=${encodeURIComponent(activeOrgId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invite_id: inviteId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || t.revokeFail)
      setHint(t.revokeOk)
      await loadOrgData()
    } catch (e) {
      setError(e.message || t.revokeFail)
    }
  }

  const resendInvite = async (inviteId) => {
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch(`/api/org/invite-resend?org_id=${encodeURIComponent(activeOrgId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invite_id: inviteId, origin: window.location.origin }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || t.resendFail)
      setInviteLink(data.invite?.invite_url || '')
      setHint(`${t.resendOk}${data.invite?.email || ''}`)
      await loadOrgData()
    } catch (e) {
      setError(e.message || t.resendFail)
    }
  }

  const changeMemberRole = async (targetUserId, role) => {
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch(`/api/org/member-role?org_id=${encodeURIComponent(activeOrgId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: targetUserId, role }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || t.roleFail)
      setHint(t.roleOk)
      await loadOrgData()
    } catch (e) {
      setError(e.message || t.roleFail)
    }
  }

  const setMemberStatus = async (targetUserId, status) => {
    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch(`/api/org/member-status?org_id=${encodeURIComponent(activeOrgId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: targetUserId, status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || t.statusFail)
      setHint(t.statusOk)
      await loadOrgData()
    } catch (e) {
      setError(e.message || t.statusFail)
    }
  }

  const kickMember = async (targetUserId) => {
    if (!targetUserId) return
    if (String(targetUserId) === String(user?.id)) {
      setError('')
      setHint(t.cannotKickSelf)
      return
    }

    const ok = window.confirm(t.kickConfirm)
    if (!ok) return

    setError('')
    setHint('')
    try {
      const token = getToken()
      const res = await fetch(`/api/org/member-kick?org_id=${encodeURIComponent(activeOrgId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: targetUserId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || data.code || t.kickFail)
      setHint(t.kickOk)
      await loadOrgData()
    } catch (e) {
      setError(e.message || t.kickFail)
    }
  }

  if (loading) {
    return (
      <div className="page-content org-console-page">
        <h1>{t.title}</h1>
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content org-console-page">
        <h1>{t.title}</h1>
        <p>{t.loginFirst}</p>
      </div>
    )
  }

  if (orgs.length && !currentOrg) {
    return (
      <div className="page-content org-console-page">
        <h1>{t.title}</h1>
        <p>{t.loadingOrg}</p>
      </div>
    )
  }

  return (
    <div className="page-content org-console-page">
      <h1>{t.title}</h1>
      <p className="org-note">{t.note}</p>

      {currentOrg ? (
        <>
          <section className="org-card">
            <h2>{t.current}</h2>
                {orgs.length > 1 ? (
                  <label>
                    <span>{t.switchOrg}</span>
                    <select value={activeOrgId} onChange={(e) => setActiveOrgId(e.target.value)}>
                      {orgs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
            <dl className="org-dl">
              <div><dt>{t.orgName}</dt><dd>{currentOrg.name}</dd></div>
              <div><dt>{t.domain}</dt><dd>{currentOrg.domain}</dd></div>
              <div><dt>{t.role}</dt><dd>{getOrgRoleLabel(currentOrg.role, lang)}</dd></div>
              <div><dt>{t.status}</dt><dd>{currentOrg.status}</dd></div>
            </dl>
          </section>

          {canManageInvite ? (
            <section className="org-card org-invite-card">
              <h2>{t.invite}</h2>
              <label>
                <span>{t.memberEmail}{currentOrg.domain}）</span>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={`例如：name@${currentOrg.domain}`}
                />
              </label>
              <label>
                <span>{t.roleLabel}</span>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="member">{getOrgRoleLabel('member', lang)}</option>
                  <option value="admin">{getOrgRoleLabel('admin', lang)}</option>
                </select>
              </label>
              <button type="button" className="btn-primary" disabled={inviteSubmitting} onClick={createInvite}>{inviteSubmitting ? t.generating : t.generate}</button>
              {inviteLink ? (
                <p className="org-hint">
                  {t.inviteLink}<a href={inviteLink} target="_blank" rel="noreferrer">{inviteLink}</a>
                </p>
              ) : null}
            </section>
          ) : null}

          <section className="org-card org-list-card">
            <h2>{t.members}</h2>
            {listLoading ? (
              <p className="org-note">{ui.loading}</p>
            ) : (
              <div className="org-table-wrap">
                <table className="org-table">
                  <thead>
                    <tr>
                      <th>{t.name}</th>
                      <th>{t.email}</th>
                      <th>{t.role}</th>
                      <th>{t.status}</th>
                      {canManageInvite ? <th>{t.action}</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {members.length ? members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.name || '—'}</td>
                        <td>{m.email || '—'}</td>
                        <td>{getOrgRoleLabel(m.role, lang)}</td>
                        <td>{m.status || '—'}</td>
                        {canManageInvite ? (
                          <td>
                            <div className="org-actions">
                              {m.role !== 'owner' ? (
                                <>
                                  {m.role !== 'admin' ? (
                                    <button type="button" onClick={() => changeMemberRole(m.user_id, 'admin')}>
                                      {t.setAdmin}
                                    </button>
                                  ) : null}
                                  {m.role !== 'member' ? (
                                    <button type="button" onClick={() => changeMemberRole(m.user_id, 'member')}>
                                      {t.setMember}
                                    </button>
                                  ) : null}
                                </>
                              ) : (
                                <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                              )}
                              {m.user_id !== user.id ? (
                                m.role !== 'owner' ? (
                                  <button type="button" onClick={() => kickMember(m.user_id)}>
                                    {t.kick}
                                  </button>
                                ) : null
                              ) : null}
                              {m.status === 'active' ? (<button type="button" onClick={() => setMemberStatus(m.user_id, 'disabled')}>{t.disable}</button>) : (<button type="button" onClick={() => setMemberStatus(m.user_id, 'active')}>{t.enable}</button>)}
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    )) : (
                      <tr><td colSpan={canManageInvite ? 5 : 4}>{t.noMembers}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {canManageInvite ? (
            <section className="org-card org-list-card">
              <h2>{t.invites}</h2>
              {listLoading ? (
              <p className="org-note">{ui.loading}</p>
              ) : (
                <div className="org-table-wrap">
                  <table className="org-table">
                    <thead>
                      <tr>
                        <th>{t.email}</th>
                        <th>{t.role}</th>
                        <th>{t.status}</th>
                        <th>{t.expiresAt}</th>
                        <th>{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites.length ? invites.map((inv) => (
                        <tr key={inv.id}>
                          <td>{inv.email || '—'}</td>
                          <td>{getOrgRoleLabel(inv.role, lang)}</td>
                          <td>{inv.status || '—'}</td>
                          <td>{inv.expires_at ? new Date(inv.expires_at).toLocaleString('zh-CN') : '—'}</td>
                          <td>
                            <div className="org-actions">
                              <button
                                type="button"
                                onClick={() => resendInvite(inv.id)}
                                disabled={inviteSubmitting}
                              >
                                {t.resend}
                              </button>
                              <button
                                type="button"
                                onClick={() => revokeInvite(inv.id)}
                                disabled={inviteSubmitting || inv.status !== 'pending'}
                              >
                                {t.revoke}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5}>{t.noInvites}</td></tr>
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
          <h2>{t.createOrg}</h2>
          <label>
            <span>{t.orgName}</span>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="例如：健康长寿科技（上海）有限公司"
            />
          </label>
          <label>
            <span>{t.domainHint}</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="例如：yourcompany.com"
            />
          </label>
          <button type="button" className="btn-primary" disabled={submitting} onClick={createOrg}>
            {submitting ? t.creating : t.createBtn}
          </button>
        </section>
      )}
      {error ? <p className="org-error">{error}</p> : null}
      {hint ? <p className="org-hint">{hint}</p> : null}
    </div>
  )
}
