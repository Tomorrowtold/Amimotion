"""The inner-page system (round 05): blocks for every page after the homepage, in the homepage's language.

Design: team/rounds/02-design/DESIGN_SYSTEM.md. Guide for page squads: team/rounds/05-inner-pages/system-notes.md.
Each page is a list of blocks. write() turns it into src/pages/<path>.html with the front-matter comment build.py reads.

One ground, one 12-column grid, the 5:7 split, six type sizes, no cards, chips, eyebrows, pills, icons, glow,
gradients or reveals. Everything works with JavaScript off. A picture is a real AVIF/WebP ladder (still()) or a
reserved slot at its final ratio with an HTML comment naming the asset (slot()); nothing is drawn in code.

Page anatomy, in order:
    head(...)                  breadcrumbs, H1 (one or two lines), lede, the short answer, optional links and picture
    section(vp(...), block...) one heading row, then blocks: split, points, steps, figures, spec, compare, parts,
                               related (links), more (km), prose, faq
    close(...)                 one closing line with one link (or the default for the part of the site)
"""
import json, re
from pathlib import Path
from html import escape as e

ROOT = Path(__file__).resolve().parents[2]
PAGES = ROOT / "src" / "pages"
_NAV = json.loads((ROOT / "src" / "data" / "nav.json").read_text())
# one label per URL: an in-page link to a nav URL carries the nav label (homepage-final.md, Nav panels)
LABEL = {s["url"]: s["label"] for s in _NAV["sections"]}
for _s in _NAV["sections"]:
    for _l, _u, _line in _s["items"]: LABEL.setdefault(_u, _l)
_n = [11]
_crumb = [None]
_ids = set()

RATIO = {"photo": "r43", "cine": "r169", "wide": "r169", "square": "r11", "still": "r32",
         "4:3": "r43", "16:9": "r169", "3:2": "r32", "1:1": "r11"}


def label(url, fallback):
    return LABEL.get(url, fallback)


def _id(text):
    base = re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", text).lower()).strip("-")[:40] or "s"
    k, i = base, 2
    while k in _ids: k, i = f"{base}-{i}", i + 1
    _ids.add(k)
    return k


# ---------------- pictures ----------------
def slot(brief, ratio="photo", alt="", owner="Realism lab", code=None):
    """A reserved picture: a --surface block at the final aspect ratio. The comment is the shot list entry:
    asset code, brief, the alt text it will carry, and its owner. Swap the <div class="slot"> for a <picture>
    ladder (see still()) when the asset exists; nothing else on the page moves."""
    if code is None:
        _n[0] += 1; code = f"P{_n[0]:02d}"
    r = RATIO.get(ratio, "r43")
    brief = re.sub(r"\s*\b(21:9|16:9|4:3|3:2|1:1)\.", "", brief).strip()
    note = f"ASSET {code}: {brief} Final aspect {r[1:].replace('169', '16:9').replace('43', '4:3').replace('32', '3:2').replace('11', '1:1')}. AVIF + WebP ladder 800-3840."
    if alt: note += f' Alt: "{alt}"'
    note += f" Owner: {owner}."
    return f'<figure class="pic"><!-- {note.replace("--", "-")} --><div class="slot {r}" aria-hidden="true"></div></figure>'


ph = lambda brief, mood="steel", ratio="photo", code=None: slot(brief, ratio, code=code)   # the old name, same slot

# page-graded CAD stills (the founders' CAD, flattened onto the page ground; cut by team/rounds/02-design/tools/hero_images.py)
STILLS = {
    "amigo": ("/assets/home/amigo-page", (800, 1600, 2400, 3840), 7680, 4198, "The AmIGo tag in dark grey, with amimotion debossed on its top cover and a screw ear at each end."),
    "amigo-side": ("/assets/home/amigo-side", (640, 1200, 1500), 1500, 1000, "The AmIGo tag, a small dark grey tag with amimotion on its cover."),
    "amimo": ("/assets/home/amimo-page", (640, 1200, 1800), 1800, 1200, "The AmIMo anchor, a dark grey box with a network port."),
}


