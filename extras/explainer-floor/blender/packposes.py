# Pack the supervisor's held poses into one sheet, laid out like sprites.webp (8 x 8 cells): column = pose, row = heading.
# usage: python packposes.py <site assets dir>
import sys, numpy as np
from PIL import Image
S = '/home/user/x3d/out/spr3'; OUT = sys.argv[1]; C = 384
LUTC = np.interp(np.arange(256) / 255., [0, .35, .745, 1], [0, .35, .8, 1])
for lay, c in (('L', 384), ('P', 192)):
    sh = Image.new('RGBA', (8 * c, 8 * c))
    for h in range(4):
        for p in range(7):
            a = np.asarray(Image.open(f'{S}/pose_{h}_{p}.png').convert('RGBA')).astype(np.float32)
            shm = (a[..., :3].sum(-1) < 45) & (a[..., 3] < 250)
            a[shm, 3] *= .42; a[shm, 0] = 22; a[shm, 1] = 32; a[shm, 2] = 62; a[~shm, :3] = LUTC[a[~shm, :3].astype(np.uint8)] * 255
            im = Image.fromarray(a.astype(np.uint8))
            if c != C: im = im.resize((c, c), Image.LANCZOS)
            sh.paste(im, (p * c, h * c))
    sh.save(f'{OUT}/{lay}/poses.webp', 'WEBP', quality=78, alpha_quality=80, method=6)
print('ok')
