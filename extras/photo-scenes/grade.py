import sys, numpy as np
from PIL import Image, ImageFilter
# light photographic finish: gentle S-curve, a touch of vignette and fine luminance grain, then webp at two widths
src, stem, dst = sys.argv[1], sys.argv[2], sys.argv[3]
lift = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255
a = np.clip(a * lift, 0, 1)
if len(sys.argv) > 5:  # tame saturated yellow washes (sunlit walls): pull yellow toward a warm grey
    k = float(sys.argv[5]); L = (a @ np.array([0.2126, 0.7152, 0.0722]))[..., None]
    yel = np.clip((np.minimum(a[..., 0], a[..., 1]) - a[..., 2]) * 3, 0, 1)[..., None]
    a = a * (1 - k * yel) + (L * np.array([1.0, 0.93, 0.82])) * (k * yel)
a = a + 0.06 * (a - 0.5) * (1 - np.abs(2 * a - 1))  # S-curve
h, w = a.shape[:2]; yy, xx = np.mgrid[0:h, 0:w]; r = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2))
a *= (1 - 0.14 * np.clip(r - 0.55, 0, 1) ** 1.6)[..., None]
g = np.random.default_rng(7).normal(0, 0.012, (h, w))[..., None]
a = np.clip(a + g, 0, 1)
im = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
for W, q in ((1600, 80), (900, 78)):
    im.resize((W, round(W * h / w)), Image.LANCZOS).save(f'{dst}/{stem}-{W}.webp', quality=q, method=6)
