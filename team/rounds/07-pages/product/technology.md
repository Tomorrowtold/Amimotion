# /technology/ — How it locates a tag

Product squad, round 07, 2 Nov 2026. Generator: `p_solutions.py` (technology block). Nav line: "Steel, racking, signal and outages". Close: default for /technology/.

## Job of the page

- **Buyer:** P5 OT and maintenance engineer first ("Radio won't work with all this steel"), P7 IT, P8 group operations (standards), and AI assistants answering "how does UWB measure position?".
- **Question:** "How does it actually find a tag, does it hold up in a steel hall, and what happens when something drops?"
- **Next step:** the survey (/tools/anchors/) or a call.
- **Best reference:** ciechanow.ski for explaining a mechanism from first principles in one idea per screen; Stripe docs for putting the answer in the first paragraph. The page keeps the nav's four words as its four middle sections: signal, steel and racking, outages, then modes and standards.

## Two drafts, one pick

- **Draft A:** H1 "Find it first." / "Then add meaning." Opens on positioning versus context, then physics, multipath, modes, data quality, openness.
- **Draft B:** H1 "How AmIMotion locates a tag." Opens on the answer, then one screen each for time and angle, steel and racking, when something goes quiet, modes, standards.
- **Pick: B.** A's H1 is a formula pair and the "meaning" half belongs to /industrial-spatial-intelligence/. A also had no section on outages, which the nav line promises. B's H1 is the nav label as a sentence, so the label, the page and AI answers agree.

---

## The page

**write()**
- Title (≤65): `How AmIMotion locates a tag: UWB timing, angle and steel`
- Description (≤160): `An AmIGo tag sends a UWB pulse. AmIMo anchors time it and read its angle. AmIHub works out a 3D position. How it works, and what steel does to it.`
  - Rejected: "...down to ±10 cm, even among steel and racking." Reads as the figure in every spot.
- meta: `type="article"`.

**head()**
- H1: "How AmIMotion locates a tag."
- Lede: "A tag sends a pulse a few nanoseconds long. Anchors note when it arrives and where it came from. AmIHub works out the spot."
- Short answer:
  > AmIMotion locates tags with ultra-wideband (UWB) radio, to IEEE 802.15.4z. An AmIGo tag sends a pulse a few nanoseconds long. Each AmIMo anchor in range records its time of arrival and its angle of arrival. AmIHub compares the times between anchors (time difference of arrival, TDoA) and the angles, and works out a 3D position. With AmIMo anchors that is down to ±10 cm, typical. How close depends on your floor. AmIMotion is built on the FiRa and omlox specifications.
