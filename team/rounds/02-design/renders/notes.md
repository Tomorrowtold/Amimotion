# Hardware studio renders, round 02: notes

Product Render team with the Realism lab. Four stills from the founders' CAD, 2400 x 1600, Cycles CPU (4 cores), each capped at 300 s of path tracing plus OIDN denoise (about 5.5 min wall clock per still).

## Files

- `amigo_hero.png`: AmIGo three-quarter, logo face up, 90 mm, f/8.
- `amigo_logo.png`: AmIGo near top-down macro of the debossed "amimotion", 100 mm, f/8, 74 deg elevation, yawed 4 deg.
- `amimo_rj45.png`: AmIMo three-quarter from the RJ45 end and the logo side, lying on its flanged cap, 90 mm, f/8.
- `pair_scale.png`: both together at true scale, 90 mm, f/8.
- `contact_sheet.jpg`: all four.
- `render_hardware.py`: the whole scene, one script. `python render_hardware.py <shot|all>` under `/tmp/bpyenv/bin/python`, then `python3 render_hardware.py --grade raw.png final.png` under system Python (numpy and PIL).

## Assembly (checked against sheet.jpg, asm.jpg and six orthographic views)

- The STLs are in mm and already share one assembly frame. The script bakes 0.001 into the mesh so texture space is true scale.
- AmIGo: top cover z -12.6..-2.9, bottom cover z -3.1..10.6. The 0.24 mm overlap is the lip. Logo face is CAD -Z, so the tag is turned 180 deg about X (not 90 deg: 90 stands it on edge). Assembly is 59.0 x 86.0 x 23.2 mm. The parting line shows as a fine shadow gap.
- AmIMo: the cap is the flanged mounting plate at CAD +Y, with the two eared holes. The body is the box with the RJ45 opening and two slots at CAD -Z, and a debossed "amimotion" on its -X wall. It is shot lying on its plate (Rx -90 deg), as it would sit on a shelf before mounting. Assembly is 59.0 x 28.6 x 105.6 mm.
- Both assemblies rest on z=0 at their lowest vertex. No part was added. No LED, no jack inside the RJ45 opening, no screws.

## Three ideas, two killed, per decision

Lighting
1. Area-light rig only, white cove. **Kept, reworked.** Graduated scrim key behind and above, two edge strips at about 120 deg from camera, a large far fill, a background light hung over the cove, black flags both sides and above the lens, a white bounce card.
2. Studio HDRI only (Poly Haven `studio_small_09`, CC0). **Killed.** It gave no control over the top-face gradient, and its window shapes would show in the plastic as a recognisable stock reflection.
3. Rig plus HDRI at 0.22, desaturated to 30 %. **Merged into 1.** The HDRI is only there so the rough reflections are not empty between the lights.

Plastic
1. Roughness value only. **Killed.** It reads as grey clay. This is the "even roughness" tell.
2. Noise bump at 11,000/m and 12 um. **Killed.** The grain was smaller than a pixel and the denoiser wiped it out, so the surface still looked like clay.
3. Spark-erosion grain: 4D noise plus Voronoi craters at 9,000/m and 13 um, roughness tied to height (peaks 0.06 glossier), 3-5 % low-frequency roughness and value drift, 0.15 mm bevel shader for edge catch-lights, IOR 1.54. **Kept.**

View transform
1. AgX Base Contrast. **Killed.** It needs a scene-linear sweep near 2.0 to read white. The dark top face then reflected that hot paper and went mid grey.
2. AgX Medium High Contrast. **Killed** for the same reason.
3. Khronos PBR Neutral. **Kept.** The paper sits near 0.85 linear, so the plastic reflects a believable amount of it and keeps its base colour.

## CG tells found and fixed, by round

Round 0 (exposure tests at 720 px)
- The scene was about 5 stops overexposed and the plastic rendered white. Fixed with one global `EXPO` scale that keeps the light ratios physical.
- The cove sweep stood on the wrong side of the camera, so the "background" was the floor running to an HDRI horizon. The sweep now rotates with each camera.

