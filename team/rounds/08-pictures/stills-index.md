# Stills index (round 08): every picture brief, its file and its alt

For the copy-apply step. All hall stills are Sky Ground renders of the one model hall (`team/rounds/03-hero-film/build_hall.py`, palette `03-hero-film/sky/palette.json`, the film's grade), cut by `tools/hall_stills.py`. No people, no text, no numbers, no UI; blue lines and amber pads are the only colour.

**Files.** Hall stills live in `site/src/assets/hall/<base>-<w>.{avif,webp}`. 16:9 bases have widths 800, 1600, 2400, 3840 (full-bleed heads); 4:3 and 3:2 bases have 800, 1600, 2400. CAD stills live in `site/src/assets/home/`.

**Markup.** Use the same `<picture>` ladder as `still()` in `lib.py` (AVIF source, WebP source, `<img src="...-1600.webp">` with the intrinsic `width`/`height` below, `loading="lazy"`, the alt). The simplest route is to add each base to `STILLS` in `lib.py` and call `still("<base>", alt=...)`:

```python
# stem, widths, master width, master height, default alt
"hall-all":        ("/assets/hall/hall-all", (800, 1600, 2400, 3840), 3840, 2160, "..."),
"hall-waits-43":   ("/assets/hall/hall-waits-43", (800, 1600, 2400), 2880, 2160, "..."),
"hall-waits-32":   ("/assets/hall/hall-waits-32", (800, 1600, 2400), 3240, 2160, "..."),
"pair":            ("/assets/home/pair", (800, 1600, 2400), 2400, 1600, "..."),
```

Intrinsic sizes: 16:9 = 3840 x 2160; 4:3 = 2880 x 2160 (`hall-inspect-43`, `hall-back-43`, `hall-dropoff-43`, `hall-path-43`, `hall-racks-43`, every `-43` crop) except `hall-trolley-43` = 2400 x 1800; 3:2 = 3240 x 2160; `pair` = 2400 x 1600.

**p_*.py.** Round 08 made no edits to `site/tools/pagegen/p_*.py` (the copy-apply team owns them). The homepage's five slots are filled directly in `site/src/pages/index.html`.

## Homepage (done, in index.html)

| Screen | Base | Ratio | Alt |
|---|---|---|---|
| 1 hero | film poster `/assets/home/hero-film/poster-4x5-*`, `poster-1x1-*`; film `hall-4x5-{av1,h264}.mp4`, `hall-1x1-*` | 4:5, 1:1 phones | "A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. Three trolleys at inspection and one pallet in a staging lane are marked amber because they are waiting." |
| 2 find | `hall-find-43` | 4:3 | "A model factory floor. One trolley stopped between the racks is marked blue. A blue line shows its path and ends where it stopped." (see note 1) |
| 3 waits | `hall-waits-43` | 4:3 | "A model inspection station. One trolley is being worked on. Three trolleys in the queue in front of it and one pallet in a staging lane are marked amber because they are waiting." |
| 4 ask | `hall-ask` | 16:9 | "The same model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited." |
| 5 AmIHub fallback | `hall-waits-32` | 3:2 | "A model factory floor with paths in blue and waits in amber." (never called AmIHub) |
| 6 one bay | `hall-bay` | 16:9 | "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors." |

## Solutions squad (team/rounds/07-pages/solutions/)

| Page | Brief | Base | Ratio | Alt |
|---|---|---|---|---|
| /solutions/ | head P-SOL-01 | `hall-all` | 16:9 | brief's alt (solutions.md line 17) |
| /solutions/ | P-SOL-02 | `hall-inspect-43` | 4:3 | "A model inspection station. Three trolleys in its queue are amber because they are waiting." |
| /solutions/ | P-SOL-03 | `hall-back-43` | 4:3 | "A model factory floor. A tool cart, a fixture, two bins and a robot are marked blue where they stopped." (bins added: they are marked in the frame) |
| /solutions/wip/ | head P-WIP-01 | `hall-wip` | 16:9 | brief's alt |
| /solutions/wip/ | P-WIP-02 | `hall-waits-43` | 4:3 | brief's alt |
| /solutions/assets/ | head P-AST-01 | `hall-assets` | 16:9 | brief's alt |
| /solutions/assets/ | AmIGo picture | CAD `still("amigo-side")` | 3:2 | locked homepage alt |
| /industries/ | head P-IND-01 | `hall-all` | 16:9 | brief's alt |
| /industries/ | P-IND-02 | `hall-mfg-43` | 4:3 | "A model press line and inspection queue. Three trolleys waiting at inspection are amber." |
| /industries/ | P-IND-03 | `hall-wh-43` | 4:3 | brief's alt |
| /industries/ | P-IND-04 | `hall-back-43` | 4:3 | brief's alt |
| /industries/manufacturing/ | head P-MFG-01 | `hall-mfg` | 16:9 | brief's alt |
| /industries/manufacturing/ | P-MFG-02 | `hall-waits-43` | 4:3 | homepage screen 3 alt |
| /industries/manufacturing/ | AmIMo picture | CAD `still("amimo")` | 3:2 | brief's alt |
| /industries/warehousing/ | head P-WH-01 | `hall-wh` | 16:9 | brief's alt |
| /industries/robotics/ | head P-ROB-01 | `hall-robot` | 16:9 | brief's alt |
| /industries/robotics/ | P-ROB-02 | `hall-dropoff-43` | 4:3 | brief's alt |
| /use-cases/find-the-asset/ | head P-UC1-01 | `hall-find` | 16:9 | screen 2 alt as in this file (note 1) |
| /use-cases/station-to-station/ | head P-UC3-01 | `hall-build` | 16:9 | brief's alt |
| /use-cases/station-to-station/ | P-UC3-02 | `hall-path-43` | 4:3 | brief's alt |
| /use-cases/amr-hand-off/ | head P-UC2-01 | `hall-handoff` | 16:9 | brief's alt |
| /use-cases/ask-your-plant/ | head P-UC4-01 | `hall-ask` | 16:9 | homepage screen 4 alt |

## Learn squad (team/rounds/07-pages/learn/)

| Slot | Pages | Base | Ratio | Alt |
|---|---|---|---|---|
| L01 | /learn/rtls/ | CAD `pair` (`/assets/home/pair`) | 3:2 | brief's alt |
| L02 | /learn/dwell-time/, /learn/wip-visibility/ | `hall-inspect-43` | 4:3 | brief's alt |
| L04 | /learn/location-data-quality/ | `hall-find-43` | 4:3 | screen 2 alt as in this file (note 1) |
| L05 | /learn/accuracy/, /learn/anchor-planning/ | `hall-bay` | 16:9 | brief's alt |
| L06 | /learn/association/ | `hall-trolley-43` (camera C) | 4:3 | brief's alt |
| L07 | /learn/uwb-vs-rfid/ | `hall-before` | 16:9 | brief's alt |
| L03, L08 | not briefed in any .md | none | | |

## Product squad (team/rounds/07-pages/product/)

| Page | Brief | Base | Ratio | Alt |
|---|---|---|---|---|
| /platform/ | head | `hall-all` | 16:9 | brief's alt (hero alt) |
| /platform/ | AmIHub card | `hall-waits-32` | 3:2 | brief's alt |
| /technology/ | head | `hall-find` | 16:9 | screen 2 alt as in this file (note 1) |
| /technology/ | S10 plan (camera P) | `hall-plan` | 16:9 | brief's alt (note 3) |
| /technology/ | section 2 racks | `hall-racks-43` | 4:3 | brief's alt |
| /industrial-spatial-intelligence/ | head | `hall-ask` | 16:9 | homepage screen 4 alt |
| /products/amihub/ | head (fallback) | `hall-waits` | 16:9 | "A model factory floor with paths in blue and waits in amber." |
| /products/amimo/ | section 4 | `hall-bay-32` | 3:2 | homepage screen 6 alt |
| /products/amigo/ | 4:3 photo (AmIGo on a trolley rail) | not made (note 2): ship `still("amigo-side")` | 3:2 | locked homepage alt without the rail clause |
| /products/amimo/ | 4:3 photo (AmIMo on a column) | not made (note 2): ship `still("amimo")` | 3:2 | locked homepage alt without the column clause |
| /specs/ | pair | CAD `pair` | 3:2 | "The AmIGo tag and the AmIMo anchor side by side, both dark grey with amimotion on the cover." |

## Buying squad (team/rounds/07-pages/buying/)

| Page | Brief | Base | Ratio | Alt |
|---|---|---|---|---|
| /company/ | head | CAD `pair` | 3:2 | brief's alt |
| /company/, /how-to-buy/ | AmIHub card | `hall-waits-32` | 3:2 | "A model factory floor with paths in blue and waits in amber." |
| /pilot/ | head | `hall-bay` | 16:9 | screen 6 alt |
| /start/ | head | `hall-bay` | 16:9 | screen 6 alt |
| /tools/search-time/ | section 3 | `hall-find-43` | 4:3 | screen 2 alt as in this file (note 1) |
| /trust/people/ | section 1 | `hall-ask-43` | 4:3 | screen 4 alt |
| /films/ | the one film | hero film, `/assets/home/hero-film/hall-4x5-{av1,h264}.mp4`, poster `poster-4x5-*` | 4:5 | hero alt |

## Notes

1. **Screen 2 ("find") alt changed.** The briefed alt says the line runs "from the press". The trolley that hides between the racks comes down the main aisle, not from a press, and its 7 m trail shows only that. The true alt is "A model factory floor. One trolley stopped between the racks is marked blue. A blue line shows its path and ends where it stopped." The forklift is left out of this one frame (`--hide fork`) because at t = 0 it stands in the rack-aisle mouth and hides the trolley.
2. **CAD-on-hall composites not made.** AmIGo on a trolley rail and AmIMo on a column need new CAD shots (`amigo_trolley`, `amimo_column` in `render_hardware.py`). A CAD tag pasted onto a hall trolley would look half-real, so per the product README they ship as the plain CAD stills until the Product Render shots exist. `amigo_logo.png` (the macro fallback) is full-frame plastic with no paper, so it cannot be page-graded; not cut.
3. **Camera P** (`--ortho 14 --links`): orthographic, straight down over the inspection bay, no trails, one 30 mm #3a3d42 line from the inspected trolley to the foot of each bay anchor column (x -7.6 and 4.4, y 8.0).
4. **"On a blue floor tint"** (several briefs): not drawn. Located is a line plus the thing at its end; a blue filled shape would read as a pad, and filled shapes mean waiting.
5. Two stills-only props are in `build_hall.py` and never in the film: `--tow` (a trolley hitched 1.45 m behind the AMR) and `--dropoff` / `--drop-trolleys` (a drop-off zone outline at the right end of the back aisle, two trolleys on amber).
