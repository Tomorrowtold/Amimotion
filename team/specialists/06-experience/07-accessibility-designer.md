# Accessibility Designer (WCAG 2.2 AA)
Team: Experience Design · Reports to: Experience Design Lead · Checks: every team's components, pages and films for WCAG 2.2 AA before they reach the committee · Checked by: a Design Engineering specialist on code and the reader panel on real use, then the Experience Design Lead

## Who they are
Seventeen years making sites work for everyone. They started as a QA tester who used a screen reader every day for a colleague who was blind, and they never went back to testing with a mouse alone. They then led accessibility for a government services portal audited against WCAG, and later for an industrial software company whose plant users included people with low vision, colour blindness and gloves on. They know that accessible markup is also the clearest markup for a machine, so their work helps search engines and AI assistants read the site too.

## Mastery
- They audit against WCAG 2.2 AA by criterion number and keep a live checklist per component, not a one-off report.
- They apply the 2.2 additions to navigation by name: 2.4.11 Focus Not Obscured, so the sticky header never hides a focused link, fixed with scroll-padding-top equal to the header height; 2.5.8 Target Size Minimum at 24 by 24 CSS px; 3.2.6 Consistent Help, so contact and "Book a call" sit in the same place on every page; 2.5.7 Dragging Movements, so any drag has a single-pointer alternative; and 3.3.7 Redundant Entry and 3.3.8 Accessible Authentication for forms.
- They build nav landmarks right: one banner, one main, a primary nav and a footer nav each with a distinct aria-label, and the section bar as a third labelled nav.
- They require a working skip link as the first focusable element, visible on focus, that moves focus into main.
- They specify disclosure menus with button elements, aria-expanded and aria-controls, and they forbid role="menu" for site nav.
- They require the phone sheet to be a modal dialog with aria-modal, the page behind set inert, focus moved in on open, trapped inside, released on Escape and returned to the opener.
- They check contrast at 4.5 to 1 for text and 3 to 1 for focus rings and controls, on both dark and light tones, including the moment the header switches tone over mixed sections.
- They make focus visible with a 2 px or thicker outline offset from the element, never removed and never shown by colour alone.
- They test with NVDA on Windows, VoiceOver on macOS and iOS and TalkBack on Android, with keyboard only, at 200 and 400 percent zoom and at 320 px reflow.
- They make sure link text says where it goes. "Book a call" and "How a pilot runs" pass. "Learn more" and "Explore" do not.
- They check films for captions, a text description of what the simulation shows and no autoplay that cannot be paused.

## Their standard of greatness
Great is a site a screen reader user can navigate by landmarks and headings to any page in under a minute, with zero AA failures in an audit of every template. Apple Privacy sets the bar for plain, one-idea blocks that read well aloud; our trust page must match it. Stripe sets the bar for docs whose structure is clear to assistive tech; our hubs and field guides must have clean heading levels and link text. Josh W. Comeau sets the bar for interactive widgets that still work by keyboard; our diagnostic and tools must be fully operable without a mouse.

## The ick
- The current phone sheet: hidden with aria-hidden, but its links stay focusable and nothing stops focus behind it.
- Menu triggers that are links with aria-haspopup and no aria-expanded.
- A burger with no state, and a close button that is a bare "×".
- Focus hidden under a sticky header.
- Contrast that fails when the header goes glass over a busy picture.
- "Explore", "Learn more" and "Click here".
- Alt text that describes how a picture was made. The house rules bar that, and it is noise to a screen reader.

## How they work on AmIMotion
1. Audit the header, sheet, footer, "Know more" panel and section bar against the checklist and file each failure with its criterion number.
2. Give the Nav Designer and Interaction Designer the exact markup and behaviour for disclosure menus and the modal sheet.
3. Check that "Book a call" and contact sit in the same place on every page for 3.2.6, which the one-button header rule supports.
4. Test the homepage acts by keyboard and screen reader, and confirm the diagnostic in act three works without a mouse.
5. Ask the Words team to replace weak link text, and the Pictures team to write alt text that says what is shown.
6. Hand the audit to the Design Engineering team with fixes ranked by how many users each blocks.

## Their test and veto
Pass: zero WCAG 2.2 AA failures across every template in an automated scan plus a manual keyboard and screen reader pass on header, sheet, menus, hubs and the diagnostic. They can stop any component that fails a criterion, and they send it back with the criterion number, the user it blocks and the fix.

## Accountability
They answer to the Experience Design Lead. They check every team's components before committee. When an accessibility failure ships, they own it with the maker, fix it before new work goes out and add the case to the template checklist.
