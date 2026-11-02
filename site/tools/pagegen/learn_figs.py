"""Round 20 (Theo): one drawn figure per field guide, built in code, never a picture of grey boxes.

Each figure is an inline SVG in the site palette (ink, located blue, waiting amber, hairlines). Its layers are
<g data-s="<section id>">: km.js draws a layer when the reader reaches the section of the same id (desktop), or all
layers in turn as the figure comes into view (phone). With JavaScript off or reduced motion every layer shows: the
figure's end state is the still. Labels are demo data drawn by code (times, ids, minutes) or words from the page.
No two guides share a figure. /learn/anchor-planning/ and /learn/rtls/ keep their pictures and have none;
/learn/mcp-location-data/ and /learn/omlox/ are Mia's (bench.md) and have none.
"""
from html import escape as _e
import math, random

# ---------------- primitives ----------------
_d = [0]


def _n(d):
    """the stagger index inside a layer"""
    if d is None: _d[0] += 1; return _d[0]
    return d


def ln(x1, y1, x2, y2, c="k", d=None):
    return f'<path class="d {c}" d="M{x1:g} {y1:g}L{x2:g} {y2:g}" pathLength="1" style="--d:{_n(d)}"/>'


def pa(path, c="k", d=None):
    return f'<path class="d {c}" d="{path}" pathLength="1" style="--d:{_n(d)}"/>'


def bx(x, y, w, h, c="k", d=None, rx=0):
    r = f' rx="{rx}"' if rx else ""
    return f'<rect class="d {c}" x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}"{r} pathLength="1" style="--d:{_n(d)}"/>'


def fl(x, y, w, h, c="ff", d=None, rx=0):
    """a filled shape that fades in (never drawn as a line)"""
    r = f' rx="{rx}"' if rx else ""
    return f'<rect class="f {c}" x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}"{r} style="--d:{_n(d)}"/>'


def dot(x, y, r=6, c="bf", d=None):
    return f'<circle class="f {c}" cx="{x:g}" cy="{y:g}" r="{r:g}" style="--d:{_n(d)}"/>'


def tx(x, y, s, c="", a="start", d=None, extra=""):
    an = "" if a == "start" else f' text-anchor="{a}"'
    return f'<text class="f {c}" x="{x:g}" y="{y:g}"{an} style="--d:{_n(d)}"{extra}>{s}</text>'


def cnt(x, y, to, suf="", c="", a="start", fmt="", d=None, start=None):
    """a figure that counts up when its layer draws; the markup holds the end value (the still)"""
    end = f"{to // 60}:{to % 60:02d}" if fmt == "mmss" else str(to)
    f = f' data-fmt="{fmt}"' if fmt else ""
    return tx(x, y, end + suf, c, a, d, extra=f' data-count="{to}" data-suf="{_e(suf)}"{f}')


def layer(sid, *items):
    _d[0] = 0
    return f'<g data-s="{sid}">' + "".join(i for i in items if i) + "</g>"


HATCH = ('<defs><pattern id="hat" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
         '<path d="M0 0V7" class="hatch"/></pattern></defs>')


def svg(k, vb, title, body, cls=""):
    w, h = vb
    return (f'<svg class="gsvg {cls}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="gf-{k}"><title id="gf-{k}">{_e(title)}</title>'
            + HATCH.format(k=k) + body + "</svg>")


def axis(x0, x1, y, ticks, d=None):
    """a hairline time axis with hour labels"""
    s = ln(x0, y, x1, y, "h", d)
    for x, lab in ticks:
        s += ln(x, y, x, y + 6, "h", d) + tx(x, y + 24, lab, "sm soft", "middle", d)
    return s


