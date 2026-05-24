#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=_common.sh
source "$SCRIPT_DIR/_common.sh"

DOMAIN="${DOMAIN:-healthlongevity.cn}"
API_PATH="${API_PATH:-/api/auth/me}"
EXPECT_HOME_CODE="${EXPECT_HOME_CODE:-200}"
EXPECT_API_CODE="${EXPECT_API_CODE:-401}"

echo "== Health Check =="
echo "Domain: $DOMAIN"
echo "PM2/API service: $PM2_NAME"
echo

home_code="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN/")"
api_code="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$API_PATH")"
svc_state="$(ops_api_process_state || true)"
local_api_ok=0
ops_local_api_ok && local_api_ok=1

cert_end_date="$(
  openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" </dev/null 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null \
    | cut -d= -f2-
)"

cert_left_days="$(
  python3 - "$cert_end_date" <<'PY'
import datetime
import sys

txt = sys.argv[1].strip()
if not txt:
    print("-1")
    raise SystemExit

dt = datetime.datetime.strptime(txt, "%b %d %H:%M:%S %Y %Z")
now = datetime.datetime.utcnow()
print((dt - now).days)
PY
)"

echo "Home HTTP code     : $home_code (expect $EXPECT_HOME_CODE)"
echo "API  HTTP code     : $api_code (expect $EXPECT_API_CODE)"
echo "Process state      : $svc_state (pm2 online or systemd active)"
echo "Local /api/health  : $local_api_ok (1=ok)"
echo "Cert expires       : ${cert_end_date:-unknown}"
echo "Days left          : $cert_left_days"
echo

ok=1
[[ "$home_code" == "$EXPECT_HOME_CODE" ]] || ok=0
[[ "$api_code" == "$EXPECT_API_CODE" ]] || ok=0
[[ "$local_api_ok" -eq 1 ]] || ok=0
[[ "$svc_state" == "online" || "$svc_state" == "active" ]] || ok=0
[[ "$cert_left_days" =~ ^-?[0-9]+$ ]] || ok=0
[[ "$cert_left_days" -ge 0 ]] || ok=0

if [[ "$ok" -eq 1 ]]; then
  echo "[ok] health check passed"
  exit 0
fi

echo "[fail] health check failed"
exit 1
