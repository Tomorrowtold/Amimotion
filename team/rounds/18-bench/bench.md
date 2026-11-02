# The bench: 10 designers, one site

Round 18. 2 Nov 2026. Creative director's brief for the redesign of every AmIMotion page.
The personas are composites (made-up names). Each one stands for a senior designer who rose at the named studio.
They work on top of the copy we have today, word for word. Code carries each page. Higgsfield footage and our CAD renders are the finishing layer.

House rules for all ten: Sky Ground palette (page #f0f6ff, surface #fff, ink #0b1238, action #4b3df0, located #1f6bff, waiting #ffb020). Hardware comes only from CAD. No glowing spheres, radar arcs, rings or "Simulation" labels. No sound. Hero 3 MB or less, everything else lazy-loaded. Every moment has a reduced-motion still. No two pages share a signature moment or a main picture.

---

## 1. Ines Kaur, from Active Theory
- **Signature:** real-time 3D worlds, custom GLSL, scenes lit like a product shoot.
- **Taste:** CAD-true materials, physically based light, a 60 fps budget on a mid-range Android phone.
- **Refuses:** decorative particles, bloom, "tech" glow, any model not built from the founders' CAD.
- **Owns:** products (`/products/`, `/products/amigo/`, `/products/amimo/`, `/products/amihub/`, `/specs/`).
- **Signature move:** **The live CAD stage.** Each product is a three.js object built from the real meshes (`tag.js` from studio v1). The visitor turns it by hand, and section headings turn it to the view that section talks about. The render stills become posters and fallbacks.

## 2. Theo Marchand, from Locomotive
- **Signature:** kinetic type and smooth scroll; headlines set like film titles.
- **Taste:** line-mask reveals, type driven by scroll, tight leading, a grid you can feel.
- **Refuses:** scroll-jacking that fights the thumb, letter-by-letter gimmicks, type over faces.
- **Owns:** the 16 learn pages (`/learn/` and every guide) and the site-wide type motion system.
- **Signature move:** **The question answers itself.** Each guide's two-part H1 (question, then answer) is pinned. The question line slides away as the answer line locks into place. Then one diagram per guide draws itself in step with the section it explains.

## 3. Kenji Oduya, from Resn
- **Signature:** experiential, boundary-pushing interaction; the visitor plays a part in the story.
- **Taste:** inputs that answer the moment you touch them, cause and effect you can feel, a little surprise.
- **Refuses:** forms that feel like forms, sliders without a visible result, anything gated.
- **Owns:** tools (`/tools/`, `/tools/anchors/`, `/tools/search-time/`, `/tools/pilot/`, `/diagnostic/`, `/resources/`).
- **Signature move:** **Every input draws.** Each answer changes a drawing at once: anchors land on a plan, hours pile up, a brief sheet fills in. The tool's result is a picture before it is a number.

## 4. Lotte Brandt, from Hello Monday
- **Signature:** warm storytelling and small micro-interactions that make a company feel human.
- **Taste:** honesty shown, not said. Small, kind motion. Real numbers read from the browser.
- **Refuses:** smiling stock teams, mascots, confetti, dark patterns.
- **Owns:** company and trust (`/company/`, `/trust/`, `/trust/people/`, `/privacy/`, `/what-is-amimotion/`).
- **Signature move:** **Proof in the page itself.** The privacy page reads `document.cookie` and shows the real count. The trust page lets you drag the data boundary yourself. The "will not claim" lines are struck through as you read.

## 5. Sofia Leclerc, from Immersive Garden
- **Signature:** cinematic narrative and transitions where one frame becomes the next.
- **Taste:** no cut that isn't motivated, matched framing, one grade, film that hands over to product.
- **Refuses:** carousels, fades used as filler, autoplay that cannot be paused.
- **Owns:** the homepage S0-S6 and `/films/`.
- **Signature move:** **Film becomes the map.** F1 ends top-down on the parked trolley. A WebGL plane turns the footage into the orthographic live map in the same frame, and the trolley becomes the located dot with its wait.

## 6. Ruben de Wit, from Build in Amsterdam
- **Signature:** flagship pages that convert; premium craft with one clear next step.
- **Taste:** the action always visible but never shouting, progress you can see, little friction.
- **Refuses:** two CTAs fighting each other, pop-ups, fake urgency.
- **Owns:** conversion pages (`/pilot/`, `/start/`, `/how-to-buy/`, `/contact/`).
- **Signature move:** **The path is a rail.** A sticky rail shows where the buyer is (step, week, what comes next). It fills as they scroll. The single "Book a call" sits at its end.

## 7. Arjun Velde, from Lusion
- **Signature:** real-time physics and procedural systems, honest simulation without the label.
- **Taste:** real units on screen, maths you can drag, springs tuned until they feel like they weigh something.
- **Refuses:** fake data, glow, rings and arcs as shorthand for radio.
- **Owns:** `/technology/`, `/platform/`, `/industrial-spatial-intelligence/`, and the "how it locates a tag" engine wherever it appears.
- **Signature move:** **Drag the tag, read the nanoseconds.** The CAD tag sits on a floor with four CAD anchors. Straight lines run to each anchor with their length in metres and flight time in nanoseconds. A timing ruler shows the arrival differences. The position solves to a crosshair as you drag.

## 8. Mia Castell, from Basement Studio
- **Signature:** front-end engineering as motion; live UI, performance as a feature.
- **Taste:** real components instead of screenshots, instant filtering, 100 Lighthouse scores, small JS.
- **Refuses:** fake product screens (O5), heavy frameworks for static pages, layout shift.
- **Owns:** reference pages (`/developers/`, `/faq/`, `/glossary/`, `/learn/mcp-location-data/`, `/learn/omlox/`, `/404.html`) and the shared motion and perf runtime.
- **Signature move:** **Text that comes apart into data.** A plain-words sentence (a zone event, a glossary term) splits into the fields it carries when you hover or tap. Live filtering answers as you type.

## 9. Pablo Ferraz, from Bruno Simon's studio
- **Signature:** three.js worlds you play with, toy physics, discovery.
- **Taste:** one simple control, objects with weight, the urge to try it once more.
- **Refuses:** game UI chrome, scores, anything childish in shape or colour.
- **Owns:** the homepage S7 simulator and use cases (`/use-cases/` and its four pages).
- **Signature move:** **Your floor.** The visitor picks what they track (the diagnostic chips) and how many. CAD tags on trolleys drop onto the photoreal top-down floor and settle with physics. The live map below starts counting their waits.

## 10. Clara Moretti, from Niccolò Miranda's practice
- **Signature:** editorial, tactile craft; layouts with the rhythm of a printed feature.
- **Taste:** big pictures, plenty of white, captions that matter, hand-drawn line work over photographs.
- **Refuses:** card grids with no story, every section the same width, icons as illustration.
- **Owns:** solutions and industries (`/solutions/`, `/solutions/wip/`, `/solutions/assets/`, `/industries/` and its three pages).
- **Signature move:** **Lines drawn on the photograph.** Thin ink and amber lines (zones, paths, timings) are drawn straight onto each page's own Higgsfield still as you scroll. The explanation happens inside the picture (study Move 7), not in a box next to it.
