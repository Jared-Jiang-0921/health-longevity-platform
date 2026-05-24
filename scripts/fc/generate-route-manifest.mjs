import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { routeFromApiFile, walkApiJsFiles } from '../../lib/apiRouteTable.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '../../')
const apiDir = path.join(rootDir, 'api')
const outDir = path.join(rootDir, 'fc')
const outPath = path.join(outDir, 'route-manifest.json')

async function main() {
  const files = await walkApiJsFiles(apiDir)

  const routes = []
  for (const absFile of files) {
    const rel = path.relative(apiDir, absFile)
    const { segments, paramKeys, catchAll } = routeFromApiFile(rel)
    const moduleRel = path.join('..', 'api', rel).replace(/\\/g, '/')

    routes.push({
      segments,
      paramKeys,
      catchAll,
      modulePath: moduleRel,
      sourceFile: path.join('api', rel),
    })
  }

  await fs.mkdir(outDir, { recursive: true })
  const manifest = { version: 1, routes }
  await fs.writeFile(outPath, JSON.stringify(manifest, null, 2), 'utf8')
  console.log(`[fc] wrote ${routes.length} routes to ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
