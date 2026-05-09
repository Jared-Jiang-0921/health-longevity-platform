/**
 * 长寿产品证据库 — 商品目录（多图、SKU、中英文；全员可读，仅管理员可写）
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'product-catalog')
const IMAGE_MAX_BYTES = 12 * 1024 * 1024
const MAX_GALLERY = 12
const MAX_SKUS = 24
const ALLOWED_IMG_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif'])
const ALLOWED_IMG_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
])

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
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS title_zh VARCHAR(200)`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS title_en VARCHAR(200)`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS description_zh TEXT`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS description_en TEXT`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS origin_zh VARCHAR(240)`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS origin_en VARCHAR(240)`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS gallery_json JSONB NOT NULL DEFAULT '[]'::jsonb`
  await sql`ALTER TABLE product_catalog ADD COLUMN IF NOT EXISTS skus_json JSONB NOT NULL DEFAULT '[]'::jsonb`

  await sql`
    UPDATE product_catalog SET title_zh = COALESCE(NULLIF(TRIM(title_zh), ''), title)
    WHERE title_zh IS NULL OR TRIM(title_zh) = ''
  `
  await sql`
    UPDATE product_catalog SET description_zh = COALESCE(description_zh, description)
    WHERE description_zh IS NULL AND description IS NOT NULL
  `
  await sql`
    UPDATE product_catalog SET origin_zh = COALESCE(origin_zh, origin)
    WHERE origin_zh IS NULL AND origin IS NOT NULL
  `

  const legacyRows = await sql`
    SELECT id, image_stored_name, image_mime, image_file_name, gallery_json
    FROM product_catalog
    WHERE image_stored_name IS NOT NULL AND TRIM(image_stored_name) <> ''
  `
  for (const row of legacyRows) {
    if (normalizeGalleryRow(row).length) continue
    const g = [
      {
        stored_name: row.image_stored_name,
        mime: row.image_mime || 'image/jpeg',
        file_name: row.image_file_name || 'image',
      },
    ]
    await sql`UPDATE product_catalog SET gallery_json = ${JSON.stringify(g)}::jsonb WHERE id = ${row.id}`
  }
}

function parseJson(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.status(400).json({ error: '请求数据格式不正确' })
    return null
  }
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

/** @param {any} raw */
function normalizeGalleryRow(raw) {
  let g = raw?.gallery_json ?? raw?.gallery
  if (typeof g === 'string') {
    try {
      g = JSON.parse(g)
    } catch {
      g = []
    }
  }
  if (!Array.isArray(g)) return []
  return g
    .filter((x) => x && typeof x.stored_name === 'string' && x.stored_name.trim())
    .map((x) => ({
      stored_name: String(x.stored_name).trim(),
      mime: String(x.mime || 'image/jpeg').trim(),
      file_name: String(x.file_name || 'image').trim(),
    }))
}

/** @param {any} raw */
function normalizeSkusRow(raw) {
  let s = raw?.skus_json ?? raw?.skus
  if (typeof s === 'string') {
    try {
      s = JSON.parse(s)
    } catch {
      s = []
    }
  }
  if (!Array.isArray(s)) return []
  return s
    .slice(0, MAX_SKUS)
    .map((x) => ({
      code: String(x?.code || '').trim().slice(0, 80),
      spec_zh: String(x?.spec_zh || x?.specZh || '').trim().slice(0, 240),
      spec_en: String(x?.spec_en || x?.specEn || '').trim().slice(0, 240),
      price:
        x?.price != null && Number.isFinite(Number(x.price))
          ? Number(x.price)
          : null,
      currency: String(x?.currency || '').trim().slice(0, 10).toUpperCase() || null,
    }))
    .filter((x) => x.code || x.spec_zh || x.spec_en)
}

