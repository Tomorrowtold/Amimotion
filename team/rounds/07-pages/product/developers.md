# /developers/ — For developers

Product squad, round 07, 2 Nov 2026. Generator: `p_eval.py`. Nav line: "API and MCP docs". Close: default for /developers/.

## Job of the page

- **Buyer:** P6 MES/ERP owner, P12 integrator, P7 IT, and in-house developers.
- **Question:** "What can I read, over which protocol, how is it secured, and can I build on it without the vendor in the room?"
- **Next step:** book a call to get the interface details for their site.
- **Best reference:** Stripe's docs home: one sentence on what the API is, then "pick the interface by what you need", then auth. Stripe wins on a first code sample. We cannot ship one: no founders' document publishes AmIHub's event fields or endpoints. So the page describes the event in words and says plainly where the reference comes from.

## Two drafts, one pick

- **Draft A:** H1 "For developers." / "Five ways in." Data, interfaces, MCP, security.
- **Draft B:** H1 "For developers." / "Five ways into AmIHub." Same, plus "What a zone event carries" in words and "Build on any layer" for integrators.
- **Pick: B.** "Five ways in" without AmIHub reads as a door count; naming AmIHub helps search and the reader. B adds the two things P6 and P12 asked for first: what an event holds, and whether an integrator may build on it.

---

## The page

**write()**
- Title (≤65): `AmIHub for developers: REST, MQTT, WebSocket, omlox and MCP`
- Description (≤160): `Build on AmIHub: REST queries, MQTT and WebSocket events, an omlox hub interface and a built-in MCP server, with API keys, roles, TLS and audit logs.`
- meta: `type="article"`.

**head()**
- H1: "For developers." / soft: "Five ways into AmIHub."
- Lede: "AmIHub keeps one record of where each tag is and when it moved. Your code reads it over open interfaces, inside your plant or in the cloud."
- Short answer:
  > AmIHub, AmIMotion's software, gives developers location data over REST, MQTT, WebSocket and an omlox hub interface, and has an MCP server built in for AI assistants. Every interface runs over TLS, with API keys and access by role, and every call is logged. On-premise, AmIHub runs on a PC inside your plant, so every interface stays on your network.
- trail: Specifications (/specs/) · Trust and data (/trust/)
- media: none (a picture of code we cannot publish would be a mock-up).

**Section 1.** `section(vp("What you can read.", "Records, not raw radio."), tiles([...], 3, head="h"))`
- Points (6):
  - "Positions" — "A 3D position for every tracked item, with the time AmIHub saw it."
  - "Zone events" — "Each entry, exit, idle and dwell, with the tag, the zone and the time stamps."
  - "History" — "Trails, trips and waits for any item, over the time window you ask for. CSV and Parquet export."
  - "Devices" — "Health, battery level and firmware state for each AmIGo tag and AmIMo anchor."
  - "The map" — "Your floor plan, zones, fences and racking."
  - "Trackables" — "Assets, vehicles and work orders are objects in AmIHub. You assign tags to them, in AmIHub or over the API."

**Section 2.** `section(vp("Pick the interface.", "By what your system needs."), compare([...], rows, note))`
- Comparison (Interface / Pattern / Use it for):
  - REST — Request and response — Queries from MES, ERP, WMS and BI tools
  - MQTT — Publish and subscribe — Zone events into plant systems, as they happen
  - WebSocket — Live stream — Screens and your own apps that show live positions
  - omlox hub interface — The open omlox location model — Data that is not tied to one vendor's format
  - MCP server — Tools for AI assistants — Questions in plain words; any change needs a person's approval
- Note: "Which topics, fields and rates your systems receive is agreed for your site. The architecture for your site comes with the datasheets, under NDA."

**Section 3.** `section(vp("A zone event, in words."), prose(...))`
- Body:
  > When a tagged trolley enters a zone, AmIHub records an event. It names the tag, the zone, the kind of event (entered, left, idle or dwell) and the time. When the trolley leaves, a second event closes the visit, so the wait is the time between them. You can take these events as they happen over MQTT or WebSocket, or ask AmIHub for them by time window over REST.
  >
  > Link each trolley to the job it carries, in AmIHub or from your own system. AmIHub then reports the wait against that job. Your MES stays in charge of the job itself.

**Section 4.** `section(vp("AI assistants, with limits.", lede=...), tiles([...], 3), links([...]))`
- Heading: "AI assistants, with limits."
- Lede: "AmIHub has an MCP server built in. MCP is an open standard that lets AI assistants use other software."
- Points:
  - "Scoped" — "Each assistant gets its own access: read-only, or only the actions you allow."
  - "Logged" — "Every request is logged: who asked, what was called and what changed."
  - "Approved" — "Any change, such as raising a work order, needs a person's approval. You can require it from a supervisor."
