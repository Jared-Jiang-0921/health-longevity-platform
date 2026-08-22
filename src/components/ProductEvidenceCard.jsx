import './ProductEvidenceCard.css'

const VERDICT_LABEL = {
  violation: '违规话术',
  warning: '夸大 / 超范围',
  caution: '需人工核对',
  pass: '未检出违规',
}

/** 只负责展示核验结果。表单在 ProductEvidenceWorkbench。 */
export default function ProductEvidenceCard({
  payload,
  loading = false,
  error = '',
  showHead = true,
}) {
  const card = payload?.card || {}
  const v = card.verification
  const official = card.official
  const claim = card.claim_check
  const status = v?.status || ''
  const functions = official?.functions || []
  const overreach = claim?.overreach || []
  const hasResult = Boolean(payload && !loading && !error)

  return (
    <section className="product-evidence-card" aria-label="监管核验证据卡">
      {showHead ? (
        <header className="product-evidence-card-head">
          <h2>核验结果</h2>
          <p>文号真伪、官方保健功能、不适宜人群、声称是否超范围。数据来自官方公开库，不做疗效承诺。</p>
        </header>
      ) : null}

      {loading ? <p className="product-evidence-card-muted">正在向官方库核验…（可能需要数秒）</p> : null}
      {error ? <p className="product-evidence-card-error">{error}</p> : null}

      {hasResult ? (
        <>
          <div className="product-evidence-card-meta">
            <span className="product-evidence-card-pill">{card.channel_label || '未分渠道'}</span>
            {payload.origin_region ? (
              <span className="product-evidence-card-pill">辖区 {payload.origin_region}</span>
            ) : null}
            {payload.approval_no ? (
              <span className="product-evidence-card-pill">{payload.approval_no}</span>
            ) : (
              <span className="product-evidence-card-pill">未填文号</span>
            )}
          </div>

          {v ? (
            <div className={`product-evidence-status is-${status || 'skipped'}`}>
              <strong>{v.status_label || status || '未核验'}</strong>
              <p>{v.detail}</p>
              {v.official_portal ? (
                <a href={v.official_portal} target="_blank" rel="noreferrer">
                  打开官方公示入口
                </a>
              ) : null}
            </div>
          ) : null}

          {official ? (
            <div className="product-evidence-block">
              <h3>官方登记信息</h3>
              {official.name ? <p><strong>对应产品：</strong>{official.name}</p> : null}
              {official.enterprise ? <p><strong>申报企业：</strong>{official.enterprise}</p> : null}
              {official.kind ? <p><strong>类型：</strong>{official.kind}</p> : null}
              {functions.length ? (
                <p><strong>保健功能：</strong>{functions.join('；')}</p>
              ) : official.functions_raw ? (
                <p><strong>保健功能：</strong>{official.functions_raw}</p>
              ) : (
                <p className="product-evidence-card-muted">官方未返回保健功能字段</p>
              )}
              {official.suitable_for ? (
                <p><strong>适宜人群：</strong>{official.suitable_for}</p>
              ) : null}
              {official.unsuitable_for ? (
                <p className="product-evidence-unsuitable">
                  <strong>不适宜人群：</strong>{official.unsuitable_for}
                </p>
              ) : null}
            </div>
          ) : null}

          {claim ? (
            <div className={`product-evidence-claim is-${claim.verdict || 'caution'}`}>
              <h3>声称检测：{VERDICT_LABEL[claim.verdict] || claim.verdict}</h3>
              {claim.baseline_source === 'samr_official' ? (
                <p className="product-evidence-card-muted">比对基准：总局返回的批准功能（非演示词库）</p>
              ) : null}
              {overreach.length ? (
                <p><strong>超出批准范围：</strong>{overreach.join('、')}</p>
              ) : null}
              {claim.in_scope?.length ? (
                <p><strong>在批准范围内：</strong>{claim.in_scope.join('、')}</p>
              ) : null}
              {claim.findings?.length ? (
                <ul>
                  {claim.findings.slice(0, 4).map((f, i) => (
                    <li key={`${f.term}-${i}`}>{f.term} · {f.note || f.category}</li>
                  ))}
                </ul>
              ) : null}
              {claim.advice ? <p>{claim.advice}</p> : null}
            </div>
          ) : null}

          {card.disclaimer ? (
            <p className="product-evidence-disclaimer">{card.disclaimer}</p>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
