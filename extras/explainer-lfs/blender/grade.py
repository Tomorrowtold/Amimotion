# Sodium grade: a low-pressure sodium lamp emits one wavelength, so hue cannot exist. Luminance drives a single-hue ramp.
import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]; mode = sys.argv[3] if len(sys.argv) > 3 else 'sodium'
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255.
if mode == 'sodium':
    L = (a ** 2.2 @ np.array([.2126, .7152, .0722])) ** (1 / 2.2)
    L = np.clip((L - .03) / .9, 0, 1) ** 1.35
    # ramp: black -> deep amber -> sodium yellow-orange -> pale yellow at the very top (a lamp's core)
    stops = np.array([0, .25, .6, .88, 1.]); cols = np.array([[0, 0, 0], [.27, .13, .012], [.78, .48, .06], [.98, .78, .26], [1., .95, .7]])
    out = np.stack([np.interp(L, stops, cols[:, i]) for i in range(3)], -1)
else: out = a
# halation: the brightest sources bleed a little; then fine grain weighted to the mid-tones; then a gentle vignette
h, w = out.shape[:2]
glow = np.asarray(Image.fromarray((np.clip(out - .72, 0, 1) * 255 * 3).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(w / 110))).astype(np.float32) / 255.
out = 1 - (1 - out) * (1 - glow * .5)
rng = np.random.default_rng(3); g = rng.normal(0, 1, (h, w, 1)).astype(np.float32)
lum = out.mean(-1, keepdims=True); out = out + g * .022 * (.35 + 1.6 * lum * (1 - lum))
yy, xx = np.mgrid[0:h, 0:w]; r2 = ((xx / w - .5) ** 2 + (yy / h - .5) ** 2 * (h / w) ** 2)[..., None]; out = out * (1 - .55 * r2)
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(dst, quality=93)
