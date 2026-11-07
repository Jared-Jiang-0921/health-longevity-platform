import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { hasLevelAccess } from '../data/membership'
import { getPatterns } from '../i18n/patterns'
import { getMembershipLevelLabel } from '../i18n/terms'
import { getContentEntryUrl } from '../config/externalUrls'
import { appendExternalEntryParams } from '../lib/externalEntry'
import ModulePageHero from '../components/ModulePageHero'
import './Solutions.css'

const CONTENT_ENTRY_URL = getContentEntryUrl()

const I18N = {
  zh: {
    langKey: 'zh',
    title: 'AI长寿方案师',
    lead: '结合问卷与多维度信息，协助您形成健康画像、识别主要风险，并给出营养、运动、睡眠等方面的综合建议与分阶段行动计划；异常时提示就医。以下为能力范围说明。',
    medicalDisclaimer: '本平台提供健康教育与辅助决策信息，不替代医生诊断、治疗和处方。',
    featuresTitle: '能力范围',
    features: [
      { name: '基础健康画像', detail: '年龄、性别、身高体重、睡眠、运动、饮食、慢病史、家族史' },
      { name: '风险识别', detail: '代谢风险、心血管风险、认知风险、炎症风险、肌少风险' },
      { name: '综合建议', detail: '营养、运动、睡眠、体重、压力、中医体质、体检项目' },
      { name: '报告辅助解读', detail: '血脂、血糖、肝肾功能、维生素D、炎症指标等' },
      { name: '行动计划', detail: '7天、30天、90天健康改善计划' },
      { name: '医生转介提示', detail: '出现异常指标或高风险情况时建议就医' },
    ],
    loading: '正在验证会员身份，请稍候…',
    pathLabel: '建议使用顺序',
    step1: '健康问卷',
    step1Hint: '先记录目标、病史、用药和生活方式',
    step2: '评估（可选）',
    step2Hint: '风险与衰老结果供咨询引用',
    step3: '选择咨询',
    step3Hint: '自我健康促进，或专业长寿咨询',
    consultSection: '选择一种咨询',
    consultSectionLead: '两种咨询分开使用，检索范围不同，不能互相替代。自我健康促进面向日常管理；专业咨询面向有医学背景的使用者。',
    toolsTitle: '可选评估',
    toolsLead: '标准会员及以上可用。结果只保存在本账户，咨询时可引用；不连接营养代谢微信小程序。',
    proBadge: '高级会员',
    genBadge: '登录即可',
    needLogin: '请先登录后再进入咨询。',
    login: '登录',
    toolLogin: '请先登录。此评估向标准会员及以上开放。',
    intakeTitle: '先完善健康问卷',
    intakeLine1: '在使用 AI 长寿方案师相关服务前，建议先填写健康问卷。问卷会记录您的目标、关注问题、病史、用药和生活方式，并与',
    intakeLine2: '的同意流程保持一致。',
    intakeLegalDoc: '健康数据说明',
    intakeBtn: '填写/更新问卷',
    intakeLegal: '查看健康数据说明',
    riskTitle: '健康风险评估',
    riskLine: '共同问题只填一次，再按评估做专项：China-PAR 十年心血管、糖尿病筛查、高血压（Framingham）、痴呆（CAIDE）、帕金森相对风险、骨质疏松（OSTA）、肌少症（SARC-F）、生活方式。',
    riskBtn: '开始评估',
    agingTitle: '衰老评估',
    agingLine: '录入血液甲基化报告上的时钟结果：Horvath 与 iCAS 并陈生物学年龄（iCAS 更适合中国人），GrimAge2 看死亡相关风险，DunedinPACE 看衰老速度。本站只解读，不重跑芯片算法。',
    agingBtn: '开始衰老评估',
    contentTitle: '内容资源',
    contentEyebrow: '可选',
    contentBtn: '进入内容',
    contentDesc: '与咨询并列的内容通道，可进入长寿相关内容与知识库。',
    queryLabel: '咨询问题（可选）',
    queryPlaceholder: '例如：高级会员如何制定长寿饮食方案？',
    enter: '进入咨询',
    enterWithQuestion: '带着这个问题进入',
    upgrade: '升级会员',
    proTitle: '专业健康长寿咨询',
    proDesc:
      '面向专业人士。知识库覆盖基础医学、临床医学、功能医学、长寿学等全书；可按需检索 PubMed、Cochrane、欧洲 PMC。仍不替代诊疗与处方。',
    genTitle: '自我健康促进咨询',
    genDesc:
      '面向普通人群。检索生活方式、营养、运动、睡眠、情绪与大众向长寿科普；不含药理、免疫学教材、内外科等专科知识，也不检索 PubMed / Cochrane / 欧洲 PMC。',
  },
  en: {
    langKey: 'en',
    title: 'AI Longevity Coach',
    lead: 'Combines questionnaires and multi-dimensional signals to help you build a health profile, surface key risks, and receive integrated guidance (nutrition, exercise, sleep, etc.) with phased action plans—plus prompts to seek care when appropriate.',
    medicalDisclaimer:
      'This platform provides health education and decision-support information only. It does not replace a physician’s diagnosis, treatment, or prescriptions.',
    featuresTitle: 'What it covers',
    features: [
      { name: 'Baseline profile', detail: 'Age, sex, height/weight, sleep, activity, diet, chronic conditions, family history' },
      { name: 'Risk signals', detail: 'Metabolic, cardiovascular, cognitive, inflammatory, sarcopenia-related' },
      { name: 'Integrated guidance', detail: 'Nutrition, exercise, sleep, weight, stress, TCM constitution patterns, check-up priorities' },
      { name: 'Lab/context support', detail: 'Lipids, glucose, liver/kidney function, vitamin D, inflammatory markers, and more' },
      { name: 'Action plans', detail: '7-, 30-, and 90-day improvement tracks' },
      { name: 'Clinical escalation', detail: 'Prompts to see a clinician when results are abnormal or risk is high' },
    ],
    loading: 'Verifying membership…',
    pathLabel: 'Suggested order',
    step1: 'Questionnaire',
    step1Hint: 'Goals, history, medications, and lifestyle',
    step2: 'Assessments (optional)',
    step2Hint: 'Risk and aging results for consults',
    step3: 'Choose a consult',
    step3Hint: 'Self-care, or professional longevity',
    consultSection: 'Choose one consult',
    consultSectionLead: 'These are separate consults with different sources. Self-care is for everyday health. Professional consult is for people with a medical background.',
    toolsTitle: 'Optional assessments',
    toolsLead: 'Standard members and above. Results stay on this account for consults and are not connected to the nutrition mini-program.',
    proBadge: 'Premium',
    genBadge: 'Sign in to use',
    needLogin: 'Sign in before opening a consultation.',
    login: 'Login',
    toolLogin: 'Please sign in. This assessment is for Standard members and above.',
    intakeTitle: 'Complete the health questionnaire first',
    intakeLine1: 'Before using the AI Longevity Coach, please complete the questionnaire. It captures goals, concerns, history, medications, and lifestyle, consistent with the ',
    intakeLine2: ' agreement and consent process.',
    intakeLegalDoc: 'Health Data Notice',
    intakeBtn: 'Fill / Update Questionnaire',
    intakeLegal: 'View Health Data Notice',
    riskTitle: 'Health risk assessments',
    riskLine: 'Shared questions are asked once, then each tool adds its own items: China-PAR, diabetes screening, Framingham hypertension, CAIDE dementia, Parkinson relative risk, OSTA, SARC-F, and lifestyle.',
    riskBtn: 'Start assessments',
    agingTitle: 'Aging clocks',
    agingLine: 'Enter lab-reported clocks: Horvath and iCAS for biological age (iCAS is marked as better suited to Chinese adults), GrimAge2 for mortality-related age, and DunedinPACE for pace of aging. This site interprets reports; it does not rerun arrays.',
    agingBtn: 'Start aging assessment',
    contentTitle: 'Content resources',
    contentEyebrow: 'Optional',
    contentBtn: 'Open content',
    contentDesc: 'A content channel alongside consultation—open longevity materials or the knowledge base.',
    queryLabel: 'Question (optional)',
    queryPlaceholder: 'e.g. How to design a longevity diet plan?',
    enter: 'Enter consultation',
    enterWithQuestion: 'Continue with this question',
    upgrade: 'Upgrade',
    proTitle: 'Professional longevity consultation',
    proDesc:
      'For professionals. Full knowledge base: basic, clinical, functional, and longevity medicine. Optional PubMed, Cochrane, and Europe PMC. Not a substitute for diagnosis or prescriptions.',
    genTitle: 'Self-care longevity consultation',
    genDesc:
      'For the general public. Lifestyle, nutrition, movement, sleep, and popular longevity sources. No specialty textbooks and no PubMed / Cochrane / Europe PMC.',
  },
  ar: {
    langKey: 'ar',
    title: 'مدرب طول العمر بالذكاء الاصطناعي',
    lead: 'يجمع الاستبيان ومؤشرات متعددة لمساعدتك على بناء صورة صحية واستخلاص المخاطر وتقديم إرشادات متكاملة وخطط عمل مرحلية، مع تذكير بمراجعة الطبيب عند الحاجة.',
    medicalDisclaimer:
      'تقدم المنصة تعليماً صحياً ومعلومات داعمة للقرار فقط، ولا تحل محل تشخيص أو علاج أو وصفات الطبيب.',
    featuresTitle: 'نطاق القدرات',
    features: [
      { name: 'صورة صحية أساسية', detail: 'العمر والجنس والطول والوزن والنوم والنشاط والغذاء والأمراض المزمنة وتاريخ العائلة' },
      { name: 'تقدير المخاطر', detail: 'أيضي، قلبي، إدراكي، التهابي، وهزال عضلي' },
      { name: 'إرشادات متكاملة', detail: 'تغذية ونشاط ونوم ووزن وضغط وطب صيني تقليدي ومسارات فحص' },
      { name: 'دعم فهم التقارير', detail: 'دهون وسكر ووظائف كبد/كلى وفيتامين د ومؤشرات التهاب وغيرها' },
      { name: 'خطط عمل', detail: 'مسارات 7 و30 و90 يوماً' },
      { name: 'توجيه طبي', detail: 'تنبيه بمراجعة الطبيب عند مؤشرات شاذة أو مخاطر مرتفعة' },
    ],
    loading: 'جار التحقق من العضوية…',
    pathLabel: 'الترتيب المقترح',
    step1: 'الاستبيان الصحي',
    step1Hint: 'الأهداف والتاريخ والأدوية ونمط الحياة',
    step2: 'تقييمات اختيارية',
    step2Hint: 'نتائج المخاطر والشيخوخة للاستشارة',
    step3: 'اختر استشارة',
    step3Hint: 'تعزيز الصحة الذاتية أو الاستشارة المهنية',
    consultSection: 'اختر نوع الاستشارة',
    consultSectionLead: 'الاستشارتان منفصلتان ومصادرهما مختلفة. تعزيز الصحة الذاتية للإدارة اليومية، والاستشارة المهنية لمن لديهم خلفية طبية.',
    toolsTitle: 'تقييمات اختيارية',
    toolsLead: 'للأعضاء القياسيين فأعلى. تُحفظ النتائج في هذا الحساب للاستشارة، دون ارتباط بالبرنامج المصغر.',
    proBadge: 'عضو مميز',
    genBadge: 'بعد تسجيل الدخول',
    needLogin: 'يرجى تسجيل الدخول قبل فتح الاستشارة.',
    login: 'تسجيل الدخول',
    toolLogin: 'يرجى تسجيل الدخول. هذا التقييم للأعضاء القياسيين فأعلى.',
    intakeTitle: 'أكمل الاستبيان الصحي أولاً',
    intakeLine1: 'قبل استخدام مدرب طول العمر بالذكاء الاصطناعي، يُنصح باستكمال الاستبيان. يُسجّل أهدافك ومخاوفك وتاريخك وأدويتك وأسلوب حياتك بما يتوافق مع ',
    intakeLine2: ' وإجراءات الموافقة.',
    intakeLegalDoc: 'إشعار البيانات الصحية',
    intakeBtn: 'تعبئة/تحديث الاستبيان',
    intakeLegal: 'عرض إشعار البيانات الصحية',
    riskTitle: 'تقييم المخاطر الصحية',
    riskLine: 'تُسأل الأسئلة المشتركة مرة واحدة، ثم أدوات China-PAR والسكري وضغط الدم والخرف وباركنسون وهشاشة العظام وضمور العضلات ونمط الحياة.',
    riskBtn: 'بدء التقييم',
    agingTitle: 'تقييم الشيخوخة',
    agingLine: 'أدخل نتائج الساعات من تقرير مثيلة الحمض النووي: Horvath وiCAS للعمر البيولوجي (iCAS أنسب للبالغين الصينيين)، GrimAge2 لخطر الوفاة، وDunedinPACE لسرعة الشيخوخة. الموقع يفسر التقرير ولا يعيد حساب الرقاقة.',
    agingBtn: 'بدء تقييم الشيخوخة',
    contentTitle: 'موارد المحتوى',
    contentEyebrow: 'اختياري',
    contentBtn: 'دخول المحتوى',
    contentDesc: 'قناة محتوى موازية للاستشارات لفتح مواد طول العمر أو قاعدة المعرفة.',
    queryLabel: 'سؤال الاستشارة (اختياري)',
    queryPlaceholder: 'مثال: كيف أضع خطة غذائية لطول العمر؟',
    enter: 'دخول الاستشارة',
    enterWithQuestion: 'المتابعة بهذا السؤال',
    upgrade: 'ترقية العضوية',
    proTitle: 'استشارة طول العمر المهنية',
    proDesc:
      'للمتخصصين: قاعدة المعرفة كاملة (الطب الأساسي والسريري والوظيفي وعلوم طول العمر)، مع خيار PubMed وCochrane وEurope PMC. لا يغني عن التشخيص أو الوصفات.',
    genTitle: 'استشارة تعزيز الصحة الذاتية',
    genDesc:
      'للجمهور: نمط الحياة والتغذية والحركة والنوم وطول العمر الموجّه للعامة. بدون كتب تخصصية وبدون PubMed / Cochrane / Europe PMC.',
  },
}

