import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { hasLevelAccess, MEMBERSHIP_LEVELS } from '../data/membership'
import { getPatterns } from '../i18n/patterns'
import { getConsultGeneralUrl, getConsultProfessionalUrl, getContentEntryUrl } from '../config/externalUrls'
import { appendExternalEntryParams } from '../lib/externalEntry'
import './Solutions.css'

const CONSULT_PRO_URL = getConsultProfessionalUrl()
const CONSULT_GENERAL_URL = getConsultGeneralUrl()
const CONTENT_ENTRY_URL = getContentEntryUrl()

const I18N = {
  zh: {
    langKey: 'zh',
    title: 'AI长寿方案师',
    lead: '结合问卷与多维度信息，协助您形成健康画像、识别主要风险，并给出营养、运动、睡眠等方面的综合建议与分阶段行动计划；异常时提示就医。以下为能力范围说明。',
    medicalDisclaimer: '本平台提供健康教育与辅助决策信息，不替代医生诊断、治疗和处方。',
    featuresTitle: '能力范围',
    colFeature: '功能',
    colContent: '内容',
    features: [
      { name: '基础健康画像', detail: '年龄、性别、身高体重、睡眠、运动、饮食、慢病史、家族史' },
      { name: '风险识别', detail: '代谢风险、心血管风险、认知风险、炎症风险、肌少风险' },
      { name: '综合建议', detail: '营养、运动、睡眠、体重、压力、中医体质、体检项目' },
      { name: '报告辅助解读', detail: '血脂、血糖、肝肾功能、维生素D、炎症指标等' },
      { name: '行动计划', detail: '7天、30天、90天健康改善计划' },
      { name: '医生转介提示', detail: '出现异常指标或高风险情况时建议就医' },
    ],
    devSummary: '技术集成说明（可选阅读）',
    devNote:
      '外接咨询双端口跳转 longevityconsult（Manus），链接附带 hl_consult_entry（professional / general）及会员参数；若配置内容入口，附带 hl_channel=content。请在 .env 中配置完整 https URL 后重新构建前端。',
    loading: '正在验证会员身份，请稍候…',
    intakeTitle: '先完善健康问卷',
    intakeLine1: '在使用 AI 长寿方案师相关服务前，建议先填写健康问卷。问卷会记录您的目标、关注问题、病史、用药和生活方式，并与',
    intakeLine2: '的同意流程保持一致。',
    intakeLegalDoc: '健康数据说明',
    intakeBtn: '填写/更新问卷',
    intakeLegal: '查看健康数据说明',
    contentTitle: '内容资源',
    contentBtn: '进入内容',
    contentDesc:
      '与咨询并列的「内容通道」，跳转 longevity 侧内容或知识库页面。链接会附带 hl_channel=content 及与咨询相同的身份参数。',
    queryLabel: '咨询问题（可选）',
    queryPlaceholder: '例如：高级会员如何制定长寿饮食方案？',
    enter: '进入咨询',
    enterAndQuery: '进入并查询',
    openDirectly: '若未自动跳转，请点此直接打开咨询页',
    popupBlocked: '浏览器拦截了新标签页，请点击下方链接打开咨询页',
    linkInvalid: '咨询链接无效，请联系管理员检查配置',
    upgrade: '升级会员',
    proTitle: '专业健康长寿咨询',
    proDesc:
      '面向专业人士，侧重专业知识和技能，涵盖临床医学、基础医学、功能医学、保健医学、运动医学、营养学等。',
    genTitle: '自我健康促进咨询',
    genDesc:
      '面向普通人群，侧重免疫与免疫力、激素与内分泌平衡、神经与情绪心理、睡眠、营养饮食、科学运动等日常生活关注领域。',
  },
  en: {
    langKey: 'en',
    title: 'AI Longevity Coach',
    lead: 'Combines questionnaires and multi-dimensional signals to help you build a health profile, surface key risks, and receive integrated guidance (nutrition, exercise, sleep, etc.) with phased action plans—plus prompts to seek care when appropriate.',
    medicalDisclaimer:
      'This platform provides health education and decision-support information only. It does not replace a physician’s diagnosis, treatment, or prescriptions.',
    featuresTitle: 'What it covers',
    colFeature: 'Area',
    colContent: 'Includes',
    features: [
      { name: 'Baseline profile', detail: 'Age, sex, height/weight, sleep, activity, diet, chronic conditions, family history' },
      { name: 'Risk signals', detail: 'Metabolic, cardiovascular, cognitive, inflammatory, sarcopenia-related' },
      { name: 'Integrated guidance', detail: 'Nutrition, exercise, sleep, weight, stress, TCM constitution patterns, check-up priorities' },
      { name: 'Lab/context support', detail: 'Lipids, glucose, liver/kidney function, vitamin D, inflammatory markers, and more' },
      { name: 'Action plans', detail: '7-, 30-, and 90-day improvement tracks' },
      { name: 'Clinical escalation', detail: 'Prompts to see a clinician when results are abnormal or risk is high' },
    ],
    devSummary: 'Technical integration (optional)',
    devNote:
      'External consult links append hl_consult_entry (professional / general) and membership context; optional content entry uses hl_channel=content. Configure full https URLs in .env and rebuild the frontend.',
    loading: 'Verifying membership…',
    intakeTitle: 'Complete Health Questionnaire First',
    intakeLine1: 'Before using the AI Longevity Coach, please complete the questionnaire. It captures goals, concerns, history, medications, and lifestyle, consistent with the ',
    intakeLine2: ' agreement and consent process.',
    intakeLegalDoc: 'Health Data Notice',
    intakeBtn: 'Fill / Update Questionnaire',
    intakeLegal: 'View Health Data Notice',
    contentTitle: 'Content Resources',
    contentBtn: 'Open Content',
    contentDesc:
      'Parallel “content channel” to consultations; opens your longevity content or knowledge base with hl_channel=content and the same identity context.',
    queryLabel: 'Question (optional)',
    queryPlaceholder: 'e.g. How to design a longevity diet plan?',
    enter: 'Enter Consultation',
    enterAndQuery: 'Enter & Query',
    openDirectly: 'If auto-open fails, click here to open directly',
    popupBlocked: 'Popup was blocked. Please use the direct link below.',
    linkInvalid: 'Consultation URL is invalid. Please contact admin.',
    upgrade: 'Upgrade',
    proTitle: 'Professional longevity consultation',
    proDesc:
      'For professionals—clinical and basic medicine, functional medicine, wellness, sports medicine, nutrition, and related domains.',
    genTitle: 'Self-care longevity consultation',
    genDesc:
      'For the general public—immunity, hormones, mood and sleep, nutrition, structured movement, and everyday risk factors.',
  },
  ar: {
    langKey: 'ar',
    title: 'مدرب طول العمر بالذكاء الاصطناعي',
    lead: 'يجمع الاستبيان ومؤشرات متعددة لمساعدتك على بناء صورة صحية واستخلاص المخاطر وتقديم إرشادات متكاملة وخطط عمل مرحلية، مع تذكير بمراجعة الطبيب عند الحاجة.',
    medicalDisclaimer:
      'تقدم المنصة تعليماً صحياً ومعلومات داعمة للقرار فقط، ولا تحل محل تشخيص أو علاج أو وصفات الطبيب.',
    featuresTitle: 'نطاق القدرات',
    colFeature: 'الوظيفة',
    colContent: 'المحتوى',
    features: [
      { name: 'صورة صحية أساسية', detail: 'العمر والجنس والطول والوزن والنوم والنشاط والغذاء والأمراض المزمنة وتاريخ العائلة' },
      { name: 'تقدير المخاطر', detail: 'أيضي، قلبي، إدراكي، التهابي، وهزال عضلي' },
      { name: 'إرشادات متكاملة', detail: 'تغذية ونشاط ونوم ووزن وضغط وطب صيني تقليدي ومسارات فحص' },
      { name: 'دعم فهم التقارير', detail: 'دهون وسكر ووظائف كبد/كلى وفيتامين د ومؤشرات التهاب وغيرها' },
      { name: 'خطط عمل', detail: 'مسارات 7 و30 و90 يوماً' },
      { name: 'توجيه طبي', detail: 'تنبيه بمراجعة الطبيب عند مؤشرات شاذة أو مخاطر مرتفعة' },
    ],
    devSummary: 'ملاحظات تقنية (اختياري)',
    devNote:
      'روابط الاستشارة الخارجية تضيف hl_consult_entry (احترافي/عام) وسياق العضوية؛ قناة المحتوى تستخدم hl_channel=content. اضبط عناوين https كاملة في .env وأعد بناء الواجهة.',
    loading: 'جار التحقق من العضوية…',
    intakeTitle: 'أكمل الاستبيان الصحي أولاً',
    intakeLine1: 'قبل استخدام مدرب طول العمر بالذكاء الاصطناعي، يُنصح باستكمال الاستبيان. يُسجّل أهدافك ومخاوفك وتاريخك وأدويتك وأسلوب حياتك بما يتوافق مع ',
    intakeLine2: ' وإجراءات الموافقة.',
    intakeLegalDoc: 'إشعار البيانات الصحية',
    intakeBtn: 'تعبئة/تحديث الاستبيان',
    intakeLegal: 'عرض إشعار البيانات الصحية',
    contentTitle: 'موارد المحتوى',
    contentBtn: 'دخول المحتوى',
    contentDesc:
      'قناة محتوى موازية للاستشارات؛ تفتح محتوى طول العمر أو المعرفة مع hl_channel=content ونفس سياق الهوية.',
    queryLabel: 'سؤال الاستشارة (اختياري)',
    queryPlaceholder: 'مثال: كيف أضع خطة غذائية لطول العمر؟',
    enter: 'دخول الاستشارة',
    enterAndQuery: 'ادخل وابحث',
    openDirectly: 'إذا لم يتم الفتح تلقائيًا، اضغط هنا للفتح مباشرة',
    popupBlocked: 'تم حظر فتح تبويب جديد، يرجى استخدام الرابط المباشر أدناه',
    linkInvalid: 'رابط الاستشارة غير صالح، يرجى التواصل مع المسؤول',
    upgrade: 'ترقية العضوية',
    proTitle: 'استشارة طول العمر المهنية',
    proDesc:
      'للمتخصصين: الطب السريري والأساسي والطب الوظيفي والوقاية وطب الرياضة والتغذية وما يتصل بها.',
    genTitle: 'استشارة تعزيز الصحة الذاتية',
    genDesc:
      'للجمهور: المناعة والهرمونات والمزاج والنوم والتغذية والنشاط اليومي.',
  },
}

