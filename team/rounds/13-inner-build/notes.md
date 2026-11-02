# Round 13: inner pages built from the harvest plan

2 Nov 2026. Structure unit, page patrol, experience design. This round covers everything in `team/rounds/10-harvest/plan.md` section 4 (inner-page templates), plus the M-patterns the picks assign to inner pages: M02, M04, M09, M10, M11, M13, M14, M16, M18, M19, M20, M21 and M23. The homepage, `core.css`, `home.css` and the global bar, footer and dock are another team's work.

The copy is word for word from round 07. Only the layout, size, order, pictures and motion changed. One page is new: `/products/`, which used to be a directory listing. Every sentence on it is reused from `/platform/`, `/specs/` and the product meta descriptions.

## What was built

### Template (lib.py, inner.css, inner.js)

These changes apply to every inner page.

- **No empty boxes.** `slot()` and `hall()` now fall back to a stand-in when a briefed hall still has not landed yet. The stand-in is the nearest finished still at the slot's ratio (`hall-all`, `hall-waits`, `-43`, `-32`), cropped with `object-fit` and given that still's own true alt.
  - The brief stays in an HTML comment that names the stand-in.
  - A ladder only counts once its 1600 rung exists, because without it the first screen would fetch the 3840 file.
  - A real still replaces its stand-in on the next `run.py`, with no other change. Stills that landed during this round (`hall-find`, `hall-ask`, `hall-bay`, `hall-bay-32` and others) were picked up this way.
  - Result: 0 `.slot` elements on 53 inner pages.
- **Type (M11).**
  - Inner H1: clamp(2.75rem, 5.1vw, 8.5rem).
  - H2: up to 6rem.
  - Lede: up to 30 px.
  - Body: at least 18 px on desktop.
  - Stats: up to 72 px with tabular numerals.
  - Giant figure: clamp(5rem, 15vw, 20rem), set as text inside `<data>`.
  - Units are kept on the same line as their numbers with a no-break space.
