# 会员与支付联动配置指南

完成以下步骤后，用户注册/登录、支付升级会员将全部落地到数据库，并由 Stripe Webhook 自动更新会员等级。

---

## 一、创建数据库（Neon Postgres）

Vercel Postgres 已迁移至 Neon。在 Vercel 中：

1. 打开项目 → **Storage**（或 **Integrations**）→ **Create Database**
2. 选择 **Neon**（或 Postgres 提供商）→ 按提示完成
3. 连接后，Vercel 会自动注入 `DATABASE_URL`（或 `POSTGRES_URL`）

---

## 二、初始化表结构

数据库连接成功后，访问一次：

```
https://你的域名.vercel.app/api/init-db
```

返回 `{ ok: true }` 即表示 `users` 表已创建。

---

## 三、Vercel 环境变量

在 **Settings → Environment Variables** 中配置：

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | Neon 连接串（由集成自动注入） | `postgresql://...` |
| `JWT_SECRET` | JWT 签名密钥（任意长随机串） | `your-random-secret-32-chars` |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 签名密钥 | `whsec_...` |

---

## 四、Stripe Webhook 配置

1. 打开 [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**
3. **Endpoint URL**：`https://你的域名.vercel.app/api/stripe-webhook`
4. **Events to send**：勾选 `checkout.session.completed`
5. 创建后复制 **Signing secret**（`whsec_...`），填入 Vercel 的 `STRIPE_WEBHOOK_SECRET`
6. 在 Vercel 中 Redeploy 一次

---

## 五、本地开发说明

- 前端：`npm run dev` 访问 `http://localhost:5173`
- API：Vercel 的 `/api/*` 仅在部署环境可用，本地不会运行
- 建议：本地主要做 UI，完整流程（注册、登录、支付、Webhook）在 Vercel 部署后测试

---

## 六、会员套餐与价格

当前定义在 `lib/plans.js`：

| 套餐 ID | 等级 | 时长 | 金额 |
|---------|------|------|------|
| standard_monthly | 标准 | 1 月 | $9.99 |
| standard_yearly | 标准 | 12 月 | $99.99 |
| premium_monthly | 高级 | 1 月 | $19.99 |
| premium_yearly | 高级 | 12 月 | $199.99 |

可按需修改 `lib/plans.js` 中的金额与文案。
