"""Split a multilayer EXR from hall.py into light-group passes, preview mixes, and export web layers.
python3 passes.py IN.exr OUTDIR [webwidth]
Web layers: each pass stored as 8-bit WebP of (linear * k) ** (1/2.2); k per pass goes in layers.json, so the page can
decode to linear, mix light like light (by adding), then tone-map."""
import sys, os, json, numpy as np, OpenEXR
from PIL import Image

os.environ['LD_LIBRARY_PATH'] = os.environ.get('LD_LIBRARY_PATH', '')
import ctypes, glob
for so in sorted(glob.glob('/usr/local/lib/python3.13/dist-packages/oidn/lib.linux.x64/libtbb*')): ctypes.CDLL(so, mode=ctypes.RTLD_GLOBAL)
try:
    import oidn
except Exception:
    oidn = None   # no OIDN here: fall back to borrowing the denoised Combined (see read)

def denoise(color, albedo=None, normal=None):
    h, w, _ = color.shape
    dev = oidn.NewDevice(); oidn.CommitDevice(dev)
    f = oidn.NewFilter(dev, 'RT')
    c = np.ascontiguousarray(color, dtype=np.float32); out = np.zeros_like(c)
    oidn.SetSharedFilterImage(f, 'color', c, oidn.FORMAT_FLOAT3, w, h)
    if albedo is not None: oidn.SetSharedFilterImage(f, 'albedo', np.ascontiguousarray(albedo, dtype=np.float32), oidn.FORMAT_FLOAT3, w, h)
    if normal is not None: oidn.SetSharedFilterImage(f, 'normal', np.ascontiguousarray(normal, dtype=np.float32), oidn.FORMAT_FLOAT3, w, h)
    oidn.SetSharedFilterImage(f, 'output', out, oidn.FORMAT_FLOAT3, w, h)
    oidn.SetFilter1b(f, 'hdr', True) if hasattr(oidn, 'SetFilter1b') else None
    oidn.CommitFilter(f); oidn.ExecuteFilter(f)
    oidn.ReleaseFilter(f); oidn.ReleaseDevice(dev)
    return out

def box1(a, r, ax):
    c = np.cumsum(np.pad(a, [(r + 1, r) if i == ax else (0, 0) for i in range(a.ndim)], mode='edge'), axis=ax)
    n = a.shape[ax]
    return (np.take(c, range(2 * r + 1, 2 * r + 1 + n), axis=ax) - np.take(c, range(0, n), axis=ax)) / (2 * r + 1)
def blur(a, r):
    for _ in range(3): a = box1(box1(a, r, 0), r, 1)
    return a

def read(path, fog=.55):
    f = OpenEXR.File(path, separate_channels=True)
    out = {}; mist = None
    for part in f.parts:
        ch = part.channels; pn = part.name(); name = pn.split('.', 1)[-1]
        if name == 'Mist': mist = list(ch.values())[0].pixels.astype(np.float32)
        try: out[name] = np.stack([ch[pn + '.' + c].pixels.astype(np.float32) for c in 'RGB'], -1)
        except KeyError:
            try: out[name] = np.stack([ch[pn + '.' + c].pixels.astype(np.float32) for c in 'XYZ'], -1)
            except KeyError: pass
    alb, nrm = out.get('Denoising Albedo'), out.get('Denoising Normal')
    keys = [k for k in out if k.startswith('Combined_')]
    w = next(iter(out.values())).shape[1]
    C = out.get('Combined'); tot = None
    if oidn is None and C is not None:
        tot = blur(sum(out[k] for k in keys) + 1e-6, max(1, w // 900))
    for k in keys:
        if oidn is not None: v = denoise(out[k], alb, nrm)
        else: v = C * np.clip(blur(out[k], max(1, w // 900)) / tot, 0, 1)
        # light scattered in the air: each light's own glow, stronger with distance (Eliasson's haze, done in post)
        if mist is not None and fog:
            t = np.clip(mist, 0, 1)[..., None] ** .8 * fog
            v = v * (1 - .5 * t) + blur(v, max(2, w // 60)) * 1.6 * t + blur(v, max(4, w // 14)) * .9 * t
        out[k] = v
    return out

def tone(x, expo=0.):
    x = np.maximum(x, 0) * 2 ** expo
    a, b, c, d, e = 2.51, .03, 2.43, .59, .14          # ACES fit: deeper blacks, a filmic shoulder
    y = np.clip((x * (a * x + b)) / (x * (c * x + d) + e), 0, 1) ** (1 / 2.2)
    return (np.clip(y, 0, 1) * 255 + .5).astype(np.uint8)

def lum(x): return x[..., 0] * .2126 + x[..., 1] * .7152 + x[..., 2] * .0722

if __name__ == '__main__':
    src, od = sys.argv[1], sys.argv[2]; ww = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    os.makedirs(od, exist_ok=True)
    P = read(src)
    print({k: (v.shape, float(np.percentile(v, 99.5))) for k, v in P.items()})
    g = lambda k: P.get('Combined_' + k, np.zeros_like(next(iter(P.values()))))
    Z = 0
    # scroll 1: sodium. The lamps' light collapses to one yellow frequency, plus a deep wash from the slot
    sod = lum(g('lamps') + .25 * g('cove'))[..., None] * np.array([1.0, .62, .08]) * 1.6
    Image.fromarray(tone(sod + .05 * g('sky'), -.3)).save(os.path.join(od, 'mix1_sodium.jpg'), quality=90)
    # scroll 2: dark, the three anchors' colours in the haze
    Image.fromarray(tone(g('r') + g('g') + g('b') + .02 * g('lamps') + g('tag') * .3 + g('wait'), 0)).save(os.path.join(od, 'mix2_pulse.jpg'), quality=90)
    # scroll 3: full spectrum through the slot, coves, field, lamps, every tag
    Image.fromarray(tone(g('sky') + .7 * g('cove') + .6 * g('field') + .7 * g('lamps') + g('tag') + g('wait'), 0)).save(os.path.join(od, 'mix3_lit.jpg'), quality=90)
    if ww:
        meta = {}
        for k, v in P.items():
            if not k.startswith('Combined_'): continue
            name = k[9:]; hi = float(np.percentile(v, 99.7)) or 1.0; kk = 1 / hi
            enc = (np.clip(v * kk, 0, 1) ** (1 / 2.2) * 255 + .5).astype(np.uint8)
            im = Image.fromarray(enc)
            if ww < im.width: im = im.resize((ww, round(im.height * ww / im.width)), Image.LANCZOS)
            im.save(os.path.join(od, name + '.webp'), quality=88, method=6); meta[name] = 1 / kk
        json.dump(meta, open(os.path.join(od, 'layers.json'), 'w'), indent=1)
