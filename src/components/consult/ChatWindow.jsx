import { useEffect, useMemo, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import { streamConsultChat, fetchConsultSession, submitConsultFeedback, transcribeConsultAudio } from '../../lib/consultApi'
import { stripBibliographySection, parseFollowups, normalizeFollowups } from '../../lib/consultText'
import {
  blobToBase64,
  canAddAttachment,
  fileToAttachment,
  micSupported,
  pickRecorderMime,
  recorderMediaType,
  stopMediaStream,
  toApiAttachments,
} from '../../lib/consultAttachments'

function litItem(p, fallbackKind) {
  const kind = p.kind || fallbackKind
  const pmid = p.pmid || p.PMID
  return {
    title: p.title || kind,
    pmid,
    url: p.url || (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : ''),
    text: [p.journal, p.pubdate].filter(Boolean).join(' · '),
    journal: p.journal,
    pubdate: p.pubdate,
    kind,
    source: p.source ||     kind,
  }
}

function displayStreamError(err, copy) {
  if (err?.code === 'QUOTA_EXCEEDED') return copy.quotaExceeded || err.message
  if (err?.code === 'ATTACH_INVALID') return err.message || copy.attachUnsupported || copy.sendFail
  if (err?.code === 'HTTP_413' || /payload|entity too large|413/i.test(err?.message || '')) {
    return copy.attachTooLarge || err.message || copy.sendFail
  }
  if (err?.code === 'NETWORK' || err?.message === 'Failed to fetch' || err?.message === 'Incomplete stream') {
    return copy.networkFail || copy.sendFail
  }
  return err?.message || copy.sendFail
}

function flattenStoredSources(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  const list = []
  if (Array.isArray(raw.rag)) {
    for (const s of raw.rag) {
      list.push({
        kind: 'kb',
        title: s.title || s.source || s.book || '',
        source: s.source || '',
        book: s.book || '',
        url: s.url || '',
        text: s.text || '',
        chapter: s.chapter,
        page: s.page,
      })
    }
  }
  if (Array.isArray(raw.pubmed)) {
    for (const p of raw.pubmed) list.push(litItem(p, 'pubmed'))
  }
  if (Array.isArray(raw.cochrane)) {
    for (const p of raw.cochrane) list.push(litItem(p, 'cochrane'))
  }
  if (Array.isArray(raw.europepmc)) {
    for (const p of raw.europepmc) list.push(litItem(p, 'europepmc'))
  }
  return list
}

function mapStoredMessage(row) {
  return {
    id: row.id || '',
    role: row.role,
    content: row.content || '',
    sources: row.role === 'assistant' ? flattenStoredSources(row.sources) : [],
    blocked: Boolean(row.blocked),
    downvoted: row.feedback_reason != null,
  }
}

export default function ChatWindow({
  token,
  lang,
  entry,
  initialQuery,
  rtl,
  copy,
  profile,
  sessionId: sessionIdProp,
  onSessionChange,
  onSessionTouched,
  onQuota,
  quotaRemaining,
  quotaUnlimited,
}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(sessionIdProp || null)
  const [usePubmed, setUsePubmed] = useState(false)
  const [useCochrane, setUseCochrane] = useState(false)
  const [useEuropePmc, setUseEuropePmc] = useState(false)
  const [sending, setSending] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(Boolean(sessionIdProp))
  const [error, setError] = useState('')
  const [attachments, setAttachments] = useState([])
  const [listening, setListening] = useState(false)
  const [attaching, setAttaching] = useState(false)
  const bottomRef = useRef(null)
  const abortRef = useRef(null)
  const bootRef = useRef(false)
  const skipReloadRef = useRef(false)
  const fileRef = useRef(null)
  const sessionRef = useRef(sessionId)
  sessionRef.current = sessionId
  const recRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const voiceTimerRef = useRef(0)
  const voiceBusyRef = useRef(false)
  const [transcribing, setTranscribing] = useState(false)
  const canSpeech = useMemo(() => micSupported(), [])
  const isProfessional = entry === 'professional'

  function releaseMic() {
    window.clearTimeout(voiceTimerRef.current)
    stopMediaStream(streamRef.current)
    streamRef.current = null
    recRef.current = null
  }

  useEffect(() => () => {
    abortRef.current?.abort()
    try { recRef.current?.stop() } catch { /* noop */ }
    window.clearTimeout(voiceTimerRef.current)
    stopMediaStream(streamRef.current)
  }, [])

  useEffect(() => {
    if (!isProfessional) {
      setUsePubmed(false)
      setUseCochrane(false)
      setUseEuropePmc(false)
    }
  }, [isProfessional])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending, loadingHistory])

  useEffect(() => {
    if (!sessionIdProp || !token) {
      setLoadingHistory(false)
      return
    }
    if (skipReloadRef.current) {
      skipReloadRef.current = false
      return
    }
    let cancelled = false
    setLoadingHistory(true)
    setError('')
    fetchConsultSession(token, sessionIdProp)
      .then((data) => {
        if (cancelled) return
        const rows = Array.isArray(data.messages) ? data.messages.map(mapStoredMessage) : []
        setSessionId(data.session?.id || sessionIdProp)
        setMessages(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || copy.loadFail || copy.sendFail)
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false)
      })
    return () => {
      cancelled = true
    }
  }, [sessionIdProp, token])

  async function sendMessage(raw) {
    const pending = attachments
    const text = String(raw || '').trim() || (pending.length ? (copy.attachDefault || '') : '')
    if ((!text && !pending.length) || sending || attaching || !token || loadingHistory) return
    if (!quotaUnlimited && quotaRemaining === 0) {
      setError(copy.quotaExceeded || copy.sendFail)
      return
    }
    setError('')
    setSending(true)
    setMessages((prev) => [...prev, {
      role: 'user',
      content: text,
      attachments: pending.map((a) => ({
        kind: a.kind,
        name: a.name,
        preview: a.preview || '',
      })),
    }])
    setInput('')
    setAttachments([])

    let assistant = ''
    let pendingSources = []
    setMessages((prev) => [...prev, { role: 'assistant', content: '', sources: [] }])

    const ac = new AbortController()
    abortRef.current = ac
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      ac.abort()
    }, 180000)

    try {
      await streamConsultChat({
        token,
        message: text,
        lang,
        sessionId,
        entry,
        usePubmed: isProfessional && usePubmed,
        useCochrane: isProfessional && useCochrane,
        useEuropePmc: isProfessional && useEuropePmc,
        profile,
        attachments: toApiAttachments(pending),
        signal: ac.signal,
        onMeta: (meta) => {
          if (meta.sessionId) {
            skipReloadRef.current = true
            sessionRef.current = meta.sessionId
            setSessionId(meta.sessionId)
            onSessionChange?.(meta.sessionId)
          }
          const list = []
          if (Array.isArray(meta.sources)) {
            for (const s of meta.sources) {
              list.push({
                kind: s.kind || 'kb',
                title: s.title || s.source || s.book || '',
                source: s.source || s.title || s.book || '',
                book: s.book || '',
                url: s.url || '',
                score: s.score,
                text: s.text || '',
                chapter: s.chapter,
                page: s.page,
              })
            }
          }
          if (Array.isArray(meta.pubmed)) {
            for (const p of meta.pubmed) list.push(litItem(p, 'pubmed'))
          }
          if (Array.isArray(meta.cochrane)) {
            for (const p of meta.cochrane) list.push(litItem(p, 'cochrane'))
          }
          if (Array.isArray(meta.europepmc)) {
            for (const p of meta.europepmc) list.push(litItem(p, 'europepmc'))
          }
          pendingSources = list
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'assistant') {
              next[next.length - 1] = {
                ...last,
                ragError: meta.rag?.error || '',
              }
            }
            return next
          })
          if (meta.blocked && meta.reason) {
            setError(copy.blocked || meta.reason)
          }
        },
        onDelta: (chunk) => {
          assistant += chunk
          const snapshot = stripBibliographySection(assistant)
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'assistant') {
              next[next.length - 1] = { ...last, content: snapshot }
            }
            return next
          })
        },
        onDone: (data) => {
          onSessionTouched?.()
          if (data?.quota) onQuota?.(data.quota)
          const cleaned = stripBibliographySection(assistant)
          const chips = Array.isArray(data?.followups) && data.followups.length
            ? normalizeFollowups(data.followups)
            : parseFollowups(assistant)
          assistant = cleaned
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'assistant') {
              next[next.length - 1] = {
                ...last,
                content: cleaned,
                sources: pendingSources,
                id: data?.messageId || last.id,
                followups: chips,
              }
            }
            return next
          })
        },
        onError: (err) => {
          setError(displayStreamError(err, copy))
          if (err?.quota) onQuota?.(err.quota)
        },
      })
    } catch (err) {
      if (timedOut) {
        setError(copy.timeout || copy.sendFail)
        if (!assistant) {
          setMessages((prev) => {
            const next = [...prev]
            if (next[next.length - 1]?.role === 'assistant' && !next[next.length - 1].content) {
              next.pop()
            }
            return next
          })
        }
      } else if (err?.name === 'AbortError') {
        onSessionTouched?.()
        if (!assistant) {
          setMessages((prev) => {
            const next = [...prev]
            if (next[next.length - 1]?.role === 'assistant' && !next[next.length - 1].content) {
              next.pop()
            }
            return next
          })
        } else if (pendingSources.length) {
          const cleaned = stripBibliographySection(assistant)
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'assistant') {
              next[next.length - 1] = { ...last, content: cleaned, sources: pendingSources }
            }
            return next
          })
        }
      } else {
        setError(displayStreamError(err, copy))
        if (!assistant) {
          setMessages((prev) => {
            const next = [...prev]
            if (next[next.length - 1]?.role === 'assistant' && !next[next.length - 1].content) {
              next.pop()
            }
            return next
          })
        }
      }
    } finally {
      clearTimeout(timer)
      setSending(false)
      abortRef.current = null
    }
  }

  useEffect(() => {
    if (bootRef.current) return
    if (sessionIdProp) return
    const q = String(initialQuery || '').trim()
    if (!q || !token) return
    bootRef.current = true
    sendMessage(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, initialQuery, sessionIdProp])

  function onSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function stopGeneration() {
    abortRef.current?.abort()
  }

  async function onPickFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length || sending || attaching) return
    setAttaching(true)
    setError('')
    try {
      const next = [...attachments]
      let limitHit = false
      for (const file of files) {
        try {
          const item = await fileToAttachment(file, copy)
          if (!canAddAttachment(next, item)) {
            limitHit = true
            break
          }
          next.push(item)
        } catch (err) {
          setError(err?.message || copy.attachUnsupported || copy.sendFail)
          if (next.length > attachments.length) setAttachments(next)
          return
        }
      }
      setAttachments(next)
      if (limitHit) setError(copy.attachLimit || '')
    } catch (err) {
      setError(err?.message || copy.attachUnsupported || copy.sendFail)
    } finally {
      setAttaching(false)
    }
  }

  function appendTranscript(text) {
    const next = String(text || '').trim()
    if (!next) return
    setInput((prev) => `${prev}${prev && !/[ \n]$/.test(prev) ? ' ' : ''}${next}`)
  }

  function micErrorMessage(err) {
    const name = err?.name || ''
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return copy.speechDenied || copy.speechFail
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return copy.speechNoMic || copy.speechFail
    }
    if (name === 'NotReadableError' || name === 'AbortError') {
      return copy.speechBusy || copy.speechFail
    }
    return copy.speechFail || copy.sendFail
  }

  async function finishRecording(blob, mime) {
    setListening(false)
    releaseMic()
    if (!blob || blob.size < 1200) {
      voiceBusyRef.current = false
      setError(copy.speechEmpty || copy.speechFail)
      return
    }
    setTranscribing(true)
    setError('')
    try {
      const audio = await blobToBase64(blob)
      const data = await transcribeConsultAudio(token, {
        audio,
        mediaType: recorderMediaType(mime || blob.type),
        lang,
      })
      if (data?.quota) onQuota?.(data.quota)
      if (!String(data?.text || '').trim()) {
        setError(copy.speechEmpty || copy.speechFail)
        return
      }
      appendTranscript(data.text)
    } catch (err) {
      if (err?.code === 'QUOTA_EXCEEDED') {
        onQuota?.(err.quota)
        setError(copy.quotaExceeded || copy.speechFail)
      } else {
        setError(err?.message || copy.speechFail || copy.sendFail)
      }
    } finally {
      setTranscribing(false)
      voiceBusyRef.current = false
    }
  }

  async function toggleVoice() {
    if (sending || attaching || transcribing || !token || voiceBusyRef.current) return
    if (!canSpeech) {
      setError(copy.speechUnsupported || copy.speechFail)
      return
    }
    if (listening) {
      voiceBusyRef.current = true
      window.clearTimeout(voiceTimerRef.current)
      try { recRef.current?.stop() } catch { /* noop */ }
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = pickRecorderMime()
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
      chunksRef.current = []
      streamRef.current = stream
      recRef.current = rec
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size) chunksRef.current.push(ev.data)
      }
      rec.onerror = () => {
        setListening(false)
        releaseMic()
        voiceBusyRef.current = false
        setError(copy.speechFail || copy.sendFail)
      }
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || mime || 'audio/webm' })
        chunksRef.current = []
        finishRecording(blob, rec.mimeType || mime)
      }
      try {
        rec.start(250)
      } catch {
        rec.start()
      }
      setListening(true)
      setError('')
      voiceTimerRef.current = window.setTimeout(() => {
        try { rec.stop() } catch { /* noop */ }
      }, 45000)
    } catch (err) {
      releaseMic()
      setListening(false)
      setError(micErrorMessage(err))
    }
  }

  async function downvote(messageId, reason) {
    if (!token || !messageId) return
    const sid = sessionRef.current || sessionId
    if (!sid) return
    try {
      await submitConsultFeedback(token, { sessionId: sid, messageId, reason: reason || '' })
      setMessages((prev) => prev.map((row) => (
        row.id === messageId ? { ...row, downvoted: true } : row
      )))
    } catch (err) {
      if (err?.message && /Already reported|ALREADY_REPORTED|409/.test(err.message)) {
        setMessages((prev) => prev.map((row) => (
          row.id === messageId ? { ...row, downvoted: true } : row
        )))
        return
      }
      setError(err?.message || copy.downvoteFail || copy.sendFail)
    }
  }

  const lastUser = sending && messages.length >= 2 ? messages[messages.length - 2] : null
  const typingText = lastUser?.attachments?.length
    ? (copy.thinkingUpload || copy.thinking)
    : (isProfessional && (usePubmed || useCochrane || useEuropePmc)
      ? (copy.thinkingPubmed || copy.thinking)
      : copy.thinking)
  const quotaBlocked = !quotaUnlimited && quotaRemaining === 0
  const canSend = !sending && !attaching && !loadingHistory && Boolean(token)
    && (Boolean(input.trim()) || attachments.length > 0)
    && !quotaBlocked

  return (
    <div className="chat-window" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="chat-messages" role="log" aria-live="polite">
        {loadingHistory ? (
          <p className="chat-empty">{copy.historyLoading || '…'}</p>
        ) : messages.length === 0 && !sending ? (
          <p className="chat-empty">
            {entry === 'professional'
              ? (copy.emptyProfessional || copy.empty)
              : (copy.emptyGeneral || copy.empty)}
          </p>
        ) : null}
        {loadingHistory ? null : messages.map((m, i) => (
          <MessageBubble
            key={`${m.role}-${i}`}
            role={m.role}
            content={m.content}
            attachments={m.attachments}
            sources={sending && i === messages.length - 1 ? [] : (m.sources || [])}
            rtl={rtl}
            sourcesLabel={copy.sources}
            sourcesEmpty={
              i === messages.length - 1
                ? (sending
                  ? ''
                  : m.ragError
                    ? (copy.sourcesError || copy.sourcesEmpty)
                    : copy.sourcesEmpty)
                : ''
            }
            exportable={m.role === 'assistant' && Boolean(m.content) && !(sending && i === messages.length - 1)}
            downloadLabel={copy.downloadWord}
            downloadBusy={copy.downloadBusy}
            downloadFail={copy.downloadFail}
            disclaimer={copy.disclaimer}
            docTitle={copy.docTitle}
            docFooter={copy.docFooter}
            sourcesHeading={copy.sources}
            followups={
              m.role === 'assistant' && !(sending && i === messages.length - 1)
                ? (m.followups || [])
                : []
            }
            followupsLabel={copy.followups}
            followupCatLabels={copy.followupCats}
            onFollowup={(q) => sendMessage(q)}
            filePrefix={copy.filePrefix}
            messageId={m.id}
            downvoted={Boolean(m.downvoted)}
            canDownvote={m.role === 'assistant' && Boolean(m.id) && Boolean(m.content) && !(sending && i === messages.length - 1)}
            onDownvote={downvote}
            downvoteCopy={{
              down: copy.downvote,
              done: copy.downvoteDone,
              pick: copy.downvotePick,
              skip: copy.downvoteSkip,
              off_topic: copy.downvoteOffTopic,
              no_source: copy.downvoteNoSource,
              too_long: copy.downvoteTooLong,
              unclear: copy.downvoteUnclear,
              other: copy.downvoteOther,
            }}
          />
        ))}
        {sending ? (
          <p className="chat-typing">{typingText}</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {error ? <p className="chat-error" role="alert">{error}</p> : null}

      <form className="chat-composer" onSubmit={onSubmit}>
        {isProfessional ? (
        <div className="chat-toggles">
          <label className={`chat-toggle ${usePubmed ? 'is-on' : ''}`}>
            <input
              type="checkbox"
              checked={usePubmed}
              disabled={sending}
              onChange={(e) => setUsePubmed(e.target.checked)}
              aria-label={copy.pubmed || 'PubMed'}
            />
            <span className="chat-toggle-track" aria-hidden="true" />
            <span className="chat-toggle-text">
              <strong>{copy.pubmed || 'PubMed'}</strong>
              {copy.pubmedHint ? <small>{copy.pubmedHint}</small> : null}
            </span>
          </label>
          <label className={`chat-toggle ${useCochrane ? 'is-on' : ''}`}>
            <input
              type="checkbox"
              checked={useCochrane}
              disabled={sending}
              onChange={(e) => setUseCochrane(e.target.checked)}
              aria-label={copy.cochrane || 'Cochrane'}
            />
            <span className="chat-toggle-track" aria-hidden="true" />
            <span className="chat-toggle-text">
              <strong>{copy.cochrane || 'Cochrane'}</strong>
              {copy.cochraneHint ? <small>{copy.cochraneHint}</small> : null}
            </span>
          </label>
          <label className={`chat-toggle ${useEuropePmc ? 'is-on' : ''}`}>
            <input
              type="checkbox"
              checked={useEuropePmc}
              disabled={sending}
              onChange={(e) => setUseEuropePmc(e.target.checked)}
              aria-label={copy.europepmc || 'Europe PMC'}
            />
            <span className="chat-toggle-track" aria-hidden="true" />
            <span className="chat-toggle-text">
              <strong>{copy.europepmc || 'Europe PMC'}</strong>
              {copy.europepmcHint ? <small>{copy.europepmcHint}</small> : null}
            </span>
          </label>
        </div>
        ) : null}
        {attachments.length ? (
          <ul className="chat-attach-list">
            {attachments.map((a, i) => (
              <li key={`${a.name}-${i}`} className="chat-attach-chip">
                {a.preview ? <img src={a.preview} alt="" /> : null}
                <span>{a.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                  disabled={sending || attaching}
                  aria-label={copy.attachRemove || 'remove'}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="chat-attach-hint">{quotaBlocked ? (copy.quotaExceeded || copy.attachHint) : copy.attachHint}</p>
        <div className="chat-compose-row">
          <input
            ref={fileRef}
            type="file"
            hidden
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif,.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={onPickFiles}
          />
          <button
            type="button"
            className="chat-tool-btn"
            disabled={sending || attaching || !token || loadingHistory || quotaBlocked}
            onClick={() => fileRef.current?.click()}
          >
            {attaching ? '…' : (copy.attach || '上传')}
          </button>
          <button
            type="button"
            className={`chat-tool-btn ${listening ? 'is-on' : ''}`}
            disabled={sending || attaching || transcribing || !token || loadingHistory || quotaBlocked}
            onClick={toggleVoice}
            title={copy.speechHint || copy.speechUnsupported || ''}
            aria-label={copy.speechHint || copy.speech || 'voice'}
          >
            {transcribing
              ? (copy.speechTranscribing || '…')
              : listening
                ? (copy.speechListening || '…')
                : (copy.speech || '语音')}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copy.placeholder}
            rows={2}
            disabled={sending || !token || loadingHistory || quotaBlocked}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
          />
          {sending ? (
            <button type="button" className="btn-stop" onClick={stopGeneration}>
              {copy.stop || copy.sending}
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={!canSend}>
              {copy.send}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
