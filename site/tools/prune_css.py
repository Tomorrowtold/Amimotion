#!/usr/bin/env python3
"""Trim site.css to the rules a built page or a script can still match (Engine room, round 04).

    python3 tools/prune_css.py dist src/css/site.css          rewrites src/css/site.css in place

A selector is dropped when it names a class that appears in no built page (dist/**/*.html, class attributes)
and in no script (any word in src/js/*.js counts, which keeps every class the scripts add). A rule is dropped
when none of its selectors survive. Also removes, sitewide and for good: backdrop-filter (glass), the hero glow,
and the [data-reveal] opacity-0 hiding. Run after a build; re-run whenever pages lose classes."""
import re, sys
from pathlib import Path

dist, css_path = Path(sys.argv[1]), Path(sys.argv[2])
used = set()
for f in dist.rglob("*.html"):
    for m in re.finditer(r'class="([^"]*)"', f.read_text(errors="ignore")): used.update(m.group(1).split())
for f in (css_path.parent.parent / "js").glob("*.js"):
    used.update(re.findall(r"[A-Za-z][\w-]*", f.read_text(errors="ignore")))
used.update({"js", "no-js"})


def blocks(s):
    """Split CSS into (prelude, body) at depth 0; comments removed."""
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    out, i, n = [], 0, len(s)
    while i < n:
        j = s.find("{", i)
        if j < 0: break
        depth, k = 1, j + 1
        while depth and k < n:
            depth += {"{": 1, "}": -1}.get(s[k], 0); k += 1
        out.append((s[i:j].strip(), s[j + 1:k - 1])); i = k
    return out


def keep_sel(sel):
    if "data-reveal" in sel or "hero-glow" in sel: return False
    return all(c in used for c in re.findall(r"\.([A-Za-z][\w-]*)", sel))


def clean_decls(body):
    return ";".join(d for d in body.split(";") if "backdrop-filter" not in d).strip()


def emit(items, indent=""):
    out = []
    for pre, body in items:
        if pre.startswith("@media") or pre.startswith("@supports"):
            inner = emit(blocks(body), indent + "  ")
            if inner.strip(): out.append(f"{indent}{pre} {{\n{inner}{indent}}}\n")
        elif pre.startswith("@"):
            out.append(f"{indent}{pre} {{{body.strip()}}}\n")
        else:
            sels = [x.strip() for x in pre.split(",") if keep_sel(x.strip())]
            b = clean_decls(body)
            if sels and b: out.append(f"{indent}{', '.join(sels)} {{ {b} }}\n")
    return "".join(out)


src = css_path.read_text()
head = "/* AmIMotion inner pages. Trimmed by tools/prune_css.py to what the built pages still use; tokens, bar and footer live in core.css. */\n"
new = head + emit(blocks(src))
css_path.write_text(new)
print(f"{css_path}: {len(src.encode())/1024:.1f} KB -> {len(new.encode())/1024:.1f} KB")
