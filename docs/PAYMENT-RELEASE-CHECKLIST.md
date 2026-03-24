# 支付上线验收闭环清单

用于“代码已合并 -> 线上发布 -> 验收通过”的闭环执行。

## A. 发布前（Pre-Deploy）

- [ ] 已确认分支包含最新支付运营改动（日志、幂等、错误码）
- [ ] 已确认环境变量存在并正确：
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `PAYMENT_LOGS_ADMIN_TOKEN` 或 `PAYMENT_LOGS_ADMIN_EMAILS`
  - [ ] `PAYMENT_CURRENCY` / `PAYMENT_CURRENCY_OPTIONS`
  - [ ] `VITE_PAYMENT_CURRENCY` / `VITE_PAYMENT_CURRENCY_OPTIONS`
- [ ] 数据库已具备 `payment_event_logs` 表（通过 `/api/init-db` 或 SQL 脚本）

## B. 发布动作（Deploy）

- [ ] 推送主分支并触发 Vercel 部署
- [ ] `Deployments` 显示 `Ready`
- [ ] 强刷线上页面（避免缓存旧 JS）

## C. 功能验收（Post-Deploy）

- [ ] 支付页可见币种选择（例如 `USD/EUR/CNY/HKD/SGD`）
- [ ] 选择任一币种后价格显示为 `币种代码 + 金额`（例：`HKD 99.00`）
- [ ] 发起一笔测试支付，支付成功可返回成功页
- [ ] 会员信息页可刷新并看到等级/有效期更新

## D. 运营接口验收（必须）

- [ ] `GET /api/payment-event-logs?mode=summary&hours=24&provider=stripe` 可返回
- [ ] `GET /api/payment-event-logs?failed_only=1&limit=50&provider=stripe` 可返回
- [ ] 至少能看到本次测试支付相关日志字段：
  - `provider`
  - `currency`
  - `plan`
  - `user_id`
  - `session_id`
  - `status`

## E. 异常回归（可选但推荐）

- [ ] 用无效管理员凭证访问运营接口，返回 `401/403`（权限有效）
- [ ] 重复触发 confirm/webhook 后，出现 `idempotent_skip`（幂等有效）

## F. 结果归档

- [ ] 在值班记录中登记：发布时间、验证人、验证结果、异常码（若有）
- [ ] 若有异常，登记修复动作与复测结果
