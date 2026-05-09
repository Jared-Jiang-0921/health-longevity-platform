/**
 * 长寿产品证据库 — 管理员上架商品（图片、介绍、产地、价格等）
 * GET /api/product-catalog — 列表；GET /api/product-catalog?id=uuid — 单条
 * POST /api/product-catalog — 新建（整站管理员）
 * PATCH /api/product-catalog — 更新
 * DELETE /api/product-catalog?id=uuid — 删除
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'
import { verifyToken, getUserById } from '../lib/auth.js'
import { parseSiteAdminEmails } from '../lib/siteAdminEmails.js'

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'product-catalog')
const IMAGE_MAX_BYTES = 12 * 1024 * 1024
const ALLOWED_IMG_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif'])
const ALLOWED_IMG_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
])

const LEVEL_ORDER = ['free', 'standard', 'premium']
const CATEGORY_IDS = new Set(['supplement', 'equipment', 'food', 'care'])

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_catalog (
      id UUID PRIMARY KEY,
      category VARCHAR(40) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      origin VARCHAR(240),
      price_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
      unit VARCHAR(40) NOT NULL DEFAULT '件',
      image_stored_name VARCHAR(180),
      image_mime VARCHAR(120),
      image_file_name VARCHAR(160),
      required_level VARCHAR(20) NOT NULL DEFAULT 'free',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

function parseJson(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.status(400).json({ error: '请求数据格式不正确' })
    return null
  }
}

function normalizeLevel(raw) {
  const s = String(raw || '').toLowerCase().trim()
  const aliases = {
    普通会员: 'free',
    免费会员: 'free',
    free: 'free',
    标准会员: 'standard',
    standard: 'standard',
    高级会员: 'premium',
    premium: 'premium',
  }
  const v = aliases[s] || s
  return LEVEL_ORDER.includes(v) ? v : 'free'
}

function canView(required, current) {
  const reqIdx = LEVEL_ORDER.indexOf(normalizeLevel(required))
  const curIdx = LEVEL_ORDER.indexOf(normalizeLevel(current))
  return curIdx >= reqIdx
}

async function getViewer(req) {
  const adminAuth = await authorizeSiteAdmin(req)
  if (adminAuth.ok) return { isAdmin: true, level: 'premium' }

  const requestAdminToken = String(req.headers['x-site-admin-token'] || '').trim()
  const configAdminToken = String(process.env.SITE_ADMIN_TOKEN || '').trim()
  if (configAdminToken && requestAdminToken && requestAdminToken === configAdminToken) {
    return { isAdmin: true, level: 'premium' }
  }

  const auth = req.headers.authorization
  const jwt = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!jwt) return { isAdmin: false, level: 'free' }
  const userId = await verifyToken(jwt)
  if (!userId) return { isAdmin: false, level: 'free' }
  const user = await getUserById(userId)
  if (!user) return { isAdmin: false, level: 'free' }
  const allow = parseSiteAdminEmails()
  const isAdmin = allow.includes(String(user.email || '').toLowerCase().trim())
  return { isAdmin, level: user.level || 'free' }
}

function sanitizeFileName(fileName) {
  const cleaned = String(fileName || '')
    .replace(/[^\w.\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120)
  return cleaned || `image_${Date.now()}`
}

function getExt(name) {
  const parts = String(name || '').toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

function rowToItem(row) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    origin: row.origin,
    price_amount: row.price_amount != null ? String(row.price_amount) : '0',
    currency: row.currency,
    unit: row.unit,
    required_level: row.required_level,
    has_image: Boolean(row.image_stored_name),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function handleGetOne(req, res, id) {
  await ensureSchema()
  const viewer = await getViewer(req)
  const rows = await sql`
    SELECT id, category, title, description, origin, price_amount, currency, unit,
           image_stored_name, image_mime, image_file_name, required_level, created_at, updated_at
    FROM product_catalog
    WHERE id = ${id}
    LIMIT 1
  `
  if (!rows.length) return res.status(404).json({ code: 'NOT_FOUND', error: '商品不存在' })
  const row = rows[0]
  if (!viewer.isAdmin && !canView(row.required_level, viewer.level)) {
    return res.status(403).json({ code: 'FORBIDDEN', error: '当前会员等级不可查看该商品' })
  }
  return res.status(200).json({ ok: true, item: rowToItem(rows[0]) })
}

async function handleList(req, res) {
  await ensureSchema()
  const viewer = await getViewer(req)
  const category = String(req.query?.category || '').trim().toLowerCase()
  let rows
  if (category && CATEGORY_IDS.has(category)) {
    rows = await sql`
      SELECT id, category, title, description, origin, price_amount, currency, unit,
             image_stored_name, image_mime, image_file_name, required_level, created_at, updated_at
      FROM product_catalog
      WHERE category = ${category}
      ORDER BY created_at DESC
      LIMIT 200
    `
  } else {
    rows = await sql`
      SELECT id, category, title, description, origin, price_amount, currency, unit,
             image_stored_name, image_mime, image_file_name, required_level, created_at, updated_at
      FROM product_catalog
      ORDER BY created_at DESC
      LIMIT 300
    `
  }
  const visible = viewer.isAdmin ? rows : rows.filter((row) => canView(row.required_level, viewer.level))
  return res.status(200).json({ ok: true, items: visible.map(rowToItem) })
}

async function handlePost(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseJson(req, res)
  if (!body) return

  const category = String(body.category || '').trim().toLowerCase()
  if (!CATEGORY_IDS.has(category)) {
    return res.status(400).json({ error: '无效的类目（须为 supplement / equipment / food / care）' })
  }
  const title = String(body.title || '').trim().slice(0, 200)
  const description = String(body.description || '').trim().slice(0, 8000)
  const origin = String(body.origin || '').trim().slice(0, 240)
  const unit = String(body.unit || '件').trim().slice(0, 40) || '件'
  const currency = String(body.currency || 'CNY').trim().slice(0, 10).toUpperCase() || 'CNY'
  const priceRaw = body.price != null ? Number(body.price) : NaN
  if (!title) return res.status(400).json({ error: '标题不能为空' })
  if (!Number.isFinite(priceRaw) || priceRaw < 0) return res.status(400).json({ error: '价格无效' })

  const requiredLevel = normalizeLevel(body.requiredLevel || 'free')
  const imageFileName = sanitizeFileName(body.imageFileName || 'product.jpg')
  const imageMime = String(body.imageMimeType || '').trim().toLowerCase()
  const imageBase64 = String(body.imageBase64 || '').trim()
  if (!imageBase64 || !imageMime || !ALLOWED_IMG_MIME.has(imageMime)) {
    return res.status(400).json({ error: '请上传合法的商品图片（png / jpeg / webp / gif）' })
  }
  const ext = getExt(imageFileName)
  if (!ALLOWED_IMG_EXT.has(ext)) return res.status(400).json({ error: '图片扩展名不支持' })

  const buf = Buffer.from(imageBase64, 'base64')
  if (!buf.length) return res.status(400).json({ error: '图片为空' })
  if (buf.length > IMAGE_MAX_BYTES) return res.status(400).json({ error: `图片超过 ${IMAGE_MAX_BYTES / 1024 / 1024}MB 限制` })

  await fs.mkdir(STORAGE_DIR, { recursive: true })
  const id = randomUUID()
  const storedName = `${id}.${ext}`

  await fs.writeFile(path.join(STORAGE_DIR, storedName), buf)

  const rows = await sql`
    INSERT INTO product_catalog (
      id, category, title, description, origin, price_amount, currency, unit,
      image_stored_name, image_mime, image_file_name, required_level
    ) VALUES (
      ${id}, ${category}, ${title}, ${description || null}, ${origin || null},
      ${priceRaw}, ${currency}, ${unit},
      ${storedName}, ${imageMime}, ${imageFileName}, ${requiredLevel}
    )
    RETURNING id, category, title, description, origin, price_amount, currency, unit,
              image_stored_name, image_mime, image_file_name, required_level, created_at, updated_at
  `
  return res.status(201).json({ ok: true, item: rowToItem(rows[0]) })
}

async function handlePatch(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseJson(req, res)
  if (!body) return
  const id = String(body.id || '').trim()
  if (!id) return res.status(400).json({ error: '缺少 id' })

  const existing = await sql`SELECT * FROM product_catalog WHERE id = ${id} LIMIT 1`
  if (!existing.length) return res.status(404).json({ error: '商品不存在' })

  const category = String(body.category || existing[0].category || '').trim().toLowerCase()
  if (!CATEGORY_IDS.has(category)) return res.status(400).json({ error: '无效的类目' })
  const title = String(body.title || '').trim().slice(0, 200)
  const description = String(body.description ?? existing[0].description ?? '').trim().slice(0, 8000)
  const origin = String(body.origin ?? existing[0].origin ?? '').trim().slice(0, 240)
  const unit = String(body.unit || existing[0].unit || '件').trim().slice(0, 40) || '件'
  const currency = String(body.currency || existing[0].currency || 'CNY').trim().slice(0, 10).toUpperCase()
  const priceRaw = body.price != null ? Number(body.price) : Number(existing[0].price_amount)
  if (!title) return res.status(400).json({ error: '标题不能为空' })
  if (!Number.isFinite(priceRaw) || priceRaw < 0) return res.status(400).json({ error: '价格无效' })
  const requiredLevel = normalizeLevel(body.requiredLevel || existing[0].required_level || 'free')

  let imageStored = existing[0].image_stored_name
  let imageMime = existing[0].image_mime
  let imageFileName = existing[0].image_file_name

  const imageBase64 = String(body.imageBase64 || '').trim()
  if (imageBase64) {
    const fn = sanitizeFileName(body.imageFileName || 'product.jpg')
    const mime = String(body.imageMimeType || '').trim().toLowerCase()
    if (!ALLOWED_IMG_MIME.has(mime)) return res.status(400).json({ error: '图片类型不支持' })
    const ext = getExt(fn)
    if (!ALLOWED_IMG_EXT.has(ext)) return res.status(400).json({ error: '图片扩展名不支持' })
    const buf = Buffer.from(imageBase64, 'base64')
    if (!buf.length) return res.status(400).json({ error: '图片为空' })
    if (buf.length > IMAGE_MAX_BYTES) return res.status(400).json({ error: '图片过大' })

    await fs.mkdir(STORAGE_DIR, { recursive: true })
    const oldStored = existing[0].image_stored_name
    const newStored = `${id}.${ext}`
    await fs.writeFile(path.join(STORAGE_DIR, newStored), buf)
    if (oldStored && oldStored !== newStored) {
      await fs.unlink(path.join(STORAGE_DIR, oldStored)).catch((e) => {
        if (e?.code !== 'ENOENT') throw e
      })
    }
    imageStored = newStored
    imageMime = mime
    imageFileName = fn
  }

  const rows = await sql`
    UPDATE product_catalog SET
      category = ${category},
      title = ${title},
      description = ${description || null},
      origin = ${origin || null},
      price_amount = ${priceRaw},
      currency = ${currency},
      unit = ${unit},
      image_stored_name = ${imageStored},
      image_mime = ${imageMime},
      image_file_name = ${imageFileName},
      required_level = ${requiredLevel},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, category, title, description, origin, price_amount, currency, unit,
              image_stored_name, image_mime, image_file_name, required_level, created_at, updated_at
  `
  return res.status(200).json({ ok: true, item: rowToItem(rows[0]) })
}

async function handleDelete(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const id = String(req.query?.id || '').trim()
  if (!id) return res.status(400).json({ error: '缺少 id' })

  const deleted = await sql`
    DELETE FROM product_catalog WHERE id = ${id}
    RETURNING image_stored_name
  `
  if (!deleted.length) return res.status(404).json({ error: '商品不存在' })
  const stored = String(deleted[0].image_stored_name || '')
  if (stored) {
    await fs.unlink(path.join(STORAGE_DIR, stored)).catch((e) => {
      if (e?.code !== 'ENOENT') throw e
    })
  }
  return res.status(200).json({ ok: true, id })
}

export default async function handler(req, res) {
  try {
    const method = String(req.method || '').toUpperCase()
    const oneId = String(req.query?.id || '').trim()

    if (method === 'GET' && oneId) return handleGetOne(req, res, oneId)
    if (method === 'GET') return handleList(req, res)
    if (method === 'POST') return handlePost(req, res)
    if (method === 'PATCH') return handlePatch(req, res)
    if (method === 'DELETE') return handleDelete(req, res)

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('product-catalog api error', e)
    return res.status(500).json({ error: e?.message || '接口失败' })
  }
}
