#!/usr/bin/env python3
"""Copy lock: the words on every page must not change during polish.
  python3 studio/copylock.py save    -> writes studio/copylock.json from studio/out
  python3 studio/copylock.py check   -> lists every page whose words differ (exit 1 if any)
Words = visible text + alt/aria-label + <title> + meta description, whitespace-normalised."""
import json, re, sys, difflib
from pathlib import Path
from html import unescape
OUT = Path(__file__).parent / "out"; LOCK = Path(__file__).parent / "copylock.json"
def words(s):
    s = re.sub(r"<(script|style|svg|template|noscript)\b.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<!--.*?-->", " ", s, flags=re.S)
    extra = re.findall(r'(?:alt|aria-label|content)="([^"]*)"', s)
    t = re.sub(r"<[^>]+>", " ", s)
    return " ".join(unescape(t + " " + " ".join(extra)).split())
def snap(): return {str(p.relative_to(OUT)): words(p.read_text(errors="ignore")) for p in sorted(OUT.rglob("*.html"))}
if sys.argv[1:] == ["save"]:
    LOCK.write_text(json.dumps(snap(), indent=0, ensure_ascii=False)); print("saved", LOCK)
else:
    base, now, bad = json.loads(LOCK.read_text()), snap(), 0
    for k in sorted(set(base) | set(now)):
        a, b = base.get(k, ""), now.get(k, "")
        if a != b:
            bad += 1; print("CHANGED", k)
            for l in list(difflib.unified_diff(a.split(), b.split(), lineterm="", n=3))[2:14]: print("   ", l)
    print("copy lock:", "OK" if not bad else f"{bad} page(s) changed"); sys.exit(1 if bad else 0)
