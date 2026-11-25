/**
 * 把已上传资讯的标题收成稳定 slug，并写出跳转表。
 * 已有 id 保持原 slug。新 id 才按标题生成。不抓取、不改写微信正文。
 *
 *   node scripts/seo/build-news-slugs.mjs /path/to/module-assets.json
 *   SEO_NEWS_API=https://www.healthlongevity.cn node scripts/seo/build-news-slugs.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pinyin } from 'pinyin-pro'
import { nginxNewsRedirectConf } from '../../src/lib/newsSlug.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const slugFile = path.join(rootDir, 'src/data/newsLegacySlugs.js')
const nginxFile = path.join(rootDir, 'deploy/nginx-news-slug-redirects.conf')

function slugifyTitle(title) {
  const raw = pinyin(String(title || ''), { toneType: 'none', nonZh: 'consecutive', v: true })
  let slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (!slug) slug = 'insight'
  return slug
}

function fitSlug(base, suffix) {
  const tail = `-${suffix}`
  let head = base.replace(/-+$/g, '')
  if (head.length + tail.length > 80) {
    head = head.slice(0, 80 - tail.length).replace(/-+$/g, '')
  }
  let slug = `${head}${tail}`.replace(/-+/g, '-').replace(/^-|-$/g, '')
  if (!/^[A-Za-z0-9]/.test(slug)) slug = `n${slug}`
  return slug.slice(0, 80)
}

export function slugForUpload(title, id, used) {
  const hex = String(id || '').replace(/^upload-/, '').replace(/[^a-f0-9]/gi, '').toLowerCase()
  const base = slugifyTitle(title)
  let take = 8
  let slug = fitSlug(base, hex.slice(0, take) || 'item')
  while (used.has(slug) && take < hex.length) {
    take += 4
    slug = fitSlug(base, hex.slice(0, take))
  }
  used.add(slug)
  return slug
}

function readExisting() {
  if (!fs.existsSync(slugFile)) return {}
  const text = fs.readFileSync(slugFile, 'utf8')
  const map = {}
  for (const match of text.matchAll(/"(upload-[^"]+)": "([^"]+)"/g)) {
    map[match[1]] = match[2]
  }
  return map
}

async function loadItems() {
  const fileArg = process.argv[2]
  if (fileArg) {
    const data = JSON.parse(fs.readFileSync(fileArg, 'utf8'))
    return Array.isArray(data.items) ? data.items : data
  }
  const origin = String(process.env.SEO_NEWS_API || 'http://127.0.0.1:3000').replace(/\/$/, '')
  const res = await fetch(`${origin}/api/module-assets?module=longevity-news`)
  if (!res.ok) throw new Error(`news api HTTP ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.items) ? data.items : []
}

function writeSlugModule(map) {
  const lines = Object.keys(map).sort().map((id) => `  "${id}": "${map[id]}",`)
  const body = `/** 上传资讯的旧 id → 可读 slug。由 scripts/seo/build-news-slugs.mjs 生成。已有 id 不要改写。 */\nexport const NEWS_LEGACY_SLUGS = {\n${lines.join('\n')}\n}\n`
  fs.writeFileSync(slugFile, body)
}

function writeNginx(map) {
  fs.writeFileSync(nginxFile, nginxNewsRedirectConf(map))
}

const items = await loadItems()
const existing = readExisting()
const used = new Set(Object.values(existing))
const map = { ...existing }
let added = 0
for (const item of items) {
  const id = `upload-${item.id}`
  if (!item?.id || !item.title || map[id]) continue
  map[id] = slugForUpload(item.title, id, used)
  added += 1
}
writeSlugModule(map)
writeNginx(map)
console.log(`[seo] news slugs ${Object.keys(map).length} (+${added})`)