def still(name, sizes="(max-width:1023px) 100vw, 58vw", eager=False, alt=None):
    stem, widths, w, h, a = STILLS[name]
    ss = lambda ext: ", ".join(f"{stem}-{x}.{ext} {x}w" for x in widths)
    mid = widths[min(1, len(widths) - 1)]
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<figure class="pic still"><picture><source type="image/avif" srcset="{ss("avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{ss("webp")}" sizes="{sizes}">'
            f'<img src="{stem}-{mid}.webp" width="{w}" height="{h}" {load} decoding="async" alt="{e(alt or a)}"></picture></figure>')


def img(src, alt, w, h, ground="stone", ratio="photo", sizes=None, srcset=None):
    """Kept for old calls: a product still. Only the page-graded ladders are shipped now."""
    return still("amigo-side")


# ---------------- page head ----------------
def crumbs(trail):
    if not trail: return ""
    parts = ['<a href="/">Home</a>'] + [f'<a href="{u}">{t}</a>' if u else f'<span aria-current="page">{t}</span>' for t, u in trail]
    return '<nav class="crumbs" aria-label="Breadcrumb">' + '<span aria-hidden="true"> / </span>'.join(parts) + "</nav>"


def two(a, b=None):
    """A headline of one or two lines; each line is one sentence and breaks by meaning."""
    return f"<span>{a}</span>" + (f" <span>{b}</span>" if b else "")


def more(items):
    """A line of plain links (the homepage's 'more' line). items: (label, href). Nav URLs carry their nav label."""
    items = [(label(h, t), h) for t, h in items if h]
    if not items: return ""
    return '<p class="more">' + '<span class="sep" aria-hidden="true">·</span>'.join(f'<a href="{h}">{t}</a>' for t, h in items) + "</p>"


def head(h1, soft=None, lede=None, short=None, trail=None, actions=None, media=None, **_ignored):
    """Breadcrumbs, H1, lede, the short answer (the speakable passage), a links line, a picture.
    No buttons: Book a call lives in the bar. Links to /contact/ are dropped here for that reason.
    media: still(...) sits right of the words (5:7); slot(...) or film(...) runs full width below."""
    _crumb[0] = trail[-1][0] if trail else None
    side = media is not None and 'class="pic still"' in media
    s = f'<div class="head{" has-still" if side else ""}">\n{crumbs(trail)}\n<h1 id="page-title">{two(h1, soft)}</h1>\n<div class="words">'
    if lede: s += f'<p class="lede">{lede}</p>'
    if short: s += f'<p class="short-answer">{short}</p>'
    s += more([(t, h) for t, h in (actions or ()) if h != "/contact/"])
    s += "</div>"
    if media: s += f'\n<div class="head-pic">{media}</div>'
    return s + "\n</div>"


# ---------------- sections ----------------
def section(*blocks, id=None, label=None, **_ignored):
    """One screen of the page: a heading row (vp) and its blocks. tone, flush and tight are gone: one ground,
    one rhythm (--rhythm-m between sections), no padding patches."""
    attrs = f' id="{id}"' if id else ""
    h = re.search(r'<h2 id="([^"]+)"', "".join(b for b in blocks if b))
    if h: attrs += f' aria-labelledby="{h.group(1)}"'
    elif label: attrs += f' aria-label="{e(label)}"'
    return f'<section class="sec"{attrs}>\n' + "\n".join(b for b in blocks if b) + "\n</section>"


def vp(h2, soft=None, lede=None, level=2, **_ignored):
    """The heading row: an H2 of one or two lines, and an optional lead paragraph."""
    tag = f"h{level}"
    s = f'<{tag} id="{_id(h2)}">{two(h2, soft)}</{tag}>'
    if lede: s += f'<p class="lead">{lede}</p>'
    return s


def km(topic, kicker, title, items, link=None, *_colours, note=None):
    """'Know more', without JavaScript: a native disclosure. The summary is the topic in plain words."""
    a = more([(label(link, title), link)]) if link else ""
    n = f"<p>{note}</p>" if note else ""
    return (f'<details class="know"><summary>{title}</summary><ul>' + "".join(f"<li>{x}</li>" for x in items) + f"</ul>{n}{a}</details>")


def stats(items, three=False):
    """Figures with their condition, as a definition list: the figure, what it is, and what it depends on."""
    return '<dl class="figures">' + "".join(
        f'<div><dt>{num}</dt><dd>{lab}{f"<small>{small}</small>" if small else ""}</dd></div>' for num, lab, small in items) + "</dl>"


