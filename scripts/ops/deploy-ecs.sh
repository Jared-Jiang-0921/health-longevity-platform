#!/usr/bin/env bash
# 在阿里云 ECS 上执行（项目目录默认 /opt/health-longevity-platform）
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
PM2_NAME="${PM2_NAME:-healthlongevity-api}"

cd "$APP_DIR"
echo "== $APP_DIR =="
git fetch origin
git reset --hard origin/main
echo "HEAD: $(git rev-parse --short HEAD) $(git log -1 --format='%s')"

npm install
npm run build

test -f dist/index.html
test -f public/images/logo-longevity-atlas.png

if pm2 describe "$PM2_NAME" &>/dev/null; then
  pm2 restart "$PM2_NAME" --update-env
else
  pm2 restart 0 --update-env
fi

sleep 2
curl -sf "http://127.0.0.1:3000/api/health" | head -c 200
echo ""

if command -v nginx &>/dev/null; then
  nginx -t
  systemctl reload nginx 2>/dev/null || service nginx reload
fi

echo "[ok] deploy finished — open https://healthlongevity.cn/ with hard refresh"
