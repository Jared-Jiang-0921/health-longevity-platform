import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { sql } from '../lib/db.js'
import { authorizeSiteAdmin } from '../lib/siteAdminAuth.js'
import { parseApiJsonBody } from '../lib/apiBody.js'
import { getApiViewer } from '../lib/apiViewer.js'
import { attachContentAccessFields } from '../lib/contentListAccess.js'
import {
  normalizeContentLevelForStorage,
} from '../lib/contentAccess.js'
import { getFileExtension, sanitizeUploadFileName } from '../lib/uploadFileName.js'
import {
  relocateModuleAssetFile,
  unlinkModuleAssetFile,
  writeModuleAssetFile,
} from '../lib/moduleAssetStorage.js'
import { resolveHealthSkillsAssetGrouping } from '../src/data/healthSkillsSeries.js'

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'module-assets')
const MAX_FILE_SIZE = 100 * 1024 * 1024

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
  'video/x-m4v',
  'video/mpeg',
])

const EXT_TO_MIME = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  m4v: 'video/x-m4v',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

function resolveUploadMime(mimeType, fileName) {
  const m = String(mimeType || '').trim().toLowerCase()
  if (ALLOWED_MIME.has(m)) return m
  const ext = getFileExtension(fileName)
  const fromExt = EXT_TO_MIME[ext]
  if (fromExt && ALLOWED_MIME.has(fromExt)) return fromExt
  return m
}
async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS module_assets (
      id UUID PRIMARY KEY,
      module_key VARCHAR(64) NOT NULL,
      subcategory VARCHAR(80) NOT NULL DEFAULT 'general',
      subtopic VARCHAR(120) NOT NULL DEFAULT '',
      required_level VARCHAR(20) NOT NULL DEFAULT 'free',
      title VARCHAR(200) NOT NULL,
      summary TEXT,
      file_name VARCHAR(160) NOT NULL,
      stored_name VARCHAR(180) NOT NULL,
      mime_type VARCHAR(120) NOT NULL,
      file_size BIGINT NOT NULL,
      uploader VARCHAR(200),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE module_assets ADD COLUMN IF NOT EXISTS subcategory VARCHAR(80) NOT NULL DEFAULT 'general'`
  await sql`ALTER TABLE module_assets ADD COLUMN IF NOT EXISTS subtopic VARCHAR(120) NOT NULL DEFAULT ''`
  await sql`ALTER TABLE module_assets ADD COLUMN IF NOT EXISTS required_level VARCHAR(20) NOT NULL DEFAULT 'free'`
  await sql`ALTER TABLE module_assets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  await sql`ALTER TABLE module_assets ADD COLUMN IF NOT EXISTS external_url TEXT`
}

/** @returns {string|null} null=非法；''=未提供 */
function normalizeExternalUrl(raw) {
  const s = String(raw || '').trim()
  if (!s) return ''
  let u
  try {
    u = new URL(s)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  return u.toString().slice(0, 2000)
}

function normalizeModuleKey(raw) {
  return String(raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/_-]/g, '')
    .slice(0, 64)
}

async function handleList(req, res) {
  await ensureSchema()
  const moduleKey = normalizeModuleKey(req.query?.module)
  if (!moduleKey) return res.status(400).json({ error: '缺少 module 参数' })
  const viewer = await getApiViewer(req)
  const rows = await sql`
    SELECT id, module_key, subcategory, subtopic, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at, external_url
    FROM module_assets
    WHERE module_key = ${moduleKey}
    ORDER BY created_at DESC
    LIMIT 300
  `
  const items = rows.map((row) => ({
    ...row,
    ...attachContentAccessFields(row, viewer),
  }))
  return res.status(200).json({ ok: true, items })
}