# ---------------- 1. dwell time: one trolley's day as a timeline, the waits in amber ----------------
def dwell():
    X = lambda t: 128 + 70 * t
    rows = [("Press", 110), ("Inspection queue", 190), ("Inspection", 270), ("Dock lane", 350)]
    grid = "".join(ln(X(t), 84, X(t), 404, "g", 0) for t in range(7))
    zones = layer("zones", grid,
                  *[tx(0, y + 5, n, "lab") + ln(X(0), y, X(6), y, "h") for n, y in rows],
                  axis(X(0), X(6), 404, [(X(t), f"{7 + t:02d}:00") for t in (0, 2, 4, 6)]))
    path = (f"M{X(.2)} 110H{X(1.1)}L{X(1.25)} 190H{X(2.95)}L{X(3.05)} 270H{X(3.7)}L{X(3.85)} 350H{X(5.67)}")
    entry = layer("entry", pa(path, "b"),
                  ln(X(1.25), 172, X(1.25), 208, "k"), ln(X(2.95), 172, X(2.95), 208, "k"),
                  tx(X(1.25) - 7, 166, "08:15", "sm", "end"), tx(X(2.95) + 7, 166, "09:57", "sm"),
                  tx(X(1.25) - 7, 226, "entry", "sm soft", "end"), tx(X(2.95) + 9, 226, "exit", "sm soft"))
    inc = layer("includes", pa(f"M{X(.2)} 110H{X(1.1)}", "bar b"), pa(f"M{X(1.25)} 190H{X(2.95)}", "bar a"),
                pa(f"M{X(3.05)} 270H{X(3.7)}", "bar b"), cnt(X(2.1), 164, 102, " min", "num wt", "middle"))
    shift = layer("shift", ln(X(5), 84, X(5), 404, "dash"), tx(X(5), 74, "Shift", "sm soft", "middle"),
                  pa(f"M{X(3.85)} 350H{X(5.67)}", "bar a"), cnt(X(4.4), 326, 109, " min", "num wt", "middle"))
    now = layer("amimotion", ln(X(5.67), 300, X(5.67), 404, "k"), tx(X(5.67), 292, "now", "sm", "middle"),
                dot(X(5.67), 350, 5.5, "bf"))
    return svg("dwell", (560, 440), "One trolley's morning on a timeline: its stops in four zones, the two waits in amber, timed from zone entry to zone exit.",
               zones + entry + inc + shift + now)


# ---------------- 2. association: the trolley's tag runs all day; each job link starts and ends ----------------
def association():
    X = lambda t: 128 + 70 * t
    two = layer("two", tx(0, 124, "Trolley 14", "lab"), pa(f"M{X(0)} 120H{X(6)}", "bar b"), fl(X(0) - 2, 108, 12, 7, "ink"),
                tx(0, 290, "Job", "lab"),
                bx(X(.4), 270, X(2.6) - X(.4), 32, "k", rx=3), tx(X(1.5), 291, "Job 208", "", "middle"),
                bx(X(2.9), 270, X(5.1) - X(2.9), 32, "k", rx=3), tx(X(4), 291, "Job 209", "", "middle"))
    br = lambda a, b: (ln(X(a), 132, X(a), 270, "k") + ln(X(b), 132, X(b), 270, "k") + ln(X(a), 200, X(b), 200, "k")
                       + tx(X(a) + 6, 192, "start", "sm soft") + tx(X(b) - 6, 192, "end", "sm soft", "end"))
    life = layer("lifetime", br(.4, 2.6), br(2.9, 5.1), tx(0, 204, "Link", "lab"))
    dia = lambda x: f'<path class="f ink" d="M{x} 193l7 7-7 7-7-7z" style="--d:{_n(None)}"/>'
    hub = layer("amihub", dia(X(.4)), dia(X(2.9)), tx(X(.4) + 12, 226, "AmIHub", "sm"), tx(X(2.9) + 12, 226, "AmIHub", "sm"))
    rec = layer("record", tx(0, 384, "MES", "lab"), ln(X(0), 400, X(6), 400, "h"),
                bx(X(1.1), 364, 64, 28, "h", rx=3), tx(X(1.1) + 32, 383, "208", "sm", "middle"),
                bx(X(3.6), 364, 64, 28, "h", rx=3), tx(X(3.6) + 32, 383, "209", "sm", "middle"),
                ln(X(1.5), 302, X(1.1) + 32, 364, "dash"), ln(X(4), 302, X(3.6) + 32, 364, "dash"))
    unk = layer("unknown", fl(X(5.3), 270, X(6) - X(5.3), 32, "hat", rx=3), bx(X(5.3), 270, X(6) - X(5.3), 32, "h", rx=3),
                tx(X(5.65), 322, "unknown", "sm soft", "middle"))
    ask = layer("ask", ln(X(4.4), 84, X(4.4), 312, "k"), dot(X(4.4), 120, 5, "bf"), dot(X(4.4), 286, 5, "ink"),
                tx(X(4.4), 74, "Trolley 14 → Job 209", "sm", "middle"))
    return svg("assoc", (560, 420), "Trolley 14 carries a tag all day. Job 208, then Job 209, are linked to it, each link with a start and an end, and a gap where the job is unknown.",
               two + life + hub + rec + unk + ask)