- Body after: "AmIHub's MCP tools cover live positions, history by time window, zones and fences, and the tags assigned to things. The same tools are there over REST and MQTT. Any assistant that supports MCP can connect. We show it live on a call."
- Related: MCP and location data (/learn/mcp-location-data/) "What an assistant can and cannot do" · Ask your floor (/use-cases/ask-your-plant/) "AI assistants and MCP"

**Section 5.** `section(vp("Security.", "The same on every interface."), tiles([...], 3), links([...]))`
- Points:
  - "In transit" — "TLS on every interface."
  - "Access" — "API keys per system or assistant. Access set by role for people."
  - "Record" — "Every call logged. Data retention rules for how long AmIHub keeps history."
- Related: Trust and data (/trust/) "Where your data lives"

**Section 6.** `section(vp("Build on any layer."), prose(...))`
- Body:
  > Your team or your integrator can build on AmIMotion at any layer, through open interfaces: the tags and anchors, AmIHub's records, or the MCP tools. One contract and one support line cover every layer.

**FAQ.** `faq([...], "Questions developers ask.")`
1. "Does AmIHub have an API?" — "Yes. AmIHub has REST for queries, MQTT and WebSocket for live events and positions, an omlox hub interface, and an MCP server built in for AI assistants."
2. "Can AmIHub send zone events to our MES?" — "Yes, over MQTT as they happen, or over REST when your MES asks. Which fields and topics your MES receives is agreed for your site."
3. "Where is the AmIHub API reference?" — "Ask on the first call. AmIMotion shares the architecture for your site with the datasheets, under NDA."
4. "Does AmIHub work without internet?" — "Yes. On-premise, AmIHub runs on an industrial PC inside your plant, and every interface stays on your network."
5. "Can an integrator build on AmIMotion?" — "Yes. Your team or your integrator can build on AmIMotion at any layer, through open interfaces."

**Close** (default): "See it on a live map." — "On a short call we show the live map and an AI query, on real AmIHub data." — Book a call (/contact/)

**Internal links:** /specs/, /trust/, /learn/mcp-location-data/, /use-cases/ask-your-plant/, /products/amihub/ (in body: link "AmIHub" on first mention of the short answer), /contact/.

**JSON-LD notes:** TechArticle (about AmIHub `@id`), FAQPage from five `<details>`, BreadcrumbList: How it works › For developers. No `WebAPI` node until a public reference URL exists.

**Words:** about 700.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P6 MES owner | 7 | "Records, not raw radio" but no idea what a record holds | Section 3, the zone event in words | 9 |
| P12 Integrator | 7 | Nothing on whether they may build on it | Section 6 and FAQ 5. Who commissions and versioned docs stay out (O14) | 8 (O14) |
| P7 IT and security | 9 | none | — | 9 |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| REST, MQTT, WebSocket, omlox hub, MCP | PASS | K03 GREEN, [B7] |
| Records list: positions, events, history, devices, map | PASS | [B5] |
| "Trackables ... work orders are objects ... assign tags, in AmIHub or over the API" | PASS | [B5] first-class objects, "assign tags"; [B7] same tools over REST and MQTT; F3 |
| Old "Links: a job linked to a carrier, with a start, an end and an owner" | CUT | V108 |
| "a second event closes the visit, so the wait is the time between them" | PASS | [B5] enter/exit time-stamped; dwell = time in zone. Names no field or format |
| "AmIHub then reports the wait against that job" | PASS | V29 ("Its wait then counts as that job's wait"), F3 |
| "Which topics, fields and rates ... agreed for your site" | PASS | K03 "specific connectors need validation" |
| "The full API reference comes with the detailed pack" (old) | REWORD | [B8] pack names datasheets, architecture, pricing; no API reference. Ships "architecture for your site", and FAQ 3 says "Ask on the first call" |
| A code sample with event fields | **STOP** | No published schema. Inventing field names is a new claim |
| MCP tool families | PASS on AMBER | [B7]. Fleet tools left out (C18). "We show it live on a call" carries the AMBER (V39, V41) |
| "Any write action waits for a supervisor's approval" (old) | REWORD | X3/O15. Ships "needs a person's approval. You can require it from a supervisor." (F5) |
| Security tiles | PASS | [B5] |
| "build on any layer ... One contract and one support line" | PASS | V90, V91 |

**Open facts used:** O14 (no commissioning or versioned-docs line), O15 (approval wording).
**Blocked:** P12 at 8 (O14). The best reference's code sample is blocked by the missing published schema. Both logged.
