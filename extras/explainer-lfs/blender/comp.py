# Read a layered render, denoise each light layer, and write check pictures of each state. usage: comp.py in.exr outprefix
import sys, os, json, numpy as np, OpenEXR, oidn, ctypes
from PIL import Image
def load(src):
    f = OpenEXR.File(src); P = {}
    for p in f.parts:
        n = p.header.get('name', '').replace('ViewLayer.', ''); ch = list(p.channels.values())
        a = ch[0].pixels if len(ch) == 1 else np.stack([c.pixels for c in ch], -1); P[n] = np.ascontiguousarray(a.astype(np.float32))
    alb = P['Denoising Albedo'][..., :3]; nrm = P['Denoising Normal'][..., :3]
    _L = ctypes.CDLL(os.path.join(os.path.dirname(oidn.__file__), 'lib.linux.x64/libOpenImageDenoise.so.' + oidn.oidn_version)); _L.oidnSetFilter1b.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_bool]
    dev = oidn.NewDevice(); oidn.CommitDevice(dev)
    def denoise(img):
        img = np.ascontiguousarray(img[..., :3]); res = np.zeros_like(img); flt = oidn.NewFilter(dev, 'RT'); h, w = img.shape[:2]
        for nm, im in (('color', img), ('albedo', np.ascontiguousarray(alb)), ('normal', np.ascontiguousarray(nrm)), ('output', res)): oidn.SetSharedFilterImage(flt, nm, im, oidn.FORMAT_FLOAT3, w, h)
        _L.oidnSetFilter1b(flt, b'hdr', True); oidn.CommitFilter(flt); oidn.ExecuteFilter(flt); oidn.ReleaseFilter(flt); return res
    G = {n[9:]: denoise(a) for n, a in P.items() if n.startswith('Combined_')}
    zf = src.replace('.exr', '_z.exr')
    if os.path.exists(zf):
        for p in OpenEXR.File(zf).parts:
            if 'Depth' in p.header.get('name', ''): P['Depth'] = np.ascontiguousarray(list(p.channels.values())[0].pixels.astype(np.float32))
    d = P['Depth']; d = d[..., 0] if d.ndim == 3 else d
    return G, d
def tm(x, ex=1.): x = x * ex; x = x * (1 + x / 16.) / (1 + x); return np.clip(x, 0, 1) ** (1 / 2.2)
def lum(x): return x @ np.array([.2126, .7152, .0722], np.float32)
def sodium(L):
    L = np.clip((L - .03) / .9, 0, 1) ** 1.35
    stops = np.array([0, .25, .6, .88, 1.]); cols = np.array([[0, 0, 0], [.27, .13, .012], [.78, .48, .06], [.98, .78, .26], [1., .95, .7]])
    return np.stack([np.interp(L, stops, cols[:, i]) for i in range(3)], -1)
if __name__ == '__main__':
    G, d = load(sys.argv[1]); out = sys.argv[2]; z = lambda k: G.get(k, 0)
    print({k: round(float(np.percentile(lum(v), 99)), 3) for k, v in G.items()}, 'depth', float(np.median(d)))
    S = {}
    ex = float(os.environ.get('EX', '2.2'))
    if 'lamps' in G: S['lamps'] = sodium(tm(lum(G['lamps']), ex))
    if 'isl' in G: S['isl'] = sodium(tm(lum(G['isl']), ex))
    S['found'] = np.clip(sodium(tm(lum(z('lamps')), ex * .06)) + tm(z('cone') + z('anc') * 2 + z('led') * np.array([.4, .65, 1.]) * 4, ex), 0, 1)
    S['seen'] = tm(z('slot') + z('pools') + z('cone') + z('amber') * np.array([1., .55, .12]) * 1.6, ex * .8)
    for k, v in S.items(): Image.fromarray((np.clip(v, 0, 1) * 255).astype(np.uint8)).save(f'{out}_{k}.jpg', quality=90)
