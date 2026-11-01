# Reader panel, round 1, v4: Production Control Reader (P2)

SIMULATION. This is a modelled buyer built from the profile, not an interview.

How I read it: on my phone outside the PPC cabin at 10:20, between dispatch's first call and the line shortage call. A trolley of CNC housings left the cell at 9:40, and the last scan says washing. I read only the screens (section 3) and the nav and footer (section 4).

---

## 1. After the hero only

Say-back: "A tag goes on each trolley, bin and tool, boxes on the columns hear it, and one live map shows where it went and how long it has waited, so I find out from a screen instead of walking."

Is that right? Yes. Same hero as v3, same say-back, and it is still honest: it promises "where it went" and "how long it has waited", not "where it is right now" for a tag that is asleep behind a rack. The first sentence still gives me no noun I know. The second sentence still saves it.

## 2. Screen by screen

- **Nav.** Same four words and one button. "When a tag goes quiet: Last seen, sleep and gaps" is the page I would open after my trolley question. "Which job is on the trolley?" sits under Where it helps. Good. Did not know: nothing.
- **Hero.** Felt: "This is my morning." Read twice: "AmIMotion is spatial intelligence for factories and warehouses." (8 words), same as v3 and v2. Did not know: "spatial intelligence". Third round running. I have stopped expecting it to change, so I skip it now, and that is its own problem.
- **Screen 2, Find it.** Felt: this is my life in four short lines. "The walk. The calls to stores. The second walk." I have done that walk this week. "A scan tells you where it last passed" is better than v3: "last passed" is exactly my 10:17 scan, and it still does not knock my barcodes. "Between scans at each checkpoint, work moves and waits out of sight" is the gap, said once and plainly. "On a screen or on your phone" is new, and it matters: the PPC person and the supervisor are both on the floor, not at a desk. "Nobody scans it along the way" answers my scan question again. Read twice: nothing. Did not trust: the picture. The fallback ships: a pale floor, one blue trolley, no screen, no time. The words say "you see where it was last seen, and when", and the picture shows no "when". Nobody on this page finds anything yet. This is still my AirTag moment, and it is still missing.
- **Screen 3, See where work waits.** Felt: this is the screen I came for, and it moved a lot. "Set a limit for each zone" is finally there. "You see how long each one has waited, while it is still waiting" is still the line I would read out to my plant head. "Link each trolley to its job once... Nobody scans it along the way" kills my biggest fear from v3: it is not a scan at every op. "Its wait becomes the job's wait" through the link, not through the place. That is the association told straight.
  Read twice: "When a trolley passes it, AmIHub sends the event to the system you name." (14 words). First read, "passes it" sounded like the trolley passing the zone, because screen 2 just used "passed" for scans. Second read: it means passing the limit. Then: "the system you name". Which system? My MES? Something that sends a WhatsApp? My phone? It is honest, and I respect that it does not say "alert" if there is no alert. But in my head, a system receives it and still no person is told. The next line, "Supervisors see each wait live", is still a person who has to be looking at a map.
  Read twice: "Link each trolley to its job once, in AmIHub or from your own system." (14 words). Once per trolley, or once per trip? My trolleys carry a new job every trip. If it is once per trip, who does it at the cell, and how: typed, picked from a list, pushed from the MES? "From your own system" suggests the MES can push it, which would be zero data entry for my people. The page nearly says that and then stops.
  Did not trust: "Why it waited stays your team's call." For a second I read "call" as a phone call, because the page ends in "Book a call". I get it, and I agree with it, but it is the one line on the screen that sounds like a writer, not like the floor.
- **Screen 4, Ask your floor.** Felt: the question is still word for word mine. "Needs a supervisor's approval" names a role this time. That is what I asked for in v3. "Raising a work order in AmIHub" tells me it does not write into my MES behind my back. Still a pull: I have to think to ask. Read twice: nothing. IT block skipped, as planned. Did not know: "MCP". I do not need it.
- **Screen 5, One system.** I read the headline and the AmIGo block. "While it sleeps, the map shows where it was last seen" agrees with screen 2. "AmIHub shows each battery's level" is new and useful: a dead tag is a trolley that silently goes missing, and I would be blamed for it. "1 to 3 years, depending on use" is honest. Did not know: "UWB" (new in this block, unexplained; I let it pass), "PoE", "REST", "MQTT", "WebSocket", "omlox", "FiRa". Not my block.
- **Screen 6, Start with one bay.** Felt: relief, and it is shorter. "You choose the flow": CNC to washing to inspection. "The pilot times today's waits first... That is your baseline." Good: I can show my plant head our own waits before anyone claims a saving. Read twice: "Before it starts, we agree with you how a wait still open at shift end counts." (16 words). Shorter than v3, but "how a wait still open at shift end counts" still parses backwards on a phone. I got it on the second read. "Plan your first bay. Six questions..." is the thing I would do before lunch, today, without a call. "A live demo on real AmIHub data, not slides", with the founders' names, is what gets me to book. Still missing: "you can stop at any stage". My plant head will ask it first.
- **Footer.** "Production and planning: Work in progress · Which job is on the trolley?" My v3 flag is fixed. The company paragraph says the association straight: "the jobs you link to each carrier". Did not know: "Physical AI", "NXP Trimension UWB".

