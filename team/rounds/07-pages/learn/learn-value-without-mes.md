# /learn/value-without-mes/

**Title tag:** Prove RTLS value without a live MES link | AmIMotion
**Meta description (145):** Can you prove RTLS value before connecting the MES? Yes: search time, waits and dwell come from location alone. How an AmIMotion pilot can start.
**H1:** Value before the MES link? / Yes. Location and time come first.
**Lede:** What location proves on its own, and when the MES connection should follow.

## Head

**The short answer** (speakable, the quotable paragraph):

Yes, you can prove the value of RTLS before a live MES connection. Search time, how long carriers wait in each zone and where work piles up all come from location and time alone. With AmIMotion, a first bay can start with AmIGo tags on one flow's trolleys, located down to ±10 cm in 3D, depending on the site, and AmIHub timing every zone. Link each trolley to its job in AmIHub before you report any result per job. The MES connection can follow when the pilot earns it.

Picture: none.

## Sections (read() article, on-this-page list on the left)

### What location shows on its own

- Where each tagged trolley, bin or tool is, and when it was last seen.
- Time in each zone, by shift and station.
- How often people search, and how long finding something takes.AmIHub gives the first two from AmIGo tags and AmIMo anchors, with no MES connection. Your team counts the third, before and after.

Picture: none.

### What needs the job link

Which job waits where, and lead times per job, need the carrier-to-job link. Start by linking trolleys to jobs in AmIHub, then connect the MES when the pilot earns it. AmIHub offers REST, MQTT, WebSocket and an omlox hub interface for that step, and connectors are confirmed for each site.

Picture: none.

### A pilot plan that works

- Measure search time and walks before any tag goes on.
- Tag one flow's carriers and agree a few zones.
- Link part of the pilot's trolleys to their jobs in AmIHub.
- Compare, then decide on the MES connection.

Picture: none.

### Who to involve, and when

IT is needed from day one, for the network and where AmIHub runs. The MES owner joins when the link is planned. Production and the people who search for work own the baseline. Bring all three to the AmIMotion scoping call.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Can we prove the value of RTLS without a live MES connection?**
Yes. Location and time alone show search time, waits and dwell. Link trolleys to jobs in AmIHub during the pilot, and connect the MES later.

**What does the MES link add?**
Which job is on each carrier, so waits become waits per job.

**Do we need IT involved from day one?**
For the network and where AmIHub runs, yes. The MES connector can come later.

## Read next (related block)

- [Measure before you claim](/learn/pilot-baseline/): The baseline, before any tag goes on.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.
- [How a pilot runs](/pilot/): One flow, one bay.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/association/, /learn/pilot-baseline/, /pilot/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P1 and P6: can we prove it before IT builds an MES connector? Next: baseline, job links, pilot.
**Reference.** Kit 09 objection table: offer a baseline first.
**Drafts.** A: old page (“AmIMotion pilots often start this way”). B: yes-first, then what needs the job link. Picked B: A claimed a pattern no source states.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P1 Plant head | 8 | Who has to be involved, when? | Section added: IT now, MES owner later, production owns the baseline. | 9 |
| P6 MES owner | 9 | None. | none needed | 9 |
| P3 IE / lean lead | 7 | Said AmIHub gives search counts. It cannot. | Fixed: AmIHub gives position and zone time; your team counts searches. | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| “AmIMotion pilots often start this way” | STOP | No source; cut |
| First bay with tags on one flow | PASS | [B8] pilot one bay or line |
| Connectors confirmed per site | PASS | K03 GREEN qualifier |

**Open facts used:** none touched. O1, O2, O3, O4 and O6 stay out.
