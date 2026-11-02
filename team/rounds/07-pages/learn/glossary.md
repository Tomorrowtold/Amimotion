# /glossary/

**Title tag:** Glossary of RTLS and UWB terms | AmIMotion
**Meta description:** Plain definitions of factory location terms: RTLS, UWB, TDoA, angle of arrival, multipath, omlox, FiRa, WIP visibility, dwell, last seen and job links.
**H1:** Glossary of location terms. / Floor words and tech words, in plain English.
**Lede:** 39 terms you will hear when people talk about location on a factory floor.

## Head

**The short answer:**

AmIMotion's glossary defines the words used in real-time location on factory floors, from RTLS and UWB to dwell time and carrier-to-job links. Each term has a plain definition, and where a term names an AmIMotion part, the definition says so. AmIMo anchors locate AmIGo tags down to ±10 cm in 3D, depending on the site.

Picture: none.

## Term index (anchor links to every term), then the groups

### Positioning (H2)

- **RTLS** (#rtls): Real-time location system: fixed infrastructure and software that continuously locate tagged objects, usually indoors where GPS does not work. AmIMotion is a UWB RTLS.
- **UWB** (#uwb): Ultra-wideband: radio that sends very short pulses across a wide band of frequencies. Short pulses allow precise timing, so distance can be measured to centimetres and echoes told apart.
- **Tag** (#tag): The small device fixed to whatever is tracked: a carrier, tool or vehicle. AmIMotion's tag is AmIGo, which wakes on motion and lasts 1 to 3 years on its battery, typical and usage-dependent.
- **Anchor** (#anchor): A fixed device at a known position that receives UWB signals from tags. AmIMotion's anchor is AmIMo, a UWB anchor with a 3D angle-of-arrival antenna array. AmIMo needs power from a DC adapter or PoE, and no data or sync cabling.
- **Time of flight** (#tof): The time a radio signal takes to travel from transmitter to receiver. Multiplied by the speed of light, about 30 cm per nanosecond, it gives distance.
- **TWR** (#twr): Two-way ranging: tag and anchor exchange messages and measure the round trip to work out the distance.
- **TDoA** (#tdoa): Time difference of arrival: a position worked out from the differences in when one signal reaches several synchronised anchors.
- **UL-TDoA** (#ul-tdoa): Uplink TDoA: the tag sends a short blink and the anchors work out its position. Tags only transmit, so many low-power tags can be tracked.
- **DL-TDoA** (#dl-tdoa): Downlink TDoA: anchors transmit and the device works out its own position, like GPS indoors.
- **AoA** (#aoa): Angle of arrival: an antenna array measures the direction a signal comes from. 3D AoA measures the horizontal and the vertical angle.
- **Multipath** (#multipath): Copies of a signal that arrive late after bouncing off metal, walls or racking.
- **NLOS** (#nlos): Non-line-of-sight: the direct path between tag and anchor is blocked, so the strongest signal may be a reflection.
- **Over-the-air sync** (#ota-sync): Keeping anchor clocks in step by radio instead of timing cables. AmIMo anchors sync over the air.
- **Wi-Fi FTM** (#ftm): Fine Timing Measurement (IEEE 802.11mc): Wi-Fi round-trip timing that lets compatible Wi-Fi devices estimate distance without a separate tag.
- **BLE ranging** (#ble): Estimating distance to Bluetooth Low Energy devices. Usually coarse, at room or zone level.
- **Update rate** (#update-rate): How often a tag reports. 0.1 Hz is once every 10 seconds; 10 Hz is ten times a second.
- **Site survey** (#survey): A visit that maps ceiling height, racking, metal and sight lines before anchors go up. AmIMotion sets the final anchor count from a site survey.
- **PoE** (#poe): Power over Ethernet: power delivered over a network cable. An AmIMo anchor can take its power by PoE or from a DC adapter.

### Standards (H2)

- **IEEE 802.15.4z** (#802154z): The UWB standard amendment that adds enhanced and secure ranging. HRP is the high-rate pulse physical layer used by most current UWB chips.
- **FiRa** (#fira): The FiRa Consortium, an industry body that defines interoperable UWB specifications and runs certification programmes.
- **omlox** (#omlox): An open standard for interoperable industrial location systems, so different location technologies and vendors can feed one location hub.
- **Certification** (#certification): A formal certification means an authorised body has tested a product against a specification. Following a specification is a company's own statement. AmIMotion describes itself as built on the FiRa and omlox specifications.

### Operations (H2)

- **WIP** (#wip): Work in progress: partly finished goods moving through production.
- **WIP visibility** (#wip-visibility): Knowing where work in progress physically is, which job each carrier holds and how long it has waited in each zone.
- **Carrier** (#carrier): The trolley, bin, rack or container that holds WIP. In a WIP visibility system the carrier carries the tag.
- **Association** (#association): The link between a tagged carrier and the job it holds, which gives a location its work meaning. A link needs a start, an end and an owner.
- **Zone** (#zone): An agreed area of the floor, such as an assembly queue. Entering or leaving it creates a time-stamped event.
- **Geofence** (#geofence): A boundary drawn on the floor map. Crossing it creates an event, in the same way as a zone.
- **Dwell** (#dwell): Time spent in a zone, from entry to exit. Dwell includes waiting, processing and breaks, so it is not the same as cycle time.
- **Exception** (#exception): A case that asks a person to look, such as work that has waited longer than the team agreed. An exception is not a diagnosis.
- **Last seen** (#last-seen): The last place and time a tag was located. An honest map shows a quiet tag as last seen, never as live.
- **Freshness** (#freshness): How old a position is when someone uses it. A precise position can still be too old to act on.
- **MES, ERP, WMS** (#mes): Manufacturing execution, enterprise resource planning and warehouse management systems: the systems of record for jobs, orders and stock.
- **AGV and AMR** (#amr): Automated guided vehicle, which follows fixed paths, and autonomous mobile robot, which navigates freely.
- **Milk run** (#milk-run): A fixed delivery loop, often by tugger, that feeds line-side stations.

### Software and AI (H2)

- **AmIHub** (#amihub): AmIMotion's software. AmIHub works out positions and keeps the live map, zones, time-stamped events and interfaces: REST, MQTT, WebSocket, an omlox hub interface and a built-in MCP server. AmIHub runs on a PC inside your plant with no internet dependency, or in the cloud.
- **MCP** (#mcp): Model Context Protocol: an open standard that lets AI assistants use external tools and data. AmIHub has a built-in MCP server.
- **Industrial spatial intelligence** (#isi): A time-stamped location for what moves in a plant, joined with context such as jobs and zones, so people, systems and AI assistants can answer where work is and where it waits.
- **Edge** (#edge): Computing done on site, near the equipment, rather than in a remote cloud.

## Read next

- [What is RTLS?](/learn/rtls/): Real-time location, plainly.
- [What is WIP visibility?](/learn/wip-visibility/): Where each job is, and how long it waited.
- [Questions](/faq/): Short answers about AmIMotion.

## Close

Default close: "Questions about your own floor?" / [Book a call](/contact/)

## Internal links

/learn/rtls/, /learn/wip-visibility/, /faq/, /contact/, plus #term anchors.

## JSON-LD notes

type=glossary: DefinedTermSet with 39 DefinedTerm items read from the dt/dd markup (build.py glossary_of), BreadcrumbList, WebPage with speakable. The term markup is kept as raw dl/dt/dd because no lib.py block makes it yet: ask Structure for terms().

## Checks

**Job of the page.** Any buyer or AI assistant looking up one term. Next: RTLS, WIP visibility, FAQ.
**Reference.** DefinedTermSet pages: one plain sentence a machine can lift.
**Drafts.** A: 34 terms. B: 39 terms, adding site survey, PoE, geofence, last seen and freshness, and AmIHub and AmIMo definitions that answer the branded questions. Picked B.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P5 OT engineer | 9 | None. | none needed | 9 |
| P4 Supervisor | 8 | “Exception: dwell above an agreed limit” sounded like an alarm. | Now “work that has waited longer than the team agreed”, a reason to look. | 9 |
| P7 IT / network | 8 | AmIHub entry did not say where it runs. | On-premise or cloud, and the interfaces, added. | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| DL-TDoA “which helps privacy” | Cut | Avoids a phone-location claim |
| Exception “rule breach, dwell above an agreed limit” | REWORD | O2: no zone limit implied |
| AmIMo needs DC or PoE, no data or sync cabling | PASS on AMBER | K03 AMBER |
| AmIGo 1-3 years, typical and usage-dependent | PASS on AMBER | [B3] |

**Open facts used:** Other squads' lines that say “34 terms” should read “39 terms” (nav.json and any related list).
