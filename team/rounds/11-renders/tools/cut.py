"""Round 11 web cuts.
    python3 cut.py ladder <src.png> <out_dir> <base> <w1,w2,...> [--crop x0,y0,x1,y1] [--q 60] [--alpha-ground #f0f6ff]
        AVIF (4:4:4) + WebP per width, Lanczos down from the (cropped) source, never up. Crop in source pixels.
        --alpha-ground: transparent where the picture is the page (as 02-design/tools/hero_images.py), for CAD
        stills that sit on the page with no box.
    python3 cut.py seq <out_dir> <base> <size> <target_kb> <frame.png ...> [--crop x0,y0,x1,y1]
        One AVIF per frame at size px (square or the crop's ratio), the quality chosen once on frame 0 so the mean
        frame lands near target_kb; all frames use that quality (no frame-to-frame quality pumping)."""
import sys, os, io
import numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None


def arg(k, d=None):
    return sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d


def load(src, crop):
    im = Image.open(src).convert('RGB')
    if crop: im = im.crop(tuple(int(v) for v in crop.split(',')))
    return im


def alpha_on_ground(im, ground):
    from scipy import ndimage as ndi
    G = np.array([int(ground.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)], np.float32)
    c = np.asarray(im).astype(np.float32); ww = c.shape[1]
    dev = ndi.gaussian_filter(np.abs(c - G).max(-1), 2 * ww / 1500)
    m = ndi.binary_dilation(dev > 2.0, iterations=max(1, int(10 * ww / 1500)))
    a = np.clip(ndi.gaussian_filter(m.astype(np.float32), 14 * ww / 1500) * 1.02, 0, 1)
    return Image.fromarray(np.dstack([c, a * 255]).round().astype(np.uint8), 'RGBA')


def ladder():
    src, out, base, widths = sys.argv[2:6]
    q = int(arg('--q', 60)); im = load(src, arg('--crop'))
    if arg('--alpha-ground'): im = alpha_on_ground(im, arg('--alpha-ground'))
    os.makedirs(out, exist_ok=True); done = []
    for w in (int(v) for v in widths.split(',')):
        if w > im.width: continue
        r = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(os.path.join(out, f'{base}-{w}.avif'), quality=q, subsampling='4:4:4', speed=4)
        r.save(os.path.join(out, f'{base}-{w}.webp'), quality=80, method=6, use_sharp_yuv=True)
        done.append(f'{w}x{r.height}')
    print(base, ' '.join(done))


def seq():
    out, base, size, target = sys.argv[2], sys.argv[3], int(sys.argv[4]), float(sys.argv[5])
    frames = [f for f in sys.argv[6:] if f.endswith('.png')]
    crop = arg('--crop'); os.makedirs(out, exist_ok=True)
    def prep(f):
        im = load(f, crop); h = round(im.height * size / im.width)
        return im.resize((size, h), Image.LANCZOS)
    def enc(im, q):
        b = io.BytesIO(); im.save(b, 'AVIF', quality=q, subsampling='4:4:4', speed=6); return b.getvalue()
    probe = [prep(frames[i]) for i in sorted({0, len(frames) // 3, 2 * len(frames) // 3})]
    q = 70
    while q > 20 and np.mean([len(enc(p, q)) for p in probe]) / 1024 > target: q -= 3
    tot = 0
    for i, f in enumerate(frames):
        d = enc(prep(f), q); tot += len(d)
        open(os.path.join(out, f'{base}-{size}-{i:03d}.avif'), 'wb').write(d)
    print(base, size, 'q', q, 'frames', len(frames), 'total KB', round(tot / 1024), 'mean KB', round(tot / 1024 / len(frames), 1))


{'ladder': ladder, 'seq': seq}[sys.argv[1]]()
