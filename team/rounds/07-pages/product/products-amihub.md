# /products/amihub/ — AmIHub

Product squad, round 07, 2 Nov 2026. Generator: `p_platform.py`.

## Job of the page

- **Buyer:** P2 production control and P4 supervisor (what the map shows them), P6 MES/ERP owner and P7 IT (interfaces, hosting), P3 IE lead (how waits are recorded).
- **Question:** "What does the software actually do, where does it run, and does it fight my MES?"
- **Next step:** book the live demo; developers go to /developers/.
- **Best reference:** Linear's product pages: say what the software does in verbs, one row each, then the integrations table. Stripe's habit of naming the exact protocol, never "integrates with everything".

## Two drafts, one pick

- **Draft A:** H1 "AmIHub." / "Where positions become records." Leads on the engine, then six capabilities, then interfaces, MCP, spec.
- **Draft B:** H1 "AmIHub." / "One live map of your floor." Leads on what a supervisor sees, then the same order.
- **Pick: B.** "Where positions become records" is accurate but abstract; P4 read it twice. B's soft line is the nav strapline ("One live map"), so the label, the page and the bar agree. A's six capability rows were kept, rewritten as verbs.

---

## The page

**write()**
- Title (≤65): `AmIHub software: the live map, zone events and open APIs`
- Description (≤160): `AmIHub is AmIMotion's software. It works out where each tag is, times every zone entry and exit, and runs inside your plant with no internet needed.`
- meta: `type="software", product="AmIHub"`.

