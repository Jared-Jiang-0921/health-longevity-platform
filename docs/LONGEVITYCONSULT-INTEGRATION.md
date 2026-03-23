# longevityconsult.vip 与健康长寿平台对接说明

从本平台「综合长寿方案」点击「进入咨询」时，会在目标 URL 上附加查询参数。**落地页必须用这些参数更新界面上的用户名**，否则会一直显示在 longevityconsult 本地登录过的旧账号。

## 查询参数（全部在 `?` 后）

| 参数 | 说明 |
|------|------|
| `source` | 固定为 `healthlongevityplatform`，表示从本平台跳转 |
| `hl_consult_entry` | `professional`（专业健康长寿咨询）或 `general`（自我健康促进咨询）；两入口可配置为同一 URL，靠此参数区分 |
| `level` | `free` / `standard` / `premium`（与 `hl_membership_level` 相同） |
| `hl_membership_level` | 与 `level` 同值，便于落地页兼容不同参数名 |
| `hl_level` | `0` / `1` / `2`（分别对应 free / standard / premium），若落地页用数字判断会员档位可优先读此键 |
| `email` | 用户邮箱 |
| `user_id` | 用户 UUID |
| `name` | 本平台昵称（与「会员信息」一致） |
| `display_name` | 与 `name` 相同（兼容不同代码） |
| `nickname` | 与 `name` 相同（兼容不同代码） |
| `hl_ts` | 毫秒时间戳，避免缓存 |
| `hl_display` | 与 `name` 相同，备用键 |
| `hl_brand` | 平台品牌名（与站点配置一致） |
| `hl_origin` | 当前站点域名（如 healthlongevity.cn） |

无昵称时，`name` / `display_name` 等为邮箱 `@` 前本地部分，避免外链无展示名。

## Manus / 落地页建议逻辑（可复制给开发者）

1. 页面加载时执行：

```js
const q = new URLSearchParams(window.location.search);
if (q.get('source') === 'healthlongevityplatform') {
  const display =
    q.get('name') || q.get('display_name') || q.get('nickname') || '';
  if (display) {
    // 用本平台昵称覆盖页眉/聊天区显示名（勿仅用本地登录态）
    document.querySelectorAll('[data-user-name]').forEach((el) => {
      el.textContent = display;
    });
    // 若使用 localStorage 存展示名，可同步写入以便 SPA 读取
    try {
      localStorage.setItem('hl_consult_display_name', display);
    } catch (_) {}
  }
}
```

2. **若仍显示旧名字**：说明界面绑定的是「Manus 后台登录账号」。请在展示用户名的组件中**优先读取** URL 参数或 `localStorage.hl_consult_display_name`，再回退到 Manus 会话。

3. 测试：用**隐私/无痕窗口**打开带完整查询字符串的链接，避免旧 Cookie 干扰。
