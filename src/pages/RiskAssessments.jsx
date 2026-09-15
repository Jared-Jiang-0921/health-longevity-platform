import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { computeChinaPar } from '../lib/riskModels/chinaPar'
import { computeDiabetesBundle } from '../lib/riskModels/diabetes'
import { computeLifestyle } from '../lib/riskModels/lifestyle'
import {
  EMPTY_DM_EXTRA,
  EMPTY_LIFE_EXTRA,
  EMPTY_PAR_EXTRA,
  EMPTY_SHARED,
  buildChinaParInput,
  buildDiabetesInput,
  buildLifestyleInput,
  extractDmExtra,
  extractLifeExtra,
  extractParExtra,
  hydrateSharedFromLatest,
} from '../lib/riskModels/sharedProfile'
import { fetchRiskAssessments, saveRiskAssessment } from '../lib/riskAssessmentsApi'
import './RiskAssessments.css'

const TOOLS = ['china_par', 'diabetes', 'lifestyle']

const COPY = {
  zh: {
    title: '第一期健康风险评估',
    lead: '标准会员及以上可用。共同问题只问一次；每个评估再问自己的专项问题（疾病风险、衰老风险或生活方式风险）。',
    back: '返回 AI 长寿师',
    loginFirst: '请先登录。三项评估仅向标准会员及以上开放，结果写入本站账户供咨询参考。',
    login: '登录',
    loading: '正在加载已保存的评估…',
    noticeTitle: '使用前请确认',
    notice:
      '结果只用于健康教育和咨询背景，不能诊断、治疗或处方。高危请尽快就医。本页不连接任何外部小程序或检测实验室。',
    sharedTitle: '共同问题',
    sharedLead: '所有风险评估共用：年龄、性别、身高体重、腰围、血压、睡眠、居住地、降压药、吸烟、血糖、每周活动。只填一次，切换评估时会自动带入。',
    extraTitle: '专项问题',
    guideTitle: '怎么填',
    commonTag: '共同问题',
    specificTag: '专项问题',
    guideCommon: '标有「共同问题」的区块，所有评估都用，只填一次，切换评估不会再问。',
    guideSpecific: '标有「专项问题」的区块，只属于当前这项：疾病风险、衰老风险或生活方式风险。',
    extras: {
      china_par: {
        title: '专项问题 · 心血管病风险',
        lead: '仅 China-PAR 需要：总胆固醇、HDL、心梗/脑卒中家族史。',
      },
      diabetes: {
        title: '专项问题 · 糖尿病风险',
        lead: '仅糖尿病筛查需要：糖尿病家族史、是否每天吃蔬菜水果。',
      },
      lifestyle: {
        title: '专项问题 · 生活方式风险',
        lead: '仅生活方式评估需要：饮食质量、日常活动水平、血脂自评。',
      },
    },
    consent: '我已阅读健康数据说明，并同意平台为提供教育评估与咨询摘要处理我提交的健康数据。',
    save: '保存到本站账户',
    saving: '保存中…',
    saved: '已保存。咨询时会带上这段摘要。',
    saveFail: '保存失败',
    loadFail: '加载失败',
    preview: '即时结果',
    incomplete: '请先完成上方共同问题，再完成本评估的专项问题。',
    seeDoctor: '当前分层偏高，建议尽快咨询执业医师，不要自行调整处方药。',
    legal: '查看健康数据说明',
    tabs: {
      china_par: '心血管 China-PAR',
      diabetes: '糖尿病筛查',
      lifestyle: '生活方式',
    },
    fields: {
      sex: '生理性别',
      age: '年龄（岁）',
      sbp: '收缩压（mmHg）',
      dbp: '舒张压（mmHg）',
      treated: '近 2 周是否服用降压药',
      tc: '总胆固醇',
      hdl: 'HDL-C',
      waist: '腰围（cm，肋弓与髂嵴中点）',
      region: '现居住地（长江为界）',
      urban: '城乡',
      familyAscvd: '父母或同胞是否有心梗/脑卒中',
      height: '身高（cm）',
      weight: '体重（kg）',
      familyDm: '父母、同胞或子女是否有糖尿病',
      familyFindrisc: '糖尿病家族史（FINDRISC）',
      vegetables: '是否每天吃蔬菜水果',
      diet: '饮食质量（自评）',
      nicotine: '烟草暴露',
      sleep: '通常睡眠（小时）',
      activityMin: '每周中等强度活动（分钟）',
      activityLevel: '日常活动水平（用于估算消耗）',
      glucose: '血糖状况（自评/已知）',
      lipids: '血脂状况（自评/已知）',
    },
    yes: '是',
    no: '否',
    select: '请选择',
    male: '男性',
    female: '女性',
    north: '北方',
    south: '南方',
    urban: '城市',
    rural: '农村',
    mmol: 'mmol/L',
    mgdl: 'mg/dL',
    familyNone: '无',
    familySecond: '二级亲属',
    familyFirst: '一级亲属',
    dietPoor: '较差',
    dietFair: '一般',
    dietGood: '较好',
    dietExcellent: '很好',
    nicNever: '从不',
    nicFormer: '已戒一年以上',
    nicRecent: '近一年戒烟',
    nicCurrent: '正在吸烟',
    actSed: '久坐',
    actLight: '轻度',
    actMod: '中等',
    actActive: '活跃',
    actVery: '很高',
    gluNormal: '正常 / 未知但无症状',
    gluUnknown: '不清楚',
    gluPre: '糖前期',
    gluDm: '已诊断糖尿病',
    lipOpt: '较理想',
    lipUnknown: '不清楚',
    lipMid: '临界偏高',
    lipHigh: '明显升高',
  },
  en: {
    title: 'Phase-1 risk assessments',
    lead: 'Shared questions are asked once. Each tool then asks only its own disease, aging, or lifestyle items.',
    back: 'Back to AI Coach',
    loginFirst: 'Please sign in. These tools require Standard membership or higher.',
    login: 'Log in',
    loading: 'Loading saved assessments…',
    noticeTitle: 'Please read first',
    notice: 'Educational only. Not a diagnosis. See a clinician if risk is high. This page does not call any mini-program or lab.',
    sharedTitle: 'Shared questions',
    sharedLead: 'Used by every assessment: age, sex, height/weight, waist, blood pressure, sleep, region, BP medicine, nicotine, glucose, weekly activity. Asked once and reused when you switch tools.',
    extraTitle: 'Specific questions',
    guideTitle: 'How to fill this in',
    commonTag: 'Shared',
    specificTag: 'Specific',
    guideCommon: 'Blocks tagged Shared are used by every assessment and asked only once.',
    guideSpecific: 'Blocks tagged Specific belong only to the selected disease, aging, or lifestyle risk.',
    extras: {
      china_par: {
        title: 'Specific · cardiovascular risk',
        lead: 'China-PAR only: total cholesterol, HDL, and family history of MI/stroke.',
      },
      diabetes: {
        title: 'Specific · diabetes risk',
        lead: 'Diabetes screening only: family history of diabetes and daily vegetables/fruit.',
      },
      lifestyle: {
        title: 'Specific · lifestyle risk',
        lead: 'Lifestyle only: diet quality, usual activity level, and self-rated lipids.',
      },
    },
    consent: 'I agree that this site may process the health data I enter for educational scoring and consult summaries.',
    save: 'Save to this account',
    saving: 'Saving…',
    saved: 'Saved. Consults can use this summary.',
    saveFail: 'Save failed',
    loadFail: 'Load failed',
    preview: 'Live result',
    incomplete: 'Finish the shared questions, then this tool’s specific questions.',
    seeDoctor: 'This band is elevated. Please see a licensed clinician.',
    legal: 'Health data notice',
    tabs: {
      china_par: 'China-PAR',
      diabetes: 'Diabetes screening',
      lifestyle: 'Lifestyle',
    },
    fields: {
      sex: 'Sex',
      age: 'Age (years)',
      sbp: 'Systolic BP (mmHg)',
      dbp: 'Diastolic BP (mmHg)',
      treated: 'Blood-pressure medicine in past 2 weeks',
      tc: 'Total cholesterol',
      hdl: 'HDL-C',
      waist: 'Waist (cm)',
      region: 'Region (Yangtze as boundary)',
      urban: 'Urban / rural',
      familyAscvd: 'Parent or sibling MI / stroke',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      familyDm: 'First-degree family history of diabetes',
      familyFindrisc: 'FINDRISC family history',
      vegetables: 'Vegetables / fruit daily',
      diet: 'Diet quality',
      nicotine: 'Nicotine',
      sleep: 'Sleep hours',
      activityMin: 'Moderate activity min / week',
      activityLevel: 'Usual activity (for TDEE)',
      glucose: 'Glucose status',
      lipids: 'Lipid status',
    },
    yes: 'Yes',
    no: 'No',
    select: 'Select',
    male: 'Male',
    female: 'Female',
    north: 'North',
    south: 'South',
    urban: 'Urban',
    rural: 'Rural',
    mmol: 'mmol/L',
    mgdl: 'mg/dL',
    familyNone: 'None',
    familySecond: '2nd degree',
    familyFirst: '1st degree',
    dietPoor: 'Poor',
    dietFair: 'Fair',
    dietGood: 'Good',
    dietExcellent: 'Excellent',
    nicNever: 'Never',
    nicFormer: 'Quit >1 year',
    nicRecent: 'Quit <1 year',
    nicCurrent: 'Current',
    actSed: 'Sedentary',
    actLight: 'Light',
    actMod: 'Moderate',
    actActive: 'Active',
    actVery: 'Very active',
    gluNormal: 'Normal',
    gluUnknown: 'Unknown',
    gluPre: 'Prediabetes',
    gluDm: 'Diabetes',
    lipOpt: 'Optimal',
    lipUnknown: 'Unknown',
    lipMid: 'Borderline',
    lipHigh: 'High',
  },
}

