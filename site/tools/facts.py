#!/usr/bin/env python3
"""AmIMotion supplier facts: one file (src/data/facts.json) for the site, the structured data, /facts.json, the
Facts page, llms.txt and Ask AmIMotion.

  python3 tools/facts.py sync             write the Ask copy (FACTS and the barred wording) into src/js/agent-core.js
  python3 tools/facts.py check            fail if agent-core.js differs from facts.json
  python3 tools/facts.py gate <built>     the claims gate on a built site (site/dist or studio/out); exit 1 on any problem
  python3 tools/facts.py selftest         the gate's own regression (wrong sentences it must stop, site wordings it must pass)
  python3 tools/facts.py list             the approved facts, then the held ones with their reasons

The gate fails when:
  - agent-core.js, the built /facts.json or the Facts page disagrees with facts.json;
  - a page states a fact on a topic the file governs (accuracy, coverage, battery, latency and scale, standards and
    certification, cabling, hosting, where it runs, made in India, the company, contact, team, founding year, modules
    planned for later, timing precision, phones) in a wording the file does not hold, or without its qualifier;
  - a page uses wording the claims register bars (the 'barred' list, the same list the Ask gate uses).
A topic sentence that says "no" or "not" (for example "It claims no formal certification") passes where the topic allows it.
Text read: every built page as a crawler reads it (body, header and footer, alt text, title, meta description, the
JSON-LD), plus llms.txt. Names of customers, prospects and partners are checked by the Ask gate and by
tools/private_names.txt (kept out of git), not here."""
import html, json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
FILE = ROOT / "src" / "data" / "facts.json"
CORE = ROOT / "src" / "js" / "agent-core.js"
SITE = "https://www.amimotion.com"
NEG = re.compile(r"\b(no|not|never|without|n't|none)\b", re.I)


def load():
    return json.loads(FILE.read_text())


def approved(d=None):
    d = d or load()
    return [f for f in d["facts"] if f["status"] == "approved"]


def held(d=None):
    d = d or load()
    return [f for f in d["facts"] if f["status"] == "held"]


def evidence(f, d=None, site=SITE):
    """The fact's source as the public sees it: type, title, link (absolute), and the page for a document."""
    d = d or load()
    ev = f["evidence"]; src = d["sources"][ev["source"]]
    out = {"type": src["type"], "title": src["title"]}
    if src.get("url"):
        u = src["url"] if src["url"].startswith("http") else site + src["url"]
        if ev.get("page"): out["title"] += f", page {ev['page']}"; u += f"#page={ev['page']}"
        out["url"] = u
    if ev.get("stated_at"): out["url"] = site + ev["stated_at"]
    return out


def profile(site=SITE):
    """The public JSON profile at /facts.json: approved facts only, each with its source and review date."""
    d = load(); p = d["profile"]; o = d["organization"]
    facts = approved(d)
    return {
        "name": p["name"], "description": p["description"], "how_to_use": p["how_to_use"],
        "url": site + p["path"], "page": site + p["page"], "version": d["version"],
        "last_reviewed": max(f["last_reviewed"] for f in facts),
        "organization": {"name": o["name"], "legal_name": o["legalName"], "url": o["url"], "email": o["email"],
                         "address": {"locality": o["addressLocality"], "region": o["addressRegion"], "country": o["addressCountry"]}},
        "subjects": {k: {"name": v["name"], "url": site + v["page"]} for k, v in d["subjects"].items()},
        "facts": [{"id": f["id"], "group": dict(d["groups"])[f["group"]], "label": f["label"], "subjects": f["subjects"],
                   "claim": f["claim"], "evidence": evidence(f, d, site), "status": f["status"],
                   "last_reviewed": f["last_reviewed"]} for f in facts],
    }


# ---------------------------------------------------------------- the Ask copy in agent-core.js
A, Z = "// facts.json:begin (written by tools/facts.py sync; edit src/data/facts.json, never here)", "// facts.json:end"


