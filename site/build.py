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

part = lambda n: (SRC / "partials" / n).read_text()


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
    "areaServed": "Worldwide", "knowsAbout": ENTITY["knowsAbout"], "sameAs": ENTITY["sameAs"],
    "brand": [{"@type": "Brand", "name": n} for n in ("AmIGo", "AmIMo", "AmIHub")],
}

# ---- structured data pulled from the visible page, so it can never drift from what people read ----
def faq_items(body):
    return [{"@type": "Question", "name": text_of(q), "acceptedAnswer": {"@type": "Answer", "text": text_of(a)}}
            for q, a in re.findall(r"<details[^>]*>\s*<summary[^>]*>(.*?)</summary>(.*?)</details>", body, re.S)]


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
    wp = {"@type": "WebPage", "@id": full + "#page", "url": full, "name": meta.get("title", ""), "description": meta.get("description", ""),
          "isPartOf": {"@id": SITE + "/#site"}, "about": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"},
          "inLanguage": "en-IN", "dateModified": TODAY}
    if "short-answer" in body:   # the paragraph a voice assistant or answer engine should read out
        wp["speakable"] = {"@type": "SpeakableSpecification", "cssSelector": ["h1", ".short-answer"]}
    g.append(wp)
    kind = meta.get("type", "")
    if kind == "product":
        g.append({"@type": "Product", "@id": full + "#product", "name": meta.get("product", meta.get("title")), "description": meta.get("description"),
                  "brand": {"@type": "Brand", "name": "AmIMotion"}, "manufacturer": {"@id": SITE + "/#org"},
                  "category": meta.get("category", "Real-time location system"), "image": SITE + meta.get("og", "/assets/img/og.jpg"),
                  "additionalProperty": specs_of(body)})
    if kind == "software":
        g.append({"@type": "SoftwareApplication", "@id": full + "#software", "name": meta.get("product", "AmIHub"), "description": meta.get("description"),
                  "applicationCategory": "BusinessApplication", "operatingSystem": "On-premise or cloud", "publisher": {"@id": SITE + "/#org"},
                  "additionalProperty": specs_of(body)})
    if kind == "article":
        g.append({"@type": "TechArticle", "@id": full + "#article", "headline": meta.get("title"), "description": meta.get("description"),
                  "author": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"}, "about": {"@id": SITE + "/#org"},
                  "datePublished": meta.get("published", "2026-10-28"), "dateModified": TODAY, "mainEntityOfPage": full, "inLanguage": "en-IN"})
    if kind == "glossary":
        g.append({"@type": "DefinedTermSet", "@id": full, "name": "Glossary of industrial location terms", "hasDefinedTerm": glossary_of(body, full)})
    faqs = faq_items(body)
    if faqs:
        g.append({"@type": "FAQPage", "@id": full + "#faq", "mainEntity": faqs})
    g.extend(videos_of(body, full))
    if url != "/":
        crumbs, acc = [("Home", "/")], "/"
        for seg in url.strip("/").split("/"):
            acc += seg + "/"
            if acc in titles: crumbs.append((titles[acc], acc))
        g.append({"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(crumbs)]})
    return json.dumps({"@context": "https://schema.org", "@graph": g}, ensure_ascii=False, separators=(",", ":"))


def head(meta, url, body, titles):
    t = meta.get("title", "AmIMotion")
    t = t if "AmIMotion" in t else f"{t} | AmIMotion"
    d = meta.get("description", "")
    og = meta.get("og", "/assets/img/og.jpg")
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
<meta name="theme-color" content="#000000">
<meta property="og:type" content="website"><meta property="og:site_name" content="AmIMotion"><meta property="og:locale" content="en_IN">
<meta property="og:title" content="{e(t)}"><meta property="og:description" content="{e(d)}">
<meta property="og:url" content="{SITE}{url}"><meta property="og:image" content="{SITE}{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/AmIMotion_Icon.svg" type="image/svg+xml">
<link rel="alternate" type="text/plain" title="AmIMotion for AI assistants" href="/llms.txt">
<link rel="preload" href="/assets/fonts/InterTight.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<script>document.documentElement.classList.replace('no-js','js')</script>
<script type="application/ld+json">{page_schema(meta, url, body, titles)}</script>
</head>
<body>
{part('sprite.html')}"""


def scripts(meta):
    s = meta.get("scripts", "").split()
    out = ['<script src="/assets/js/site.js" defer></script>']
    if "hero" in s: out.append('<script src="/assets/js/hero.js" defer></script>')
    if "diag" in s:
        out.append('<script src="/assets/js/config.js" defer></script><script src="/assets/js/diagnostic.js" defer></script>')
        out.append('<script type="importmap">{"imports":{"three":"/assets/vendor/three.module.min.js"}}</script>'
                   # the 3D floor (and three.js, about 690 KB) loads only when the diagnostic comes near the screen
                   '<script>(()=>{const d=document,el=d.querySelector("[data-diag]");if(!el)return;const go=()=>{if(go.done)return;go.done=1;const s=d.createElement("script");s.type="module";s.src=d.querySelector(\'script[src*="assets/js/site.js"]\').src.replace("site.js","diag3d.js");d.body.appendChild(s)};'
                   'if(!("IntersectionObserver"in window))return go();const io=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting)){io.disconnect();go()}},{rootMargin:"800px 0px"});io.observe(el)})();</script>')
    for x in s:
        if x not in ("hero", "diag"): out.append(f'<script src="/assets/js/{x}.js" defer></script>')
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


# The guided path: each section's pages in order, so every page can show where you are and what comes next
TOURS = [
    ("Platform", [("/platform/", "Overview"), ("/products/amigo/", "AmIGo"), ("/products/amimo/", "AmIMo"), ("/products/amihub/", "AmIHub"), ("/technology/", "Technology"), ("/specs/", "Specs"), ("/developers/", "Developers")]),
    ("Solutions", [("/solutions/", "Overview"), ("/solutions/wip/", "Work in progress"), ("/solutions/assets/", "Tools and vehicles"), ("/use-cases/", "Use cases"), ("/industries/", "Industries")]),
    ("Resources", [("/resources/", "Overview"), ("/diagnostic/", "Diagnose"), ("/tools/", "Tools"), ("/films/", "Films"), ("/learn/", "Field guides"), ("/glossary/", "Glossary"), ("/faq/", "Questions")]),
    ("Company", [("/company/", "About"), ("/pilot/", "Pilot"), ("/trust/", "Trust"), ("/contact/", "Contact")]),
]
NEXT_LINE = {"/platform/": "Start with the tag", "/products/amigo/": "Then the anchor", "/products/amimo/": "Then the software",
             "/products/amihub/": "How the accuracy is reached", "/technology/": "Every figure we publish", "/specs/": "Build on it", "/developers/": "What it solves", "/industries/": "Try it on your floor",
             "/faq/": "Who builds it", "/trust/": "Talk to the team"}


def tour_of(url):
    flat = [(name, u, label) for name, items in TOURS for u, label in items]
    best = None
    for k, (name, u, label) in enumerate(flat):
        if url == u or (url.startswith(u) and u != "/" and (best is None or len(u) > len(flat[best][1]))): best = k
    if best is None: return None
    name, u, _ = flat[best]
    items = dict(TOURS)[name]
    nxt = flat[best + 1] if best + 1 < len(flat) else None
    return name, u, items, nxt


def subnav(url):
    t = tour_of(url)
    if not t: return "", ""
    name, cur, items, nxt = t
    links = "".join(f'<a href="{u}"' + (' aria-current="page"' if u == cur else "") + f">{label}</a>" for u, label in items)
    nl = (nxt[0] if nxt[2] == "Overview" else nxt[2]) if nxt else ""
    nx = f'<a class="subnav-next" href="{nxt[1]}"><span>Next</span> {nl}</a>' if nxt else '<a class="subnav-next" href="/contact/"><span>Next</span> Book a call</a>'
    bar = f'<nav class="subnav" aria-label="{name} pages" data-subnav><a class="subnav-name" href="{items[0][0]}">{name}</a><div class="subnav-links">{links}</div>{nx}</nav>\n'
    band = ""
    if nxt:
        line = NEXT_LINE.get(cur, "Keep going")
        band = (f'<section class="next-band dark" aria-label="Next page"><div class="wrap"><a href="{nxt[1]}"><span class="nb-kicker">{line}</span>'
                f'<span class="nb-title">{nl if nxt[0] == name or nxt[2] == "Overview" else nxt[0] + ": " + nl}</span><i aria-hidden="true"></i></a></div></section>\n')
    return bar, band


SCENES = {k: v for k, v in json.loads((SRC / "data" / "scenes.json").read_text()).items() if not k.startswith("_")}
PH_RE = re.compile(r'<div class="card ph mood-(\w+)(?: ratio-(\w+))?">(\s*)<p class="ph-brief"><b>(P\d+)</b>')


def scenes(body):
    def sub(m):
        mood, ratio, ws, code = m.groups()
        if code not in SCENES: return m.group(0)
        stem, alt, pos, *kind = SCENES[code] + [None]
        if kind[0] == "screen":
            im = f'<img src="/assets/scene/{stem}.webp" alt="{alt}" width="2000" height="994" loading="lazy" decoding="async" style="object-position:{pos}">'
        else:
            im = (f'<img src="/assets/scene/{stem}-1600.webp" srcset="/assets/scene/{stem}-900.webp 900w, /assets/scene/{stem}-1600.webp 1600w" '
                  f'sizes="(max-width: 900px) 92vw, 1200px" alt="{alt}" width="1600" height="900" loading="lazy" decoding="async" style="object-position:{pos}">')
        return f'<div class="card ph scene{" screen" if kind[0] == "screen" else ""} mood-{mood}{" ratio-" + ratio if ratio else ""}">{ws}{im}<p class="ph-brief"><b>{code}</b>'
    return PH_RE.sub(sub, body)


def build():
    if DIST.exists(): shutil.rmtree(DIST)
    (DIST / "assets").mkdir(parents=True)
    for sub in ("fonts", "img", "intro", "vendor", "film", "photo", "scene"):
        if (SRC / "assets" / sub).exists(): shutil.copytree(SRC / "assets" / sub, DIST / "assets" / sub)
    shutil.copytree(SRC / "js", DIST / "assets" / "js", dirs_exist_ok=True)
    (DIST / "assets" / "css").mkdir()
    css = (SRC / "css" / "site.css").read_text()
    if SHARE: css = css.replace('url("/assets/', 'url("../')
    (DIST / "assets" / "css" / "site.css").write_text(css)

    pages = {}
    for f in sorted((SRC / "pages").rglob("*.html")):
        rel = f.relative_to(SRC / "pages")
        meta, body = front(f.read_text()); body = scenes(body)
        pages[url_for(rel) if rel.name != "404.html" else "/404.html"] = (meta, body)
    titles = {u: m.get("crumb") or m.get("title", "").split(" | ")[0] for u, (m, _) in pages.items()}

    public = []
    for url, (meta, body) in pages.items():
        header = part("header.html").replace("{{tone}}", meta.get("tone", "light"))
        bar, band = subnav(url) if url not in ("/", "/404.html") else ("", "")
        page = head(meta, url, body, titles) + "\n" + header + "\n" + bar + f'<main id="main"' + (' class="has-sub"' if bar else "") + f'>\n{body}\n{band}</main>\n' + part("footer.html") + "\n" + scripts(meta) + "\n</body>\n</html>\n"
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
    groups = {"Products": ("/platform", "/products", "/technology"), "Solutions and use cases": ("/solutions", "/use-cases", "/industries", "/pilot"),
              "Answers": ("/learn", "/glossary", "/faq", "/what-is-amimotion", "/industrial-spatial-intelligence"),
              "Tools": ("/diagnostic", "/tools"), "Films": ("/films",), "Company": ("/company", "/contact", "/trust", "/privacy")}
    lines = {k: [] for k in groups}
    for u in sorted(public):
        m = pages[u][0]
        for k, pre in groups.items():
            if u.startswith(pre): lines[k].append(f"- [{titles[u]}]({SITE}{u}): {m.get('description', '')}"); break
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
