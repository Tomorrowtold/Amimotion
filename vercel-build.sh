#!/usr/bin/env bash
# Vercel build: the same launch build as ./publish-build.sh, from the checked-out files (Vercel has no git history).
# Output: studio/out (vercel.json outputDirectory). The agent API lives in api/ and runs as Vercel Functions.
set -e
cd "$(dirname "$0")"
PY=$(command -v python3 || command -v python)
SITE_BRANCH=WORKTREE LAUNCH=1 STUDIO_WORK="${TMPDIR:-/tmp}/amimotion-build" "$PY" studio/integrate.py
rm -f studio/out/_headers   # Cloudflare/Netlify file; Vercel reads the same headers from vercel.json
echo "Vercel build done: $(find studio/out -type f | wc -l | tr -d ' ') files."
