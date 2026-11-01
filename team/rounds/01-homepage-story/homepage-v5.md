# Homepage v5: the true page, and what each buyer gets from it

Core committee, round 1, fourth rework. 1 Nov 2026.
In session: Creative Director (chair), Head of Words, Buyer Truth Lead, Experience Design Lead, Truth and Quality Lead.
Inputs: homepage-v4.md, truth-check-v4.md (binding), the nine v4 reader reviews in readers-v4/ (SIMULATION, hypothesis buyers), truth-check.md (round 1 rulings carried), founder-10-list.md.

Status: v5 goes back to step 4. v4 scored 8, 9, 9, 8, 9, 9, 9, 9, 9. Shiv's bar is every buyer at 10.

Shiv's ruling stands: the founders' documents are complete. There are no questions to the founders in this round. Where a fact is missing, the page ships the safe true line.

truth-check-v4.md holds over every claim table in v4. All 5 STOPs and all 8 REWORDs are applied here in the exact words given. Three STOPs took away lines readers liked: the phone (V13), the event when a limit is passed (V25) and the consent clause (V83). This round looks for other true ways to meet the worry behind each one. We show instead of claim, answer with a sourced fact, or put the detail one click away under a label that says only what is there. Nothing stopped comes back in other words.

---

## 1. Decisions

### The truth check, applied

| # | Ruling | v4 | v5 |
|---|---|---|---|
| V13 | STOP | "Look it up on AmIHub's live map instead, on a screen or on your phone." | "Look it up on AmIHub's live map instead." |
| V25 | STOP | "When a trolley passes it, AmIHub sends the event to the system you name." | "AmIHub streams zone events to any system you name." (the line truth gave in its place) |
| V83 | STOP | "It would need its own policy and the consent of the people tagged." | "It would need its own policy." (the line truth gave in its place) |
| V107 | STOP | Build note: a limit becomes an event | "/learn/dwell-time/ shows how zone events stream to a named system ([B5]), and covers the zone boundary case or says it is open." |
| V110 | STOP | Build note: /trust/ answers support reach and the second site | "/trust/ lists the security lines in [B5] and [B7] (TLS, role-based access, API keys, audit trail, per-assistant scope, logged calls)." |
| V24 | REWORD | "Set a limit for each zone." | "Set rules for each zone." |
| V38 | REWORD | "...needs a supervisor's approval." | "Any change, such as raising a work order in AmIHub, needs a person's approval." |
| V86 | REWORD | "A second plant joins the same console, with its own survey." | "A second plant gets its own survey, and AmIHub can run both from one console." |
| V95 | REWORD | "Led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO." | "AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO." It also moves off the call block, so it cannot read as who joins a call (truth section 2.1). |
| V100 | REWORD | Nav line "Zones, limits, entries and exits" | "Zones, rules, entries and exits" |
| V101 | REWORD | Nav line "Carriers, not people" | "What a pilot tags, and why" |
| V106 | REWORD | Build note: recovery time measured in the pilot | "It gives no recovery figure." |
| V108 | REWORD | Build note: the link's start and end | "/learn/association/ shows assigning a tag to a work order in AmIHub and over the API ([B5], [B7]). It says why a link needs a start and an end ([CW]), without claiming AmIHub records them." |

Also applied from truth-check-v4.md: the claim for "Supervisors see each wait live" now cites [B5], not [B6] (V26). No UI is drawn on screen 2, because no AmIHub screen may be shown yet and a mock-up of the UI is never allowed (V18; truth-check.md section 0 rule 3).

### What else changed from v4, and why

| Part of the page | v4 | v5 | Evidence |
|---|---|---|---|
| Find-it picture | Fallback still: one trolley on blue, one trail | The same world, cropped closer: the blue trail ends exactly where the trolley stopped, so the picture shows "last seen" as a place. Nothing else on the floor is coloured. | P2 and P4: the words say "last seen", the picture shows no "when". A drawn AmIHub view would be a UI mock-up (truth-check.md section 0 rule 3, V18), so the picture shows the place and the words carry the time. |
| Job link | "Link each trolley to its job once, in AmIHub or from your own system." | "Link a trolley to each job it carries, in AmIHub or from your own system." | P3's worst line, P2 and P4 re-read it: "once" read as one-time set-up. Truth V27: "once" means once per job. [B5] tags are assigned to each work order. The new line says that and adds no method. |
| Job's wait | "Its wait becomes the job's wait." | "Its wait becomes that job's wait." | Follows the per-job link. Same claim (K04 section 3). |
| Team's call | "Why it waited stays your team's call." | "Why it waited is for your team to say." | P2 read "call" as a phone call on a page that ends in "Book a call". Same claim. |
| Shift end | "Before it starts, we agree with you how a wait still open at shift end counts." | "Before it starts, we agree how to count a wait that runs past shift end." | Read twice by P1, P2, P5, P9 and P12. P9's own fix. Same scoping step as V80. 15 words. |
| Anchor method | "Times each pulse as it arrives, and the angle it came from." | "Records when each pulse arrives and the angle it came from." | Read twice by P5 and P12: you cannot time an angle. P12's own fix. [B2] step 2 "records arrival time ... and ... the direction it came from". Closer to the source. |
| Wi-Fi backhaul | No condition, no fallback | "The specifications also list an Ethernet option." Link "Specifications" added to the screen. | P5's 10. truth-check-v4.md V57: "The Ethernet option stays on /specs/." The homepage points to it and adds no figure. |
| Screen 5 links | "Anchors, steel and outages" pointed at /technology/ | "How it locates a tag" | P5: two labels for one page. One label per URL. |
| MES line | "Your MES stays in charge of every job." | "Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited." | P6 read it twice next to "work order in AmIHub". The second sentence says what AmIHub adds. It names no key and no sync, which no source gives. |
| UWB | "a short UWB pulse" | "a short UWB radio pulse" | P2 and P4 did not know "UWB". "Radio" says what it is in one word. |
| Mounting | "Screws or sticks onto the trolley." | Same words. The tag render beside it shows the screws through the tag's own ears. | P4: "what if the tag falls off?" No source gives a fall-off answer. The picture shows how it is held. |
| People | Three sentences, with consent | "The pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy." | V83 STOP applied. P1 wanted it shorter and it is. EHS keeps the boundary. |
| Second plant | "joins the same console" | V86 words, then "Ask us how the two connect." | V86 applied. P8 and P6: how does it connect? No source says (X16, V110). The page says so by asking, and claims nothing. |
| The leaders | Under the call button | Last line of "What you buy", with the company as subject | V95 applied. The promoter still finds two names before the button. |

