# Round 12, homepage build: notes

2 Nov 2026. Built from `team/rounds/10-harvest/plan.md` section 1 (homepage S0 to S7), section 2 (global components) and section 3 (motion system). Copy is word for word from homepage-final.md; only layout, size, order and motion changed.

## What is built

| Screen | Form | Motion (one signature move) | JS off / reduced motion |
|---|---|---|---|
| S0 bar | 56 px desktop, 52 px phone, links 15 px, 36 px pill with chevron. Phone dock (48 px button in a 56 px bar) slides in once the hero runway is behind you | dock slide | bar only |
| S1 hero | H1 at `--size-display` (133 px at 1440), the AmIGo still on flat ground, the lede under it | 340 svh runway: tag (turntable when R1 lands), H1 hands over to the lede, the five sentences ink in one by one, the tag scales to 0.6 | H1, still and full lede as a normal first screen |
| S1b ±10 cm | `±10 cm` as `<data>` at `--size-giant` (about 290 px at 1440), the exact line "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor.", AmIGo macro bleeding off the right | macro drift and push-in (view timeline) | still |
| S1c film | Sky Ground hall film full bleed, sticky; S2 slides over it | plays at 50% or more in view and uncovered, pause/play button 44 px | poster; reduced motion offers play |
| S2 Find it | two-column header, then a 280 svh sticky stage: 4:5 frame left, copy right | Scan frame wipes to Tag, frame tightens 1.0 to 1.35 on the racks, paragraphs arrive; Scan/Tag switch reports the state and jumps the runway | Scan/Tag switch works with CSS radio buttons |
| S2b explainer | four steps in inline SVG: pulse, arrival bars, solve, located dot; captions are the homepage's own lines | 400 svh pinned stage, hard-cut steps | four-panel strip |
| S3 waits | hall-waits full bleed and sticky, "See where work [queue crop] waits." bottom-left, copy slides over on surface in two columns | words build, push-in 1.0 to 1.06 | still with headline (phones: headline under the picture) |
| S4 Ask | the one ink band; h2 in brand blue, the question at h2 size in white; three question chips zoom the wide hall to their zone | chip change (user-triggered) | chips are radio buttons, work without JS |
| S5 One system | giant AmIGo/AmIMo names at 26vw in ink 6% behind the pair, 7/5 mosaic, chip tabs, four-number strip with conditions | names slide apart across the view | mosaic plus the three blocks stacked |
| S6 Start | the bay still sticky at left (7 cols), offer copy right, What you buy large, the diagnostic's first question inline (a tap stores the answer in the diagnostic's own session key and opens /diagnostic/) | none | plain links |
| S7 close | the one action band: "See it on real data." at up to 112 px, white pill | none | same |
| Footer | Start from your job as four columns, each under a camera A crop (inspection, staging, press, racks), the twelve role lines; four link columns at 15 px; logo, entity, contact, legal on hairlines | none | same |

Global: pill buttons (48 px, chevron moves 3 px over 150 ms, press 0.97, white variant), `.go` links (19 px, chevron, underline on hover at 4 px), type scale (`--size-giant`, display 3.5 to 11 rem, h2 to 6 rem, lede to 30 px, body 17 to 20 px, nothing under 15 px but legal), `--hairline`, bands ground → surface → ink (S4 only) → action (S7 only).

Motion system: `html.motion` is set in the head before first paint (no reduced motion), so runways never shift layout. `[data-stage]` (sticky stage in a runway, `contain` range) and `[data-view]` (`cover` range) get `--p` from CSS scroll-driven animations (`@property --p`, `animation-timeline: view()`), or from `js/stage.js` (one rAF, gated by one IntersectionObserver) where unsupported. Only transform, opacity, clip-path and text colour move. `stage.js` is 3.3 KB gzipped.

## Checks (scratch build, Chromium, slow 4G 150 ms / 1.6 Mbps, CPU x4)

