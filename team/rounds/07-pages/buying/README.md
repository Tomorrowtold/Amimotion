# Round 07, buying squad

Fifteen pages, written to map onto the Phase B blocks in `site/tools/pagegen/lib.py` (head, vp/section, split, tiles, steps, cards, links, more, faq, prose, close; `slot()` and `still()` for pictures). All live in `p_company.py`. Nothing in `site/` was edited. Nothing committed.

Readers are a simulated panel from kit 09 (a thinking tool, not research). Scores are the second-round mean of the three or four readers listed in each file.

| Page | File | Final reader mean | Words | Blocked on |
|---|---|---|---|---|
| /start/ | start.md | 9.0 | ~330 | none |
| /pilot/ | pilot.md | 8.5 | ~720 | O6 (stop right), O12 (who installs) |
| /how-to-buy/ | how-to-buy.md | 8.7 | ~560 | O12 (what recurs after the pilot), O13 (founder on the call) |
| /diagnostic/ | diagnostic.md | 9.0 | ~420 around the tool | JS strings D1 to D5 (below) |
| /tools/ | tools.md | 9.0 | ~300 | none |
| /tools/anchors/ | tools-anchors.md | 9.0 | ~610 | founders to confirm grid spacings (A1); min-anchor rule conflicts with [B4] (A2) |
| /tools/pilot/ | tools-pilot.md | 9.0 | ~470 | **Does not ship until tools.js T1, T2 are changed (O2 STOP)** |
| /tools/search-time/ | tools-search-time.md | 9.0 | ~590 | none |
| /contact/ | contact.md | 8.7 | ~400 | O13 |
| /company/ | company.md | 8.7 | ~520 | approved bios (kit 02 C3, C4, Q15) |
| /trust/ | trust.md | 9.0 | ~620 | none |
| /trust/people/ | trust-people.md | 8.7 | ~500 | O3 (consent policy) |
| /privacy/ | privacy.md | 8.7 | ~650 | host name and log retention; founders' OK on mail practice lines; a privacy contact |
| /films/ | films.md | 9.0 | ~520 | Engine room to add the hero film to `film()` (4:5 or 1:1) |
| /404 | 404.md | 9.0 | ~120 | exempt from 250 words (noindex) |

**Mean of page scores: 8.9.** Every page under 9 is blocked only by a missing founder fact; the safe line ships.

## Binding STOPs outside this squad's write area (owner: Engine room, `site/src/js/`)

1. `tools.js` pilot brief: "The zones that matter and the time limit for each." and "Who looks when a limit is passed." (O2). Replacements in tools-pilot.md T1 to T4.
2. `diagnostic.js`: the "People / For safety and muster" option and the "people badges" pilot lead (V81, V83, O3). Replacement in diagnostic.md D1.

## Calculator assumptions no founders' document supports (logic kept, disclosed on the page)

- Anchor grid 25 / 18 / 12 m (A1). [B4] gives only "~50 m line of sight" and "survey sets the count".
- Minimum 4 anchors (3D), 3 (2D) (A2). Conflicts with [B4] "works with as few as two in view". Relabelled as the tool's own floor.
- Tall-hall factor 0.9 above 10 m (A3); range 0.8x to 1.25x (A4).
- Search-time defaults 12 / 4 / 8 / 2 / 300 (S1) and 8 h per full-time person (S2).
- Diagnostic: "rule" wording (D2, F4/O2), association method named (D3, Q5), "fastest route" (D4), "an engineer replies" (D5, O13), a fake data stamp and mono eyebrows (D6, D7).

## Rules kept on every page

No O1, O2, O3, O4 or O6 "ships if confirmed" line. No customer, partner or backer name. No "runs in", "deployed", "certified" or "compliant". Down to ±10 cm always with AmIMo anchors and "depends on your floor". No price, duration or region. "Physical AI" never in page copy. One nav label per URL. The company page names only Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.
