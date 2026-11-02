# Round 19: the locate scene (homepage S2b)

The grey-box SVG diagram is gone. "How it locates a tag" is now one pinned, scroll-driven three.js stage. The four captions, the step structure and the link are unchanged.

**Scene.** A slice of plant floor, in metres. It has a glossy grey epoxy aisle with worn 100 mm yellow lines, saw-cut joints and tyre tracks. There are three galvanised H-section columns, and galvanised racking with wooden pallets of cast aluminium housings (no cardboard). A steel two-tier WIP trolley with ply decks, castors and a bent-tube push handle carries cast housings with machined flanges and bored bosses.

The AmIGo tag is the founders' CAD (studio v1 quantised meshes), screwed to the top shelf's front rail. The embossed "amimotion" reads correctly. The four AmIMo anchors are the enclosure CAD (`PCB_ENCLOUSER_*.stl`, quantised by the same scheme into `assets/locate/cad/anc_*.bin`). They sit 3.35 to 4.2 m up on the columns and the rack end.

The look comes from these choices:
- ACES filmic tone mapping.
- A hand-built HDR clerestory environment (PMREM).
- One soft sun shadow map, updated only when the trolley moves.
- Blurred contact-shadow decals under every foot.
- Fog into the page colour.

**Beats.** These follow the storyboard (team/rounds/18-bench/storyboard.md section B), mapped onto the four captions:
1. The trolley rolls in and stops, and the camera pushes in on the tag ("awake"). Straight 1.5 px lines then go out to each anchor. Each line is labelled at its midpoint in metres and ns (distance / 0.2998 m per ns).
2. A timing ruler sets one tick per anchor where its pulse arrives: the first at 0, the others "+3.3 ns" and so on. It is captioned with the page's own line "Light travels about 30 cm in a nanosecond." Each anchor shows "az · el" with two short leaders in its own frame (no arcs).
3. The lines meet at a crosshair labelled x / y / z and the time seen. The camera starts to rise.
4. The camera goes top-down. Every material mixes to its flat map colour (one uniform, after tone mapping), and the standing geometry flattens onto the floor: the film becomes the map. Then the map dot, the path, "AmIGo asleep", and "Last seen hh:mm:ss.s" with an amber "Waiting m:ss" timer that counts.

The scene has no rings, no glow, no arcs and no gradients. Its figures are computed from the drawn geometry. The only accuracy figure is the page's own "±10 cm", which the scene does not repeat.

**Interaction.** Drag the trolley along the aisle with a pointer or touch. The canvas has `touch-action: pan-y`, so vertical scrolling stays free. Every line, figure, ruler tick, the crosshair and the map dot update live. The canvas is a focusable `role=slider` that the arrow keys, Shift+arrow, Home and End move. It uses `aria-valuetext` and points to a visually hidden description in the page.

**Fallbacks.** With JavaScript off, reduced motion, `?still`, Save-Data or no WebGL, the section shows a strip of four stills rendered from the scene (`assets/locate/step-N-{800,1600}.{avif,webp}`, with alt text).

**Performance.** `locate.js` (about 1 KB) waits until the section is about one screen away, then imports `locate-scene.js` and three.js. Device pixel ratio is capped at 2 on desktop and 1.75 on phones. Rendering stops off screen and when idle. Phones get no shadow map, smaller textures and simpler labels.

**Reuse.** `start(section, opts)` takes options (the bootstrap passes `cut` from `data-locate`). The /technology/ racking cut and the /products/amigo/ "sleeps when you let go" cut are not built yet.
