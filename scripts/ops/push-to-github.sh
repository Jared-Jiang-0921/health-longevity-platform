#!/usr/bin/env bash
# Mac 上执行：配置 GitHub SSH 并推送 main（解决 Permission denied publickey）
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
KEY="$HOME/.ssh/id_ed25519_github"
PUB="${KEY}.pub"

cd "$REPO_DIR"

if [[ ! -f "$PUB" ]]; then
  echo "未找到 $PUB，正在生成 GitHub 专用密钥…"
  ssh-keygen -t ed25519 -C "github-health-longevity" -f "$KEY"
fi

if ! grep -q 'Host github.com' "$HOME/.ssh/config" 2>/dev/null; then
  mkdir -p "$HOME/.ssh"
  chmod 700 "$HOME/.ssh"
  cat >> "$HOME/.ssh/config" <<'EOF'

Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes
EOF
  chmod 600 "$HOME/.ssh/config"
  echo "已写入 ~/.ssh/config 的 github.com 配置"
fi

echo ""
echo "=== 请将下面整行公钥添加到 GitHub ==="
echo "仓库所有者账号 → Settings → SSH and GPG keys → New SSH key"
echo ""
cat "$PUB"
echo ""

if command -v pbcopy >/dev/null; then
  pbcopy < "$PUB"
  echo "（公钥已复制到剪贴板）"
fi

if [[ "$(uname)" == "Darwin" ]]; then
  open "https://github.com/settings/ssh/new" 2>/dev/null || true
fi

read -r -p "添加完成后按回车继续测试连接…"

eval "$(ssh-agent -s)" >/dev/null 2>&1 || true
ssh-add --apple-use-keychain "$KEY" 2>/dev/null || ssh-add "$KEY"

echo ""
echo "=== 测试 GitHub SSH ==="
ssh -T git@github.com || true

echo ""
echo "=== 推送 main ==="
git status -sb
git push origin main

echo ""
echo "=== 远程最新提交 ==="
git fetch origin
git log origin/main -1 --oneline
echo ""
echo "推送成功。请在 ECS 执行："
echo "  cd /opt/health-longevity-platform && git fetch origin && git reset --hard origin/main && bash scripts/ops/deploy-ecs.sh"