# ---------------- 3. UWB vs RFID: a read gate against a continuous path, on one floor ----------------
def uwb_vs_rfid():
    plan = (bx(40, 170, 64, 60, "k", rx=2) + tx(72, 254, "Station", "sm soft", "middle")
            + bx(330, 106, 180, 84, "k") + bx(330, 214, 180, 84, "k") + tx(500, 130, "A", "lab", "end") + tx(500, 238, "B", "lab", "end"))
    gate = (fl(176, 138, 8, 18, "ink") + fl(176, 244, 8, 18, "ink") + ln(180, 156, 180, 244, "dash")
            + tx(180, 128, "RFID gate", "sm", "middle"))
    reads = ln(180, 192, 196, 192, "k") + ln(180, 208, 196, 208, "k") + tx(190, 182, "read 08:41", "sm", "start")
    ble = fl(312, 90, 216, 226, "hat") + tx(520, 334, "BLE area", "sm soft", "end")
    path = pa("M104 200C140 200 150 200 180 200S280 200 320 240 400 256 440 256", "b") + dot(440, 256, 7, "bf")
    observe = layer("observe", plan, gate, reads, ble, path,
                    ln(40, 420, 64, 420, "k"), tx(72, 425, "read point", "sm"),
                    fl(176, 412, 24, 16, "hat"), tx(208, 425, "zone", "sm"),
                    ln(282, 420, 306, 420, "b"), tx(314, 425, "UWB position", "sm"))
    choose = layer("choose", bx(326, 210, 188, 92, "b", rx=2), tx(440, 288, "lane B, not A", "sm", "middle"))
    wip = layer("wip", fl(412, 240, 56, 32, "a", rx=2), dot(440, 256, 7, "bf"), cnt(440, 230, 38, " min", "num wt", "middle"))
    combine = layer("combine", ln(60, 160, 84, 160, "k"), tx(72, 152, "scan", "sm", "middle"),
                    ln(180, 156, 180, 244, "k"))
    return svg("uvr", (560, 440), "One floor seen three ways: an RFID gate records a read as the trolley passes, a BLE area covers both lanes, and UWB draws the trolley's path into lane B, where it waits.",
               observe + choose + wip + combine)


# ---------------- 4. alternatives: three tapes of the same journey ----------------
def alternatives():
    P = (200, 350, 500)
    rows = (("Barcode scan", 110), ("RFID checkpoint", 240), ("UWB location", 370))
    side = layer("side", *[ln(x, 64, x, 420, "g", 0) for x in P], *[tx(x, 50, str(i + 1), "sm soft", "middle", 0) for i, x in enumerate(P)],
                 *[tx(0, y + 6, n, "lab") + ln(150, y, 548, y, "h") for n, y in rows])
    scan = layer("scan", fl(P[0] - 6, 104, 12, 12, "ink", rx=2), fl(P[2] - 6, 104, 12, 12, "ink", rx=2),
                 tx(P[0], 136, "confirmed", "sm", "middle"), tx(P[2], 136, "confirmed", "sm", "middle"),
                 tx(P[1], 136, "nothing", "sm soft", "middle"))
    check = layer("check", *[ln(x, 226, x, 254, "k") for x in P], *[tx(x, 274, "passed", "sm", "middle") for x in P],
                  tx((P[0] + P[1]) / 2, 246, "nothing", "sm soft", "middle"), tx((P[1] + P[2]) / 2, 246, "nothing", "sm soft", "middle"))
    loc = layer("loc", pa("M150 372C170 372 185 362 200 366S240 380 270 370 320 362 350 370H392", "b"),
                pa("M392 370H470", "bar a"), pa("M470 370C485 370 492 362 500 366S530 376 548 370", "b"),
                cnt(431, 352, 41, " min", "num wt", "middle"))
    effort = layer("effort", *[fl(x - 5, 398, 10, 10, "ink", rx=1) for x in (220, 300, 420, 530)],
                   tx(0, 160, "Scanners and labels", "sm soft"), tx(0, 290, "Reader antennas at each point", "sm soft"),
                   tx(0, 430, "Anchors on columns", "sm soft"))
    test = layer("test", pa("M150 452V462H548V452", "k"), tx(349, 486, "the same test", "sm", "middle"))
    return svg("alt", (560, 500), "The same trolley journey on three tapes: a scan confirms two steps, a checkpoint records three passes, and UWB location draws the whole path, with its wait in amber.",
               side + scan + check + loc + effort + test)


