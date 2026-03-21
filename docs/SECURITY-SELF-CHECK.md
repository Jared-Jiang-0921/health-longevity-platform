# §1 环境密钥与 Webhook / 会员状态一致性自检

本文档记录对当前仓库的一次静态审查结论与运维核对项（非法律意见）。

---

## 一、密钥与前端暴露


| 变量                              | 预期位置                    | 仓库结论                                                  |
| ------------------------------- | ----------------------- | ----------------------------------------------------- |
| `STRIPE_SECRET_KEY`             | 仅 Vercel / 服务端环境变量      | 仅出现在 `api/*.js`、`server/*`；**未**出现在 `src/` 或 `VITE_`* |
| `STRIPE_WEBHOOK_SECRET`         | 仅服务端                    | 仅 `api/stripe-webhook.js`                             |
| `DATABASE_URL` / `POSTGRES_URL` | 仅服务端                    | `lib/db.js`、`api/init-db.js`                          |
| `JWT_SECRET`                    | 仅服务端                    | `lib/auth.js`；生产与 Vercel 上**未设置会抛错**（见下）              |
| `COZE_API_KEY` 等                | 仅 `server/coze-chat.js` | 勿写入 `VITE_`*                                          |
| `VITE_STRIPE_PUBLISHABLE_KEY`   | 前端（可公开）                 | 仅公钥，符合 Stripe 设计                                      |


**结论**：未发现将 Secret Key、JWT、数据库 URL 打进前端包的做法。前端仅使用 `VITE_`* 中的可公开项。

**请你本地再确认**：`.env`、`.env.local` 已加入 `.gitignore`，且从未把真实密钥提交进 Git 历史。

---

## 二、JWT 生产环境

`lib/auth.js` 在 `process.env.VERCEL` 存在或 `NODE_ENV === 'production'` 时，**必须**配置 `JWT_SECRET`，否则模块加载会失败，避免使用默认弱密钥。

本地纯 `vite` 开发（不跑 Vercel API）可不设；使用 `vercel dev` 时通常带有 `VERCEL`，请在 `.env.local` 中配置 `JWT_SECRET`。

---

## 三、支付与会员：双路径与一致性

### 路径 A：Stripe Webhook

- **端点**：`POST /api/stripe-webhook`
- **事件**：`checkout.session.completed`
- **身份**：依赖 Stripe 签名（`STRIPE_WEBHOOK_SECRET`），从 Session 读取 `client_reference_id` / `metadata.user_id` 与 `metadata.plan`
- **写入**：调用 `lib/membershipCheckout.js` 中的 `applyMembershipFromPlan`

### 路径 B：支付成功页确认（备用）

- **端点**：`POST /api/confirm-checkout-session`，Body：`{ session_id }`
- **身份**：**必须**带当前用户 `Authorization: Bearer <JWT>`
- **校验**：Stripe 中 Session `payment_status === 'paid'`，且 Session 归属用户与 JWT 一致（防串单）
- **写入**：同一函数 `applyMembershipFromPlan`

### 一致性结论

- 会员等级与到期时间**仅在一处实现**：`applyMembershipFromPlan`（`lib/membershipCheckout.js`），与 `lib/plans.js` 中 `PLANS`、`getExpiresAt` 一致。
- Webhook 与 confirm **先后执行**时，均为「整段覆盖」同一 `level` / `expires_at`（当前产品为「非叠加续期」语义）；重复执行不会重复加时长，仅最后一次 `expires_at` 生效。
- Stripe 重试同一 `checkout.session.completed` 时，多次 UPDATE 结果相同，可视为幂等。

### Webhook 验签说明

若在 Stripe Dashboard 中看到 **signature verification failed**，多为运行环境对 **raw body** 处理与 Stripe 要求不一致。此时路径 B（用户打开成功页触发 confirm）仍可完成会员写入；**务必保留成功页上的 confirm 调用**。

---

## 四、Vercel 环境变量核对清单

在 Vercel Project → Settings → Environment Variables 中确认（名称以你实际为准）：

- `DATABASE_URL` 或 `POSTGRES_URL`
- `JWT_SECRET`（强随机字符串）
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`（Dashboard → Webhooks → 端点签名密钥）
- 前端构建所需 `VITE_`*（如 `VITE_STRIPE_PUBLISHABLE_KEY`；若 Checkout API 非同源则 `VITE_CHECKOUT_API`）

Stripe Webhook URL 示例：`https://<你的域名>/api/stripe-webhook`，事件至少勾选 `checkout.session.completed`。

---

## 五、建议的线上冒烟步骤

1. 使用 Stripe **测试卡**完成一笔 Checkout。
2. 在 Stripe Dashboard → Webhooks → 该端点，确认事件送达状态；若失败，检查签名密钥与环境变量。
3. 打开 `/payment/success?session_id=...`，确认会员等级与到期时间在界面与 `/api/auth/me` 一致。
4. 数据库中对应 `users` 行的 `level`、`expires_at` 与预期套餐一致。

---

## 六、后续可选项（非必须）

- 将 `checkout.session` 的 Stripe 事件 ID 记入表，用于审计与去重日志（当前重复 UPDATE 可接受）。
- 若未来支持「剩余时长叠加续费」，需在 `applyMembershipFromPlan` 内改为读取当前 `expires_at` 再计算。

