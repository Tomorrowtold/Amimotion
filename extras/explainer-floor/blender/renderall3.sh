#!/bin/bash
# Lost under a flat sky: the unlocated (clay) plates again with the sun off. Sunlight then arrives with location.
cd /home/user/x3d; PY=venv/bin/python; O=out/bay3
r(){ n=$1; shift; [ -f $O/$n.done ] && return; env CLAY=1 SUN=0 SKY=2.1 "$@" $PY bay3.py $O/$n.png $W $H $SPP > $O/$n.log 2>&1 && touch $O/$n.done; }
W=2400 H=1506 SPP=72 r mid_clay FOCUS=hero SCALE=9
W=3600 H=2260 SPP=72 r wide_clay
W=2000 H=1255 SPP=72 r close_clay FOCUS=tag SCALE=2.2
W=2400 H=1506 SPP=96 r macro_clay FOCUS=tag SCALE=0.36
echo DONE > $O/clay3.done
