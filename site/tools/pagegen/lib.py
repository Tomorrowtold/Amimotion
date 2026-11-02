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
_eager = [False]   # set by head(): the head's own picture loads first, not lazily

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
# model-hall stills (round 08, team/rounds/08-pictures/stills-index.md): base -> (widths, intrinsic w, h)
HALL_DIR = ROOT / "src" / "assets" / "hall"
_HALL_SIZE = {"r169": ((800, 1600, 2400, 3840), 3840, 2160), "r43": ((800, 1600, 2400), 2880, 2160), "r32": ((800, 1600, 2400), 3240, 2160)}


def _rungs(base):
    return tuple(x for x in (800, 1200, 1600, 2400, 3840) if (HALL_DIR / f"{base}-{x}.webp").exists())


def _hall_src(base, widths, w, h, alt, sizes, crop=None, eager=False):
    ss = lambda ext: ", ".join(f"/assets/hall/{base}-{x}.{ext} {x}w" for x in widths if (HALL_DIR / f"{base}-{x}.{ext}").exists())
    src = min((x for x in widths if x >= 1600), default=widths[-1])
    cls = f' class="{crop}"' if crop else ""
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    av = ss("avif")
    return (f'<picture>' + (f'<source type="image/avif" srcset="{av}" sizes="{sizes}">' if av else "")
            + f'<source type="image/webp" srcset="{ss("webp")}" sizes="{sizes}">'
            f'<img{cls} src="/assets/hall/{base}-{src}.webp" width="{w}" height="{h}" {load} decoding="async" alt="{e(alt)}"></picture>')


def hall(base, ratio, alt, sizes=None, eager=False):
    """A Sky Ground model-hall still as an AVIF/WebP ladder at its intrinsic ratio. Returns None if the files are not
    in src/assets/hall yet, so the caller can fall back to a stand-in."""
    r = RATIO.get(ratio, "r43")
    _, w, h = _HALL_SIZE.get(r, _HALL_SIZE["r43"])
    if base == "hall-trolley-43": w, h = 2400, 1800
    widths = _rungs(base)
    if 1600 not in widths: return None   # a ladder without its 1600 rung is still being cut: the first screen would fetch 3840

    sizes = sizes or ("100vw" if r == "r169" else "(max-width:1023px) 100vw, 58vw")
    return f'<figure class="pic {r}-pic">{_hall_src(base, widths, w, h, alt, sizes, eager=eager)}</figure>'


# Stand-ins (round 13): until a briefed still lands, a slot shows the nearest still that exists, with that still's own
# true alt, cropped to the slot's ratio. The brief stays in an HTML comment, and the real still replaces the stand-in on
# the next build with no other change. Order per ratio = preference; a page cycles through them so one page does not
# repeat one picture.
WAITS_ALT = "A model factory floor with paths in blue and waits in amber."
ALL_ALT = ("A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. "
           "Three trolleys at inspection and one pallet in a staging lane are marked amber because they are waiting.")
QUEUE_ALT = ("A model inspection station. One trolley is being worked on. Three trolleys in the queue in front of it and one pallet "
             "in a staging lane are marked amber because they are waiting.")
STANDIN = {   # base, intrinsic w, h, alt (when shown whole), alt when cropped
    "r169": [("hall-all", 3840, 2160, ALL_ALT, WAITS_ALT), ("hall-waits", 3840, 2160, WAITS_ALT, WAITS_ALT)],
    "r43": [("hall-waits-43", 2880, 2160, QUEUE_ALT, QUEUE_ALT), ("hall-waits-32", 3240, 2160, WAITS_ALT, WAITS_ALT), ("hall-all", 3840, 2160, ALL_ALT, WAITS_ALT)],
    "r32": [("hall-waits-32", 3240, 2160, WAITS_ALT, WAITS_ALT), ("hall-waits-43", 2880, 2160, QUEUE_ALT, QUEUE_ALT), ("hall-all", 3840, 2160, ALL_ALT, WAITS_ALT)],
    "r11": [("hall-waits-43", 2880, 2160, QUEUE_ALT, QUEUE_ALT), ("hall-waits-32", 3240, 2160, WAITS_ALT, WAITS_ALT)],
}
_turn = [0]
NATIVE = {"hall-all": "r169", "hall-waits": "r169", "hall-waits-43": "r43", "hall-waits-32": "r32"}


