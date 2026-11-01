# Concept A: the homepage after Shiv's hero

Cell: Story Architect, Head of Words, Film Director. Round 1. 1 Nov 2026.
Angle: keep Shiv's hero (copy left, before and after film right, no buttons) and build the strongest 90 seconds after it.

---

## 1. Research trail

**What we read.** The charter. The round brief. Our three profiles. Kit files 01 (fact base), 03 (claims register), 04 (positioning), 09 (buyers, all twelve). Kit 12 (wedge) and 11 (brochure) skimmed for exact wording. The founders' website review of 29 Oct 2026, in full. The current homepage (version 8) with its header and footer partials. The page list in `site/src/pages`.

**What we studied in the library.** From `sites.py`: Apple AirTag, Form Energy, Zipline, Anduril, Helion Energy, Kurzgesagt, Formlabs, Tesla, Waymo, Linear, Stripe, Vention and Bartosz Ciechanowski's GPS. We worked from the library's notes on each site. We did not load the live pages in this round. The render and film teams should screenshot AirTag, Zipline and Form Energy before they start.

**What version 8 does today.** The hero has two buttons, which breaks Shiv's rule. It shows two headlines at once. Three sections end in "Know more". Two image slots are still text briefs. The nav sends "How to buy" and "How a pilot runs" to the same page.

**The lessons that shaped this concept**

1. **AirTag: the finding moment is the explanation.** So each screen shows the floor answering, not a feature list. The physics never appears on the homepage.
2. **Form Energy: one line a plant head repeats.** Ours is "Scans say where it was. Tags say where it is." It is fair to barcodes and RFID. It names the gap the buyer lives with.
3. **Zipline: one thing teaches the whole system.** We follow one *frame*, not one trolley. Every floor picture on the page is the same locked camera on the same model plant, shown in a different state. The viewer learns the plant once and then reads each change at a glance.
4. **Anduril: hardware and software read as one system.** AmIHub is the brain and the tag and anchor are the senses. One row, one screen, no cards.
5. **Formlabs: give before you ask.** The diagnostic comes before the call. "Book a call" lives only in the nav until the third act.
6. **Kurzgesagt and Helion: one calm visual world.** One colour script for every picture. Warm white world. Dark grey hardware. Blue for located and flowing. Amber for waiting. Nothing else.
7. **Tesla: one screen, one headline.** But no number chips. Our numbers are plain sentences, kept out of the hero.
8. **The founders' review sets the order.** Hero, where work waits, ask your floor, platform with proof by method, pilot and call. Six sections. One primary and one secondary action on the screen that asks.

---

## 2. Three directions for the story

**A1. One trolley, one shift.** Follow a single trolley from the press to the dock, Zipline style. *Killed.* To follow one trolley you need names, times and IDs on screen. Shiv already rejected those (C-014, J-208, "Trolley 14 · Waiting 42 min"). A followed trolley also hints that we know which job it holds. Location alone cannot prove that (claims register, NEVER). And it serves the supervisor while the plant head, IT and procurement wait for their turn.

**A2. The page is the floor.** The idea nobody in RTLS has tried. The whole homepage is one pinned camera over one plant. Each scroll step changes the state of the floor and the words change beside it. *Killed as a page mechanic.* Pinned scrolling makes the reader wait. It breaks with JavaScript off. It will not fit the 300 KB first screen or run smoothly on a cheap phone. And it hides the words from crawlers and AI assistants. *We kept its best part*: one locked frame, rendered once, reused as stills in each state.

**A3. The questions a plant asks. Survivor.** Each screen answers one question a buyer brings, in the founders' order. What is this? Where is my work and where does it wait? Can I just ask it? What is it made of and can I trust it? How do I start? It serves all twelve buyers in six screens. It carries A2's single world, so the page looks like one film cut into stills.

---

## 3. The homepage, screen by screen

### The 90-second budget

| Screen | Act | Seconds |
|---|---|---|
| 0. Nav | read inside the hero | 0 |
| 1. Hero | One: what it is | 15 |
| 2. Where work waits | One: why it matters to me | 25 |
| 3. Ask your floor | Two: what makes it different | 15 |
| 4. One system | Two: what it is made of, why trust it | 15 |
| 5. Start with one bay | Three: what I do next | 15 |
| 6. Footer | find my page | 5 |
| **Total** | | **90** |

