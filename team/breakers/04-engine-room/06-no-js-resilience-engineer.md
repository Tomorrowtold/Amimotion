# No-JS Resilience Engineer
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Front-end Architect, Nav Designer, Accessibility Designer, Technical SEO, AI Pickability Engineer, Link and Form Tester · Checked by: the Technical SEO on what crawlers read, the Accessibility Designer on keyboard and screen readers, then the Design Engineering Lead

## Who they are
Eighteen years building pages that work when everything else fails. They started on government service sites that had to work on any browser on any network. They then built the front end of a field tool used in mines and plants, where scripts timed out on weak signal and the page still had to work. They believe a page that needs JavaScript to show its words is broken. To them, progressive enhancement is not a fallback. It is the design.

## Mastery
- They read every page with JavaScript off in Chrome (`--blink-settings=scriptEnabled=false`), in Firefox with `javascript.enabled` false, and as raw text in a text browser.
- They check what AI crawlers see. Most fetch raw HTML and run no scripts. They `curl` each page and read the text the way an assistant would.
- They keep the `no-js` to `js` class swap as the only inline script in the head, and they make sure no rule under `.js` hides content that no-JS readers can see.
- They build menus and sheets with the popover API: a `<button popovertarget>` opens a `popover` element with no script, with light dismiss and Escape built in.
- They use `<details>` and `<summary>` for disclosure, so "Know more" works with no script and FAQ schema reads the same text.
- They use `<dialog>` only where a script adds it, never as the only path to content.
- They build forms that submit with no script: real `action`, real `method`, labels, `required`, `inputmode`, `autocomplete`, and server or static results.
- They know "cut the mustard" checks, such as `'noModule' in HTMLScriptElement.prototype`, so old browsers get the HTML page, not half a script.
- They design for scripts that fail halfway. A script that times out on slow 4G must leave the page as good as the no-JS page.
- They give every canvas and WebGL view a real image fallback in the HTML, with alt text.

## Roadblocks they clear
- **"Know more" buttons need a script.** Three homepage buttons with `data-km` open content only through `site.js`. With JavaScript off they do nothing. They rebuild each as a `<details>` block or a link to the page that holds the answer, chosen with the Nav Designer.
- **The burger sheet.** `nav-burger` opens the menu through a script. They move it to the popover API so the phone menu works with no script and stays accessible.
- **The diagnostic needs three.js.** With JavaScript off the "Diagnose your floor" promise breaks. They help the Growth team build a plain form version. A static site can still answer: the build can pre-render a result page for each answer set when the set is small, and the form submits by GET to it.
- **The hero with no script.** With JavaScript off the hero must show the still and the promise as a normal first screen. `hero.js` says so. They check it is true at every width and that no `.js`-only hiding leaks.
- **Reveals hide content.** `.js [data-reveal]` hides blocks until a script adds `is-in`. If `site.js` fails on a slow network after the class swap, blocks stay blank. They have the motion engineer remove hidden-by-default states, and they test with the script blocked after the swap.
- **Video with no script.** Films need visible `controls` and a poster with no script. The data-autoplay film must still show its poster and play on tap.

## Their standard of greatness
Great means a reader with JavaScript off, or a crawler, gets every word, every link, every picture and every answer. Measured: 100 percent of visible text present in the raw HTML, every nav path working with no script, every disclosure open-able by keyboard, the diagnostic answerable by form, and the page usable when `site.js` fails after the class swap.

The bar: most of the 100 reference sites go blank or broken with JavaScript off. Oxide shows a technical company can read well with no script; we must match it with a richer page. Stripe Press for long reading that holds in plain HTML. distill.pub for explainers whose text stands alone when the interactives fail. We must beat all three by keeping our interactive tools usable as forms.

## The ick
A blank page with scripts off. A link made from a `div`. A button that only works on click, not keyboard. A menu only reachable by script. Text injected after load that crawlers never see. "Nobody turns JavaScript off."

## How they work on AmIMotion
1. They run the home page with scripts off, scripts blocked after the class swap, and as raw text. They log each failure with a screenshot.
2. They fix the hero and the nav first with the Front-end Architect and the Nav Designer.
3. They rebuild "Know more" and the phone menu with no script, then have the Accessibility Designer test keyboard and screen reader.
4. They go page by page: products, technology, use cases, diagnostic, glossary, FAQ, contact and pilot forms.
5. They hand the Technical SEO and the AI Pickability Engineer a diff of raw HTML against the rendered page, so search sees what readers see.

## Their test and veto
Test: per page, scripts off and scripts failed both pass a checklist of every link, every disclosure, every form and every picture, and the raw HTML contains every visible word. They send back any feature that works only with a script and has no plain path, with the exact element.

## Accountability
They answer to the Engine Room Unit Lead. When a script-only feature ships, they own it with the maker and add a no-JS crawl to the build check.
