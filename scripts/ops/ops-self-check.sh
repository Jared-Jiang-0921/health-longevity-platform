#!/usr/bin/env bash
# ECS 上执行：健康检查 + 权限与关键文件存在性（root 推荐）
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "== Ops self-check =="

if [[ -f "$SCRIPT_DIR/health-check.sh" ]]; then
  DOMAIN="${DOMAIN:-healthlongevity.cn}" "$SCRIPT_DIR/health-check.sh" || true
else
  echo "[skip] health-check.sh not found"
fi

echo
echo "-- Files --"
for f in "$APP_DIR/.env.prod" "$APP_DIR/dist/index.html"; do
  if [[ -f "$f" ]]; then
    mode="$(stat -c '%a' "$f" 2>/dev/null || stat -f '%OLp' "$f" 2>/dev/null || echo '?')"
    echo "[ok] $f (mode $mode)"
  else
    echo "[warn] missing $f"
  fi
done

if [[ -d "$APP_DIR/ops-backups" ]]; then
  bmode="$(stat -c '%a' "$APP_DIR/ops-backups" 2>/dev/null || stat -f '%OLp' "$APP_DIR/ops-backups" 2>/dev/null || echo '?')"
  echo "[ok] ops-backups dir mode $bmode"
else
  echo "[info] ops-backups not created yet (run backup-config.sh)"
fi

echo
echo "-- Reminders --"
echo "1) Neon 控制台确认自动备份 / PITR 保留期"
echo "2) 定期轮换 JWT_SECRET、SITE_ADMIN_TOKEN、数据库密码（轮换后更新 .env.prod 并重启 healthlongevity-api）"
echo "3) 勿将 .env / 备份包提交到 Git"
echo "[done]"
