#!/usr/bin/env bash
# One-time setup on a Mac: checks Python, Node and Codex, then builds the site once.
set -e
cd "$(dirname "$0")"
command -v python3 >/dev/null || { echo "Python 3 is missing. Install it from https://www.python.org/downloads/ and run this again."; exit 1; }
if ! command -v codex >/dev/null; then
  if command -v brew >/dev/null; then brew install codex; else npm install -g @openai/codex; fi
fi
( cd site && python3 tools/pagegen/run.py && python3 build.py )
chmod +x start.sh preview.sh publish-build.sh
echo; echo "All set. Run ./start.sh to work on the site with Codex, and ./preview.sh to see it."
