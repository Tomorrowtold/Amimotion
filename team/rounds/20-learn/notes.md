# Round 20: learn guides and site-wide type motion (Theo)

2 Nov 2026. Storyboard section G and build step 4 (`18-bench/storyboard.md`). The copy stays word for word. The only new words are labels inside the figures (zone names, demo times, ids, "now", "echo"), and they are drawn by code.

## Type motion (all inner pages except /tools/ and /diagnostic/; the homepage keeps its own)
- **H1, line by line.** Each line rises out of its own mask. The clip-path travels with the line, so no wrapper markup is needed. It is pure CSS at load (`.motion [data-km] h1>span`). The words and crumbs follow at 0.38 s.
- **Section headings.** They rise the same way as they enter view (km.js, IntersectionObserver).
- **Figures.** `.figures dt` and `.giant-num` count up in tabular numerals and end on the page's own text, character for character.
- **Native scroll only.** Nothing moves the page. km.js only reads `scrollY`.
- **Reduced motion, `?still`, no JS.** None of these get `.motion`, so the page shows its end state.

## The question answers itself (every guide)
The H1 has two lines: the question, then the answer. The answer starts at 26% ink. As you scroll, the question line is held in place and the answer scrolls up into its slot, wiping it away. The answer then locks to full ink. The travel is exactly one line, so nothing overlaps and nothing is pinned for long. Phones run the same move.

## One figure per guide (`tools/pagegen/learn_figs.py`)
Each figure is an inline SVG on the page ground: ink 1.5 px, located blue, waiting amber, hairlines. There is no glow and there are no rings. On desktop it sits in a sticky left rail above the on-this-page list, and the list marks the section being drawn. Each `<g data-s>` layer draws as its section is read. Lines draw along their length. Earlier layers step back to 80%. On phones the figure sits above the text and its layers draw in turn as it enters view.

| Guide | Figure |
|---|---|
| dwell-time | One trolley's morning as a zone timeline. Entry and exit stamps, the waits in amber with counters, a shift line, "now". |
| association | Trolley 14's tag bar runs all day. Job 208 and Job 209 links have a start and an end. AmIHub link points, the MES record, an unknown gap, a query cursor. |
| uwb-vs-rfid | One floor plan: RFID gate reads, a hatched BLE area, the UWB path into lane B, the wait in lane B. |
| alternatives | Three tapes of one journey: scan "confirmed", checkpoint "passed", the continuous UWB line with its wait, what each installs, the same test. |
| accuracy | A 10 cm ruler at CSS true size (600 px figure). Each reading's distance from the true point, hard places in amber, direct path vs echo off racking, seen, received, used. |
| wip-visibility | Isometric layers: position, time and job pinned through one trolley. The "why" layer stays empty. One bay. |
| location-data-quality | The trail ends between racks. The last-seen dot fades as its age counts up, with a "last seen" stamp. One anchor goes dark. The reports stop. |
| value-without-mes | Four pilot weeks: the location and time columns fill first, the job column later, then the MES. |
| pilot-baseline | Hand tallies per day before any tag, an empty "after" sheet, the spread of the days (no savings shown), on to hours a year. |
| uwb-rtls-india | The seven questions tick down. The eighth, "Which job is on the trolley?", is set apart in amber. |

These guides have no figure, by brief: anchor-planning and rtls keep their CAD and hall pictures, and mcp-location-data and omlox are Mia's. All four still get the type motion and the H1 swap.

## Weight
- km.js: 2.6 KB gz.
- learn.css: 1.7 KB gz.
- inner.css round-20 block: 0.7 KB gz.
- Total about 5 KB gz, with no libraries. The SVG markup is about 6-12 KB raw per guide.
- Pickability: barred claims 0, and every learn page passes 14/14.

## Not done
The /learn/ index "kinetic index" (titles running sideways) is not built. The index has the type motion only.

Shots: `shots/` at 1440x900 and 390x844. Each set has the top, the swap mid-way, and the sections.
