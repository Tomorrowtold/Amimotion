#!/usr/bin/env bash
# Runs ON the GPU instance (Ubuntu + NVIDIA driver, e.g. the AWS Deep Learning Base OSS Nvidia Driver GPU AMI).
# Renders the four-scroll film with Cycles on the GPU and composes web frames into ~/out/web.
# Usage: bash ec2_render.sh [WIDTH] [HEIGHT] [SAMPLES] [SEGMENTS]
set -euo pipefail
W=${1:-1920}; H=${2:-1080}; S=${3:-256}; SEGS=${4:-"1 2 3 4"}
sudo apt-get update -qq && sudo apt-get install -y -qq git libxrender1 libxi6 libsm6 libgl1 libxkbcommon0 libxxf86vm1 libxfixes3 >/dev/null
command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
[ -d ~/venv ] || uv venv -p 3.13 ~/venv
. ~/venv/bin/activate
uv pip install -q bpy==5.3.0 OpenEXR numpy pillow oidn
[ -d ~/Amimotion ] || git clone -q --depth 1 -b claude/project-thread-ps57rn https://github.com/Tomorrowtold/Amimotion.git ~/Amimotion
cd ~/Amimotion && git pull -q || true
mkdir -p ~/mh && [ -f ~/mh/base.obj ] || curl -sL -o ~/mh/base.obj https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/3dobjs/base.obj
export MH_OBJ=~/mh/base.obj CYCLES_GPU=${CYCLES_GPU:-OPTIX}
nvidia-smi --query-gpu=name,memory.total --format=csv
cd ~/Amimotion/extras/explainer-iso
for seg in $SEGS; do
  python hall.py -- ~/out/exr $W $H $S film $seg 2>&1 | grep -E "GPU|FRAME|Error|Traceback" || true
done
python compose.py ~/out/exr ~/out/web 2>&1 | tail -n 3
ls ~/out/web | wc -l
