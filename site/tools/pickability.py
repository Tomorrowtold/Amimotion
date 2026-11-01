#!/usr/bin/env python3
"""AI pickability test for the AmIMotion site.

Answers one question: when a buyer asks an AI assistant something AmIMotion should be the answer to,
does the site give the engine a passage it can lift, that names AmIMotion, and that is true?

Three layers, run against a built site (dist/):
  1. Crawler view: every page as a crawler sees it with JavaScript off. Title, description, canonical,
     one h1, structured data that parses, words on the page, alt text, robots, sitemap, llms.txt.
  2. Entity and claims: the canonical description is present word for word where it must be, the brand
     is spelled AmIMotion, and nothing the claims register bars appears anywhere (certified, ROI, names...).
  3. Answer passages: the 40-question panel (tools/panel.json) is run through a BM25 retriever over the
     site's passages, the way search-grounded engines pick sources. A question is "pickable" when the best
     passages carry the facts a correct answer needs and name AmIMotion or one of its products.

  --live   also asks Claude the panel with web search on, and scores whether the answer names AmIMotion,
           cites amimotion.com, and avoids barred claims. Needs `pip install anthropic` and an API key in
           the environment. This is the real-world re-run of the 26 Oct test (0 of 30); it only moves once
           the new site is live on amimotion.com and crawled.

python3 tools/pickability.py dist                 # layers 1-3, report to dist/../reports/
python3 tools/pickability.py dist --live          # plus the live Claude run
"""
import argparse, json, math, re, sys
from collections import Counter
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).parent
BRANDS = re.compile(r"AmIMotion|AmIGo|AmIMo|AmIHub")
MISSPELT = re.compile(r"\b(Amimotion|AmiMotion|AMIMOTION|Ami Motion|AmlMotion)\b")
BLOCKS = {"p", "li", "dd", "dt", "td", "th", "figcaption", "blockquote", "summary", "h1", "h2", "h3", "h4"}
SKIP = {"script", "style", "svg", "template"}
STOP = set("a an and are as at be by can do does for from has have how i if in is it its my of on or our that the their this to was we what when where which who why will with you your vs".split())


