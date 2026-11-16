#!/usr/bin/env python3
"""Stamp asset links in the built pages with a short content hash (?v=abc123de).

A stamped file can be cached for a year: when the file changes, its link changes.
Unstamped links (fonts, files loaded from CSS or scripts) keep the short cache in vercel.json.
Usage: python3 studio/stamp.py [dir]   (default studio/out)
"""
import hashlib, os, re, sys

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'out'))
EXT = r'(?:css|js|mjs|webp|avif|jpe?g|png|svg|gif|mp4|webm)'
ATTR = re.compile(r'(\b(?:src|href|poster)=")([^"?#\s]+\.' + EXT + r')(")')
SRCSET = re.compile(r'(\bsrcset=")([^"]+)(")')
PRELOAD = re.compile(r'<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*>')
_cache = {}


def digest(path):
    if path not in _cache:
        try:
            with open(path, 'rb') as f:
                _cache[path] = hashlib.sha256(f.read()).hexdigest()[:8]
        except OSError:
            _cache[path] = None
    return _cache[path]


def resolve(url, page_dir):
    if re.match(r'^(?:[a-z]+:)?//|^data:|^mailto:', url):
        return None
    p = os.path.join(ROOT, url.lstrip('/')) if url.startswith('/') else os.path.normpath(os.path.join(page_dir, url))
    return p if p.startswith(ROOT) and '/assets/' in p.replace(os.sep, '/') else None


def stamp(url, page_dir):
    p = resolve(url, page_dir)
    h = digest(p) if p else None
    return f'{url}?v={h}' if h else url


def page(path):
    d = os.path.dirname(path)
    s = open(path, encoding='utf-8').read()
    keep = {}

    def hold(m):  # preloads must match the URL the page really requests, so leave them alone
        k = f'\x00{len(keep)}\x00'
        keep[k] = m.group(0)
        return k
    t = PRELOAD.sub(hold, s)
    t = ATTR.sub(lambda m: m.group(1) + stamp(m.group(2), d) + m.group(3), t)

    def srcset(m):
        parts = []
        for item in m.group(2).split(','):
            bits = item.strip().split()
            if bits and re.search(r'\.' + EXT + '$', bits[0]):
                bits[0] = stamp(bits[0], d)
            parts.append(' '.join(bits))
        return m.group(1) + ', '.join(parts) + m.group(3)
    t = SRCSET.sub(srcset, t)
    for k, v in keep.items():
        t = t.replace(k, v)
    if t != s:
        open(path, 'w', encoding='utf-8').write(t)
        return 1
    return 0


n = sum(page(os.path.join(r, f)) for r, _, fs in os.walk(ROOT) for f in fs if f.endswith('.html'))
print(f'stamp: {n} pages stamped')
