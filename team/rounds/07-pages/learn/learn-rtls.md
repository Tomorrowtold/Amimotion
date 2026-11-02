# /learn/rtls/

**Title tag:** What is RTLS? Real-time location, explained | AmIMotion
**Meta description (150):** A real-time location system (RTLS) uses fixed anchors to locate tagged objects indoors. How it works, what it can and cannot tell you, with AmIMotion.
**H1:** What is RTLS? / Location you can look up, indoors.
**Lede:** A plain guide for anyone new to real-time location on a factory floor.

## Head

**The short answer** (speakable, the quotable paragraph):

A real-time location system (RTLS) uses fixed receivers, called anchors, to work out where tagged objects are, usually indoors where GPS does not reach. A useful record has three parts: which object, where, and when it was seen. AmIMotion is a UWB RTLS. AmIGo tags ride on trolleys, bins and tools, AmIMo anchors hear them, and AmIHub software shows each position, down to ±10 cm in 3D with AmIMo anchors, depending on the site.

Picture (slot L01, still): The AmIGo tag beside the AmIMo anchor at true relative size. Source: CAD render pair_scale.png (team/rounds/02-design/renders/), graded to the page ground.
Alt text: "The AmIGo tag and the AmIMo anchor side by side, both dark grey."

## Sections (read() article, on-this-page list on the left)

### How a position is made

A tag on a trolley sends a short radio pulse as it moves. Anchors fixed on columns and walls record when the pulse arrives, and software turns those times into a position.

In AmIMotion, the AmIGo tag sends the pulse. Each AmIMo anchor in range records when it arrived and, with its 3D angle-of-arrival antenna, the direction it came from. AmIHub combines timing, angle and the floor map into one position and puts it on the live map.

Picture: none.

### Which radio it uses

An RTLS can run on ultra-wideband (UWB), Bluetooth Low Energy (BLE), passive RFID, Wi-Fi or a mix. UWB times very short pulses, so it can tell neighbouring lanes apart. BLE is cheaper and usually works at room or zone level. RFID records a read when a tag passes an antenna.

AmIMotion is built on UWB. AmIMo anchors also range BLE devices and Wi-Fi FTM devices, with device support confirmed per site.

Picture: none.

### What it can tell you

- Where each tagged object is now, or where it was last seen.
- Where it went, as a trail.
- When it entered and left each zone, and how long it stayed.
- Which objects are in an area at a given time.

Picture: none.

### What it cannot tell you on its own

Location shows where a trolley is. Location alone does not show which job the trolley carries, whether work on it is finished, or why it is waiting. AmIMotion links each trolley to its job in AmIHub or from your own system, and the reason for a wait stays with your team.

Picture: none.

### A short checklist

Ask any RTLS supplier, AmIMotion included, to show five things live: the right tag on the right object, position quality in your conditions, how old each position is, how jobs are linked to carriers, and who on your team responds. The five tell you more than a moving dot on a demo screen.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**What does RTLS stand for?**
Real-time location system. AmIMotion's RTLS uses UWB tags, anchors and AmIHub software.

**Is RTLS the same as GPS?**
No. GPS uses satellites and works outdoors. An RTLS such as AmIMotion uses anchors installed in your building, so it works indoors.

**Which radio does an RTLS use?**
UWB, BLE, RFID, Wi-Fi or a mix. AmIMotion uses UWB, and the same AmIMo anchors also range BLE and Wi-Fi FTM devices, with device support confirmed per site.

**Does RTLS work outdoors?**
AmIMo anchors work indoors and in sheltered outdoor areas, such as a yard under a canopy.

## Read next (related block)

- [UWB, BLE or RFID?](/learn/uwb-vs-rfid/): Choose by the question you ask.
- [What is WIP visibility?](/learn/wip-visibility/): Where each job is, and how long it waited.
- [Glossary](/glossary/): Floor words and tech words, plainly.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/glossary/, /learn/uwb-vs-rfid/, /learn/wip-visibility/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P1 or P11 new to RTLS: what is it, and is it for me? Next: UWB vs RFID, or WIP visibility.
**Reference.** How Search Works: a big system in plain steps.
**Drafts.** A: the five-step checklist page. B: definition, then how a position is made from [B2]'s three steps, then can and cannot. Merged: B's order, A's closing checklist.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P1 Plant head | 7 | “Turn the map into a question” was abstract. | Replaced by a plain can / cannot pair. | 9 |
| P11 Promoter | 8 | Wanted to know if this is GPS. | FAQ “Is RTLS the same as GPS?” added. | 9 |
| P4 Supervisor | 8 | Checklist read as a vendor test, not my job. | Kept; the supervisor's task lives in the accuracy guide. | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| Pulse, arrival time, angle, AmIHub combines timing, angle and map | PASS | [B2] steps 1-3; no “sub-nanosecond” (AGENTS rule) |
| AmIMo also ranges BLE and Wi-Fi FTM devices, device support confirmed per site | PASS | [B4]; Wi-Fi FTM wording rule |
| Indoors and sheltered outdoor areas | PASS | [B4] |
| Location alone does not show the job, completion or why | PASS | K03 NEVER, stated as a limit |

**Open facts used:** Picture slot L01 waits on pair_scale.png being graded to the page ground (Realism lab).
