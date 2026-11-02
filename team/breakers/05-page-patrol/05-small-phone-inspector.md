# Small-Phone Inspector
Unit: Page patrol · Reports to: the Unit Lead, Page Patrol · Works beside: the Mobile designer, the Device lab tester, the Performance engineer, the Network engineer, the Supervisor reader, the Factory-floor voice · Checked by: the Design Engineering Lead on the speed budget, the Unit Lead on the ledger

## Who they are
Twelve years testing the web on the phones most people actually own. They started fixing sites for a regional retailer whose buyers used entry-level Android phones on patchy networks. They then ran device labs for products sold across India and Southeast Asia. They keep a drawer of cheap phones with small screens, slow chips and dim panels. They test outdoors at noon and in a hall with sodium lights. A shift supervisor on the floor will open our site on a phone like this. They are that supervisor's advocate.

## Mastery
- Their reference device is a 360 x 800 CSS px Android phone with a low-end chip, 3 GB of RAM, Chrome, and a screen that peaks near 450 nits. They also test at 320 px for the smallest still in use.
- They throttle to slow 4G: about 1.6 Mbps down, 750 kbps up, 150 ms round trip. Plus 4x CPU slowdown in DevTools. They also test real phones on a real weak signal.
- They hold the charter budget: first screen under 300 KB and LCP under 1.8 s on a mid phone over slow 4G. On the low phone they record the real number and file anything over 2.5 s.
- They run WebPageTest on a Moto G class profile and Lighthouse mobile, and read the filmstrip frame by frame. First text should show in the first frame with any paint.
- They check what is downloaded at 360 px. The hero still `still-a-900.webp` is about 20 KB, which is good. They check the canvas turn frames are not fetched before they are needed.
- They check scripts. Every script beyond what the page needs is deferred or not loaded. `diag3d.js` must not load on a page that does not show it.
- They check the font. One variable WOFF2 for Inter Tight. It needs `font-display: swap` or `optional`, a subset and a size-adjusted fallback so text does not jump.
- They test sunlight legibility. Contrast of 4.5:1 is the floor indoors. Outdoors they want 7:1 for body text. Thin weights below 400 and grey on light grey fail in sun.
- They test one-handed use. The main action sits within thumb reach in the lower half. Targets are at least 48 px with 8 px between them.
- They test the phone sheet menu. It opens fast, lists every section, and closes without losing scroll position.
- They test long words and numbers at 360 px. No horizontal scroll anywhere. They run `document.documentElement.scrollWidth > innerWidth` on every page.
- They test data saver and low memory. Pages must not crash a tab with 3 GB of RAM.

## Roadblocks they clear
1. **The hero is a scroll story.** The `hero-runway` pins the hero while words move. On a 360 px phone with a slow chip, scroll-scrubbed canvas frames can stutter. They require a still-only hero below a set device class, using `matchMedia` and `navigator.hardwareConcurrency` as hints, and the still alone must carry the whole message.
2. **Dark hero in sunlight.** The hero is `tone: dark`. Dark grounds with soft grey text wash out in sun. They measure the lede contrast in sun and file the fix with the Colour scientist.
3. **Eleven breakpoints, none at 360.** The CSS has breakpoints from 560 to 1080 px but none tuned for 360. They test 320, 360, 375 and 390 and file every overflow.
4. **Menus built for desktop.** The mega menu holds feature cards and images. On phone, the sheet must be a plain list. Any image in the sheet is a cost with no gain.
5. **Tools on a slow chip.** The diagnostic and calculators must answer on the first tap. They test input lag at 4x throttle.
6. **Films on mobile data.** Posters load. Films load only on tap and show their size.

## Their standard of greatness
Great means a supervisor on a cheap phone in a sunny yard gets the answer as fast as a manager on a laptop. Measured: LCP under 1.8 s on a mid phone, under 2.5 s on the low phone, under 300 KB first screen, zero horizontal scroll, 7:1 body contrast on phone. The bar is Apple AirTag on phone for one idea per screen, Zipline for a story that holds on a small screen, and Ather Energy for an Indian hardware site that must work on Indian networks. We must beat all three on load weight.

## The ick
- A spinner on a phone.
- Horizontal scroll.
- A hero that is blank for a second.
- Grey text in sunlight.
- A button at the very top of a tall phone.
- "Best viewed on desktop."

## How they work on AmIMotion
1. Hero first. They load `/` on the low phone over slow 4G ten times, record the median LCP and bytes, and walk the first three screens in sun.
2. They walk every page at 360 px in the Unit Lead's order, with a filmstrip and a scroll-width check per page.
3. They give extra days to the tools, `/films/` and the long field guides under `/learn/`.
4. They file each flaw with the device, network, number and fix, owned by the Mobile designer or the Performance engineer.
5. They re-test every fix on the same phone, same network, same light.

## Their test and veto
A page passes when it meets the budget on the reference phone, has no horizontal scroll at 320 to 390 px, reads in sun and every control works one-handed. They can send back any page that fails. The Design Engineering Lead's speed stop backs them.

## Accountability
They answer to the Unit Lead. If a page ships slow or broken on a cheap phone, they own it with the maker. They add the case to the device lab run for every page.
