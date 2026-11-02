# Storyboard: one visual story per page

Round 18. 2 Nov 2026. Covers all 56 pages in `site/dist`. Copy stays word for word: every block named here is an existing heading or paragraph. Visual labels inside live UI (tag IDs, times, metres, nanoseconds) are demo data drawn by code and never new claims. The only figures shown are ones already on the page (±10 cm, 30 cm per ns, 0.1 to 10 Hz, 1 to 3 years, 3 to 8 m, about 50 m).
Owners refer to bench.md. HF = Higgsfield item from `16-higgsfield/pack.md`. CAD = founders' meshes (AmIGo `top_cover`/`bottom_cover` exist in studio v1 `assets/cad/`; **AmIMo and AmIHub meshes must be exported the same way**, build step 1) or round 11 renders.

**Shared rules.**
- **One motion layer per screen.** On every screen, either the scroll, the picture or the UI moves. Never all three.
- **Reduced motion and no JS:** every moment falls back to a designed still (its poster, or the end state of the drawing). Shortcut used below: **RM** = reduced-motion still.
- **Phone:** nothing is pinned for more than 2 screens. Drag becomes tap-to-step or a horizontal swipe. three.js loads only on idle and only when `navigator.connection.saveData` is false; otherwise the CAD render poster is shown.
- **Weight:** three.js plus the loader is about 160 KB gzipped, loaded after LCP. Meshes are 40-120 KB each. Stills use AVIF ladders of 800/1600/2400. Films are AV1 plus H.264 and play only while in view.
- **Drawing language:** 1.5 px ink lines, `#1f6bff` for located, `#ffb020` for waiting, tabular figures, no glow, rings, arcs or gradients. Grade: one LUT plus 3-4% grain on every HF asset.

---

## A. Homepage `/` (owner Sofia; S2b Arjun, S7 Pablo)

The homepage's main picture is **F1**. The previous version's "one white hall on every screen" goes: the model hall now appears only where it is the map (S2, S4), never as decoration.

