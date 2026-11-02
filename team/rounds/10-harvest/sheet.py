"""Contact sheet per captured site: desktop scroll frames in a grid + phone frames. python3 sheet.py caps/<id> [out.jpg]"""
import sys, os, glob, json
from PIL import Image, ImageDraw

def sheet(d, out=None, tw=250):
    ds = sorted(glob.glob(os.path.join(d, 'd*.jpg')), key=lambda p: int(os.path.basename(p)[1:-4]))
    ms = sorted(glob.glob(os.path.join(d, 'm*.jpg')), key=lambda p: int(os.path.basename(p)[1:-4]))
    th = int(tw * 900 / 1440)
    cols = 6
    rows = (len(ds) + cols - 1) // cols
    mw = int(th * 390 / 844) if ms else 0
    mh = th
    W = cols * tw + 10 * (cols + 1)
    H = rows * (th + 10) + 10 + (mh + 20 if ms else 0)
    S = Image.new('RGB', (W, H), (40, 40, 40))
    dr = ImageDraw.Draw(S)
    for k, p in enumerate(ds):
        try:
            im = Image.open(p).convert('RGB').resize((tw, th))
        except Exception:
            continue
        x, y = 10 + (k % cols) * (tw + 10), 10 + (k // cols) * (th + 10)
        S.paste(im, (x, y)); dr.text((x + 4, y + 4), os.path.basename(p), fill=(255, 0, 0))
    y0 = rows * (th + 10) + 20
    for k, p in enumerate(ms):
        try:
            im = Image.open(p).convert('RGB').resize((mw, mh))
        except Exception:
            continue
        S.paste(im, (10 + k * (mw + 10), y0))
    out = out or os.path.join(d, 'sheet.jpg')
    S.save(out, quality=70)
    return out

if __name__ == '__main__':
    print(sheet(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
