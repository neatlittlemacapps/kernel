#!/usr/bin/env bash
# setup-auth.sh — wire this clone's git to authenticate via tools/gh-auth.sh.
# Run ONCE per clone, per developer:   bash setup-auth.sh
# It is idempotent and writes only to THIS clone's .git/config (never committed).
set -euo pipefail
cd "$(dirname "$0")"

HELPER="$(pwd)/tools/gh-auth.sh"
[ -f "$HELPER" ] || { echo "ERROR: $HELPER not found."; exit 1; }
chmod +x "$HELPER" 2>/dev/null || true

# Scope the helper to github.com only (leaves other hosts to their own helpers).
git config credential."https://github.com".helper "$HELPER"
echo "✓ git configured: github.com auth -> $HELPER"

# Verify a token is reachable (env or a walked-up .gh-token).
if printf 'protocol=https\nhost=github.com\n\n' | "$HELPER" get | grep -q '^password='; then
  echo "✓ token found (via \$GH_TOKEN or a .gh-token up the tree)"
  echo "  You're set: plain 'git push' / 'pull' now authenticate as you."
else
  echo "⚠ no token yet. Create your own .gh-token (see .gh-token.example):"
  echo "    cp .gh-token.example .gh-token   # then paste YOUR PAT into it"
  echo "  Tip: put ONE .gh-token at your Projects/ root to cover every repo."
fi