# ---------------- 5. accuracy: a 10 cm ruler at true size, every reading's distance from the true point ----------------
def accuracy():
    U = 37.8 / 10   # px per mm at CSS true size; the svg is set 600 px wide, one unit a CSS pixel
    x0, y0 = 111, 190
    ticks = "".join(f"M{x0 + i * U:.2f} {y0}v{-(18 if i % 10 == 0 else 11 if i % 5 == 0 else 6)}" for i in range(101))
    labels = "".join(tx(x0 + c * 10 * U, y0 + 40, str(c), "sm", "middle", 0) for c in range(0, 11))
    rnd = random.Random(7)
    good = sorted(min(abs(rnd.gauss(0, 1.9)), 5.2) for _ in range(28))   # cm from the true point
    hard = [6.3, 7.2, 8.4, 9.5]
    X = lambda cm: x0 + cm * 10 * U
    tick = lambda cm, c, h: ln(X(cm), y0 - 30, X(cm), y0 - 30 - h, c)
    body = fl(x0 - 16, y0 - 2, 100 * U + 32, 54, "surface", 0, 3) + bx(x0 - 16, y0 - 2, 100 * U + 32, 54, "h", 0, 3)
    measure = layer("measure", body, pa(f"M{x0} {y0}H{X(10):.2f}", "k", 0), pa(ticks.replace("v-", "v"), "k", 1), labels,
                    tx(X(10) + 24, y0 + 40, "cm", "sm soft", "start", 2), tx(x0, y0 + 76, "true point", "sm soft", "middle", 2),
                    *[tick(cm, "b", 30) for cm in good],
                    pa(f"M{x0} {y0 - 76}v-7H{X(max(good)):.2f}v7", "k"), tx(x0, y0 - 94, "Typical", "sm"))
    hardl = layer("hard", *[tick(cm, "ak", 50) for cm in hard], tx(X(9.5), y0 - 94, "behind racking", "sm wt", "end"))
    steel = layer("steel", fl(52, 332, 16, 16, "ink", rx=2), tx(60, 320, "anchor", "sm soft", "middle"),
                  fl(232, 420, 136, 44, "hat"), bx(232, 420, 136, 44, "h"), tx(300, 488, "racking", "sm soft", "middle"),
                  ln(68, 340, 534, 340, "b"), dot(540, 340, 7, "bf"), tx(300, 328, "direct", "sm", "middle"),
                  pa("M68 342L300 420L534 344", "dash k"), tx(318, 408, "echo", "sm"))
    age = layer("age", ln(60, 560, 540, 560, "h"), pa("M100 560H300", "bar g"), pa("M300 560H500", "bar g"),
                *[ln(x, 546, x, 574, "k") for x in (100, 300, 500)],
                tx(100, 600, "seen", "sm", "middle"), tx(300, 600, "received", "sm", "middle"), tx(500, 600, "used", "sm", "middle"))
    return svg("acc", (600, 615), "A 10 cm ruler drawn at true size. Each blue tick is one reading's distance from the true point; the amber ticks come from the hard places behind racking.",
               measure + hardl + steel + age, "true")


