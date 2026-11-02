# Concept C: One floor, seen from five heights

Cell: Creative Director (chair), Reference Analyst, Headline Writer. Round 1, 1 Nov 2026.
Angle: the fresh idea. Borrow the strongest explainer mechanism from outside RTLS. Stay inside Shiv's rules.

The idea in one line: the whole homepage is one plant, one camera and one trolley. Each screen moves the camera to a new height. Close up, you see hardware. Higher up, you see flow. At the top, you see the answer to a question. The camera height is the only thing that changes, so the buyer never has to re-learn the picture.

---

## 1. Research trail

What we studied:
- Founders' sources: kit 01, 03, 04, 09, skims of 11 and 12, and Kaushal Kukkar's review of 29 Oct 2026 (it wins over kit 03).
- The current homepage, version 8, and its nav partial. The CAD renders now on the site (AmIGo top cover with its two screw flanges, AmIMo enclosure with its fixing tab).
- All 100 sites in `sites.py`, read for mechanism, not look. We sorted them by how they make a hard idea obvious: answer instead of explain (AirTag, Raycast, GitHub Copilot), show the world as the machine sees it (Waymo, Skydio, Pixxel), one model with one changing variable (ciechanow.ski GPS, Bret Victor, Red Blob Games, R2D3), one object transforming on scroll (Igloo Inc, Matic Robots, Framer), one plain metaphor (Form Energy), follow one object (Zipline), and product UI as hero (Stripe, Linear, Cursor, Oura, WHOOP, Samsara).
- The RTLS field as file 09 records it (HID Sewio, Ubisense, KINEXON, Pozyx, Zebra, Quuppa). Every one of them sells modules and outcome percentages with dashboards and logos. None tells the story as one continuous place.

Gap in the trail: we read the library notes and the vendor notes in file 09. We did not take dated screenshots at 1440 and 390 px this round. The Reference Analyst owes those boards before committee (see rework round 3).

The lessons that shaped this concept:
1. **AirTag: show the answer, skip the physics.** The page never explains Ultra Wideband. It shows an arrow pointing at your keys. Our answer must be a place on the floor, not a sentence about radio.
2. **Waymo: show the world as the machine sees it, laid over the real world.** The overlay explains the sensor better than any diagram. Our "after" is the floor as AmIHub sees it, drawn on the floor itself.
3. **ciechanow.ski and Bret Victor: keep one model and change one variable.** Readers learn GPS because the globe never changes while one thing moves. Our one model is the plant. Our one variable is camera height. That is the Ladder of Abstraction made literal: close is a photograph, high is a map.
4. **Pixxel and Bambu Lab: before and after side by side beat before and after in sequence.** A sequence makes the viewer wait for the after. A split shows both in the first second.
5. **Form Energy: one plain sentence carries the technology.** "It stores energy by rusting iron." Ours: "Your trolleys say where they are." A plant head can repeat it at lunch.
6. **Zipline: follow one object and the system teaches itself.** One trolley (we call it the hero trolley, never by a code) appears on every screen.
7. **Oura, WHOOP and Samsara: scores and dashboards need data.** We have no cleared AmIHub screens and no real numbers. Any UI we drew would need an "illustrative" label, which Shiv bans. So meaning is carried by two colours on the floor: blue #66a5fa for located and moving, amber #f0a43a for waiting. No numbers, no chips, no UI.
8. **Igloo Inc and Matic Robots: one transformation, tied to scroll, is the signature.** We get exactly one: the camera rise from the trolley to the whole floor, scrubbed to scroll, never on a timer.

---

## 2. Three directions, two killed

**A. "Ask first."** The page opens on a question field, Raycast and Copilot style. The visitor types or picks a question and the floor answers.
Killed. The answer needs an interface with invented data, which needs a label. It puts AI first, where the founders put it third. And P1 "hears AI every week" (file 09): leading with it reads as hype. MCP is AMBER in kit 03. A first screen cannot rest on an AMBER claim.

**B. "One trolley's shift."** Zipline's journey, told as a clock: 06:00 to 14:00, one trolley from cutting to dispatch, scrubbed by scroll.
Killed. Every timestamp is an illustrative number and needs a label (kit 03, labels for creative work). It is a story, not value propositions, which Shiv asked for. It is long by nature and echoes the C-014 and J-208 walk Shiv already rejected.

