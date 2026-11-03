# AmIMotion house grade: "Sky Ground" (3 Nov 2026)

One light, one shadow, one white for the whole site. Pictures, films and interface share the same two colours:
shadows lean into the ink indigo of the type (#0B1238), highlights roll into the cool paper white of the page (#F7FAFF).

## For every thread (how to stay coherent)
- **Do nothing to your pictures by hand.** The build grades every picture and film automatically
  (`studio/grade/grade.py`, run by `studio/integrate.py` step 6). Sources stay as shot; new assets you add are graded on the next build.
  Skip a file only for data plates (masks, line maps): add its path pattern to `RULES` in grade.py.
- **Colours:** use the tokens in `studio/grade/grade.css` (loaded last on every page), not new hex values:
  `--g-paper #f7faff` (brightest), `--g-ground #f0f6ff` (page), `--g-plate #e4ebf6`, `--g-ink #0b1238`,
  `--g-night #0c1430` (dark bands), `--g-black #05060d` (house black, never #000), shadows `rgb(var(--g-shadow) / a)` = ink-tinted.
  Elevation: `--g-elev-1/2/3` (one key light above, contact + ambient layer). Signals unchanged: action #4b3df0, located #1f6bff, sky #66a5fa, waiting #ffb020.
- **WebGL / shaders:** clear colour = page ground #f0f6ff; shadow tint = ink #0b1238 at low strength; key light cool white #f7faff; no pure black.
- **New Higgsfield or Blender output:** apply `amimotion-sky-ground.cube` (this folder) in Resolve/ffmpeg if you want to judge it graded before the build: `ffmpeg -i in.mp4 -vf lut3d=amimotion-sky-ground.cube out.mp4`. The build adds a per-file white balance first, so the cube alone is the look without the balance.

## The look (colourist notes)
1. Balance: each picture is neutralised on its near-neutral mid-tones (yellow-green factory tubes and blue renders land on one daylight white). Photos 72%, renders 35%, portraits 45%.
2. Key: highlights roll softly under paper white, never clip.
3. Shadows: neutral toe lift, mid-shadows lean to ink indigo; deep blacks stay clean.
4. Contrast: gentle filmic S around mid-grey.
5. Colour: greens and cyans quietened (fluorescent cast); hi-vis, floor lines, amber and blues keep their strength; skin keeps its warmth.
6. Page worlds keep their character but share one daylight white point and one ink-indigo night; AmIMo stays black and white, on the house black.
