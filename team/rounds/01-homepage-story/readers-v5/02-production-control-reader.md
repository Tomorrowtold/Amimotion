# Reader panel, round 1, v5: Production Control Reader (P2)

SIMULATION. This is a modelled buyer built from the profile, not an interview.

How I read it: on my phone outside the PPC cabin at 10:20, between dispatch's first call and the call about a shortage at the line. A trolley of CNC housings left the cell at 9:40. The last scan says washing, and nobody has seen it there. I read only the screens (section 3) and the nav and footer (section 4).

---

## 1. After the hero only

Say-back: "A tag goes on each trolley, bin and tool, anchors on the columns hear it, and one live map shows where it went and how long it has waited, so I find out from a screen, not by walking."

Is that right? Yes. The hero is the same as v4, so my say-back is the same, and it is still honest. It promises "where it went" and "how long it has waited", not "where it is right now" for a tag asleep behind a rack. The first sentence still gives me no noun I use. The second sentence still saves it. This is the fourth round I have said that.

## 2. Screen by screen

- **Nav.** Same four words and one button. "How waits are timed: Zones, rules, entries and exits" is clearer than before. "When a tag goes quiet: Last seen, sleep and gaps" is still the page I would open second. Did not know: nothing.
- **Hero.** Felt: "This is my morning." Read twice: "AmIMotion is spatial intelligence for factories and warehouses." (8 words). Did not know: "spatial intelligence". I skip it now without thinking, and a first line I skip is a line that does no work.
- **Screen 2, Find it.** Felt: still my life. "The walk. The calls to stores. The second walk." I did that walk on Tuesday. "A scan tells you where it last passed" is my 10:17 scan exactly, and it does not knock my barcodes. "You see where it was last seen, and when" is the honest stale-data line. "It goes on the trolley, not on the person pushing it" is new and good: my supervisors will ask that before I do. Read twice: nothing. Lost: "on a screen or on your phone" is gone. I am on the floor, not at a desk, so I noticed. "Look it up on AmIHub's live map instead" now sounds like a desk job. Did not trust: the picture, again. A pale floor, one blue trolley, a trail. The words say "and when", and the picture shows no when. Nobody on this page finds anything. My AirTag moment is still missing for the third round.
- **Screen 3, See where work waits.** Felt: this is still the screen I came for, and it got better in one half and weaker in the other.
  Better: "Link a trolley to each job it carries, in AmIHub or from your own system. Nobody scans it along the way. Its wait becomes that job's wait." This answers my v4 question. It is per job, not per trolley for life, and "from your own system" tells me the MES can feed it so my people touch nothing. That is the association said straight: the job's wait comes through the link, not through the place. "Why it waited is for your team to say" fixes the "call" problem. I read it once.
  Weaker: "Set rules for each zone. AmIHub streams zone events to any system you name." (14 words). Read twice. In v4 it said "a limit", and a limit is a word I use: thirty minutes at washing, then someone moves. "Rules" could mean anything. And "streams zone events" sounds like every entry and every exit, all day, sent somewhere. That is a data feed, not an alert. Who reads the stream? My ick is still there, and it is louder: the system notices, the data goes to "any system", and no person is shown acting. "Supervisors see each wait live" is still a person who has to be looking at the map.
- **Screen 4, Ask your floor.** Felt: the question is still word for word mine, "more than an hour" at inspection. That is the limit screen 3 dropped, and it is here as a question I have to remember to ask. That is a pull, not a push. "Needs a person's approval" is vaguer than v4's "a supervisor's approval". I liked having a role named. Read twice: nothing. IT block skipped. Did not know: "MCP". I do not need to.
- **Screen 5, One system.** I read the headline and the AmIGo block. "A short UWB radio pulse": now at least I know UWB is a radio. "While it sleeps, the map shows where it was last seen" agrees with screen 2. "AmIHub shows each battery's level" still matters to me: a dead tag is a trolley that goes missing quietly, and I get blamed. I glanced at the AmIHub block for one line: "Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited." That is the line I would read to our MES person. It answers "is it another screen that fights my MES?" Did not know: "PoE", "REST", "MQTT", "WebSocket", "omlox", "FiRa". Not my block.
- **Screen 6, Start with one bay.** Felt: relief. "You choose the flow": CNC to washing to inspection. "The pilot times today's waits first... That is your baseline." I can show my plant head our own waits before anyone claims a saving. "Before it starts, we agree how to count a wait that runs past shift end." Fixed. I read it once this time. "Plan your first bay. Six questions..." is still what I would do before lunch. "A live demo on real AmIHub data, not slides" is what gets me to book. Still missing: anything showing who acts on a wait during the pilot. Did not know: nothing.
- **Footer.** "Production and planning: Work in progress · Which job is on the trolley?" Still right for me. The company paragraph says "the jobs you link to each carrier". Good. Did not know: "Physical AI", "NXP Trimension".

