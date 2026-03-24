import { sql } from './db.js'

let orgTablesReady = false

export async function ensureOrgTables() {
  if (orgTablesReady) return
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
  orgTablesReady = true
}

export function normalizeDomain(domain) {
  return String(domain || '').trim().toLowerCase().replace(/^@+/, '')
}

export function extractDomainFromEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  const idx = e.lastIndexOf('@')
  if (idx < 0) return ''
  return normalizeDomain(e.slice(idx + 1))
}

export async function getOrgContextByUserId(userId) {
  await ensureOrgTables()
  const rows = await sql`
    SELECT
      o.id AS org_id,
      o.name AS org_name,
      o.domain AS org_domain,
      o.status AS org_status,
      m.role AS org_role,
      m.status AS member_status
    FROM org_members m
    JOIN orgs o ON o.id = m.org_id
    WHERE m.user_id = ${userId}
    ORDER BY m.created_at DESC
    LIMIT 1
  `
  if (!rows.length) return null
  const r = rows[0]
  return {
    id: r.org_id,
    name: r.org_name,
    domain: r.org_domain,
    status: r.org_status,
    role: r.org_role,
    member_status: r.member_status,
  }
}
