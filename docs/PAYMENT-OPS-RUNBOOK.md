# 支付运营巡检手册（PAYMENT OPS RUNBOOK）

本文用于日常巡检支付链路健康度，基于以下两个接口：

- `GET /api/payment-event-logs`（明细）
- `GET /api/payment-event-logs?mode=summary`（汇总）

---

## 1. 巡检目标

- 快速发现支付异常（失败、验签问题、配置问题）
- 观察重复回调与幂等跳过是否在可控范围
- 核对会员写入闭环是否稳定

---

## 2. 管理员鉴权方式（两种二选一）

### 方式 A：管理员 Token（推荐）

- 环境变量：`PAYMENT_LOGS_ADMIN_TOKEN`
- 请求头：`x-admin-token: <token>`

### 方式 B：管理员邮箱白名单

- 环境变量：`PAYMENT_LOGS_ADMIN_EMAILS=admin@example.com,ops@example.com`
- 请求头：`Authorization: Bearer <管理员JWT>`

---

## 3. 固定 URL 模板

将 `<base>` 替换为你线上域名（如 `https://healthlongevity.cn`）。

### 3.1 汇总（默认最近 24 小时）

- 全部通道：
  - `<base>/api/payment-event-logs?mode=summary&hours=24`
- 仅 Stripe：
  - `<base>/api/payment-event-logs?mode=summary&hours=24&provider=stripe`

### 3.2 明细（失败优先）

- 最近失败日志（巡检主入口）：
  - `<base>/api/payment-event-logs?failed_only=1&limit=100`
- 仅 Stripe 失败日志：
  - `<base>/api/payment-event-logs?failed_only=1&provider=stripe&limit=100`
- 指定会话排查：
  - `<base>/api/payment-event-logs?session_id=<session_id>&limit=50`

---

## 4. 推荐巡检频率

- 每日：`09:30`、`17:30` 各一次（看 summary + failed_only）
- 发布后：30 分钟内追加一次巡检
- 支付通道配置变更后：立即巡检一次

---

## 5. 巡检判定标准（建议）

### 5.1 汇总指标

- `failed`: 趋势不应连续上升
- `idempotent_skip`: 存在少量是正常（表示幂等生效）
- `success`: 应与业务支付量同趋势

### 5.2 明细重点状态

- 失败态（重点看）：`*failed*`、`*invalid*`、`*forbidden*`、`*error*`
- 正常态（参考）：`session_created`、`membership_applied`、`event_processed`
- 幂等态（观察）：`idempotent_skip`

---

## 6. 常见异常与处理

### A. `PAYMENT_CONFIG_MISSING`

- 含义：支付配置缺失（如 `STRIPE_SECRET_KEY` / webhook secret）
- 处理：检查 Vercel 环境变量后重部署

### B. `WEBHOOK_SIGNATURE_INVALID`

- 含义：Webhook 验签失败
- 处理：核对 Stripe Dashboard 对应环境的 webhook secret 与 URL

### C. `MEMBERSHIP_APPLY_FAILED`

- 含义：支付完成但会员写入失败
- 处理：检查数据库连接、`users` 表可写性、SQL 报错日志

### D. `SESSION_USER_MISMATCH`

- 含义：支付会话归属与当前登录用户不一致
- 处理：核对 `client_reference_id` / `metadata.user_id` 写入逻辑，排查串单

---

## 7. 值班排查流程（10 分钟版）

1. 打开 summary（24h）看 `failed` 与 `idempotent_skip` 是否异常；
2. 打开 `failed_only=1` 查看最近失败 `code` 分布；
3. 若集中在同一 `code`，按第 6 节对应措施处理；
4. 修复后再次查看 summary，确认失败增速回落；
5. 在值班记录中登记：时间、异常码、影响范围、处理结果。

---

## 8. 备注

- 本手册仅用于运营巡检与快速排障；
- 如需业务审计，可在后续增加导出接口或 BI 看板。

---

## 9. Vercel 控制台快速检查路径（给运营同事）

以下路径按 Vercel 新版控制台命名，若界面有小差异，以相近菜单为准。

### 9.1 看线上日志（排查 5xx / 验签问题）

1. 进入项目：`Vercel Dashboard -> 项目`
2. 点击：`Deployments`
3. 选择最新线上部署（Production）
4. 点击部署详情中的 `Functions` / `Logs`
5. 重点搜索关键词：
   - `payment-event-logs`
   - `payment-event-logs-summary`
   - `stripe-webhook`
   - `confirm-checkout-session`
   - `PAYMENT_CONFIG_MISSING` / `WEBHOOK_SIGNATURE_INVALID`

### 9.2 看环境变量是否齐全

1. 进入：`Settings -> Environment Variables`
2. 重点核对（至少）：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `PAYMENT_LOGS_ADMIN_TOKEN` 或 `PAYMENT_LOGS_ADMIN_EMAILS`
   - `PAYMENT_CURRENCY` / `PAYMENT_CURRENCY_OPTIONS`
3. 若有修改，执行一次 `Redeploy` 使新变量生效

### 9.3 发布后标准动作

1. `Deployments` 确认状态为 `Ready`
2. 立即打开：
   - summary：`/api/payment-event-logs?mode=summary&hours=24`
   - failed：`/api/payment-event-logs?failed_only=1&limit=50`
