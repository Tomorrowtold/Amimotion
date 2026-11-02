"""Builds picks.md and board.html from picks_data.py. Run from this folder: python3 make_docs.py
board.png is shot from board.html by shoot_board.js."""
import os, io, base64, collections
from PIL import Image
import picks_data as D

HERE = os.path.dirname(os.path.abspath(__file__))
roles = []
for grp in ['breakers/01-hero-strike', 'breakers/02-realism-lab', 'breakers/03-structure', 'breakers/04-engine-room',
            'breakers/05-page-patrol', 'leads']:
    pass
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
order = []
for d in ['breakers/01-hero-strike', 'breakers/02-realism-lab', 'breakers/03-structure', 'breakers/04-engine-room', 'breakers/05-page-patrol']:
    order += [os.path.join(d, f) for f in sorted(os.listdir(os.path.join(ROOT, d))) if f.endswith('.md')]
order += [os.path.join('leads', f) for f in sorted(os.listdir(os.path.join(ROOT, 'leads'))) if f.endswith('.md')]
for d in sorted(os.listdir(os.path.join(ROOT, 'specialists'))):
    order += [os.path.join('specialists', d, f) for f in sorted(os.listdir(os.path.join(ROOT, 'specialists', d))) if f.endswith('.md')]
for p in order:
    with open(os.path.join(ROOT, p)) as fh:
        title = fh.readline().lstrip('# ').strip()
    unit = p.split('/')[1] if p.startswith(('breakers', 'specialists')) else 'leads'
    roles.append((title, unit.split('-', 1)[-1].replace('-', ' ') if unit != 'leads' else 'leads'))
assert len(roles) == len(D.P) == 150, (len(roles), len(D.P))

def cell(s):
    return s.replace('|', '\\|').replace('\n', ' ')

out = ['# Round 10, harvest: 150 picks', '',
       '2 Nov 2026. Each of the 150 team members visited the reference sites live and picked one pattern for amimotion.com. '
       'Captures (1440×900 desktop scroll frames d0…dN, 390×844 phone frames m0…m3) are in `caps/<site>/`, gitignored. '
       '"Frame" points at the capture that shows the pattern. "Merge" is the pattern id used in `plan.md`. '
       'We adapt the pattern into our own design; no images, code or wording is taken.', '',
       '| # | Role (unit) | Reference + URL | Frame | Merge | The element: what it does, timing, sizes | Why it beats what we have | Where it goes on our site | How we build it (technique, asset) | Cost to speed |',
       '|---|---|---|---|---|---|---|---|---|---|']
for i, ((title, unit), (site, frame, m, el, why, where, how, cost)) in enumerate(zip(roles, D.P), 1):
    name, url, cap = D.SITES[site]
    out.append(f'| {i} | {cell(title)} ({unit}) | [{name}]({url}) | `{cap}/{frame}` | {m} | {cell(el)} | {cell(why)} | {cell(where)} | {cell(how)} | {cell(cost)} |')
out += ['', '## Merged', '', '| Merge | Pattern | Picks | References |', '|---|---|---|---|']
cnt = collections.defaultdict(list)
for (site, frame, m, *_ ) in D.P:
    cnt[m].append(D.SITES[site][0])
for m in sorted(D.MERGE):
    refs = collections.Counter(cnt[m]).most_common()
    out.append(f'| {m} | {D.MERGE[m]} | {len(cnt[m])} | ' + ', '.join(f'{r} ×{n}' if n > 1 else r for r, n in refs) + ' |')
open(os.path.join(HERE, 'picks.md'), 'w').write('\n'.join(out) + '\n')

# ---------------- board ----------------
TOP = [
 ('airpods', 'd0', 'M01', 'AmIGo turns on scroll in a sticky stage; H1 stays the LCP, frames load after it.', 'Home S1', 7),
 ('airtag', 'd8', 'M06', 'The finding moment: the trolley\'s trail draws as you scroll and the frame closes on it.', 'Home S2', 5),
 ('waymo', 'd1', 'M02', 'One giant number. Ours: ±10 cm at 22vw with its condition line beside it.', 'Home S1b', 6),
 ('rivian', 'd1', 'M03', 'Giant product name behind the product on one studio sweep.', 'Home S5, product pages', 6),
 ('helion', 'd3', 'M04', 'Pinned explainer in 4 steps: pulse, arrivals, solve, dot. No rings, no glow.', 'Home S2b, /technology/', 4),
 ('vention', 'd1', 'M08', 'Factory model with zone tabs. Ours: question chips light the hall.', 'Home S4, /diagnostic/', 4),
 ('vision', 'd7', 'M05', 'Full-bleed film with a two-line title and a pause button.', 'Hall film after S1', 5),
 ('spacex', 'd2', 'M05', 'Full-bleed panels that pin and the next slides over: hard cuts, no fades.', 'Home S2 to S4 rhythm', 5),
 ('augury', 'd1', 'M07', 'Before and after on one frame. Ours: scan vs tag on the same hall still.', 'Home S2', 3),
 ('zipline', 'd3', 'M11', '150 px headline that builds word by word with a photo slug in the line.', 'Home S1 H1, S3', 5),
 ('vision', 'd1', 'M12', 'Large centred paragraph greying in to ink as you read.', 'Home S1 lede', 2),
 ('airpods', 'd4', 'M09', 'Closer look: pick a feature, the product turns to it.', 'AmIGo and AmIMo pages', 6),
 ('anduril', 'd2', 'M03', 'Mosaic of the family, one big tile and small ones, one grade.', 'Home S5', 4),
 ('onex', 'd0', 'M03', 'The family standing together at true scale.', 'Home S5 stage', 1),
 ('lumafield', 'd2', 'M02', 'Row of four numbers. Ours: ±10 cm · 0.1–10 Hz · 1–3 yr · ~50 m.', 'Home after S5', 1),
 ('verkada', 'd3', 'M09', 'Chip tabs swap picture and text in one panel.', 'Home S5 copy', 3),
 ('waymo', 'd5', 'M10', 'One full-bleed brand-colour band. Ours: action #4b3df0 closing band.', 'Home S7', 1),
 ('airtag', 'd0', 'M01', 'First screen: two-line headline over one product macro, nothing else.', 'Home S1 first paint', 4),
 ('formlabs', 'd0', 'M20', 'The offer is the headline beside the product.', 'Home S6, /pilot/', 3),
 ('mercury', 'd0', 'M20', 'Inline field + button in the hero. Ours: first diagnostic answer on the homepage.', 'Home S6', 3),
 ('oxide', 'd2', 'M16', 'Hairline grid frames the content; tabular numerals.', 'Global, /specs/', 2),
 ('linear', 'd3', 'M16', 'Two-column section header: title left, short paragraph right.', 'Home S3–S5', 2),
 ('iphone', 'd0', 'M21', 'Lineup row and a slim nav; one product per URL.', '/products/ (missing today)', 7),
 ('gps', 'd5', 'M23', 'Interactive figures you drag; meaningful as stills.', '/technology/', 5),
 ('te', 'd0', 'M17', 'One spotlight, one move. Everything else still.', 'Motion rule', 2),
 ('hadrian', 'd0', 'M16', 'The factory drawn in hairlines in one ink colour.', '/technology/ header', 1),
 ('bd', 'd5', 'M19', 'Solutions by job with a picture each.', 'Home S7 jobs grid', 1),
 ('waymo', 'd8', 'M18', 'Big numbers carry their conditions in the same block.', 'Every number', 4),
 ('stripe', 'd0', 'M14', 'Buttons with a chevron that nudges 3 px and press feedback.', 'Global buttons', 3),
 ('airpods', 'd6', 'M10', 'Bands alternate tone, never gradient.', 'Home section rhythm', 3),
]

