# Inner pages, round 05: the system (Phase A)

Structure unit with Experience Design and the Engine room. 2 Nov 2026. Branch `claude/project-thread-lg8bk2`, not deployed.
Shots: `shots/<page>-1440.png` and `shots/<page>-390.png` (Playwright, Chromium, DPR 1, full page, every lazy image scrolled into view first) for /platform/, /products/amigo/, /solutions/wip/, /learn/dwell-time/, /pilot/ and /company/.

All 54 inner pages now look and work like the homepage. They share one ground, one 12-column grid, the 5:7 split, the six type sizes and AmI Sans only. Every page inlines `core.css` plus one template file and loads no shared script. There are no cards, chips, eyebrows, pills, icons, glow, glass, gradients, shadows, dark bands or reveals. Every disclosure opens with JavaScript off.

---

## 1. For Phase B page squads: how to write a page

A page is a list of blocks in `site/tools/pagegen/p_*.py`, written by `write(path, title, description, [blocks], **meta)`. Do not write raw HTML in a generator. If you need a block that does not exist, ask the Structure unit to add it to `lib.py` and `inner.css`, so every page gets it.

Run from `site/`: `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`.

### Page anatomy

```
head(...)                      breadcrumbs, H1, lede, the short answer, a links line, one picture
section(vp(...), block, ...)   one heading row, then its blocks
section(...)                   as many as the page needs, each one screen of reading
close(...)                     the page's ending: one line, one sentence, one link
```

### The blocks (`lib.py`)

| Block | Call | What it makes | Rules |
|---|---|---|---|
| Head | `head(h1, soft=None, lede=None, short=None, trail=[(label, url or None)], actions=(), media=None)` | Breadcrumbs (nav labels), the H1 in one or two lines, the lede (lede size, ink-soft), the short answer (the speakable passage; keep it), a line of plain links, a picture | No buttons: "Book a call" lives in the bar, so `actions` pointing at /contact/ are dropped; the rest become a links line. `media=still(...)` sits right of the words (5:7; on phones H1, picture, lede, as on the homepage). `media=slot(...)` or `film(n)` runs full width below. Each H1 line is one sentence. |
| Heading row | `vp(h2, soft=None, lede=None)` | An H2 of one or two lines and an optional lead paragraph (lede size, ink, 7 columns) | Every section starts with one. The id is made from the words. |
| Section | `section(*blocks, id=None)` | One screen: `--rhythm-m` above it | No tone, no flush, no tight: one ground, one rhythm. |
| Text and picture | `split(h3, paras, items, media, flip=False, extra="")` | Copy in columns 1–5, picture in 6–12 (flip: picture 1–7, copy 8–12) | `h3=None` for a copy column with no heading. `extra` takes more blocks (points, figures, a links line). |
| Points | `tiles(items, cols=3, head="h")` (alias `points`) | Short headed paragraphs: 3 or 4 across; `cols=2` splits 5 : 6 like the homepage's last screen; `cols=1` stacks | Items are `(heading, text)`. Old 3-tuples drop the eyebrow; `head="over"` keeps the eyebrow as the heading and opens the text with the old heading. |
| Steps | `steps([(heading, text)])` | A numbered list, 4 or 5 across; the number is plain display type | Use for anything done in order. Never number points by hand ("1 · Scope"). |
| Figures | `stats([(figure, what, condition)])` (alias `figures`) | A definition list: the figure, what it is, its condition | Every figure carries its condition ("site-dependent", "typical"). Not a dashboard: four at most. |
| Specs table | `spec([(name, value)], note)` | Rows on alternating fill steps; the label column ends on the column-6 line | `build.py` reads the rows into Product / SoftwareApplication JSON-LD. Stacks on phones. |
| Comparison | `compare(headers, rows, note)` | A table; on phones each row stacks with the column name before each cell | First column is the row name. |
| Parts | `cards([(href, picture, title, line)], cols=3)` (alias `parts`) | The homepage's screen 5 row: a picture over a linked H3 and one line | The picture is `still()`, `slot()` or `poster()`. |
| Related | `links([(href, title, line)])` (alias `related`) | A `<nav>` of linked names, each with one line | Nav URLs always carry their nav label (`LABEL` from `nav.json`), whatever title you pass. |
| Links line | `more([(label, href)])` | The homepage's plain "more" line | Nav labels apply. |
| Know more | `km(topic, _, title, [items], link)` | A native `<details>`: the summary is the title, then the list and one link | Opens with JS off. The summary is a plain sentence, never a formula line. It is not read as FAQ data. |
| Questions | `faq([(q, a)], title)` | An H2 and plain `<details>` rows on the surface fill | `build.py` reads every plain `<details>` into FAQPage JSON-LD. |
| Article | `read([(id, h2, html)])` | An on-this-page list (columns 1–4) beside the text (6–12) | Learn guides use it through `guide()`. |
| Prose | `prose(html)` | Running text at a 40em measure | |
| Picture, real | `still("amigo" / "amigo-side" / "amimo")` | A page-graded CAD still, AVIF and WebP ladder, lazy (or `eager=True` in a head) | Add a ladder to `STILLS` only from the founders' CAD, cut with `team/rounds/02-design/tools/hero_images.py`. |
| Picture, reserved | `slot(brief, ratio, alt, owner)` (old name `ph`) | A `--surface` block at the final ratio (`photo` 4:3, `cine`/`wide` 16:9, `still` 3:2, `square` 1:1) with an HTML comment: asset code, brief, alt text, owner | Never draw hardware, plants or diagrams in code. When the asset exists, swap the slot `div` for a `<picture>` ladder; nothing moves. |
| Film | `film(n)`, `poster(n)` | A 16:9 video, poster first (WebP), `preload="none"`, controls, no autoplay; a poster picture for lists | |
| Close | `close(line, sub, actions=((label, href),))`, or the default for the part of the site | The ending: one line at H2 size, one sentence, one link | One link only. No kicker, no second action, no button. Defaults per part of the site are in `CLOSES`. |
| Tool actions | `btns([(label, href), ...])` | The one button (`.cta`), then plain links | Inside tools only. |

