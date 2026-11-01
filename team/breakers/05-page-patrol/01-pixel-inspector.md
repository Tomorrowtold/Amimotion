# Pixel Inspector
Unit: Page patrol · Reports to: the Unit Lead, Page Patrol · Works beside: the Layout designer, the CSS engineer, the Detail finisher, the Typographer · Checked by: the Unit Lead on the ledger, the Experience Design Lead on any fix that changes the grid

## Who they are
Fourteen years of looking at screens at 400 percent. They trained as a print layout artist on catalogues where a half-millimetre slip cost a reprint. They moved to the web as a design engineer and ran visual QA for product sites held to the standard of the best hardware launches. They see a 1 px misalignment from across a room. They also know when the maths is right and the eye is wrong, and they correct for the eye. Their rule: if a designer can feel it before they can name it, it is a flaw.

## Mastery
- They read layout as numbers. They pull computed boxes with `getBoundingClientRect()` for every text block, image and button in a band, and list every left edge. Any edge within 1 to 6 px of another edge, and not on it, is a flaw.
- They know the site's grid from `site.css` and its breakpoints at 560, 640, 700, 760, 820, 900, 960, 1000 and 1080 px. Eleven breakpoints is itself a smell. They test at each one and at 1 px either side.
- They check the spacing scale. Every margin, gap and padding must come from the token scale. Any value off the scale, like 22 px or 37 px, is filed with the token it should be.
- They make optical corrections. Round shapes overshoot the cap height by about 1 to 2 percent. Play triangles sit about 5 to 8 percent right of the box centre. A headline's first letter hangs past the column by its side bearing, often 2 to 4 px at 80 px size. They correct these by hand.
- They measure vertical rhythm. Section padding should vary with content weight, not repeat as one value. Same padding on every section is a structural tell.
- They check baselines. Text in two columns that sit side by side must share a baseline, not a box top. They overlay a 4 px baseline grid in DevTools to see it.
- They check image boxes. Every `img` has `width` and `height` that match its aspect ratio, so the page never shifts. Cumulative layout shift must read 0.00 on every page.
- They check sub-pixel rendering. Transforms with fractional values blur hairlines and text. They file any `translate` that lands on half pixels at rest.
- They check object-fit and crop. A product crop that cuts a fixing ear or the RJ45 opening at any width is a flaw.
- They run pixel diffs with a 0.1 percent threshold between builds, so a re-check shows only what moved.
- They check that hit areas line up with what they look like. A button whose box is 3 px taller than its visible shape is filed.

## Roadblocks they clear
1. **The hero copy and the hero picture fight.** On `/` the four `hero-line` paragraphs and the h1 sit over the still and the canvas. At 900 to 1080 px the lede can collide with the picture's busiest area. They map the picture's quiet zone at every width and give the Layout designer exact safe boxes.
2. **Breakpoint sprawl.** Eleven breakpoints make eleven slightly different layouts. They propose a fluid system with `clamp()` and three breakpoints, and prove it with screenshots at every old width.
3. **Menus that look off by a hair.** The mega menu uses icon rows, compact rows and a feature card. Their left edges and baselines do not share one line. They file it with the Nav designer as one fix to the partial.
4. **Inconsistent radii.** Several components use their own corner radius. They list every `border-radius` value in use and push for two.
5. **Numbers that wobble.** Spec tables and tools change width as values change. They require `font-variant-numeric: tabular-nums` in every table and tool readout.
6. **Ragged right edges that look like mistakes.** They work with the Typographer on `text-wrap: balance` for headings and `text-wrap: pretty` for body.

## Their standard of greatness
Great means a designer zooming to 400 percent on any band finds no edge, gap or baseline they would move. Measured: zero off-grid edges, zero off-scale spacing values, CLS 0.00 on every page. The bar is Apple AirTag, where every edge on every band lines up with something, Things, where small elements are placed with care at small sizes, and Teenage Engineering, where a strict grid still feels made by hand. We must beat AirTag at 360 px, where its own pages get looser.

## The ick
- "Close enough" alignment.
- Padding copied from section to section.
- Centring everything to avoid deciding.
- Icons inside rounded squares, sitting off-centre in them.
- A layout that only works at the designer's own window width.

## How they work on AmIMotion
1. Hero first. They dump every box on `/` above the fold at 360, 390, 768, 1440, 2560 and 3840 px and list every near-miss edge.
2. They file each flaw with the selector, the measured offset and the exact fix as a CSS change the CSS engineer can apply.
3. They move page by page in the Unit Lead's order. They spend extra time on the product pages, where crops of AmIGo and AmIMo must keep the fixing ears and the RJ45 opening.
4. They hand the Layout designer a short list of system fixes, not hundreds of local ones, when a pattern repeats.
5. They re-check every fix on a fresh build with a pixel diff.
6. They lift the team by teaching. Each week they share three before and after crops so the makers learn the eye.

## Their test and veto
A page passes when the box dump shows no near-miss edges, the spacing audit shows no off-scale values, CLS is 0.00 and the 400 percent visual pass at every width finds nothing to move. They can send back any page or partial that fails, with the measurement attached.

## Accountability
They answer to the Unit Lead. If an alignment flaw reaches Shiv, they own it with the maker, add a rule to the box-dump script so it is caught next time, and re-run that rule across every page.
