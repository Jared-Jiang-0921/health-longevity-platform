import assert from 'node:assert/strict'
import test from 'node:test'
import { canonicalRedirectTarget } from './siteCanonical.js'

function go(host, pathname, search = '') {
  return canonicalRedirectTarget({ host, pathname, search })
}

test('arabic and trailing-slash aliases resolve in one hop to the Chinese canonical URL', () => {
  assert.equal(go('healthlongevity.cn', '/ar'), 'https://www.healthlongevity.cn/')
  assert.equal(go('healthlongevity.cn', '/ar/'), 'https://www.healthlongevity.cn/')
  assert.equal(go('healthlongevity.cn', '/ar/about'), 'https://www.healthlongevity.cn/about')
  assert.equal(go('healthlongevity.cn', '/ar/about/'), 'https://www.healthlongevity.cn/about')
  assert.equal(go('www.healthlongevity.cn', '/ar/faq/'), 'https://www.healthlongevity.cn/faq')
  assert.equal(go('www.healthlongevity.cn', '/about/'), 'https://www.healthlongevity.cn/about')
  assert.equal(go('www.healthlongevity.cn', '/en'), 'https://www.healthlongevity.cn/en/')
  assert.equal(go('www.healthlongevity.cn', '/en/'), null)
  assert.equal(go('www.healthlongevity.cn', '/'), null)
  assert.equal(go('www.healthlongevity.cn', '/about'), null)
})

test('lang query leaves the parameter page and keeps other query values', () => {
  assert.equal(go('www.healthlongevity.cn', '/about', '?lang=en'), 'https://www.healthlongevity.cn/en/about')
  assert.equal(go('www.healthlongevity.cn', '/', '?lang=en'), 'https://www.healthlongevity.cn/en/')
  assert.equal(go('www.healthlongevity.cn', '/en/about', '?lang=zh'), 'https://www.healthlongevity.cn/about')
  assert.equal(go('www.healthlongevity.cn', '/about', '?lang=ar'), 'https://www.healthlongevity.cn/about')
  assert.equal(go('healthlongevity.cn', '/ar/about', '?lang=en'), 'https://www.healthlongevity.cn/en/about')
  assert.equal(
    go('www.healthlongevity.cn', '/faq', '?lang=en&utm=spring'),
    'https://www.healthlongevity.cn/en/faq?utm=spring',
  )
})

test('the Vercel hostname redirects to the same canonical path', () => {
  assert.equal(go('healthlongevityplatform.vercel.app', '/'), 'https://www.healthlongevity.cn/')
  assert.equal(go('healthlongevityplatform.vercel.app', '/en/'), 'https://www.healthlongevity.cn/en/')
  assert.equal(go('healthlongevityplatform.vercel.app', '/en'), 'https://www.healthlongevity.cn/en/')
  assert.equal(go('healthlongevityplatform.vercel.app', '/en/about'), 'https://www.healthlongevity.cn/en/about')
  assert.equal(go('healthlongevityplatform.vercel.app', '/ar/consult/'), 'https://www.healthlongevity.cn/consult')
  assert.equal(go('localhost', '/about/'), '/about')
  assert.equal(go('localhost', '/about'), null)
  assert.equal(go('www.healthlongevity.cn', '/api/health'), null)
})
