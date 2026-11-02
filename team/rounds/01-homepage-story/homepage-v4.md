# Homepage v4: every buyer's 10, from what the founders gave us

Core committee, round 1, third rework. 1 Nov 2026.
In session: Creative Director (chair), Head of Words, Buyer Truth Lead, Truth and Quality Lead.
Inputs: homepage-v3.md, the nine v3 reader reviews in readers-v3/ (SIMULATION, hypothesis buyers), truth-check.md. Truth pass run on every new line against the founders' documents: kit 01 to 14, the brochure text (kit 11, cited [B#]), the commercial wedge (kit 12, [CW]), the deck text (kit 10, [D#]), the founders' review of 29 Oct 2026 [FR], the overview note of 9 Oct 2026 and the founders' brief of 21 Oct 2026.

Status: v4 goes back to step 4. v3 scored 7, 8, 9, 8, 9, 8, 9, 8, 8. Shiv's bar is every buyer at 10.

Shiv's ruling for this round: the founders say their documents are complete. So we searched them again for every fact a reader asked for. Where the fact is there, it is on the page. Where it is not, the page ships the safe true line. There are no founder brackets in this page. What stays unsourced is listed in founder-10-list.md as a short appendix.

The search found more than v3 used. The brochure already answers the anchor method ([B2] step 2), the anchor backhaul ([B8] FAQ), the coverage radius ([B4]), the dark-anchor alert and auto-discovery ([B5]), phone commissioning ([B4]), zone rules and event feeds ([B5]), linking tags to work orders inside AmIHub ([B5], [B7]), supervisors' mobile views ([B6]), growing without re-fitting ([B8]) and names and titles that are already public ([EFY], [FR] A3).

Every STOP in the truth check still holds. Two v3 rulings change because a founders' source now covers them. Each is ruled in its claim row.

---

## 1. Decisions

### What changed from v3, and why

| Part of the page | v3 | v4 | Evidence |
|---|---|---|---|
| Baseline | "The first waits it times are today's, so you can use them as your baseline." | "The pilot times today's waits first, over a window you choose. That is your baseline." | Read twice by P1, P3, P4, P5, P9 and P10. P3 asked for a window. [B5]: dwell "by time window". |
| Shift end | "Before it starts, we agree with you how each wait counts, even one still open at shift end." (18 words) | "Before it starts, we agree with you how a wait still open at shift end counts." (16) | Read twice by P1, P2 and P4. [CW]: dwell needs a set "treatment of missing data and unfinished visits". No source says what AmIHub does by default, so we keep "we agree". |
| People | "Tagging people is a separate decision, and yours." | "Tagging people would be a separate project. It would need its own policy and the consent of the people tagged." | Worst line for P4 and P10. Shiv: cut "and yours". Kit 09: people tracking "would need its own policy and consent conversation". [CW]: safety is a separate scope. |
| Cloud | "...with no internet, or in the cloud." | "...with no internet needed." | P6's 10, open four rounds. [B5] "a cloud tenant we manage" against [B7] "your cloud tenant" (C21). A cut adds no claim. |
| Anchor method | "Hears each pulse as it arrives." | "Times each pulse as it arrives, and the angle it came from." | P5's worst line, two rounds. [B2] step 2: "Every AmIMo anchor in range records arrival time... and, with 3D AoA, the direction it came from." |
| Anchor backhaul | "It syncs over the air. No separate data or sync cabling." | "It syncs over the air and sends its data to AmIHub over Wi-Fi. No separate data or sync cabling." | P6 read it twice. [B8] FAQ: "Anchors sync over the air and backhaul over Wi-Fi." |
| Coverage | "Each covers about 50 m..." | "Each reaches about 50 m around it..." | P3. [B4]: "~50 m line-of-sight coverage radius". |
| Outages | "If an anchor goes dark, AmIHub flags it." | "You set anchors up from a phone app. AmIHub finds each one on its own and raises an alert if one goes dark." Nav line names outages. | P5's 10 and "flags it how?". [B4] phone app, [B5] auto-discovery and "alerts when an anchor goes dark". |
| UWB | Footer only | "Sends a short UWB pulse" | P5. [B2], [B3]. |
| Battery | Life only | "AmIHub shows each battery's level." | P9 (batteries recur), P4. [B3], [B5]. |
| Phone | "Look it up on AmIHub's live map instead." | "Look it up on AmIHub's live map instead, on a screen or on your phone." | P4's 10. [B6] "mobile views for supervisors". [B2] Analytics "Web · mobile · API". |
| Limits | Cut in v3 (X6) | "Set a limit for each zone. When a trolley passes it, AmIHub sends the event to the system you name." | P2's 10 and P3's "set the limits". [B5]: "set rules", dwell events, "Zone and fence events streaming to any system you name" (day one). It promises a feed to a system, not a person told. |
| Who sees it | "Your supervisor can see it during the shift..." | "Supervisors see each wait live, during the shift, not at the next morning's review." | P4: "your supervisor" spoke to his boss about him. P10: tie it to the wait, not the worker. [B6]: the production supervisor's view is the "live line map". |
| Job link | "We agree with you how to link them before the pilot." | "Link each trolley to its job once, in AmIHub or from your own system. Nobody scans it along the way. Its wait becomes the job's wait." | P2's 10 and P6. [B5] work orders are first-class objects, "assign tags". [B7] trackables "assign tags" over MCP, REST and MQTT. [B5] push or pull from MES. |
| Work order | "...such as raising a work order, needs a person to approve it." | "...such as raising a work order in AmIHub, needs a supervisor's approval." | P6: in which system? P1, P2, P4: which person? [B5], [B7] "approval from a supervisor", "humans stay in the loop on every action". |
| Growing | "Then grow plant-wide on the same AmIHub. One AmIHub console can also run more than one site." | "Then grow plant-wide on the same AmIHub, without re-fitting the first bay. A second plant joins the same console, with its own survey." | P8's 10: what plant two costs us. [B8] "no re-instrumentation". [B5] "multi-site from one console". [CW]: "A second site may need a different mounting/network design." |
| What you buy | "plus our survey of your floor", "local engineers on site", "One team owns every layer, so you have..." | "plus our survey and an anchor plan for your floor", "local engineers on your site", "One contract and one support line cover every layer." | P9, P1, P12. [B8] step 3 "Anchor plan on your floor plan". [B8] "local engineers on site", read in its plain sense. P12 read the one-team line twice. |
| Integrator | "can build on its open interfaces" | "can build on it at any layer, through open interfaces" | P12. [B2]: "integrate at any layer". |
| A face | Empty slot | "Led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO." | P11's 10, P9's ask. FR A3 asks for founders on the site. K03 AMBER allows details already public in [EFY]. C22 allows "founder" for Kaushal. No years, no employers, no photo. |
| Headline | "...where it passed." | "...where it last passed." | P8's only re-read and his own fix. |
| Screen 2 | "The tag sends a pulse..." | "The tag sends a signal..." | P4 read "pulse" as a heartbeat. The hero says "its signal". Screen 5 keeps "pulse" for engineers. |
| Footer and nav | Group ops goes to How it works. Trust and data under About us. | Group ops goes to How to buy. Production also gets "Which job is on the trolley?". Trust and data under How it works. | P8, P2, P6. Labels only. |

