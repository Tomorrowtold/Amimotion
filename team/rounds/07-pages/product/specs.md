# /specs/ — Specifications

Product squad, round 07, 2 Nov 2026. Generator: `p_eval.py`. Nav line: "Every figure and its condition". Close: own (below).

## Job of the page

- **Buyer:** P5 OT engineer, P7 IT, P9 procurement (comparing bids line by line), P12 integrator. Also AI assistants that quote figures.
- **Question:** "Give me every number, and tell me what each one depends on."
- **Next step:** ask for the full datasheets (the NDA pack) on a call.
- **Best reference:** Apple's tech specs pages. One page, one picture of the product at true scale, plain rows grouped by part, conditions printed beside the figure rather than hidden in footnotes. We beat it on honesty: every row says what it depends on, and every gap says where the figure is.

## Two drafts, one pick

- **Draft A:** H1 "Specifications." / "Everything we publish, on one page." System table first, then each part, then "not public yet".
- **Draft B:** H1 "Specifications." / "Every figure, with its condition." Same order, plus the pair picture and one plain line per gap.
- **Pick: B.** "Everything we publish" makes the reader wonder what we do not. B's soft line is the nav strapline and is the page's promise. The pair render gives the table a real object, as Apple's does.

---

## The page

**write()**
- Title (≤65): `AmIMotion specifications: AmIGo, AmIMo and AmIHub`
- Description (≤160): `Every published figure for AmIGo tags, AmIMo anchors and AmIHub software, each with its condition: radio, accuracy, battery, power, interfaces, hosting.`
- meta: `type="article"`.

**head()**
- H1: "Specifications." / soft: "Every figure, with its condition."
- Lede: "These are AmIMotion's published figures. Each one carries what it depends on. The final datasheets come under NDA after the first call."
- Short answer:
  > AmIMotion is a UWB location system in three parts. AmIGo tags use IEEE 802.15.4z HRP radio on channels 5 and 9 and report 0.1 to 10 times a second. AmIMo anchors time each pulse, read its 3D angle of arrival and need only DC or PoE power. AmIHub places tags down to ±10 cm in 3D with AmIMo anchors, depending on your floor, and runs inside your plant or in the cloud. AmIMotion is built on the FiRa and omlox specifications.
- trail: How it locates a tag (/technology/) · For developers (/developers/)
- media: `still("pair", eager=True)`.
  - **Shows:** AmIGo and AmIMo together at true scale on the page ground, the tag turned −14° in front of the anchor.
  - **Source:** CAD render `pair_scale.png`. Owed: a page-graded ladder (`render_hardware.py --page`, then `team/rounds/02-design/tools/hero_images.py`) and a `"pair"` entry in `STILLS`. Owner: Product Render, Engine room. Until then `media=still("amimo")`.
  - **Alt:** "The AmIGo tag in front of the larger AmIMo anchor, both dark grey."

**Section 1.** `section(vp("The system."), spec([...]))`
- Rows:
  - Radio — Ultra-wideband, IEEE 802.15.4z HRP, channels 5 and 9
  - Positioning modes — UL-TDoA, DL-TDoA, two-way ranging and 3D angle of arrival, chosen per zone in AmIHub
  - Accuracy — Down to ±10 cm in 3D, typical, with AmIMo anchors. Depends on your floor; you measure it in the pilot
  - Update rate — 0.1 to 10 Hz, set per tag group; tags send when they move
  - Latency — Under a second from pulse to map, indicative
  - Additional ranging — BLE ranging and Wi-Fi FTM (IEEE 802.11mc) on the same anchors. Device support confirmed per site
  - Silicon — NXP Trimension UWB
  - Standards — Built on the FiRa and omlox specifications. No certification claimed

**Section 2.** `section(vp("AmIGo tag."), spec([...]), more([...]))`
- Rows:
  - Forms — Asset tag, vehicle tag, personnel badge
  - Positioning modes — Several UWB modes; the modes for your hardware revision are in the datasheet
  - Battery — 1 to 3 years, typical, depending on use; vehicle-powered option
  - Sensor — 3-axis accelerometer: motion wake, tilt and impact events
  - Operating temperature — −20 °C to +60 °C, typical
  - Mounting — Adhesive, screw, lanyard or helmet, vehicle cradle
  - Housing — Compact and low profile
  - Size, weight, ingress rating — In the datasheet, under NDA
- Links line: AmIGo tag (/products/amigo/)

**Section 3.** `section(vp("AmIMo anchor."), spec([...]), more([...]))`
- Rows:
  - Antenna — 3D angle-of-arrival array
  - Coverage — About 50 m line-of-sight radius, indicative and site-dependent; the count comes from a site survey
  - Synchronisation — Over the air; no sync cable
  - Backhaul — Wi-Fi 2.4 / 5 GHz to AmIHub; Ethernet option
  - Power — DC adapter or PoE
  - Mounting height — 3 to 8 m recommended; wall, column, ceiling and pole brackets
  - Tag capacity — Hundreds of active tags per anchor cell (UL-TDoA), indicative
  - Operating temperature — −20 °C to +60 °C, typical; indoor and sheltered outdoor
  - Commissioning — Phone app; found by AmIHub on its own
