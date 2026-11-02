"""R5: write the stopped trolley's trail (hall_r11.py trail output, picture pixels) as an SVG path for the S2 stage.
    python3 trail_svg.py <trail.json> <out.svg> [--blue #1f6bff]
viewBox is the still's own pixel size, so the SVG laid over the picture with the same box lines up exactly.
The path runs in travel order (start of the 7 m trail to where the trolley stopped), so a stroke-dashoffset from
the path length to 0 draws it the way the trolley went. pathLength="1" lets CSS use 0..1 for the draw."""
import sys, json, math
d = json.load(open(sys.argv[1])); out = sys.argv[2]
blue = sys.argv[sys.argv.index('--blue') + 1] if '--blue' in sys.argv else '#1f6bff'
W, H = d['res']; pts = d['points']
# split into the runs the camera sees (hall_r11.py marks each point), then drop points closer than 1.5 px
vis = d.get('visible', [True] * len(pts))
runs, cur = [], []
for p, v in zip(pts, vis):
    if v: cur.append(p)
    elif cur: runs.append(cur); cur = []
if cur: runs.append(cur)
def simp(r):
    k = [r[0]]
    for p in r[1:-1]:
        if math.dist(p, k[-1]) >= 1.5: k.append(p)
    return k + [r[-1]] if len(r) > 1 else k
runs = [simp(r) for r in runs if len(r) > 1]
keep = [p for r in runs for p in r]
path = ' '.join('M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in r) for r in runs)
w = round((d['width_start'] + d['width_end']) / 2, 1)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" aria-hidden="true">'
       f'<path d="{path}" pathLength="1" fill="none" stroke="{blue}" stroke-width="{w}" stroke-linecap="round" '
       f'stroke-linejoin="round" vector-effect="none"/></svg>\n')
open(out, 'w').write(svg)
print(out, len(keep), 'points, stroke', w, 'px (ribbon width at the start / end:', round(d['width_start'], 1), '/', round(d['width_end'], 1), ')')
