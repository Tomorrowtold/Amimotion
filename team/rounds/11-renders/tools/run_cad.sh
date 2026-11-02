#!/bin/bash
# Round 11 CAD stills and the R3b dolly, in plan order (resumable: each step skips finished files).
cd "$(dirname "$0")/../../02-design/renders"
O=../../11-renders/work/cad; mkdir -p $O
B=/tmp/bpyenv/bin/python
run() { $B render_hardware.py "$@" --out $O 2>&1 | grep -E "STILL|FRAME|rror:"; }
[ -f $O/macro.png ] || run macro --res 2400x1600 --samples 24
[ -f $O/macro_plate.png ] || run macro --res 2400x1600 --samples 32 --plate
[ -f $O/family.png ] || run family --res 3840x1280 --samples 24 --border 0.14,0.86,0.06,0.98
[ -f $O/family_plate.png ] || run family --res 3840x1280 --samples 32 --plate
run family --res 1920x640 --frames 0-23 --steps 24 --samples 32 --fast --plate
run family --res 1920x640 --frames 0-23 --steps 24 --samples 12 --fast
for p in amigo amimo; do
  for ae in "0 30" "90 30" "180 30" "270 30" "0 60" "0 10"; do
    set -- $ae
    [ -f $O/closer_${p}_az$1_el$2.png ] || run closer --product $p --az $1 --el $2 --res 1600x1600 --samples 20 --fast
    [ -f $O/closer_${p}_az$1_el$2_plate.png ] || run closer --product $p --az $1 --el $2 --res 1600x1600 --samples 32 --plate
  done
done
echo DONE
