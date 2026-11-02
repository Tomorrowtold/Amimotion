"""S1c handover stills: the exact top-down frame of the plant film (t = 7.5 s) at full resolution for each cut, and a
clean plate of the same frame with the three people patched out (floor copied from the same rows beside them).
Run from the repo root: python3 team/rounds/23-handover/make_stills.py"""
import subprocess, tempfile, pathlib
import numpy as np
from PIL import Image, ImageFilter

FILM = pathlib.Path('site/src/assets/home/hero-film')
T = 7.5
# people in master (1920x1072) coordinates: x0, x1, y0, y1, dx (where to copy clear floor from, same rows)
PEOPLE = [(1050, 1098, 532, 610, 104), (1252, 1334, 544, 600, 112), (832, 892, 709, 770, -104)]
CUTS = {'4x5': (0.0, 1.0), '1x1': (531.2, 1080 / 1072)}   # x offset of the cut in the master, scale

def frame(cut):
    with tempfile.TemporaryDirectory() as d:
        p = pathlib.Path(d) / 'f.png'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(T), '-i', str(FILM / f'plant-{cut}-h264.mp4'),
                        '-frames:v', '1', str(p)], check=True)
        return Image.open(p).convert('RGB')

for cut, (ox, s) in CUTS.items():
    im = frame(cut)
    a = np.asarray(im).astype(np.float32)
    out = a.copy()
    H, W = a.shape[:2]
    for x0, x1, y0, y1, dx in PEOPLE:
        X0, X1 = int((x0 - ox) * s), int((x1 - ox) * s)
        Y0, Y1, DX = int(y0 * s), int(y1 * s), int(dx * s)
        if X1 < 0 or X0 > W: continue
        m = Image.new('L', (W, H), 0)
        m.paste(255, (X0, Y0, X1, Y1))
        m = np.asarray(m.filter(ImageFilter.GaussianBlur(5))).astype(np.float32)[..., None] / 255
        src = np.roll(a, -DX, axis=1)
        out = out * (1 - m) + src * m
    clean = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    for name, img in ((f'plant-topdown-{cut}', im), (f'plant-topdown-clean-{cut}', clean)):
        img.save(FILM / f'{name}.avif', quality=62, speed=4)
        img.save(FILM / f'{name}.webp', quality=80, method=6)
        print(name, img.size, (FILM / f'{name}.avif').stat().st_size, (FILM / f'{name}.webp').stat().st_size)
