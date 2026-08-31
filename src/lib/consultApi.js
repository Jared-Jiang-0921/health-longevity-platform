/**
 * AI 咨询 SSE 客户端。默认请求同域 /api/ai/*（由 Nginx / Vite 反代到咨询后端）。
 */

const AI_BASE = String(import.meta.env.VITE_AI_API_BASE || '').replace(/\/$/, '')

function aiUrl(path) {
  return `${AI_BASE}${path}`
}

function mapStreamError(err) {
  if (err?.name === 'AbortError') return err
  const e = err instanceof Error ? err : new Error(String(err))
  const msg = String(e.message || '')
  if (
    msg === 'Failed to fetch'
    || msg === 'Load failed'
    || msg === 'network error'
    || /NetworkError|ERR_CONNECTION|ECONNRESET/i.test(msg)
  ) {
    const mapped = new Error(msg)
    mapped.code = 'NETWORK'
    mapped.cause = e
    return mapped
  }
  return e
}

async function parseJsonRes(res) {
  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || `HTTP ${res.status}`)
  }
  return data
}

export async function fetchConsultSessions(token) {
  const res = await fetch(`${aiUrl('/api/ai/sessions')}?limit=40`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
  const data = await parseJsonRes(res)
  if (!Array.isArray(data.sessions)) {
    throw new Error(data?.error?.message || '会话列表接口返回异常')
  }
  return data.sessions
}

export async function renameConsultSession(token, sessionId, title) {
  const res = await fetch(aiUrl(`/api/ai/sessions/${encodeURIComponent(sessionId)}`), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })
  return parseJsonRes(res)
}

export async function deleteConsultSession(token, sessionId) {
  const res = await fetch(aiUrl(`/api/ai/sessions/${encodeURIComponent(sessionId)}`), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  return parseJsonRes(res)
}

export async function fetchConsultReviews(headers, { status = 'pending', limit = 30, offset = 0 } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  if (status) qs.set('status', status)
  const res = await fetch(aiUrl(`/api/ai/admin/reviews?${qs}`), {
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      ...headers,
    },
  })
  return parseJsonRes(res)
}

export async function fetchConsultQuotaAdmin(headers, { day, q = '', limit = 30, offset = 0 } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  if (day) qs.set('day', day)
  if (q) qs.set('q', q)
  const res = await fetch(aiUrl(`/api/ai/admin/quota?${qs}`), {
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      ...headers,
    },
  })
  return parseJsonRes(res)
}

export async function grantConsultQuota(headers, body) {
  const res = await fetch(aiUrl('/api/ai/admin/quota/grant'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: JSON.stringify(body || {}),
  })
  return parseJsonRes(res)
}

export async function submitConsultFeedback(token, { sessionId, messageId, reason = '' }) {
  const res = await fetch(aiUrl('/api/ai/feedback'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({ sessionId, messageId, reason }),
  })
  return parseJsonRes(res)
}

export async function fetchConsultFeedbackAdmin(headers, { limit = 30, offset = 0 } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  const res = await fetch(aiUrl(`/api/ai/admin/feedback?${qs}`), {
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      ...headers,
    },
  })
  return parseJsonRes(res)
}

export async function updateConsultReview(headers, id, body) {
  const res = await fetch(aiUrl(`/api/ai/admin/reviews/${encodeURIComponent(id)}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: JSON.stringify(body || {}),
  })
  return parseJsonRes(res)
}

export async function clearConsultSessions(token) {
  const res = await fetch(aiUrl('/api/ai/sessions'), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  return parseJsonRes(res)
}

export async function fetchConsultQuota(token) {
  const res = await fetch(aiUrl('/api/ai/quota'), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
  return parseJsonRes(res)
}

export async function transcribeConsultAudio(token, { audio, mediaType, lang }) {
  const res = await fetch(aiUrl('/api/ai/transcribe'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({ audio, mediaType, lang }),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) {
    const err = new Error(data?.error?.message || data?.message || `HTTP ${res.status}`)
    err.code = data?.error?.code || `HTTP_${res.status}`
    if (data?.quota) err.quota = data.quota
    throw err
  }
  return data
}

export async function fetchConsultSession(token, sessionId) {
  const res = await fetch(aiUrl(`/api/ai/sessions/${encodeURIComponent(sessionId)}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  return parseJsonRes(res)
}

/**
 * @param {{
 *   token: string,
 *   message: string,
 *   lang: string,
 *   sessionId?: string | null,
 *   entry?: 'general' | 'professional',
   *   usePubmed?: boolean,
 *   useCochrane?: boolean,
 *   useEuropePmc?: boolean,
 *   profile?: object | null,
 *   attachments?: Array<object>,
 *   signal?: AbortSignal,
 *   onMeta?: (data: object) => void,
 *   onDelta?: (text: string) => void,
 *   onDone?: (data: object) => void,
 *   onError?: (err: Error) => void,
 * }} opts
 */
export async function streamConsultChat(opts) {
  const {
    token,
    message,
    lang,
    sessionId,
    entry = 'general',
    usePubmed = false,
    useCochrane = false,
    useEuropePmc = false,
    profile = null,
    attachments = [],
    signal,
    onMeta,
    onDelta,
    onDone,
    onError,
  } = opts

  let res
  try {
    res = await fetch(aiUrl('/api/ai/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        message,
        lang,
        sessionId: sessionId || undefined,
        usePubmed,
        useCochrane,
        useEuropePmc,
        profile: {
          consultEntry: entry,
          ...(profile && typeof profile === 'object' ? profile : {}),
        },
        attachments: Array.isArray(attachments) && attachments.length ? attachments : undefined,
      }),
      signal,
    })
  } catch (err) {
    const mapped = mapStreamError(err)
    onError?.(mapped)
    throw mapped
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    let payload = {}
    try {
      payload = await res.json()
      detail = payload?.error?.message || payload?.message || detail
    } catch {
      /* ignore */
    }
    const err = new Error(detail)
    err.code = payload?.error?.code || `HTTP_${res.status}`
    if (payload?.quota) err.quota = payload.quota
    onError?.(err)
    throw err
  }

  if (!res.body) {
    const err = new Error('No response body')
    onError?.(err)
    throw err
  }

  const reader = res.body.getReader()
  if (signal) {
    const cancelRead = () => { reader.cancel().catch(() => {}) }
    if (signal.aborted) cancelRead()
    else signal.addEventListener('abort', cancelRead, { once: true })
  }
  const decoder = new TextDecoder()
  let buffer = ''
  let eventName = 'message'
  let gotDone = false

  const dispatch = (name, dataStr) => {
    let data = {}
    try {
      data = JSON.parse(dataStr)
    } catch {
      data = { raw: dataStr }
    }
    if (name === 'meta') onMeta?.(data)
    else if (name === 'delta' && data.text) onDelta?.(data.text)
    else if (name === 'done') {
      gotDone = true
      onDone?.(data)
    } else if (name === 'error') {
      gotDone = true
      onError?.(new Error(data.message || 'Upstream model error'))
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n')
      buffer = parts.pop() || ''
      for (const line of parts) {
        if (line.startsWith('event:')) {
          eventName = line.slice(6).trim() || 'message'
        } else if (line.startsWith('data:')) {
          dispatch(eventName, line.slice(5).trim())
          eventName = 'message'
        } else if (line.trim() === '') {
          eventName = 'message'
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) throw err
    const mapped = mapStreamError(err)
    onError?.(mapped)
    throw mapped
  }

  if (!gotDone && !signal?.aborted) {
    const err = new Error('Incomplete stream')
    err.code = 'NETWORK'
    onError?.(err)
    throw err
  }
}
