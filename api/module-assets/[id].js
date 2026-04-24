import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'

function getId(req) {
  const v = req.query?.id
  if (Array.isArray(v)) return String(v[0] || '').trim()
  return String(v || '').trim()
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
      SELECT file_name, stored_name, mime_type
      FROM module_assets
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: '资源不存在' })
    const row = rows[0]
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
