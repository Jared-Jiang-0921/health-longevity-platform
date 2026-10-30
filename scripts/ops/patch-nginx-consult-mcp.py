#!/usr/bin/env python3
"""Insert the Grok consult MCP proxy in front of location /api/ai/."""
import sys
from pathlib import Path

MARKER = "# consult-mcp"
SNIPPET = """
    # consult-mcp：Grok 连接器。必须写在 SPA 回退之前。
    location = /.well-known/oauth-protected-resource {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /.well-known/oauth-protected-resource/mcp {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /.well-known/oauth-authorization-server {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /mcp {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

"""

def main():
    path = Path(sys.argv[1])
    text = path.read_text()
    if MARKER in text:
        print(f"[ok] nginx already has {MARKER}")
        return
    lines = text.splitlines(keepends=True)
    out = []
    inserted = 0
    for line in lines:
        stripped = line.lstrip()
        if stripped.startswith("location /api/ai/") or stripped.startswith("location ^~ /api/ai/"):
            indent = line[: len(line) - len(stripped)]
            block = "".join(
                (indent + row if row.strip() else row)
                for row in SNIPPET.strip("\n").splitlines(keepends=True)
            )
            if not block.endswith("\n"):
                block += "\n"
            out.append(block + "\n")
            inserted += 1
        out.append(line)
    if inserted == 0:
        raise SystemExit("location /api/ai/ not found; nginx was not changed")
    path.write_text("".join(out))
    print(f"[ok] inserted consult-mcp before {inserted} api/ai location(s)")

if __name__ == "__main__":
    main()
