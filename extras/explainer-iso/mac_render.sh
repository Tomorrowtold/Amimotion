#!/usr/bin/env bash
# Runs on the Mac (Apple Silicon): renders the four-scroll film with Cycles on the Metal GPU, then composes web frames.
# Usage: bash mac_render.sh [WIDTH] [HEIGHT] [SAMPLES] [SEGMENTS] [STEP]
set -euo pipefail
W=${1:-1920}; H=${2:-1080}; S=${3:-128}; SEGS=${4:-"1 2 3 4"}; STEP=${5:-1}
OUT=${OUT:-$HOME/AmIMotion-Local/explainer-film}
command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
[ -d "$OUT/venv" ] || uv venv -p 3.13 "$OUT/venv"
. "$OUT/venv/bin/activate"
uv pip install -q bpy==5.3.0 OpenEXR numpy pillow
uv pip install -q oidn 2>/dev/null || echo "oidn not available, using the fallback denoise"
mkdir -p "$OUT/mh"; [ -f "$OUT/mh/base.obj" ] || curl -sL -o "$OUT/mh/base.obj" https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/3dobjs/base.obj
export MH_OBJ="$OUT/mh/base.obj" CYCLES_GPU=${CYCLES_GPU:-METAL}
cd "$(dirname "$0")"
for seg in $SEGS; do
  caffeinate -i python hall.py -- "$OUT/exr" $W $H $S film $seg 0 60 $STEP 2>&1 | grep -E "^GPU|FRAME|Error|Traceback" || true
done
python compose.py "$OUT/exr" "$OUT/web" 2>&1 | tail -n 2
ls "$OUT/web" | wc -l
