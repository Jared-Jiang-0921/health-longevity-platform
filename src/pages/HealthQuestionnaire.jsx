import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getPatterns } from '../i18n/patterns'
import { SITE_LEGAL } from '../data/siteLegal'
import './HealthQuestionnaire.css'

const INITIAL_FORM = {
  ageRange: '',
  sex: '',
  region: '',
  goals: '',
  concerns: '',
  medicalHistory: '',
  medications: '',
  allergies: '',
  lifestyle: '',
  sleep: '',
  consentHealthData: false,
  consentCarePlan: false,
  consentContact: false,
}

function formatTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HealthQuestionnaire() {
  const { lang } = useLocale()
  const p = getPatterns(lang)
  const t = {
    zh: { loadFail: '问卷加载失败', submitFail: '提交失败', saved: '问卷已保存，可继续进入综合长寿方案或后续人工评估。', loadingQ: '正在加载问卷…', title: '健康问卷与敏感健康数据同意', loginFirst: '请先登录后填写问卷。', login: '登录', lead: '用于生成更贴近个人情况的健康建议，也便于后续专业/人工咨询快速了解背景。', back: '返回综合长寿方案', confirmTitle: '填写前请确认', age: '年龄范围', sex: '性别/生理性别', region: '所在国家/地区', goals: '您当前最希望达成的健康目标', concerns: '您当前最关注的问题或症状', history: '既往病史 / 诊断 / 手术史', meds: '正在使用的药物或补充剂', allergies: '过敏史 / 不耐受', life: '生活方式概况', sleep: '睡眠情况', select: '请选择', save: '保存问卷', saving: '保存中…', viewZh: '查看中文健康数据说明', consentHealth: '我已阅读并同意 Health Information & Questionnaire Notice，并同意平台为提供健康建议/服务处理我提交的敏感健康数据。', consentPlan: '我同意平台基于本问卷生成个性化建议、分层方案或人工咨询前置摘要。', consentContact: '我同意平台就本问卷相关服务通过邮箱与我联系。' },
    en: { loadFail: 'Failed to load questionnaire', submitFail: 'Submit failed', saved: 'Questionnaire saved. You can continue to solutions or human consultation.', loadingQ: 'Loading questionnaire…', title: 'Health Questionnaire & Sensitive Data Consent', loginFirst: 'Please login first to complete the questionnaire.', login: 'Login', lead: 'Used to generate more personalized health suggestions and speed up professional consultation.', back: 'Back to Solutions', confirmTitle: 'Please confirm before filling', age: 'Age range', sex: 'Sex', region: 'Country/Region', goals: 'Your primary health goals', concerns: 'Current concerns or symptoms', history: 'Medical history / diagnosis / surgery', meds: 'Current medications/supplements', allergies: 'Allergies / intolerance', life: 'Lifestyle overview', sleep: 'Sleep status', select: 'Please select', save: 'Save Questionnaire', saving: 'Saving…', viewZh: 'View Chinese health-data notice', consentHealth: 'I have read and agree to the Health Information & Questionnaire Notice, and consent to processing of my submitted sensitive health data for services.', consentPlan: 'I agree that the platform may generate personalized suggestions, stratified plans, or consultation summaries based on this questionnaire.', consentContact: 'I agree to be contacted by email regarding services related to this questionnaire.' },
    ar: { loadFail: 'فشل تحميل الاستبيان', submitFail: 'فشل الإرسال', saved: 'تم حفظ الاستبيان. يمكنك متابعة الحلول أو الاستشارة البشرية.', loadingQ: 'جار تحميل الاستبيان…', title: 'استبيان الصحة وموافقة البيانات الحساسة', loginFirst: 'يرجى تسجيل الدخول أولاً لملء الاستبيان.', login: 'تسجيل الدخول', lead: 'يساعد في تقديم توصيات صحية أكثر تخصيصًا وتسريع الاستشارة.', back: 'العودة إلى الحلول', confirmTitle: 'يرجى التأكيد قبل التعبئة', age: 'الفئة العمرية', sex: 'الجنس', region: 'الدولة/المنطقة', goals: 'أهدافك الصحية الرئيسية', concerns: 'الأعراض أو المشكلات الحالية', history: 'التاريخ الطبي/التشخيص/الجراحة', meds: 'الأدوية/المكملات الحالية', allergies: 'الحساسية/عدم التحمل', life: 'نمط الحياة', sleep: 'حالة النوم', select: 'يرجى الاختيار', save: 'حفظ الاستبيان', saving: 'جار الحفظ…', viewZh: 'عرض النسخة الصينية لإشعار البيانات', consentHealth: 'لقد قرأت ووافقت على إشعار المعلومات الصحية والاستبيان، وأوافق على معالجة بياناتي الصحية الحساسة المقدمة ضمن هذا النموذج.', consentPlan: 'أوافق على أن تنشئ المنصة توصيات مخصصة أو خططًا مرحلية أو ملخصًا قبل الاستشارة بناءً على هذا الاستبيان.', consentContact: 'أوافق على التواصل معي عبر البريد الإلكتروني بشأن الخدمات المرتبطة بهذا الاستبيان.' },
  }[lang || 'zh']
  const { user, loading, getToken } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [latestAt, setLatestAt] = useState('')

  const loggedIn = useMemo(() => Boolean(user && getToken()), [getToken, user])

  useEffect(() => {
    if (!loggedIn) return

    let cancelled = false
    const load = async () => {
      setError('')
      try {
        const res = await fetch('/api/health-questionnaire', {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || t.loadFail)
        if (cancelled || !data.submission) return
        setForm({
          ageRange: data.submission.age_range || '',
          sex: data.submission.sex || '',
          region: data.submission.region || '',
          goals: data.submission.goals || '',
          concerns: data.submission.concerns || '',
          medicalHistory: data.submission.medical_history || '',
          medications: data.submission.medications || '',
          allergies: data.submission.allergies || '',
          lifestyle: data.submission.lifestyle || '',
          sleep: data.submission.sleep || '',
          consentHealthData: Boolean(data.submission.consent_health_data),
          consentCarePlan: Boolean(data.submission.consent_care_plan),
          consentContact: Boolean(data.submission.consent_contact),
        })
        setLatestAt(data.submission.updated_at || data.submission.created_at || '')
      } catch (e) {
        if (!cancelled) setError(e.message || t.loadFail)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [getToken, loggedIn])

  const onChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/health-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t.submitFail)
      setLatestAt(data.createdAt || new Date().toISOString())
      setMessage(t.saved)
    } catch (err) {
      setError(err.message || t.submitFail)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="page-content health-questionnaire-page">
        <p className="health-questionnaire-muted">{t.loadingQ}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content health-questionnaire-page">
        <h1>{t.title}</h1>
        <p>{t.loginFirst}</p>
        <p>
          <Link to="/login" className="btn-primary">{t.login}</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page-content health-questionnaire-page">
      <div className="health-questionnaire-header">
        <div>
          <h1>{t.title}</h1>
          <p className="health-questionnaire-lead">
            {t.lead}
          </p>
        </div>
        <Link to="/solutions" className="btn-secondary">{t.back}</Link>
      </div>

      <section className="health-questionnaire-notice">
        <h2>{t.confirmTitle}</h2>
        <p>
          您提交的信息可能包含健康状况、过往病史、用药和生活方式等敏感健康数据。
          我们会按 <Link to="/legal/health-data?lang=en" target="_blank" rel="noreferrer">Health Information & Questionnaire Notice</Link>
          进行收集、使用与说明。
        </p>
        <p className="health-questionnaire-muted">
          {p.legalVersion(SITE_LEGAL.lastUpdated)} {latestAt ? `· ${p.latestSavedAt(formatTime(latestAt))}` : ''}
        </p>
      </section>

      <form className="health-questionnaire-form" onSubmit={submit}>
        <div className="health-questionnaire-grid">
          <label>
            <span>{t.age}</span>
            <select value={form.ageRange} onChange={onChange('ageRange')}>
              <option value="">{t.select}</option>
              <option value="under_18">18岁以下</option>
              <option value="18_29">18-29岁</option>
              <option value="30_39">30-39岁</option>
              <option value="40_49">40-49岁</option>
              <option value="50_59">50-59岁</option>
              <option value="60_plus">60岁及以上</option>
            </select>
          </label>
          <label>
            <span>{t.sex}</span>
            <select value={form.sex} onChange={onChange('sex')}>
              <option value="">{t.select}</option>
              <option value="female">女性</option>
              <option value="male">男性</option>
              <option value="other">其他/不便说明</option>
            </select>
          </label>
        </div>

        <label>
          <span>{t.region}</span>
          <input value={form.region} onChange={onChange('region')} placeholder="例如：中国大陆 / UAE / Singapore" />
        </label>

        <label>
          <span>{t.goals}</span>
          <textarea value={form.goals} onChange={onChange('goals')} rows={4} placeholder="例如：体重管理、改善睡眠、提高运动恢复、管理血糖/血脂等" />
        </label>

        <label>
          <span>{t.concerns}</span>
          <textarea value={form.concerns} onChange={onChange('concerns')} rows={4} placeholder="例如：疲劳、失眠、胃肠不适、情绪压力、运动损伤等" />
        </label>

        <label>
          <span>{t.history}</span>
          <textarea value={form.medicalHistory} onChange={onChange('medicalHistory')} rows={4} />
        </label>

        <div className="health-questionnaire-grid">
          <label>
            <span>{t.meds}</span>
            <textarea value={form.medications} onChange={onChange('medications')} rows={4} />
          </label>
          <label>
            <span>{t.allergies}</span>
            <textarea value={form.allergies} onChange={onChange('allergies')} rows={4} />
          </label>
        </div>

        <div className="health-questionnaire-grid">
          <label>
            <span>{t.life}</span>
            <textarea value={form.lifestyle} onChange={onChange('lifestyle')} rows={4} placeholder="饮食、运动频率、吸烟饮酒、工作节律等" />
          </label>
          <label>
            <span>{t.sleep}</span>
            <textarea value={form.sleep} onChange={onChange('sleep')} rows={4} placeholder="入睡时间、睡眠时长、夜醒、白天困倦等" />
          </label>
        </div>

        <div className="health-questionnaire-consents">
          <label className="health-questionnaire-consent required">
            <input type="checkbox" checked={form.consentHealthData} onChange={onChange('consentHealthData')} />
            <span>
              {t.consentHealth}
            </span>
          </label>
          <label className="health-questionnaire-consent">
            <input type="checkbox" checked={form.consentCarePlan} onChange={onChange('consentCarePlan')} />
            <span>{t.consentPlan}</span>
          </label>
          <label className="health-questionnaire-consent">
            <input type="checkbox" checked={form.consentContact} onChange={onChange('consentContact')} />
            <span>{t.consentContact}</span>
          </label>
        </div>

        {error ? <p className="health-questionnaire-error">{error}</p> : null}
        {message ? <p className="health-questionnaire-success">{message}</p> : null}

        <div className="health-questionnaire-actions">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? t.saving : t.save}
          </button>
          <Link to="/legal/health-data?lang=zh" className="health-questionnaire-inline-link" target="_blank" rel="noreferrer">
            {t.viewZh}
          </Link>
          <Link to="/legal/health-data?lang=ar" className="health-questionnaire-inline-link" target="_blank" rel="noreferrer">
            Arabic
          </Link>
        </div>
      </form>
    </div>
  )
}