Screen 2 is the longest on paper. A buyer reads the headline, the lead and the one block written for their job. That is about 80 words, which fits 25 seconds.

### The shared world (for render and film teams)

Every floor picture uses **camera A**. It is locked. Three-quarter overhead, about 45 degrees down, about 11 m up, near 35 mm equivalent. It looks over one hall of about 30 by 24 m. Render the master at 8K so stills can be cropped from it without a second camera.

The hall is a real place in model form, never grey boxes. Steel portal columns every 6 m. On four of them, at about 5 m, an AmIMo anchor from the founders' CAD. At this scale they read as small dark grey boxes. Warm white epoxy floor. Pale grey painted aisle lines and zone outlines, like floor tape. Top left, a press line: two C-frame presses with die carts. Middle, two assembly stations with benches and one fixture holding a sub-assembly. Right of centre, a row of pallet racks with beams and uprights. Far right, two dock doors, one open to daylight. Six mesh-sided trolleys holding brackets and bins. One tool cart with fixtures. One tugger pulling three trolleys. One counterbalance forklift with a pallet. One small AMR carrying a bin.

No people. No signs, text or numbers anywhere in the world. Vehicles and the AMR move carriers, so nothing glides by itself.

Light: soft overcast skylight from upper left. Long soft shadows. Ambient occlusion in corners. Late morning. Materials are matte with a slight satin, real bevels and bolt detail.

Colour script. World: floor #f6f4ef, machines #e4e2dc, shadow #c9c7c1. Hardware: dark grey #3a3d42, only from the CAD. Located and flowing: blue #66a5fa. Waiting: amber #f0a43a. Blue trails are thin flat lines lying on the floor. Amber is a flat painted tint on the floor under a waiting thing, crisp-edged. No glow, rings, pulses, chips or numbers anywhere.

Hardware: the AmIGo tag (top cover with the debossed lowercase "amimotion", bottom cover) and the AmIMo anchor (body and cap with the RJ45 port), rendered only from the CAD at `AmIMotion-Local/cad/`. The tag is shown stuck flat to a surface. Adhesive mounting is stated [B3], so no mount is invented. Higgsfield credits: zero for this concept.

---

### Screen 0. Nav

**Purpose and buyer job.** Let any buyer leave for their own answer in one click. Carry the only "Book a call" until the third act.

**Copy.** See section 4 for the full tree. On the bar, left to right:

AmIMotion · Platform · Uses · Pilot · Learn · Company · Diagnose your floor · **Book a call**

"Book a call" is the one button. "Diagnose your floor" is a plain text link.

**Picture.** None, except the AmIGo and AmIMo renders beside their names inside the Platform menu.

**Seconds.** 0. It is read as part of the hero.

**Buyers.** All twelve.

**Claim sources.** No factual lines.

---

### Screen 1. Hero

**Purpose and buyer job.** Say what AmIMotion is and show the change it makes, in one second of film and four sentences. Buyer job: "Is this for me?"

**Copy, left column.**

> # Where work is. Where it waits.
>
> AmIMotion is spatial intelligence for factories and warehouses. A small tag rides on what moves. Anchors on your columns hear it. One live map shows where each thing is now and how long it has stood still.

No buttons. No numbers. 38 words, no commas. This paragraph is also the meta description and the schema description, word for word.

Page title: "AmIMotion | Spatial intelligence for factories and warehouses".

**Film, right column. "Where work is."** 12 seconds. Muted. Loops. Camera A, locked. Hard cuts only. 4:5 master at 1600 by 2000, safe for a 1:1 crop.

| Time | What we see |
|---|---|
| 0.0 to 2.0 s | **After.** The poster frame, live. The hall in the shared world. Blue trails lie behind every moving thing: the tugger's train, the forklift, the AMR, a carrier leaving the press. Two trolleys parked behind the racks and one pallet at the dock stand on flat amber floor tint. |
| 2.0 s | Hard cut. |
| 2.0 to 5.0 s | **Before.** The same frame with the colour gone. Every object is pale. The tugger pulls its train past the two assembly stations. At each station entry there is a small scan desk. As a trolley passes one, a short blue tick appears on the floor at the desk and stays. Nothing marks the path between desks. The train turns behind the racks and parks. No mark follows it. The two trolleys that will be amber sit there, unmarked. |
| 5.0 s | Hard cut. |
| 5.0 to 6.2 s | **The tag.** A macro. The corner rail of one trolley, pale blue-grey powder-coated steel. The AmIGo tag sits flat on it, dark grey, the debossed "amimotion" caught by a soft raking light from the left. The trolley rolls slowly right to left through the locked frame. 100 mm macro look, shallow depth of field, the floor soft behind. |
| 6.2 s | Hard cut. |
| 6.2 to 12.0 s | **After, building.** Back to camera A. Things join one kind at a time, each a hard switch, 0.4 s apart. Carriers first: their blue trails appear. Then the bin and the fixture with its sub-assembly. Then the tool cart. Then the forklift and the tugger. Then the AMR. From 8.5 s, the two trolleys behind the racks and the pallet at the dock get their amber floor tint. At 12.0 s the frame matches 0.0 s, so the loop has no visible join. |

