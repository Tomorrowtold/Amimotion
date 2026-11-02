"""Sample the real palette of each reference capture: dominant colours by pixel share (quantised), plus the
most chromatic accent. Writes research/ref-palettes.json and research/refs-board.png (gitignored)."""
import sys, json, glob, os, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
out = {}
files = sorted(glob.glob('research/refs/*.png'))
for f in files:
    n = os.path.basename(f)[:-4]
    a = np.asarray(Image.open(f).convert('RGB').resize((360, 225), Image.BILINEAR)).reshape(-1, 3)
    q = (a // 8) * 8 + 4
    keys, cnt = np.unique(q, axis=0, return_counts=True)
    order = np.argsort(-cnt)
    dom = [('#%02x%02x%02x' % tuple(keys[i]), round(100 * cnt[i] / len(q), 1)) for i in order[:6]]
    # accent: most saturated colour with at least 0.3% share
    best = None
    for i in order[:200]:
        if cnt[i] / len(q) < 0.003: break
        r, g, b = keys[i] / 255; h, l, s = colorsys.rgb_to_hls(r, g, b)
        sat = s * (1 - abs(2 * l - 1))
        if best is None or sat > best[0]: best = (sat, '#%02x%02x%02x' % tuple(keys[i]))
    mean_l = float(np.mean(a @ [0.2126, 0.7152, 0.0722]) / 255)
    out[n] = {'dominant': dom, 'accent': best[1] if best and best[0] > 0.25 else None, 'mean_luma': round(mean_l, 2)}
    print(f"{n:11} luma {mean_l:.2f}  " + '  '.join(f"{h} {p}%" for h, p in dom[:4]) + f"  accent {out[n]['accent']}")
json.dump(out, open('research/ref-palettes.json', 'w'), indent=1)
# board
W, H = 480, 300; cols = 4; rows = (len(files) + cols - 1) // cols
board = Image.new('RGB', (cols * W, rows * (H + 50)), 'white'); d = ImageDraw.Draw(board)
for k, f in enumerate(files):
    n = os.path.basename(f)[:-4]; x, y = (k % cols) * W, (k // cols) * (H + 50)
    board.paste(Image.open(f).convert('RGB').resize((W, H)), (x, y))
    sw = [h for h, _ in out[n]['dominant'][:4]] + ([out[n]['accent']] if out[n]['accent'] else [])
    for j, h in enumerate(sw): d.rectangle([x + 4 + j * 40, y + H + 6, x + 40 + j * 40, y + H + 30], fill=h, outline='#888')
    d.text((x + 220, y + H + 12), n, fill='black')
board.save('research/refs-board.png')
