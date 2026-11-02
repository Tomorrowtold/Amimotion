#!/usr/bin/env python3
"""Studio site = the main site (all pages, nav, dock, tools, diagnostic, footer) + the studio homepage and craft layer.

Run any time the main site moves on; it always takes the latest branch:
  python3 studio/integrate.py            -> studio/out/  (share build: relative links, runs from an artifact)

1. Exports site/ from origin/claude/project-thread-lg8bk2 and runs its own build.py --share.
2. Homepage: keeps the main site's <head>, header, phone dock and footer; swaps <main> for the studio film homepage
   (live CAD tag, scroll film, picture cards, product stage, start). Studio CSS is scoped under .studio.
3. Every page gets the studio skin: the locating cursor, magnetic buttons, line reveals on headings.
4. Copies only files that some page references, so the artifact stays under its file cap.
"""
import os, re, shutil, subprocess, sys, tarfile, io
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
STUDIO = REPO / "studio" / "v1"
WORK = Path(os.environ.get("STUDIO_WORK", "/tmp/claude-0/integrate"))
OUT = REPO / "studio" / "out"
BRANCH = os.environ.get("SITE_BRANCH", "origin/claude/project-thread-lihvsj")   # main site + inner pages + nav + product sites + new footer (2 Nov)

def sh(*a, **k): return subprocess.run(a, check=True, **k)

# 1. export + build the main site
if BRANCH.startswith("origin/"): subprocess.run(["git", "-C", str(REPO), "fetch", "-q", "origin", BRANCH.split("/", 1)[1]])
shutil.rmtree(WORK, ignore_errors=True); WORK.mkdir(parents=True)
tar = subprocess.run(["git", "-C", str(REPO), "archive", BRANCH, "site"], check=True, capture_output=True).stdout
_tf = tarfile.open(fileobj=io.BytesIO(tar))
try: _tf.extractall(WORK, filter='data')
except TypeError: _tf.extractall(WORK)   # Python before 3.12 (macOS system python): our own git archive, trusted
site = WORK / "site"
b = (site / "build.py").read_text()
b = re.sub(r'    if missing: raise SystemExit\("build: homepage pictures missing.*\n', '    if missing: print("build: homepage pictures not landed yet:", len(missing))\n', b)
(site / "build.py").write_text(b)
# pages are committed in src/ on the branch (product sites edit them by hand): never regenerate them here
LAUNCH = os.environ.get("LAUNCH") == "1"   # LAUNCH=1: real links, indexable, for the live host
sh(sys.executable, "build.py", *(["--indexable"] if LAUNCH else ["--share"]), "--no-brief", cwd=site)
dist = site / "dist"
rev = subprocess.run(["git", "-C", str(REPO), "rev-parse", "--short", BRANCH], capture_output=True, text=True).stdout.strip()

# 2. scope studio CSS under .studio
DROP = re.compile(r"^(html|body|\*|img|a|em|:focus-visible|\.skip|\.bar|\.logo|\.nav|\.menu-btn|\.sheet|\.foot|\.roles|\.cols|\.entity|\.contact|\.legal|\.wordmark|\.hero-foot \.hero-part)\b")
def scope(css):
    out, i = [], 0
    def block(text):
        res, j = [], 0
        while j < len(text):
            k = text.find("{", j)
            if k < 0: break
            sel = text[j:k].strip(); depth, m = 1, k + 1
            while depth: depth += {"{": 1, "}": -1}.get(text[m], 0); m += 1
            body = text[k + 1:m - 1]
            if sel.startswith("@media") or sel.startswith("@supports"):
                inner = block(body)
                if inner.strip(): res.append(f"{sel}{{{inner}}}")
            elif sel.startswith("@"):
                res.append(f"{sel}{{{body}}}")
            elif sel == ":root":
                res.append(f".studio{{{body}}}")
            else:
                parts = [p.strip() for p in sel.split(",")]
                keep = [p for p in parts if not DROP.match(p)]
                if keep: res.append(",".join(".studio " + p for p in keep) + f"{{{body}}}")
            j = m
        return "\n".join(res)
    return block(re.sub(r"/\*.*?\*/", "", css, flags=re.S))