function rowToItem(row) {
  const gallery = normalizeGalleryRow(row)
  const skus = normalizeSkusRow(row)
  const titleZh = String(row.title_zh || row.title || '').trim()
  const titleEn = String(row.title_en || '').trim()
  return {
    id: row.id,
    category: row.category,
    title_zh: titleZh,
    title_en: titleEn,
    description_zh: row.description_zh ?? row.description ?? '',
    description_en: row.description_en ?? '',
    origin_zh: row.origin_zh ?? row.origin ?? '',
    origin_en: row.origin_en ?? '',
    price_amount: row.price_amount != null ? String(row.price_amount) : '0',
    currency: row.currency,
    unit: row.unit,
    gallery_count: gallery.length,
    skus,
    has_image: gallery.length > 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function handleGetOne(req, res, id) {
  await ensureSchema()
  const rows = await sql`SELECT * FROM product_catalog WHERE id = ${id} LIMIT 1`
  if (!rows.length) return res.status(404).json({ code: 'NOT_FOUND', error: '商品不存在' })
  return res.status(200).json({ ok: true, item: rowToItem(rows[0]) })
}

async function handleList(req, res) {
  await ensureSchema()
  const category = String(req.query?.category || '').trim().toLowerCase()
  let rows
  if (category && CATEGORY_IDS.has(category)) {
    rows = await sql`
      SELECT * FROM product_catalog
      WHERE category = ${category}
      ORDER BY created_at DESC
      LIMIT 200
    `
  } else {
    rows = await sql`
      SELECT * FROM product_catalog
      ORDER BY created_at DESC
      LIMIT 300
    `
  }
  return res.status(200).json({ ok: true, items: rows.map(rowToItem) })
}

/**
 * @param {{ base64: string, fileName: string, mimeType: string }} img
 * @param {string} productId
 */
async function writeGalleryImage(img, productId) {
  const fileName = sanitizeFileName(img.fileName || 'pic.jpg')
  const mime = String(img.mimeType || '').trim().toLowerCase()
  if (!ALLOWED_IMG_MIME.has(mime)) throw new Error('不支持的图片类型')
  const ext = getExt(fileName)
  if (!ALLOWED_IMG_EXT.has(ext)) throw new Error('不支持的图片扩展名')
  const buf = Buffer.from(String(img.base64 || '').trim(), 'base64')
  if (!buf.length) throw new Error('图片为空')
  if (buf.length > IMAGE_MAX_BYTES) throw new Error('单张图片过大')
  await fs.mkdir(STORAGE_DIR, { recursive: true })
  const storedName = `${productId}_${randomUUID()}.${ext}`
  await fs.writeFile(path.join(STORAGE_DIR, storedName), buf)
  return { stored_name: storedName, mime, file_name: fileName }
}

/** @param {string[]} storedNames */
async function unlinkStored(storedNames) {
  for (const name of storedNames) {
    if (!name) continue
    await fs.unlink(path.join(STORAGE_DIR, name)).catch((e) => {
      if (e?.code !== 'ENOENT') throw e
    })
  }
}

function normalizeSkuPayload(body) {
  const raw = body.skus ?? body.skuList
  if (!Array.isArray(raw)) return []
  return raw
    .slice(0, MAX_SKUS)
    .map((x) => ({
      code: String(x?.code || '').trim().slice(0, 80),
      spec_zh: String(x?.spec_zh || x?.specZh || '').trim().slice(0, 240),
      spec_en: String(x?.spec_en || x?.specEn || '').trim().slice(0, 240),
      price:
        x?.price != null && x?.price !== ''
          ? Number(x.price)
          : null,
      currency: String(x?.currency || '').trim().slice(0, 10).toUpperCase() || null,
    }))
    .filter((x) => x.code || x.spec_zh || x.spec_en)
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

  const titleZh = String(body.titleZh ?? body.title_zh ?? body.title || '').trim().slice(0, 200)
  const titleEn = String(body.titleEn ?? body.title_en || '').trim().slice(0, 200)
  const descriptionZh = String(body.descriptionZh ?? body.description_zh ?? body.description || '').trim().slice(0, 8000)
  const descriptionEn = String(body.descriptionEn ?? body.description_en || '').trim().slice(0, 8000)
  const originZh = String(body.originZh ?? body.origin_zh ?? body.origin || '').trim().slice(0, 240)
  const originEn = String(body.originEn ?? body.origin_en || '').trim().slice(0, 240)
  const unit = String(body.unit || '件').trim().slice(0, 40) || '件'
  const currency = String(body.currency || 'CNY').trim().slice(0, 10).toUpperCase() || 'CNY'
  const priceRaw = body.price != null ? Number(body.price) : NaN

  if (!titleZh) return res.status(400).json({ error: '中文标题不能为空' })
  if (!Number.isFinite(priceRaw) || priceRaw < 0) return res.status(400).json({ error: '基础价格无效' })

  const galleryInputs = Array.isArray(body.galleryImages) ? body.galleryImages : []
  const legacySingle =
    body.imageBase64 || body.image_base64
      ? [
          {
            base64: String(body.imageBase64 || body.image_base64 || '').trim(),
            fileName: body.imageFileName || body.image_file_name || 'product.jpg',
            mimeType: body.imageMimeType || body.image_mime_type || 'image/jpeg',
          },
        ]
      : []

  const toProcess = galleryInputs.length ? galleryInputs : legacySingle
  if (!toProcess.length) return res.status(400).json({ error: '请至少上传一张商品图片' })
  if (toProcess.length > MAX_GALLERY) return res.status(400).json({ error: `图片最多 ${MAX_GALLERY} 张` })

  const id = randomUUID()
  const gallery = []
  for (const raw of toProcess) {
    const img = {
      base64: String(raw.base64 || raw.contentBase64 || '').trim(),
      fileName: raw.fileName || raw.file_name || 'pic.jpg',
      mimeType: raw.mimeType || raw.mime_type || 'image/jpeg',
    }
    gallery.push(await writeGalleryImage(img, id))
  }

  const skus = normalizeSkuPayload(body)

  const rows = await sql`
    INSERT INTO product_catalog (
      id, category,
      title, title_zh, title_en,
      description, description_zh, description_en,
      origin, origin_zh, origin_en,
      price_amount, currency, unit,
      gallery_json, skus_json,
      image_stored_name, image_mime, image_file_name,
      required_level
    ) VALUES (
      ${id}, ${category},
      ${titleZh}, ${titleZh}, ${titleEn || null},
      ${descriptionZh || null}, ${descriptionZh || null}, ${descriptionEn || null},
      ${originZh || null}, ${originZh || null}, ${originEn || null},
      ${priceRaw}, ${currency}, ${unit},
      ${JSON.stringify(gallery)}::jsonb, ${JSON.stringify(skus)}::jsonb,
      ${gallery[0]?.stored_name || null},
      ${gallery[0]?.mime || null},
      ${gallery[0]?.file_name || null},
      ${'free'}
    )
    RETURNING *
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
  const ex = existing[0]

  const category = String(body.category || ex.category || '').trim().toLowerCase()
  if (!CATEGORY_IDS.has(category)) return res.status(400).json({ error: '无效的类目' })

  const titleZh = String(body.titleZh ?? body.title_zh ?? body.title ?? ex.title_zh ?? ex.title || '').trim().slice(0, 200)
  const titleEn = String(body.titleEn ?? body.title_en ?? ex.title_en ?? '').trim().slice(0, 200)
  const descriptionZh = String(body.descriptionZh ?? body.description_zh ?? body.description ?? ex.description_zh ?? ex.description ?? '').trim().slice(0, 8000)
  const descriptionEn = String(body.descriptionEn ?? body.description_en ?? ex.description_en ?? '').trim().slice(0, 8000)
  const originZh = String(body.originZh ?? body.origin_zh ?? body.origin ?? ex.origin_zh ?? ex.origin ?? '').trim().slice(0, 240)
  const originEn = String(body.originEn ?? body.origin_en ?? ex.origin_en ?? '').trim().slice(0, 240)
  const unit = String(body.unit || ex.unit || '件').trim().slice(0, 40) || '件'
  const currency = String(body.currency || ex.currency || 'CNY').trim().slice(0, 10).toUpperCase()
  const priceRaw = body.price != null ? Number(body.price) : Number(ex.price_amount)

  if (!titleZh) return res.status(400).json({ error: '中文标题不能为空' })
  if (!Number.isFinite(priceRaw) || priceRaw < 0) return res.status(400).json({ error: '基础价格无效' })

  let gallery = normalizeGalleryRow(ex)
  const galleryInputs = Array.isArray(body.galleryImages) ? body.galleryImages : null
  if (galleryInputs && galleryInputs.length) {
    if (galleryInputs.length > MAX_GALLERY) return res.status(400).json({ error: `图片最多 ${MAX_GALLERY} 张` })
    const oldNames = gallery.map((g) => g.stored_name)
    const next = []
    for (const raw of galleryInputs) {
      const img = {
        base64: String(raw.base64 || raw.contentBase64 || '').trim(),
        fileName: raw.fileName || raw.file_name || 'pic.jpg',
        mimeType: raw.mimeType || raw.mime_type || 'image/jpeg',
      }
      next.push(await writeGalleryImage(img, id))
    }
    await unlinkStored(oldNames)
    gallery = next
  }

  const skus =
    body.skus !== undefined || body.skuList !== undefined ? normalizeSkuPayload(body) : normalizeSkusRow(ex)

  const rows = await sql`
    UPDATE product_catalog SET
      category = ${category},
      title = ${titleZh},
      title_zh = ${titleZh},
      title_en = ${titleEn || null},
      description = ${descriptionZh || null},
      description_zh = ${descriptionZh || null},
      description_en = ${descriptionEn || null},
      origin = ${originZh || null},
      origin_zh = ${originZh || null},
      origin_en = ${originEn || null},
      price_amount = ${priceRaw},
      currency = ${currency},
      unit = ${unit},
      gallery_json = ${JSON.stringify(gallery)}::jsonb,
      skus_json = ${JSON.stringify(skus)}::jsonb,
      image_stored_name = ${gallery[0]?.stored_name || null},
      image_mime = ${gallery[0]?.mime || null},
      image_file_name = ${gallery[0]?.file_name || null},
      required_level = ${'free'},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return res.status(200).json({ ok: true, item: rowToItem(rows[0]) })
}

async function handleDelete(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const id = String(req.query?.id || '').trim()
  if (!id) return res.status(400).json({ error: '缺少 id' })

  const deleted = await sql`SELECT gallery_json, image_stored_name FROM product_catalog WHERE id = ${id}`
  if (!deleted.length) return res.status(404).json({ error: '商品不存在' })

  await sql`DELETE FROM product_catalog WHERE id = ${id}`

  const row = deleted[0]
  const names = new Set()
  for (const g of normalizeGalleryRow(row)) {
    names.add(g.stored_name)
  }
  if (row.image_stored_name) names.add(row.image_stored_name)
  await unlinkStored([...names])

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
