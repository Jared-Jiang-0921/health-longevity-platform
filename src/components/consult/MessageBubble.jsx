import { useEffect, useRef, useState } from 'react'
import SourceCard from './SourceCard'
import MessageMarkdown from './MessageMarkdown'
import { stripBibliographySection } from '../../lib/consultText'

export default function MessageBubble({
  role,
  content,
  attachments,
  sources,
  rtl,
  sourcesLabel,
  sourcesEmpty,
  exportable,
  downloadLabel,
  downloadBusy,
  downloadFail,
  disclaimer,
  docTitle,
  docFooter,
  sourcesHeading,
  filePrefix,
  messageId,
  followups,
  followupsLabel,
  followupCatLabels,
  onFollowup,
  downvoted,
  canDownvote,
  onDownvote,
  downvoteCopy,
}) {
  const [openCite, setOpenCite] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [pickingDown, setPickingDown] = useState(false)
  const [savingDown, setSavingDown] = useState(false)
  const cardRef = useRef(null)
  const isUser = role === 'user'
  const list = Array.isArray(sources) ? sources : []
  const body = isUser ? content : stripBibliographySection(content)

  useEffect(() => {
    if (openCite) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [openCite])

  async function onDownload() {
    if (!body || exporting) return
    setExporting(true)
    setExportError('')
    try {
      const { downloadConsultDocx } = await import('../../lib/consultDocx')
      await downloadConsultDocx({
        markdown: body,
        sources: list,
        disclaimer,
        title: docTitle || 'AI 健康咨询',
        sourcesHeading,
        footer: docFooter,
        filePrefix,
      })
    } catch (err) {
      setExportError(downloadFail || err?.message || '导出失败')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={`msg-row ${isUser ? 'msg-row--user' : 'msg-row--assistant'}`} dir={rtl ? 'rtl' : 'ltr'}>
      <div className={`msg-bubble ${isUser ? 'msg-bubble--user' : 'msg-bubble--assistant'}`}>
        {isUser ? (
          <>
            {Array.isArray(attachments) && attachments.length ? (
              <ul className="msg-attach-preview">
                {attachments.map((a, i) => (
                  <li key={`${a.name || 'file'}-${i}`}>
                    {a.preview ? <img src={a.preview} alt="" /> : <span>{a.name || 'file'}</span>}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="msg-bubble-text">{content}</div>
          </>
        ) : (
          <MessageMarkdown
            content={body}
            sources={list}
            onCite={(n, src) => setOpenCite({ n, src })}
          />
        )}
        {!isUser && list.length > 0 ? (
          <div className="msg-sources" aria-label={sourcesLabel || 'sources'}>
            <span className="msg-sources-label">{sourcesLabel || '参考资料'}</span>
            {list.map((s, i) => (
              <button
                key={`${s.title || s.source || s.book || 'src'}-${i}`}
                type="button"
                className="msg-source-chip"
                onClick={() => setOpenCite({ n: i + 1, src: s })}
                title={s.text ? String(s.text).slice(0, 120) : ''}
              >
                [{i + 1}] {s.kind === 'cochrane' ? 'Cochrane · ' : s.kind === 'europepmc' ? 'PMC · ' : s.kind === 'pubmed' ? 'PubMed · ' : s.kind === 'kb' ? '知识库 · ' : ''}{s.title || s.source || s.book || `来源 ${i + 1}`}
              </button>
            ))}
          </div>
        ) : null}
        {!isUser && list.length === 0 && body && sourcesEmpty ? (
          <p className="msg-sources-empty">{sourcesEmpty}</p>
        ) : null}
        {!isUser && Array.isArray(followups) && followups.length && onFollowup ? (
          <div className="msg-followups" aria-label={followupsLabel || 'follow-ups'}>
            {followupsLabel ? <span className="msg-followups-label">{followupsLabel}</span> : null}
            {followups.map((item) => {
              const text = typeof item === 'string' ? item : item.text
              const key = typeof item === 'string' ? 'related' : (item.key || 'related')
              const cat = followupCatLabels?.[key]
              if (!text) return null
              return (
                <button
                  key={`${key}-${text}`}
                  type="button"
                  className={`msg-followup-chip msg-followup-chip--${key}`}
                  onClick={() => onFollowup(text)}
                >
                  {cat ? <span className="msg-followup-cat">{cat}</span> : null}
                  <span className="msg-followup-text">{text}</span>
                </button>
              )
            })}
          </div>
        ) : null}
        {!isUser && openCite ? (
          <div ref={cardRef}>
            <SourceCard
              source={openCite.src}
              index={openCite.n}
              onClose={() => setOpenCite(null)}
            />
          </div>
        ) : null}
        {!isUser && exportable && body ? (
          <div className="msg-export">
            <button type="button" className="msg-export-btn" onClick={onDownload} disabled={exporting}>
              {exporting ? (downloadBusy || '正在生成…') : (downloadLabel || '下载 Word / WPS')}
            </button>
            {canDownvote ? (
              downvoted ? (
                <span className="msg-downvote-done">{downvoteCopy?.done || '已记录'}</span>
              ) : pickingDown ? (
                <span className="msg-downvote-reasons">
                  <span className="msg-downvote-pick">{downvoteCopy?.pick || ''}</span>
                  {['off_topic', 'no_source', 'too_long', 'unclear', 'other'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="msg-export-btn"
                      disabled={savingDown}
                      onClick={async () => {
                        setSavingDown(true)
                        try {
                          await onDownvote?.(messageId, key)
                        } finally {
                          setSavingDown(false)
                          setPickingDown(false)
                        }
                      }}
                    >
                      {downvoteCopy?.[key] || key}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="msg-export-btn"
                    disabled={savingDown}
                    onClick={async () => {
                      setSavingDown(true)
                      try {
                        await onDownvote?.(messageId, '')
                      } finally {
                        setSavingDown(false)
                        setPickingDown(false)
                      }
                    }}
                  >
                    {downvoteCopy?.skip || '不选原因'}
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="msg-export-btn"
                  onClick={() => setPickingDown(true)}
                >
                  {downvoteCopy?.down || '没用'}
                </button>
              )
            ) : null}
            {exportError ? <span className="msg-export-error">{exportError}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
