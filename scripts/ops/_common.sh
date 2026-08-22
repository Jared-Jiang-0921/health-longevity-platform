# shellcheck shell=bash
# ECS / Mac 运维脚本公共变量与函数（source 使用，勿直接执行）
APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
PM2_NAME="${PM2_NAME:-healthlongevity-api}"
API_HEALTH_URL="${API_HEALTH_URL:-http://127.0.0.1:3000/api/health}"

ops_restart_api() {
  if command -v pm2 >/dev/null 2>&1 && pm2 describe "$PM2_NAME" &>/dev/null; then
    pm2 restart "$PM2_NAME" --update-env
    return 0
  fi
  if systemctl restart "$PM2_NAME" 2>/dev/null; then
    return 0
  fi
  echo "[warn] $PM2_NAME not in pm2/systemd; skip restart (static dist already built)"
  return 0
}

ops_curl_health() {
  curl -sf "$API_HEALTH_URL" | head -c 200
  echo ""
}

ops_local_api_ok() {
  curl -sf "$API_HEALTH_URL" >/dev/null 2>&1
}

# 生产 ECS 用 pm2；若未装 pm2 则回退 systemd
ops_api_process_state() {
  if command -v pm2 &>/dev/null && pm2 describe "$PM2_NAME" &>/dev/null 2>&1; then
    if pm2 describe "$PM2_NAME" 2>/dev/null | grep -qE 'status.*online'; then
      echo "online"
      return 0
    fi
    echo "pm2-not-online"
    return 1
  fi
  systemctl is-active "$PM2_NAME" 2>/dev/null || echo "inactive"
}

ops_api_runtime_ok() {
  ops_local_api_ok
}

ops_reload_nginx() {
  if command -v nginx &>/dev/null; then
    nginx -t
    systemctl reload nginx 2>/dev/null || service nginx reload
  fi
}
