# Round 03: the shared model hall and the 9 s hero film

Realism lab with the Film team, 2 Nov 2026. Built to homepage-final.md, "The shared world" and "Screen 1. Hero".

## Files

| What | Path |
|---|---|
| Hall builder and renderer (one script, bpy) | `build_hall.py` |
| Grade (one linear gain plus a page shoulder) | `grade_film.py`, `gain.txt`, `img16.py` (16-bit PNG reader) |
| Encode, poster ladders, contact sheet | `make_film.py` |
| Scene file at t = 0.0 | `master/hall.blend` |
| Poster masters | `master/poster-1600x2000.png` (film frame 0), `master/poster-6400x8000.png` (8K still, same moment) |
| Film | `film/hall-4x5-av1.mp4`, `film/hall-4x5-h264.mp4`, `film/hall-1x1-av1.mp4`, `film/hall-1x1-h264.mp4` |
| Posters | `film/poster-4x5-{800..6400}.{avif,webp}`, `film/poster-1x1-{600..2400}.{avif,webp}`, `film/share-1200x630.jpg` |
| Test page | `hero-film.html` (copy of `02-design/frame/hero.html`, film in the picture column) |
| Shots | `shots/hero-film-{1440x900,390x844,2560x1440}.png` (poster, 0.4 s after load), `...-playing.png` (3.6 s later), `...-1440x900-reduced.png`, `...-1440x900-nojs.png`, `shots/shoot-result.json`; `shoot.js` makes them |
| Contact sheet | `contact-sheet.jpg` (0.0, 1.0, 2.0, 3.8, 5.5, 7.9 s) |
| Not for the repo | `frames_raw/` (2.7 GB, 16-bit), `frames/` (341 MB, graded), `master/*-raw.png` (183 MB). Listed in `.gitignore`. All rebuild from the scripts. |

Rebuild: `/tmp/bpyenv/bin/python build_hall.py --samples 16 --frames 0-224 --outdir frames_raw` (resumable), then `python3 grade_film.py calib frames_raw/f0000.png`, `python3 grade_film.py frames frames_raw frames`, `python3 make_film.py film frames film`, `python3 make_film.py poster master/poster-6400x8000.png film` (the 800 to 1600 rungs are then re-cut from `frames/f0000.png`, so the poster-to-video swap is the same pixels).

## The hall

- Camera A as locked: 11 m up, 45 deg down, 35 mm (36 mm sensor, fitted to the 2000 px side), yawed 34 deg off the hall grid so aisles run on the diagonals. No depth of field.
- One material per kind of thing: floor #f6f4ef, every built thing (walls, columns, machines, racks, carriers, vehicles) #e4e2dc, hardware #3a3d42 (AmIGo tags as 86 x 59 x 23 mm blocks on every carrier, AmIMo anchors as 59 x 29 x 106 mm blocks on twelve columns at 4.2 m: the CAD bounding sizes, a few pixels at this distance). Matte primer: roughness 0.88, low specular, no texture, no noise. One bevel radius (22 mm) for the whole hall.
- Model language: walls and columns sectioned at 5.2 m, no roof. A door in the back wall for the tugger's lane. No people, no text, no numbers, no signs. Desks carry a plain box, no screen.
- Light: a 26 m soft disk key high to the back left, a white dome fill. Shadows soft and short. No sun, no colour in the light.
- Marks are geometry on the floor, matte, lit like the floor (ink, not light): blue #66a5fa trails and ticks 85 mm wide with round caps, amber #f0a43a rounded patches under the waiting trolleys and the pallet, pale grey #d6d4ce zone outlines (inspection zone, queue, staging lane). Nearer objects hide them because they are on the floor.
- Fixed counts hold in every after frame: three trolleys on amber in the queue, one pallet on amber in the staging lane.
- Plan: inspection station with one trolley in its zone, the queue in front of it, the staging lane across the main aisle, two presses up the left, two rack rows up the right with an aisle between, three checkpoint desks (press exit, mid-aisle, rack-aisle mouth), a back aisle.
- The hall can serve the other screens with new crops and states from the same file: `--state after|before`, `--t`, `--border`. Screen 2 (trolley behind the racks on blue) and screen 6 (one bay in colour) need a per-item state switch, which the script does not have yet.

