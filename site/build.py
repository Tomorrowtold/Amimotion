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
<script>(()=>{{const h=document.documentElement;h.classList.replace('no-js','js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!/[?&]still\\b/.test(location.search))h.classList.add('motion')}})()</script>
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
    for name, n in s["groups"]:
        yield name, s["items"][i:i + n]; i += n


def roles_html(where):
    return "".join(f'<li><span>{html.escape(r)}</span> ' + ' <span aria-hidden="true">·</span> '.join(
        A(u, l) for l, u in links) + "</li>" for r, links in NAV["roles"])


def ask_form(i, hint="Ask about tags, anchors, pilots or data"):
    return (f'<form class="nask-form" role="search" data-ask><label class="vh" for="ask-{i}">Ask a question about AmIMotion</label>'
            f'<input id="ask-{i}" type="search" placeholder="{hint}" autocomplete="off" spellcheck="false" enterkeyhint="go">'
            '</form><p class="vh" role="status" data-ask-status></p><div class="nask-out"></div>')


def header_html(url="/"):
    """The bar (round 14, team/rounds/14-nav/notes.md). Logo; the bar split in two: how it works and where it helps
    (understand), then start small and about us (decide); Ask; one button. Every panel is a native <details>, so it
    opens on click, tap and keyboard with JavaScript off and its links are in the HTML for crawlers. Inside, each
    panel splits the floor side from the review side (nav.json groups) and previews the destination in a still.
    The phone gets a full-height sheet with the same tree and a thumb dock. assets/js/nav.js adds the rest."""
    here = section_of(url)
    cur = lambda u: ' aria-current="page"' if u == url else ""
    nx = NAV["closing"]
    next_line = f'{nx[0]} {A(nx[2], nx[1])}'
    panels, secs = [], []
    for s in NAV["sections"]:
        sl = slug(s["label"]); gs = list(grouped(s))
        def row(l, u, line, where, thumb=False):
            k = PIC.get(u)
            nid = f' data-nav-id="{where}.{sl}.{slug(l)}"' if where == "header" else ""   # sheet clicks: the .sheet ancestor tells them apart
            return (f'<li><a href="{u}"{cur(u)}{nid}{f" data-k={chr(34)}{k}{chr(34)}" if k else ""}>'
                    f'{nav_pic(k) if thumb else ""}<b>{html.escape(l)}</b><span>{html.escape(line)}</span></a></li>')
        groups = "".join(f'<div class="grp"><p class="grp-name">{html.escape(n)}</p><ul>' + "".join(row(*it, "header") for it in its) + "</ul></div>" for n, its in gs)
        keys = list(dict.fromkeys(PIC[u] for _, u, _ in s["items"] if u in PIC))
        f_l, _, f_line = next(it for it in s["items"] if it[1] in PIC)
        stage = (f'<figure class="stage" aria-hidden="true"><div class="stage-pic">{"".join(nav_pic(k, i == 0) for i, k in enumerate(keys))}</div>'
                 f'<figcaption><b>{html.escape(f_l)}</b><span>{html.escape(f_line)}</span></figcaption></figure>')
        panels.append(f'<li{" class=\"here\"" if s is here else ""}><details data-panel><summary data-nav-id="header.{sl}"{" aria-current=\"true\"" if s is here else ""}>{s["label"]}</summary>'
                      f'<div class="drop g{len(gs)}"><div class="drop-head"><a class="drop-hub" href="{s["url"]}"{cur(s["url"])} data-nav-id="header.{sl}.hub">{s["label"]}</a>'
                      f'<p class="drop-next">{next_line}</p></div><div class="drop-groups">{groups}</div>{stage}</div></details></li>')
        sgroups = "".join(f'<p class="grp-name">{html.escape(n)}</p><ul class="sheet-list{" pics" if all(u in PIC for _, u, _ in its) else ""}">'
                          + "".join(row(*it, "sheet", all(u in PIC for _, u, _ in its)) for it in its) + "</ul>" for n, its in gs)
        secs.append(f'<details class="fold"{" open" if s is here else ""}><summary>{s["label"]}</summary><div class="fold-body">'
                    f'<a class="fold-hub" href="{s["url"]}"{cur(s["url"])} aria-label="{s["label"]} overview">Overview</a>{sgroups}</div></details>')
    secs.append(f'<details class="fold"><summary>Start from your job</summary><div class="fold-body"><ul class="jobs-list">{roles_html("sheet")}</ul></div></details>')
    return ('<a class="skip-link" href="#main">Skip to content</a>\n<header class="top ds">\n'
            f'<a class="logo" href="/" aria-label="AmIMotion home" data-nav-id="header.home">{part("logo.html")}</a>\n'
            f'<nav class="main" aria-label="Main"><ul class="links">{"".join(panels)}</ul></nav>\n<div class="act">'
            '<details class="nask" data-panel><summary data-nav-id="header.ask">Ask<kbd aria-hidden="true">/</kbd></summary>'
            f'<div class="drop nask-drop"><div class="nask-main">{ask_form("d")}</div>'
            f'<div class="nask-jobs"><p class="grp-name">Start from your job</p><ul class="jobs-list">{roles_html("ask")}</ul></div></div></details>'
            '<a class="cta" href="/contact/" data-nav-id="header.book-a-call">Book a call</a>\n'
            '<details class="phone" data-panel><summary data-nav-id="sheet.menu"><span class="m-open">Menu</span><span class="m-close">Close</span></summary>'
            f'<nav class="sheet" aria-label="Menu"><div class="sheet-ask">{ask_form("m", "Ask a question")}</div><div class="sheet-secs">{"".join(secs)}'
            f'<p class="sheet-next">{next_line}</p></div></nav></details></div>\n</header>\n<div class="scrim" aria-hidden="true"></div>\n'
            # the phone dock: Menu, Ask and Book a call under the thumb once the first screen is behind you
            '<div class="dock" data-dock><button type="button" class="dock-b" data-menu tabindex="-1" aria-label="Menu">'
            '<span class="m-open">Menu</span><span class="m-close">Close</span></button>'
            '<button type="button" class="dock-b" data-ask-open tabindex="-1">Ask</button>'
            '<a class="cta" href="/contact/" tabindex="-1" data-nav-id="dock.book-a-call">Book a call</a></div>')


# Footer jobs grid (M15, M19): the twelve role lines of homepage-final.md screen 7, in four columns, each column under
# one camera A crop of the model hall (stand-ins cut from hall-all until render job R8 lands). The crops are decorative.
JOB_GROUPS = [
    ("inspection", ("Shift supervisors", "Lean and IE leads", "Safety and EHS")),
    ("staging", ("Production and planning", "MES and ERP owners", "Group operations and digital")),
    ("press", ("Plant heads", "Owners and MDs", "Procurement and finance")),
    ("racks", ("Maintenance and OT", "IT and security", "Developers and integrators")),
]

# round 11 R8 job crops: the manifest's alt for each (team/rounds/11-renders/manifest.md)
JOB_ALT = {
    "inspection": "A model inspection queue: three trolleys waiting on amber pads.",
    "staging": "A model staging lane: one pallet waiting on an amber pad beside a blue path.",
    "press": "A model press, with a trolley just out of it on a blue line.",
    "racks": "Model rack rows and a forklift at the end of an aisle, with blue lines where things went.",
}


def footer_html():
    """Screen 7 of homepage-final.md: start from your job, four columns with the nav labels, the entity paragraph."""
    roles = dict(NAV["roles"])
    assert sorted(r for _, g in JOB_GROUPS for r in g) == sorted(roles), "every role line sits in one job column"
    def role(r):
        return f"<div><dt>{html.escape(r)}</dt><dd>" + ' <span aria-hidden="true">·</span> '.join(A(u, l) for l, u in roles[r]) + "</dd></div>"
    jobs = "".join(f'<li><picture><source type="image/avif" srcset="/assets/home/jobs/{c}-600.avif 600w, /assets/home/jobs/{c}-1200.avif 1200w" sizes="(max-width:560px) 100vw, (max-width:1023px) 50vw, 25vw">'
                   f'<img src="/assets/home/jobs/{c}-600.webp" srcset="/assets/home/jobs/{c}-600.webp 600w, /assets/home/jobs/{c}-1200.webp 1200w" sizes="(max-width:560px) 100vw, (max-width:1023px) 50vw, 25vw" width="1200" height="900" loading="lazy" decoding="async" alt="{JOB_ALT[c]}"></picture>'
                   f'<dl class="roles">{"".join(role(r) for r in g)}</dl></li>' for c, g in JOB_GROUPS)
    cols = "".join(f'<div>{A(s["url"], s["label"], " class=\"hub\"")}<ul>' + "".join(f"<li>{A(u, l)}</li>" for l, u, _ in s["items"]) + "</ul></div>" for s in NAV["sections"])
    return (f'<footer class="foot ds">\n<h2>Start from your job.</h2>\n<ul class="jobs">{jobs}</ul>\n'
            f'<nav class="foot-cols" aria-label="All pages">{cols}</nav>\n<div class="foot-base">'
            f'<a class="logo" href="/" aria-label="AmIMotion home">{part("logo.html")}</a>\n'
            f'<p class="entity">{html.escape(ENTITY["long"])}</p>\n'
            f'<p class="contact"><a href="mailto:sales@amimotion.com">sales@amimotion.com</a> <span aria-hidden="true">·</span> <a href="/privacy/">Privacy</a></p>\n'
            '<p class="legal">NXP and Trimension are trademarks of NXP B.V. FiRa and omlox are trademarks of their owners. Specifications are indicative. Final datasheets are shared under NDA.</p>\n'
            "</div></footer>")


NAV_JS = '<script src="/assets/js/nav.js" defer></script>'


def scripts(meta):
    """Every page loads nav.js (deferred, cached once: the nav works without it), plus a tool's own file where it has one.
    The diagnostic's 3D floor (three.js, about 690 KB) is no longer loaded: it drew a plant in code and broke the
    first-screen budget. Its 2D sketch stays."""
    if meta.get("layout") == "home": return NAV_JS + '\n<script src="/assets/js/stage.js" defer></script>'
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
    for sub in ("fonts", "img", "home", "film", "photo", "hall", "nav", "tech"):
        if (SRC / "assets" / sub).exists(): shutil.copytree(SRC / "assets" / sub, DIST / "assets" / sub)
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
    check_home(pages["/"][1])

    public = []
    for url, (meta, body) in pages.items():
        header = header_html(url)
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
    (DIST / "_headers").write_text("/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n"
        + ("" if args.indexable else "  X-Robots-Tag: noindex, nofollow\n")
        + "\n/assets/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=2592000\n\n/llms*.txt\n  Content-Type: text/plain; charset=utf-8\n")
    print(f"built {len(pages)} pages -> {DIST}{' (share)' if SHARE else ''}{' (indexable)' if args.indexable else ' (review: noindex)'}")


if __name__ == "__main__":
    build()
