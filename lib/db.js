import { neon } from '@neondatabase/serverless'

/** 避免 DATABASE_URL 未设置时 neon(undefined) 在加载阶段就抛错，导致整段 API 返回 HTML 500 */
let _sql
function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) {
    throw new Error('DATABASE_URL 未配置：请在 Vercel Environment Variables 中设置 DATABASE_URL 或 POSTGRES_URL')
  }
  if (!_sql) _sql = neon(url)
  return _sql
}

export function sql(strings, ...values) {
  return getSql()(strings, ...values)
}
