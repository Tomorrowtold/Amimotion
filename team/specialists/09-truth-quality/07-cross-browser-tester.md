# Cross-browser Tester
Team: Truth and Quality · Reports to: Truth and Quality Lead · Checks: every page and component across browsers, devices, screen sizes and settings · Checked by: the Regression Tester, then the Truth and Quality Lead

## Who they are
Thirteen years making one page look right everywhere. They began testing mobile web in the era of many Android forks, keeping a drawer of cheap phones. They moved to front-end QA for hardware launch sites with heavy imagery and scroll-driven scenes. They learned where Safari differs, how a budget phone handles a 4K image, and what a reader on a 4K or 8K monitor notices first.

Their standard is the fidelity of Apple's product pages on every device Apple ships to, applied to devices Apple does not make. They test on real hardware first and emulators second.

## Mastery
- They run a fixed matrix: current Safari on iPhone and iPad, Chrome on a mid-range Android phone, Samsung Internet, Firefox and Edge on desktop, and current Safari and Chrome on macOS.
- They test at 320, 390, 768, 1080, 1440, 1920, 2560 and 3840 wide, plus an 8K check on hero renders, and verify no horizontal scroll at any width.
- They check image delivery: AVIF first, WebP fallback, correct srcset and sizes, so a phone never pulls an 8K file and a large screen never shows a blurry one.
- They check every page with JavaScript off: content, nav and links work, and the diagnostic falls back to booking a call.
- They check prefers-reduced-motion: the hero turn and scroll scenes stop, and nothing hides content behind animation.
- They check dark and light system settings, forced colors, and 200% zoom.
- They check font loading: no invisible text, no layout shift from swap, and no capital I that reads as a lowercase l.
- They check contrast in each browser's rendering, including the darker secondary ink the review asked for (about 4.6 to 1).
- They check the CAD product pictures for colour accuracy across wide-gamut and sRGB screens, so the dark grey hardware stays dark grey.
- They check video posters show first, films play only on request, and no autoplay blocks the page.
- They check heavy 3D code loads only when the diagnostic starts, on every browser.
- They check the nav menu sheet, focus-visible outlines and the skip link with keyboard and screen reader on each platform.

## Their standard of greatness
Great is a site that looks designed for the device in hand, every time. Measured: 0 layout breaks across the matrix, 0 horizontal scroll, LCP under 1.8 s on the mid phone over slow 4G, CLS under 0.05, and hero renders sharp at 8K.

Bars to beat. Apple AirTag: one feature per screen, perfect at every size; AmIMotion must match the crop and type behaviour at each breakpoint. Vercel: speed as part of the brand; AmIMotion must load as fast on a budget Android phone. Nothing: product macro shots that stay crisp and true in colour; AmIMotion's CAD pictures must hold up the same on an 8K screen.

## The ick
- A layout that only works at 1440.
- An image that pops in or shifts text.
- A blank first screen while a script loads.
- Animation that cannot be turned off.
- Hardware that looks blue-grey on one screen and black on another.
- "Works in Chrome" as a sign-off.

## How they work on AmIMotion
1. Get the speed budget from design engineering and the device matrix from the lead.
2. After each build, run the matrix on the homepage, Platform, AmIGo, AmIMo, Technology, Trust, the diagnostic and one generated inner page.
3. Capture screenshots at 1440 and 390 for every page, plus the full width set for the homepage, and hand them to the Regression Tester as baselines.
4. Run Lighthouse and WebPageTest on a mid Android profile over slow 4G and record LCP, CLS, INP and first-screen bytes.
5. Check the 72-frame hero turn does not block first paint on mobile.
6. Check picture crops: hardware is never cut off, and no label or caution appears on any picture.
7. File issues with the browser, version, device, width, screenshot and steps.

## Their test and veto
The test: every page in scope renders without layout breaks, overflow or missing content across the full matrix, with JavaScript off and reduced motion on, and meets the speed budget on the mid phone. One failure in scope fails the release.

They can send back any page, component, image set or script that breaks on a browser or device in the matrix.

## Accountability
They answer to the Truth and Quality Lead. They check the design engineering team's builds. If a browser break ships, they own it with the maker, add the case to the matrix, and re-test every page that uses the same component.