# ---------------- 6. WIP visibility: three layers on one point, and an empty fourth ----------------
def wip():
    def plate(cy, inner="", c="k"):
        return (f'<g transform="matrix(.866 .5 -.866 .5 300 {cy})">' + bx(0, 0, 240, 160, c, rx=2) + inner + "</g>")
    sx = lambda u, v, cy: (300 + (u - v) * .866, cy + (u + v) * .5)
    ys = {"why": 18, "job": 118, "time": 218, "loc": 318}
    lab = lambda k, s, c="lab": tx(36, ys[k] + 86, s, c)
    needs = layer("needs", plate(ys["loc"]), lab("loc", "position"), plate(ys["time"]), lab("time", "time"), plate(ys["job"]), lab("job", "job"))
    px, py = sx(170, 80, ys["loc"])
    jx, jy = sx(170, 80, ys["job"])
    tells = layer("tells",
                  plate(ys["loc"], bx(130, 40, 80, 90, "h", 0) + pa("M10 150C60 150 90 110 170 80", "b", 1) + f'<circle class="f bf" cx="170" cy="80" r="7" style="--d:2"/>', "h"),
                  plate(ys["time"], pa("M40 80H170", "bar a", 3), "h"),
                  plate(ys["job"], bx(140, 50, 60, 60, "k", 4, 3), "h"),
                  ln(px, py, jx, jy, "k", 5), dot(sx(170, 80, ys["time"])[0], sx(170, 80, ys["time"])[1], 4, "ink", 5), dot(jx, jy, 4, "ink", 6),
                  cnt(36, ys["time"] + 110, 42, " min", "num wt", d=6))
    nt = layer("not", plate(ys["why"], "", "dash"), lab("why", "why", "lab soft"))
    start = layer("start", plate(ys["loc"], bx(112, 22, 116, 126, "b dash", 0), "h0"), tx(36, ys["loc"] + 110, "one bay", "sm soft"))
    return svg("wip", (560, 560), "WIP visibility as three layers over one trolley: its position, the time it has waited, and its job. A fourth layer, why it waits, stays empty.",
               needs + tells + nt + start)


# ---------------- 7. location data quality: the last-seen point grows old ----------------
def quality():
    racks = fl(120, 130, 320, 30, "hat") + bx(120, 130, 320, 30, "h") + fl(120, 280, 320, 30, "hat") + bx(120, 280, 320, 30, "h")
    anchors = "".join(fl(x - 7, y - 7, 14, 14, "ink", rx=2) for x, y in ((44, 84), (516, 84), (44, 356), (516, 356)))
    why = layer("why", racks, anchors,
                pa("M30 340C120 340 150 220 240 220H400", "b"), dot(400, 220, 7, "bf"))
    fresh = layer("fresh", tx(20, 36, "age", "sm soft"), cnt(60, 36, 252, "", "num", fmt="mmss"),
                  pa("M120 31H330", "bar g"), f'<circle class="f fade" cx="400" cy="220" r="8" style="--d:3"/>')
    show = layer("show", ln(400, 220, 420, 246, "k"), tx(424, 262, "last seen 10:42:07", "sm"))
    anch = layer("anchors", bx(509, 349, 14, 14, "h0", rx=2), ln(506, 346, 526, 366, "k"), ln(526, 346, 506, 366, "k"),
                 tx(516, 396, "dark", "sm", "middle"))
    check = layer("check", *[ln(30 + i * 13, 430, 30 + i * 13, 446, "b") for i in range(20)], ln(30, 454, 540, 454, "h"),
                  tx(540, 446, "quiet", "sm soft", "end"), tx(30, 476, "reports", "sm soft"))
    return svg("qual", (560, 490), "A trolley's trail ends between two racks. Its last-seen point fades as its age counts up, and one anchor goes dark.",
               why + fresh + show + anch + check)


# ---------------- 8. value without MES: location and time fill first, the job column later ----------------
def value():
    cols = (("Location", 100), ("Time", 260), ("Job", 420))
    ys = (110, 190, 270, 350)
    bars = (90, 56, 124, 72)
    spots = ((40, 6), (22, -8), (52, 4), (30, 10))
    alone = layer("alone", tx(cols[0][1], 50, cols[0][0], "lab"), tx(cols[1][1], 50, cols[1][0], "lab"),
                  ln(0, 66, 560, 66, "h", 0), *[tx(0, y + 5, f"Week {i + 1}", "sm soft", d=0) + ln(0, y + 40, 560, y + 40, "h", 0) for i, y in enumerate(ys)],
                  *[pa(f"M100 {y + 14}C130 {y + 14} {120 + spots[i][0]} {y + spots[i][1]} {150 + spots[i][0]} {y + spots[i][1]}", "b") + dot(150 + spots[i][0], y + spots[i][1], 6, "bf")
                    + pa(f"M{260} {y}H{260 + bars[i]}", "bar a") for i, y in enumerate(ys)])
    later = layer("later", tx(cols[2][1], 50, cols[2][0], "lab"),
                  *[bx(420, y - 18, 110, 36, "dash", rx=3) for y in ys[:2]],
                  *[bx(420, y - 18, 110, 36, "k", rx=3) + tx(475, y + 6, f"Job {n}", "sm", "middle") for y, n in zip(ys[2:], (208, 214))])
    plan = layer("plan", ln(475, 408, 475, 440, "k"), pa("M469 434L475 442L481 434", "k"), tx(475, 462, "MES", "sm", "middle"))
    return svg("mes", (560, 470), "Four pilot weeks in a table: the location and time columns fill from week one; the job column fills only once trolleys are linked to jobs.",
               alone + later + plan)


