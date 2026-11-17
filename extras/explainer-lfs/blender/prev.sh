#!/bin/bash
cd /home/user/x3d; . venv/bin/activate
S=$1; if [ "$2" = tall ]; then W=360; H=640; T=t; else W=640; H=360; T=w; fi
python shot.py $S out/pv_$S$T.exr $W $H ${SPP:-24} 2>&1 | grep -E "RENDER_SECONDS|Error|Traceback|error|line " ; LD_LIBRARY_PATH=/home/user/x3d/venv/lib/python3.13/site-packages/oidn/lib.linux.x64 python comp.py out/pv_$S$T.exr out/pv_$S$T
