# /learn/location-data-quality/

**Title tag:** What happens when an RTLS tag goes quiet? | AmIMotion
**Meta description (141):** When an RTLS tag is not seen for a while, a good system shows last seen, never a guess. How AmIMotion handles freshness, gaps and tag health.
**H1:** When a tag goes quiet. / Last seen, never a guess.
**Lede:** Why tags go quiet, what the map should show, and how to check it in a pilot.

## Head

**The short answer** (speakable, the quotable paragraph):

When an RTLS tag is not seen for a while, the honest answer is “last seen here, at this time”, not a guess at where it is now. AmIMotion's AmIHub keeps every position with the time it was seen, so you see where each trolley was last seen, and when. AmIGo tags send as they move and sleep when still, so a quiet tag at rest is normal. Battery life is 1 to 3 years, typical and usage-dependent, and AmIHub tracks each tag's health and battery level.

Picture (slot L04, photo): Model-hall still from team/rounds/03-hero-film/build_hall.py: camera A, cropped 4:3 to the press and racks. The homepage screen 2 frame (last seen), reused.
Alt text: "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped."

## Sections (read() article, on-this-page list on the left)

### Why tags go quiet

- The tag is still and asleep, which saves battery. AmIGo tags deep-sleep at rest and wake on motion.
- The tag is somewhere with poor coverage, such as inside a metal cage.
- The battery is low. AmIHub tracks each tag's battery level, so you can change it before it goes flat.
- The tag came off, or was moved to another object. If it comes off the trolley, the map still shows its last-seen spot.

Picture: none.

### Freshness is its own measure

How often a tag sends, how long processing takes and how often a screen refreshes are three different things. A precise point can still be too old to act on. AmIGo tags report at a rate set per tag group, from 0.1 to 10 times a second, and wake on motion. Set a freshness target for each task.

Picture: none.

### What the map should show

Old data shown as old. A trolley not seen for an hour should read as last seen an hour ago, in its last place, with nothing suggesting it is live. AmIMotion's map shows where each trolley was last seen, and when.

Picture: none.

### When an anchor goes dark

Tags are not the only thing that can go quiet. AmIHub watches the health of every AmIMo anchor and alerts when one goes dark, so a gap in coverage is found before people trust an empty area.

Picture: none.

### Checking quality in a pilot

Count how often tags are found where people expect them, how old positions are when people use them, and how many corrections people make. Run the count in an AmIMotion pilot before and after any change to anchors or tag rates.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**What happens if an RTLS tag is not seen for a while?**
AmIHub keeps its last position and the time it was seen, and the map shows where it was last seen. AmIMotion does not guess where the tag is now.

**How long do AmIGo batteries last?**
1 to 3 years, typical and usage-dependent. AmIHub tracks each tag's battery level.

**Can a tag be moved to another trolley?**
Yes. Tags are assigned to objects in AmIHub, so you reassign it there.

**What if an anchor stops working?**
AmIHub monitors anchor health and alerts when an anchor goes dark.

## Read next (related block)

- [How accurate is UWB?](/learn/accuracy/): Typical, best case and the hard places.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.
- [AI assistants and location data](/learn/mcp-location-data/): MCP, access and approval.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/accuracy/, /learn/association/, /learn/mcp-location-data/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P4 and P5: what does a quiet tag mean? Next: accuracy, job links, MCP.
**Reference.** [CW] “Last observed in Zone B at 10:42”: old data shown as old.
**Drafts.** A: old page. B: last seen first, battery and health, anchors going dark. Picked B: it answers P5's outage worry as far as sources go.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P4 Supervisor | 9 | None. | none needed | 9 |
| P5 OT engineer | 7 | What happens when an anchor dies? | Dark-anchor alert added; recovery time left out (O8). | 9 |
| P10 EHS lead | 9 | None. | none needed | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| Last seen, and when | PASS | V14, [CW] |
| AmIHub tracks each tag's health and battery level | PASS | F7, [B5]; “ahead of time” cut |
| If it comes off the trolley, the map still shows its last-seen spot | PASS on AMBER | F6 |
| Alerts when an anchor goes dark | PASS | [B5] |
| Tilt or impact reported to AmIHub | STOP (kept out) | O4 |

**Open facts used:** O4 kept out. O8 (outage behaviour, rejoin time) kept out; only the dark-anchor alert ships.
