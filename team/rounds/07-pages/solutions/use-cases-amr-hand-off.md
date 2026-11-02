# /use-cases/amr-hand-off/

Generator: `p_solutions.py`, UC row "amr-hand-off". Head media changes from `film(2)` to a model-hall still. No `tone="dark"`.

- **Title tag:** AMR hand-off: see what a robot brought
- **Meta description (152):** Tag the AMR and the trolley it tows. AmIMotion shows both moving together and records where and when they arrive, with no scan. Your fleet still drives.

## Page

### head(...)
- **H1:** "The robot brings a trolley." / soft: "AmIHub records the arrival."
- **Lede:** Tag the AMR and the trolley it tows. AmIMotion shows them move together, and where they arrive.
- **short:** With AmIMotion, an AMR and the trolley it tows each carry an AmIGo tag. AmIMo anchors place both down to ±10 cm, depending on your floor. AmIHub shows them move together and records when they arrive in the drop-off zone. Nobody scans the trolley. Your fleet software still drives, routes and dispatches the robot.
- **trail:** [("Use cases", "/use-cases/"), ("The hand-off", None)]
- **links line:** Robotics and AMRs (/industries/robotics/)
- **media:** `slot(brief, "wide", alt)`, P-UC2-01. Model hall, camera A, `--state after`, isolate pass, border `0.05,0.95,0.60,0.97` (16:9). Everything pale except the AMR and the one trolley it tows (towed-trolley addition, README), both on blue, their two trails running side by side down the back aisle and ending in the drop-off zone outline at the line end.
  Alt: "A model back aisle. A robot and the trolley it tows are marked blue. Their two blue lines run side by side and end at a drop-off point."

### section 1
- `vp("Today,", "and with AmIMotion.")`
- `tiles([...], cols=2)`:
  - **Today.** Robots move material, but the plant knows what a robot brought only if someone scanned it. A missed scan means a wrong record.
  - **With AmIMotion.** The robot tows a tagged trolley from pick-up to the line. Both tags move together on AmIHub's map. The drop-off zone records the arrival time.

### section 2
- `vp("From pick-up", "to drop-off.")`
- `steps([...])`:
  1. **Pick-up.** The robot's tag and the trolley's tag enter the pick-up zone. AmIHub notes the time.
  2. **Together.** Both tags move along the aisle together, on one map.
  3. **Drop-off.** Both enter the drop-off zone. AmIHub records where and when they arrived.
  4. **Wait.** The robot leaves. The trolley waits at the line, and its wait shows live, during the shift.

### section 3
- `vp("AmIMotion watches.", "It does not drive.", lede="AmIMotion adds a second record beside your fleet's: where each robot and its load went, and when.")`
- `tiles([...], cols=2)`:
  - **AmIMotion keeps.** Where the robot and its trolley are, when they entered and left each zone, and their trips over any time window. AmIHub sends each event to any system you name, as it happens.
  - **Your fleet software keeps.** Driving, routing, dispatch and safety. Any deeper link with it is scoped for your site.

### section 4
- `faq([...], "Common questions.")`
  - **Do we need to integrate with the robot?** To locate it, the robot only needs an AmIGo tag. Any deeper link with your fleet software is scoped for your site.
  - **Does AmIMotion dispatch the robot?** No. Your fleet software drives, routes and dispatches. AmIMotion shows where the robot and its load are.
  - **Can forklifts and tuggers hand off the same way?** Yes. A forklift or tugger with an AmIGo vehicle tag shows on the same AmIHub map, and its arrivals are timed the same way.
  - **Does AmIHub know which job the trolley carries?** Only through a link. You link the trolley to its job in AmIHub, or from your own system. The robot's tag says where, not what.

### section 5
- `vp("Other jobs,", "same tags.")`
- `links([...])`: Where is that trolley? · Station to station · Ask your floor, each with its one line.

### close
- Default for /use-cases/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/industries/robotics/, /learn/association/ (FAQ 4, "Which job is on the trolley?"), the three other use cases, /diagnostic/.

## JSON-LD notes
- WebPage, `description` = meta. VideoObject removed while film 2 is held.
- BreadcrumbList: Home > Use cases > The hand-off.
- FAQPage, four rows.

## Checks
- **Job:** the intralogistics or robotics lead asks "can I prove what a robot delivered without another scan?" Next: Robotics and AMRs, then Plan your first bay. Reference: Waymo's "what the car sees" (show the record, not the robot). We beat it with the four-step record a buyer can check on their own floor.
- **Drafts:** A (film-script writer) kept today's page. B (engineer voice) added the four-step record and the keeps split. **Merged**: B's structure with A's before and after. Page goes from about 170 to about 450 words.
- **Readers:** P5 OT engineer 8 → 9 (asked "does it touch the robot's controls?": section 3). P6 MES owner 8 → 9 (asked how the job is known: FAQ 4). P8 group operations 8 → 9.
- **Claims:** Old "robots, forklifts, trolleys and people share one live map" REWORD: people removed (O3). Old FAQ "How do you track forklifts and AMRs indoors ..." moved to /solutions/assets/ (one canonical answer). "Both tags move together" PASS (observed, no automatic association claimed; K03 NEVER on location alone naming the job). "does not drive" PASS (K03 NEVER on robotics control).
- **Open facts used:** O10 safe line. Not O1, O2, O3, O4, O6.
- **Words:** about 450 visible.
