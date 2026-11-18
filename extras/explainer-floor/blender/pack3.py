# Repack only the wide plates (the reframed wide view that holds the whole truck) and update floor.json in place.
# usage: BAY=out/bay4 pack3.py <site assets dir>
import sys, os, json, numpy as np
from PIL import Image
import OpenEXR
B = os.environ.get('BAY', '/home/user/x3d/out/bay4'); OUT = sys.argv[1]
man = json.load(open(f'{OUT}/floor.json'))
J = {n: json.load(open(f'{B}/{n}_col.json')) for n in ('wide', 'mid', 'close', 'macro')}
w = J['wide']; P = w['pts']
man.update(aspect=w['w'] / w['h'], scale=w['scale'], o=P['o'], x=[P['x'][i] - P['o'][i] for i in (0, 1)], y=[P['y'][i] - P['o'][i] for i in (0, 1)], z=[P['z'][i] - P['o'][i] for i in (0, 1)])
for n in ('mid', 'close', 'macro'):
    q = J[n]['pts']; a, b = 'o', 'a0'
    rs = [(P[b][i] - P[a][i]) / (q[b][i] - q[a][i]) for i in (0, 1)]; r0 = [P[a][i] - q[a][i] * rs[i] for i in (0, 1)]
    man[n] = [round(v, 6) for v in (*r0, *rs)]
LUTC = np.interp(np.arange(256) / 255., [0, .35, .745, 1], [0, .35, .8, 1])
def lift(im):
    a = np.asarray(im).copy(); a[..., :3] = np.round(LUTC[a[..., :3]] * 255).astype(np.uint8); return Image.fromarray(a, 'RGBA')
SZ = dict(L=4405, P=2506)
for lay, wd in SZ.items():
    for st in ('col', 'clay'):
        im = lift(Image.open(f'{B}/wide_{st}.png').convert('RGBA')); h = round(wd * im.height / im.width)
        im.resize((wd, h), Image.LANCZOS).save(f'{OUT}/{lay}/wide_{st}.webp', 'WEBP', quality=86 if st == 'col' else 80, alpha_quality=90, method=6, exact=False)
    f = OpenEXR.File(f'{B}/wide_id.exr'); a = None
    for cn, c in f.parts[0].channels.items():
        if cn in ('R', 'RGB', 'RGBA'): a = np.asarray(c.pixels, np.float32)
    a = a[..., 0] if a.ndim == 3 else a
    im = Image.fromarray(np.clip(np.round(a * 255), 0, 255).astype(np.uint8), 'L'); im.resize((wd, round(wd * im.height / im.width)), Image.NEAREST).save(f'{OUT}/{lay}/wide_id.png', optimize=True)
f = OpenEXR.File(f'{B}/wide_d_z.exr'); d = None
for p in f.parts:
    for cn, ch in p.channels.items():
        if 'Depth' in p.header.get('name', '') or cn.endswith('Depth.Z') or cn == 'Z' or 'Depth' in cn: d = np.asarray(ch.pixels, np.float32)
d = d[..., 0] if d.ndim == 3 else d
lo, hi = float(d[d < 1e4].min()) - .5, float(d[d < 1e4].max()) + .5; v = np.clip((d - lo) / (hi - lo), 0, 1); v[d >= 1e4] = 1
u = np.round(v * 65535).astype(np.uint32); rgb = np.zeros((*d.shape, 3), np.uint8); rgb[..., 0] = u >> 8; rgb[..., 1] = u & 255
Image.fromarray(rgb).save(f'{OUT}/depth.png', optimize=True); man['depth'] = [round(lo, 3), round(hi, 3)]
json.dump(man, open(f'{OUT}/floor.json', 'w'), separators=(',', ':'))
os.system(f'ls -la {OUT}/L/wide_* {OUT}/P/wide_* {OUT}/depth.png')
