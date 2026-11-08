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
# 只构建前端。预渲染要读本机资讯接口，必须等本次发布的 API 进程起来。
# git reset 之后、重启之前的旧进程可能对 module-assets 返回 500，
# 那时预渲染会丢掉数据库里的 upload-* 卡片，只留下 5 张 ln-static-*。
npm run build:client

test -f dist/index.html
test -f public/images/logo-longevity-atlas.png

ops_restart_api || echo "[warn] API restart failed — continue so nginx/static still go live"
if systemctl cat healthlongevity-mcp >/dev/null 2>&1; then
  systemctl restart healthlongevity-mcp || echo "[warn] consult mcp restart failed"
fi

if ops_wait_seo_prerender_api; then
  ops_curl_health || echo "[warn] /api/health not ready"
else
  echo "[warn] API not ready for longevity-news prerender — static news cards will be used if the fetch keeps failing"
fi
npm run build:seo

ops_reload_nginx || echo "[warn] nginx reload skipped"

echo "[ok] deploy finished — open https://healthlongevity.cn/ with hard refresh"
