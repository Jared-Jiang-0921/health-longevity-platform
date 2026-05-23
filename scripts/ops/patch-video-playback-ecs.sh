#!/usr/bin/env bash
# 在 ECS 上执行：当 Mac 暂时无法 git push 时，就地修补视频播放 API
# 用法: bash scripts/ops/patch-video-playback-ecs.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/health-longevity-platform}"
ID_JS="$APP_DIR/api/module-assets/[id].js"

cd "$APP_DIR"

if grep -q 'VIDEO_ADMIN_ONLY' "$ID_JS" 2>/dev/null; then
  python3 <<'PY'
from pathlib import Path
p = Path("api/module-assets/[id].js")
text = p.read_text(encoding="utf-8")
old = """function getId(req) {
  const v = req.query?.id
  if (Array.isArray(v)) return String(v[0] || '').trim()
  return String(v || '').trim()
}

async function getViewer(req) {
  const requestAdminToken = String(req.headers['x-site-admin-token'] || '').trim()
"""
new = """function getId(req) {
  const v = req.query?.id
  if (Array.isArray(v)) return String(v[0] || '').trim()
  return String(v || '').trim()
}

function readJwt(req) {
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  const q = req.query?.access_token
  const raw = Array.isArray(q) ? q[0] : q
  const fromQuery = String(raw || '').trim()
  return fromQuery || null
}

async function getViewer(req) {
  const adminAuth = await authorizeSiteAdmin(req)
  if (adminAuth.ok) return { isAdmin: true, level: 'premium', isGuest: false }

  const requestAdminToken = String(req.headers['x-site-admin-token'] || '').trim()
"""
if old not in text:
    raise SystemExit("getViewer block not found; abort")
text = text.replace(old, new, 1)
text = text.replace(
  "  const auth = req.headers.authorization\n  const jwt = auth?.startsWith('Bearer ') ? auth.slice(7) : null\n",
  "  const jwt = readJwt(req)\n",
  1,
)
block = """    const isVideo = String(row.mime_type || '').startsWith('video/')
    if (isVideo) {
      const auth = await authorizeSiteAdmin(req)
      if (!auth.ok) {
        return res.status(403).json({ code: 'VIDEO_ADMIN_ONLY', error: '视频资源仅管理员可下载' })
      }
    }
"""
if block not in text:
    raise SystemExit("VIDEO_ADMIN block not found; abort")
text = text.replace(block, "", 1)
p.write_text(text, encoding="utf-8")
print("[patch] api/module-assets/[id].js updated")
PY
else
  echo "[skip] VIDEO_ADMIN_ONLY already removed in $ID_JS"
fi

# 前端媒体 URL（若仓库尚无该文件则跳过 build 前的复制由 git pull 完成）
if [[ -f "$APP_DIR/src/lib/moduleAssetUrl.js" ]]; then
  npm run build
  pm2 restart healthlongevity-api --update-env 2>/dev/null || pm2 restart 0 --update-env
  sleep 2
else
  echo "[warn] src/lib/moduleAssetUrl.js missing — run git pull after Mac push, then deploy-ecs.sh"
  pm2 restart healthlongevity-api --update-env 2>/dev/null || pm2 restart 0 --update-env
  sleep 2
fi

VID=$(curl -sS "http://127.0.0.1:3000/api/module-assets?module=health-skills" | python3 -c "import sys,json; d=json.load(sys.stdin); print(next((i['id'] for i in d.get('items',[]) if str(i.get('mime_type','')).startswith('video/')),''))" 2>/dev/null || true)
if [[ -n "$VID" ]]; then
  CODE=$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000/api/module-assets/${VID}")
  echo "[check] GET /api/module-assets/${VID} => HTTP $CODE (expect 200)"
fi
curl -sf "http://127.0.0.1:3000/api/health" | head -c 120
echo ""
echo "[ok] patch done — hard refresh https://healthlongevity.cn/"
