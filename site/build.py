#!/usr/bin/env python3
"""Build the AmIMotion static site.

src/pages/**.html  -> dist/<path>/index.html  (pretty URLs; pages/x/index.html -> dist/x/index.html)
Each page starts with a front-matter comment: title, description, tone (dark|light), scripts (hero, diag),
type (product|software|article|glossary|faq), product, crumb, og, noindex.

Search and answer engines get everything from the same text the visitor reads:
- JSON-LD per page: Organization and WebSite, WebPage (speakable when the page has a .short-answer), BreadcrumbList,
  FAQPage from every <details> block, Product from the spec table, SoftwareApplication, TechArticle,
  DefinedTermSet from the glossary, VideoObject for every film.
- robots.txt that names and welcomes the AI crawlers, sitemap.xml with lastmod and images, llms.txt and
  llms-full.txt, an IndexNow key file, and _headers for the host.
- The entity description comes from src/data/entity.json, the one wording used everywhere.

python3 build.py                       review build: noindex, crawlers disallowed
python3 build.py --indexable           public build for amimotion.com (only after the launch checklist)
python3 build.py --share               preview build: relative links ending in index.html, runs from an artifact
python3 tools/pickability.py dist      the AI pickability test on whatever was built
"""
import argparse, html, json, re, shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
SRC, DIST = ROOT / "src", ROOT / "dist"
ap = argparse.ArgumentParser()
ap.add_argument("--share", action="store_true")
ap.add_argument("--indexable", action="store_true")
ap.add_argument("--no-brief", action="store_true", help="hide the picture briefs on placeholders")
ap.add_argument("--base-url", default="https://www.amimotion.com")
ap.add_argument("--indexnow-key", default="")
args = ap.parse_args()
SITE, SHARE, BRIEF, TODAY = args.base_url.rstrip("/"), args.share, not args.no_brief, date.today().isoformat()
ENTITY = json.loads((SRC / "data" / "entity.json").read_text())
NAV = json.loads((SRC / "data" / "nav.json").read_text())
# one label per URL (homepage-final.md, Nav panels): bar, sheet, footer, section bars, breadcrumbs and llms.txt
LABEL = {s["url"]: s["label"] for s in NAV["sections"]}
for _s in NAV["sections"]:
    for _l, _u, _line in _s["items"]: LABEL.setdefault(_u, _l)

part = lambda n: (SRC / "partials" / n).read_text()
# colours live only in core.css: the browser bar colour is read from the --ground token, so a palette swap is one file
GROUND = re.search(r"--ground:\s*(#[0-9a-fA-F]{3,8})", (SRC / "css" / "core.css").read_text()).group(1)


def front(src):
    m = re.match(r"\s*<!--(.*?)-->", src, re.S)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1); meta[k.strip()] = v.strip()
        src = src[m.end():]
    return meta, src


def url_for(rel):
    # pages/index.html -> "/", pages/a/b.html -> "/a/b/", pages/a/index.html -> "/a/"
    parts = list(rel.with_suffix("").parts)
    if parts[-1] == "index": parts = parts[:-1]
    return "/" + "/".join(parts) + ("/" if parts else "")


def text_of(fragment):
    t = re.sub(r"<(script|style|svg|template)[\s\S]*?</\1>", " ", fragment)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


ORG = {
    "@type": "Organization", "@id": SITE + "/#org", "name": "AmIMotion", "alternateName": ENTITY["alternateName"],
    "legalName": ENTITY["legalName"], "url": SITE + "/", "logo": SITE + "/assets/img/AmIMotion_Logo.svg", "email": ENTITY["email"],
    "description": ENTITY["long"], "slogan": "Where work is. Where it waits.",
    "address": {"@type": "PostalAddress", "addressLocality": "Bengaluru", "addressRegion": "Karnataka", "addressCountry": "IN"},
    "knowsAbout": ENTITY["knowsAbout"], "sameAs": ENTITY["sameAs"],
    "brand": [{"@type": "Brand", "name": n} for n in ("AmIGo", "AmIMo", "AmIHub")],
    # round 07: the two people the founders approved, no third person (C2, C22); no areaServed (regions open, kit 02 Q18)
    "founder": {"@type": "Person", "@id": SITE + "/#kaushal-kukkar", "name": "Kaushal Kukkar", "jobTitle": "Founder and CEO"},
    "employee": [{"@type": "Person", "@id": SITE + "/#kaushal-kukkar", "name": "Kaushal Kukkar", "jobTitle": "Founder and CEO"},
                 {"@type": "Person", "@id": SITE + "/#vivek-dham", "name": "Vivek Dham", "jobTitle": "CTO"}],
    "contactPoint": {"@type": "ContactPoint", "contactType": "sales", "email": ENTITY["email"], "availableLanguage": "en"},
}

