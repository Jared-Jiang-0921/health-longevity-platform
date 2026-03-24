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
      CREATE TABLE IF NOT EXISTS orgs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        domain TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'active',
        owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_orgs_domain ON orgs(domain)`
    await sql`
      CREATE TABLE IF NOT EXISTS org_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'member',
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(org_id, user_id)
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON org_members(org_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id)`
    await sql`
      CREATE TABLE IF NOT EXISTS org_invites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        invite_token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_org_invites_org_id ON org_invites(org_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_org_invites_email ON org_invites(email)`
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
    return res.status(200).json({ ok: true, message: 'users/orgs/org_members/org_invites/payment_event_logs tables ready' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