3. 若异常，先记录错误码，再通知技术同事按第 6 节处理

---

## 10. 值班登记模板（可复制）

建议每次巡检或告警处理都登记一条，便于复盘和交接。

### 10.1 巡检记录（例行）

```text
[巡检时间]
2026-03-22 09:30 (UTC+8)

[巡检人]
<姓名>

[查询窗口]
hours=24, provider=stripe

[关键指标]
total=<数字>
success=<数字>
failed=<数字>
idempotent_skip=<数字>

[结论]
正常 / 需关注 / 异常

[备注]
（例如：failed 较昨日上升 20%，主要是 WEBHOOK_SIGNATURE_INVALID）
```

### 10.2 异常处理记录（告警）

```text
[发现时间]
2026-03-22 17:42 (UTC+8)

[发现人]
<姓名>

[错误码]
<code>（可多项）

[影响范围]
受影响订单数：<数字>
受影响时段：<起止时间>
是否影响会员写入：是/否

[定位结论]
（一句话说明根因）

[处理动作]
1) ...
2) ...

[恢复时间]
<时间>

[验证结果]
summary 与 failed_only 已恢复 / 仍观察

[后续动作]
（例如：补充监控阈值、更新 runbook、补发会员）
```

### 10.3 交接最小字段（班次交接必填）

- 当前状态：正常 / 持续观察 / 异常处理中
- 最近 24h `failed` 数与主要错误码
- 是否存在未完成工单（附链接/编号）
- 下一班需重点关注的接口与时间段

---

## 11. 异常升级阈值（建议默认值）

以下阈值用于“是否需要升级处理”的快速判断，可按业务量后续微调。

### 11.1 P2（需当班处理）

满足任一条件即可：

- 最近 1 小时 `failed >= 5`
- 最近 24 小时 `failed >= 20`
- 同一错误码（如 `WEBHOOK_SIGNATURE_INVALID`）最近 1 小时出现 `>= 3`
- `MEMBERSHIP_APPLY_FAILED` 单小时出现 `>= 1`

动作：

1. 当班 10 分钟内完成初步定位；
2. 在值班记录中登记影响范围与临时措施；
3. 通知技术负责人进入观察。

### 11.2 P1（需立即升级）

满足任一条件即可：

- 连续 30 分钟出现支付成功但会员未升级（`MEMBERSHIP_APPLY_FAILED` 持续增长）
- `PAYMENT_CONFIG_MISSING` 在生产环境出现
- `WEBHOOK_SIGNATURE_INVALID` 连续 15 分钟高频出现且确认非测试流量
- 最近 1 小时 `failed >= 15` 且仍持续增长

动作：

1. 立即升级至技术负责人；
2. 暂停相关发布变更（若在发布窗口）；
3. 启动应急群同步：现象、影响、临时止血方案、下一次更新时间。

### 11.3 恢复判定（降级条件）

全部满足可降级为“持续观察”：

- 连续两个巡检窗口（建议 30 分钟）`failed` 无新增异常增长；
- `failed_only=1` 不再出现新的高优先级错误码；
- summary 中 `success` 恢复到历史同量级区间。

---

## 12. 阈值配置建议（.env 约定）

当前阈值在手册中按默认值执行；建议同时在环境变量中保留一份“配置化约定”，便于后续扩容时统一调整。

> 说明：这些变量当前主要用于运营约定与后续扩展，不影响现有接口功能。

建议变量（示例）：

```dotenv
# --- Payment Ops Alert Thresholds ---
PAYMENT_ALERT_P2_FAILED_1H=5
PAYMENT_ALERT_P2_FAILED_24H=20
PAYMENT_ALERT_P2_SAME_CODE_1H=3
PAYMENT_ALERT_P2_MEMBERSHIP_APPLY_FAILED_1H=1

PAYMENT_ALERT_P1_FAILED_1H=15
PAYMENT_ALERT_P1_WEBHOOK_INVALID_15M=5
PAYMENT_ALERT_P1_MEMBERSHIP_APPLY_FAILED_30M=3
```

---

## 13. 调参方法（按业务量）

### 13.1 低量级阶段（日订单 < 50）

- 保持第 11 节默认阈值；
- 重点关注 `MEMBERSHIP_APPLY_FAILED`，宁可“误报”也不要漏报。

### 13.2 成长期（日订单 50 ~ 500）

- 按近 7 天均值调高阈值：
  - `P2_FAILED_1H ≈ max(5, 日均失败数 / 24 * 2)`
  - `P1_FAILED_1H ≈ P2_FAILED_1H * 3`
- 保持 `SESSION_USER_MISMATCH` 与 `PAYMENT_CONFIG_MISSING` 为高优先级固定告警。

### 13.3 高量级阶段（日订单 > 500）

- 建议接入自动告警平台（如短信/Slack/飞书机器人）；
- 使用“失败率阈值”替代“绝对数量阈值”（例如 1h 失败率 > 2%）。

---

## 14. 版本与维护

- 手册负责人：支付运营 owner（建议指定到人）
- 复查频率：每月一次，或每次支付链路改造后立即复查
- 更新要求：阈值调整需同步更新第 11 节和第 12 节，避免文档与执行不一致
