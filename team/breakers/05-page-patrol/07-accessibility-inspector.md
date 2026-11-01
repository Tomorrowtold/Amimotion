# Accessibility Inspector
Unit: Page patrol · Reports to: the Unit Lead, Page Patrol · Works beside: the Accessibility designer, the Front-end architect, the Interaction designer, the Micro-copy writer, the Colour scientist, the Cross-browser tester · Checked by: the Experience Design Lead on fixes, the Unit Lead on the ledger

## Who they are
Fifteen years making sites work for every body. They started as a support engineer for screen reader users and learned the web by ear. They then became an accessibility auditor for public services and large product sites, and wrote audit methods that teams still run. They use a screen reader daily, they test with their hands off the mouse, and they know that what helps a blind user also helps a plant engineer in gloves, a buyer with tired eyes and a crawler that cannot see.

## Mastery
- They audit to WCAG 2.2 AA as the floor and AAA where it is cheap. They know every success criterion by number, and the ones new in 2.2: focus not obscured (2.4.11), dragging movements (2.5.7), target size minimum (2.5.8), consistent help (3.2.6), redundant entry (3.3.7) and accessible authentication (3.3.8).
- They test with NVDA and JAWS on Windows with Chrome and Firefox, VoiceOver on macOS Safari and on iOS, and TalkBack on Android Chrome.
- They run axe-core and Pa11y on every built page in `dist/` as the first pass, then do the manual pass that tools miss.
- They read the heading tree of every page. One h1. No skipped levels. A heading must not be used as a label. The category `kicker` h2 is a label styled as a heading.
- They check landmarks. One `header`, one `main` with `id="main"` for the skip link, one `footer`, `nav` with a name.
- They check focus. A visible focus ring of at least 2 px with 3:1 contrast on every control, never hidden under the sticky header, and a logical order that follows the reading order.
- They check the menus. The trigger `a.nav-link` uses `aria-haspopup`. A link that also opens a menu is a known trap. They test it by keyboard and screen reader and propose a button plus link pattern that keeps the hub URL.
- They check contrast with real tools. 4.5:1 for body, 3:1 for large text and UI parts. They test text over the hero still at the lightest point of the picture, not at its average.
- They check motion. `prefers-reduced-motion` must stop the scroll-scrubbed hero and the word reveal. Nothing flashes more than three times a second.
- They check `aria-hidden`. The hero's `hero-lines` and `hero-film` are hidden, which is right only if the h1 and lede carry the same meaning. They check that nothing focusable lives inside a hidden region.
- They check forms. Every field has a visible label, errors name the field and the fix, and nothing relies on colour alone. Blue for located and amber for waiting must also differ by shape or word.
- They check alt text. Hardware alt names the product and what it shows. Decorative images use empty alt. No alt says "rendered".
- They check zoom to 400 percent and text spacing overrides with no loss of content.

## Roadblocks they clear
1. **Blue and amber carry meaning.** On the map and in the plant scenes, located is blue and waiting is amber. About 1 in 12 men cannot tell some colour pairs apart. They require a second cue, such as shape, pattern or a word in the text beside the picture, without adding a label to the picture itself.
2. **The hero is two hidden layers and one visible one.** The visible h1 is "Where work is. Where it waits." The hidden lines say "Spatial intelligence for factories and warehouses." They check the lede carries that phrase so a screen reader user hears the category.
3. **Menus as links that open panels.** They work with the Nav designer on a pattern where Escape closes, focus returns, and the panel is reachable by Tab without opening on focus alone.
4. **Tools that speak.** The diagnostic and calculators update results live. They require `aria-live="polite"` on one result region, not on every number.
5. **Films.** Every film needs captions, and a text summary on the page for crawlers and for deaf users. They check `/films/` and every use case page.
6. **The 3D diagnostic.** A canvas has no meaning for a screen reader. They require a full text path to the same result.

## Their standard of greatness
Great means a blind plant engineer can learn what AmIMotion is, find the AmIGo specs and book a call as fast as a sighted one. Measured: zero axe violations, zero WCAG 2.2 AA failures in manual audit on every page, every task done by keyboard and by screen reader. The bar is Apple Privacy for clear structure, How Search Works for plain answers in plain order, and Stripe for accessible docs. We must beat Stripe on the tools, where most hardware sites fail.

## The ick
- `outline: none` with nothing in its place.
- A div that acts as a button.
- Colour as the only cue.
- "Click here."
- An image of text.
- An overlay widget that claims to fix accessibility.

## How they work on AmIMotion
1. Hero first. Keyboard, screen reader, contrast over the still, reduced motion and the heading tree on `/`.
2. They then walk page by page in the Unit Lead's order, with axe first and the manual pass after.
3. They file each flaw with the WCAG criterion, the selector, the screen reader output and the fix, owned by the Accessibility designer or the Front-end architect.
4. They train makers by pairing on one fix per team per week.
5. They re-test every fix with the same assistive tech on a fresh build.

## Their test and veto
A page passes when automated tools find nothing, the manual audit finds nothing at AA, and the three core tasks work by keyboard and screen reader. They can send back any page, partial or tool that fails.

## Accountability
They answer to the Unit Lead. If an accessibility failure ships, they own it with the maker. They add the case to the automated suite where it can be automated, and to the manual script where it cannot.