def thumb(cap, frame, w=640):
    p = os.path.join(HERE, 'caps', cap, frame + '.jpg')
    im = Image.open(p).convert('RGB')
    im = im.resize((w, int(w * im.height / im.width)))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=68)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

ours = ''.join(f'<img src="{thumb("ours-home", f, 360)}" alt="">' for f in ['d0', 'd2', 'd4', 'd6', 'd8'])
cards = []
for k, (site, frame, m, note, where, n) in enumerate(TOP, 1):
    name, url, cap = D.SITES[site]
    cards.append(f'''<figure><img src="{thumb(cap, frame)}" alt="{name}, capture {frame}">
<figcaption><span class="n">{k:02d}</span><b>{name}</b> <span class="m">{m} · {len(cnt[m])} pick{'s' if len(cnt[m]) > 1 else ''} merged</span><br>{note}<br><span class="w">Goes to: {where}</span></figcaption></figure>''')
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Harvest Board</title>
<style>
:root{{--ground:#f0f6ff;--surface:#fff;--ink:#0b1238;--soft:#3d4870;--action:#4b3df0;--line:rgba(11,18,56,.12)}}
@media (prefers-color-scheme:dark){{:root:not([data-theme=light]){{--ground:#0b1238;--surface:#121a4a;--ink:#f0f6ff;--soft:#b8c2e6;--action:#9d94ff;--line:rgba(240,246,255,.16)}}}}
:root[data-theme=dark]{{--ground:#0b1238;--surface:#121a4a;--ink:#f0f6ff;--soft:#b8c2e6;--action:#9d94ff;--line:rgba(240,246,255,.16)}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--ground);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}}
main{{max-width:1400px;margin:0 auto;padding:40px 16px 64px}}
h1{{font-size:clamp(2rem,1rem + 3vw,3.6rem);line-height:1.02;letter-spacing:-.03em;margin:0 0 12px}}
p.lede{{font-size:1.2rem;color:var(--soft);max-width:70ch;margin:0 0 28px}}
.ours{{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:0 0 8px}}.ours img{{width:100%;display:block;border:1px solid var(--line)}}
.cap{{font-size:.9rem;color:var(--soft);margin:0 0 36px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:28px 20px}}
figure{{margin:0}}figure img{{width:100%;display:block;border:1px solid var(--line);aspect-ratio:16/10;object-fit:cover;object-position:top}}
figcaption{{padding:10px 2px 0;font-size:.95rem}}.n{{font-variant-numeric:tabular-nums;color:var(--action);font-weight:700;margin-right:6px}}
.m{{color:var(--soft);font-size:.82rem}}.w{{color:var(--soft);font-size:.85rem}}
@media (max-width:900px){{.grid{{grid-template-columns:1fr 1fr}}}}@media (max-width:560px){{.grid{{grid-template-columns:1fr}}.ours{{grid-template-columns:repeat(3,1fr)}}}}
</style></head><body><main>
<h1>What the 100 sites do that we don't</h1>
<p class="lede">The 30 strongest of 150 picks, each a live capture from the reference site with one line on what we take from it and where it goes. We adapt the idea and keep our palette, copy and truth rules. Full list in picks.md, build order in plan.md.</p>
<div class="ours">{ours}</div>
<p class="cap">Our homepage today at 1440 px, five scroll positions: one layout repeated, 77 px top type size, empty picture boxes, no motion past the hero.</p>
<div class="grid">{''.join(cards)}</div>
</main></body></html>'''
open(os.path.join(HERE, 'board.html'), 'w').write(html)
print('ok', len(out), 'lines;', len(html) // 1024, 'KB board')
