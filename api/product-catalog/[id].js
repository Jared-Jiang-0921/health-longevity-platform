/**
 * GET /api/product-catalog/:id — 返回商品主图二进制（需登录且会员等级足够）
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'
import { authorizeSiteAdmin } from '../../lib/siteAdminAuth.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { parseSiteAdminEmails } from '../../lib/siteAdminEmails.js'

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'product-catalog')
const LEVEL_ORDER = ['free', 'standard', 'premium']

function normalizeLevel(raw) {
  const s = String(raw || '').toLowerCase().trim()
  return LEVEL_ORDER.includes(s) ? s : 'free'
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

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const id = String(req.query?.id || '').trim()
    if (!id) return res.status(400).json({ error: '缺少商品 id' })

    const rows = await sql`
      SELECT image_stored_name, image_mime, image_file_name, required_level
      FROM product_catalog
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: '商品不存在' })
    const row = rows[0]
    if (!row.image_stored_name) return res.status(404).json({ error: '暂无商品图片' })

    const viewer = await getViewer(req)
    if (!viewer.isAdmin && !canView(row.required_level, viewer.level)) {
      return res.status(403).json({ code: 'FORBIDDEN', error: '当前会员等级不可查看该资源' })
    }

    const abs = path.join(STORAGE_DIR, String(row.image_stored_name))
    const buf = await fs.readFile(abs)
    const mime = row.image_mime || 'image/jpeg'
    const disp = String(row.image_file_name || 'product').replace(/[^\w.\-\u4e00-\u9fa5]/g, '_')
    res.setHeader('Content-Type', mime)
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(disp)}"`)
    res.setHeader('Cache-Control', 'private, max-age=3600')
    return res.status(200).send(buf)
  } catch (e) {
    if (e?.code === 'ENOENT') return res.status(404).json({ error: '图片文件不存在' })
    console.error('product-catalog/[id] error', e)
    return res.status(500).json({ error: e?.message || '读取失败' })
  }
}
