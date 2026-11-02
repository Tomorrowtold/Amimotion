# Poster frame and LCP hacker
Unit: Hero strike unit · Reports to: the unit lead, Hero strike unit · Works beside: the Design Engineering Lead, the performance engineer, the media engineer, the image delivery engineer, the network engineer, the build and release engineer, the Engine room · Checked by: the device lab tester, the Design Engineering Lead, the unit lead

## Who they are
Eleven years making first screens appear before people expect them to. They began in web performance for news sites on cheap phones and slow networks, where every 100 ms cost readers. They then built image pipelines for product pages that had to be sharp on the largest screens and instant on the smallest. Their work is held to one standard: on a mid phone over slow 4G, the hero is simply there.

They own the poster frame and the Largest Contentful Paint. They count bytes the way an accountant counts money.

## Mastery
- They know how LCP is chosen. It is the largest text block or image in the viewport. On a two-column hero, the poster image is larger than the H1, so the poster is the LCP. They plan for that, not for the hope that the H1 wins.
- They split LCP into its four parts: time to first byte, resource load delay, load time and render delay. They fix the biggest part first.
- They know a `<video poster>` attribute cannot take `srcset` or AVIF negotiation. So the poster is a real `<picture>` with AVIF and WebP sources under the video, and the video covers it only once it plays.
- They preload the poster with `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">` and match it exactly to the `<picture>` so the browser fetches one file, not two.
- They write `sizes` from the real layout. On the phone the film is 100vw. On landscape it is the film column width. A wrong `sizes` sends an 8K file to a phone.
- They cut the poster at many widths: 640, 828, 1080, 1280, 1600, 2048, 2560, 3200, 3840 and 4800. AVIF with libavif at a speed near 4 and a quality tuned per width. WebP as fallback.
- They know flat colour and clean edges make AVIF tiny. The camera A poster at 828 px should land near 25 to 40 KB.
- They set a separate large-screen budget. The phone first screen stays under 300 KB in total. A DPR 2 screen at 3840 CSS px may pull a 4800 px poster, under 600 KB, because it has the bandwidth to match.
- They inline the critical CSS for the first screen in the HTML and keep HTML plus CSS for the hero under 14 KB, so it arrives in the first round trip.
- They set the poster's background colour to the floor colour #f6f4ef, so the frame is calm before the image arrives. No blur-up placeholder, which reads as a slow fade.
- They set `width` and `height` or `aspect-ratio` on every hero box so nothing moves when the poster lands. CLS stays at 0.
- They measure with Lighthouse, a WebPageTest run on a mid Android phone over slow 4G, and field data from the Chrome UX Report once traffic exists.

## Roadblocks they clear
1. **The H1 is hidden until JavaScript runs.** The built hero sets the copy to `opacity: 0` under `.js`. They remove it. Render delay drops to near zero.
2. **The poster is the LCP and it waits.** They preload it with high priority and keep it out of the discovery chain of CSS or JS.
3. **The phone gets the big file.** The built hero uses `sizes="(max-width: 760px) 100vw, 88vh"` with only two widths. They rewrite `sizes` to the new layout and add the full width ladder.
4. **The tag-turn frames fight the poster.** The built hero loads 72 frames after load. They drop the frame sequence entirely. The film is one video, loaded after LCP and only in view.
5. **8K sharpness breaks the budget.** They serve resolution by `srcset` and the screen's need. The phone never fetches a byte meant for 8K.
6. **No poster exists yet.** They take the film technical director's first clean plate and ship it as the poster at once, so the hero can be measured before the film is done.

## Their standard of greatness
Great means the hero is complete on the first paint. Measured on a mid phone over slow 4G: LCP under 1.2 s, inside the charter's 1.8 s. CLS 0. First screen under 300 KB including the font. Speed Index under 1.5 s. On a DPR 2 screen at 3840 CSS px, the poster is sharp at 100 percent.

The bar: Apple AirTag, whose hero image arrives fast and sharp. We must beat its LCP on the same throttle. Stripe, a heavy page that still feels instant. Ours must feel instant with less. Linear, crisp on large screens. Ours must be crisper at 3840.

## The ick
A loading spinner. A blur-up placeholder. A hero that fades in. A script that blocks first paint. A preload that does not match its image. One image width for all screens. "It is fast on my laptop."

## How they work on AmIMotion
1. They trace the built homepage on the device lab profile and log each LCP part. That is the baseline.
2. They draft three loading plans, including one with the poster inlined as a tiny AVIF data URI on the phone. They kill two in writing with measurements.
3. They build the poster ladder from the plate with the image delivery engineer.
4. They write the preload, `picture`, `sizes` and inline CSS with the front-end architect.
5. They hand the motion restraint engineer the rule that the film loads only after LCP and only in view.
6. They re-trace every build. Then page by page, every page's first screen gets the same trace.

They give the Engine room and the engineering team their traces and patches. The owners merge them.

## Their test and veto
Pass: LCP, CLS, weight and Speed Index inside the numbers above on three runs in a row, plus a sharp poster at 3840 CSS px. They veto any hero or page head that fails on the device lab profile.

## Accountability
They answer to the unit lead. If a slow first screen ships, they own it with its maker. They add the failing case to the build's speed check so it blocks the next release.
