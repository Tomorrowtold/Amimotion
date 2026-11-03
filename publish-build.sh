#!/usr/bin/env bash
# Launch build of the whole site (studio homepage + every page): real links, indexable by search engines and AI assistants.
# Builds from the last commit. Output: studio/out  -> upload that folder to Cloudflare Pages or Netlify (both read studio/out/_headers).
set -e
cd "$(dirname "$0")"
SITE_BRANCH=HEAD LAUNCH=1 STUDIO_WORK="${TMPDIR:-/tmp}/amimotion-build" python3 studio/integrate.py
echo "Done. The live site is in studio/out ($(find studio/out -type f | wc -l | tr -d ' ') files)."
