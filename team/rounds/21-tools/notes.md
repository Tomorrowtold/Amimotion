# Round 21: tools, every input draws (Kenji)

Shiv said the tools read as forms. Every tool's answer is now a drawing first, redrawn the moment an input moves. All copy, formulas and claims are unchanged. The only new readout is "Per week" on search time, which is hours a year divided by 52.

**What changed**
- `/tools/anchors/`: a plan view on canvas at drawing scale. The floor outline, rack rows by floor type, the planning grid as coverage lines, and an AmIMo anchor on each grid corner (the tool's own formula, so the dots equal the corner count). New anchors land and removed ones lift away. There are dimension lines, a scale bar that steps by quarter-octaves, and a section through the hall with the 3 to 8 m mounting band and the ceiling height. The range counts up.
- `/tools/search-time/`: the year as a pile. Twelve bars, each the hours searched by the end of that month, built of week blocks, or month blocks when a week is under 4 px. The year total sits on the last bar in ink. The bars rise left to right, and the axis rescales smoothly. The big number counts up.
- `/tools/pilot/`: a printed brief sheet. Each answer is typed into its numbered field. Settle items type in line by line and leave when they no longer apply. The plain-text brief stays (visually hidden) for copy, download and email.
- `/diagnostic/`: the existing sketch is redrawn as an engineering plan, with a hall wall, hairline zones, dash-dot aisles and a title block that takes the role at Q6. Each new mark draws in: tagged things land, the job link draws, the waiting zone fills amber and the pilot area dashes in. "Found on foot" is now ink. Amber is kept for waiting only.
- `/tools/` and `/resources/` hubs: each card holds a live miniature of its tool's drawing. It cycles sample inputs while on screen, and pointer-enter plays the next one. It is still under reduced motion.
- Phone: the drawing sticks to the top while the form scrolls under it, and the answer then slides up over it.
- Range sliders are restyled as hairline tracks with ink fill.
- `prefers-reduced-motion` snaps every tween, counter and typing effect.

**Files**: `site/src/js/tools.js`, `site/src/js/diagnostic.js` (drawMap only), `site/src/css/tool.css`, `site/src/css/diag.css`, `site/tools/pagegen/p_company.py`, `lib.py` (`draw()`, `minis()`), `p_learn.py` (the /resources/ tool cards), and the six generated pages.

**Verify**: `node team/rounds/21-tools/shoot.js <base> team/rounds/21-tools/shots` takes 1440x900 and 390x844 shots, at defaults and with inputs changed.

**Gotcha**: core.css owns `.sheet` (the phone nav sheet), so the brief sheet is `.bsheet`.
