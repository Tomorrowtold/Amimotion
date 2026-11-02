"""Grade raw hall renders and cut the film's deliverables. System python (numpy, PIL) plus ffmpeg.

    python3 grade_film.py calib  <raw.png>                  # measure the open-floor patch, print the gain
    python3 grade_film.py frames <raw_dir> <out_dir>        # grade every raw frame (resumable)
    python3 grade_film.py still  <raw.png> <out.png>        # grade one still (any size; patch scales with it)

The grade is one per-channel gain in linear light, the same for every frame, so the open floor lands exactly on
the page ground #f5f5f2, with a highlight shoulder at the ground value (DESIGN_SYSTEM.md 3.1: "grade the hall floor to #f5f5f2"; the floor albedo in the model is
the shared-world #f6f4ef, 1.01:1 from the page). Nothing else: no grain, no vignette, no lens tells. It is a model,
and a model photographed well has none of those.
"""
import sys, os, glob
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import img16

# The page ground the open floor is graded to. Retint the page: HALL_GROUND=#rrggbb python3 grade_film.py ...
_G = os.environ.get('HALL_GROUND', '#f5f5f2').lstrip('#')
GROUND = np.array([int(_G[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0
# open-floor reference patch, as fractions of the frame (aisle near the camera, nothing ever passes it at t=0)
PATCH = (0.95, 0.99, 0.80, 0.95)   # y0, y1, x0, x1: open aisle floor at the bottom right, clear at t = 0


def lin(a):
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def enc(a):
    a = np.clip(a, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * np.power(a, 1 / 2.4) - 0.055)


def measure(a):
    h, w = a.shape[:2]
    y0, y1, x0, x1 = PATCH
    p = a[int(h * y0):int(h * y1), int(w * x0):int(w * x1)].reshape(-1, 3)
    return np.median(p, 0)


GAIN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gain.txt')


def gain_from(raw):
    a = img16.read(raw)
    m = measure(a)
    g = lin(GROUND) / lin(m)
    np.savetxt(GAIN_FILE, g)
    print('floor raw sRGB', (m * 255).round(2), 'gain (linear)', g.round(4))
    return g


def gain():
    return np.loadtxt(GAIN_FILE).astype(np.float32)


def grade(raw, out, g=None):
    g = gain() if g is None else g
    a = img16.read(raw)
    l = lin(a) * g
    # page shoulder: open floor that the key lights brighter than the reference patch (up to #faf9f6 at the far
    # left) is pulled back to the page ground, keeping 15 % of the excess, so the frame has no lighter box on
    # the page. Anything at or below the ground value is untouched.
    Y = l @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    Yg = float(lin(GROUND) @ np.array([0.2126, 0.7152, 0.0722], np.float32))
    r = np.maximum(Y / Yg, 1.0)
    l = l / (r ** 0.85)[..., None]
    # ground hue at the top (Sky Ground): open floor and lit tops at or near the ground value take the ground's own hue,
    # keeping their luminance. The key is a touch warm and the sky dome clips blue on the brightest floor, so without
    # this the lit far floor reads as a warm-white box on the sky page. Darker tones (shadow, ink, hardware) untouched.
    Y2 = l @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    q = Y2 / Yg
    t = np.clip((q - 0.88) / 0.12, 0, 1); t = (t * t * (3 - 2 * t))[..., None]
    gl = lin(GROUND).astype(np.float32)
    l = l * (1 - t) + (gl[None, None, :] * q[..., None]) * t
    b = enc(l)
    im = Image.fromarray((b * 255 + 0.5).clip(0, 255).astype(np.uint8))
    im.save(out)
    return b


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'calib':
        gain_from(sys.argv[2])
    elif cmd == 'frames':
        src, dst = sys.argv[2], sys.argv[3]
        os.makedirs(dst, exist_ok=True)
        g = gain()
        for f in sorted(glob.glob(os.path.join(src, 'f*.png'))):
            if f.endswith('.tmp.png'):
                continue
            o = os.path.join(dst, os.path.basename(f))
            if os.path.exists(o) and os.path.getmtime(o) > os.path.getmtime(f):
                continue
            grade(f, o, g)
        print('graded', len(glob.glob(os.path.join(dst, 'f*.png'))))
    elif cmd == 'still':
        grade(sys.argv[2], sys.argv[3])