class Page(HTMLParser):
    """Reads a page the way a crawler without JavaScript does."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""; self.meta = {}; self.links = []; self.canonical = ""; self.jsonld = []
        self.h = Counter(); self.imgs = []; self.blocks = []; self.heading = ""
        self._stack = []; self._buf = []; self._skip = 0; self._chrome = 0; self._ld = None; self._in_title = False

    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag in SKIP:
            self._skip += 1
            if tag == "script" and a.get("type") == "application/ld+json": self._ld = []
            return
        if tag == "title": self._in_title = True
        if tag == "meta": self.meta[(a.get("name") or a.get("property") or "").lower()] = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical": self.canonical = a.get("href", "")
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "img": self.imgs.append(a.get("alt"))
        if tag == "br" and not self._skip: self._buf.append(" ")
        if tag in ("nav", "header", "footer"): self._flush()
        if tag in ("nav", "header"): self._chrome += 1   # site chrome repeats on every page; extractors drop it
        if tag in BLOCKS:
            self._flush(); self._stack.append(tag)
        if tag in ("h1", "h2", "h3", "h4"): self.h[tag] += 1

    def handle_endtag(self, tag):
        if tag in SKIP:
            self._skip = max(0, self._skip - 1)
            if tag == "script" and self._ld is not None:
                try: self.jsonld.append(json.loads("".join(self._ld)))
                except ValueError: self.jsonld.append(None)
                self._ld = None
            return
        if tag == "title": self._in_title = False
        if tag in ("nav", "header"): self._flush(); self._chrome = max(0, self._chrome - 1); return
        if tag in BLOCKS:
            kind = self._stack.pop() if self._stack else tag
            txt = self._flush()
            if txt and kind in ("h1", "h2", "h3"): self.heading = txt

    def handle_data(self, d):
        if self._ld is not None: self._ld.append(d); return
        if self._skip: return
        if self._in_title: self.title += d; return
        self._buf.append(d)

    def _flush(self):
        txt = re.sub(r"\s+", " ", "".join(self._buf)).strip(); self._buf = []
        if txt and not self._chrome:
            self.blocks.append((self.heading, txt))
        return txt

    def close(self):
        super().close(); self._flush()

    @property
    def text(self):
        return " ".join(t for _, t in self.blocks)


def route_of(f, dist):
    rel = f.relative_to(dist).as_posix()
    return "/" if rel == "index.html" else "/" + rel.removesuffix("index.html")


def load(dist):
    pages = {}
    for f in sorted(dist.rglob("*.html")):
        if f.name == "404.html" or f.name.startswith("_"): continue
        p = Page(); p.feed(f.read_text(errors="ignore")); p.close()
        pages[route_of(f, dist)] = p
    return pages


def types_in(ld):
    out = []
    def walk(x):
        if isinstance(x, dict):
            t = x.get("@type"); out.extend(t if isinstance(t, list) else [t] if t else [])
            for v in x.values(): walk(v)
        elif isinstance(x, list):
            for v in x: walk(v)
    walk(ld); return out


# 1. crawler view ------------------------------------------------------------------------------
def crawler_checks(pages, dist):
    rows = []
    for r, p in pages.items():
        words = len(p.text.split())
        types = [t for ld in p.jsonld if ld for t in types_in(ld)]
        # engines read roughly the first 400 words and lift single sentences (Machine Read v0, "what we measure next")
        first = " ".join(p.text.split()[:400])
        sents = [s for s in re.split(r"(?<=[.!?])\s+", p.text) if len(s.split()) >= 5]
        orphan = [s for s in sents if re.match(r"(It|This|That|They|These|Those|Here|Its|Their)\b", s)]
        checks = {
            "title 15-65 chars": 15 <= len(p.title.strip()) <= 65,
            "title names AmIMotion": "AmIMotion" in p.title,
            "description 70-160 chars": 70 <= len(p.meta.get("description", "")) <= 160,
            "canonical": bool(p.canonical),
            "one h1": p.h["h1"] == 1,
            "h2 structure": p.h["h2"] >= 2 or words < 250,
            "structured data parses": bool(p.jsonld) and None not in p.jsonld,
            "Organization data": "Organization" in types,
            "readable without JS (250+ words)": words >= 250,
            "names AmIMotion in the first 400 words": "AmIMotion" in first,
            "a number with its condition in the first 400 words": bool(re.search(r"\d.*?(typical|depend|usage|site|survey)", first)),
            "sentences stand alone when lifted (under 10% start with it/this/they)": not sents or len(orphan) / len(sents) < 0.10,
            "every image has alt": all(a is not None for a in p.imgs),
            "open graph": bool(p.meta.get("og:title")) and bool(p.meta.get("og:image")),
        }
        rows.append({"page": r, "words": words, "types": sorted(set(types)), "checks": checks,
                     "passed": sum(checks.values()), "of": len(checks)})
    site = {
        "robots.txt": (dist / "robots.txt").exists(),
        "robots welcomes AI crawlers": (dist / "robots.txt").exists() and all(b in (dist / "robots.txt").read_text() for b in ("OAI-SearchBot", "ClaudeBot", "PerplexityBot")),
        "sitemap.xml": (dist / "sitemap.xml").exists(),
        "llms.txt": (dist / "llms.txt").exists(),
        "llms-full.txt": (dist / "llms-full.txt").exists(),
        "/what-is-amimotion/ page": "/what-is-amimotion/" in pages,
        "/faq/ page": "/faq/" in pages,
        "/glossary/ page": "/glossary/" in pages,
    }
    return rows, site


# 2. entity and claims -------------------------------------------------------------------------
def entity_checks(pages, dist, panel, canonical):
    norm = lambda s: re.sub(r"\s+", " ", s).strip()
    must = ["/", "/what-is-amimotion/", "/company/"]
    present = {r: (norm(canonical) in norm(pages[r].text) if r in pages else None) for r in must}
    llms = dist / "llms.txt"
    present["llms.txt"] = norm(canonical) in norm(llms.read_text()) if llms.exists() else None
    misspelt = {r: sorted(set(MISSPELT.findall(p.text))) for r, p in pages.items() if MISSPELT.search(p.text)}
    bad = re.compile("|".join(f"(?:{x})" for x in panel["forbidden"]), re.I)
    barred = {}
    for r, p in pages.items():
        hits = [m.group(0) for m in bad.finditer(p.text)]
        # "never certified" style sentences are the register's own wording; only flag a bare claim
        hits = [h for h in hits if not re.search(r"(not|never|n't)\s+(\w+\s+){0,3}" + re.escape(h), p.text, re.I)]
        if hits: barred[r] = sorted(set(hits))
    return {"canonical description present": present, "misspelt brand": misspelt, "barred claims": barred}


# 3. answer passages ---------------------------------------------------------------------------
def tok(s):
    return [w for w in re.findall(r"[a-z0-9±]+", s.lower()) if w not in STOP]


class BM25:
    def __init__(self, docs, k1=1.4, b=0.72):
        self.docs = [tok(d) for d in docs]; self.k1, self.b = k1, b
        self.avg = sum(map(len, self.docs)) / max(1, len(self.docs))
        df = Counter(w for d in self.docs for w in set(d)); n = len(self.docs)
        self.idf = {w: math.log(1 + (n - c + .5) / (c + .5)) for w, c in df.items()}
        self.tf = [Counter(d) for d in self.docs]

    def top(self, q, k=3):
        qs = tok(q); out = []
        for i, (tf, d) in enumerate(zip(self.tf, self.docs)):
            s = sum(self.idf.get(w, 0) * tf[w] * (self.k1 + 1) / (tf[w] + self.k1 * (1 - self.b + self.b * len(d) / self.avg)) for w in qs if w in tf)
            if s: out.append((s, i))
        return [i for _, i in sorted(out, reverse=True)[:k]]


def passages(pages):
    out = []
    for r, p in pages.items():
        blocks = list(p.blocks)
        for i, (head, txt) in enumerate(blocks):
            # a question (an FAQ summary) is read together with its answer, the way FAQPage data and answer engines pair them
            if txt.endswith("?") and i + 1 < len(blocks) and not blocks[i + 1][1].endswith("?"):
                out.append({"page": r, "text": txt + " " + blocks[i + 1][1]}); continue
            if len(txt.split()) < 6: continue           # labels and buttons are not answers
            if i + 1 < len(blocks) and blocks[i + 1][0] == txt: continue   # a heading is context for the next block, not an answer
            out.append({"page": r, "text": (head + ". " if head and head != txt else "") + txt})
    return out


def answer_checks(pages, panel):
    ps = passages(pages)
    if not ps: return []
    idx = BM25([x["text"] for x in ps]); rows = []
    for q in panel["questions"]:
        hits = [ps[i] for i in idx.top(q["q"], 3)]
        joined = " ".join(h["text"] for h in hits)
        got = [bool(re.search(f, joined, re.I)) for f in q["facts"]]
        named = bool(BRANDS.search(hits[0]["text"])) if hits else False
        named_any = bool(BRANDS.search(joined))
        cover = sum(got) / len(got)
        rows.append({"id": q["id"], "q": q["q"], "branded": q.get("branded", False),
                     "canonical page": q["page"], "canonical page exists": q["page"] in pages,
                     "cover": round(cover, 2), "top passage names AmIMotion": named,
                     "pickable": cover >= 2 / 3 and named_any,
                     "top": [{"page": h["page"], "text": h["text"][:240]} for h in hits]})
    return rows


# live run (Claude with web search) ------------------------------------------------------------
def live_claude(panel, out):
    try:
        import anthropic
    except ImportError:
        sys.exit("--live needs the Anthropic SDK: pip install anthropic")
    client = anthropic.Anthropic()
    bad = re.compile("|".join(f"(?:{x})" for x in panel["forbidden"]), re.I)
    rows = []
    for q in panel["questions"]:
        kw = dict(model="claude-opus-5-5", max_tokens=4000, output_config={"effort": "low"},
                  tools=[{"type": "web_search_20260209", "name": "web_search", "max_uses": 3}],
                  messages=[{"role": "user", "content": q["q"] + " Name specific companies or products where relevant."}])
        try:
            msg = client.beta.messages.create(betas=["server-side-fallback-2026-07-01"], fallbacks="default", **kw)
        except (anthropic.BadRequestError, TypeError):
            msg = client.messages.create(**kw)       # older SDK or no fallback beta on this account
        if msg.stop_reason == "refusal":
            rows.append({"id": q["id"], "q": q["q"], "refused": True}); continue
        text = " ".join(getattr(b, "text", "") for b in msg.content if getattr(b, "type", "") == "text")
        cited = sorted({c.url for b in msg.content for c in (getattr(b, "citations", None) or []) if getattr(c, "url", None)})
        rows.append({"id": q["id"], "q": q["q"], "branded": q.get("branded", False),
                     "named AmIMotion": "AmIMotion" in text or "AmiMotion" in text,
                     "cites amimotion.com": any("amimotion.com" in u for u in cited),
                     "barred claims": sorted(set(m.group(0) for m in bad.finditer(text))),
                     "answer": text[:1200], "citations": cited})
    (out / f"live-claude-{date.today()}.json").write_text(json.dumps(rows, indent=2, ensure_ascii=False))
    return rows


# report ---------------------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dist", type=Path)
    ap.add_argument("--out", type=Path)
    ap.add_argument("--live", action="store_true")
    a = ap.parse_args()
    panel = json.loads((HERE / "panel.json").read_text())
    private = HERE / "private_names.txt"  # names that must never appear, kept out of the public repo
    if private.exists(): panel["forbidden"] += [x.strip() for x in private.read_text().splitlines() if x.strip()]
    canonical = json.loads((HERE.parent / "src" / "data" / "entity.json").read_text())["long"]
    out = a.out or a.dist.parent / "reports"; out.mkdir(parents=True, exist_ok=True)

    pages = load(a.dist)
    crawl, site = crawler_checks(pages, a.dist)
    ent = entity_checks(pages, a.dist, panel, canonical)
    ans = answer_checks(pages, panel)
    live = live_claude(panel, out) if a.live else None

    un = [r for r in ans if not r["branded"]]; br = [r for r in ans if r["branded"]]
    score = {
        "pages": len(pages),
        "crawler checks passed": f"{sum(r['passed'] for r in crawl)}/{sum(r['of'] for r in crawl)}",
        "site files": f"{sum(site.values())}/{len(site)}",
        "unbranded questions pickable": f"{sum(r['pickable'] for r in un)}/{len(un)}",
        "branded questions answerable": f"{sum(r['pickable'] for r in br)}/{len(br)}",
        "canonical answer pages that exist": f"{sum(r['canonical page exists'] for r in ans)}/{len(ans)}",
        "barred claims found": sum(len(v) for v in ent["barred claims"].values()),
    }
    if live:
        lu = [r for r in live if not r.get("branded") and not r.get("refused")]
        score["live: Claude named AmIMotion (unbranded)"] = f"{sum(r['named AmIMotion'] for r in lu)}/{len(lu)}"
        score["live: answers citing amimotion.com"] = f"{sum(r.get('cites amimotion.com', False) for r in live)}/{len(live)}"
    report = {"date": str(date.today()), "score": score, "site": site, "entity": ent, "pages": crawl, "answers": ans}
    (out / "pickability.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))

    md = [f"# AI pickability report, {date.today()}", "", "| Measure | Result |", "|---|---|"]
    md += [f"| {k} | {v} |" for k, v in score.items()]
    md += ["", "## Site files", ""] + [f"- {'✓' if v else '✗'} {k}" for k, v in site.items()]
    md += ["", "## Entity and claims", "", "Canonical description present: " + ", ".join(f"{k} {'✓' if v else '✗' if v is False else '(page not built)'}" for k, v in ent["canonical description present"].items())]
    md += ["Misspelt brand: " + (json.dumps(ent["misspelt brand"]) if ent["misspelt brand"] else "none")]
    md += ["Barred claims: " + (json.dumps(ent["barred claims"], ensure_ascii=False) if ent["barred claims"] else "none")]
    md += ["", "## Pages (crawler view, JavaScript off)", "", "| Page | Words | Passed | Failing |", "|---|---|---|---|"]
    md += [f"| {r['page']} | {r['words']} | {r['passed']}/{r['of']} | {', '.join(k for k, v in r['checks'].items() if not v) or '—'} |" for r in crawl]
    md += ["", "## Questions", "", "| # | Question | Pickable | Facts covered | Best source | Canonical page |", "|---|---|---|---|---|---|"]
    md += [f"| {r['id']} | {r['q']} | {'✓' if r['pickable'] else '✗'} | {int(r['cover'] * 100)}% | {r['top'][0]['page'] if r['top'] else '—'} | {r['canonical page']}{'' if r['canonical page exists'] else ' (not built)'} |" for r in ans]
    (out / "pickability.md").write_text("\n".join(md) + "\n")
    for k, v in score.items(): print(f"{k}: {v}")
    print(f"report: {out / 'pickability.md'}")


if __name__ == "__main__":
    main()
