# Round 11 renders: manifest for the homepage build

The realism lab's deliveries for the render jobs in `team/rounds/10-harvest/plan.md` (section 5). Every file is under `site/src/assets/`. This file is updated as each job lands. Status values are **landed**, **rendering** or **queued**.

Rules held in every file:
- Hardware is the founders' CAD only. Nothing is added: no LED, no screws, no cable, no label.
- The hall is `03-hero-film/build_hall.py` with `sky/palette.json` and the stills' sky dome (`--world-color #dfeaff`).
- No people, no text, no numbers and no UI. The debossed "amimotion" on the covers is part of the CAD.
- No glow and no gradients added.
- Every CAD picture sits on the Sky Ground page #f0f6ff. The paper is flat-fielded with a rendered empty plate of the same camera (`tools/plate_grade.py`), then retinted with the colour team's paper-only white balance (#f5f5f2 to #f0f6ff, weighted by lightness). The dark plastic stays neutral: tag pixels measure R = G = B within 1 level, with no blue cast.

Formats:
- Stills ship as AVIF (4:4:4, q60) and WebP (q80, sharp YUV) at each width, Lanczos down from the master and never up.
- Sequences ship as AVIF only, one file per frame. Each sequence uses one fixed quality, picked so the mean frame lands on the byte target.
- Opaque CAD frames decode to #f0f6ff within 1 level at the edges. Set the stage background to `var(--ground)` (#f0f6ff) and no edge will show.

## Status

| Job | Screen | Status |
|---|---|---|
| R1 AmIGo turntable | Home S1 | rendering (96 frames, 1440 px) |
| R2 AmIGo macro | Home S1b | **landed** |
| R3 family stage still | Home S5, /products/ | **landed** (3:1 and 4:5) |
| R3b family dolly | Home S5 | queued |
| R4 hall wide plus 4 zone masks | Home S4, /diagnostic/ | **landed** |
| R5 before/after plus trail SVG | Home S2 | **landed** |
| R6 queue full-bleed | Home S3 | **landed** (see below) |
| R7 one bay | Home S6, /pilot/ | **landed** |
| R8 job crops | Home S7 | **landed** |
| R9 closer-look angles | Product pages | queued |
| R10 AmIGo lowers onto trolley | AmIGo page | see notes |
| R11 AmIGo covers part | AmIGo page | see notes |
| R12 hall line drawing | /technology/ header | **landed** |
| R13 AmIMo on column | AmIMo hero, S5 tab | see notes |

## R2 AmIGo macro (Home S1b): landed

A new macro of the tag's top cover (the `macro` shot): 100 mm, f/8, el 58°, focus on the logo plane. The debossed "amimotion" and the left screw ear sit on paper at the top and left. The tag's right end and its right ear run off the frame's right edge, so the page can bleed the picture off the viewport's right edge, as the plan asks. The bottom of the tag reaches the bottom edge.

| File | Size | Ratio | Bytes (AVIF / WebP) |
|---|---|---|---|
| `home/amigo-macro-r2-800.{avif,webp}` | 800 x 533 | 3:2 | 7.2 / 12.8 KB |
| `home/amigo-macro-r2-1600.{avif,webp}` | 1600 x 1067 | 3:2 | 15.1 / 36.9 KB |
| `home/amigo-macro-r2-2400.{avif,webp}` | 2400 x 1600 | 3:2 | 21.6 / 56.9 KB |

- Format: RGBA. It is transparent wherever it is the page, so it sits on #f0f6ff with no box. The right and bottom edges are the picture itself, not the page.
- The tag's plastic measures 83/84/85 (median). That is the render's own studio light, as cool as the #3a3d42 token or less. The paper retint does not touch it.
- Swap: `<figure class="macro">` srcset, from the stand-in `amigo-macro-1200/2000/3200` (a crop of the old 7680 still) to `amigo-macro-r2-800/1600/2400`. Intrinsic size 2400 x 1600.
- Not 3840: the frame holds the logo at about 1,150 px wide at 2400, which is more than S1b shows at 2x. A 3840 render would take about an hour of the shared CPU.
- Alt (when it is not decorative): "Close up of the AmIGo tag's dark grey cover, with amimotion pressed into it and a screw ear at its side." Next to the "±10 cm" text it is decorative: use `alt=""`.

## R3 family stage (Home S5, /products/): landed

