#!/usr/bin/env bash
# 在阿里云 ECS 上执行（项目目录默认 /opt/health-longevity-platform）
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=_common.sh
source "$SCRIPT_DIR/_common.sh"

cd "$APP_DIR"
echo "== $APP_DIR =="
git fetch origin
git reset --hard origin/main
echo "HEAD: $(git rev-parse --short HEAD) $(git log -1 --format='%s')"

npm install
npm run build

test -f dist/index.html
test -f public/images/logo-longevity-atlas.png

ops_restart_api
sleep 2
ops_curl_health
ops_reload_nginx

echo "[ok] deploy finished — open https://healthlongevity.cn/ with hard refresh"