| Screen | Copy block (as is) | Visual treatment | Code | HF | CAD | Desktop / phone |
|---|---|---|---|---|---|---|
| **S0 Hero** | "Where work is. Where it waits." + lede | H1 builds line by line (mask reveal, 600 ms). Below it, the live AmIGo turns slowly on the page colour, with a soft contact shadow only. The cursor tilts it 8°. | `tag.js` (studio v1), lazy after the H1 paints | - | AmIGo mesh. R1 turntable frame 0 as the poster | D: live 3D, drag to turn. P: R1 poster; 3D only after idle on a good network |
| **S1 ±10 cm** | "±10 cm" + "With these anchors…" | The giant figure is live text. Under it, a 10 cm CAD-scale ruler draws its ticks as the R2 macro slides off the right edge. The ruler is true to the tag's real size on screen. | CSS scroll-timeline, SVG ruler | - | R2 macro | D: ruler draws on scroll. P: static ruler, macro below |
| **S1c Film** | (film figure, pause control) | **Signature moment: film becomes the map.** F1 runs 11 s: top-down, then the search on the ground, then top-down again. On the last frame a WebGL plane fades the footage into an orthographic map. The parked trolley becomes the located dot with its wait label. A zone outline draws on the clear floor. Scrolling on reverses it. | three.js plane, camera solved from F1-T, map layer in SVG | **F1** (16:9 and 9:16 masters) | AmIGo placed on the trolley rail in the last frame (Move 3) | D: full-bleed handover. P: 9:16 master with the subject in the top 60% and a live map strip in the bottom 40% that pans with the shot (Move 6). RM: poster plus static map |
| **S2 Find it** | "A scan tells you…" + Scan/Tag toggle + both paragraphs | Keep R5 before/after. Rebuild on the studio v1 `story.js` shader: scan ticks show as dashes, then the tag's path draws its own line. The frame tightens on the racks. The toggle still works without JS (radios). | `story.js` shader on R5 masks | - | - | D: 2-screen pin. P: no pin, toggle only, trail draws once |
| **S2b How it locates a tag** | 4 captions: "Sends a short UWB radio pulse…" / "Records when each pulse arrives…" / "Works out where…" / "One live map…" | The old grey boxes go. In their place is **the locate scene** (spec in section B), in its four-beat homepage cut. Beat 1: the CAD tag moves and lines go out to four CAD anchors, each with metres and ns. Beat 2: the arrival ticks land on a ruler. Beat 3: the lines resolve to a crosshair with x/y/z. Beat 4: the camera rises to top-down and the crosshair becomes the map dot. You can drag the tag at any beat. | `locate.js` (new, shared) | - | AmIGo + AmIMo meshes | D: pinned 4 beats, drag live. P: tap through 4 beats, drag in beat 3 only. RM: 4-panel strip rendered from the scene |
| **S3 Waits** | "See where work waits." + 3 paragraphs + links | The word-by-word H2 stays (with the queue chip). Behind it, **F6 is scrubbed by scroll.** About two hours pass and the trolley never moves. A live counter set as page text sits on the clear floor: "0 min … 118 min". An amber zone outline draws once the wait passes 60. | all-keyframe video or 60-frame AVIF sequence, scroll-scrubbed | **F6** | optional AmIGo on the rail | D: pinned scrub. P: 1:1 crop on the trolley side, scrub over 1.5 screens. RM: R6 hall-waits still |
| **S4 Ask** | "Ask your floor a question." + 3 questions + paragraphs | The one ink band. The chosen question types itself into the field. Its R4 zone mask cuts through a dark veil and the camera zooms to that zone (studio v1 shader). No answer card. | `story.js` mask shader, radios without JS | - | - | D: zoom per question. P: chips scroll sideways, mask without zoom |
| **S5 System** | "Three parts work as one system." + tabs + 3 part texts | **Live CAD stage:** tag, anchor and hub at true relative scale on one sweep, with the giant names behind. Each tab turns the stage to its part and draws a thin line with its range ("about 50 m" for AmIMo, as the copy says). | three.js stage shared with `/products/` | - | all three meshes. R3 family 3:1 as the poster | D: tabs drive the camera. P: one part per swipe, render posters |
| **S6 Start** | "Start with one bay." + 3 paragraphs + "What you buy." + "Plan your first bay." chips | bay-32 with one bay outline drawing in action colour as the H2 lands. The first diagnostic question stays inline. Picking a chip carries that choice down to S7. | CSS, small JS state | - | R7 bay-32 / bay-45 | D: split 60/40. P: 4:5 bay above copy |
| **S7 Close + simulator** | "See it on real data." + "The call is a live demo…" + Book a call | **Your floor (Move 8).** P-home-close is the top-down ground. Inputs are the S6 chips ("WIP carriers & bins" and the others) plus a count stepper, with no new words. Trolleys with CAD tags drop onto the floor and settle under light physics. The map strip below starts their wait clocks, and they turn amber past 60 min. "Book a call" stays the only CTA. | three.js instanced trolleys (line-drawn frames), rapier-lite or hand-rolled springs | **P-home-close** | AmIGo mesh on every trolley | D: drop, then drag a trolley to see its dot follow. P: stepper only, 2D map |

Handover detail (S1c): F1-T's camera (focal length, height, tilt) is solved once in Blender. The WebGL plane uses its inverse homography, so the footage pixel under the trolley maps to the map coordinate of the dot. The crossfade runs 700 ms with no dissolve on people. If the film fails to load in 2.5 s on a slow network, the map starts straight from the poster.

---

## B. The locate scene (`/technology/`, `/products/amigo/`, homepage S2b) (owner Arjun)

One engine (`locate.js`, three.js) and three cuts, each with its own signature moment.

