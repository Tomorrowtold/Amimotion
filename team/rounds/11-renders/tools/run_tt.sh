#!/bin/bash
# R1 turntable: plate, then 96 frames at 1440 (resumable; rerun to continue)
cd "$(dirname "$0")/../../02-design/renders"
OUT=../../11-renders/work/tt
[ -f $OUT/plate.png ] || /tmp/bpyenv/bin/python render_hardware.py turntable --res 1440 --plate --samples 64 --out $OUT 2>&1 | grep -E "rror" 
/tmp/bpyenv/bin/python render_hardware.py turntable --res 1440 --steps 96 --frames 0-95 --samples 10 --fast --out $OUT 2>&1 | grep -E "FRAME|rror"
echo DONE
