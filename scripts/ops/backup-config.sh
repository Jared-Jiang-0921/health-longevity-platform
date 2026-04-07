#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env.prod}"
NGINX_FILE="${NGINX_FILE:-/etc/nginx/conf.d/healthlongevity.conf}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/ops-backups}"
KEEP_DAYS="${KEEP_DAYS:-30}"

ts="$(date +%Y%m%d-%H%M%S)"
target_dir="$BACKUP_DIR/$ts"

mkdir -p "$target_dir"

if [[ -f "$ENV_FILE" ]]; then
  cp "$ENV_FILE" "$target_dir/.env.prod"
else
  echo "[warn] env file not found: $ENV_FILE"
fi

if [[ -f "$NGINX_FILE" ]]; then
  cp "$NGINX_FILE" "$target_dir/healthlongevity.conf"
else
  echo "[warn] nginx conf not found: $NGINX_FILE"
fi

tar -czf "$BACKUP_DIR/backup-$ts.tar.gz" -C "$target_dir" .
rm -rf "$target_dir"

chmod 600 "$BACKUP_DIR/backup-$ts.tar.gz" 2>/dev/null || true

find "$BACKUP_DIR" -type f -name 'backup-*.tar.gz' -mtime "+$KEEP_DAYS" -delete

echo "[ok] backup created: $BACKUP_DIR/backup-$ts.tar.gz"

