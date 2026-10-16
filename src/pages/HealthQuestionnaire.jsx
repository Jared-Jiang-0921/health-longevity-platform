import { useEffect, useMemo, useRef, useState } from 'react'
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

function formatTime(value, lang) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const locale = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'zh-CN'
  return d.toLocaleString(locale, {
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
    zh: { loadFail: '问卷加载失败', submitFail: '提交失败', failTitle: '保存失败', savedTitle: '问卷已保存成功', saved: '可返回 AI 长寿师继续咨询，或继续修改后再次保存。', errGoals: '请填写您的健康目标', errConcerns: '请填写当前最关注的问题', errConsent: '提交前请先同意健康数据告知', loadingQ: '正在加载问卷…', title: '健康问卷与敏感健康数据同意', loginFirst: '请先登录后填写问卷。', login: '登录', lead: '用于生成更贴近个人情况的健康建议，也便于后续专业/人工咨询快速了解背景。', back: '返回 AI 长寿方案师', confirmTitle: '填写前请确认', age: '年龄范围', sex: '性别/生理性别', region: '所在国家/地区', goals: '您当前最希望达成的健康目标', concerns: '您当前最关注的问题或症状', history: '既往病史 / 诊断 / 手术史', meds: '正在使用的药物或补充剂', allergies: '过敏史 / 不耐受', life: '生活方式概况', sleep: '睡眠情况', select: '请选择', save: '保存问卷', saving: '保存中…', viewZh: '查看中文健康数据说明', consentHealth: '我已阅读并同意 Health Information & Questionnaire Notice，并同意平台为提供健康建议/服务处理我提交的敏感健康数据。', consentPlan: '我同意平台基于本问卷生成个性化建议、分层方案或人工咨询前置摘要。', consentContact: '我同意平台就本问卷相关服务通过邮箱与我联系。', noticeBefore: '您提交的信息可能包含健康状况、过往病史、用药和生活方式等敏感健康数据。我们会按', noticeDoc: 'Health Information & Questionnaire Notice', noticeAfter: '进行收集、使用与说明。', noticeLang: 'en', ageUnder18: '18岁以下', age18: '18-29岁', age30: '30-39岁', age40: '40-49岁', age50: '50-59岁', age60: '60岁及以上', sexFemale: '女性', sexMale: '男性', sexOther: '其他/不便说明', phRegion: '例如：中国大陆 / UAE / Singapore', phGoals: '例如：体重管理、改善睡眠、提高运动恢复、管理血糖/血脂等', phConcerns: '例如：疲劳、失眠、胃肠不适、情绪压力、运动损伤等', phLife: '饮食、运动频率、吸烟饮酒、工作节律等', phSleep: '入睡时间、睡眠时长、夜醒、白天困倦等' },
    en: { loadFail: 'Failed to load questionnaire', submitFail: 'Submit failed', failTitle: 'Save failed', savedTitle: 'Questionnaire saved', saved: 'You can return to the AI Longevity Coach, or edit and save again.', errGoals: 'Please enter your health goals', errConcerns: 'Please enter your current concerns', errConsent: 'Please agree to the health-data notice before submitting', loadingQ: 'Loading questionnaire…', title: 'Health Questionnaire & Sensitive Data Consent', loginFirst: 'Please login first to complete the questionnaire.', login: 'Login', lead: 'Used to generate more personalized health suggestions and speed up professional consultation.', back: 'Back to AI Longevity Coach', confirmTitle: 'Please confirm before filling', age: 'Age range', sex: 'Sex', region: 'Country/Region', goals: 'Your primary health goals', concerns: 'Current concerns or symptoms', history: 'Medical history / diagnosis / surgery', meds: 'Current medications/supplements', allergies: 'Allergies / intolerance', life: 'Lifestyle overview', sleep: 'Sleep status', select: 'Please select', save: 'Save Questionnaire', saving: 'Saving…', viewZh: 'View Chinese health-data notice', consentHealth: 'I have read and agree to the Health Information & Questionnaire Notice, and consent to processing of my submitted sensitive health data for services.', consentPlan: 'I agree that the platform may generate personalized suggestions, stratified plans, or consultation summaries based on this questionnaire.', consentContact: 'I agree to be contacted by email regarding services related to this questionnaire.', noticeBefore: 'What you submit may include sensitive health data such as conditions, medical history, medicines, and lifestyle. We collect, use, and describe it under the', noticeDoc: 'Health Information & Questionnaire Notice', noticeAfter: '.', noticeLang: 'en', ageUnder18: 'Under 18', age18: '18–29', age30: '30–39', age40: '40–49', age50: '50–59', age60: '60 or older', sexFemale: 'Female', sexMale: 'Male', sexOther: 'Other / prefer not to say', phRegion: 'For example: mainland China / UAE / Singapore', phGoals: 'For example: weight, sleep, exercise recovery, blood glucose or lipids', phConcerns: 'For example: fatigue, insomnia, digestive discomfort, stress, sports injury', phLife: 'Diet, how often you exercise, smoking or alcohol, work schedule', phSleep: 'Bedtime, hours asleep, waking at night, daytime sleepiness' },
    ar: { loadFail: 'فشل تحميل الاستبيان', submitFail: 'فشل الإرسال', failTitle: 'فشل الحفظ', savedTitle: 'تم حفظ الاستبيان', saved: 'يمكنك العودة إلى مدرب طول العمر بالذكاء الاصطناعي، أو التعديل ثم الحفظ مرة أخرى.', errGoals: 'يرجى إدخال أهدافك الصحية', errConcerns: 'يرجى إدخال المشكلات الحالية', errConsent: 'يرجى الموافقة على إشعار البيانات الصحية قبل الإرسال', loadingQ: 'جار تحميل الاستبيان…', title: 'استبيان الصحة وموافقة البيانات الحساسة', loginFirst: 'يرجى تسجيل الدخول أولاً لملء الاستبيان.', login: 'تسجيل الدخول', lead: 'يساعد في تقديم توصيات صحية أكثر تخصيصًا وتسريع الاستشارة.', back: 'العودة إلى مدرب طول العمر بالذكاء الاصطناعي', confirmTitle: 'يرجى التأكيد قبل التعبئة', age: 'الفئة العمرية', sex: 'الجنس', region: 'الدولة/المنطقة', goals: 'أهدافك الصحية الرئيسية', concerns: 'الأعراض أو المشكلات الحالية', history: 'التاريخ الطبي/التشخيص/الجراحة', meds: 'الأدوية/المكملات الحالية', allergies: 'الحساسية/عدم التحمل', life: 'نمط الحياة', sleep: 'حالة النوم', select: 'يرجى الاختيار', save: 'حفظ الاستبيان', saving: 'جار الحفظ…', viewZh: 'عرض النسخة الصينية لإشعار البيانات', consentHealth: 'لقد قرأت ووافقت على إشعار المعلومات الصحية والاستبيان، وأوافق على معالجة بياناتي الصحية الحساسة المقدمة ضمن هذا النموذج.', consentPlan: 'أوافق على أن تنشئ المنصة توصيات مخصصة أو خططًا مرحلية أو ملخصًا قبل الاستشارة بناءً على هذا الاستبيان.', consentContact: 'أوافق على التواصل معي عبر البريد الإلكتروني بشأن الخدمات المرتبطة بهذا الاستبيان.', noticeBefore: 'قد تتضمن المعلومات التي ترسلها بيانات صحية حساسة، مثل الحالة الصحية والتاريخ الطبي والأدوية ونمط الحياة. نجمعها ونوضحها وفق', noticeDoc: 'إشعار المعلومات الصحية والاستبيان', noticeAfter: '.', noticeLang: 'ar', ageUnder18: 'أقل من 18', age18: '18–29', age30: '30–39', age40: '40–49', age50: '50–59', age60: '60 فأكثر', sexFemale: 'أنثى', sexMale: 'ذكر', sexOther: 'آخر / أفضل عدم التحديد', phRegion: 'مثال: الصين / الإمارات / سنغافورة', phGoals: 'مثال: الوزن، النوم، التعافي بعد الرياضة، سكر أو دهون الدم', phConcerns: 'مثال: إرهاق، أرق، انزعاج هضمي، ضغط نفسي، إصابة رياضية', phLife: 'النظام الغذائي، تكرار الرياضة، التدخين أو الكحول، إيقاع العمل', phSleep: 'وقت النوم، عدد الساعات، الاستيقاظ ليلاً، النعاس نهاراً' },
  }[lang || 'zh']
  const { user, loading, getToken } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [latestAt, setLatestAt] = useState('')
  const statusRef = useRef(null)
  const goalsRef = useRef(null)

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

  useEffect(() => {
    if (!message && !error) return
    statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [message, error])

  const onChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!String(form.goals || '').trim()) {
      setError(t.errGoals)
      goalsRef.current?.focus()
      return
    }
    if (!String(form.concerns || '').trim()) {
      setError(t.errConcerns)
      return
    }
    if (!form.consentHealthData) {
      setError(t.errConsent)
      return
    }
    setBusy(true)
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
          {t.noticeBefore}{' '}
          <Link to={`/legal/health-data?lang=${t.noticeLang}`} target="_blank" rel="noreferrer">{t.noticeDoc}</Link>
          {t.noticeAfter}
        </p>
        <p className="health-questionnaire-muted">
          {p.legalVersion(SITE_LEGAL.lastUpdated)} {latestAt ? `· ${p.latestSavedAt(formatTime(latestAt, lang))}` : ''}
        </p>
        {message ? (
          <div className="health-questionnaire-status health-questionnaire-status--ok" role="status">
            <strong>{t.savedTitle}</strong>
            <p>{message}</p>
          </div>
        ) : null}
      </section>

      <form className="health-questionnaire-form" onSubmit={submit}>
        <div className="health-questionnaire-grid">
          <label>
            <span>{t.age}</span>
            <select value={form.ageRange} onChange={onChange('ageRange')}>
              <option value="">{t.select}</option>
              <option value="under_18">{t.ageUnder18}</option>
              <option value="18_29">{t.age18}</option>
              <option value="30_39">{t.age30}</option>
              <option value="40_49">{t.age40}</option>
              <option value="50_59">{t.age50}</option>
              <option value="60_plus">{t.age60}</option>
            </select>
          </label>
          <label>
            <span>{t.sex}</span>
            <select value={form.sex} onChange={onChange('sex')}>
              <option value="">{t.select}</option>
              <option value="female">{t.sexFemale}</option>
              <option value="male">{t.sexMale}</option>
              <option value="other">{t.sexOther}</option>
            </select>
          </label>
        </div>

        <label>
          <span>{t.region}</span>
          <input value={form.region} onChange={onChange('region')} placeholder={t.phRegion} />
        </label>

        <label>
          <span>{t.goals}</span>
          <textarea
            ref={goalsRef}
            value={form.goals}
            onChange={onChange('goals')}
            rows={4}
            placeholder={t.phGoals}
          />
        </label>

        <label>
          <span>{t.concerns}</span>
          <textarea value={form.concerns} onChange={onChange('concerns')} rows={4} placeholder={t.phConcerns} />
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
            <textarea value={form.lifestyle} onChange={onChange('lifestyle')} rows={4} placeholder={t.phLife} />
          </label>
          <label>
            <span>{t.sleep}</span>
            <textarea value={form.sleep} onChange={onChange('sleep')} rows={4} placeholder={t.phSleep} />
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

        {error || message ? (
          <div
            ref={statusRef}
            className={`health-questionnaire-status ${error ? 'health-questionnaire-status--error' : 'health-questionnaire-status--ok'}`}
            role="status"
            aria-live="polite"
          >
            <strong>{error ? t.failTitle : t.savedTitle}</strong>
            <p>{error || message}</p>
            {message ? (
              <Link to="/solutions" className="health-questionnaire-status-link">{t.back}</Link>
            ) : null}
          </div>
        ) : null}

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
