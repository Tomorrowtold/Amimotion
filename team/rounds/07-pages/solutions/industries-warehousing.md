# /industries/warehousing/  (nav: Warehousing, line "Pallets, staging lanes, docks")

Generator: `p_solutions.py`, IND row "warehousing".

- **Title tag:** UWB RTLS for warehousing and intralogistics
- **Meta description (138):** AmIMotion for warehouses: pallets, totes, forklifts and tuggers on one live map, with how long each load waits at docks and staging lanes.

## Page

### head(...)
- **H1:** "Know where each pallet is." / soft: "And how long it has waited."
- **Lede:** Your WMS knows where a pallet should be. AmIMotion shows where it is, and how long it has stood there.
- **short:** In warehousing, AmIMotion shows where tagged pallets, totes, forklifts and tuggers are, and how long loads wait at docks and staging lanes. AmIGo tags ride on the loads and vehicles. AmIMo anchors place each tag down to ±10 cm, depending on the floor. AmIHub times every entry and exit, and your WMS stays the record for orders and stock.
- **trail:** [("Industries", "/industries/"), ("Warehousing", None)]
- **links line:** Plan your first bay (/diagnostic/)
- **media:** `slot(brief, "wide", alt)`, P-WH-01. Model hall, camera A, `--state after`, border `0.40,1.00,0.20,0.80` (16:9): the staging lane, both rack rows and the cross aisle. The pallet in the staging lane on amber; the forklift's blue trail from the racks to the lane; the tugger train's trail down the main aisle. Presses and inspection pale.
  Alt: "A model warehouse aisle between tall racks. One pallet in a staging lane is amber because it is waiting. Blue lines show a forklift's and a tugger's paths."

### section 1
- `vp("Good first flows", "in a warehouse.", lede="An AmIMotion pilot follows one flow, such as inbound from the dock to the rack. These three are where warehouses look first.")`
- `tiles([...], cols=3)`:
  - **Docks and staging lanes.** AmIHub times each tagged pallet at every dock door and staging lane. You see which load has waited longest, while it waits.
  - **Forklifts and tuggers.** A vehicle tag rides on each one, with a vehicle-powered option. AmIHub shows where each one is now, and its trips over any time window.
  - **Pallets and totes.** Find a tagged load through put-away, staging and storage. AmIHub shows where it was last seen, and when.

### section 2
- `vp("Dock to stock,", "timed.", lede="Name the dock, the staging lane and the put-away zone in AmIHub. It notes when each tagged pallet enters and leaves each one.")`
- `steps([...])`:
  1. **Dock.** A tagged pallet enters the dock zone. AmIHub records the time.
  2. **Staging lane.** It waits in a lane. Its wait shows live, during the shift.
  3. **Put-away.** A forklift picks it up. Both tags move together toward the racks.
  4. **Rack.** It leaves the last zone. AmIHub sends each entry and exit to your WMS, as it happens.

### section 3
- `vp("Docks, aisles", "and covered yards.")`
- `tiles([...], cols=3)`:
  - **Docks and gates.** AmIMo anchors can use angle and two-way ranging at docks and gates. The mode is set per zone in AmIHub, with no hardware swap.
  - **Tall racking.** Racking changes how far a signal reaches. AmIMotion surveys your floor and sets the anchor count.
  - **Covered yards.** AmIMo anchors also work in sheltered outdoor areas, so a covered yard can join the same map.

### section 4
- `vp("Your WMS stays", "in charge.", lede="AmIHub adds where each load is and how long it waited. Orders and stock stay in your WMS, which connects through open REST, MQTT, WebSocket and omlox hub interfaces.")`
- `stats([...])`:
  - **±10 cm** · Down to, per AmIGo tag · With AmIMo anchors. Depends on your floor.
  - **About 50 m** · Reach of each AmIMo anchor · In clear line of sight. Racking changes it.
  - **Hundreds** · Active tags per anchor cell · Indicative, in UL-TDoA mode.
- `more([("Specifications", "/specs/"), ("How many anchors you need", "/tools/anchors/")])`

### section 5
- `faq([...], "Questions warehouses ask first.")`
  - **Can AmIMotion track forklifts and AMRs together?** Yes. AmIGo vehicle tags fit forklifts, tuggers and AMRs, and all of them appear on one AmIHub map with the pallets they move.
  - **Does AmIMotion replace our WMS?** No. AmIHub sends positions and events to your WMS over REST, MQTT, WebSocket or omlox. Your WMS stays the record. The connector for your WMS is confirmed when we scope the pilot.
  - **Can AmIMotion time dock-to-stock?** Yes, for tagged pallets and totes. AmIHub notes each entry and exit at the dock, the staging lanes and the put-away zones, so you see where loads wait.
  - **Do the anchors need data cables?** No data or sync cable. Each AmIMo anchor needs only power, from DC or PoE, syncs over the air and sends its data over Wi-Fi. Ethernet is also an option.

### close
- Default for /industries/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/specs/, /tools/anchors/, /diagnostic/. Section 1 tile 2 may carry "Tools and vehicles" (/solutions/assets/) as its links line if Structure wants a door per tile.

## JSON-LD notes
- WebPage, `description` = meta, `audience` BusinessAudience "Warehouses and intralogistics".
- BreadcrumbList: Home > Industries > Warehousing.
- FAQPage, four rows.

## Checks
- **Job:** the logistics manager (brochure role) and P8 ask "can I see how long loads wait at the dock, without a new WMS?" Next: Plan your first bay. Reference: Formlabs' industry page model; for the flow, Stripe's step lists. We beat both with a timed flow a buyer can say back in four words: dock, lane, put-away, rack.
- **Drafts:** A (SEO strategist) kept today's three tiles and figures. B (factory-floor voice) wrote the dock-to-stock steps. **Merged** A's tiles and B's steps; today's page was 27 words short of 250 and now carries about 600.
- **Readers:** P8 group operations 8 → 9. P6 MES/WMS owner 8 → 9 (asked which WMS: connector line added, K03 "specific connectors need validation"). P5 OT engineer 8 → 9 (asked about cabling at the dock: FAQ 4).
- **Claims:** Old "Running, idle or parked, and how long each one dwells" STOP for now (fleet utilisation is [B6], C18): REWORD to "where each one is now, and its trips over any time window" ([B5]). "Hundreds · Active tags per anchor cell · Indicative" PASS ([B4] spec table, K03 AMBER "indicative"). "angle and two-way ranging at docks and gates" PASS ([B4]). "Both tags move together" PASS (an observation on the map, no association claimed). No-cable FAQ PASS on AMBER (C20 wording, F8). No "runs in warehousing" (system-notes ruling).
- **Open facts used:** O9 safe line. Not O1, O2, O3, O4, O6.
- **Words:** about 600 visible.
