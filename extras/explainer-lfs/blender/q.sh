#!/bin/bash
# resumable queue: q.sh "S O W H SPP" ...  a job that already finished is skipped
cd /home/user/x3d; . venv/bin/activate; A=/home/user/amimotion/studio/v1/assets/lfs
for job in "$@"; do set -- $job; S=$1; O=$2; W=$3; H=$4; SPP=$5; T=out/q_$S$O
  [ -f $T.done ] && continue
  python shot.py $S $T.exr $W $H $SPP 2>&1 | grep -E "RENDER_SECONDS|Error|Traceback"
  LD_LIBRARY_PATH=/home/user/x3d/venv/lib/python3.13/site-packages/oidn/lib.linux.x64 python export.py $S $T.exr $A/$O 2>&1 | tail -2 && touch $T.done
  echo DONE $S $O $(date -u +%H:%M)
done
echo ALLDONE
