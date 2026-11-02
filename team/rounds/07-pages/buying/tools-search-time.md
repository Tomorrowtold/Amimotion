# /tools/search-time/  Time spent searching

Squad: buying. Generator: `p_company.py`, `write("/tools/search-time/", ..., scripts="tools")`. Form markup and the sum in `site/src/js/tools.js` are kept. Words only.

- **Title tag:** Time spent searching: your own numbers | AmIMotion
- **Meta description:** Turn your own figures into hours a year spent looking for trolleys, bins and tools. AmIMotion's calculator assumes no savings. It runs in your browser.

**Job of the page.** Buyers: P1 plant head (is the problem worth funding), P3 IE lead (will the number survive scrutiny), P2. Question: "What does searching cost us today?" Next step: measure it in a pilot, or book the call. Best reference: Ramp's and Stripe's calculators, which show the formula in plain sight, and The Pudding's habit of letting the reader own the inputs. The page never states an industry average (K03 RED: "10 to 20% of time searching" has no source).

**Drafts.** A: tool and "AmIMotion's tags put each item on a live map" pitch line. B: tool, then where every number comes from, then how to count it for real. Picked B: A's pitch line read as a promised saving to P3; B keeps the calculator honest and moves the pitch to a method.

---

## head(...)

- **H1:** Time spent searching.
- **soft:** Your own numbers.
- **lede:** How many people look, how often and for how long. The calculator multiplies it out. It assumes nothing about savings.
- **short:** AmIMotion's search-time calculator multiplies five of your own figures: people who search each shift, searches per person, minutes per search, shifts a day and working days a year. It gives hours a year, hours a day and the same time as full-time people, at 8 hours a day. Add a loaded hourly cost to see it in rupees. It shows what searching costs you today. It does not forecast a saving.
- **trail:** [("Start small", "/start/"), ("Time spent searching", None)]
- **media:** none

## section 1: the tool (markup kept)

Labels kept: "People who search, per shift", "Searches per person, per shift", "Minutes per search", "Shifts per day", "Working days a year", "Loaded cost per hour, ₹ (optional)" with "Leave empty to see hours only."

Output: "Time spent searching" (big: hours a year); lines "Per day", **"Full-time people, at 8 h a day"** (was "Full-time people, equivalent"; see S2), "Cost a year".
Note: "Your numbers, multiplied out. This is what searching costs today, not a forecast of what you would save. A pilot measures the change on your floor."
`btns`: ("Book a call", "/contact/"), ("Measure before you claim", "/learn/pilot-baseline/").

## section 2: `vp("Where the numbers come from.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Your figures | The sliders start at 12 people, 4 searches, 8 minutes, 2 shifts and 300 days. Those are only starting positions, not industry averages. Move them to match your floor. |
| The sum | People, times searches, times minutes, times shifts, times days, divided by 60, gives hours a year. Full-time people divides that by 8 hours for each working day. |
| The cost | If you add a loaded cost per hour, the tool multiplies the hours by it. Time freed is not the same as money saved, so read it as the cost of searching today. |

Picture: none.

## section 3: `vp("Count it for real.")` + `split(None, paras, media=slot(...))`

Paragraphs:
1. Most plants estimate these numbers. A pilot counts them. Before it starts, time how long it takes to find the trolleys in one flow.
2. Then AmIMotion tags them. An AmIGo tag rides on each trolley, and AmIHub's live map shows where it was last seen, and when. You find out from a screen, not a walk.
3. Time the same searches again with the map open. That difference, on your floor, is the number you can defend.

`more([("Measure before you claim", "/learn/pilot-baseline/"), ("Where is that trolley?", "/use-cases/find-the-asset/")])`

Picture: `slot(brief, "photo", alt, "Realism lab")`. Shows: camera A cropped close, the press line on the left and the racks on the right, everything pale except one trolley stopped behind the racks on a blue floor tint, its one blue trail running from the press and ending where it stands. Source: model-hall still, `build_hall.py`, camera A, homepage screen 2 scene, 4:3. Alt: "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped."

## section 4: `faq([...])`

1. **How much time do teams spend searching for trolleys and tools?** AmIMotion does not publish an average, because it varies too much from floor to floor. Enter your own figures here, then measure them in a pilot before you rely on them.
2. **Does the calculator include savings?** No. It shows what searching costs today. Any change has to be measured on your own floor, against a baseline.
3. **Does my data leave the page?** No. The calculator works in your browser and keeps nothing.

## close

`close("Find it from a screen.", "On the call we look up tagged things on AmIHub's live map, on real data.", (("Book a call", "/contact/"),))`

## Internal links

/start/, /contact/, /learn/pilot-baseline/, /use-cases/find-the-asset/.

## JSON-LD notes

`WebApplication` ("Time spent searching", free) + `FAQPage` (three) + `BreadcrumbList` (Home > Start small > Time spent searching).

---

## Calculator assumptions (logic kept; flagged)

| # | In tools.js | Ruling | Why |
|---|---|---|---|
| S1 | Defaults 12 people, 4 searches, 8 min, 2 shifts, 300 days | Flag, disclosed | No founders' source. Shown on the page as starting positions, not averages. Keeps clear of the RED "10 to 20%" figure. |
| S2 | `fte = hours / (8 × days)` | Flag, disclosed | 8 hours per person per working day is the tool's convention, not a founders' figure. Label now says "at 8 h a day". [CW]: released labour time is not cash savings; the page says so. |
| S3 | Cost = hours × rate | PASS | The user's own rate; no saving implied. |
| S4 | Old short answer "located down to ±10 cm in 3D, so a search starts on a screen. The calculator assumes no savings." | REWORD | ±10 cm without "with AmIMo anchors" and "depends on your floor"; and the pitch line sat inside a calculator's answer. Removed from the short answer. |

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P3 IE lead | 7 | "Full-time people, equivalent": equivalent to what? | S2, label and "The sum" tile | 9 |
| P1 Plant head | 8 | Defaults looked like a benchmark | "Your figures" tile says they are not averages | 9 |
| P2 Production control | 9 | none | | 9 |

Mean 9.0.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| No average published | PASS | K03 RED on "10 to 20%" |
| "Time freed is not the same as money saved" | PASS | [CW] section 5 |
| Last seen, and when; screen not a walk | PASS | V14, V6 |
| Pilot measures search time | PASS | [CW] level 2 (method, not a result) |
| Any saving figure | none made | K03 NEVER |

**Open facts used.** none.
**Word count:** about 590.