**Scene.** A light floor plane (#f0f6ff) carries the R12 hall line drawing as its texture, so the floor is our own drawing. There are four AmIMo CAD anchors on columns, 3 to 8 m up (heights shown on thin vertical leaders). The AmIGo CAD tag sits on a line-drawn trolley frame. The camera is a 28° perspective with orbit locked to ±25°.

**Lines and numbers, never rings or glow.**
- **Tag to anchor:** a straight 1.5 px line to each anchor, labelled at its midpoint "12.41 m · 41.4 ns". Time is distance / 0.2998 m per ns, so 30 cm is about 1 ns, as the page says.
- **Timing ruler** under the scene: one horizontal ns axis with four ticks, one per anchor, where each pulse arrives. The first arrival is 0. The others read "+3.2 ns" and so on. This is TDoA made visible.
- **Angle:** in the anchor's local frame, two short orthogonal leader lines with "az 34° · el −12°". No arc.
- **Solve:** the lines meet at a crosshair labelled "x 14.20 m · y 6.85 m · z 1.10 m" and the time seen (hh:mm:ss.s).
- **Drag:** the visitor drags the tag (pointer or touch). Every number updates live at 60 fps. Releasing it eases it onto the floor with a weighted spring.

| Cut | Signature moment | Beats mapped to copy |
|---|---|---|
| **`/technology/`** | **Drag the tag, read the nanoseconds.** The timing ruler is the hero. | Head (H1 + lede): the scene replaces the line-drawing head (the drawing becomes its floor). "Light travels about 30 cm in a nanosecond.": "30 cm" is set as a giant figure, a 30 cm segment is drawn on one line, and a "1 ns" tick appears on the ruler. "Time": ruler highlighted, drag live. "Angle": the camera swings side-on to show elevation, and az/el leaders appear. "The map": the crosshair solves, the camera goes top-down, and the stamped time types in. |
| **`/products/amigo/`** | **It sleeps when you let go.** | "Speaks when it moves. Sleeps when it stops.": while you drag, the tag sends at the update rate (a tick on the ruler per pulse). Let go, and 1.5 s later the lines withdraw, the tag dims to its sleep state, and a "last seen 14:02:11" stamp stays on the map. "Fewer pulses. Longer life.": a 0.1 to 10 Hz stepper changes how many pulses tick past. A small pulse counter sits beside the "1 to 3 years" figure (no new battery claim). |
| **Homepage S2b** | 4 beats, see section A | the four captions |

**Steel variant (`/technology/` "Steel and racking.")** A CAD-free rack block (line-drawn box) sits between the tag and one anchor. Drag the tag behind it: the direct line turns dashed (blocked), and a reflected line bends off the rack face with its own "+2.7 ns later" label on the ruler. This shows the copy's "each echo arrives a little after the direct signal". P-technology (real steel, no drawn radio) sits beside it at 4:3.

**Phone.** The scene is 4:5, with drag on the tag only (page scroll stays free). The ruler sits under the scene as a single line. **RM:** three pre-rendered frames from the scene (start, ruler, solved).

---

## C. Products (owner Ines)

**`/products/`.** **Moment:** the three parts assemble at true scale on one live stage, with a 10 cm scale bar.
- **Main picture:** the live CAD trio. The R3 family render is the poster only.
- **Sections:** "Side by side." is a table with sticky CAD thumbnails per column. "How a position is made." is a 3-line strip linking to /technology/.
- **Motion:** the trio rotates on scroll (D); a static poster (P).

**`/products/amigo/`.** **Moment:** see B ("It sleeps when you let go").
- **Head:** live AmIGo (`tag.js`), drag to turn.
- **Spec band:** "±10 cm / 0.1 to 10 Hz / 1 to 3 years / −20 to +60 °C" count up once.
- **"Where the battery life comes from.":** P-products-amigo, the tag on a real trolley (CAD composite, Move 3). Hover sharpens the tag.
- **"One tag. Fitted three ways.":** three CAD poses of the tag (screwed through its ears, in a cradle outline, on a tool outline).
- **"The tag names the trolley…":** a two-row link bar (trolley ID / job) that hands over from one link to the next.
- **D/P:** 3D on desktop, posters plus scene on tap on phone.

**`/products/amimo/`.** **Moment:** an x-ray slider (Move 4) on P-products-amimo. The left half is the real column; the right half is the model, with the CAD anchor, a 3 to 8 m height ruler and the "about 50 m" reach drawn as a straight dimension line.
- **"What you run to it. Power, and nothing else.":** M-products-amimo macro, with the single cable traced in ink.
- **"Three radios. One anchor.":** exploded CAD (needs the AmIMo mesh), each radio part labelled.
- **"Every floor starts with a survey.":** the slider.
- **D/P:** drag the slider on desktop, swipe on phone. RM: 50/50 still.

**`/products/amihub/`.** **Moment:** records, not pixels. A plan drawn in code, schematic and never a fake screen (O5). Zone events type in as plain-language rows ("T-114 entered Inspection 14:02:11") and their zones blink in the order they happen.
- **"Your systems keep their jobs.":** each row flies to a named slot ("MES", "WMS") that is already in the copy.
- **"Ask your floor a question.":** links to S4. Only one question types out here, not all three.
- **"Inside your plant. Or in the cloud.":** P-products-amihub (the closed cabinet on site).
- **D/P:** rows stream on desktop; 3 rows, static, on phone.

**`/specs/`.** **Moment:** a CAD blueprint. Orthographic three-view of AmIGo with live dimension lines from the mesh bounds. Each figure is in large tabular type, and tapping it reveals its condition underlined.
- **"Not published yet.":** items shown as empty dashed slots.
- **D/P:** the same on both, no pin.

---

## D. Technology and platform (owner Arjun)

**`/technology/`.** See B. Other sections:
- **"When something goes quiet.":** three small live tiles. A tag at rest: the last-seen time keeps ageing. A tag out of view: a load box slides over it and the stamp freezes. An anchor goes dark: one CAD anchor greys, and a thin alert line runs to the hub.
- **"Choose the method per zone.":** zone chips colour areas of the floor drawing.
- **"Open standards.":** type only.

**`/platform/`.** **Moment:** an exploded stack. Tag, anchor, hub and your systems sit as four thin planes that pull apart on scroll with spring physics. The hall-all model is the bottom plane.
- **"What each part does.":** each plane is lit in turn.
- **"How a position is made.":** one record's journey up the stack (a timestamped row climbing). This is not the locate scene.
- **"Who keeps what.":** three columns.
- **"Inside your plant. Or in the cloud.":** a two-state toggle that moves the hub plane across a horizontal boundary.
- **"The figures…":** a count-up row.
- **"Open at every layer.":** interface names appear on their planes.
- **D/P:** stack on desktop; flat vertical list with planes as 2D bands on phone.

**`/industrial-spatial-intelligence/`.** **Moment:** three layers peeled off one photograph. On P-industrial-spatial-intelligence, scroll adds dots (location), then durations (time), then job labels (context). This lines up with "Three layers. One answer."
- **"How it differs.":** a three-step scrubber over the same still (scan ticks / RTLS dots / spatial waits).
- **"What location alone cannot tell you.":** the job layer is shown empty with dashed outlines.
- **D/P:** pinned peel on desktop; 3 stacked crops on phone.

---

## E. Solutions and industries (owner Clara; lines drawn on the photograph)

**`/solutions/`.** **Moment:** two questions split one still. P-solutions is cut down the middle. The left half draws "where" (a located dot plus its path) and the right half draws "how long" (amber zone plus a clock), each as the H1 halves land.
- **"The same map, for each kind of floor.":** 3 industry cards with their HF crops.
- **"Four jobs, start to finish.":** use-case cards.
- **D/P:** the split on desktop; on phone, left then right, stacked.

**`/solutions/wip/`.** **Moment:** a queue that never empties. F2 loops while an amber outline sits on the yellow rectangle. Wait clocks on each trolley keep rising across loops, because the loop resets the film but never the clocks.
- **"Tag. Locate. Link. Then time the wait.":** M-solutions-wip macro (a hand on the handle) beside the 4 steps, which tick as you pass.
- **"Queued is not finished.":** hall-wip (moved here).
- **D/P:** F2 on desktop; on phone, F2 cropped to the centre 45% with clocks below the frame.

**`/solutions/assets/`.** **Moment:** the empty place on the shelf. On P-solutions-assets, hovering or tapping the gap draws a thin line from the gap to a mini plan showing where the item was last seen and when.
- **Head:** keeps hall-assets.
- **"When a tag goes quiet.":** the stamp ages.
- **"Count today's search…":** links to /tools/search-time/.

**`/industries/`.** **Moment:** one floor plan rearranges itself. Picking a card in "Start from your kind of floor." redraws the same plan's zones as machining, stores or dock with spring motion.
- **Head:** P-industries.
- **"What changes from floor to floor.":** M-industries (the real part).

**`/industries/manufacturing/`.** **Moment:** the gap between cells gets a number. Over the hall-mfg head, scroll draws flow arrows between cells, and each gap carries a growing minutes figure.
- **"Inspection is where queues hide.":** P-industries-manufacturing, with one ink line marking the room's wall and the queue outside it in amber.
- **"Steel, presses and racking.":** links to the steel variant.

**`/industries/robotics/`.** **Moment:** two maps aligned. A grey robot-fleet map and the blue AmIMotion map sit offset. Scrolling slides them into register, and only trolleys appear on the blue one. This matches "A shared map, beside the robots' own."
- **Picture:** P-industries-robotics in that section.
- **Head:** keeps hall-robot.

**`/industries/warehousing/`.** **Moment:** a dock-to-stock stopwatch. A pallet path draws on a top-down plan from dock door to rack, and each leg is stamped with its time.
- **"Dock to stock, timed.":** P-industries-warehousing.
- **Head:** keeps hall-wh.

---

## F. Use cases (owner Pablo)

**`/use-cases/`.** **Moment:** four errands cross one junction. On P-use-cases, hovering a card draws its errand path across the still.
- **"Pick the one your team lives with.":** the 4 cards keep their model crops.

**`/use-cases/find-the-asset/`.** **Moment:** the walk against the lookup. Two counters run side by side: a long walk path drawing its metres, and a single lookup line that resolves in one step.
- **"Today, and with AmIMotion.":** P-use-cases-find-the-asset (the stores counter).

**`/use-cases/station-to-station/`.** **Moment:** a ribbon of stamps. Each zone crossing drops a tick on a horizontal timeline that grows as you scroll, a live Gantt chart of one trolley.
- **"Entering a zone is not finishing a step.":** the tick at entry is hollow and turns solid only at exit.
- **Picture:** P-use-cases-station-to-station.

**`/use-cases/amr-hand-off/`.** **Moment:** the arrival record. The AMR's path (grey, the robot's own map) ends, and AmIHub stamps "arrived" as a row that snaps in under the drop point.
- **"AmIMotion watches. It does not drive.":** the robot path stays grey and is never redrawn by us.
- **Picture:** P-use-cases-amr-hand-off.