**C. "One floor, five heights."** Chosen. One plant, one camera, one trolley. The camera height changes per screen. It needs no UI, no numbers and no labels. It reuses one scene, which is the cheapest picture library to make look photographed. Nobody in RTLS or industrial positioning tells the homepage as one continuous place (file 09 vendor notes, library group H).

---

## 3. The homepage, screen by screen

Budget: 90 seconds. Nav 2, hero 14, screen 2 16, screen 3 16, screen 4 18, screen 5 20, footer 4.

Colour meaning everywhere: blue #66a5fa means a tagged thing the floor can see. Amber #f0a43a means it is waiting. Never used for decoration. Blue never sets small text on white (2.5 to 1).

One scene for the whole page, built once in Blender by the render team:
- A light Indian plant, about 60 by 40 m. North-light sawtooth roof, so daylight is soft and even. Pale polished concrete floor with honest wear: tyre marks, a patched slab, faded aisle paint.
- Left two thirds: machining and assembly bays, an inspection station with a queue lane. Right third: stores with blue-grey pallet racking, plastic totes, two staging lanes and two dock doors. Factory and warehouse in one roof.
- Moving things: steel-tube trolleys carrying trays of machined parts, a forklift, a tugger with two carts, one AMR. Each carries an AmIGo tag from the CAD, dark grey, screwed through its own two flange holes onto a flat steel plate. Nothing else is invented on the tag.
- AmIMo anchors from the CAD, dark grey, screwed by their own tab to columns at about 5 m, RJ45 port facing down.
- Two people may walk the floor, small and unmarked. They are never tagged and never get a trail. If they read as CGI in any test, the render director cuts them.
- Environment props are modelled or licensed 3D models. No AI-generated textures or images.

### Screen 0. The nav (always on top)

Purpose and buyer job: let any buyer leave the story at any point and land on the one page that answers their next question. "Book a call" lives here and nowhere else until screen 5.

Exact copy, left to right: `AmIMotion` (logo, home) · `How it works` · `Where it helps` · `Start small` · `Company` · button `Book a call`.
Full structure is in section 4.

Picture: none. White bar, logo in near-black, one blue-filled button. No shadow, no blur, no glass.
Seconds: 2. Buyers: all. Claim source: none needed.

### Screen 1. Hero

Purpose and buyer job: in one second, the buyer sees their own floor twice, as it is and as AmIMotion shows it. In ten seconds they can say what AmIMotion is.

Kept from Shiv: copy left, film right, no buttons, no numbers, no people tracked, "Where work is. Where it waits." as H1.
Changed, with the reason: Shiv's before and after runs in time. Ours runs in space, inside one frame. A time-based film makes the viewer wait for the "after". A first-time visitor who scrolls at second two never sees it, which breaks both the one-second rule and the no-waiting rule. Pixxel and Bambu Lab show before and after side by side for this reason. Waymo lays the machine view straight onto the real street. Our seam is not a slider and has no handle. It is a real painted aisle line on the plant floor.

Exact copy:

> **Where work is.**
> **Where it waits.**
>
> Spatial intelligence for factories and warehouses. AmIMotion shows where every tagged trolley, pallet and tool is, and how long it has waited.

(H1 14 and 15 characters per line. Sub-line 22 words. Page title: "Spatial intelligence for factories and warehouses | AmIMotion", 61 characters.)

Why this sub-line and not the founders' "Tag what moves, see it on one live map, and ask your floor a question": theirs has a three-part rhythm that reads as a formula, and it spends the hero on AI, which screen 4 does better. Ours says what it is (category), what it does (where) and the buyer's pain (waiting), with no technology words. If the committee wants the AI named in the hero, the founders' line is the fallback, and it is defensible.

Picture and film, for the render and film teams:
- Frame 4:5 on desktop (right column), 1:1 on phone (below the copy).
- Camera: 35 mm, 6 m high, 30 degrees down, looking along the main aisle toward the inspection station. The yellow aisle line runs from bottom centre up to the far end. It splits the frame.
- Light: soft north daylight, about 5000 K, from the roof. No direction tricks. Both halves get the same light. Only the meaning differs.
- Left of the aisle line, the floor as it is: trolleys, a tote rack, a parked forklift. Nothing marked. You cannot tell which trolley is waiting.
- Right of the aisle line, the same kind of floor as AmIMotion shows it. Every tagged thing has a thin solid blue line on the floor behind it, the path it took in the last minute, about 6 cm wide in world scale. Three trolleys in the inspection queue stand on solid amber footprints, the exact outline of their wheels' rectangle, like a coloured shadow. No rings, no glow, no pulses, no icons, no text.
- What moves (8 second loop, under 3 MB, poster first and poster is the full meaning): the hero trolley rolls from the left half across the aisle line. The moment it crosses, a blue line begins behind it on the floor. It stops in the inspection queue and its footprint turns amber in one frame, not a fade. A tugger with two carts passes on the right with its trail. Nothing else moves.
- The viewer understands in one second: same floor, two ways. On one side you see nothing. On the other you see where things went and which ones are stuck.
- Reduced motion and JavaScript off: the poster. It already says everything.

