# Join the numbers of every plate into the one small file the page reads. usage: merge.py <assets/lfs dir>
import json, sys, os
A = sys.argv[1]; out = {}
for o in 'LP':
    out[o] = {}
    for s in 'abcd':
        d = json.load(open(f'{A}/{o}/{s}.json')); d.pop('gain', None); d.pop('counts', None)
        d['pts'] = {k: [round(v[0], 4), round(v[1], 4), round(v[2], 2)] for k, v in d['pts'].items()}; out[o][s] = d
json.dump(out, open(f'{A}/lfs.json', 'w'), separators=(',', ':')); print(os.path.getsize(f'{A}/lfs.json'), 'bytes')