### Depth trail: five fixes weighed three ways

**The worry behind the stopped alert (screen 3). P2 and P4: who finds out when a wait runs long?**

| Option | For | Against | Verdict |
|---|---|---|---|
| "When a wait passes the limit, AmIHub tells the supervisor." | P4's exact 10. | No source. X15, Q6, [CW] exception interface NEEDS VALIDATION, [FB] still asks for dwell-alert wording. It brings back V25 in new words. | STOP, not tried |
| "AmIHub streams each entry and exit to any system you name, so your own tools can tell the right person." | Concrete. Points at the plant's own tools. | The second clause implies a wait alert reaches a person by another route. That is V25 again. | Killed |
| Truth's line, kept exact, beside "Supervisors see each wait live" and followed by screen 4's question "Which trolleys have waited at inspection for more than an hour?" | Every word sourced ([B5], [B7]). It shows a threshold being asked, live, on the next screen, which no stop touches. | It is a pull. Nobody is shown being told. | **Kept** |

**The find-it picture (screen 2). P2: show the map with a last-seen time.**

| Option | For | Against | Verdict |
|---|---|---|---|
| A clean AmIHub-style view drawn by us: map, trolley, "Last seen 10:42" | P2's and P4's 10. The direction allowed it only if truth allows. | Truth does not allow it. Truth-check.md section 0 rule 3: real captures only, "No mock-up of the UI, ever". V18: no UI while [FB] asks whether AmIHub screens may be shown. A drawn time is also a fake data chip (charter). | Killed |
| A clock or time drawn into the hall | Shows "when". | The shared world bans numbers and text. It would need a label. | Killed |
| The camera A still, cropped closer, with the blue trail ending at the stopped trolley | Shows "last seen" as a place, with no data. Needs no label. The words carry "and when". | No time on the picture. | **Kept** until a real capture may be shown |

**The Wi-Fi backhaul (screen 5). P5: give it a condition and a fallback.**

| Option | For | Against | Verdict |
|---|---|---|---|
| P5's line: "...over Wi-Fi, or over Ethernet from the same port where Wi-Fi is weak." | His 10. | "From the same port" and "where Wi-Fi is weak" say how and when to use it. No source gives either. | Killed |
| "If Wi-Fi drops, the anchor buffers its data." | His real worry. | No source. Invented behaviour. | STOP, not tried |
| "The specifications also list an Ethernet option." with the Specifications link on the screen | V57 places the Ethernet option on /specs/. The line says only where it is listed. AmIHub's dark-anchor alert sits in the same block. | Says nothing about buffering or rejoin time. | **Kept** |

**The people block (screen 6). P1: cut it. P10: keep the line drawn.**

| Option | For | Against | Verdict |
|---|---|---|---|
| Cut to "The pilot tags trolleys, bins and pallets, not people." and move the rest to People and privacy | P1's ask. | EHS loses the boundary on the screen where the pilot is scoped. | Killed |
| Keep v4 with consent | EHS's best line. | V83 STOP. | STOP |
| The pilot line plus truth's two short lines, and the People and privacy link beside them | Shorter than v4 by seven words. EHS keeps "a separate project" and "its own policy". | P1 still reads three sentences. | **Kept** |

**The second plant (screen 6). P8 and P6: what is a console, and how does plant two connect?**

| Option | For | Against | Verdict |
|---|---|---|---|
| "Both show on one group view across your network." | P8's 10. | No source for the topology (X16). Truth stopped the /trust/ note that promised it (V110). | Killed |
| V86 words only | Exact and safe. | "Console" stays a question with no door. | Killed |
| V86 words, then "Ask us how the two connect." | Says honestly that the page does not answer it, and claims nothing. It sends the CIO's first question to the call. | "Console" is still undefined. | **Kept** |