**What the viewer understands in one second.** From the poster and the first second: things on a plant floor, the paths they took in blue, and three of them waiting in amber. The left copy, read in the same glance, names the tag. The macro at 5 s shows it.

**Open point for the committee.** The tag is about 3 cm. At plant scale it is smaller than a pixel. We will not draw it bigger than it is. So the one-second test should be run on the hero as a unit: copy plus poster plus one second of film. We ask the Film Director's test to accept that, or to name a better frame.

**Delivery.** AV1 about 1.6 MB, H.264 under 3 MB. Poster AVIF about 70 KB at 1200 px, WebP fallback. The poster paints with the page. The film starts only when in view and never blocks. With reduced motion, the poster stays. With JavaScript off, the poster shows. On a phone the copy comes first and the film sits below it. The H1 text is the LCP element.

**Seconds.** 15.

**Buyers.** P1, P2, P4, P8, P11 directly. Every buyer gets the category.

**Claim sources.**
- "Spatial intelligence for factories and warehouses": founders' review, hero lines.
- "A small tag rides on what moves": tags on assets, vehicles and tools [B3]. Form factor "compact, low-profile" [B3].
- "Anchors on your columns hear it": wall, column, ceiling and pole mounting, 3 to 8 m [B4]. Anchors record arrival time [B2].
- "One live map shows where each thing is now": live digital map [B5].
- "How long it has stood still": idle and dwell events, time-stamped [B5].
- Film: location and trails of tagged things only [B5]. No job identity, no dispatch, no people. Zone tints are process areas, not radio coverage (file 04, section 3). Tags on bins and fixtures, not on loose parts [B3].

---

### Screen 2. Where work waits

**Purpose and buyer job.** Name the gap the buyer lives with. Then show what changes for the person reading, in their own job. Buyer job: "What does it do for me?"

**Copy.**

> ## Scans say where it was. Tags say where it is.
>
> Your systems log a scan at each station. Between scans, work moves and waits out of sight. So someone walks the floor to find it. AmIMotion keeps every tagged thing on one live map, all shift.

Three blocks follow, side by side on a laptop and stacked on a phone. In each block: a title, the pain, the gain, why us, and one link.

> ### Find it from a screen.
> A trolley left the press an hour ago. Nobody can say where it went. Search its name. The map shows where it is and when it last moved. The tag reports itself, so nobody feeds the system by hand.
> [Find the asset](/use-cases/find-the-asset/)

> ### Every wait, timed.
> You hear at the morning review that a job ran late. By then the cause has moved on. Each move into and out of a zone gets a time. A long wait shows while there is still time to act. You name the zones and set the limits. Finding out why stays your team's call.
> [How waits are timed](/learn/dwell-time/)

> ### The whole plant on one map.
> The plan says one thing and the floor does another. Now every tagged carrier, pallet, tote, tool and forklift shows on one map. Its trail shows where it went. You see how work really moves across bays and docks. One team in India designs, builds and supports every part.
> [Work in progress](/solutions/wip/)

**Pictures.** One still per block, each cropped from the camera A master. No UI, no labels.

- *Find it.* Crop to the left half: the press line to the racks. Everything pale except one trolley. It is blue-tinted, behind the racks, with one blue trail running from the press to where it stands. One second: that one, there, and how it got there.
- *Every wait, timed.* Crop to the queue in front of station 2. A painted grey zone outline. Three trolleys in the queue. Two have a thin blue floor tint. The one at the front has stood longest and sits on amber. One second: one of these has waited too long.
- *The whole plant.* The full frame. Trails from the last hour, thin and blue, layered where flow is heavy: thick between the press and station 1, thin to the dock. Amber at two spots. One second: this is how the whole floor moves.

