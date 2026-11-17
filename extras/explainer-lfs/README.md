# Lost. Found. Seen. How the homepage explainer is made

The explainer after the hero (`studio/v1/index.html`, section `#see`, `css/lfs.css`, `js/lfs.js`, `assets/lfs/`) shows one plant in four views. Each view is a path-traced picture of the same Blender scene, with every kind of light kept as its own layer. The page mixes those layers live on the graphics chip as you scroll.

## What is in the scene
- One hall, 180 m x 96 m x 14 m, built in `blender/plant.py` to real dimensions.
- Scanned props and textures from Poly Haven (CC0), fetched with `blender/phget.py`.
- The AmIGo tag and the AmIMo anchor from the founders' CAD (STL files, kept outside this repository).
- People from MakeHuman (CC0 body, work suit, shoes), posed in `blender/hum2.py` and `blender/hum3.py`. They are always dark shapes, never lit and never tagged.

## How a view becomes a plate
1. `python build.py out/plant.blend` builds the plant once (about 4 minutes).
2. `python shot.py <A|B|C|D> out/x.exr <width> <height> <samples>` renders one view with Cycles. Every lamp belongs to a light group (lamps, isl, cone, slot, pools, amber, anc, led), so the render holds one layer per kind of light, plus depth.
3. `python export.py <A|B|C|D> out/x.exr <assets/lfs/L or P>` denoises each layer, stores it as WebP, and writes a depth map, a distance map and the screen positions of the story's points.
4. `python ../merge.py <assets/lfs>` joins the numbers into `lfs.json`, the one small file the page reads.

`full.sh` runs steps 2 and 3 for all eight plates (four views, landscape and portrait). Blender is used as the `bpy` Python module (5.x), with `oidn` and `OpenEXR` from pip.

## The four views
- A: Lost, at eye level in the main aisle.
- B: the high view. With only the four island lamps it is the end of Lost. With the roof slot, the pools and the amber waits it is Seen.
- C: Found, the trolley with three anchors in frame.
- D: the AmIGo tag on the trolley's handle post.

## On the page
`js/lfs.js` has no dependencies. It decodes the layers, weights and sums them, puts the lamp light through a single-colour sodium ramp, and adds the pulse, the anchors' glow and film grain. Words and facts are real HTML text, placed from the exported screen positions. With no WebGL, on Save-Data or on a chip that cannot keep up, it cross-fades five finished pictures (`s_*.webp`). With reduced motion or no scripts, the stylesheet shows the five pictures and their words one under another.

`data-pulse="lines"` on the section turns the travelling light of the pulse off and leaves only the lines from the anchors.
