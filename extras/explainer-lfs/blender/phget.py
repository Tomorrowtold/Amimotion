import json, urllib.request, os, sys
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (asset-fetch)'}), timeout=90).read()
out = sys.argv[1]
for aid, kind, res in [(a.split(':')[0], a.split(':')[1], a.split(':')[2]) for a in sys.argv[2:]]:
    f = json.loads(get(f'https://api.polyhaven.com/files/{aid}'))
    d = os.path.join(out, aid); os.makedirs(d, exist_ok=True)
    if kind == 'model':
        g = f['gltf'][res]['gltf']; urls = {os.path.basename(g['url']): g['url']}
        for p, inc in g.get('include', {}).items(): urls[p] = inc['url']
    else:
        urls = {}
        for m in ['Diffuse', 'Rough', 'nor_gl', 'Displacement', 'arm', 'AO']:
            if m in f and res in f[m]: urls[os.path.basename(f[m][res]['jpg']['url']) if 'jpg' in f[m][res] else os.path.basename(f[m][res]['png']['url'])] = (f[m][res].get('jpg') or f[m][res]['png'])['url']
    for p, u in urls.items():
        fp = os.path.join(d, p); os.makedirs(os.path.dirname(fp), exist_ok=True); open(fp, 'wb').write(get(u))
    print(aid, len(urls))