### CSS and colour

- `core.css`: the tokens, the faces, the bar, the panels, the phone sheet and the footer. **All colour lives here** as tokens; no template, page or generator carries a literal colour. The logo mark is filled from `--located`, and `build.py` reads `theme-color` from `--ground`. A palette swap is a one-file change in `core.css`.
- `inner.css` (every inner page), plus `tool.css` (the three tools and /contact/) or `diag.css` (/diagnostic/), chosen in `write()` from the page's `scripts`.
- `build.py` inlines `core.css` and the template file, minified, into each page. There is no render-blocking request.
- A page squad should not need to write CSS. If a layout is missing, it is a missing block.

### Words rules squads must keep

- Fixed wording: "built on the FiRa and omlox specifications" (never compliant or certified), "down to ±10 cm" with its condition, "runs in" never "deployed". But do not say AmIMotion "runs in" any kind of site: the deployment line is stopped (A46, C34).
- Do not ship the "ships if confirmed" lines in `open-facts.md`. In particular: no zone time limits or alerts (O2), no consent clause (O3), no tilt or impact reporting to AmIHub (O4), no phone map (O1), no stop right (O6).
- No customer references, results or "in the field" lines.
- "Physical AI" appears once per page already, in the footer's entity paragraph. Do not use it in page copy.
- One label per URL: link text to a nav URL is the nav label (the generators enforce it in related lists, links lines and closes).

---

## 2. Three layouts, two killed

All three were made as working stylesheets over the same generated markup for /platform/, /products/amigo/ and /learn/dwell-time/, and compared at 1440 and 390.

| | A. Homepage screens (**kept**) | B. Docs rail | C. Drawing sheet |
|---|---|---|---|
| Idea | Every section is a homepage screen: an H2 row, then a 5:7 split or a row of points, on one ground at the homepage's rhythm. | A reading layout: a left rail with the section's pages and the page's headings, and content in 7 columns. | Every page set like an A-series CAD drawing: a ruled frame, a title block with page number, revision and section, tables everywhere. Nobody in the category does it. |
| Verdict | **Kept.** It is the homepage's own language, so a reader moving from / to any inner page sees one site. It needs no new token, no rule line and no sticky element. | **Killed.** It puts a third navigation on every page beside the bar and breadcrumbs (and, then, the section bar). The rail vanishes below 1024 px, where most first visits happen. A sticky rail fights WCAG 2.4.11 the same way the sticky bar would, and the bar was moved into the flow for that reason. We kept its useful part, the on-this-page list, as a block for articles only. | **Killed.** The frame needs ruled lines, and the design system has no line token: structure comes from fill steps only. Title blocks with revision numbers are the "technical costume" the design round refused for Plex Mono. They read as fake data chips. On a phone the frame eats 15% of the width. |