**`/use-cases/ask-your-plant/`.** **Moment:** a gate on the action. The question types out and the answer rows appear. A suggested action shows a locked switch that opens only after a separate "approved by supervisor" tap. This matches "Asking changes nothing. Acting needs a person."
- **Picture:** P-use-cases-ask-your-plant (the phone call today).

---

## G. Learn (owner Theo; every guide pins its two-part H1, question then answer)

| Page | Signature moment | Main picture | Section mapping (beyond H1, FAQ, Read next) |
|---|---|---|---|
| `/learn/` | A kinetic index: each group's titles run sideways at scroll speed, and hovering shows the tile crop | 15 model and CAD tiles (kept) | "Four quick answers." become 4 large answer lines |
| `/learn/accuracy/` | Measured and reported points plot as you scroll; hard spots in amber | **P-learn-accuracy** | "Include the hard places" adds amber points; "Measure data age separately" adds a second axis |
| `/learn/alternatives/` | Three lenses on one plan: scan ticks, gate line, path | **P-learn-alternatives** | "Side by side" toggles the lens; the "When…" sections lock one lens each |
| `/learn/anchor-planning/` | A worked example you drag: racking density and ceiling height move an anchor range | hall-bay (kept) | "A worked example" holds the slider; "How to get to a number" links to /tools/anchors/ |
| `/learn/association/` | Link brackets: trolley bar, job bars, one link ending before the next starts | **P-learn-association** (optional CAD tag) | "Why a link needs a start and an end" animates the brackets |
| `/learn/dwell-time/` | Drag a trolley across a zone edge and see the entry and exit stamps | **P-learn-dwell-time** | "Entry, exit and the edge" holds the drag; "Waits that cross a shift" adds a shift line |
| `/learn/location-data-quality/` | A freshness meter: the dot's age counts up and its stamp greys over time | **P-learn-location-data-quality** | "When an anchor goes dark": one anchor goes grey |
| `/learn/mcp-location-data/` | One request becomes one log line (text splits into fields) | none (text page, by design) | "Access, logs and approval": the log line is highlighted |
| `/learn/omlox/` | Several location feeds converge as lines into one hub line | none | "The parts" labels each feed |
| `/learn/pilot-baseline/` | Hand tally marks stroke in, then add up to the baseline figure | **P-learn-pilot-baseline** | "How to measure fairly": two tallies side by side |
| `/learn/rtls/` | The CAD pair turns to face each other as the definition sets | CAD pair (kept) | "Which radio it uses": a 3-row compare |
| `/learn/uwb-rtls-india/` | Seven questions tick down a sticky checklist | **P-learn-uwb-rtls-india** | "One question suppliers skip" is isolated and enlarged |
| `/learn/uwb-vs-rfid/` | Three footprints on one plan: gate line, hatched BLE area, UWB point | hall-before (kept) | "Trolleys and WIP specifically": **P-learn-uwb-vs-rfid** |
| `/learn/value-without-mes/` | Data order: the location and time column fills first, the job column fills later | none | "A pilot plan that works": the columns fill as weeks |
| `/learn/wip-visibility/` | Three overlays snap onto the still: location, time, job | **P-learn-wip-visibility** | "What it cannot tell you": the 'why' layer stays empty |