Measured in the graded poster (median of pixels within 40 of target): floor 245,245,242 (the page ground exactly), machines 230,229,224 (target 228,226,220), shadow 199,198,192 (201,199,193), blue 105,169,255 (102,165,250), amber 241,165,61 (240,164,58). Blue covers 0.6 % of the frame and amber 0.2 % at full saturation.

Floor colour: the shared-world floor is #f6f4ef; DESIGN_SYSTEM.md 3.1 asks the lab to grade it to the page's #f5f5f2 (1.01:1). The albedo in the model is #f6f4ef; the grade lands the open floor on #f5f5f2 so the film has no box on the page. Measured in Chromium: page 245,245,242, near floor in the film 244,245,242. The far left corner of the film decodes at 245,247,249, one step cooler; nobody has seen it without a pixel picker.

## The film

Display time t in [0, 9). Simulation time runs continuously from 2.0 to 11.0, shown as tau = t + 9 for t < 2. So the loop seam 9.0 -> 0.0 is continuous motion and the only discontinuity is the scripted hard cut at 2.0.

- 0.0 to 2.0, after (the poster is frame 0): trails behind every tagged thing, four ambers. Moving: a trolley leaving press 1, two trolleys down the aisle, the tugger train (tractor and three carts with totes) coming down the aisle from the back door, the forklift crossing to the staging lane, the AMR along the back aisle.
- 2.0, hard cut: same frame, no colour. Things are where they were at 2.0 s of the story, so some jump.
- 2.0 to 4.5, before: a tick at desk 1 (2.55 s), desk 2 (3.15 s), desk 3 (3.6 s), each as its trolley passes, laid just behind the desk point so the trolley never covers it. The third trolley then turns into the rack aisle and stops. No mark follows it.
- 4.5 to 9.0, building, no cut: each kind's lines appear at 4.5 (trolleys), 4.9 (bins and the fixture), 5.3 (tool cart), 5.7 (forklift, the pallet's line, the tugger), 6.1 (AMR). The ticks become the trolley lines at 4.5. Amber at 7.0, 7.4, 7.8 (the queue) and 8.2 (the pallet). From 8.2 the frame holds the after state into the loop.
- Trails are the last 7 m of each thing's own path, so they draw at the thing's own speed, and a parked thing keeps the line that brought it (the queue's line, the hidden trolley's line).
- 25 fps, 225 frames, 9.000 s, one keyframe interval per loop.

## Sizes and weights

| File | Size | Notes |
|---|---|---|
| hall-4x5-av1.mp4 (1600 x 2000) | 924 KB | SVT-AV1 preset 4, CRF 24, SSIM 0.998 against the graded frames |
| hall-4x5-h264.mp4 (1600 x 2000) | 1,799 KB | x264 veryslow, CRF 16, High 5.0, SSIM 0.998 |
| hall-1x1-av1.mp4 (1080 x 1080) | 435 KB | |
| hall-1x1-h264.mp4 (1080 x 1080) | 830 KB | |
| poster-4x5 AVIF | 27 KB (800), 42 KB (1200), 57 KB (1600), 99 KB (2400), 136 KB (3200), 210 KB (4800), 289 KB (6400) | 4:4:4. WebP about 1.3x |
| poster-1x1 AVIF | 16 KB (600), 31 KB (1080), 46 KB (1600), 81 KB (2400) | |
| share-1200x630.jpg | 57 KB | |

Full resolution was kept: 1600 x 2000, not the 1200 x 1500 fallback.

