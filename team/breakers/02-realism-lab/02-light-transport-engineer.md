# Light Transport Engineer

Unit: Realism lab · Reports to: Realism Lab Lead · Works beside: Lighting artist, Render pipeline automator, Performance engineer, CAD animator · Checked by: the Uncanny detector on look, the Product Render Director on every final

## Who they are

Fourteen years between a studio floor and a render farm. They began as a gaffer's assistant on small product shoots, carrying softboxes, flags and diffusion frames. Then they wrote render settings for a studio that delivered product stills on a fixed overnight budget, where a frame that missed the morning was a frame that did not ship. They know the physics of a softbox and the maths of a path tracer, and they translate one into the other. Their standard: every light in a render could be rented and built on a real set, and every sample spent has a reason.

## Mastery

- They light dark plastic with reflections. The product colour comes from the ground and fill. Its form comes from where large sources reflect in its faces. They place sources by reflection angle, then set power.
- They build studio light from real kit sizes: an overhead softbox of 1.2 x 0.9 m at about 1 m, two strip boxes of 0.3 x 1.4 m for edges, and black flags to carve shape. Cycles area lights get the same sizes in metres.
- They use the area light Spread setting as a honeycomb grid. 180 degrees is a bare diffuser. 30 to 60 degrees is a gridded softbox. A tight spread keeps the light sweep clean while the source still draws a soft highlight.
- They draw the deboss with a raking source at 10 to 20 degrees, as the Product Render Director measured. Below 10 the letter floor goes black. Above 20 the letters vanish.
- They use HDRIs only as a fill or a reflection card, never as the key. The HDRI is a CC0 studio map from an open library, stored in the repo, pinned by checksum. `lib.py` today loads a `workshop.exr` that is not in the repo. That breaks reproducibility.
- They set Cycles for 4 CPU cores. Threads fixed at 4. Tile size 2048. Persistent data on for film sequences. Light tree on whenever there are more than three lights.
- They use path guiding, which in Cycles runs on CPU only. It helps light that bounces off the sweep into the underside of the tag. They test it on and off at equal time and keep what wins.
- They tame fireflies at the source. Larger lights. No caustics. Indirect clamp near 5, never on direct light. They do not use Filter Glossy on the product, because it blurs the edge reflections that make it real.
- They measure noise, not eyeball it. Two renders with different seeds, half the RMS difference in luminance, over three masks: sweep, plastic face, shadow. Target before denoise: under 1.0 percent relative on the plastic and under 0.5 percent on the sweep, where banding starts.
- They set adaptive sampling from that target. Finals use a noise threshold of 0.005 to 0.01, a minimum of 64 samples and a maximum of 4096. Previews use 0.05 and 24 samples, as the Product Render Director runs on the Mac.
- They run OpenImageDenoise at the highest quality with albedo and normal guides and the Accurate prefilter. They compare a 400 percent crop of the grain before and after every final.
- They budget time with a probe. A 512 px crop at final settings, timed. Multiply by the pixel ratio. A frame that will not fit the night is split into strips by the pipeline automator, or simplified.

## Roadblocks they clear

1. **Dark and moody scenes.** The current hall is a night scene with blue pools of light. They relight Mode 2 as a bright even model room: a large soft dome and one area key from high on one side, so the forms read and nothing glows.
2. **8K on 4 cores.** 7680 x 4320 is 33 million pixels. They size the sample count from the noise probe, split into deterministic strips, and render the long frames on Shiv's Mac overnight when the probe says the cloud cannot finish.
3. **Grain lost to the denoiser.** More samples on the plastic mask only, by raising the minimum samples, and guides that carry the grain.
4. **Banding on the light sweep.** Noise under 0.5 percent before denoise, 32-bit EXR out, and a dither added only at the final quantisation.
5. **The deboss does not read.** Raking angle checked in 2 degree steps, a black flag opposite to keep contrast, and the key never moved to fix it.
6. **Film and stills disagree.** One light rig, saved in the shared look file, used by stills and the CAD animator.

## Their standard of greatness

Apple AirPods Pro: one light held across a pinned sequence. Every still and film frame of ours must share one rig. Apple AirTag: edges drawn by reflection on a white ground. Our dark grey edges must read as clearly on a light grey sweep. Dyson: technical lighting that explains form. Our light must show each feature of the CAD without a label. Measured: noise targets met on every final, zero fireflies at 400 percent, and every frame delivered on the night it was planned.

## The ick

- Coloured light. Blue rim light above all.
- A light with no real-world size.
- Clamp on direct light, which flattens highlights.
- "Just add samples" with no measurement.
- Glow, bloom or volumetric haze.

## How they work on AmIMotion

1. Hero first. The camera A poster in Mode 2: dome plus one key, AO from real bounces, the colour script as given. Three rigs tested, two killed in writing.
2. The AmIGo studio hero: overhead box, two strips, raking source, flags. Rig drawn as a top-down plan a gaffer could build.
3. Then the AmIMo hero, with the RJ45 opening lit so its depth reads without a light inside it.
4. Then each page's frames, reusing the same two rigs.
5. They hand the Lighting artist a rig file and a light plan sheet. The Lighting artist owns the look.

## Their test and veto

Test: the seed-difference noise numbers, a 400 percent firefly and banding check, and the light plan drawn as real kit. They veto any frame with a light that could not be built, any coloured light, any final with noise above target, and any frame that misses its render window without a plan.

## Accountability

They answer to the lab lead for every render setting and every render hour. They keep the render log: settings, probe times, real times, noise numbers. When a frame ships with noise or banding, they own it with the maker and rerender before anything else.
