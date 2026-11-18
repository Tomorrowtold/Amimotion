# Pack the supervisor's held poses into one sheet of 8 x 4 cells (column = pose, row = heading), rendered at 512 px a cell (sprites3.py with CELL=512)
# so the close shots show the person at full sharpness.
# usage: python packposes.py <site assets dir>
import sys, numpy as np
from PIL import Image
import os
S = os.environ.get('SPR', '/home/user/x3d/out/spr3x'); OUT = sys.argv[1]; C = 512
LUTC = np.interp(np.arange(256) / 255., [0, .35, .745, 1], [0, .35, .8, 1])
for lay, c in (('L', 512), ('P', 256)):
    sh = Image.new('RGBA', (8 * c, 4 * c))
    for h in range(4):
        for p in range(7):
            a = np.asarray(Image.open(f'{S}/pose_{h}_{p}.png').convert('RGBA')).astype(np.float32)
            shm = (a[..., :3].sum(-1) < 45) & (a[..., 3] < 250)
            a[shm, 3] *= .42; a[shm, 0] = 22; a[shm, 1] = 32; a[shm, 2] = 62; a[~shm, :3] = LUTC[a[~shm, :3].astype(np.uint8)] * 255
            im = Image.fromarray(a.astype(np.uint8))
            if c != C: im = im.resize((c, c), Image.LANCZOS)
            sh.paste(im, (p * c, h * c))
    sh.save(f'{OUT}/{lay}/poses.webp', 'WEBP', quality=90, alpha_quality=90, method=6)
print('ok')