Seconds: 14. Buyers: P1, P2, P4, P8, P11 (name their pain in one look); P3 (waits measured); P5 and P7 see no radio cartoon, which earns trust.
Claim sources:
- "Spatial intelligence for factories and warehouses": founders' review 29 Oct, title and hero line.
- "shows where every tagged trolley, pallet and tool is": [B5] live map of every tagged asset; [B3] asset tags on bins, WIP carriers, tools. "Tagged" keeps it true.
- "how long it has waited": [B5] every enter, exit, idle and dwell event time-stamped and queryable.
- Trails on the floor: [B5] "tracked objects shown live with history, trails and status".

### Screen 2. The camera comes down to the trolley

Purpose and buyer job: "What is it, physically?" The buyer sees the three parts as one system and learns the plain sentence they will repeat.

Exact copy:

> **Your trolleys say**
> **where they are.**
>
> An AmIGo tag rides on each trolley, pallet or tote. AmIMo anchors on the columns hear it. AmIHub puts it on the map.
>
> Down to ±10 cm, with AmIMo anchors. Your site sets the final figure.
> Tags sleep when still, so a battery lasts 1 to 3 years, depending on use.
> No data or sync cables to run. Anchors need only power, DC or PoE.
>
> How it works

(Headline 17 and 15 characters per line at 390 px. Supporting line 22 words, three sentences of different length so it does not read as a formula. "How it works" is a plain text link to the nav page of the same name.)

Picture, two stills, no film:
- Still A (large, 3:2): the hero trolley, close. 85 mm, f/2.8, camera at 1 m, three-quarter view. The AmIGo top cover with its debossed "amimotion" sharp in the focal plane, screwed flat to a steel plate on the trolley's top rail. Trays of machined parts just behind, soft. Key light from the north roof, a white bounce card low on the right for fill, so the deboss reads by shadow. The floor and the aisle line from screen 1 are visible behind, out of focus.
- Still B (smaller, 4:5, offset lower, not in a card): one concrete column, AmIMo screwed by its tab at 5 m, shot from below at 70 mm, RJ45 port facing down and visible, roof trusses and daylight behind. Dark grey enclosure against pale concrete.
- What moves: nothing. If the scrub sequence is loaded, screen 2 is its first frame (Still A) and the camera rise starts as the buyer scrolls on.
- The viewer understands in one second: a small dark tag on a trolley, a box up on a column. That is the hardware.

Seconds: 16. Buyers: P5 (mounting height, power, accuracy wording), P7 (no data cables), P4 (a small thing on the trolley, not on them), P11 (real hardware, built in-house), P12 (the kit is three parts).
Claim sources:
- Tag on trolley, pallet, tote: [B3] asset tag on bins, racks, WIP carriers.
- Anchors on columns: [B4] wall, column, ceiling and pole mounting, 3 to 8 m.
- "AmIHub puts it on the map": [B2] step 3, [B5] live map.
- "Down to ±10 cm, with AmIMo anchors. Your site sets the final figure": founders' review 29 Oct (C4), [B3], [B4] site-dependent.
- Battery: [B3] 1 to 3 years typical, usage-dependent; transmits on movement, deep-sleeps at rest.
- Cables: [B8] no data or sync cabling; [B4] DC or PoE. Kit 03 AMBER wording kept: never "fully wireless".
- Hardware look: founders' CAD only. Screws are plain fasteners in the CAD's own holes. No mount invented.

### Screen 3. The camera rises over the whole floor

Purpose and buyer job: "Where does my work wait?" This is the WIP door. The buyer sees the whole plant and the waiting spots in one look, factory and warehouse together.

Exact copy:

