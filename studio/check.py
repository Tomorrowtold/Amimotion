#!/usr/bin/env python3
"""Site checks on the launch build (studio/out): every internal link and asset resolves, every public page carries
its title, description, canonical, share picture, language and structured data, and the JSON files parse.
  python3 studio/check.py     (exit 1 on any problem)"""
import json, os, re, sys
from pathlib import Path
from urllib.parse import unquote
OUT = Path(__file__).parent / "out"
NOINDEX = {"desk/index.html", "404.html"}
NEEDS = {"title": r"<title>[^<]+</title>", "description": r'name="description" content="[^"]+', "canonical": r'rel="canonical"',
         "og:image": r'property="og:image"', "lang": r"<html[^>]+lang=", "viewport": r'name="viewport"', "json-ld": r"application/ld\+json", "h1": r"<h1\b"}
problems = []
for f in sorted(OUT.rglob("*.html")):
    rel, s = str(f.relative_to(OUT)), f.read_text(errors="ignore")
    for u in re.findall(r'(?:href|src|poster)="([^"#?]+)', s):
        if re.match(r"(https?:|mailto:|tel:|data:|javascript:|//)", u) or "${" in u: continue
        p = Path(os.path.normpath(unquote(str(OUT / u.lstrip("/") if u.startswith("/") else f.parent / u))))
        if not (p.exists() or (p / "index.html").exists()): problems.append(f"{rel}: broken link {u}")
    if rel.endswith("index.html") and rel not in NOINDEX:
        problems += [f"{rel}: missing {k}" for k, pat in NEEDS.items() if not re.search(pat, s)]
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try: json.loads(block)
        except ValueError: problems.append(f"{rel}: JSON-LD does not parse")
for j in OUT.rglob("*.json"):
    try: json.loads(j.read_text())
    except ValueError: problems.append(f"{j.relative_to(OUT)}: does not parse")
for need in ("robots.txt", "sitemap.xml", "404.html", "llms.txt"):
    if not (OUT / need).exists(): problems.append(f"missing {need}")
print("\n".join(problems[:80]) or "site checks OK")
sys.exit(1 if problems else 0)
