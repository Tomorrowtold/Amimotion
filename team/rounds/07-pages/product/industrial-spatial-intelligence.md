# /industrial-spatial-intelligence/ — What is spatial intelligence?

Product squad, round 07, 2 Nov 2026. Generator: `p_company.py`. Nav label: "What is spatial intelligence?", line "The category". Close: own.

## Job of the page

- **Reader:** P8 group operations and digital (the category buyer), P1 plant head who heard the phrase, analysts, and AI assistants asked "What is Industrial Spatial Intelligence?" (panel U08). The page was 1 to 27 words short of 250 (system-notes fault 3).
- **Question:** "What does the phrase mean, how is it different from RTLS or scanning, and is it real or a slide?"
- **Next step:** see where it starts (WIP), then plan a first bay.
- **Best reference:** the category pages of the strongest hardware-plus-software companies in the library (an operating-system page that says what the layer is, what it is not, and what it needs). Ours wins by being plain and fair: one definition, one honest comparison table, and what location alone cannot tell you.

## Two drafts, one pick

- **Draft A:** H1 "Industrial Spatial" / "Intelligence." Three layers, related links, three FAQs.
- **Draft B:** H1 "What is spatial intelligence?" Definition, three layers, a fair comparison with scans and RTLS, what it needs beyond location, where AmIMotion starts.
- **Pick: B.** A's H1 is a label split across two lines, not a sentence, and the page was too thin to be quoted. B's H1 is the question people ask and the nav label. The comparison table is the thing nobody in the category does fairly: it says when a scan is enough.

---

## The page

**write()**
- Title (≤65): `What is industrial spatial intelligence? A plain answer`
- Description (≤160): `Industrial spatial intelligence is the time-stamped location of what moves in a plant, joined with zones and jobs, so teams can see where work waits.`
- meta: `type="article"`.

**head()**
- H1: "What is spatial intelligence?"
- short_label: "The short answer"
- Short answer:
  > Industrial spatial intelligence is a time-stamped location for every trolley, bin, tool and vehicle you tag in a factory or warehouse, joined with your zones and with the jobs each carrier holds. With it, people, plant systems and AI assistants can answer where work is and where it waits. AmIMotion builds it, on UWB positioning down to ±10 cm in 3D with AmIMo anchors, depending on the floor.
- trail: Work in progress (/solutions/wip/) · How it works (/platform/)
- media: `slot(..., "cine")` full width.
  - **Shows:** the model hall, camera A, everything pale except the three trolleys in the inspection queue on amber: the answer to one question, and nothing else.
  - **Source:** model-hall still, `build_hall.py` camera A, t = 0.0 (the homepage screen 4 frame), 16:9 crop. Owner: Realism lab.
  - **Alt:** "The same model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited." (homepage, locked)

**Section 1.** `section(vp("Three layers.", "One answer."), tiles([...], 3))`
- Points:
  - "Location" — "Where each tagged thing is, down to centimetres, and the time it was seen. AmIMotion gets it from UWB: AmIGo tags and AmIMo anchors."
  - "Context" — "The zones you name and the job each carrier holds. A position becomes: this job's trolley is waiting at inspection, and this is how long."
  - "Answers" — "Supervisors read it on AmIHub's live map. Your MES and ERP read it over open interfaces. AI assistants ask it over MCP."

**Section 2.** `section(vp("How it differs.", "From a scan, and from RTLS."), compare([...], rows, note))`
- Comparison (— / What you know / When you know it / The question it answers):
  - A barcode or RFID scan — Where a thing was when someone or something scanned it — At each checkpoint — "Did it pass this point?"
  - RTLS — Where a tagged thing is now — All the time, as it moves — "Where is it?"
  - Spatial intelligence — Where it is, which zone it is in, which job it holds, and for how long — All the time, with time stamps — "Where is work waiting, and for how long?"
- Note: "Each fits a different job. Where a record at each checkpoint is all you need, a scan is enough. AmIMotion is for the gaps between checkpoints."

