import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'
import { authorizeSiteAdmin } from '../../lib/siteAdminAuth.js'
import { getApiViewer } from '../../lib/apiViewer.js'
import { getQueryParam } from '../../lib/apiQuery.js'
import { canViewContent } from '../../lib/contentAccess.js'
import { locateModuleAssetAbsPath, unlinkModuleAssetFile } from '../../lib/moduleAssetStorage.js'
import { sendStoredFileInline } from '../../lib/storageInline.js'

export default async function handler(req, res) {
  try {
    const id = getQueryParam(req, 'id')
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
        await unlinkModuleAssetFile(storedName)
      }
      return res.status(200).json({ ok: true, id })
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, DELETE')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const rows = await sql`
      SELECT file_name, stored_name, mime_type, required_level, external_url
      FROM module_assets
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: '资源不存在' })
    const row = rows[0]
    const viewer = await getApiViewer(req, { allowQueryToken: true })
    if (
      !viewer.isAdmin &&
      !canViewContent(viewer.level, row.required_level, { isGuest: viewer.isGuest })
    ) {
      return res.status(403).json({ code: 'ASSET_LEVEL_FORBIDDEN', error: '当前会员等级不可查看该资源' })
    }
    const externalUrl = String(row.external_url || '').trim()
    const storedName = String(row.stored_name || '').trim()
    if (externalUrl && !storedName) {
      res.writeHead(302, { Location: externalUrl })
      res.end()
      return undefined
    }
    const abs = await locateModuleAssetAbsPath(storedName)
    return sendStoredFileInline(res, {
      absPath: abs,
      mimeType: row.mime_type,
      fileName: row.file_name || 'asset',
    })
  } catch (e) {
    if (e?.code === 'ENOENT') return res.status(404).json({ error: '资源文件不存在或已删除' })
    console.error('module-assets/[id] api error', e)
    return res.status(500).json({ error: e?.message || '资源读取失败' })
  }
}
