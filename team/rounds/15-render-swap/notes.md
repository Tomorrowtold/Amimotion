# Round 15: landed renders wired into the pages

2 Nov 2026. Build engineer. Only the renders marked **landed** in `team/rounds/11-renders/manifest.md` were used. No render, copy or render-team file was changed. Alts are the manifest's, word for word.

## Slot -> file

| Slot | File(s) | Notes |
|---|---|---|
| Home S1b ±10 cm | `home/amigo-macro-r2-{800,1600,2400}` (R2), `alt=""` beside the number | Flush on the section's right and bottom edges, where the tag runs off the frame. The drift only moves it further off those edges, so no cut edge shows. Phone: 100vw, so the logo stays whole. |
| Home S2 Find it | `home/find/before-45-*` (Scan), `after-clean-45-*` plus the `trail-45.svg` path inlined (motion), `after-trail-45-*` (JavaScript off or reduced motion) (R5) | The trail is split at its rack gap into two paths. Each is drawn in travel order on `--p` (0.44 to 0.62, after the wipe). The tighten origin is now the manifest's `65% 36%`. The scan picture is first in the DOM, so the "before" alt reads before "The same floor…". |
| Home S3 waits | `hall/hall-waits-*` (desktop), `home/queue-1x1-{800,1600,2160}` at 700 px and under (R6) | The `queue-1x1` alt is on the img. The chip's markup height is fixed to 301 (8:5) and it now has `aria-hidden`. |
| Home S4 Ask | `hall/hall-all-*` full ladder, plus `home/ask/mask-*-1920.png` (R4) | Each chip's mask cuts its zone out of a veil (ink at 58 %) that zooms with the still. Q1 shows the inspection queue, Q2 the racks and Q3 the press line. The staging-lane mask is spare. The veil is overscanned by 1 px (it left a 1 px seam on phones). |
| Home S5 family | `home/family-31-{1200,2400,3840}` (R3 3:1) | Full width over the names. On phones it is 150vw, centred, so the products are not tiny (the sweep is transparent, so there is no edge). The 4:5 phone render has not landed. |
| Home S6 bay | `home/bay-32-*` (desktop and tablet), `home/bay-45-*` at 700 px and under (R7) | Two pictures, one hidden per breakpoint, so each keeps its own alt. A lazy hidden picture is not fetched. |
| Home S7 jobs (footer, every page) | `home/jobs/*` (R8, the same names) | The R8 alt for each crop was added in `build.py` `JOB_ALT`. |
| /products/ head | `home/family-31-*` (R3), full bleed under the head at 3:1 (phones 150vw) | New `render()` helper in `lib.py`. |
| /pilot/ head | `home/bay-45-*` (R7 4:5) | Replaces the `hall-bay` 4:5 crop. Phones keep 4:5. |
| /technology/ head | `tech/hall-lines-{1600,3200}.png` (R12), shown at 16:10 | It ships as PNG only. `build.py` now copies `assets/tech`. |
| /diagnostic/ | not wired | The sketch is the visitor's own floor, drawn from their answers. Its seven labelled zones do not map onto the four masks: two of the five "where it waits" answers have no mask. Swapping it needs a design decision. |

## Checks

- `run.py && build.py --share && pickability.py dist`:
  - crawler 746/770 and site files 7/8, as before;
  - unbranded 38/38, branded 9/10, canonical 48/48;
  - barred claims 0.
- No sideways scroll at 320, 390 and 1440 on `/`, `/products/`, `/pilot/` and `/technology/`. No 4xx responses.
- Above the fold, only the inner heads carry `fetchpriority` (from `head()`). Every homepage picture swapped here is below the fold and stays lazy.

## Shots

`shots/<slot>-{1440,390}.jpg` (motion on), and `home-s2-*-nojs.jpg`. Made with `shoot.js` against `serve.js`:

```
node serve.js site/dist 8815
node shoot.js http://localhost:8815 shots
```
