# 代码结构说明（整理后）

本文档描述会员鉴权、资料上传、API 与运维脚本的**单一职责入口**，便于维护且不改变对外行为。

## 会员与内容可见

| 模块 | 职责 |
|------|------|
| `lib/contentAccess.js` | **条目级**可见性：`parseContentRequiredLevel`、`canViewContent`、`normalizeContentLevelForStorage`（含「普通会员」「免费」等别名） |
| `src/data/membership.js` | **模块入口** `MODULE_ACCESS`、`canAccess`；条目级函数从 `contentAccess` 复用，`hasLevelAccess` 兼容未传 `isGuest` 的前端调用 |
| `lib/apiViewer.js` | API 请求查看者：`getApiViewer(req, { allowQueryToken })` |
| `lib/contentListAccess.js` | 列表项附加 `content_level` / `can_view` |
| `src/lib/contentLevelAdmin.js` | 管理端表单等级下拉：`adminLevelValue` |

**未改动**：`lib/siteAdminAuth.js`、支付与 Stripe 相关 API。

## 资料上传与下载

| 模块 | 职责 |
|------|------|
| `api/module-assets.js` | 模块资料列表 / 上传 / 更新 |
| `api/module-assets/[id].js` | 单文件 GET（支持 `?access_token=`）/ DELETE |
| `lib/uploadFileName.js` | 通用文件名清理与扩展名 |
| `lib/apiBody.js` | `parseApiJsonBody` |
| `lib/apiQuery.js` | `getQueryParam`（动态路由 id） |
| `src/lib/moduleAssetUrl.js` | 前端 `<video>` / 链接 URL |
| `lib/storageInline.js` | 从 storage 读文件并 inline 返回（视频/PDF） |

翻译 PDF（`api/translation-pdfs*`）仍使用 **PDF 专用** `sanitizeFileName`，不与通用上传合并。

| `src/lib/fileBase64.js` | 上传前 base64 编码 |

## API 路由（ECS + FC 共用）

| 模块 | 职责 |
|------|------|
| `lib/apiRouteTable.js` | `routeFromApiFile`、`matchApiRoute`、`walkApiJsFiles`、`buildApiRouteTable` |
| `server/api-server.mjs` | ECS 监听 `:3000`；handler 按文件 mtime 缓存失效 |
| `fc/backend-entry.mjs` | 函数计算入口（读 `fc/route-manifest.json`） |
| `scripts/fc/generate-route-manifest.mjs` | 生成 FC manifest（与 ECS 同套路由解析） |

改 `api/` 后：ECS 随 `pm2 restart` 生效；FC 需 `npm run fc:routes` 后重新部署函数。

## 运维脚本

| 脚本 | 说明 |
|------|------|
| `scripts/ops/_common.sh` | `APP_DIR`、`ops_restart_api`、`ops_curl_health`、`ops_api_process_state`、`ops_reload_nginx` |
| `scripts/ops/deploy-ecs.sh` | 生产一键部署 |
| `scripts/ops/health-check.sh` | 外网 HTTPS + 本地 `/api/health` + pm2/systemd 进程状态 |
| `scripts/ops/push-to-github.sh` | Mac 推送 + SSH 引导 |
| `scripts/ops/patch-video-playback-ecs.sh` | **已过时**应急补丁 |

## API 路由（旧节已合并至上方）

正式环境：**阿里云 ECS** `/opt/health-longevity-platform`，非 Vercel。

## 回归检查清单

- [ ] 游客 / 普通 / 标准 / 高级：课程与商品标题可见、正文按等级锁定
- [ ] 管理员：模块资料上传、视频播放与下载
- [ ] 登录用户：`/api/module-assets?module=health-skills` 与带 token 的视频 URL
- [ ] 支付页与 Stripe Webhook 未受影响
- [ ] `bash scripts/ops/deploy-ecs.sh` 后 `/api/health` 为 200
