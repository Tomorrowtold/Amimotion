"""Retint the shipped CAD stills from the old paper #f5f5f2 to the Sky Ground page #f0f6ff, in place.

    python3 retint_stills.py <site/src/assets> [--ground '#f0f6ff']

Same weighted retint as team/rounds/06-colour/tools/build.py (retint_hero): a white balance in linear light from
the old paper to the new ground, weighted by a smoothstep on linear lightness (0.12 to 0.5), so paper and contact
shadow take the sky tint while the tag's own dark grey (#3a3d42) stays neutral. No full --page divide (that puts a
~10 % blue cast on the tag). Alpha is kept. Each ladder is re-cut from its largest rung (Lanczos down, never up):
AVIF 4:4:4 q62, WebP q80 sharp-YUV, the settings of 02-design/tools/hero_images.py.
"""
import sys, os, re, glob
from collections import defaultdict
import numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

root = sys.argv[1]
ground = sys.argv[sys.argv.index('--ground') + 1] if '--ground' in sys.argv else '#f0f6ff'
OLD_G = np.array([0xf5, 0xf5, 0xf2], np.float64)
G = np.array([int(ground.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)], np.float64)


def L(x): x = x / 255; return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)
def E(x): x = np.clip(x, 0, 1); return 255 * np.where(x <= 0.0031308, 12.92 * x, 1.055 * x ** (1 / 2.4) - 0.055)


def retint(a):
    lin = L(a[..., :3]); Yl = lin @ np.array([0.2126, 0.7152, 0.0722])
    t = np.clip((Yl - 0.12) / (0.5 - 0.12), 0, 1); w = (t * t * (3 - 2 * t))[..., None]
    gain = L(G) / L(OLD_G)
    o = a.copy(); o[..., :3] = E(lin * (1 + (gain - 1) * w))
    return o


NAMES = ('amigo-page', 'amimo-page', 'amigo-side', 'amigo-card', 'amigo-macro', 'amigo-top', 'amimo-3q', 'amimo-a', 'amimo-side')
groups = defaultdict(list)
for f in glob.glob(os.path.join(root, '**', '*.*'), recursive=True):
    m = re.match(r'(.+)-(\d+)\.(avif|webp)$', os.path.basename(f))
    if m and m.group(1) in NAMES:
        groups[(os.path.dirname(f), m.group(1))].append((int(m.group(2)), m.group(3), f))

for (d, name), rows in sorted(groups.items()):
    widths = sorted({w for w, _, _ in rows})
    top = max(widths)
    srcf = os.path.join(d, f'{name}-{top}.webp')
    if not os.path.exists(srcf):
        srcf = os.path.join(d, f'{name}-{top}.avif')
    im = np.asarray(Image.open(srcf).convert('RGBA')).astype(np.float64)
    out = Image.fromarray(retint(im).round().clip(0, 255).astype(np.uint8), 'RGBA')
    for w, fmt, f in sorted(rows):
        r = out if w == out.width else out.resize((w, round(out.height * w / out.width)), Image.LANCZOS)
        if fmt == 'avif':
            r.save(f, quality=62, subsampling='4:4:4', speed=4)
        else:
            r.save(f, quality=80, method=6, use_sharp_yuv=True)
        print(f'{os.path.relpath(f, root)}  {os.path.getsize(f) / 1024:.1f} KB')

# share image: opaque JPEG on the old paper; the same retint, no alpha
og = os.path.join(root, 'home', 'og-home.jpg')
if os.path.exists(og) and '--og' in sys.argv:
    a = np.asarray(Image.open(og).convert('RGB')).astype(np.float64)
    Image.fromarray(retint(a).round().clip(0, 255).astype(np.uint8)).save(og, quality=86, optimize=True, progressive=True)
    print('og-home.jpg retinted')
