# Turn a layered render into the web plate: denoised light layers (display-encoded WebP), depth and distance maps, and its numbers.
# usage: export.py <A|B|C|D> in.exr outdir   (outdir = .../assets/lfs/L or P)
import sys, os, json, numpy as np
from PIL import Image, ImageFilter
import comp
S, src, out = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(out, exist_ok=True); s = S.lower()
G, d = comp.load(src); meta = json.load(open(src.replace('.exr', '.json'))); H, W = d.shape
lum = comp.lum
# how each layer is scaled before it is stored (linear gain, then gamma 2.2). The page's shader undoes the gamma only.
GAIN = dict(A=dict(lamps=2.2), B=dict(isl=6., lamps=2.2, amber=3., slot=2.4, pools=1.6), C=dict(lamps=2.2, anc=60., led=30., cone=3.2), D=dict(lamps=2.2, cone=6., led=1.2))[S]
COLOUR = dict(B=('slot', 'pools'), C=('cone',)).get(S, ())
def save(name, a, q=82, half=False):
    im = Image.fromarray((np.clip(a, 0, 1) * 255 + .5).astype(np.uint8))
    if half:      # geometry maps: a median takes out single stray samples, a light blur keeps the parallax and the pulse from tearing at edges
        im = im.filter(ImageFilter.MedianFilter(5)).resize((W // 2, H // 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    p = os.path.join(out, f'{s}_{name}.webp'); im.save(p, 'WEBP', quality=q, method=6); return os.path.getsize(p)
sizes = {}
for k, g in GAIN.items():
    a = G[k] if k != 'pools' else G['pools'] + G.get('cone', 0) * .5
    a = a * g
    sizes[k] = save(k, (a if k in COLOUR else lum(a)) ** (1 / 2.2), 88)
# geometry: where every pixel is
mat = np.array(meta['mat']); lens = meta['lens']; sw = 36. if meta['fit'] == 'HORIZONTAL' else 36. * W / H
u, v = np.meshgrid((np.arange(W) + .5) / W, (np.arange(H) + .5) / H)
shx, shy = meta.get('shift', [0, 0]); dx = (u - .5) * sw / lens + shx * 36. / lens; dy = (.5 - v) * (sw * H / W) / lens + shy * 36. / lens; dirs = np.stack([dx, dy, -np.ones_like(dx)], -1)
far = d > 1e4; dd = np.where(far, 1e4, d)
# is the depth pass planar or along the ray? test on a known point
k = 'herofloor' if S != 'D' else 'tag'; px, py, pz = meta['pts'][k]; ix, iy = int(px * W), int(py * H)
planar = None
if 0 <= ix < W and 0 <= iy < H:
    ray = pz * np.linalg.norm(dirs[iy, ix]); planar = abs(d[iy, ix] - pz) < abs(d[iy, ix] - ray); print('depth check', d[iy, ix], 'z', pz, 'ray', ray, 'planar' if planar else 'ray')
planar = True   # Cycles writes camera-space depth
pc = dirs * dd[..., None] if planar else dirs / np.linalg.norm(dirs, axis=-1, keepdims=True) * dd[..., None]
world = pc @ mat[:3, :3].T + mat[:3, 3]
zc = -pc[..., 2]; near = float(np.percentile(zc, .5)); inv = np.clip(near / zc, 0, 1); inv[far] = 0
sizes['depth'] = save('depth', inv, 80, half=True)
info = dict(w=W, h=H, near=near, pts=meta['pts'], counts=meta['counts'], gain=GAIN)
if S in 'BC':
    c = np.array(meta['world']['herofloor' if S == 'B' else 'tag']); DM = 160. if S == 'B' else 70.
    dist = np.linalg.norm((world - c)[..., :2] if S == 'B' else world - c, axis=-1); dist[far] = DM
    # the distance map drives thresholds (the pulse front, light spreading), so it is stored without loss, at a third of the size
    dm = Image.fromarray((np.sqrt(np.clip(dist / DM, 0, 1)) * 255 + .5).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)).resize((W // 3, H // 3), Image.BOX).filter(ImageFilter.GaussianBlur(.8))
    pth = os.path.join(out, f'{s}_dist.webp'); dm.save(pth, 'WEBP', lossless=True, method=6); sizes['dist'] = os.path.getsize(pth); info['dmax'] = DM
    if S == 'C': info['adist'] = [float(np.linalg.norm(np.array(meta['world'][a]) - c)) for a in ('a0', 'a1', 'a2')]
json.dump(info, open(os.path.join(out, f'{s}.json'), 'w')); print(S, sizes, sum(sizes.values()) // 1024, 'KB')
