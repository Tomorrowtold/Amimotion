# /industries/robotics/  (nav: Robotics and AMRs, line "Robots and carriers on one map")

Generator: `p_solutions.py`, IND row "robotics".

- **Title tag:** UWB location for robotics and AMR floors
- **Meta description (150):** AmIMotion puts AMRs, AGVs, forklifts and the trolleys they move on one live map, with a time for every arrival. Your fleet software still drives them.

## Page

### head(...)
- **H1:** "Your robots know where they are." / soft: "Do your trolleys?"
- **Lede:** AMRs keep their own map. Forklifts, tuggers and the trolleys they tow are not on it. AmIMotion puts all of them on one.
- **short:** On robotics floors, AmIMotion gives every tagged AMR, AGV, forklift and trolley one shared map and one time-stamped history. AmIMo anchors place each AmIGo tag down to ±10 cm, depending on the floor. AmIHub notes when each one enters a zone and leaves it. Your fleet software still drives, routes and dispatches the robots.
- **trail:** [("Industries", "/industries/"), ("Robotics and AMRs", None)]
- **links line:** The hand-off (/use-cases/amr-hand-off/)
- **media:** `slot(brief, "wide", alt)`, P-ROB-01. Model hall, camera A, `--state after`, border `0.05,0.95,0.60,0.97` (16:9): the back aisle. The AMR on its blue trail, towing one trolley (needs the towed-trolley addition listed in README), the bins and tool cart ahead of it, the tugger train crossing at the main aisle. Front half of the hall pale.
  Alt: "A model back aisle from above. A robot tows a trolley along a blue line. A tugger crosses at the main aisle."

### section 1
- `vp("A shared map,", "beside the robots' own.", lede="A robot's map covers that maker's robots. AmIHub covers everything you tag, on a map that runs inside your plant.")`
- `tiles([...], cols=3)`:
  - **Mixed traffic.** AMRs, AGVs, forklifts, tuggers and trolleys on one AmIHub map. Each vehicle carries an AmIGo vehicle tag, with a vehicle-powered option.
  - **Hand-offs.** Tag the robot and the trolley. When both arrive in a drop-off zone, AmIHub records the time and the place. Nobody scans it.
  - **Waits at pick-up and drop-off.** AmIHub times each pick-up and drop-off zone, so you see where robots and trolleys wait.

### section 2
- `vp("AmIMotion locates.", "Your fleet software drives.", lede="AmIMotion does not route, dispatch or stop a robot. It shows where the robot and its load are, and when they arrived.")`
- `tiles([...], cols=2)`:
  - **AmIMotion keeps.** Where each robot, vehicle and trolley is, its trips over any time window, and every zone entry and exit. AmIHub sends those events to any system you name, as they happen.
  - **Your fleet software keeps.** Driving, routing, dispatch, charging and safety. Any deeper link with it is scoped for your site.

### section 3
- `vp("AI assistants can ask", "the same map.")`
- `split(None, paras, (), media)`:
  - "AmIHub has an MCP server built in. An AI assistant can ask which trolleys have waited at a drop-off point, and answer from AmIHub's live map."
  - "Asking changes nothing. Any change, such as raising a work order in AmIHub, needs a person's approval. We show it live on a call."
  - extra: `more([("Ask your floor", "/use-cases/ask-your-plant/")])`
  - media P-ROB-02: camera A, `--state after`, isolate pass: everything pale except one drop-off zone at the line end of the back aisle, where two trolleys stand on amber. No answer card, no data. Alt: "A model floor, all pale except two trolleys at a drop-off point, marked amber because they are waiting."

### section 4
- `faq([...], "Questions robotics teams ask first.")`
  - **Why not use each robot's own localisation?** A robot's own map covers that maker's robots. AmIHub also covers forklifts, tuggers and trolleys, on one map that runs inside your plant.
  - **How precise is a robot's position on AmIHub?** The same as any AmIGo tag: down to ±10 cm, with AmIMo anchors. How close depends on your floor.
  - **Does AmIMotion control or dispatch robots?** No. Your fleet software drives, routes and dispatches. AmIMotion shows where the robot and its load are.
  - **Do we need to integrate with the robot?** To locate it, the robot only needs a tag. Any deeper link with your fleet software is scoped for your site.
  - **Is the MCP server available today?** It is built into AmIHub, and we show it live on a call. The setup for your site is confirmed when we scope it.

### close
- Default for /industries/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/use-cases/amr-hand-off/, /use-cases/ask-your-plant/, /diagnostic/.

## JSON-LD notes
- WebPage, `description` = meta, `audience` BusinessAudience "Robotics and AMR operators".
- BreadcrumbList: Home > Industries > Robotics and AMRs.
- FAQPage, five rows.

## Checks
- **Job:** the robotics or intralogistics lead and P8 ask "why add a second location layer next to my fleet's?" Next: The hand-off. Reference: Anduril's product pages (terse purpose line, software as the brain). We beat it by saying in one heading what the product does not do.
- **Drafts:** A (headline writer) "Robots, vehicles, people. One map." B (executive voice) "Your robots know where they are. Do your trolleys?" **Picked B**: A was a tricolon (banned) and named people, which the pilot does not tag. B states the gap in the buyer's own terms.
- **Readers:** P8 group operations 8 → 9. P5 OT engineer 8 → 9 (asked "will it fight the fleet system?": section 2). P10 EHS 7 → 9 (lost on old "badges" and "people" on the map with no policy: cut).
- **Claims:** Old "Tag robots, forklifts, trolleys and people" and "badges" REWORD: people removed (O3; the WIP pilot scope is carriers). Old "Ready for what comes next" STOP (plans shown as promise; K03 AMBER: Physical AI as direction only): cut. "on a map that runs inside your plant" PASS ([B5] on-premise). "Any deeper link ... scoped for your site" PASS (today's ruled wording). MCP lines PASS exact from the homepage (V36 to V43). "charging" in fleet keeps: a negative, claims nothing for AmIMotion. No "runs in robotics facilities".
- **Open facts used:** O3 avoided by removing people. Not O1, O2, O4, O6.
- **Words:** about 520 visible.
