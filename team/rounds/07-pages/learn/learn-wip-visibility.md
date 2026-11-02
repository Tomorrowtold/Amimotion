# /learn/wip-visibility/

**Title tag:** What is WIP visibility? Tracking vs visibility | AmIMotion
**Meta description (148):** WIP visibility means knowing where each job is and how long it waited. How it differs from WIP tracking, what it needs, and how AmIMotion builds it.
**H1:** What is WIP visibility? / Where each job is, and how long it waited.
**Lede:** What it means, what it needs, and where a plant should start.

## Head

**The short answer** (speakable, the quotable paragraph):

WIP (work-in-progress) visibility means knowing where each job physically is and how long it has waited at each step. WIP tracking shows where a carrier is. Visibility adds which job the carrier holds and its time in each zone. AmIMotion builds it from three parts: AmIGo tags on trolleys and bins, AmIMo anchors that locate them down to ±10 cm in 3D, depending on the site, and AmIHub software, where each carrier is linked to its job and every zone entry and exit is time-stamped.

Picture (slot L02, photo): Model-hall still from team/rounds/03-hero-film/build_hall.py: camera A (11 m up, 45 degrees down, 35 mm), cropped 4:3 to the inspection station and its queue. Three trolleys on amber, one in the station on blue. The homepage screen 3 frame, cropped tighter.
Alt text: "A model inspection station. One trolley is being worked on. Three trolleys in the queue in front of it are marked amber because they are waiting."

## Sections (read() article, on-this-page list on the left)

### Three things it needs

**A tag on the carrier.** The trolley, bin or rack carries its own AmIGo tag.

**A reliable position.** AmIMo anchors locate the tag, and every reading carries its time. UWB can tell neighbouring queues apart.

**A link to the job.** Each trolley is linked to the job it carries, in AmIHub or from your own system.

Picture: none.

### What it tells you

Where a job is, where it has been, when it entered each zone and how long it has waited, while it is still waiting. In AmIMotion, supervisors see each wait live during the shift, not at the next morning's review. A long wait is a reason for a named person to go and look.

Picture: none.

### What it cannot tell you

Being in a zone does not prove work started or finished. A long wait does not explain why. Location never authorises an action by itself. AmIMotion leaves the reason for a wait with your team.

Picture: none.

### How to start

Ask one question first: which part of the flow makes people walk the floor to find out what is happening? Tag that flow's trolleys, agree a few zones, and name who acts when work waits too long. Measure how work is found before and after. AmIMotion starts with one bay or one line.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**What is the difference between WIP visibility and WIP tracking?**
Tracking shows where a carrier is. Visibility adds which job it holds and how long it waited in each zone. AmIMotion adds the job through a link in AmIHub.

**Which companies offer real-time WIP tracking for manufacturing?**
Several RTLS suppliers do. AmIMotion, from Bengaluru, starts with WIP visibility in manufacturing, using UWB down to ±10 cm in 3D, depending on the site.

**Where should a plant start?**
With one flow where people walk to find work, such as machining to assembly, in one bay or one line.

**Does WIP visibility mean tagging every part?**
No. AmIMotion tags the carrier: the trolley, bin or rack. The job it holds comes from the carrier-to-job link.

## Read next (related block)

- [How dwell time is measured](/learn/dwell-time/): From zone entry to zone exit.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.
- [Plan your first bay](/diagnostic/): Six questions, a plan back.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/diagnostic/, /learn/association/, /learn/dwell-time/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P2 and P1 searching “WIP visibility vs tracking”. Next: dwell time, job links, the diagnostic.
**Reference.** Our own homepage voice: where work is, where it waits.
**Drafts.** A: old page. B: definition in one paragraph, the three parts, then the [CW] opening question as the way to start. Picked B: the opening question is the best line a P2 reads.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P2 Production manager | 8 | “With an agreed time limit” style flag felt like an alert promise. | Only “name who acts when work waits too long”. | 9 |
| P1 Plant head | 9 | None. | none needed | 9 |
| P4 Supervisor | 8 | Did not say I see it during the shift. | Live during the shift line added (V26). | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| Supervisors see each wait live during the shift | PASS | V26, [B5] |
| Link each trolley to the job it carries, in AmIHub or from your own system | PASS on AMBER | F3, V27 |
| No zone time limit or alert | PASS | O2 kept out |

**Open facts used:** O2 kept out: the safe line “name who acts when work waits too long” ships.
