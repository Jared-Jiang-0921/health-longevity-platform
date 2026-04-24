import { neon } from '@neondatabase/serverless'
import pg from 'pg'

/** 支持两种数据库来源：
 * 1) Neon / Vercel Postgres：继续使用 @neondatabase/serverless
 * 2) 本机 Postgres（127.0.0.1 / localhost）：改走 pg 驱动
 */
let _sql
let _pool

function getDbUrl() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) {
    throw new Error('DATABASE_URL 未配置：请在 Vercel Environment Variables 中设置 DATABASE_URL 或 POSTGRES_URL')
  }
  return url
}

function isLocalPostgres(url) {
  return /@(127\.0\.0\.1|localhost)(:\d+)?\//i.test(url)
}

function toParameterizedQuery(strings, values) {
  let text = ''
  for (let i = 0; i < strings.length; i += 1) {
    text += strings[i]
    if (i < values.length) text += `$${i + 1}`
  }
  return text
}

function getSql() {
  const url = getDbUrl()
  if (isLocalPostgres(url)) {
    if (!_pool) _pool = new pg.Pool({ connectionString: url })
    return async (strings, ...values) => {
      const text = toParameterizedQuery(strings, values)
      const result = await _pool.query(text, values)
      return result.rows
    }
  }
  if (!_sql) _sql = neon(url)
  return _sql
}

export function sql(strings, ...values) {
  return getSql()(strings, ...values)
}
