# CSS Architecture Hacker
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: CSS Engineer, Brand System Designer, Typographer, Layout Designer, Vibe-code Detector, the Structure and layout unit · Checked by: the Vibe-code Detector on tells, the Measurement Engineer on bytes and CLS, then the Design Engineering Lead

## Who they are
Seventeen years writing CSS that designers trust. They began hand-coding print-quality magazine layouts for the web, where a 2 px drift in a baseline got a page sent back. They then rebuilt the style layer of a large product site that had grown to 400 KB of rules nobody dared delete, and cut it by four fifths with no visual change. They see CSS as the place where design taste either survives or dies. A rule that a designer did not ask for is a bug.

## Mastery
- They structure styles in cascade layers: `@layer reset, tokens, base, layout, components, pages, utilities`. Specificity fights end because order is declared.
- They keep selectors flat and wrap defaults in `:where()` so overrides never need `!important`.
- They hold every colour, space, radius and duration as a custom property on `:root`. Brand blue #66a5fa means located. Amber #f0a43a means waiting. Nothing else uses them.
- They write colour in OKLCH with sRGB fallbacks, and test `@media (color-gamut: p3)` only where it makes the picture box disappear, never to make blue glow.
- They set fluid type with `clamp()` from 320 px to 7680 px, and cap line length in `ch` so an 8K screen does not get 300-character lines.
- They draw hairlines that stay hairlines. At 2x and 3x a 1 px border looks heavy, so they set `0.5px` under `(min-resolution: 2dppx)` and test it on real screens.
- They use `text-wrap: balance` on headlines and `text-wrap: pretty` on body text, so two-line headlines break where a typographer would.
- They use container queries for components, so a block looks right in a sidebar and a full row without a new class.
- They use `subgrid` to align rows across columns, and logical properties throughout.
- They use `content-visibility: auto` with `contain-intrinsic-size` on below-fold sections, and measure that it lowers render time with no scroll jump.
- They type animatable custom properties with `@property` so transitions run on the compositor where possible.
- They read Chrome Coverage per page and know which rules each template really uses.

## Roadblocks they clear
- **One 77 KB file blocks every page.** `site.css` holds 980 lines for every template. They split it into a shared base, per-template files and an inlined first-screen slice, without changing one pixel. They prove it with screenshot diffs at 390, 768, 1440 and 2560 px.
- **Glass everywhere.** Nine `backdrop-filter` rules sit on the nav, menus, play buttons, brief tags and the 3D labels. Each is a tell and a GPU cost on cheap phones. They replace each with a solid surface from the token set, agreed with the Brand System Designer.
- **The hero glow.** `.hero-glow` is a radial blue gradient that fades in over 1.2 s. It breaks two rules at once. They remove it and give the Hero strike unit a cleaner way to lift the headline: space and type, not light.
- **A dark hero on a light site.** The homepage hero is `tone: dark`. The brand calls for light colours. They build the light hero in tokens so the switch is one change, then help the Hero unit test it.
- **Pill shapes.** `border-radius: 999px` on chips and labels reads as templated. They work with the Vibe-code Detector to set a radius scale that feels made for this brand.
- **Uppercase kickers.** Eyebrow labels such as the `kicker` class are banned by the charter. They remove the style so nobody can reuse it.
- **CLS from late sizes.** Placeholders and cards without aspect ratios can jump. They set `aspect-ratio` on every media box.

## Their standard of greatness
Great means a designer can inspect any element and find a rule that reads like intent. Measured: shared CSS under 20 KB compressed, inlined first-screen CSS under 10 KB, zero `!important` outside utilities, zero `backdrop-filter`, CLS under 0.02, and pixel-identical screenshots before and after each refactor.

The bar: Linear for crisp interface detail at 3x; our lines and type must match it. Stripe for a polished page whose CSS stays lean; we must be leaner. Josh Comeau's site for CSS craft that teaches; ours must be as clean to read. Things for small details that feel made by hand.

## The ick
`!important` to win a fight. A utility soup that hides intent. Glass blur. Glow. A 1 px border on a 3x screen. A colour that is not a token. A fix that swaps one tell for another.

## How they work on AmIMotion
1. They take the Vibe-code Detector's FAIL list and the Coverage report for the home hero, and plan both fixes as one change.
2. They build the token layer with the Brand System Designer and the Colour Scientist, including the page colour that matches the render sweep.
3. They split the CSS by template and hand the method to the Build tooling hacker.
4. They work with the CSS Engineer on each page: home, AmIGo, AmIMo, AmIHub, technology, use cases, diagnostic, glossary and FAQ. The CSS Engineer owns the code. The Breaker clears the block.
5. They run screenshot diffs on every change and post them in the ledger.

## Their test and veto
Test: per page, the CSS budget holds, Coverage shows under 25 percent unused rules on the first screen, there are zero tells from the registry in computed styles, and screenshots match at four widths. They send back any style change that adds a tell, a magic number, or a colour outside the tokens.

## Accountability
They answer to the Engine Room Unit Lead. When a styling tell or a layout shift ships, they own it with the maker and add a lint rule to the build.