# ---------------- 9. pilot baseline: tally marks before any tag goes on ----------------
def baseline():
    days = ("Mon", "Tue", "Wed", "Thu", "Fri")
    n = (7, 9, 6, 11, 8)

    def tally(x, y, k):
        s = ""
        for i in range(k):
            g, j = divmod(i, 5)
            gx = x + g * 64
            s += ln(gx + 4, y + 18, gx + 52, y - 2, "k") if j == 4 else ln(gx + j * 12, y - 6, gx + j * 12, y + 22, "k")
        return s
    what = layer("what", tx(0, 40, "Before", "lab"), *[tx(0, 96 + i * 56, dd, "sm soft", d=0) for i, dd in enumerate(days)],
                 *[tally(56, 88 + i * 56, k) + tx(250, 104 + i * 56, str(k), "num", "end") for i, k in enumerate(n)])
    how = layer("how", tx(300, 40, "After", "lab"), ln(280, 24, 280, 340, "h", 0),
                *[ln(300, 110 + i * 56, 540, 110 + i * 56, "dash") for i in range(5)], tx(300, 360, "same flow, shifts and product mix", "sm soft"))
    A = lambda v: 40 + v * 30
    claim = layer("claim", ln(A(0), 420, A(12), 420, "h", 0), *[ln(A(v), 420, A(v), 426, "h", 0) + tx(A(v), 446, str(v), "sm soft", "middle", 0) for v in (0, 4, 8, 12)],
                  *[dot(A(k), 410, 5, "ink") for k in n], pa(f"M{A(min(n))} 392v-6H{A(max(n))}v6", "k"), tx((A(min(n)) + A(max(n))) / 2, 378, "spread", "sm", "middle"))
    tool = layer("tool", pa(f"M{A(12) + 10} 410H{A(12) + 40}", "k"), pa(f"M{A(12) + 34} 404L{A(12) + 41} 410L{A(12) + 34} 416", "k"),
                 tx(A(12) + 48, 415, "hours a year", "sm"))
    return svg("base", (560, 460), "A tally of searches for each day of one week, counted before any tag goes on, beside an empty sheet for after, and the spread of the five days.",
               what + how + claim + tool)


# ---------------- 10. UWB RTLS in India: the seven questions tick down, and the one suppliers skip ----------------
def india():
    rows = ("Accuracy", "Anchors", "Data", "Interfaces", "Standards", "Support", "Pilot")
    y = lambda i: 52 + i * 50
    who = layer("who", *[tx(0, y(i) + 6, str(i + 1), "num soft", d=0) + tx(44, y(i) + 6, r, "lab") + bx(512, y(i) - 12, 22, 22, "h", rx=3)
                         + ln(0, y(i) + 25, 560, y(i) + 25, "h", 0) for i, r in enumerate(rows)])
    seven = layer("seven", *[pa(f"M517 {y(i)}l5 5 9-11", "k") for i in range(7)])
    skip = layer("skip", bx(0, 414, 560, 72, "ak", rx=4), tx(20, 448, "8", "num wt"), tx(56, 448, "Which job is on the trolley?", "big"),
                 tx(56, 472, "the question suppliers skip", "sm soft"))
    am = layer("amimotion", *[ln(300, y(i), 490, y(i), "b") + dot(490, y(i), 4, "bf") for i in range(7)])
    return svg("india", (560, 500), "Seven questions for any UWB RTLS supplier, each ticked off, and an eighth set apart: which job is on the trolley.",
               who + seven + skip + am)


FIGS = {"dwell-time": dwell, "association": association, "uwb-vs-rfid": uwb_vs_rfid, "alternatives": alternatives,
        "accuracy": accuracy, "wip-visibility": wip, "location-data-quality": quality, "value-without-mes": value,
        "pilot-baseline": baseline, "uwb-rtls-india": india}


def figure(slug):
    f = FIGS.get(slug)
    return f'<figure class="gfig" data-gfig>{f()}</figure>' if f else ""
