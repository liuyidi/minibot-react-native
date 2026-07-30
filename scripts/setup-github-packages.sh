#!/usr/bin/env bash
# Create .env from example if missing (does not overwrite existing .env).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.example ]]; then
  echo "missing .env.example" >&2
  exit 1
fi

if [[ -f .env ]]; then
  echo "[minibot] .env 已存在，跳过复制。请确认其中有 NODE_AUTH_TOKEN=…"
else
  cp .env.example .env
  echo "[minibot] 已创建 .env ← .env.example"
  echo "         请编辑 .env，填入 GitHub PAT（read:packages），然后: npm run install:deps"
fi

echo
echo "文档: docs/github-packages.md"
echo "下一步: 编辑 .env 后执行  npm run install:deps"