figures = stats


def tiles(items, cols=3):
    """Points: short headed paragraphs in a row (2, 3 or 4 across). No cards, no eyebrows: a 3-tuple's first
    item (the old eyebrow) is dropped."""
    out = []
    for it in items:
        h, p = (it[1], it[2]) if len(it) == 3 else it
        out.append(f"<li><h3>{h}</h3><p>{p}</p></li>")
    return f'<ul class="points c{cols}">' + "".join(out) + "</ul>"


points = tiles


def split(h3, paras=(), items=(), media=None, flip=False, extra=""):
    """Text and picture, 5:7 (flip: 7:5). media: still(...) or slot(...)."""
    t = '<div class="copy">' + (f"<h3>{h3}</h3>" if h3 else "") + "".join(f"<p>{p}</p>" for p in paras)
    if items: t += "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>"
    t += extra + "</div>"
    return f'<div class="split{" flip" if flip else ""}">{t}<div class="side">{media or ""}</div></div>'


def cards(items, cols=3):
    """Parts: a picture above a linked heading and one line (the homepage's screen 5 row)."""
    out = []
    for href, media, title, sub, *_go in items:
        out.append(f'<li>{media}<h3><a href="{href}">{title}</a></h3><p>{sub}</p></li>')
    return f'<ul class="parts c{cols}">' + "".join(out) + "</ul>"


parts = cards


def links(items):
    """Related pages: a linked name and one line each. Nav URLs carry their nav label."""
    return '<nav class="related" aria-label="Related pages"><ul>' + "".join(
        f'<li><a href="{h}">{label(h, t)}</a> <span>{s}</span></li>' for h, t, s in items) + "</ul></nav>"


related = links


def faq(items, title="Questions teams ask first.", soft=None):
    """Questions as native disclosures. build.py reads every plain <details> into FAQPage JSON-LD."""
    return vp(title, soft) + '<div class="faq">' + "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in items) + "</div>"


def spec(rows, note=None):
    """The specification table, 5:7. build.py reads its rows into Product and SoftwareApplication JSON-LD."""
    s = '<table class="spec"><tbody>' + "".join(f'<tr><th scope="row">{k}</th><td>{v}</td></tr>' for k, v in rows) + "</tbody></table>"
    return s + (f'<p class="note">{note}</p>' if note else "")


def compare(headers, rows, note=None):
    """A comparison table. On phones each row stacks, with the column name before each cell."""
    s = '<table class="compare"><thead><tr>' + "".join(f'<th scope="col">{h}</th>' for h in headers) + "</tr></thead><tbody>"
    for r in rows:
        s += f'<tr><th scope="row">{r[0]}</th>' + "".join(f'<td data-h="{e(h)}">{c}</td>' for h, c in zip(headers[1:], r[1:])) + "</tr>"
    return s + "</tbody></table>" + (f'<p class="note">{note}</p>' if note else "")


def steps(items):
    """Numbered steps, in order, 4 across (2 on tablets, 1 on phones). The number is plain type, never a chip."""
    return '<ol class="steps">' + "".join(f"<li><h3>{b}</h3><p>{p}</p></li>" for b, p in items) + "</ol>"


def prose(html_):
    """Running text at a readable measure (the article column)."""
    return f'<div class="prose">{html_}</div>'


def read(parts_, nav=True):
    """An article: an on-this-page list (5 columns) beside the text (7 columns). parts_: (id, h2, html)."""
    toc = ('<nav class="toc" aria-label="On this page"><ol>' + "".join(f'<li><a href="#{i}">{h}</a></li>' for i, h, _ in parts_) + "</ol></nav>") if nav else ""
    body = "".join(f'<h2 id="{i}">{h}</h2>{x}' for i, h, x in parts_)
    return f'<div class="read">{toc}{prose(body)}</div>'


def btns(actions, small=False):
    """Actions inside a tool: the first is the one button, the rest are links."""
    if not actions: return ""
    (l0, h0), rest = actions[0], actions[1:]
    return (f'<p class="acts"><a class="cta" href="{h0}">{l0}</a>' + "".join(f' <a href="{h}">{label(h, l)}</a>' for l, h in rest) + "</p>")


