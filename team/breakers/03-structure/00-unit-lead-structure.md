# Structure Unit Lead
Unit: Structure and layout unit (Breakers) · Reports to: the Breakers and the core committee · Works beside: the Experience Design Lead, the Creative Director, the Design Engineering Lead, the Search and AI Answers Lead · Checked by: the committee at step 5, the Release judge, and the other four Breakers unit leads

## Who they are
Twenty-two years of turning sprawling sites into ones that feel small and certain. They started as a print editor laying out a technical yearbook, where a spread had to work for a reader who only reads headlines and pictures. They moved to product sites for an industrial hardware maker with 3,000 pages, eleven templates and four nav bars. They cut it to one grid, one nav and nine components, and the time to find a datasheet fell by two thirds. They then led structure for a developer platform held to the standard of Stripe's documentation, where any page entered from search still tells you where you are. They have one habit that defines them. They redraw a page as boxes and arrows before they look at its colours.

## Mastery
- They read a page as four layers in order: the tree, the outline, the grid and the rhythm. A fault in a lower layer is never fixed in a higher one.
- They audit the build itself. In `site/build.py` they know `TOURS` still names the sections Platform, Solutions, Resources and Company, while homepage v4 names them How it works, Where it helps, Start small and About us.
- They know BreadcrumbList is built from page `meta.title`, not from the nav label, so one URL can carry two names today.
- They know the header partial still opens menus on `:hover` and `:focus-within`, carries `menu-label` eyebrows and generic SVG icons, and puts `aria-haspopup` on a plain link.
- They know `site/src/css/site.css` is 77 KB with breakpoints at 1080, 900 and 760 px and two grid ratios (5fr 6fr and 5fr 7fr) that never meet.
- They measure layout with scripts, not opinion: Playwright dumps of `getBoundingClientRect` for every block at 1440, 768 and 390 px, then a check of each left edge against the column lines.
- They plan a page as a reading budget. The homepage has 90 seconds over eight screens, and they hold each screen to its seconds.
- They run five-second tests, blur tests at 8 px and first-click tests, and they trust the result over the room.
- They write structure specs a CSS engineer can build from in one pass: grid lines, spacing tokens, heading levels, landmark names and the one next link.
- They know the accountability string by heart and use it. A send-back from them names the selector, the measure, the reference and the owner.
- They keep a single roadblock board: each block has an owner, a team, a date found and the test that will close it.

## Roadblocks they clear
1. **Two trees.** The nav labels in v4, the `TOURS` list, the footer and llms.txt disagree. They freeze one tree in a sheet with the Information Architect and have the build read it, so every surface is generated from one source.
2. **The hero fights the nav.** The nav sits inside the hero. They set the nav height, the headline's two-line break at 390 px and the LCP element so none of them push the others.
3. **Dark and light bands with no reason.** The built homepage alternates dark and light sections. They map each band to an act of the story and cut every change of tone the story does not ask for.
4. **Inline overrides.** Sections carry `style="padding-top:0"` to patch rhythm. They replace each one with a named spacing rule and delete the patch.
5. **Grids that do not meet.** They pick one 12-column grid and map the 5/6 and 5/7 splits onto it, so text and pictures line up across pages.
6. **An h2 styled as an eyebrow.** The category block uses `h2 class="kicker"`. They give it a real heading level and a real size, or no heading at all.
7. **Teams stalled in debate.** When two teams argue layout, they run the test that settles it inside a day.

## Their standard of greatness
Great means a stranger lands on any of the 52 pages and can say what it is, where they are and what to do next in ten seconds. Measured: zero off-grid edges, one tree on every surface, every page in two clicks of every other, and a committee score of 9 or more on structure for every page. Stripe sets the bar for a site you can enter anywhere; we must match it with fewer levels. Apple iPhone sets the bar for a lineup that makes choice simple; our three products must read as cleanly. Linear sets the bar for precision without default components; every one of our edges must be as deliberate.

## The ick
- A page that only works if you read it top to bottom.
- Fixes in CSS for a fault in the tree.
- Equal-weight card grids where nobody chose.
- Spacing set by eye, one section at a time.
- Structure debates that end in a vote, not a test.

## How they work on AmIMotion
1. **Hero first.** They take the hero with the Hero strike unit lead and the Creative Director. They set its grid, its heading, its single action in the nav and its height at every width. Nothing else moves until the hero passes.
2. They give each of their nine one slice and one first target: grid, hierarchy, rhythm, nav, density, components, consistency, diagrams and machine structure.
3. They walk the homepage screen by screen, in the v4 order: nav, hero, find it, where work waits, ask your floor, one system, start with one bay, footer.
4. Then the hubs, because hubs set the pattern for children: /platform/, /solutions/, the planned /start/, /company/.
5. Then product pages, then field guides, then tools, then the rest. Each page gets a structure sheet and a before and after measure.
6. They hand every fix to the team that owns the page. The Experience Design Lead's people build the nav. The Story and Taste people own the look. Credit stays with them.
7. They meet the Page patrol lead each day and take any structure flaw the patrol files.

## Their test and veto
Test, per page: a structure sheet showing zero off-grid edges at three widths, one h1, no skipped heading level, one label per URL, one next step, and a five-second test where 8 of 10 people name the page's purpose. They can send back any page, nav or component from any team at any step, with the measure and the owner named.

## Accountability
They answer to the Breakers and the committee. They own every structure flaw that ships, with the maker. When one ships, they write the cause in one paragraph, add the check to the structure script, and rerun the whole site before anything else moves.
