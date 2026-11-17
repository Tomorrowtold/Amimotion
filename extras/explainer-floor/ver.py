#!/usr/bin/env python3
"""Write a short hash of the explainer's pictures into floor.json ("v").
floor.js adds it to every picture link, so a browser never shows an old set after the pictures change.
Run after packing new pictures: python3 extras/explainer-floor/ver.py"""
import hashlib, json, os
root = os.path.join(os.path.dirname(__file__), '..', '..', 'studio', 'v1', 'assets', 'floor')
h = hashlib.sha256()
for d, _, fs in sorted(os.walk(root)):
    for f in sorted(fs):
        if f != 'floor.json' and not f.startswith('s'):
            h.update(f.encode()); h.update(open(os.path.join(d, f), 'rb').read())
p = os.path.join(root, 'floor.json'); m = json.load(open(p)); m['v'] = h.hexdigest()[:8]
json.dump(m, open(p, 'w'), separators=(',', ':')); print('floor.json v =', m['v'])
