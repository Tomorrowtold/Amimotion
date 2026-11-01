---
name: "amimotion-taste-review"
description: "Review and restyle an AmIMotion web page or site with the taste-skill inspector (no eyebrows, mono, gradients; two-line headlines; real pictures; one motion layer) without changing structure or content."
---

# AmIMotion taste review

The full taste-skill (github.com/Leonxlnx/taste-skill) is copied at /mnt/project-files/skills/taste-skill/: SKILL.md, references/ (type, colour, layout, motion, imagery, tells, critique) and scripts/inspect.mjs. Read its SKILL.md and references/tells.md before changing anything.

## Rules that never move
- Keep the site's structure and content. Restyle in an added stylesheet loaded last plus tokens; do not bolt on new layers (Shiv rejected a bolted-on journey layer as ruining the site).
- Public copy follows the claims register (AmIMotion_Project_Kit/03) and the founders' review of 29 Oct: "built on the FiRa and omlox specifications" (never "compliant" or "certified"); "down to ±10 cm" with AmIMo anchors; "runs in", not "deployed". No customer, backer or partner names.
- Pictures carry no wording about how they were made. Never write "3D illustration", "rendered scene", "illustrative" or similar on a page or in alt text (Shiv, 29 Oct). Alt text describes what is in the picture. Films keep their small "Simulation" label.
- Team photos and bios are AMBER until AmIMotion approves.
- Never name design sources (agencies, brands, repos) in shipped files.
- Back up the original before writing anything back to Shiv's Mac.

## Pictures: think like the founder first
For each slot, ask what one picture would make a plant head say "that is my floor". Then make that exact picture, nothing generic.
- Order of sources: real photos from AmIMotion; photographs made from the real CAD (STL) in a believable plant set; open collections; drawn in code last. Hardware only from real photos or CAD, dark grey, embossed lowercase "amimotion".
- CAD photographs: Blender Cycles (pip `bpy`, CPU, OIDN denoise, AgX Medium High Contrast), procedural worn materials (powder coat, ribbed crates, brushed steel parts, epoxy floor with scuffs, floor tape), HDRI fill plus soft area keys, a real lens (50 to 90 mm, f/2 to f/4, focus on the product). Build the hall fully (walls, roof, trusses, high bays) so no sky leaks in.
- Check every preview yourself for tells: floating or invented parts (no LEDs the product lacks), solid slabs where there should be rims, watery floor reflections, flat white columns in a black void, colour washes. Fix, re-preview, then render finals.
- Use a handful of strong scenes across the site (tag on a trolley, a waiting queue, an anchor on a column, a racked aisle, the whole floor) and vary the crop per slot instead of making weak extra ones.

## What the studios teach (apply the idea, never copy)
- Active Theory, Lusion, Immersive Garden: one hero world, lit like film; the product is the light source of the story.
- Locomotive, Basement Studio: type is the layout; huge confident headlines, line-by-line mask reveals, generous rhythm.
- Resn, Bruno Simon: play and physical feedback; every control answers a touch.
- Hello Monday, Build in Amsterdam: plain storytelling; one idea per screen, products shown in use.
- Niccolò Miranda: editorial pacing; pictures unveil and drift slower than the page for depth.

## What the repos teach
- taste-skill: the tells list and the inspector (1440, 768, 390).
- impeccable: run a critique pass against named anti-patterns before calling a page done.
- gsap-skills: scroll scenes scrub directly from scroll position (no time-based transitions inside a pinned scene); transform and opacity only; one rAF loop; clean up on reduced motion.
- react-bits and transitions.dev: small CSS-first interaction patterns (press scale .97, origin-aware menus, text swap with blur, staggered falloff) with a reduced-motion guard.
- design-extract: pull tokens (type scale, spacing, radii, colour) from a reference to check our own scale is coherent.

## Motion layer for this site
- Hero and word scroll are scroll-scrubbed: each line has its own window, ramps in and out, and hands off to the next with no overlap or lag.
- Headlines (`.h2`) rise line by line from a mask; siblings with data-reveal stagger by 70 ms; pictures unveil from an inset clip and settle from 1.14 scale; pictures drift up to 7 percent with scroll using the `translate` property (never a transition on the drift, or it lags the scroll).
- Buttons and links press to .97. Nothing stays hidden waiting for an animation; everything shows finished under prefers-reduced-motion.

## Type scale
Six sizes only: display, h2, h3, lede, body 16, small 14 (tokens --s-*). Chrome may use 15 and 17. Census the page with a script before and after.

## Loop
1. Serve the built site locally (`python3 -m http.server <port> --directory dist`). If Chrome refuses to run as root, add --no-sandbox.
2. Inspect every page: `node scripts/inspect.mjs http://127.0.0.1:<port>/<page> --out <dir>` (1440, 768, 390). Run 3 in parallel and never rebuild the site while a run is going.
3. Fix in this order: eyebrows, kickers, index numbers, uppercase and monospace (fold meaningful labels into the title); gradients, glows, glass, resting shadows, hairlines and outlined boxes (use tone fills); headlines over two lines; pictures; the motion layer above; reduced motion.
4. Mark real interface fragments `data-ui` so they keep their UI look.
5. Look at every screenshot yourself before claiming quality, including mid-animation frames. Floating controls (nudge, review chip) must not sit over headings.
6. At most two fix rounds after the first sweep. Defend what remains in QA.md: few-pictures and no-footage on text pages, scroll-scene overlaps by design.
7. Record before and after FAIL counts, overflow, console errors and page weight in QA.md.