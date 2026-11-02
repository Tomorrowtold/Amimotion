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
| R2 AmIGo macro | Home S1b | rendering |
| R3 family stage still | Home S5, /products/ | queued |
| R3b family dolly | Home S5 | queued |
| R4 hall wide, pale and after, plus 4 zone masks | Home S4, /diagnostic/ | queued |
| R5 before/after plus trail SVG | Home S2 | queued |
| R6 queue full-bleed | Home S3 | **landed** (see below) |
| R7 one bay | Home S6, /pilot/ | queued |
| R8 job crops | Home S7 | queued (cut from R4) |
| R9 closer-look angles | Product pages | queued |
| R10 AmIGo lowers onto trolley | AmIGo page | see notes |
| R11 AmIGo covers part | AmIGo page | see notes |
| R12 hall line drawing | /technology/ header | **landed** |
| R13 AmIMo on column | AmIMo hero, S5 tab | see notes |

## R6 queue full-bleed (Home S3): landed

The desktop and tablet full-bleed is the existing `hall/hall-waits` ladder: 16:9, widths 800, 1600, 2400 and 3840, intrinsic size 3840 x 2160. It is the plan's shot: camera A on the inspection queue and the staging lane, after state. Round 11 adds the phone crop and the inline chip, both cut from the same graded master (`08-pictures/raw/a-waits-graded.png`), so all three match pixel for pixel.

| File | Size | Ratio | Bytes (AVIF / WebP) | Use |
|---|---|---|---|---|
| `home/queue-1x1-800.{avif,webp}` | 800 x 800 | 1:1 | 20.1 / 26.2 KB | S3 phone, `<source media="(max-width: 700px)">` |
| `home/queue-1x1-1600.{avif,webp}` | 1600 x 1600 | 1:1 | 42.6 / 56.8 KB | S3 phone at 2x and 3x |
| `home/queue-1x1-2160.{avif,webp}` | 2160 x 2160 | 1:1 | 59.1 / 79.5 KB | master |
| `home/queue-chip-240.{avif,webp}` | 240 x 150 | 8:5 | 2.3 / 2.2 KB | the inline 1.2 em queue between "work" and "waits" |
| `home/queue-chip-480.{avif,webp}` | 480 x 301 | 8:5 | 4.9 / 5.3 KB | the same at 2x |

The chip files replace the stand-in chip under the same names, so no markup change is needed. The chip is now cut from the same master as the full-bleed.

- The 1:1 crop is master pixels x 1100 to 3260, full height. It holds the three amber queue trolleys, the trolley at the station and the amber pallet in the staging lane.
- Alt for `queue-1x1`: "A model factory floor. Three trolleys in the inspection queue and one pallet in a staging lane are marked amber because they are waiting."
- Alt for `queue-chip`: `alt=""`. It is decorative and sits inside the headline, which carries the words. Mark it `aria-hidden="true"`.

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
