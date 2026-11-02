#!/bin/bash
# Sky Ground film render, resumable: re-run to continue (skips finished frames).
cd "$(dirname "$0")/.."
exec /tmp/bpyenv/bin/python build_hall.py --palette sky/palette.json --world-color '#dfeaff' --samples 16 --frames 0-224 --outdir frames_raw_sky