function ConsultCard({ title, description, badge, requiredLevel, consultEntry, user, t, p, lang }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const signedIn = Boolean(user)
  const allowed = signedIn && (
    requiredLevel === 'free' || hasLevelAccess(user.level, requiredLevel, { isGuest: false })
  )

  const openConsult = useCallback(() => {
    const sp = new URLSearchParams()
    sp.set('entry', consultEntry)
    if (query.trim()) sp.set('q', query.trim())
    navigate(`/consult?${sp.toString()}`)
  }, [consultEntry, navigate, query])

  return (
    <article className={`consult-card content-card content-card--padded ${signedIn && !allowed ? 'consult-card-locked' : ''}`}>
      <div className="consult-card-head">
        <h3>{title}</h3>
        <span className={`consult-level-badge ${signedIn && !allowed ? 'is-locked' : ''}`}>{badge}</span>
      </div>
      <p className="consult-card-desc">{description}</p>
      {!signedIn ? (
        <div className="consult-card-lock">
          <p className="consult-lock-msg">{t.needLogin}</p>
          <Link
            to="/login"
            state={{ from: { pathname: '/consult', search: `?entry=${consultEntry}` } }}
            className="consult-card-btn consult-card-btn-block"
          >
            {t.login}
          </Link>
        </div>
      ) : !allowed ? (
        <div className="consult-card-lock">
          <p className="consult-lock-msg">{p.requiresLevel(getMembershipLevelLabel(requiredLevel, lang))}</p>
          <Link
            to={requiredLevel === 'premium' ? '/payment?plan=premium_monthly' : '/payment?plan=standard_monthly'}
            className="consult-card-btn consult-btn-upgrade consult-card-btn-block"
          >
            {t.upgrade}
          </Link>
        </div>
      ) : (
        <>
          <label className="consult-query">
            <span>{t.queryLabel}</span>
            <textarea
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.queryPlaceholder}
            />
          </label>
          <button
            type="button"
            className="consult-card-btn consult-card-btn-block"
            onClick={openConsult}
          >
            {query.trim() ? t.enterWithQuestion : t.enter}
          </button>
        </>
      )}
    </article>
  )
}

