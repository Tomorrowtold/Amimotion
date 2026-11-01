"""Building blocks for every page after the homepage, in the approved homepage vocabulary.

Each page is a list of blocks. write() turns it into src/pages/<path>.html with the front-matter comment
build.py reads. Picture placeholders are numbered in order across the site (P12 onward; P01–P11 are the homepage).
"""
from pathlib import Path
from html import escape as e

PAGES = Path(__file__).resolve().parents[2] / "src" / "pages"
_n = [11]
_crumb = [None]


def ph(brief, mood="steel", ratio="photo", code=None):
    if code is None:
        _n[0] += 1; code = f"P{_n[0]:02d}"
    return f'<div class="card ph mood-{mood} ratio-{ratio}"><p class="ph-brief"><b>{code}</b> {brief}</p></div>'


def img(src, alt, w, h, ground="stone", ratio="photo", sizes="(max-width: 900px) 90vw, 640px", srcset=None):
    ss = f' srcset="{srcset}"' if srcset else ""
    return (f'<div class="card ground-{ground} ratio-{ratio} product-shot"><img src="{src}"{ss} sizes="{sizes}" alt="{e(alt)}" '
            f'width="{w}" height="{h}" loading="lazy" decoding="async"></div>')


def two(a, b=None):
    return a + (f'<br><span class="soft">{b}</span>' if b else "")


def crumbs(trail):
    if not trail: return ""
    parts = ['<a href="/">Home</a>'] + [f'<a href="{u}">{t}</a>' if u else f'<span aria-current="page">{t}</span>' for t, u in trail]
    return '<nav class="crumbs" aria-label="Breadcrumb">' + '<span aria-hidden="true">/</span>'.join(parts) + "</nav>"


def btns(actions, small=False):
    if not actions: return ""
    out = []
    for i, (label, href) in enumerate(actions):
        out.append(f'<a class="btn {"btn-fill" if i == 0 else "btn-line"}{" btn-sm" if small else ""}" href="{href}">{label}</a>')
    return '<div class="actions">' + "".join(out) + "</div>"


def head(h1, soft=None, lede=None, short=None, trail=None, actions=(("Book a call", "/contact/"),), dark=False, center=False,
         media=None, short_label=None, product=False, amber=False):
    _crumb[0] = trail[-1][0] if trail else None
    cls = "page-head section" + (" dark" if dark else " light") + (" center" if center else "") + (" product-head" if product else "")
    s = f'<section class="{cls}" aria-labelledby="page-title"{" data-tone=\"dark\"" if dark else ""}>\n<div class="wrap">\n'
    s += crumbs(trail)
    if product:
        s += f'<h1 id="page-title" class="h-hero">{h1}</h1>' + (f'<p class="h3">{soft}</p>' if soft else "")
    else:
        s += f'<h1 id="page-title" class="h-hero">{two(h1, soft)}</h1>'.replace('class="soft"', 'class="soft amber"' if amber else 'class="soft"')
    if lede: s += f'<p class="lede">{lede}</p>'
    if short and not short_label: s += f'<p class="short-answer">{short}</p>'
    s += btns(actions)
    if short and short_label:
        s += f'<div class="answer-tile"><p>{short_label}</p><p class="short-answer">{short}</p></div>'
    if media: s += f'<div class="head-media">{media}</div>'
    return s + "\n</div>\n</section>"


def section(*blocks, tone="light", id=None, label=None, flush=False, tight=False):
    attrs = f' id="{id}"' if id else ""
    if label: attrs += f' aria-label="{e(label)}"'
    style = ' style="padding-top:0"' if flush else ""
    tt = ' data-tone="dark"' if tone == "dark" else ""
    return f'<section class="section{" tight" if tight else ""} {tone}"{attrs}{tt}{style}>\n<div class="wrap">\n' + "\n".join(b for b in blocks if b) + "\n</div>\n</section>"


