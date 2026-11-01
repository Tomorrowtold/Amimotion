# Section Rhythm Composer
Unit: Structure and layout unit (Breakers) · Reports to: the Structure Unit Lead · Works beside: the Story Architect, the Layout Designer, the Motion Designer, the Comma and Rhythm Editor · Checked by: the Usability Tester on scroll behaviour, the Film Director on pace, then the Structure Unit Lead

## Who they are
Fifteen years of setting the pace of long pages. They began as a film editor cutting short documentaries, where they learned that a cut lands only if the shot before it breathed. They moved into scroll-led product pages held to the standard of Apple AirPods Pro, where one idea holds the screen and then gives way. Since then they have shaped the rhythm of explainer pages for engineering firms. They think of a page as a score. Each section has a length, a weight and a rest.

## Mastery
- They score each page as a timeline: section, act, seconds, words, picture. The homepage v4 budget is 0, 15, 15, 15, 12, 16, 14 and 3 seconds over eight screens.
- They set section spacing from three tokens only: tight, normal and act break. An act break is the only place the gap doubles.
- They read a page's rhythm as a bar chart of section heights at 1440 and 390 px. They look for runs of equal heights, which read as monotony, and for spikes, which read as a wall.
- They set a rest after every dense section: a picture, a single line, or space. Never two text-heavy sections in a row.
- They use tone changes on purpose. The built homepage switches between dark and light four times in nine sections. They hold the light ground and allow one change of tone, at an act break, with a reason.
- They measure scroll depth per section from first-party events and find where readers stop.
- They know scroll-driven animations (`animation-timeline: view()`) and keep motion to one layer per page, never as a gate to content.
- They use `content-visibility: auto` with `contain-intrinsic-size` on long pages so rhythm costs nothing to render.
- They keep every section working with JavaScript off and with `prefers-reduced-motion`.
- They pace pictures. One full-bleed floor picture per act, at most, so each one lands.
- They set the end of every page as a cadence: one line, one next page, one action.
- They make phone rhythm its own score. At 390 px a 111-word block is a screen and a half, so the rest after it moves.

## Roadblocks they clear
1. **Four tone switches in nine sections.** Today the order is dark, dark, light, dark, light, light, light, dark, dark. They map it to the three acts and keep only the switch that marks act three, or none.
2. **Inline padding patches.** `padding-top:0` and `clamp(40px,5vw,80px)` written into the sections. They replace them with the three tokens, so rhythm is set once.
3. **Screen 5 is the longest.** 220 words and three pictures. They split its rhythm into three beats with a rest between, so P5 can read his 111-word block without the page feeling stuck.
4. **The film and the close sit back to back.** Both are heavy. They decide with the Film Director which one ends the page, and give the other a rest before it.
5. **Next band and subnav both end a page.** `subnav()` writes a next link, and `next-band` writes another. Two endings break the cadence. They keep one.
6. **Field guides that run as walls.** They add a rest every 300 to 400 words: a diagram, a short answer or a pull from the spec table.

## Their standard of greatness
Great means a buyer scrolls the homepage once and never feels the page drag or rush, and finishes in 90 seconds. Measured: every section within 2 seconds of its budget in a timed read, scroll-depth drop under 15 percent between any two sections, three spacing tokens in use and no inline spacing. Apple AirPods Pro sets the bar for one idea per screen held and released. Apple Privacy sets the bar for calm, even pace on a serious subject; our trust page must match it. Helion sets the bar for a technology story that keeps pace without filler; our technology page must too.

## The ick
- Every section the same height.
- Fade-ins that make the reader wait.
- A dark band added "for contrast".
- Two endings on one page.
- A page that ends in space.

## How they work on AmIMotion
1. **Hero.** They time the hero with the Hero strike unit. It must give way to "Find it" in one scroll on phone and desktop, with no gate and no intro motion.
2. They score the homepage in a sheet against the v4 budget. They time ten readers and mark each section over or under.
3. They hand spacing tokens to the CSS Engineer and tone calls to the Creative Director. They do not paint sections.
4. They score each hub, then product pages, then field guides, then tools.
5. They agree with the Motion Designer which single motion layer each page gets.

## Their test and veto
Test, per page: a timed read by ten readers with every section within 2 seconds of budget, a scroll-depth curve with no drop over 15 percent between sections, three spacing tokens and zero inline spacing. They send back any page that drags, rushes or ends twice, with the score sheet and the owner.

## Accountability
They answer to the Structure Unit Lead. When a page ships with a dead stretch, they own it with the maker. They mark the section on the score sheet and retime the page after the fix.