> **See where**
> **work waits.**
>
> Every zone entry gets a time. You see how long a trolley sat at inspection, or a pallet in a staging lane.
>
> A long wait shows you where to look. Why it waited stays your team's call.
>
> Where it helps

(Headline 9 and 11 characters. Supporting line 21 words. The second line is the truth line P3 and P6 look for.)

Picture and film, the page's one signature move:
- The rise, scrubbed to scroll: the camera leaves Still A of screen 2 and rises from 1 m to 18 m above the floor, tilting from 15 to 85 degrees down, lens going from 85 to 35 mm. About 48 frames, AVIF, 1280 wide, loaded only when screen 2 is in view. It moves only when the buyer scrolls. It never plays on its own.
- As the camera rises, the floor gains meaning. Near the floor it is a photograph. High up it is a map. Blue trails become readable as paths between bays. Amber footprints become readable as clusters: three trolleys at the inspection queue, two pallets in the far staging lane. That is the Ladder of Abstraction: same floor, more meaning with height.
- End frame (also the still for phone, reduced motion and no JavaScript): near top-down plant at 18 m, 35 mm. Bays left, stores and docks right. Anchors visible as small dark boxes on the column tops. No coverage circles. The hero trolley is in the amber cluster at inspection.
- Light: same north daylight. Shadows short and soft so the map reads.
- The viewer understands in one second: blue is where things moved, amber is where they are stuck, and I can see the whole plant at once.

Seconds: 16. Buyers: P1 (the whole plant in one look), P2 (the waiting job before it is late), P3 (waits timed, cause left honest), P4 (where to walk), P8 (one model across bays and stores), warehouse buyers inside P1 and P2 (pallets, staging lanes, docks in the same frame).
Claim sources:
- "Every zone entry gets a time": [B5] enter, exit, idle and dwell events time-stamped.
- "how long a trolley sat ... or a pallet in a staging lane": [B5] dwell queries by time window; [B6] dock dwell. Warehouse words per founders' review C6.
- "A long wait shows you where to look. Why it waited stays your team's call": kit 04 section 3, a dwell threshold creates an exception, not a diagnosis.
- Picture shows positions and waits only. No job identities, no numbers (kit 03 NEVER on location proving job identity).

### Screen 4. Ask your floor a question

Purpose and buyer job: show that the floor can be asked, in plain words, and that people stay in charge. This is the AirTag finding moment at plant scale. It also carries the category paragraph, so "spatial intelligence" and "Physical AI" are read and indexed.

Exact copy:

> **Ask your floor**
> **a question.**
>
> Ask in plain words. An AI assistant answers from the live map. A person approves any action.
>
> *Which trolleys have waited at inspection for more than an hour?*
>
> This is spatial intelligence. AmIHub keeps the place and time of everything tagged, joined with your zones, so people, your systems and AI assistants read the same floor. It is the first layer of Physical AI for factories and warehouses.
>
> AmIHub has a built-in MCP server. Each assistant gets its own access, and every call is logged.
>
> Ask your floor

