import fs from 'node:fs/promises'
import path from 'node:path'
import { sql } from '../../lib/db.js'

function getId(req) {
  const q = req.query?.id
  if (Array.isArray(q)) return String(q[0] || '').trim()
  return String(q || '').trim()
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    const id = getId(req)
    if (!id) return res.status(400).json({ error: '缺少文件 ID' })

    const rows = await sql`
      SELECT file_name, file_path
      FROM translation_pdfs
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows.length) return res.status(404).json({ error: '文件不存在' })

    const item = rows[0]
    const absPath = path.join(process.cwd(), 'storage', 'translation-pdfs', String(item.file_path))
    const buf = await fs.readFile(absPath)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(item.file_name || 'document.pdf')}"`)
    return res.status(200).send(buf)
  } catch (e) {
    if (e?.code === 'ENOENT') return res.status(404).json({ error: '文件不存在或已被删除' })
    console.error('translation-pdfs/[id] error', e)
    return res.status(500).json({ error: e?.message || '读取文件失败' })
  }
}
