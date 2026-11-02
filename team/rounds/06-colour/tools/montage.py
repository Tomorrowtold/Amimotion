"""Montage shots: python3 tools/montage.py out.png cols label1=path1 label2=path2 ... (labels drawn under each)."""
import sys
from PIL import Image, ImageDraw, ImageFont
out, cols = sys.argv[1], int(sys.argv[2]); items = [a.split('=', 1) for a in sys.argv[3:]]
ims = [Image.open(p).convert('RGB') for _, p in items]; w = max(i.width for i in ims); h = max(i.height for i in ims)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(18, w // 40))
except Exception: font = ImageFont.load_default()
pad, lab = max(16, w // 60), max(44, w // 18); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + pad) + pad, rows * (h + lab + pad) + pad), '#d7d9de'); d = ImageDraw.Draw(sheet)
for k, ((name, _), im) in enumerate(zip(items, ims)):
    x = pad + (k % cols) * (w + pad); y = pad + (k // cols) * (h + lab + pad)
    sheet.paste(im, (x, y)); d.text((x, y + h + lab // 4), name, fill='#111318', font=font)
sheet.save(out); print(out, sheet.size)
