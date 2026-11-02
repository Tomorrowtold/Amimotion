# /industries/  (hub; reached from the Where it helps panel and the footer)

Generator: `p_solutions.py`, `write("/industries/", TITLE, DESCRIPTION, [...])`.

- **Title tag:** AmIMotion for manufacturing, warehousing and robotics
- **Meta description (142):** AmIMotion is built for manufacturing, warehousing and robotics floors. One system of tags, anchors and AmIHub, set up for how your floor runs.

## Page

### head(...)
- **H1:** "Different floors." / soft: "One live map."
- **Lede:** A machining hall and a dock look nothing alike. To AmIMotion, both are tags, zones and waits.
- **short:** AmIMotion is built for manufacturing, warehousing and robotics floors. The same AmIGo tags, AmIMo anchors and AmIHub software locate trolleys, bins, pallets, tools, vehicles and robots down to ±10 cm, depending on the floor. AmIHub times each one in the zones you name. Your MES, ERP, WMS or fleet software stays in charge of its own records.
- **trail:** [("Industries", None)]  (crumb label as today; /industries/ has no nav row of its own)
- **links line:** Plan your first bay (/diagnostic/)
- **media:** `slot(brief, "wide", alt)`, P-IND-01. Model hall, camera A, full frame at 16:9 (border `0.0,1.0,0.22,0.78`), `--t 0.0 --state after`. The one frame holds all three floors: presses and inspection (manufacturing), racks and the staging-lane pallet (warehousing), the AMR in the back aisle (robotics). Full after-state colour.
  Alt: "A model floor from above with presses, racks, a staging lane and a robot. Blue lines show where tagged things went. Amber marks the ones waiting."

### section 1
- `vp("Start from", "your kind of floor.")`
- `cards([...], cols=3)`:
  1. /industries/manufacturing/ · **Manufacturing** · "Trolleys and bins between cells, lines and inspection."
     P-IND-02: camera A, `--state after`, border `0.02,0.50,0.30,0.80` (4:3): the two presses, the main aisle, the inspection queue on amber. Rest pale. Alt: "A model press line and inspection queue. Three trolleys waiting at inspection are amber."
  2. /industries/warehousing/ · **Warehousing** · "Pallets, staging lanes and docks, with forklifts on the same map."
     P-IND-03: camera A, `--state after`, border `0.45,0.95,0.22,0.70` (4:3): the staging lane, its pallet on amber, the forklift's blue trail beside the racks. Rest pale. Alt: "A model staging lane beside tall racks. One pallet is amber because it is waiting. A blue line shows a forklift's path."
  3. /industries/robotics/ · **Robotics and AMRs** · "Robots and the trolleys they tow, beside everything else you tag."
     P-IND-04: camera A, `--state after`, border `0.10,0.90,0.62,0.97` (4:3): the back aisle, the AMR with its blue trail, the bins and tool cart. Rest pale. Alt: "A model back aisle. A robot moves along a blue line past tagged bins."

### section 2
- `vp("What changes", "from floor to floor.", lede="AmIMotion uses the same parts on every floor. What changes is what you tag, the zones you name and the system that stays in charge.")`
- `compare(["", "Manufacturing", "Warehousing", "Robotics and AMRs"], rows, note)`:

| | Manufacturing | Warehousing | Robotics and AMRs |
|---|---|---|---|
| What you tag | Trolleys, bins, kit racks, fixtures | Pallets, totes, forklifts, tuggers | AMRs, AGVs and the trolleys they tow |
| Zones you name | Stations, queues, inspection | Docks, staging lanes, put-away | Pick-up and drop-off points |
| What AmIHub adds | Where each job waits, and for how long | How long each load waits, dock to stock | What arrived where, and when |
| Stays in charge | Your MES or ERP | Your WMS | Your fleet software |

  note: "AmIMotion locates and times. It does not route vehicles, dispatch robots or close jobs."

### section 3
- `vp("One system,", "set up zone by zone.", lede="AmIMotion is set up for the floor you have. We survey it first, then plan the anchors.")`
- `tiles([...], cols=4)`:
  - **Steel and racking.** UWB's wide bandwidth separates the direct path from reflections. Racking and steel still change how far an AmIMo anchor reaches, so the survey sets the count.
  - **A mode for each zone.** AmIMo anchors run the positioning mode each zone needs, chosen in AmIHub, with no hardware swap. Docks and gates can use angle and two-way ranging.
  - **Covered yards.** AmIMo anchors also work in sheltered outdoor areas, so a covered yard can join the same AmIHub map.
  - **Inside your plant.** AmIHub runs on an industrial PC inside your plant, with no internet needed. Cloud is also an option.

### section 4
- `faq([...], "Questions teams ask first.")`
  - **Which industries is AmIMotion built for?** Manufacturing, warehousing and robotics floors. The same AmIGo tags, AmIMo anchors and AmIHub locate trolleys, pallets, vehicles and robots, and time them in the zones you name.
  - **Can one AmIMotion system cover a factory and its warehouse?** Yes. The same tags, anchors and AmIHub cover the machining hall and the dock. A second plant gets its own survey, and AmIHub can run both from one console.
  - **Is AmIMotion made in India?** Yes. AmIMotion is designed and built in India, with local stock and local engineers on your site.

### close
- Default for /industries/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/industries/manufacturing/, /industries/warehousing/, /industries/robotics/, /diagnostic/. Nav labels on all three cards.

## JSON-LD notes
- CollectionPage, `description` = meta. ItemList of the three industry pages.
- BreadcrumbList: Home > Industries.
- FAQPage, three rows. The compare table is plain HTML; no Table schema.

## Checks
- **Job:** P8 group operations and P1 ask "is this for a floor like mine, and does it repeat across my sites?" Next: their industry page. Reference: Vention's industry hub shows one product set re-cut per industry; we beat it with a single comparison table a buyer can quote, and one picture that holds all three floors.
- **Drafts:** A (SEO strategist) was three cards plus four application tiles (today's page, 181 words). B (executive voice) was the comparison table plus the setup tiles. **Merged:** A's cards, B's table and tiles, plus three FAQ rows. Now about 470 visible words, past the 250 floor.
- **Readers:** P8 group operations 7 → 9 (lost on "Built for floors that move": a slogan with no answer. New H1 plus the table answered "does it repeat?"). P1 plant head 8 → 9. P11 promoter 8 → 9 (asked where it is made: FAQ row 3).
- **Claims:** Old "Yards: sheltered outdoor areas, on the same system" REWORD to "AmIMo anchors also work in sheltered outdoor areas" ([B4] operating "indoor & sheltered outdoor"). "Docks and gates can use angle and two-way ranging" PASS ([B4] "AoA + TWR: gates, docks, precision cells"). "chosen in AmIHub, with no hardware swap" PASS ([B4]). "Cloud is also an option" PASS (K03 GREEN; who runs it left out, C21). "A second plant ... one console" PASS exact (V86). "designed and built in India, with local stock and local engineers" PASS ([B8], V89). "does not route vehicles, dispatch robots or close jobs" PASS (K03 NEVER). No "runs in" line (A46, C34 STOP).
- **Open facts used:** O11 safe line. Not O1, O2, O3, O4, O6.
- **Words:** about 470 visible.