### Depth trail: three fixes weighed three ways

**The alert (screen 3).**

| Option | For | Against | Verdict |
|---|---|---|---|
| P2's line: "When a trolley passes it, the person you name is told." | His exact 10. | No source says AmIHub tells a person. [B6] alerts are safety alerts. The founders' brief of 21 Oct still asks for "exact wording for dwell alerts". | STOP |
| Keep v3's "can see it" only. | Safe. | P2's worst line. Answers nothing about limits. | Killed |
| "Set a limit for each zone. When a trolley passes it, AmIHub sends the event to the system you name." | [B5] word for word in substance: rules, dwell events, events streaming "to any system you name". A limit the plant sets. A system the plant picks. | A system, not a person. P2 may still want a phone to ring. | **Kept**, with the supervisor line under it |

**The face (screen 6).**

| Option | For | Against | Verdict |
|---|---|---|---|
| Three founders with photos and one line each, as FR A3 asks | FR's own recommendation. | C2 and C22 open (Sumeer's title, who are founders). Photos and bios still need approval (founders' brief). | Killed for now |
| "On the call: Kaushal Kukkar, founder and CEO." | P9's form. | Promises who joins a call. No source says so. | Killed |
| "Led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO." | Both titles agree across [D2] and [EFY]. Public in [EFY]. Gives the promoter two names to look up. Promises nothing about the call. | No photo yet. | **Kept** |

**The job link (screen 3).**

| Option | For | Against | Verdict |
|---|---|---|---|
| P2's "Link the job card to the trolley once, when it leaves the cell." | His 10. | "When it leaves the cell" names a method. [CW] says the current method is open. | Killed |
| Keep "We agree with you how to link them". | Safe. | P2 and P4 read it as hidden scanning. | Killed |
| "Link each trolley to its job once, in AmIHub or from your own system. Nobody scans it along the way. Its wait becomes the job's wait." | [B5] tags assigned to work orders in AmIHub. [B7] the same over REST and MQTT. [B5] push or pull from MES. Says "once" and "nobody scans", which is what P2 asked. Names no scan point. | Does not say who does it at the cell. | **Kept** |

### Three rounds of rework on v4

1. **Truth first (Truth and Quality Lead).** Every reader's ask was searched in all the founders' documents. Fourteen asks are now answered from a source. Two v3 rulings change on a source: B29 ("hears") gives way to [B2] step 2, which says every anchor times the pulse and its angle; X6's ban on limits narrows, since [B5] states rules and event feeds as day-one Core. Alerts to a person stay out. C18 still holds for AmIFleet and prediction, which the page does not use. The supervisors' mobile view rests on [B6] as current, and the deck's June 2027 item names Fleet Manager and Spatial AI, not mobile views.
2. **Words (Head of Words).** Every line read twice in v3 is rewritten or cut. Longest sentence 16 words. No sentence with more than two commas. Lexicon: "signal" on floor screens, "pulse" on the engineer block, "job" on floor screens, "work order" only where AmIHub's object is meant.
3. **Length (Creative Director).** Fixes added about 70 words across the page. Cuts took about 30: the screen 2 first block, "such as the inspection queue or a staging lane", the one-team clause, the cloud clause and the shift-end tail. Screen 3 grows by two seconds and screen 6 gives them back (section 3).

---

## 2. Every reader's asks, and what v4 does

| Reader (v3) | One change for a 10 | Done in v4 | Still unsourced (appendix) |
|---|---|---|---|
| **P1 Plant head** (7) | Named checks and a stop. "Local engineers" in my plant. | "Local engineers on your site." "Prove the numbers before you decide on more" ([B8]). Both re-reads fixed. "And yours" cut. Approver named. | Named checks with a stop (B46 STOP, [CW] proposal only). |
| **P2 Production control** (8) | The wait reaches a named person. The job link in one sentence. | Limits per zone with an event to the system you name. Job link in one line: once, nobody scans. Supervisors see waits live. Footer row adds "Which job is on the trolley?". | A person told, rather than a system fed. A real capture (FR A4). |
| **P3 Industrial engineer** (9) | True shift-end rule and a baseline window. | Window added. Limits back. Coverage is a radius. | What AmIHub does with an open visit by default. |
| **P4 Supervisor** (8) | On my phone. Alert to the line first. Cut "and yours". | "On a screen or on your phone." "Supervisors see each wait live." Consent sits with the people tagged. "Pulse" is "signal". | Who is told first. A real phone capture. |
| **P5 OT and maintenance** (9) | Method, outage recovery and a link. | "Times each pulse as it arrives, and the angle it came from." Phone setup, auto-discovery, dark-anchor alert. Nav line "Steel, racking, signal and outages". UWB named. | How long anchors take to come back after a power cut. |
| **P6 and P7 MES, ERP and IT** (8) | Cut "or in the cloud". | Done. Wi-Fi backhaul stated. Work order "in AmIHub". Job link "in AmIHub or from your own system". Trust and data under How it works. | None for the 10. |
| **P8 Group operations** (9) | What plant two reuses. Footer to How to buy. | "A second plant joins the same console, with its own survey." "Without re-fitting the first bay." Footer moved. "Last passed". | Whether zones and the link method carry over to plant two. |
| **P9 and P11 Finance and owner** (8) | Install and support named. What recurs. A face. | "Survey and an anchor plan", "one support line", battery level, two names and titles. | Who installs. Which parts renew each year (the model is investor-confidential). Photos. |
| **P10 and P12 EHS and integrator** (8) | Consent. Who commissions. Versioned docs. | Consent line. "At any layer, through open interfaces." Phone-app commissioning on screen 5. | Who commissions and supports. Versioned docs. |

---

## 3. The homepage v4, screen by screen

### The 90-second budget

| Screen | Act | Seconds |
|---|---|---|
| 0. Nav | read inside the hero | 0 |
| 1. Hero | One: what it is | 15 |
| 2. Find it | One: why it matters to me | 15 |
| 3. See where work waits | Two: what changes | 15 |
| 4. Ask your floor | Two: what makes it different | 12 |
| 5. One system | Two: what it is made of | 16 |
| 6. Start with one bay | Three: what I do next | 14 |
| 7. Footer | find my page | 3 |
| **Total** | | **90** |

Screen 3 gains two seconds for the limit and the job link, the two lines P2 and P3 came for. Screen 2 gives one back by cutting its first sentence. Screen 6 gives one back: each reader still reads one block, and the pilot block is shorter. On screen 5 each buyer reads the headline and one block. P5's anchor block grows, but he reads only that block.

### The shared world (for every floor picture)

Unchanged from v3. One model hall, built once in Blender, rendered at 8K. Camera A locked: three-quarter overhead, about 45 degrees down, about 11 m up, near 35 mm.

> The hall is a designed model, never a photograph. One flat matte material per kind of thing. Simplified shapes. No wear, grime, tyre marks, patched slabs or faded paint. No daylight realism, sun patches or depth of field on wide shots. No people. No signs, text, brands or numbers. Blue trails and amber tints are flat graphic marks. Nothing in it suggests a real or named site.

Colour script as v3 (floor #f6f4ef, machines #e4e2dc, shadow #c9c7c1, hardware #3a3d42, located blue #66a5fa, waiting amber #f0a43a). Fixed counts: three trolleys wait in the inspection queue and one pallet waits in the staging lane. Higgsfield credits: zero.

---

### Screen 0. Nav

**Purpose.** Let any buyer leave for their own answer in one click. Carry the only "Book a call" until act three.
**Copy.** Exact, in section 4.
**Seconds.** 0.
**Claim sources.** Labels only. Changed: "Trust and data" moves under How it works. "How it locates a tag" now reads "Steel, racking, signal and outages".

---

### Screen 1. Hero

Unchanged from v3. No reader asked for a change.

> # Where work is. Where it waits.
>
> AmIMotion is spatial intelligence for factories and warehouses. A small tag rides on each trolley, bin and tool. Anchors on your columns hear its signal. One live map shows where it went and how long it has waited. You find out from a screen, not a walk.

47 words. Film, alt text, delivery and claim table as v3.

"Spatial intelligence" stays first (charter, FR). P2 read it twice. All nine readers say the next sentence carries it.

---

### Screen 2. Find it

**Purpose.** Name the gap the buyer lives with. Then show one trolley found.
**Buyer job.** "What does it do for me, on my shift?"

**Copy.**

> ## A scan tells you where it last passed. A tag tells you where it stopped.
>
> Between scans at each checkpoint, work moves and waits out of sight.
>
> Think of the last time someone went looking for a trolley. The walk. The calls to stores. The second walk.
>
> Look it up on AmIHub's live map instead, on a screen or on your phone. You see where it was last seen, and when. The tag sends a signal as it moves, so nobody scans it along the way. It goes on the trolley, not on the person pushing it.
>
> [Where is that trolley?](/use-cases/find-the-asset/)

78 words. Five commas in nine sentences. Longest sentence 15 words. The headline sets in two lines at 390 px.

**Picture.** The v3 fallback ships: a still crop of camera A, one trolley stopped behind the racks on a blue tint, its one trail back to the press. No UI, no numbers. A real AmIHub capture replaces it the day one exists. The founders' brief of 21 Oct still asks whether AmIHub screens may be shown, so no screen is drawn in the meantime.

**Alt text.** "A model factory floor. One trolley stopped behind the racks is marked blue, with a blue line showing its path from the press."
**Seconds.** 15.
**Lands for.** P4 (his phone, no scanning, the trolley not the person). P2 (the scan gap, last seen). P1 (the second walk). P3, P5 (one physics). P6 (one field). P8 ("last passed"). P10 (no person tagged).

**Claim sources.** Rows not listed are as v3.

| Line | Source | Truth ruling |
|---|---|---|
| "A scan tells you where it last passed..." | As v3 | PASS. "Last" adds no claim. |
| "Between scans at each checkpoint, work moves and waits out of sight." | Kit 09 section 8, [CW], K04 section 2 | A10 and A11 merged, PASS |
| "Look it up on AmIHub's live map instead, on a screen or on your phone." | [B5] live map. [B6] "Web dashboards, mobile views for supervisors". [B2] Act layer "Web · mobile · API". | NEW, PASS on AMBER. Mobile is stated as current in [B6] and [B2]. C18 names Fleet Manager and Spatial AI, not mobile views. Search stays out of the words (C18). |
| "The tag sends a signal as it moves..." | [B2] step 1, [B3] | PASS. "Signal" matches the hero. |

---

### Screen 3. See where work waits

**Purpose.** Show that waits are timed and limited, and how a trolley's wait becomes a job's wait. This is the WIP door.
**Buyer job.** "Where does my work wait, and can I trust the number?"

**Copy.**

> ## See where work waits.
>
> The map notes when each trolley or pallet enters a zone and when it leaves. You name the zones. You see how long each one has waited, while it is still waiting.
>
> Set a limit for each zone. When a trolley passes it, AmIHub sends the event to the system you name. Supervisors see each wait live, during the shift, not at the next morning's review.
>
> Link each trolley to its job once, in AmIHub or from your own system. Nobody scans it along the way. Its wait becomes the job's wait.
>
> Why it waited stays your team's call.
>
> [How waits are timed](/learn/dwell-time/) · [Which job is on the trolley?](/learn/association/)

101 words. Seven commas in eleven sentences. Longest sentence 15 words.

**Picture.** Unchanged from v3: the inspection station, one trolley in work on blue, three in the queue on amber, one pallet in the staging lane on amber.
**Seconds.** 15.
**Lands for.** P2 (limits, an event that leaves AmIHub, the job link in one line). P3 (entry, exit, zones, limits, open visits live). P4 (supervisors see it live, no scanning). P1 (the shift, not the review). P6 (link in AmIHub or from his system, dwell is not diagnosis). P10 (the wait, not the worker).

**Claim sources.** Rows not listed are as v3.

| Line | Source | Truth ruling |
|---|---|---|
| "You name the zones." | [B5] "define zones" | PASS. Examples cut for length. The picture carries them. |
| "Set a limit for each zone." | [B5] "define zones and fences, set rules", every dwell event time-stamped | NEW, PASS. Supersedes A20's cut of "set limits" on this source. |
| "When a trolley passes it, AmIHub sends the event to the system you name." | [B5] day one: "Zone and fence events streaming to any system you name." | NEW, PASS. A system, never a person told. X6 still bars "is told" and "alert" for dwell. |
| "Supervisors see each wait live, during the shift, not at the next morning's review." | [B6] what each role sees: production supervisor, "live line map, WIP by station". [B2] "decisions your supervisors can act on in the same shift". | PASS. Stronger than v3's "can see" only in tense. Promises no alert. |
| "Link each trolley to its job once, in AmIHub or from your own system." | [B5] work orders are first-class objects and tags are assigned. [B7] trackables "assign tags", "same tools over REST and MQTT". [B5] "push to or pull from MES, ERP". | NEW, PASS on AMBER. The link is an explicit act, which K03 requires ("an agreed association"). Names no scan point, since [CW] says the current method is open. Uses Core, not AmIFleet (C18). |
| "Nobody scans it along the way." | [B2], [B3] transmits on movement | PASS. Same claim as screen 2. |
| "Its wait becomes the job's wait." | K04 section 3, K03 NEVER (location alone never shows the job) | PASS. The job comes only from the link. |

---

### Screen 4. Ask your floor

**Purpose.** Show the floor answering a plain question, with people in charge.
**Buyer job.** "Is this ready for the AI my board keeps asking about, and is it safe?"

**Copy.**

> ## Ask your floor a question.
>
> **Which trolleys have waited at inspection for more than an hour?**
>
> Ask in plain words. An AI assistant answers from AmIHub's live map. Asking changes nothing. Any change, such as raising a work order in AmIHub, needs a supervisor's approval.
>
> *(Set smaller, for IT and developers)*
> AmIHub has an MCP server built in. MCP is an open standard that lets AI assistants use other software. Any assistant that supports MCP can connect. We show it live on a call. The server is part of AmIHub, so it can run on a PC inside your plant. If the assistant runs inside your network too, nothing has to leave it. Each assistant gets its own access: read-only, or only the actions you allow. Every request it makes is logged.
>
> [Ask your floor](/use-cases/ask-your-plant/) · [Trust and data](/trust/)

Main block 31 words plus the 11-word question. IT block unchanged, 81 words.

**Picture.** Unchanged from v3.
**Seconds.** 12.

**Claim sources.** Rows not listed are as v3.

| Line | Source | Truth ruling |
|---|---|---|
| "Any change, such as raising a work order in AmIHub, needs a supervisor's approval." | [B5] work orders are AmIHub objects. [B7] "approval from a supervisor before they execute" and "humans stay in the loop on every action". FR "Works. Keep." for "a person approves any action". K03 AMBER: act example with approval, framed as an example. | PASS on AMBER. "In AmIHub" answers P6: nothing is written into his MES. "Supervisor" is [B7]'s own word. X3 noted: [B7] also says "can require". We follow FR and [B7]'s "every action", the two founders' lines that agree. |

---

### Screen 5. One system

**Purpose.** Show what is bought and why to trust it, by method.
**Buyer job.** "What is it made of, will it work in my plant, will IT allow it?"

**Copy.**

> ## Three parts work as one system.
>
> **AmIGo tag.** Screws or sticks onto the trolley. Sends a short UWB pulse when it moves and sleeps when it stops. While it sleeps, the map shows where it was last seen. One battery lasts 1 to 3 years, depending on use. AmIHub shows each battery's level.
>
> **AmIMo anchor.** Fixed to a column or wall 3 to 8 m up. Times each pulse as it arrives, and the angle it came from. Needs only power, from DC or PoE. It syncs over the air and sends its data to AmIHub over Wi-Fi. No separate data or sync cabling. Each reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count. With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor. You set anchors up from a phone app. AmIHub finds each one on its own and raises an alert if one goes dark.
>
> **AmIHub.** Works out where each tag is from those times and angles. Runs on a PC inside your plant, with no internet needed. It connects to your MES, ERP and WMS through open REST, MQTT, WebSocket and omlox hub interfaces. Your team, your systems and AI assistants read the same live map. Your MES stays in charge of every job.
>
> Built on the FiRa and omlox specifications.
>
> [How it works](/platform/) · [Anchors, steel and outages](/technology/) · [For developers](/developers/)

Tag block 48 words, anchor block 111, AmIHub block 61. Each buyer reads the headline and one block. The anchor block is P5's whole job on the page, and P12's survey sheet. Longest sentence 16 words.

**Pictures.** Unchanged from v3. AmIGo on a trolley, screwed through its own ears. AmIMo on a column by its own tab, RJ45 port down, one DC cable. AmIHub as a real capture once one may be shown, until then the hero poster crop.
**Seconds.** 16.
**Lands for.** P5 (method, backhaul, radius, survey, accuracy, setup, outages). P12 (survey, phone commissioning, interfaces). P6, P7 (Wi-Fi backhaul, on-premise only, MES in charge). P4 (screws on, battery). P9 (battery level, accuracy not price). P8 (one map).

**Claim sources.** Rows not listed are as v3.

| Line | Source | Truth ruling |
|---|---|---|
| "Sends a short UWB pulse when it moves and sleeps when it stops." | [B2] step 1, [B3] | B26 PASS. "UWB" added. |
| "AmIHub shows each battery's level." | [B3] "battery level reported to AmIHub". [B5] battery monitoring. | NEW, PASS |
| "Times each pulse as it arrives, and the angle it came from." | [B2] step 2: "Every AmIMo anchor in range records arrival time to sub-nanosecond precision and, with 3D AoA, the direction it came from." [B4] 3D AoA on every anchor. | NEW, PASS. Supersedes B29's REWORD. B29 kept "hears" while the scheme was open (X12, FR A8). The brochure states both measurements for every anchor, and the founders say their documents are complete. The line names no mode (TDoA, TWR or AoA) and no precision. |
| "It syncs over the air and sends its data to AmIHub over Wi-Fi." | [B4] "over-the-air sync, Wi-Fi backhaul". [B8] FAQ "backhaul over Wi-Fi". | NEW, PASS on K03 AMBER. Never "fully wireless". The Ethernet option is on the specs page. |
| "Each reaches about 50 m around it in clear line of sight." | [B4] "~50 m line-of-sight coverage radius" | PASS on AMBER. The survey line stays in the same block (K03). |
| "You set anchors up from a phone app." | [B4] "Commissioned from a phone app" | NEW, PASS |
| "AmIHub finds each one on its own and raises an alert if one goes dark." | [B4] and [B5] "auto-discovered by AmIHub", "auto-discovery of anchors", "alerts when an anchor goes dark" | NEW, PASS. Device health, so X6 does not apply. It does not say how long recovery takes. |
| "Works out where each tag is from those times and angles." | [B2] step 3: "fuses timing, angle and map constraints" | PASS |
| "Runs on a PC inside your plant, with no internet needed." | [B5] "no internet dependency". K03 GREEN. | PASS. Cloud clause cut. C21 untouched. |

---

### Screen 6. Start with one bay

**Purpose.** Make the first step small, bounded and useful before any call.
**Buyer job.** "What do I do next, what do I buy, what does trying cost me, and what happens after?"

**Copy.**

> ## Start with one bay.
>
> A pilot follows one flow in one bay or line. You choose the flow. The pilot times today's waits first, over a window you choose. That is your baseline. Before it starts, we agree with you how a wait still open at shift end counts.
>
> The pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy and the consent of the people tagged.
>
> You see your own waits in one bay, and prove the numbers, before you decide on more. Then grow plant-wide on the same AmIHub, without re-fitting the first bay. A second plant joins the same console, with its own survey.
>
> [People and privacy](/trust/people/) · [Measure before you claim](/learn/pilot-baseline/)
>
> **What you buy.** AmIGo tags, AmIMo anchors and AmIHub, plus our survey and an anchor plan for your floor. Designed and built in India, with local stock and local engineers on your site. One contract and one support line cover every layer. Your team or your integrator can build on it at any layer, through open interfaces. Prices and pilot options are shared under NDA, after the first call.
>
> ### Plan your first bay.
> Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you.
> [Button, secondary: Plan your first bay]
>
> ### See it on real data.
> The call is a live demo on real AmIHub data, not slides. Led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.
> [Button, primary: Book a call]

About 230 words in four blocks plus the two calls. Each reader reads the headline and one block: the pilot (P1, P2, P3), people (P4, P10), what comes after (P8, P9, P11), or what you buy (P9, P12). The pilot block is 43 words, down from 52. 14 commas in 22 sentences. Longest sentence 16 words.

**Picture.** Unchanged from v3: the hall pale, one inspection bay in colour, the diagnostic opening over it.
**Seconds.** 14.

**Claim sources.** Rows not listed are as v3.

| Line | Source | Truth ruling |
|---|---|---|
| "The pilot times today's waits first, over a window you choose." | [B5] dwell "by time window", dwell from day one. [B8] "prove the numbers". | NEW, PASS on AMBER. Names no duration (K03 NEVER). Not a baseline gate (X8). |
| "That is your baseline." | As above | PASS |
| "Before it starts, we agree with you how a wait still open at shift end counts." | [CW] zone dwell needs a set "treatment of missing data and unfinished visits". K04 section 2. [B8] "a scoped pilot". | PASS on AMBER. Shorter form of v3's line. |
| "Tagging people would be a separate project. It would need its own policy and the consent of the people tagged." | Kit 09 sections 6 and 8 ("its own policy and consent conversation"). [CW] safety is a separate scope. [B3] personnel badges exist. | NEW, PASS on AMBER. "Would" keeps it off the pilot and off today. It states a condition, not a feature. Kit 09 marks the plant side as HYPOTHESIS, so the line says what it would need, not how plants handle it. |
| "You see your own waits in one bay, and prove the numbers, before you decide on more." | [B8] FAQ "pilot one bay or line, prove the numbers, then scale" | PASS. Names no gate and no stop (B46 holds). |
| "Then grow plant-wide on the same AmIHub, without re-fitting the first bay." | [B8] "extend on the same AmIHub instance, no re-instrumentation" | PASS |
| "A second plant joins the same console, with its own survey." | [B5] indicative "multi-site from one console". [CW] "A second site may need a different mounting/network design". [B4] survey sets the count. | NEW, PASS on AMBER. Footer "Specifications are indicative" covers the console line. It says what plant two costs in effort: a survey. It does not say zones or links carry over. |
| "plus our survey and an anchor plan for your floor" | [B8] step 3 "Anchor plan on your floor plan" | PASS |
| "with local stock and local engineers on your site" | [B8] "local stock, local engineers on site" | PASS. "On site" read in its plain sense, the customer's site. "Your" makes that reading explicit and adds nothing else. |
| "One contract and one support line cover every layer." | [B8] | B39 REWORD carried, shorter |
| "Your team or your integrator can build on it at any layer, through open interfaces." | [B2] "integrate at any layer". [B5] open integration. | PASS. Names no partner and no programme (K03 RED, C6). |
| "Led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO." | [D2], [EFY] both titles. FR A3 asks for founders on the site. K03 AMBER: public [EFY] details only. C22: "founder" for Kaushal only. C3, C4: no years, no employers. | NEW, PASS on AMBER. No photo until the founders approve photos (founders' brief, 21 Oct). |

Still cut by binding STOP: "Each stage has a check before the next, and you can stop at any of them." (B46). "Runs in automotive, robotics and warehousing plants." (A46, C34).

---

### Screen 7. Footer

**Purpose.** Send each buyer to the one page for their next question.
**Copy.** Exact, in section 4.
**Seconds.** 3.
**Claim sources.** As v3. Two row changes, labels only.

### Buyer coverage check

| Buyer | Screens that land | Footer page |
|---|---|---|
| P1 Plant head | 1, 2, 3, 4, 6 | How a pilot runs |
| P2 Production or PPC | 1, 2, 3, 4 | Work in progress · Which job is on the trolley? |
| P3 IE or CI lead | 2, 3, 5, 6 | How waits are timed |
| P4 Supervisor | 1, 2, 3, 5, 6 | Where is that trolley? |
| P5 OT engineer | 1, 2, 5 | How it locates a tag |
| P6 MES or ERP owner | 2, 3, 4, 5 | Which job is on the trolley? |
| P7 IT and security | 4, 5 | Trust and data |
| P8 Group digital sponsor | 1, 2, 3, 4, 5, 6 | How to buy |
| P9 Procurement | 1, 5, 6 | How to buy |
| P10 EHS | 1, 2, 6 | People and privacy |
| P11 Promoter or MD | 1, 2, 4, 6 | About us |
| P12 Integrator | 4, 5, 6 | For developers |

---

## 4. The nav and the footer

### The bar

> **AmIMotion** (logo, home) · How it works · Where it helps · Start small · About us · **[Book a call]**

Unchanged. Behaviour as v3: plain HTML links, panels open on click or tap, work with JavaScript off.

### Under each

One label per URL, the same in the bar, phone sheet, footer, breadcrumbs, llms.txt and BreadcrumbList JSON-LD. Changed rows are marked (v4).

| Section (hub) | Label | URL | Line under the label |
|---|---|---|---|
| **How it works** (/platform/) | AmIGo tag | /products/amigo/ | Rides on what moves |
| | AmIMo anchor | /products/amimo/ | Hears every tag |
| | AmIHub | /products/amihub/ | One live map |
| | Ask your floor | /use-cases/ask-your-plant/ | AI assistants and MCP |
| | How it locates a tag | /technology/ | Steel, racking, signal and outages (v4) |
| | When a tag goes quiet | /learn/location-data-quality/ | Last seen, sleep and gaps |
| | Specifications | /specs/ | Every figure and its condition |
| | Trust and data | /trust/ | Where your data lives (v4, moved) |
| | For developers | /developers/ | API and MCP docs |
| **Where it helps** (/solutions/) | Work in progress | /solutions/wip/ | See where work waits |
| | Where is that trolley? | /use-cases/find-the-asset/ | Find it from a screen |
| | How waits are timed | /learn/dwell-time/ | Zones, limits, entries and exits (v4) |
| | Which job is on the trolley? | /learn/association/ | Linking trolleys to jobs |
| | Tools and vehicles | /solutions/assets/ | Fixtures, forklifts, AMRs |
| | Manufacturing | /industries/manufacturing/ | Bays, lines and inspection |
| | Warehousing | /industries/warehousing/ | Pallets, staging lanes, docks |
| | Robotics and AMRs | /industries/robotics/ | Robots and carriers on one map |
| **Start small** (/start/) | How a pilot runs | /pilot/ | One flow, one bay |
| | How to buy | /how-to-buy/ | Call, NDA pack, survey, pilot |
| | Plan your first bay | /diagnostic/ | Six questions, a plan back |
| | How many anchors you need | /tools/anchors/ | A first estimate, before the survey |
| | Time spent searching | /tools/search-time/ | Your own numbers |
| | Your pilot on one page | /tools/pilot/ | To share with your team |
| | Measure before you claim | /learn/pilot-baseline/ | Set a baseline first |
| | Field guides | /learn/ | Plain answers, one per page |
| | Films | /films/ | The video hub |
| **About us** (/company/) | What is AmIMotion? | /what-is-amimotion/ | The company in one page |
| | What is spatial intelligence? | /industrial-spatial-intelligence/ | The category |
| | People and privacy | /trust/people/ | Carriers, not people |
| | Questions | /faq/ | Short answers |
| | Glossary | /glossary/ | Floor words and tech words |
| | Book a call | /contact/ | Talk to the team |

Each panel ends with one line: "Not sure where to start? Plan your first bay."

Build notes, new in v4. /technology/ gets an outages section from [B4] and [B5]: anchors set up from a phone app, found by AmIHub on their own, an alert when one goes dark, over-the-air sync. It says recovery time is measured in the pilot's technical test ([CW]) and gives no figure. /learn/dwell-time/ shows how a limit becomes an event sent to a named system ([B5]), and covers the zone boundary case or says it is open (P3, P5). /learn/association/ shows linking a tag to a work order in AmIHub and over the API, with the link's start and end ([CW]). /learn/pilot-baseline/ says the baseline window should start after the floor stops noticing the tags (P3). /trust/ answers what the support line can reach and how one console reaches a second site (P6, P7). /company/ carries the same two names and titles until photos and bios are approved. All v3 build notes stand.

### Phone

Unchanged from v3.

### For search engines and AI assistants

Unchanged from v3.

### The footer, exact

> ## Start from your job.
>
> Plant heads: [How a pilot runs](/pilot/)
> Production and planning: [Work in progress](/solutions/wip/) · [Which job is on the trolley?](/learn/association/) (v4)
> Shift supervisors: [Where is that trolley?](/use-cases/find-the-asset/)
> Lean and IE leads: [How waits are timed](/learn/dwell-time/)
> Maintenance and OT: [How it locates a tag](/technology/)
> MES and ERP owners: [Which job is on the trolley?](/learn/association/)
> IT and security: [Trust and data](/trust/)
> Group operations and digital: [How to buy](/how-to-buy/) (v4)
> Procurement and finance: [How to buy](/how-to-buy/)
> Owners and MDs: [About us](/company/)
> Safety and EHS: [People and privacy](/trust/people/)
> Developers and integrators: [For developers](/developers/)
>
> *(Then four link columns, one per section, repeating the nav tables above with the same labels.)*
>
> AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. It makes AmIGo tags, AmIMo anchors and AmIHub software. AmIMotion builds industrial spatial intelligence. It gives a time-stamped location to everything you tag in a plant. It joins that location with your zones and with the jobs you link to each carrier. Your team, your systems and AI assistants can then answer where work is and where it waits. It is the first layer of Physical AI for factories and warehouses. Designed and built in India on NXP Trimension UWB silicon. Built on the FiRa and omlox specifications.
>
> [sales@amimotion.com](mailto:sales@amimotion.com) · [Privacy](/privacy/)
>
> NXP and Trimension are trademarks of NXP B.V. FiRa and omlox are trademarks of their owners. Specifications are indicative. Final datasheets are shared under NDA.

"Physical AI" appears once, here (charter, FR). "Under NDA" for datasheets stays (K03).

---

## 5. What is still unsourced

Shiv's ruling: the founders' documents are complete. Each fact below was searched for in all of them and is not there, or is barred by a founders' rule. The page ships the safe true line in each case. The short list is in founder-10-list.md as an appendix, in case a founder wants to add a line later. Nothing on the page waits on it.

v3 items now closed from sources: 3 (approval, [B7] and FR), 4 in part (work order in AmIHub), 7 in part (phone, [B6]), 8 (cloud, cut), 10 (multi-site, [B5] with its survey), 14 in part (dark anchors and auto-discovery), 15 (consent wording, kit 09), 16 (MES, K04 and [CW]).

---

## 6. Our honest prediction, reader by reader

Predictions, not results. The readers are SIMULATION.

| Reader | v3 | v4 predicted | Why it moves | What could hold it at 9 |
|---|---|---|---|---|
| **P1 Plant head** | 7 | **9** | Both re-reads gone. "And yours" gone. "Local engineers on your site" is his 2 am answer. "Prove the numbers before you decide on more" and a supervisor who sees waits live. | His veto is a written stop. The page says the decision is his, but names no checks. |
| **P2 Production control** | 8 | **10** | Limits per zone. An event leaves AmIHub to the system he names. The job link in one line: once, nobody scans. | If he still wants a person told, not a system fed. |
| **P3 Industrial engineer** | 9 | **10** | Baseline with a window, limits back, coverage as a radius, entry and exit and open visits live. | The default shift-end rule is still "we agree". He said he prefers a true rule to a nice one, and this is true. |
| **P4 Supervisor** | 8 | **10** | "On your phone." "Supervisors see each wait live." Consent sits with the people tagged. No "pulse", no "your supervisor". | Who is told first is unsaid. The picture is a model until a capture may be shown. |
| **P5 OT and maintenance** | 9 | **10** | "Times each pulse... and the angle it came from." Wi-Fi backhaul. Phone setup, auto-discovery, alert, an outages link and nav line. UWB in the body. | No recovery time. |
| **P6 and P7 MES, ERP and IT** | 8 | **10** | Cloud cut. Backhaul stated. Work order and job link both "in AmIHub". Trust and data where a security head looks. | None we know of. |
| **P8 Group operations** | 9 | **10** | Plant two in one honest line: same console, its own survey. "Without re-fitting the first bay." Footer to How to buy. "Last passed". | He may still ask whether zones carry over. |
| **P9 and P11 Finance and owner** | 8 | **9 to 10** | Two names and titles for the promoter. Anchor plan, one support line and battery level for procurement. | Installation and recurring lines are still not named. The model is investor-confidential. |
| **P10 and P12 EHS and integrator** | 8 | **10 and 9** | EHS gets consent in the people line. The integrator gets "at any layer", phone commissioning and the survey. | Who commissions and supports, and versioned docs. |

**What the committee owns.** v4 uses every fact the founders gave us. On that, we expect 10 from P2, P3, P4, P5, P6, P8 and EHS, and 9 from P1, procurement and the integrator. We do not write past the sources to close the last three. If a reader at step 4 still scores 9, the reason will be one of the appendix lines, and we will say so.

**Risks we carry into the retest.**
- Screen 3 is now the longest floor screen. If any reader fails the say-back there, the first cut is "Why it waited stays your team's call." and the second is "Nobody scans it along the way.", which screen 2 already says.
- Two lines lean on AMBER with a founders' source behind them: mobile views ([B6] against C18) and the console line ([B5] indicative). If the Release Judge rules either a plan, it reverts to v3 and P4 or P8 drops to 9.
- "Last passed" changes a headline P1 and P2 loved. Retest with them first.
