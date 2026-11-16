#!/usr/bin/env python3
"""Information architecture check on a build (thread "Design the AmIMotion site architecture", 16 Nov 2026).
Fails (exit 1) when:
  - a page has no link in from another page's text (menu, footer and breadcrumbs don't count): an orphan
  - a page is more than 3 clicks from the homepage
  - a page's breadcrumb differs from its parent chain in src/data/ia.json
  - a page carries more than 60 unique internal links (the research ceiling is ~45; the full footer adds ~43)
  - a page lacks the link to its next step (ia.json 'next')
  python3 tools/ia_check.py [dist folder]   (default: site/dist)"""
import json, re, sys
from collections import deque
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "dist"
IA = json.loads((HERE / "src" / "data" / "ia.json").read_text())["pages"]
MAX_LINKS = 60
SKIP = {"desk/index.html", "404.html"}


def norm(h):
    h = h.split("#")[0].split("?")[0]
    if not h.startswith("/") or h.startswith("//") or "." in h.rsplit("/", 1)[-1]: return None
    return h if h.endswith("/") else h + "/"


pages = {}
for f in sorted(OUT.rglob("index.html")):
    rel = str(f.relative_to(OUT))
    if rel in SKIP or rel.startswith(("assets/", "api/")): continue
    s = f.read_text(errors="ignore")
    url = "/" + rel[: -len("index.html")]
    m = re.search(r"<main[^>]*>(.*)</main>", s, re.S)
    main = m.group(1) if m else ""
    crumbs = re.search(r'<nav class="crumbs".*?</nav>', main, re.S)
    body = main.replace(crumbs.group(0), "") if crumbs else main
    pages[url] = dict(all={u for u in map(norm, re.findall(r'href="([^"]+)"', s)) if u and u != url},
                      body={u for u in map(norm, re.findall(r'href="([^"]+)"', body)) if u and u != url},
                      crumbs=re.findall(r'<a href="([^"]+)"', crumbs.group(0)) if crumbs else None)
problems = []
inbound = {u: 0 for u in pages}
for u, d in pages.items():
    for v in d["body"]:
        if v in inbound: inbound[v] += 1
for u, n in inbound.items():
    if u != "/" and n == 0: problems.append(f"{u}: orphan (no link in from any page's text)")
depth, q = {"/": 0}, deque(["/"])
while q:
    u = q.popleft()
    for v in pages.get(u, {}).get("all", ()):
        if v in pages and v not in depth: depth[v] = depth[u] + 1; q.append(v)
for u in pages:
    if depth.get(u, 99) > 3: problems.append(f"{u}: {depth.get(u, 'not reachable')} clicks from home")
for u, d in pages.items():
    if len(d["all"]) > MAX_LINKS: problems.append(f"{u}: {len(d['all'])} unique internal links (max {MAX_LINKS})")
    plan = IA.get(u)
    if u == "/" or not plan: continue
    chain, p = [], plan.get("parent")
    while p and p != "/": chain.insert(0, p); p = IA.get(p, {}).get("parent")
    if d["crumbs"] is not None and d["crumbs"] != ["/"] + chain: problems.append(f"{u}: breadcrumb {d['crumbs']} != ia.json {['/'] + chain}")
    if plan.get("next") and plan["next"] not in d["body"] and plan["next"] not in d["all"]: problems.append(f"{u}: no link to its next step {plan['next']}")
missing = [u for u in IA if u not in pages]
problems += [f"ia.json names {u}, which the build does not have" for u in missing]
print("\n".join(problems) or f"IA check OK: {len(pages)} pages, no orphans, all within 3 clicks, breadcrumbs match, next steps present")
sys.exit(1 if problems else 0)
