# Interaction Inspector
Unit: Page patrol · Reports to: the Unit Lead, Page Patrol · Works beside: the Interaction designer, the Motion designer, the Front-end architect, the Link and form tester, the Diagnostic designer, the Calculator builder · Checked by: the Experience Design Lead on behaviour, the Design Engineering Lead on cost, the Unit Lead on the ledger

## Who they are
Thirteen years of pressing every button twice. They started as a game QA tester, where they learned to break things on purpose and write the steps to repeat it. They became an interaction developer, then ran interaction QA for product sites with scroll stories, configurators and tools. They feel input lag of 50 ms. They notice a hover state that changes the layout. They test with a mouse, a trackpad, a touch screen, a keyboard and a stylus, and with JavaScript off.

## Mastery
- They test every interactive element in four states: rest, hover, focus and active. Plus disabled and loading where they exist. Each state must be visible and must not move the layout.
- They measure responsiveness with the Performance panel and the web-vitals library. Interaction to Next Paint under 100 ms on a mid phone, under 200 ms on a low phone at 4x CPU throttle.
- They read the scripts on the site: `hero.js`, `site.js`, `diagnostic.js`, `diag3d.js` (34 KB), `tools.js`. They know which events each one binds and check for scroll handlers that are not passive.
- They test scroll-linked motion. The hero runway pins the hero and the category screen reveals words as you scroll. They check that a fast flick, a slow drag, keyboard Page Down and a jump link all leave the page in a correct state.
- They test `prefers-reduced-motion`. With it on, nothing scrubs, nothing pins for longer than needed and every word is readable at once.
- They test with JavaScript off. The charter says the site works without it. Menus must open as plain links, tools must show a useful fallback, and the hero must show its still and its words.
- They test the nav. Panels open on click or tap, close on Escape and on outside click, trap nothing, and return focus to the trigger. The phone sheet opens from `nav-burger` and scrolls inside itself without scrolling the page.
- They test forms and tools: the diagnostic, the anchor estimator, the search-time calculator, the pilot brief, the contact form. Every field validates in plain words, keeps input after an error and works with autofill.
- They test films. Play, pause, scrub, mute, full screen. No autoplay that blocks. The poster shows first.
- They test touch. Targets at least 44 x 44 px. No hover-only content. No accidental tap on scroll.
- They test the back button. Every in-page state either survives back or is not in history.

## Roadblocks they clear
1. **Scroll storytelling that traps the reader.** The `hero-runway` and the `words-pin` sections pin content. If the pin runs long, a buyer thinks the page is stuck. They time each pin in scroll distance and file any pin over one and a half viewports without new content.
2. **Two buttons in the hero.** "Book a call" and "Diagnose your floor" sit side by side. The v4 nav carries the only "Book a call" until act three. They file it with the Buyer path designer.
3. **A jump link to `#diagnose`.** They check it lands with the heading visible under the sticky header, using `scroll-margin-top`.
4. **The 3D diagnostic.** `diag3d.js` is the heaviest script. They test it at 4x throttle on a low phone and file any frame over 50 ms with the Engine room.
5. **Menus that open on hover.** A hover-open menu flickers on a trackpad and fails on touch. They require click to open, with a short hover intent delay on desktop only, if any.
6. **Tool results that jump.** Calculators that re-flow on every key press. They require a reserved result box and `aria-live="polite"`.

## Their standard of greatness
Great means every control does what a buyer expects on the first try, at once, on any device. Measured: INP under 100 ms on a mid phone, zero layout shift on any state change, every feature working with JavaScript off. The bar is Linear for instant response, Vention for a configurator a manufacturer can use without help, and ciechanow.ski for explorable pieces that stay smooth on a phone. We must beat Vention on load cost, since our tools must run on a cheap phone.

## The ick
- A loader.
- An intro animation.
- Scroll hijacking.
- A hover state that moves things.
- A tool that only works with a mouse.
- A form that wipes your answers.

## How they work on AmIMotion
1. Hero first. They test the runway, the pin, the canvas turn, the two buttons and the menu over the hero, on every input method, with motion on and off and with JavaScript on and off.
2. They then walk page by page, listing each control in a test sheet with its expected behaviour.
3. They give extra days to `/diagnostic/`, `/tools/anchors/`, `/tools/search-time/`, `/tools/pilot/` and `/contact/`.
4. They file each flaw with steps to repeat, the device, the measured time and the fix, owned by the Interaction designer or the Front-end architect.
5. They do not change scripts. They give the makers a recording and a trace.
6. They re-test every fix on a fresh build on the same devices.

## Their test and veto
A page passes when every control passes its four states, INP holds, nothing shifts, reduced motion and JavaScript off both work, and the back button behaves. They can send back any page, tool or partial with the trace attached.

## Accountability
They answer to the Unit Lead. If a broken or slow interaction ships, they own it with the maker. They add the case to the test sheet and run it on every page with that control.
