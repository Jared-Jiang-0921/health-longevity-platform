/**
 * 初始化数据库表（仅开发/首次部署时调用一次）
 * GET /api/init-db
 */
import { sql } from '../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    return res.status(500).json({ error: 'Missing DATABASE_URL' })
  }
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        level TEXT NOT NULL DEFAULT 'free',
        expires_at TIMESTAMPTZ,
        stripe_customer_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`
      CREATE TABLE IF NOT EXISTS payment_event_logs (
        id BIGSERIAL PRIMARY KEY,
        provider TEXT NOT NULL,
        event_key TEXT NOT NULL,
        source TEXT,
        user_id TEXT,
        session_id TEXT,
        plan TEXT,
        currency TEXT,
        status TEXT NOT NULL,
        error_code TEXT,
        error_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(provider, event_key)
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_event_logs_session_id ON payment_event_logs(session_id)`
    return res.status(200).json({ ok: true, message: 'users/payment_event_logs tables ready' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