async function handleUpload(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseApiJsonBody(req, res)
  if (!body) return

  const moduleKey = normalizeModuleKey(body.module)
  let subcategory = String(body.subcategory || 'general').trim().slice(0, 80) || 'general'
  let subtopic = String(body.subtopic || '').trim().slice(0, 120)
  if (moduleKey === 'health-skills') {
    const grouped = resolveHealthSkillsAssetGrouping({
      subtopic,
      subcategory,
      title: String(body.title || '').trim(),
    })
    subcategory = grouped.subcategory.slice(0, 80) || subcategory
    subtopic = grouped.subtopic.slice(0, 120)
    if (!subtopic) {
      return res.status(400).json({ error: '请选择系列合集（与课程系列一致）' })
    }
  }
  const requiredLevel = normalizeContentLevelForStorage(body.requiredLevel || 'public')
  const title = String(body.title || '').trim().slice(0, 200)
  const summary = String(body.summary || '').trim().slice(0, 4000)
  const externalUrlRaw = normalizeExternalUrl(body.externalUrl)
  if (externalUrlRaw === null) {
    return res.status(400).json({ error: '外链地址无效，请使用 http/https 链接（如微信公众号文章）' })
  }
  const contentBase64 = String(body.contentBase64 || '').trim()
  const hasFile = Boolean(contentBase64)
  const isLinkOnly = Boolean(externalUrlRaw) && !hasFile

  if (!moduleKey || !title) {
    return res.status(400).json({ error: '缺少必填字段（module/title）' })
  }
  if (!hasFile && !externalUrlRaw) {
    return res.status(400).json({ error: '请上传文件，或填写外链地址（二选一）' })
  }

  const id = randomUUID()

  if (isLinkOnly) {
    const rows = await sql`
      INSERT INTO module_assets (id, module_key, subcategory, subtopic, required_level, title, summary, file_name, stored_name, mime_type, file_size, uploader, external_url)
      VALUES (
        ${id},
        ${moduleKey},
        ${subcategory},
        ${subtopic || '文章'},
        ${requiredLevel},
        ${title},
        ${summary || null},
        ${'external-link'},
        ${''},
        ${'text/uri-list'},
        ${0},
        ${String(auth.admin || '') || null},
        ${externalUrlRaw}
      )
      RETURNING id, module_key, subcategory, subtopic, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at, external_url
    `
    return res.status(201).json({ ok: true, item: rows[0] })
  }

  const fileName = sanitizeUploadFileName(body.fileName, 'asset')
  const mimeType = resolveUploadMime(body.mimeType, fileName)
  if (!fileName) {
    return res.status(400).json({ error: '缺少必填字段（fileName）' })
  }
  const ext = getFileExtension(fileName)
  if (!ALLOWED_EXT.has(ext)) return res.status(400).json({ error: '不支持该文件扩展名' })
  if (!ALLOWED_MIME.has(mimeType)) {
    return res.status(400).json({ error: `不支持该文件类型（${mimeType || '未知'}），请使用 mp4 / mov / webm 等常见格式` })
  }

  const fileBuffer = Buffer.from(contentBase64, 'base64')
  if (!fileBuffer.length) return res.status(400).json({ error: '上传文件为空' })
  if (fileBuffer.length > MAX_FILE_SIZE) return res.status(400).json({ error: '文件超过 100MB 限制' })

  await fs.mkdir(STORAGE_DIR, { recursive: true })
  const storedName = await writeModuleAssetFile({
    moduleKey,
    subtopic,
    id,
    ext,
    buffer: fileBuffer,
  })

  const rows = await sql`
    INSERT INTO module_assets (id, module_key, subcategory, subtopic, required_level, title, summary, file_name, stored_name, mime_type, file_size, uploader, external_url)
    VALUES (${id}, ${moduleKey}, ${subcategory}, ${subtopic}, ${requiredLevel}, ${title}, ${summary || null}, ${fileName}, ${storedName}, ${mimeType}, ${fileBuffer.length}, ${String(auth.admin || '') || null}, ${externalUrlRaw || null})
    RETURNING id, module_key, subcategory, subtopic, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at, external_url
  `
  return res.status(201).json({ ok: true, item: rows[0] })
}

async function handleUpdate(req, res) {
  await ensureSchema()
  const auth = await authorizeSiteAdmin(req)
  if (!auth.ok) return res.status(auth.status).json({ code: auth.code, error: auth.error })

  const body = parseApiJsonBody(req, res)
  if (!body) return
  const id = String(body.id || '').trim()
  if (!id) return res.status(400).json({ error: '缺少资源 id' })

  const title = String(body.title || '').trim().slice(0, 200)
  const summary = String(body.summary || '').trim().slice(0, 4000)
  let subcategory = String(body.subcategory || 'general').trim().slice(0, 80) || 'general'
  let subtopic = String(body.subtopic || '').trim().slice(0, 120)
  const fileNameRaw = String(body.fileName || '').trim()
  const fileName = sanitizeUploadFileName(fileNameRaw || 'external-link', 'asset')
  const requiredLevel = normalizeContentLevelForStorage(body.requiredLevel || 'public')
  const externalUrlRaw = normalizeExternalUrl(body.externalUrl)
  if (externalUrlRaw === null) {
    return res.status(400).json({ error: '外链地址无效，请使用 http/https 链接' })
  }
  if (!title) return res.status(400).json({ error: '标题不能为空' })

  const existing = await sql`
    SELECT module_key, subtopic, stored_name, mime_type, external_url
    FROM module_assets
    WHERE id = ${id}
    LIMIT 1
  `
  if (!existing.length) return res.status(404).json({ error: '资源不存在' })

  const moduleKey = String(existing[0].module_key || '')
  const isLinkAsset = String(existing[0].mime_type || '') === 'text/uri-list'
    || !String(existing[0].stored_name || '').trim()
  if (!isLinkAsset && !fileNameRaw) {
    return res.status(400).json({ error: '资料名称不能为空' })
  }
  if (moduleKey === 'health-skills') {
    const grouped = resolveHealthSkillsAssetGrouping({
      subtopic,
      subcategory,
      title,
      storedName: existing[0].stored_name,
    })
    subcategory = grouped.subcategory.slice(0, 80) || subcategory
    subtopic = grouped.subtopic.slice(0, 120)
    if (!subtopic) {
      return res.status(400).json({ error: '请选择系列合集（与课程系列一致）' })
    }
  }

  let storedName = String(existing[0].stored_name || '')
  if (storedName) {
    try {
      storedName = await relocateModuleAssetFile({
        storedName,
        moduleKey: existing[0].module_key,
        subtopic,
        id,
      })
    } catch (e) {
      console.error('module-assets relocate error', e)
      return res.status(500).json({ error: '资料文件迁移失败' })
    }
  }

  const nextExternalUrl = externalUrlRaw || (isLinkAsset ? String(existing[0].external_url || '') : null)
  if (isLinkAsset && !nextExternalUrl) {
    return res.status(400).json({ error: '链接型资讯必须填写外链地址' })
  }

  const rows = await sql`
    UPDATE module_assets
    SET title = ${title},
        summary = ${summary || null},
        subcategory = ${subcategory},
        subtopic = ${subtopic},
        file_name = ${isLinkAsset ? 'external-link' : fileName},
        stored_name = ${storedName},
        required_level = ${requiredLevel},
        external_url = ${nextExternalUrl || null},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, module_key, subcategory, subtopic, required_level, title, summary, file_name, mime_type, file_size, uploader, created_at, updated_at, external_url
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