### Three rounds of rework on v5

1. **Truth first (Truth and Quality Lead).** Every STOP and REWORD from truth-check-v4.md is in, word for word. Each new v5 line was checked against the source the truth check already ruled on: the per-job link (V27), "Records when" ([B2] step 2), the Ethernet pointer (V57), "radio" (UWB is a radio, [B2]), the MES line (K04 section 3, [B5]). "Ask us how the two connect" makes no claim. No stopped line comes back as a picture, a link label or a build note.
2. **Words (Head of Words).** Every line read twice in v4 is cut or rewritten: "passes it" (gone with V25), "once" (per job), "how a wait still open at shift end counts" (P9's form), "times ... the angle" (P12's form), "Your MES stays in charge" (now says what AmIHub adds), "joins the same console" (V86). Longest sentence 15 words. "Call" means a phone call with us and nothing else.
3. **Length and labels (Creative Director, Experience Design Lead).** Cuts: the phone clause, the consent clause, "once", "with you". Adds: one Ethernet sentence, one MES sentence, one "Ask us" sentence. One label per URL is restored on screen 5. The 90-second budget holds.

---

## 2. Every reader's asks, and what v5 does

| Reader (v4) | One change for a 10 | Done in v5 | Not possible, and why |
|---|---|---|---|
| **P1 Plant head** (8) | Two named checks and a stop on screen 6. Cut the people block to its first sentence. | Re-read line gone. Consent gone. People block shorter. Shift-end line reads once. | The stop. B46 STOP holds: [CW] has checks as a proposal only. |
| **P2 Production control** (9) | The wait reaches a named person, shown as a real AmIHub capture with a last-seen time. | Link per job, from AmIHub or his own system. Zone events stream to any system he names. Supervisors see waits live. Screen 4 asks the threshold question. The picture shows last seen as a place. "Call" no longer means two things. | A person told (V25 STOP, X15). A real capture or a drawn UI (no capture may be shown; no mock-up ever). |
| **P3 Industrial engineer** (9) | A per-job link with a start and an end. The true shift-end default. | "Link a trolley to each job it carries." "That job's wait." | The shift-end default. No source says what AmIHub does. Start and end recording is not claimed (V108). |
| **P4 Supervisor** (8) | A real phone screen. Who hears first. What if the tag falls off. | Re-reads gone. The tag render shows the screws. "UWB radio pulse". | The phone (V13 STOP, X14). Who hears first (X15). A fall-off line. |
| **P5 OT and maintenance** (9) | Wi-Fi with a condition and fallback. Fix "times ... the angle". One label for /technology/. | "Records when each pulse arrives and the angle it came from." "The specifications also list an Ethernet option." "How it locates a tag" everywhere. | Buffering and rejoin time when Wi-Fi or power drops. |
| **P6 and P7 MES, ERP and IT** (9) | Name the MES job key beside "MES in charge". | "AmIHub adds where its trolley is and how long it has waited." The phone network question is gone with the phone. | The job key, and how a second plant reaches one console (X16, V110). |
| **P8 Group operations** (9) | Replace "console" and say how plants connect. | V86 words. "Ask us how the two connect." | The multi-site topology (X16) and what plant two reuses. |
| **P9 and P11 Finance and owner** (9) | Name installation and what recurs. | The leaders are still named before the button. Survey, anchor plan, one contract, one support line, battery level. | Who installs. Which parts renew each year. Who supplies the AmIHub PC. |
| **P10 and P12 EHS and integrator** (9) | Name who commissions and supports. Versioned docs. Keep consent. | The boundary stays on screen 6: a separate project with its own policy. Phone-app commissioning on screen 5. | Consent (V83 STOP, X17). The commissioning and support split. Versioned docs. |

---

## 3. The homepage v5, screen by screen

### The 90-second budget

| Screen | Act | Seconds |
|---|---|---|
| 0. Nav | read inside the hero | 0 |
| 1. Hero | One: what it is | 15 |
| 2. Find it | One: why it matters to me | 14 |
| 3. See where work waits | Two: what changes | 15 |
| 4. Ask your floor | Two: what makes it different | 12 |
| 5. One system | Two: what it is made of | 17 |
| 6. Start with one bay | Three: what I do next | 14 |
| 7. Footer | find my page | 3 |
| **Total** | | **90** |

Screen 2 gives one second back with the phone clause gone. Screen 5 takes it for the Ethernet and MES lines. Each buyer still reads the screen 5 headline and one block.

### The shared world (for every floor picture)

Unchanged from v4 (V0 PASS). One model hall, built once in Blender, rendered at 8K. Camera A locked: three-quarter overhead, about 45 degrees down, about 11 m up, near 35 mm.

> The hall is a designed model, never a photograph. One flat matte material per kind of thing. Simplified shapes. No wear, grime, tyre marks, patched slabs or faded paint. No daylight realism, sun patches or depth of field on wide shots. No people. No signs, text, brands or numbers. Blue trails and amber tints are flat graphic marks. Nothing in it suggests a real or named site.

