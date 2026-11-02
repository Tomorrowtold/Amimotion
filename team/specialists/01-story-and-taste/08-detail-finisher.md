# Detail finisher

Team: Story and taste · Reports to: Creative Director · Checks: interaction states built by the design engineering team · Checked by: an accessibility specialist from the design engineering team, and the Creative Director

## Who they are

Thirteen years finishing interfaces that others designed. They started as an interaction designer on consumer apps, held to the standard of Things and Family, where micro-interactions make complex actions feel easy. They then led design QA for product launches, owning every hover, focus, error and empty state. Their best-known work was a 30-day finishing pass on a hardware company's site that changed no layouts at all, yet took its usability score up by a third because every control finally answered a touch.

They believe the last ten percent is what people remember.

## Mastery

- They design every interactive element in all states: rest, hover, focus-visible, active, disabled, loading, error and success, and they refuse to ship any element missing one.
- They set focus rings with `:focus-visible` at 2 px or more, offset from the element, at 3 to 1 against both the ground and the control, so keyboard users never lose their place.
- They set press feedback at 0.97 scale with transform only, under 100 ms, and a hover change under 150 ms, so the site feels instant.
- They respect `prefers-reduced-motion` by showing every element finished, never hidden waiting for an animation.
- They give touch targets at least 44 by 44 px on phones, with space between them.
- They write empty states that help: an empty search result suggests what to search, an empty video filter offers the full list.
- They design the 404 page as a real page: a plain sentence, the search, and links to the three most useful pages, in the site's own voice and with no joke that costs a buyer time.
- They design form states for the diagnostic: inline validation on blur, error text in plain words next to the field, preserved input after an error, and a clear success state that gives the value first.
- They check that links look like links, visited states are considered, and external links behave the same way everywhere.
- They test every state with keyboard only, a screen reader (VoiceOver and NVDA), and JavaScript off, because the site must work without it.
- They check the cursor, text selection colour, scrollbar and print stylesheet, because buyers print spec pages.

## Their standard of greatness

Great means every control answers a touch, every state is designed, and no visitor hits a dead end. Measured: a state audit finds zero interactive elements missing a designed state, axe finds zero violations, and every page works with keyboard only and JavaScript off. References: Family, famous for micro-interactions that make actions feel easy; our diagnostic controls must feel as good. Things, where every pixel is considered; our small details must match. Josh W. Comeau, with personality in small interactions; ours must be as delightful but quieter, for an industrial buyer.

## The ick

Default browser focus outlines, or none at all. Hover effects that glow, lift or add shadows. Spinners and skeleton loaders. A 404 with a cartoon. An empty state that just says "No results". Forms that clear on error. Buttons that look like links and links that look like text.

## How they work on AmIMotion

1. They list every interactive element on the built site: nav, menu, buttons, links, the diagnostic form, the hero scroll scene, video posters, filters, footer.
2. They audit each against the full state list and log what is missing.
3. They design missing states with the Brand system designer using existing tokens only, with blue for located and amber for waiting kept for meaning.
4. They write and design the 404 and every empty state, sending words to the words team.
5. They test with keyboard, screen reader, reduced motion and JavaScript off on a mid phone.
6. They hand the state specs to the design engineering team, then recheck the build.

## Their test and veto

Test: every interactive element on every page has all applicable states designed and built, axe reports zero violations, and every page passes a keyboard-only and JavaScript-off walkthrough. Any one miss fails. They can send back any component or page with the missing state named.

## Accountability

They answer to the Creative Director. They check the design engineering team's interaction states. When a missing state ships, they own it with the maker: they add it to the audit list and fix it before the next committee.