**head()**
- H1: "AmIHub." / soft: "One live map of your floor."
- Lede: "AmIHub turns each tag's pulse into a place and a time. Your team, your systems and AI assistants read the same map."
- trail: Interfaces (#interfaces) · For developers (/developers/)
- media: `slot(..., "cine")` 16:9, full width.
  - **Shows (fallback, ships now):** the hero poster crop of the inspection bay: the trail of one trolley into the queue, three trolleys and one pallet on amber, everything else pale.
  - **Source:** model-hall still, `build_hall.py` camera A, t = 0.0, 16:9 crop of the poster master. Owner: Realism lab. Replaced by a real AmIHub capture (one trolley, "Last seen 10:42", demo floor, no customer detail) only on the day the founders clear it (O5).
  - **Alt (fallback):** "A model factory floor with paths in blue and waits in amber." Never calls itself AmIHub.

**Section 1.** `section(vp("AmIHub, in short."), short answer)`
- Heading: "AmIHub, in short."
- Short answer:
  > AmIHub is AmIMotion's software: the positioning engine and the record of where every tag has been. It works out each AmIGo tag's position from AmIMo timing and angle, and keeps a live map of your floor and its zones. AmIHub notes when each tagged item enters and leaves a zone, so you see how long it has waited, while it is still waiting. It runs on an industrial PC inside your plant with no internet needed, or in the cloud. It speaks REST, MQTT, WebSocket and omlox, and has an MCP server built in.

**Section 2.** `section(vp("What AmIHub does."), tiles([...], 3))` (six points, two rows)
- Heading: "What AmIHub does."
- Points:
  - "Works out positions" — "From each pulse's arrival times and angles, filtered against your floor map. Positions update in under a second, indicative."
  - "Keeps the live map" — "Your floor plan, zones and racking, with every tagged item, its trail and where it was last seen."
  - "Times every zone" — "AmIHub time-stamps each entry and exit. You name the zones. You see how long each item has waited."
  - "Answers by time window" — "Ask for any item's trail, trips and waits over the hours you choose. Export to CSV or Parquet."
  - "Looks after the devices" — "Finds each anchor on its own, tracks tag health and battery, updates firmware over the air, and raises an alert if an anchor goes dark."
  - "Grows with you" — "From one bay to the whole plant on the same AmIHub, without re-fitting the first bay. Thousands of tags per site, indicative."
- Picture: none.

**Section 3.** `section(vp("Your systems keep their jobs.", lede=...), compare([...], rows, note), more([...]), id="interfaces")`
- Heading: "Your systems keep their jobs."
- Lede: "AmIHub adds where and when. Your MES, ERP and WMS stay in charge of jobs and status."
- Comparison (Interface / What it carries / Typical use):
  - REST — Positions, zones, history and device state — Queries from MES, ERP, WMS and BI tools
  - MQTT — Each zone entry and exit, as it happens — Events into plant systems
  - WebSocket — Live positions — Screens and your own apps
  - omlox hub interface — Location data in the open omlox model — Data that is not tied to one vendor
  - MCP server — Positions, zones and history — AI assistants; any change needs a person's approval
- Note: "Which systems connect, and with which fields, is agreed for your site."
- Links line: For developers (/developers/) · Which job is on the trolley? (/learn/association/)

**Section 4.** `section(vp("Ask your floor a question."), prose(<p class="lead">"Which trolleys have waited at inspection for more than an hour?"</p>), tiles([...], 4), more([...]))`
- Heading: "Ask your floor a question."
- Pull line (lede size, plain): "Which trolleys have waited at inspection for more than an hour?"
- Points (4):
  - "Ask" — "Any AI assistant that supports MCP can ask AmIHub in plain words. Asking changes nothing."
  - "Scoped" — "Each assistant gets its own access: read-only, or only the actions you allow."
  - "Logged" — "Every request is logged: who asked, what was called and what changed."
  - "Approved" — "Any change, such as raising a work order, needs a person's approval. You can require it from a supervisor."
- Body after: "The MCP server is part of AmIHub, so it runs where AmIHub runs. If the assistant runs inside your network too, nothing has to leave it. We show it live on a call."
- Links line: Ask your floor (/use-cases/ask-your-plant/) · Trust and data (/trust/)
- Picture: none (no answer card, no mock UI: shared-world rule).

**Section 5.** `section(vp("Inside your plant.", "Or in the cloud."), split(None, paras, media=None))` → as `tiles` 3:
- Points:
  - "On-premise" — "AmIHub runs on an industrial PC inside your plant, with no internet needed. Location data stays on site."
  - "Cloud" — "AmIHub can also run in the cloud. Ask on the call which model fits your IT rules."
  - "Either way" — "TLS on every interface, access set by role, API keys, audit logs and data retention rules."

**Section 6.** `section(vp("AmIHub, in detail."), spec([...], note))`
- Spec rows:
  - Positioning — UL-TDoA, DL-TDoA, two-way ranging and AoA solvers, filtered against the floor map
  - Accuracy — Down to ±10 cm in 3D, typical, with AmIMo anchors; depends on your floor
  - Updates — Under a second from pulse to map, indicative
  - Scale — Thousands of tags and hundreds of anchors per site, indicative
  - Records — Every entry, exit, idle and dwell, time-stamped and queryable by time window
  - Interfaces — REST, MQTT, WebSocket, omlox hub interface, built-in MCP server
  - Hosting — Industrial PC inside your plant with no internet needed, or cloud
  - Security — TLS, role-based access, API keys, audit logs, data retention rules
  - Export — CSV and Parquet
  - Devices — Anchor auto-discovery, tag health and battery, over-the-air firmware, dark-anchor alert
  - Standards — Data and device model built on the FiRa and omlox specifications
- Note: "Indicative values. Ask on the call for a live demo of the views that matter on your floor."

**FAQ.** `faq([...], "Questions about AmIHub.")`
1. "What is AmIHub?" — "AmIHub is AmIMotion's software. It is the positioning engine, the live map of your floor and the record of every zone entry and exit. It has open APIs (REST, MQTT, WebSocket, omlox) and a built-in MCP server, and runs on-premise or in the cloud."
2. "Which RTLS can run on-premise without internet?" — "AmIHub, AmIMotion's software, runs on an industrial PC inside your plant with no internet needed, so location data stays on site. It can also run in the cloud if your IT rules prefer that."
3. "Does AmIHub replace our MES or WMS?" — "No. Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited, and feeds your MES, ERP or WMS over open interfaces."
4. "Can AmIHub send zone events to SAP or an MES over MQTT?" — "AmIHub sends each zone entry and exit over MQTT, as it happens, and offers REST, WebSocket and an omlox hub interface. The connector for your SAP, MES or ERP is confirmed for your site."
5. "Does AmIMotion have an MCP server?" — "Yes. AmIHub has an MCP server built in, so AI assistants that support MCP can ask the live map a question. Any change needs a person's approval. We show it live on a call."

**Close:** "See your floor on AmIHub." — "On the call: the live map and an AI query, on real AmIHub data." — Book a call (/contact/)

**Internal links:** /developers/, /learn/association/, /use-cases/ask-your-plant/, /trust/, /products/amigo/, /products/amimo/, /contact/.

**JSON-LD notes:** SoftwareApplication (name AmIHub, applicationCategory "BusinessApplication", publisher AmIMotion `@id`, featureList from section 2 headings). No Offer, no rating, no screenshot (O5). FAQPage from five `<details>`. BreadcrumbList: How it works › AmIHub.

**Words:** about 690.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P4 Supervisor | 7 | Draft A H1 "Where positions become records" read twice | Draft B | 9 |
| P6 MES owner | 8 | Old MQTT row "Zone entries, exits and alerts": "What alerts? Who sets them?" | "alerts" cut (O2). Row says entries and exits only | 9 |
| P7 IT and security | 9 | none | — | 9 |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| Positioning engine and record ("system of record") | PASS | [B5] |
| "filtered against your floor map" | PASS | [B5] "map-aware filtering". Old "Non-line-of-sight algorithms keep positions steady" softened: no "steady" promise |
| Under a second, thousands of tags | PASS | K03 AMBER, "indicative" on both |
| "hundreds of anchors per site" | PASS | [B5] indicative |
| Enter/exit/idle/dwell time-stamped, queryable by time window, CSV/Parquet | PASS | [B5], V21–V23 |
| Device management incl. OTA | PASS | [B5] |
| "without re-fitting the first bay" | PASS | V85 |
| Old "for assets, vehicles, people and work orders" | CUT | "people" on this page without O3 policy; work orders C18 |
| Old MQTT "alerts" | CUT | O2 |
| Interfaces table, "connector confirmed for your site" | PASS | K03 GREEN with "interfaces" qualifier |
| MCP block (Ask / Scoped / Logged / Approved, runs where AmIHub runs, nothing has to leave) | PASS | V37–V45, F5 |
| Example question | PASS | V35; the call demo must answer it |
| Cloud | REWORD | "a cloud tenant we manage" vs "your cloud tenant" (C21). Ships "can also run in the cloud" |
| FiRa/omlox data and device model | REWORD | [B5] "compliant data and device model" → "built on the FiRa and omlox specifications" |
| Real AmIHub screen | OUT | O5 |

**Open facts used:** O2 (no alert), O5 (no screen), O1 (no phone map; the old "mobile" wording does not appear).
**Blocked:** none at 9. The page's biggest gap is O5: the best reference would show the product. Logged.
