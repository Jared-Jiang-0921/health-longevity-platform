#!/usr/bin/env node
/**
 * 将已有 health-skills 视频/资料移入按系列分文件夹的结构：
 * storage/module-assets/health-skills/{系列合集名}/{id}.ext
 *
 * 在 ECS 项目根执行：node scripts/ops/migrate-health-skills-series-folders.mjs
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { sql } from '../../lib/db.js'
import {
  buildStoredRelativePath,
  getModuleAssetsRoot,
  locateModuleAssetAbsPath,
  relocateModuleAssetFile,
} from '../../lib/moduleAssetStorage.js'
import { getFileExtension } from '../../lib/uploadFileName.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
process.chdir(projectRoot)

const envProd = path.join(projectRoot, '.env.prod')
loadEnv({ path: envProd, override: true })

async function main() {
  const rows = await sql`
    SELECT id, module_key, subtopic, stored_name, file_name, title
    FROM module_assets
    WHERE module_key = 'health-skills'
    ORDER BY created_at ASC
  `

  console.log(`[migrate] health-skills assets: ${rows.length}`)
  let moved = 0
  let skipped = 0
  let missing = 0
  let failed = 0

  for (const row of rows) {
    const id = String(row.id)
    const subtopic = String(row.subtopic || '')
    const ext =
      getFileExtension(row.stored_name) ||
      getFileExtension(row.file_name) ||
      'mp4'
    const targetRel = buildStoredRelativePath('health-skills', subtopic, id, ext)

    if (String(row.stored_name || '').trim() === targetRel) {
      skipped += 1
      continue
    }

    try {
      await locateModuleAssetAbsPath(row.stored_name)
    } catch {
      console.warn(`[missing] ${id} ${row.title} stored=${row.stored_name}`)
      missing += 1
      continue
    }

    try {
      const newRel = await relocateModuleAssetFile({
        storedName: row.stored_name,
        moduleKey: 'health-skills',
        subtopic,
        id,
      })
      await sql`UPDATE module_assets SET stored_name = ${newRel} WHERE id = ${id}`
      console.log(`[moved] ${row.title}`)
      console.log(`        ${row.stored_name} -> ${newRel}`)
      moved += 1
    } catch (e) {
      console.error(`[fail] ${id} ${row.title}`, e?.message || e)
      failed += 1
    }
  }

  console.log('')
  console.log(`[done] moved=${moved} skipped=${skipped} missing=${missing} failed=${failed}`)
  console.log(`[root] ${getModuleAssetsRoot()}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
