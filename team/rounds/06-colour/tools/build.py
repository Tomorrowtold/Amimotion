"""Build one hero frame per palette: retint the AmIGo page still and a film still, then write frames/<id>.html.
    python3 tools/build.py palettes/r1.json [suffix]
Inputs are read only: ../02-design/frame/hero.html, ../02-design/frame/img/amigo-page-2400.webp (paper #f5f5f2,
transparent where it is the page) and ../03-hero-film/contact-sheet.jpg (frame 1: the 'after' state)."""
import sys, json, re, os
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__)); from colour import hx
P = json.load(open(sys.argv[1])); suf = sys.argv[2] if len(sys.argv) > 2 else ''
HERO = open('../02-design/frame/hero.html').read()
OLD_G = np.array([0xf5, 0xf5, 0xf2], np.float32)
def rgb(h): return np.array([v * 255 for v in hx(h)], np.float32)

# --- 1. hardware still: per-channel white balance so its paper is the new ground. Alpha is kept, so the page
#        shows through wherever the still is the page; the tag (darkest object) moves by at most 2-3 levels.
src = np.asarray(Image.open('../02-design/frame/img/amigo-page-2400.webp').convert('RGBA')).astype(np.float32)
def retint_hero(ground):
    # a white balance in linear light, as if the sweep had been lit by the new ground: the paper lands exactly on
    # the ground token and the contact shadow takes the same tint (a shadow on sky paper is a sky-grey). Weighted by
    # a smoothstep on linear lightness so the tag's own dark grey (linear Y < 0.12) stays neutral: no blue cast.
    def L(x): x = x / 255; return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)
    def E(x): x = np.clip(x, 0, 1); return 255 * np.where(x <= 0.0031308, 12.92 * x, 1.055 * x ** (1 / 2.4) - 0.055)
    lin = L(src[..., :3]); Yl = lin @ np.array([0.2126, 0.7152, 0.0722])
    t = np.clip((Yl - 0.12) / (0.5 - 0.12), 0, 1); w = (t * t * (3 - 2 * t))[..., None]
    gain = L(rgb(ground)) / L(OLD_G)
    o = src.copy(); o[..., :3] = E(lin * (1 + (gain - 1) * w))
    return Image.fromarray(o.round().astype(np.uint8), 'RGBA')

# --- 2. film still: neutral tones through per-channel curves (shadow, machines, floor of the old grade to the new
#        hall tones); located trails and waiting pads re-coloured to the palette's state colours by chroma mask.
sheet = np.asarray(Image.open('../03-hero-film/contact-sheet.jpg').convert('RGB')).astype(np.float32)[12:510, 12:410]
OLD = {'shadow': [0xc4, 0xc4, 0xbc], 'machines': [0xe4, 0xe4, 0xe0], 'floor': [0xf5, 0xf6, 0xf1]}
r, g, b = sheet[..., 0], sheet[..., 1], sheet[..., 2]
BLUE_REF = np.percentile((b - r)[(b - r) > 40], 90); AMB_REF = np.percentile((r - b)[(r - b) > 60], 90)
tb = np.clip((b - r - 12) / (BLUE_REF - 12), 0, 1)[..., None]; ta = np.clip((r - b - 14) / (AMB_REF - 14), 0, 1)[..., None]
Y = sheet @ np.array([0.2126, 0.7152, 0.0722], np.float32)
amb_core = (r - b) > AMB_REF * 0.9; Y_AMB = np.median(Y[amb_core])
blue_core = (b - r) > BLUE_REF * 0.9; Y_BLUE = np.median(Y[blue_core])
grey = np.repeat(Y[..., None], 3, -1)  # neutral version of every pixel
def retint_film(hall, located, waiting):
    out = np.zeros_like(sheet)
    for c in range(3):
        xs = [0, OLD['shadow'][c], OLD['machines'][c], OLD['floor'][c], 255]
        ys = [0, rgb(hall['shadow'])[c], rgb(hall['machines'])[c], rgb(hall['floor'])[c], min(255, rgb(hall['floor'])[c] + (255 - OLD['floor'][c]))]
        out[..., c] = np.interp(sheet[..., c], xs, ys)
    neutral = np.stack([np.interp(grey[..., c], [0, OLD['shadow'][c], OLD['machines'][c], OLD['floor'][c], 255],
                                  [0, rgb(hall['shadow'])[c], rgb(hall['machines'])[c], rgb(hall['floor'])[c], 255]) for c in range(3)], -1)
    L = rgb(located) * np.clip(Y / Y_BLUE, 0.6, 1.15)[..., None]
    W = rgb(waiting) * np.clip(Y / Y_AMB, 0.6, 1.25)[..., None]
    out = out * (1 - tb - ta) + (neutral * (1 - tb) + L * tb) * tb + (neutral * (1 - ta) + W * ta) * ta
    return Image.fromarray(np.clip(out, 0, 255).round().astype(np.uint8))

