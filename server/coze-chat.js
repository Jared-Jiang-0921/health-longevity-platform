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
// 支持两个不同的 Bot：医疗健康方案 / 健康长寿方案
const COZE_MEDICAL_BOT_ID = process.env.COZE_MEDICAL_BOT_ID || process.env.COZE_BOT_ID
const COZE_LONGEVITY_BOT_ID = process.env.COZE_LONGEVITY_BOT_ID || process.env.COZE_BOT_ID
const COZE_BASE = process.env.COZE_BASE || 'https://api.coze.cn'

app.post('/coze/chat', async (req, res) => {
  if (!COZE_API_KEY) {
    return res.status(500).json({ error: '请配置 COZE_API_KEY' })
  }
  const { message, conversation_id, user_id = 'default-user', mode } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '缺少 message' })
  }

  // 根据 mode 选择对应的 Bot：medical / longevity
  const botId = mode === 'medical' ? COZE_MEDICAL_BOT_ID : COZE_LONGEVITY_BOT_ID
  if (!botId) {
    return res.status(500).json({ error: '请配置对应的 Coze Bot ID（COZE_MEDICAL_BOT_ID / COZE_LONGEVITY_BOT_ID 或 COZE_BOT_ID）' })
  }

  try {
    const body = {
      bot_id: botId,
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
    // 打印一份调试信息到后端终端，便于排查返回结构
    console.log('Coze raw response:', JSON.stringify(data, null, 2))

    if (!resp.ok) {
      return res.status(resp.status).json({ error: data.message || data.msg || 'Coze API 请求失败' })
    }

    // Coze v3 返回结构：code, data 等
    if (data.code !== 0 && data.code !== undefined) {
      return res.status(500).json({ error: data.msg || data.message || 'Coze 返回错误' })
    }

    // 解析 data 中的会话 ID
    const convId = data.data?.conversation_id || data.data?.id || data.conversation_id

    // 优先尝试从本次返回里直接取消息
    let messages = data.data?.message?.content || data.data?.message?.answer || data.data?.messages || data.messages
    let answer = ''

    if (Array.isArray(messages)) {
      const last = messages.find(m => m.role === 'assistant' || m.type === 'answer')
      answer = last?.content || (typeof last?.answer === 'string' ? last.answer : '') || ''
    } else if (typeof messages === 'string') {
      answer = messages
    } else if (data.data?.message) {
      const m = data.data.message
      answer = m.content || m.answer || ''
    }

    // 如果当前返回状态仍是进行中，或者还没解析出答案，则再尝试拉取一次消息列表
    const status = data.data?.status
    if ((!answer || status === 'in_progress') && convId) {
      try {
        const listResp = await fetch(`${COZE_BASE}/v3/chat/message/list`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${COZE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation_id: convId }),
        })
        const listData = await listResp.json()
        console.log('Coze message list:', JSON.stringify(listData, null, 2))

        if (listResp.ok && (listData.code === 0 || listData.code === undefined)) {
          const listMessages =
            listData.data?.messages ||
            listData.data?.list ||
            listData.data?.message_list ||
            listData.messages

          if (Array.isArray(listMessages)) {
            const last = [...listMessages].reverse().find(m => m.role === 'assistant' || m.type === 'answer')
            if (last) {
              // content 可能是字符串或数组
              if (typeof last.content === 'string') {
                answer = last.content
              } else if (Array.isArray(last.content)) {
                answer =
                  last.content
                    .map((c) => (typeof c === 'string' ? c : c.text || c.content || ''))
                    .join('\n')
                    .trim() || answer
              } else if (last.answer) {
                answer = typeof last.answer === 'string' ? last.answer : ''
              }
            }
          }
        }
      } catch (e) {
        console.error('Fetch Coze message list error:', e)
      }
    }

    if (!answer) {
      answer = '当前未从 Coze 获取到有效回复，请稍后重试，或检查该智能体是否已发布并开通 API 能力。'
    }

    res.json({ conversation_id: convId, answer })
  } catch (e) {
    res.status(500).json({ error: e.message || '网络错误' })
  }
})

const port = process.env.COZE_PORT || 4243
app.listen(port, () => console.log(`Coze 代理: http://localhost:${port}`))