- **Head (M16).** The H1 runs full width. Below it, the lede sits in the left 5 columns and the short answer in the right 6. A 16:9 hall still under the head runs full bleed, with a scroll-linked push-in from 1.0 to 1.06. The push-in uses CSS `animation-timeline: view()` only and is off under reduced motion. The page head is still a `div`.
- **Two-column section header** whenever a heading has a lead paragraph.
- **Bands (M10).**
  - Questions, spec tables, the closer look, the lineup table and trust pillars sit on a full-bleed surface (#fff) band.
  - The close is now the action band: #4b3df0, white words, and a white pill with a chevron.
- **Buttons and links (M14).** Pill buttons. Chevrons on section-end links that move 3 px on hover. Underline on hover only. Press scale 0.97.
- **Stat strip (M02, M18).** A hairline over each figure. `stats(..., giant=True)` sets the first figure at giant size with its condition beside it. Every giant figure is in the claims register (`±10 cm`).
- **Hairline tables (Oxide).** Spec and compare tables are framed by 1 px ink-at-12% rules, with no zebra stripes.
- **Hairlines on points and steps.** `tiles(big=True)` and `steps(big=True)` give large pillars and flat columns.
- **Illustrated tiles (The Pudding).** `links(items, pics={...})` adds pictures while the list stays inside `<nav class="related">`.
- **New blocks:**
  - `localnav()`: a sticky 52 px bar under the global bar. `inner.js` marks the section in view.
  - `closer()`: the closer look.
  - `explain()`: the sticky explainer.
  - `qstart()`: the diagnostic's first question inline.
  - `cad()`: more CAD angles from `assets/img`.
  - `jsonld()`.
- **inner.js** is about 5 KB raw and loads only on pages that use one of these blocks. It handles:
  - the local bar's current section;
  - the closer look's buttons and shared stage;
  - the explainer's step states, a draggable tag (pointer and arrow keys), and arrival bars and angles that follow it.

### Page groups

| Group | Commit | What changed |
|---|---|---|
| Template + How it works | 330879a | **`/products/`** (new): a lineup row of three on white squares, a "Side by side" compare table as text, ItemList and Product JSON-LD (no prices), links.<br>**AmIGo and AmIMo:** sticky local bar (name, sections, Book a call); product stage with the giant name in ink at 9% behind the CAD render on the sweep (Rivian); a closer look with CAD angles. AmIGo's angles show "Fitted three ways". AmIMo's show "Where and how anchors mount", which was a disclosure before.<br>**AmIGo:** a giant ±10 cm with its condition.<br>**AmIHub:** local bar.<br>**/technology/:** a section bar (NVIDIA), and the Time, Angle and The map steps as a pinned explainer of one bay from above (M04). The tag can be dragged and the arrival bars and angles follow (ciechanowski). This folds the plan's time-of-flight slider into the drag, so no new labels or numbers are needed.<br>The trail on product pages is now How it works / Products / name. |
| Start small, About us | 5958bda | **/pilot/:** the offer head (headline beside a 4:5 crop of the one-bay still, Formlabs), then the diagnostic's first question inline as five answer pills. Each pill opens `/diagnostic/?assets=…` with that answer chosen, and `diagnostic.js` reads the parameter. With JavaScript off these are plain links.<br>**/how-to-buy/:** the four steps as large flat columns (iPhone).<br>**/trust/:** "Where it runs" and "What the claims rest on" set as large pillars (Apple Privacy). |
| Field guides | 7b87f70 | **/learn/:** the index groups are now illustrated tiles. Each guide carries its own hall crop or CAD still, and the diagnostic is one tile.<br>**Articles:** the on-this-page list stays in view (sticky). |
| Where it helps | 6c8738c | The four jobs are a picture grid (Boston Dynamics): each job's own 4:3 hall cut, 4 across. "Other jobs" on every use case is tiles too. Full-bleed hall heads throughout. |
| Fixes and notes | (last commit) | Stand-ins need a 1600 rung. Fixed the closer look's row alignment. These notes, `shoot.js`, `hscroll.js` and the shots. |

## Checks (final)

- `python3 tools/pagegen/run.py && python3 build.py`: 56 pages built.
- `python3 tools/pickability.py dist`:
  - Unbranded 38/38.
  - Branded 9/10, unchanged. B02 was already ✗ before this round.
  - 0 barred claims.
  - Canonical pages 48/48.
  - Crawler checks 746/770. The baseline was 731/756, so failures went from 25 to 24, and the new page passes its checks.
  - Fewest words: /learn/ 281, /tools/ 293. Every page is over 250.
- Sideways scroll: none on 53 inner pages at 320, 390, 1440 and 3840 (`hscroll.js`). Empty slots: 0.
- LCP on slow 4G (150 ms RTT, 1.6 Mbps, 4× CPU), measured during the build at 1440 and 390 on representative pages:
  - The H1 or lede text is the LCP element at 0.6 to 0.7 s on most pages.
  - Where a head still is the LCP element, it is the 1600 AVIF at 1.07 to 1.40 s (/pilot/ 1.07 s, /platform/ 1.40 s, /solutions/ 1.26 s).
  - Before the 1600-rung rule, /solutions/ hit 1.78 s on a 3840 file.
- The final 10-page LCP run is in `shots/result.json`.
  - Every LCP was 0.59 to 1.27 s.
  - The text elements were 0.59 to 0.92 s.
  - The head stills were 1.02 to 1.27 s: /pilot/ 1.02, /use-cases/find-the-asset/ 1.03, /solutions/ 1.27.
  - AmIMo at 390: the render is the LCP element at 0.92 s.
  - No sideways scroll, no empty slots.
  - Four broken images were the footer job crops (`/assets/home/jobs/*`). They belong to the homepage team's footer and were missing from dist at that moment. They are not inner-page pictures.
- JavaScript off: the explainer reads as three steps beside the full drawing (all layers shown). The closer look shows each feature with its own picture. The local bar is plain anchor links. The `/pilot/` answers are links.
- Reduced motion: the push-in is off, and the closer look's turn becomes a cut. The explainer still changes which layer is lit but nothing moves.

## Shots

`shots/<page>-1440.jpg` and `-390.jpg` are full pages stitched and scaled. `-top.png` is the first screen. The pages are `/products/`, `/products/amigo/`, `/products/amimo/`, `/technology/`, `/pilot/`, `/how-to-buy/`, `/trust/`, `/learn/`, `/solutions/` and `/use-cases/find-the-asset/`.

## Not built, and why

- **R9, R10 and R11 sequences (closer-look turntable frames, AmIGo lowering onto the trolley, the covers parting).** These renders do not exist yet: `team/rounds/11-renders/manifest.md` is not written. The closer look uses the existing CAD angles in `assets/img`, which are the founders' CAD from round 02 and slightly cooler in grade than `assets/home`. When R9 lands, swap the angles in the `cad()` calls in `p_platform.py`. The lowering and covers stages should use the same sticky-stage pattern as `explain()`. No empty stage was added.
- **R12 hall line drawing for the /technology/ head.** It is not rendered yet, so the head uses `hall-find`. Swap `hallslot("hall-find", …)` for the R12 base when it lands.
- **/diagnostic/ zone masks (R4).** Not rendered yet, so the diagnostic keeps its 2D sketch.
- **Inline figures every 2 to 3 paragraphs in articles.** Only one or two distinct stills exist per subject today, and repeating them would read as filler. The explainer block is ready for articles once the R-renders give each mechanism its own picture.
- **/resources/: dated field-notes list and kit covers.** The page has no dated notes or kits in its copy, so building them would need new content. It gets the template upgrades only.
- **Stand-ins repeat.** Until all stills land, some pages (the /learn/ tiles above all) cycle through 3 or 4 stills. Each is a real Sky Ground hall still with its own true alt, and they swap automatically as files arrive in `site/src/assets/hall/`.
