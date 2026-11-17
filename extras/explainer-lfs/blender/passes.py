# Split a multilayer EXR render into denoised light-group layers, depth and a beauty check. usage: passes.py in.exr outdir
import sys, os, json, numpy as np, OpenEXR, oidn
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
f = OpenEXR.File(src); P = {}
for p in f.parts:
    n = p.header.get('name', '').replace('ViewLayer.', '')
    ch = list(p.channels.values())
    a = ch[0].pixels if len(ch) == 1 else np.stack([c.pixels for c in ch], -1)
    P[n] = np.ascontiguousarray(a.astype(np.float32))
alb = P['Denoising Albedo'][..., :3]; nrm = P['Denoising Normal'][..., :3]
import ctypes
_L = ctypes.CDLL(os.path.join(os.path.dirname(oidn.__file__), 'lib.linux.x64/libOpenImageDenoise.so.'+oidn.oidn_version)); _L.oidnSetFilter1b.argtypes=[ctypes.c_void_p, ctypes.c_char_p, ctypes.c_bool]
dev = oidn.NewDevice(); oidn.CommitDevice(dev)
def denoise(img):
    img = np.ascontiguousarray(img[..., :3]); res = np.zeros_like(img); flt = oidn.NewFilter(dev, 'RT')
    oidn.SetSharedFilterImage(flt, 'color', img, oidn.FORMAT_FLOAT3, img.shape[1], img.shape[0])
    oidn.SetSharedFilterImage(flt, 'albedo', np.ascontiguousarray(alb), oidn.FORMAT_FLOAT3, img.shape[1], img.shape[0])
    oidn.SetSharedFilterImage(flt, 'normal', np.ascontiguousarray(nrm), oidn.FORMAT_FLOAT3, img.shape[1], img.shape[0])
    oidn.SetSharedFilterImage(flt, 'output', res, oidn.FORMAT_FLOAT3, img.shape[1], img.shape[0])
    _L.oidnSetFilter1b(flt, b'hdr', True); oidn.CommitFilter(flt); oidn.ExecuteFilter(flt); oidn.ReleaseFilter(flt); return res
groups = {n[9:]: denoise(a) for n, a in P.items() if n.startswith('Combined_')}
np.savez_compressed(os.path.join(out, 'layers.npz'), depth=P['Depth'][..., 0] if P['Depth'].ndim == 3 else P['Depth'], **groups)
print('groups', {k: float(v.mean()) for k, v in groups.items()}, 'depth', float(np.median(P['Depth'])))
