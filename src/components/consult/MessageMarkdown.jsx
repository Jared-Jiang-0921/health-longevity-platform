import { Children, Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const CITE_SPLIT = /(\[(?:来源\s*|source\s*|源|مصدر\s*|P)?\d+\])/i
const CITE_ONE = /^\[(?:来源\s*|source\s*|源|مصدر\s*|P)?(\d+)\]$/i

export function renderWithCitations(text, sources, onCite) {
  if (!text) return null
  if (!sources?.length) return text
  const parts = String(text).split(CITE_SPLIT)
  return parts.map((part, i) => {
    const m = part.match(CITE_ONE)
    if (!m) return <span key={i}>{part}</span>
    const n = Number(m[1])
    const src = sources[n - 1]
    if (!src) return <span key={i}>{part}</span>
    return (
      <button
        key={i}
        type="button"
        className="cite-sup"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onCite?.(n, src)
        }}
        title={src.title || src.source || src.book || `来源 ${n}`}
      >
        [{n}]
      </button>
    )
  })
}

function citeChildren(children, sources, onCite) {
  return Children.toArray(children).map((child, i) => {
    if (typeof child === 'string') {
      return <Fragment key={i}>{renderWithCitations(child, sources, onCite)}</Fragment>
    }
    return child
  })
}

function textNode(Tag, sources, onCite) {
  return function MarkdownText({ children, ...props }) {
    return <Tag {...props}>{citeChildren(children, sources, onCite)}</Tag>
  }
}

export default function MessageMarkdown({ content, sources, onCite }) {
  const list = Array.isArray(sources) ? sources : []
  const text = textNode

  return (
    <div className="msg-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: text('h3', list, onCite),
          h2: text('h3', list, onCite),
          h3: text('h4', list, onCite),
          h4: text('h4', list, onCite),
          p: text('p', list, onCite),
          li: text('li', list, onCite),
          td: text('td', list, onCite),
          th: text('th', list, onCite),
          strong: text('strong', list, onCite),
          em: text('em', list, onCite),
          blockquote: text('blockquote', list, onCite),
          a: ({ href, children }) => {
            const url = String(href || '')
            if (!/^https?:\/\//i.test(url)) return <span>{citeChildren(children, list, onCite)}</span>
            return (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {citeChildren(children, list, onCite)}
              </a>
            )
          },
          img: () => null,
          table: ({ children }) => (
            <div className="msg-md-table-wrap">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  )
}
