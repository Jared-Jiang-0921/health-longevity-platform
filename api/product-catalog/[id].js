/**
 * GET /api/product-catalog/:id?slot=0 — 返回图库中指定槽位图片（公开，无需登录）
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'product-catalog')

/** @param {any} raw */
function normalizeGallery(raw) {
  let g = raw?.gallery_json
  if (typeof g === 'string') {
    try {
      g = JSON.parse(g)
    } catch {
      g = []
    }
  }
  if (!Array.isArray(g)) g = []
  const out = g
    .filter((x) => x && typeof x.stored_name === 'string' && x.stored_name.trim())
    .map((x) => ({
      stored_name: String(x.stored_name).trim(),
      mime: String(x.mime || 'image/jpeg').trim(),
      file_name: String(x.file_name || 'image').trim(),
    }))
  if (out.length) return out
  if (raw?.image_stored_name) {
    return [
      {
        stored_name: String(raw.image_stored_name).trim(),
        mime: String(raw.image_mime || 'image/jpeg'),
        file_name: String(raw.image_file_name || 'product'),
      },
    ]
  }
  return []
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const id = String(req.query?.id || '').trim()
    if (!id) return res.status(400).json({ error: '缺少商品 id' })

    let slot = parseInt(String(req.query?.slot ?? '0'), 10)
    if (Number.isNaN(slot) || slot < 0) slot = 0

    const rows = await sql`SELECT gallery_json, image_stored_name, image_mime, image_file_name FROM product_catalog WHERE id = ${id} LIMIT 1`
    if (!rows.length) return res.status(404).json({ error: '商品不存在' })

    const gallery = normalizeGallery(rows[0])
    const entry = gallery[slot]
    if (!entry) return res.status(404).json({ error: '该槽位无图片' })

    const abs = path.join(STORAGE_DIR, String(entry.stored_name))
    const buf = await fs.readFile(abs)
    const mime = entry.mime || 'image/jpeg'
    const disp = String(entry.file_name || 'product').replace(/[^\w.\-\u4e00-\u9fa5]/g, '_')
    res.setHeader('Content-Type', mime)
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(disp)}"`)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.status(200).send(buf)
  } catch (e) {
    if (e?.code === 'ENOENT') return res.status(404).json({ error: '图片文件不存在' })
    console.error('product-catalog/[id] error', e)
    return res.status(500).json({ error: e?.message || '读取失败' })
  }
}