- Links line: AmIMo anchor (/products/amimo/) · How many anchors you need (/tools/anchors/)

**Section 4.** `section(vp("AmIHub software."), spec([...]), more([...]))`
- Rows:
  - Hosting — Industrial PC inside your plant, with no internet needed; or cloud
  - Interfaces — REST, MQTT, WebSocket, omlox hub interface and a built-in MCP server
  - Records — Position, time and zone history; every entry, exit, idle and dwell, time-stamped
  - Export — CSV and Parquet
  - Security — TLS, role-based access, API keys, audit logs and data retention rules
  - Devices — Anchor auto-discovery, tag health and battery, over-the-air firmware, dark-anchor alert
  - Scale — Thousands of tags and hundreds of anchors per site, indicative
- Links line: AmIHub (/products/amihub/) · For developers (/developers/)

**Section 5.** `section(vp("Not published yet.", lede=...), tiles([...], 3))`
- Heading: "Not published yet."
- Lede: "After the first call, we share datasheets, architecture, prices and pilot options under NDA."
- Points:
  - "Datasheets" — "Size, weight, ingress rating and the hardware revision for your evaluation."
  - "Capacity" — "Tags per anchor cell at the update rates your flows need."
  - "Your floor" — "An anchor plan from the site survey, and the architecture for your network."

**FAQ.** `faq([...], "Questions about the figures.")`
1. "Which positioning methods does AmIMotion use?" — "Several, chosen per zone in AmIHub: UL-TDoA, DL-TDoA, two-way ranging and 3D angle of arrival. Most asset tracking uses UL-TDoA, where AmIGo tags send and AmIMo anchors time the pulse."
2. "What update rate do AmIGo tags support?" — "0.1 to 10 Hz, set per tag group. AmIGo tags sleep when still and send when they move, which is why one battery lasts 1 to 3 years, typical."
3. "How accurate is AmIMotion?" — "Down to ±10 cm in 3D, typical, with AmIMo anchors. It depends on your floor, so you measure it on yours in the pilot, near racking and machines too."
4. "Why are size and weight not listed?" — "AmIMotion shares them in the final datasheet, under NDA after the first call, with the hardware revision you would evaluate."
5. "Does AmIMotion hold FiRa or omlox certification?" — "AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification. AmIHub has an omlox hub interface."

**Close:** "Ask for the full datasheets." — "We share them after the first call, with the architecture for your site." — Book a call (/contact/)

**Internal links:** /technology/, /developers/, /products/amigo/, /products/amimo/, /products/amihub/, /tools/anchors/, /contact/.

**JSON-LD notes:** WebPage with `mainEntity` an ItemList of three items referencing the Product (AmIGo, AmIMo) and SoftwareApplication (AmIHub) `@id`s from their own pages; `build.py` reads the spec rows into `additionalProperty`. Do not duplicate full Product nodes here (two Product nodes with the same name on two URLs confuse merchants' parsers). FAQPage from five `<details>`.

**Words:** about 640, most in tables. AmIMotion, AmIGo, AmIMo or AmIHub in every heading row or note.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P9 Procurement | 7 | "In the detailed pack" (old row value): "What pack?" | "In the datasheet, under NDA" plus FAQ 4 | 8 (size and weight still unpublished) |
| P5 OT engineer | 9 | none (Ethernet, PoE, temperature, indoor and sheltered outdoor) | — | 9 |
| P12 Integrator | 8 | "Your floor" tile had no interface docs | Architecture named. Versioned docs stay out (O14) | 8 (O14) |

**Claims** (rows not listed here repeat rulings on /products/amigo/, /products/amimo/, /products/amihub/)

| Claim | Ruling | Basis |
|---|---|---|
| Backhaul row with Ethernet option | PASS | [B4]. This is the row F8's release check needs: "Ethernet is also an option" on the homepage stays |
| Latency under a second, indicative | PASS | K03 AMBER |
| "Not published yet" lede | PASS | F13, the locked homepage line. "Reference results" left out (A46, C34) |
| "Capacity at your update rates" | PASS | [B4] tag capacity is indicative; promises only that the figure is shared |
| "An anchor plan from the site survey, and the architecture for your network" | PASS | V88, [B8] step 2 |
| Old "Accuracy: the test method a pilot uses ... so you can check the figure yourself" | CUT | A pilot term (B46 family, V106) |
| Dimensions from CAD | **STOP** | No founders' document publishes them |

**Open facts used:** O12 (no installer or PC line), O14 (no versioned docs). New: tag and anchor size and weight.
**Blocked:** P9 and P12 at 8, both on missing founder facts (size/weight; O14). Safe lines ship.
