"""Give capital I short slab serifs so "AmIMotion" never reads "AmlMotion".
Mona Sans is OFL with Reserved Font Name "Mona Sans", so the modified copies are renamed "AmI Sans"."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.boundsPen import BoundsPen
SRC = [("fonts/MonaSans-Display-SemiBold-W112.woff2","AmI Sans Display","SemiBold"),
       ("fonts/MonaSans-Text-Regular.woff2","AmI Sans Text","Regular"),
       ("fonts/MonaSans-Text-Medium.woff2","AmI Sans Text","Medium")]
for path, fam, sub in SRC:
    f = TTFont(path); gs = f.getGlyphSet()
    bp = BoundsPen(gs); gs["I"].draw(bp); x0,y0,x1,y1 = bp.bounds
    stem = x1-x0; cap = y1
    bar = max(round(stem*0.6), 58)   # serif thickness tied to stem weight
    half = max(round(stem*0.7), 78)  # serif reach each side of the stem
    lx, rx = x0-half, x1+half
    adv, lsb = f["hmtx"]["I"]
    shift = max(0, 40-lx)           # keep a little side bearing
    pen = TTGlyphPen(gs)
    def rect(a,b,c,d):
        pen.moveTo((a+shift,b)); pen.lineTo((a+shift,d)); pen.lineTo((c+shift,d)); pen.lineTo((c+shift,b)); pen.closePath()
    rect(x0,0,x1,cap)               # stem
    rect(lx,0,rx,bar)               # foot
    rect(lx,cap-bar,rx,cap)         # head
    g = pen.glyph(); f["glyf"]["I"] = g
    newadv = rx+shift+40
    f["hmtx"]["I"] = (int(newadv), int(lx+shift))
    if "kern" in f: pass
    name = f["name"]
    ps = (fam+"-"+sub).replace(" ","")
    for rec in list(name.names):
        if rec.nameID in (1,16): rec.string = fam
        elif rec.nameID in (4,): rec.string = f"{fam} {sub}"
        elif rec.nameID in (6,): rec.string = ps
        elif rec.nameID == 3: rec.string = ps+";modified"
    out = "fonts/"+ps+".woff2"; f.flavor="woff2"; f.save(out); print(out, "I adv", adv, "->", newadv)