**Seconds.** 25.

**Buyers.** Block 1: P4, P2. Block 2: P2, P3. Block 3: P1, P11, P8. The lead: everyone who has walked a floor.

**Claim sources.**
- "Your systems log a scan at each station. Between scans…": scans record events at points; the gap is between them (file 09, section 8). We do not say barcodes or RFID fail (file 03, NEVER).
- "Someone walks the floor to find it": the founders' opening sales question [CW], file 04, section 4.
- "One live map, all shift": live digital map [B5]. Motion-triggered updates [B3].
- "Search its name. The map shows where it is and when it last moved": "find any asset now" [B6]; trackables with history [B5]; stale data shown as "last observed" (file 04, section 3).
- "The tag reports itself": transmits on movement [B3].
- "Each move into and out of a zone gets a time": enter, exit, idle and dwell events time-stamped [B5].
- "A long wait shows": zone and dwell events [B5]; a dwell limit makes an exception to look into, not a diagnosis (file 04, section 3).
- "You name the zones and set the limits": zones defined in AmIHub [B5]; agreed zones and dwell rules [CW].
- "Finding out why stays your team's call": dwell does not diagnose cause (file 04, section 3).
- "Its trail shows where it went": history and trails [B5]; trajectory queries by time window [B5]. We do not claim AmISense heatmaps or spaghetti analytics (C18).
- "One team in India designs, builds and supports every part": designed and built in India [B1], [B8]; local engineers on site [B8]; one contract, one support line [B8].

---

### Screen 3. Ask your floor

**Purpose and buyer job.** Show the thing no other plant tool here does: ask the floor in plain words. Buyer job: "Is this ready for the AI my board keeps asking about?" Third section, as the founders asked.

**Copy.**

> ## Ask your floor a question.
>
> **"Which forklifts have been idle for more than an hour, and where are they?"**
>
> Ask in plain words. An AI assistant answers from live positions in AmIHub. A person approves any action.
>
> AmIHub has an MCP server built in. Any assistant that speaks MCP can use it.
> Each assistant gets its own access. Every call is logged.
> The server runs where AmIHub runs, even on a PC in your plant with no internet.
>
> [Ask your floor](/use-cases/ask-your-plant/)

The question is set large, as type on the page. It is not a screenshot and it carries no invented answer.

**Picture. The floor answers.** Camera A, full frame, still. Everything pale. Three forklifts stand on flat amber floor tint: two by the open dock, one at the end of the rack row. Every other vehicle and carrier is pale with no trail. One second: the question above, the answer on the floor.

**Seconds.** 15.

**Buyers.** P8, P1, P11 (the AI question). P7 and P5 (access, logs, no internet). P6 and P12 (MCP, open to any assistant).

**Claim sources.**
- The example question: brochure, verbatim [B7].
- "Built-in MCP server", "any MCP-capable client": [B7]. AMBER: a described capability with a demo on request (file 03). The call screen offers that demo.
- "A person approves any action": write actions can require supervisor approval [B7]; founders' review keeps "a person approves any action"; round brief.
- "Its own access. Every call is logged": per-agent credentials and tool scope, every call logged [B7].
- "Runs where AmIHub runs… a PC in your plant with no internet": [B7], [B5].
- Picture: idle state of tagged vehicles [B5]. No dispatch shown (file 03, NEVER).

---

### Screen 4. One system

**Purpose and buyer job.** Show what is bought and why to trust it. Proof by method, since no names or logos are allowed. Buyer job: "What is it made of, and will it hold up in my plant?"

**Copy.**

> ## One team builds every layer.
>
> The AmIGo tag rides on what moves. The AmIMo anchor hears it from your column or wall. AmIHub turns what the anchors hear into positions, zones and waits. Then it shares them with your MES, ERP, WMS and AI assistants.
>
> Down to ±10 cm with AmIMo anchors. Your site sets the final figure.
> Anchors need only power. They sync over the air, with no data cables.
> AmIHub runs on a PC in your plant with no internet, or in the cloud.
> Built on the FiRa and omlox specifications, with NXP Trimension UWB silicon inside.
> Runs in automotive, robotics and warehousing plants.
>
> Every claim on this site says what it rests on. [Trust and data](/trust/)
> [Platform overview](/platform/)