css = scope((STUDIO / "css" / "studio.css").read_text())
css = css.replace("url(../assets/fonts/", "url(../../fonts/")   # AmI fonts: the site's own copies (assets/fonts), so the preloads are reused
css += """
.studio{background:var(--ground);color:var(--ink);font-family:var(--text)}
.studio .hero{padding-top:0}
"""

# 3. homepage: their head/header/dock/footer + studio main
home = (dist / "index.html").read_text()
sm = (STUDIO / "index.html").read_text()
main = sm[sm.index("<main"):sm.index("</main>") + 7]
main = main.replace('<main id="main">', '<main id="main" class="studio">', 1)
def rel(m):
    u = m.group(1)
    if LAUNCH: return f'href="{u}"'
    return f'href="./{u.strip("/")}/index.html"' if u != "/" else 'href="./index.html"'
main = re.sub(r'href="(/[^"#]*)"', rel, main)
main = main.replace('src="assets/', 'src="./assets/studio/assets/').replace('poster="assets/', 'poster="./assets/studio/assets/')
# rename studio classes that the main site's own stylesheet also uses, so neither side bleeds into the other
CLS = ['hero','hero-stage','hero-copy','system','start','start-row','stage','stage-pics','stage-side','stage-floor','cards','card','card-pic','cta','ctas','cta-h','cta-p','cta-plan','cta-call','btn','btn-primary','btn-secondary','links','lead','panel','tabs','tab-ink','big','copy','two','screen','mega','display','lede','lede-lead','h2','h3','small','strong','more','caps','cap','rail','story','story-sticky','floor-media','floor-poster','floor-gl','floor-hud','wire','wire-line','wire-glow','world-gl','spec-line','arrow-link','magnet','tilt','ideas','sp','sp-hub','vh','q-big','tag-fallback','tag-shadow','scroll-cue','hero-foot','hero-part','wrap']
CRE = re.compile(r'\.(' + '|'.join(sorted(map(re.escape, CLS), key=len, reverse=True)) + r')(?![\w-])')
def cls_attr(m): return 'class="' + ' '.join(('z-' + c) if c in CLS else c for c in m.group(1).split()) + '"'
main = re.sub(r'class="([^"]*)"', cls_attr, main)
cursor = '<div class="cursor" id="cursor" aria-hidden="true"><i class="c-ring"></i><i class="c-dot"></i><i class="c-h"></i><i class="c-v"></i></div>'
a, z = home.index("<main"), home.index("</main>") + 7
home = home[:a] + main + home[z:]   # the normal system cursor (Shiv, 2 Nov): no custom cursor
home = home.replace("</head>", '<link rel="stylesheet" href="./assets/studio/css/studio.css">\n<script>if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("tag-live")</script>\n</head>', 1)
home = home.replace("</body>", '<script type="module" src="./assets/studio/js/studio.js"></script>\n</body>', 1)
(dist / "index.html").write_text(home)

# studio assets under assets/studio/
sa = dist / "assets" / "studio"
shutil.rmtree(sa, ignore_errors=True)
for sub in ("js", "assets"):
    shutil.copytree(STUDIO / sub, sa / sub)
css = CRE.sub(lambda m: '.z-' + m.group(1), css)
(sa / "css").mkdir(parents=True); (sa / "css" / "studio.css").write_text(css)
shutil.copytree(STUDIO / "assets" / "fonts", sa / "fonts")
# studio JS fetches assets/... relative to the page: point it at assets/studio/assets/
for f in (sa / "js").glob("*.js"):
    t = f.read_text().replace("`assets/", "`assets/studio/assets/").replace("'assets/", "'assets/studio/assets/").replace("'../assets/vendor/", "'../assets/vendor/")
    t = re.sub(r"(?<=['\"`\s,(>])\.(" + '|'.join(sorted(map(re.escape, CLS), key=len, reverse=True)) + r")(?![\w-])", lambda m: '.z-' + m.group(1), t).replace("contains('cta')", "contains('z-cta')")
    f.write_text(t)

