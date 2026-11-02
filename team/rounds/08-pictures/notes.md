# Round 08: pictures and film in Sky Ground

Realism lab, Film team and Engine room, 2 Nov 2026. Every picture the site ships now sits on the Sky Ground page (#f0f6ff). No `slot()` placeholder is left on any built page; `grep 'class="slot '` over `site/dist` finds none.

## What shipped

| What | Where | How |
|---|---|---|
| Hardware stills retinted | `site/src/assets/home/amigo-page-*`, `amimo-page-*`, `amigo-side-*`, `assets/img/amigo-*`, `amimo-*`, `og-home.jpg` | `tools/retint_stills.py`. This is the colour team's weighted retint (06-colour `retint_hero`), a linear white balance from #f5f5f2 to #f0f6ff weighted by lightness. The tag stays neutral (measured 76,79,78) and the alpha edge lands on 238,245,255 against a ground of 240,246,255. There is no full `--page` divide, so the tag has no blue cast. Each ladder is re-cut from its largest rung. |
| CAD pair | `site/src/assets/home/pair-{800,1600,2400}` | `tools/cad_ladder.py`: `render_hardware.py --page` to #f5f5f2, then the weighted retint, then `hero_images.py --ground '#f0f6ff'`. |
| Hall stills (22 bases) | `site/src/assets/hall/` | `tools/hall_stills.py` with the views table, plus `tools/autocut.sh`. Each base, with its page, section and alt, is listed in `stills-index.md`. |
| Hero film | `site/src/assets/home/hero-film/hall-{4x5,1x1}-{av1,h264}.mp4`, `poster-4x5-{800..3200}`, `poster-1x1-{600..2400}`, `share-1200x630.jpg` | `tools/recolor_film.py` on the graded white-hall frames, then `03-hero-film/make_film.py`. |

## The film: a recolour, not a re-render

The full Sky Ground re-render (`03-hero-film/sky/render_film.sh`) was stopped at frame 30 of 225, on the coordinator's call. The CPU was shared with the stills and the render team, so it was running at 160 s a frame, about ten hours in all. Instead, the 225 graded white-hall frames are recoloured:

- One per-channel curve on luminance. Hardware stays neutral (66 to 66,67,69). Shadow goes to #c3d3ec, machines to a pale sky-white (228,236,251), the open floor to #f0f6ff exactly, and the brightest tops a step whiter. The old warm cast is dropped.
- Trails and pads are found by chroma (one reference from frame 0 for every frame, so nothing flickers) and recoloured to #1f6bff and #ffb020, keeping their own shading.
- Checked against the Sky Ground render of the same frame (`03-hero-film/sky/contact-sheet.jpg` and frames 0, 25, 50, 95, 140, 200). Ground, trails, pads and shadows match. Machines read a touch greyer than in the true re-render, because in the white hall they were darker than the floor and a curve cannot swap that order.
- Sizes: 4:5 AV1 961 KB and H.264 1820 KB; 1:1 AV1 458 KB and H.264 864 KB; 225 frames, 9.000 s each.
- Posters 800 to 1600 are cut from film frame 0, so the poster-to-video swap shows the same pixels. The 2400 and 3200 rungs come from the recoloured 8K master.
- Playback in Chromium: playing at 1440 (4:5, AV1) and 390 (1:1, AV1) with the hero-film.html script.
- `site/build.py` FILM_JS was written for `[data-hero-film]`: it attaches the video only after `load`, plays only in view and never with reduced motion. The homepage team has since replaced the hero (S1c, a plant still) and owns index.html, home.css and hero.js. The film files are ready for /films/ and for the hero if it comes back.

## The hall for stills (build_hall.py, stills-only options; the film never passes them)

- Palette `03-hero-film/sky/palette.json`: floor #f0f6ff, machines #ffffff, blue #1f6bff, amber #ffb020, outline #d2deef. The dome is `--world-color #dfeaff`, so shadows read sky-grey.
- Grade (`grade_film.py`): the gain is calibrated on the Sky Ground frame 0 (`sky/gain-sky.txt`). The new top end gives lit floor and machine tops the ground's own hue: the key is a touch warm and the sky dome clips blue on the brightest floor, so without it the frame showed a warm-white box on the page.
- `--cam h,pitch,lens,yaw,tx,ty[,tz]`, `--ortho <m>` (camera P), `--links` (dark tag-to-anchor lines), `--trails` / `--amber` (isolate passes), `--hide` (the forklift is left out of the find frame, where it blocks the rack aisle), `--tow` (AMR towing a trolley), `--dropoff` / `--drop-trolleys` (a drop-off zone at the back-aisle line end, two trolleys on amber), `--q3-press` / `--trail-len` (one trolley's whole path from press 2).

## Honest gaps

- "On a blue floor tint" is not drawn anywhere. Located is a line ending at the thing. A blue filled shape would read as a pad, and filled shapes mean waiting.
- The screen 2 / find alt is corrected: that trolley comes down the aisle, not from a press (see `stills-index.md` note 1).
- No people, no AmIHub screen, no real survey photo. Briefs that asked for these got the closest hall view, or the CAD pair for /company/.
- AmIGo on a trolley rail and AmIMo on a column: no CAD-on-hall composites were made, because they would look half-real. The render team's R10 and R13 renders (round 11) now cover these.
- v6 explainer films: every frame carries an "Illustrative simulation" stamp. No built page references `/assets/film/v6/` any more. The files stay in place (coordinator's rule). `build.py` still copies them into `dist/assets/film/v6`. Excluding them is a one-line skip in the asset copy, left to the build owner because `build.py` has open edits from another team.

## Checks (site build of 2 Nov, 09:15)

Shots: `shots/{home,platform,solutions-wip,industries-robotics,learn-dwell-time}-{1440,390}.png` (full page, every lazy image scrolled in), `home-1440-nojs.png`, `home-1440-reduced.png`, `shoot-result.json`. Made with `tools/shoot.js`.

| Page | LCP 1440 | LCP 390 | Horizontal scroll | Broken images | Slots |
|---|---|---|---|---|---|
| / | 0.76 s (H1) | **2.12 s (H1)** | none | 0 | 0 |
| /platform/ | 1.58 s (hall-all-1600) | 1.27 s | none | 0 | 0 |
| /solutions/wip/ | 1.06 s (hall-wip-1600) | 1.35 s | none | 0 | 0 |
| /industries/robotics/ | 0.79 s | 0.75 s | none | 0 | 0 |
| /learn/dwell-time/ | 1.28 s (hall-inspect-43-1600) | 0.80 s | none | 0 | 0 |

The method is emulated slow 4G (150 ms RTT, 1.6 Mbps) with 4x CPU throttle, on a machine at load average 17, because the render team's R-jobs were running. The homepage at 390 misses 1.8 s on its H1. That page is the homepage team's new S1c build, not the film hero; with the film hero this round measured 0.65 s at 390 on a quiet machine. Re-measure it when the CPU is free. Pickability: 9/10 branded answerable, 48/48 canonical pages, 0 barred claims. JS off and reduced motion: the homepage renders with no video source attached.

## CPU headroom (for the render team)

Everything of this round is finished, and nothing of it runs in the background. A hall still at 3840 x 2160 and 16 spp takes about 95 s alone on the 4 cores, and a film frame at 1600 x 2000 about 37 s. Two Cycles jobs at once run at about half speed each, and at load 17 a still took more than 10 min. Re-cutting one hall still (`python3 tools/hall_stills.py render <name> && python3 tools/hall_stills.py cut <name>`) needs about 2 to 3 min of a free machine. A true Sky Ground film re-render (`03-hero-film/sky/render_film.sh`, resumable) needs about 2 h 20 min alone, so only run it overnight.
