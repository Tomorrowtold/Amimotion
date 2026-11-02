# /platform/ — How it works (hub)

Product squad, round 07, 2 Nov 2026. Generator: `p_platform.py`. Close: default for /platform/ in `CLOSES`.

## Job of the page

- **Buyer:** P1 plant head and P8 group operations first, P5 OT engineer second (it is the hub they reach from "How it works").
- **Question:** "What exactly would I be buying, and how do the three parts fit together?"
- **Next step:** open the one part they care about (tag, anchor, AmIHub), or book a call.
- **Best reference for this kind of page:** Apple's AirTag overview and Linear's feature hub. One sentence per part, one picture per part, figures with their condition, nothing in between. We copy the discipline, not the look.

## Two drafts, one pick

- **Draft A (Words, writer 1):** H1 "One tag. Every carrier." / "Every vehicle. Located." Opens on coverage, lists features per part in tiles.
- **Draft B (Words, writer 2):** H1 "Three parts." / "One live map." Opens on the system, then one screen per idea: the parts, how a position is made, who keeps what, where it runs, the figures.
- **Pick: B.** A's H1 is a formula line and "Located." is a label, not a sentence a person says. B answers the page's one question in five words and every section after it is one idea.

---

## The page

**write()**
- Title (≤65): `AmIMotion platform: AmIGo tags, AmIMo anchors and AmIHub`
- Description (≤160): `AmIMotion is one system in three parts: AmIGo tags on what moves, AmIMo anchors on your columns, and AmIHub, one live map of where work waits.`
- meta: `type="article"` (unchanged), og image: hero poster share crop `film/share-1200x630.jpg` once copied to `/assets/home/`.

**head()**
- H1: "Three parts." / soft: "One live map."
- Lede: "A tag rides on what moves. Anchors on your columns hear it. AmIHub shows where it is and how long it has waited."
- Short answer (the speakable passage):
  > AmIMotion is spatial intelligence for factories and warehouses, built from three parts. AmIGo tags ride on trolleys, bins, tools and vehicles. AmIMo anchors, fixed high on columns and walls, record when each tag's UWB pulse arrives and the angle it came from. AmIHub software works out each position and keeps one live map that your team, your systems and AI assistants all read. With AmIMo anchors, AmIHub places a tag down to ±10 cm in 3D. How close depends on your floor.
- trail (links line): How it locates a tag (/technology/) · Specifications (/specs/) · For developers (/developers/)
- media: `slot(...)`, `cine` 16:9, full width below.
  - **Shows:** the whole model hall, the after state: blue trails behind every moving thing, three trolleys on amber in the inspection queue, one pallet on amber in the staging lane, AmIMo blocks visible on the columns.
  - **Source:** model-hall still. `build_hall.py`, camera A (locked: 11 m up, 45° down, 35 mm, yaw 34°), t = 0.0, rendered 3840 x 2160 (`--border` crop of the 6400 x 8000 poster master is not wide enough; re-render at 16:9 with the same camera). Owner: Realism lab.
  - **Alt:** "A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. Three trolleys at inspection and one pallet in a staging lane are marked amber because they are waiting." (homepage hero alt, locked)

**Section 1.** `section(vp("What each part does."), cards([...], 3))`
- Heading: "What each part does."
- Parts row (`cards`), each a picture over a linked H3 and one line:
  1. /products/amigo/ — "AmIGo tag" — "Screws or sticks onto the trolley. Sends a short pulse when it moves and sleeps when it stops."
     Picture: `still("amigo-side")`. Source: CAD render `amigo_hero.png` (ladder already cut as `amigo-side`).
  2. /products/amimo/ — "AmIMo anchor" — "Fixed to a column 3 to 8 m up. Needs only power, from DC or PoE."
     Picture: `still("amimo")`. Source: CAD render `amimo_rj45.png`.
  3. /products/amihub/ — "AmIHub" — "Works out where each tag is and keeps the live map, on a PC inside your plant."
     Picture: `slot(..., "still")` 3:2. Shows the inspection bay, cropped close: one trolley in the inspection zone on blue, three in the queue on amber. Source: model-hall still, camera A, t = 0.0, crop of the poster master (same crop as homepage screen 3). Owner: Realism lab. Alt: "A model inspection station. Three trolleys in the queue in front of it are marked amber because they are waiting." Never called AmIHub (O5).

