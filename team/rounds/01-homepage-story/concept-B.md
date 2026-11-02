# Concept B: the buyer's morning

Cell: Story Architect, Buyer Truth Lead, Executive Voice. Round 1. 1 Nov 2026.

The page in one line: it starts at eye level, where the plant head's team spends the morning walking, and climbs to the height of the anchors, where the whole floor can be seen at once.

The rust line it is built to plant: **"Every trolley tells the room where it is."**

Source tags used below. [B#] brochure page. [D#] deck slide. [CW] commercial wedge. [FR] founders' review, 29 Oct 2026. [K03] claims register. [K04] positioning file. [K09] buyers file. [BR] round brief. [CAD] founders' CAD. Anything tagged PROPOSAL is not yet a company fact and goes to the Truth and Quality Lead before it ships.

---

## 1. Research trail

### What we read

- Kit 01, 03, 04, 07, 09 in full. Kit 12 and 13 searched for the walk, the scan gap and the label rules. Kit 11 checked for mounting and battery wording.
- The founders' review of 29 Oct 2026, all 15 pages.
- The current homepage v8 and the header and footer partials, as text.
- The two hardware renders in `site/src/assets/img` (AmIGo top, AmIMo three-quarter) to see what the CAD actually gives us.
- In `sites.py`, every site our three profiles name: Apple AirTag, Form Energy, Zipline, Anduril, Augury, Apple Privacy, Hadrian, Ramp, Superhuman, Mercury. Plus the ones closest to this angle: Path Robotics, Linear, Oxide, Helion, Apple Vision Pro, Stripe, 1X.

### Lessons that shaped the page

1. **AirTag: the finding moment is the explanation.** Apple never explains Ultra Wideband. It shows you finding your keys. Our finding moment must land by screen 2, so screen 2 is "Find it from a screen, not a walk."
2. **Form Energy: one everyday line carries deep tech.** "Rusting and un-rusting iron" explains a battery. Ours explains UWB in seven words: "Every trolley tells the room where it is." It is literally true (the tag sends a pulse when it moves [B2]) and a plant head can say it in a morning meeting.
3. **Path Robotics: the same morning, before and after.** A before/after of one place is read in a second. A before/after of an idea ("scan points") needs a caption. We keep Shiv's before/after and make both halves the same bay.
4. **Zipline: follow one object.** One trolley carries the whole page. It waits at inspection in the hero, is found in screen 2, is asked about in screen 3, shows its tag in screen 4 and becomes the visitor's own trolley in screen 5.
5. **Augury: closest buyer, but it leads with outcome numbers.** We can publish none [K03 NEVER]. So proof is method: what the visitor can see (the floor from anchor height), what they can try (the diagnostic), what we state (one bay, MES stays in charge, runs inside the plant).
6. **Anduril: hardware and software as one system.** One continuous camera move (tag, then anchor, then the map) teaches all three parts in one screen instead of three cards.
7. **Any invented screen with data needs a "Simulation" label.** Kit 03 and kit 13 require it. The brief bans labels. So this page shows only three kinds of picture: CAD renders of real hardware, real AmIHub screen captures, and drawings that carry no numbers or IDs. None of them claims data that does not exist. (Flagged to the Truth and Quality Lead in round 3 notes.)
8. **The buyer is not shopping for RTLS.** Kit 04 and kit 09 agree. The best sales question in the kit is "Which part of the production flow requires people to walk the floor to find out what is happening?" [CW]. That question is the page's spine.

---

## 2. Three directions tried

**Direction 1. "One shift, hour by hour."** The page is a shift clock. 06:00 the walk. 09:30 the late job. 14:00 the handover. Each screen is a time of day.
Killed. The timestamps are story devices, and kit 07 says story devices must be marked. Shiv has already rejected jargon timestamps and IDs. It also turned into a feature list wearing a clock: one feature per hour. Readers would remember the clock, not the product.

**Direction 2. "The question nobody can answer" (untried in the category).** The hero is a search box. The visitor types "Where is the trolley for the next job?" and the page answers "Nobody knows. Someone is walking to find out." Then it scrolls to the answer.
Killed. It puts a control in the hero, which Shiv ruled out. It needs JavaScript before the first message lands, which breaks the speed budget and the "works with JavaScript off" rule. And it is a gimmick: the reader does work before getting value. We kept its best part, the plain-words question, for screen 3.

**Direction 3. "Eye level to anchor height." (Survivor.)** The page starts where the team stands, at 1.5 m, where racking and machines hide the work. Then it rises to 7 m, past an anchor on a column, to the height from which the whole bay can be seen. Each screen answers the next question the plant head would ask. It survives because the climb is the product: the anchors see the floor from up there, and AmIHub gives that view to the team. It needs no label, no ID and no number to read.

---

## 3. The homepage, screen by screen

Budget: 90 seconds. Hero 15, Find 20, Ask 15, How it knows 20, Start 15, Footer 5. The nav is read inside the hero's 15.

Belief ladder for the three buyers who shape the page (P1 plant head, P2 production control, P4 supervisor):

| Screen | They arrive believing | They must leave believing |
|---|---|---|
| 1 Hero | "Another tracking vendor." | "This is about the walk my team does every shift." |
| 2 Find | "Our MES already knows." | "It knows the last scan. This knows where the trolley is now and how long it has waited." |
| 3 Ask | "AI is hype." | "I can ask it what I ask my supervisor. A person still decides." |
| 4 How it knows | "Radio won't work in my steel plant." | "Three small parts. Runs inside my plant. One team stands behind it." |
| 5 Start | "Pilots end as dashboards nobody opens." | "One bay. My MES stays in charge. I can stop. I want this on my floor." |

---

### Screen 0. Nav

Described in full in section 4. One line, white bar, four words and one button: **How it works · Where it helps · Your floor · Company** and **Book a call**. "Book a call" lives here only until screen 5.

---

### Screen 1. Hero

**Purpose and buyer job.** Problem identification (Gartner job 1). The visitor must see their own morning and know what AmIMotion is before they scroll.

**Final copy (left column, no buttons).**

> # Where work is. Where it waits.
>
> AmIMotion is spatial intelligence for factories and warehouses. A small tag rides on each trolley, bin and tool. One live map shows where it is and how long it has waited. You find out from a screen, not a walk.

**Picture (right column). Film, 9 seconds, plays once and holds. Poster is the last frame.**

- **Set.** One machining-to-assembly bay in an Indian component plant. Light grey epoxy floor with worn yellow aisle tape. Grey-blue CNC enclosures on the left. A steel rack of fixtures. A plain steel inspection table at the far end. Eight steel WIP trolleys with machined aluminium housings in grey plastic trays. Concrete columns every 8 m. Nothing branded. No people.
- **Light.** 7:40 in the morning. Daylight from high clerestory windows on the left, cool and soft. Warm task light over the inspection table. Light, airy palette. No haze, no lens flare.
- **0.0 to 1.0 s. Before.** Camera at 1.5 m, eye height, 35 mm, static. We look down the main aisle. Racking and one CNC enclosure hide most of the bay. Two trolleys are visible, one half cut off by a machine. The view says: you cannot see your own floor from where you stand.
- **1.0 to 3.5 s. The climb.** The camera cranes straight up, ease in and out, from 1.5 m to 7 m. No dolly, no turn. At about 4.5 m it passes close to an AmIMo anchor fixed by its own tab to the face of a concrete column. The anchor is sharp for half a second, dark grey, debossed "amimotion" on its side, a single power cable running down the column. Then it leaves the top of frame.
- **3.5 to 4.5 s. The floor appears.** From 7 m and about 35 degrees down, the whole bay is readable. On each trolley's top rail we now see a small dark grey AmIGo tag, screwed through its two ears. The tags were there in the before shot. We just could not see them.
- **4.5 to 6.5 s. After: flow.** Thin brand-blue lines draw themselves flat on the floor, like fresh aisle tape, behind the six trolleys that moved this morning. Each line runs station to station. Matte, 2 px at 1080p, no glow, no arrowheads. Two trolleys stand beside the inspection table. Their floor footprint fills with a flat amber rectangle at 30 percent. Nothing pulses. Amber is the site's colour for waiting [FR, design D3].
- **6.5 to 9.0 s. After: everything that moves.** In the same frame, quietly, three more tagged things show a short blue line: a fixture lifted from the rack to a machine, a forklift crossing the back aisle with its tag on the overhead guard, an AMR carrying a trolley across the far end. Carriers stay the hero. The others are smaller and later so the first read stays simple.
- **Hold.** The film stops on the after frame. A small replay control appears on hover. No loop.
- **What the viewer understands in 1 second (poster).** A factory bay from above. Blue lines are work moving. Amber is work waiting.
- **Delivery.** Poster AVIF and WebP up to 8K. Film under 3 MB, 1080p, loads after the poster. Reduced motion and JavaScript off: the poster only. Mobile: the film sits under the copy, square crop centred on the inspection table.
- **Must not.** No chips, no numbers, no IDs, no rings, no glow, no people, no UI chrome, no hardware that is not in the CAD (no mounts, no brackets, no PC).

**Seconds.** 15, nav included.

**Lands for.** P1, P2, P4 first. P3 sees flow lines. P8 sees one model across carriers, fixtures and vehicles. P11 sees an Indian plant that looks real.

**Claim sources.**
- "Spatial intelligence for factories and warehouses": [FR] hero lines, title C1.
- "A small tag rides on each trolley, bin and tool": asset tag for bins, racks, WIP carriers, tools [B3].
- "One live map": live digital map [B5].
- "How long it has waited": every zone entry and exit time-stamped, dwell queryable [B5].
- "You find out from a screen, not a walk": a description of method, not a measured saving. Swap rule: "Helps teams find tagged carriers and tools" [K03]. Sent to the Truth Lead for a ruling.
- Tag screwed on through its ears: screw mounting [B3], ears in [CAD].
- Anchor on a column face by its own tab: "wall, column" mounting [B4]; tab in [CAD]; power only [B4].
- Forklift and AMR tags: vehicle tag for forklifts, tuggers, AGVs [B3]. Not shown as robot control [K03 NEVER].

**Why we changed part of Shiv's hero, with evidence.**
We keep his layout, his H1, no buttons, the before/after film, no people tracking and no tech numbers. We change three things.
1. **The "before" is eye level, not "invisible between scan points".** The scan-gap idea needs the viewer to know where scans happen, which costs a caption. It also edges toward saying barcodes fail, which kit 03 bans outright. The walk is what P1, P2 and P4 live: "spends the shift chasing status by phone and on foot" [K09 P2]. The kit's best opening question is about walking [CW].
2. **The transition climbs past an anchor.** This puts the AmIMo in context in the hero itself, which the founders asked for (D7: "anchor on a column") without a label. The viewer learns where the anchors live by passing one.
3. **Shiv's list of things is staggered, not equal.** Carriers first, then fixtures, forklift and AMR in the second beat. The WIP pilot tags carriers [CW]. Five equal things in the first second read as a catalogue, which is what the founders cut from "One system. Every flow." [FR].

---

### Screen 2. Find it

**Purpose and buyer job.** The finding moment, AirTag style. Moves P2 and P4 from "our MES knows" to "this knows where it is now".

**Final copy.**

> ## Find it from a screen, not a walk.
>
> Think of the last time someone went looking for a trolley. The walk. The calls to stores. The second walk.
>
> With AmIMotion they type what they need. The map shows where it is, when it was last seen and how long it has stood there. Your team still decides what to do about it.

**Picture. Real AmIHub screen capture, 6 seconds, flat on the page.**

- **Source.** A screen recording of the real AmIHub search on AmIMotion's own demo floor. Not drawn. Not mocked. This is the "one 20-second clip of a tag and the live map" the founders already put on their list (A4) [FR].
- **Setup before recording.** Demo trackables carry plain names a plant would use, such as "Gearbox housings" and "Inspection table". No codes like C-014. No customer or partner names anywhere on screen.
- **What moves.** Cursor clicks the search field. "Gearbox housings" is typed at human speed. The map pans to the bay and settles on one trolley in amber at inspection. Its line reads last seen and time in zone, in AmIHub's own words.
- **Frame.** The capture sits flat at true pixel scale on the page's light background. No device frame, no shadow, no tilt. The crop zooms in on the search field and the one result, Linear style.
- **Fallback if no capture exists by build.** A plan drawing of the hero bay in thin grey line, Oxide figure style. One trolley outline filled amber at the inspection table. Beside it, in grey, the dotted route someone would walk from the office door to reach it. No numbers, no names, no clock. It explains without claiming.
- **What the viewer understands in 1 second.** You type. It shows you where.

**Seconds.** 20.

**Lands for.** P4 most ("Where is it?" answered on a screen [K09 s11]). P2 (find a carrier fast). P1 (the walk his team does). P3 (time in zone).

**Claim sources.**
- "Find any asset now, replay any hour": [B6], search. Wording per swap rule [K03].
- "When it was last seen": stale data shown as last observed [K04 s3], [CW].
- "How long it has stood there": dwell per zone [B5], [B6 AMBER for analytics].
- "Your team still decides what to do about it": a dwell rule creates an exception to investigate, it does not diagnose cause [K04 s3].
- "Think of the last time someone went looking for a trolley": the Mom Test discovery line [K09 s12]. A question, not a claim.

---

### Screen 3. Ask your floor

**Purpose and buyer job.** Solution exploration. The founders want this third [FR, D1]. Moves P1 and P8 from "AI is hype" to "I can ask what I ask my supervisor, and a person decides".

**Final copy.**

> ## Ask your floor a question.
>
> ### "Which trolleys have waited at inspection for more than an hour?"
>
> Ask in plain words. An AI assistant answers from AmIHub's live map. A person approves any action, and every request is logged. AmIHub has a built-in MCP server, so the assistant your team already uses can connect. We show it live on the call.

**Picture. Still, with one 1-second move.**

- **Frame.** The hero bay, same 7 m height, now 50 mm and tighter on the inspection table. It is 11:00. Sun patches lie across the floor from the clerestory.
- **What it shows.** The question is set in large type above the image. The answer is the picture itself: the same two trolleys still sit in amber at the inspection table. No chat bubble, no answer text with invented data.
- **What moves.** One blue trolley leaves the table along its line, 1 second, then stops. The amber ones stay. Waiting means staying.
- **What the viewer understands in 1 second.** The question and its answer are in the same picture.

**Seconds.** 15.

**Lands for.** P1 and P11 (a question they would ask in a review meeting). P8 (AI readiness, open interfaces). P7 (logged, approved). P2 (the exceptions they chase).

**Claim sources.**
- Built-in MCP server, any MCP-capable client: [B7], AMBER, "a described capability with a demo on request" [K03]. "We show it live on the call" carries that qualifier in plain words.
- "A person approves any action": [BR] hard truth limits; [B7] write actions can require supervisor approval.
- "Every request is logged": every call logged [B7].
- The question: adapted from the brochure's "Which forklifts have been idle for more than an hour" [B7] to the WIP door. Uses zones and dwell, both in the MCP tool families [B7].

---

### Screen 4. How it knows

**Purpose and buyer job.** Requirements building and supplier selection. Moves P1, P5, P7 from "radio won't work in my steel plant" to "three small parts, inside my plant, one team".

**Final copy.**

> ## Every trolley tells the room where it is.
>
> **AmIGo tag.** Screws or sticks onto the trolley. Sends a short pulse when it moves and sleeps when it stops. One battery lasts 1 to 3 years, depending on use.
>
> **AmIMo anchor.** Fixed to a column or wall 3 to 8 m up. Hears each pulse and the angle it came from. Needs only power. No data cables to run.
>
> **AmIHub.** Works out where each tag is, down to ±10 cm depending on your site. Times every wait. Runs on a PC inside your plant with no internet, or in the cloud. Sends what it knows to your MES, ERP and WMS. Your MES stays in charge.
>
> This is spatial intelligence: the exact place and time of everything that moves in your plant, joined with jobs and zones. It is the first layer of Physical AI for factories and warehouses. Designed and built in India and built on the FiRa and omlox specifications. One team builds every layer, so you have one contract and one support line.

**Picture. Film, 6 seconds, one unbroken camera move. Poster is the first frame.**

- **0 to 2 s. The tag.** Macro, 85 mm, f/4, on the corner of a trolley top rail. The AmIGo sits screwed through its two ears to the steel. Soft raking daylight from the left shows the debossed lowercase "amimotion" and the chamfered corners of the cover. A tray of housings is soft behind.
- **2 to 4 s. The anchor.** The camera tilts up and rises along the nearest concrete column. At 6 m the AmIMo comes into focus, fixed by its tab to the column face, one cable down. Light grey ceiling and roof trusses behind.
- **4 to 6 s. The view.** The camera turns down to the floor from beside the anchor and settles on the hero's after frame: blue lines, amber at inspection. That view is AmIHub.
- **What the viewer understands in 1 second (poster).** A real piece of hardware on a real trolley.
- **Delivery.** Poster AVIF and WebP up to 8K, the strongest still on the site. Film under 3 MB.
- **Must not.** No PCB, battery, bracket, clamp or PC. No cutaways. No radio waves. The three copy blocks sit beside the film, not on top of it.

**Seconds.** 20.

**Lands for.** P5 (column height, power, survey). P7 (inside the plant, no internet). P6 (MES stays in charge, interfaces). P8 (spatial intelligence, Physical AI, open specifications). P9 and P11 (one contract, built in India). P12 (a standard three-part kit).

**Claim sources.**
- Tag mounting adhesive or screw: [B3].
- Pulse on movement, deep sleep at rest: [B3]; short UWB pulse [B2].
- 1 to 3 years, usage-dependent: [B3], AMBER qualifier kept [K03].
- Anchor 3 to 8 m, column and wall: [B4].
- "Hears each pulse and the angle": arrival time and 3D AoA [B2], [B4].
- "Needs only power. No data cables to run": DC or PoE, no data or sync cabling [B4], [B8]. Never "fully wireless" [K03 AMBER].
- "Down to ±10 cm depending on your site": [FR] claim validation C4; [BR]; with AmIMo anchors [B3].
- "Runs on a PC inside your plant with no internet, or in the cloud": [B5]. Who runs the cloud is left unsaid (C21) [K03].
- "Sends what it knows to your MES, ERP and WMS": REST, MQTT, WebSocket, omlox hub interface [B5]. Specific connectors not named [K03].
- "Your MES stays in charge": pilot rule, PROPOSAL [K04 s3]. Already live on v8 copy. Truth Lead to confirm.
- Category paragraph: [FR] category paragraph, the one use of "Physical AI" [CHARTER].
- "Designed and built in India": [B1], [B8] GREEN. "Built on the FiRa and omlox specifications": [FR], [CHARTER].
- "One contract and one support line": [B8].

---

### Screen 5. Start with one bay

**Purpose and buyer job.** Validation and consensus. This is the third act, so "Book a call" appears in the page for the first time. It ends with the visitor's own floor on screen.

**Final copy.**

> ## Start with one bay. Grow to the plant.
>
> A pilot watches one flow in one bay or line. We survey your floor and plan the anchors. Your MES stays in charge. Each stage has a check before the next, and you can stop at any of them. When it works, the rest of the plant runs on the same AmIHub.
>
> ### See your own floor first.
>
> Six questions. Two minutes. Your bay builds itself as you answer, and you leave with a plan for where to start.
>
> **[Diagnose your floor]**
>
> ## Which walk would you cut first?
>
> On the call we show the live map and an AI question on real AmIHub data.
>
> **[Book a call]**

**Picture. The diagnostic itself.**

- **Before it starts.** A still drawing of the hero bay in thin grey line, the same angle as the hero's after frame. The floor is empty. No trolleys yet. It waits for the visitor's answers.
- **When it starts.** The diagnostic loads on tap, not before. As the visitor answers, their own bay fills in: their carriers, their stations, their queue. The amber appears where they said work waits.
- **What the viewer understands in 1 second.** That bay is about to become mine.
- **JavaScript off.** The drawing and a plain link to "Book a call" [FR: diagnostic degrades to book a call].

**Seconds.** 15.

**Lands for.** P1 and P11 (bounded risk, option to stop). P9 (clear scope). P2 and P3 (their own flow and zones). P5 (a survey first). P6 (MES stays in charge). P12 (a repeatable start).

**Claim sources.**
- Pilot one bay or line, then scale on the same AmIHub: [B8], GREEN [K03].
- Site survey sets anchors: [B4], [B8].
- "Each stage has a check, and you can stop": gated pilot, PROPOSAL [CW], [K04 s5]. Not yet company policy. Truth Lead and founders to confirm before ship.
- Diagnostic: the main lead magnet Shiv liked [BR]; already built in v8.
- "Live map and an AI question on real AmIHub data": [B1], [B7]; "On real AmIHub data, not slides" [FR works].

---

### Screen 6. Footer

**Purpose and buyer job.** Consensus creation. It hands every buyer the one page meant for them, and gives search engines and AI assistants one plain paragraph about the company.

**Final copy.**

> **AmIMotion** shows where work is and where it waits. Tags ride on trolleys, bins, tools and vehicles. Anchors on the columns hear them. AmIHub turns that into one live map, inside your plant. AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru. Designed and built in India.
>
> **Read it for your role**
> Plant head: How a pilot runs
> Production control: Work in progress
> Supervisor: Find it from a screen
> Industrial engineering: How waits are timed
> Automation and OT: How it works on a steel floor
> MES and ERP: For developers
> IT and security: Trust and data
> Digital and group operations: Spatial intelligence
> Procurement and finance: How to buy
> Safety: People and privacy
> Owners and MDs: About us
> Integrators: Partners
>
> How it works · Where it helps · Your floor · Company · Book a call · sales@amimotion.com · Privacy
>
> FiRa and omlox are trademarks of their owners. NXP and Trimension are trademarks of NXP B.V. Specifications are indicative. Final datasheets are shared under NDA.

**Picture.** None. White space and type only.

**Seconds.** 5. The visitor reads one row, their own.

**Lands for.** All twelve. P10 lands on a page that says plainly that the WIP pilot tags carriers, not people [CW], [K09 P10]. P12 gets a partner page.

**Claim sources.**
- Company paragraph: [B1], [B3], [B5], [B8].
- Trademark lines: [K03 GREEN, NXP note], [B8].
- "Indicative" and "under NDA": [B3], [B4].
- Partners page: needs a page; partner names are RED [K03]. If no page exists at launch, the row links to Contact.

---

## 4. The nav

### Top level: four words and one button

**How it works · Where it helps · Your floor · Company** and, on the right, **Book a call**.

Each label answers one buyer question in order: what is it, will it help me, will it work for my floor, who are you. The button is the only filled element in the bar.

### What sits under each

Each menu opens with one large first link (the place to start) and three to six smaller ones. No eyebrow labels, no icons, no promo cards.

**How it works**
- See the whole system (first link): tag, anchor, AmIHub in one page.
- AmIGo tag
- AmIMo anchor
- AmIHub
- Ask your floor (MCP)
- Specifications
- For developers

**Where it helps**
- Work in progress (first link): the first door.
- Tools and fixtures
- Forklifts and AMRs
- Warehousing: pallets, totes, staging lanes [FR C6]
- Industries: manufacturing, warehousing, robotics

**Your floor**
- Diagnose your floor (first link): six questions, two minutes.
- How many anchors you need
- What searching costs you
- Your pilot on one page
- How a pilot runs

**Company**
- About us (first link): built in Bengaluru.
- How to buy
- Trust and data
- Questions
- Contact

### How a buyer gets guided

- **Order follows the buyer's questions.** Left to right is the same ladder as the homepage. A visitor who never scrolls still meets the story in the bar.
- **One first link per menu.** The eye lands on one thing. That is the guide. It replaces v8's "Start here / Next step" rail, which doubled every menu.
- **Your floor is the lead magnet's home.** All tools that use the visitor's own numbers sit under one word: "your". It is the only label that speaks to the buyer.
- **Book a call is one tap from anywhere.** It is the only button in the nav and the only one until screen 5 of the homepage.
- **The footer finishes the guide.** "Read it for your role" sends each of the 12 buyers to one page. A champion can forward a role page with no note.
- **Mobile.** One sheet. Diagnose your floor sits first, then the four groups as plain lists, then Book a call fixed at the bottom.

### For search engines and AI assistants

- Every menu link is a plain HTML link in the page source. Menus work with JavaScript off.
- Each link is one URL that answers one question, named as a person would ask it. "How many anchors you need" beats "Anchor estimator".
- The footer company paragraph matches the homepage hero and the schema.org Organization description word for word, so people, search and assistants read the same sentence.
- `llms.txt` lists the four groups and their pages in the same order as the nav.
- Breadcrumbs on every inner page use the same four words.

---

## 5. Three rounds of rework

All reader results below are SIMULATION by the Buyer Truth Lead's panel method [K09 s13]. They are thinking tools, not what buyers said.

### Round 1. Story Architect: the say-it-back test

- **Problem.** The first hero film drew the walk itself as a dotted line weaving through every aisle, then retracted it. The simulated supervisor (P4) said: "So it tracks where I walk." That is the one belief we must never plant [K09 P4].
- **Fix.** The walk left the picture. The "before" became the eye-level view itself. The camera is the walker. The climb past the anchor replaced the line.
- **Problem.** Screen 4 had three cards and a separate system diagram. The simulated OT engineer (P5) retold it as "a tag, an anchor and some software" with no idea where the anchor goes.
- **Fix.** One camera move, tag to anchor to floor. The retelling became "a tag on the trolley, a box on the column 6 m up, a map on a PC in the plant."
- **Problem.** "AI" came second, before the find. The simulated plant head (P1) said: "Another AI vendor." The Ask screen moved to third, after the finding moment, as the founders also asked [FR].
- **Cut.** A "three kinds of plant" row. It moved no belief and leaned on deployment claims that still need confirming [FR C5].

### Round 2. Executive Voice: money, time, risk

- Every line was scored against money, time or risk. Four lines touched none and were cut, including "Built for the way Indian plants really run." Nice, but no reader could act on it.
- "So nobody has to walk the floor" promised a result. It became "You find out from a screen, not a walk." That says how, not how much.
- The pilot block had no risk answer. Added "Each stage has a check before the next, and you can stop at any of them." The simulated MD (P11) said that line is what he would defend upwards. Flagged as a CW PROPOSAL.
- Three versions of the rust line were tested. "The floor walk, done from a screen" was killed: it repeats screen 2. "Your trolleys report in" was killed: "report in" sounds like people clocking in, which trips the surveillance fear. "Every trolley tells the room where it is" survived: it explains the mechanism, it is true to the pulse [B2], and the simulated plant head repeated it unprompted.
- The forwarding line a champion pastes above the link: "This shows where our trolleys are and how long they wait, without anyone walking. Worth a look for one bay?"

### Round 3. Buyer Truth Lead: truth and floor words

- "Live" next to a position became "last seen" where it describes a single record, per the stale-data rule [K04 s3]. "Live map" stays, as the brochure names it [B5].
- "±10 cm" became "down to ±10 cm depending on your site" [FR C4].
- "Wireless anchors" became "Needs only power. No data cables to run" [K03 AMBER, C20].
- "Talks to SAP" became "Sends what it knows to your MES, ERP and WMS." No connector is named [K03].
- The MCP lines now say "We show it live on the call", which carries the AMBER qualifier in plain words [K03].
- Vendor words swapped for floor words: "assets" became trolleys, bins and tools; "dwell" became "how long it has waited"; "trackables" never appears.
- Commas counted. Hero body: two. No em dashes anywhere.
- **Flags for the Truth and Quality Lead (not picked quietly).**
  1. Kit 03 and kit 13 require a "Simulation" label on simulated scenes. The charter and the brief ban labels. This concept avoids the conflict by showing only CAD renders, real AmIHub captures and number-free drawings. The hero's blue and amber overlay on a rendered bay is the one judgement call. We think it reads as an explanation drawn on a picture, like chalk on a match photo, because it carries no data. The Truth Lead decides.
  2. "Each stage has a check, and you can stop" and "Your MES stays in charge" are CW PROPOSALS. They need the founders' yes.
  3. Screen 2 needs a real AmIHub capture with plain demo names. If AmIMotion cannot supply it, the drawing fallback ships.
  4. The AMR in the hero is a vehicle with a tag. It must not be read as robot control. If the Truth Lead disagrees, it is cut and nothing else changes.