- Scene: AmIGo front-left and AmIMo back-right on one sweep, both at true CAD scale. The anchor lies on its flanged plate, as in `pair`.
- Camera: 85 mm, el 30°, f/11, 1.0 m out. That is a camera height of about 0.5 m, not the plan's 0.35 m: at 0.35 m the 3:1 frame cut the anchor's top.
- The products fill the middle 50 % of the width. That leaves the sweep either side for the HTML words "AmIGo" and "AmIMo" at 26vw behind them.

| File | Size | Ratio | Bytes (AVIF / WebP) |
|---|---|---|---|
| `home/family-31-1200.{avif,webp}` | 1200 x 400 | 3:1 | 9.8 / 25.2 KB |
| `home/family-31-2400.{avif,webp}` | 2400 x 800 | 3:1 | 21.4 / 77.5 KB |
| `home/family-31-3840.{avif,webp}` | 3840 x 1280 | 3:1 | 20.1 / 99.3 KB |

- Format: RGBA, transparent where it is the page. It sits on the sweep band (#f0f6ff) with no edge, and the words behind it show through the transparent area.
- Plastic median 82/83/84, with no blue cast.
- 4:5 phone version: a separate render of the same scene, rig and camera angle at 0.78 m, because a crop of the 3:1 frame cannot hold both products. The products span about 70 % of the width. Files `home/family-45-800.{avif,webp}` (800 x 1000) and `home/family-45-900.{avif,webp}` (900 x 1125), RGBA on the page.
- Alt: "The AmIGo tag and the AmIMo anchor side by side at true size: a small dark grey tag with amimotion on its cover, and a larger dark grey box with a network port."

## R4 hall wide and zone masks (Home S4 "Ask your floor", /diagnostic/): landed

The wide still is the existing `hall/hall-all` ladder: camera A, 16:9, after state, widths 800, 1600, 2400 and 3840, intrinsic size 3840 x 2160. That is the plan's R4 shot, and the homepage already shows it. The no-JS / inspection state is `hall/hall-ask`: the same camera, with only the three queue trolleys amber. The four masks are rendered from the same camera and geometry (`tools/hall_r11.py masks`), so they lie exactly over both stills.

| File | Size | Bytes | Zone (hall floor area plus 0.35 m, and the things in it) |
|---|---|---|---|
| `home/ask/mask-inspection-queue-1920.png` | 1920 x 1080 | 29 KB | the queue outline in front of inspection, its three trolleys and their pads |
| `home/ask/mask-staging-lane-1920.png` | 1920 x 1080 | 23 KB | the staging lane and its pallet |
| `home/ask/mask-press-line-1920.png` | 1920 x 1080 | 27 KB | the two presses and their floor (press 1 is in frame, press 2 is cut by the top edge) |
| `home/ask/mask-racks-1920.png` | 1920 x 1080 | 28 KB | the two rack rows and their floor (camera A's top edge cuts them) |

- Each mask is white with the zone in alpha, antialiased. Things in front of a zone (machines, racks, columns) cut the mask exactly as they hide the floor in the still.
- Use it as `mask-image` on an overlay: a dark veil over `hall-all` with the zone cut out, or the colour still revealed over a dimmed copy. Scale it with the still: same box, `mask-size: 100% 100%`.
- The masks have no alt (decorative). Each chip's button text names its zone.
- The plan names three chips. The fourth mask is spare for /diagnostic/.

## R5 before/after and trail (Home S2 "Find it"): landed

Three stills from one camera, plus the trail as SVG.
- Camera: camera A's height (11 m), pitch 50°, 26 mm, turned to yaw 16, as `hall-find`, so the rack aisle where trolley t3 stops faces the lens. The press line is at the left.
- The forklift is left out of all three (`--hide fork`, as round 08 did for `hall-find`): at this moment it stands in the aisle mouth and hides the trolley.

| Base | What it shows |
|---|---|
| `before-*` | Scan world (`--state before`, t = 3.7 s). Pale, with only the three blue checkpoint ticks at the desks. |
| `after-clean-*` | Tag world, no marks. Everything has moved on and t3 has gone into the rack aisle. This is the base to draw the SVG over. |
| `after-trail-*` | The same, with t3's own 7 m blue trail rendered on the floor. This is the still for JavaScript off and reduced motion, and the end state of the draw. |

| Files | Sizes | Ratio | Bytes 2400 (AVIF / WebP) |
|---|---|---|---|
| `home/find/{before,after-clean,after-trail}-1610-{800,1600,2400}.{avif,webp}` | 800 x 500, 1600 x 1000, 2400 x 1500 | 16:10 | about 35 / 43 KB each |
| `home/find/{before,after-clean,after-trail}-45-{800,1200}.{avif,webp}` | 800 x 1000, 1200 x 1500 | 4:5 (master x 1000 to 2200) | about 21 / 25 KB at 1200 |
| `home/find/trail-1610.svg` | viewBox 0 0 2400 1500 | 16:10 | 1.9 KB |
| `home/find/trail-45.svg` | viewBox 0 0 1200 1500 | 4:5 | 1.8 KB |

The 4:5 files match the stand-in `scan-4x5-*` box. Swap `scan-4x5` for `before-45`, and the after picture for `after-clean-45` (with JavaScript) or `after-trail-45` (without).

The SVG:
- It is one `<path pathLength="1">` in #1f6bff, about 10 px wide at the master's scale, with round caps.
- Draw it with `stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--p))`. It runs in travel order, from the desk-3 tick's end toward where t3 stopped.
- It is split into subpaths where racks hide the floor: a ray cast from the camera checks each point. The SVG therefore never draws over a rack, and it ends where the rendered trail disappears into the aisle. 117 of 142 points are visible.
- Lay it over the picture in the same box (`position:absolute; inset:0; width:100%; height:100%`). It is pixel-registered to the still.

The "tighten on the stopped trolley" target: t3 stopped behind the first rack row at master pixel (1779, 544) in 16:10. That is `transform-origin: 74% 36%` for 16:10, and (779, 544) = `65% 36%` for 4:5. The trolley itself is hidden by the racks, as the copy says ("behind the racks").

Alts:
- before: "A model factory floor, all pale. Three short blue ticks mark where trolleys passed the scan desks."
- after-trail: "The same floor. A blue line shows the path of one trolley into the aisle between the racks, where it stopped."
- after-clean: decorative under the drawn SVG (`alt=""`), or the after-trail alt.

## R6 queue full-bleed (Home S3): landed

The desktop and tablet full-bleed is the existing `hall/hall-waits` ladder: 16:9, widths 800, 1600, 2400 and 3840, intrinsic size 3840 x 2160. It is the plan's shot: camera A on the inspection queue and the staging lane, after state. Round 11 adds the phone crop and the inline chip, both cut from the same graded master (`08-pictures/raw/a-waits-graded.png`), so all three match pixel for pixel.

| File | Size | Ratio | Bytes (AVIF / WebP) | Use |
|---|---|---|---|---|
| `home/queue-1x1-800.{avif,webp}` | 800 x 800 | 1:1 | 20.1 / 26.2 KB | S3 phone, `<source media="(max-width: 700px)">` |
| `home/queue-1x1-1600.{avif,webp}` | 1600 x 1600 | 1:1 | 42.6 / 56.8 KB | S3 phone at 2x and 3x |
| `home/queue-1x1-2160.{avif,webp}` | 2160 x 2160 | 1:1 | 59.1 / 79.5 KB | master |
| `home/queue-chip-240.{avif,webp}` | 240 x 150 | 8:5 | 3.2 / 3.6 KB | the inline 1.2 em queue between "work" and "waits" |
| `home/queue-chip-480.{avif,webp}` | 480 x 301 | 8:5 | 6.8 / 8.1 KB | the same at 2x |

The chip files replace the stand-in chip under the same names, so no markup change is needed. The chip is now cut from the same master as the full-bleed.

- The 1:1 crop is master pixels x 1100 to 3260, full height. It holds the three amber queue trolleys, the trolley at the station and the amber pallet in the staging lane.
- Alt for `queue-1x1`: "A model factory floor. Three trolleys in the inspection queue and one pallet in a staging lane are marked amber because they are waiting."
- Alt for `queue-chip`: `alt=""`. It is decorative and sits inside the headline, which carries the words. Mark it `aria-hidden="true"`.

## R7 one bay (Home S6, /pilot/): landed

- Camera: the hall camera brought in on the inspection bay. 9 m high, pitch 35°, 30 mm, yaw 34, aimed 1 m up at the bay, so both of the bay's AmIMo anchors are in frame (left column and right column).
- In colour: the inspected trolley's path and the three queue trolleys' paths and amber waits. Everything else is pale, including other trolleys, the press and the racks.
- The hall has two anchors on this bay's columns, not three. The plan's "three anchors" was not drawn, because the hall does not have them.

| File | Size | Ratio | Bytes (AVIF / WebP) | Use |
|---|---|---|---|---|
| `home/bay-32-800.{avif,webp}` | 800 x 533 | 3:2 | 14.3 / 16.2 KB | S6 desktop, about 60 % width |
| `home/bay-32-1600.{avif,webp}` | 1600 x 1067 | 3:2 | 30.8 / 37.1 KB | |
| `home/bay-32-2400.{avif,webp}` | 2400 x 1600 | 3:2 | 47.7 / 59.4 KB | master |
| `home/bay-45-800.{avif,webp}` | 800 x 1000 | 4:5 | 21.4 / 25.3 KB | S6 phone |
| `home/bay-45-1280.{avif,webp}` | 1280 x 1600 | 4:5 | 35.2 / 43.5 KB | phone at 2x |

- The 4:5 crop is x 380 to 1660 of the master. It is the station and queue only; the anchors fall outside it.
- Alt (3:2), the homepage screen 6 alt: "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors."
- Alt (4:5): "A model inspection bay: one trolley at the station, its path in blue, and three trolleys waiting on amber in the queue."

## R8 job crops (Home S7 jobs grid): landed

Four 4:3 crops cut at native pixels from the graded camera A after-state master (`08-pictures/raw/a-all-graded.png`, the source of `hall-all`). They replace the stand-ins under the same names, so no markup change is needed.

| File | Size | Bytes 1200 (AVIF / WebP) | Crop in the 3840 master | Alt |
|---|---|---|---|---|
| `home/jobs/inspection-{600,1200}.{avif,webp}` | 600 x 450, 1200 x 900 | 18.5 / 23.4 KB | 900,1150 to 2100,2050 | "A model inspection queue: three trolleys waiting on amber pads." |
| `home/jobs/staging-{600,1200}` | same | 11.3 / 15.7 KB | 1975,655 to 3175,1555 | "A model staging lane: one pallet waiting on an amber pad beside a blue path." |
| `home/jobs/press-{600,1200}` | same | 13.0 / 15.9 KB | 80,90 to 1280,990 | "A model press, with a trolley just out of it on a blue line." |
| `home/jobs/racks-{600,1200}` | same | 17.7 / 23.3 KB | 1450,0 to 2650,900 | "Model rack rows and a forklift at the end of an aisle, with blue lines where things went." |

In the racks crop, the master's top edge cuts the rack rows (camera A is framed on the floor in front of them).

## R12 hall line drawing (/technology/ header): landed

| File | Size | Ratio | Bytes | Use |
|---|---|---|---|---|
| `tech/hall-lines-3200.png` | 3200 x 2000 | 16:10 | 222 KB | header, desktop at 2x |
| `tech/hall-lines-1600.png` | 1600 x 1000 | 16:10 | 126 KB | header, 1x and phone |

- The drawing is the model hall, top orthographic, 40 m wide (the hall's long axis runs left to right, with the back wall on the left).
- Lines are where an object changes or the height steps by more than 3 cm. They come from a flat id pass and a height pass of the hall itself (`tools/hall_r11.py ids`, `tools/lines.py`). There are no trails and no amber.
- The ink is #0b1238 at 30 % opacity on a transparent ground. It works on ground or surface. On the ink band it would need a white recolour, which is not supplied.
- Alt: "A line drawing of the model factory floor seen from above: two rack rows, two presses, the inspection station, trolleys, columns and walls." Use `alt=""` if the header is decorative next to an H1 that says the same.
- Workbench does not run headless here, so the "outline pass" is computed from the two flat passes. The result is the same kind of drawing.

## Tools (all in `team/rounds/11-renders/tools/`, renders in `work/`, which is not committed)

- `02-design/renders/render_hardware.py`: new shots `turntable` (R1), `macro` (R2), `family` (R3, R3b with `--frames`) and `closer` (R9).
  - Sequences render in one Blender session and resume.
  - `--plate` renders the empty sweep.
  - `--fast` uses fewer bounces for web sequences.
  - The seed is fixed and there is no time limit, so noise does not depend on machine load.
- `plate_grade.py`: plate flat-field, paper-only retint, picture kept only near the product (no faint box on the page).
- `cut.py`: `ladder` (still widths, AVIF and WebP) and `seq` (one AVIF per frame at a byte target).
- `hall_r11.py`: on the imported `build_hall.py`, `info` (zones projected to pixels), `masks` (R4), `trail` (R5 SVG points) and `ids` (R12).
- `lines.py`: R12 drawing.
- `run_tt.sh`, `run_cad.sh`, `run_hall.sh`: the render queues.
