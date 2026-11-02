# /solutions/wip/  (nav: Work in progress)

Generator: `p_solutions.py`, `write("/solutions/wip/", TITLE, DESCRIPTION, [...])`.

- **Title tag:** WIP visibility: see where work waits
- **Meta description (142):** AmIMotion shows where work in progress waits, and for how long. Tagged trolleys are timed in zones you name and linked to the jobs they carry.

## Page

### head(...)
- **H1:** "Find the job." / soft: "Time the wait."
- **Lede:** A tag on each trolley tells AmIHub where it is. Link the trolley to its job, and you see which work waits where.
- **short:** WIP visibility means knowing where each job is and how long it has waited, during the shift. AmIMotion gives it in three steps. An AmIGo tag rides on each trolley, bin or pallet. AmIMo anchors place it down to ±10 cm, depending on your floor. AmIHub notes when it enters and leaves each zone you name, and links it to the job it carries. Its wait then counts as that job's wait.
- **trail:** [("Where it helps", "/solutions/"), ("Work in progress", None)]
- **links line:** How waits are timed (/learn/dwell-time/) · Which job is on the trolley? (/learn/association/)
- **media:** `slot(brief, "wide", alt)`, P-WIP-01. Model hall, camera A, `--t 0.0 --state after`, border `0.02,0.55,0.18,0.78` (16:9): press 1, the main aisle and the inspection queue. The trolley leaving press 1 with its blue trail; the three queue trolleys on amber; one trolley inside the inspection zone on a blue tint. Racks, staging lane, vehicles pale.
  Alt: "A model factory floor. A trolley leaves a press along a blue line. Three trolleys queued at inspection are amber because they are waiting."

### section 1
- `vp("Tracking is the dot.", "Visibility is the wait.", lede="A dot on a map tells you where a trolley is. AmIMotion adds the two things a dot cannot: which job it holds, and how long it has waited.")`
- `tiles([...], cols=4)`:
  - **Where is the work?** AmIHub shows the trolley's place, or where it was last seen and when. Link it to a job and you see the job's place too. Without the link you still see the trolley, which already helps.
  - **Where is it waiting?** You name the zones: stations, queues, staging lanes. AmIHub notes each entry and exit, so every wait has a start and a length.
  - **What needs a look?** A named owner who acts when work waits too long. A long wait means go and look. It does not say why.
  - **What happens next?** A person checks and decides. AmIHub never closes a job on location alone.

### section 2
- `vp("Tag. Locate. Link.", "Then time the wait.")`
- `steps([...])`:
  1. **Tag.** An AmIGo tag screws or sticks onto the trolley. It stays with the trolley through every job it carries.
  2. **Locate.** AmIMo anchors on your columns hear the tag as it moves. AmIHub places it down to ±10 cm, depending on your floor.
  3. **Link.** Link the trolley to its job in AmIHub, or from your own system. Nobody scans it along the way.
  4. **Time.** AmIHub notes each zone entry and exit as it happens. Supervisors see each wait live, during the shift, not at the next morning's review.

### section 3
- `vp("Queued is not finished.")`
- `split(None, paras, (), media, flip=True)`:
  - "AmIHub says where a trolley was seen, and when. Whether the work on it is done comes from your MES or your people."
  - "Why it waited is for your team to say. The map never claims more than it saw."
  - extra: `more([("How waits are timed", "/learn/dwell-time/")])`
  - media P-WIP-02: the homepage screen 3 still, cut at 4:3 (camera A, `--state after`, isolate pass as homepage screen 3): one trolley inside the inspection zone on blue, three in the queue on amber, one pallet in the staging lane on amber. No labels, no numbers. Alt: "A model inspection station. One trolley is being worked on. Three trolleys in the queue and one pallet in a staging lane are amber because they are waiting."

### section 4
- `vp("Your MES stays", "in charge of every job.", lede="AmIHub connects to your MES, ERP and WMS through open REST, MQTT, WebSocket and omlox hub interfaces. Each system keeps what it is best at.")`
- `tiles([...], cols=3)`:
  - **AmIHub keeps.** Where each trolley is, when it entered and left each zone, and how long it waited. AmIHub sends each entry and exit to any system you name, as it happens.
  - **Your MES or ERP keeps.** The job, its route and its status. It stays the record for every job.
  - **Agreed together.** How a job gets onto a trolley, and when it comes off. How to count a wait that runs past shift end. Who acts when work waits too long.

