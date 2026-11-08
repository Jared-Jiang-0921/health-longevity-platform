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
  echo "[warn] $PM2_NAME not in pm2/systemd; skip restart"
  return 0
}

# 轮询直到 URL 返回 HTTP 200。连接失败记为 000。
# 用法：ops_wait_http_ok URL LABEL [ATTEMPTS] [DELAY_SEC] [MAX_TIME_SEC]
ops_wait_http_ok() {
  local url="$1"
  local label="$2"
  local attempts="${3:-15}"
  local delay="${4:-2}"
  local max_time="${5:-10}"
  local i code
  for ((i = 1; i <= attempts; i++)); do
    code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time "$max_time" "$url" 2>/dev/null || true)"
    code="${code:-000}"
    if [[ "$code" == "200" ]]; then
      echo "[ok] ${label} HTTP 200"
      return 0
    fi
    echo "[wait] ${label} HTTP ${code} (${i}/${attempts})"
    if ((i < attempts)); then
      sleep "$delay"
    fi
  done
  echo "[warn] ${label} not HTTP 200 after ${attempts} attempts: ${url}"
  return 1
}

# 预渲染会请求 SEO_NEWS_API（默认本机 3000）的资讯素材。两边都 200 才算就绪。
ops_wait_seo_prerender_api() {
  local origin="${SEO_NEWS_API:-http://127.0.0.1:3000}"
  origin="${origin%/}"
  local assets_url="${origin}/api/module-assets?module=longevity-news"
  ops_wait_http_ok "$API_HEALTH_URL" "/api/health" 15 2 8 \
    && ops_wait_http_ok "$assets_url" "longevity-news module-assets" 15 2 15
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
