import { splitLocalePath } from '../../src/lib/localePath.js'
import { pageIndexable } from '../../src/data/seo.js'
import { newsArticleIdFromPath, newsHubLastmod, newsSitemapEntries } from '../../src/lib/newsArticleSeo.js'
import { buildLlmsTxt, buildSitemapXml } from '../../src/lib/seoPublicFiles.js'
import { renderNewsArticleHtml, renderRouteHtml, staticNewsCards } from './prerender.mjs'

const newsCards = staticNewsCards()

function sendText(res, body, contentType) {
  res.statusCode = 200
  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'no-cache')
  res.end(body)
}

/** 开发服务器直接吐出 sitemap、llms.txt，以及带 title / meta / JSON-LD 的公开页 HTML。 */
export function seoDevPlugin() {
  return {
    name: 'seo-discoverability',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = String(req.url || '').split('?')[0]
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
        next()
      })
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