**Section 2.** `section(vp("How a position is made."), steps([...]), more([...]))`
- Heading: "How a position is made."
- Steps (4):
  1. "The tag sends." — "An AmIGo tag sends a UWB pulse a few nanoseconds long when it moves. When it stops, it sleeps."
  2. "Anchors listen." — "Each AmIMo anchor in range records when the pulse arrives and the angle it came from."
  3. "AmIHub works it out." — "AmIHub turns those times and angles into a 3D position on the live map, stamped with the time it was seen."
  4. "Your systems hear." — "AmIHub sends each zone entry and exit to the systems you name, as it happens."
- Links line: How it locates a tag (/technology/)
- Picture: none.

**Section 3.** `section(vp("Who keeps what.", lede=...), tiles([...], 3), links([...]))`
- Heading: "Who keeps what."
- Lede: "AmIHub records where and when. Your MES stays in charge of every job."
- Points:
  - "AmIHub keeps" — "Each tag, its position, the time it was seen, and every zone it entered and left."
  - "Your MES or ERP keeps" — "The job, the batch, the routing and the status. Location alone does not mark work as done."
  - "You link the two" — "Link each trolley to the job it carries, in AmIHub or from your own system. Its wait then counts as that job's wait."
- Related: Which job is on the trolley? (/learn/association/) "Linking trolleys to jobs" · When a tag goes quiet (/learn/location-data-quality/) "Last seen, sleep and gaps"
- Picture: none.

**Section 4.** `section(vp("Inside your plant.", "Or in the cloud."), tiles([...], 3), links([...]))`
- Heading: "Inside your plant." / "Or in the cloud."
- Points:
  - "On-premise" — "AmIHub runs on an industrial PC inside your plant, with no internet needed. Location data stays on site."
  - "Cloud" — "AmIHub can also run in the cloud. Ask on the call which model fits your IT rules."
  - "Either way" — "TLS on every interface, access set by role, API keys, audit logs and data retention rules."
- Related: Trust and data (/trust/) "Where your data lives"
- Picture: none.

**Section 5.** `section(vp("The figures, with their conditions."), figures([...]), more([...]))`
- Heading: "The figures, with their conditions."
- Figures (4):
  - "±10 cm" — "Down to, in 3D" — "With AmIMo anchors. How close depends on your floor."
  - "About 50 m" — "Each anchor's reach" — "In clear line of sight. A survey sets the count."
  - "1 to 3 years" — "AmIGo battery" — "Typical, depending on use."
  - "3 radios" — "UWB, BLE and Wi-Fi FTM" — "On the same anchors. Wi-Fi device support is confirmed per site."
- Links line: Specifications (/specs/)

**Section 6.** `section(vp("Open at every layer."), prose(...), more([...]))`
- Heading: "Open at every layer."
- Body:
  > AmIMotion is built on the FiRa and omlox specifications. AmIHub speaks REST, MQTT and WebSocket, and has an omlox hub interface, so your MES, ERP and WMS connect to it through open interfaces.
  >
  > AmIHub also has an MCP server built in. Any AI assistant that supports MCP can ask the live map a question in plain words. Asking changes nothing. Any change needs a person's approval. We show it live on a call.
- Links line: Ask your floor (/use-cases/ask-your-plant/) · For developers (/developers/)