### section 5
- `vp("Start with one flow", "in one bay.", lede="An AmIMotion pilot follows one flow in one bay or line. You choose the flow.")`
- `tiles([...], cols=3)`:
  - **One flow.** Pick the trolleys, the bay and a few zones. AmIMotion surveys that floor and plans the anchors.
  - **Today's waits first.** The pilot times today's waits first, over a window you choose. That is your baseline.
  - **Prove it, then decide.** You see your own waits in one bay, and prove the numbers, before you decide on more. Then grow plant-wide on the same AmIHub.
- `more([("How a pilot runs", "/pilot/"), ("Measure before you claim", "/learn/pilot-baseline/"), ("Your pilot on one page", "/tools/pilot/")])`

### section 6
- `faq([...], "Questions teams ask first.")`
  - **Which companies offer real-time WIP tracking for manufacturing?** Several RTLS makers do, with UWB, BLE or RFID. AmIMotion, from Bengaluru, India, focuses on WIP visibility with UWB. It locates tagged trolleys down to ±10 cm, depending on the floor, times them in zones you name and links them to the jobs they carry.
  - **How can I see where work in progress is waiting on my shop floor?** Tag the trolleys, name the zones where work queues, and note every entry and exit. AmIHub shows how long each trolley has waited in each zone, while it is still waiting.
  - **What is the difference between WIP visibility and WIP tracking?** Tracking shows where a carrier is. Visibility adds which job it holds and how long it has waited. That needs zones and a link from trolley to job.
  - **Can we start without connecting our MES?** Yes. Start with trolley location and wait times in AmIHub. Make the job link a pilot step before you call any result job-level.
  - **Does AmIMotion track individual parts?** No. The AmIGo tag goes on the trolley, bin or pallet that carries the parts. Linked to a job, the trolley's wait counts as that job's wait.

### close
- Default for /solutions/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/learn/dwell-time/, /learn/association/, /pilot/, /learn/pilot-baseline/, /tools/pilot/, /diagnostic/. FAQ answer "Can we start without connecting our MES?" may link /learn/value-without-mes/ ("Value without an MES") if Search wants it. Breadcrumb to /solutions/.

## JSON-LD notes
- WebPage with `description` = meta; `about` = Organization; `mentions` AmIGo, AmIMo, AmIHub product @ids.
- BreadcrumbList: Home > Where it helps > Work in progress.
- HowTo is **not** used for the steps (it is a product mechanism, not a task the reader performs). FAQPage from the five rows.

## Checks
- **Job:** P2 and P3 ask "can I see where WIP waits, and is it honest about what location can't tell me?" Next: the pilot pages, then Plan your first bay. Reference: Waymo's safety hub for definitions next to every number; Linear's feature pages for one mechanism per screen.
- **Drafts:** A (plain-English editor) kept the old four questions and pilot block, with truth fixes. B (engineer voice) led with a definitions table (zone, entry, exit, wait). **Merged:** A's order, B's "Agreed together" column. The table made P2 read twice; the four questions did not.
- **Readers:** P2 production control 8 → 9 (lost on old "an agreed carrier-to-job association": now "Link the trolley to its job"). P3 IE lead 8 → 9 (asked how unfinished visits count: "How to count a wait that runs past shift end" is now in Agreed together; the default itself is O7, logged). P6 MES owner 8 → 9 (asked who owns status: "It stays the record for every job.").
- **Claims:** "AmIHub never closes a job on location alone" PASS (K03 NEVER: location does not prove completion; it states the absence). Old step "Act early ... Nothing is closed on location alone" merged into it. Old "Any automation comes later, with its own approval" STOP (a plan shown as a promise): cut. "AmIHub sends each entry and exit to any system you name, as it happens" PASS (F2). "A named owner who acts when work waits too long" PASS (system-notes ruling for O2). "AmIMotion surveys that floor and plans the anchors" PASS ([B4], [B8]). Old "Measure tag identity, position quality, freshness and what people did differently" ([CW] acceptance, a proposal) REWORD to the homepage baseline line (V78). Old FAQ "±10 cm in 3D" REWORD to fixed wording.
- **Open facts used:** O2 safe line, O7 safe line. Not O1, O3, O4, O6.
- **Words:** about 720 visible.
