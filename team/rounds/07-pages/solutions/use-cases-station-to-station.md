# /use-cases/station-to-station/

Generator: `p_solutions.py`, UC row "station-to-station". Head media changes from `film(3)` to a model-hall still. No `tone="dark"`.

- **Title tag:** Time work station to station with UWB
- **Meta description (148):** AmIMotion times each tagged trolley at every station zone, from kitting to dispatch, and sends each entry and exit to your MES or ERP as it happens.

## Page

### head(...)
- **H1:** "Each station is a zone." / soft: "Each move gets a time."
- **Lede:** Your ERP changes a job's status when someone scans or types. AmIHub times the trolley at every station in between.
- **short:** With AmIMotion, each station is a zone you name in AmIHub: kitting, machining, assembly, dispatch. An AmIGo tag rides on each trolley, and AmIMo anchors place it down to ±10 cm, depending on your floor. AmIHub notes when the trolley enters and leaves each zone, and sends each entry and exit to your MES or ERP as it happens.
- **trail:** [("Use cases", "/use-cases/"), ("Station to station", None)]
- **links line:** Work in progress (/solutions/wip/) · How waits are timed (/learn/dwell-time/)
- **media:** `slot(brief, "wide", alt)`, P-UC3-01. Model hall, camera A, `--t 6.2 --state build`, border `0.0,1.0,0.22,0.78` (16:9). The moment the checkpoint ticks have joined into lines: at the three checkpoint desks the short blue ticks, and between them the trolleys' blue lines now continuous. The fixture, tool cart and vehicles not yet in colour.
  Alt: "A model factory floor. Short blue marks at three checkpoint desks have joined into continuous blue lines that show each trolley's full path."

### section 1
- `vp("Today,", "and with AmIMotion.")`
- `tiles([...], cols=2)`:
  - **Today.** Status lives in the ERP. It changes only when someone scans at a desk or types. Between scans, the order is out of sight.
  - **With AmIMotion.** Kitting, machining, assembly and dispatch are zones in AmIHub. Each time the trolley enters or leaves one, AmIHub records the time and sends the event on.

### section 2
- `vp("Entering a zone", "is not finishing a step.", lede="AmIHub records where a trolley was and when. Whether a step is done comes from your MES or your people.")`
- `tiles([...], cols=3)`:
  - **What AmIHub records.** Each zone entry and exit, its time, and how long the trolley stayed.
  - **What your MES records.** The job, its route and its status. AmIMotion adds the times in between.
  - **What you agree first.** Which zones count, how to count a wait that runs past shift end, and who acts when work waits too long.

### section 3
- `vp("Events your systems", "can use.")`
- `split(None, paras, (), media)`:
  - "AmIHub sends each entry and exit over open REST, MQTT, WebSocket and omlox hub interfaces. The connector for your ERP or MES is confirmed when we scope the pilot."
  - "Link each trolley to its job in AmIHub, or from your own system. Its wait then counts as that job's wait."
  - extra: `more([("Which job is on the trolley?", "/learn/association/"), ("For developers", "/developers/")])`
  - media P-UC3-02: camera A, `--state after`, isolate pass, border `0.02,0.50,0.20,0.85` (4:3): one trolley's whole path from press 2, past checkpoint desk 1, into the inspection queue, as a single blue line. Everything else pale. Alt: "A model floor, pale except one trolley's blue path from a press to the inspection queue."

### section 4
- `faq([...], "Common questions.")`
  - **Which ERP or MES does it work with?** AmIHub sends events over REST, MQTT, WebSocket and the omlox hub interface. The connector for your system is confirmed when we scope the pilot.
  - **Does entering a zone mean the step is done?** No. AmIHub records a time and a place. Whether a step is done comes from your MES or your people.
  - **What if a trolley sits too long?** AmIHub records the time in each zone, so a long wait shows while it is still waiting. Who on your team acts when work waits too long is agreed before the pilot.
  - **How is dwell time measured in manufacturing?** With AmIMotion, from the moment a tagged trolley enters a zone to the moment it leaves. AmIHub keeps both times, so every wait has a start and a length.
  - **UWB or RFID for this?** An RFID read records a pass at a gate. With AmIMotion, a UWB tag is placed as it moves, so AmIHub sees the time between gates too. Compare the two on one workflow of yours.

### section 5
- `vp("Other jobs,", "same tags.")`
- `links([...])`: Where is that trolley? (/use-cases/find-the-asset/) · The hand-off (/use-cases/amr-hand-off/) · Ask your floor (/use-cases/ask-your-plant/), each with its one line as on the find-the-asset page.

### close
- Default for /use-cases/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/solutions/wip/, /learn/dwell-time/, /learn/association/, /developers/, /learn/uwb-vs-rfid/ (FAQ 5, link text "UWB vs RFID"), the three other use cases, /diagnostic/.

## JSON-LD notes
- WebPage, `description` = meta. VideoObject removed while film 3 is held.
- BreadcrumbList: Home > Use cases > Station to station.
- FAQPage, five rows.

## Checks
- **Job:** P2 production control, P3 IE lead and P6 MES owner ask "can I see the time between scans, without the ERP losing its say?" Next: Plan your first bay. Reference: Linear's issue-flow pages (one object moving through states). We beat it by saying in the H2 what a state change is not.
- **Drafts:** A (engineer voice) led with the event stream. B (factory-floor voice) led with "Between scans, the order is out of sight." **Picked B's order**; A's stream became section 3. The page was 223 words; now about 560.
- **Readers:** P2 production control 8 → 9. P3 IE lead 8 → 9 (asked for the dwell definition: FAQ 4). P6 MES owner 7 → 9 (lost on old "under rules your plant agrees" and "entering Assembly ends Machining": a status rule with no source; now "Whether a step is done comes from your MES or your people").
- **Claims:** Old FAQ "What counts as done is a rule you set, such as 'entering Assembly ends Machining'" STOP (K03 NEVER: location shows whether work is complete; and the homepage cut "Set rules" for want of a source, F4): replaced. Old "can send each zone event to your ERP or MES under rules your plant agrees" REWORD to F2's line. "The connector ... confirmed when we scope" PASS (K03 "specific connectors need validation"). UWB vs RFID row PASS (a fair one-workflow comparison; never "fail", K03 NEVER). "AmIMotion adds the times in between" PASS.
- **Open facts used:** O2, O7 and O10 safe lines. Not O1, O3, O4, O6.
- **Words:** about 560 visible.
