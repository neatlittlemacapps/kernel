#!/usr/bin/env sh
# gh-auth.sh — a git credential helper for the Corilus migration repos.
#
# Supplies a GitHub Personal Access Token to git for github.com, so plain
# `git push` / `pull` / `clone` / `fetch` authenticate with no inline
# `credential.helper='!f()...'` incantation and no token in argv.
#
# Token source, in order:
#   1. $GH_TOKEN environment variable (handy for one-off / CI / scripts)
#   2. a .gh-token file found by walking UP from this script's directory
#      (so ONE ~/…/Projects/.gh-token covers every repo under it)
#
# The token is YOUR OWN, never committed: .gh-token is gitignored everywhere.
# Wire it once per clone with ./setup-auth.sh. See AUTH.md (in the grove repo).
#
# git invokes this as `gh-auth.sh get` and reads `username`/`password` from stdout.
# We only answer `get` for github.com; for anything else we stay silent so git
# falls through to its other helpers (e.g. the macOS keychain).

[ "$1" = "get" ] || exit 0

# Consume git's request on stdin (protocol=…, host=…); only proceed for github.com.
host=""
while IFS='=' read -r key value; do
  [ -z "$key" ] && break
  [ "$key" = "host" ] && host="$value"
done
[ -n "$host" ] && [ "$host" != "github.com" ] && exit 0

token="${GH_TOKEN:-}"
if [ -z "$token" ]; then
  # walk up from this script's directory looking for .gh-token
  dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
  i=0
  while [ "$i" -lt 10 ]; do
    if [ -f "$dir/.gh-token" ]; then
      token=$(tr -d '\r\n' < "$dir/.gh-token")
      break
    fi
    parent=$(dirname -- "$dir")
    [ "$parent" = "$dir" ] && break
    dir="$parent"
    i=$((i + 1))
  done
fi

[ -z "$token" ] && exit 0   # no token found — let git try other helpers

echo "username=x-access-token"
echo "password=$token"
