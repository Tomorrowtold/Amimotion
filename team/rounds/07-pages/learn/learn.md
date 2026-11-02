# /learn/

**Title tag:** Field guides: RTLS, UWB and WIP visibility | AmIMotion
**Meta description:** Plain answers on factory location: UWB vs RFID, anchor counts, accuracy tests, dwell time, job links and choosing a UWB RTLS in India. By AmIMotion.
**H1:** Field guides to factory location. / One question per page.
**Lede:** Fourteen short guides from AmIMotion. Each answers a question plants ask after a demo. No sign-up.

## Head

**The short answer:**

AmIMotion's field guides answer the questions plants ask about real-time location: how UWB compares with BLE and RFID, how many anchors a floor needs, how to test accuracy, how dwell time is measured and how to see where work in progress waits. Every figure carries its condition. AmIMo anchors locate AmIGo tags down to ±10 cm in 3D, depending on the site.

Picture: none. An index reads fastest as words; every guide below carries its own picture or none.

## Four quick answers (tiles, cols=2)

**Is UWB accurate enough for trolleys?** Usually, when anchors are planned for the floor. AmIMotion quotes down to ±10 cm in 3D with AmIMo anchors, typical and site-dependent. [How to test it](/learn/accuracy/).

**UWB, BLE or RFID?** RFID and scans prove a trolley passed a point. BLE finds the zone. UWB, which AmIMotion uses, tells neighbouring queues apart. [Choose by the question](/learn/uwb-vs-rfid/).

**How many anchors does a floor need?** A survey decides. As a first budget, an open 5,000 m² hall on this site's 25 m planning grid needs about 15 AmIMo anchors. [What sets the count](/learn/anchor-planning/).

**Does a tag know the job on the trolley?** No. AmIMotion links each trolley to its job in AmIHub or from your own system. [Why the link matters](/learn/association/).

## The basics. (heading row, lede: Start here if real-time location is new to you.) then related links

- [What is RTLS?](/learn/rtls/): Real-time location, plainly.
- [What is omlox?](/learn/omlox/): One open hub for every location system.
- [What is WIP visibility?](/learn/wip-visibility/): Where each job is, and how long it waited.

## Choosing a system. (heading row, lede: Radios, suppliers, accuracy and anchor counts.) then related links

- [UWB, BLE or RFID?](/learn/uwb-vs-rfid/): Choose by the question you ask.
- [Scan, checkpoint or location?](/learn/alternatives/): Each answers a different question.
- [UWB RTLS in India](/learn/uwb-rtls-india/): Seven questions for any supplier.
- [How accurate is UWB?](/learn/accuracy/): Typical, best case and the hard places.
- [How many UWB anchors?](/learn/anchor-planning/): What really sets the count.

## On the floor. (heading row, lede: Waits, job links, quiet tags and AI assistants.) then related links

- [How dwell time is measured](/learn/dwell-time/): From zone entry to zone exit.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.
- [When a tag goes quiet](/learn/location-data-quality/): Last seen, never a guess.
- [AI assistants and location data](/learn/mcp-location-data/): MCP, access and approval.

## Proving it. (heading row, lede: What a pilot should measure, and when.) then related links

- [Value before the MES link](/learn/value-without-mes/): What location proves on its own.
- [Measure before you claim](/learn/pilot-baseline/): The baseline, before any tag goes on.

## More answers. (related links)

- [Questions](/faq/): Short answers about AmIMotion.
- [Glossary](/glossary/): Floor words and tech words, plainly.
- [What is spatial intelligence?](/industrial-spatial-intelligence/): The category, in one page.

## Close

Default close: "Questions about your own floor?" / [Book a call](/contact/)

## Internal links

All 14 guides, /faq/, /glossary/, /industrial-spatial-intelligence/, /contact/.

## JSON-LD notes

WebPage with speakable (h1, .short-answer), BreadcrumbList Home > Field guides, Organization. No FAQPage: the quick answers are tiles, not details, so they are not duplicated as FAQ data. Consider CollectionPage/ItemList of the 14 guides in build.py (ask Structure).

## Checks

**Job of the page.** Any buyer who arrives from search or the footer and needs the right guide fast. Next step: one guide.
**Reference.** Stripe docs and Teenage Engineering guides: an index that answers before it lists. Ours opens with four quick answers, then four groups.
**Drafts.** A: the old hub (93 words, three link lists, no answer). B: answer-first hub with four quick answers and grouped guides. Picked B: A failed the 250-word and figure-with-condition checks and answered nothing.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P2 Production manager | 7 | “Understand it. Then decide.” told me nothing about my floor. | H1 now names the page; quick answers lead. | 9 |
| P5 OT engineer | 8 | Groups by type, not by my question. | Groups now follow the buying order: basics, choosing, on the floor, proving it. | 9 |
| P8 Digital transformation | 8 | No sign of standards or AI on the index. | omlox in the basics, MCP under On the floor. | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| “about 15 AmIMo anchors” for an open 5,000 m² hall | PASS on AMBER | Labelled as this site's 25 m planning grid, first budget only; same grid as /tools/anchors/; [B4] survey caveat in the guide |

**Open facts used:** none touched. O1, O2, O3, O4 and O6 stay out.
