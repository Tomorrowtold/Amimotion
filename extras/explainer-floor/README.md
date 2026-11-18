# The explainer after the hero: Lost. Found. Seen.

One small plant, seen from one fixed direction, and ten sentences. The sentence leads; the picture follows it.

The copy stands on the left and tells one sentence at a time. Each line rises out of its own slot, each word lights as the scroll passes it, and a word that names a thing in the picture (`<b data-k="…">` in `section.html`) is underlined in that thing's colour while a hair runs from its line to the thing. The picture event for that word happens at the same point of the scroll.

Small true details: the ruler at the bottom shows a real length at the present distance; the metre marks along the plant's edges are the frame that x and y are measured from; the arrival times are the real flight times from the tag to each anchor; pointing at a located thing shows its kind and position.

- `section.html` is the section's markup. `merge.py` puts it into `studio/v1/index.html`.
- `studio/v1/css/floor.css` and `studio/v1/js/floor.js` are its styles and script. Every rule starts with `.flr`.
- `studio/v1/assets/floor/` holds the pictures: `L/` for large screens, `P/` for phones.
  - `wide`, `mid`, `close`, `macro`: the same plant at four distances, each in two states. `clay` is the plant before anything is located. `col` is the plant located.
  - `sprites.webp`: the two AMRs (16 headings, both states) and the walker (4 headings, 8 steps).
  - `depth.png`: how far each point of the wide picture is, so a moving thing passes behind a column correctly.
  - `s1` to `s9`: the nine finished pictures, for browsers without WebGL, with Save-Data, or too slow. `stills.cjs` takes them from the live section.
  - `floor.json`: where things are, in metres.
- `blender/` holds the scripts that made the pictures (Blender as a Python module, Cycles). They need the Poly Haven scans and the tag and anchor CAD, which are not in this repository.

How it behaves
- Reduced motion or no scripts: ten pictures, one under another, each with its sentence.
- Otherwise the section pins. Scroll moves one camera over the plant. Colour spreads to a thing when it is located.
- Sound is made in the browser and starts only after a tap, a click or a key. "Sound on" switches it off.
- `?flr=full` forces the live version, `?flr=stills` forces the finished pictures.

Claims: every sentence and label was checked against the claims register. Position is "typically to within 10 cm". Waiting times and counts are of this small plant, not of a customer.

## Round 2 pictures

`blender/bay2.py`, `sprites2.py`, `pack2.py` and `renderall2.sh` made the pictures now in `assets/floor`: the same bay in AmIMotion's colours, the AmIGo tag from the founders' CAD with a moulded finish, and a closer macro (0.36 m). `pack2.py` reads `BAY` and `SPR` for the render folders. The CAD files themselves are not in this repository.

The section closes on the three layers: tags on the floor, anchors above, AmIHub on top. They are drawn as lines over the plant in `floor.js` (`l-lay`).

## Round 3 behaviour

- A sentence is never left half shown. The scroll decides which sentence is due; the clock brings it in and takes it out.
- One typeface for both lines (AmI Display), as in the first screen.
- The scroll run is about four screens. Once the whole story has been scrolled and left behind, the section folds to one screen showing the last picture, with Back to top and Replay.
- `ver.py` writes a hash of the pictures into `floor.json`; `floor.js` adds it to every picture link so a kept old set is never shown. Run it after packing new pictures.

## Round 4: light, and signals as the founders describe them

- Lost stands under a flat sky: `blender/bay3.py` renders the unlocated (clay) plates with the sun off (`renderall3.sh`). The located plates keep the sun. In `floor.js` sunlight opens around the first located trolley and then crosses the floor (`st.sun`, `uSun`), so shadows and colour arrive with location. No extra pictures are loaded and the shader does one more distance test per pixel.
- Signals follow the brochure's three steps: the tag sends a pulse a few nanoseconds wide when it moves; every anchor in range records the arrival time and the direction; AmIHub turns timing, direction and the map into a position. Lines leave the tag at one speed, so the nearest anchor is reached first. The moving pulse is drawn to scale (3 ns is about 0.9 m). Arrival times are the true 3D distances divided by the speed of light.

## Round 5: the truck, and a story that moves one sentence at a time

- The truck reads from above: a 40 ft container (corrugation across its length, weathered roof) on a skeletal trailer, coupled to a cab-over tractor in AmIMotion's ink, standing whole on its own apron (`blender/truck2.py`). The wide plates are framed larger (`SCALE=52`, 4405 px) at the same pixels per metre, so nothing is cut at the edge (`renderall4.sh`, then `pack3.py` repacks only the wide plates and updates `floor.json`).
- Controlled scroll (`floor.js`, "controlled scroll"): inside the story one wheel turn, swipe or key glides to the next resting point, where that sentence's words, picture and sound have all arrived. The page is held while the story runs, so a long flick cannot carry past a sentence. Before the first and after the last resting point the page scrolls as usual. Off for reduced motion.
- Words, picture, sound and the phone's vibration all follow the one scroll value.

## Round 6 (last-version audit)
- Supervisor legs restored: floor.json cam/view now match the reframed wide camera (pack3.py writes them), so depth occlusion no longer clips the sprite.
- Removed depth blur, light shafts and floor pools; grade and the left dim softened so every detail reads sharp.
- AMR and supervisor caught shadows feather out at the sprite cell edge (FS2), so no hard-edged smudges.
- pack3.py heals the black slivers where rack tops meet the back wall.
- Supervisor poses re-rendered at 512 px a cell (`CELL=512 venv/bin/python sprites3.py out/spr3x`, then packposes.py): an 8 x 4 sheet, read with the uK uniform.
- Notes sit on a crisp paper slip (no blur halo) above the lead lines; the 10 cm bar sits clear of the trolley; axis numbers hide under the copy and at the edge; the text fog is narrower so the truck shows.
