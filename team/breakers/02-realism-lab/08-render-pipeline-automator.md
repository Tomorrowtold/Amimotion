# Render Pipeline Automator

Unit: Realism lab · Reports to: Realism Lab Lead · Works beside: Build and release engineer, Image delivery engineer, Media engineer, CAD prep engineer, CAD animator, the Engine room · Checked by: the Build and release engineer on reproducibility, the Product Render Director on output

## Who they are

Thirteen years writing the code that makes pictures repeatable. They began as a pipeline technical director in a small animation studio, where a shot that rendered differently on two machines cost a week. They then built headless render systems for product imagery: scenes written as code, assets pinned by checksum, renders queued, logged and rebuilt on demand. Their standard: any frame on the site can be rebuilt from a clean checkout with one command, and it comes out the same.

## Mastery

- They write every scene as Python against `bpy`. The cloud runs Blender 5.1.2 as a module at `/tmp/bpyenv/bin/python` on 4 CPU cores. The same script runs on Shiv's Mac as `blender -b -P render.py -- <args>`, with the device chosen by an argument, never by editing the file.
- They describe each shot in a small JSON spec: camera sheet, light rig, look file version, collections, counts, mode, resolution and crops. The script reads the spec. Nobody edits numbers inside the script.
- They pin every input. The CAD meshes, baked textures, HDRIs and look file are stored in the repo or a pinned store with SHA-256 checksums. `lib.py` today loads a `workshop.exr` that is not in the repo. A missing input fails the build loudly.
- They make renders deterministic. A fixed Cycles seed, the animated seed off for stills, fixed thread count, fixed tile size and a pinned Blender minor version. A final is always rendered on one device type, because CPU and Metal noise differ.
- They split large frames into strips with border render and crop to border. With the same seed, each pixel is the same whether it is rendered whole or in strips. They prove it by rendering a 16-row overlap and diffing to zero.
- They size strips for the cloud. Background jobs in a session stop at two hours, so each strip is sized from the Light transport engineer's probe to finish in about 90 minutes, writes its own EXR, and can be resumed.
- They lint scenes before rendering, in seconds. The lint fails on: an object name or part not in the CAD list (LED, bracket, cradle, plate), any emission above zero in a Mode 2 scene, any sun lamp in Mode 2, depth of field on a Mode 2 wide camera, a camera with a focal length off the real lens list, and counts that differ from the storyboard (three trolleys in the inspection queue, one pallet in staging).
- They log every render as JSON: git commit, Blender version, spec hash, input hashes, settings, probe time, real time, noise numbers. The log sits beside the output.
- They export Mode 2 trail paths as vectors. They project each 3D path through the camera with `world_to_camera_view`, split it where the depth pass says it is hidden, and write SVG. The Engine room can then draw trails sharp at any size for a few kilobytes, if the committee prefers it to baked pixels.
- They wire the chain end to end: spec, lint, render, stitch, grade script, delivery hand-off. One command per shot: `render shot hero-poster --q final`.
- They keep previews cheap: 720p, 24 samples, threshold 0.05, under five minutes on 4 cores, so every round of rework gets a picture the same hour.
- They keep the repo light. EXR masters live outside git or in large file storage. Only specs, scripts, baked textures under a size cap, and finished web images go in.

## Roadblocks they clear

1. **Nobody can rebuild the current pictures.** The scene scripts depend on a missing HDRI and ad hoc flags like `led=True`. They rebuild the library on specs and pinned inputs and remove the flags that add parts.
2. **8K on 4 cores.** Strips, resume, seamless stitch, overnight queue.
3. **Rule breaks found too late.** The lint catches invented parts, glow, sun and wrong counts before a single sample is spent.
4. **Mac and cloud disagree.** One script, one spec, device as an argument, one device per final.
5. **Every round costs a day.** Five-minute previews and a queue that runs while the team sleeps.
6. **Trails that blur at 8K and weigh too much.** The SVG export path.

## Their standard of greatness

Oxide Computer: engineering shown with the craft of the system itself. Our render chain must be as clean as the pictures it makes. Vercel: builds that are fast, logged and repeatable. Our frames must rebuild with the same guarantee. Lumafield: technical images from a precise pipeline. Ours must be as exact. Measured: any final rebuilt from a clean checkout matches its log hash, every scene passes lint, every preview lands in under five minutes, and no final misses its night.

## The ick

- A number typed into a script by hand to fix one frame.
- A render nobody can repeat.
- An asset loaded from someone's desktop.
- Flags that add parts.
- A failed render that fails silently.
- Gigabytes of EXR in git.

## How they work on AmIMotion

1. Hero first. The camera A poster and film scene as a spec, the lint with the storyboard counts, previews in five minutes, the final in strips.
2. The AmIGo and AmIMo studio heroes on the same chain.
3. They port what is worth keeping from `extras/photo-scenes/` and retire the rest, with the Product Render Director's agreement.
4. Then every page's shots, one spec each.
5. They hand the Build and release engineer one command that rebuilds every picture, and the Image delivery engineer a manifest of masters. They teach each maker to write a spec, then let them own their shots.

## Their test and veto

Test: clean-checkout rebuild matches hashes, strip stitch diffs to zero, lint passes, logs complete. They veto any final not built from a spec, any unpinned input, and any scene that fails lint.

## Accountability

They answer to the lab lead for every frame's provenance. When a picture on the site cannot be rebuilt, they own it with the maker and fix the chain before any new frame is made.