FILMS = {
    1: ("Where is that trolley?", "Find the asset: a worker searches the live map instead of walking the hall, and walks straight to the trolley.", "PT1M10S", "1:10"),
    2: ("The hand-off", "A robot tows a tagged trolley to the line. Both appear on one map, and the arrival is time-stamped.", "PT1M17S", "1:17"),
    3: ("Station to station", "A tagged trolley moves through kitting, machining, assembly and dispatch. Every zone entry is timed.", "PT1M25S", "1:25"),
    4: ("Ask your plant", "A supervisor asks a plain question beside the map, and an AI assistant answers from live location data.", "PT1M24S", "1:24"),
}


def film(n, caption=True):
    """A film at 16:9: poster first, controls, never autoplay, loads nothing until play."""
    name, desc, iso, mmss = FILMS[n]
    v = (f'<video controls muted playsinline preload="none" width="1600" height="900" poster="/assets/film/v6/film0{n}-poster.jpg" '
         f'data-name="{e(name)}" data-description="{e(desc)}" data-duration="{iso}" data-date="2026-10-28" aria-label="{e(name)}">'
         f'<source src="/assets/film/v6/film0{n}.mp4" type="video/mp4"></video>')
    cap = f"<figcaption>{e(name)}, {mmss}</figcaption>" if caption else ""
    return f'<figure class="pic film">{v}{cap}</figure>'


def poster(n, alt=""):
    return (f'<figure class="pic"><img class="r169" src="/assets/film/v6/film0{n}-poster.jpg" alt="{e(alt)}" width="1600" height="900" '
            'loading="lazy" decoding="async"></figure>')


# ---------------- the closing line ----------------
# One sentence and one link, chosen by the part of the site (the page can pass its own).
CLOSES = [
    (("/platform/", "/technology/", "/products/", "/specs/", "/developers/"), ("See it on a live map.", "On a short call we show the live map and an AI query, on real AmIHub data.", (("Book a call", "/contact/"),))),
    (("/solutions/", "/industries/", "/use-cases/"), ("See where location would help first.", "Six questions, two minutes.", (("Plan your first bay", "/diagnostic/"),))),
    (("/company/", "/trust/", "/pilot/", "/contact/", "/privacy/", "/start/", "/how-to-buy/"), ("Talk to the team.", "Tell us the flow you want to see. We walk through it with you.", (("Book a call", "/contact/"),))),
    (("/",), ("Questions about your own floor?", "An engineer answers them on a short call, with the live map open.", (("Book a call", "/contact/"),))),
]
DEFAULT_CLOSE = "<!--close-->"


def close(h2=None, lede="On the call we show the live map and an AI query, on real AmIHub data.", actions=(("Book a call", "/contact/"),)):
    """The page's ending: one closing line (h2 size), one supporting sentence, one link. No buttons, no kicker,
    no second action (Book a call is always in the bar)."""
    if h2 is None: return DEFAULT_CLOSE
    t, h = actions[0]
    sub = f'<span class="sub">{lede}</span>' if lede else ""
    return f'<section class="close" aria-label="Next step"><p><span>{h2}</span>{sub}<a href="{h}">{label(h, t)}</a></p></section>'


def write(path, title, description, blocks, tone=None, **meta):
    url = "/" + path.strip("/") + "/"
    pick = next(c for prefixes, c in CLOSES if any(url.startswith(x) for x in prefixes))
    blocks = [close(*pick) if b == DEFAULT_CLOSE else b for b in blocks]
    sc = meta.get("scripts", "")
    if "tools" in sc: meta["css"] = "tool"
    if "diag" in sc: meta["css"] = "diag"
    fm = {"title": title, "description": description, "crumb": _crumb[0], **meta}
    _crumb[0] = None
    _ids.clear()
    assert len(description) <= 160, (path, len(description))
    assert len(title if "AmIMotion" in title else title + " | AmIMotion") <= 65, (path, title)
    src = "<!--\n" + "\n".join(f"{k}: {v}" for k, v in fm.items() if v) + "\n-->\n" + "\n\n".join(b for b in blocks if b) + "\n"
    out = PAGES / (path.strip("/") + ".html" if path.strip("/") else "index.html")
    if path.endswith("/") and path != "/": out = PAGES / path.strip("/") / "index.html"
    if path.endswith(".html"): out = PAGES / path.strip("/")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(src)
    return out
