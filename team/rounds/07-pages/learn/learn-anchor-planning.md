# /learn/anchor-planning/

**Title tag:** How many UWB anchors do I need? | AmIMotion
**Meta description (148):** How many UWB anchors a 5,000 m² shop floor needs: what sets the count, a worked example, and why AmIMotion sets the final number from a site survey.
**H1:** How many UWB anchors? / Fewer than area suggests, more than racking allows.
**Lede:** What sets the count, a worked example, and where the real number comes from.

## Head

**The short answer** (speakable, the quotable paragraph):

No honest formula gives an anchor count from floor area alone. The count depends on the accuracy you need, 2D or 3D, the positioning method, ceiling height, and how much racking and metal block line of sight. An AmIMo anchor reaches about 50 m in line of sight, indicative and site-dependent, and AmIMotion's angle of arrival works with as few as two anchors in view. As a first budget only, an open 5,000 m² hall on this site's 25 m planning grid needs about 15 anchors. AmIMotion sets the final count from a site survey.

Picture (slot L05, cine): Model-hall still from team/rounds/03-hero-film/build_hall.py: camera A full frame 16:9, all pale except one bay with two anchors (V96 framing). No rings, no lines.
Alt text: "A model factory hall seen from above. One bay is in colour, with two dark grey anchors on its columns."

## Sections (read() article, on-this-page list on the left)

### What sets the count

**The task.** “Which hall?” needs far fewer anchors than “which of two neighbouring lanes?”.

**The method.** With TDoA a tag must be heard by several anchors at once: at least three for 2D and four for 3D. With two-way ranging plus angle of arrival, fewer are needed, and AmIMo anchors work with as few as two in view.

**Line of sight.** Tall racking, machine guards, mezzanines and parked vehicles block the direct path. Aisles between high racks often need anchors that see down each aisle.

**Geometry.** Anchors in a straight line give poor accuracy across that line. Spread them around the area where tags move.

**Mounting and power.** AmIMo anchors go on columns, walls, ceiling structure or poles, 3 to 8 m up, and need power from a DC adapter or PoE.

Picture: none.

### A worked example

Take an open hall of 100 × 50 m (5,000 m²) with clear sight lines. Planned on a 25 m grid, that is 5 × 3 = 15 anchor positions. With mixed racking, a grid of about 18 m gives about 28. Dense high racking can need a grid of 12 m or less.

The grids are this site's planning assumptions for a first budget, not an AmIMotion specification. Try your own floor in the [anchor estimator](/tools/anchors/), then let a survey set the number.

Picture: none.

### How to get to a number

- Mark the areas where location changes a decision. Leave the rest out of scope.
- Write the accuracy and update rate each area needs.
- Note ceiling height, racking, aisles and large metal objects.
- Choose a positioning method per area. AmIMo anchors select the mode per zone.
- Lay out anchors for sight lines and geometry, then confirm with a survey and a short pilot in the hardest spot.

Picture: none.

### Questions to ask any supplier

Is the anchor count from a survey of my floor or a rule of thumb? What accuracy is it designed for, and where will it be worse? What cabling does each anchor need? How is accuracy measured at acceptance? AmIMotion answers each one from the site survey.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Can I calculate UWB anchors from floor area?**
Only roughly. Area ignores racking, ceiling height, metal and the accuracy you need. Use area for a first budget, then a site survey for the plan.

**How far does a UWB anchor reach?**
An AmIMo anchor reaches about 50 m in line of sight, indicative and site-dependent. Obstructions reduce the useful range.

**Do UWB anchors need network cables?**
AmIMo anchors need no data or sync cabling: they sync over the air and send data over Wi-Fi, with an Ethernet option. Each needs power from a DC adapter or PoE, and PoE runs over a network cable.

**How high are anchors mounted?**
AmIMo anchors are mounted 3 to 8 m up, on walls, columns, ceiling structure or poles.

## Read next (related block)

- [How many anchors you need](/tools/anchors/): A first range, before the survey.
- [AmIMo anchor](/products/amimo/): Range, angle and power.
- [How accurate is UWB?](/learn/accuracy/): Typical, best case and the hard places.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/accuracy/, /products/amimo/, /tools/anchors/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P5 and P9 budgeting a 5,000 m² floor. Next: the anchor estimator, AmIMo, accuracy.
**Reference.** A worked example in plain numbers, like How Search Works' steps.
**Drafts.** A: old page. B: short answer with the 50 m and two-in-view facts, worked example kept. Merged: A's example, B's opening and a cleaner cabling FAQ.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P5 OT engineer | 8 | “Not AmIMo anchors: they need no network cables” ignored PoE. | FAQ now says PoE runs over a network cable. | 9 |
| P9 Procurement | 8 | Wanted the grid labelled as an assumption, not a spec. | Kept and made explicit in the short answer. | 9 |
| P7 IT / network | 9 | None. | none needed | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| About 50 m line of sight, indicative and site-dependent | PASS on AMBER | [B4], C17; survey caveat beside it |
| Works with as few as two anchors in view | PASS | [B4] |
| Mounted 3-8 m on walls, columns, ceiling, poles | PASS | [B4] |
| Mode selected per zone | PASS on AMBER | [B2] [B4]; C9 says “multiple modes”, no mode named as live |
| Grids 25 / 18 / 12 m and the 15 / 28 counts | PASS on AMBER | This site's planning assumptions, labelled; identical to /tools/anchors/ |

**Open facts used:** none touched. O1, O2, O3, O4 and O6 stay out.
