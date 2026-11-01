#!/usr/bin/env bash
# Builds the launch version: real links, indexable by search engines and AI assistants. Output: site/dist
cd "$(dirname "$0")/site"
python3 tools/pagegen/run.py && python3 build.py --indexable && python3 tools/pickability.py dist
echo "The finished site is in site/dist. Upload that folder to any static host (Vercel, Netlify, Cloudflare Pages)."