- LCP element is the H1: 528 ms at 1440, 508 ms at 390, 584 ms at 320. The hero still is painted into the hero canvas once JS runs (the `<img>` stays the picture with JS off), so the H1 stays the largest paint.
- CLS 0.0006 at 1440, 0 at 390.
- First screen about 158 KB transferred with the HTML uncompressed (89 KB raw, 23 KB gzipped): fonts 42 KB, AmIGo still 17.5 KB, stage.js 8 KB raw.
- No horizontal scroll at 320, 390, 1440, 3840.
- `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`: homepage 14/14 crawler checks; crawler 746/770 (baseline 731/756 with one page fewer: failures 24, were 25), site files 7/8, unbranded 38/38, branded 9/10, canonical 48/48, barred claims 0. No regressions.
- build.py now fails the build if the homepage shows a `<data>` figure outside the register (±10 cm, 0.1 to 10 Hz, 1 to 3 years, about 50 m, 3 to 8 m) or points at a picture that does not exist.
- `build.py --out <dir>` builds somewhere other than dist/ (several teams build at once; a shared dist/ collided once).

## Stand-ins (every slot has a real picture; nothing empty)

| Plan job | Where | Stand-in now | Swap |
|---|---|---|---|
| R1 turntable | S1 | CAD studio still `amigo-page` | Automatic: build.py wires any `*turn*`/`*tt*-1080-NNN.avif` sequence (with its `-720-` twin, 24+ frames) under `assets/home/` into the hero canvas (`wire_turntable`). Tested with temporary frames |
| R2 macro | S1b | `amigo-macro-*`, a crop of the 7680 CAD still (logo and screw ear) | replace the `<figure class="macro">` srcset |
| R5 before/after + trail SVG | S2 | hero film frame 3.8 s (before: ticks only, `home/find/scan-4x5-*`) and the film poster (after); same camera, aligned | swap both pictures; add the trail SVG over `.find-frame` with stroke-dashoffset on `--p` |
| R4 hall + zone masks | S4 | `hall-all` with a zoom to each zone per chip | overlay the four masks in `.ask-hall` per chip |
| R6 queue | S3 | `hall-waits` (16:9) and `queue-chip` cut from it | swap picture; re-cut the chip |
| R3 / R3b family | S5 | CAD `pair` | swap picture; R3b dolly could scrub on the existing `.fam` `--p` |
| R13 AmIMo on column | S5 tile | CAD `amimo-page` | swap tile |
| R7 one bay | S6 | `hall-waits-43` (inspection bay and queue) with its own alt | swap picture and use the screen 6 alt |
| R8 job crops | footer | `home/jobs/*` cut from `hall-all-3840` | swap the four crops |

At the end of this round the round 11 manifest did not exist yet and only 4 turntable frames were in `team/rounds/11-renders/work/tt`; no render had landed in `site/src/assets/`.

## Small calls made on the way

- S1b sets the existing S5 sentence beside the number rather than the plan's new line "With AmIMo anchors...", so no words were added; "these anchors" reads off the hero's "Anchors on your columns".
- S2b has no visible heading (aria-label "How it locates a tag"); its captions are homepage lines from S1 and S5.
- S4 chips use the page's only three questions (the S4 question and two nav labels). The stats' labels and conditions come from /specs/ rows.
- New UI words only: Scan, Tag, Pause/Play the film (aria), group labels. One new alt for the scan frame.
- The film's HTML caption from the plan was left out (hard rule: no captions on pictures); the alt carries it.
- Commit granularity: global components and the first full S1–S7 pass went in as two commits, then per-screen rework commits.

## Shots

`shots/`: `home-1440.jpg`, `home-390.jpg` (motion on; sticky stages render as runways in a full-page capture), `-nojs` and `-reduced` variants, `hero-{1440,390}-{0..4}.jpg` and `find-{1440,390}-{0..4}.jpg` at 0, 25, 50, 75, 100% of each runway. Tools in `tools/` (shoot.js, at.js, fullv.js, perf.js, cut.py).
