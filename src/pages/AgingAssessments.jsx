import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { AGING_ASSESSMENT_COPY, AGING_TOOLS } from '../data/agingAssessmentCopy'
import { computeAgingAssessment } from '../lib/agingClocks/index'
import { fetchAgingAssessments, saveAgingAssessment } from '../lib/agingAssessmentsApi'
import './RiskAssessments.css'
import './AgingAssessments.css'

const EMPTY_SHARED = {
  sex: '',
  chronologicalAge: '',
  sampleType: 'blood',
  arrayType: 'unknown',
  labName: '',
  reportDate: '',
}

const YEAR_TOOLS = ['horvath', 'icas', 'grimage2']

function SectionHead({ badge, title, lead, variant = 'common' }) {
  return (
    <div className={`risk-section-head risk-section-head--${variant}`}>
      <p className="risk-section-badge">{badge}</p>
      <h2>{title}</h2>
      <p className="risk-muted">{lead}</p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  )
}

function ResultBox({ title, t, result, extra }) {
  if (!result) {
    return (
      <section className="risk-result">
        <h2>{title}</h2>
        <p className="risk-muted">{t.incomplete}</p>
      </section>
    )
  }
  if (!result.ok) {
    return (
      <section className="risk-result">
        <h2>{title}</h2>
        <p className="risk-muted">{result.error}</p>
      </section>
    )
  }
  return (
    <section className="risk-result">
      <h2>{title}</h2>
      {extra}
      {result.band?.adviseClinician ? <p className="risk-muted">{t.seeDoctor}</p> : null}
      <p className="risk-muted">{result.disclaimer}</p>
    </section>
  )
}

function hydrateShared(latest) {
  const next = { ...EMPTY_SHARED }
  for (const kind of AGING_TOOLS) {
    const input = latest?.[kind]?.input
    if (!input) continue
    if (!next.sex && (input.sex === 'male' || input.sex === 'female')) next.sex = input.sex
    if (!next.chronologicalAge && input.chronologicalAge != null && input.chronologicalAge !== '') {
      next.chronologicalAge = String(input.chronologicalAge)
    }
    if (input.sampleType) next.sampleType = input.sampleType
    if (input.arrayType) next.arrayType = input.arrayType
    if (input.labName && !next.labName) next.labName = input.labName
    if (input.reportDate && !next.reportDate) next.reportDate = input.reportDate
  }
  return next
}

