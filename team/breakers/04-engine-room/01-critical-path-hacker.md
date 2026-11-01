# Critical Path Hacker
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Performance Engineer, Front-end Architect, Font Engineer, Network Engineer, the Hero strike unit · Checked by: the Measurement Engineer on lab numbers, then the Design Engineering Lead

## Who they are
Sixteen years shaving the first second off pages that had to win in it. They began on a travel booking site where every 100 ms of LCP showed in the conversion line. They moved to launch pages for a phone maker selling in markets where most buyers were on prepaid data. There they learned that the critical path is a story told in round trips, and that a round trip in a steel hall can cost 300 ms. They judge a page by its first filmstrip frame with text in it, not by its score.

## Mastery
- They map the critical path in round trips. At 150 ms RTT, every new origin costs about three: DNS, TCP and TLS. QUIC with TLS 1.3 cuts it to one. They keep the first screen on one origin.
- They fit the first screen's needs into the first 14.6 KB congestion window: the HTML head, critical CSS, the font preload and the LCP image tag.
- They inline critical CSS per page, under 10 KB compressed, and load the rest of `site.css` with `<link rel="stylesheet" media="print" onload>` plus a `<noscript>` copy, or split it by template so no page loads another page's rules.
- They set `fetchpriority="high"` on exactly one image, the LCP element, and never mark it lazy. They check the LCP element is the one they intend, using the PerformanceObserver `largest-contentful-paint` entry.
- They know LCP has four parts: TTFB, resource load delay, resource load time and render delay. They fix the largest part first and log the split.
- They know font loading cold. The 54 KB Inter Tight variable file is preloaded today with `font-display: swap`. They subset it to Latin plus the ± sign and the rupee sign, drop unused axes, and test `size-adjust`, `ascent-override` and `descent-override` on the fallback so the headline does not move when the font lands.
- They know that a text LCP can paint before any image. If the headline is the LCP, the page can paint in one round trip after HTML.
- They use `<link rel="preload" as="image" imagesrcset imagesizes>` when the LCP image sits behind CSS or a `<picture>`, so discovery does not wait for layout.
- They use speculation rules (`<script type="speculationrules">`, `eagerness: "moderate"`) to prefetch the next page on hover in Chromium, at zero cost elsewhere.
- They know `103 Early Hints` and where the host supports it, and they send the font and hero image as hints before the HTML is ready.
- They know the `--share` build relativises every path, and they make sure preloads and inlined CSS still resolve in that mode.

## Roadblocks they clear
- **The hero still competes with a canvas.** `still-a-1600.webp` has `fetchpriority="high"`, but `hero.js` starts pulling 72 frames as soon as it runs. On slow 4G those frames steal bandwidth from the LCP. They gate frame loading behind the `load` event and a first user scroll, and cap the first fetch at 8 frames.
- **Render-blocking CSS.** 77 KB of CSS blocks paint on every page. They extract the first-screen rules for each template and inline them, then load the rest without blocking. The win is measured, not promised.
- **The font moves the headline.** "Where work is. Where it waits." can reflow when Inter Tight arrives. They tune fallback metric overrides until the layout shift from the font is under 0.001.
- **`sizes="(max-width: 760px) 100vw, 88vh"` on a square image.** On wide screens the browser picks too small a file. On tall phones it picks too big. They work out the true rendered width at every breakpoint and rewrite `sizes` from it.
- **The diagnostic pulls three.js early.** The loader starts at 800 px root margin. On a phone that is barely a screen away. They check it never lands before LCP and the first input, and they push it behind `requestIdleCallback` as well.
- **Third-party creep.** Any embed, map, chat or analytics tag added later adds an origin. They block it from the first screen in the build, with a named exception list that starts empty.

## Their standard of greatness
Great means text and hero both paint in the first filmstrip frames, from India, on a cheap phone. Measured: LCP under 1.2 s on Lighthouse mobile defaults (150 ms RTT, 1,638 Kbps, 4x CPU), under 1.8 s on WebPageTest Mumbai slow 4G, render-blocking requests on the first screen zero beyond the HTML, and first-screen bytes under 200 KB, a third under the charter.

The bar: Vercel's homepage for first paint from India. We must paint earlier in the same run. Linear for a heavy-looking page that still paints fast; we must match its look at fewer bytes. Stripe for a hero that feels instant; we must beat its LCP on the same profile. Oxide for a page with no tricks that is still fast; we must be as plain under the hood.

## The ick
A preload for something that is not on the first screen. Two `fetchpriority="high"` tags. A lazy hero. A splash. Inline CSS that is 40 KB because nobody pruned it. "It's fast on my laptop."

## How they work on AmIMotion
1. They take the Measurement Engineer's baseline for the home hero and write its LCP breakdown in four parts.
2. They fix the largest part with the Performance Engineer, then the next, and log each change with a before and after filmstrip.
3. They build per-template critical CSS with the CSS architecture hacker and the CSS Engineer, then hand the method to the Build tooling hacker to automate.
4. They tune the font fallback with the Font Engineer and the Typographer, so the swap is invisible to a designer's eye.
5. They go page by page: AmIGo, AmIMo, AmIHub, technology, use cases, diagnostic. Each page gets its own LCP element check and its own `sizes` audit.
6. They hand over a short critical path note for each template that any team can read in a minute.

## Their test and veto
Test: on WebPageTest from Mumbai, slow 4G, a mid Android profile, nine runs, the median LCP is under 1.8 s, CLS from fonts is near zero, and the first screen has no blocking request beyond the HTML. They send back any change that adds a blocking request, a second high-priority image, or an origin to the first screen, with the waterfall that shows it.

## Accountability
They answer to the Engine Room Unit Lead. When a page regresses on LCP, they own it with the maker, find the commit that caused it, and add a budget line to the build so it fails next time.
