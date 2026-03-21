-- 会员与支付联动：用户表
-- 在 Neon / Vercel Postgres 的 SQL Editor 中执行，或通过 api/init-db 触发

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
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 会员产品与价格（示例，可按需调整）
-- standard_monthly: 9.99 USD
-- standard_yearly: 99.99 USD
-- premium_monthly: 19.99 USD
-- premium_yearly: 199.99 USD
