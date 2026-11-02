#!/bin/bash
# Round 11 CAD queue, part 2 (after run_cad.sh): R3 phone 4:5, R13, R10, R11. Resumable.
cd "$(dirname "$0")/../../02-design/renders"
O=../../11-renders/work/cad; mkdir -p $O/phone
B=/tmp/bpyenv/bin/python
run() { $B render_hardware.py "$@" 2>&1 | grep -E "STILL|FRAME|rror:"; }
[ -f $O/phone/family.png ] || run family --res 1200x1500 --dist 0.78 --samples 24 --out $O/phone
[ -f $O/phone/family_plate.png ] || run family --res 1200x1500 --dist 0.78 --samples 32 --plate --out $O/phone
[ -f $O/amimo_column.png ] || run amimo_column --res 2400x1600 --samples 32 --out $O
run lower --res 1600x1000 --steps 12 --samples 32 --fast --plate --out $O
run lower --res 1600x1000 --steps 12 --samples 12 --fast --out $O
run covers --res 1200x1200 --steps 24 --samples 32 --fast --plate --out $O
run covers --res 1200x1200 --steps 24 --samples 12 --fast --out $O
echo DONE
