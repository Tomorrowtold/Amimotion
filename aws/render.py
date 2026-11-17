#!/usr/bin/env python3
"""Fill aws/template.yaml with the redirects and the security header from vercel.json, and the two edge functions.
   usage: python3 aws/render.py <out.yaml>     (deploy.sh runs it; aws/test_edge.mjs checks the result)"""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
v = json.loads((ROOT / 'vercel.json').read_text())
exact, prefix = {}, []
for r in v.get('redirects', []):
    s, d = r['source'], r['destination']
    if s in ('/index.html', '/:path*/index.html'): continue          # the request function already does these two
    if ':' in d or '(' in s: sys.exit('render.py: a redirect uses a pattern this script does not know: ' + s)
    if s.endswith('/:path*'): prefix.append([s[:-len(':path*')], d])
    elif ':' in s: sys.exit('render.py: a redirect uses a pattern this script does not know: ' + s)
    else: exact[s.rstrip('/') or '/'] = d
csp = next(x['value'] for h in v['headers'] for x in h['headers'] if x['key'] == 'Content-Security-Policy')
if '"' in csp or len(csp) > 1783: sys.exit('render.py: the security header is too long for CloudFront or holds a double quote')
def block(path, pad, **subs):
    t = (ROOT / 'aws' / 'edge' / path).read_text()
    for k, val in subs.items(): t = t.replace(k, val)
    if len(t.encode()) > 10000: sys.exit('render.py: ' + path + ' is over the 10 KB limit of a CloudFront function')
    return '\n'.join((pad + l) if l else '' for l in t.rstrip('\n').split('\n'))
t = (ROOT / 'aws' / 'template.yaml').read_text()
t = t.replace('__EDGE_REQUEST__', block('request.js', ' ' * 10, __EXACT__=json.dumps(exact), __PREFIX__=json.dumps(prefix)))
t = t.replace('__EDGE_RESPONSE__', block('response.js', ' ' * 8))
t = t.replace('__CSP__', csp)
if len(sys.argv) > 1 and sys.argv[1] == '--hash':   # one short code for everything this script fills in
    import hashlib
    print(hashlib.sha256((json.dumps(exact, sort_keys=True) + json.dumps(prefix) + csp + (ROOT / 'aws/edge/request.js').read_text() + (ROOT / 'aws/edge/response.js').read_text()).encode()).hexdigest()[:16]); sys.exit(0)
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
(out.write_text(t) if out else sys.stdout.write(t))
if out: print('render: %d old addresses, %d address groups, security header %d characters -> %s' % (len(exact), len(prefix), len(csp), out))
