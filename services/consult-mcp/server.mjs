/**
 * Grok 连接器用的专业咨询 MCP。
 * 只监听 127.0.0.1:3002，由 Nginx 反代 /mcp 与 OAuth 发现地址。
 * 不占用主站 api-server 的 3000，也不动咨询服务的 3001。
 */
import { createServer } from 'node:http'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { sql } from '../../lib/db.js'
import { createToken, getUserById, verifyPassword, verifyToken } from '../../lib/auth.js'
import { verifyTotpToken } from '../../lib/totp.js'
import { createOAuthStore } from './oauth-store.mjs'

const HOST = process.env.MCP_HOST || '127.0.0.1'
const PORT = Number(process.env.MCP_PORT || 3002)
const PUBLIC_BASE = (process.env.MCP_PUBLIC_BASE || 'https://www.healthlongevity.cn').replace(/\/$/, '')
const CONSULT_UPSTREAM = (process.env.CONSULT_UPSTREAM || 'http://127.0.0.1:3001').replace(/\/$/, '')
const API_UPSTREAM = (process.env.MCP_API_UPSTREAM || 'http://127.0.0.1:3000').replace(/\/$/, '')
const STORE_PATH = process.env.MCP_OAUTH_STORE || '/var/lib/healthlongevity-mcp/oauth.json'
const RESOURCE = `${PUBLIC_BASE}/mcp`
const METADATA = `${PUBLIC_BASE}/.well-known/oauth-protected-resource/mcp`

const store = createOAuthStore(STORE_PATH)
const loginFailures = new Map()

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function randomId(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

function s256(verifier) {
  return createHash('sha256').update(verifier).digest('base64url')
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

const EXTRA_REDIRECTS = new Set([
  'https://www.cursor.com/agents/mcp/oauth/callback',
  'http://localhost:8787/callback',
  'cursor://anysphere.cursor-mcp/oauth/callback',
])

function redirectAllowed(uri) {
  const normalized = String(uri || '').trim().replace(/\/$/, '')
  if (EXTRA_REDIRECTS.has(normalized)) return true
  let url
  try {
    url = new URL(uri)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' || url.username || url.password) return false
  if (url.host !== 'grok.com') return false
  const path = url.pathname.replace(/\/$/, '') || '/'
  return path === '/connectors-oauth-exchange-code' || path.startsWith('/connectors-oauth')
}

function resourceAllowed(value) {
  if (!value) return true
  const normalized = String(value).replace(/\/$/, '')
  return normalized === RESOURCE || normalized === PUBLIC_BASE
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  return forwarded || req.socket.remoteAddress || ''
}

function tooManyLogins(ip) {
  const now = Date.now()
  const row = loginFailures.get(ip)
  if (!row || row.resetAt <= now) return false
  return row.count >= 8
}

function markLoginFailure(ip) {
  const now = Date.now()
  const row = loginFailures.get(ip)
  if (!row || row.resetAt <= now) {
    loginFailures.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return
  }
  row.count += 1
}

function clearLoginFailures(ip) {
  loginFailures.delete(ip)
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sendJson(res, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(payload),
    ...extraHeaders,
  })
  res.end(payload)
}

function sendHtml(res, status, html, extraHeaders = {}) {
  const payload = Buffer.from(html)
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': payload.length,
    ...extraHeaders,
  })
  res.end(payload)
}

function unauthorized(res) {
  sendJson(res, 401, { error: 'invalid_token' }, {
    'WWW-Authenticate': `Bearer realm="healthlongevity", resource_metadata="${METADATA}"`,
  })
}

