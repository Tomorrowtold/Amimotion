#!/usr/bin/env python3
"""Round 14 nav: cut the nav stills from CAD renders already in site/src/assets (no new pictures).
4:3 at 640x480 (the panel preview shows them at about 400 CSS px, the phone sheet at 64), WebP.
Products keep their alpha and sit on the ground plate the CSS draws; hall crops are cut to cover.
python3 team/rounds/14-nav/tools/thumbs.py"""
from pathlib import Path
from PIL import Image
A = Path(__file__).resolve().parents[4] / "site" / "src" / "assets"
OUT = A / "nav"; OUT.mkdir(exist_ok=True)
W, H = 640, 480
SRC = {  # key: (source render, fit)
    "amigo": ("home/amigo-side-1200.webp", "contain"), "amimo": ("home/amimo-page-1200.webp", "contain"),
    "pair": ("home/pair-1600.webp", "contain"),
    "hub": ("hall/hall-all-1600.webp", "cover"), "ask": ("hall/hall-ask-1600.webp", "cover"),
    "wip": ("hall/hall-wip-1600.webp", "cover"), "find": ("hall/hall-find-1600.webp", "cover"),
    "waits": ("hall/hall-waits-1600.webp", "cover"), "mfg": ("hall/hall-mfg-1600.webp", "cover"),
    "wh": ("hall/hall-wh-1600.webp", "cover"), "bay": ("hall/hall-bay-1600.webp", "cover"),
    "racks": ("home/jobs/racks-1200.webp", "cover"), "queue": ("home/queue-1x1-1600.webp", "cover"),
}
for k, (src, fit) in SRC.items():
    im = Image.open(A / src).convert("RGBa")  # premultiplied, so a resize never bleeds dark fringes into the alpha edge
    if fit == "cover":
        s = max(W / im.width, H / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        x, y = (im.width - W) // 2, (im.height - H) // 2; im = im.crop((x, y, x + W, y + H)).convert("RGBA").convert("RGB")
    else:
        bb = im.getchannel("a").getbbox(); im = im.crop(bb) if bb else im
        s = min(W * .82 / im.width, H * .78 / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        c = Image.new("RGBa", (W, H), (0, 0, 0, 0)); c.paste(im, ((W - im.width) // 2, (H - im.height) // 2)); im = c.convert("RGBA")
    im.save(OUT / f"{k}-640.webp", quality=74, method=6)
    print(k, (OUT / f"{k}-640.webp").stat().st_size)
