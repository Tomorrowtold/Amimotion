# /learn/association/

**Title tag:** Which job is on the trolley? Carrier-to-job links | AmIMotion
**Meta description (141):** An RTLS tag identifies a trolley, not its job. How carrier-to-job links work, who owns them, and how AmIMotion links tagged carriers to jobs.
**H1:** Which job is on the trolley? / A tag knows the trolley. A link knows the job.
**Lede:** Why location needs a link to the job, and what to agree before a pilot.

## Head

**The short answer** (speakable, the quotable paragraph):

An RTLS tag identifies the trolley, not the job on it. To know which job is on a trolley, the system needs a carrier-to-job link: a record that this carrier holds this job, from one moment until another. In AmIMotion you link each trolley to the job it carries, in AmIHub or from your own system, and its wait then counts as that job's wait. AmIGo tags are located down to ±10 cm in 3D, depending on the site, but the radio alone never knows the job.

Picture (slot L06, photo): Model-hall still from team/rounds/03-hero-film/build_hall.py: new camera C (about 2.5 m up, 30 degrees down, 50 mm) on one loaded trolley at the press, tagbox() on the top rail. The tag box is the hall's simplified shape, not a drawn AmIGo.
Alt text: "A model trolley loaded with parts beside a press. A small dark grey tag sits on its top rail."

## Sections (read() article, on-this-page list on the left)

### One trolley, two identities

Trolley 14 has its own tag. Job 208 is what it carries today. Keeping the two apart stops a reused trolley from dragging an old job forward. AmIMotion tags the trolley and links the job.

Picture: none.

### Why a link needs a start and an end

A trolley carries one job, is emptied, and carries another. A link with no end would credit the second job's wait to the first. Agree who starts each link, who ends it, which event marks the change, and how mistakes get corrected. Agree those four things for AmIMotion or any other system before the pilot.

Picture: none.

### Linking in AmIHub

In AmIHub, work orders are objects of their own, and tags are assigned to them. You can link a trolley to its job in AmIHub, or send the link from your own system through the same interfaces AmIHub offers for everything else, REST and MQTT. How your plant links jobs today, by a scan, a record or a person, is agreed during scoping.

Picture: none.

### Respect the system of record

Your MES or ERP stays the authority on jobs and status. AmIHub supplies where and when. Agree the source of each field, so a location event never implies a business step. Agree up front, with AmIMotion or any supplier, that a trolley moving never changes a job's status on its own.

Picture: none.

### Plan for the unknown

If there is no link, a good system shows the trolley's position and says the job is unknown. If a position is old, it shows the time it was last seen. An honest partial answer beats an invented full one, and AmIMotion's map shows where each trolley was last seen, and when.

Picture: none.

### What to ask any supplier

Ask how jobs get linked, how links are kept and changed, which way data flows, and how mixed or split loads are handled. Then ask to see that workflow in a live demo. AmIMotion's demo on a call runs on real AmIHub data.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**How do I know which job is on a trolley with RTLS?**
Link the trolley's tag to the job it carries. In AmIMotion you make the link in AmIHub or from your own system, and AmIHub shows it with the trolley's position.

**Does AmIMotion track individual parts?**
AmIMotion tags the carrier: the trolley, bin or rack. Which parts or job it holds comes from the carrier-to-job link, not from the radio.

**What if one trolley carries several jobs?**
Agree how mixed and split loads are linked before the pilot. How AmIHub records them for your plant is settled during scoping.

**Does the link need our MES?**
No. You can link trolleys to jobs in AmIHub. Your MES or ERP can send the links later, when the pilot earns that connection.

## Read next (related block)

- [What is WIP visibility?](/learn/wip-visibility/): Where each job is, and how long it waited.
- [Value before the MES link](/learn/value-without-mes/): What location proves on its own.
- [How dwell time is measured](/learn/dwell-time/): From zone entry to zone exit.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/dwell-time/, /learn/value-without-mes/, /learn/wip-visibility/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P6 and P2: which job is on the trolley? Next: WIP visibility, value without MES, dwell.
**Reference.** [CW] association contract: identities kept apart, a lifetime for each link.
**Drafts.** A: old page, which claimed AmIHub keeps a start, an end and “Job unknown”. B: why a link needs a start and an end, then what AmIHub does ([B5], [B7]). Picked B under V108.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P6 MES owner | 8 | Wanted to know who owns status. | System-of-record section: agree that movement never changes status on its own. | 9 |
| P2 Production manager | 9 | None. | none needed | 9 |
| P12 Integrator | 7 | Which interface carries the link? | REST and MQTT named; method agreed during scoping (Q5). | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| AmIHub keeps the link with a start, an end and an owner | STOP (reworded) | V108: says why a link needs them, without claiming AmIHub records them |
| “shows Job unknown” | STOP (reworded) | No source; now advice: “a good system says the job is unknown” |
| “One carrier can hold several links at once” | STOP | O10 open; now “settled during scoping” |
| Work orders as objects, tags assigned; same tools over REST and MQTT | PASS on AMBER | [B5], [B7], V108 |
| “AmIMotion does not change a job's status because a trolley moved” | STOP (reworded) | [B6] says work orders can close on completion; now an agreement the reader makes |

**Open facts used:** O10: no MES job-number method and no one-to-many rule. Q5 (how links are made today) stays open.
