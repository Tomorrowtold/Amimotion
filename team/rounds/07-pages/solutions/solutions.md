# /solutions/  (nav: Where it helps)

Generator: `p_solutions.py`, `write("/solutions/", TITLE, DESCRIPTION, [...])`. Blocks named as in `lib.py`.

- **Title tag:** Where AmIMotion helps: WIP, tools and vehicles
- **Meta description (132):** AmIMotion shows where work waits and where tagged trolleys, tools and vehicles are, on one live map. Start with one flow in one bay.

## Page

### head(...)
- **H1:** "Two questions." / soft: "One system."
- **Lede:** Where is it? How long has it waited? AmIMotion answers both, for anything you tag.
- **short:** AmIMotion is spatial intelligence for factories and warehouses. It answers two questions on one live map in AmIHub. Where is work waiting, and for how long? And where is the trolley, tool or forklift someone needs right now? AmIGo tags ride on what moves. AmIMo anchors on your columns hear them. AmIHub places each tag down to ±10 cm. How close depends on your floor.
- **trail:** [("Where it helps", None)]
- **links line:** Plan your first bay (/diagnostic/)
- **media:** `slot(brief, "wide", alt)`, P-SOL-01. Model hall, camera A (build_hall.py, `--t 0.0 --state after`), border crop `0.05,0.95,0.25,0.80` at 16:9: the press line, the main aisle and the inspection queue on the left, the racks and staging lane on the right. Full after-state colour: blue trails behind the tugger train, forklift, AMR and the trolley leaving press 1; three trolleys in the queue and one pallet in the staging lane on amber.
  Alt: "A model factory floor from above. Blue lines show where tagged trolleys and vehicles went. Three trolleys at inspection and one pallet in a staging lane are amber because they are waiting."

### section 1
- `vp("Start with the question", "your team asks most.", lede="Most floors start with one of these two. Both run on the same AmIGo tags, AmIMo anchors and AmIHub, so adding the second needs no new system.")`
- `cards([...], cols=2)`:
  1. /solutions/wip/ · **Work in progress** · "See which trolley waits where, and for how long, linked to the job it carries."
     Picture P-SOL-02: camera A, `--state after`, border `0.05,0.50,0.20,0.62` (4:3): inspection station and its queue. One trolley inside the station zone on a blue tint, three in the queue on amber, a short blue trail leading in. Everything else pale. Alt: "A model inspection station. Three trolleys in its queue are amber because they are waiting."
  2. /solutions/assets/ · **Tools and vehicles** · "Find fixtures, tool carts, forklifts and AMRs from a screen, with when each was last seen."
     Picture P-SOL-03: camera A, `--state after`, border `0.20,0.75,0.55,0.97` (4:3): the back aisle. The tool cart, the fixture and the AMR in colour on blue, each with its trail ending where it stands. Everything else pale. Alt: "A model factory floor. A tool cart, a fixture and a robot are marked blue where they stopped."

### section 2
- `vp("The same map,", "for each kind of floor.")`
- `tiles([...], cols=3)`:
  - **Manufacturing.** AmIMotion follows trolleys and bins between cells, lines and inspection. Link each trolley to its job, and its wait counts as that job's wait.
  - **Warehousing.** AmIMotion times tagged pallets and totes from the dock to the staging lane to the rack. Forklifts and tuggers show on the same map.
  - **Robotics and AMRs.** AmIMotion puts AMRs and the trolleys they tow on one map with everything else you tag. Your fleet software still drives them.
- `more([("Manufacturing", "/industries/manufacturing/"), ("Warehousing", "/industries/warehousing/"), ("Robotics and AMRs", "/industries/robotics/")])`

### section 3
- `vp("Four jobs,", "start to finish.", lede="Each one starts with a walk someone takes today. Each one ends with an answer in AmIHub.")`
- `links([...])`:
  - /use-cases/find-the-asset/ · Where is that trolley? · "Find it from a screen."
  - /use-cases/station-to-station/ · Station to station · "Every entry and exit, timed."
  - /use-cases/amr-hand-off/ · The hand-off · "What the robot brought, and when."
  - /use-cases/ask-your-plant/ · Ask your floor · "AI assistants and MCP."

### section 4
- `vp("What AmIMotion leaves", "to your systems.", lede="AmIMotion adds where and how long. It does not take over the records you already trust.")`
- `tiles([...], cols=3)`:
  - **Your MES or WMS keeps the job.** AmIHub adds where its trolley or pallet is and how long it has waited. Orders, routes and status stay where they are.
  - **Your team says why.** AmIHub shows that a load waited and for how long. Why it waited is for your team to say.
  - **Your fleet software drives.** AmIMotion locates robots and vehicles. It does not route, dispatch or stop them.

### section 5
- `faq([...], "Questions teams ask first.")`
  - **What does AmIMotion solve on a factory floor?** Two things. AmIMotion shows where work in progress waits, and for how long, by timing tagged trolleys and pallets in zones you name. It also finds tagged trolleys, tools and vehicles from a screen, with where and when each was last seen.
  - **Do we have to choose one?** No. Both run on the same AmIGo tags, AmIMo anchors and AmIHub. Start with one flow in one bay. Then grow plant-wide on the same AmIHub, without re-fitting the first bay.
  - **Does AmIMotion track people?** A pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy.

### close
- Default for /solutions/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay (/diagnostic/).

## Internal links
/solutions/wip/, /solutions/assets/, /industries/manufacturing/, /industries/warehousing/, /industries/robotics/, /use-cases/find-the-asset/, /use-cases/station-to-station/, /use-cases/amr-hand-off/, /use-cases/ask-your-plant/, /diagnostic/ (head links line and close). All link text is the nav label.

## JSON-LD notes
- WebPage (CollectionPage) with `description` = the meta description; `about` the Organization @id.
- BreadcrumbList: Home > Where it helps.
- FAQPage from the three `<details>` rows (build.py reads them).
- ItemList of the two cards (Work in progress, Tools and vehicles) in card order.

## Checks
- **Job:** P1 and P2 land from the nav and need to know which problem fits them, then go one level down. Reference: Linear's and Stripe's solution hubs: one-line answer, then two or three doors, nothing else. We beat them by saying what we leave alone (section 4), which no hub in the library does.
- **Drafts:** A (Words, factory-floor voice) led with the four use cases. B (Words, executive voice) led with the two questions and the "what we leave alone" block. **Picked B**, with A's use-case list as section 3: the two questions match the homepage hero and give a plant head the choice in one screen.
- **Readers (cold, 1 to 10):** P1 plant head 8 → 9 (lost on "Analytics, dashboards, more": cut; the hub now names only what ships). P2 production control 9 → 9. P4 supervisor 8 → 9 (old card "Tools, vehicles and carriers" did not match the nav; now "Tools and vehicles").
- **Claims:** "spatial intelligence for factories and warehouses" PASS (V2). "down to ±10 cm. How close depends on your floor." PASS (V61, V62). "without re-fitting the first bay" PASS ([B8], V85). "does not route, dispatch or stop them" PASS (K03 NEVER on control). "Why it waited is for your team to say." PASS (V30). Tagging people lines PASS exact (V82). Old "±10 cm in 3D" short answer REWORD to the fixed wording.
- **Open facts used:** O3 safe line only. No O1, O2, O4, O6.
- **Words:** about 470 visible. Brand named in every passage.