First screen (shoot.js, file://, DPR 1): the poster picked is 800 AVIF (1440 x 900), 600 AVIF 1:1 (390 x 844), 1200 AVIF (2560 x 1440). The video loads only after the window `load` event and only when 25 % of the frame is in view, then replaces the poster on `playing`. Measured: playing at all three sizes, AV1 chosen. Reduced motion: no source is ever attached, poster stays. JavaScript off: poster stays (shot). No horizontal scroll at any size.

## Render times (4 CPU cores, Cycles, 16 samples, adaptive, OIDN, fixed seed)

- Film frame 1600 x 2000: 37.1 s average (175-frame run). 225 frames = 2 h 19 min. Two restarts for faults found in review (below) cost about 75 min more.
- 8K still 6400 x 8000: 895 s.
- Grade: 6.7 min for 225 frames. Encode, all four files: about 2 min.
- The fixed seed is what makes 16 samples usable for film: static pixels get the same samples every frame, so the denoiser's residual blotches do not crawl. Measured between two consecutive frames: 3.1 % of pixels differ by more than 1/255, all of them on or beside a moving thing.

## Three ideas per decision, two killed

Engine
1. Cycles at 16 spp with a fixed seed. **Kept** (37 s a frame, stable).
2. EEVEE through Mesa llvmpipe (installed libegl1/libegl-mesa0 to run it headless). **Killed**: 48.6 s a frame, slower than Cycles on CPU, and its soft shadows band.
3. A static Cycles plate plus per-frame region renders of the movers. **Killed**: every mover's soft shadow and the denoiser's neighbourhood leak past any box, so seams. Not needed once the fixed seed made full frames stable.
Workbench (also via llvmpipe, 1.2 s a frame) is kept as the layout preview, never as an output.

Trails
1. Time tails (where it was in the last n seconds). **Killed**: a parked trolley loses its line, so the queue and the hidden trolley would have none, which the screen 2 and 3 stills need.
2. The whole route drawn ahead and behind. **Killed**: a line ahead of a thing implies the system knows where it will go, which is dispatch, a claim the register does not make.
3. Distance tails, the last 7 m of each thing's own path. **Kept**.

Reveal at 4.5 s
1. Each line draws on from its oldest end. **Killed**: to finish by 9.0 the lines would have to draw at up to 3x the things' speed, which the Film lead's ick list bans.
2. Lines grow outward from the ticks. **Killed**: only trolleys have ticks, so four of the five kinds would have nothing to grow from.
3. Each kind's lines appear whole, 0.4 s apart, and then move only with their things. **Kept**: it reads as a beat, like the cut, and no line ever moves faster than what made it.

Look (the idea nobody in the category has tried is 3)
1. A white massing model: every built thing one colour, matte primer, soft key. **Kept**.
2. Kind-coded greys (machines, carriers and building in three greys). **Killed**: five greys turned the frame busy and pulled the eye from blue and amber, the only colours allowed to mean something.
3. A true orthographic axonometric, like an architect's drawing. **Killed**: it breaks camera A (35 mm perspective), and at this angle it reads as an infographic drawn in code, an ick.

## Rework rounds

1. **Fit.** The first hall was laid out at plant scale and camera A sees only about 8.5 m across the bottom edge and 13 m at the centre. The queue fell off the bottom and most of the plant was out of frame. Re-planned the hall from camera pixels back to the floor (`unproj`), 30 % tighter.
2. **Composition.** The staging lane sat off the right edge and the bottom right was empty floor. Moved the camera target 1 m, put the staging lane along the aisle across from the queue, lowered the racks to 3.4 m and the inspection gantry by 0.8 m so they stop walling off the middle, moved columns out of the near field.
3. **Defects on the first Cycles frames.** Black dots at every outline corner and a black edge on the pallet's amber (coplanar faces): outlines rebuilt so no two marks share a plane. Bins, fixture and tugger made a knot of lines by press 1: bins moved to press 2. Exposure 5 stops over on the first test: rebalanced key and dome so the shadow lands near #c9c7c1.
4. **Motion review on rendered frames.** The trolley leaving press 1 drove through the tugger's carts at 1.9 s, and the tugger came through the back wall: the tugger now takes its own lane straight down the aisle through a door in the back wall. The first tick was hidden under the trolley that laid it for most of the before state: ticks now sit just behind the desk point. Both found by stepping through frames; both cost a re-render.
5. **On the page.** The key lit the far floor up to #faf9f6, so the film showed as a lighter box beside the words: the grade got a highlight shoulder at the page ground (keeps 15 % of the excess). The box is gone at 1440 and 2560.

## What still looks off (frank)

- The before ticks are small. 1 m on the floor is about 40 px in the 1600 master and about 9 CSS px on a phone. They read on a laptop. On a phone at arm's length they may not, and they carry the before half of the story. A wider tick breaks the one-line-weight rule, so the fix is probably a desk nearer the camera.
- At the 2.0 s cut, three trolleys and the forklift jump to where they were earlier in the story. It reads as "earlier", but a viewer may track one and feel the jump.
- The forklift turning at the rack-aisle mouth (about 0.6 to 1.2 s) shows its overhead guard edge on for a few frames, and the shape reads oddly.
- The left edge cuts the press and the right edge cuts a column. These are hard edges where the frame meets the page. The bar sits directly on top of the rack tops.
- Hardware at hall scale is blocks at the CAD sizes, not the CAD meshes. At 8K the tags are 40 px boxes with a bevel. The real AmIGo outline (ears) does not show.
- The LCP element is still the poster image, not the H1 (60 to 70 ms on file://; 28 KB on desktop, 16 KB on the phone). The spec asks for the H1. No honest way was found to make a picture that size lose LCP to text.
- Not yet run: the one-second test with five cold viewers, the nine-reader "is it real?" test, slow-4G LCP on the film page, Safari and Firefox playback.

## Retint (the colour team's palettes)

Every hall colour is a named parameter.
- Model colours (floor, machine, hardware, blue, amber, outline): `HEX` at the top of `build_hall.py`, or `--palette palette.json` with any subset, for example `{"blue": "#4c8df6", "amber": "#f2a03d"}`. These are materials, so a change needs a re-render: about 2 h 20 min for the film and 15 min for the 8K poster on this machine, resumable.
- The page ground the floor is graded to: `HALL_GROUND=#rrggbb` for `grade_film.py`, then `calib` on frame 0, then `frames`, `film` and `poster`. That is a re-grade only: about 7 min plus 2 min of encode, no render. If the new ground is within a few steps of the floor albedo, change only this. If it moves further, also set `floor` in the palette and re-render, so shadows and bounce stay true.
- Shadow is not a material. It comes from the key-to-dome ratio (`--key`, `--world`). Check it in the grade against the new target.
- Blue and amber cannot be swapped in the grade alone, because they are lit ink on the floor. An ink-ID pass would make that possible (one more render pass per frame, about 10 % slower). Not built this round.

## Committee scores (1 to 10 against the best first screens in the library: apple.com/airtag, anduril.com, vention.io)

| Lead | Score | Reason | What blocks 9 or 10 |
|---|---|---|---|
| Creative Director | 9 | One ground, one designed world, premium as a model and never a near-photo. Beside AirTag it says more; beside Anduril it is calmer and lighter. | The frame's cut edges (press, column, rack tops under the bar). The forklift's turn. |
| Head of Words | 9 | Locked copy untouched. The film now carries "where it waits" without a word, so the lede no longer has to do it alone. | The phone lede still runs 7 lines. |
| Buyer Truth Lead | 8 | The picture now shows the floor, the paths and the waits (the 7 the still could not). | No reader test yet, and the before ticks may be too small on a phone for "a scan tells you where it last passed" to land. |
| Product Render Director | 8 | Hardware is the right dark grey at the right size and sits on every carrier and column. | Tags and anchors are CAD-sized blocks, not CAD meshes. At 8K that shows. |
| Film Director | 8 | The film exists and hits the spec: camera A locked, one hard cut, 0.4 s beats, amber from 7.0, a seamless loop, 924 KB AV1. | The one-second test has not been run. Ticks small at phone size. The 2.0 s cut makes things jump. |
| Experience Design Lead | 9 | Plays only in view, after load. Poster with reduced motion and JS off. Phone order H1, film, lede, all on the first screen. | No pause control for users who want motion stopped but have not set reduced motion (WCAG 2.2.2 allows 5 s; this loops). |
| Design Engineering Lead | 8 | Poster 16 to 42 KB on the first screen, video 435 to 924 KB AV1 after load, all under budget. No layout shift: frame size is fixed by aspect-ratio. | The LCP element is the poster IMG, not the H1. No slow-4G trace on this page yet. |
| Search and AI Answers Lead | 9 | H1 and first sentence first in the HTML. The alt text is the spec's, word for word, and true to the frame. | Video has no text track or description beyond the poster alt (none needed muted, but unreviewed). |
| Truth and Quality Lead | 10 | Counts exact (3 + 1 amber in every after frame). No text, no UI, no people, nothing named. The AMR goes about its own route and obeys nothing on screen. Lines show only where things went. | None. |
| Lead Magnet and Growth Lead | 9 | Zero growth code in the first screen. The film makes the bay story the diagnostic sells. | Not tested for first-click from this hero. |
| **Mean** | **8.7** | | |

Under 9: Buyer Truth, Product Render, Film, Design Engineering. By the charter this goes back with those four reasons. The cheapest next steps, in order: bring desk 3 and its tick nearer the camera and widen the before beat by moving the cut earlier in story time; run the one-second and reader tests on `shots/` and the films; import the CAD meshes for tags and anchors (the STLs are at `/mnt/project-files/website-ultra/cad/`); decide the LCP rule with Design Engineering (the H1 cannot win against a picture this size).
