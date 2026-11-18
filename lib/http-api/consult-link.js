import { verifyToken } from '../auth.js'
import { CONSULT_LINK_MAX } from '../consultLinkLimits.js'
import { ConsultLinkError, redactConsultUrl } from '../consultLinkPolicy.js'
import { readPublicConsultLink } from '../consultLinkFetch.js'

const WINDOW_MS = 60_000
const USER_LIMIT = 8
const MAX_ACTIVE = 4
const buckets = new Map()
let active = 0

export function allowConsultLinkUser(userId, now = Date.now()) {
  const recent = (buckets.get(userId) || []).filter((stamp) => now - stamp < WINDOW_MS)
  if (recent.length >= USER_LIMIT) {
    buckets.set(userId, recent)
    return false
  }
  recent.push(now)
  buckets.set(userId, recent)
  return true
}

function tokenFrom(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization || ''
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
}

function logFetch(userId, code, hostname) {
  console.info(`[consult-link] user=${userId} code=${code} host=${hostname || '-'}`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ code: 'METHOD', error: 'Method not allowed' })
  }
  const userId = await verifyToken(tokenFrom(req))
  if (!userId) return res.status(401).json({ code: 'UNAUTHORIZED', error: '请先登录' })
  if (!allowConsultLinkUser(String(userId))) {
    return res.status(429).json({ code: 'RATE_LIMIT', error: '读取链接过于频繁，请稍后再试' })
  }
  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  } catch {
    return res.status(400).json({ code: 'INVALID_JSON', error: '请求数据格式不正确' })
  }
  const question = String(body.question || '').slice(0, 4000)
  const requested = Array.isArray(body.urls) ? body.urls.map((item) => String(item || '').trim()).filter(Boolean) : []
  if (!requested.length || requested.length > CONSULT_LINK_MAX) {
    return res.status(400).json({ code: 'TOO_MANY', error: '一次最多读取 2 个公开链接' })
  }
  if (active >= MAX_ACTIVE) {
    return res.status(429).json({ code: 'BUSY', error: '读取链接的人较多，请稍后再试' })
  }
  active += 1
  const sources = []
  try {
    for (const raw of requested) {
      let host = ''
      try {
        host = new URL(raw).hostname
      } catch {
        host = ''
      }
      try {
        const item = await readPublicConsultLink(raw, question)
        logFetch(userId, 'ok', host)
        sources.push(item)
      } catch (err) {
        const code = err instanceof ConsultLinkError ? err.code : 'FETCH_FAIL'
        logFetch(userId, code, host)
        let safeUrl = ''
        try { safeUrl = redactConsultUrl(raw) } catch { safeUrl = '' }
        sources.push({ ok: false, url: safeUrl, code })
      }
    }
  } finally {
    active -= 1
  }
  return res.status(200).json({ sources })
}
