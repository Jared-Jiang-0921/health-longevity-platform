import { useState, useRef, useEffect } from 'react'
import './Solutions.css'

const COZE_PROXY = import.meta.env.VITE_COZE_PROXY || ''
const CONSULT_PRO_URL = import.meta.env.VITE_CONSULT_PROFESSIONAL_URL || ''
const CONSULT_GENERAL_URL = import.meta.env.VITE_CONSULT_GENERAL_URL || ''

function SolutionsChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好，我是综合长寿方案顾问。您可以问我关于营养、运动、睡眠、压力管理等健康相关问题，我会为您提供个性化建议。如有紧急情况或需要真人咨询，请点击下方「转人工」。' },
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
      setError('请配置 VITE_COZE_PROXY，并启动 Coze 代理服务。')
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
      const answer = data.answer || data.content || '暂无回复。'
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `网络错误：${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="solutions-chat">
      <div className="chat-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <span className="msg-label">{m.role === 'user' ? '您' : '顾问'}</span>
            <div className="msg-content">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg assistant">
            <span className="msg-label">顾问</span>
            <div className="msg-content typing">正在思考…</div>
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
          placeholder="输入您的问题…"
          disabled={loading}
        />
        <button type="button" className="btn-send" onClick={send} disabled={loading}>
          发送
        </button>
      </div>
      <a
        href={import.meta.env.VITE_HUMAN_CONTACT_URL || 'mailto:support@example.com'}
        className="btn-human"
        target="_blank"
        rel="noopener noreferrer"
      >
        转人工
      </a>
    </div>
  )
}

function ConsultCard({ title, description, url, envHint }) {
  const ready = Boolean(url?.trim())

  return (
    <article className="consult-card">
      <h2>{title}</h2>
      <p className="consult-card-desc">{description}</p>
      {ready ? (
        <a className="consult-card-btn" href={url.trim()} target="_blank" rel="noopener noreferrer">
          进入咨询
        </a>
      ) : (
        <p className="consult-card-missing">
          请在 <code>.env</code> 中配置 <code>{envHint}</code>（完整地址，可含端口与路径）
        </p>
      )}
    </article>
  )
}

export default function Solutions() {
  return (
    <div className="page-solutions">
      <h1>综合长寿方案</h1>
      <p className="subtitle">
        专业咨询与大众咨询分别接入您在 longevityconsult.vip 上搭建的页面；下方可选使用平台内置 Coze 智能体。
      </p>

      <div className="consult-grid">
        <ConsultCard
          title="专业健康长寿咨询"
          description="面向专业人士，侧重专业知识和技能，涵盖临床医学、基础医学、功能医学、保健医学、运动医学、营养学等。"
          url={CONSULT_PRO_URL}
          envHint="VITE_CONSULT_PROFESSIONAL_URL"
        />
        <ConsultCard
          title="自我健康提升咨询"
          description="面向普通人群，侧重免疫与免疫力、激素与内分泌平衡、神经与情绪心理、睡眠、营养饮食、科学运动等日常生活关注领域。"
          url={CONSULT_GENERAL_URL}
          envHint="VITE_CONSULT_GENERAL_URL"
        />
      </div>

      {COZE_PROXY ? (
        <details className="solutions-coze-details">
          <summary>平台内置智能体咨询（Coze）</summary>
          <p className="solutions-coze-note">不跳转外链时使用；需已配置 VITE_COZE_PROXY 并启动代理服务。</p>
          <SolutionsChat />
        </details>
      ) : null}
    </div>
  )
}
