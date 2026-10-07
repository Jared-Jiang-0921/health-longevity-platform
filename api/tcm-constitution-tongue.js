/**
 * 舌象照片只返回可见特征建议，不保存图片，不计算体质分数。
 * POST /api/tcm-constitution-tongue { mediaType, data }
 */
import { verifyToken, getUserById } from '../lib/auth.js'
import { canViewContent } from '../lib/contentAccess.js'
import { parseApiJsonBody } from '../lib/apiBody.js'
import { TONGUE_COATINGS, TONGUE_COLORS, TONGUE_MARKS } from '../src/lib/tcmConstitution/score.js'

const BASE = (
  process.env.DASHSCOPE_BASE_URL ||
  'https://dashscope.aliyuncs.com/compatible-mode/v1'
).replace(/\/$/, '')
const MODEL = process.env.VISION_MODEL || 'qwen-vl-plus'
const MAX_DATA_CHARS = 1_800_000

function getToken(req) {
  const auth = req.headers.authorization
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
}

function emptyFeatures(note) {
  return {
    ok: true,
    manual: true,
    features: { tongueColor: '', coating: '', marks: [] },
    note,
  }
}

function parseFeatures(text) {
  const raw = String(text || '')
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try {
    const json = JSON.parse(raw.slice(start, end + 1))
    const tongueColor = TONGUE_COLORS.includes(json.tongueColor) ? json.tongueColor : ''
    const coating = TONGUE_COATINGS.includes(json.coating) ? json.coating : ''
    const marks = Array.isArray(json.marks)
      ? [...new Set(json.marks.filter((mark) => TONGUE_MARKS.includes(mark)))]
      : []
    return {
      features: { tongueColor, coating, marks },
      unsure: json.unsure === true || (!tongueColor && !coating && !marks.length),
      note: String(json.note || '').slice(0, 200),
    }
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const token = getToken(req)
  if (!token) return res.status(401).json({ error: '未登录' })
  const userId = await verifyToken(token)
  if (!userId) return res.status(401).json({ error: '登录已过期' })
  const user = await getUserById(userId)
  if (!user || !canViewContent(user.level, 'standard', { isGuest: false })) {
    return res.status(403).json({ error: '体质辨识仅向标准会员及以上开放' })
  }

  const body = parseApiJsonBody(req, res)
  if (!body) return
  const mediaType = String(body.mediaType || '')
  const data = String(body.data || '')
  if (!/^image\/(jpeg|png|webp)$/.test(mediaType) || data.length < 32 || data.length > MAX_DATA_CHARS) {
    return res.status(400).json({ error: '请上传一张清晰的舌头照片' })
  }

  const key = process.env.DASHSCOPE_API_KEY || process.env.BAILIAN_API_KEY || ''
  if (!key) {
    return res.status(200).json(emptyFeatures('当前无法自动识别，请按照片自行选择舌象特征。'))
  }

  const prompt = [
    '按 GB/T 40665.1-2021《中医四诊操作规范 第1部分：望诊》只判断这张照片里看得见的舌面特征。',
    '用词按舌象词汇：淡白、淡红、红、青紫，薄白、白腻、黄腻、少苔，以及齿痕、裂纹、瘀点、胖嫩。',
    '不要判断体质，不要开方，不要写剂量，不要根据舌面照片判断舌下络脉。',
    '只返回 JSON：{"tongueColor":"pale|pink|red|dark","coating":"thin-white|white-greasy|yellow-greasy|little","marks":["teeth","cracks","spots","plump"],"unsure":false,"note":""}',
    'tongueColor：淡白或舌色淡=pale；淡红=pink；红或偏红=red；青、紫、紫黯或舌色暗=dark。颜色介于两者之间就留空。',
    'coating：薄白苔=thin-white；白腻苔=white-greasy；黄腻苔=yellow-greasy；少苔或几乎无苔=little。腻但分不清白或黄就留空。',
    'marks：舌边齿痕=teeth；裂纹=cracks；舌面瘀点=spots；舌体胖大或胖嫩=plump。没有的不要写。',
    '看不清、不是舌头、开了美颜、饮食染苔或光线明显偏色时，相关字段留空，并把 unsure 设为 true。',
  ].join('')

  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 25000)
  try {
    const resp = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mediaType};base64,${data}` } },
            { type: 'text', text: prompt },
          ],
        }],
        max_tokens: 400,
      }),
      signal: ac.signal,
    })
    if (!resp.ok) {
      return res.status(200).json(emptyFeatures('自动识别没有成功，请按照片自行选择舌象特征。'))
    }
    const json = await resp.json()
    const text = json.choices?.[0]?.message?.content || ''
    const parsed = parseFeatures(text)
    if (!parsed) {
      return res.status(200).json(emptyFeatures('自动识别没有成功，请按照片自行选择舌象特征。'))
    }
    return res.status(200).json({
      ok: true,
      manual: parsed.unsure,
      features: parsed.features,
      note: parsed.note || (parsed.unsure ? '照片不够清楚，请对照照片自行选择特征。' : '请对照照片核对舌色、苔、齿痕和胖嫩后再确认。裂纹只作记录。确认后的舌象不改变问卷分数。'),
    })
  } catch {
    return res.status(200).json(emptyFeatures('自动识别超时，请按照片自行选择舌象特征。'))
  } finally {
    clearTimeout(timer)
  }
}
