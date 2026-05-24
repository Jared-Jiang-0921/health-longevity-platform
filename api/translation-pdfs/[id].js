import path from 'node:path'
import { sql } from '../../lib/db.js'
import { getQueryParam } from '../../lib/apiQuery.js'
import { sendStoredFileInline } from '../../lib/storageInline.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    const id = getQueryParam(req, 'id')
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
    return sendStoredFileInline(res, {
      absPath,
      mimeType: 'application/pdf',
      fileName: item.file_name || 'document.pdf',
    })
  } catch (e) {
    if (e?.code === 'ENOENT') return res.status(404).json({ error: '文件不存在或已被删除' })
    console.error('translation-pdfs/[id] error', e)
    return res.status(500).json({ error: e?.message || '读取文件失败' })
  }
}