Round 1 (hero, full res, 19 min, which is too slow)
- The plastic read as mid-grey clay. Cause: the background light hung over the product and lit its top, and AgX pushed the paper hot. Fixed with a background light over the cove only (55 deg spread), black flags, Khronos view and a darker base (#404143).
- The top face had no gradient. Fixed with a graduated scrim, feathered to nothing at its lower edge, placed just out of frame in the mirror direction.
- The logo letters were filled black. Cause: a 0.28 mm bevel shader radius bent the 0.75 mm letter walls' normals into the letter floor. Fixed by cutting the radius to 0.15 mm. The letter floor now carries the same grain as the face, as the tool would make it.
- No visible texture. Fixed with coarser and deeper grain (above).
- The paper and plastic had a pink-magenta cast. Cause: Blender blackbody 5300-6500 K under Khronos. Fixed with explicit linear light tints (5900 K equivalent, slightly warm).
- Render time. Cut bounces to 6/3/3, set bevel to 4 samples, and set a 300 s Cycles time limit with adaptive sampling.

Round 2 (all four, full res, about 5.5 min each)
- The anchor's shadow side and the RJ45 opening went to black: a "black hole" and clipped-black tell. Fixed with fill x2.2 and a bigger bounce card.
- The logo top-down was dead square and centred: a "perfect placement" tell. It is now yawed 4 deg, framed as a macro, and focused on the logo plane, so the far edge falls off naturally at f/8.
- The top-down top face was too bright, because the background light reflected in it. Fixed with key x0.6, background x0.5 and a stronger rake.
- The grain read as leather or orange peel. Fixed with finer, more octaves and shallower relief.
- The sweep clipped at the top and was grey at the bottom, about 1.3 stops apart. Fixed with the background light down and the fill up. It is now within about half a stop.

Round 3 (all four)
- The anchor's two visible walls had the same tone, so the form flattened. Fixed by swinging the fill to camera +42 deg so the RJ45 end leads.
- The pair sat parallel with too much empty floor. Fixed by turning the tag -14 deg and moving the camera closer.
- I checked the near-black letters on the hero by turning off weighted normals and the bevel. It is physical: 0.75 mm walls in about 1 mm strokes, seen from 30 deg. I kept it.

Round 4: final renders and grade
- The RJ45 opening and the screw holes held pure black (L* 0): a "clean blacks" tell. Fixed in the grade with veiling glare in linear light (1.5 % of mean scene luminance, a normal figure for a real lens). Opening floor is now L* 8.
- The anchor's RJ45 end was soft because the focus sat mid-body at 11 mm depth of field. Focus moved onto the RJ45 end face and re-rendered. The far end of the logo wall now falls off, as it would at f/8.
- Grade: x0.95 levels so the paper peaks near #efeeec and does not clip, 0.1-stop lens falloff, 0.35 px lateral chromatic aberration, luminance-weighted sensor grain added at full resolution after the denoiser.

Final measurements (graded PNGs)
- Paper: #e8e8e6, L* 92 top and 89 bottom. That is within half a stop and slightly warm of the site's #e9ebee.
- Plastic: median L* 35-40. The 5th percentile is L* 25 (tag) and 11-17 (anchor, pair). The anchor's holes and the RJ45 cavity are the darkest pixels. No plastic face is below L* 18.
- No brand blue anywhere. Nothing emits but the studio lights, which are out of frame.

## What still looks fake (frank)

- Surfaces are too clean. No dust, no fingerprints, no sink marks, no ejector-pin witnesses, no gate vestige. A real moulded part has at least a gate mark and a faint sink over the bosses. The CAD carries none, and inventing them breaks the "only what is in CAD" rule. The founders should share one photo of a real part.
- The geometry is the founders' STL, triangulated and without fillets on the anchor box. Its vertical edges are knife-sharp under the 0.15 mm bevel shader. At 8K this will show. Rebuild from STEP with real 0.3-0.5 mm edge radii.
- The hero's debossed letters read darker than a photograph would, because the denoiser crushes the thin lit wall strips inside each letter. A higher sample count (Mac overnight) should restore them.
- The plastic colour is a guess (#404143 neutral). It is not calibrated against a real part.
- The grain is procedural. Close inspection of the macro shows a noise-like pattern, not true EDM craters. A scanned VDI 27 normal map would beat it.
- None of these has been through a blind 2AFC test. That is the render reviewer's next step, and these are not cleared until it is done.
