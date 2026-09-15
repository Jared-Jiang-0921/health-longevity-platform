import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { RISK_ASSESSMENT_COPY } from '../data/riskAssessmentCopy'
import { RISK_KINDS } from '../lib/riskModels/index'
import { computeChinaPar } from '../lib/riskModels/chinaPar'
import { computeDiabetesBundle } from '../lib/riskModels/diabetes'
import { computeLifestyle } from '../lib/riskModels/lifestyle'
import { computeFraminghamHypertension } from '../lib/riskModels/hypertension'
import { computeCaide } from '../lib/riskModels/dementia'
import { computeParkinson } from '../lib/riskModels/parkinson'
import { computeOsta } from '../lib/riskModels/osteoporosis'
import { computeSarcF } from '../lib/riskModels/sarcopenia'
import {
  EMPTY_DEM_EXTRA,
  EMPTY_DM_EXTRA,
  EMPTY_HTN_EXTRA,
  EMPTY_LIFE_EXTRA,
  EMPTY_PAR_EXTRA,
  EMPTY_PD_EXTRA,
  EMPTY_SARC_EXTRA,
  EMPTY_SHARED,
  buildChinaParInput,
  buildDementiaInput,
  buildDiabetesInput,
  buildHypertensionInput,
  buildLifestyleInput,
  buildOsteoporosisInput,
  buildParkinsonInput,
  buildSarcopeniaInput,
  extractDemExtra,
  extractDmExtra,
  extractHtnExtra,
  extractLifeExtra,
  extractParExtra,
  extractPdExtra,
  extractSarcExtra,
  hydrateSharedFromLatest,
} from '../lib/riskModels/sharedProfile'
import { fetchRiskAssessments, saveRiskAssessment } from '../lib/riskAssessmentsApi'
import './RiskAssessments.css'

const ALL_TOOLS = RISK_KINDS

function yn(value) {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return value
}

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

function YesNo({ value, onChange, t }) {
  return (
    <select value={value === true ? 'true' : value === false ? 'false' : ''} onChange={(e) => onChange(yn(e.target.value))}>
      <option value="">{t.select}</option>
      <option value="true">{t.yes}</option>
      <option value="false">{t.no}</option>
    </select>
  )
}

function ScoreSelect({ value, onChange, t, kind = 'difficulty' }) {
  return (
    <select value={value === '' || value == null ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}>
      <option value="">{t.select}</option>
      {kind === 'falls' ? (
        <>
          <option value="0">{t.fallsNone}</option>
          <option value="1">{t.fallsSome}</option>
          <option value="2">{t.fallsMany}</option>
        </>
      ) : (
        <>
          <option value="0">{t.sarcNone}</option>
          <option value="1">{t.sarcSome}</option>
          <option value="2">{t.sarcALot}</option>
        </>
      )}
    </select>
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
      {result.adviseClinician || result.band?.adviseClinician ? (
        <p className="risk-muted">{t.seeDoctor}</p>
      ) : null}
      <p className="risk-muted">{result.disclaimer}</p>
    </section>
  )
}

function SpecificForm({ t, extra, children, onSave, busy, canSave }) {
  return (
    <form
      className="risk-form risk-form--specific"
      onSubmit={(e) => {
        e.preventDefault()
        onSave()
      }}
    >
      <SectionHead badge={t.specificTag} title={extra.title} lead={extra.lead} variant="specific" />
      {children}
      <div className="risk-actions">
        <button type="submit" className="btn-primary" disabled={busy || !canSave}>{busy ? t.saving : t.save}</button>
      </div>
    </form>
  )
}