def standin(ratio, sizes=None, note="", eager=False):
    r = RATIO.get(ratio, "r43")
    opts = [o for o in STANDIN.get(r, STANDIN["r43"]) if 1600 in _rungs(o[0])]
    if not opts: return None
    base, w, h, alt, alt_crop = opts[_turn[0] % len(opts)]; _turn[0] += 1
    crop = None if NATIVE.get(base) == r else f"crop {r}"
    sizes = sizes or ("100vw" if r == "r169" else "(max-width:1023px) 100vw, 58vw")
    com = f"<!-- {note.replace('--', '-')} Stand-in: {base}. -->" if note else ""
    return f'<figure class="pic {r}-pic standin">{com}{_hall_src(base, _rungs(base), w, h, alt_crop if crop else alt, sizes, crop, eager)}</figure>'


def slot(brief, ratio="photo", alt="", owner="Realism lab", code=None, base=None, sizes=None):
    """A reserved picture: a --surface block at the final aspect ratio. The comment is the shot list entry:
    asset code, brief, the alt text it will carry, and its owner. With base=, the model-hall still of that name is
    used as soon as its ladder is in src/assets/hall; until then the slot stays and nothing else on the page moves."""
    if base:
        got = hall(base, ratio, alt, sizes, eager=_eager[0])
        if got: return got
    if code is None:
        _n[0] += 1; code = f"P{_n[0]:02d}"
    r = RATIO.get(ratio, "r43")
    brief = re.sub(r"\s*\b(21:9|16:9|4:3|3:2|1:1)\.", "", brief).strip()
    note = f"ASSET {code}: {brief} Final aspect {r[1:].replace('169', '16:9').replace('43', '4:3').replace('32', '3:2').replace('11', '1:1')}. AVIF + WebP ladder 800-3840."
    if alt: note += f' Alt: "{alt}"'
    note += f" Owner: {owner}."
    got = standin(ratio, sizes, note, eager=_eager[0])
    if got: return got
    return f'<figure class="pic"><!-- {note.replace("--", "-")} --><div class="slot {r}" aria-hidden="true"></div></figure>'


ph = lambda brief, mood="steel", ratio="photo", code=None: slot(brief, ratio, code=code)   # the old name, same slot

