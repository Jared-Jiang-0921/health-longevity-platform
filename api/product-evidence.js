/**
 * 长寿产品证据库 — 核验代理（不读写本库商品表）。
 *
 * POST /api/product-evidence  { approval_no, product_name, origin_region, ad_text, category }
 *   用户在证据库页自助填文号/宣传语，转发到 AI 助选核验服务。
 * GET  /api/product-evidence?id=<uuid>
 *   兼容：若以后上架商品填了文号，详情页可按目录 id 拉取（当前平台无真实商品也可不用）。
 */
import { sql } from '../lib/db.js'
import { getApiViewer } from '../lib/apiViewer.js'
import { attachContentAccessFields } from '../lib/contentListAccess.js'
import { parseApiJsonBody } from '../lib/apiBody.js'

const ASSIST_TIMEOUT_MS = 45000
const ORIGIN_REGIONS = new Set(['CN', 'US', 'AU', 'EU', 'JP', 'KR'])

function assistBase() {
  return String(process.env.ASSIST_API_BASE || 'http://127.0.0.1:8000').replace(/\/$/, '')
}

function normalizeRegion(raw) {
  const v = String(raw || 'CN').trim().toUpperCase()
  return ORIGIN_REGIONS.has(v) ? v : 'CN'
}

async function callAssist({ approvalNo, productName, originRegion, adText, category }) {
  const headers = { 'Content-Type': 'application/json' }
  const key = String(process.env.ASSIST_EVIDENCE_KEY || '').trim()
  if (key) headers['X-Assist-Key'] = key

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ASSIST_TIMEOUT_MS)
  try {
    const assistRes = await fetch(`${assistBase()}/api/v1/verify/evidence-card`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        approval_no: approvalNo || undefined,
        product_name: productName || undefined,
        origin_region: originRegion,
        ad_text: adText || undefined,
        category: category || undefined,
      }),
      signal: ctrl.signal,
    })
    const data = await assistRes.json().catch(() => ({}))
    const detail = Array.isArray(data.detail)
      ? data.detail.map((x) => x.msg || x).join('; ')
      : data.detail
    return { assistRes, data, detail }
  } finally {
    clearTimeout(timer)
  }
}

async function handlePost(req, res) {
  const body = parseApiJsonBody(req, res)
  if (!body) return
  const approvalNo = String(body.approval_no ?? body.approvalNo ?? '').trim().slice(0, 64)
  const productName = String(body.product_name ?? body.productName ?? '').trim().slice(0, 255)
  const adText = String(body.ad_text ?? body.adText ?? '').trim().slice(0, 5000)
  const category = String(body.category ?? '').trim().slice(0, 40)
  const originRegion = normalizeRegion(body.origin_region ?? body.originRegion)

  if (!approvalNo && adText.length < 2) {
    return res.status(400).json({ error: '请填写批准文号，或粘贴至少 2 字宣传文案' })
  }

  const { assistRes, data, detail } = await callAssist({
    approvalNo,
    productName,
    originRegion,
    adText,
    category,
  })
  if (!assistRes.ok) {
    return res.status(502).json({
      error: detail || data.error || `助选核验服务 HTTP ${assistRes.status}`,
      assist_status: assistRes.status,
    })
  }
  return res.status(200).json({
    ok: true,
    approval_no: approvalNo || null,
    origin_region: originRegion,
    card: data,
  })
}

async function handleGet(req, res) {
  const id = String(req.query?.id || '').trim()
  if (!id) return res.status(400).json({ error: '缺少商品 id；自助核验请用 POST' })

  const rows = await sql`SELECT * FROM product_catalog WHERE id = ${id} LIMIT 1`
  if (!rows.length) return res.status(404).json({ error: '商品不存在' })
  const row = rows[0]
  const viewer = await getApiViewer(req)
  const { can_view } = attachContentAccessFields(row, viewer)
  if (can_view === false) {
    return res.status(403).json({ error: '当前等级无法查看该商品证据' })
  }

  const approvalNo = String(row.approval_no || '').trim()
  const originRegion = normalizeRegion(row.origin_region)
  const productName = String(row.title_zh || row.title || '').trim()
  const adText = String(row.description_zh || row.description || '').trim()
  const category = String(row.category || '').trim()

  const { assistRes, data, detail } = await callAssist({
    approvalNo,
    productName,
    originRegion,
    adText,
    category,
  })
  if (!assistRes.ok) {
    return res.status(502).json({
      error: detail || data.error || `助选核验服务 HTTP ${assistRes.status}`,
      assist_status: assistRes.status,
    })
  }
  return res.status(200).json({
    ok: true,
    catalog_id: id,
    approval_no: approvalNo || null,
    origin_region: originRegion,
    card: data,
  })
}

export default async function handler(req, res) {
  const method = String(req.method || '').toUpperCase()
  try {
    if (method === 'POST') return handlePost(req, res)
    if (method === 'GET') return handleGet(req, res)
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    const aborted = e?.name === 'AbortError'
    console.error('product-evidence proxy error', e)
    return res.status(aborted ? 504 : 502).json({
      error: aborted ? '核验超时，请稍后重试' : e?.message || '证据卡加载失败',
    })
  }
}
