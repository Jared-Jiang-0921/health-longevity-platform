# 模块资料上传可见性修复留档（2026-04-25）

## 背景

- 现象：管理员上传资料后提示成功，但在目标模块/亚类/细分类下看不到文件。
- 影响范围：`health-skills`、`products` 及其他使用 `ModuleAssetsPanel` 的模块资料展示。
- 验证域名：`47.84.180.10`。

## 根因归纳

- 前端列表筛选值与上传提交值在部分场景不一致（细分类归一化不统一）。
- 路由绑定在课程详情/学习页会干扰手动切换细分类，导致“点击无反应/看不到刚上传”。
- 列表读取权限与上传权限链路不一致，管理员读取可能被降级过滤。
- 上传后列表刷新存在缓存/时序影响，导致短时间读取旧数据。

## 代码修复点

### 前端：`src/components/ModuleAssetsPanel.jsx`

- 统一亚类/细分类归一化逻辑：
  - 新增并使用 `normalizeSubtopicValue`、`normalizeAssetItem`。
  - 过滤列表与生成细分类选项均使用统一规则。
- 上传/编辑成功后即时可见：
  - 直接把后端返回记录写入本地 `items`，避免仅依赖下一次拉取。
- 路由绑定行为优化：
  - 路由切换时初始化；避免持续覆盖用户手动点击的细分类。
- 拉取列表防缓存：
  - `GET /api/module-assets` 添加 `cache: 'no-store'` 和时间戳参数。
- 上传/编辑提交细分类兜底：
  - 有预设细分类时，空值/非法值回退到合法项，避免落到不可预期分组。
- 管理员调试可观测信息（用于定位期间）：
  - 显示当前映射、总条数、命中条数、最新条目分类。

### 后端：`api/module-assets.js`

- 管理员读取权限与上传权限统一：
  - `GET` 列表先走 `authorizeSiteAdmin(req)`，管理员可见全量资料。
- 会员等级兼容中文映射：
  - `普通会员/标准会员/高级会员` 映射为 `free/standard/premium`。

## 服务器部署说明（已验证路径）

- 代码目录：`/opt/health-longevity-platform`
- 分支：`main`
- 远程：`https://github.com/Jared-Jiang-0921/health-longevity-platform.git`

常用更新步骤：

1. 本机提交并推送：
   - `git add api/module-assets.js src/components/ModuleAssetsPanel.jsx`
   - `git commit -m "fix module assets visibility and admin filtering"`
   - `git push origin main`
2. 服务器更新并重启：
   - `cd /opt/health-longevity-platform`
   - `git fetch --all && git reset --hard origin/main`
   - `npm install && npm run build`
   - `pm2 restart all`
   - `nginx -t && systemctl reload nginx`

## 验收结果

- 状态：已通过。
- 验收口径：
  - 上传到指定亚类/细分类后可立即看到资料。
  - 课程详情页与学习页展示一致。
  - 管理员可见所有会员等级资料（含高级会员）。
  - 分类与会员等级对应正确。

## 短视频上传 `Failed to fetch`（2026-05 补充）

**现象**：管理员在「长寿知识技能」上传 mp4/mov 时浏览器提示 `Failed to fetch`，小文件正常。

**常见根因**：

1. **Nginx** 默认 `client_max_body_size` 仅 1MB，视频 JSON（base64 后更大）被直接断开。
2. **前端** 曾用逐字节 `btoa`，大文件导致浏览器卡死或请求发不出去。

**修复**：

- 前端改用 `FileReader` 转 base64（`src/lib/fileBase64.js`）。
- `deploy/nginx-healthlongevity.conf.example` 的 `location /api/` 增加 `client_max_body_size 120m` 与 `proxy_*_timeout 300s`。
- 服务器需手动合并到 `/etc/nginx/conf.d/healthlongevity.conf` 后 `nginx -t && systemctl reload nginx`。

**ECS 一键改 Nginx（在服务器执行）**：

```bash
CONF=/etc/nginx/conf.d/healthlongevity.conf
grep -q 'client_max_body_size' "$CONF" || sudo sed -i '/location \/api\//,/}/ {
  /proxy_pass/i\        client_max_body_size 120m;\n        proxy_read_timeout 300s;\n        proxy_send_timeout 300s;
}' "$CONF"
sudo nginx -t && sudo systemctl reload nginx
```

建议短视频 **≤ 40MB**（base64 后约 55MB），单文件上限仍为 100MB。

## 后续建议

- 保留一条“管理员资料可见性”回归用例，覆盖：
  - 上传（free/standard/premium 各一条）
  - 跨页（详情/学习）
  - 跨模块（health-skills/products）
- 若后续移除调试展示，建议保留最小化日志能力（仅管理员可见）。
