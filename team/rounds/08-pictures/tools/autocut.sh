#!/bin/bash
# cut each finished hall render once (graded file marks it done)
cd "$(dirname "$0")/.."
while true; do
  for f in raw/*.png; do
    n=$(basename $f .png); case $n in *-graded) continue;; esac
    [ -f raw/$n-graded.png ] && continue
    python3 tools/hall_stills.py cut $n && echo "cut $n"
  done
  [ -f raw/.stop ] && exit 0
  sleep 20
done