### Rework of A, three rounds

1. **Straight port.** Faults found: the head with a CAD still put a three-line H1 in 5 columns ("AmIGo / The tag that rides on / work."). Short sections left 7 empty columns. Related lists were read by the pickability crawler as answer passages and pushed the real answers out (U23 and B06 failed). The `<header>` element for the page head made crawlers treat the H1 and the short answer as chrome (crawler checks fell from 697 to 662, unbranded from 38 to 33).
2. **Fixes.** The H1 takes its own full row, with the lede and the still side by side under it (5:7). On phones the order is H1, picture, lede, as on the homepage. The head is a `div`. Related lists are a `<nav>`. The product pages' short answers sit under a real H2 ("AmIGo, in short."), not an eyebrow. Two-up points follow the homepage's 5 : 6 split, never 6 : 6.
3. **Fit and finish.** Closing line: the first version had a sentence and a link only. It dropped words the pickability crawler relied on (the AmIHub mention), so it now carries one supporting sentence. Spec tables end their label column on the column-6 line. The tool output unit got its space ("22–35 anchors"). The film posters became AVIF/WebP ladders: a use-case page had weighed 379 KB, now 159 KB. Points that lost meaning without their eyebrow ("AmIHub keeps", "On-premise") now keep the eyebrow as the heading, with the old heading as the first words of the text.

---

## 3. Word changes, by page

Structural changes that apply to every page (no words added):
- **Section bars and next-bands are removed.** The section bar was a `<nav>` of the section's pages plus "Next ..."; the next-band carried a kicker ("Then the anchor", "Keep going") and the next page's title. One closing line replaces both.
- **Head buttons:** "Book a call" in heads is dropped (it is in the bar). Second actions become a links line under their nav label; for example, "Diagnose your floor" becomes "Plan your first bay".
- **Closes** keep their line and their sentence, plus the first action only. The second action ("Diagnose your floor", "How a pilot runs") is dropped. Default closes: platform pages unchanged. Solutions, industries and use cases: "Diagnose your floor." became "See where location would help first.", the sentence "Six questions, two minutes.", and the link "Plan your first bay". Company: unchanged.
- **Eyebrows dropped** from points (the old heading stays): Timing, Angle, Reflections (technology); Scope, Data, Acceptance (WIP); Scoped, Logged, Approved (developers); Ask, Logged, Approve (AmIHub); "Today" / "With AmIMotion" are now the headings on use cases and "The walk" / "The map" are dropped; trust security: Data residency (twice), In transit, Access, Record, Updates. "AmIGo in short", "AmIMo in short" and "AmIHub in short" became H2s ("AmIGo, in short."). On platform chapters: "Battery, typical", "Reach, about" and "Right down to the shelf" joined their figure or heading. Precision: the kicker "Right down to the shelf" became the H2's second line.
- **Eyebrows kept as headings, old heading merged into the text** (no word lost): Location / Context / Answers (spatial intelligence); trust claims (Product facts ... Analytics and AI); Customer names / Wording; Positions ... Links (developers); Datasheets / Capacity / Accuracy (specs); AmIHub keeps / Your MES or ERP keeps / Agreed together and On-premise / Cloud / Either way (platform); Position / Time / Quality (technology).
- **Pilot five steps:** "1 · Scope" ... "5 · Commercial" became a numbered list headed The question, Today measured, Survey and install, Used by people, A decision.
- **Know more** titles are now summaries. "Mount it. Power it. Done." became "Where and how anchors mount." The others are unchanged ("Fewer pulses. Longer life.", "Where anchors go.", "Your floor, in plain words.", "Tracking is the dot. Visibility is the wait.", "How a pulse becomes a place.").
- **Industries hub, the old applications reel:** the heading, lede and four items are kept. "Also runs on" (an eyebrow) is dropped, and so is "Worker safety: Badges show who is inside a restricted zone." (a people-tracking use with no consent policy, O3).

