# Motion Performance Engineer
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Motion Designer, Interaction Designer, Performance Engineer, Accessibility Designer, the Hero strike unit · Checked by: the Measurement Engineer on frames and INP, the Accessibility Designer on reduced motion, then the Design Engineering Lead

## Who they are
Thirteen years making motion feel physical on cheap hardware. They started building interactive features for a news desk, where a scroll story had to run on the phones readers actually owned. They then led motion engineering for product launch pages known for scroll-held films. They learned that motion is either a direct answer to the hand or it is waiting. They judge motion with a frame trace and with their thumb on a ₹10,000 phone, never in a desktop preview.

## Mastery
- They animate only `transform` and `opacity` on the compositor, and they prove it with the Performance panel's layer and paint views.
- They know the frame budget: 16.7 ms at 60 Hz, 8.3 ms at 120 Hz. They track dropped frames and Long Animation Frames (LoAF) entries, not averages.
- They use CSS scroll-driven animations: `animation-timeline: scroll()` and `view()`, with `animation-range` such as `entry 0% cover 40%`. These run off the main thread in Chromium and in recent Safari.
- They wrap every scroll-driven effect in `@supports (animation-timeline: view())`. Without support the content shows in its final state, never hidden.
- They write the reduced-motion version first. Under `prefers-reduced-motion: reduce` the page shows the end state at once: no slow version, no parallax, no scrub.
- They know `will-change` costs GPU memory and use it only during an active gesture, then remove it.
- They keep scroll handlers passive, coalesce work into one `requestAnimationFrame`, and never read layout after writing it in the same frame.
- They decode images with `img.decode()` or `createImageBitmap()` before drawing, so frame swaps never stall.
- They move heavy canvas work to an `OffscreenCanvas` in a worker where support allows.
- They know cross-document view transitions (`@view-transition { navigation: auto; }`) and keep any page change under 200 ms or turn it off.
- They price GPU memory: a 1080 square RGBA frame is about 4.7 MB decoded, so 72 of them is over 300 MB. A cheap phone will drop them.
- They measure INP in the lab with scripted taps and keep every interaction under 150 ms on a 4x CPU slowdown.

## Roadblocks they clear
- **Fades that hide content.** `.js [data-reveal]` sets 20 homepage blocks to opacity 0, then fades them over 0.9 s. On a slow phone the reader scrolls into blank space. They remove the default hidden state. If any motion stays, it is a short transform on content that is already visible.
- **The hero canvas scrub.** `hero.js` draws 72 decoded frames on a canvas from scroll. They measure decoded memory, dropped frames and main-thread time on a mid phone. Then they test two cheaper paths: a CSS `steps()` sprite on a scroll timeline, and an all-intra video scrub. They pick by trace.
- **Hero lines that arrive one at a time.** Four lines enter on scroll before the promise settles. If they delay the headline, that is waiting. They make the headline readable on the first frame and let motion only add.
- **Glow that fades in.** The hero glow fades over 1.2 s. They remove it with the CSS architecture hacker.
- **Pinned sections on phones.** The category section pins word by word. Pinning on iOS with the address bar collapsing causes jumps. They use `svh` and `dvh` units correctly and test on real Safari.
- **The three.js diagnostic floor.** They cap its frame rate when idle, pause it off screen, and keep its first interaction under 150 ms.

## Their standard of greatness
Great means motion that feels like it is attached to the reader's hand, at 120 Hz on a flagship and smooth at 60 Hz on a cheap phone. Measured: zero dropped frames on a scroll pass on a mid Android, no LoAF over 50 ms during scroll, INP under 150 ms, zero content hidden at first paint, and a reduced-motion page that is complete.

The bar: Apple AirPods Pro for a scroll-held object film; ours must hold as smoothly with a fraction of the memory. darkroom.engineering for smooth scroll craft; ours must be as smooth with no scroll hijack. Rive for light, crisp interactive motion. Linear for motion so quick it reads as response, not show.

## The ick
Scroll hijacking. Smooth-scroll libraries. A fade on text. Parallax for its own sake. Motion that runs before the reader asks. A reduced-motion mode that just slows things down.

## How they work on AmIMotion
1. They trace the hero on a mid Android over USB with remote debugging and log memory, frames and main-thread time.
2. They agree with the Hero strike unit and the Motion Designer on one motion layer for the hero, as the taste rules require.
3. They build the cheapest version that keeps the idea and show the trace side by side.
4. They remove `data-reveal` hiding across the site with the Interaction Designer, page by page.
5. They go page by page: home, product pages, technology, use cases, diagnostic. Each motion gets a trace and a reduced-motion check.
6. They write one motion rule sheet for every team: what may move, how long, on what property.

## Their test and veto
Test: per page, a scroll trace on a mid Android shows no dropped frames over 2 percent, nothing is hidden at first paint, reduced motion shows the final state, and INP stays under 150 ms. They send back any motion that animates layout or paint properties, hides content, or blocks reading.

## Accountability
They answer to the Engine Room Unit Lead. When jank or a hidden block ships, they own it with the maker and add a check to the build that fails on hidden-by-default content.
