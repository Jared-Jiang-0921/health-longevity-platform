import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'
import { authorizeSiteAdmin } from '../../lib/siteAdminAuth.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { parseSiteAdminEmails } from '../../lib/siteAdminEmails.js'

const LEVEL_ORDER = ['free', 'standard', 'premium']

function getId(req) {
  const v = req.query?.id
  if (Array.isArray(v)) return String(v[0] || '').trim()
  return String(v || '').trim()
}

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
  const isAdmin = parseSiteAdminEmails().includes(String(user.email || '').toLowerCase().trim())
  return { isAdmin, level: user.level || 'free' }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    const id = getId(req)
    if (!id) return res.status(400).json({ error: '缺少资源 ID' })

    const rows = await sql`
      SELECT file_name, stored_name, mime_type, required_level
      FROM module_assets
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: '资源不存在' })
    const row = rows[0]
    const viewer = await getViewer(req)
    if (!viewer.isAdmin && !canView(row.required_level, viewer.level)) {
      return res.status(403).json({ code: 'ASSET_LEVEL_FORBIDDEN', error: '当前会员等级不可查看该资源' })
    }
    const isVideo = String(row.mime_type || '').startsWith('video/')
    if (isVideo) {
      const auth = await authorizeSiteAdmin(req)
      if (!auth.ok) {
        return res.status(403).json({ code: 'VIDEO_ADMIN_ONLY', error: '视频资源仅管理员可下载' })
      }
    }
    const abs = path.join(process.cwd(), 'storage', 'module-assets', String(row.stored_name))
    const buf = await fs.readFile(abs)
    res.setHeader('Content-Type', row.mime_type || 'application/octet-stream')
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(row.file_name || 'asset')}"`)
    return res.status(200).send(buf)
  } catch (e) {
    if (e?.code === 'ENOENT') return res.status(404).json({ error: '资源文件不存在或已删除' })
    console.error('module-assets/[id] api error', e)
    return res.status(500).json({ error: e?.message || '资源读取失败' })
  }
}