async function readBody(req, limit = 1_000_000) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) {
      const err = new Error('payload too large')
      err.status = 413
      throw err
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function parseForm(raw) {
  const params = new URLSearchParams(raw)
  return Object.fromEntries(params.entries())
}

function cookieValue(req, name) {
  const header = String(req.headers.cookie || '')
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

function oauthCookie(id, req) {
  const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''
  return `hl_mcp_oauth=${encodeURIComponent(id)}; HttpOnly; SameSite=Lax; Path=/mcp/oauth; Max-Age=600${secure}`
}

function clearOauthCookie() {
  return 'hl_mcp_oauth=; HttpOnly; SameSite=Lax; Path=/mcp/oauth; Max-Age=0'
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f4f7fb; color: #0f172a; }
    main { max-width: 28rem; margin: 0 auto; padding: 2rem 1rem 3rem; }
    h1 { font-size: 1.35rem; margin: 0 0 0.5rem; }
    p { line-height: 1.55; color: #334155; }
    form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.92rem; }
    input { font: inherit; padding: 0.7rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    button { font: inherit; padding: 0.75rem 1rem; border: 0; border-radius: 8px; background: #1a6fd4; color: white; }
    .warn { background: #fff7ed; border: 1px solid #fdba74; border-radius: 8px; padding: 0.75rem; }
    .error { color: #b91c1c; margin: 0; }
  </style>
</head>
<body><main>${body}</main></body>
</html>`
}

function metadataBody() {
  return {
    resource: RESOURCE,
    authorization_servers: [PUBLIC_BASE],
    bearer_methods_supported: ['header'],
    scopes_supported: ['consult:professional'],
  }
}

function authorizationServerMetadata() {
  return {
    issuer: PUBLIC_BASE,
    authorization_endpoint: `${PUBLIC_BASE}/mcp/oauth/authorize`,
    token_endpoint: `${PUBLIC_BASE}/mcp/oauth/token`,
    registration_endpoint: `${PUBLIC_BASE}/mcp/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    scopes_supported: ['consult:professional'],
  }
}

async function handleRegister(req, res) {
  let body = {}
  try {
    body = JSON.parse(await readBody(req))
  } catch {
    return sendJson(res, 400, { error: 'invalid_client_metadata' })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return sendJson(res, 400, { error: 'invalid_client_metadata' })
  }
  const redirects = Array.isArray(body.redirect_uris) ? body.redirect_uris.map(String) : []
  if (!redirects.length || redirects.some((uri) => !redirectAllowed(uri))) {
    console.warn('[consult-mcp] rejected redirect', redirects.map((uri) => {
      try {
        const url = new URL(uri)
        return `${url.host}${url.pathname}`
      } catch {
        return 'invalid'
      }
    }))
    return sendJson(res, 400, { error: 'invalid_redirect_uri' })
  }
  const authMethod = body.token_endpoint_auth_method || 'none'
  if (authMethod !== 'none') {
    return sendJson(res, 400, { error: 'invalid_client_metadata', error_description: 'public clients only' })
  }
  const clientId = `grok_${randomId(18)}`
  await store.update(async (data) => {
    const ids = Object.keys(data.clients)
    if (ids.length > 200) delete data.clients[ids[0]]
    data.clients[clientId] = {
      name: String(body.client_name || 'Grok').slice(0, 80),
      redirectUris: redirects,
      createdAt: Date.now(),
    }
  })
  return sendJson(res, 201, {
    client_id: clientId,
    client_id_issued_at: Math.floor(Date.now() / 1000),
    client_name: String(body.client_name || 'Grok').slice(0, 80),
    redirect_uris: redirects,
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
  })
}

async function handleAuthorize(req, res, url) {
  const clientId = url.searchParams.get('client_id') || ''
  const redirectUri = url.searchParams.get('redirect_uri') || ''
  const state = url.searchParams.get('state') || ''
  const challenge = url.searchParams.get('code_challenge') || ''
  const method = url.searchParams.get('code_challenge_method') || ''
  const resource = url.searchParams.get('resource') || ''
  if (url.searchParams.get('response_type') !== 'code' || method !== 'S256' || !challenge || !state) {
    return sendHtml(res, 400, page('无法授权', '<h1>无法授权</h1><p>Grok 的授权请求不完整。请回到 Grok 重新添加连接器。</p>'))
  }
  if (!resourceAllowed(resource) || !redirectAllowed(redirectUri)) {
    return sendHtml(res, 400, page('无法授权', `<h1>无法授权</h1><p>这个回调地址未开通。</p><p>${escapeHtml(redirectUri)}</p>`))
  }
  const data = await store.read()
  const client = data.clients[clientId]
  if (!client || !client.redirectUris.includes(redirectUri)) {
    return sendHtml(res, 400, page('无法授权', '<h1>无法授权</h1><p>连接器尚未注册，或回调地址与注册时不一致。请在 Grok 里删除后重新添加。</p>'))
  }
  const pendingId = randomId(24)
  await store.update(async (next) => {
    const ids = Object.keys(next.pending)
    if (ids.length > 500) delete next.pending[ids[0]]
    next.pending[pendingId] = {
      clientId,
      redirectUri,
      state,
      challenge,
      resource,
      userId: '',
      expiresAt: Date.now() + 10 * 60 * 1000,
    }
  })
  return sendHtml(res, 200, page('登录长健星图', `
    <h1>登录后授权 Grok</h1>
    <p>Grok 将用你的高级会员身份调用「专业健康长寿咨询」。回答只供健康教育参考，不构成诊断、治疗或处方。</p>
    <form method="post" action="/mcp/oauth/login">
      <label>邮箱<input name="email" type="email" autocomplete="username" required /></label>
      <label>密码<input name="password" type="password" autocomplete="current-password" required /></label>
      <label>验证器动态码（未开启可留空）<input name="totp" inputmode="numeric" autocomplete="one-time-code" /></label>
      <button type="submit">继续</button>
    </form>
  `), { 'Set-Cookie': oauthCookie(pendingId, req) })
}

async function loginUser(email, password, totp) {
  const loginId = String(email || '').trim().toLowerCase()
  const rows = await sql`
    SELECT id, password_hash, COALESCE(totp_enabled, false) AS totp_enabled, totp_secret
    FROM users WHERE email = ${loginId}
  `
  if (!rows.length) return { error: '账号或密码错误' }
  const ok = await verifyPassword(password, rows[0].password_hash)
  if (!ok) return { error: '账号或密码错误' }
  if (rows[0].totp_enabled) {
    if (!verifyTotpToken(rows[0].totp_secret, totp)) {
      return { error: rows[0].totp_secret ? '验证器动态码不正确' : '账号或密码错误' }
    }
  }
  const user = await getUserById(rows[0].id)
  if (!user) return { error: '账号或密码错误' }
  if (user.level !== 'premium') return { error: '专业咨询需要高级会员。请先在网站升级后再授权。', user }
  return { user }
}

async function handleLogin(req, res) {
  const ip = clientIp(req)
  if (tooManyLogins(ip)) {
    return sendHtml(res, 429, page('请稍后再试', '<h1>请稍后再试</h1><p>登录尝试过多，请 15 分钟后再回到 Grok 重新添加连接器。</p>'))
  }
  const pendingId = cookieValue(req, 'hl_mcp_oauth')
  const form = parseForm(await readBody(req))
  const pending = pendingId
    ? (await store.read()).pending[pendingId]
    : null
  if (!pending) {
    return sendHtml(res, 400, page('授权已过期', '<h1>授权已过期</h1><p>请回到 Grok，重新添加连接器。</p>'))
  }
  const result = await loginUser(form.email, form.password, form.totp)
  if (result.error) {
    markLoginFailure(ip)
    return sendHtml(res, 401, page('无法登录', `
      <h1>无法登录</h1>
      <p class="error">${escapeHtml(result.error)}</p>
      <form method="post" action="/mcp/oauth/login">
        <label>邮箱<input name="email" type="email" autocomplete="username" required value="${escapeHtml(form.email || '')}" /></label>
        <label>密码<input name="password" type="password" autocomplete="current-password" required /></label>
        <label>验证器动态码（未开启可留空）<input name="totp" inputmode="numeric" autocomplete="one-time-code" /></label>
        <button type="submit">继续</button>
      </form>
    `))
  }
  clearLoginFailures(ip)
  await store.update(async (data) => {
    if (data.pending[pendingId]) data.pending[pendingId].userId = result.user.id
  })
  return sendHtml(res, 200, page('授权专业咨询', `
    <h1>允许 Grok 使用专业咨询</h1>
    <p>当前账号：${escapeHtml(result.user.email)}</p>
    <p class="warn">Grok 每次提问都会消耗这个账号的当日咨询额度。回答仅供健康教育参考，不构成诊断、治疗或处方。急症请去急诊。</p>
    <form method="post" action="/mcp/oauth/approve">
      <button type="submit">同意并返回 Grok</button>
    </form>
  `))
}

async function handleApprove(req, res) {
  const pendingId = cookieValue(req, 'hl_mcp_oauth')
  const peeked = pendingId ? (await store.read()).pending[pendingId] : null
  if (!peeked?.userId) {
    return sendHtml(res, 400, page('授权已过期', '<h1>授权已过期</h1><p>请回到 Grok，重新添加连接器。</p>'))
  }
  const user = await getUserById(peeked.userId)
  if (!user || user.level !== 'premium') {
    return sendHtml(res, 403, page('需要高级会员', '<h1>需要高级会员</h1><p>专业咨询只对高级会员开放。</p>'))
  }
  const code = randomId(32)
  const pending = await store.update(async (next) => {
    const row = next.pending[pendingId]
    if (!row?.userId || row.userId !== user.id) return null
    delete next.pending[pendingId]
    next.codes[sha256(code)] = {
      userId: user.id,
      clientId: row.clientId,
      redirectUri: row.redirectUri,
      challenge: row.challenge,
      resource: row.resource,
      expiresAt: Date.now() + 5 * 60 * 1000,
    }
    return row
  })
  if (!pending) {
    return sendHtml(res, 400, page('授权已过期', '<h1>授权已过期</h1><p>请回到 Grok，重新添加连接器。</p>'))
  }
  const target = new URL(pending.redirectUri)
  target.searchParams.set('code', code)
  target.searchParams.set('state', pending.state)
  res.writeHead(302, {
    Location: target.toString(),
    'Set-Cookie': clearOauthCookie(),
    'Cache-Control': 'no-store',
  })
  res.end()
}

async function issueToken(userId, clientId) {
  const accessToken = await createToken(String(userId))
  const refreshToken = randomId(32)
  await store.update(async (data) => {
    const ids = Object.keys(data.refresh)
    if (ids.length > 500) delete data.refresh[ids[0]]
    data.refresh[sha256(refreshToken)] = {
      userId: String(userId),
      clientId,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    }
  })
  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 7 * 24 * 60 * 60,
    refresh_token: refreshToken,
    scope: 'consult:professional',
  }
}

async function handleToken(req, res) {
  const form = parseForm(await readBody(req))
  if (!resourceAllowed(form.resource)) {
    return sendJson(res, 400, { error: 'invalid_target' })
  }
  if (form.grant_type === 'authorization_code') {
    const code = String(form.code || '')
    const verifier = String(form.code_verifier || '')
    const record = await store.update(async (data) => {
      const row = data.codes[sha256(code)]
      if (!row || row.clientId !== form.client_id || row.redirectUri !== form.redirect_uri) return null
      if (!safeEqual(s256(verifier), row.challenge)) return null
      delete data.codes[sha256(code)]
      return row
    })
    if (!record) return sendJson(res, 400, { error: 'invalid_grant' })
    const user = await getUserById(record.userId)
    if (!user || user.level !== 'premium') {
      return sendJson(res, 400, { error: 'invalid_grant' })
    }
    return sendJson(res, 200, await issueToken(user.id, record.clientId))
  }
  if (form.grant_type === 'refresh_token') {
    const refresh = String(form.refresh_token || '')
    const record = await store.update(async (data) => {
      const row = data.refresh[sha256(refresh)]
      if (!row || (form.client_id && row.clientId !== form.client_id)) return null
      delete data.refresh[sha256(refresh)]
      return row
    })
    if (!record) return sendJson(res, 400, { error: 'invalid_grant' })
    const user = await getUserById(record.userId)
    if (!user || user.level !== 'premium') {
      return sendJson(res, 400, { error: 'invalid_grant' })
    }
    return sendJson(res, 200, await issueToken(user.id, record.clientId))
  }
  return sendJson(res, 400, { error: 'unsupported_grant_type' })
}

function bearerToken(req) {
  const header = String(req.headers.authorization || '')
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : ''
}

async function currentUser(req) {
  const token = bearerToken(req)
  if (!token) return null
  const userId = await verifyToken(token)
  if (!userId) return null
  const user = await getUserById(userId)
  if (!user || user.level !== 'premium') return null
  return { user, token }
}

function collectSources(meta) {
  const rows = []
  const push = (item, kind) => {
    if (!item || rows.length >= 8) return
    const title = String(item.title || item.source || item.book || '').trim().slice(0, 160)
    if (!title) return
    rows.push({
      kind,
      title,
      url: String(item.url || '').slice(0, 300),
    })
  }
  for (const item of Array.isArray(meta.sources) ? meta.sources : []) push(item, 'kb')
  for (const item of Array.isArray(meta.pubmed) ? meta.pubmed : []) push(item, 'pubmed')
  for (const item of Array.isArray(meta.cochrane) ? meta.cochrane : []) push(item, 'cochrane')
  for (const item of Array.isArray(meta.europepmc) ? meta.europepmc : []) push(item, 'europepmc')
  return rows
}

async function fetchProfile(token) {
  const headers = { Authorization: `Bearer ${token}` }
  const load = async (path) => {
    const res = await fetch(`${API_UPSTREAM}${path}`, { headers, signal: AbortSignal.timeout(4000) })
    if (!res.ok) return null
    return res.json()
  }
  const profile = { consultEntry: 'professional' }
  try {
    const [questionnaire, risk, aging, tcm] = await Promise.all([
      load('/api/health-questionnaire').catch(() => null),
      load('/api/risk-assessments').catch(() => null),
      load('/api/aging-assessments').catch(() => null),
      load('/api/tcm-constitution').catch(() => null),
    ])
    const submission = questionnaire?.submission
    if (submission && submission.consent_health_data !== false && submission.consentHealthData !== false) {
      for (const key of ['ageRange', 'sex', 'region', 'goals', 'concerns', 'medicalHistory', 'medications', 'allergies', 'lifestyle', 'sleep']) {
        const text = String(submission[key] || '').trim().slice(0, 800)
        if (text) profile[key] = text
      }
    }
    const riskSummary = String(risk?.riskSummary || '').trim().slice(0, 800)
    const agingSummary = String(aging?.agingSummary || '').trim().slice(0, 800)
    const constitutionSummary = String(tcm?.constitutionSummary || '').trim().slice(0, 800)
    if (riskSummary) profile.riskSummary = riskSummary
    if (agingSummary) profile.agingSummary = agingSummary
    if (constitutionSummary) profile.constitutionSummary = constitutionSummary
  } catch {
    /* 摘要读不到时仍按专业咨询作答 */
  }
  return profile
}

async function askConsult(token, args) {
  const question = String(args?.question || '').trim()
  if (!question) {
    return { isError: true, text: '缺少问题。' }
  }
  if (question.length > 4000) {
    return { isError: true, text: '问题请控制在 4000 字以内。' }
  }
  const lang = ['zh', 'en', 'ar'].includes(args?.lang) ? args.lang : 'zh'
  const sessionId = String(args?.session_id || '').trim().slice(0, 80)
  const profile = await fetchProfile(token)
  const res = await fetch(`${CONSULT_UPSTREAM}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      message: question,
      lang,
      sessionId: sessionId || undefined,
      usePubmed: Boolean(args?.use_pubmed),
      useCochrane: Boolean(args?.use_cochrane),
      useEuropePmc: Boolean(args?.use_europe_pmc),
      profile,
    }),
    signal: AbortSignal.timeout(180000),
  })
  if (!res.ok || !res.body) {
    let detail = `咨询暂时无法完成（HTTP ${res.status}）`
    try {
      const payload = await res.json()
      detail = payload?.error?.message || payload?.message || detail
    } catch {
      /* 保留状态码说明 */
    }
    return { isError: true, text: detail }
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let eventName = 'message'
  let text = ''
  let foundSession = sessionId
  let sources = []
  let blocked = ''
  let error = ''
  const dispatch = (name, dataStr) => {
    let data = {}
    try {
      data = JSON.parse(dataStr)
    } catch {
      data = {}
    }
    if (name === 'meta') {
      if (data.sessionId) foundSession = String(data.sessionId)
      if (data.blocked && data.reason) blocked = String(data.reason)
      sources = collectSources(data)
    } else if (name === 'delta' && data.text) {
      text += String(data.text)
    } else if (name === 'done') {
      if (data.sessionId) foundSession = String(data.sessionId)
    } else if (name === 'error') {
      error = String(data.message || '咨询暂时失败')
    }
  }
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n')
    buffer = parts.pop() || ''
    for (const line of parts) {
      if (line.startsWith('event:')) eventName = line.slice(6).trim() || 'message'
      else if (line.startsWith('data:')) {
        dispatch(eventName, line.slice(5).trim())
        eventName = 'message'
      } else if (!line.trim()) eventName = 'message'
    }
  }
  if (blocked) return { isError: true, text: blocked }
  if (error && !text) return { isError: true, text: error }
  if (!text) return { isError: true, text: '咨询没有返回内容，请再试一次。' }
  const clipped = text.slice(0, 12000)
  const sourceLines = sources.map((item) => `- ${item.title}${item.url ? ` ${item.url}` : ''}`)
  const parts = [
    clipped,
    '',
    foundSession ? `session_id: ${foundSession}` : '',
    sourceLines.length ? `参考文献:\n${sourceLines.join('\n')}` : '',
    '本回答来自长健星图专业健康长寿咨询，仅供健康教育参考，不构成诊断、治疗建议或处方。未经当场辨证，不能作为用药依据。急症请去急诊。',
  ].filter(Boolean)
  return { isError: false, text: parts.join('\n') }
}

const TOOL = {
  name: 'ask_professional_consult',
  description: '向长健星图的专业健康长寿咨询提问。知识库覆盖基础医学、临床医学、功能医学和长寿学，可按需检索 PubMed、Cochrane、欧洲 PMC。仅高级会员可用。回答只供健康教育参考，不构成诊断、治疗或处方；急症应建议就医。接着问时传入上一轮返回的 session_id。',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      question: { type: 'string', description: '要咨询的问题' },
      lang: { type: 'string', enum: ['zh', 'en', 'ar'], description: '回答语言，默认中文' },
      use_pubmed: { type: 'boolean', description: '是否检索 PubMed' },
      use_cochrane: { type: 'boolean', description: '是否检索 Cochrane' },
      use_europe_pmc: { type: 'boolean', description: '是否检索欧洲 PMC' },
      session_id: { type: 'string', description: '上一轮返回的 session_id，用于接着问' },
    },
    required: ['question'],
  },
}

function rpcResult(id, result) {
  return { jsonrpc: '2.0', id, result }
}

function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } }
}

async function handleMcp(req, res) {
  const auth = await currentUser(req)
  if (!auth) return unauthorized(res)
  let body
  try {
    body = JSON.parse(await readBody(req))
  } catch {
    return sendJson(res, 400, rpcError(null, -32700, 'Parse error'))
  }
  const messages = Array.isArray(body) ? body : [body]
  const replies = []
  for (const message of messages) {
    const id = message?.id ?? null
    const method = message?.method
    if (id == null) continue
    if (method === 'initialize') {
      const requested = String(message?.params?.protocolVersion || '')
      const protocolVersion = /^20\d\d-\d\d-\d\d$/.test(requested) ? requested : '2025-03-26'
      replies.push(rpcResult(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'healthlongevity-professional-consult', version: '1.0.0' },
      }))
    } else if (method === 'ping') {
      replies.push(rpcResult(id, {}))
    } else if (method === 'tools/list') {
      replies.push(rpcResult(id, { tools: [TOOL] }))
    } else if (method === 'tools/call') {
      const name = message?.params?.name
      if (name !== TOOL.name) {
        replies.push(rpcError(id, -32602, 'Unknown tool'))
        continue
      }
      try {
        const outcome = await askConsult(auth.token, message?.params?.arguments || {})
        replies.push(rpcResult(id, {
          content: [{ type: 'text', text: outcome.text }],
          isError: outcome.isError,
        }))
      } catch (err) {
        console.error('[consult-mcp] consult failed', err?.name || 'error')
        replies.push(rpcResult(id, {
          content: [{ type: 'text', text: '专业咨询暂时没有完成，请稍后再问。' }],
          isError: true,
        }))
      }
    } else {
      replies.push(rpcError(id, -32601, 'Method not found'))
    }
  }
  if (!replies.length) {
    res.writeHead(202, { 'Cache-Control': 'no-store' })
    res.end()
    return
  }
  const payload = Array.isArray(body) ? replies : replies[0]
  const accept = String(req.headers.accept || '')
  if (accept.includes('text/event-stream') && !accept.includes('application/json')) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    })
    res.end(`event: message\ndata: ${JSON.stringify(payload)}\n\n`)
    return
  }
  sendJson(res, 200, payload)
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', PUBLIC_BASE)
    if (req.method === 'GET' && (url.pathname === '/mcp/health' || url.pathname === '/health')) {
      return sendJson(res, 200, { ok: true, service: 'consult-mcp' })
    }
    if (req.method === 'GET' && (
      url.pathname === '/.well-known/oauth-protected-resource'
      || url.pathname === '/.well-known/oauth-protected-resource/mcp'
    )) {
      return sendJson(res, 200, metadataBody())
    }
    if (req.method === 'GET' && url.pathname === '/.well-known/oauth-authorization-server') {
      return sendJson(res, 200, authorizationServerMetadata())
    }
    if (req.method === 'POST' && url.pathname === '/mcp/oauth/register') return handleRegister(req, res)
    if (req.method === 'GET' && url.pathname === '/mcp/oauth/authorize') return handleAuthorize(req, res, url)
    if (req.method === 'POST' && url.pathname === '/mcp/oauth/login') return handleLogin(req, res)
    if (req.method === 'POST' && url.pathname === '/mcp/oauth/approve') return handleApprove(req, res)
    if (req.method === 'POST' && url.pathname === '/mcp/oauth/token') return handleToken(req, res)
    if ((req.method === 'POST' || req.method === 'GET') && (url.pathname === '/mcp' || url.pathname === '/mcp/')) {
      if (req.method === 'GET') return unauthorized(res)
      return handleMcp(req, res)
    }
    sendJson(res, 404, { error: 'not_found' })
  } catch (err) {
    const status = err?.status || 500
    console.error('[consult-mcp] request failed', err?.name || 'error')
    if (!res.headersSent) sendJson(res, status, { error: status === 413 ? 'payload_too_large' : 'server_error' })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`[consult-mcp] listening on ${HOST}:${PORT}`)
})
