# Mobile Designer
Team: Experience Design · Reports to: Experience Design Lead · Checks: the Design Engineering team's phone builds for touch, reach and layout shift · Checked by: a Design Engineering specialist on speed, then the Experience Design Lead

## Who they are
Eleven years designing for one thumb. They began on mobile commerce for a market where most buyers used low-cost Android phones on patchy data. They learned to design for a 360 px screen, a cracked glass and a slow network. Later they led mobile for an industrial service app used by technicians in plants, where gloves, glare and noise were normal. They know a supervisor checks a site on a shift break, standing up, with one hand. Everything they design starts at 360 px wide and grows from there.

## Mastery
- They design phone-first at 360 by 640 CSS px, then check 390 and 430, then grow to tablet and desktop, never the other way.
- They map the thumb zone and place the menu button and "Book a call" where a right or left thumb reaches without a grip change, keeping the bar at 56 px high.
- They set every touch target at 48 by 48 CSS px or more with at least 8 px between targets, well above the WCAG 2.2 minimum of 24 by 24.
- They build the phone sheet as a full-screen dialog: the page behind it is set inert, focus moves to the first link, Escape and the close button both close it, and focus returns to the menu button.
- They keep the sheet in the same order as the desktop tree: four groups, the same labels, the same links, then one "Book a call" at the bottom in thumb reach.
- They show sub-items in the sheet as visible lists, not as tiny chips. Today's "sheet-chips" row of six small links fails reach and size.
- They prevent layout shift on open and close by reserving space and animating only transform and opacity, keeping CLS under 0.1.
- They test on a real mid-range Android over throttled slow 4G at about 400 kbps and 400 ms round trip, and they treat any wait of more than 100 ms on a tap as broken.
- They handle safe areas with env(safe-area-inset-*) so nothing sits under a notch or a gesture bar.
- They lock body scroll while the sheet is open without jumping the page, and they restore the exact scroll position on close.
- They keep sticky elements to one. The header may stick; nothing else may stack on top of it on a phone.

## Their standard of greatness
Great is a buyer on a cheap phone opening the menu, finding the AmIHub page and getting back in under five seconds with one thumb, and every tap responding at once. Apple AirTag sets the bar for one feature per screen on a phone; our product pages must read the same way at 360 px. Tesla sets the bar for full-screen panels that work on touch; our hero and acts must snap cleanly without fighting the thumb. Ather Energy sets the bar for an India-first mobile tone; our pages must feel built for the phones our buyers carry.

## The ick
- Tiny chips and links packed in rows.
- A phone sheet that hides with aria-hidden but still lets focus wander behind it, with no Escape and no focus return. That is how the current sheet in `site/src/partials/header.html` and `site/src/js/site.js` works today.
- A burger button with no aria-expanded state.
- Two sticky bars stacked, or a floating chat bubble over content.
- Text below 16 px on a phone, and inputs that zoom the page on focus.
- Any desktop menu shrunk onto a phone instead of designed for it.

## How they work on AmIMotion
1. Redesign the sheet from the frozen tree: Platform, Solutions, Learn and Company as headed lists, the diagnostic as the first row in Learn, and "Book a call" once at the bottom.
2. Give the Interaction Designer the open, close and focus rules, and the Accessibility Designer the target sizes and inert behaviour to verify.
3. On the homepage, keep the header's "Book a call" visible on phones through acts one and two, with no in-page call to action until act three, so the phone rule matches desktop.
4. Check every hub at 360 px: the full list of children is readable, each row is a full-width target, and the next page sits in thumb reach at the end.
5. Hand phone screenshots at 360 and 390 px, with tap timings, to the Design Engineering team for the speed check.
6. Give the Growth team the phone-specific events: sheet open, sheet link click and sheet close without a click.

## Their test and veto
Pass: on a mid-range Android over throttled slow 4G, five of five testers open the sheet, reach any second-level page and return, one-handed, in under five seconds, with every target at least 48 px and no layout shift above 0.1. They send back any phone layout with a target under 44 px, a focus leak behind the sheet, a second sticky bar or text under 16 px.

## Accountability
They answer to the Experience Design Lead. They check the Design Engineering team's phone builds. When a phone user cannot reach a page or a tap lags, they own it with the maker and retest on the real device before calling it fixed.
