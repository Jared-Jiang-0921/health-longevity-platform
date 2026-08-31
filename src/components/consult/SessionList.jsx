import { useRef, useState } from 'react'

function formatWhen(iso, lang) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const loc = lang === 'ar' ? 'ar' : lang === 'en' ? 'en-US' : 'zh-CN'
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) {
    return d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString(loc, { month: 'short', day: 'numeric' })
}

export default function SessionList({
  sessions,
  activeId,
  loading,
  error,
  lang,
  copy,
  onOpen,
  onNew,
  onClear,
  onDelete,
  onRename,
  clearing,
}) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  const skipBlurRef = useRef(false)
  const canClear = Boolean(onClear) && sessions.length > 0 && !loading && !error

  function displayTitle(row) {
    return String(row.title || row.preview || copy.untitled).trim()
  }

  function startRename(row) {
    skipBlurRef.current = false
    setEditingId(row.id)
    setDraft(displayTitle(row).slice(0, 40))
  }

  function cancelRename() {
    skipBlurRef.current = true
    setEditingId(null)
    setDraft('')
  }

  async function commitRename(row) {
    const next = String(draft || '').trim().slice(0, 40)
    if (!next || next === displayTitle(row)) {
      cancelRename()
      return
    }
    try {
      await onRename(row, next)
      setEditingId(null)
      setDraft('')
    } catch {
      skipBlurRef.current = false
    }
  }

  return (
    <section className="consult-sessions" aria-label={copy.sessions || 'sessions'}>
      <div className="consult-sessions-head">
        <h2>{copy.sessions}</h2>
        <div className="consult-sessions-actions">
          {canClear ? (
            <button
              type="button"
              className="consult-clear-chats"
              onClick={onClear}
              disabled={clearing}
            >
              {clearing ? copy.clearing : copy.clearAll}
            </button>
          ) : null}
          <button type="button" className="consult-new-chat" onClick={onNew}>
            {copy.newChat}
          </button>
        </div>
      </div>
      {copy.retentionNote ? (
        <p className="consult-sessions-note">{copy.retentionNote}</p>
      ) : null}
      {loading ? (
        <p className="consult-sessions-empty">{copy.sessionsLoading}</p>
      ) : error ? (
        <p className="consult-sessions-empty">
          {copy.sessionsError}
          {typeof error === 'string' && error ? `（${error}）` : ''}
        </p>
      ) : sessions.length === 0 ? (
        <p className="consult-sessions-empty">{copy.sessionsEmpty}</p>
      ) : (
        <ul className="consult-session-list">
          {sessions.map((row) => {
            const title = displayTitle(row)
            const active = row.id === activeId
            const editing = editingId === row.id
            return (
              <li key={row.id} className="consult-session-row">
                {editing ? (
                  <form
                    className="consult-session-rename-form"
                    onSubmit={(e) => {
                      e.preventDefault()
                      commitRename(row)
                    }}
                  >
                    <input
                      value={draft}
                      maxLength={40}
                      autoFocus
                      aria-label={copy.renameSession || 'rename'}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => {
                        if (skipBlurRef.current) {
                          skipBlurRef.current = false
                          return
                        }
                        commitRename(row)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          cancelRename()
                        }
                      }}
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    className={active ? 'is-active' : ''}
                    onClick={() => onOpen(row)}
                  >
                    <span className="consult-session-title">{title}</span>
                    <span className="consult-session-meta">
                      {formatWhen(row.updated_at || row.created_at, lang)}
                    </span>
                  </button>
                )}
                {onRename ? (
                  <button
                    type="button"
                    className="consult-session-rename"
                    onMouseDown={() => { skipBlurRef.current = true }}
                    onClick={() => (editing ? commitRename(row) : startRename(row))}
                    aria-label={copy.renameSession || 'rename'}
                    title={copy.renameSession || 'rename'}
                  >
                    ✎
                  </button>
                ) : null}
                {onDelete ? (
                  <button
                    type="button"
                    className="consult-session-delete"
                    onClick={() => onDelete(row)}
                    aria-label={copy.deleteSession || 'delete'}
                  >
                    ×
                  </button>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
