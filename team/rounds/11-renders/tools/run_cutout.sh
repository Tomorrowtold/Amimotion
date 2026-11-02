#!/bin/bash
# Studio site cut-outs: 9 transparent PNGs (3 products x 3 views) plus their contact-shadow catch renders. Resumable.
cd "$(dirname "$0")/../../02-design/renders"
O=../../11-renders/work/cutout; mkdir -p $O
B=/tmp/bpyenv/bin/python
mode=$1
for p in amigo amimo pair; do for v in 34 side top; do
  if [ "$mode" = shadow ]; then
    [ -f $O/$p-${v}_shadowcatch.png ] || $B render_hardware.py cutout --product $p --view $v --res 2400x1600 --samples 24 --fast --shadow --out $O 2>&1 | grep -E "rror:"
  else
    [ -f $O/$p-$v.png ] || $B render_hardware.py cutout --product $p --view $v --res 2400x1600 --samples 32 --out $O 2>&1 | grep -E "STILL|rror:"
  fi
done; done
echo DONE $mode
