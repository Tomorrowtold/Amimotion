"""Round 11: put CAD studio frames on the Sky Ground page with an exact flat-field.

    python3 plate_grade.py <plate.png> <out_dir> <frame.png ...> [--ground #f0f6ff] [--grain]

The plate is the same camera and studio rendered with the products hidden (render_hardware.py ... --plate).
Each frame is divided by it in linear light, so the sweep's light fall-off goes and the paper lands exactly
on the old neutral ground #f5f5f2 (as page_grade does with a fitted surface; here the surface is measured,
so a sequence cannot flicker). The product and its contact shadow keep their true ratio to the paper. Pixels a
border render left black are the plate, so they become the ground. Anything above the ground next to a
dark object is fit error and is clamped (no halo, no glow). Then the paper-only retint the colour team uses
(06-colour/tools/build.py, 08-pictures/tools/cad_ladder.py): a linear white balance #f5f5f2 -> ground,
weighted by a smoothstep on linear lightness so the dark plastic (#3a3d42-ish) stays neutral, no blue cast.
Sequences get no grain (it would shimmer frame to frame and cost AVIF bytes); stills take --grain."""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS = None
Y3 = np.array([0.2126, 0.7152, 0.0722], np.float32)


def L(x): return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4).astype(np.float32)
def E(x): x = np.clip(x, 0, 1); return np.where(x <= 0.0031308, 12.92 * x, 1.055 * x ** (1 / 2.4) - 0.055).astype(np.float32)
def hexc(h): return np.array([int(h.lstrip('#')[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)


def load(p):
    a = np.asarray(Image.open(p)).astype(np.float32)
    a = a / (65535.0 if a.max() > 255 else 255.0)
    return a[..., :3]


def grade(frame, plate_lin, ground='#f0f6ff', grain=False, seed=11, edge=0.04):
    f = L(load(frame) if isinstance(frame, str) else frame)
    h, w = f.shape[:2]
    if plate_lin.shape[:2] != (h, w):
        plate_lin = np.stack([np.asarray(Image.fromarray(plate_lin[..., c], 'F').resize((w, h), Image.BICUBIC)) for c in range(3)], -1)
    unr = (f @ Y3) <= 1e-6
    # levels x0.95 and veiling glare (as grade()/page_grade()), on frame and plate alike
    G = 0.015 * float((plate_lin @ Y3).mean())
    f = f * 0.95 ** 2.2 + G; p = plate_lin * 0.95 ** 2.2 + G
    g0 = L(hexc('#f5f5f2'))
    # per-channel flat-field on the paper; on the dark plastic the luminance of the plate only, so the paper's
    # slight warmth behind the tag cannot tint the tag cool when it is divided out
    k = g0 / np.maximum(p, 1e-4)
    kn = (float(g0 @ Y3) / np.maximum(p @ Y3, 1e-4))[..., None]
    tn = np.clip(((f * k) @ Y3 - 0.12) / 0.38, 0, 1); tn = (tn * tn * (3 - 2 * tn))[..., None]
    out = f * (kn + (k - kn) * tn)
    out[unr] = g0
    out = np.minimum(out, g0)
    # where the picture is the page: weight from the blurred difference to the ground (exact ground elsewhere)
    dY = np.abs((out @ Y3) / float(g0 @ Y3) - 1)
    sm = max(1.5, w / 900)
    dY = ndi.gaussian_filter(dY, sm)
    wgt = np.clip((dY - 0.008) / 0.025, 0, 1)
    wgt = ndi.gaussian_filter(ndi.maximum_filter(wgt, size=int(sm * 3) | 1), sm * 2)
    # keep the picture only near the product (its body and core shadow, grown by ~5 % of the width and feathered):
    # low-sample paper noise far from it, or a border render's edge, must not draw a faint box on the page
    core = ndi.binary_dilation(dY > 0.06, iterations=max(1, int(w * 0.035)))
    wgt = wgt * np.clip(ndi.gaussian_filter(core.astype(np.float32), w * 0.02) * 1.5, 0, 1)
    if edge:
        yy = np.minimum(np.arange(h), np.arange(h)[::-1])[:, None] / h
        xx = np.minimum(np.arange(w), np.arange(w)[::-1])[None, :] / w
        wgt = wgt * np.clip(np.minimum(yy, xx) / edge, 0, 1)
    wgt = np.clip(wgt, 0, 1)
    out = g0 + (out - g0) * wgt[..., None]
    # paper-only retint #f5f5f2 -> ground: the tag's dark grey (linear Y < 0.12) is untouched
    Yl = out @ Y3
    t = np.clip((Yl - 0.12) / 0.38, 0, 1); ws = (t * t * (3 - 2 * t))[..., None]
    gain = L(hexc(ground)) / g0
    out = out * (1 + (gain - 1) * ws)
    o = E(out)
    rng = np.random.default_rng(seed)
    if grain:
        Lm = o @ Y3
        o = np.clip(o + ((0.0050 + 0.006 * (1 - Lm)) * wgt)[..., None] * rng.standard_normal((h, w, 1), dtype=np.float32), 0, 1)
    d = rng.random(o.shape, dtype=np.float32) * wgt[..., None] + 0.5 * (1 - wgt[..., None])
    return Image.fromarray((o * 255 + d).clip(0, 255).astype(np.uint8))


if __name__ == '__main__':
    a = sys.argv[1:]
    ground = a[a.index('--ground') + 1] if '--ground' in a else '#f0f6ff'
    grain = '--grain' in a
    edge = float(a[a.index('--edge') + 1]) if '--edge' in a else 0.04   # 0: the picture may run off the frame's edges
    a = [x for i, x in enumerate(a) if not x.startswith('--') and (i == 0 or a[i - 1] not in ('--ground', '--edge'))]
    plate, outdir, frames = a[0], a[1], a[2:]
    pl = L(load(plate)); os.makedirs(outdir, exist_ok=True)
    for fr in frames:
        dst = os.path.join(outdir, os.path.basename(fr))
        if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(fr): continue
        grade(fr, pl, ground, grain, edge=edge).save(dst, compress_level=2)
        print('graded', dst, flush=True)