(Headline 14 and 11 characters. Supporting line 17 words. The question is set in the page's own type, larger, in near-black. It is not in a chat bubble, a field or a card. "Physical AI" appears here and nowhere else on the page.)

Picture, one still, no film:
- The end frame of screen 3, same camera, same light. That is the point: the buyer already knows this floor.
- Answered state: everything on the floor drops to the plain "before" look of the hero's left half. Trails gone. Only the three trolleys at inspection keep their amber footprints, plus the hero trolley among them. Nothing else is coloured. No arrows, no labels, no counts.
- What moves: nothing. The page shows the answered still the moment the screen arrives. No typing animation, no fade.
- The viewer understands in one second: I asked, and the floor showed me those trolleys.

Seconds: 18. Buyers: P8 (AI readiness and one data model), P1 and P11 (the board's words, without hype), P2 (a question instead of a walk), P6 and P7 (MCP, scoped access, logged calls, human approval), P12 (standard interface to build on).
Claim sources:
- Ask, answer, approval: [B7]; brief hard limits ("a person approves any action"); kit 03 swap "AI assistants can query live location data through MCP, with human approval for actions". AMBER: a described capability, demo on request.
- The question: built from [B7] tool families (live location, history, zones) and [B5] dwell queries. Fallback if Truth wants the exact brochure line: "Which forklifts have been idle for more than an hour, and where are they?" [B7], with the picture changed to forklifts.
- Category paragraph: founders' review 29 Oct, category paragraph, shortened. "Jobs" dropped because job identity needs an association (kit 04 section 3).
- MCP access and logging: [B7] per-agent credentials, every call logged.

### Screen 5. Start with one bay (third act)

Purpose and buyer job: "What do I do on Monday, and what does it cost me to try?" The buyer sees the start is small, bounded and theirs to stop. Book a call appears here for the first time, with the diagnostic as the second door.

Exact copy:

> **Start with one bay.**
>
> A pilot watches one flow in one bay or line. Your MES stays in charge. When it earns its place, it grows across the plant on the same AmIHub.
>
> Runs on a PC inside your plant, with no internet. Or in the cloud.
> Built on the FiRa and omlox specifications. Talks to MES, ERP and WMS over REST, MQTT and WebSocket.
> Designed and built in India. One team, one contract, one support line.
> Runs in automotive manufacturing, robotics and warehousing.
>
> Button: **Book a call**
> On the call we show the live map and an AI query, on real AmIHub data.
>
> Link: **Diagnose your floor**
> Six questions. Two minutes. You get a plan for where to start.

(Headline 19 characters, one line at 390 px. Supporting line 28 words in three sentences. One primary and one secondary action, per founders' review D6.)

Picture, one still:
- The same top-down plant from screens 3 and 4. Now only one bay is lit with meaning: the inspection bay and its queue lane carry their blue trails and amber footprints. The rest of the plant is the plain "before" floor. No boundary line drawn. The edge of the meaning is the edge of the bay's own aisle paint.
- What moves: nothing.
- The viewer understands in one second: they start here, in one bay, and the rest of my plant can follow.

Seconds: 20. Buyers: P1 (bounded, stoppable), P9 (scope and one contract), P11 (built in India, one support line), P7 (no internet), P6 (MES stays in charge, interfaces), P5 and P12 (standards), P2 and P3 (the diagnostic gives them a plan before a call).
Claim sources:
- One bay or line, then scale on the same AmIHub: [B8], kit 03 GREEN.
- "Your MES stays in charge": kit 04 section 3, proposed pilot rule. Truth lead to confirm with AmIMotion.
- PC with no internet, or cloud: [B5], kit 03 GREEN; promoted per founders' review. Who runs the cloud is not said (C21).
- "Built on the FiRa and omlox specifications": founders' review 29 Oct (C3). Interfaces: [B5].
- Built in India, one contract, one support line: [B1], [B8].
- "Runs in automotive manufacturing, robotics and warehousing": [B1], [B8], reworded per founders' review C5. Flag: the review says confirm all three kinds of site are live. If not, cut the line.
- Live demo on real AmIHub data: [B1], [B7]; founders' review "Works".
- Diagnostic: existing lead magnet on version 8.

### Screen 6. Footer

Purpose and buyer job: a plain index for the buyer who scrolled past everything, and for crawlers and AI assistants. Facts in one place.

Exact copy:
- Column 1, How it works: AmIGo tag · AmIMo anchor · AmIHub · Ask your floor · Specifications · For developers
- Column 2, Where it helps: Work in progress · Warehouses · Tools and fixtures · Forklifts and tuggers
- Column 3, Start small: How a pilot runs · Diagnose your floor · Anchor estimator · What searching costs you · Pilot brief
- Column 4, Company: About us · Trust and data · Contact · sales@amimotion.com
- Base line: AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru. Built on the FiRa and omlox specifications. NXP and Trimension are trademarks of NXP B.V.

Picture: none. White, near-black text, one hairline rule above.
Seconds: 4. Buyers: P5, P6, P7, P9, P12 (straight to specs, developers, trust); all buyers for contact.
Claim sources: [B8] company and email; founders' review C3; kit 03 trademark note.

---

## 4. The nav

Top-level labels: `How it works` · `Where it helps` · `Start small` · `Company`, plus one button, `Book a call`.

Rule: the nav and the homepage are the same list in the same order. Screen 2 links to How it works, screen 3 to Where it helps, screen 4 to Ask your floor, screen 5 to Start small. A buyer who wants more at any screen finds it in one click, and the nav always tells them where they are in the story.

Under each:
- **How it works**: AmIGo tag (rides on what moves) · AmIMo anchor (hears every tag) · AmIHub (one map, one history) · Ask your floor (AI assistants and MCP) · Specifications · For developers (API and MCP docs).
- **Where it helps**: Work in progress (see where work waits) · Warehouses (pallets, totes, staging lanes, dock to stock) · Tools and fixtures (find it from a screen) · Forklifts and tuggers (where vehicles stand idle).
- **Start small**: How a pilot runs (what you get, what you bring) · Diagnose your floor · Anchor estimator · What searching costs you · Pilot brief.
- **Company**: About us · Trust and data (where your data lives) · Contact. A Customers page is added only when names are cleared in writing.

How it behaves:
- Desktop: four plain words and one button. Each opens a simple list on hover or click. One short description per link. No icons, no pictures, no promo panels.
- Phone: logo, `Book a call`, `Menu`. The menu is one sheet with the four groups already open. No accordions to dig through.
- Works with JavaScript off: built from plain links and `details` elements.
- For search and AI assistants: every link is a real page with an answer-first opening paragraph of about 50 words, a title of 65 characters or fewer with the brand last, breadcrumb and FAQ schema, and the same four groups listed in llms.txt. Visible copy and schema say the same thing (founders' review).

Why these labels: each is a phrase a buyer would say. They read left to right in buying order: how, where, how to start, who. Version 8 has Platform, Solutions, Resources and Company. Those are vendor labels and three of them could sit on any SaaS site.

---

## 5. Three rounds of rework

**Round 1. Structure and the one-second test (Creative Director).**
- First draft had seven content screens, with separate screens for warehousing and the hardware lineup. Cut to five. Warehousing now lives in the shared floor (the stores third of the plant) and in the copy of screens 1, 2 and 3. The lineup lives in screen 2's one sentence.
- First hero was Shiv's film in time order. Our cold read: the "after" arrived at second three. Moved before and after into one frame, split by the aisle line.
- The first split used a drawn vertical line with a handle. It read as a comparison slider, a gimmick. Replaced by the plant's own painted aisle line. No handle, no drag.
- The first screen 4 drew an answer card with a list of trolleys and times. That is the "Trolley 14 · Waiting 42 min" chip Shiv killed. Replaced by the floor itself as the answer.

**Round 2. Truth (Reference Analyst with the claims register open).**
- "Every trolley" became "every tagged trolley". "Jobs" dropped from the category paragraph and from the floor picture: location alone never shows which job is on a carrier (kit 03 NEVER).
- "±10 cm" appears once, on screen 2, as "down to" with the site line. Never in the hero.
- "No cables" became "No data or sync cables to run", because PoE uses a cable (kit 03 AMBER, C20).
- "Runs in" replaces "deployed" (founders' review C5). Flagged for confirmation.
- The forklift question from [B7] was swapped for a trolley question so the page keeps one story. The brochure line is kept as fallback.
- People in the floor scene carry no trail and no colour, so the picture shows work tracked, not people (brief, file 09 P4).
- Flags for the Truth and Quality Lead: "Your MES stays in charge" (proposed rule), "Runs in" three kinds of site, MCP (AMBER), trails as a day-one AmIHub view.

**Round 3. Words, speed and evidence (Headline Writer, then Reference Analyst).**
- Headlines checked at 390 px against about 32 characters a line for H1 and about 20 for H2 at 36 px. Breaks set by hand at phrase boundaries: "Your trolleys say / where they are." "See where / work waits." "Ask your floor / a question." None strands one word. None is over seven words.
- Rejected headlines and why: "The trolley tells the room." (a caption, fails without the picture) · "Every move, timed." (founders' alternative, formula rhythm) · "Waits, made visible." (needs a colon-like pause, sounds like a slogan) · "One tag. Every carrier." (tricolon family, kept off the homepage per founders' review) · "Start small. Scale fast." (formula line).
- Supporting lines held to 22 words or fewer, except screen 5 at 28, which carries the pilot terms and earns its length. Commas cut where a full stop works.
- Speed: hero poster AVIF at about 90 KB on phone, film under 3 MB loaded after first paint, the rise sequence (about 48 frames, about 1.6 MB) loaded only when screen 2 is in view. First screen stays under the 300 KB budget. Every moving picture has a poster that carries the full meaning, so reduced motion and JavaScript off lose nothing.
- Evidence owed before committee: dated 1440 and 390 px boards of the hero against Waymo and AirTag, screen 3 against Igloo Inc and Matic Robots, screen 4 against AirTag's Find My screen, with word counts and weights measured both sides. The biggest risk is the plant render reading as CGI. Test it first, at the 18 m top-down height where detail matters least, before any close shots are made.
