# /industries/manufacturing/  (nav: Manufacturing, line "Bays, lines and inspection")

Generator: `p_solutions.py`, IND row "manufacturing".

- **Title tag:** UWB RTLS for manufacturing plants
- **Meta description (148):** AmIMotion for manufacturing plants: find trolleys, bins and fixtures between cells, and see where each job waits and for how long, during the shift.

## Page

### head(...)
- **H1:** "Work waits between cells." / soft: "Now you see where."
- **Lede:** Your MES knows the job. Between scans, nobody knows where its trolley stands. AmIMotion shows you, and how long it has waited.
- **short:** AmIMotion is spatial intelligence for manufacturing plants. AmIGo tags ride on the trolleys, bins and kit racks that carry work between cells. AmIMo anchors place each one down to ±10 cm, depending on your floor. AmIHub notes when it enters and leaves each station and queue, and links it to the job it carries. Your MES stays in charge of every job.
- **trail:** [("Industries", "/industries/"), ("Manufacturing", None)]
- **links line:** Work in progress (/solutions/wip/) · Plan your first bay (/diagnostic/)
- **media:** `slot(brief, "wide", alt)`, P-MFG-01. Model hall, camera A, `--state after`, border `0.02,0.60,0.18,0.82` (16:9): both presses, the main aisle and the inspection queue. Trolley leaving press 1 on its blue trail, the fixture's short blue line at the cross aisle, three queue trolleys on amber. Racks and vehicles pale.
  Alt: "A model press line. Blue lines show where tagged trolleys and a fixture went. Three trolleys waiting at inspection are amber."

### section 1
- `vp("Good first flows", "on a plant floor.", lede="An AmIMotion pilot follows one flow in one bay or line. These three are clear to scope and quick to read on the map.")`
- `tiles([...], cols=3)`:
  - **Work between operations.** Trolleys between machining and assembly, timed in every queue. AmIHub shows which job waits where.
  - **Line-side supply.** Where the next kit, bin or tugger train is, and how long it has waited near the line.
  - **Shared fixtures and gauges.** Which cell has the fixture now, and which had it before. AmIHub keeps the history.

### section 2
- `vp("Inspection is", "where queues hide.")`
- `split(None, paras, (), media)`:
  - "Trolleys queue at inspection, rework and shared stations. AmIHub times each one in the queue and at the station, so a long queue shows while it is still long."
  - "Before the pilot starts, we agree how to count a wait that runs past shift end. We also agree who on your team acts when work waits too long."
  - "Being in a zone does not prove work started or finished. AmIHub says where and when. Your MES and your people say the rest."
  - extra: `more([("How waits are timed", "/learn/dwell-time/")])`
  - media P-MFG-02: the homepage screen 3 still at 4:3 (inspection station, one trolley on blue inside, three queued on amber). Alt: the homepage screen 3 alt.

### section 3
- `vp("Your MES stays", "in charge.", lede="AmIHub adds where each trolley is and how long it has waited. Jobs, routes and status stay in your MES or ERP, which connect through open REST, MQTT, WebSocket and omlox hub interfaces.")`
- `stats([...])`:
  - **±10 cm** · Down to, per AmIGo tag · With AmIMo anchors. Depends on your floor.
  - **3 to 8 m** · AmIMo anchor height · On a column or wall, recommended.
  - **About 50 m** · Reach of each anchor · In clear line of sight. Racking and steel change it.
  - **1 to 3 years** · AmIGo battery · Depending on use.
- `more([("Which job is on the trolley?", "/learn/association/"), ("Specifications", "/specs/")])`

### section 4
- `vp("Steel, presses", "and racking.")`
- `split(None, paras, (), still("amimo"), flip=True)`:
  - "A plant floor is hard on radio. UWB's wide bandwidth separates the direct path from reflections off steel."
  - "AmIMotion surveys your floor and sets the anchor count. Before the pilot, we agree the hard spots to test: a trolley at a zone edge, a tag hidden by its load, two cells side by side."
  - "Each AmIMo anchor needs only power, from DC or PoE. It syncs over the air and sends its data to AmIHub over Wi-Fi. Ethernet is also an option."
  - extra: `more([("How it locates a tag", "/technology/")])`
  - Picture: CAD still `amimo` (amimo_rj45.png). Alt: "The AmIMo anchor, a dark grey box with a network port."

### section 5
- `faq([...], "Questions plants ask first.")`
  - **What is the best indoor positioning system for a manufacturing plant in India?** The one that answers your floor's question at the accuracy it needs, measured on your floor. AmIMotion, from Bengaluru, offers UWB positioning down to ±10 cm with AmIMo anchors, depending on the floor. Anchors need only power and sync over the air, and local engineers come to your site.
  - **Which RTLS vendors track carriers and WIP on an assembly line in India?** Plants compare global RTLS makers with Indian ones. AmIMotion designs and builds its UWB tags, anchors and AmIHub software in India, and focuses on WIP visibility. See the guide to UWB RTLS in India.
  - **Can AmIMotion tell which job is on a trolley?** Through a link, not the radio. The tag names the trolley. You link the trolley to its job in AmIHub, or from your own system.
  - **Does UWB work around machining centres and racking?** UWB's wide bandwidth separates the direct path from reflections off steel. AmIMotion sets the anchor count from a survey of your floor, and the pilot tests the hardest spots.
  - **Does AmIMotion track people?** A pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy.

### close
- Default for /industries/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/solutions/wip/, /learn/dwell-time/, /learn/association/, /specs/, /technology/, /learn/uwb-rtls-india/ (FAQ 2, link text "UWB RTLS in India"), /diagnostic/.

## JSON-LD notes
- WebPage, `description` = meta, `audience` BusinessAudience "Manufacturing plants".
- BreadcrumbList: Home > Industries > Manufacturing.
- FAQPage, five rows. The figures are not marked up as Product properties here (they live on /specs/).

## Checks
- **Job:** P1 plant head, P2 and P5 ask "does this fit a plant like mine, with steel and inspection queues?" Next: Work in progress, then Plan your first bay. Reference: Formlabs industry pages (one industry, its own pictures, real specs with conditions). We beat it by putting every figure's condition in the same row.
- **Drafts:** A (factory-floor voice) led with inspection queues. B (engineer voice) led with steel and the survey. **Picked A's order** (the buyer's problem before the radio, Head of Words rule), with B's steel section as section 4.
- **Readers:** P1 plant head 8 → 9 (lost on "Find work between cells": not a sentence he would say; the new H1 is). P3 IE lead 8 → 9 (shift-end count added). P5 OT engineer 8 → 9 (asked for the hard cases and the cable story: section 4).
- **Claims:** "we agree the hard spots to test" PASS on AMBER (a scoping step like V80; [CW] lists the cases as a proposal, so the page commits only to agreeing them). Old "anchors without data cabling" REWORD to "need only power and sync over the air" (C20). "Ethernet is also an option" PASS (F8; release check: /specs/ carries the [B4] backhaul row). Figures PASS with conditions (V52, V54, V59, V61). "Indian ones" makes no ranking. No "automotive" anywhere, including the FAQ: the panel question says "automotive"; the page answers it as "manufacturing" per the founders.
- **Open facts used:** O2 and O7 safe lines, O3 safe line, O8/O9 not touched beyond "Ethernet is also an option". Not O1, O4, O6.
- **Words:** about 700 visible.
