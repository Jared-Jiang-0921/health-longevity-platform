import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { hasLevelAccess, MEMBERSHIP_LEVELS } from '../data/membership'
import { getPatterns } from '../i18n/patterns'
import { getConsultGeneralUrl, getConsultProfessionalUrl, getContentEntryUrl } from '../config/externalUrls'
import { appendExternalEntryParams } from '../lib/externalEntry'
import './Solutions.css'

const COZE_PROXY = import.meta.env.VITE_COZE_PROXY || ''
const CONSULT_PRO_URL = getConsultProfessionalUrl()
/** 未单独配置自我咨询页时，与专业咨询同址（常见：同一 Manus 项目两条入口），由 hl_consult_entry 区分 */
const CONSULT_GENERAL_URL = getConsultGeneralUrl()
/** 可选：longevity 内容 / 知识库 H5 */
const CONTENT_ENTRY_URL = getContentEntryUrl()

const I18N = {
  zh: {
    title: '综合长寿方案',
    loading: '正在验证会员身份，请稍候…',
    intakeTitle: '先完善健康问卷',
    intakeBtn: '填写/更新问卷',
    intakeLegal: '查看健康数据说明',
    contentTitle: '内容资源',
    contentBtn: '进入内容',
    cozeTitle: '平台内置智能体咨询（Coze）',
    cozeNote: '不跳转外链时使用；需已配置 VITE_COZE_PROXY 并启动代理服务。',
    enter: '进入咨询',
    upgrade: '升级会员',
    chatUser: '您',
    chatAdvisor: '顾问',
    chatThinking: '正在思考…',
    chatPlaceholder: '输入您的问题…',
    send: '发送',
    toHuman: '转人工',
    chatProxyError: '请配置 VITE_COZE_PROXY，并启动 Coze 代理服务。',
    noReply: '暂无回复。',
    netError: '网络错误：',
  },
  en: {
    title: 'Integrated Longevity Solutions',
    loading: 'Verifying membership…',
    intakeTitle: 'Complete Health Questionnaire First',
    intakeBtn: 'Fill / Update Questionnaire',
    intakeLegal: 'View Health Data Notice',
    contentTitle: 'Content Resources',
    contentBtn: 'Open Content',
    cozeTitle: 'Built-in AI Consultation (Coze)',
    cozeNote: 'Use this without external redirect; requires VITE_COZE_PROXY.',
    enter: 'Enter Consultation',
    upgrade: 'Upgrade',
    chatUser: 'You',
    chatAdvisor: 'Advisor',
    chatThinking: 'Thinking…',
    chatPlaceholder: 'Type your question…',
    send: 'Send',
    toHuman: 'Contact Human Support',
    chatProxyError: 'Please configure VITE_COZE_PROXY and start the Coze proxy.',
    noReply: 'No response yet.',
    netError: 'Network error: ',
  },
  ar: {
    title: 'حلول طول العمر المتكاملة',
    loading: 'جار التحقق من العضوية…',
    intakeTitle: 'أكمل الاستبيان الصحي أولاً',
    intakeBtn: 'تعبئة/تحديث الاستبيان',
    intakeLegal: 'عرض إشعار البيانات الصحية',
    contentTitle: 'موارد المحتوى',
    contentBtn: 'دخول المحتوى',
    cozeTitle: 'استشارة ذكية مدمجة (Coze)',
    cozeNote: 'للاستخدام بدون الانتقال الخارجي؛ يتطلب VITE_COZE_PROXY.',
    enter: 'دخول الاستشارة',
    upgrade: 'ترقية العضوية',
    chatUser: 'أنت',
    chatAdvisor: 'المستشار',
    chatThinking: 'جار التفكير…',
    chatPlaceholder: 'اكتب سؤالك…',
    send: 'إرسال',
    toHuman: 'تحويل إلى دعم بشري',
    chatProxyError: 'يرجى ضبط VITE_COZE_PROXY وتشغيل وسيط Coze.',
    noReply: 'لا يوجد رد بعد.',
    netError: 'خطأ في الشبكة: ',
  },
}

function SolutionsChat({ t }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your longevity advisor. Ask me about nutrition, exercise, sleep, stress, and healthy lifestyle choices.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [error, setError] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    if (!COZE_PROXY) {
      setError(t.chatProxyError)
      return
    }
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const body = { message: text, user_id: 'web-user' }
      if (conversationId) body.conversation_id = conversationId

      const res = await fetch(`${COZE_PROXY}/coze/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `请求失败：${data.error || res.statusText}` }])
        return
      }

      if (data.conversation_id) setConversationId(data.conversation_id)
      const answer = data.answer || data.content || t.noReply
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `${t.netError}${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="solutions-chat">
      <div className="chat-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <span className="msg-label">{m.role === 'user' ? t.chatUser : t.chatAdvisor}</span>
            <div className="msg-content">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg assistant">
            <span className="msg-label">{t.chatAdvisor}</span>
            <div className="msg-content typing">{t.chatThinking}</div>
          </div>
        )}
      </div>
      {error && <div className="chat-error">{error}</div>}
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t.chatPlaceholder}
          disabled={loading}
        />
        <button type="button" className="btn-send" onClick={send} disabled={loading}>
          {t.send}
        </button>
      </div>
      <a
        href={import.meta.env.VITE_HUMAN_CONTACT_URL || 'mailto:support@example.com'}
        className="btn-human"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.toHuman}
      </a>
    </div>
  )
}

function ConsultCard({ title, description, url, envHint, requiredLevel, user, consultEntry, t, p }) {
  const ready = Boolean(url?.trim())
  const allowed = hasLevelAccess(user?.level, requiredLevel)

  return (
    <article className={`consult-card ${!allowed ? 'consult-card-locked' : ''}`}>
      <h2>{title}</h2>
      <p className="consult-card-desc">{description}</p>
      {!allowed ? (
        <div className="consult-card-lock">
          <p className="consult-lock-msg">{p.requiresLevel(MEMBERSHIP_LEVELS[requiredLevel]?.name || requiredLevel)}</p>
          <Link to="/payment" className="consult-card-btn consult-btn-upgrade">{t.upgrade}</Link>
        </div>
      ) : ready ? (
        <a
          className="consult-card-btn"
          href={appendExternalEntryParams(url, user, { consultEntry })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.enter}
        </a>
      ) : (
        <p className="consult-card-missing">
          {p.configureEnvVar(envHint)}
        </p>
      )}
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
        请在 <code className="solutions-code-inline">.env</code> 中写好完整 https URL 后重新构建前端。底部可展开 Coze 智能体。
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
              href={appendExternalEntryParams(CONTENT_ENTRY_URL, user, { channel: 'content' })}
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

      {COZE_PROXY ? (
        <details className="solutions-coze-details">
          <summary>{t.cozeTitle}</summary>
          <p className="solutions-coze-note">{t.cozeNote}</p>
          <SolutionsChat t={t} />
        </details>
      ) : null}
    </div>
  )
}