Line changes (truth, banned lines, charter wording):

| Page | Was | Now | Why |
|---|---|---|---|
| /products/amimo/ close | "Mount it. Power it. Done." | "A site survey plans the anchors for one bay of your floor." | Banned formula line |
| /diagnostic/ | "One flow, its zones, one rule and one owner. Small enough to prove, big enough to matter." | "One flow, its zones, one rule and one owner." | Banned formula line |
| /technology/ figure | "FiRa · omlox — Compliant" | "FiRa · omlox — Built on the specifications" | Never "compliant" |
| /technology/, /faq/, /learn/omlox/ FAQ | "That is a compliance statement, not a formal certification." | "It claims no formal certification." | Never "compliant" |
| /learn/omlox/ | Section "Compliant, or certification?" "Compliant means a company says its product follows a specification." | "A specification, or a certification?" "Following a specification is a company's own statement." | Same |
| /learn/omlox/ description | "...and AmIMotion's omlox compliance." | "...and how AmIMotion is built on it." | Same |
| /learn/uwb-rtls-india/ | "Ask whether a product is compliant or has passed a formal certification" | "Ask whether a product follows the specification or has passed a formal certification" | Same |
| /glossary/ | Term "Compliant" | Term "Certification": "A formal certification means an authorised body has tested a product against a specification. Following a specification is a company's own statement. AmIMotion describes itself as built on the FiRa and omlox specifications." | Same; 34 terms kept |
| /industries/warehousing/ | "AmIMotion runs in warehousing. It shows where..." | "In warehousing, AmIMotion shows where..." | Deployment line stopped (A46, C34) |
| /industries/robotics/ | "AmIMotion runs in robotics facilities. Every tagged robot..." | "On robotics floors, every tagged robot..." | Same |
| /industries/ | "AmIMotion runs in manufacturing, robotics and warehousing sites." (description and short answer); "Customer references are shared under NDA." | "AmIMotion for manufacturing, robotics and warehousing floors:" / "AmIMotion is built for manufacturing, robotics and warehousing floors."; the references sentence cut | Same; references stop |
| /what-is-amimotion/ | "AmIMotion runs in manufacturing, robotics and warehousing sites. Customer references are shared under NDA." | Cut | Same |
| /learn/uwb-rtls-india/ | "It is running in manufacturing, robotics and warehousing sites; references are shared under NDA." | Cut | Same |
| /faq/ | Q "Who uses AmIMotion, and what does it cost?" A "AmIMotion runs in ... References, results and pricing are shared under NDA after a first call." | Q "What does AmIMotion cost?" A "After the first call, we share datasheets, architecture, prices and pilot options under NDA." (the locked homepage line) | Same |
| /company/ figures | "In the field — Manufacturing, robotics, warehousing — References under NDA" | Cut | Same |
| /trust/ | "References — On a call — Ask on a call which references can speak to your kind of floor." | Cut | Same |
| /solutions/wip/ | "What needs a look? A time limit per zone and a named owner. Passing the limit means 'go and look'." | "What needs a look? A named owner who acts when work waits too long. A long wait means 'go and look'." | Open fact O2 |
| /pilot/ | "The zones that matter, and the time limit for each" | "The zones that matter" | O2 (build notes item 6) |
| /use-cases/station-to-station/ FAQ | "Whether a supervisor gets an alert is agreed for your pilot." | "Who on your team acts when work waits too long is agreed before the pilot." | O2 |
| /learn/dwell-time/ | "Set a time limit per zone and name who looks when it is passed." | "Name who on your team acts when work waits too long." | O2 |
| /learn/wip-visibility/ | "With an agreed time limit, a long wait becomes a flag for a named person." / "agree a few zones and one time limit, and name who acts." | "A long wait is a reason for a named person to look." / "agree a few zones, and name who acts when work waits too long." | O2 |
| /products/amigo/ | "A 3-axis accelerometer wakes the tag on motion and reports tilt and impact." | "A 3-axis accelerometer wakes the tag on motion." | O4 (the spec row "tilt and impact events" stays: it is the sensor, from [B3]) |
| /products/amigo/ points and FAQ | "...under your site's policy and with people's consent." | "...Tagging people would be a separate project, with its own policy." | O3, the consent clause (V83) |
| /products/amimo/ FAQ | "Can AmIMo work with phones? ... a device works out its own position..." | Cut | No phone-location claim |
| /technology/ modes | "Phones, with the position kept on the device"; "BLE devices, phones and yards" | "Devices that work out their own position"; "BLE and Wi-Fi devices, and yards. Device support confirmed per site." | No phone-location claim; Wi-Fi FTM wording |
| /films/ short answer | "...show one simulated plant." | "...show one plant." | No "Simulation" |
| /industrial-spatial-intelligence/ | "It is the first layer of Physical AI, built and supported in India." | "It is built and supported in India." | "Physical AI" once (it is in the footer) |
| Alt text | "...rendered from the production CAD" (AmIGo, AmIMo heads) | The locked homepage alts | Never "rendered" |

