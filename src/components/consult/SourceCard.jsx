export default function SourceCard({ source, index, onClose }) {
  const title = source?.title || source?.source || source?.book || `来源 ${index}`
  const kindLabel = {
    pubmed: 'PubMed',
    cochrane: 'Cochrane',
    europepmc: 'Europe PMC',
    kb: '本地知识库',
  }[source?.kind]
  const meta = [kindLabel, source?.chapter, source?.page ? `p.${source.page}` : null, source?.journal, source?.pubdate]
    .filter(Boolean)
    .join(' · ')
  const pmid = source?.pmid || source?.PMID
  const url = source?.url || (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : '')
  const excerpt = source?.text ? String(source.text).slice(0, 400) : ''

  return (
    <aside className="source-card" role="dialog" aria-label={title}>
      <div className="source-card-head">
        <strong>[{index}] {title}</strong>
        {onClose ? (
          <button type="button" className="source-card-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        ) : null}
      </div>
      {meta ? <p className="source-card-meta">{meta}</p> : null}
      {excerpt ? (
        <p className="source-card-excerpt">{excerpt}</p>
      ) : pmid ? (
        <p className="source-card-excerpt">
          {[source?.journal, source?.pubdate].filter(Boolean).join(' · ') || 'PubMed'}
        </p>
      ) : (
        <p className="source-card-excerpt">暂无对应摘录。该编号可能是模型自行标注，而非知识库条目。</p>
      )}
      {pmid ? <p className="source-card-meta">PMID: {pmid}</p> : null}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="source-card-link">
          打开原文
        </a>
      ) : null}
    </aside>
  )
}
