#!/bin/bash
# the high view for laptops at 2560 wide, so it stays sharp on 2x screens
cd /home/user/x3d; . venv/bin/activate; A=/home/user/amimotion/studio/v1/assets/lfs
python shot.py B out/big_BL.exr 2560 1440 112 2>&1 | grep -E "RENDER_SECONDS|Error|Traceback"
LD_LIBRARY_PATH=/home/user/x3d/venv/lib/python3.13/site-packages/oidn/lib.linux.x64 python export.py B out/big_BL.exr $A/L 2>&1 | tail -2
echo DONE BIG $(date -u +%H:%M)
