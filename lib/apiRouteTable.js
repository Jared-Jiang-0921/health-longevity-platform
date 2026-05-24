import fs from 'node:fs/promises'
import path from 'node:path'

/** api/org/[action].js → segments ['org', ':action'] */
export function routeFromApiFile(relApiPath) {
  const noExt = String(relApiPath || '').replace(/\.js$/, '')
  const parts = noExt.split(path.sep).filter(Boolean)
  let catchAll = false
  const segments = parts.map((p) => {
    const restM = p.match(/^\[\.\.\.(.+)\]$/)
    if (restM) {
      catchAll = true
      return `:${restM[1]}`
    }
    const m = p.match(/^\[(.+)\]$/)
    return m ? `:${m[1]}` : p
  })

  const paramKeys = segments.filter((s) => s.startsWith(':')).map((s) => s.slice(1))
  return { segments, paramKeys, catchAll }
}

export function matchSegments(patternSegs, requestSegs) {
  if (patternSegs.length !== requestSegs.length) return null
  const params = {}
  for (let i = 0; i < patternSegs.length; i += 1) {
    const ps = patternSegs[i]
    const rs = requestSegs[i]
    if (ps.startsWith(':')) {
      params[ps.slice(1)] = rs
    } else if (ps !== rs) {
      return null
    }
  }
  return params
}

/** 匹配末尾 catch-all（如 auth/[...path].js） */
export function matchCatchAll(patternSegs, requestSegs) {
  if (!patternSegs.length) return null
  const last = patternSegs[patternSegs.length - 1]
  if (!last.startsWith(':')) return null
  const staticPrefix = patternSegs.slice(0, -1)
  if (requestSegs.length < staticPrefix.length + 1) return null
  for (let i = 0; i < staticPrefix.length; i += 1) {
    if (staticPrefix[i] !== requestSegs[i]) return null
  }
  const rest = requestSegs.slice(staticPrefix.length)
  const paramName = last.slice(1)
  return { [paramName]: rest.join('/') }
}

/** 扫描 api 目录下全部 .js（跟随 symlink，与 ECS api-server 一致） */
export async function walkApiJsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    let st
    try {
      st = await fs.stat(full)
    } catch {
      continue
    }
    if (st.isDirectory()) out.push(...(await walkApiJsFiles(full)))
    else if (st.isFile() && ent.name.endsWith('.js')) out.push(full)
  }
  return out
}

/** @param {{ segments: string[], catchAll?: boolean }[]} routes */
export function matchApiRoute(routes, requestSegments) {
  for (const r of routes) {
    const routeSegs = r.segments || []
    if (r.catchAll) {
      const params = matchCatchAll(routeSegs, requestSegments)
      if (params) return { route: r, params }
      continue
    }
    const params = matchSegments(routeSegs, requestSegments)
    if (params) return { route: r, params }
  }
  return null
}

export async function buildApiRouteTable(apiDirAbs) {
  const files = await walkApiJsFiles(apiDirAbs)
  const routes = []
  for (const absFile of files) {
    const rel = path.relative(apiDirAbs, absFile)
    const { segments, paramKeys, catchAll } = routeFromApiFile(rel)
    routes.push({ segments, paramKeys, catchAll, absFile })
  }
  return routes
}
