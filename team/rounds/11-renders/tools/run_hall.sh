#!/bin/bash
# Round 11 hall renders (build_hall.py, Sky Ground palette, the stills' sky dome), resumable.
cd "$(dirname "$0")/../../03-hero-film"
O=../11-renders/work/hall; mkdir -p $O
B=/tmp/bpyenv/bin/python
R4=11,45,17,34,1.0,10.5      # camera A height, pitch and yaw; wider lens so all four ask-zones are in frame
R5=11,50,26,16,1.5,14.5      # camera A height, turned to yaw 16 (as hall-find) so the rack aisle where t3 stops is seen; press line at left
R7=9,35,30,34,-2.2,7.6,1.0   # one bay, tight, looking up a little so its two anchors are in frame
h() { out=$1; shift; [ -f $O/$out.png ] && return; $B build_hall.py --palette sky/palette.json --world-color '#dfeaff' --samples 16 "$@" --out $O/$out.png 2>&1 | grep -E "STILL|rror:"; }
# R4: the masks are made for camera A's own 16:9 frame (the `hall-all` still the homepage already shows), so they
# overlay it exactly; no new wide still is needed. (A wider R4 framing, $R4, was tried and dropped.)
A169=11,45,26,34,0.0,7.6
[ -f $O/masks/racks_raw.png ] || $B ../11-renders/tools/hall_r11.py masks --cam $A169 --res 1920x1080 --out $O/masks 2>&1 | grep -E "MASK|rror:"
h r5-before      --state before --t 3.7 --res 2400x1500 --cam $R5 --hide fork
h r5-after-trail --state after --res 2400x1500 --cam $R5 --hide fork --trails t3 --amber none
h r5-after-clean --state after --res 2400x1500 --cam $R5 --hide fork --trails none --amber none
$B ../11-renders/tools/hall_r11.py trail --cam $R5 --res 2400x1500 --crop 0,0,2400,1500 --key t3 --hide fork --out $O/r5-trail.json 2>&1 | grep TRAIL
h r7-bay --state after --res 2400x1600 --cam $R7 --trails ti,q1,q2,q3 --amber q1,q2,q3
echo DONE