Phone, all guides: the H1 swap runs without a pin (crossfade at the fold). Diagrams draw once on entering view. RM: end-state SVG.

---

## H. Tools (owner Kenji; every input draws)

| Page | Signature moment | Main picture | Notes |
|---|---|---|---|
| `/tools/` | Question chips morph into the first input of their tool | none | "What these tools are not." in type only |
| `/tools/anchors/` | Floor area in, and anchor dots land on a plan with the min and max range shown as two outlines | the plan, live | "What the survey adds.": **P-tools-anchors** |
| `/tools/search-time/` | Searches times minutes, and the hours pile up as stacked bars, monthly | the bars, live | "Count it for real.": **P-tools-search-time** |
| `/tools/pilot/` | An A4 brief sheet fills section by section as you answer | **P-tools-pilot** (head) | the sheet previews on the right (D), below (P) |
| `/diagnostic/` | Each of the six answers adds a stroke to the bay-plan drawing (the existing SVG) | **P-diagnostic** (head) | "What you get back." shows the finished plan |
| `/resources/` | Tool cards show live mini-outputs on hover | none | "Where to begin.": a 3-step line |

---

## I. Conversion (owner Ruben; the path is a rail)

| Page | Signature moment | Main picture | Section mapping |
|---|---|---|---|
| `/pilot/` | A week calendar rail fills as "Five steps, in order." scroll past | **P-pilot** (4:5, beside the offer) | "Who does what.": role columns; "What the pilot leaves out.": struck items |
| `/start/` | One bay lights, then the plant grid grows around it without the first outline moving | the plan, live | "What a first bay proves.": **P-start** |
| `/how-to-buy/` | A sticky 4-step progress rail, with the current step in action colour | **P-how-to-buy** (4th card) | "Bring these to the call.": a checklist you can tick (localStorage) |
| `/contact/` | A CAD tag composited on the trolley rail in the still; hover sharpens it (Move 3) | **P-contact** (head) | "What happens next": a 3-step rail ending at the form |

