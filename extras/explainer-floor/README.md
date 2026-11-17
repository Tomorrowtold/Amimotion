# The explainer after the hero: Lost. Found. Seen.

One small plant, seen from one fixed direction, and nine sentences. The sentence leads; the picture follows it.

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
- Reduced motion or no scripts: nine pictures, one under another, each with its sentence.
- Otherwise the section pins. Scroll moves one camera over the plant. Colour spreads to a thing when it is located.
- Sound is made in the browser and starts only after a tap, a click or a key. "Sound on" switches it off.
- `?flr=full` forces the live version, `?flr=stills` forces the finished pictures.

Claims: every sentence and label was checked against the claims register. Position is "typically to within 10 cm". Waiting times and counts are of this small plant, not of a customer.
