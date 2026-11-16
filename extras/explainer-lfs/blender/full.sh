#!/bin/bash
# full-size plates, then export to the site. full.sh "A L 96" "B L 128" ...
cd /home/user/x3d; . venv/bin/activate; A=/home/user/amimotion/studio/v1/assets/lfs
for job in "$@"; do set -- $job; S=$1; O=$2; SPP=$3
  if [ $O = L ]; then W=1920; H=1080; else W=1080; H=1920; fi
  python shot.py $S out/full_$S$O.exr $W $H $SPP 2>&1 | grep -E "RENDER_SECONDS|Error|Traceback"
  LD_LIBRARY_PATH=/home/user/x3d/venv/lib/python3.13/site-packages/oidn/lib.linux.x64 python export.py $S out/full_$S$O.exr $A/$O 2>&1 | tail -2
  echo DONE $S $O $(date -u +%H:%M)
done