---

## J. Company and trust (owner Lotte; proof in the page itself)

| Page | Signature moment | Main picture | Section mapping |
|---|---|---|---|
| `/company/` | "What we will not claim.": each line is struck through in ink as it reaches mid-screen | AmIGo exploded live (top and bottom covers part on scroll; replaces the CAD pair head, which /learn/rtls/ keeps) | "How we work.": **P-company**; "What we make.": part cards turn in 3D on hover |
| `/trust/` | Drag the data boundary between "your plant" and "cloud", and each data item moves to its side | the boundary, live | "Who can read it.": role chips filter rows |
| `/trust/people/` | "What the map shows": the overlay draws only the trolley's dot, and the person in the still is never drawn | **P-trust-people** (CAD tag) | "If you ever want to tag people.": type only |
| `/privacy/` | "What the site does not do": a live check reading the visitor's own cookie count (0) and storage keys | none | the rest is type only |
| `/what-is-amimotion/` | "The name": the AmIMotion wordmark splits into its parts as the paragraph reads | none | "Facts, with their conditions": conditions expand inline |

---

## K. Reference (owner Mia; text that comes apart into data)

| Page | Signature moment | Main picture | Notes |
|---|---|---|---|
| `/developers/` | "A zone event, in words.": the sentence splits into its fields on hover or tap | none | "Pick the interface.": a five-way switch |
| `/faq/` | Filter as you type, with matches marked in the answers | none | sections collapse into chips |
| `/glossary/` | An A to Z scrubber rail; each term gets a 24 px line glyph | none | "Read next." links |
| `/films/` | A contact strip of F1, F2 and F6 that scrubs on hover; "The nine seconds, in words" captions are synced to the timecode | F1/F2/F6 posters (model hall kept as the 9 s film) | "The same stories, on their own pages.": links |
| `/404.html` | A "last seen" stamp on the requested path, with links out | none | type only |

