# Round 10, harvest: the merged enhancement plan

2 Nov 2026. All 150 team members went to the reference sites live (Playwright, 1440×900 and 390×844, 6 to 13 scroll positions each; captures in `caps/`, not committed). Each of them picked one pattern (`picks.md`). Duplicate picks are merged here into 24 patterns (M01 to M24), set out in build order.

Nothing built is removed. The copy stays word for word. Only its layout, size and order on the screen change. Palette tokens, AmI fonts, the truth rules, CAD-only hardware, hall-only floors, no labels, no glow and no decorative gradients all still apply. The first screen stays under 300 KB with LCP under 1.8 s on slow 4G. Every page works with JavaScript off, and motion is progressive enhancement that settles to a designed still under `prefers-reduced-motion`.

## What is missing today (measured, ours against the library)

| | Ours (homepage capture) | Strongest references |
|---|---|---|
| Biggest type on the page | 77 px (H1) | Rivian 360 px "R1S", darkroom 200 px, Waymo 159 px "10X", Zipline 150 px, AirPods 96 px |
| Pinned or scroll-driven stages | 0 | Helion 1440×900 sticky stage, Vision Pro 1440×848, Vention 2 sticky panels, Symbotic, Pixxel |
| Video or canvas in view | 0 | Vision Pro 15 videos, AirPods 9, Rivian 12 canvases, ciechanowski 12 interactive canvases |
| Pictures in the 7 home screens | 2 real, 5 empty boxes | Every reference: 0 empty slots |
| Layouts used | 1 (text left, box right), repeated | AirPods 7 distinct section forms in 13 screens |
| Background bands | 1 colour all the way down | Apple alternates light, white and black. Waymo has one full brand-colour band |
| Interactive things | 0 | Vention zone tabs, AirPods closer look, Augury before/after, ciechanowski draggable figures |
| Buttons | 44 px flat rectangle, no hover motion | Stripe and Apple: pill plus chevron that moves 3 px, press feedback |
| Nav height | 89 px | Apple 44 px global plus 52 px sticky local nav with a Buy pill |
| /products/ | Directory listing (no index page) | Apple and Verkada lineup pages |

## Build order

### 1. Homepage, screen by screen

The order below is the new spine, adapted from AirPods Pro: turn, number, find, explain, waits, ask, system, start, close. Screen numbers match homepage-final.md, and the new screens are lettered.

