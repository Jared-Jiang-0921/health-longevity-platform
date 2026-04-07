#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-healthlongevity.cn}"
API_PATH="${API_PATH:-/api/auth/me}"
SERVICE_NAME="${SERVICE_NAME:-healthlongevity-api}"
EXPECT_HOME_CODE="${EXPECT_HOME_CODE:-200}"
EXPECT_API_CODE="${EXPECT_API_CODE:-401}"

echo "== Health Check =="
echo "Domain: $DOMAIN"
echo "Service: $SERVICE_NAME"
echo

home_code="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN/")"
api_code="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$API_PATH")"
svc_state="$(systemctl is-active "$SERVICE_NAME" || true)"

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

echo "Home HTTP code: $home_code (expect $EXPECT_HOME_CODE)"
echo "API  HTTP code: $api_code (expect $EXPECT_API_CODE)"
echo "Service state : $svc_state (expect active)"
echo "Cert expires  : ${cert_end_date:-unknown}"
echo "Days left     : $cert_left_days"
echo

ok=1
[[ "$home_code" == "$EXPECT_HOME_CODE" ]] || ok=0
[[ "$api_code" == "$EXPECT_API_CODE" ]] || ok=0
[[ "$svc_state" == "active" ]] || ok=0
[[ "$cert_left_days" =~ ^-?[0-9]+$ ]] || ok=0
[[ "$cert_left_days" -ge 0 ]] || ok=0

if [[ "$ok" -eq 1 ]]; then
  echo "[ok] health check passed"
  exit 0
fi

echo "[fail] health check failed"
exit 1