**FAQ.** `faq([...], "Questions about the platform.")`
1. "What are the parts of AmIMotion?" — "Three. AmIGo tags ride on trolleys, bins, tools and vehicles. AmIMo anchors, fixed 3 to 8 m up, hear each tag. AmIHub software works out where each tag is and keeps the live map."
2. "Does ±10 cm mean every reading is within 10 cm?" — "No. With AmIMo anchors, AmIHub places a tag down to ±10 cm in 3D. How close depends on your floor, so you measure it on yours in the pilot."
3. "Do AmIMo anchors need data cables?" — "No data or sync cable. Each AmIMo anchor syncs over the air and sends its data to AmIHub over Wi-Fi. Ethernet is also an option. Each one needs power, from DC or PoE."
4. "Does AmIMotion replace our MES?" — "No. Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited, over open interfaces."

**Close** (default for /platform/): "See it on a live map." — "On a short call we show the live map and an AI query, on real AmIHub data." — Book a call (/contact/)

**Internal links:** /products/amigo/, /products/amimo/, /products/amihub/, /technology/, /specs/, /developers/, /learn/association/, /learn/location-data-quality/, /trust/, /use-cases/ask-your-plant/, /contact/.

**JSON-LD notes:** WebPage + BreadcrumbList (How it works). FAQPage from the four `<details>`. `ItemList` of the three products, each pointing at its Product/SoftwareApplication `@id` on its own page. No Offer, no rating. Description = meta description.

**Words:** about 520 in body copy. AmIMotion, AmIGo, AmIMo or AmIHub is named in the short answer, every section and every FAQ answer.

---

## Checks

**Readers** (kit 09 personas, simulated, cold read; team file only)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P1 Plant head | 8 | "Three radios" figure: "Why do I care about radios?" | Kept on the page (P5 and P7 need it), moved last in the figures row | 9 |
| P5 OT engineer | 8 | Draft step 1 said "in under a second": "Under a second from what to what?" | Cut. Latency lives on /specs/ with "indicative" | 9 |
| P8 Group operations | 9 | none ("Open at every layer" answered the lock-in worry) | — | 9 |

**Claims** (K03 = claims register, V/F = truth-check-v4 / open-facts rulings)

| Claim | Ruling | Basis |
|---|---|---|
| Three parts, AmIGo / AmIMo / AmIHub | PASS | K03 GREEN complete stack |
| "a few nanoseconds long" | PASS | [B2] step 1. "Sub-nanosecond" and "tens of picoseconds" (old platform km) cut: AGENTS bars "under a nanosecond", no source for picoseconds |
| Times and angles → 3D position | PASS | [B2] step 3, V65 |
| "Down to ±10 cm in 3D" with AmIMo anchors, "How close depends on your floor" | PASS | Charter wording, V61, V62 |
| "sends each zone entry and exit to the systems you name, as it happens" | PASS | F2 |
| "Location alone does not mark work as done." | REWORD → as shown | Was "It never marks work as done by itself": a product limit no source states ([B6] AmIFleet closes work orders). K03 NEVER rule says location alone cannot show completion |
| "Link each trolley to the job it carries, in AmIHub or from your own system." | PASS | F3. Old "a link with a start, an end and an owner" cut (V108) |
| On-premise, no internet | PASS | K03 GREEN, V66 |
| Cloud | REWORD | "Hosting terms are set in your contract" cut: unsourced, C21. "Ask on the call which model fits" ships |
| "TLS ... retention rules" | PASS | [B5] security, F11 (low doubt) |
| 50 m, line of sight, survey | PASS | K03 AMBER with its qualifier, V59, V60 |
| 1 to 3 years, depending on use | PASS | K03 AMBER |
| UWB, BLE, Wi-Fi FTM on the same anchors | PASS | K03 GREEN; "device support confirmed per site" (AGENTS) |
| FiRa and omlox | PASS | Charter wording |
| MCP: "Asking changes nothing. Any change needs a person's approval. We show it live on a call." | PASS | V37, V38, V41 |
| No data or sync cable, Ethernet option, DC or PoE | PASS | F8, C20 wording |

**Open facts used:** O5 (no AmIHub screen; model-hall crop never called AmIHub). O8, O9 kept out. O1–O4, O6 not touched.
**Blocked:** none.
