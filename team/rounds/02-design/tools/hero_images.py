"""Cut the web ladder for the hero still: AVIF + WebP at each width, from one page-graded master.
    python3 hero_images.py <master.png> <out_dir> <name> <x0,y0,x1,y1 crop in master px> <w1,w2,...> [--q 62]
The image is RGBA: transparent where it is the page. The crop is taken from the master first, then each width is a Lanczos downscale of that crop (never an upscale:
widths larger than the crop are skipped and reported). AVIF is 4:4:4 so the page ground stays the token value
after decode; WebP is lossy with the sharp-YUV option for the same reason."""
import sys, os
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, out, name, box, widths = sys.argv[1:6]
q = int(sys.argv[sys.argv.index('--q') + 1]) if '--q' in sys.argv else 62
ground = sys.argv[sys.argv.index('--ground') + 1] if '--ground' in sys.argv else '#f5f5f2'
feather = float(sys.argv[sys.argv.index('--feather') + 1]) if '--feather' in sys.argv else 0.06
qw = int(sys.argv[sys.argv.index('--qw') + 1]) if '--qw' in sys.argv else 80
im = Image.open(src).convert('RGB')
x0, y0, x1, y1 = [int(v) for v in box.split(',')]
crop = im.crop((x0, y0, x1, y1))
# 1. the crop's own edges are the page: feather the outer band to the exact ground token, so no rectangle shows
#    even where the contact shadow runs wide
import numpy as np
G = np.array([int(ground.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)], np.float32)
c = np.asarray(crop).astype(np.float32)
hh, ww = c.shape[:2]
band = feather * min(hh, ww)
yy = np.minimum(np.arange(hh), np.arange(hh)[::-1])[:, None]
xx = np.minimum(np.arange(ww), np.arange(ww)[::-1])[None, :]
t = np.clip(np.minimum(yy, xx) / band, 0, 1); t = t * t * (3 - 2 * t)
c = G + (c - G) * t[..., None]
# 2. alpha: wherever the picture equals the page, it is transparent, so the page itself shows through and no
#    codec rounding can draw a rectangle. Alpha rises to 1 a little outside anything that differs from the ground
#    (tag, contact shadow) and the colour there is the picture's own, which is the ground +-0.5 level, so the
#    blend is exact to the eye.
from scipy import ndimage as ndi
dev = np.abs(c - G).max(-1)
sc = ww / 1500
dev = ndi.gaussian_filter(dev, 2 * sc)
m = dev > 2.0
m = ndi.binary_dilation(m, iterations=max(1, int(10 * sc)))
alpha = ndi.gaussian_filter(m.astype(np.float32), 14 * sc) * t
alpha = np.clip(alpha * 1.02, 0, 1)
c = np.dstack([c, alpha * 255])
base = c
os.makedirs(out, exist_ok=True)
for w in [int(v) for v in widths.split(',')]:
    if w > ww:
        print(f'skip {w}: crop is only {ww} px wide'); continue
    h = round(hh * w / ww)
    src_img = Image.fromarray(base.clip(0, 255).round().astype(np.uint8))
    r = src_img if w == ww else src_img.resize((w, h), Image.LANCZOS)
    ra = np.asarray(r).astype(np.float32)
    pa = os.path.join(out, f'{name}-{w}.avif'); pw = os.path.join(out, f'{name}-{w}.webp')
    Image.fromarray((ra).clip(0, 255).astype(np.uint8)).save(pa, quality=q, subsampling='4:4:4', speed=4)
    Image.fromarray((ra).clip(0, 255).astype(np.uint8)).save(pw, quality=qw, method=6, use_sharp_yuv=True)
    print(f'{w}x{h}  avif {os.path.getsize(pa)/1024:.1f} KB  webp {os.path.getsize(pw)/1024:.1f} KB')