function ConsultCard({ title, description, url, envHint, requiredLevel, user, consultEntry, t, p, buildConsultHref }) {
  const [query, setQuery] = useState('')
  const [openError, setOpenError] = useState('')
  const ready = Boolean(url?.trim())
  const allowed = hasLevelAccess(user?.level, requiredLevel, { isGuest: !user })
  const href = useMemo(
    () => appendExternalEntryParams(url, user, { consultEntry, query, lang: t.langKey }),
    [url, user, consultEntry, query, t.langKey],
  )
  const [opening, setOpening] = useState(false)
  const openConsult = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault()
    setOpenError('')
    if (!href) {
      setOpenError(t.linkInvalid || '')
      return
    }
    setOpening(true)
    try {
      const finalHref = await buildConsultHref(href, consultEntry)
      const popup = window.open(finalHref, '_blank', 'noopener,noreferrer')
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setOpenError(t.popupBlocked || '')
        return
      }
    } catch {
      setOpenError(t.popupBlocked || '')
    } finally {
      setOpening(false)
    }
  }, [href, t.linkInvalid, t.popupBlocked, buildConsultHref, consultEntry])

  return (
    <article className={`consult-card content-card content-card--padded ${!allowed ? 'consult-card-locked' : ''}`}>
      <h2>{title}</h2>
      <p className="consult-card-desc">{description}</p>
      <label className="consult-query">
        <span>{t.queryLabel}</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.queryPlaceholder}
          disabled={!allowed}
        />
      </label>
      {!allowed ? (
        <div className="consult-card-lock">
          <p className="consult-lock-msg">{p.requiresLevel(MEMBERSHIP_LEVELS[requiredLevel]?.name || requiredLevel)}</p>
          <Link to="/payment" className="consult-card-btn consult-btn-upgrade">{t.upgrade}</Link>
        </div>
      ) : ready ? (
        <>
          <button
            type="button"
            className="consult-card-btn consult-card-btn-block"
            onClick={openConsult}
            disabled={opening}
          >
            {opening ? t.enter : (query.trim() ? t.enterAndQuery : t.enter)}
          </button>
          <a
            className="consult-open-direct"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.openDirectly}
          </a>
        </>
      ) : (
        <p className="consult-card-missing">
          {p.configureEnvVar(envHint)}
        </p>
      )}
      {openError ? <p className="consult-card-missing">{openError}</p> : null}
    </article>
  )
}