Colour script as v4 (floor #f6f4ef, machines #e4e2dc, shadow #c9c7c1, hardware #3a3d42, located blue #66a5fa, waiting amber #f0a43a). Fixed counts: three trolleys wait in the inspection queue and one pallet waits in the staging lane. Higgsfield credits: zero.

---

### Screen 0. Nav

**Purpose.** Let any buyer leave for their own answer in one click. Carry the only "Book a call" until act three.
**Copy.** Exact, in section 4.
**Seconds.** 0.
**Claim sources.** Labels only. Changed: V100 and V101 lines.

---

### Screen 1. Hero

Unchanged from v4 (V1 to V8 PASS).

> # Where work is. Where it waits.
>
> AmIMotion is spatial intelligence for factories and warehouses. A small tag rides on each trolley, bin and tool. Anchors on your columns hear its signal. One live map shows where it went and how long it has waited. You find out from a screen, not a walk.

47 words. Film, alt text and delivery as v4.

---

### Screen 2. Find it

**Purpose.** Name the gap the buyer lives with. Then show one trolley found where it stopped.
**Buyer job.** "What does it do for me, on my shift?"

**Copy.**

> ## A scan tells you where it last passed. A tag tells you where it stopped.
>
> Between scans at each checkpoint, work moves and waits out of sight.
>
> Think of the last time someone went looking for a trolley. The walk. The calls to stores. The second walk.
>
> Look it up on AmIHub's live map instead. You see where it was last seen, and when. The tag sends a signal as it moves, so nobody scans it along the way. It goes on the trolley, not on the person pushing it.
>
> [Where is that trolley?](/use-cases/find-the-asset/)

70 words. Four commas in nine sentences. Longest sentence 15 words. The headline sets in two lines at 390 px.

**Picture.** A still of camera A, cropped closer than v4: the press line on the left, the racks on the right. Everything is pale except one trolley stopped behind the racks, on a blue floor tint. Its one blue trail runs from the press and ends exactly where the trolley stands. The end of the trail is the point the map last saw it. No UI, no screen, no phone, no numbers, no clock. A real AmIHub capture replaces it on the day one may be shown. Until then nothing that looks like AmIHub is drawn.

**Alt text.** "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped."
**Seconds.** 14.
**Lands for.** P2 (the scan gap, last seen as a place). P1 (the second walk). P4 (no scanning, the trolley not the person). P3 (last seen as one field). P8 ("last passed"). P10 (no person tagged).

**Claim sources.**

| Line | Source | Ruling |
|---|---|---|
| Headline | As v4 | V9 PASS |
| "Between scans at each checkpoint..." | [CW] | V10 PASS |
| "Think of the last time..." | A question | V11 PASS |
| "Look it up on AmIHub's live map instead." | [B5] | V12 PASS. V13 STOP applied: the phone clause is gone. |
| "You see where it was last seen, and when." | [CW] "last observed" | V14 PASS |
| "The tag sends a signal as it moves..." | [B2], [B3] | V15 PASS |
| "It goes on the trolley, not on the person pushing it." | [B3] asset tag | V16 PASS |
| Picture and alt text | Section 0 | V18, V19 PASS. The crop and the trail ending are art direction inside the same shared world. They show a place, not data. |

---

### Screen 3. See where work waits

**Purpose.** Show that waits are timed by zone, how a trolley's wait becomes a job's wait, and that the event leaves AmIHub for the plant's own systems. This is the WIP door.
**Buyer job.** "Where does my work wait, and can I trust the number?"

**Copy.**

> ## See where work waits.
>
> The map notes when each trolley or pallet enters a zone and when it leaves. You name the zones. You see how long each one has waited, while it is still waiting.
>
> Set rules for each zone. AmIHub streams zone events to any system you name. Supervisors see each wait live, during the shift, not at the next morning's review.
>
> Link a trolley to each job it carries, in AmIHub or from your own system. Nobody scans it along the way. Its wait becomes that job's wait.
>
> Why it waited is for your team to say.
>
> [How waits are timed](/learn/dwell-time/) · [Which job is on the trolley?](/learn/association/)

94 words. Seven commas in twelve sentences. Longest sentence 15 words.

**Picture.** Unchanged: the inspection station, one trolley in work on blue, three in the queue on amber, one pallet in the staging lane on amber.
**Seconds.** 15.
**Lands for.** P2 (events leave AmIHub, the per-job link, supervisors see it live). P3 (entry, exit, zones, open visits live, a link per job). P4 (supervisors, no scanning). P1 (the shift, not the review). P6 (link in AmIHub or from his system). P8 (events to any system: no lock-in). P10 (the wait, not the worker).

The next screen asks "Which trolleys have waited at inspection for more than an hour?" in plain words. That is the threshold P2 and P3 came for, asked live, with every word sourced.

**Claim sources.**

| Line | Source | Ruling |
|---|---|---|
| "The map notes when each trolley or pallet enters a zone and when it leaves." | [B5] | V21 PASS |
| "You name the zones." | [B5] "define zones" | V22 PASS |
| "You see how long each one has waited, while it is still waiting." | [B5] | V23 PASS |
| "Set rules for each zone." | [B5] "set rules" | V24 REWORD, applied exactly |
| "AmIHub streams zone events to any system you name." | [B5] day one | The line truth gave in V25's place, applied exactly |
| "Supervisors see each wait live, during the shift, not at the next morning's review." | [B5] live map and dwell queries. [B2] "in the same shift". Not [B6] (C18). | V26 PASS |
| "Link a trolley to each job it carries, in AmIHub or from your own system." | [B5] work orders as first-class objects, "assign tags". [B7] the same tools over REST and MQTT. | V27 PASS on AMBER, in its own ruled meaning: V27 says "once" means once per job, and this line says that. Names no method (Q5, [CW]). Claims no start or end record (V108). |
| "Nobody scans it along the way." | [B2], [B3] | V28 PASS |
| "Its wait becomes that job's wait." | K04 section 3, K03 NEVER | V29 PASS. Only through the link. |
| "Why it waited is for your team to say." | K04 section 3 | V30 PASS, same claim in new words |

---

### Screen 4. Ask your floor

**Purpose.** Show the floor answering a plain question, with people in charge.
**Buyer job.** "Is this ready for the AI my board keeps asking about, and is it safe?"

**Copy.**

> ## Ask your floor a question.
>
> **Which trolleys have waited at inspection for more than an hour?**
>
> Ask in plain words. An AI assistant answers from AmIHub's live map. Asking changes nothing. Any change, such as raising a work order in AmIHub, needs a person's approval.
>
> *(Set smaller, for IT and developers)*
> AmIHub has an MCP server built in. MCP is an open standard that lets AI assistants use other software. Any assistant that supports MCP can connect. We show it live on a call. The server is part of AmIHub, so it can run on a PC inside your plant. If the assistant runs inside your network too, nothing has to leave it. Each assistant gets its own access: read-only, or only the actions you allow. Every request it makes is logged.
>
> [Ask your floor](/use-cases/ask-your-plant/) · [Trust and data](/trust/)

Main block 31 words plus the 11-word question. IT block 81 words.

**Picture.** Unchanged: the floor pale, three trolleys amber. No answer card, no data.
**Seconds.** 12.

**Claim sources.** V34 to V47 PASS as v4, except: "Any change, such as raising a work order in AmIHub, needs a person's approval." is V38 REWORD, applied exactly.

---

### Screen 5. One system

**Purpose.** Show what is bought and why to trust it, by method.
**Buyer job.** "What is it made of, will it work in my plant, will IT allow it?"

**Copy.**

> ## Three parts work as one system.
>
> **AmIGo tag.** Screws or sticks onto the trolley. Sends a short UWB radio pulse when it moves and sleeps when it stops. While it sleeps, the map shows where it was last seen. One battery lasts 1 to 3 years, depending on use. AmIHub shows each battery's level.
>
> **AmIMo anchor.** Fixed to a column or wall 3 to 8 m up. Records when each pulse arrives and the angle it came from. Needs only power, from DC or PoE. It syncs over the air and sends its data to AmIHub over Wi-Fi. No separate data or sync cabling. The specifications also list an Ethernet option. Each reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count. With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor. You set anchors up from a phone app. AmIHub finds each one on its own and raises an alert if one goes dark.
>
> **AmIHub.** Works out where each tag is from those times and angles. Runs on a PC inside your plant, with no internet needed. It connects to your MES, ERP and WMS through open REST, MQTT, WebSocket and omlox hub interfaces. Your team, your systems and AI assistants read the same live map. Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited.
>
> Built on the FiRa and omlox specifications.
>
> [How it locates a tag](/technology/) · [Specifications](/specs/) · [For developers](/developers/)

Tag block 49 words, anchor block 117, AmIHub block 72. Each buyer reads the headline and one block. The anchor block is P5's whole job on the page and P12's survey sheet. Longest sentence 15 words.

**Pictures.** As v4. AmIGo on a trolley, screwed through its own ears: the picture answers "how is it held on" without a claim. AmIMo on a column by its own tab, RJ45 port down, one DC cable. AmIHub as a real capture once one may be shown, until then the hero poster crop, whose alt text never calls it AmIHub (V74).
**Seconds.** 17.
**Lands for.** P5 (method, backhaul and its Ethernet option, radius, survey, accuracy, setup, the dark-anchor alert, one label for /technology/). P12 (survey, phone commissioning, interfaces). P6, P7 (what AmIHub adds beside the MES, on-premise only). P4 (screws on, battery). P9 (battery level). P8 (one map).

**Claim sources.** Rows not listed are V48 to V74 PASS as v4.

| Line | Source | Ruling |
|---|---|---|
| "Sends a short UWB radio pulse when it moves and sleeps when it stops." | [B2] step 1, [B3] | V50 PASS. "Radio" names what UWB is and adds no claim. |
| "Records when each pulse arrives and the angle it came from." | [B2] step 2 "records arrival time ... and, with 3D AoA, the direction it came from". [B4]. | V55 PASS on AMBER, now closer to the source verb. No mode, no precision. X12 and C15 stay logged. |
| "The specifications also list an Ethernet option." | truth-check-v4.md V57: "The Ethernet option stays on /specs/." | Says only where the option is listed. No figure, no use rule, no buffering claim. Release check: the Release Judge confirms the /specs/ row against [B4] before build. If it is not there, this sentence is cut and the Specifications link stays. |
| "Your MES stays in charge of every job." | K04 section 3, [FR] | V69 PASS. X7 open. |
| "AmIHub adds where its trolley is and how long it has waited." | [B5] live map and dwell. K04 section 3 (location never owns the job). | Says what AmIHub adds. Names no job key and no sync. |
| Links | Labels | "How it locates a tag" replaces "Anchors, steel and outages", so /technology/ has one label everywhere. |

---

### Screen 6. Start with one bay

**Purpose.** Make the first step small, bounded and useful before any call.
**Buyer job.** "What do I do next, what do I buy, what does trying cost me, and what happens after?"

**Copy.**

> ## Start with one bay.
>
> A pilot follows one flow in one bay or line. You choose the flow. The pilot times today's waits first, over a window you choose. That is your baseline. Before it starts, we agree how to count a wait that runs past shift end.
>
> The pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy.
>
> You see your own waits in one bay, and prove the numbers, before you decide on more. Then grow plant-wide on the same AmIHub, without re-fitting the first bay. A second plant gets its own survey, and AmIHub can run both from one console. Ask us how the two connect.
>
> [People and privacy](/trust/people/) · [Measure before you claim](/learn/pilot-baseline/)
>
> **What you buy.** AmIGo tags, AmIMo anchors and AmIHub, plus our survey and an anchor plan for your floor. Designed and built in India, with local stock and local engineers on your site. One contract and one support line cover every layer. Your team or your integrator can build on it at any layer, through open interfaces. Prices and pilot options are shared under NDA, after the first call. AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.
>
> ### Plan your first bay.
> Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you.
> [Button, secondary: Plan your first bay]
>
> ### See it on real data.
> The call is a live demo on real AmIHub data, not slides.
> [Button, primary: Book a call]

About 225 words in four blocks plus the two calls. Each reader reads the headline and one block: the pilot (P1, P2, P3), people (P4, P10), what comes after (P8, P9, P11), or what you buy (P9, P11, P12). The pilot block is 41 words. Longest sentence 15 words.

**Picture.** Unchanged: the hall pale, one inspection bay in colour with two anchors, the diagnostic opening over it.
**Seconds.** 14.

**Claim sources.** Rows not listed are V75 to V97 PASS as v4.

| Line | Source | Ruling |
|---|---|---|
| "Before it starts, we agree how to count a wait that runs past shift end." | [B8] "a scoped pilot". [CW] "treatment of ... unfinished visits". | V80 PASS on AMBER, same scoping step in shorter words. States no default rule. |
| "Tagging people would be a separate project. It would need its own policy." | [CW] separate scopes | V82 PASS on AMBER. V83 STOP applied: the line truth gave in its place. |
| "A second plant gets its own survey, and AmIHub can run both from one console." | [B5] indicative, [B4], [CW] | V86 REWORD, applied exactly |
| "Ask us how the two connect." | None needed | Makes no claim. It promises no answer on the page or on the call, and links to nothing (V110). |
| "AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO." | [EFY], [D2], K03 AMBER, C22 | V95 REWORD, applied exactly. Placed in "What you buy", away from the call block, so it cannot read as who joins a call. No photo, years or employers. |
| "The call is a live demo on real AmIHub data, not slides." | [B7], [FR] | V94 PASS |

Still cut by binding STOP: "Each stage has a check before the next, and you can stop at any of them." (B46). "Runs in automotive, robotics and warehousing plants." (A46, C34). "...and the consent of the people tagged." (V83).

---

### Screen 7. Footer

**Purpose.** Send each buyer to the one page for their next question.
**Copy.** Exact, in section 4.
**Seconds.** 3.
**Claim sources.** V112 to V121 PASS as v4.

### Buyer coverage check

| Buyer | Screens that land | Footer page |
|---|---|---|
| P1 Plant head | 1, 2, 3, 4, 6 | How a pilot runs |
| P2 Production or PPC | 1, 2, 3, 4 | Work in progress · Which job is on the trolley? |
| P3 IE or CI lead | 2, 3, 5, 6 | How waits are timed |
| P4 Supervisor | 1, 2, 3, 5 | Where is that trolley? |
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

Unchanged (V98 PASS). Plain HTML links, panels open on click or tap, work with JavaScript off.

### Under each

One label per URL, the same in the bar, phone sheet, footer, breadcrumbs, in-page links, llms.txt and BreadcrumbList JSON-LD. Changed rows are marked (v5).

| Section (hub) | Label | URL | Line under the label |
|---|---|---|---|
| **How it works** (/platform/) | AmIGo tag | /products/amigo/ | Rides on what moves |
| | AmIMo anchor | /products/amimo/ | Hears every tag |
| | AmIHub | /products/amihub/ | One live map |
| | Ask your floor | /use-cases/ask-your-plant/ | AI assistants and MCP |
| | How it locates a tag | /technology/ | Steel, racking, signal and outages |
| | When a tag goes quiet | /learn/location-data-quality/ | Last seen, sleep and gaps |
| | Specifications | /specs/ | Every figure and its condition |
| | Trust and data | /trust/ | Where your data lives |
| | For developers | /developers/ | API and MCP docs |
| **Where it helps** (/solutions/) | Work in progress | /solutions/wip/ | See where work waits |
| | Where is that trolley? | /use-cases/find-the-asset/ | Find it from a screen |
| | How waits are timed | /learn/dwell-time/ | Zones, rules, entries and exits (v5, V100) |
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
| | People and privacy | /trust/people/ | What a pilot tags, and why (v5, V101) |
| | Questions | /faq/ | Short answers |
| | Glossary | /glossary/ | Floor words and tech words |
| | Book a call | /contact/ | Talk to the team |

Each panel ends with one line: "Not sure where to start? Plan your first bay."

### Build notes (v5)

All build notes now follow truth-check-v4.md.

- **/technology/.** An outages section from [B4] and [B5]: anchors set up from a phone app, found by AmIHub on their own, an alert when one goes dark, over-the-air sync, Wi-Fi backhaul, and a pointer to the Ethernet option on /specs/. It gives no recovery figure (V106). It makes no claim about what happens to positions while Wi-Fi or power is down.
- **/specs/.** The anchor's network options as the founders' spec gives them, including the Ethernet option (V57). Every figure with its condition.
- **/learn/dwell-time/.** Shows how zone events stream to a named system ([B5]), and covers the zone boundary case or says it is open (V107).
- **/learn/association/.** Shows assigning a tag to a work order in AmIHub and over the API ([B5], [B7]). It says why a link needs a start and an end ([CW]), without claiming AmIHub records them (V108).
- **/learn/pilot-baseline/.** Says the baseline window should start after the floor stops noticing the tags (V109).
- **/trust/.** Lists the security lines in [B5] and [B7] (TLS, role-based access, API keys, audit trail, per-assistant scope, logged calls) (V110). Nothing on support access or on how a console reaches a second site.
- **/trust/people/.** Carries the same three lines as screen 6 and nothing stronger. No consent policy (V83, X17).
- **/use-cases/find-the-asset/.** Same picture rule as screen 2: a real capture or the camera A still. No drawn UI.
- **/company/.** The same two names and titles in V95's form until photos and bios are approved (V111).
- **/films/.** Held at release until no film carries or needs a "Simulation" stamp (V103).

All other v4 build notes stand.

### Phone

Unchanged from v4.

### For search engines and AI assistants

Unchanged from v4. The meta description and schema description repeat the hero's first two sentences.

### The footer, exact

> ## Start from your job.
>
> Plant heads: [How a pilot runs](/pilot/)
> Production and planning: [Work in progress](/solutions/wip/) · [Which job is on the trolley?](/learn/association/)
> Shift supervisors: [Where is that trolley?](/use-cases/find-the-asset/)
> Lean and IE leads: [How waits are timed](/learn/dwell-time/)
> Maintenance and OT: [How it locates a tag](/technology/)
> MES and ERP owners: [Which job is on the trolley?](/learn/association/)
> IT and security: [Trust and data](/trust/)
> Group operations and digital: [How to buy](/how-to-buy/)
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

"Physical AI" appears once, here (charter, FR).

---

## 5. What is still unsourced

Shiv's ruling: the founders' documents are complete, and there are no questions to the founders. Each fact below is not in the founders' documents, or two of them disagree and truth took the safer side. The page ships the safe true line in each case. Nothing on the page waits on this list.

| # | Missing fact | Readers it caps | Safe line on the page now |
|---|---|---|---|
| 1 | A written commitment to named pilot checks, with the right to stop after any one ([CW] has checks as a proposal only; B46) | P1, P9 | "You see your own waits in one bay, and prove the numbers, before you decide on more." |
| 2 | Whether AmIHub tells a named person when a wait passes a zone limit, and who is told first (X15, Q6) | P2, P4 | "Set rules for each zone. AmIHub streams zone events to any system you name." |
| 3 | Whether a supervisor can open AmIHub's live map on a phone today. [B6] names mobile views only on the Analytics page, whose maturity is open (X14, C18). | P4, P2 | "Look it up on AmIHub's live map instead." |
| 4 | Clearance to show a real AmIHub screen (FR A4, [FB]) | P2, P4 | The camera A still with the trail ending where the trolley stopped |
| 5 | What AmIHub does by default with a wait still open at shift end | P3 | "Before it starts, we agree how to count a wait that runs past shift end." |
| 6 | What happens to positions when Wi-Fi or power drops, and how long anchors take to rejoin | P5 | "The specifications also list an Ethernet option." The dark-anchor alert. |
| 7 | How AmIHub's work orders tie to the MES job number | P6 | "AmIHub adds where its trolley is and how long it has waited." |
| 8 | How a second plant reaches one console, what support can reach, and what plant two reuses (X16) | P6, P7, P8 | V86 words, then "Ask us how the two connect." |
| 9 | Who installs, which parts renew each year, and who supplies the AmIHub PC | P9 | "plus our survey and an anchor plan for your floor", "local engineers on your site" |
| 10 | A consent policy for tagging people (X17) | P10 | "It would need its own policy." |
| 11 | Who commissions and supports when an integrator brings the client, and whether the interface docs are versioned | P12 | "Your team or your integrator can build on it at any layer, through open interfaces." |
| 12 | What the map shows when a tag falls off its trolley | P4 | The render shows the tag screwed through its own ears. |

---

## 6. Our honest prediction, reader by reader

Predictions, not results. The readers are SIMULATION.

v5 is truer than v4, and for three readers it will score lower. The truth stops took away the phone, the event on a passed limit and the consent clause. Those were the lines that moved P2, P4 and the EHS half of P10 in v4. We found true ways to meet part of each worry. We did not find a true way to meet all of it, and we do not write past the sources to try.

| Reader | v4 | v5 predicted | Why it moves | The exact missing fact that caps them below 10 |
|---|---|---|---|---|
| **P1 Plant head** | 8 | **8** | His re-read ("passes it") is gone. Consent is gone and the people block is shorter. The shift-end line reads once. He loses "on your phone", which he liked. | A written commitment to named pilot checks and a stop after the bay. [CW] has checks as a proposal only. No founders' document commits to them. B46 holds. |
| **P2 Production control** | 9 | **8** | He gains the per-job link and "call" in one meaning, and he loses the limit, the event on a passed limit and the phone. Screen 4's threshold question and the picture of last seen as a place give part back. | Whether AmIHub can tell a named person when a wait passes a zone limit. No founders' document states it (X15, Q6, [FB]). Second: clearance to show a real AmIHub screen with a last-seen time. No founders' document gives it (FR A4). |
| **P3 Industrial engineer** | 9 | **9** | His worst line is fixed: a link per job. Both re-reads are gone. The limit is now "rules", which he will read as less exact. | What AmIHub does by default with a wait still open at shift end. It is not in the founders' documents. |
| **P4 Supervisor** | 8 | **8** | Re-reads gone, "UWB radio pulse", the screwed-on tag in the picture. He loses the phone and the consent line he would read to his crew. | Whether a supervisor can open the live map on a phone today. The founders' documents name mobile views only on the Analytics page and leave their maturity open (X14). Second: who is told first when a wait runs long. It is not in the founders' documents (X15). |
| **P5 OT and maintenance** | 9 | **10** | All three of his asks are met: the method line parses, the Wi-Fi line has its fallback ("an Ethernet option" on /specs/), and /technology/ has one label everywhere. | None for the 10, if the Release Judge finds the Ethernet row on /specs/. If it is cut, he drops to 9, capped by what happens to positions when Wi-Fi or power drops and how long anchors take to rejoin. Neither is in the founders' documents. |
| **P6 and P7 MES, ERP and IT** | 9 | **9** | His re-read is fixed: AmIHub adds location and wait beside an MES that stays in charge. The phone's network question is gone with the phone. | How a second plant's AmIHub reaches the same console, and what the support line can reach inside the plant. Neither is in the founders' documents (X16, V110). He also asked for the MES job key, which is not in them either. |
| **P8 Group operations** | 9 | **9** | "Joins" is gone, and the page now says plainly to ask how plants connect. "Console" stays, because V86's words are binding. | How a second plant connects to one console, and whether plant two reuses plant one's zones and link method. Neither is in the founders' documents (X16; [B5] is indicative). |
| **P9 and P11 Finance and owner** | 9 | **9** | Both re-reads are gone. The promoter still finds two names before the button, now as the company's leaders, not the call's. | Who installs, which parts renew each year after the pilot, and who supplies the AmIHub PC. None is in the founders' documents. The model is investor-confidential. |
| **P10 and P12 EHS and integrator** | 9 | **8** | EHS keeps "a separate project" with "its own policy" and the People and privacy link beside it. Two of three re-reads are gone. EHS loses the consent clause, which was its best line. | For EHS: a consent policy for tagging people. No founders' document states one (X17; kit 09 marks it HYPOTHESIS). For the integrator: who commissions and supports when an integrator brings the client, and whether the interface docs are versioned. None is in the founders' documents. |

**What the committee owns.** v5 uses every fact the founders gave us and every ruling truth gave. On that we expect one 10 (P5), four 9s and four 8s. Shiv's bar is 10 from every buyer, and this page does not reach it on the sources we have. Each reader below 10 is capped by one named fact above, and each of those facts is missing from the founders' documents. We would rather ship that than a 10 the plant would catch out on its first call.

**Risks we carry into the retest.**
- The Ethernet sentence rests on V57's note. If the Release Judge does not find it on the founders' spec, it is cut and P5 drops to 9.
- "Ask us how the two connect." is a new kind of line for this page. If any reader reads it as a dodge, it is cut and the V86 sentence stands alone.
- "Set rules for each zone" is vaguer than "set a limit". P2 and P3 may read it twice. If they do, the fix is a link, not a claim: "How waits are timed" already sits under the block.
- Screen 3's picture still shows three amber trolleys with no alert. That is right, and it is what the page can truly show.
