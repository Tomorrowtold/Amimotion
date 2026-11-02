# /products/amigo/ — AmIGo tag

Product squad, round 07, 2 Nov 2026. Generator: `p_platform.py`.

## Job of the page

- **Buyer:** P4 supervisor and P2 production control (what goes on the trolley), P5 OT engineer (battery, mounting, temperature), P9 procurement (what the tag is, exactly).
- **Question:** "What is this tag, will it survive my floor, and how often do I change the battery?"
- **Next step:** read the spec table, or book a call with one flow in mind.
- **Best reference:** Apple AirTag. One hero picture of the object on the page ground, one sentence of what it does, then a plain spec table where every figure is honest. AirTag never explains UWB on the product page. Neither do we: that is /technology/.

## Two drafts, one pick

- **Draft A:** H1 "AmIGo tag." / "It rides on what moves." Starts from the object, then sleep and battery, then forms, then specs.
- **Draft B:** H1 "A tag for the trolley." / "Not the person pushing it." Starts from the people boundary.
- **Pick: A.** B is the homepage's line and it is true, but on the product page it makes the first idea a worry (people) instead of the object. P4 read B and asked "so who is it watching?". A names the product in the H1, which the Search lead needs, and keeps the people line as one FAQ answer.

---

## The page

**write()**
- Title (≤65): `AmIGo UWB tag for trolleys, bins, tools and vehicles`
- Description (≤160): `AmIGo is AmIMotion's UWB tag. It sends a pulse when it moves and sleeps when it stops, so one battery lasts 1 to 3 years, typical, depending on use.`
- meta: `type="product", product="AmIGo", category="UWB tag"`, `og="/assets/home/amigo-page-1600.webp"` (was `/assets/img/amigo-card-1600.webp`, an old still no longer shipped).

