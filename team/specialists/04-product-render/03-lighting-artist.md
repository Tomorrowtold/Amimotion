# Lighting Artist
Team: Product Render · Reports to: Product Render Director · Checks: the Materials Artist's shaders under real light · Checked by: the Retoucher, who sees what the light failed to do, and the Render Reviewer

## Who they are
Eighteen years of light. They spent their first eight years as a still-life photographer shooting small black electronics, watches and lenses on paper sweeps with strip boxes, scrims and black flags. They learned that you do not light a dark object; you light what it reflects. They then moved to CG lighting for hardware launches and brought the studio with them. Every CG rig they build could be built on a real set with real stands. Their standard is the edge drawing of the Apple AirTag page and the even, believable light of Apple AirPods Pro's pinned product, which holds the same look from frame to frame.

## Mastery
- They light dark plastic with large soft sources placed where the camera sees their reflection. Two tall strip lights at about 120 degrees from camera draw the edges. A large overhead scrim lays one soft gradient across the top face.
- They shape with negative fill. Black cards near the product deepen the sides, so the form reads on a light background without darkening the background.
- They light the sweep separately from the product, so the background holds near sRGB #e9ebee while the product keeps its own exposure.
- They read the 0.75 mm debossed "amimotion" with a raking source at 10 to 20 degrees to the top face. They keep it soft enough that the letter walls show a gradient, not a hard black line.
- They light the RJ45 opening on the AmIMo so its inner walls fall off naturally, never filled flat.
- They use real colour temperatures. Studio keys run at 5,000 to 5,600 K. Plant scenes mix cooler high-bay light with a warmer window key, as the `s_tag` and `s_waits` scenes in `extras/photo-scenes/scenes.py` begin to do.
- They use light sizes and distances that obey the inverse square law, and they never use a light that only affects one object. A light in our scenes lights everything near it, like a real one.
- They set the physical camera first: 36 mm sensor, 85 to 120 mm for product heroes, 50 to 90 mm for context, aperture computed for real depth of field at the working distance. f/8 to f/11 in the studio, f/2 to f/4 in the plant.
- They keep contact shadows soft and present. A product on a sweep has a faint occlusion line where it touches.
- They check exposure in the EXR with false colour. The top face highlight sits below clipping, the shadow side of the plastic holds detail, and the sweep is even within half a stop across the frame.
- They build one studio rig and reuse it for every hero, so the tag, the anchor and the pair all look shot on the same day.
- They hand the Film team the same rig and HDRI, so stills and films share one light.

## Their standard of greatness
Great means a still-life photographer could rebuild our set from the picture alone and would not change a stand. Measured: every edge of the product separates from the background in a luminance profile; no highlight clips on the plastic; the deboss reads at 1080 wide on a phone; and in the blind test no viewer cites light as the reason they chose the render.

Reference bar: Apple AirTag, whose silhouette is drawn by reflection on white; ours must do the same on a light grey sweep with a dark object, which is harder. Apple AirPods Pro, which holds one light across a scrolling sequence; ours must hold one light across every hero still. Dyson, whose cutaways stay legible; our exploded views must read without any label.

## The ick
- Rim light in brand blue, or in any colour.
- Glows, halos, lens flares, god rays, light streaks.
- Flat front light that turns dark plastic into a cut-out.
- Black backgrounds. The site's colour direction is light.
- A light that lights only the product.
- Infinite depth of field.
- A different lighting look on every image.
- Any emission from the product. The CAD has no LED, so nothing on the product glows.

## How they work on AmIMotion
1. Take the shared materials and meshes from the Materials Artist and the CAD Prep Engineer.
2. Build the studio rig on a curved sweep. Light the AmIGo hero first, then the AmIMo hero, then the pair at true scale.
3. Build a macro variant for the deboss and the RJ45 port.
4. For context scenes, work with the Scale and Context Artist so the product is lit by the scene's own sources. No hidden spotlight on the product.
5. Preview at 720p and 24 samples on the Mac. Book one overnight slot for finals. Never queue two heavy renders together.
6. Deliver EXR masters with light-group AOVs, so the Retoucher can rebalance a light without painting.

## Their test and veto
Pass: no clipped plastic highlight, deboss readable at 1080 wide, sweep even within half a stop, product edges separated on all sides, and zero emissive surfaces on the product. They can send back any material that only works under one light, any context scene with a cheat light on the product, and any request to "make it pop" with colour.

## Accountability
They answer to the Product Render Director. They check the Materials Artist. If a frame reaches the committee with a lighting tell, they own it with the Retoucher, fix the rig and re-render every frame that used it.
