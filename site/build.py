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
ap.add_argument("--out", default="", help="build somewhere other than dist/ (parallel builds, review shots)")
args = ap.parse_args()
if args.out: DIST = Path(args.out).resolve()
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
    t = re.sub(r"\s+", " ", html.unescape(t)).strip()
    return re.sub(r" ([.,;:!?)])", r"\1", t)   # "your <a>baseline</a>." reads "baseline.", not "baseline ."


ORG = {
    "@type": "Organization", "@id": SITE + "/#org", "name": "AmIMotion", "alternateName": ENTITY["alternateName"],
    "legalName": ENTITY["legalName"], "url": SITE + "/",
    # the square mark every page already ships as its icon (the launch build copies only files a page references)
    "logo": {"@type": "ImageObject", "@id": SITE + "/#logo", "url": SITE + "/assets/img/AmIMotion_Icon.svg", "width": 512, "height": 512}, "email": ENTITY["email"],
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


# HowTo only where the page itself sets out steps a buyer follows, in order (not where it explains how the system works):
# url -> the <h2> the steps sit under. The HowTo is named by the page title (the question the steps answer).
HOWTO = {"/pilot/": "Five steps, in order.", "/how-to-buy/": "Four steps.",
         "/learn/anchor-planning/": "How to get to a number", "/learn/value-without-mes/": "A pilot plan that works"}


def howto_of(meta, url, body):
    if url not in HOWTO: return None
    h2 = HOWTO[url]
    m = re.search(r"<h2[^>]*>(?:<span>)?" + re.escape(h2) + r"(?:</span>)?</h2>(.*?)<ol\b[^>]*>(.*?)</ol>", body, re.S)
    if not m or "<h2" in m.group(1): raise SystemExit(f"build: HowTo steps for {url} not found under '{h2}'")
    steps = []
    for i, li in enumerate(re.findall(r"<li\b[^>]*>(.*?)</li>", m.group(2), re.S)):
        h3 = re.search(r"<h3[^>]*>(.*?)</h3>(.*)", li, re.S)
        st = {"@type": "HowToStep", "position": i + 1}
        if h3: st.update(name=text_of(h3.group(1)).rstrip("."), text=text_of(h3.group(2)))
        else: st["text"] = text_of(li)
        steps.append(st)
    return {"@type": "HowTo", "@id": SITE + url + "#howto", "name": meta.get("title", ""),
            "description": meta.get("description", ""), "inLanguage": "en-IN", "step": steps}


def page_schema(meta, url, body, titles):
    full = SITE + url
    og = SITE + meta.get("og", "/assets/home/og-home.jpg")
    # the WebSite node rides on every page, so each page's isPartOf resolves inside its own graph
    g = [ORG, {"@type": "WebSite", "@id": SITE + "/#site", "url": SITE + "/", "name": "AmIMotion", "inLanguage": "en-IN",
               "description": ENTITY["short"], "publisher": {"@id": SITE + "/#org"}}]
    wp = {"@type": meta.get("page", "WebPage"), "@id": full + "#page", "url": full, "name": meta.get("title", ""), "description": meta.get("description", ""),
          "isPartOf": {"@id": SITE + "/#site"}, "about": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"},
          "primaryImageOfPage": {"@type": "ImageObject", "url": og}, "inLanguage": "en-IN", "dateModified": TODAY}
    if "short-answer" in body:   # the paragraph a voice assistant or answer engine should read out
        wp["speakable"] = {"@type": "SpeakableSpecification", "cssSelector": ["h1", ".short-answer"]}
    g.append(wp)
    kind = meta.get("type", "")
    if kind == "product":
        g.append({"@type": "Product", "@id": full + "#product", "name": meta.get("product", meta.get("title")), "description": meta.get("description"),
                  "brand": {"@type": "Brand", "name": "AmIMotion"}, "manufacturer": {"@id": SITE + "/#org"},
                  "category": meta.get("category", "Real-time location system"), "image": og, "url": full, "mainEntityOfPage": {"@id": full + "#page"},
                  "additionalProperty": specs_of(body)})
        wp["mainEntity"] = {"@id": full + "#product"}
    if kind == "software":
        g.append({"@type": "SoftwareApplication", "@id": full + "#software", "name": meta.get("product", "AmIHub"), "description": meta.get("description"),
                  "applicationCategory": "BusinessApplication", "operatingSystem": "Runs on an industrial PC inside your plant, with no internet needed", "publisher": {"@id": SITE + "/#org"},
                  "url": full, "image": og, "mainEntityOfPage": {"@id": full + "#page"}, "additionalProperty": specs_of(body)})
        wp["mainEntity"] = {"@id": full + "#software"}
    if kind == "article":
        g.append({"@type": "TechArticle", "@id": full + "#article", "headline": meta.get("title"), "description": meta.get("description"),
                  "author": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"}, "about": {"@id": SITE + "/#org"},
                  "datePublished": meta.get("published", "2026-10-28"), "dateModified": TODAY, "mainEntityOfPage": {"@id": full + "#page"}, "image": og, "inLanguage": "en-IN"})
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
    ht = howto_of(meta, url, body)
    if ht: g.append(ht)
    if url == "/learn/":   # the field guides, in order, as the shelf's list (each by its nav label)
        guides = sorted(u for u in titles if u.startswith("/learn/") and u != "/learn/")
        g.append({"@type": "ItemList", "@id": full + "#guides", "name": "Field guides", "numberOfItems": len(guides),
                  "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": LABEL.get(u, titles[u]), "url": SITE + u} for i, u in enumerate(guides)]})
        wp["mainEntity"] = {"@id": full + "#guides"}
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
    if g[-1]["@type"] == "BreadcrumbList":
        g[-1]["@id"] = full + "#crumbs"; wp["breadcrumb"] = {"@id": full + "#crumbs"}
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
<link rel="image_src" href="{og}">
<link rel="icon" href="/assets/img/AmIMotion_Icon.svg" type="image/svg+xml">
<link rel="alternate" type="text/plain" title="AmIMotion for AI assistants" href="/llms.txt">
{styles(meta)}
<script>(()=>{{const h=document.documentElement;h.classList.replace('no-js','js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!/[?&]still\\b/.test(location.search))h.classList.add('motion')}})()</script>
<script>{OPEN_AT_TOP}</script>
<script type="application/ld+json">{page_schema(meta, url, body, titles)}</script>{KIT_HEAD if meta.get("world") else ''}
</head>
<body class="{body_class(meta)}"{(' data-rail="' + e(meta["rail"]) + '"') if meta.get("rail") else ''}{(' data-world="' + e(meta["world"]) + '"') if meta.get("world") else ''}{(' style="--cv:' + e(meta["cover"]) + '"') if meta.get("cover") else ''}>{'<div class="k-progress" aria-hidden="true"></div>' if 'progress' in meta.get('look','').split() else ''}"""


def css_min(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s*\n\s*", "", css)
    return re.sub(r"\s*([{};,>])\s*", r"\1", css).replace(";}", "}")


def body_class(meta):
    """The shared class plus the page's looks (front matter look: serif sidehead cards ...): kit.css restyles by them."""
    return " ".join(["ds"] + (["pl", "site-" + meta["id"]] if meta.get("layout") == "product" else []) + ["look-" + x for x in meta.get("look", "").split()])


# Every page opens at its top when a link is followed (a link to a section, Back/Forward and reload keep the browser's own
# position). In a frame that grows with its page (a preview host), the host keeps its scroll from the previous page, so the
# page also brings its own top into view when it opens clipped. Stops the moment the visitor scrolls, taps or types.
OPEN_AT_TOP = ("(()=>{const w=window,d=document;if(location.hash)return;const n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];"
               "if(n&&n.type!=='navigate')return;let m=0;['wheel','touchstart','keydown','pointerdown'].forEach(e=>addEventListener(e,()=>{m=1},{once:true,passive:true,capture:true}));"
               "const f=()=>{if(m||d.prerendering)return;if(w.scrollY)w.scrollTo({top:0,left:0,behavior:'instant'});"
               "if(w.top!==w&&d.body&&'IntersectionObserver'in w){const o=new IntersectionObserver(([x])=>{o.disconnect();"
               "if(!m&&x.intersectionRect.top>x.boundingClientRect.top+2)try{d.body.scrollIntoView({block:'start',behavior:'instant'})}catch(_){}});o.observe(d.body)}};"
               "f();d.addEventListener('DOMContentLoaded',f);addEventListener('load',f);if(d.prerendering)d.addEventListener('prerenderingchange',f)})()")


# Inner pages: the next page is prerendered when a visitor's pointer rests on a link, and the headline of the page you
# open grows out of the link you chose (cross-document view transitions; browsers without them just navigate).
KIT_HEAD = """<script type="speculationrules">{"prerender":[{"where":{"and":[{"selector_matches":"main a[href], header a[href]"},{"not":{"selector_matches":"[href^='http'], [href*='#']"}}]},"eagerness":"moderate"}]}</script>
<script>addEventListener('pageswap',e=>{if(!e.viewTransition||!e.activation)return;const u=e.activation.entry.url,a=[...document.querySelectorAll('main a[href]')].find(x=>x.href===u);const h=document.querySelector('.head h1');if(h)h.style.viewTransitionName='';if(a&&a.getBoundingClientRect().bottom>0&&a.getBoundingClientRect().top<innerHeight)(a.querySelector('b')||a).style.viewTransitionName='k-title'});addEventListener('pagereveal',e=>{if(!e.viewTransition)return;const h=document.querySelector('.head h1');if(!h)return;h.style.viewTransitionName='k-title';e.viewTransition.finished.finally(()=>h.style.viewTransitionName='')})</script>"""


# The two faces the first screen paints: the headline (Display) and the short answer under it (Text Regular), which is
# the page's largest text and so its LCP. Preloaded, they arrive with the HTML instead of after the inline CSS is parsed.
# The serif and the medium weight stay on font-display: swap behind metric-matched fallbacks (no shift).
FONT_PRELOAD = "".join(f'<link rel="preload" href="/assets/fonts/{f}.woff2" as="font" type="font/woff2" crossorigin>\n'
                       for f in ("AmISansDisplay-SemiBold", "AmISansText-Regular"))


def styles(meta):
    """Every page carries its whole stylesheet in the first round trip: core.css (tokens, bar, footer) plus one
    template file (home.css, or inner.css with tool.css or diag.css where a page has a tool). No render-blocking
    request; the display face is preloaded."""
    # the product sites (thread "Build AmIGo, AmIMo and AmIHub product sites"): each product page is its own small
    # site under the AmIMotion nav, so it carries core.css plus its own two files, none of the inner-page kit
    if meta.get("layout") == "product":
        css = css_min("".join((SRC / "css" / f).read_text() for f in ["core.css", "products/base.css", f"products/{meta['id']}.css"]))
        return (FONT_PRELOAD +
                f"<style>{css}</style>")
    files = ["core.css"] + (["home.css"] if meta.get("layout") == "home" else ["inner.css"] + [f"{x}.css" for x in meta.get("css", "").split()] + ["worlds.css", "kit.css"])
    if meta.get("layout") != "home" and meta.get("id") and (SRC / "css" / "id" / f"{meta['id']}.css").exists(): files.append(f"id/{meta['id']}.css")
    css = css_min("".join((SRC / "css" / f).read_text() for f in files))
    return (FONT_PRELOAD +
            f"<style>{css}</style>")


A = lambda u, t, extra="": f'<a href="{u}"{extra}>{html.escape(t)}</a>'


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


PIC = NAV["pictures"]


def nav_pic(k, on=False):
    """A nav still (assets/nav, cut from the CAD renders by team/rounds/14-nav/tools/thumbs.py; WebP only, the AVIF
    saves nothing on the hall crops). Lazy: a closed panel is not rendered, so its pictures cost nothing until it opens."""
    return f'<picture data-k="{k}"{" class=\"on\"" if on else ""}><img src="/assets/nav/{k}-640.webp" width="640" height="480" alt="" loading="lazy"></picture>'


def section_of(url):
    """The nav section a page belongs to: the one that lists it; else the one listing the longest URL that contains
    it (/learn/x/ under Field guides); else the first sharing its first folder (/products/ with the AmIGo tag)."""
    links = [(o, s) for s in NAV["sections"] for o in [s["url"]] + [u for _, u, _ in s["items"]]]
    for o, s in links:
        if o == url: return s
    inside = [(len(o), s) for o, s in links if url.startswith(o) and o != "/"]
    if inside: return max(inside, key=lambda x: x[0])[1]
    return next((s for o, s in links if url != "/" and o.split("/")[1] == url.split("/")[1]), None)


def grouped(s):
    i = 0
    for name, n, *_ in s["groups"]:
        yield name, s["items"][i:i + n]; i += n


def roles_html(where):
    return "".join(f'<li><span>{html.escape(r)}</span> ' + ' <span aria-hidden="true">·</span> '.join(
        A(u, l) for l, u in links) + "</li>" for r, links in NAV["roles"])


def ask_form(i, hint="Ask about tags, anchors, pilots or data"):
    return (f'<form class="nask-form" role="search" data-ask><label class="vh" for="ask-{i}">Ask a question about AmIMotion</label>'
            f'<input id="ask-{i}" type="search" placeholder="{hint}" autocomplete="off" spellcheck="false" enterkeyhint="go">'
            '</form><p class="vh" role="status" data-ask-status></p><div class="nask-out"></div>')


WORLD_DOOR = {"steel": "Products", "shift": "Solutions", "floor": "Solutions", "morning": "Start small", "paper": "Resources", "studio": "Company"}
GUIDES = []   # every field guide as [url, short title, cover colour]; build() fills it from the pages before rendering
CHEV = '<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="m4.5 2.5 3.5 3.5-3.5 3.5"/></svg>'
LOOK = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6"/><path d="m13 13 5 5"/></svg>'


_SIZES = {}
def webp_size(src):
    """Pixel size of a WebP under src/assets, read from its header, so every <img> carries width and height."""
    if src not in _SIZES:
        d = (SRC / src.lstrip("/")).read_bytes()[:30]
        if d[12:16] == b"VP8 ": w, h = (int.from_bytes(d[26:28], "little") & 0x3fff), (int.from_bytes(d[28:30], "little") & 0x3fff)
        elif d[12:16] == b"VP8L": v = int.from_bytes(d[21:25], "little"); w, h = (v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1
        else: w, h = int.from_bytes(d[24:27], "little") + 1, int.from_bytes(d[27:30], "little") + 1
        _SIZES[src] = (w, h)
    return _SIZES[src]


def still(u):
    """The picture an item shows in a panel: a nav still (CAD on a pale ground) or the graded still its page opens on.
    The panel's frame sets the shape (aspect-ratio, object-fit), so width and height only tell the browser the ratio early."""
    k = PIC.get(u)
    if not k: return ""
    src = f"/assets/worlds/{k[2:]}-800.webp" if k.startswith("w:") else f"/assets/nav/{k}-640.webp"
    w, h = webp_size(src)
    return f'<span class="pic"><img src="{src}" width="{w}" height="{h}" alt="" loading="lazy" decoding="async"></span>'


def panel_group(name, kind, items, cur, where):
    """One group of a panel. Every link is plain HTML, so crawlers and answer engines read the whole tree."""
    a = lambda l, u, line, cls="": (f'<a class="{cls}" href="{u}"{cur(u)} data-nav-id="{where}.{slug(name)}.{slug(l)}">'
                                     f'{still(u) if cls else ""}<b>{html.escape(l)}</b><span>{html.escape(line)}</span>'
                                     f'{"" if cls else CHEV}</a>')
    if kind == "shelf":
        lu, ll = items[0][1], items[0][0]
        spines = "".join(f'<li><a class="spine" href="{u}"{cur(u)} style="--c:{c};--h:{220 + (i * 37) % 34}px" data-t="{html.escape(t)}"><span>{html.escape(t)}</span></a></li>'
                         for i, (u, t, c) in enumerate(GUIDES))
        return (f'<div class="grp shelfgrp"><p class="grp-name"><a href="{lu}"{cur(lu)}>{html.escape(ll)}</a></p>'
                f'<ul class="shelf">{spines}</ul><p class="shelf-cap" aria-hidden="true">{html.escape(GUIDES[0][1]) if GUIDES else ""}</p></div>')
    cls = {"plinths": "plinth", "photos": "photo", "feature": "photo feature"}.get(kind, "")
    body = "".join(f"<li>{a(*it, cls)}</li>" for it in items)
    return f'<div class="grp g-{kind}"><p class="grp-name">{html.escape(name)}</p><ul class="{kind}">{body}</ul></div>'


def over_photo(meta, body):
    """True when the page's first screen is a photograph or dark stage pulled up under the bar (a poster head, or a
    page stylesheet with margin-top: calc(-1 * var(--bar))): on phones the logo then sits on the picture, not on ground."""
    if re.search(r'class="head\b[^"]*\bw-poster\b', body): return True
    if not meta.get("id"): return False
    own = [SRC / "css" / "id" / f"{meta['id']}.css", SRC / "css" / "products" / f"{meta['id']}.css"]
    return any(f.exists() and "calc(-1 * var(--bar)" in f.read_text() for f in own)


def header_html(url="/", world=None, over=False):
    """The capsule (round 3 nav, /mnt/project-files/nav/concepts/). One floating piece of glass; four materials, four
    jobs: glass to move around, a lens bead that rests on the door you are in, a pressed well for Ask, one clay button.
    Five doors, each one world of the inner pages; a door's panel wears that world's ground and shows the stills its
    pages open on. Every door is a native <details>, so it opens on click, tap and keyboard with JavaScript off.
    On long pages nav.js turns the capsule into a locator (where you are, the section you read, how far). On phones
    the capsule sits at the bottom under the thumb and grows into the menu sheet."""
    here_label = WORLD_DOOR.get(world) if world else None
    here = next((s for s in NAV["sections"] if s["label"] == here_label), None) or section_of(url)
    cur = lambda u: ' aria-current="page"' if u == url else ""
    doors, panes = [], []
    for s in NAV["sections"]:
        sl = slug(s["label"]); gs = [(n, k, its) for (n, _, k), (_, its) in zip(s["groups"], grouped(s))]
        groups = "".join(panel_group(n, k, its, cur, f"header.{sl}") for n, k, its in gs)
        foot = f'<div class="drop-foot"><a class="drop-hub" href="{s["url"]}"{cur(s["url"])} data-nav-id="header.{sl}.hub">{html.escape(s["hub"])}{CHEV}</a><span class="drop-ask">Ask anything <kbd>/</kbd></span></div>'
        doors.append(f'<details class="door{" here" if s is here else ""}" data-panel data-world="{s["world"]}"><summary data-nav-id="header.{sl}"{" aria-current=\"true\"" if s is here else ""}>{s["label"]}</summary>'
                     f'<div class="drop" data-world="{s["world"]}"><div class="drop-grid g{len(gs)}">{groups}</div>{foot}</div></details>')
        panes.append(f'<section class="pane" data-world="{s["world"]}" aria-label="{s["label"]}"><h2 class="pane-h">{s["label"]}</h2>'
                     + "".join(panel_group(n, k, its, cur, f"sheet.{sl}") for n, k, its in gs)
                     + f'<p class="pane-hub"><a href="{s["url"]}"{cur(s["url"])}>{html.escape(s["hub"])}{CHEV}</a></p></section>')
    roles = "".join(f'<li><a href="{u}"><b>{html.escape(r)}</b><span>{html.escape(l)}</span></a></li>' for r, l, u in NAV["ask_roles"])
    ask = (f'<details class="nask" data-panel><summary data-nav-id="header.ask" aria-label="Ask a question">{LOOK}<span class="t">Ask</span><kbd aria-hidden="true">/</kbd></summary>'
           f'<div class="drop nask-drop"><div class="nask-main">{ask_form("d")}</div><div class="nask-roles"><p>I\'m here as</p><ul>{roles}</ul></div></div></details>')
    menu = ''.join(f'<li><button type="button" data-pane="{i}">{s["label"]}{CHEV}</button></li>' for i, s in enumerate(NAV["sections"]))
    return (f'<a class="skip-link" href="#main">Skip to content</a>\n<header class="top ds{" over" if over else ""}">\n'
            f'<a class="logo plogo" href="/" aria-label="AmIMotion home">{part("logo.html")}</a>\n<div class="cap">'
            f'<a class="logo" href="/" aria-label="AmIMotion home" data-nav-id="header.home">{part("logo.html")}</a>\n'
            f'<nav class="main" aria-label="Main"><div class="doors">{"".join(doors)}<span class="lens" aria-hidden="true"></span></div></nav>\n'
            '<div class="where" aria-hidden="true"><span class="w-crumb"></span><span class="w-sec"></span></div>\n'
            f'<div class="act">{ask}<a class="cta" href="/contact/" data-nav-id="header.book-a-call">Book a call</a>'
            '<details class="phone" data-panel><summary data-nav-id="sheet.menu"><span class="bars" aria-hidden="true"></span><span class="m-open">Menu</span><span class="m-close">Close</span></summary>'
            f'<nav class="sheet" aria-label="Menu"><div class="sheet-track"><div class="sheet-home"><div class="sheet-ask">{ask_form("m", "Ask a question")}</div><ul class="sheet-doors">{menu}</ul></div>'
            f'<div class="sheet-panes"><button type="button" class="back">{CHEV}Menu</button>{"".join(panes)}</div></div></nav></details></div>'
            '<span class="prog" aria-hidden="true"><i></i></span></div>\n</header>\n<div class="scrim" aria-hidden="true"></div>')


# The footer (thread "Redesign the site footer", 2 Nov 2026). One night-indigo card that closes every page the same way:
# the line the site opens on, the one clay button, then the whole site drawn as a floor plan: five doors are five bays
# with an anchor mark at each corner, a located-blue trail and a tag that rests on the bay of the page you are reading
# and glides to the bay you point at (CSS :has, no script). "I'm here as" turns the twelve job lines into one row.
# The entity paragraph stays word for word (GEO); the wordmark is the logo's own vector, cut by the card's edge.
ROLE_ORDER = ("Plant heads", "Owners and MDs", "Production and planning", "Shift supervisors", "Lean and IE leads",
              "Safety and EHS", "Maintenance and OT", "MES and ERP owners", "IT and security", "Group operations and digital",
              "Procurement and finance", "Developers and integrators")


def door_index(url, world):
    """Which bay the tag rests on: the page's world door, else the section that lists the URL, else none (home)."""
    lab = WORLD_DOOR.get(world) if world else None
    for i, s in enumerate(NAV["sections"]):
        if s["label"] == lab or (lab is None and url != "/" and (url == s["url"] or any(u == url for _, u, _ in s["items"]))):
            return i
    return None


def footer_html(url="/", world=None):
    roles = dict(NAV["roles"])
    assert sorted(ROLE_ORDER) == sorted(roles), "every job line has a place in the footer row"
    word = re.search(r'<svg class="word" viewBox="([^"]+)"[^>]*>(.*?)</svg>', part("logo.html"), re.S)
    vb, paths = word.group(1), word.group(2).replace('fill="currentColor"', 'fill="url(#ft-wg)"')
    at = door_index(url, world)
    bays = "".join(
        f'<div class="ft-bay"{" data-here" if i == at else ""}>{A(s["url"], s["label"], " class=\"ft-door\"")}<ul>'
        + "".join(f"<li>{A(u, l)}</li>" for l, u, _ in s["items"]) + "</ul></div>" for i, s in enumerate(NAV["sections"]))
    chips = "".join(f'<li>{A(roles[r][0][1], r)}</li>' for r in ROLE_ORDER)
    style = f' style="--at:{at}"' if at is not None else ""
    return (f'<footer class="ft ds"{style}>\n<div class="ft-card">\n<div class="ft-light" aria-hidden="true"></div>\n'
            '<div class="ft-close"><h2 class="ft-line"><span>Where work is.</span> <em>Where it waits.</em></h2>\n'
            '<div class="ft-act"><a class="ft-clay" href="/contact/">Book a call</a><a class="ft-glass" href="/diagnostic/">Plan your first bay</a></div></div>\n'
            f'<nav class="ft-map" aria-label="All pages"><div class="ft-route" aria-hidden="true"><i class="ft-trail"></i><i class="ft-tag"></i></div>{bays}</nav>\n'
            f'<nav class="ft-roles" aria-label="Start from your job"><p>I\'m here as</p><ul>{chips}</ul></nav>\n'
            '<div class="ft-base">'
            f'<p class="ft-entity">{html.escape(ENTITY["long"])}</p>\n'
            '<address class="ft-reach"><a href="mailto:sales@amimotion.com">sales@amimotion.com</a><span>Locatepro Technologies Pvt Ltd</span><span>Bengaluru, India</span></address>\n'
            '<ul class="ft-small">' + "".join(f"<li>{A(u, l)}</li>" for l, u in (("Privacy", "/privacy/"), ("Trust and data", "/trust/"), ("People and privacy", "/trust/people/"))) +
            '<li><a href="https://www.youtube.com/@locateprotech" rel="me noopener">YouTube</a></li><li><a href="/llms.txt">For AI assistants</a></li></ul>\n'
            f'<p class="ft-legal">© {TODAY[:4]} Locatepro Technologies Pvt Ltd. NXP and Trimension are trademarks of NXP B.V. FiRa and omlox are trademarks of their owners. Specifications are indicative. Final datasheets are shared under NDA.</p>'
            '</div>\n'
            f'<div class="ft-word" aria-hidden="true"><svg viewBox="{vb}" preserveAspectRatio="xMidYMin meet"><defs><linearGradient id="ft-wg" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#e4e9ff" stop-opacity=".22"/><stop offset=".45" stop-color="#9aabff" stop-opacity=".08"/><stop offset=".9" stop-color="#6b7cff" stop-opacity="0"/></linearGradient></defs>'
            f'{paths}</svg></div>\n</div></footer>')


NAV_JS = '<script src="/assets/js/nav.js" defer></script>'


def scripts(meta):
    """Every page loads nav.js (deferred, cached once: the nav works without it), plus a tool's own file where it has one.
    The diagnostic's 3D floor (three.js, about 690 KB) is no longer loaded: it drew a plant in code and broke the
    first-screen budget. Its 2D sketch stays."""
    # round 19: locate.js (a module, a few KB) starts the "How it locates a tag" stage near the viewport; it pulls in
    # locate-scene.js and the one copy of three.js (assets/vendor) only then, and never with reduced motion or no WebGL
    if meta.get("layout") == "home": return NAV_JS + '\n<script src="/assets/js/stage.js" defer></script>\n<script type="module" src="/assets/js/locate.js"></script>'
    s = meta.get("scripts", "").split()
    out = [NAV_JS]
    if meta.get("layout") == "product":
        return "\n".join(out + ['<script src="/assets/js/products/site.js" defer></script>'] + [f'<script type="module" src="/assets/js/products/{x}.js"></script>' for x in s])
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


# The claims register (homepage-final.md, K03, /specs/): the only figures a page may set as a <data> element or a stat.
# A number shown big must be one of these, word for word, with its condition beside it.
REGISTER = {"±10 cm", "0.1 to 10 Hz", "1 to 3 years", "about 50 m", "3 to 8 m"}


def wire_turntable(body):
    """Render job R1 (the AmIGo turntable, round 11 cut.py `seq`: <base>-<size>-<iii>.avif at 1080 and 720) is
    wired into the hero by itself the day its frames land under assets/home/: the hero's canvas then scrubs it."""
    hits = sorted(x for x in (SRC / "assets" / "home").rglob("*-1080-000.avif") if any(k in x.name for k in ("turn", "tt")))
    if not hits: return body
    first = hits[0]; base = first.name[: -len("-1080-000.avif")]
    n = len(list(first.parent.glob(f"{base}-1080-[0-9][0-9][0-9].avif")))
    if n < 24 or not (first.parent / f"{base}-720-000.avif").exists(): return body
    src = "/" + str((first.parent / f"{base}-{{w}}-{{i}}.avif").relative_to(SRC))
    return body.replace('data-frames="0" data-frame-src=""', f'data-frames="{n}" data-frame-src="{src}"', 1)


def check_home(body):
    """Fail the build when the homepage shows a figure that is not in the register, or points at a picture that does
    not exist (an empty slot collapses to nothing; a missing src is a broken page)."""
    bad = [text_of(x) for x in re.findall(r"<data\b[^>]*>(.*?)</data>", body, re.S) if text_of(x) not in REGISTER]
    if bad: raise SystemExit(f"build: homepage figures not in the claims register: {bad}")
    refs = re.findall(r'(?<![\w-])(?:src|poster)="(/assets/[^"]+)"', body) + [u.split()[0] for ss in re.findall(r'srcset="([^"]+)"', body) for u in ss.split(",") if u.strip()]
    missing = sorted({u for u in refs if u.startswith("/assets/") and not (SRC / "assets" / u[len("/assets/"):]).exists() and not (SRC / u.lstrip("/").replace("assets/js/", "js/")).exists()})
    if missing: raise SystemExit("build: homepage pictures missing:\n  " + "\n  ".join(missing))


def build():
    if DIST.exists(): shutil.rmtree(DIST)
    (DIST / "assets").mkdir(parents=True)
    # assets/intro (the old AI-made hero turn) is no longer shipped: nothing may use it
    # shipped: fonts, CAD stills, film files. Not shipped: assets/intro (the old AI-made turn), assets/scene (the dark
    # glowing scene stills, replaced by reserved slots in round 05), vendor (three.js, no longer loaded)
    for sub in ("fonts", "img", "home", "film", "photo", "hall", "nav", "tech", "locate", "worlds", "products"):
        if (SRC / "assets" / sub).exists(): shutil.copytree(SRC / "assets" / sub, DIST / "assets" / sub)
    # three.js ships again for one use: the homepage locate stage (round 19), loaded lazily, never in the first screen
    (DIST / "assets" / "vendor").mkdir()
    for f in ("three.module.min.js", "THREE-LICENSE.txt"): shutil.copy(SRC / "assets" / "vendor" / f, DIST / "assets" / "vendor" / f)
    shutil.copytree(SRC / "js", DIST / "assets" / "js", dirs_exist_ok=True)
    nav = (SRC / "js" / "nav.js").read_text()
    nav = re.sub(r"(?m)^\s*//.*\n|\s+// [^'\n]*$", "\n", nav)
    (DIST / "assets" / "js" / "nav.js").write_text(re.sub(r"\n\s*", "\n", nav).strip() + "\n")
    pages = {}
    for f in sorted((SRC / "pages").rglob("*.html")):
        rel = f.relative_to(SRC / "pages")
        meta, body = front(f.read_text()); body = crumb_labels(body, url_for(rel))
        if url_for(rel) == "/": body = wire_turntable(body)
        pages[url_for(rel) if rel.name != "404.html" else "/404.html"] = (meta, body)
    titles = {u: m.get("crumb") or m.get("title", "").split(" | ")[0] for u, (m, _) in pages.items()}
    worlds = {u: m.get("world") for u, (m, _) in pages.items() if m.get("world")}
    covers = {u: m.get("cover") for u, (m, _) in pages.items() if m.get("cover")}
    def connect(body):
        def li(a):
            u = a.group(1)
            if u not in worlds: return a.group(0)
            cv = f' style="--cv:{covers[u]}"' if u in covers else ""
            return f'<li data-to="{worlds[u]}"{cv}><a href="{u}"'
        return re.sub(r'<nav class="related[^"]*".*?</nav>', lambda m: re.sub(r'<li><a href="([^"#]+)"', li, m.group(0)), body, flags=re.S)
    pages = {u: (m, connect(b) if m.get("world") else b) for u, (m, b) in pages.items()}
    # the field-guide shelf in the Resources panel: every guide with a cover colour, by the first line of its own title
    for u, (m, b) in sorted(pages.items()):
        t = re.search(r'<h1[^>]*>\s*<span>(.*?)</span>', b, re.S)
        if u.startswith("/learn/") and m.get("cover") and t: GUIDES.append([u, text_of(t.group(1)).strip(), m["cover"]])
    check_home(pages["/"][1])

    public = []
    for url, (meta, body) in pages.items():
        header = header_html(url, meta.get("world"), over_photo(meta, body))
        page = head(meta, url, body, titles) + "\n" + header + f'\n<main id="main" tabindex="-1">\n{body}\n</main>\n' + footer_html(url, meta.get("world")) + "\n" + scripts(meta) + "\n</body>\n</html>\n"
        if SHARE: page = relativise(page, url)
        out = DIST / ("404.html" if url == "/404.html" else url.strip("/") + "/index.html" if url != "/" else "index.html")
        out.parent.mkdir(parents=True, exist_ok=True); out.write_text(page)
        if meta.get("noindex") != "true" and url != "/404.html": public.append(url)

    # sitemap with the pictures each page carries (image search and answer engines use them)
    def imgs(url):
        """The page's share picture, then every real picture its body shows (CAD renders, photos, hall stills), in order.
        The homepage body is swapped for the studio film at integration, so it lists its share picture only."""
        meta, body = pages[url]
        found = [meta.get("og", "/assets/home/og-home.jpg")]
        if url != "/": found += re.findall(r'<img\b[^>]*?\ssrc="(/assets/[\w./-]+\.(?:webp|jpg|png))"', body)
        return "".join(f"<image:image><image:loc>{SITE}{p}</image:loc></image:image>" for p in list(dict.fromkeys(found))[:12])
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
        + "\n\n".join(f"## {k}\n\n" + "\n".join(v) for k, v in lines.items() if v) + f"\n\n## Home\n\n- [AmIMotion]({SITE}/): {pages['/'][0].get('description', '')}\n"
        + f"\n## Optional\n\n- [The full site as text]({SITE}/llms-full.txt): every public page above, as plain text, with its questions and answers.\n"
        + f"- [Sitemap]({SITE}/sitemap.xml): every public page with its pictures.\n")
    (DIST / "llms-full.txt").write_text(f"# AmIMotion: the full site as text\n\n> {ENTITY['long']}\n\n## Key facts\n\n{facts}\n\n"
        + "\n\n".join(f"## {pages[u][0].get('title')}\nURL: {SITE}{u}\n\n{text_of(pages[u][1])}" for u in sorted(public)) + "\n")

    # assets/ask.json: what the Ask field answers from, with no backend (round 14). Every public page by its nav label
    # with its short answer (or its description), every question on the site with its answer, every glossary term.
    def clip(t, n=260):
        if len(t) <= n: return t
        cut = t[:n]; dot = cut.rfind(". ")
        return cut[:dot + 1] if dot > 80 else cut.rsplit(" ", 1)[0] + "…"
    ask_pages, ask = [], []
    for u in sorted(public, key=lambda u: (u not in LABEL, u)):
        meta, body = pages[u]; i = len(ask_pages); ask_pages.append([u, LABEL.get(u) or titles[u]])
        sa = re.search(r'<p class="short-answer"[^>]*>(.*?)</p>', body, re.S)
        line = next((x for s in NAV["sections"] for _, v, x in s["items"] if v == u), "")
        ask.append([i, LABEL.get(u) or titles[u], clip(text_of(sa.group(1)) if sa else meta.get("description", ""))] + (["", line] if line else []))
        for q in faq_items(body):
            ask.append([i, q["name"], clip(q["acceptedAnswer"]["text"]), "q"])
        for t in glossary_of(body, u):
            ask.append([i, t["name"], clip(t["description"]), "#" + t["@id"].split("#")[1]])
    seen, rows = set(), []
    for r in ask:
        if (r[1].lower(), r[0]) not in seen: seen.add((r[1].lower(), r[0])); rows.append(r)
    (DIST / "assets" / "ask.json").write_text(json.dumps({"p": ask_pages, "e": rows}, ensure_ascii=False, separators=(",", ":")))

    if args.indexnow_key: (DIST / f"{args.indexnow_key}.txt").write_text(args.indexnow_key)
    # Security headers for a static host. Every script and style is first-party; inline ones are the per-page CSS, the
    # JSON-LD, the motion flag and the speculation rules, so 'unsafe-inline' stays and nothing else is allowed in.
    # connect-src names the one outside endpoint a form may post to (HubSpot forms, used once config.js names it).
    csp = ("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
           "font-src 'self'; media-src 'self' blob:; connect-src 'self' https://api.hsforms.com; frame-src 'self'; worker-src 'self' blob:; "
           "object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'self'; upgrade-insecure-requests")
    (DIST / "_headers").write_text("/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n"
        + f"  Content-Security-Policy: {csp}\n  X-Frame-Options: SAMEORIGIN\n  Cross-Origin-Opener-Policy: same-origin\n"
        + "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()\n"
        + ("  Strict-Transport-Security: max-age=31536000; includeSubDomains\n" if args.indexable else "  X-Robots-Tag: noindex, nofollow\n")
        + "\n/assets/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=2592000\n\n/llms*.txt\n  Content-Type: text/plain; charset=utf-8\n")
    print(f"built {len(pages)} pages -> {DIST}{' (share)' if SHARE else ''}{' (indexable)' if args.indexable else ' (review: noindex)'}")


if __name__ == "__main__":
    build()