def vp(h2, soft=None, lede=None, center=False, more=None, level=2):
    tag = f"h{level}"
    s = f'<div class="vp-head{" center" if center else ""}" data-reveal><{tag} class="h2">{two(h2, soft)}</{tag}>'
    if lede: s += f'<p class="lede" style="margin-top:20px">{lede}</p>'
    if more: s += f'<button class="more" type="button" data-km="{more}"><i aria-hidden="true"></i>Know more</button>'
    return s + "</div>"


def km(topic, kicker, title, items, link=None, h1="#66a5fa", h2="#8f7cf6", note=None):
    a = f' data-link="{link}"' if link else ""
    n = f' data-note="{e(note)}"' if note else ""
    return (f'<div class="km-src" id="km-{topic}" data-h1="{h1}" data-h2="{h2}" data-kicker="{e(kicker)}" data-title="{e(title)}"{a}{n}>'
            "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul></div>")


def stats(items, three=False):
    out = []
    for num, label, small in items:
        out.append(f'<div class="stat" data-reveal><b>{num}</b><span>{label}{f"<small>{small}</small>" if small else ""}</span></div>')
    return f'<div class="stats{" three" if three else ""}">' + "".join(out) + "</div>"


def tiles(items, cols=3):
    cls = {2: " two", 3: "", 4: " four"}[cols]
    out = []
    for it in items:
        over, h, p = (it if len(it) == 3 else (None,) + tuple(it))
        out.append(f'<div class="tile" data-reveal>{f"<p class=\"over\">{over}</p>" if over else ""}<h3>{h}</h3><p>{p}</p></div>')
    return f'<div class="tiles{cls}">' + "".join(out) + "</div>"


def split(h3, paras=(), items=(), media=None, flip=False, extra=""):
    t = f'<div data-reveal><h3 class="h3">{h3}</h3>' + "".join(f"<p>{p}</p>" for p in paras)
    if items: t += "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>"
    t += extra + "</div>"
    return f'<div class="split{" flip" if flip else ""}">{t}<div data-reveal>{media or ""}</div></div>'


def cards(items, cols=3):
    cls = {2: " two", 3: "", 4: " four"}[cols]
    out = []
    for href, media, title, sub, *go in items:
        g = f'<span class="go">{go[0]} →</span>' if go else ""
        out.append(f'<a class="pcard" href="{href}" data-reveal>{media}<b>{title}</b><span>{sub}</span>{g}</a>')
    return f'<div class="cards{cls}">' + "".join(out) + "</div>"


def links(items):
    return '<div class="link-row" style="margin-top:clamp(44px,5vw,72px)">' + "".join(
        f'<a class="link-card" href="{h}" data-reveal><b>{t}</b><span>{s}</span></a>' for h, t, s in items) + "</div>"