export default function Solutions() {
  const { lang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const p = getPatterns(lang)
  const { user, loading, refreshUser, getToken } = useAuth()

  const buildConsultHref = useCallback(async (baseHref, entry) => {
    const token = getToken?.()
    if (!token || !baseHref) return baseHref
    try {
      const res = await fetch('/api/consult-sso-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entry, lang }),
      })
      if (!res.ok) return baseHref
      const data = await res.json().catch(() => ({}))
      const ssoToken = String(data?.token || '').trim()
      if (!ssoToken) return baseHref
      const u = new URL(baseHref, window.location.origin)
      u.searchParams.set('sso_token', ssoToken)
      u.searchParams.set('sso_issuer', 'healthlongevity')
      return /^https?:\/\//i.test(baseHref) ? u.toString() : `${u.pathname}${u.search}${u.hash}`
    } catch {
      return baseHref
    }
  }, [getToken, lang])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <div className="page-solutions">
      <h1>{t.title}</h1>
      <p className="solutions-lead">{t.lead}</p>

      <aside className="solutions-disclaimer" role="note">
        <p>{t.medicalDisclaimer}</p>
      </aside>

      <section className="solutions-features" aria-labelledby="solutions-features-heading">
        <h2 id="solutions-features-heading">{t.featuresTitle}</h2>
        <div className="solutions-table-wrap">
          <table className="solutions-features-table">
            <thead>
              <tr>
                <th scope="col">{t.colFeature}</th>
                <th scope="col">{t.colContent}</th>
              </tr>
            </thead>
            <tbody>
              {t.features.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <details className="solutions-dev-details">
        <summary>{t.devSummary}</summary>
        <p>{t.devNote}</p>
      </details>

      <section className="solutions-intake-card">
        <h2>{t.intakeTitle}</h2>
        <p>
          {t.intakeLine1}
          <Link to={`/legal/health-data?lang=${lang}`}>{t.intakeLegalDoc}</Link>
          {t.intakeLine2}
        </p>
        <div className="solutions-intake-actions">
          <Link to="/health-questionnaire" className="consult-card-btn">{t.intakeBtn}</Link>
          <Link to={`/legal/health-data?lang=${lang}`} className="solutions-intake-link">{t.intakeLegal}</Link>
        </div>
      </section>

      {loading ? (
        <p className="consult-auth-loading" role="status">
          {t.loading}
        </p>
      ) : (
      <>
        {CONTENT_ENTRY_URL ? (
          <section className="solutions-content-channel">
            <h2>{t.contentTitle}</h2>
            <p className="solutions-content-desc">{t.contentDesc}</p>
            <a
              className="consult-card-btn"
              href={appendExternalEntryParams(CONTENT_ENTRY_URL, user, { channel: 'content', lang: t.langKey })}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.contentBtn}
            </a>
          </section>
        ) : null}
        <div className="consult-grid">
          <ConsultCard
            title={t.proTitle}
            description={t.proDesc}
            url={CONSULT_PRO_URL}
            envHint="VITE_CONSULT_PROFESSIONAL_URL（或 VITE_MANUS_PROFESSIONAL_URL）"
            requiredLevel="standard"
            user={user}
            consultEntry="professional"
            t={t}
            p={p}
            buildConsultHref={buildConsultHref}
          />
          <ConsultCard
            title={t.genTitle}
            description={t.genDesc}
            url={CONSULT_GENERAL_URL}
            envHint="VITE_CONSULT_GENERAL_URL 或 VITE_MANUS_SELF_URL（可与专业同址；未填时沿用专业 URL）"
            requiredLevel="free"
            user={user}
            consultEntry="general"
            t={t}
            p={p}
            buildConsultHref={buildConsultHref}
          />
        </div>
      </>
      )}
    </div>
  )
}