**S0 Nav (M13).** The bar drops from 89 px to 56 px on desktop and 52 px on phone. The links stay the same. "Book a call" becomes a 36 px pill. On a phone, a 48 px bottom bar with "Book a call" slides in after S1 (Apple's always-present Buy, picked by Conversion Designer). Picks: iPhone global nav, AirPods local nav, Vercel prefetch.

**S1 Hero, the AmIGo turntable (M01, M11, M12).** Picks: AirPods (unit lead, CAD animator, story architect), AirTag (first-second designer, small-phone inspector), Zipline (hero typesetter), TE (motion restraint), Things (critical path).
- First paint: the H1 "Where work is. Where it waits." at the new giant display size, clamp(3.5rem, 2rem + 7vw, 11rem). The H1 stays the LCP element. Under it sits the AmIGo poster frame at about 50 vh on flat #f0f6ff. Nothing else shows.
- Scroll: a 240 vh runway with a sticky stage (the shelved `hero.js`, rewired). Over the first 70% of the runway the tag turns about 270°. The five lede sentences then reveal one at a time, centred at 28 to 30 px and greying in to ink (M12, Vision Pro). Finally the stage scales to 0.6 and hands over.
- Phone: the stage takes 55 svh with the copy block at the bottom (AirPods m0), using 720 px frames.
- JavaScript off or reduced motion: poster plus full lede, a normal first screen.
- Asset: render job R1 (96-frame turntable).

**S1b ±10 cm, the giant spec callout (M02, M18).** Picks: Waymo "10X" (benchmark tester, structure hierarchy, buyer-truth lead, claims auditor), AirPods "2x more" (structure for machines), Lumafield stat row (executive voice).
- One screen. "±10 cm" at clamp(6rem, 2rem + 18vw, 22rem) in AmI Display 600, tracking -0.05em, set as text inside a `<data>` element. Beside it, at lede size: "With AmIMo anchors. How close depends on your floor."
- Background: the AmIGo macro (render R2) bleeds off the right edge, cropped to the debossed logo, on ground colour.
- The register check in build.py fails the build if a number is not in the claims register.

**S1c Hall film, full bleed (M05, M24).** Picks: Vision Pro "The ultimate theater" (film tech director, hero film lead, film script writer), SpaceX (film director).
- The existing 9 s hall film moves from its column box to a 100 svh full-bleed sticky panel. It plays only in view and has a 36 px pause button bottom-right. Its HTML title overlay is the existing hero alt-text idea, kept as a picture caption, not a label on the image.
- Poster AVIF. AV1 about 1 MB plus H.264. `preload=none`.

**S2 Find it, the finding moment (M06, M07).** Picks: AirTag "Cold. Warm. Warmer. Hot." (creative director, number-one judge, supervisor reader), Augury Legacy vs With (before-after inventor, production control reader).
- A sticky stage of 2 scroll screens. Frame 1 is the "before" hall still (R5): pale, with blue checkpoint ticks only. As you scroll, the trolley's blue trail draws as an SVG path over the "after" still (stroke-dashoffset tied to scroll). The frame tightens from 1.0 to 1.35 on the stopped trolley behind the racks.
- Copy goes in the two-column header (M16): the headline left, "Between scans…" right. The remaining paragraphs reveal beside the stage as you scroll.
- A small two-state switch ("Scan" / "Tag") lets anyone flip the frame back. With JavaScript off it shows both stills stacked with the existing copy.
- No UI, phone or numbers, per homepage-final.md V13.

**S2b How it finds a tag, the sticky explainer (M04).** Picks: Helion "How fusion works" (explainer diagram designer, experience lead, design engineering lead, storyboard artist).
- One pinned 100 vh stage in 4 steps of about 50 vh each: the tag pulses, three AmIMo anchors receive it at slightly different times (horizontal timing bars, no rings), AmIHub solves, and a single blue dot lands. The caption swaps under the stage, using existing technology copy.
- Inline SVG, about 8 KB, plus about 2 KB JS. Static 4-panel strip with JavaScript off.
- The full version lives on /technology/ (see 5).

**S3 See where work waits, a full-bleed moment (M05, M11, M16).** Picks: SpaceX stacked panels (structure lead), Vision Pro headline over picture (headline writer), Zipline kinetic line (fresh-eyes critic).
- The queue still (R6, camera A crop on the inspection queue: three trolleys and one pallet on amber) is a 100 svh sticky full-bleed panel. The headline "See where work waits." sits bottom-left over the pale floor and builds word by word. A 1.2 em amber crop of the queue is set inline between "work" and "waits".
- The panel slides over S2 (SpaceX stack, a hard cut, no fade). The copy runs as a normal section on surface #fff underneath, in the two-column header pattern.
- Scroll-linked push-in from 1.0 to 1.06 (Figure).

**S4 Ask your floor, the interactive demo on the one dark band (M08, M10).** Picks: Vention zone tabs (industrial environment modeller, experience lead, usability tester, diagnostic designer), AirPods bands (section rhythm).
- Full-bleed ink #0b1238 band, the page's only dark band. The question "Which trolleys have waited at inspection for more than an hour?" is set at H2 size in white.
- Below it is the wide hall still (R4) and three question chips taken from existing copy. Each chip lights its zone mask over the still. For example, the inspection-queue chip shows the three amber trolleys. Masks are R4 passes. No answer card and no fake numbers (homepage-final.md V35 rules stand).
- The MCP paragraph stays, smaller, in the right column (for IT).
- With JavaScript off, chips are plain links and the still shows the inspection state.

**S5 One system, the product family stage (M03, M09, M02).** Picks: Rivian giant name on studio cyc (realism lead, product render director, typographer, render reviewer), Anduril mosaic (reference analyst, layout designer), 1X trio at true scale (scale artist), Verkada chip tabs (component builder, OT reader), Lumafield four-number strip.
- Stage: AmIGo and AmIMo on one continuous #f0f6ff sweep at true relative scale (R3). The words "AmIGo" and "AmIMo" are set as HTML at 26vw in ink at 6% behind the products.
- Scroll: a 24-frame lateral dolly (R3b) slides from the tag to the anchor.
- Below the stage is an asymmetric 7/5 mosaic: AmIHub as the large tile (hall crop, or the real live-map capture once allowed), with AmIGo and AmIMo stacked small. Names sit bottom-left as HTML.
- Copy goes into three chip tabs (AmIGo · AmIMo · AmIHub) that swap the text block. With JavaScript off, all three blocks show stacked, as today.
- Four-number strip under it: ±10 cm · 0.1 to 10 Hz · 1 to 3 years · about 50 m. Each sits at 72 px with its condition line from the register.

**S6 Start with one bay, an offer screen with an inline start (M20).** Picks: Formlabs offer-as-headline (plant head reader, pilot offer designer), Mercury inline field (growth lead, forms engineer).
- One-bay still (R7: one bay of the hall with three trolleys and three anchors, pale) at the left, about 60% of the screen. "Start with one bay." sits at H2 size, with "What you buy" set large in the right column.
- The first diagnostic question is rendered inline as 3 to 4 answer buttons. A tap opens /diagnostic/ prefilled. With JavaScript off they are plain links.

**S7 Closing band, jobs and footer (M10, M15, M19).** Picks: Waymo brand band (brand system designer), Boston Dynamics jobs grid (buyer-path designer), Ather "Keep exploring" (local search lead).
- Full-bleed action #4b3df0 band: "See it on real data." at 72 px in white, with a white pill "Book a call" (7.5:1 contrast).
- "Start from your job" becomes a 4-column grid of hall crops, one per job (R8: inspection, staging, press, racks), each with the role and link from existing copy.
- Footer, rebuilt (see 2).

### 2. Global components

- **Nav (M13).** 56 px desktop, 52 px phone. Links at 15 px. The CTA is a 36 px pill. Product pages get a sticky local nav at 52 px (product name, Overview, Specs, Book a call). Prefetch on hover.
- **Buttons (M14).** Primary pill 48 px tall, padding 0 22px, radius 999px, action colour. A chevron `::after` moves 3 px on hover over 150 ms with `var(--ease-ds)`. Press scales to 0.97. Focus ring 2 px with 2 px offset. Secondary is a text link with chevron. White variant for the action band.
- **Links (M14).** "More" links at 19 px in action colour with a chevron. Underline only on hover, offset 4 px. Each section ends with one primary link at most.
- **Footer (M15).** Today it is 1,206 px tall with 51 links in grey text. New footer: Keep exploring (4 large routes), then a 4-column link list at 15 px, then a row with the logo, legal and "Built on the FiRa and omlox specifications". Surface #fff on ground, with a hairline top rule.
- **Type scale (M11).**
  - New `--size-giant`: clamp(6rem, 2rem + 18vw, 22rem).
  - `--size-display` raised to clamp(3.5rem, 2rem + 7vw, 11rem).
  - h2 up to 6rem.
  - Lede 28 to 30 px.
  - Body minimum 18 px on desktop.
  - Nothing under 15 px except legal.
  - Tabular numerals in stats.
  - Display subset preloaded.
- **Spacing rhythm (M16, M10).**
  - 12-column grid with 1 px rgba(11,18,56,.10) hairlines on section edges where structure helps.
  - Two-column section header: h2 in 5 columns, lead paragraph in 5 columns.
  - Section padding uses `--rhythm-l` around full-bleed moments and `--rhythm-m` between text sections.
  - Bands step ground #f0f6ff → surface #fff → ink #0b1238 (S4 only) → action #4b3df0 (S7 only).
- **Empty slots.** A picture slot without a still collapses. build.py fails on a missing src (picture inspector, Anduril).

### 3. Motion system (M17)

- One component: `partials/stage.html` plus `js/stage.js`. A sticky stage sits inside a runway, a single rAF writes `--p` (0 to 1) on scroll, and one IntersectionObserver gates it. CSS `animation-timeline: view()` is used where supported, with JS as the fallback.
- Allowed moves: frame-sequence scrub, SVG stroke draw, scale 1.0 to 1.35, translate, opacity, colour of text. Only transform and opacity are animated on the compositor. `will-change` is set only while a stage is in view.
- One signature move per screen at most (TE, Hero motion restraint). No timed intros, loaders or fades between sections. Section changes are hard cuts.
- Reduced motion: every stage has a designed end-state still. Videos show the poster with a play button.
- Video: plays in view at 50% or more, pauses out of view, and always has a visible pause control (WCAG 2.2.2).
- Budgets, checked by build.py:
  - First screen under 300 KB.
  - Each later screen under 400 KB when it comes into view.
  - Sequences load only after onload, never on Save-Data or 2G/3G effectiveType.
  - JS total under 20 KB gzip.
- Regression: shoot.js captures 0%, 50% and 100% of each stage, normal and reduced.

### 4. Inner page templates

- **/products/ index (new; today a directory listing).** H1 "Products", then a lineup row of three renders (Apple iPhone), a compare table as HTML text with Product JSON-LD (no price), and links.
- **Product page (AmIGo, AmIMo).**
  - Sticky local nav.
  - Hero with the giant product name behind the render on the sweep (Rivian).
  - Stat strip with conditions.
  - "Closer look" explorer (AirPods d4): a feature list on the left, where picking a feature turns the product to the matching turntable frame (5 angles from R9).
  - AmIGo lowering onto the trolley rail on scroll (Zipline drone; R10).
  - AmIGo two covers separating (R11, CAD parts only).
  - Spec table in hairline frames with tabular numerals (Oxide).
  - FAQ.
- **/technology/.**
  - Hairline drawing of the hall as the header (Hadrian, R12).
  - The full sticky explainer (M04).
  - Draggable tag demo: three anchors with arrival-time bars and a solved dot (ciechanowski GPS, Red Blob). Static fallback.
  - Time-of-flight slider: distance to nanoseconds (ciechanowski clock).
  - Sticky in-page section bar under the global nav with Book a call at the right (NVIDIA Omniverse).
- **/pilot/.** The offer as the headline with the one-bay still (Formlabs), the inline diagnostic start, then what you buy.
- **/diagnostic/.** Answers light hall zones on the R4 masks (Vention).
- **/learn/.** The index becomes illustrated tiles, one hall crop or diagram per article, with the diagnostic start as one tile (The Pudding). Articles get inline figures every 2 to 3 paragraphs (Red Blob) and reuse the shared stage where a mechanism needs steps. The scan vs tag page gets a two-column checklist table (Apple Privacy "Safari" comparison).
- **/how-to-buy/.** Three flat columns for the ways to buy (iPhone "Why buy here").
- **/trust/.** Four plain pillars set large (Apple Privacy).
- **/resources/.** Dated field-notes list (Anduril News) and champion-kit covers (Stripe Press).
- **/tools/.** Anchor estimator (Vention configurator idea), labelled as an estimate per the survey rule.

### 5. Render jobs for the realism lab

All hardware comes from `team/rounds/02-design/renders/render_hardware.py` (CAD parts only, Cycles, page_grade to the band colour it sits on). All floors come from `team/rounds/03-hero-film/build_hall.py` with `--palette sky/palette.json`. No labels and no added parts.

| # | Job | Script and camera | Frames and sizes | Used in |
|---|---|---|---|---|
| R1 | AmIGo scroll turntable | render_hardware.py new `--turntable`: AmIGo on #f0f6ff sweep, 85 mm, el 22°, dist 0.35 m, az 0→360° in 3.75° steps, key az 150 el 55, fill 1:4 | 96 frames, 1080×1080 and 720×720 AVIF q45 (~16 / 9 KB) plus frame 0 at 1600 as poster. Transparent-ground variant for the dark band not needed | Home S1 |
| R2 | AmIGo macro | `amigo_logo` at 7680 px, f/8, crop on the debossed logo and screw ear | 3840/2400/1600 AVIF, ground #f0f6ff | Home S1b, AmIGo hero |
| R3 | Family stage still | New `family` shot: AmIGo front-left, AmIMo back-right at true CAD scale on one sweep, 85 mm, cam height 0.35 m, el 30°, 3:1 | 3840×1280, 2400, 1200 phone 4:5 crop | Home S5, /products/ |
| R3b | Family dolly | Same rig, camera tracks laterally 0.6 m | 24 frames 1920×640 AVIF (~40 KB) | Home S5 scroll |
| R4 | Hall wide plus zone masks | build_hall.py `--state after --res 3840x2160` camera A, plus 4 flat ink mask passes (inspection queue, staging lane, press line, racks) | 1 still plus 4 PNG masks at 1920 | Home S4 demo, /diagnostic/ |
| R5 | Before/after pair for Find it | build_hall.py `--state before` and `--state after`, camera A crop on press and racks, plus the stopped trolley's trail exported as an SVG path (projected world→screen) | 2 × 2400×1500 plus 1 SVG | Home S2 |
| R6 | Queue full-bleed | build_hall.py `--state after` crop on the inspection queue and staging lane | 3840×2160 plus 1:1 phone | Home S3 |
| R7 | One bay | build_hall.py, camera A tight on one bay, everything else pale | 2400×1600 plus 4:5 phone | Home S6, /pilot/ |
| R8 | Job crops | Camera A crops: inspection, staging, press, racks | 4 × 1200×900 | Home S7 jobs grid |
| R9 | Closer-look angles | `amigo_page` and AmIMo equivalent at az 0/90/180/270 and el 10/30/60, same rig | 5 per product, 1600×1600 | Product pages |
| R10 | AmIGo lowers onto trolley | Hall trolley rail plus CAD tag, tag z from 120 mm to 0 | 12 frames 1600×1000 | AmIGo page |
| R11 | AmIGo covers part | Top cover lifts 18 mm off the bottom cover, CAD parts only, el 25° | 24 frames 1200×1200 | AmIGo page |
| R12 | Hall line drawing | build_hall.py `--engine WORKBENCH`, top orthographic, outline pass | 3200×2000 PNG, inked #0b1238 at 30% | /technology/ header |
| R13 | AmIMo on column | New `amimo_column`: 70 mm from below, key el 60°, fill 1:6, single DC cable as homepage-final.md specifies | 2400 plus 1:1 | AmIMo hero, S5 tab |

### 6. Done when

- Every homepage screen has a real picture or a moving stage, and no slot is empty.
- At least 4 screens use different layouts: stage, full-bleed, dark band, mosaic, offer.
- At least one number is shown at 200 px or more.
- Two interactive parts work with JavaScript off (S2 switch, S4 chips).
- First screen under 300 KB and LCP under 1.8 s on slow 4G.
- Reduced motion shows designed stills.
- Side-by-side board: each new screen beside its reference pick at the same crop, scored at least 9 by the committee.

## Sites we could not capture live

Blocked by bot walls or region gates: Dyson, Tesla, Nothing, Framework, Ultrahuman, WHOOP, ANYbotics, Bambu Lab, Rocket Lab, Neal.fun and Active Theory ("browser not supported"). Screenshot timeouts, so only a first screen at most: Matic, Commonwealth Fusion, Redwood, Shield AI, NVIDIA Omniverse, Raycast, R2D3 and Resend. Lusion, Igloo, Bruno Simon, Kurzgesagt and The Evolution of Trust are single-screen WebGL/canvas apps, so only their first screen was captured. No pick relies on them. Several others showed cookie walls over part of the frame (Waymo, Augury, Lumafield, Exotec, Rivian). Their picks were read from the visible parts.
