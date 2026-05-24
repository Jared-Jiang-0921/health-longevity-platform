import fs from 'node:fs/promises'
import path from 'node:path'
import { getFileExtension } from './uploadFileName.js'

export const MODULE_ASSETS_ROOT_SEG = 'storage/module-assets'

export function getModuleAssetsRoot(cwd = process.cwd()) {
  return path.join(cwd, MODULE_ASSETS_ROOT_SEG)
}

/** 系列合集名 → 文件夹名（保留中文，去掉非法路径字符） */
export function sanitizeSeriesDirName(subtopic) {
  const s = String(subtopic || '').trim().slice(0, 80)
  if (!s) return '_未分类'
  const cleaned = s.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim()
  return cleaned || '_未分类'
}

/**
 * 相对 storage/module-assets 的路径（POSIX，入库 stored_name）
 * health-skills：health-skills/{系列名}/{id}.ext
 */
export function buildStoredRelativePath(moduleKey, subtopic, id, ext) {
  const file = `${id}.${ext || 'bin'}`
  const key = String(moduleKey || 'general').trim() || 'general'
  if (key === 'health-skills') {
    const series = sanitizeSeriesDirName(subtopic)
    return path.posix.join('health-skills', series, file)
  }
  return path.posix.join(key, file)
}

export function resolveModuleAssetAbsPath(storedName, cwd = process.cwd()) {
  const root = path.resolve(getModuleAssetsRoot(cwd))
  const sn = String(storedName || '').trim()
  if (!sn || sn.includes('..')) {
    throw Object.assign(new Error('invalid stored_name'), { code: 'EINVAL' })
  }
  const abs = path.resolve(root, sn)
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    throw Object.assign(new Error('invalid stored_name'), { code: 'EINVAL' })
  }
  return abs
}

/** 新路径或旧版扁平 {uuid}.ext */
export async function locateModuleAssetAbsPath(storedName, cwd = process.cwd()) {
  const root = getModuleAssetsRoot(cwd)
  const sn = String(storedName || '').trim()
  if (!sn) throw Object.assign(new Error('empty stored_name'), { code: 'EINVAL' })

  const candidates = [
    resolveModuleAssetAbsPath(sn, cwd),
    path.join(root, path.basename(sn)),
  ]
  for (const abs of candidates) {
    try {
      await fs.access(abs)
      return abs
    } catch (e) {
      if (e?.code !== 'ENOENT') throw e
    }
  }
  const err = new Error('文件不存在')
  err.code = 'ENOENT'
  throw err
}

export async function writeModuleAssetFile({
  moduleKey,
  subtopic,
  id,
  ext,
  buffer,
  cwd = process.cwd(),
}) {
  const rel = buildStoredRelativePath(moduleKey, subtopic, id, ext)
  const abs = resolveModuleAssetAbsPath(rel, cwd)
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, buffer)
  return rel
}

export async function unlinkModuleAssetFile(storedName, cwd = process.cwd()) {
  try {
    const abs = await locateModuleAssetAbsPath(storedName, cwd)
    await fs.unlink(abs)
  } catch (e) {
    if (e?.code !== 'ENOENT') throw e
  }
}

/** 编辑系列或模块时，将文件移到对应系列文件夹 */
export async function relocateModuleAssetFile({
  storedName,
  moduleKey,
  subtopic,
  id,
  cwd = process.cwd(),
}) {
  const ext =
    getFileExtension(storedName) ||
    getFileExtension(String(storedName).split('/').pop() || '') ||
    'bin'
  const targetRel = buildStoredRelativePath(moduleKey, subtopic, id, ext)
  if (String(storedName || '').trim() === targetRel) return targetRel

  const srcAbs = await locateModuleAssetAbsPath(storedName, cwd)
  const destAbs = resolveModuleAssetAbsPath(targetRel, cwd)
  if (srcAbs === destAbs) return targetRel

  await fs.mkdir(path.dirname(destAbs), { recursive: true })
  await fs.rename(srcAbs, destAbs)
  return targetRel
}
