#!/usr/bin/env bash
# Builds the launch version of the whole site from the last commit and opens it at http://localhost:8000 . Ctrl+C stops it.
cd "$(dirname "$0")"
./publish-build.sh || exit 1
( sleep 1; open http://localhost:8000 2>/dev/null || xdg-open http://localhost:8000 2>/dev/null ) &
python3 -m http.server 8000 --directory studio/out