# 4. skin for every page
skin_css = (REPO / "studio" / "skin.css").read_text(); skin_js = (REPO / "studio" / "skin.js").read_text()
(sa / "skin.css").write_text(skin_css); (sa / "skin.js").write_text(skin_js)
for f in dist.rglob("*.html"):
    if f.name == "index.html" and f.parent == dist: pre = "./"
    else: pre = "../" * len(f.relative_to(dist).parent.parts) or "./"
    t = f.read_text()
    if "studio/skin.css" in t: continue
    t = t.replace("</head>", f'<link rel="stylesheet" href="{pre}assets/studio/skin.css">\n</head>', 1)
    t = t.replace("</body>", f'<script src="{pre}assets/studio/skin.js" defer></script>\n</body>', 1)
    f.write_text(t)

# 5. copy only referenced files
keep = set()
for f in dist.rglob("*"):
    if f.suffix in (".html", ".txt", ".xml") or f.name in ("_headers",): keep.add(f)
ref = re.compile(r'(?:src|href|poster|data-src|data-poster|data-frame-src)="([^"#?]+)"|srcset="([^"]+)"|url\(([^)]+)\)|["\'`](\.{0,2}/?assets/[^"\'`\s)]+)["\'`]')
def walk(f):
    t = f.read_text(errors="ignore")
    for m in ref.finditer(t):
        for u in ([m.group(1)] if m.group(1) else [x.strip().split()[0] for x in m.group(2).split(",") if x.strip()] if m.group(2) else [m.group(3).strip("'\"")] if m.group(3) else [m.group(4)]):
            if not u or u.startswith(("http", "data:", "mailto:")): continue
            if "{" in u:   # frame sequences: keep the whole set
                base = (((dist / u.split("{")[0].lstrip("/")) if u.startswith("/") else (f.parent / u.split("{")[0])).resolve())
                for g in base.parent.glob(base.name + "*"): keep.add(g)
                continue
            p = ((dist / u.lstrip("/")) if u.startswith("/") else (f.parent / u)).resolve()
            if p.is_file() and p not in keep:
                keep.add(p)
                if p.suffix in (".css", ".js"): walk(p)
for f in list(keep):
    if f.suffix in (".html", ".css", ".js") and f.exists(): walk(f)
# runtime files fetched by code (product pages load the CAD meshes themselves)
for g in (dist / "assets" / "vendor").glob("*.js"):   # three.js, imported by the product pages' modules
    keep.add(g.resolve())
for g in (dist / "assets" / "locate").rglob("*"):
    if g.is_file(): keep.add(g.resolve())
# studio runtime files fetched by code
for g in sa.rglob("*"):
    if g.is_file() and not g.name.startswith("hall-1600") : keep.add(g.resolve())
# studio files nothing loads any more (keeps the build under the artifact's 511-file cap)
UNUSED = re.compile(r"assets/studio/assets/(film/|fonts/|scene/hall-waits-|hw/.*(dark|pair-34|-k800))")
keep = {f for f in keep if not UNUSED.search(str(Path(f).resolve().relative_to(dist.resolve())))}
shutil.rmtree(OUT, ignore_errors=True)
n = 0
for f in keep:
    f = Path(f).resolve()
    if not f.is_file(): continue
    r = f.relative_to(dist.resolve()); d = OUT / r; d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(f, d); n += 1
(OUT / "BUILD.txt").write_text(f"main site {rev} + studio\n")
print(f"studio site: {n} files from main {rev} -> {OUT}")
