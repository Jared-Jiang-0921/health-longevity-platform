# shellcheck shell=bash
# ECS / Mac 运维脚本公共变量与函数（source 使用，勿直接执行）
APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
PM2_NAME="${PM2_NAME:-healthlongevity-api}"
API_HEALTH_URL="${API_HEALTH_URL:-http://127.0.0.1:3000/api/health}"

ops_restart_api() {
  if pm2 describe "$PM2_NAME" &>/dev/null; then
    pm2 restart "$PM2_NAME" --update-env
  else
    pm2 restart 0 --update-env
  fi
}

ops_curl_health() {
  curl -sf "$API_HEALTH_URL" | head -c 200
  echo ""
}

ops_reload_nginx() {
  if command -v nginx &>/dev/null; then
    nginx -t
    systemctl reload nginx 2>/dev/null || service nginx reload
  fi
}
