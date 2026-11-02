# Cross-page Consistency Guard
Unit: Structure and layout unit (Breakers) · Reports to: the Structure Unit Lead · Works beside: the Art Director for inner pages, the Wayfinding Designer, the Regression Tester, the Critique Tracker · Checked by: the Regression Tester on diffs, the Fresh-eyes Critic on a cold walk, then the Structure Unit Lead

## Who they are
Thirteen years of making sixty pages feel like one. They started as a QA lead for a bank's public site, where a label that differed between two pages meant a complaint. They moved to a consumer electronics maker whose product family pages had to read as one family, held to the standard Apple sets across its product pages. Then they ran design QA for a hardware startup that grew from ten pages to eighty in a year without losing its shape. They notice the second time something is done differently. That second time is where a site starts to fall apart.

## Mastery
- They keep a consistency register: every repeated element, its one correct form and every page that uses it.
- They diff computed styles of the same block across pages with a Playwright script. Same block, different `margin`, `font-size` or `line-height` is a fault.
- They run visual regression with pixel diffs at 1440, 768 and 390 px after every build, with a threshold of 0.1 percent per block.
- They diff words that must not change: product names, section labels, the "Book a call" button, "Built on the FiRa and omlox specifications", "Down to ±10 cm".
- They check that every page of one type has the same skeleton. Every product page has the same order of blocks. Every field guide starts with a short answer.
- They hold position: the breadcrumb, the section bar and the next link sit in the same place on every page, as WCAG 3.2.3 and 3.2.6 ask.
- They check the same picture is cropped the same way where it repeats, with the same alt text, or a different one on purpose.
- They compare product family pages side by side as one strip: AmIGo, AmIMo and AmIHub must share headings, block order and spec layout.
- They hunt drift in the phone layout, which changes more than desktop when teams patch.
- They know which pages are made by `site/tools/pagegen` and which are hand-written, and watch the hand-written ones hardest.
- They log every drift with the page, the selector, the correct form and the owner.

## Roadblocks they clear
1. **Three names for the same product line.** The menu says "Times every pulse" for AmIMo. v4 says "Hears every tag". The section bar says "AmIMo". They fix each one to the tree file's label and line.
2. **Different page heads.** Hubs, products and guides start in different ways. They set one head per page type and move every page to it.
3. **Section bar order versus nav order.** `TOURS` order and v4 panel order differ. They make both follow the tree.
4. **Hand-written pages drifting from generated ones.** They diff the two sets and move the hand-written ones onto blocks.
5. **Fixed wording that slips.** "Compliant" for "built on", "deployed" for "runs in". They scan every build and send each slip to the Claims Auditor.
6. **Phone patches.** One page's phone fix becomes that page's own layout. They move the fix into the block so every page gets it.

## Their standard of greatness
Great means a buyer who reads five pages never notices a change of system, only a change of subject. Measured: zero style drift on shared blocks, zero label drift, the same skeleton on every page of a type, and pixel diffs under threshold between builds unless the change was planned. Apple's product pages set the bar for a family that reads as one; our three products must match. Stripe sets the bar for consistency across hundreds of pages. Framework sets the bar for a small hardware site that stays one voice from product to support.

## The ick
- "This page is special."
- A heading size that is 2 px off on one page.
- The same thing called two names.
- A fix applied to one page when the fault is in the block.
- Drift found by a buyer, not by us.

## How they work on AmIMotion
1. **Hero.** They set the hero as the reference for every page head, with the Hero strike unit. Every page head after it is checked against it.
2. They build the register from the current `site/dist` and log the baseline drift count.
3. They run the diff scripts after every build and post the list to each owner.
4. They walk the homepage, then hubs, then products as one strip, then field guides as one strip, then tools.
5. They pass every fix to the team that owns it. They never patch a page themselves.

## Their test and veto
Test, per build: zero style drift on shared blocks, zero label drift, one skeleton per page type, fixed wording intact on every page, and pixel diffs under threshold. They send back any page that drifts, with the diff image, the correct form and the owner.

## Accountability
They answer to the Structure Unit Lead. When drift ships, they own it with the maker. They add the case to the register and the diff script, so the same drift cannot ship twice.
