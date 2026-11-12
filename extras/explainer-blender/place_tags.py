"""Place the real AmIGo (CAD render) over the AI-made placeholder tags in a photo.
usage: python3 place_tags.py photo.png sprite.png out.png"""
import sys
from PIL import Image, ImageFilter, ImageEnhance
photo, sprite_p, out = sys.argv[1:4]
im = Image.open(photo).convert('RGBA')
sp = Image.open(sprite_p).convert('RGBA')
# relight: CAD render was lit from below after the 180 deg turn; lay a top-light gradient
g = Image.linear_gradient('L').resize(sp.size)          # 0 top -> 255 bottom
shade = Image.new('RGBA', sp.size, (0, 0, 0, 0))
shade.putalpha(g.point(lambda v: int(v * .45)))
sp = Image.alpha_composite(sp, Image.composite(shade, Image.new('RGBA', sp.size, (0,0,0,0)), sp.split()[3]))
# (centre x, centre y, width px, brightness)
spots = [(455,993,38,.95),(746,1017,40,1.0),(992,998,40,1.0),(1378,1017,40,.9),
         (2007,1070,42,1.0),(2502,1198,44,1.05),
         (668,888,20,.85),(1537,888,20,.85),(2129,888,20,.85)]   # crew badges, left chest
# trolley: the AI hung its tag below the rail; patch that spot from rail to its left, tag goes on the crate
src = im.crop((395, 1022, 431, 1058)); im.paste(src, (452, 1022))
for x, y, w, b in spots:
    h = round(w * sp.height / sp.width)
    s = sp.resize((w, h), Image.LANCZOS)
    s = ImageEnhance.Brightness(s).enhance(b)
    a = s.split()[3]
    sh = Image.new('RGBA', (w + 12, h + 12), (0, 0, 0, 0))
    sh.paste((0, 0, 0, 150), (6, 8), a)
    sh = sh.filter(ImageFilter.GaussianBlur(2.5))
    im.alpha_composite(sh, (x - w // 2 - 6, y - h // 2 - 6))
    im.alpha_composite(s, (x - w // 2, y - h // 2))
im.convert('RGB').save(out)