**Section 3.** `section(vp("What location alone cannot tell you."), tiles([...], 3))`
- Points:
  - "Which job" — "A tag names the trolley, not the job on it. You link each trolley to its job, in AmIHub or from your own system."
  - "Whether work is done" — "A trolley in a zone does not prove the work there started or finished. Your MES stays in charge of every job."
  - "Why it waited" — "The map shows the wait. Why it waited is for your team to say."

**Section 4.** `section(vp("Where AmIMotion starts."), prose(...), more([...]))`
- Body:
  > AmIMotion starts with work in progress in one bay of a factory. Tagged trolleys and bins, linked to their jobs, are timed in every zone you name. You see your own waits in that bay before you decide on more.
  >
  > The same AmIHub then grows plant-wide without re-fitting the first bay. In a warehouse it times pallets and totes from dock to stock. Forklifts, tuggers and AGVs carry vehicle tags on the same anchors, so work and vehicles share one map.
- Links line: Work in progress (/solutions/wip/) · How a pilot runs (/pilot/) · Ask your floor (/use-cases/ask-your-plant/)

**FAQ.** `faq([...], "Questions about the category.")`
1. "What is industrial spatial intelligence?" — "It is the time-stamped location of what moves in a plant, joined with your zones and jobs, so people, systems and AI assistants can answer where work is and where it waits. AmIMotion builds it for factories and warehouses."
2. "How is spatial intelligence different from RTLS?" — "RTLS is the location layer: where a tagged thing is. Spatial intelligence adds the zones and the jobs, so the answer is where work waits and for how long. AmIMotion's AmIHub does both."
3. "Does spatial intelligence need AI?" — "No. A supervisor reads AmIHub's live map. AI assistants are one more way to ask it, through AmIHub's MCP server, and any change needs a person's approval."
4. "Where does AmIMotion start?" — "With work in progress in one bay: tagged carriers, linked to their jobs, timed in every zone. Then plant-wide on the same AmIHub."

**Close:** "See where location would help first." — "Six questions about how work moves in your plant. You get a plan for where to start." — Plan your first bay (/diagnostic/)

**Internal links:** /solutions/wip/, /platform/, /pilot/, /use-cases/ask-your-plant/, /diagnostic/, /products/amihub/ (first mention), /learn/association/ (on "You link each trolley to its job").

**JSON-LD notes:** Article + `DefinedTerm` (name "Industrial Spatial Intelligence", description = FAQ 1 answer, inDefinedTermSet /glossary/). `speakable` on the short answer. FAQPage from four `<details>`. BreadcrumbList: About us › What is spatial intelligence?

**Words:** about 650 (was under 250).

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P8 Group operations | 8 | Old "Three layers" alone: "Is this a slide or a product?" | Every layer names the AmIMotion part that does it | 9 |
| P1 Plant head | 7 | "Industrial Spatial / Intelligence." H1: "Another phrase." | H1 is the question; the comparison table says when a scan is enough | 9 |
| P3 IE lead | 9 | none ("Whether work is done" earned trust) | — | 9 |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| Definition | PASS | K04 section 1 and [CW] working statement; footer entity paragraph (A63–A65) |
| "down to centimetres" (Location tile) | PASS | Paired with ±10 cm and its condition in the short answer |
| Comparison table | PASS | K03 NEVER bars "RFID fails"; this compares workflows fairly and says when a scan is enough ([CW]) |
| Location cannot show job, completion or cause | PASS | K03 NEVER list, K04 section 3, V30 |
| "Link each trolley to its job, in AmIHub or from your own system" | PASS | F3 |
| "In a warehouse it times pallets and totes from dock to stock" | PASS on AMBER | [B3] where tags go, [B5] dwell; describes the same records, no outcome |
| Vehicles on the same anchors | PASS | [B3] |
| "It is built and supported in India" (old) | CUT | Correct, but off-topic on the category page; it lives on /what-is-amimotion/ |
| "Physical AI" | OUT | Once per page, in the footer (system-notes) |
| Old "Zones, jobs and rules" | REWORD | "rules" cut (F4: no source says what a rule does) |
| No digital twin, no bottleneck prediction | OUT | K03 NEVER, C18 |

**Open facts used:** O2 (no time limit or alert in "Context"). 
**Blocked:** none.
