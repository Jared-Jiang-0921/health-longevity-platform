#!/usr/bin/env bash
# ECS 上执行：收紧敏感文件与备份目录权限（需 root 或对该目录有 chown/chmod 权限）
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env.prod}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/ops-backups}"

echo "== Secure env & backups =="
echo "APP_DIR=$APP_DIR"

if [[ -f "$ENV_FILE" ]]; then
  chmod 600 "$ENV_FILE"
  echo "[ok] chmod 600 $ENV_FILE"
else
  echo "[warn] missing: $ENV_FILE"
fi

if [[ -d "$BACKUP_DIR" ]]; then
  chmod 700 "$BACKUP_DIR"
  find "$BACKUP_DIR" -type f -name 'backup-*.tar.gz' -exec chmod 600 {} \; 2>/dev/null || true
  echo "[ok] chmod 700 $BACKUP_DIR; backup archives 600"
else
  mkdir -p "$BACKUP_DIR"
  chmod 700 "$BACKUP_DIR"
  echo "[ok] created chmod 700 $BACKUP_DIR"
fi

echo "[done]"
