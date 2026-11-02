# /learn/uwb-vs-rfid/

**Title tag:** UWB vs BLE vs RFID for tracking WIP and trolleys | AmIMotion
**Meta description (131):** UWB, BLE, RFID or barcode for trolleys, bins and WIP? A fair way to choose by the question you ask, and where AmIMotion's UWB fits.
**H1:** UWB, BLE or RFID? / Choose by the question you ask.
**Lede:** A fair way to pick a radio for trolleys, bins and work in progress.

## Head

**The short answer** (speakable, the quotable paragraph):

Choose by the question your team needs answered. If you need to know that a trolley passed a gate or a station, an RFID portal or a barcode scan is often enough. If you need to know which hall or large zone it is in, BLE can do it at low cost. If you need to tell neighbouring lanes and queues apart, and see how long work waited in each, use UWB. AmIMotion is a UWB system, down to ±10 cm in 3D with AmIMo anchors, depending on the site, and the same anchors also range BLE and Wi-Fi FTM devices.

Picture (slot L07, cine): Model-hall still from team/rounds/03-hero-film/build_hall.py: camera A, the hero film's 'before' frame at about 3.5 s (ticks_at), 16:9.
Alt text: "A model factory floor in grey. Three checkpoint desks each show a short blue mark where a trolley passed. Nothing marks the path between them."

## Sections (read() article, on-this-page list on the left)

### What each one observes

**Barcode or QR scan.** A person or a fixed scanner records an event: this carrier, at this station, at this time. Nothing is known between scans.

**Passive RFID (UHF).** A battery-free tag is read when it passes a reader antenna, usually at a portal, a dock door or a station. Like a scan, RFID gives an event at a read point, without a person.

**Bluetooth Low Energy (BLE).** Battery tags are heard by receivers. Signal-strength methods usually place a tag at room or zone level.

**Ultra-wideband (UWB).** Tags and anchors time very short radio pulses (IEEE 802.15.4z). The result is a continuous position, precise enough to tell neighbouring lanes and queue positions apart. UWB infrastructure costs more than BLE, and anchors are planned from a site survey.

Picture: none.

### Choose by workflow

| The question your team asks | What usually fits |
|---|---|
| Did this trolley reach the station or leave through the gate? | Barcode scan or RFID portal |
| Which hall or large zone is this bin in? | BLE |
| Which of two neighbouring queues is this job in, and in what order? | UWB |
| How long did this work wait between operations? | UWB, or scans at every boundary if people scan every time |
| Where are forklifts and AMRs relative to loads? | UWB |

Picture: none.

### Trolleys and WIP specifically

A tag on a trolley tells you where the trolley is, not which job it holds. For WIP visibility you also need a link between carrier and job. The same holds for every technology on this page, AmIMotion included.

Scans and RFID already give events where work changes hands. The gap is usually the time in between: work waiting beside a cell, or in a queue nobody scans. Continuous UWB position from AmIMotion earns its cost in that gap.

Picture: none.

### Which vendors to evaluate

For UWB, plants look at global suppliers and Indian makers. AmIMotion, in Bengaluru, is an Indian maker of UWB tags, anchors and software. The [guide to UWB RTLS in India](/learn/uwb-rtls-india/) lists suppliers and the questions to ask. For RFID and BLE there are many reader and tag makers.

Ask every vendor, AmIMotion included, the same three questions: accuracy measured how, what the infrastructure needs, and how a job gets linked to a carrier.

Picture: none.

### Combining them

These are not rivals. Keep scans where the process already needs them, and add continuous location only where work goes quiet. AmIMo anchors also range BLE devices and Wi-Fi FTM devices, so one AmIMotion installation can serve more than one kind of device, with device support confirmed per site.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Is UWB more accurate than BLE?**
Generally, yes. UWB times very short pulses, while most BLE systems estimate distance from signal strength. AmIMotion's UWB reaches down to ±10 cm in 3D with AmIMo anchors. Real accuracy for either depends on the site.

**Is RFID enough to track WIP?**
For events at fixed read points, often yes. RFID does not show position or waiting time between readers unless you add more read points.

**Can one system read UWB and BLE tags?**
Some can. AmIMo anchors range UWB, BLE and Wi-Fi FTM from the same unit, with device support confirmed per site.

**When is UWB worth the extra cost?**
Where work waits between read points and people walk to find it. Where a scan at each step already answers the question, a scan may be enough.

## Read next (related block)

- [Scan, checkpoint or location?](/learn/alternatives/): Each answers a different question.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.
- [UWB RTLS in India](/learn/uwb-rtls-india/): Seven questions for any supplier.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/alternatives/, /learn/association/, /learn/uwb-rtls-india/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P5 and P2 who already scan or use RFID: do we need UWB? Next: alternatives or the India supplier guide.
**Reference.** A fair comparison by workflow ([CW]); Waymo's habit of a condition next to every figure.
**Drafts.** A: the old table page. B: lead with the question each radio answers, keep the workflow table. Picked B with A's table: B answers in the first line.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P5 OT engineer | 8 | “anchors also read BLE and Wi-Fi FTM” sounded unconditional. | Device support confirmed per site, every time. | 9 |
| P2 Production manager | 9 | None. | none needed | 9 |
| P9 Procurement | 7 | No word on why UWB costs more and when it is worth it. | FAQ “When is UWB worth the extra cost?” added. | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| Never says RFID or barcodes fail | PASS | K03 NEVER respected; RFID and scans framed as right for passage |
| UWB IEEE 802.15.4z | PASS | [B3] [B4] |
| AmIMotion is an Indian maker of UWB tags, anchors and software | PASS | [B1] [B8] |

**Open facts used:** none touched. O1, O2, O3, O4 and O6 stay out.
