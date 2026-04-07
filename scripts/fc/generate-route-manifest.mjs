import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '../../')
const apiDir = path.join(rootDir, 'api')
const outDir = path.join(rootDir, 'fc')
const outPath = path.join(outDir, 'route-manifest.json')

function walk(dir) {
  return fs.readdir(dir, { withFileTypes: true }).then(async (entries) => {
    const out = []
    for (const ent of entries) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        out.push(...(await walk(full)))
      } else if (ent.isFile() && ent.name.endsWith('.js')) {
        out.push(full)
      }
    }
    return out
  })
}

function pathToRoutePattern(relApiPath) {
  // relApiPath example: auth/login.js, org/[action].js
  const noExt = relApiPath.replace(/\.js$/, '')
  const parts = noExt.split(path.sep).filter(Boolean)
  const segments = parts.map((p) => {
    const m = p.match(/^\[(.+)\]$/)
    if (m) return `:${m[1]}`
    return p
  })

  const paramKeys = []
  for (const s of segments) {
    if (s.startsWith(':')) paramKeys.push(s.slice(1))
  }

  return {
    urlPath: '/api/' + segments.join('/'),
    segments,
    paramKeys,
  }
}

async function main() {
  const files = await walk(apiDir)

  const routes = []
  for (const absFile of files) {
    const rel = path.relative(apiDir, absFile)
    const { segments, paramKeys } = pathToRoutePattern(rel)

    // backend-entry.mjs 在 fc/ 下，所以 api 文件相对路径是 ../api/...
    const moduleRel = path.join('..', 'api', rel).replace(/\\/g, '/')

    routes.push({
      // 运行时用于 matchRoute 的段落结构
      segments,
      paramKeys,
      modulePath: moduleRel,
      sourceFile: path.join('api', rel),
    })
  }

  await fs.mkdir(outDir, { recursive: true })
  const manifest = { version: 1, routes }
  await fs.writeFile(outPath, JSON.stringify(manifest, null, 2), 'utf8')
  console.log(`route-manifest generated: ${outPath} (routes=${routes.length})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