# page-graded CAD stills (the founders' CAD, flattened onto the page ground; cut by team/rounds/02-design/tools/hero_images.py)
STILLS = {
    "amigo": ("/assets/home/amigo-page", (800, 1600, 2400, 3840), 7680, 4198, "The AmIGo tag in dark grey, with amimotion debossed on its top cover and a screw ear at each end."),
    "amigo-side": ("/assets/home/amigo-side", (640, 1200, 1500), 1500, 1000, "The AmIGo tag, a small dark grey tag with amimotion on its cover."),
    "amimo": ("/assets/home/amimo-page", (640, 1200, 1800), 1800, 1200, "The AmIMo anchor, a dark grey box with a network port."),
    # pair_scale.png (round 07 specs and company briefs): AmIGo and AmIMo at true scale
    "pair": ("/assets/home/pair", (800, 1600, 2400), 2400, 1600, "The AmIGo tag in front of the larger AmIMo anchor, both dark grey."),
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


def head(h1, soft=None, lede=None, short=None, trail=None, actions=None, media=None, stage=None, offer=None, **_ignored):
    """Breadcrumbs, H1, lede, the short answer (the speakable passage), a links line, a picture.
    No buttons: Book a call lives in the bar. Links to /contact/ are dropped here for that reason.
    media: still(...) sits right of the words (5:7); a hall still or film runs full bleed below, pushed in on scroll.
    stage="AmIGo": the product stage (round 13, Rivian): the product's name set giant behind the render on the
    sweep, the H1 and words under it. offer=True: the offer as the headline beside a large still (Formlabs)."""
    _crumb[0] = trail[-1][0] if trail else None
    if media: media = media.replace('loading="lazy"', 'fetchpriority="high"', 1)
    side = media is not None and 'class="pic still"' in media
    kind = " prod" if stage else " offer" if offer else " has-still" if side else " has-bleed" if media else ""
    s = f'<div class="head{kind}">\n{crumbs(trail)}\n'
    if stage:
        s += f'<div class="prod-stage"><span class="prod-name" aria-hidden="true">{stage}</span>{media}</div>\n'
    s += f'<h1 id="page-title">{two(h1, soft)}</h1>\n<div class="words">'
    if lede: s += f'<p class="lede">{lede}</p>'
    if short: s += f'<p class="short-answer">{short}</p>'
    s += more([(t, h) for t, h in (actions or ()) if h != "/contact/"])
    s += "</div>"
    if media and not stage: s += f'\n<div class="head-pic">{media}</div>'
    return s + "\n</div>"


def localnav(name, items, href="#page-title", sections=False):
    """The sticky local bar (round 13, Apple product nav and NVIDIA's section bar): the page's name, its sections and
    Book a call, 52 px, under the global bar once that scrolls away. Plain in-page links; inner.js marks the section
    in view. It is a nav, so crawlers read it as chrome, not content."""
    li = "".join(f'<li><a href="{h}">{t}</a></li>' for t, h in items)
    return (f'<nav class="local{" sections" if sections else ""}" aria-label="{e(name)}"><a class="local-name" href="{href}">{name}</a>'
            f'<ul>{li}</ul><a class="cta pill" href="/contact/">Book a call</a></nav>')


# ---------------- sections ----------------
def section(*blocks, id=None, label=None, band=None, **_ignored):
    """One screen of the page: a heading row (vp) and its blocks. Bands (round 13, M10): the page steps from the
    ground to a full-bleed surface band where the reading changes (questions, spec tables, the closer look), and the
    close is the action band. band="surface" or band=False to override the automatic choice."""
    attrs = f' id="{id}"' if id else ""
    body = "".join(b for b in blocks if b)
    h = re.search(r'<h2 id="([^"]+)"', body)
    if h: attrs += f' aria-labelledby="{h.group(1)}"'
    elif label: attrs += f' aria-label="{e(label)}"'
    if band is None: band = "surface" if ('class="faq"' in body or 'class="spec"' in body or 'class="closer"' in body) else None
    cls = "sec" + (f" band {band}" if band else "") + (" has-lead" if re.search(r'</h2><p class="lead', body) else "")
    return f'<section class="{cls}"{attrs}>\n' + "\n".join(b for b in blocks if b) + "\n</section>"


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


def stats(items, three=False, giant=False):
    """Figures with their condition, as a definition list: the figure, what it is, and what it depends on.
    Set at stat size with tabular numerals, a hairline over each (Lumafield). giant=True sets the first figure at
    the giant size with its condition beside it (Waymo), the rest as the strip under it. Every figure is text."""
    items = list(items)
    top = ""
    if giant and items:
        num, lab, small = items.pop(0)
        top = (f'<div class="giant"><p class="giant-num"><data value="{e(re.sub("<[^>]+>", "", num))}">{num}</data></p>'
               f'<p class="giant-cond"><b>{lab}.</b> {small}</p></div>' if small else "")
    keep = lambda x: re.sub(r"(\d) (cm|m|Hz|years|°C)\b", "\\1\u00a0\\2", x)
    items = [(keep(n), l, sm) for n, l, sm in items]
    return top + '<dl class="figures">' + "".join(
        f'<div><dt>{num}</dt><dd>{lab}{f"<small>{small}</small>" if small else ""}</dd></div>' for num, lab, small in items) + "</dl>"


figures = stats


def tiles(items, cols=3, head="h", big=False):
    """Points: short headed paragraphs in a row (2, 3 or 4 across). No cards, no eyebrows. Items are (heading, text);
    old 3-tuples (eyebrow, heading, text) keep one of the two as the heading: head="h" (default) keeps the heading,
    head="over" makes the old eyebrow the heading and opens the text with the old heading (no word lost).
    With head="h" the eyebrow is dropped."""
    out = []
    for it in items:
        if len(it) == 3 and head == "over": h, p = it[0], f"{it[1].rstrip('.')}. {it[2]}"
        else: h, p = (it[1], it[2]) if len(it) == 3 else it
        out.append(f"<li><h3>{h}</h3><p>{p}</p></li>")
    return f'<ul class="points c{cols}{" pillars" if big else ""}">' + "".join(out) + "</ul>"


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


def links(items, pics=None):
    """Related pages: a linked name and one line each. Nav URLs carry their nav label.
    pics={href: picture} turns the list into illustrated tiles (round 13, The Pudding): the picture sits above
    the name and is part of the same link."""
    if pics:
        return '<nav class="related tiles" aria-label="Related pages"><ul>' + "".join(
            f'<li><a href="{h}">{pics.get(h) or ""}<b>{label(h, t)}</b></a> <span>{s}</span></li>' for h, t, s in items) + "</ul></nav>"
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


def compare(headers, rows, note=None, cls=""):
    """A comparison table. On phones each row stacks, with the column name before each cell."""
    s = f'<table class="compare{(" " + cls) if cls else ""}"><thead><tr>' + "".join(f'<th scope="col">{h}</th>' for h in headers) + "</tr></thead><tbody>"
    for r in rows:
        s += f'<tr><th scope="row">{r[0]}</th>' + "".join(f'<td data-h="{e(h)}">{c}</td>' for h, c in zip(headers[1:], r[1:])) + "</tr>"
    return s + "</tbody></table>" + (f'<p class="note">{note}</p>' if note else "")


def steps(items, big=False):
    """Numbered steps, in order, 4 across (2 on tablets, 1 on phones). The number is plain type, never a chip.
    big=True: flat columns set large (round 13, iPhone 'Why buy here')."""
    return f'<ol class="steps{" pillars" if big else ""}">' + "".join(f"<li><h3>{b}</h3><p>{p}</p></li>" for b, p in items) + "</ol>"


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
    v = (f'<video controls muted playsinline preload="none" width="1600" height="900" poster="/assets/film/v6/film0{n}-poster-1600.webp" '
         f'data-name="{e(name)}" data-description="{e(desc)}" data-duration="{iso}" data-date="2026-10-28" aria-label="{e(name)}">'
         f'<source src="/assets/film/v6/film0{n}.mp4" type="video/mp4"></video>')
    cap = f"<figcaption>{e(name)}, {mmss}</figcaption>" if caption else ""
    return f'<figure class="pic film">{v}{cap}</figure>'


def poster(n, alt="", sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 31vw"):
    """A film's poster as a picture (AVIF/WebP, 800 and 1600), for lists of films."""
    st = f"/assets/film/v6/film0{n}-poster"
    ss = lambda x: f"{st}-800.{x} 800w, {st}-1600.{x} 1600w"
    return (f'<figure class="pic"><picture><source type="image/avif" srcset="{ss("avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{ss("webp")}" sizes="{sizes}">'
            f'<img class="r169" src="{st}-800.webp" alt="{e(alt)}" width="1600" height="900" loading="lazy" decoding="async"></picture></figure>')


# ---------------- round 13: product and explainer blocks ----------------
# more angles of the founders' CAD (round 02 renders, retinted to Sky Ground in round 04): webp ladders in assets/img.
# They stand in for the R9 closer-look turntable angles until those land; same parts, same dark grey plastic.
CAD = {
    "amigo-card": ("/assets/img/amigo-card", (900, 1600), 1600, 1079),
    "amigo-top": ("/assets/img/amigo-top", (900, 1600), 1600, 1065),
    "amigo-macro": ("/assets/img/amigo-macro", (1000, 2000), 2000, 954),
    "amimo-3q": ("/assets/img/amimo-3q", (900, 1600), 1600, 1023),
    "amimo-a": ("/assets/img/amimo-a", (900, 1600), 1600, 982),
    "amimo-side": ("/assets/img/amimo-side", (900, 1600), 1600, 881),
}


def cad(name, alt, sizes="(max-width:1023px) 100vw, 58vw"):
    if name in STILLS: return still(name, sizes, alt=alt)
    stem, widths, w, h = CAD[name]
    ss = ", ".join(f"{stem}-{x}.webp {x}w" for x in widths)
    return (f'<figure class="pic still"><img src="{stem}-{widths[-1]}.webp" srcset="{ss}" sizes="{sizes}" width="{w}" height="{h}" '
            f'loading="lazy" decoding="async" alt="{e(alt)}"></figure>')


def closer(items, h3=None):
    """Closer look (round 13, AirPods): a list of features on the left; choosing one turns the product to the angle
    that shows it. items: (heading, text, picture). With JavaScript off every feature shows with its own picture,
    in order. The words are real DOM text; the pictures are CAD stills."""
    li = "".join(f'<li><h3>{h}</h3>{f"<p>{p}</p>" if p else ""}{m}</li>' for h, p, m in items)
    return f'<div class="closer" data-closer>' + (f'<p class="closer-h">{h3}</p>' if h3 else "") + f'<ol>{li}</ol></div>'


EXPLAIN_SVG = """<svg class="ex-svg" viewBox="0 0 640 480" role="img" aria-labelledby="ex-t"><title id="ex-t">{title}</title>
<g class="ex-plan" fill="none" stroke="currentColor" stroke-width="1"><rect x="20.5" y="20.5" width="600" height="340"/><path d="M20 120h120M20 260h120M500 20v110M500 250v110M240 360v-70h160v70"/><rect x="180.5" y="60.5" width="80" height="40"/><rect x="380.5" y="60.5" width="80" height="40"/><rect x="180.5" y="220.5" width="80" height="40"/></g>
<g class="ex-rays" stroke-width="1.5" fill="none">{rays}</g>
<g class="ex-anchors"><rect data-a="0" x="36" y="36" width="16" height="16" rx="2"/><rect data-a="1" x="588" y="36" width="16" height="16" rx="2"/><rect data-a="2" x="312" y="330" width="16" height="16" rx="2"/></g>
<g class="ex-tag" data-tag data-at="{tx},{ty}" transform="translate({tx} {ty})"><rect class="ex-trolley" x="-22" y="-14" width="44" height="28" rx="3"/><circle class="ex-pulse" r="7"/><circle class="ex-dot" r="7"/></g>
<g class="ex-bars"><rect x="20" y="396" width="600" height="1" class="ex-base"/><g data-bar="0"><rect x="20" y="404" width="12" height="12" rx="2" class="ex-key"/><rect class="ex-bar" x="44" y="408" height="4" width="{w0}"/></g><g data-bar="1"><rect x="20" y="428" width="12" height="12" rx="2" class="ex-key"/><rect class="ex-bar" x="44" y="432" height="4" width="{w1}"/></g><g data-bar="2"><rect x="20" y="452" width="12" height="12" rx="2" class="ex-key"/><rect class="ex-bar" x="44" y="456" height="4" width="{w2}"/></g></g>
</svg>"""


def explain(steps_, title):
    """The sticky explainer (round 13, M04, Helion): one pinned drawing of a bay seen from above (three anchors, one
    tagged trolley) beside steps that scroll past it. Each step lights one part of the drawing: the pulse, the
    arrival-time bars, the angles, the solved dot. With JavaScript off, every layer shows (the end state) and the
    steps read as a list. With it, the tag can also be dragged and the bars and angles follow (ciechanowski)."""
    li = "".join(f'<li data-step="{i}"><h3>{h}</h3><p>{p}</p></li>' for i, (h, p) in enumerate(steps_, 1))
    T, A = (230, 170), ((44, 44), (596, 44), (320, 338))
    rays = "".join(f'<line data-ray="{k}" x1="{x}" y1="{y}" x2="{T[0]}" y2="{T[1]}"/>' for k, (x, y) in enumerate(A))
    w = {f"w{k}": round(((T[0] - x) ** 2 + (T[1] - y) ** 2) ** .5 * .82) for k, (x, y) in enumerate(A)}
    svg = EXPLAIN_SVG.format(title=e(title), rays=rays, tx=T[0], ty=T[1], **w)
    return (f'<div class="explain" data-explain><div class="ex-stage">{svg}</div>'
            f'<ol class="ex-steps">{li}</ol></div>')


def qstart(question, opts, href="/diagnostic/", param="assets"):
    """The diagnostic's first question inline (round 13, Mercury): its answers as plain links that open the
    diagnostic with that answer chosen. Works with JavaScript off."""
    return (f'<div class="qstart"><p class="qstart-q">{question}</p><ul>'
            + "".join(f'<li><a href="{href}?{param}={v}">{t}</a></li>' for v, t in opts) + "</ul></div>")


def jsonld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


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
    joined = "".join(b for b in blocks if b)
    if any(k in joined for k in ('class="local', "data-closer", "data-explain")):
        meta["scripts"] = (meta.get("scripts", "") + " inner").strip()
    sc = meta.get("scripts", "")
    if "tools" in sc: meta["css"] = "tool"
    if "diag" in sc: meta["css"] = "diag"
    fm = {"title": title, "description": description, "crumb": _crumb[0], **meta}
    _crumb[0] = None
    _ids.clear()
    _turn[0] = 0
    assert len(description) <= 160, (path, len(description))
    assert len(title if "AmIMotion" in title else title + " | AmIMotion") <= 65, (path, title)
    src = "<!--\n" + "\n".join(f"{k}: {v}" for k, v in fm.items() if v) + "\n-->\n" + "\n\n".join(b for b in blocks if b) + "\n"
    out = PAGES / (path.strip("/") + ".html" if path.strip("/") else "index.html")
    if path.endswith("/") and path != "/": out = PAGES / path.strip("/") / "index.html"
    if path.endswith(".html"): out = PAGES / path.strip("/")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(src)
    return out


def hallslot(base, *a, **k):
    """slot(...) that becomes the model-hall still `base` once its ladder exists (round 08 stills index)."""
    return slot(*a, base=base, **k)
