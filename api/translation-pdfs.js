import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'translation-pdfs')

function parseJson(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.status(400).json({ error: '请求数据格式不正确' })
    return null
  }
}

function sanitizeFileName(name) {
  const raw = String(name || '').trim().toLowerCase()
  const normalized = raw.replace(/[^a-z0-9._-]/g, '_')
  if (!normalized.endsWith('.pdf')) return `${normalized || 'document'}.pdf`
  return normalized || 'document.pdf'
}

async function handleList(_req, res) {
  const rows = await sql`
    SELECT id, title, summary, file_name, file_size, uploader, created_at
    FROM translation_pdfs
    ORDER BY created_at DESC
    LIMIT 200
  `
  return res.status(200).json({ ok: true, items: rows })
}

async function handleUpload(req, res) {
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseJson(req, res)
  if (!body) return

  const title = String(body.title || '').trim().slice(0, 120)
  const summary = String(body.summary || '').trim().slice(0, 2000)
  const fileName = sanitizeFileName(body.fileName)
  const contentBase64 = String(body.contentBase64 || '').trim()
  if (!title) return res.status(400).json({ error: '标题不能为空' })
  if (!contentBase64) return res.status(400).json({ error: '缺少 PDF 文件内容' })

  const fileBuffer = Buffer.from(contentBase64, 'base64')
  if (!fileBuffer.length) return res.status(400).json({ error: 'PDF 内容为空' })
  if (fileBuffer.length > MAX_FILE_SIZE) return res.status(400).json({ error: 'PDF 文件过大，请控制在 100MB 以内' })
  // PDF magic bytes: 25 50 44 46 (%PDF)
  if (!(fileBuffer[0] === 0x25 && fileBuffer[1] === 0x50 && fileBuffer[2] === 0x44 && fileBuffer[3] === 0x46)) {
    return res.status(400).json({ error: '仅支持 PDF 文件' })
  }

  await fs.mkdir(STORAGE_DIR, { recursive: true })
  const id = randomUUID()
  const storedFileName = `${id}-${fileName}`
  const filePath = path.join(STORAGE_DIR, storedFileName)
  await fs.writeFile(filePath, fileBuffer)

  const rows = await sql`
    INSERT INTO translation_pdfs (id, title, summary, file_name, file_path, file_size, uploader)
    VALUES (${id}, ${title}, ${summary || null}, ${fileName}, ${storedFileName}, ${fileBuffer.length}, ${String(auth.admin || '') || null})
    RETURNING id, title, summary, file_name, file_size, uploader, created_at
  `
  return res.status(201).json({ ok: true, item: rows[0] })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return handleList(req, res)
    if (req.method === 'POST') return handleUpload(req, res)
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('translation-pdfs api error', e)
    return res.status(500).json({ error: e?.message || '操作失败' })
  }
}