function ToolCard({ title, line, href, actionLabel, allowed, loading, user, t, p, lang }) {
  return (
    <section className={`solutions-intake-card ${user && !allowed ? 'consult-card-locked' : ''}`}>
      <h3>{title}</h3>
      <p>{line}</p>
      <div className="solutions-intake-actions">
        {loading ? (
          <p className="consult-lock-msg" role="status">{t.loading}</p>
        ) : !user ? (
          <>
            <p className="consult-lock-msg">{t.toolLogin}</p>
            <Link to="/login" state={{ from: { pathname: href } }} className="consult-card-btn">{t.login}</Link>
          </>
        ) : allowed ? (
          <Link to={href} className="consult-card-btn">{actionLabel}</Link>
        ) : (
          <>
            <p className="consult-lock-msg">{p.requiresLevel(getMembershipLevelLabel('standard', lang))}</p>
            <Link to="/payment?plan=standard_monthly" className="consult-card-btn consult-btn-upgrade">{t.upgrade}</Link>
          </>
        )}
      </div>
    </section>
  )
}

export default function Solutions() {
  const { lang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const p = getPatterns(lang)
  const { user, loading, refreshUser } = useAuth()
  const riskAllowed = hasLevelAccess(user?.level, 'standard', { isGuest: !user })

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <div className="page-solutions">
      <ModulePageHero path="/solutions" title={t.title}>
        <p className="module-page-hero-line">{t.lead}</p>
      </ModulePageHero>

      <aside className="solutions-disclaimer page-callout page-callout--warn" role="note">
        <p>{t.medicalDisclaimer}</p>
      </aside>

      <ol className="solutions-path" aria-label={t.pathLabel}>
        <li>
          <span className="solutions-path-index">1</span>
          <strong>{t.step1}</strong>
          <p>{t.step1Hint}</p>
        </li>
        <li>
          <span className="solutions-path-index">2</span>
          <strong>{t.step2}</strong>
          <p>{t.step2Hint}</p>
        </li>
        <li>
          <span className="solutions-path-index">3</span>
          <strong>{t.step3}</strong>
          <p>{t.step3Hint}</p>
        </li>
      </ol>

      <section className="solutions-intake-card solutions-intake-card--primary">
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

      <section className="solutions-block" aria-labelledby="solutions-consult-heading">
        <div className="solutions-section-head">
          <h2 id="solutions-consult-heading">{t.consultSection}</h2>
          <p>{t.consultSectionLead}</p>
        </div>
        {loading ? (
          <p className="consult-auth-loading" role="status">{t.loading}</p>
        ) : (
          <div className="consult-grid">
            <ConsultCard
              title={t.genTitle}
              description={t.genDesc}
              badge={t.genBadge}
              requiredLevel="free"
              user={user}
              consultEntry="general"
              t={t}
              p={p}
              lang={lang}
            />
            <ConsultCard
              title={t.proTitle}
              description={t.proDesc}
              badge={t.proBadge}
              requiredLevel="premium"
              user={user}
              consultEntry="professional"
              t={t}
              p={p}
              lang={lang}
            />
          </div>
        )}
      </section>

      <section className="solutions-block" aria-labelledby="solutions-tools-heading">
        <div className="solutions-section-head">
          <h2 id="solutions-tools-heading">{t.toolsTitle}</h2>
          <p>{t.toolsLead}</p>
        </div>
        <div className="solutions-tools-grid">
          <ToolCard
            title={t.riskTitle}
            line={t.riskLine}
            href="/solutions/risk"
            actionLabel={t.riskBtn}
            allowed={riskAllowed}
            loading={loading}
            user={user}
            t={t}
            p={p}
            lang={lang}
          />
          <ToolCard
            title={t.agingTitle}
            line={t.agingLine}
            href="/solutions/aging"
            actionLabel={t.agingBtn}
            allowed={riskAllowed}
            loading={loading}
            user={user}
            t={t}
            p={p}
            lang={lang}
          />
        </div>
      </section>

      <section className="solutions-features" aria-labelledby="solutions-features-heading">
        <h2 id="solutions-features-heading">{t.featuresTitle}</h2>
        <ul className="solutions-features-grid">
          {t.features.map((row) => (
            <li key={row.name}>
              <strong>{row.name}</strong>
              <p>{row.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {CONTENT_ENTRY_URL ? (
        <section className="solutions-content-channel">
          <p className="solutions-eyebrow">{t.contentEyebrow}</p>
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
    </div>
  )
}
