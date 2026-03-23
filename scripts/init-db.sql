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

-- 支付事件日志与幂等记录（provider + event_key 唯一）
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
);

CREATE INDEX IF NOT EXISTS idx_payment_event_logs_session_id ON payment_event_logs(session_id);

-- 会员产品与价格（示例，可按需调整）
-- standard_monthly: 9.99 USD
-- standard_yearly: 99.99 USD
-- premium_monthly: 19.99 USD
-- premium_yearly: 199.99 USD
