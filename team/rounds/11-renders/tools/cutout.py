"""Studio site cut-outs: finish the transparent renders of render_hardware.py cutout.
    python3 cutout.py <work_dir> <out_dir> <name ...>
<name>.png: the product alone, straight alpha (Blender writes it unpremultiplied), 16-bit -> 8-bit with a light
dither. <name>-shadow.png: the contact shadow alone, same canvas: from the shadow-catcher render (product plus
shadow in alpha, half size) minus the product's own alpha, upsampled, in neutral black. Lay it under the product
PNG at the same box; its opacity can be lowered on a darker band."""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
wd, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
os.makedirs(out, exist_ok=True)
def load(p):
    im = Image.open(p); a = np.asarray(im).astype(np.float32)
    return a / (65535.0 if a.max() > 255 else 255.0)
rng = np.random.default_rng(5)
for n in names:
    a = load(os.path.join(wd, n + '.png'))
    if a.shape[2] == 3: raise SystemExit(n + ': no alpha')
    rgb, al = a[..., :3], a[..., 3]
    o = np.dstack([rgb, al]) * 255 + rng.random(a.shape, dtype=np.float32) - 0.5
    Image.fromarray(o.round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(out, n + '.png'), optimize=True)
    sc = os.path.join(wd, n + '_shadowcatch.png')
    if os.path.exists(sc):
        s = load(sc); h, w = al.shape
        sa = np.asarray(Image.fromarray(s[..., 3]).resize((w, h), Image.BICUBIC)).astype(np.float32)
        # the catcher's alpha includes the product; take the product out (dilated a touch so no rim is left)
        pa = np.clip(ndi.maximum_filter(al, size=3), 0, 1)
        sh = np.clip((sa - pa) / np.maximum(1 - pa, 1e-3), 0, 1) * (1 - pa)
        sh = ndi.gaussian_filter(sh, 1.0)
        sh = np.where(sh < 0.01, 0, sh)
        o = np.zeros((h, w, 4), np.float32); o[..., 3] = sh * 255 + rng.random((h, w), dtype=np.float32) * (sh > 0)
        Image.fromarray(o.round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(out, n + '-shadow.png'), optimize=True)
    print(n, 'done')
