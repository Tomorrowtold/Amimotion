# /learn/dwell-time/

**Title tag:** How dwell time is measured in manufacturing | AmIMotion
**Meta description (151):** Dwell time is the time a carrier spends in a zone, from entry to exit. How RTLS measures it, what it includes, and how AmIMotion shows where WIP waits.
**H1:** How is dwell time measured? / From zone entry to zone exit.
**Lede:** What dwell includes, where the edge cases hide, and how AmIMotion times every wait.

## Head

**The short answer** (speakable, the quotable paragraph):

Dwell time is the time a tagged carrier spends inside an agreed zone, from the moment it enters to the moment it leaves. A real-time location system measures it by time-stamping every zone entry and exit. AmIMotion does this in AmIHub, with AmIGo tags located down to ±10 cm in 3D, depending on the site, so neighbouring queues and stations can be told apart. You see how long each carrier has waited while it is still waiting.

Picture (slot L02, photo): Model-hall still from team/rounds/03-hero-film/build_hall.py: camera A (11 m up, 45 degrees down, 35 mm), cropped 4:3 to the inspection station and its queue. Three trolleys on amber, one in the station on blue. The homepage screen 3 frame, cropped tighter.
Alt text: "A model inspection station. One trolley is being worked on. Three trolleys in the queue in front of it are marked amber because they are waiting."

## Sections (read() article, on-this-page list on the left)

### Start with the zones

A zone is an agreed area of the floor, such as an inspection queue or a dock lane. Draw zones around the process, not around radio coverage. In AmIHub you name the zones yourself. Neighbouring zones need positions precise enough to tell them apart, which is why UWB is used where queues sit side by side.

Picture: none.

### Entry, exit and the edge

Every time a tag crosses a zone boundary, AmIHub records a time. Agree what counts as a visit: a short pass through a zone on the way somewhere else should not count as waiting. A trolley parked across a boundary is the hard case. Agree a rule for it before the pilot, and ask any supplier, AmIMotion included, to show how its system handles that case.

Picture: none.

### What dwell includes

Dwell is not cycle time. Dwell includes waiting, processing, breaks and anything else that happens while the carrier sits in the zone. To separate waiting from working you need another signal, such as a start or finish event from your MES, or a scan. AmIHub can take those events from your own systems.

Picture: none.

### Waits that cross a shift

A wait can start on one shift and end on the next. Before an AmIMotion pilot starts, we agree how to count a wait that runs past shift end, so every report reads the same way.

Picture: none.

### Using it well

- Name who on your team acts when work waits too long.
- Compare dwell by shift, product and station, not just averages.
- Treat a long dwell as a reason to look, not as a diagnosis.

Picture: none.

### How AmIMotion does it

AmIHub time-stamps every enter, exit, idle and dwell event and keeps the history, so you can ask for time in zone by shift, station or time window. AmIHub also sends each entry and exit to any system you name, as it happens, over MQTT, REST or WebSocket. Why work waited is for your team to say.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**How can I see where work in progress is waiting?**
Tag the carriers, name the zones where work queues, and time every entry and exit. AmIHub shows how long each tagged carrier has waited in each zone.

**Is dwell time the same as cycle time?**
No. Dwell is time in a zone and includes waiting and processing. Cycle time needs process start and finish events, which AmIHub can take from your MES.

**Do we need an MES to measure dwell?**
No. Dwell comes from location and time alone. The MES link adds which job was waiting.

**How is a wait that runs past shift end counted?**
AmIMotion agrees the rule with your team before the pilot starts, so every report counts it the same way.

## Read next (related block)

- [What is WIP visibility?](/learn/wip-visibility/): Where each job is, and how long it waited.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.
- [Measure before you claim](/learn/pilot-baseline/): The baseline, before any tag goes on.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/association/, /learn/pilot-baseline/, /learn/wip-visibility/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P3 and P2: how is dwell measured, and what does it include? Next: WIP visibility, job links, baseline.
**Reference.** P3's test from kit 09: a number with a definition; unfinished visits named.
**Drafts.** A: old page. B: definition, zones, the boundary case, shift end, then how AmIHub does it. Picked B: V107 asks for the boundary case or an honest “open”.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P3 IE / lean lead | 8 | Shift-end waits not covered. | O7 safe line added as its own section and FAQ. | 9 |
| P2 Production manager | 9 | None. | none needed | 9 |
| P6 MES owner | 8 | Did not say how events reach my system. | Entry and exit streamed to any named system, over MQTT, REST or WebSocket (F2). | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| AmIHub time-stamps enter, exit, idle and dwell; history by time window | PASS | [B5] |
| Sends each entry and exit to any system you name, as it happens | PASS | F2, [B5] day one |
| Boundary case: “ask any supplier, AmIMotion included, to show how” | PASS | V107: the case is named and left open, no rule claimed |
| Shift-end rule agreed before the pilot | PASS | O7 safe line |
| “a limit becomes an event” | STOP (kept out) | V25, V107 |

**Open facts used:** O2 and O7: safe lines only. If a founder confirms O7's default, add it in one line under “Waits that cross a shift”.