COPY.ar = COPY.en

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

export default function RiskAssessments() {
  const { lang } = useLocale()
  const t = COPY[lang] || COPY.zh
  const { user, loading, getToken } = useAuth()
  const [params, setParams] = useSearchParams()
  const tool = TOOLS.includes(params.get('tool')) ? params.get('tool') : 'china_par'
  const [shared, setShared] = useState(EMPTY_SHARED)
  const [par, setPar] = useState(EMPTY_PAR_EXTRA)
  const [dm, setDm] = useState(EMPTY_DM_EXTRA)
  const [life, setLife] = useState(EMPTY_LIFE_EXTRA)
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
  const parResult = useMemo(() => computeChinaPar(parInput), [parInput])
  const dmResult = useMemo(() => computeDiabetesBundle(dmInput), [dmInput])
  const lifeResult = useMemo(() => computeLifestyle(lifeInput), [lifeInput])

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

      <div className="risk-tabs" role="tablist">
        {TOOLS.map((id) => (
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
          <form
            className="risk-form risk-form--specific"
            onSubmit={(e) => {
              e.preventDefault()
              save('china_par', parInput)
            }}
          >
            <SectionHead
              badge={t.specificTag}
              title={t.extras.china_par.title}
              lead={t.extras.china_par.lead}
              variant="specific"
            />
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
            <div className="risk-actions">
              <button type="submit" className="btn-primary" disabled={busy || !parResult.ok}>{busy ? t.saving : t.save}</button>
            </div>
          </form>
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
          <form
            className="risk-form risk-form--specific"
            onSubmit={(e) => {
              e.preventDefault()
              save('diabetes', dmInput)
            }}
          >
            <SectionHead
              badge={t.specificTag}
              title={t.extras.diabetes.title}
              lead={t.extras.diabetes.lead}
              variant="specific"
            />
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
            <div className="risk-actions">
              <button type="submit" className="btn-primary" disabled={busy || !dmResult.ok}>{busy ? t.saving : t.save}</button>
            </div>
          </form>
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
          <form
            className="risk-form risk-form--specific"
            onSubmit={(e) => {
              e.preventDefault()
              save('lifestyle', lifeInput)
            }}
          >
            <SectionHead
              badge={t.specificTag}
              title={t.extras.lifestyle.title}
              lead={t.extras.lifestyle.lead}
              variant="specific"
            />
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
            <div className="risk-actions">
              <button type="submit" className="btn-primary" disabled={busy || !lifeResult.ok}>{busy ? t.saving : t.save}</button>
            </div>
          </form>
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
    </div>
  )
}
