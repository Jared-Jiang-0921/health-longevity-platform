#!/usr/bin/env node
/**
 * 长寿知识技能：同系列视频归入同一子模块（亚类 + 系列合集），并移入对应磁盘目录
 * storage/module-assets/health-skills/{系列合集名}/{id}.ext
 *
 * 在 ECS 项目根执行：npm run ops:migrate-series-folders
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
import { resolveHealthSkillsAssetGrouping } from '../../src/data/healthSkillsSeries.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
process.chdir(projectRoot)

const envProd = path.join(projectRoot, '.env.prod')
loadEnv({ path: envProd, override: true })

async function main() {
  const rows = await sql`
    SELECT id, module_key, subcategory, subtopic, stored_name, file_name, title
    FROM module_assets
    WHERE module_key = 'health-skills'
    ORDER BY created_at ASC
  `

  console.log(`[migrate] health-skills assets: ${rows.length}`)
  let moved = 0
  let metaUpdated = 0
  let skipped = 0
  let missing = 0
  let failed = 0

  for (const row of rows) {
    const id = String(row.id)
    const grouped = resolveHealthSkillsAssetGrouping({
      subtopic: row.subtopic,
      subcategory: row.subcategory,
      title: row.title,
      storedName: row.stored_name,
    })
    const subtopic = grouped.subtopic
    const subcategory = grouped.subcategory

    const ext =
      getFileExtension(row.stored_name) ||
      getFileExtension(row.file_name) ||
      'mp4'
    const targetRel = buildStoredRelativePath('health-skills', subtopic, id, ext)

    const metaSame =
      String(row.subtopic || '').trim() === subtopic &&
      String(row.subcategory || '').trim() === subcategory
    const pathSame = String(row.stored_name || '').trim() === targetRel

    if (metaSame && pathSame) {
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
      let newRel = String(row.stored_name || '').trim()
      if (!pathSame) {
        newRel = await relocateModuleAssetFile({
          storedName: row.stored_name,
          moduleKey: 'health-skills',
          subtopic,
          id,
        })
        moved += 1
      }
      if (!metaSame || newRel !== row.stored_name) {
        await sql`
          UPDATE module_assets
          SET subcategory = ${subcategory},
              subtopic = ${subtopic},
              stored_name = ${newRel}
          WHERE id = ${id}
        `
        metaUpdated += 1
      }
      console.log(`[ok] ${row.title}`)
      if (!metaSame) {
        console.log(`     亚类: ${row.subcategory} -> ${subcategory}`)
        console.log(`     系列: ${row.subtopic} -> ${subtopic}`)
      }
      if (!pathSame) {
        console.log(`     路径: ${row.stored_name} -> ${newRel}`)
      }
    } catch (e) {
      console.error(`[fail] ${id} ${row.title}`, e?.message || e)
      failed += 1
    }
  }

  console.log('')
  console.log(
    `[done] files_moved=${moved} meta_updated=${metaUpdated} skipped=${skipped} missing=${missing} failed=${failed}`,
  )
  console.log(`[root] ${getModuleAssetsRoot()}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