# ---- structured data pulled from the visible page, so it can never drift from what people read ----
def faq_items(body):
    return [{"@type": "Question", "name": text_of(q), "acceptedAnswer": {"@type": "Answer", "text": text_of(a)}}
            for q, a in re.findall(r"<details>\s*<summary>(.*?)</summary>(.*?)</details>", body, re.S)]


def specs_of(body):
    return [{"@type": "PropertyValue", "name": text_of(k), "value": text_of(v)}
            for k, v in re.findall(r'<tr>\s*<th scope="row">(.*?)</th>\s*<td>(.*?)</td>\s*</tr>', body, re.S)]


def glossary_of(body, url):
    return [{"@type": "DefinedTerm", "@id": f"{url}#{i}", "name": text_of(n), "description": text_of(d), "inDefinedTermSet": url}
            for i, n, d in re.findall(r'<dt id="([\w-]+)">(.*?)</dt>\s*<dd>(.*?)</dd>', body, re.S)]


def videos_of(body, url):
    out = []
    for m in re.finditer(r'<video([^>]*)>(.*?)</video>', body, re.S):
        attrs, inner = m.group(1), m.group(2)
        name = re.search(r'data-name="([^"]+)"', attrs); poster = re.search(r'poster="([^"]+)"', attrs)
        srcm = re.search(r'src="([^"]+\.mp4)"', inner) or re.search(r'src="([^"]+\.mp4)"', attrs)
        if not (name and poster and srcm): continue
        desc = re.search(r'data-description="([^"]+)"', attrs); dur = re.search(r'data-duration="([^"]+)"', attrs)
        v = {"@type": "VideoObject", "name": name.group(1), "description": (desc or name).group(1),
             "thumbnailUrl": SITE + poster.group(1), "contentUrl": SITE + srcm.group(1), "embedUrl": url,
             "uploadDate": re.search(r'data-date="([^"]+)"', attrs).group(1) if 'data-date="' in attrs else TODAY,
             "publisher": {"@id": SITE + "/#org"}}
        if dur: v["duration"] = dur.group(1)
        out.append(v)
    return out