export default function RiskAssessments() {
  const { lang } = useLocale()
  const t = RISK_ASSESSMENT_COPY[lang] || RISK_ASSESSMENT_COPY.zh
  const { user, loading, getToken } = useAuth()
  const [params, setParams] = useSearchParams()
  const tool = ALL_TOOLS.includes(params.get('tool')) ? params.get('tool') : 'china_par'
  const [shared, setShared] = useState(EMPTY_SHARED)
  const [par, setPar] = useState(EMPTY_PAR_EXTRA)
  const [dm, setDm] = useState(EMPTY_DM_EXTRA)
  const [life, setLife] = useState(EMPTY_LIFE_EXTRA)
  const [htn, setHtn] = useState(EMPTY_HTN_EXTRA)
  const [dem, setDem] = useState(EMPTY_DEM_EXTRA)
  const [pd, setPd] = useState(EMPTY_PD_EXTRA)
  const [sarc, setSarc] = useState(EMPTY_SARC_EXTRA)
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
    const token = getToken()
    const headers = { Authorization: `Bearer ${token}` }
    Promise.all([
      fetchRiskAssessments(token),
      fetch('/api/health-questionnaire', { headers }).then((res) => (res.ok ? res.json() : {})).catch(() => ({})),
    ])
      .then(([data, qData]) => {
        if (cancelled) return
        const latest = data.latest || {}
        let nextShared = hydrateSharedFromLatest(latest)
        const qSex = qData.submission?.sex
        if (!nextShared.sex && (qSex === 'male' || qSex === 'female')) nextShared = { ...nextShared, sex: qSex }
        setShared(nextShared)
        if (latest.china_par?.input) setPar((prev) => ({ ...prev, ...extractParExtra(latest.china_par.input) }))
        if (latest.diabetes?.input) setDm((prev) => ({ ...prev, ...extractDmExtra(latest.diabetes.input) }))
        if (latest.lifestyle?.input) setLife((prev) => ({ ...prev, ...extractLifeExtra(latest.lifestyle.input) }))
        if (latest.hypertension?.input) setHtn((prev) => ({ ...prev, ...extractHtnExtra(latest.hypertension.input) }))
        setDem((prev) => {
          const extracted = latest.dementia?.input ? extractDemExtra(latest.dementia.input) : {}
          const parExtra = latest.china_par?.input ? extractParExtra(latest.china_par.input) : {}
          if (!extracted.tc && parExtra.tc) {
            extracted.tc = parExtra.tc
            extracted.tcUnit = parExtra.tcUnit || 'mmol'
          }
          return { ...prev, ...extracted }
        })
        if (latest.parkinson?.input) setPd((prev) => ({ ...prev, ...extractPdExtra(latest.parkinson.input) }))
        if (latest.sarcopenia?.input) setSarc((prev) => ({ ...prev, ...extractSarcExtra(latest.sarcopenia.input) }))
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

  const parInput = useMemo(() => buildChinaParInput(shared, par), [shared, par])
  const dmInput = useMemo(() => buildDiabetesInput(shared, dm), [shared, dm])
  const lifeInput = useMemo(() => buildLifestyleInput(shared, life), [shared, life])
  const htnInput = useMemo(() => buildHypertensionInput(shared, htn), [shared, htn])
  const demInput = useMemo(() => buildDementiaInput(shared, dem, par), [shared, dem, par])
  const pdInput = useMemo(() => buildParkinsonInput(shared, pd), [shared, pd])
  const ostaInput = useMemo(() => buildOsteoporosisInput(shared), [shared])
  const sarcInput = useMemo(() => buildSarcopeniaInput(shared, sarc), [shared, sarc])

  const parResult = useMemo(() => computeChinaPar(parInput), [parInput])
  const dmResult = useMemo(() => computeDiabetesBundle(dmInput), [dmInput])
  const lifeResult = useMemo(() => computeLifestyle(lifeInput), [lifeInput])
  const htnResult = useMemo(() => computeFraminghamHypertension(htnInput), [htnInput])
  const demResult = useMemo(() => computeCaide(demInput), [demInput])
  const pdResult = useMemo(() => computeParkinson(pdInput), [pdInput])
  const ostaResult = useMemo(() => computeOsta(ostaInput), [ostaInput])
  const sarcResult = useMemo(() => computeSarcF(sarcInput), [sarcInput])

  const setTool = (next) => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('tool', next)
    setParams(nextParams, { replace: true })
    setError('')
    setMessage('')
  }

  const patchShared = (patch) => setShared((prev) => ({ ...prev, ...patch }))

  const save = async (kind, input) => {
    setError('')
    setMessage('')
    setBusy(true)
    try {
      await saveRiskAssessment(getToken(), { kind, input, consentHealthData: consent })
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
    <div className="page-content risk-page">
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

      <aside className="risk-guide" aria-labelledby="risk-guide-heading">
        <h2 id="risk-guide-heading">{t.guideTitle}</h2>
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
            <input type="number" min="18" max="90" value={shared.age} onChange={(e) => patchShared({ age: e.target.value })} />
          </Field>
          <Field label={t.fields.height}>
            <input type="number" min="120" max="220" value={shared.heightCm} onChange={(e) => patchShared({ heightCm: e.target.value })} />
          </Field>
          <Field label={t.fields.weight}>
            <input type="number" min="30" max="250" step="0.1" value={shared.weightKg} onChange={(e) => patchShared({ weightKg: e.target.value })} />
          </Field>
          <Field label={t.fields.waist}>
            <input type="number" min="50" max="160" step="0.1" value={shared.waistCm} onChange={(e) => patchShared({ waistCm: e.target.value })} />
          </Field>
          <Field label={t.fields.sbp}>
            <input type="number" min="70" max="250" value={shared.sbp} onChange={(e) => patchShared({ sbp: e.target.value })} />
          </Field>
          <Field label={t.fields.dbp}>
            <input type="number" min="40" max="160" value={shared.dbp} onChange={(e) => patchShared({ dbp: e.target.value })} />
          </Field>
          <Field label={t.fields.sleep}>
            <input type="number" min="3" max="14" step="0.5" value={shared.sleepHours} onChange={(e) => patchShared({ sleepHours: e.target.value })} />
          </Field>
          <Field label={t.fields.region}>
            <select
              value={shared.north === true ? 'north' : shared.north === false ? 'south' : ''}
              onChange={(e) => patchShared({ north: e.target.value === 'north' ? true : e.target.value === 'south' ? false : '' })}
            >
              <option value="">{t.select}</option>
              <option value="north">{t.north}</option>
              <option value="south">{t.south}</option>
            </select>
          </Field>
          <Field label={t.fields.urban}>
            <select
              value={shared.urban === true ? 'urban' : shared.urban === false ? 'rural' : ''}
              onChange={(e) => patchShared({ urban: e.target.value === 'urban' ? true : e.target.value === 'rural' ? false : '' })}
            >
              <option value="">{t.select}</option>
              <option value="urban">{t.urban}</option>
              <option value="rural">{t.rural}</option>
            </select>
          </Field>
          <Field label={t.fields.treated}>
            <YesNo value={shared.treatedHypertension} onChange={(v) => patchShared({ treatedHypertension: v })} t={t} />
          </Field>
          <Field label={t.fields.nicotine}>
            <select value={shared.nicotine} onChange={(e) => patchShared({ nicotine: e.target.value })}>
              <option value="">{t.select}</option>
              <option value="never">{t.nicNever}</option>
              <option value="former">{t.nicFormer}</option>
              <option value="recent">{t.nicRecent}</option>
              <option value="current">{t.nicCurrent}</option>
            </select>
          </Field>
          <Field label={t.fields.glucose}>
            <select value={shared.glucose} onChange={(e) => patchShared({ glucose: e.target.value })}>
              <option value="">{t.select}</option>
              <option value="normal">{t.gluNormal}</option>
              <option value="unknown">{t.gluUnknown}</option>
              <option value="prediabetes">{t.gluPre}</option>
              <option value="diabetes">{t.gluDm}</option>
            </select>
          </Field>
          <Field label={t.fields.activityMin}>
            <input type="number" min="0" max="2000" value={shared.activityMinutes} onChange={(e) => patchShared({ activityMinutes: e.target.value })} />
          </Field>
        </div>
        <label className="risk-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>{t.consent}</span>
        </label>
      </section>

      <div className="risk-tabs" role="tablist" aria-label={t.title}>
        {ALL_TOOLS.map((id) => (
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

      {tool === 'china_par' ? (
        <>
          <SpecificForm t={t} extra={t.extras.china_par} busy={busy} canSave={parResult.ok} onSave={() => save('china_par', parInput)}>
            <div className="risk-grid">
              <Field label={t.fields.tc}>
                <div className="risk-unit-row">
                  <input type="number" min="1" step="0.1" value={par.tc} onChange={(e) => setPar({ ...par, tc: e.target.value })} />
                  <select value={par.tcUnit} onChange={(e) => setPar({ ...par, tcUnit: e.target.value })}>
                    <option value="mmol">{t.mmol}</option>
                    <option value="mgdl">{t.mgdl}</option>
                  </select>
                </div>
              </Field>
              <Field label={t.fields.hdl}>
                <div className="risk-unit-row">
                  <input type="number" min="0.2" step="0.1" value={par.hdl} onChange={(e) => setPar({ ...par, hdl: e.target.value })} />
                  <select value={par.hdlUnit} onChange={(e) => setPar({ ...par, hdlUnit: e.target.value })}>
                    <option value="mmol">{t.mmol}</option>
                    <option value="mgdl">{t.mgdl}</option>
                  </select>
                </div>
              </Field>
              <Field label={t.fields.familyAscvd}>
                <YesNo value={par.familyAscvd} onChange={(v) => setPar({ ...par, familyAscvd: v })} t={t} />
              </Field>
            </div>
          </SpecificForm>
          <ResultBox title={t.preview} t={t} result={parResult} extra={parResult.ok ? (
            <div className={`risk-result-hero risk-band-${parResult.band.id}`}>
              <div className="risk-metric">
                <strong>{parResult.percent}%</strong>
                <span>10 年 ASCVD</span>
              </div>
              <div className="risk-metric">
                <strong>{parResult.band.label}</strong>
                <span>&lt;5% 低危 · 5–9.9% 中危 · ≥10% 高危</span>
              </div>
            </div>
          ) : null}
          />
        </>
      ) : null}

      {tool === 'diabetes' ? (
        <>
          <SpecificForm t={t} extra={t.extras.diabetes} busy={busy} canSave={dmResult.ok} onSave={() => save('diabetes', dmInput)}>
            <div className="risk-grid">
              <Field label={t.fields.familyDm}>
                <YesNo
                  value={dm.familyDiabetes}
                  onChange={(v) => setDm({ ...dm, familyDiabetes: v, familyFindrisc: v ? 'first' : dm.familyFindrisc === 'first' ? 'none' : dm.familyFindrisc })}
                  t={t}
                />
              </Field>
              <Field label={t.fields.familyFindrisc}>
                <select value={dm.familyFindrisc} onChange={(e) => setDm({ ...dm, familyFindrisc: e.target.value, familyDiabetes: e.target.value === 'first' })}>
                  <option value="none">{t.familyNone}</option>
                  <option value="second">{t.familySecond}</option>
                  <option value="first">{t.familyFirst}</option>
                </select>
              </Field>
              <Field label={t.fields.vegetables}>
                <YesNo value={dm.dailyVegetables} onChange={(v) => setDm({ ...dm, dailyVegetables: v })} t={t} />
              </Field>
            </div>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={dmResult}
            extra={dmResult.ok ? (
              <>
                <div className="risk-result-hero">
                  <div className={`risk-metric ${dmResult.china.high ? 'risk-band-high' : 'risk-band-low'}`}>
                    <strong>{dmResult.china.score}</strong>
                    <span>中国评分 / 51（切点 25）</span>
                  </div>
                  <div className={`risk-metric ${dmResult.findrisc.high ? 'risk-band-intermediate' : 'risk-band-low'}`}>
                    <strong>{dmResult.findrisc.score}</strong>
                    <span>FINDRISC / 26</span>
                  </div>
                </div>
                <ul className="risk-parts">
                  <li>{dmResult.china.name}：{dmResult.china.band}</li>
                  <li>{dmResult.findrisc.name}：{dmResult.findrisc.band}</li>
                </ul>
              </>
            ) : null}
          />
        </>
      ) : null}

      {tool === 'lifestyle' ? (
        <>
          <SpecificForm t={t} extra={t.extras.lifestyle} busy={busy} canSave={lifeResult.ok} onSave={() => save('lifestyle', lifeInput)}>
            <div className="risk-grid">
              <Field label={t.fields.activityLevel}>
                <select value={life.activityLevel} onChange={(e) => setLife({ ...life, activityLevel: e.target.value })}>
                  <option value="sedentary">{t.actSed}</option>
                  <option value="light">{t.actLight}</option>
                  <option value="moderate">{t.actMod}</option>
                  <option value="active">{t.actActive}</option>
                  <option value="very">{t.actVery}</option>
                </select>
              </Field>
              <Field label={t.fields.diet}>
                <select value={life.diet} onChange={(e) => setLife({ ...life, diet: e.target.value })}>
                  <option value="">{t.select}</option>
                  <option value="poor">{t.dietPoor}</option>
                  <option value="fair">{t.dietFair}</option>
                  <option value="good">{t.dietGood}</option>
                  <option value="excellent">{t.dietExcellent}</option>
                </select>
              </Field>
              <Field label={t.fields.lipids}>
                <select value={life.lipids} onChange={(e) => setLife({ ...life, lipids: e.target.value })}>
                  <option value="optimal">{t.lipOpt}</option>
                  <option value="unknown">{t.lipUnknown}</option>
                  <option value="borderline">{t.lipMid}</option>
                  <option value="high">{t.lipHigh}</option>
                </select>
              </Field>
            </div>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={lifeResult}
            extra={lifeResult.ok ? (
              <>
                <div className="risk-result-hero">
                  <div className={`risk-metric risk-band-${lifeResult.le8 >= 80 ? 'low' : lifeResult.le8 >= 50 ? 'intermediate' : 'high'}`}>
                    <strong>{lifeResult.le8}</strong>
                    <span>简化 LE8 / 100 · {lifeResult.le8Band.label}</span>
                  </div>
                  <div className={`risk-metric risk-band-${lifeResult.bmiBand.id}`}>
                    <strong>{lifeResult.bmi}</strong>
                    <span>BMI · {lifeResult.bmiBand.label}</span>
                  </div>
                  <div className="risk-metric">
                    <strong>{lifeResult.energy.bmr}</strong>
                    <span>BMR kcal</span>
                  </div>
                  <div className="risk-metric">
                    <strong>{lifeResult.energy.tdee}</strong>
                    <span>TDEE kcal</span>
                  </div>
                </div>
                <ul className="risk-parts">
                  {lifeResult.components.map((row) => (
                    <li key={row.id}>{row.name} {row.score}</li>
                  ))}
                </ul>
              </>
            ) : null}
          />
        </>
      ) : null}

      {tool === 'hypertension' ? (
        <>
          <SpecificForm t={t} extra={t.extras.hypertension} busy={busy} canSave={htnResult.ok} onSave={() => save('hypertension', htnInput)}>
            <div className="risk-grid">
              <Field label={t.fields.parentalHtn}>
                <select value={htn.parentalHypertension} onChange={(e) => setHtn({ ...htn, parentalHypertension: e.target.value })}>
                  <option value="">{t.select}</option>
                  <option value="0">{t.parentalNone}</option>
                  <option value="1">{t.parentalOne}</option>
                  <option value="2">{t.parentalBoth}</option>
                </select>
              </Field>
            </div>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={htnResult}
            extra={htnResult.ok ? (
              <div className={`risk-result-hero risk-band-${htnResult.band.id}`}>
                <div className="risk-metric">
                  <strong>{htnResult.alreadyHypertensive ? '—' : `${htnResult.percent}%`}</strong>
                  <span>{htnResult.alreadyHypertensive ? '不再估算新发风险' : '4 年新发高血压'}</span>
                </div>
                <div className="risk-metric">
                  <strong>{htnResult.band.label}</strong>
                  <span>&lt;5% 低危 · 5–10% 中危 · &gt;10% 高危</span>
                </div>
              </div>
            ) : null}
          />
        </>
      ) : null}

      {tool === 'dementia' ? (
        <>
          <SpecificForm t={t} extra={t.extras.dementia} busy={busy} canSave={demResult.ok} onSave={() => save('dementia', demInput)}>
            <div className="risk-grid">
              <Field label={t.fields.educationYears}>
                <input type="number" min="0" max="30" value={dem.educationYears} onChange={(e) => setDem({ ...dem, educationYears: e.target.value })} />
              </Field>
              <Field label={t.fields.tc}>
                <div className="risk-unit-row">
                  <input type="number" min="1" step="0.1" value={dem.tc} onChange={(e) => setDem({ ...dem, tc: e.target.value })} />
                  <select value={dem.tcUnit} onChange={(e) => setDem({ ...dem, tcUnit: e.target.value })}>
                    <option value="mmol">{t.mmol}</option>
                    <option value="mgdl">{t.mgdl}</option>
                  </select>
                </div>
              </Field>
            </div>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={demResult}
            extra={demResult.ok ? (
              <div className={`risk-result-hero risk-band-${demResult.band.id}`}>
                <div className="risk-metric">
                  <strong>{demResult.score}/15</strong>
                  <span>CAIDE 评分</span>
                </div>
                <div className="risk-metric">
                  <strong>{demResult.percent}%</strong>
                  <span>原文 20 年痴呆风险</span>
                </div>
                <div className="risk-metric">
                  <strong>{demResult.band.label}</strong>
                  <span>切点 ≥9 分</span>
                </div>
              </div>
            ) : null}
          />
        </>
      ) : null}

      {tool === 'parkinson' ? (
        <>
          <SpecificForm t={t} extra={t.extras.parkinson} busy={busy} canSave={pdResult.ok} onSave={() => save('parkinson', pdInput)}>
            <div className="risk-grid">
              <Field label={t.fields.familyPd}>
                <YesNo value={pd.familyPd} onChange={(v) => setPd({ ...pd, familyPd: v })} t={t} />
              </Field>
              <Field label={t.fields.constipation}>
                <YesNo value={pd.constipation} onChange={(v) => setPd({ ...pd, constipation: v })} t={t} />
              </Field>
              <Field label={t.fields.drinksCoffee}>
                <YesNo value={pd.drinksCoffee} onChange={(v) => setPd({ ...pd, drinksCoffee: v })} t={t} />
              </Field>
              <Field label={t.fields.pesticide}>
                <YesNo value={pd.pesticide} onChange={(v) => setPd({ ...pd, pesticide: v })} t={t} />
              </Field>
              <Field label={t.fields.moodDisorder}>
                <YesNo value={pd.moodDisorder} onChange={(v) => setPd({ ...pd, moodDisorder: v })} t={t} />
              </Field>
              <Field label={t.fields.rbd}>
                <YesNo value={pd.rbd} onChange={(v) => setPd({ ...pd, rbd: v })} t={t} />
              </Field>
              <Field label={t.fields.hyposmia}>
                <YesNo value={pd.hyposmia} onChange={(v) => setPd({ ...pd, hyposmia: v })} t={t} />
              </Field>
            </div>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={pdResult}
            extra={pdResult.ok ? (
              <>
                <div className={`risk-result-hero risk-band-${pdResult.band.id}`}>
                  <div className="risk-metric">
                    <strong>×{pdResult.relativeRisk}</strong>
                    <span>相对风险倍数</span>
                  </div>
                  <div className="risk-metric">
                    <strong>{pdResult.band.label}</strong>
                    <span>不是患病概率</span>
                  </div>
                </div>
                <ul className="risk-parts">
                  {pdResult.parts.filter((row) => row.applied).map((row) => (
                    <li key={row.id}>{row.name} ×{row.factor}</li>
                  ))}
                  {pdResult.prodromalFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </>
            ) : null}
          />
        </>
      ) : null}

      {tool === 'osteoporosis' ? (
        <>
          <SpecificForm t={t} extra={t.extras.osteoporosis} busy={busy} canSave={ostaResult.ok} onSave={() => save('osteoporosis', ostaInput)}>
            <p className="risk-muted">{t.extras.osteoporosis.lead}</p>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={ostaResult}
            extra={ostaResult.ok ? (
              <div className={`risk-result-hero risk-band-${ostaResult.band.id}`}>
                <div className="risk-metric">
                  <strong>{ostaResult.index}</strong>
                  <span>OSTA 指数</span>
                </div>
                <div className="risk-metric">
                  <strong>{ostaResult.band.label}</strong>
                  <span>&gt;−1 低危 · −1 至 −4 中危 · &lt;−4 高危</span>
                </div>
              </div>
            ) : null}
          />
        </>
      ) : null}

      {tool === 'sarcopenia' ? (
        <>
          <SpecificForm t={t} extra={t.extras.sarcopenia} busy={busy} canSave={sarcResult.ok} onSave={() => save('sarcopenia', sarcInput)}>
            <div className="risk-grid">
              <Field label={t.fields.sarcStrength}>
                <ScoreSelect value={sarc.sarcStrength} onChange={(v) => setSarc({ ...sarc, sarcStrength: v })} t={t} />
              </Field>
              <Field label={t.fields.sarcWalking}>
                <ScoreSelect value={sarc.sarcWalking} onChange={(v) => setSarc({ ...sarc, sarcWalking: v })} t={t} />
              </Field>
              <Field label={t.fields.sarcRise}>
                <ScoreSelect value={sarc.sarcRise} onChange={(v) => setSarc({ ...sarc, sarcRise: v })} t={t} />
              </Field>
              <Field label={t.fields.sarcClimb}>
                <ScoreSelect value={sarc.sarcClimb} onChange={(v) => setSarc({ ...sarc, sarcClimb: v })} t={t} />
              </Field>
              <Field label={t.fields.sarcFalls}>
                <ScoreSelect value={sarc.sarcFalls} onChange={(v) => setSarc({ ...sarc, sarcFalls: v })} t={t} kind="falls" />
              </Field>
            </div>
          </SpecificForm>
          <ResultBox
            title={t.preview}
            t={t}
            result={sarcResult}
            extra={sarcResult.ok ? (
              <div className={`risk-result-hero risk-band-${sarcResult.band.id}`}>
                <div className="risk-metric">
                  <strong>{sarcResult.score}/10</strong>
                  <span>SARC-F</span>
                </div>
                <div className="risk-metric">
                  <strong>{sarcResult.band.label}</strong>
                  <span>AWGS 2019 切点 ≥4</span>
                </div>
              </div>
            ) : null}
          />
        </>
      ) : null}
    </div>
  )
}
