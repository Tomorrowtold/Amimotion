# Pack the bay renders for the page. usage: pack.py <site assets dir>
import sys, os, json, numpy as np
from PIL import Image
import OpenEXR
B = os.environ.get('BAY', '/home/user/x3d/out/bay'); S = os.environ.get('SPR', '/home/user/x3d/out/spr'); OUT = sys.argv[1]
J = {n: json.load(open(f'{B}/{n}_col.json')) for n in ('wide', 'mid', 'close', 'macro')}
w = J['wide']; P = w['pts']
man = dict(aspect=w['w'] / w['h'], scale=w['scale'], o=P['o'], x=[P['x'][i] - P['o'][i] for i in (0, 1)], y=[P['y'][i] - P['o'][i] for i in (0, 1)], z=[P['z'][i] - P['o'][i] for i in (0, 1)],
           things=[[k, round(x, 2), round(y, 2)] for k, x, y in w['things']], anch=w['anch'], hero=w['hero'], tag=w['tag'], due=w['due'], pallet=w['pallet'], free=w['free'], view=w['view'], cam=w['cam'])
for n in ('mid', 'close', 'macro'):
    q = J[n]['pts']; a, b = 'o', 'a0'
    rs = [(P[b][i] - P[a][i]) / (q[b][i] - q[a][i]) for i in (0, 1)]; r0 = [P[a][i] - q[a][i] * rs[i] for i in (0, 1)]
    man[n] = [round(v, 6) for v in (*r0, *rs)]
LUTC = np.interp(np.arange(256) / 255., [0, .35, .745, 1], [0, .35, .8, 1])      # lifts the pale tones toward the page's own ground; darks stay
def lift(im):
    a = np.asarray(im).copy(); a[..., :3] = np.round(LUTC[a[..., :3]] * 255).astype(np.uint8); return Image.fromarray(a, 'RGBA')
def plate(n, st, wd, dst, q=84):
    im = lift(Image.open(f'{B}/{n}_{st}.png').convert('RGBA')); h = round(wd * im.height / im.width)
    im.resize((wd, h), Image.LANCZOS).save(dst, 'WEBP', quality=q, alpha_quality=90, method=6, exact=False)
for lay, sizes in (('L', dict(wide=3600, mid=2400, close=2000, macro=2400)), ('P', dict(wide=2048, mid=1280, close=1280, macro=1280))):
    os.makedirs(f'{OUT}/{lay}', exist_ok=True)
    for n, wd in sizes.items():
        for st in ('col', 'clay'): plate(n, st, wd, f'{OUT}/{lay}/{n}_{st}.webp', 86 if st == 'col' else 80)
# the matte of located things, one byte per pixel, lossless
def ids(n):
    f = OpenEXR.File(f'{B}/{n}_id.exr'); ch = list(f.parts[0].channels.values()); a = None
    for cn, c in f.parts[0].channels.items():
        if cn in ('R', 'RGB', 'RGBA'): a = np.asarray(c.pixels, np.float32)
    a = a[..., 0] if a.ndim == 3 else a
    return Image.fromarray(np.clip(np.round(a * 255), 0, 255).astype(np.uint8), 'L')
for lay, sizes in (('L', dict(wide=3600, mid=2400, close=2000, macro=2400)), ('P', dict(wide=2048, mid=1280, close=1280, macro=1280))):
    for n, wd in sizes.items():
        im = ids(n); im.resize((wd, round(wd * im.height / im.width)), Image.NEAREST).save(f'{OUT}/{lay}/{n}_id.png', optimize=True)
# depth: distance along the view, 16 bits in two channels
f = OpenEXR.File(f'{B}/wide_d_z.exr'); d = None
for p in f.parts:
    for cn, ch in p.channels.items():
        if 'Depth' in p.header.get('name', '') or cn.endswith('Depth.Z') or cn == 'Z' or 'Depth' in cn: d = np.asarray(ch.pixels, np.float32)
d = d[..., 0] if d.ndim == 3 else d
lo, hi = float(d[d < 1e4].min()) - .5, float(d[d < 1e4].max()) + .5; v = np.clip((d - lo) / (hi - lo), 0, 1); v[d >= 1e4] = 1
u = np.round(v * 65535).astype(np.uint32); rgb = np.zeros((*d.shape, 3), np.uint8); rgb[..., 0] = u >> 8; rgb[..., 1] = u & 255
Image.fromarray(rgb).save(f'{OUT}/depth.png', optimize=True); man['depth'] = [round(lo, 3), round(hi, 3)]
# sprites: one sheet. rows 0-1 AMR colour (16 headings), 2-3 AMR clay, 4-7 the walker (4 headings x 8 frames)
sm = json.load(open(f'{S}/sprites.json')); C = 384
for lay, c in (('L', 384), ('P', 192)):
    sh = Image.new('RGBA', (8 * c, 8 * c))
    def put(name, col, row):
        im = Image.open(f'{S}/{name}.png').convert('RGBA'); a = np.asarray(im).astype(np.float32)
        shm = (a[..., :3].sum(-1) < 45) & (a[..., 3] < 250)          # the caught shadow: as light as the shadows in the plates
        a[shm, 3] *= .42; a[shm, 0] = 22; a[shm, 1] = 32; a[shm, 2] = 62; a[~shm, :3] = LUTC[a[~shm, :3].astype(np.uint8)] * 255; im = Image.fromarray(a.astype(np.uint8))
        if c != C: im = im.resize((c, c), Image.LANCZOS)
        sh.paste(im, (col * c, row * c))
    for k in range(16): put(f'amr_col_{k:02d}', k % 8, k // 8); put(f'amr_clay_{k:02d}', k % 8, 2 + k // 8)
    for h in range(4):
        for fr in range(8): put(f'walk_{h}_{fr}', fr, 4 + h)
    sh.save(f'{OUT}/{lay}/sprites.webp', 'WEBP', quality=78, alpha_quality=80, method=6)
man['spr'] = sm
json.dump(man, open(f'{OUT}/floor.json', 'w'), separators=(',', ':'))
os.system(f'du -sh {OUT}/L {OUT}/P; ls -la {OUT}/L {OUT}/P {OUT}')