Uniqueness check: 56 pages, 56 different signature moments. Main pictures: each HF item is placed once, each kept model or CAD picture once (hall-bay, hall-before, hall-all, hall-assets, hall-mfg, hall-robot, hall-wh, CAD pair on /learn/rtls/ only, family render only as a poster), and live code scenes are each built for their own page.

---

## Build order (the 8 changes that lift the site most)

| # | Change | Hours |
|---|---|---|
| 1 | **Shared 3D core.** Port `tag.js` and the mesh loader from studio v1 into `site/src/js/`. Export AmIMo and AmIHub meshes the same way. Add lazy loading after LCP, the saveData guard and RM posters. | 8 |
| 2 | **The locate scene** (`locate.js`): lines, ns ruler, crosshair and drag. Ship the homepage S2b cut first, then the `/technology/` cut (plus the steel variant), then the `/products/amigo/` sleep cut. This replaces the grey-box diagram. | 16 |
| 3 | **Homepage F1 film and handover** (camera solve, WebGL plane, map layer) plus the 9:16 phone strip. Ship as soon as F1 lands; until then, use the model film with the same handover. | 14 |
| 4 | **Site-wide kinetic type and scroll system:** line reveals, the learn H1 swap, scroll-timeline with a JS fallback, all in core.css/js. | 8 |
| 5 | **Homepage S7 "your floor" simulator** on P-home-close, with chip state carried from S6. | 10 |
| 6 | **Homepage S3 F6 time scrub** with the live wait counter, plus the S5 live CAD stage (shared with `/products/`). | 8 |
| 7 | **Drop in the 36 HF stills and 3 macros** (AVIF ladders, slots per placements.md). Add the product-page moments: AmIMo x-ray slider and the contact/amigo CAD composites. | 12 |
| 8 | **Drawn-on-photo overlays** for solutions, industries and use cases (one SVG timeline per page, reusing a single `ink.js` helper). | 18 |

Total 94 h. Steps 1-3 alone (38 h) fix what Shiv named: the repeated hall, the childish diagram and the missing film-to-product moment.
