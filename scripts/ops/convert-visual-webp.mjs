#!/usr/bin/env node
/**
 * 将 public/images/visual 下所有 PNG 转为同路径 .webp（保留 PNG 作 fallback）
 */
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const VISUAL_DIR = path.join(ROOT, 'public/images/visual')
const QUALITY = 84

async function walkPng(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      files.push(...(await walkPng(full)))
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.png')) {
      files.push(full)
    }
  }
  return files
}

async function convertOne(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp')
  const pngStat = await stat(pngPath)
  await sharp(pngPath)
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(webpPath)
  const webpStat = await stat(webpPath)
  const saved = ((1 - webpStat.size / pngStat.size) * 100).toFixed(1)
  console.log(
    `${path.relative(ROOT, pngPath)} → ${path.relative(ROOT, webpPath)} (${formatKb(pngStat.size)} → ${formatKb(webpStat.size)}, -${saved}%)`,
  )
}

function formatKb(n) {
  return `${(n / 1024).toFixed(0)}KB`
}

const pngs = await walkPng(VISUAL_DIR)
if (!pngs.length) {
  console.log('[skip] no PNG under public/images/visual')
  process.exit(0)
}

console.log(`Converting ${pngs.length} PNG(s) at quality ${QUALITY}…`)
for (const png of pngs) {
  await convertOne(png)
}
console.log('[ok] WebP conversion finished')