**Picture. One row, left to right, on a warm light grey sweep.**
1. The AmIGo tag. Macro, three-quarter top view, the debossed "amimotion" legible. Large softbox upper left, a thin rim light from the right, soft contact shadow. 85 mm look.
2. The AmIMo anchor. Three-quarter front, RJ45 port visible on the side, cap on. Same light and lens.
3. AmIHub: a real capture of the AmIHub live map from the founders, cleared of any customer detail, in a plain frame. If no real capture exists by the render deadline, use the camera A "after" still instead. We do not mock up a UI.
4. Plain type at the end of the row: MES · ERP · WMS · AI assistants.

One thin blue hairline joins the four, left to right. No icons, no arrows, no cards. One second: a tag, an anchor, a map, your systems.

**Seconds.** 15.

**Buyers.** P5, P6, P7 (accuracy, power, no internet, interfaces). P12 (open specifications). P9 and P11 (one team, built in India). P8 (open standards).

**Claim sources.**
- "Down to ±10 cm with AmIMo anchors. Your site sets the final figure": founders' review (C4 wording); [B3]; site-dependent per the charter.
- "Anchors need only power… no data cables": [B8], [B4]. AMBER: never "fully wireless" (C20). DC or PoE is on the AmIMo page.
- "Positions, zones and waits": [B5].
- "MES, ERP, WMS and AI assistants": interfaces [B2], [B5]; MCP [B7].
- "On a PC in your plant with no internet, or in the cloud": [B5]. We do not say who runs the cloud (C21).
- "Built on the FiRa and omlox specifications": founders' review, fixed charter wording.
- "NXP Trimension UWB silicon inside": [B8]. Trademark note in the footer.
- "Runs in automotive, robotics and warehousing plants": [B1], [B8] say "deployed"; the charter says "runs in". **Flag to the Truth and Quality Lead.** The founders' review asks to confirm these sites are live before this line ships.
- "Every claim on this site says what it rests on": the Trust page, per the founders' review.

---

### Screen 5. Start with one bay

**Purpose and buyer job.** Make the first step small, bounded and useful before any call. This is the third act, where "Book a call" first appears in the page. Buyer job: "What do I do next, and what does it cost me to try?"

**Copy.**

> ## Start with one bay.
>
> A pilot watches one flow in one bay or line. We survey the floor and plan the anchors. You bring the flow you want to see and one contact on the floor. Your MES stays in charge. Then grow plant-wide on the same AmIHub.
>
> ### Diagnose your floor.
> Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you.
> [Diagnose your floor] (secondary button)
>
> ### Book a call.
> We show the live map and an AI question on real AmIHub data, not slides.
> [Book a call] (primary button)

**Picture. One bay lit.** Camera A, full frame, still. The whole hall pale and quiet, drawn in the world's light greys. One bay, station 2 and its queue, in full colour: blue trails, one amber wait, the AmIMo anchors on its two columns. One second: start here, small, then the rest.

The diagnostic itself opens in place when the button is pressed. Its 3D code loads only then. With JavaScript off, the button goes to `/diagnostic/`, which offers the call.

**Seconds.** 15.

**Buyers.** P1 and P11 (bounded, can stop). P9 (clear scope). P2 and P4 (one flow they choose). P12 (a repeatable package to bring to clients).