- trail: Positioning modes (#modes) · Specifications (/specs/)
- media: `slot(..., "cine")` full width.
  - **Shows:** one aisle of the model hall between two rows of racking, one trolley stopped behind the racks on a blue floor tint, its one blue trail from the press ending where it stands; two AmIMo blocks on the nearest columns. Everything else pale.
  - **Source:** model-hall still, `build_hall.py` camera A, t = 0.0, 16:9 crop centred on the racks (the homepage "Find it" frame, wider). Owner: Realism lab.
  - **Alt:** "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped."

**Section 1.** `section(vp("Light travels about 30 cm", "in a nanosecond.", lede=...), tiles([...], 3))`
- Heading: "Light travels about 30 cm" / "in a nanosecond."
- Lede: "So the time a pulse takes to reach each anchor says how far it went. Small timing differences between anchors become a position."
- Points:
  - "Time" — "Each AmIMo anchor records when the pulse arrives. The differences between anchors place the tag. This is time difference of arrival, TDoA."
  - "Angle" — "An antenna array in each AmIMo reads the direction the pulse came from, side to side and up and down. So fewer anchors fix a position, and height counts."
  - "The map" — "AmIHub combines the times, the angles and your floor map into one 3D position, stamped with the time it was seen."
- Picture: diagram owed (S10). `slot(..., "wide")` 16:9.
  - **Shows:** a plan of one bay seen from straight above: two AmIMo anchors on columns and one AmIGo tag on a trolley; nothing else. No arcs, no rings, no glow. The diagram's only marks are the anchors, the tag and one thin line from the tag to each anchor, labelled by nothing.
  - **Source:** model-hall still, new camera "P" in `build_hall.py`: orthographic, straight down (pitch 90°), over the inspection bay, ortho scale 14 m, t = 0.0, blue trails off, one 30 mm #3a3d42 line on the floor from the tagged trolley to the foot of each anchor column. Owner: Explainer diagram designer with the Realism lab. Not drawn in code.
  - **Alt:** "A model inspection bay seen from above: one tagged trolley and the two anchors on the columns that hear it."

**Section 2.** `section(vp("Steel and racking."), split("What they do to the signal.", paras, media=slot(...)), more([...]))`
- Heading: "Steel and racking."
- split h3: "What they do to the signal."
- Body:
  > Steel and racking bounce radio around a hall. Each echo arrives a little after the direct signal. A UWB pulse is so short that the direct signal and its echoes arrive apart, so AmIMo can tell them apart.
  >
  > AmIHub adds filters for places where the direct path is blocked. Racking, ceiling height and steel still change how far each anchor reaches. That is why every floor starts with a survey, and why the final anchor count comes from it.
  >
  > How close a position is depends on your floor. You measure it on yours in the pilot, in the hard spots as well as the easy ones.
- Picture: `slot(..., "photo")` 4:3.
  - **Shows:** the racks of the model hall from camera A, cropped tight: the tall racking rows, an aisle, one AmIMo block high on a column at the aisle end. No trail.
  - **Source:** model-hall still, camera A, t = 0.0, 4:3 crop of the 6400 x 8000 poster master over the racks. Owner: Realism lab.
  - **Alt:** "Rows of tall racking in a model factory hall, with an anchor high on a column at the end of the aisle."
- Links line: How many anchors you need (/tools/anchors/) · AmIMo anchor (/products/amimo/)

**Section 3.** `section(vp("When something goes quiet."), tiles([...], 3), more([...]))`
- Heading: "When something goes quiet."
- Points:
  - "A tag at rest" — "AmIGo sleeps when it stops. The map shows where it was last seen, and when."
  - "A tag out of view" — "If a load hides a tag, or it leaves the area the anchors cover, the map keeps its last-seen spot and time."
  - "An anchor goes dark" — "AmIHub raises an alert when an AmIMo anchor stops reporting, so your team knows which one to check."
- Body after the points: "AmIMo sends its data to AmIHub over Wi-Fi, and Ethernet is also an option. How your network design handles an outage is part of the site survey."
- Links line: When a tag goes quiet (/learn/location-data-quality/)
- Picture: none.

**Section 4.** `section(vp("Choose the method per zone.", lede=...), compare([...], rows, note), id="modes")`
- Heading: "Choose the method per zone."
- Lede: "You switch modes per zone in AmIHub, with no hardware swap."
- Comparison (Mode / How it works / Best for):
  - UL-TDoA — The tag sends; anchors compare when it arrived — Thousands of low-power tags across a floor
  - DL-TDoA — Anchors send; the device works out its own position — Devices that work out their own position
  - AoA with two-way ranging — The angle, plus a timed ping and reply — Precise gates, docks and cells
  - BLE and Wi-Fi FTM — Bluetooth ranging and Wi-Fi fine timing from the same anchors — BLE and Wi-Fi devices, and yards. Device support confirmed per site
- Note: "Which modes your hardware revision supports is in the datasheet, shared under NDA."

**Section 5.** `section(vp("Open standards."), prose(...), figures([...]), links([...]))`
- Heading: "Open standards."
- Body:
  > AmIMotion is built on the FiRa and omlox specifications. Its UWB radio follows IEEE 802.15.4z HRP on channels 5 and 9, on NXP Trimension UWB silicon. AmIHub has an omlox hub interface, so your location data is not tied to one vendor's format. AmIMotion claims no formal certification.
- Figures:
  - "802.15.4z" — "The IEEE UWB standard" — "HRP, channels 5 and 9"
  - "FiRa · omlox" — "Built on the specifications" — "No certification claimed"
  - "3 radios" — "UWB, BLE, Wi-Fi FTM" — "On the same anchors"
  - "±10 cm" — "Down to, in 3D" — "Typical, with AmIMo anchors. Depends on your floor"
- Related: How to test accuracy (/learn/accuracy/) "Typical, best case and the hard spots" · Anchor planning (/learn/anchor-planning/) "What sets the count" · What is omlox? (/learn/omlox/) "The open standard for industrial location"

**FAQ.** `faq([...], "Questions about the technology.")`
1. "How does UWB measure position?" — "An AmIGo tag sends a pulse a few nanoseconds long. AmIMo anchors record its time of arrival (time difference of arrival, TDoA) and its angle of arrival. Light travels about 30 cm in a nanosecond, so that timing places the tag to centimetres. AmIHub works out the 3D position."
2. "Which UWB RTLS supports FiRa?" — "AmIMotion is built on the FiRa and omlox specifications, and its UWB radio follows IEEE 802.15.4z. It claims no formal certification."
3. "Which RTLS works with UWB, BLE and Wi-Fi on the same anchors?" — "AmIMotion. AmIMo anchors offer UWB, BLE ranging and Wi-Fi FTM from the same unit, so one install can serve more than one kind of device. Wi-Fi device support is confirmed per site."
4. "How accurate is AmIMotion?" — "Down to ±10 cm in 3D, typical, with AmIMo anchors. How close depends on your floor, so you measure it on yours in the pilot."
5. "Does UWB work in a factory full of steel and racking?" — "A UWB pulse is short enough that AmIMo can tell the direct signal from its echoes off steel, and AmIHub filters places where the direct path is blocked. Racking and steel still change each anchor's reach, so a site survey sets the anchor count."
6. "Does AmIMotion integrate with SAP or an MES over MQTT?" — "AmIHub sends each zone entry and exit over MQTT and offers REST, WebSocket and an omlox hub interface. The connector for your SAP, MES or ERP is confirmed for your site."

**Close** (default): "See it on a live map." — "On a short call we show the live map and an AI query, on real AmIHub data." — Book a call (/contact/)

**Internal links:** /specs/, /products/amimo/, /tools/anchors/, /learn/location-data-quality/, /learn/accuracy/, /learn/anchor-planning/, /learn/omlox/, /contact/.

**JSON-LD notes:** TechArticle (headline = H1, about: "Ultra-wideband (UWB) indoor positioning", publisher AmIMotion `@id`), `speakable` on the short answer. FAQPage from six `<details>`. BreadcrumbList: How it works › How it locates a tag.

**Words:** about 820.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P5 OT engineer | 7 | No outage section: "Your own nav says 'outages'. Where are they?" | Section 3, "When something goes quiet" | 8 (O8: no recovery figure) |
| P7 IT and security | 8 | Old "Link records, keep meaning" split was integration talk on a physics page | Cut; interfaces live on /products/amihub/ and /developers/ | 9 |
| P8 Group operations | 9 | none ("not tied to one vendor's format" answered lock-in) | — | 9 |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| Pulse "a few nanoseconds" | PASS | [B2] |
| "Anchors time it to tens of picoseconds" (old km on /platform/) | **STOP** | No source; [B2] says "sub-nanosecond", which AGENTS bars. Not used anywhere |
| Light ~30 cm/ns | PASS | Physics, no product claim |
| "places the tag to centimetres" (FAQ 1) | PASS | Explains the method; the figure carries its condition in FAQ 4 |
| TDoA, AoA, 3D, height | PASS | [B2], [B4] |
| Direct path vs echoes; filters where the path is blocked | PASS | [B8] multipath and NLOS. "AI-based" dropped |
| Survey sets the count | PASS | [B4] |
| "You measure it on yours in the pilot" | PASS | entity.json fact "measured in a pilot". Names no pilot gate (B46) |
| "A tag out of view ... keeps its last-seen spot and time" | PASS on AMBER | K04 section 3 ("stale data shown as last observed"), [CW] hard cases. Claims no detection, as F6 |
| Dark-anchor alert | PASS | V64 |
| "How your network design handles an outage is part of the site survey." | PASS on AMBER | [B4] survey; [CW] "a second site may need a different mounting/network design". No recovery figure (V106) |
| Modes per zone, no hardware swap | PASS | [B4] |
| DL-TDoA "phone-based, privacy-preserving" | REWORD | No phone claim. "the device works out its own position" |
| Wi-Fi FTM | PASS | "Device support confirmed per site" |
| FiRa/omlox, "claims no formal certification" | PASS | Charter; system-notes wording |
| "not tied to one vendor's format" | PASS | [B2] "not locked to a proprietary format" |
| NXP Trimension | PASS | K03 GREEN; trademark line is in the footer |

**Open facts used:** O8 (safe line; recovery time and position behaviour in an outage stay out). C9 (modes per hardware revision).
**Blocked:** P5 at 8 (O8). Search: panel U25 expects the word "compliant", which the charter bars. The page will not pass U25's third fact; ask the Search lead to change U25's regex to `FiRa.*specification|built on`.