def js_block(d=None):
    d = d or load()
    js = lambda s: json.dumps(s, ensure_ascii=False)
    lines = [A, f"export const FACTS_VERSION = {js(d['version'])};", "export const FACTS = ["]
    lines += [f"  {js(f['claim'])}," for f in approved(d)]
    lines += ["];", "export const FACT_IDS = [" + ", ".join(js(f["id"]) for f in approved(d)) + "];", "const BARRED_FILE = ["]
    for b in d["barred"]:
        lines.append(f"  [/{b['pattern'].replace('/', chr(92) + '/')}/i, {js(b['label'])}],")
    lines += ["];", Z]
    return "\n".join(lines)


def core_ok():
    s = CORE.read_text()
    m = re.search(re.escape(A) + r".*?" + re.escape(Z), s, re.S)
    return bool(m) and m.group(0) == js_block()


def sync():
    s = CORE.read_text()
    new = re.sub(re.escape(A) + r".*?" + re.escape(Z), lambda _: js_block(), s, count=1, flags=re.S)
    if new == s and not core_ok(): raise SystemExit("facts: markers not found in agent-core.js")
    CORE.write_text(new); print("facts: agent-core.js in step with facts.json")


# ---------------------------------------------------------------- the page gate
def sentences(t):
    return [s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z±0-9\"'“(])", t) if s.strip()]


def topic_problems(where, blocks, d):
    """blocks: the texts of one page in reading order. A topic sentence must match one of the topic's forms, carry its
    qualifier in the sentence or in the two blocks after it, and never be a denied topic unless it says no or not."""
    out = []
    for t in d["topics"]:
        det = re.compile(t["detect"], 0 if t.get("case_sensitive") else re.I)
        forms = [re.compile(x, re.I) for x in t.get("forms", [])]
        req = [re.compile(x, re.I) for x in t.get("require", [])]
        for i, b in enumerate(blocks):
            win = " ".join(blocks[i:i + 3])
            for s in sentences(b):
                m = det.search(s)
                if not m: continue
                said = " ".join(s.split())[:160]
                if t.get("questions_pass") and s.rstrip().endswith("?"): continue   # a question states nothing
                if t.get("allow_negated") and NEG.search(s): continue
                if t.get("deny_all") or t.get("allow_negated"):
                    out.append(f"{where}: [{t['id']}] not in the facts file: \"{said}\""); continue
                if forms:
                    # each topic hit must overlap a wording the file holds (so "±30 cm" next to "±10 cm" still fails)
                    spans = [(x.start(), x.end()) for f in forms for x in f.finditer(s)]
                    bad = [h.group(0) for h in det.finditer(s) if not any(a < h.end() and z > h.start() for a, z in spans)]
                    if bad:
                        out.append(f"{where}: [{t['id']}] differs from the facts file ({bad[0]}): \"{said}\""); continue
                if req and not all(r.search(win) for r in req):
                    out.append(f"{where}: [{t['id']}] qualifier missing: \"{said}\"")
    return out


def barred_problems(where, text, d):
    out = []
    for b in d["barred"]:
        if b.get("pages") is False: continue    # the topic rules above cover these on pages, negations included
        for m in re.finditer(b["pattern"], text, re.I):
            before = text[max(0, m.start() - 40):m.start()]
            if re.search(r"\b(not|never|no|n't)\s+(\w+\s+){0,3}$", before, re.I): continue
            out.append(f"{where}: barred wording [{b['label']}]: \"{text[max(0, m.start() - 50):m.end() + 50].strip()}\"")
    return out


def ld_strings(x):
    if isinstance(x, dict): return [s for k, v in x.items() if not k.startswith("@") and k not in ("url", "item", "contentUrl", "embedUrl", "thumbnailUrl", "logo", "image", "sameAs") for s in ld_strings(v)]
    if isinstance(x, list): return [s for v in x for s in ld_strings(v)]
    return [x] if isinstance(x, str) else []


