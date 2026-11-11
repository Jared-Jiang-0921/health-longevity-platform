import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { splitLocalePath } from '../../src/lib/localePath.js'
import { pageIndexable } from '../../src/data/seo.js'
import { newsArticleIdFromPath, newsHubLastmod, newsSitemapEntries } from '../../src/lib/newsArticleSeo.js'
import { documentStatus } from '../../src/lib/sitePaths.js'
import { buildLlmsTxt, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'
import { renderNewsArticleHtml, renderRouteHtml, staticNewsCards } from './prerender.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const publicDir = path.join(rootDir, 'public')
const newsCards = staticNewsCards()
const notFoundHtml = fs.readFileSync(path.join(publicDir, '404.html'))

function sendText(res, body, contentType) {
  res.statusCode = 200
  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'no-cache')
  res.end(body)
}

function sendMissingDocument(res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  res.setHeader('Cache-Control', 'no-cache')
  res.end(notFoundHtml)
}

function sendMissingAsset(res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.end('Not found')
}

function isViteInternal(pathname) {
  return pathname.startsWith('/@')
    || pathname.startsWith('/src/')
    || pathname.startsWith('/node_modules/')
    || pathname.startsWith('/__')
}

function hasAssetExtension(pathname) {
  return /\.(?:js|mjs|css|map|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|json|txt|xml|webmanifest)$/i.test(pathname)
}

function fileExists(root, pathname) {
  const full = path.join(root, pathname.replace(/^\/+/, ''))
  try {
    return fs.statSync(full).isFile()
  } catch {
    return false
  }
}

function installRouting(server, { allowDevPreview, fileRoot, localeShell }) {
  server.middlewares.use((req, res, next) => {
    const pathname = String(req.url || '').split('?')[0]
    const method = req.method || 'GET'
    if (method !== 'GET' && method !== 'HEAD') {
      next()
      return
    }
    if (pathname === '/sitemap.xml') {
      sendText(res, buildSitemapXml({
        extra: newsSitemapEntries(newsCards),
        newsLastmod: newsHubLastmod(newsCards),
      }), 'application/xml; charset=utf-8')
      return
    }
    if (pathname === '/llms.txt') {
      sendText(res, buildLlmsTxt({ articles: newsCards }), 'text/plain; charset=utf-8')
      return
    }
    if (isViteInternal(pathname)) {
      next()
      return
    }
    // 开发时 Vite 要编译仓库里的源文件（例如 /lib/contentAccess.js）。只拦真正缺失的静态资源。
    if (!localeShell && fileExists(rootDir, pathname)) {
      next()
      return
    }
    if (pathname === '/index.html' || pathname === '/en/index.html' || pathname === '/ar/index.html') {
      next()
      return
    }
    if (hasAssetExtension(pathname) || pathname.endsWith('.html')) {
      if (fileExists(fileRoot, pathname)) next()
      else if (pathname.endsWith('.html')) sendMissingDocument(res)
      else sendMissingAsset(res)
      return
    }
    const status = documentStatus(pathname, { cards: newsCards, allowDevPreview })
    if (status === 'passthrough') {
      if (localeShell) sendMissingAsset(res)
      else next()
      return
    }
    if (status === 'ok') {
      if (localeShell) {
        const indexRel = pathname === '/'
          ? '/index.html'
          : `${pathname.endsWith('/') ? pathname : `${pathname}/`}index.html`
        const { lang } = splitLocalePath(pathname)
        const shell = lang === 'en' ? '/en/index.html' : lang === 'ar' ? '/ar/index.html' : '/index.html'
        const rel = fileExists(fileRoot, indexRel) ? indexRel : shell
        const body = fs.readFileSync(path.join(fileRoot, rel.replace(/^\//, '')))
        sendText(res, body, 'text/html; charset=utf-8')
        return
      }
      next()
      return
    }
    sendMissingDocument(res)
  })
}

/** 开发服务器直接吐出 sitemap、llms.txt，以及带 title / meta / JSON-LD 的公开页 HTML。未知页面返回 404。 */
export function seoDevPlugin() {
  return {
    name: 'seo-discoverability',
    apply: 'serve',
    configureServer(server) {
      installRouting(server, { allowDevPreview: true, fileRoot: publicDir, localeShell: false })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.server) return html
        const { lang, routerPath } = splitLocalePath(ctx.originalUrl || ctx.path || '/')
        const articleId = newsArticleIdFromPath(routerPath)
        const articleCard = articleId ? newsCards.find((card) => card.id === articleId) : null
        const rendered = articleCard
          ? renderNewsArticleHtml(html, { lang, card: articleCard })
          : renderRouteHtml(html, { lang, pathname: routerPath, newsCards })
        if (rendered) return rendered
        if (!pageIndexable(routerPath)) {
          return html.replace(
            /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
            '<meta name="robots" content="noindex,nofollow" />',
          )
        }
        return html
      },
    },
  }
}

/** vite preview 使用构建产物。未知 HTML 返回 404，动态路径回退到对应语言的壳。 */
export function seoPreviewPlugin() {
  return {
    name: 'seo-preview-404',
    configurePreviewServer(server) {
      const outDir = path.resolve(server.config.root, server.config.build.outDir)
      installRouting(server, { allowDevPreview: false, fileRoot: outDir, localeShell: true })
    },
  }
}
