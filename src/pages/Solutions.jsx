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
/** 未单独配置自我咨询页时，与专业咨询同址（常见：同一 Manus 项目两条入口），由 hl_consult_entry 区分 */
const CONSULT_GENERAL_URL = getConsultGeneralUrl()
/** 可选：longevity 内容 / 知识库 H5 */
const CONTENT_ENTRY_URL = getContentEntryUrl()

const I18N = {
  zh: {
    langKey: 'zh',
    title: '综合长寿方案',
    loading: '正在验证会员身份，请稍候…',
    intakeTitle: '先完善健康问卷',
    intakeBtn: '填写/更新问卷',
    intakeLegal: '查看健康数据说明',
    contentTitle: '内容资源',
    contentBtn: '进入内容',
    queryLabel: '咨询问题（可选）',
    queryPlaceholder: '例如：高级会员如何制定长寿饮食方案？',
    enter: '进入咨询',
    enterAndQuery: '进入并查询',
    openDirectly: '若未自动跳转，请点此直接打开咨询页',
    popupBlocked: '浏览器拦截了新标签页，请点击下方链接打开咨询页',
    linkInvalid: '咨询链接无效，请联系管理员检查配置',
    upgrade: '升级会员',
  },
  en: {
    langKey: 'en',
    title: 'Integrated Longevity Solutions',
    loading: 'Verifying membership…',
    intakeTitle: 'Complete Health Questionnaire First',
    intakeBtn: 'Fill / Update Questionnaire',
    intakeLegal: 'View Health Data Notice',
    contentTitle: 'Content Resources',
    contentBtn: 'Open Content',
    queryLabel: 'Question (optional)',
    queryPlaceholder: 'e.g. How to design a longevity diet plan?',
    enter: 'Enter Consultation',
    enterAndQuery: 'Enter & Query',
    openDirectly: 'If auto-open fails, click here to open directly',
    popupBlocked: 'Popup was blocked. Please use the direct link below.',
    linkInvalid: 'Consultation URL is invalid. Please contact admin.',
    upgrade: 'Upgrade',
  },
  ar: {
    langKey: 'ar',
    title: 'حلول طول العمر المتكاملة',
    loading: 'جار التحقق من العضوية…',
    intakeTitle: 'أكمل الاستبيان الصحي أولاً',
    intakeBtn: 'تعبئة/تحديث الاستبيان',
    intakeLegal: 'عرض إشعار البيانات الصحية',
    contentTitle: 'موارد المحتوى',
    contentBtn: 'دخول المحتوى',
    queryLabel: 'سؤال الاستشارة (اختياري)',
    queryPlaceholder: 'مثال: كيف أضع خطة غذائية لطول العمر؟',
    enter: 'دخول الاستشارة',
    enterAndQuery: 'ادخل وابحث',
    openDirectly: 'إذا لم يتم الفتح تلقائيًا، اضغط هنا للفتح مباشرة',
    popupBlocked: 'تم حظر فتح تبويب جديد، يرجى استخدام الرابط المباشر أدناه',
    linkInvalid: 'رابط الاستشارة غير صالح، يرجى التواصل مع المسؤول',
    upgrade: 'ترقية العضوية',
  },
}

function ConsultCard({ title, description, url, envHint, requiredLevel, user, consultEntry, t, p }) {
  const [query, setQuery] = useState('')
  const [openError, setOpenError] = useState('')
  const ready = Boolean(url?.trim())
  const allowed = hasLevelAccess(user?.level, requiredLevel)
  const href = useMemo(
    () => appendExternalEntryParams(url, user, { consultEntry, query, lang: t.langKey }),
    [url, user, consultEntry, query, t.langKey],
  )
  const openConsult = useCallback((e) => {
    if (e?.preventDefault) e.preventDefault()
    setOpenError('')
    if (!href) {
      setOpenError(t.linkInvalid || '咨询链接无效，请联系管理员检查配置。')
      return
    }
    try {
      const popup = window.open(href, '_blank', 'noopener,noreferrer')
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setOpenError(t.popupBlocked || '浏览器拦截了新标签页，请点击下方链接打开咨询页。')
        return
      }
    } catch {
      setOpenError(t.popupBlocked || '浏览器拦截了新标签页，请点击下方链接打开咨询页。')
    }
  }, [href, t.linkInvalid, t.popupBlocked])

  return (
    <article className={`consult-card ${!allowed ? 'consult-card-locked' : ''}`}>
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
          >
            {query.trim() ? t.enterAndQuery : t.enter}
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
  const { user, loading, refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <div className="page-solutions">
      <h1>{t.title}</h1>
      <p className="subtitle">
        咨询双端口跳转 longevityconsult（Manus），链接附带 <code className="solutions-code-inline">hl_consult_entry</code>（professional / general）及会员参数；
        若配置了内容入口，会多一个「内容资源」按钮并附带 <code className="solutions-code-inline">hl_channel=content</code>。
        请在 <code className="solutions-code-inline">.env</code> 中写好完整 https URL 后重新构建前端。
      </p>
      <section className="solutions-intake-card">
        <h2>{t.intakeTitle}</h2>
        <p>
          在进入综合长寿方案前，建议先填写健康问卷。问卷会记录您的目标、关注问题、病史、用药和生活方式，
          并与 <Link to="/legal/health-data?lang=en">Health Information & Questionnaire Notice</Link> 的同意流程保持一致。
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
            <p className="solutions-content-desc">
              与咨询并列的「内容通道」，跳转 longevity 侧内容或知识库页面。链接会附带{' '}
              <code className="solutions-code-inline">hl_channel=content</code> 及与咨询相同的身份参数。
            </p>
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
            title="专业健康长寿咨询"
            description="面向专业人士，侧重专业知识和技能，涵盖临床医学、基础医学、功能医学、保健医学、运动医学、营养学等。"
            url={CONSULT_PRO_URL}
            envHint="VITE_CONSULT_PROFESSIONAL_URL（或 VITE_MANUS_PROFESSIONAL_URL）"
            requiredLevel="premium"
            user={user}
            consultEntry="professional"
            t={t}
            p={p}
          />
          <ConsultCard
            title="自我健康促进咨询"
            description="面向普通人群，侧重免疫与免疫力、激素与内分泌平衡、神经与情绪心理、睡眠、营养饮食、科学运动等日常生活关注领域。"
            url={CONSULT_GENERAL_URL}
            envHint="VITE_CONSULT_GENERAL_URL 或 VITE_MANUS_SELF_URL（可与专业同址；未填时沿用专业 URL）"
            requiredLevel="standard"
            user={user}
            consultEntry="general"
            t={t}
            p={p}
          />
        </div>
      </>
      )}
    </div>
  )
}
