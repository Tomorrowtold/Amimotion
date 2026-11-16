"""Write film.json for the web section from a folder of composed frames and hall.py's meta.json.
python3 manifest.py WEB_DIR META_JSON OUT_JSON
Lists which frames exist per scroll, the film camera, and a few movers to label in scroll 3 (kind only, no ids)."""
import sys, os, re, json
web, meta, out = sys.argv[1:4]
m = json.load(open(meta))
fr = {s: [] for s in '1234'}
for n in sorted(os.listdir(web)):
    r = re.match(r's(\d)_(\d{3})\.webp$', n)
    if r: fr[r[1]].append(int(r[2]))
NAME = {'forklift': 'Forklift', 'amr': 'Robot', 'person': 'Person', 'trolley': 'Trolley', 'pallet': 'Pallet'}
tags, seen = [], set()
for k, x, y, w in sorted(m.get('movers', []), key=lambda v: (v[1] - 128) ** 2 + (v[2] - 40) ** 2):
    kk = next((n for n in NAME if n in k.lower()), None)
    if kk and kk not in seen and not w and (x - m['target'][0]) ** 2 + (y - m['target'][1]) ** 2 > 36: seen.add(kk); tags.append([NAME[kk], x, y])
json.dump({'film': m['film'], 'w': 1920, 'h': 1080, 'sensor': m.get('sensor', 36), 'target': m['target'], 'tags': tags, 'frames': fr},
          open(out, 'w'), separators=(',', ':'))
print(out, {s: len(v) for s, v in fr.items()}, tags)