No buzzword from the charter list was found in the generators (seamless, leverage, unlock, next-gen, revolutionary, cutting-edge, empower, robust, world-class). No "under a nanosecond", "FCC" or "deployed" claim remains. ("This site does not use 'deployed at'" on /trust/ stays: it is the rule itself.)

---

## 4. Faults fixed, by backlog id

Ids as in round 04: S = structure, P = patrol, E = engine, by file line order.

| Id | Fault | Status |
|---|---|---|
| S6 | `section(flush=True)` emits `style="padding-top:0"` on inner pages | Fixed. No inline style anywhere in generated pages (contact's inline margins gone too) |
| S7 | Inner pages on site.css, mixed grids 5fr 6fr / 5fr 7fr, eight mood gradients, six button types | Fixed. site.css retired. One grid, 5:7 and the homepage's 5 : 6 two-up, one button (`.cta`, plus `.cta.alt` in tools) |
| S8 | Page ending doubled: subnav-next plus next-band with nb-kicker eyebrow | Fixed. Both removed. One closing line per page |
| S10 | /technology/ has no diagram or image | Partly. It now has two reserved 16:9 and 4:3 slots with briefs. The explainer diagram itself is still owed (Explainer diagram designer) |
| S2 | Current-page crumb text came from pagegen | Fixed. The current crumb uses the nav label too |
| P8 | Eleven CSS breakpoints, none for 360 px | Fixed for inner pages: two breakpoints (1023, 639) plus core's 359. Swept clean 320–3840 |
| E3 | film03/04 over 3 MB; JPEG posters 61–91 KB | Posters fixed: AVIF/WebP at 800 and 1600 (8–30 KB AVIF). Films still H.264 only and two are over 3 MB (Film Director, held) |
| E4 | Product images WebP only | Fixed: inner pages use only the page-graded AVIF/WebP ladders; the old `assets/img/*-card/top/side/3q` stills are no longer referenced |
| E5 | 77 KB render-blocking CSS | Fixed on every page: 17.2 KB inline (22 KB on /diagnostic/), no CSS request |
| E7 | "Know more" buttons dead without JS; diagnostic needs three.js (687 KB) | Fixed. Know more is `<details>`. three.js is no longer loaded or shipped |
| Build notes item 6 | Inter Tight, pills, old grids, nb-kicker, `/trust/` and `/pilot/` time limit (O2) | Fixed. Inter Tight file deleted |
| Ick | Rack drawn in SVG on /platform/ (precision block), dark glowing scene stills, cobalt and champagne product grounds, icons in feature tiles | Fixed. Reserved slots or CAD stills only |

---

## 5. Faults left, with owners

1. **Pictures.** Inner pages carry 28 reserved slots on 15 pages, each naming its brief and owner in an HTML comment. Until the model hall stills exist, many pages read as text plus grey blocks, as the homepage does. The 2D floor sketch inside the diagnostic is drawn in code (SVG). It is a tool's answer, not a picture slot, and it now uses the tokens. Whether it stays is Growth's call. Owner: Realism lab; Growth for the sketch.
2. **Film posters and films look AI-made** (cartoon workers, glowing screens) next to the CAD stills. They lead the four use-case pages and /films/. /films/ stays held (V103). Owner: Film Director. Recommendation: replace each use-case head with a 16:9 slot until films cut from the model hall exist.
3. **Pickability crawler checks 687/756** (was 697). Causes: the truth cuts above, and related lists now read as navigation (correct, but it takes words off the count). /industries/robotics/, /industries/warehousing/, /use-cases/station-to-station/, /industrial-spatial-intelligence/ and /learn/alternatives/ fall 1 to 27 words short of 250. /industries/ is at 181. Owner: Phase B page squads, with the Search and AI Lead.
4. **Entity paragraph twice** on /what-is-amimotion/, /company/ and /faq/ (in the body and in the footer), so "Physical AI" appears two or three times there. Owner: Head of Words with Search (the paragraph is locked).
5. **V108 start/end association** wording ("a link with a start, an end and an owner") is on /platform/, /developers/, /learn/association/ and the glossary. The homepage keeps it off. Owner: Truth and Quality Lead (ruling).
6. **Cloud hosting** stays on inner pages, as [B5] states it (S9 flag unchanged). Owner: Truth and Quality Lead.
7. **The diagnostic** still offers "People: For safety and muster" as an answer (`diagnostic.js`), against O3. Owner: Growth.
8. **The trust line** "Pictures, films and scenes on this site explain the product. They are not customer sites or live data." is a caution about pictures. It is kept because it is a truth statement on the trust page. Owner: Truth and Quality with the Creative Director.
9. **Heads on phones:** some H1s run three lines at 390 ("AmIGo / The tag that rides / on work."). Owner: Head of Words (shorter second lines).
10. **AGENTS.md** still describes `site.css` and `site.js`. Owner: Shiv or the committee (not edited by this round).
11. **Caching:** no hashed names (E8). Owner: Engine room build and edge hackers.

---

## 6. Measurements

Served by `python3 -m http.server` from `site/dist`, uncompressed, Chromium via Playwright. Scripts are in the session scratchpad (`r05/shoot.js`, `sweepall.js`, `w2.js`, `perf.js`).

**CSS per page** (inline, minified; no stylesheet request on any page): 17.2 KB on 50 pages, 20.0 KB on the tools and /contact/, 22.0 KB on /diagnostic/. Target under 30 KB: met.

**First screen** (transfer, everything loaded before any scroll, `performance` resource entries):

| Page | 390 @2 | 1440 @1 | 2560 @2 | 3840 @2 |
|---|---|---|---|---|
| /platform/ | 135.5 | 135.5 | 138.8 | 112.4 |
| /products/amigo/ | 100.4 | 107.7 | 178.6 | 178.6 |
| /products/amimo/ | 110.2 | 110.2 | 116.1 | 116.1 |
| /solutions/wip/ | 87.1 | 87.1 | 87.1 | 87.1 |
| /learn/dwell-time/ | 85.3 | 85.3 | 85.3 | 85.3 |
| /pilot/ | 84.9 | 84.9 | 84.9 | 84.9 |
| /company/ | 82.8 | 82.8 | 82.8 | 82.8 |
| /use-cases/station-to-station/ | 159.3 | 159.3 | 199.3 | 199.3 |
| /films/ | 219.8 | 219.8 | 219.8 | 219.8 |
| /diagnostic/ | 110.8 | 110.8 | 110.8 | 110.8 |

All are under 300 KB. Before this round, /diagnostic/ pulled three.js (687 KB) on load, and a use-case page weighed 379 KB with JPEG posters.

**LCP and CLS:** Playwright, slow 4G (150 ms RTT, 1.6 Mbps down) with 4x CPU throttle, cold cache, 3 runs each, median shown.

| Page | 390 LCP | 1440 LCP | LCP element | FCP | CLS |
|---|---|---|---|---|---|
| /platform/ | 888 ms | 872 ms | short answer (390), H1 (1440) | 860–908 ms | 0.0001 |
| /products/amigo/ | 1436 ms | 1584 ms | AmIGo still (AVIF, eager) | 872–892 ms | 0.0001 |
| /learn/dwell-time/ | 864 ms | 876 ms | short answer | 856–896 ms | 0.0001 |

All under the 1.8 s budget. The slowest is the product head, where the LCP is the still itself.

**Other checks.**
- Horizontal scroll: none on all 55 pages at 320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560 and 3840. A second sweep on the 6 sample pages in 10 px steps from 320 to 3840 also found none, with no console errors.
- Console errors: none on any page.
- Census on all 55 pages (computed styles in `main`): 0 elements at opacity 0, 0 gradients, 0 borders, 0 uppercase, 0 monospace, 0 shadows (the only hits were `<source>` inside `<video>`), radii 6 px only, faces AmI Display and AmI Text only, one H1 per page, no `<svg>` in `main` except the diagnostic's sketch.
- JS off: on the 6 sample pages, every H1 and all body text show, no element sits at opacity 0, and the plain `<details>` blocks (FAQ and "know more") open on click. Only the diagnostic needs JavaScript, and it says so in a `<noscript>` line with a link to book a call.
- Colour: no literal colour outside the token block in `core.css` (grep across `inner.css`, `tool.css`, `diag.css`, `home.css`, generators, partials and pages).
- `build.py`: 55 pages. `pickability.py dist`: barred claims 0, unbranded questions 38/38, branded answerable 7/10, canonical answer pages 48/48, site files 7/8, crawler checks 687/756 (baseline before this round 697; causes in item 3 of section 5).

---

## 7. Scores

Each lead scored 1 to 10 against the best reference inner pages in the library (Apple AirTag tech specs, Stripe docs, Linear's feature pages, Vention product pages). Every score under 9 goes back with the reason that blocks it.

| Lead | Score | Reason | What blocks 9 |
|---|---|---|---|
| Creative Director | 7 | Every page is now visibly the homepage's site: one ground, one voice, one grid, no template tells. But the inner pages have 28 grey slots, and the use-case heads lead with AI-looking film posters. | Model hall stills; films that match the CAD stills |
| Head of Words | 7 | Banned lines, compliance wording and stopped claims are gone, and the endings are one line. The copy is still the old copy: long short answers, some three-line H1s on phones, generic section heads ("Questions teams ask first.") | Phase B rewrites |
| Buyer Truth Lead | 7 | Pages are calmer and readable, but a buyer still has to imagine the floor on most pages | Pictures; a cold reader pass per page group |
| Product Render Director | 8 | Only the founders' CAD appears, page-graded, sharp to 3840. No invented parts. In-context renders are still owed | AmIGo-on-trolley and AmIMo-on-column renders |
| Film Director | 5 | Films are now posters-first and light, but the films themselves do not meet the picture bar | New films from the model hall |
| Experience Design Lead | 9 | One label per URL now reaches breadcrumbs, related lists, links lines and closes. Every page ends with one line and one link. The section bar and next-band doubling are gone, every disclosure works with JS off, and nothing is orphaned | Tree test still not run |
| Design Engineering Lead | 9 | 17–22 KB inline CSS, no shared script, 83–220 KB first screens, LCP 0.86–1.58 s on slow 4G with 4x CPU, CLS 0.0001, clean from 320 to 3840 | Hashed assets; films over 3 MB |
| Search and AI Answers Lead | 8 | 38/38 unbranded and 7/10 branded hold, 0 barred claims, FAQPage only from real questions. Crawler checks dipped to 687/756 | Thin pages (item 3 of section 5) |
| Truth and Quality Lead | 9 | Every stopped claim on inner pages is cut and listed. Open facts O1 to O4 are honoured | Rulings on V108 and cloud hosting |
| Lead Magnet and Growth Lead | 8 | The diagnostic is light (111 KB, no three.js) and on the new system, and "Plan your first bay" ends every solutions page | The people option in the diagnostic; the diagnostic in place on the homepage |
| **Mean** | **7.7** | | |

Under 9 (sent back with the reasons above): Creative Director, Head of Words, Buyer Truth, Product Render, Film, Search, Growth. Five of the seven wait on pictures, films or Phase B copy. The system is ready for them.