BLOCK = re.compile(r"<(?:p|li|h[1-6]|td|th|dd|dt|figcaption|blockquote|summary|div|section|header|footer|nav|main|ul|ol|tr|table|figure|details|article|aside|form|label|button|br)\b[^>]*>|</(?:p|li|h[1-6]|td|th|dd|dt|figcaption|blockquote|summary|div|section|header|footer|nav|main|ul|ol|tr|table|figure|details|article|aside|form|label|button)>", re.I)


def page_blocks(raw):
    """A built page as a crawler reads it, cut at every block element (inline tags become spaces, so words never run
    together): the visible text, alt text, title, meta description and every JSON-LD string."""
    lds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw, re.S)
    meta = re.findall(r'<meta name="description" content="([^"]*)"', raw) + re.findall(r"<title>(.*?)</title>", raw, re.S)
    alts = re.findall(r'\balt="([^"]+)"', raw)
    b = re.sub(r"<(script|style|svg|template|noscript)\b.*?</\1>", " ", raw, flags=re.S | re.I)
    b = re.sub(r"<!--.*?-->", " ", b, flags=re.S)
    b = re.sub(r"<head\b.*?</head>", " ", b, flags=re.S | re.I)
    out = []
    for part in BLOCK.split(b):
        t = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", part)).split())
        t = re.sub(r" ([.,;:!?)])", r"\1", t)
        if t: out.append(t)
    out += [html.unescape(x) for x in meta + alts]
    for x in lds:
        try: out += ld_strings(json.loads(x))
        except ValueError: out.append("JSON-LD does not parse")
    return out


def gate(built):
    d = load(); problems = []
    if not core_ok(): problems.append("src/js/agent-core.js: Ask facts differ from facts.json (run python3 tools/facts.py sync)")
    # every approved fact needs a source; every held one a reason
    for f in d["facts"]:
        if f["status"] == "approved" and f.get("evidence", {}).get("source") not in d["sources"]: problems.append(f"facts.json: {f['id']} has no evidence")
        if f["status"] == "held" and not f.get("reason"): problems.append(f"facts.json: {f['id']} is held without a reason")
        if not re.fullmatch(r"\d{4}-\d\d-\d\d", f.get("last_reviewed", "")): problems.append(f"facts.json: {f['id']} has no review date")
    # each approved claim must itself pass the topics and the barred list (the file cannot hold what it bars)
    for f in approved(d):
        problems += topic_problems(f"facts.json {f['id']}", [f["claim"]], d) + barred_problems(f"facts.json {f['id']}", f["claim"], d)
    built = Path(built)
    pj = built / d["profile"]["path"].lstrip("/")
    if not pj.exists(): problems.append(f"{d['profile']['path']}: not built")
    else:
        got = json.loads(pj.read_text()); want = profile(got.get("url", SITE + "/facts.json").rsplit(d["profile"]["path"], 1)[0])
        if got != want: problems.append(f"{d['profile']['path']}: differs from facts.json (rebuild)")
    fp = built / d["profile"]["page"].strip("/") / "index.html"
    if not fp.exists(): problems.append(f"{d['profile']['page']}: not built")
    else:
        s = fp.read_text()
        for f in approved(d):
            if f'id="{f["id"]}"' not in s or html.escape(f["claim"], quote=False) not in s: problems.append(f"{d['profile']['page']}: {f['id']} missing or reworded")
        for f in held(d):
            if f'id="{f["id"]}"' in s: problems.append(f"{d['profile']['page']}: held fact {f['id']} is shown")
    for f in sorted(built.rglob("*.html")):
        rel = f.relative_to(built).as_posix()
        if rel.startswith(("desk/", "assets/")) or rel == "404.html": continue
        where = "/" + rel.removesuffix("index.html")
        blocks = page_blocks(f.read_text(errors="ignore"))
        problems += topic_problems(where, blocks, d)
        problems += barred_problems(where, " ".join(blocks), d)
    llms = built / "llms.txt"
    if llms.exists():
        lines = [l.lstrip("-> ").strip() for l in llms.read_text().splitlines() if l.strip()]
        problems += topic_problems("/llms.txt", lines, d) + barred_problems("/llms.txt", " ".join(lines), d)
    seen, uniq = set(), []
    for x in problems:
        if x not in seen: seen.add(x); uniq.append(x)
    print("\n".join(uniq[:120]) or f"facts gate OK: {len(approved(d))} approved facts, {len(held(d))} held; every page in step with facts.json")
    if len(uniq) > 120: print(f"... and {len(uniq) - 120} more")
    return 1 if uniq else 0


