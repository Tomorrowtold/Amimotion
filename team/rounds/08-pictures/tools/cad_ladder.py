"""Page-grade a CAD studio render onto the Sky Ground page and cut its AVIF + WebP ladder.
    python3 cad_ladder.py <render.png> <out_dir> <name> <w1,w2,...>
1. render_hardware.py --page to the old neutral ground #f5f5f2 (flat-field; no blue cast on the tag),
2. the weighted retint #f5f5f2 -> #f0f6ff (as retint_stills.py / 06-colour build.py),
3. hero_images.py --ground '#f0f6ff' (feathered edge, alpha where it equals the page)."""
import sys, os, subprocess, tempfile
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(HERE, '../../')
src, out, name, widths = sys.argv[1:5]
tmp = tempfile.mkdtemp()
p1, p2 = os.path.join(tmp, 'page.png'), os.path.join(tmp, 'sky.png')
subprocess.run(['python3', os.path.join(R, '02-design/renders/render_hardware.py'), '--page', src, p1, '#f5f5f2'], check=True)
L = lambda x: np.where(x / 255 <= 0.04045, x / 255 / 12.92, ((x / 255 + 0.055) / 1.055) ** 2.4)
E = lambda x: 255 * np.where(np.clip(x, 0, 1) <= 0.0031308, 12.92 * np.clip(x, 0, 1), 1.055 * np.clip(x, 0, 1) ** (1 / 2.4) - 0.055)
a = np.asarray(Image.open(p1).convert('RGB')).astype(np.float64)
lin = L(a); Yl = lin @ np.array([0.2126, 0.7152, 0.0722])
t = np.clip((Yl - 0.12) / 0.38, 0, 1); w = (t * t * (3 - 2 * t))[..., None]
gain = L(np.array([0xf0, 0xf6, 0xff], float)) / L(np.array([0xf5, 0xf5, 0xf2], float))
Image.fromarray(E(lin * (1 + (gain - 1) * w)).round().astype(np.uint8)).save(p2)
im = Image.open(p2)
subprocess.run(['python3', os.path.join(R, '02-design/tools/hero_images.py'), p2, out, name, f'0,0,{im.width},{im.height}', widths, '--ground', '#f0f6ff'], check=True)
