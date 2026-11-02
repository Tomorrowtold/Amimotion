"""Sky Ground film without a re-render: recolour the graded white-hall film frames (03-hero-film/frames/, floor
#f5f5f2) to the Sky Ground hall. Neutral tones go through one per-channel curve on their luminance (hardware stays
neutral, shadow -> #c3d3ec, machines -> a pale sky-white, open floor -> #f0f6ff exactly, the brightest tops a step
whiter), and the old warm cast is dropped. Trails and pads are found by chroma and recoloured to located #1f6bff and
waiting #ffb020 with their own shading kept (the colour team's film-still method, 06-colour/tools/build.py).

    python3 recolor_film.py <in_dir> <out_dir> [frame.png ...]
"""
import sys, os, glob
from multiprocessing import Pool
import numpy as np
from PIL import Image

KN = [0, 66, 120, 201, 231, 245, 255]                    # old graded luminance: 0, hardware, mid, shadow, machines, floor, top
OUT = np.array([[0, 0, 0], [66, 67, 69], [118, 122, 130], [195, 211, 236], [228, 236, 251], [240, 246, 255], [246, 250, 255]], float)
LOC, WAIT = np.array([0x1f, 0x6b, 0xff], float), np.array([0xff, 0xb0, 0x20], float)
REF = {}


def refs(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; Y = a @ [0.2126, 0.7152, 0.0722]
    br = np.percentile((b - r)[(b - r) > 40], 90); ar = np.percentile((r - b)[(r - b) > 60], 90)
    return dict(br=br, ar=ar, yb=np.median(Y[(b - r) > br * 0.9]), ya=np.median(Y[(r - b) > ar * 0.9]))


def recolor(a, R):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    Y = a @ np.array([0.2126, 0.7152, 0.0722])
    neutral = np.stack([np.interp(Y, KN, OUT[:, c]) for c in range(3)], -1)
    tb = np.clip((b - r - 12) / (R['br'] - 12), 0, 1)[..., None]
    ta = np.clip((r - b - 14) / (R['ar'] - 14), 0, 1)[..., None]
    s = np.maximum(tb + ta, 1); tb, ta = tb / s, ta / s
    L = LOC * np.clip(Y / R['yb'], 0.6, 1.15)[..., None]
    W = WAIT * np.clip(Y / R['ya'], 0.6, 1.25)[..., None]
    return np.clip(neutral * (1 - tb - ta) + L * tb + W * ta, 0, 255)


def one(args):
    src, dst = args
    a = np.asarray(Image.open(src).convert('RGB')).astype(np.float64)
    Image.fromarray(recolor(a, REF).round().astype(np.uint8)).save(dst)


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    fs = sys.argv[3:] or sorted(glob.glob(os.path.join(src, 'f*.png')))
    REF.update(refs(np.asarray(Image.open(os.path.join(src, 'f0000.png')).convert('RGB')).astype(np.float64)))  # one reference for every frame: no flicker
    print('refs', {k: round(float(v), 1) for k, v in REF.items()})
    with Pool(3) as p:
        p.map(one, [(f if os.sep in f else os.path.join(src, f), os.path.join(dst, os.path.basename(f))) for f in fs])
    print('recoloured', len(fs))
