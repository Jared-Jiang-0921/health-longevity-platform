import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NEWS_LEGACY_SLUGS } from '../data/newsLegacySlugs.js'
import { NEWS_ID_RE, newsSitemapEntries } from './newsArticleSeo.js'
import {
  composeVercelRedirects,
  newsLegacyLocation,
  newsLegacyRedirectRules,
  newsPublicId,
} from './newsSlug.js'
import { vercelRedirectRules } from './siteCanonical.js'
import { documentStatus } from './sitePaths.js'
import { toNewsSearchCard } from './longevityNewsCard.js'
import { buildSitemapXml } from './seoPublicFiles.js'

test('every upload slug is unique, stable, and a legal news id', () => {
  const values = Object.values(NEWS_LEGACY_SLUGS)
  assert.equal(values.length, 139)
  assert.equal(new Set(values).size, values.length)
  for (const [id, slug] of Object.entries(NEWS_LEGACY_SLUGS)) {
    assert.match(id, /^upload-[0-9a-f-]{36}$/)
    assert.equal(NEWS_ID_RE.test(slug), true)
    assert.equal(newsPublicId(id), slug)
    assert.notEqual(slug, id)
  }
})

test('legacy upload URLs redirect once to the Chinese slug', () => {
  const id = Object.keys(NEWS_LEGACY_SLUGS).sort()[0]
  const slug = NEWS_LEGACY_SLUGS[id]
  assert.equal(newsLegacyLocation(`/longevity-news/${id}`), `/longevity-news/${slug}`)
  assert.equal(newsLegacyLocation(`/en/longevity-news/${id}/`), `/longevity-news/${slug}`)
  assert.equal(newsLegacyLocation(`/longevity-news/${slug}`), '')
  assert.equal(newsLegacyLocation('/longevity-news/ln-static-1'), '')
  assert.equal(newsLegacyLocation('/ar/longevity-news/' + id), '')

  const card = toNewsSearchCard({ id, title: '只有标题', summary: '来自公众号' })
  const xml = buildSitemapXml({ extra: newsSitemapEntries([card]) })
  assert.match(xml, new RegExp(`<loc>https://www.healthlongevity.cn/longevity-news/${slug}</loc>`))
  assert.equal(xml.includes(`/longevity-news/${id}`), false)
  assert.equal(xml.includes(`/en/longevity-news/${slug}`), false)
  assert.equal(documentStatus(`/longevity-news/${slug}`, { cards: [card] }), 'ok')
  assert.equal(documentStatus(`/longevity-news/${id}`, { cards: [card] }), 'missing')
  assert.equal(documentStatus(`/en/longevity-news/${slug}`, { cards: [card] }), 'missing')
})

test('vercel and nginx lists use the same slug table', () => {
  const rules = newsLegacyRedirectRules()
  assert.equal(rules.length, 278)
  assert.equal(rules.every((rule) => rule.statusCode === 301), true)
  const composed = composeVercelRedirects(vercelRedirectRules())
  const hostAt = composed.findIndex((rule) => (rule.has || []).some((item) => item.type === 'host'))
  const firstNews = composed.findIndex((rule) => rule.source.startsWith('/longevity-news/upload-'))
  assert.ok(firstNews > 0 && firstNews < hostAt)
  const nginx = fs.readFileSync(new URL('../../deploy/nginx-news-slug-redirects.conf', import.meta.url), 'utf8')
  const id = 'upload-03c3a6ac-bcaa-4fb9-9779-122e5f0e8ee0'
  const slug = NEWS_LEGACY_SLUGS[id]
  assert.match(nginx, new RegExp(`location = /longevity-news/${id} \\{ return 301 https://www.healthlongevity.cn/longevity-news/${slug}; \\}`))
  assert.match(nginx, new RegExp(`location = /en/longevity-news/${id} \\{ return 301 https://www.healthlongevity.cn/longevity-news/${slug}; \\}`))
  assert.equal(nginx.includes('/ar/'), false)
})
