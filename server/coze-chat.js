/**
 * Coze 智能体 API 代理
 * 支持从 server/.env 读取 COZE_API_KEY、COZE_BOT_ID
 * 或命令行：COZE_API_KEY=xxx COZE_BOT_ID=xxx node server/coze-chat.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

const COZE_API_KEY = process.env.COZE_API_KEY
const COZE_BOT_ID = process.env.COZE_BOT_ID
const COZE_BASE = process.env.COZE_BASE || 'https://api.coze.cn'

app.post('/coze/chat', async (req, res) => {
  if (!COZE_API_KEY || !COZE_BOT_ID) {
    return res.status(500).json({ error: '请配置 COZE_API_KEY 和 COZE_BOT_ID' })
  }
  const { message, conversation_id, user_id = 'default-user' } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '缺少 message' })
  }

  try {
    const body = {
      bot_id: COZE_BOT_ID,
      user_id,
      stream: false,
      auto_save_history: true,
      additional_messages: [
        { role: 'user', content_type: 'text', content: message },
      ],
    }
    if (conversation_id) body.conversation_id = conversation_id

    const resp = await fetch(`${COZE_BASE}/v3/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(resp.status).json({ error: data.message || data.msg || 'Coze API 请求失败' })
    }

    // Coze v3 返回结构：code, data 等
    if (data.code !== 0 && data.code !== undefined) {
      return res.status(500).json({ error: data.msg || data.message || 'Coze 返回错误' })
    }

    // 解析 data 中的消息，常见字段：data.conversation_id, data.messages 等
    const convId = data.data?.id || data.data?.conversation_id || data.conversation_id
    const messages = data.data?.message?.content || data.data?.message?.answer || data.data?.messages || data.messages

    let answer = ''
    if (Array.isArray(messages)) {
      const last = messages.find(m => m.role === 'assistant')
      answer = last?.content || (typeof last?.answer === 'string' ? last.answer : '') || ''
    } else if (typeof messages === 'string') {
      answer = messages
    } else if (data.data?.message) {
      const m = data.data.message
      answer = m.content || m.answer || ''
    }

    res.json({ conversation_id: convId, answer })
  } catch (e) {
    res.status(500).json({ error: e.message || '网络错误' })
  }
})

const port = process.env.COZE_PORT || 4243
app.listen(port, () => console.log(`Coze 代理: http://localhost:${port}`))
