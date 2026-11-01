#!/usr/bin/env bash
# Rebuilds the site and opens it at http://localhost:8000 . Press Ctrl+C to stop.
cd "$(dirname "$0")/site"
python3 tools/pagegen/run.py && python3 build.py || exit 1
( sleep 1; open http://localhost:8000 2>/dev/null || xdg-open http://localhost:8000 2>/dev/null ) &
python3 -m http.server 8000 --directory dist
