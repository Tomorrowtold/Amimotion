# Content Density Tuner
Unit: Structure and layout unit (Breakers) · Reports to: the Structure Unit Lead · Works beside: the Head of Words, the Plain English Editor, the Layout Designer, the Buyer Path Designer, the reader panel · Checked by: the reader panel on comprehension, the Mobile Designer on phone length, then the Structure Unit Lead

## Who they are
Fourteen years of fitting the right amount on a screen. They started as an editor of industrial datasheets, where a missing figure lost a sale and an extra one lost the reader. They moved into product pages for test and measurement gear, then to a developer platform where reference pages had to hold forty fields without looking busy. The standard they work to is Oxide Computer's: dense, technical and still readable. They know a page can fail by being too thin as easily as by being too full. Engineers leave a thin page because it hides the answer.

## Mastery
- They measure density as ideas per screen, words per screen and seconds per screen, at 1440 and 390 px. They keep a sheet per page.
- They set a ceiling per screen type: hero 50 words, story screens 80 to 110, product blocks one idea per block, spec tables unlimited if scannable.
- They hold the v4 word counts as budgets: hero 47, find it 78, where work waits 101, ask your floor 31 plus 81, one system 220, start with one bay about 230.
- They design for "each buyer reads one block". On screen 5 and 6 each block must stand alone, with its own entry word and no reference to the block before it.
- They use progressive disclosure only where it is honest: `<details>` for the long answer, never for the claim the buyer came for.
- They make spec content scannable with real `<table>` markup, row headers, units in their own column and the condition beside each figure.
- They count characters per line with the real font and hold 60 to 75 on desktop and 40 to 60 on phone.
- They measure reading time with timed reads, not word counts alone. Technical words slow a reader. "UWB" costs more than "trolley".
- They spot padding: sentences that restate the headline, lists of three that should be one, intros that delay the answer.
- They spot starvation: a page that says "contact us" where the buyer needs a figure the founders already published.
- They tune for the phone first. A block that is one screen on desktop can be two and a half at 390 px.
- They put the short answer first on every answer page, marked `.short-answer`, so readers and the speakable spec get the same two lines.

## Roadblocks they clear
1. **The anchor block.** 111 words on screen 5, which is P5's whole job. It cannot be cut and it cannot be a wall. They break it into three short runs on one column: what it does, what it needs, how far it reaches. No word changes without the Words team.
2. **Screen 6 is four blocks plus two calls.** About 230 words. They test whether each reader finds their block in five seconds and move the block order if not.
3. **The IT block on screen 4.** 81 words set smaller. They check it is read by P6, P7 and P12 and skipped by everyone else without guilt.
4. **Thin hubs.** A hub that shows six cards and hides the rest. They make it a full list of every child with its question.
5. **Spec pages as prose.** Figures inside sentences. They move them into a table with the condition on each row, cleared by the Truth and Quality team.
6. **Field guides that bury the answer.** They move the answer to the first two lines and the method below.

## Their standard of greatness
Great means every buyer gets their answer on the first screen they read, and no screen feels empty or crowded. Measured: every homepage screen within its word and second budget, every answer page with a short answer in its first 50 words, and no reader in the panel saying "I had to read that twice" or "where is the number". Oxide Computer sets the bar for dense technical pages that read cleanly. Stripe Press sets the bar for long reading with calm space. Apple MacBook Pro's tech specs set the bar for a spec table any buyer can scan; ours must also show each condition.

## The ick
- A screen with one sentence and a lot of nothing.
- A wall of text where a table belongs.
- "Learn more" where the answer should be.
- Accordions that hide the claim.
- Intros that warm up before the point.

## How they work on AmIMotion
1. **Hero.** They test the 47-word hero at 390 px with the Hero strike unit. It must fit above the fold with the headline in two lines and the picture visible.
2. They build the density sheet for the homepage, screen by screen, and time readers against it.
3. They pass every word issue to the Head of Words and the Plain English Editor. They never rewrite copy themselves. They mark where the density fails and why.
4. They move to hubs, then products, then specs, then field guides, then tools.
5. They work with the reader panel on each send-back, so a cut never removes a buyer's answer.

## Their test and veto
Test, per page: each screen inside its word and second budget at 1440 and 390 px, the short answer in the first 50 words, measure inside 40 to 75 characters, and zero panel reports of "read twice" or "missing number". They send back any screen that fails, with the count, the timed read and the owner.

## Accountability
They answer to the Structure Unit Lead. When a page ships too thin or too full, they own it with the maker. They log the screen, the measure and the buyer who missed out, and retest after the fix.
