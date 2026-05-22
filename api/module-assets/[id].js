import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'
import { authorizeSiteAdmin } from '../../lib/siteAdminAuth.js'
import { verifyToken, getUserById } from '../../lib/auth.js'
import { parseSiteAdminEmails } from '../../lib/siteAdminEmails.js'
import { canViewContent } from '../../lib/contentAccess.js'

function getId(req) {
  const v = req.query?.id
  if (Array.isArray(v)) return String(v[0] || '').trim()
  return String(v || '').trim()
}

function readJwt(req) {
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  const q = req.query?.access_token
  const raw = Array.isArray(q) ? q[0] : q
  const fromQuery = String(raw || '').trim()
  return fromQuery || null
}

async function getViewer(req) {
  const adminAuth = await authorizeSiteAdmin(req)
  if (adminAuth.ok) return { isAdmin: true, level: 'premium', isGuest: false }

  const requestAdminToken = String(req.headers['x-site-admin-token'] || '').trim()
  const configAdminToken = String(process.env.SITE_ADMIN_TOKEN || '').trim()
  if (configAdminToken && requestAdminToken && requestAdminToken === configAdminToken) {
    return { isAdmin: true, level: 'premium', isGuest: false }
  }
  const jwt = readJwt(req)
  if (!jwt) return { isAdmin: false, level: 'free', isGuest: true }
  const userId = await verifyToken(jwt)
  if (!userId) return { isAdmin: false, level: 'free', isGuest: true }
  const user = await getUserById(userId)
  if (!user) return { isAdmin: false, level: 'free', isGuest: true }
  const isAdmin = parseSiteAdminEmails().includes(String(user.email || '').toLowerCase().trim())
  return { isAdmin, level: user.level || 'free', isGuest: false }
}

export default async function handler(req, res) {
  try {
    const id = getId(req)
    if (!id) return res.status(400).json({ error: '缺少资源 ID' })

    if (req.method === 'DELETE') {
      const auth = await authorizeSiteAdmin(req)
      if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })
      const deleted = await sql`
        DELETE FROM module_assets
        WHERE id = ${id}
        RETURNING id, stored_name
      `
      if (!deleted.length) return res.status(404).json({ error: '资源不存在' })
      const storedName = String(deleted[0].stored_name || '')
      if (storedName) {
        const abs = path.join(process.cwd(), 'storage', 'module-assets', storedName)
        await fs.unlink(abs).catch((e) => {
          if (e?.code !== 'ENOENT') throw e
        })
      }
      return res.status(200).json({ ok: true, id })
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, DELETE')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const rows = await sql`
      SELECT file_name, stored_name, mime_type, required_level
      FROM module_assets
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: '资源不存在' })
    const row = rows[0]
    const viewer = await getViewer(req)
    if (
      !viewer.isAdmin &&
      !canViewContent(viewer.level, row.required_level, { isGuest: viewer.isGuest })
    ) {
      return res.status(403).json({ code: 'ASSET_LEVEL_FORBIDDEN', error: '当前会员等级不可查看该资源' })
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