## 3. Where I would have stopped

I would not have stopped. Screen 2 and screen 3 carried me hard. I slowed on screen 3 at "the system you name" and thought, "so who actually gets told?". That slowed me, but I kept going, because the link line right after it answered my other fear. I would have gone to screen 6 and tapped "Plan your first bay".

## 4. The question I still have

"When three trolleys sit at inspection past their limit, which person gets told, on which phone? Can AmIHub send it to a named person, or only to another system that I have to set up? And is the job linked once per trip at the cell, or does the MES push it so my people touch nothing?"

The question is half the size of v3's. The first half is still open.

## 5. Score

**9 / 10.** It finds my trolley honestly ("last passed", "last seen, and when", "on your phone"). It times waits against a limit I set, while they are still waiting. It sends the event out of AmIHub, and it links the job once with no scans along the way. It is not a 10 for two reasons. The wait goes to "a system", not to a named person, so my ick still applies: the system notices, and the page does not show who acts. And the find moment has no picture: no screen, no time.

The pass test: can I say "it finds my trolleys and tells me what is waiting before it is late"? I can say "it finds my trolleys, times every wait against my limit, and sends it to our system before it is late". That is close. "Tells me" is still not earned in so many words. Four lines read twice: the hero's first line (8 words), the event line (14), the link line (14) and the shift-end line (16).

My one-line WhatsApp: "Sir, see this, trolleys found on phone with last-seen time, waits timed per job against our limits, no scanning, pilot on one bay, MES untouched. Worth a call?" One line. He will reply, "Ask them who gets the alert."

---

## 6. Compared with v3 for me (v3: 8/10)

Better. My two big v3 flags have moved: the link is now "once, nobody scans it along the way", and a limit now sends an event out of AmIHub instead of "your supervisor can see it". The footer also gives me the association page, and the phone is named.
Not a 10, because the event lands in "the system you name", not with a named person, and the find picture still has no screen and no time.

## 7. Best and worst lines

- **Best:** "Link each trolley to its job once, in AmIHub or from your own system. Nobody scans it along the way." (Screen 3). It answers "do I have to scan anything?" for PPC and supervisors in two short sentences. Close second: "The walk. The calls to stores. The second walk." (Screen 2).
- **Worst:** "When a trolley passes it, AmIHub sends the event to the system you name." (Screen 3). It sits exactly where the owner should be. "Passes it" is ambiguous after screen 2's "last passed", and "the system you name" names no person. Runner-up: "Before it starts, we agree with you how a wait still open at shift end counts." (Screen 6).

## 8. One change that would make it a 10 for me

On screen 3, finish the flow with a person, in one line, and show it. Replace the event line with something like: "Set a limit for each zone. When a wait passes it, AmIHub sends it to the person or system you name: Last seen at Inspection, 10:42. Waiting 52 min, limit 30." If AmIHub cannot reach a person directly today, say who can: "Your MES or your messaging tool tells the supervisor." Then show that one event as a real AmIHub capture on a phone, not the fallback still. That gives me the owner, the response and the AirTag moment in one screen, and I forward it before lunch.

### Flags for the makers (production-control reasons)
- Owner: a limit now produces an event (fixed from v3), but it goes to "the system you name". No named person is shown being told. That is the system noticing and nobody shown acting.
- "Passes it" after screen 2's "last passed": the reader reads "passes the zone" first. Say "passes the limit" or "waits past it".
- Association: PASS on wording. Job only through the link, "once", no scans along the way. Open: once per trip or once per trolley, and whether the MES can push it.
- Stale data: hero, screen 2 and screen 5 agree ("where it went", "last passed", "where it was last seen, and when"). PASS. The fallback picture shows no "when".
- Barcodes and RFID are never said to fail. Carriers, not "every part". PASS.
- Footer: production and planning now gets "Which job is on the trolley?". Fixed.
- "Your team's call": reads as a phone call to some readers on a page that ends in "Book a call".
- "UWB" is new in the AmIGo block and is not explained.
- "You can stop at any stage" is still absent from screen 6 (I know it is held by a binding STOP; my plant head will still ask).
- Lines read twice: hero line 1 (8 words), screen 3 event line (14), screen 3 link line (14), screen 6 shift-end line (16).
