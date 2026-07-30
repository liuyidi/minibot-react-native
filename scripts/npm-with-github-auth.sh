#!/usr/bin/env bash
# Load .env (NODE_AUTH_TOKEN) then run npm. Used for GitHub Packages (@liuyidi/*).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

if [[ -z "${NODE_AUTH_TOKEN:-}" ]]; then
  cat <<'EOF' >&2
[minibot] NODE_AUTH_TOKEN 未设置，无法从 GitHub Packages 安装 @liuyidi/minibot-client。

  1. cp .env.example .env
  2. 编辑 .env，填入有 read:packages 的 GitHub PAT
  3. 再执行: npm run install:deps

详见 docs/github-packages.md
EOF
  exit 1
fi

if [[ $# -eq 0 ]]; then
  set -- install
fi

exec npm "$@"