**head()**
- H1: "AmIGo tag." / soft: "It rides on what moves."
- Lede: "A small UWB tag that screws or sticks onto a trolley, bin, tool or vehicle. It sends a short pulse when it moves and sleeps when it stops."
- trail: Specifications (#specs) · AmIMo anchor (/products/amimo/)
- media: `still("amigo", eager=True)`. Source: CAD render `amigo_page` (8K master, page-graded, ladder at `/assets/home/amigo-page`). Alt (STILLS default): "The AmIGo tag in dark grey, with amimotion debossed on its top cover and a screw ear at each end."

**Section 1.** `section(vp("AmIGo, in short."), <p class="lead short-answer">, figures([...]))`
- Heading: "AmIGo, in short."
- Short answer:
  > AmIGo is AmIMotion's UWB tag for trolleys, bins, tools, fixtures and vehicles. A motion sensor wakes it to send a short ultra-wideband pulse. When it stops, it sleeps, so one battery lasts 1 to 3 years, typical and depending on use. With AmIMo anchors, AmIHub places an AmIGo tag down to ±10 cm in 3D. How close depends on your floor.
- Figures (4):
  - "±10 cm" — "Down to, in 3D" — "With AmIMo anchors, depending on your floor"
  - "0.1 to 10 Hz" — "Update rate" — "Set per tag group. Sent when it moves"
  - "1 to 3 years" — "Battery" — "Typical, depending on use"
  - "−20 to +60 °C" — "Operating range" — "Typical"

**Section 2.** `section(vp("Speaks when it moves.", "Sleeps when it stops."), split(...), km(...))`
- Heading: "Speaks when it moves." / "Sleeps when it stops."
- split h3: "Where the battery life comes from."
- Body:
  > A 3-axis accelerometer wakes AmIGo when the trolley moves. When it stops, the tag goes into deep sleep. While it sleeps, the map shows where it was last seen, and when.
  >
  > You set how often each group of tags reports, from once every ten seconds to ten times a second. Busy tags at high rates use more battery. AmIHub tracks each tag's health and battery level, so you plan a change before a tag goes flat.
- Picture (media): `slot(..., "photo")` 4:3.
  - **Shows:** AmIGo screwed through its own ears to the top rail of a mesh trolley, three-quarter view, about 1 m off the floor, 85 mm look, the debossed "amimotion" read by a soft raking key, background soft and plain.
  - **Source:** CAD render, new shot `amigo_trolley` in `team/rounds/02-design/renders/render_hardware.py` (owed; the trolley rail is a plain tube, not invented product). Until it exists: `amigo_logo.png` (the debossed-logo macro), cut as a ladder with `hero_images.py`. Owner: Product Render with the Realism lab.
  - **Alt:** "The AmIGo tag, a small dark grey tag with amimotion on its cover, screwed to the rail of a trolley." (homepage, locked). Fallback alt: "The debossed amimotion on the AmIGo tag's top cover, close up."
- Know more (`km`), summary "Fewer pulses. Longer life.":
  - "AmIGo sends only when its accelerometer says it is moving."
  - "You set the update rate per tag group, from 0.1 to 10 times a second."
  - "1 to 3 years on one battery is typical. Busy tags at high rates use more."
  - "Forklift and tugger tags can run off the vehicle instead."
  - link: When a tag goes quiet (/learn/location-data-quality/)

**Section 3.** `section(vp("One tag.", "Fitted three ways."), tiles([...], 3), links([...]))`
- Heading: "One tag." / "Fitted three ways."
- Points:
  - "On a carrier" — "For trolleys, bins, racks and WIP carriers. AmIGo screws on through its two moulded ears, or sticks on."
  - "On a vehicle" — "For forklifts, tuggers and AGVs. It sits in a vehicle cradle and can run off the vehicle's power."
  - "On a tool" — "For fixtures, gauges and hand tools. Find the tool from a screen, and see which cell had it last."
- Related: Work in progress (/solutions/wip/) "See where work waits" · Tools and vehicles (/solutions/assets/) "Fixtures, forklifts, AMRs" · Which job is on the trolley? (/learn/association/) "Linking trolleys to jobs"
- Picture: none (the three old 4:3 slots with people, daylight and a forklift cab are cut: off the shared world, and three grey blocks read as a template).

**Section 4.** `section(vp("The tag names the trolley.", "You name the job."), prose(...))`
- Heading: "The tag names the trolley." / "You name the job."
- Body:
  > An AmIGo tag tells AmIHub which trolley it is on, not which job the trolley carries. Link each trolley to the job it carries, in AmIHub or from your own system. Its wait then counts as that job's wait. When the trolley takes new work, the old link ends before the new one starts.
- Links line: Which job is on the trolley? (/learn/association/)

**Section 5.** `section(vp("AmIGo, in detail."), spec([...], note), id="specs")`
- Heading: "AmIGo, in detail."
- Spec rows:
  - UWB radio — IEEE 802.15.4z HRP, channels 5 and 9
  - Positioning modes — Several UWB modes. The modes for your hardware revision are in the datasheet
  - Accuracy — Down to ±10 cm in 3D, typical, with AmIMo anchors. How close depends on your floor
  - Update rate — 0.1 to 10 Hz, set per tag group; sent on motion
  - Battery — 1 to 3 years, typical, depending on use; vehicle-powered option
  - Sensor — 3-axis accelerometer: motion wake, tilt and impact events
  - Operating temperature — −20 °C to +60 °C, typical
  - Mounting — Adhesive, screw, lanyard or helmet, vehicle cradle
  - Forms — Asset tag, vehicle tag, personnel badge
  - Housing — Compact and low profile. Size, weight and ingress rating are in the datasheet
- Note: "Indicative values from AmIMotion's published figures. The final datasheet is shared under NDA after the first call."
- Links line: Specifications (/specs/)

**FAQ.** `faq([...], "Questions about AmIGo.")`
1. "What is an AmIGo tag?" — "AmIGo is AmIMotion's UWB tag for trolleys, bins, tools, fixtures and vehicles. With AmIMo anchors, AmIHub places it down to ±10 cm in 3D, depending on your floor. Its battery lasts 1 to 3 years, typical."
2. "What battery life does a UWB asset tag have?" — "An AmIGo UWB tag lasts 1 to 3 years on one battery, typical. It depends on how often the tag moves and the update rate you set, because AmIGo sleeps when it stops."
3. "Is AmIGo small enough for totes and hand tools?" — "AmIGo is a compact, low-profile tag that screws or sticks on. It is made for bins, totes, tools and fixtures as well as trolleys. Its exact size is in the datasheet, shared under NDA."
4. "Does every AmIGo tag report at the same rate?" — "No. You set the rate per tag group, from 0.1 to 10 times a second. Each tag reports only while it moves."
5. "Can AmIGo tag people?" — "AmIGo also comes as a lanyard or helmet badge. A pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy."

**Close:** "Tag the thing people look for." — "Bring one flow to the call. We show it on the live map." — Book a call (/contact/)

**Internal links:** /products/amimo/, /solutions/wip/, /solutions/assets/, /learn/association/, /learn/location-data-quality/, /specs/, /contact/.

**JSON-LD notes:** Product (name AmIGo, brand AmIMotion → Organization `@id`, category "UWB tag", image the amigo-page ladder 1600 and 3840, `additionalProperty` from the spec rows). No Offer, no price, no aggregateRating, no gtin. FAQPage from the five `<details>`. BreadcrumbList: How it works › AmIGo tag.

**Words:** about 560 in body copy. AmIGo is named in every section and every answer.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P4 Supervisor | 8 | Draft B H1 ("Not the person pushing it"): "So who is it watching?" | Draft A. People only in FAQ 5, with the pilot boundary first | 9 |
| P5 OT engineer | 8 | "Several positioning modes; confirm them for your hardware revision": "Confirm with whom?" | "The modes for your hardware revision are in the datasheet." | 9 |
| P9 Procurement | 8 | "Size and weight: shared under NDA": "You won't tell me how big it is?" | Housing row says "compact and low profile" first, then where the figures are. Still the honest limit | 8 (missing founder fact, see below) |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| Screws or sticks on, two moulded ears | PASS | [B3] mounting; the ears are in the founders' CAD (renders notes) |
| Motion wake, deep sleep | PASS | [B3] |
| "While it sleeps, the map shows where it was last seen, and when." | PASS | V51, V14 |
| 0.1 to 10 Hz per tag group | PASS | [B3] |
| 1 to 3 years, typical, depending on use | PASS | K03 AMBER with qualifier |
| "AmIHub tracks each tag's health and battery level" | PASS | F7 |
| "so you plan a change before a tag goes flat" | PASS | Follows from [B3] "battery level reported to AmIHub"; promises no alert |
| Positioning modes | REWORD | C9 conflict ([D7] UL-TDoA only vs [B3] every mode). Ships "Several UWB modes", list cut |
| Accuracy "typical, with AmIMo anchors" + floor condition | PASS | K03 GREEN qualifier and charter wording together (B05 needs "typical") |
| Tilt and impact events (spec row only) | PASS | [B3] sensor. Not said to reach AmIHub (O4 stays out) |
| Vehicle-powered option, cradle | PASS | [B3] |
| "Find the tool from a screen, and see which cell had it last." | PASS | [B3] "log which cell used it and when". "in seconds" cut (no figure) |
| Reused trolley: old link ends before the new one | PASS | K04 section 3 working rule. Says what the link means, not that AmIHub records start and end (V108) |
| Personnel badge + "Tagging people would be a separate project. It would need its own policy." | PASS | [B3]; V83 given line exact. O3 consent clause stays out |
| Size: "compact" | PASS | C11 safe wording. "World's smallest" and "3 cm x 3 cm" barred |
| CAD dimensions 59 x 86 x 23 mm | **STOP** | Measured from the founders' CAD, but no founders' document publishes them, and the datasheet is under NDA ([B3]). A new number. Logged |

**Open facts used:** O3 (safe line), O4 (tilt/impact kept off AmIHub). New: **tag size and weight** (kit 02 Q8; the CAD has it, no document releases it).
**Blocked:** P9 at 8 on size. Ships the safe line.
