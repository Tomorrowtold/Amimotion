"""Compose the film frames from hall.py's light-group EXRs: each frame's light is mixed by the scroll timeline.
python3 compose.py FILM_DIR OUT_DIR [width]
Scroll 1  sodium: one yellow frequency, every other colour lost (Eliasson, Room for one colour).
Scroll 2  the pulse: the plant goes dark; three anchors' red, green and blue cross on one trolley, which turns amber.
Scroll 3  full spectrum pours in from the roof slot (Turrell); every tag lights; the waiting one stays amber.
Scroll 4  the mirrored roof: the plant appears above itself, a live map."""
import sys, os, glob, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from passes import read, tone, lum

def R(t, a, b):
    x = min(1, max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x)

SODIUM = np.array([1.0, .62, .08], np.float32)

def sodium(g):
    """One yellow frequency: the lamps' light as luminance only, dim and deep (same in scroll 1 and the start of 2)."""
    return (lum(g('lamps') + .15 * g('cove')) + .02 * lum(g('sky')))[..., None] * SODIUM * .17

def mix(P, seg, t):
    g = lambda k: P.get('Combined_' + k, 0)
    if seg == 1:
        return sodium(g), -.2
    if seg == 2:
        k = 1 - R(t, .0, .35) * .96
        img = sodium(g) * k + 6 * (R(t, .35, .55) * g('r') + R(t, .5, .7) * g('g') + R(t, .65, .85) * g('b'))
        img = img + R(t, .82, .95) * 3 * g('wait') + .06 * g('cove')
        return img, -.2
    if seg == 3:
        s = R(t, 0, .55)
        rgb = 6 * (1 - R(t, 0, .3)) * (g('r') + g('g') + g('b'))
        img = (1.4 * s * g('sky') + .5 * s * g('cove') + .6 * s * g('field') + (.04 + .2 * s) * g('lamps')
               + R(t, .3, .7) * (g('tag') + .25 * g('ptag')) + 3 * g('wait') + rgb)
        return img, -.6
    img = 1.3 * g('sky') + .5 * g('cove') + .6 * g('field') + .22 * g('lamps') + 1.3 * g('tag') + .25 * g('ptag') + 3 * g('wait')
    return img, -.6

if __name__ == '__main__':
    src, od = sys.argv[1], sys.argv[2]; ww = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    os.makedirs(od, exist_ok=True)
    for fp in sorted(glob.glob(os.path.join(src, 's*_*.exr'))):
        name = os.path.basename(fp)[:-4]; outp = os.path.join(od, name + '.webp')
        if os.path.exists(outp): continue
        seg = int(name[1]); f = int(name.split('_')[1]); t = f / 59.0
        img, ex = mix(read(fp), seg, t)
        im = Image.fromarray(tone(img, ex))
        if ww and ww < im.width: im = im.resize((ww, round(im.height * ww / im.width)), Image.LANCZOS)
        im.save(outp, quality=82, method=5); print('COMPOSED', outp, flush=True)