export default function AgingAssessments() {
  const { lang } = useLocale()
  const t = AGING_ASSESSMENT_COPY[lang] || AGING_ASSESSMENT_COPY.zh
  const { user, loading, getToken } = useAuth()
  const [params, setParams] = useSearchParams()
  const tool = AGING_TOOLS.includes(params.get('tool')) ? params.get('tool') : 'horvath'
  const [shared, setShared] = useState(EMPTY_SHARED)
  const [clockAge, setClockAge] = useState({ horvath: '', icas: '', grimage2: '' })
  const [pace, setPace] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loadState, setLoadState] = useState('idle')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loggedIn = Boolean(user && getToken())

  useEffect(() => {
    if (!loggedIn) return
    let cancelled = false
    setLoadState('loading')
    fetchAgingAssessments(getToken())
      .then((data) => {
        if (cancelled) return
        const latest = data.latest || {}
        setShared(hydrateShared(latest))
        setClockAge({
          horvath: latest.horvath?.input?.clockAge != null ? String(latest.horvath.input.clockAge) : '',
          icas: latest.icas?.input?.clockAge != null ? String(latest.icas.input.clockAge) : '',
          grimage2: latest.grimage2?.input?.clockAge != null ? String(latest.grimage2.input.clockAge) : '',
        })
        setPace(latest.dunedinpace?.input?.pace != null ? String(latest.dunedinpace.input.pace) : '')
        setLoadState('ready')
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || t.loadFail)
          setLoadState('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [loggedIn, getToken])

  const inputByKind = useMemo(() => {
    const base = {
      sex: shared.sex,
      chronologicalAge: shared.chronologicalAge,
      sampleType: shared.sampleType,
      arrayType: shared.arrayType,
      labName: shared.labName,
      reportDate: shared.reportDate,
    }
    return {
      horvath: { ...base, clockAge: clockAge.horvath },
      icas: { ...base, clockAge: clockAge.icas },
      grimage2: { ...base, clockAge: clockAge.grimage2 },
      dunedinpace: { ...base, pace },
    }
  }, [shared, clockAge, pace])

  const results = useMemo(() => ({
    horvath: computeAgingAssessment('horvath', inputByKind.horvath),
    icas: computeAgingAssessment('icas', inputByKind.icas),
    grimage2: computeAgingAssessment('grimage2', inputByKind.grimage2),
    dunedinpace: computeAgingAssessment('dunedinpace', inputByKind.dunedinpace),
  }), [inputByKind])

  const currentResult = results[tool]
  const extraCopy = t.extras[tool]

  const setTool = (next) => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('tool', next)
    setParams(nextParams, { replace: true })
    setError('')
    setMessage('')
  }

  const patchShared = (patch) => setShared((prev) => ({ ...prev, ...patch }))

  const save = async () => {
    setError('')
    setMessage('')
    setBusy(true)
    try {
      await saveAgingAssessment(getToken(), {
        kind: tool,
        input: inputByKind[tool],
        consentHealthData: consent,
      })
      setMessage(t.saved)
    } catch (err) {
      setError(err.message || t.saveFail)
    } finally {
      setBusy(false)
    }
  }

  if (loading || (loggedIn && loadState === 'loading')) {
    return (
      <div className="page-content risk-page">
        <p className="risk-muted">{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content risk-page">
        <h1>{t.title}</h1>
        <p>{t.loginFirst}</p>
        <p>
          <Link to="/login" className="btn-primary">{t.login}</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page-content risk-page aging-page">
      <div className="risk-page-header page-header">
        <div>
          <h1>{t.title}</h1>
          <p className="risk-page-lead">{t.lead}</p>
        </div>
        <Link to="/solutions" className="btn-secondary">{t.back}</Link>
      </div>

      <aside className="risk-notice page-callout page-callout--warn" role="note">
        <h2>{t.noticeTitle}</h2>
        <p>{t.notice}</p>
        <p>
          <Link to={`/legal/health-data?lang=${lang}`}>{t.legal}</Link>
        </p>
      </aside>

      {message ? (
        <div className="risk-status risk-status--ok" role="status">
          <p>{message}</p>
        </div>
      ) : null}
      {error ? (
        <div className="risk-status risk-status--error" role="alert">
          <p>{error}</p>
        </div>
      ) : null}

      <aside className="risk-guide" aria-labelledby="aging-guide-heading">
        <h2 id="aging-guide-heading">{t.guideTitle}</h2>
        <ul>
          <li>
            <span className="risk-section-badge risk-section-badge--common">{t.commonTag}</span>
            {t.guideCommon}
          </li>
          <li>
            <span className="risk-section-badge risk-section-badge--specific">{t.specificTag}</span>
            {t.guideSpecific}
          </li>
        </ul>
      </aside>

      <section className="risk-form risk-form--common">
        <SectionHead badge={t.commonTag} title={t.sharedTitle} lead={t.sharedLead} variant="common" />
        <div className="risk-grid">
          <Field label={t.fields.sex}>
            <select value={shared.sex} onChange={(e) => patchShared({ sex: e.target.value })}>
              <option value="">{t.select}</option>
              <option value="male">{t.male}</option>
              <option value="female">{t.female}</option>
            </select>
          </Field>
          <Field label={t.fields.age}>
            <input type="number" min="18" max="110" value={shared.chronologicalAge} onChange={(e) => patchShared({ chronologicalAge: e.target.value })} />
          </Field>
          <Field label={t.fields.sample}>
            <select value={shared.sampleType} onChange={(e) => patchShared({ sampleType: e.target.value })}>
              <option value="blood">{t.blood}</option>
              <option value="other">{t.otherSample}</option>
            </select>
          </Field>
          <Field label={t.fields.array}>
            <select value={shared.arrayType} onChange={(e) => patchShared({ arrayType: e.target.value })}>
              <option value="unknown">{t.arrayUnknown}</option>
              <option value="450k">{t.array450}</option>
              <option value="epic">{t.arrayEpic}</option>
              <option value="epic2">{t.arrayEpic2}</option>
            </select>
          </Field>
          <Field label={t.fields.lab}>
            <input type="text" value={shared.labName} onChange={(e) => patchShared({ labName: e.target.value })} />
          </Field>
          <Field label={t.fields.reportDate}>
            <input type="date" value={shared.reportDate} onChange={(e) => patchShared({ reportDate: e.target.value })} />
          </Field>
        </div>
        <label className="risk-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>{t.consent}</span>
        </label>
      </section>

      <div className="aging-gen-tabs">
        <div className="aging-gen">
          <p className="aging-gen-label">{t.gen1}</p>
          <div className="risk-tabs" role="tablist" aria-label={t.gen1}>
            {['horvath', 'icas'].map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tool === id}
                className={`risk-tab ${tool === id ? 'is-active' : ''}`}
                onClick={() => setTool(id)}
              >
                {t.tabs[id]}
              </button>
            ))}
          </div>
        </div>
        <div className="aging-gen">
          <p className="aging-gen-label">{t.gen2}</p>
          <div className="risk-tabs" role="tablist" aria-label={t.gen2}>
            <button type="button" role="tab" aria-selected={tool === 'grimage2'} className={`risk-tab ${tool === 'grimage2' ? 'is-active' : ''}`} onClick={() => setTool('grimage2')}>
              {t.tabs.grimage2}
            </button>
          </div>
        </div>
        <div className="aging-gen">
          <p className="aging-gen-label">{t.gen3}</p>
          <div className="risk-tabs" role="tablist" aria-label={t.gen3}>
            <button type="button" role="tab" aria-selected={tool === 'dunedinpace'} className={`risk-tab ${tool === 'dunedinpace' ? 'is-active' : ''}`} onClick={() => setTool('dunedinpace')}>
              {t.tabs.dunedinpace}
            </button>
          </div>
        </div>
      </div>

      <form
        className="risk-form risk-form--specific"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <SectionHead badge={t.specificTag} title={extraCopy.title} lead={extraCopy.lead} variant="specific" />
        {tool === 'icas' ? <p className="aging-china-tag">{t.chinaTag}</p> : null}
        <div className="risk-grid">
          {YEAR_TOOLS.includes(tool) ? (
            <Field label={t.fields.clockAge}>
              <input
                type="number"
                min="1"
                max="120"
                step="0.1"
                value={clockAge[tool]}
                onChange={(e) => setClockAge((prev) => ({ ...prev, [tool]: e.target.value }))}
              />
            </Field>
          ) : (
            <Field label={t.fields.pace}>
              <input type="number" min="0.5" max="2.5" step="0.01" value={pace} onChange={(e) => setPace(e.target.value)} />
            </Field>
          )}
        </div>
        <div className="risk-actions">
          <button type="submit" className="btn-primary" disabled={busy || !currentResult.ok}>{busy ? t.saving : t.save}</button>
        </div>
      </form>

      <ResultBox
        title={t.preview}
        t={t}
        result={currentResult}
        extra={currentResult.ok ? (
          <div className={`risk-result-hero risk-band-${currentResult.band.id}`}>
            {tool === 'dunedinpace' ? (
              <>
                <div className="risk-metric">
                  <strong>{currentResult.pace}</strong>
                  <span>DunedinPACE</span>
                </div>
                <div className="risk-metric">
                  <strong>{currentResult.deltaPct >= 0 ? `+${currentResult.deltaPct}%` : `${currentResult.deltaPct}%`}</strong>
                  <span>相对每年老一年</span>
                </div>
                <div className="risk-metric">
                  <strong>{currentResult.band.label}</strong>
                  <span>&lt;0.97 偏慢 · 0.97–1.03 接近 · ≥1.10 偏快</span>
                </div>
              </>
            ) : (
              <>
                <div className="risk-metric">
                  <strong>{currentResult.clockAge}</strong>
                  <span>{tool === 'grimage2' ? 'GrimAge2（岁）' : '时钟年龄（岁）'}</span>
                </div>
                <div className="risk-metric">
                  <strong>{currentResult.accel >= 0 ? `+${currentResult.accel}` : String(currentResult.accel)}</strong>
                  <span>相对日历年龄 {currentResult.chronologicalAge} 岁</span>
                </div>
                <div className="risk-metric">
                  <strong>{currentResult.band.label}</strong>
                  <span>|Δ|&lt;5 接近 · 5–10 轻度 · ≥10 明显</span>
                </div>
              </>
            )}
          </div>
        ) : null}
      />
    </div>
  )
}