# the gate's own regression: sentences it must stop, and the site's own wordings it must let through
MUST_FAIL = [
    "AmIMotion positions each tag to ±30 cm in 3D, typical, with AmIMo anchors.",
    "AmIHub places tags to ±10 cm.",
    "Each AmIMo anchor reaches about 80 m in line of sight, site-dependent.",
    "One AmIGo battery lasts 5 to 7 years, typical.",
    "AmIMotion is FiRa and omlox compliant.",
    "AmIMo anchors are FCC certified.",
    "AmIMotion holds an omlox certification.",
    "AmIMo anchors are fully wireless.",
    "AmIMotion is deployed at three automotive carmakers.",
    "Founded in 2023, AmIMotion makes UWB tags.",
    "Sumeer Bhatara, Chief Business Officer, leads sales.",
    "Vivek Dham, CEO, signs the contract.",
    "AmISense predicts bottlenecks before they stop a line.",
    "Write to hello@amimotion.com for a quote.",
    "AmIHub runs in a cloud tenant we manage.",
    "AmIMotion is a brand of Locatepro Technologies Inc.",
    "Latency is under a second from pulse to map.",
    "Wi-Fi FTM lets AmIHub locate your phones.",
    "Anchors time each pulse to under a nanosecond.",
    "Payback comes within six months.",
    "AmIMotion cuts search time by 40%.",
]
MUST_PASS = [
    "Down to ±10 cm in 3D, typical, with AmIMo anchors. Depends on your floor; you measure it in the pilot.",
    "±10 cm typical, with AmIMo anchors",
    "About 50 m line-of-sight radius, indicative and site-dependent; the count comes from a site survey.",
    "One battery lasts 1 to 3 years, depending on use.",
    "AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification.",
    "Does AmIMotion hold FiRa or omlox certification?",
    "AmIMotion runs in automotive manufacturing, robotics and warehousing facilities.",
    "Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO, lead the team.",
    "AmIHub runs on an industrial PC inside your plant, with no internet needed, or in the cloud.",
    "Write to sales@amimotion.com.",
    "Light travels about 30 cm in a nanosecond.",
    "© 2026 Locatepro Technologies Pvt Ltd.",
]


def selftest():
    d, bad = load(), []
    for s in MUST_FAIL:
        if not (topic_problems("t", [s], d) + barred_problems("t", s, d)): bad.append(f"let through: {s}")
    for s in MUST_PASS:
        got = topic_problems("t", [s], d) + barred_problems("t", s, d)
        if got: bad.append(f"stopped: {s} -> {got[0]}")
    print("\n".join(bad) or f"facts gate self-test OK: {len(MUST_FAIL)} wrong sentences stopped, {len(MUST_PASS)} site wordings passed")
    return 1 if bad else 0


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "sync": sync()
    elif cmd == "check":
        ok = core_ok(); print("facts: agent-core.js", "in step with facts.json" if ok else "differs from facts.json: run python3 tools/facts.py sync"); sys.exit(0 if ok else 1)
    elif cmd == "gate": sys.exit(gate(sys.argv[2] if len(sys.argv) > 2 else ROOT / "dist"))
    elif cmd == "selftest": sys.exit(selftest())
    elif cmd == "list":
        d = load()
        for f in approved(d): print(f"+ {f['id']}: {f['claim']}  [{evidence(f, d)['title']}; {f['last_reviewed']}]")
        for f in held(d): print(f"- {f['id']}: {f['claim']}  HELD: {f['reason']}")
    else: raise SystemExit(__doc__)