def faq(items, title="Questions teams ask first.", soft=None):
    return (vp(title, soft) + '<div class="faq" style="margin-top:clamp(32px,4vw,56px);max-width:980px">' +
            "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in items) + "</div>")


def spec(rows, note=None):
    s = '<div class="spec-wrap" data-reveal><table class="spec"><tbody>' + "".join(
        f'<tr><th scope="row">{k}</th><td>{v}</td></tr>' for k, v in rows) + "</tbody></table>"
    return s + (f'<p class="note">{note}</p>' if note else "") + "</div>"


def compare(headers, rows, note=None):
    s = '<div class="table-wrap" data-reveal><table class="compare"><thead><tr>' + "".join(f'<th scope="col">{h}</th>' for h in headers) + "</tr></thead><tbody>"
    for r in rows:
        s += f'<tr><th scope="row">{r[0]}</th>' + "".join(f"<td>{c}</td>" for c in r[1:]) + "</tr>"
    return s + "</tbody></table>" + (f'<p class="note">{note}</p>' if note else "") + "</div>"


def steps(items):
    return '<ol class="steps" role="list">' + "".join(f"<li data-reveal><b>{b}</b><p>{p}</p></li>" for b, p in items) + "</ol>"


FILMS = {
    1: ("Where is that trolley?", "Find the asset: a worker searches the live map instead of walking the hall, and walks straight to the trolley.", "PT1M10S", "1:10"),
    2: ("The hand-off", "A robot tows a tagged trolley to the line. Both appear on one map, and the arrival is time-stamped.", "PT1M17S", "1:17"),
    3: ("Station to station", "A tagged trolley moves through kitting, machining, assembly and dispatch. Every zone entry is timed.", "PT1M25S", "1:25"),
    4: ("Ask your plant", "A supervisor asks a plain question beside the map, and an AI assistant answers from live location data.", "PT1M24S", "1:24"),
}


def film(n, caption=True):
    name, desc, iso, mmss = FILMS[n]
    v = (f'<div class="film"><video controls muted playsinline preload="none" poster="/assets/film/v6/film0{n}-poster.jpg" '
         f'data-name="{e(name)}" data-description="{e(desc)}" data-duration="{iso}" data-date="2026-10-28" aria-label="{e(name)}">'
         f'<source src="/assets/film/v6/film0{n}.mp4" type="video/mp4"></video><span class="film-label">Simulation</span></div>')
    if not caption: return v
    return f'<figure class="film-fig" data-reveal>{v}<figcaption><b>{e(name)}</b><span>{mmss}</span></figcaption></figure>'


# The closing section changes with the part of the site, so it never reads as a template
CLOSES = [
    (("/platform/", "/technology/", "/products/", "/specs/", "/developers/"), ("See it on a live map.", "On a short call we show you the live map and an AI question, on real AmIHub data.",
        (("Book a call", "/contact/"), ("Diagnose your floor", "/diagnostic/")))),
    (("/solutions/", "/industries/", "/use-cases/"), ("Find out where your hours go.", "Six questions, two minutes. See where knowing what’s where would help you first.",
        (("Diagnose your floor", "/diagnostic/"), ("Book a call", "/contact/")))),
    (("/company/", "/trust/", "/pilot/", "/contact/", "/privacy/"), ("Talk to the people who built it.", "Tell us the flow you want to see. We’ll walk through it with you.",
        (("Book a call", "/contact/"), ("How a pilot runs", "/pilot/")))),
    (("/",), ("Questions about your own floor?", "An engineer will answer them on a short call, with the live map open.",
        (("Book a call", "/contact/"), ("Diagnose your floor", "/diagnostic/")))),
]
DEFAULT_CLOSE = "<!--close-->"


def close(h2=None, lede="On the call we show the live map and an AI query, on real AmIHub data.",
          actions=(("Book a call", "/contact/"), ("Diagnose your floor", "/diagnostic/"))):
    if h2 is None: return DEFAULT_CLOSE
    return ('<section class="section dark close-cta" aria-labelledby="close-title" data-tone="dark"><div class="wrap" data-reveal>'
            f'<h2 id="close-title" class="h2">{h2}</h2><p class="lede" style="margin:20px auto 0">{lede}</p>{btns(actions)}</div></section>')


def prose(html_):
    return f'<div class="prose" data-reveal>{html_}</div>'


def write(path, title, description, blocks, tone="light", **meta):
    url = "/" + path.strip("/") + "/"
    pick = next(c for prefixes, c in CLOSES if any(url.startswith(x) for x in prefixes))
    blocks = [close(*pick) if b == DEFAULT_CLOSE else b for b in blocks]
    fm = {"title": title, "description": description, "tone": tone, "crumb": _crumb[0], **meta}
    _crumb[0] = None
    assert len(description) <= 160, (path, len(description))
    assert len(title if "AmIMotion" in title else title + " | AmIMotion") <= 65, (path, title)
    src = "<!--\n" + "\n".join(f"{k}: {v}" for k, v in fm.items() if v) + "\n-->\n" + "\n\n".join(b for b in blocks if b) + "\n"
    out = PAGES / (path.strip("/") + ".html" if path.strip("/") else "index.html")
    if path.endswith("/") and path != "/": out = PAGES / path.strip("/") / "index.html"
    if path.endswith(".html"): out = PAGES / path.strip("/")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(src)
    return out
