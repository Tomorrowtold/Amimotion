#!/bin/bash
# all plates of the bay, second pass; resumable
cd /home/user/x3d; PY=venv/bin/python; O=out/bay2
mkdir -p $O
r(){ n=$1; shift; [ -f $O/$n.done ] && return; env "$@" $PY bay2.py $O/$n.png $W $H $SPP > $O/$n.log 2>&1 && touch $O/$n.done; }
W=1200 H=753 SPP=1 r wide_d DEPTH=1
W=2400 H=1506 SPP=96 r macro_col FOCUS=tag SCALE=0.24 KEY=2
W=2400 H=1506 SPP=96 r macro_clay FOCUS=tag SCALE=0.24 CLAY=1
W=2000 H=1255 SPP=72 r close_col FOCUS=tag SCALE=2.2 KEY=2
W=2000 H=1255 SPP=72 r close_clay FOCUS=tag SCALE=2.2 CLAY=1
W=2400 H=1506 SPP=72 r mid_col FOCUS=hero SCALE=9 KEY=2
W=2400 H=1506 SPP=72 r mid_clay FOCUS=hero SCALE=9 CLAY=1
W=3600 H=2260 SPP=72 r wide_col KEY=2
W=3600 H=2260 SPP=72 r wide_clay CLAY=1
IDS=1 $PY bay2.py $O/wide.png 3600 2260 1 > $O/wide_id.log 2>&1
IDS=1 FOCUS=hero SCALE=9 $PY bay2.py $O/mid.png 2400 1506 1 > $O/mid_id.log 2>&1
IDS=1 FOCUS=tag SCALE=2.2 $PY bay2.py $O/close.png 2000 1255 1 > $O/close_id.log 2>&1
IDS=1 FOCUS=tag SCALE=0.24 $PY bay2.py $O/macro.png 2400 1506 1 > $O/macro_id.log 2>&1
touch $O/ids.done
$PY sprites2.py out/spr2 > out/spr2.log 2>&1
echo ALLDONE > $O/all.done