## 3. Where I would have stopped

I would not have stopped. Screen 2 and the link lines on screen 3 carried me. I slowed on "streams zone events to any system you name" and thought, "so it is a feed, and someone else has to build the alert". That is where a tired PPC person thinks "another integration project before it tells me anything". I kept going because of the next line about linking jobs, and I would still tap "Plan your first bay".

## 4. The question I still have

"When three trolleys sit at inspection past thirty minutes, who gets told, and on which phone? Does AmIHub tell a named person itself, or do I need IT to build that out of the event stream?"

The link question from v4 is answered. The owner question is the same, and the page now answers it a little less than before.

## 5. Score

**8 / 10.** It finds my trolley honestly ("last passed", "last seen, and when"). It links the job per job, from my own system, with no scans along the way, and the MES stays in charge. Those are real wins. But the one thing my job lives on, "tell me before it is late", got weaker. "A limit" became "rules", and "sends the event" became "streams zone events". The phone and the supervisor are also gone. The find moment still has no screen and no time.

Pass test: can I say "it finds my trolleys and tells me what is waiting before it is late"? I can say "it finds my trolleys and times every wait per job". I cannot say "tells me" from this page. Two lines read twice: hero line 1 (8 words) and the screen 3 rules line (14 words). That is fewer than v4's four.

My one-line WhatsApp: "Sir, see this: trolleys found with last-seen time, waits timed per job, no scanning, MES untouched, pilot on one bay. Worth a call?" One line. He will reply, "Ask them who gets the alert." Same reply as last round.

---

## 6. Compared with v4 for me (v4: 9/10)

Worse on the one thing I came for. The job link is now clear, and the shift-end and "team to say" lines are fixed, but losing "limit", "on your phone" and "a supervisor's approval" moves the page from a wait that reaches someone to a stream that reaches something.

## 7. Best and worst lines

- **Best:** "Link a trolley to each job it carries, in AmIHub or from your own system. Nobody scans it along the way. Its wait becomes that job's wait." (Screen 3). Three short sentences answer "which job is on it?", "do I scan?" and "how does a place become a job status?" Close second: "The walk. The calls to stores. The second walk." (Screen 2).
- **Worst:** "Set rules for each zone. AmIHub streams zone events to any system you name." (Screen 3). It sits exactly where the owner and the limit should be. It drops the limit I use, and it names a data feed, not a person.

## 8. One change that would make it a 10 for me

On screen 3, bring back the limit and end it with a person, in one line, then show it. For example: "Set a time limit for each zone. When a wait goes past it, AmIHub sends the alert to the person or system you name." If AmIHub cannot reach a person directly, say who does: "Your MES or messaging tool tells the supervisor." Then show that one alert as a real AmIHub capture on a phone: "Last seen at Inspection, 10:42. Waiting 52 min, limit 30." That gives me the owner, the response and my AirTag moment in one screen, and I forward it before lunch.

### Flags for the makers (production-control reasons)
- Owner: REGRESSION. v4 "Set a limit... sends the event" became v5 "Set rules... streams zone events to any system". There is no threshold word and no person. The system notices, and nobody is shown acting.
- "Streams zone events" reads as a raw feed of entries and exits, which means integration work before anyone is alerted. It is the "more work for us" signal.
- Threshold: the only limit on the page is now the screen 4 question ("more than an hour"). That makes it a pull the reader has to ask for, not a push.
- Association: PASS, and better. "Each job it carries" answers once per trip. "From your own system" answers the MES push. The wait goes to the job only through the link.
- Stale data: hero, screen 2 and screen 5 agree. PASS. The fallback picture still shows no "when".
- Phone: "on a screen or on your phone" was cut from screen 2. PPC and supervisors are on the floor. Put the phone back somewhere.
- Screen 4: "a person's approval" is vaguer than v4's "a supervisor's approval".
- Barcodes and RFID are never said to fail. Carriers, not "every part". PASS.
- Fixed from v4: "passes it" ambiguity (line rewritten), "your team's call", the shift-end line, and UWB now reads as a radio.
- Lines read twice: hero line 1 (8 words), screen 3 rules line (14 words).