**Claim sources.**
- "One flow in one bay or line… grow plant-wide on the same AmIHub": pilot one bay or line, then scale [B8], GREEN.
- "We survey the floor and plan the anchors": site survey sets anchor counts [B4], [B8].
- "You bring the flow… one contact on the floor": WIP pilot offer (file 04, section 5); current pilot page.
- "Your MES stays in charge": proposed pilot rule (file 04, section 3). **Flag.** Confirm with AmIMotion before launch.
- "Before anyone calls you": a design rule. The diagnostic must give its result with no personal data (Lead Magnet Lead's test). **Flag** to that lead to confirm the build matches.
- "Live map and an AI question on real AmIHub data, not slides": live demo in a discovery call [B1], [B7]; founders' review says keep.

---

### Screen 6. Footer

**Purpose and buyer job.** Send each of the twelve buyers to the one page that answers their next question. Give machines a clean statement of what AmIMotion is.

**Copy.**

> ## Start from your job.
>
> Plant heads and owners: [How a pilot runs](/pilot/)
> Production and planning: [Work in progress](/solutions/wip/)
> Shift supervisors: [Find the asset](/use-cases/find-the-asset/)
> Lean and IE leads: [How waits are timed](/learn/dwell-time/)
> MES and ERP owners: [How tags link to jobs](/learn/association/)
> OT, IT and security: [Trust and data](/trust/)
> Developers and integrators: [For developers](/developers/)
> Group digital teams: [What is spatial intelligence](/industrial-spatial-intelligence/)
> Procurement and finance: [How a pilot runs](/pilot/)
> Safety teams: [Questions](/faq/)

Then the link columns, which repeat the nav tree with the same labels.

Then the entity paragraph:

> AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. It makes AmIGo tags, AmIMo anchors and AmIHub software: spatial intelligence for factories and warehouses. AmIMotion builds industrial spatial intelligence. It gives a time-stamped location to everything you tag in a plant. It joins that location with your zones and with the jobs you link to each carrier. People, systems and AI assistants can then answer where work is and where it waits. It is the first layer of Physical AI for factories and warehouses. Designed and built in India on NXP Trimension UWB silicon. Built on the FiRa and omlox specifications.
>
> sales@amimotion.com · Privacy
>
> NXP and Trimension are trademarks of NXP B.V. FiRa and omlox are trademarks of their owners. Specifications are indicative. Final datasheets are shared under NDA.

This is the one place "Physical AI" appears. It sits in visible text, so people read it and search engines index it.

**Picture.** None.

**Seconds.** 5.

**Buyers.** All twelve, by name of job. P10 (safety) is routed to Questions on purpose. People tracking is a separate scope from the WIP pilot.

**Claim sources.**
- Company and brand: [B8].
- Category paragraph: founders' review, cut into short sentences. "Jobs you link to each carrier" keeps the association rule (file 04, section 3; [CW]).
- "Physical AI" once: charter and founders' review.
- Silicon and trademark line: [B2], [B8], file 03.
- "Indicative… under NDA": [B3], [B4].

### Buyer coverage check

| Buyer | Screens that land | Page they are sent to |
|---|---|---|
| P1 Plant head | 1, 2 (block 3), 3, 5 | How a pilot runs |
| P2 Production or PPC | 1, 2 (blocks 1 and 2), 5 | Work in progress |
| P3 IE or CI lead | 2 (block 2) | How waits are timed |
| P4 Supervisor | 1, 2 (block 1), 5 | Find the asset |
| P5 OT engineer | 3, 4 | Trust and data, Specifications |
| P6 MES or ERP owner | 3, 4 | How tags link to jobs |
| P7 IT and security | 3, 4 | Trust and data |
| P8 Digital sponsor | 1, 2 (block 3), 3, 4 | What is spatial intelligence |
| P9 Procurement | 4, 5 | How a pilot runs |
| P10 EHS | footer | Questions |
| P11 Promoter or MD | 1, 2 (block 3), 4, 5 | How a pilot runs |
| P12 Integrator | 3, 4, 5 | For developers |

---

## 4. The nav

**The bar.** Five words, one text link, one button.

AmIMotion · **Platform** · **Uses** · **Pilot** · **Learn** · **Company** · Diagnose your floor · **Book a call**

**Under each.** One label per URL, the same in the header, phone sheet, footer, breadcrumbs, llms.txt and BreadcrumbList.

| Top level | Under it | URL |
|---|---|---|
| Platform | Platform overview | /platform/ |
| | AmIGo tag (with its CAD render) | /products/amigo/ |
| | AmIMo anchor (with its CAD render) | /products/amimo/ |
| | AmIHub | /products/amihub/ |
| | How it works | /technology/ |
| | Specifications | /specs/ |
| | For developers | /developers/ |
| Uses | Work in progress | /solutions/wip/ |
| | Tools and vehicles | /solutions/assets/ |
| | Find the asset | /use-cases/find-the-asset/ |
| | Ask your floor | /use-cases/ask-your-plant/ |
| | Manufacturing | /industries/manufacturing/ |
| | Warehousing | /industries/warehousing/ |
| | Robotics and AMRs | /industries/robotics/ |
| Pilot | How a pilot runs | /pilot/ |
| | Diagnose your floor | /diagnostic/ |
| | Anchor estimator | /tools/anchors/ |
| | Search-time calculator | /tools/search-time/ |
| | Pilot brief | /tools/pilot/ |
| Learn | What is spatial intelligence | /industrial-spatial-intelligence/ |
| | How waits are timed | /learn/dwell-time/ |
| | How tags link to jobs | /learn/association/ |
| | Field guides | /learn/ |
| | Films | /films/ |
| | Glossary | /glossary/ |
| | Questions | /faq/ |
| Company | About us | /company/ |
| | Trust and data | /trust/ |
| | Contact | /contact/ |

**How a buyer gets guided.**
- Each menu ends with one sentence and one link: "Not sure where to start? Diagnose your floor." Same label, same URL as the bar.
- Each homepage screen ends with one link to the page that goes deeper on that screen. The link text is that page's name, never "Know more".
- The footer sends each job to its page by name (screen 6).
- Each inner page ends with one next step chosen for that page, not one shared close.
- On a phone, the bar folds to the logo, "Book a call" and a menu button. The sheet lists the same five words in the same order.
- Every link is a plain anchor. The whole tree works with JavaScript off and is listed in llms.txt in the same order.

**Notes for the Experience Design Lead.** We dropped "Solutions", "Resources" and "Start here". "Uses" replaces Solutions and folds in Industries and Use cases. "Pilot" replaces "How to buy" and "Next step", so /pilot/ has one label. "Customers" is not added. No customer can be named yet. The /solutions/, /use-cases/ and /industries/ hub pages should merge into one "Uses" hub. That is your call, and a tree test should settle the word "Uses" against "Use cases".

---

## 5. Three rounds of rework

### Round 1. Story Architect: the say-it-back pass

The first draft had a hero body that listed "carriers, parts, tools, vehicles and robots" and ended with "down to ±10 cm". Read cold, the list buried the point and the number broke Shiv's rule. We cut both. The film now shows the list, and the number moved to screen 4.

The draft had four value blocks: supervisor, production manager, IE lead and plant head. In say-it-back, the supervisor and IE blocks retold as the same thing. We merged them by outcome, not job title, into "find it", "every wait timed" and "the whole plant". Each block names its pain, gain and why us.

"Ask your floor" sat fourth, after the platform. The founders asked for it third. Moving it up also stops the stack reading as plain RTLS, because the tag and anchor now arrive as the senses of something you can ask.

We tested three rust lines. "Every trolley tells the room where it is" was warm but vague about the payoff. "Your systems see the scan. Nobody sees the wait" was sharp but negative for a homepage headline. "Scans say where it was. Tags say where it is" won. It is fair to the buyer's barcodes. It is easy to repeat in a Monday review.

### Round 2. Head of Words: plain words and truth

Hero: "how long it has waited" became "how long it has stood still". Idle and dwell are what AmIHub times. Whether a carrier is truly waiting or being worked on is not something location proves. The H1 keeps "waits", which the founders chose.

Category paragraph: "joined with jobs" became "the jobs you link to each carrier". Location alone never says which job is on a trolley.

"Deployed" became "runs in". "FiRa and omlox compliant" became "built on the FiRa and omlox specifications". "Down to ±10 cm" carries "with AmIMo anchors" and "your site sets the final figure".

"No email needed" on the diagnostic was cut until the Lead Magnet Lead confirms the build. "Before anyone calls you" says the same thing as a promise we control.

All "Know more" links became page names. Commas: under one per sentence across the page. Longest homepage sentence: 19 words. The founders' category paragraph had 9 commas in two sentences. Ours has one in five.

### Round 3. Film Director: the one-second pass

The first board ran before then after, with the poster on the before frame. A muted viewer at phone size saw a quiet pale plant and said "a factory". That fails. The loop now opens on the after frame. The first second shows things, blue paths and amber waits. The before comes second as the contrast.

The first board drew the tag on every object in the wide shot. At true scale it is under a pixel. Drawing it bigger would misstate the hardware. We added the 1.2 second macro from the CAD instead, with a hard cut either side. We raised the remaining gap as an open point for the committee.

The amber was first a soft pool of light under each waiting thing. It read as glow. It is now a flat, crisp-edged floor tint, like paint. Scan desks blinked when scanned. Blinks are pulses, so they now leave a short fixed tick. Early boards showed workers pushing trolleys. Shiv wants no people tracking in the hero, and untracked people would invite the question. Vehicles now move the carriers.

Finally, every still on the page was moved onto camera A. The page now reads as one world, which is the part of direction A2 we kept.
