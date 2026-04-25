import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'
import { verifyToken, getUserById } from '../lib/auth.js'
import { parseSiteAdminEmails } from '../lib/siteAdminEmails.js'

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'module-assets')
const MAX_FILE_SIZE = 50 * 1024 * 1024

const ALLOWED_EXT = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt',
  'png', 'jpg', 'jpeg', 'gif', 'webp',
  'mp3', 'wav', 'm4a', 'ogg',
  'mp4', 'mov', 'webm',
])

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/ogg',
  'video/mp4',
  'video/quicktime',
  'video/webm',
])
const LEVEL_ORDER = ['free', 'standard', 'premium']

function parseJson(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.status(400).json({ error: '请求数据格式不正确' })
    return null
  }
}

function normalizeModuleKey(raw) {
  return String(raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/_-]/g, '')
    .slice(0, 64)
}

function sanitizeFileName(fileName) {
  const cleaned = String(fileName || '')
    .replace(/[^\w.\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120)
  return cleaned || `asset_${Date.now()}`
}

function getExt(name) {
  const parts = String(name || '').toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
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
  const allow = parseSiteAdminEmails()
  const isAdmin = allow.includes(String(user.email || '').toLowerCase().trim())
  return { isAdmin, level: user.level || 'free' }
}

async function handleList(req, res) {
  const moduleKey = normalizeModuleKey(req.query?.module)
  if (!moduleKey) return res.status(400).json({ error: '缺少 module 参数' })
  const viewer = await getViewer(req)
  const rows = await sql`
    SELECT id, module_key, subcategory, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at
    FROM module_assets
    WHERE module_key = ${moduleKey}
    ORDER BY created_at DESC
    LIMIT 300
  `
  const visible = viewer.isAdmin ? rows : rows.filter((row) => canView(row.required_level, viewer.level))
  return res.status(200).json({ ok: true, items: visible })
}

async function handleUpload(req, res) {
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseJson(req, res)
  if (!body) return

  const moduleKey = normalizeModuleKey(body.module)
  const subcategory = String(body.subcategory || 'general').trim().slice(0, 80) || 'general'
  const requiredLevel = normalizeLevel(body.requiredLevel || 'free')
  const title = String(body.title || '').trim().slice(0, 200)
  const summary = String(body.summary || '').trim().slice(0, 4000)
  const fileName = sanitizeFileName(body.fileName)
  const mimeType = String(body.mimeType || '').trim().toLowerCase()
  const contentBase64 = String(body.contentBase64 || '').trim()
  if (!moduleKey || !title || !fileName || !contentBase64 || !mimeType) {
    return res.status(400).json({ error: '缺少必填字段（module/title/fileName/mimeType/contentBase64）' })
  }
  const ext = getExt(fileName)
  if (!ALLOWED_EXT.has(ext)) return res.status(400).json({ error: '不支持该文件扩展名' })
  if (!ALLOWED_MIME.has(mimeType)) return res.status(400).json({ error: '不支持该文件类型' })

  const fileBuffer = Buffer.from(contentBase64, 'base64')
  if (!fileBuffer.length) return res.status(400).json({ error: '上传文件为空' })
  if (fileBuffer.length > MAX_FILE_SIZE) return res.status(400).json({ error: '文件超过 50MB 限制' })

  await fs.mkdir(STORAGE_DIR, { recursive: true })
  const id = randomUUID()
  const storedName = `${id}.${ext || 'bin'}`
  await fs.writeFile(path.join(STORAGE_DIR, storedName), fileBuffer)

  const rows = await sql`
    INSERT INTO module_assets (id, module_key, subcategory, required_level, title, summary, file_name, stored_name, mime_type, file_size, uploader)
    VALUES (${id}, ${moduleKey}, ${subcategory}, ${requiredLevel}, ${title}, ${summary || null}, ${fileName}, ${storedName}, ${mimeType}, ${fileBuffer.length}, ${String(auth.admin || '') || null})
    RETURNING id, module_key, subcategory, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at
  `
  return res.status(201).json({ ok: true, item: rows[0] })
}

async function handleUpdate(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseJson(req, res)
  if (!body) return
  const id = String(body.id || '').trim()
  if (!id) return res.status(400).json({ error: '缺少资源 id' })

  const title = String(body.title || '').trim().slice(0, 200)
  const summary = String(body.summary || '').trim().slice(0, 4000)
  const subcategory = String(body.subcategory || 'general').trim().slice(0, 80) || 'general'
  const requiredLevel = normalizeLevel(body.requiredLevel || 'free')
  if (!title) return res.status(400).json({ error: '标题不能为空' })

  const rows = await sql`
    UPDATE module_assets
    SET title = ${title},
        summary = ${summary || null},
        subcategory = ${subcategory},
        required_level = ${requiredLevel},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, module_key, subcategory, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at, updated_at
  `
  if (!rows.length) return res.status(404).json({ error: '资源不存在' })
  return res.status(200).json({ ok: true, item: rows[0] })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return handleList(req, res)
    if (req.method === 'POST') return handleUpload(req, res)
    if (req.method === 'PATCH') return handleUpdate(req, res)
    res.setHeader('Allow', 'GET, POST, PATCH')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('module-assets api error', e)
    return res.status(500).json({ error: e?.message || '模块资源接口失败' })
  }
}
