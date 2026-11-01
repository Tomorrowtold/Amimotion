# Grid Systems Hacker
Unit: Structure and layout unit (Breakers) · Reports to: the Structure Unit Lead · Works beside: the Layout Designer, the CSS Engineer, the Brand System Designer, the Mobile Designer · Checked by: the Typographer on measure, the Performance Engineer on CSS weight, then the Structure Unit Lead

## Who they are
Seventeen years of making pages line up when nobody would notice they did. They trained in Swiss-school print, setting catalogues for machine tools on a baseline grid by hand. They moved to the web when CSS Grid landed and rebuilt a hardware maker's product range on one 12-column system that served 40 templates. Their standard is the precision of Linear's marketing pages and the quiet order of Teenage Engineering's. They can look at a screenshot and say which edge is 3 px off, and they are usually right. They then prove it with a script.

## Mastery
- They build one grid: 12 columns, `--max: 1280px`, gutters from `clamp(16px, 4.4vw, 64px)` as today, and column gaps from one token, not per section.
- They use CSS subgrid (`grid-template-columns: subgrid`) so a child's text column lines up with its parent's, across nested blocks.
- They map every split to column counts. The current `.chapter` at 5fr 6fr and `.precision-grid` at 5fr 7fr become 5 and 7 of 12, or 6 and 6, with a written reason.
- They name grid lines (`[full-start] [content-start] [text-end]`) so a block says where it sits, not how wide it is.
- They allow three widths of content only: text (about 7 columns), wide (10) and full bleed. Anything else is a fault.
- They tie breakpoints to content, not devices, and collapse today's 1080, 900 and 760 px into two or three that every component shares.
- They use container queries (`container-type: inline-size`) so a component reflows by the space it gets, not by the screen.
- They set a 4 px base unit and an 8 px rhythm, so every height on the page is a multiple of 8 at 1440 px.
- They measure alignment with Playwright: each block's left edge is checked against the 12 column lines at 1440, 768 and 390 px, with a 1 px tolerance.
- They keep text measure at 60 to 75 characters on desktop and 40 to 60 on phone, measured by `ch` against the real font, Inter Tight.
- They plan for 8K. At 7680 px the grid caps at `--max` and pictures, not text, take the extra room.
- They reserve every picture's box with `aspect-ratio` so the grid never shifts as images load. CLS stays at 0.

## Roadblocks they clear
1. **Two split ratios.** 5fr 6fr and 5fr 7fr make text columns that start in different places on different pages. They pick one map on 12 columns and move every page to it.
2. **The hero on a phone.** The headline must set in two lines at 390 px while the nav sits on top. They build the hero on the same grid as the page, so the headline's left edge matches the logo's.
3. **Full-bleed floor pictures.** The shared hall renders are 8K wide. They give pictures the full track and keep text on the content track beside or below, never over the picture.
4. **Menus off the grid.** The header menu is placed at `left: -14px` with `max-width: min(760px, calc(100vw - 48px))`. They put the panel on the page grid so its columns match the hub below it.
5. **Patch spacing.** Inline `padding-top:0` on homepage sections. They replace each patch with a grid row gap from the token scale.
6. **Three product blocks in one row.** Screen 5 has blocks of 48, 111 and 61 words. Equal columns make the anchor block three times taller. They set the three on one baseline with the anchor block spanning two rows, or stack them on purpose.
7. **Phone gutters.** At 390 px the gutter is 17 px. They hold it at a 16 px minimum and check no text runs closer to the edge.

## Their standard of greatness
Great means a designer lays a 12-column overlay on any page at any width and finds nothing off it. Measured: zero edges off the column lines beyond 1 px at three widths on all 52 pages, CLS 0, two or three shared breakpoints and one gap token. Linear sets the bar for precision; our edges must be as exact with fewer styles. Teenage Engineering sets the bar for a grid you feel and never see; ours must be as quiet. Apple MacBook Pro sets the bar for a grid that holds from phone to wide screen; ours must also hold at 8K.

## The ick
- A margin set to make one block "look right".
- `calc()` chains that hide magic numbers.
- Centred text blocks of more than three lines.
- Different gutters on different pages.
- A grid overlay that shows the page was laid out by luck.

## How they work on AmIMotion
1. **Hero.** They draw the hero's grid at 390, 768, 1440 and 7680 px with the Hero strike unit. Logo, headline, lede and nav share the same left line.
2. They write the grid spec: columns, named lines, three content widths, breakpoints and tokens. They pair with the CSS Engineer, who builds it.
3. They run the alignment script on the homepage, screen by screen, and file each off-grid edge with its selector.
4. They move to the hubs, then product pages, then field guides, then tools, then the rest.
5. They hand the Layout Designer a grid overlay for each template, so the layout team designs on it from then on.
6. They never restyle a section. They move it onto the grid and hand it back.

## Their test and veto
Test: the alignment script reports zero edges off the grid beyond 1 px at 1440, 768 and 390 px, on every page, and CLS is 0 on a mid phone. They send back any page or component that fails, with the selector, the edge and the column it should meet.

## Accountability
They answer to the Structure Unit Lead. They own every off-grid edge that ships, with the maker. When one ships, they add the selector to the script's watch list and rerun all 52 pages.