def page_schema(meta, url, body, titles):
    full = SITE + url
    g = [ORG]
    if url == "/":
        g.append({"@type": "WebSite", "@id": SITE + "/#site", "url": SITE + "/", "name": "AmIMotion", "inLanguage": "en-IN",
                  "description": ENTITY["short"], "publisher": {"@id": SITE + "/#org"}})
    wp = {"@type": meta.get("page", "WebPage"), "@id": full + "#page", "url": full, "name": meta.get("title", ""), "description": meta.get("description", ""),
          "isPartOf": {"@id": SITE + "/#site"}, "about": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"},
          "inLanguage": "en-IN", "dateModified": TODAY}
    if "short-answer" in body:   # the paragraph a voice assistant or answer engine should read out
        wp["speakable"] = {"@type": "SpeakableSpecification", "cssSelector": ["h1", ".short-answer"]}
    g.append(wp)
    kind = meta.get("type", "")
    if kind == "product":
        g.append({"@type": "Product", "@id": full + "#product", "name": meta.get("product", meta.get("title")), "description": meta.get("description"),
                  "brand": {"@type": "Brand", "name": "AmIMotion"}, "manufacturer": {"@id": SITE + "/#org"},
                  "category": meta.get("category", "Real-time location system"), "image": SITE + meta.get("og", "/assets/home/og-home.jpg"),
                  "additionalProperty": specs_of(body)})
    if kind == "software":
        g.append({"@type": "SoftwareApplication", "@id": full + "#software", "name": meta.get("product", "AmIHub"), "description": meta.get("description"),
                  "applicationCategory": "BusinessApplication", "operatingSystem": "Runs on an industrial PC inside your plant, with no internet needed", "publisher": {"@id": SITE + "/#org"},
                  "additionalProperty": specs_of(body)})
    if kind == "article":
        g.append({"@type": "TechArticle", "@id": full + "#article", "headline": meta.get("title"), "description": meta.get("description"),
                  "author": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"}, "about": {"@id": SITE + "/#org"},
                  "datePublished": meta.get("published", "2026-10-28"), "dateModified": TODAY, "mainEntityOfPage": full, "inLanguage": "en-IN"})
    if meta.get("app"):   # a tool that runs in the browser (round 07 buying squad)
        g.append({"@type": "WebApplication", "@id": full + "#app", "name": meta["app"], "url": full, "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Any modern browser", "browserRequirements": "Requires JavaScript", "isAccessibleForFree": True, "publisher": {"@id": SITE + "/#org"}})
    if meta.get("term"):  # a page that defines a term (round 07 product squad: /industrial-spatial-intelligence/)
        g.append({"@type": "DefinedTerm", "@id": full + "#term", "name": meta["term"], "description": meta.get("description"), "inDefinedTermSet": SITE + "/glossary/"})
    if kind == "glossary":
        g.append({"@type": "DefinedTermSet", "@id": full, "name": "Glossary of industrial location terms", "hasDefinedTerm": glossary_of(body, full)})
    faqs = faq_items(body)
    if faqs:
        g.append({"@type": "FAQPage", "@id": full + "#faq", "mainEntity": faqs})
    g.extend(videos_of(body, full))
    trail = re.search(r'<nav class="crumbs"[^>]*>(.*?)</nav>', body, re.S)
    if trail:   # the visible breadcrumb trail, so the BreadcrumbList matches what people read (nav sections, not URL folders)
        crumbs = [(text_of(t), u) for u, t in re.findall(r'<a href="([^"]+)">(.*?)</a>', trail.group(1))] + [(LABEL.get(url, titles.get(url, "")), url)]
        g.append({"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(crumbs)]})
    elif url != "/" and url != "/404.html":
        crumbs, acc = [("Home", "/")], "/"
        for seg in url.strip("/").split("/"):
            acc += seg + "/"
            if acc in titles: crumbs.append((LABEL.get(acc, titles[acc]), acc))
        g.append({"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(crumbs)]})
    return json.dumps({"@context": "https://schema.org", "@graph": g}, ensure_ascii=False, separators=(",", ":"))


def head(meta, url, body, titles):
    t = meta.get("title", "AmIMotion")
    t = t if "AmIMotion" in t else f"{t} | AmIMotion"
    d = meta.get("description", "")
    og = meta.get("og", "/assets/home/og-home.jpg")
    robots = "noindex,nofollow" if meta.get("noindex") == "true" or not args.indexable else "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    e = html.escape
    return f"""<!doctype html>
<html lang="en-IN" class="no-js"{' data-brief' if BRIEF else ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(t)}</title>
<meta name="description" content="{e(d)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{SITE}{url}">
<meta name="theme-color" content="{GROUND}">
<meta property="og:type" content="website"><meta property="og:site_name" content="AmIMotion"><meta property="og:locale" content="en_IN">
<meta property="og:title" content="{e(t)}"><meta property="og:description" content="{e(d)}">
<meta property="og:url" content="{SITE}{url}"><meta property="og:image" content="{SITE}{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/AmIMotion_Icon.svg" type="image/svg+xml">
<link rel="alternate" type="text/plain" title="AmIMotion for AI assistants" href="/llms.txt">
{styles(meta)}
<script>document.documentElement.classList.replace('no-js','js')</script>
<script type="application/ld+json">{page_schema(meta, url, body, titles)}</script>
</head>
<body class="ds">"""


def css_min(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s*\n\s*", "", css)
    return re.sub(r"\s*([{};,>])\s*", r"\1", css).replace(";}", "}")


def styles(meta):
    """Every page carries its whole stylesheet in the first round trip: core.css (tokens, bar, footer) plus one
    template file (home.css, or inner.css with tool.css or diag.css where a page has a tool). No render-blocking
    request; the display face is preloaded."""
    files = ["core.css"] + (["home.css"] if meta.get("layout") == "home" else ["inner.css"] + [f"{x}.css" for x in meta.get("css", "").split()])
    css = css_min("".join((SRC / "css" / f).read_text() for f in files))
    return ('<link rel="preload" href="/assets/fonts/AmISansDisplay-SemiBold.woff2" as="font" type="font/woff2" crossorigin>\n'
            f"<style>{css}</style>")


A = lambda u, t, extra="": f'<a href="{u}"{extra}>{html.escape(t)}</a>'


def header_html():
    """The bar (homepage-final.md screen 0): logo, four sections as panels, one button. Panels are native <details>,
    so they open on click or tap with JavaScript off; a closed panel is out of the tab order."""
    nx = NAV["closing"]
    next_line = f'{nx[0]} {A(nx[2], nx[1])}'
    panels = []
    for s in NAV["sections"]:
        rows = "".join(f'<li><a href="{u}"><b>{html.escape(l)}</b><span>{html.escape(line)}</span></a></li>' for l, u, line in s["items"])
        panels.append(f'<li><details data-panel><summary>{s["label"]}</summary><div class="drop">'
                      f'<a class="drop-hub" href="{s["url"]}">{s["label"]}</a><ul class="drop-list">{rows}</ul>'
                      f'<p class="drop-next">{next_line}</p></div></details></li>')
    groups = "".join(f'<div class="sheet-group">{A(s["url"], s["label"])}<ul class="sheet-list">'
                     + "".join(f"<li>{A(u, l)}</li>" for l, u, _ in s["items"] if u != nx[2]) + "</ul></div>" for s in NAV["sections"])
    return (f'<a class="skip-link" href="#main">Skip to content</a>\n<header class="top ds">\n'
            f'<a class="logo" href="/" aria-label="AmIMotion home">{part("logo.html")}</a>\n'
            f'<nav class="main" aria-label="Main"><ul class="links">{"".join(panels)}</ul></nav>\n'
            f'<a class="cta" href="/contact/">Book a call</a>\n'
            f'<details class="phone" data-panel><summary>Menu</summary><nav class="sheet" aria-label="Menu">'
            f'{A(nx[2], nx[1], " class=\"sheet-first\"")}{groups}</nav></details>\n</header>')


def footer_html():
    """Screen 7 of homepage-final.md: start from your job, four columns with the nav labels, the entity paragraph."""
    roles = "".join(f"<div><dt>{html.escape(r)}</dt><dd>" + ' <span aria-hidden="true">·</span> '.join(A(u, l) for l, u in ls) + "</dd></div>" for r, ls in NAV["roles"])
    cols = "".join(f'<div>{A(s["url"], s["label"], " class=\"hub\"")}<ul>' + "".join(f"<li>{A(u, l)}</li>" for l, u, _ in s["items"]) + "</ul></div>" for s in NAV["sections"])
    return (f'<footer class="foot ds">\n<h2>Start from your job.</h2>\n<dl class="roles">{roles}</dl>\n'
            f'<nav class="foot-cols" aria-label="All pages">{cols}</nav>\n'
            f'<p class="entity">{html.escape(ENTITY["long"])}</p>\n'
            f'<p class="contact"><a href="mailto:sales@amimotion.com">sales@amimotion.com</a> <span aria-hidden="true">·</span> <a href="/privacy/">Privacy</a></p>\n'
            '<p class="legal">NXP and Trimension are trademarks of NXP B.V. FiRa and omlox are trademarks of their owners. Specifications are indicative. Final datasheets are shared under NDA.</p>\n'
            "</footer>")


# panels: one open at a time, Escape and a click outside close them. Without this script they still open and close.
NAV_JS = ("<script>(()=>{const d=document,P=[...d.querySelectorAll('details[data-panel]')];"
          "P.forEach(p=>p.addEventListener('toggle',()=>{if(p.open)P.forEach(q=>{if(q!==p)q.open=false})}));"
          "d.addEventListener('click',e=>{P.forEach(p=>{if(p.open&&!p.contains(e.target))p.open=false})});"
          "d.addEventListener('keydown',e=>{if(e.key==='Escape')P.forEach(p=>{if(p.open){p.open=false;p.querySelector('summary').focus()}})})})()</script>")
# the hero film hook: plays a [data-hero-film] video only while it is in view; never with reduced motion. No film yet: does nothing.
FILM_JS = ("<script>(()=>{const f=document.querySelector('[data-hero-film]'),v=f&&f.querySelector('video');"
           "if(!v||!('IntersectionObserver'in window))return;const q=matchMedia('(prefers-reduced-motion: reduce)');if(q.matches)return;"
           "const b=v.dataset.src+(matchMedia('(max-width:1023px), (max-aspect-ratio:4/5)').matches?'-1x1':'-4x5');let r=0;"
           "const load=()=>{if(r)return;r=1;[['-av1.mp4','video/mp4; codecs=\"av01.0.08M.08\"'],['-h264.mp4','video/mp4; codecs=\"avc1.640028\"']]"
           ".forEach(([x,t])=>{const s=document.createElement('source');s.src=b+x;s.type=t;v.appendChild(s)});v.load()};"
           "v.addEventListener('playing',()=>f.classList.add('is-playing'));"
           "const go=()=>new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){load();v.play().catch(()=>{})}else v.pause()}),{threshold:.25}).observe(f);"
           "document.readyState==='complete'?go():addEventListener('load',go);"
           "q.addEventListener&&q.addEventListener('change',()=>{if(q.matches){v.pause();f.classList.remove('is-playing')}})})()</script>")


def scripts(meta):
    """Inner pages load no shared script: the panels script (inline), plus a tool's own file where it has one.
    The diagnostic's 3D floor (three.js, about 690 KB) is no longer loaded: it drew a plant in code and broke the
    first-screen budget. Its 2D sketch stays."""
    if meta.get("layout") == "home": return NAV_JS + FILM_JS
    s = meta.get("scripts", "").split()
    out = [NAV_JS]
    if "diag" in s: out.append('<script src="/assets/js/config.js" defer></script><script src="/assets/js/diagnostic.js" defer></script>')
    out += [f'<script src="/assets/js/{x}.js" defer></script>' for x in s if x not in ("hero", "diag")]
    return "\n".join(out)


def relativise(page, url):
    depth = url.strip("/").count("/") + (1 if url != "/" else 0)
    pre = "../" * depth or "./"
    def fix(m):
        attr, q, path = m.group(1), m.group(2), m.group(3)
        if path.startswith("//"): return m.group(0)
        p, frag = (path.split("#", 1) + [""])[:2]
        if p.endswith("/"): p += "index.html"
        return f'{attr}={q}{pre}{p.lstrip("/")}{"#" + frag if frag else ""}{q}'
    page = re.sub(r'(href|src|action|poster)=(["\'])(/[^"\']*)\2', fix, page)
    page = re.sub(r'(srcset)=(["\'])([^"\']*)\2', lambda m: f'{m.group(1)}={m.group(2)}' + ", ".join((pre + x.strip().lstrip("/")) if x.strip().startswith("/") else x.strip() for x in m.group(3).split(",")) + m.group(2), page)
    page = page.replace('"three":"/assets/', f'"three":"{pre}assets/')
    page = page.replace("url(\"/assets/", f"url(\"{pre}assets/")
    return page.replace('<html lang="en-IN"', f'<html lang="en-IN" data-root="{pre}" data-index="index.html"', 1)


def crumb_labels(body, url=None):
    """Visible breadcrumbs use the nav label of each URL, the same as the bar and BreadcrumbList, the current page too."""
    def fix(m):
        t = re.sub(r'<a href="([^"]+)">([^<]*)</a>', lambda a: f'<a href="{a.group(1)}">{LABEL.get(a.group(1), a.group(2))}</a>', m.group(0))
        return re.sub(r'<span aria-current="page">[^<]*</span>', lambda a: f'<span aria-current="page">{LABEL[url]}</span>', t) if url in LABEL else t
    return re.sub(r'<nav class="crumbs".*?</nav>', fix, body, flags=re.S)


def build():
    if DIST.exists(): shutil.rmtree(DIST)
    (DIST / "assets").mkdir(parents=True)
    # assets/intro (the old AI-made hero turn) is no longer shipped: nothing may use it
    # shipped: fonts, CAD stills, film files. Not shipped: assets/intro (the old AI-made turn), assets/scene (the dark
    # glowing scene stills, replaced by reserved slots in round 05), vendor (three.js, no longer loaded)
    for sub in ("fonts", "img", "home", "film", "photo", "hall"):
        if (SRC / "assets" / sub).exists(): shutil.copytree(SRC / "assets" / sub, DIST / "assets" / sub)
    shutil.copytree(SRC / "js", DIST / "assets" / "js", dirs_exist_ok=True)
    pages = {}
    for f in sorted((SRC / "pages").rglob("*.html")):
        rel = f.relative_to(SRC / "pages")
        meta, body = front(f.read_text()); body = crumb_labels(body, url_for(rel))
        pages[url_for(rel) if rel.name != "404.html" else "/404.html"] = (meta, body)
    titles = {u: m.get("crumb") or m.get("title", "").split(" | ")[0] for u, (m, _) in pages.items()}

    public = []
    for url, (meta, body) in pages.items():
        header = header_html()
        page = head(meta, url, body, titles) + "\n" + header + f'\n<main id="main">\n{body}\n</main>\n' + footer_html() + "\n" + scripts(meta) + "\n</body>\n</html>\n"
        if SHARE: page = relativise(page, url)
        out = DIST / ("404.html" if url == "/404.html" else url.strip("/") + "/index.html" if url != "/" else "index.html")
        out.parent.mkdir(parents=True, exist_ok=True); out.write_text(page)
        if meta.get("noindex") != "true" and url != "/404.html": public.append(url)

    # sitemap with the pictures each page carries (image search and answer engines use them)
    def imgs(url):
        found = re.findall(r'src="(/assets/(?:img|photo)/[\w.-]+\.(?:webp|jpg|png))"', pages[url][1])
        return "".join(f"<image:image><image:loc>{SITE}{p}</image:loc></image:image>" for p in list(dict.fromkeys(found))[:8])
    (DIST / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
        + "".join(f"  <url><loc>{SITE}{u}</loc><lastmod>{TODAY}</lastmod>{imgs(u)}</url>\n" for u in sorted(public)) + "</urlset>\n")

    # robots: search engines and AI answer engines named and welcomed on a public build (decision D2)
    bots = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "Claude-User",
            "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "DuckAssistBot", "meta-externalagent"]
    robots = ("".join(f"User-agent: {b}\nAllow: /\n\n" for b in bots) + "User-agent: *\nAllow: /\n") if args.indexable else "User-agent: *\nDisallow: /\n"
    (DIST / "robots.txt").write_text(robots + f"\nSitemap: {SITE}/sitemap.xml\n")

    # llms.txt (index of the site) and llms-full.txt (every page as plain text) for AI assistants
    facts = "\n".join(f"- {x}" for x in ENTITY["facts"])
    # the four nav sections and their pages, in nav order, with the nav labels; then every other public page
    listed, sections = set(), []
    for sec in NAV["sections"]:
        rows = []
        for u in [sec["url"]] + [u for _, u, _ in sec["items"]]:
            if u in pages and u in public and u not in listed:
                listed.add(u); rows.append(f"- [{LABEL[u]}]({SITE}{u}): {pages[u][0].get('description', '')}")
        sections.append((sec["label"], rows))
    rest = [f"- [{titles[u]}]({SITE}{u}): {pages[u][0].get('description', '')}" for u in sorted(public) if u not in listed and u != "/"]
    if rest: sections.append(("More pages", rest))
    lines = dict(sections)
    (DIST / "llms.txt").write_text(f"# AmIMotion\n\n> {ENTITY['long']}\n\n{ENTITY['short']}\n\n## Key facts (with their qualifiers)\n\n{facts}\n\n"
        + "\n\n".join(f"## {k}\n\n" + "\n".join(v) for k, v in lines.items() if v) + f"\n\n## Home\n\n- [AmIMotion]({SITE}/): {pages['/'][0].get('description', '')}\n")
    (DIST / "llms-full.txt").write_text(f"# AmIMotion: the full site as text\n\n> {ENTITY['long']}\n\n## Key facts\n\n{facts}\n\n"
        + "\n\n".join(f"## {pages[u][0].get('title')}\nURL: {SITE}{u}\n\n{text_of(pages[u][1])}" for u in sorted(public)) + "\n")

    if args.indexnow_key: (DIST / f"{args.indexnow_key}.txt").write_text(args.indexnow_key)
    (DIST / "_headers").write_text("/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n"
        + ("" if args.indexable else "  X-Robots-Tag: noindex, nofollow\n")
        + "\n/assets/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=2592000\n\n/llms*.txt\n  Content-Type: text/plain; charset=utf-8\n")
    print(f"built {len(pages)} pages -> {DIST}{' (share)' if SHARE else ''}{' (indexable)' if args.indexable else ' (review: noindex)'}")


if __name__ == "__main__":
    build()
