# GitHub SSH 推送说明

## 为何 push 失败

1. **公钥未添加到 GitHub** → `Permission denied (publickey)`
2. 本机全局 Git 可能把 `https://github.com/` 重写为 `git@github.com:`（仍走 SSH）

## 一次性配置（Mac）

```bash
cd /path/to/health-longevity-platform
bash scripts/ops/push-to-github.sh
```

或手动：

1. 查看公钥：`cat ~/.ssh/id_ed25519_github.pub`
2. 打开 https://github.com/settings/ssh/new ，粘贴保存（需有 **Jared-Jiang-0921/health-longevity-platform** 写权限的账号）
3. 加载密钥：`ssh-add --apple-use-keychain ~/.ssh/id_ed25519_github`
4. 测试：`ssh -T git@github.com` → 应出现 `Hi <用户名>!`
5. 推送：`git push origin main`

## 推送后同步 ECS

```bash
ssh root@47.84.180.10
cd /opt/health-longevity-platform
git fetch origin && git reset --hard origin/main
bash scripts/ops/deploy-ecs.sh
grep VIDEO_ADMIN api/module-assets/\[id\].js || echo "OK"
```

## 待推送提交（main 领先 origin 时）

- `c513a21` 短视频上传修复
- `c022759` 系列合集
- `620f735` 视频播放/下载权限修复
- 以及之后的运维脚本、api-server 热更新缓存等提交
