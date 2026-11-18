#!/bin/bash
# the wide plates again, framed to hold the whole truck (same pixels per metre as before)
cd /home/user/x3d; PY=venv/bin/python; O=out/bay4; F="SCALE=52 CX=9.6 CY=10.4"
r(){ n=$1; shift; [ -f $O/$n.done ] && return; env $F "$@" $PY bay3.py $O/$n.png $W $H $SPP > $O/$n.log 2>&1 && touch $O/$n.done; }
W=4405 H=2765 SPP=72 r wide_col KEY=2
W=4405 H=2765 SPP=72 r wide_clay CLAY=1 SUN=0 SKY=2.1
W=1468 H=922 SPP=1 r wide_d DEPTH=1
[ -f $O/wide_id.done ] || { env $F IDS=1 $PY bay3.py $O/wide.png 4405 2765 1 > $O/wide_id.log 2>&1 && touch $O/wide_id.done; }
echo DONE > $O/all.done
