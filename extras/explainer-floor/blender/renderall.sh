#!/bin/bash
# all plates of the bay; resumable
cd /home/user/x3d; PY=venv/bin/python; O=out/bay
mkdir -p $O
r(){ n=$1; shift; [ -f $O/$n.done ] && return; env "$@" $PY bay.py $O/$n.png $W $H $SPP > $O/$n.log 2>&1 && touch $O/$n.done; }
W=1200 H=753 SPP=1 r wide_d DEPTH=1
W=2400 H=1506 SPP=72 r macro_col FOCUS=tag SCALE=0.7
W=2400 H=1506 SPP=72 r macro_clay FOCUS=tag SCALE=0.7 CLAY=1
W=2000 H=1255 SPP=72 r close_col FOCUS=tag SCALE=2.2
W=2000 H=1255 SPP=72 r close_clay FOCUS=tag SCALE=2.2 CLAY=1
W=2400 H=1506 SPP=72 r mid_col FOCUS=hero SCALE=9
W=2400 H=1506 SPP=72 r mid_clay FOCUS=hero SCALE=9 CLAY=1
W=3600 H=2260 SPP=72 r wide_col
W=3600 H=2260 SPP=72 r wide_clay CLAY=1
echo ALLDONE > $O/all.done
