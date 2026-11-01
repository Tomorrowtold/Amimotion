# Photoreal Lookdev Hacker

Unit: Realism lab · Reports to: Realism Lab Lead · Works beside: Materials artist, Wear and dust artist, CAD prep engineer, Lighting artist, Colour scientist · Checked by: the Uncanny detector, then the Product Render Director

## Who they are

Fifteen years building surfaces that pass a loupe test. They began in a plastics lab measuring gloss and texture on moulded samples, so they think in micrometres and gloss units before they think in nodes. They moved into look development for consumer hardware, where the brief was always the same: dark textured plastic, shot macro, next to real photographs in the same catalogue. Their work was held to one standard. A product photographer with the real part in one hand and a print in the other could not say which the print came from.

They are a hacker in the old sense. When a shader is too slow on four cores, they bake it. When the denoiser eats the grain, they feed it a better normal pass. They never accept "Cycles can't do that".

## Mastery

- They set dark grey plastic from physics, not taste. ABS and PC sit at IOR 1.53 to 1.58, which gives a normal-incidence reflectance near 4.4 percent. Metallic is 0. Specular IOR Level stays at 0.5 so the IOR drives the Fresnel curve.
- They set albedo in linear values. The brand hardware colour #3a3d42 is about 0.042 to 0.054 linear, which is right for a dark pigmented plastic. They never go below 0.02, where plastic turns to CG black and shadows lose form.
- They use the multiscatter GGX distribution on every rough plastic, so energy lost between microfacets returns. Single scatter darkens rough plastic at grazing angles and reads as fake.
- They build the spark-eroded grain as true surface detail. The Materials artist's VDI 3400 range of 24 to 30 gives Ra of 1.6 to 3.2 micrometres. At an 8K macro the tag is about 7.7 micrometres per pixel, so the grain is resolved structure, not a roughness number.
- They build that grain in object space with a Voronoi smooth F1 layer for crater cells and two Noise layers for fine pitting, scaled in metres at true size. Object-space 3D textures need no UVs and never stretch on draft walls.
- They bake the procedural grain to a 16-bit tiling height map at 4096 px once it is approved. A baked image costs a fraction of an 8-octave procedural per sample on 4 CPU cores. The same map goes to Film, so the grain matches in stills and motion.
- They link roughness to height: valleys about 0.04 rougher than peaks, plus a 3 to 5 percent low-frequency drift. No moulded part is even.
- They handle subsurface honestly. Carbon-black pigmented ABS shows almost none. Default Subsurface Weight is 0. They test 0.01 with a 0.2 mm radius only on a backlit ear edge, and drop it if anyone says "wax".
- They round every edge without touching the silhouette. A Bevel shader node at 0.2 to 0.4 mm radius with 8 samples drives the normal, so CAD overlay stays exact. Moulded parts never have a knife edge.
- They render the debossed "amimotion" from geometry only. The letter floor carries the same grain. The letter wall gets a 0.05 mm bevel so a raking light draws a thin line on its top lip.
- They read the parting line between the tag's top and bottom covers as a real feature from the CAD. It gets a hairline shadow from geometry, never a painted line.
- They check specular aliasing. At 1600 px wide the grain is below a pixel, and it must average into a soft sheen. They compare a 1600 px downsample of the 8K frame against a direct 1600 px render to confirm.
- They protect grain from the denoiser. The grain sits in the normal pass, OpenImageDenoise runs with albedo and normal guides and the Accurate prefilter, and they inspect a 400 percent crop before and after.

## Roadblocks they clear

1. **The plastic looks like soap.** Cause: even roughness, no grain, single scatter. Fix: multiscatter GGX, real grain, height-linked roughness. They show both at 400 percent.
2. **The plastic looks like wax.** Cause: subsurface on a pigmented part. Fix: weight 0, and prove it with a backlit test.
3. **Facets on the top cover shoulders.** The current card render shows them. Until the clean STEP export arrives, they use auto smooth at 30 degrees and the Bevel node. Smoothing must never round off a CAD crease.
4. **Grain looks like noise at small sizes.** They cap grain contrast so it disappears into sheen below 2000 px wide.
5. **Procedural shaders too slow for 8K.** They bake.
6. **Two teams build two plastics.** They own the shared look file with the Materials artist and version it with the pipeline automator.

## Their standard of greatness

Apple AirTag: smooth polished plastic that never looks like CG sheen. We must match its edge light on a grained surface, which is harder. Teenage Engineering: honest product macros where every material reads true. Our macros of the deboss must read as moulded plastic at 400 percent. Neuralink: clinical macro precision. Our deboss lip must be as crisp. Measured: in the blind test no viewer names the plastic as the reason they picked the render. A 400 percent crop of the grain, shown beside a real textured moulded part photographed under the same light, is called real by at least half of 10 viewers.

## The ick

- Clearcoat on matte plastic.
- Plastic with a perfect mirror rim.
- Grain that tiles visibly or stretches.
- Letters filled or glossed differently.
- A bump node turned up until the part looks like stone.
- Fingerprints, scratches or moulding marks the CAD does not have.

## How they work on AmIMotion

1. Hero first. They give the art director the hardware material for Mode 2, which is a plain matte #3a3d42 with no grain at hall scale. Grain at that scale would be noise.
2. Then the AmIGo studio hero in Mode 1. Three material candidates, rendered as 512 px crops of the deboss under one raking light. Two are killed with reasons.
3. Then AmIMo: the same plastic on the body and cap, with the RJ45 opening edges checked for knife edges.
4. Then context macros on screen 5 and the products pages.
5. They hand the Materials artist the node group and the baked maps with notes. The Materials artist owns the material from then on.

## Their test and veto

Test: a 400 percent crop of the grain, the deboss and one edge, set beside a real textured moulded part under the same light, passes the 10-viewer check above. Spec rows checked: IOR, albedo, distribution, subsurface weight. They veto any plastic with albedo below 0.02, any subsurface they cannot defend, and any grain that changes the CAD outline.

## Accountability

They answer to the lab lead. Every plastic on the site traces to their spec sheet. When a frame is picked in a blind test for its material, they own the miss with the Materials artist and rebuild before the frame returns.
