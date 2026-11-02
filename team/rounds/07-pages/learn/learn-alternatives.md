# /learn/alternatives/

**Title tag:** Scans, RFID checkpoints or UWB: how to choose | AmIMotion
**Meta description (145):** Barcode scans, RFID checkpoints or UWB location: a fair way to decide which your workflow needs, and when to add AmIMotion to the scans you keep.
**H1:** Scan, checkpoint or location? / Each one answers a different question.
**Lede:** How to decide what your flow needs, before you buy anything.

## Head

**The short answer** (speakable, the quotable paragraph):

Start with the question. Do you need a person to confirm a step, proof that something passed a point, or where it is right now? A barcode scan confirms a step. An RFID checkpoint proves passage without a person. UWB location, such as AmIMotion, shows where work is between those points and how long it waits, down to ±10 cm in 3D with AmIMo anchors, depending on the site. Many plants keep their scans and add location only where work goes quiet.

Picture: none.

## Sections (read() article, on-this-page list on the left)

### Side by side

|   | Barcode scan | RFID checkpoint | UWB location |
|---|---|---|---|
| Who acts | A person scans | Nobody, at the read point | Nobody |
| What you learn | A step is confirmed | An item passed this point | Where it is, where it went, how long it waited |
| Between points | Nothing | Nothing | Continuous position |
| What you install | Scanners and labels | Reader antennas at each point | Anchors on columns, planned from a site survey |

Picture: none.

### When a scan is right

A scan is a deliberate confirmation of an item or a step, such as a quality check. If that is all your process needs, improve the scanning first. AmIMotion does not replace a scan that confirms a step.

Picture: none.

### When a checkpoint is enough

If you only need to know that an item passed a point, such as a dock door, test an RFID checkpoint against exactly that. A checkpoint answers a passage question well.

Picture: none.

### When location adds something

If work moves between scans and people go looking for it, location answers a new question. With AmIMotion, AmIHub shows where each tagged trolley was last seen and how long it has waited in each zone. Location still needs a link to the job and a tested installation.

Picture: none.

### Compare the whole effort

Count everything: anchors or readers, the survey, power, network, tag mounting, reassigning tags, upkeep and the exceptions people handle by hand. Compare the cost of useful answers, not hardware prices alone. AmIMo anchors need power from a DC adapter or PoE, and no data or sync cabling.

Picture: none.

### Use the same test

Give every option the same scenario and the same measures. Record what each one sees, what it misses and how much human effort it needs. Run the same test on AmIMotion in a one-bay pilot.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Do we have to replace barcode scanning?**
No. Keep scans where a person must confirm a step. AmIMotion adds location where work moves and waits between scans.

**When is RFID the better choice?**
When you need proof that items passed fixed points, such as dock doors, and nothing in between.

**How do we compare the options fairly?**
Give each one the same scenario, the same measures and the same time on the floor, then compare what each saw and missed.

## Read next (related block)

- [UWB, BLE or RFID?](/learn/uwb-vs-rfid/): Choose by the question you ask.
- [What is RTLS?](/learn/rtls/): Real-time location, plainly.
- [How a pilot runs](/pilot/): One flow, one bay.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/rtls/, /learn/uwb-vs-rfid/, /pilot/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P3 and P9 comparing approaches before they buy. Next: UWB vs RFID, or the pilot.
**Reference.** Gartner 'solution exploration' job (kit 09 section 5): the approaches side by side.
**Drafts.** A: five short headed lines (223 words, failed the word and figure checks). B: side-by-side table first, then when each is right. Picked B: a table is what this buyer screenshots.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P3 IE / lean lead | 7 | “Compare the whole effort” had no AmIMotion fact in it. | Added AmIMo's power and cabling line. | 9 |
| P9 Procurement | 8 | Wanted to know we can keep the scanners. | FAQ “Do we have to replace barcode scanning?” | 9 |
| P1 Plant head | 9 | None. | none needed | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| AmIMo needs DC or PoE power, no data or sync cabling | PASS on AMBER | K03 AMBER wording; never “wireless” |
| “AmIMotion does not replace a scan that confirms a step” | PASS | Positioning stance, no capability claimed |

**Open facts used:** none touched. O1, O2, O3, O4 and O6 stay out.