SECTION = '''
  <section class="sample" aria-labelledby="map-title">
    <div class="sample-words">
      <h2 id="map-title">One live map.</h2>
      <p>Anchors on your columns hear each tag. The map shows where a trolley went and how long it has waited, so the walk to look for it becomes a glance. <a class="text-link" href="/platform/">See how a tag is heard</a>.</p>
      <ul class="legend" aria-label="Map key">
        <li><svg class="m-loc" viewBox="0 0 48 24" aria-hidden="true"><path d="M2 18 C 14 18, 18 6, 30 6 L 40 6" fill="none" style="stroke:var(--located)" stroke-width="3" stroke-linecap="round"/><circle cx="41" cy="6" r="5" style="fill:var(--located)"/></svg><span><strong>Located</strong> trolley T-14, bay 4</span></li>
        <li><svg class="m-wait" viewBox="0 0 48 24" aria-hidden="true"><rect x="12" y="2" width="24" height="20" rx="3" style="fill:var(--waiting);stroke:var(--waiting-edge)" stroke-width="1.5"/></svg><span><strong>Waiting</strong> 14 min at press 3</span></li>
      </ul>
      <a class="btn btn-section" href="/contact/">Book a call</a>
    </div>
    <figure class="sample-pic"><img src="../img/{i}-hall.webp" width="398" height="498" alt="The model hall from camera A: blue trails show where trolleys went, amber pads show the ones that wait."></figure>
  </section>'''
CSS = '''
/* ---------- Round 6 sample section: body text, link, button, located and waiting marks, film still ---------- */
.sample{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gutter);padding:var(--rhythm-m) var(--margin);background:var(--surface);align-items:center}
.sample-words{grid-column:1 / span 5}
.sample h2{font:600 var(--size-h2)/1.05 var(--font-display);letter-spacing:-0.02em;margin:0 0 var(--s-5)}
.sample p{color:var(--ink-soft);max-width:34em;margin:0 0 var(--s-6)}
.text-link{color:var(--link);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
.text-link:hover{text-decoration-thickness:2px}
.legend{list-style:none;margin:0 0 var(--s-6);padding:0;display:grid;gap:var(--s-3)}
.legend li{display:flex;align-items:center;gap:var(--s-3);font-size:var(--size-small);color:var(--ink-soft)}
.legend strong{color:var(--ink);font-weight:500;margin-right:.35em}
.legend svg{width:48px;height:24px;flex:none}
.btn-section{display:inline-flex;height:48px}
.sample-pic{grid-column:6 / -1;margin:0;background:var(--hall-floor)}
.sample-pic{display:flex;justify-content:flex-end;background:none}
.sample-pic img{height:min(72vh,640px);width:auto;aspect-ratio:398/498}
@media (max-width:1023px){.sample{display:block}.sample-pic{margin-top:var(--s-7)}.sample-pic img{height:auto;width:100%}}
'''
os.makedirs('frames', exist_ok=True); os.makedirs('img', exist_ok=True)
for p in P:
    t = p['tokens']; i = p['id'] + suf
    retint_hero(t['ground']).save(f'img/{i}-amigo-2400.webp', quality=82, method=6, use_sharp_yuv=True)
    retint_film(p['hall'], t['located'], t['waiting']).save(f'img/{i}-hall.webp', quality=88, method=6)
    raw = (f"--ground:{t['ground']}; --surface:{t['surface']}; --pressed:{t['pressed']};\n  --ink:{t['ink']}; --ink-soft:{t['ink-soft']}; "
           f"--ink-hover:{t['ink-hover']}; --on-ink:{t['on-ink']}; --hardware:{t['hardware']};\n  --link:{t['link']}; --focus:{t['focus']}; "
           f"--brand:{t['brand']}; --located:{t['located']}; --waiting:{t['waiting']}; --waiting-edge:{t.get('waiting-edge', t['waiting'])};\n  --hall-floor:{p['hall']['floor']};")
    h = HERO
    h = re.sub(r'/\* raw \*/.*?--waiting:var\(--amber-brand\);[^\n]*\n', '/* round 6 palette: ' + p['name'] + ' */\n  ' + raw + '\n', h, flags=re.S)
    h = h.replace('../fonts/', '../../02-design/fonts/')
    h = re.sub(r'<picture>.*?</picture>', f'<img src="../img/{i}-amigo-2400.webp" width="2400" height="1312" fetchpriority="high" alt="The AmIGo tag in dark grey, with amimotion debossed on its top cover and a screw ear at each end.">', h, flags=re.S)
    h = h.replace('</style>', CSS + '</style>').replace('  </section>\n</main>', '  </section>' + SECTION.replace('{i}', i) + '\n</main>')
    if p.get('section'):  # a band: the sample section carries its own token overrides (e.g. a deep indigo band)
        ov = ';'.join(f'--{k}:{v}' for k, v in p['section'].items())
        h = h.replace('</style>', '.sample{' + ov + ';color:var(--ink)}\n.sample .btn{background:var(--btn);color:var(--on-btn)}\n</style>')
    if p.get('section_bg'):
        h = h.replace('</style>', '.sample{background:var(--%s)}\n</style>' % p['section_bg'])
    if p.get('button'):  # a coloured button instead of the ink button
        h = h.replace('</style>', '.btn{background:%s;color:%s}.btn:hover{background:%s}\n</style>' % (p['button'][0], p['button'][1], p['button'][2]))
    open(f'frames/{i}.html', 'w').write(h)
    print('built', i)
