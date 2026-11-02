# Solutions squad: 12 pages

Copy for the Where it helps pages, the industries pages and the use cases. Each file maps onto the `lib.py` blocks (head, vp/section, tiles, steps, stats, compare, split, cards, links, more, faq, close, slot/still). The copy is applied to `site/tools/pagegen/p_solutions.py` after the page-system move. Nothing in `site/` was edited, and nothing was committed.

| Page | File | Readers (final, cold) | Words (visible, approx.) |
|---|---|---|---|
| /solutions/ | solutions.md | P1 9 · P2 9 · P4 9 | 470 |
| /solutions/wip/ | solutions-wip.md | P2 9 · P3 9 · P6 9 | 720 |
| /solutions/assets/ | solutions-assets.md | P4 9 · P2 9 · P5 9 | 640 |
| /industries/ | industries.md | P8 9 · P1 9 · P11 9 | 470 (was 181) |
| /industries/manufacturing/ | industries-manufacturing.md | P1 9 · P3 9 · P5 9 | 700 |
| /industries/warehousing/ | industries-warehousing.md | P8 9 · P6 9 · P5 9 | 600 (was under 250) |
| /industries/robotics/ | industries-robotics.md | P8 9 · P5 9 · P10 9 | 520 (was under 250) |
| /use-cases/ | use-cases.md | P2 9 · P4 9 · P7 9 | 380 |
| /use-cases/find-the-asset/ | use-cases-find-the-asset.md | P4 9 · P2 9 · P1 9 | 470 |
| /use-cases/station-to-station/ | use-cases-station-to-station.md | P2 9 · P3 9 · P6 9 | 560 (was under 250) |
| /use-cases/amr-hand-off/ | use-cases-amr-hand-off.md | P5 9 · P6 9 · P8 9 | 450 |
| /use-cases/ask-your-plant/ | use-cases-ask-your-plant.md | P7 9 · P4 9 · P8 9 | 600 |

Mean final reader score: 9.0 (36 reads). Mean first-read score: 8.1. Each page is over 250 words, and every passage names AmIMotion, AmIGo, AmIMo or AmIHub. Titles are 65 characters or fewer with the suffix. Descriptions are 160 or fewer.

## Decisions the build team needs to apply

1. **Films leave the four use-case heads.** System notes fault 2 says the films look AI-made, and /films/ is held (V103). Each head is now a model-hall still (`slot`, 16:9), and the cross-links between use cases are `links()` rows, not poster cards. Remove the "Watch the 1:10 film" lines from the descriptions and drop the VideoObject JSON-LD. The films come back only when they are cut from the model hall.
2. **No `tone="dark"`** on the use-case pages. One ground, per system notes.
3. **Labels follow nav.json.** The /use-cases/ask-your-plant/ crumb and card read "Ask your floor". The /solutions/assets/ crumb reads "Tools and vehicles". Station to station and The hand-off have no nav row, so their H1 short names become their crumbs.
4. **Closes.** The default close for /solutions/, /industries/ and /use-cases/ is used on 10 pages. Two pages use a custom close. find-the-asset closes on the search-time calculator. ask-your-plant closes on Book a call, because the call demo is the proof K03 requires for the MCP claim.
5. **One canonical answer per panel question.** "How do you track forklifts and AMRs indoors ..." moves from amr-hand-off to /solutions/assets/. "Which companies offer real-time WIP tracking ..." stays on /solutions/wip/. "How is dwell time measured" is a short answer on station-to-station that points to /learn/dwell-time/.

## Pictures owed (Realism lab)

- 20 model-hall stills, all from camera A in `build_hall.py` (`--state after` or `build`, cropped with `--border`). Each is briefed in its page file with its own code (P-SOL-01 and so on). Six of them reuse homepage stills (screens 2, 3 and 4) at a new ratio.
- **Two stills need something the hall does not have yet:**
  - The AMR towing one trolley (P-ROB-01, P-UC2-01). Add a trolley hitched behind `P['amr']`.
  - A drop-off zone outline at the line end of the back aisle, with two trolleys on amber (P-ROB-02, P-UC2-01).
- Several briefs use the "isolate pass", which shows everything pale except the named objects. This is the same treatment as homepage screens 2 to 4.
- CAD stills already exist: `amigo-side` on /solutions/assets/ and `amimo` on /industries/manufacturing/.

## Blocked or held (safe line shipped, logged)

- **O1 (phone map).** No phone is shown or mentioned anywhere. The old find-the-asset brief "tablet in hand" is cut.
- **O2 (zone limits and alerts).** Only "who on your team acts when work waits too long" ships.
- **O3 (consent).** Only "Tagging people would be a separate project. It would need its own policy." ships. People and badges are removed from the robotics and AMR pages.
- **O4 (tilt and impact).** Only "If a tag comes off, the map still shows its last-seen spot." ships.
- **O5 (AmIHub screen).** No screen is drawn. The ask-your-plant section 4 is copy only until a capture can be shown.
- **O6 (stop right).** Not used.
- **O7 (shift-end default).** "We agree how to count a wait that runs past shift end" ships.
- **C18 (Analytics maturity).** These old lines are cut until a founder confirms they are live: "running, idle or parked", "Ready for what comes next" and "Any automation comes later". No fleet utilisation, heatmaps, milk-run counts or automatic work-order closing appear.
- **Release check carried from F8.** "Ethernet is also an option" appears on manufacturing and warehousing. It ships only if /specs/ carries the [B4] backhaul row.
