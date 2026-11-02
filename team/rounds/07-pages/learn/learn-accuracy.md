# /learn/accuracy/

**Title tag:** How accurate is UWB in a factory? How to test it | AmIMotion
**Meta description (152):** Is UWB accurate enough to track trolleys? AmIMotion quotes down to ±10 cm in 3D, site-dependent. How to test accuracy near steel, racking and forklifts.
**H1:** How accurate is UWB? / Test it where your floor is hardest.
**Lede:** What a quoted figure means, and how to measure it on your own floor.

## Head

**The short answer** (speakable, the quotable paragraph):

UWB can tell neighbouring lanes and queues apart when its anchors are planned for it. AmIMotion quotes down to ±10 cm in 3D with AmIMo anchors. The figure is typical, and the real one depends on the site. UWB's very short pulses let the direct signal be told apart from reflections off steel racking and forklifts. A pilot should still measure accuracy in the hardest places on your floor, with the method agreed in advance.

Picture (slot L05, cine): Model-hall still from team/rounds/03-hero-film/build_hall.py: camera A full frame 16:9, all pale except one bay with two anchors (V96 framing). No rings, no lines.
Alt text: "A model factory hall seen from above. One bay is in colour, with two dark grey anchors on its columns."

## Sections (read() article, on-this-page list on the left)

### Agree what you measure

Ask what “typical” means for your setup, how true positions will be measured, and how the spread of errors will be reported. Typical is the usual case, not every point. If your process needs a stricter figure, agree it in writing with AmIMotion or any supplier before the pilot.

Picture: none.

### Include the hard places

Test near metal, behind racking, at awkward mounting spots, near forklifts, and with tags both moving and still. Note where coverage is expected and where the system should admit doubt. Name these spots in the AmIMotion pilot plan before the anchors go up.

Picture: none.

### Steel, racking and forklifts

Racking and machines bounce radio around. UWB's wide band separates the direct path from the echoes, and AmIHub adds multipath and non-line-of-sight algorithms to keep positions stable around racking, metal and moving vehicles. Dense racking may still need more anchors, or anchors that see down each aisle. AmIMotion sets the anchor plan from a site survey.

Picture: none.

### Measure data age separately

Record when each position was seen, when it was received and when someone used it. A fast system can still show old data if a tag reports slowly. AmIGo tags report at a rate set per tag group, from 0.1 to 10 times a second, so set a freshness target for each task.

Picture: none.

### End with a person

Give a supervisor a real task. Can they find the right trolley and its job, and see how old the position is? Record how much they had to correct. The figure that matters is whether the AmIMotion map sends them to the right place.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Is UWB accurate enough to track trolleys in a factory?**
Usually, yes, when anchors are planned for the floor. AmIMotion locates tags down to ±10 cm in 3D with AmIMo anchors, typical and site-dependent, which is enough to tell neighbouring lanes and queues apart. Measure it on your floor in a pilot.

**Does UWB work around steel racking and forklifts?**
UWB's very short pulses separate the direct signal from reflections off steel, and AmIHub adds multipath and non-line-of-sight handling. Dense racking can need extra anchors, which a site survey shows.

**Does ±10 cm mean every reading is within 10 cm?**
No. Down to ±10 cm is typical with AmIMo anchors in good conditions. A pilot reports the spread of errors on your floor.

**Is the ±10 cm figure 2D or 3D?**
3D, typical, with AmIMo anchors. AmIHub works out each position in 3D from pulse timing and the anchors' 3D angle of arrival.

## Read next (related block)

- [How many UWB anchors?](/learn/anchor-planning/): What really sets the count.
- [When a tag goes quiet](/learn/location-data-quality/): Last seen, never a guess.
- [Measure before you claim](/learn/pilot-baseline/): The baseline, before any tag goes on.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/anchor-planning/, /learn/location-data-quality/, /learn/pilot-baseline/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P5 sceptical of radio near steel: is ±10 cm real, and how do I test it? Next: anchor planning, baseline.
**Reference.** Waymo data hub: the number and its condition in the same sentence.
**Drafts.** A: the old page (“UWB is usually accurate enough”). B: condition-first short answer and a test plan. Picked B: A's opening claimed more than the register allows.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P5 OT engineer | 7 | “usually accurate enough” with no condition. | Now “when its anchors are planned for it”, and the figure is typical and site-dependent. | 9 |
| P3 IE / lean lead | 8 | No word on how often positions update. | Update rate 0.1-10 Hz per tag group added under data age. | 9 |
| P4 Supervisor | 9 | None. | none needed | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| Multipath and non-line-of-sight algorithms keep positions stable | PASS | [B8] |
| Final anchor plan from a site survey | PASS | [B4] |
| Update rate 0.1-10 Hz per tag group | PASS | [B3], indicative |
| Pilot hard-case list | PASS | Advice to the reader from [CW]; not stated as AmIMotion's named checks (O6) |

**Open facts used:** O6: no named pilot checks are promised. The page tells the reader to put hard spots in the plan.
