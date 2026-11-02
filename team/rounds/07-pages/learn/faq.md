# /faq/

**Title tag:** AmIMotion FAQ: UWB indoor positioning, answered
**Meta description:** Plain answers about AmIMotion: down to ±10 cm in 3D (site-dependent), anchors and cabling, steel, MES and ERP links, FiRa and omlox, MCP and pilots.
**H1:** Questions about AmIMotion. / Short answers, with their conditions.
**Lede:** none (the short answer follows the H1).

## Head

**The short answer:**

AmIMotion makes AmIGo tags, AmIMo anchors and AmIHub software, designed and built in India by Locatepro Technologies in Bengaluru. Together they give each tagged trolley, bin, tool and vehicle a time-stamped location, down to ±10 cm in 3D with AmIMo anchors, depending on the site. The answers below cover the company, the three parts, accuracy, cabling, data, standards and AI assistants.

Picture: none.

## The company. (faq block)

**What is AmIMotion?**
AmIMotion builds industrial spatial intelligence for factories and warehouses. AmIMotion makes AmIGo UWB tags, AmIMo anchors and AmIHub software. AmIMotion is a brand of Locatepro Technologies Pvt Ltd in Bengaluru, and its products are designed and built in India.

**What does AmIMotion do?**
AmIMotion shows where work is and where it waits. A small AmIGo tag rides on each trolley, bin and tool in a factory or warehouse. AmIMo anchors hear it, and AmIHub's live map shows where it went and how long it has waited.

**Who makes AmIMotion and where is it based?**
Locatepro Technologies Pvt Ltd, in Bengaluru, India. AmIMotion is its brand, and the tags, anchors and software are designed and built in India.

**Who leads AmIMotion?**
AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.

**What does AmIMotion cost?**
After the first call, we share datasheets, architecture, prices and pilot options under NDA.

**Can we start small?**
Yes. An AmIMotion pilot starts in one bay or one line. You then scale on the same AmIHub.

## The three parts. (faq block)

**What is an AmIGo tag?**
AmIGo is AmIMotion's UWB tag. An AmIGo tag rides on a trolley, bin, tool or vehicle, wakes on motion and sleeps when still. Battery life is 1 to 3 years, typical and usage-dependent.

**What is an AmIMo anchor?**
AmIMo is AmIMotion's UWB anchor. An AmIMo anchor mounts on a column or wall, times each tag's pulse and measures the angle it came from. Each anchor syncs over the air, sends data over Wi-Fi with an Ethernet option, and needs power from a DC adapter or PoE.

**What is AmIHub?**
AmIHub is AmIMotion's software. AmIHub works out positions, keeps the live map and zone history, and offers REST, MQTT, WebSocket, an omlox hub interface and a built-in MCP server. AmIHub runs on-premise with no internet dependency, or in the cloud.

## How it works. (faq block)

**How accurate is AmIMotion?**
Down to ±10 cm in 3D, typical, with AmIMo anchors. Accuracy depends on the site, so a pilot measures it on your floor.

**Do the anchors need cables?**
No data or sync cabling. AmIMo anchors sync over the air and send data over Wi-Fi, with an Ethernet option. Each anchor needs power, from a DC adapter or PoE.

**Does UWB work in a factory full of steel and racking?**
UWB's wide bandwidth separates the direct signal from reflections. AmIHub adds multipath and non-line-of-sight algorithms, and AmIMotion plans the anchors from a site survey.

**How long do tag batteries last?**
1 to 3 years, typical and usage-dependent. AmIGo tags sleep when still and send when they move.

**Does AmIMotion track individual parts?**
AmIMotion tags the carrier: the trolley, bin or rack. Which parts or job it holds comes from a carrier-to-job link, not from the radio.

## Systems, data and AI. (faq block)

**Can it run without the internet?**
Yes. AmIHub can run on an industrial PC inside your plant with no internet dependency, or in the cloud.

**Does it connect to our MES or ERP?**
AmIHub offers REST, MQTT, WebSocket and an omlox hub interface, and can push events to MES, ERP, WMS, SCADA or BI. Connectors are confirmed for each site.

**Does AmIMotion hold FiRa or omlox certification?**
AmIMotion is built on the FiRa and omlox specifications. AmIMotion claims no formal certification.

**Does AmIMotion have an MCP server for AI assistants?**
Yes. AmIHub has a built-in MCP server, so MCP-capable AI assistants can query live positions, zones and history. Any change needs a person's approval, and every call is logged. AmIMotion shows it in a live demo.

## Close

"Ask us the next one." / "On a call an engineer answers the questions specific to your floor, with the AmIHub map open." / [Book a call](/contact/)

## Internal links

/contact/ (close). Answers stay link-free so each lifts cleanly as FAQ data.

## JSON-LD notes

type=faq: FAQPage with all 18 questions from the details blocks, WebPage with speakable, BreadcrumbList Home > Questions, Organization.

## Checks

**Job of the page.** Branded questions from buyers and AI assistants. Next: a call.
**Reference.** Stripe's FAQ habit: one answer, one paragraph, no link needed to understand it.
**Drafts.** A: 13 answers under the entity paragraph as the short answer. B: 18 answers in four groups, a short answer without “Physical AI”, and the three parts defined. Picked B: the footer already carries the entity paragraph, and B adds the branded questions the panel failed (B02, B07, B08).

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P11 Promoter | 8 | Who runs the company? | “Who leads AmIMotion?” with V95's wording. | 9 |
| P9 Procurement | 9 | None. | none needed | 9 |
| P7 IT / network | 9 | None. | none needed | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| “Is AmIMotion FiRa or omlox certified?” as a question | REWORD | Pickability bars a bare “certified”; asked as “hold … certification?” |
| Who leads AmIMotion | PASS (V95) | Names and titles only; no photos, years or employers |
| “…without re-instrumenting” | Cut | Not stated; GREEN line kept |
| What does AmIMotion cost? | PASS | F13, locked homepage line |
| “Physical AI” in the head | Cut | Once per page, in the footer |

**Open facts used:** Panel B03 expects the word “compliant”, which the founders' review retired. Update tools/panel.json B03 to “built on|specification”.
