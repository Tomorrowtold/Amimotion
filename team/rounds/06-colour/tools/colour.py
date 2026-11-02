"""Colour maths for round 6: WCAG 2.2 ratio, APCA Lc (0.0.98G-4g), OKLCH, and colour-vision simulation
(Machado, Oliveira & Fernandes 2009, severity 1.0, applied in linear sRGB). Import or run on palettes.json."""
import math, json, sys
def hx(h): h = h.lstrip('#'); return [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
def tohex(c): return '#' + ''.join('%02x' % round(max(0, min(1, v)) * 255) for v in c)
def lin(c): return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def gam(c): c = max(0, min(1, c)); return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
def lum(h): r, g, b = [lin(c) for c in hx(h)]; return 0.2126 * r + 0.7152 * g + 0.0722 * b
def cr(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)
def oklab_lin(rgb):
    r, g, b = rgb
    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b; m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b; s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
    l, m, s = [math.copysign(abs(x) ** (1/3), x) for x in (l, m, s)]
    return (0.2104542553*l + 0.7936177850*m - 0.0040720468*s, 1.9779984951*l - 2.4285922050*m + 0.4505937099*s, 0.0259040371*l + 0.7827717662*m - 0.8086757660*s)
def oklab(h): return oklab_lin([lin(c) for c in hx(h)])
def oklch(h):
    L, a, b = oklab(h); return (L * 100, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360)
def oklch_s(h): L, C, H = oklch(h); return f"{L:.1f}% {C:.3f} {H:.0f}"
def apca(txt, bg):
    def Y(h):
        r, g, b = [c ** 2.4 for c in hx(h)]; y = 0.2126729*r + 0.7151522*g + 0.0721750*b
        return y if y > 0.022 else y + (0.022 - y) ** 1.414
    Yt, Yb = Y(txt), Y(bg)
    if Yb > Yt: S = (Yb ** 0.56 - Yt ** 0.57) * 1.14; return round((S - 0.027) * 100, 1) if S >= 0.1 else 0
    S = (Yb ** 0.65 - Yt ** 0.62) * 1.14; return round((S + 0.027) * 100, 1) if S <= -0.1 else 0
CVD = {'protan': [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
       'deutan': [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
       'tritan': [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]}
def sim(h, kind):
    v = [lin(c) for c in hx(h)]; M = CVD[kind]
    return tohex([gam(sum(M[i][j] * v[j] for j in range(3))) for i in range(3)])
def dE(a, b): A, B = oklab(a), oklab(b); return 100 * math.dist(A, B)
def check(p):
    """Return rows of (pair, wcag, apca, need, ok) and the colour-vision table for one palette dict."""
    t = p['tokens']; rows = []
    def pair(fg, bg, need, label=None):
        r = cr(t[fg], t[bg]); rows.append((label or f'{fg} on {bg}', round(r, 2), apca(t[fg], t[bg]), need, r >= need))
    pair('ink', 'ground', 4.5); pair('ink', 'surface', 4.5); pair('ink-soft', 'ground', 4.5); pair('ink-soft', 'surface', 4.5)
    pair('link', 'ground', 4.5); pair('link', 'surface', 4.5); pair('on-ink', 'ink', 4.5, 'button text on button')
    pair('focus', 'ground', 3.0, 'focus ring on ground'); pair('located', 'ground', 0, 'located mark on ground (fill only)')
    pair('waiting', 'ground', 0, 'waiting mark on ground (fill only)'); pair('ink', 'located', 4.5, 'ink label on located fill')
    pair('ink', 'waiting', 4.5, 'ink label on waiting fill')
    t.setdefault('white', '#ffffff'); pair('white', 'located', 4.5, 'white label on located fill')
    pair('located', 'ground', 3.0, 'located vs ground, WCAG 1.4.11'); pair('waiting-edge' if 'waiting-edge' in t else 'waiting', 'ground', 3.0, 'waiting edge vs ground, 1.4.11')
    if 'btn' in t: pair('on-btn', 'btn', 4.5, 'button text on coloured button'); pair('btn', 'ground', 3.0, 'button vs ground, 1.4.11'); pair('hardware', 'ground', 3.0, 'hardware on ground')
    cv = []
    for kind in ('normal', 'deutan', 'protan', 'tritan'):
        a = t['located'] if kind == 'normal' else sim(t['located'], kind); b = t['waiting'] if kind == 'normal' else sim(t['waiting'], kind)
        cv.append((kind, a, b, round(dE(a, b), 1), round(abs(oklch(a)[0] - oklch(b)[0]), 1)))
    return rows, cv
if __name__ == '__main__':
    P = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'palettes/palettes.json'))
    for p in P:
        rows, cv = check(p); print('\n==', p['name'])
        for k in ('ground', 'surface', 'ink', 'ink-soft', 'link', 'located', 'waiting'): print(f"  {k:9} {p['tokens'][k]}  oklch({oklch_s(p['tokens'][k])})")
        for r in rows: print(f"  {r[0]:38} {r[1]:6}:1  Lc {r[2]:6}  {'ok' if r[4] else 'FAIL'}")
        for c in cv: print(f"  {c[0]:7} located {c[1]} waiting {c[2]}  dE_ok {c[3]}  dL {c[4]}")
