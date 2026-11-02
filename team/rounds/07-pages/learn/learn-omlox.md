# /learn/omlox/

**Title tag:** What is omlox? The open standard for RTLS | AmIMotion
**Meta description (151):** omlox is an open standard for industrial location, so different technologies and vendors feed one hub. What it means, and how AmIMotion is built on it.
**H1:** What is omlox? / One open hub for every location system.
**Lede:** The open standard behind interoperable industrial location, in plain words.

## Head

**The short answer** (speakable, the quotable paragraph):

omlox is an open standard for interoperable industrial location systems. The standard defines a common hub interface and data model, so location data from different technologies and vendors, such as UWB, BLE and RFID, can feed one location hub. AmIMotion is built on the FiRa and omlox specifications. AmIHub offers an omlox hub interface next to REST, MQTT and WebSocket, and its UWB positions reach down to ±10 cm in 3D with AmIMo anchors, depending on the site.

Picture: none.

## Sections (read() article, on-this-page list on the left)

### Why omlox exists

Plants often end up with several location systems: RFID at the docks, BLE for one area, UWB for carriers, a fleet manager for robots. omlox lets them meet in one hub instead of one integration per vendor. A plant that adds AmIMotion can keep its other location sources in the same model.

Picture: none.

### The parts

omlox covers a hub that collects location data and a standard way for devices and systems to talk to it. Applications read one model of objects, zones and positions, whatever technology produced them. AmIHub's omlox hub interface is one of those standard ways in and out.

Picture: none.

### And FiRa?

The FiRa Consortium is an industry body that defines interoperable UWB specifications and runs certification programmes for UWB devices. FiRa covers the radio. omlox covers the location data above it. AmIMotion is built on both specifications.

Picture: none.

### A specification, or a certification?

Following a specification is a company's own statement. A formal certification means an authorised body has tested the product against the specification. AmIMotion describes itself as built on the FiRa and omlox specifications, and that is the claim to read.

Picture: none.

### omlox in AmIMotion

AmIHub has an omlox hub interface, and its data and device model follow the FiRa and omlox specifications. The same positions and events are available over REST, MQTT and WebSocket. AmIMotion keeps your location data open, whichever systems you add later.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**What is omlox?**
An open standard for industrial location systems, so different technologies and vendors can feed one location hub. AmIMotion is built on the omlox specification.

**Does AmIMotion hold FiRa or omlox certification?**
AmIMotion is built on the FiRa and omlox specifications. AmIMotion claims no formal certification.

**What is FiRa?**
The FiRa Consortium defines interoperable UWB specifications and runs certification programmes for UWB devices.

**Do I need omlox to use AmIMotion?**
No. AmIHub also offers REST, MQTT and WebSocket. omlox matters most when several location systems must feed one hub.

## Read next (related block)

- [How it locates a tag](/technology/): Timing, angle and reflections.
- [UWB, BLE or RFID?](/learn/uwb-vs-rfid/): Choose by the question you ask.
- [Glossary](/glossary/): Floor words and tech words, plainly.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/glossary/, /learn/uwb-vs-rfid/, /technology/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P8 and P6 asking what omlox is and whether AmIMotion is locked in. Next: technology, UWB vs RFID.
**Reference.** A definition page an AI can quote in one sentence.
**Drafts.** A: old page. B: definition, why it exists, FiRa beside it, spec versus certification. Picked B: it answers the FiRa question buyers ask next.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P8 Digital transformation | 8 | No line on why it matters for my next system. | “keep its other location sources in the same model”. | 9 |
| P6 MES owner | 9 | None. | none needed | 9 |
| P7 IT / network | 8 | “Is omlox required?” unanswered. | FAQ added: no, REST, MQTT and WebSocket too. | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| AmIHub omlox hub interface | PASS | [B5] “omlox-compatible hub interface” |
| Data and device model follow the FiRa and omlox specifications | PASS (reworded) | [B5] “compliant” replaced by the fixed wording |
| No formal certification claimed | PASS | Roadmap certification is a plan ([D13]); not mentioned |

**Open facts used:** none touched. O1, O2, O3, O4 and O6 stay out.
