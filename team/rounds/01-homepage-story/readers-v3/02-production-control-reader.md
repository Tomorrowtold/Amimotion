# Reader panel, round 1, v3: Production Control Reader (P2)

SIMULATION. This is a modelled buyer from the profile, not an interview.

How I read it: on my phone outside the PPC cabin at 10:20, between dispatch's first call and the line shortage call. A trolley of CNC housings left the cell at 9:40 and the last scan says washing. I read only the screens (section 3) and the nav and footer (section 4).

---

## 1. After the hero only

Say-back: "A tag goes on each trolley, bin and tool, boxes on the columns hear it, and one live map shows where it went and how long it has waited, so I find out from a screen instead of walking."

Is that right? Yes, and it is more honest than last time. "Where it went and how long it has waited" does not promise me "where it is" for a trolley whose tag is asleep behind a rack. That was my flag in v2 and it is fixed. "How long it has waited" in the hero is new and it is the half I care about most, so the hero now speaks to PPC, not only to the supervisor hunting a trolley. One small thing: "where it went" sounds like history. I want to know where it is now, or where it was last seen. Screen 2 answers that, so I let it go.

## 2. Screen by screen

- **Nav.** Same four words and one button. Under "Where it helps" I see "Which job is on the trolley? Linking trolleys to jobs". That line under it is better than v2. I would open it. Did not know: nothing.
- **Hero.** Felt: "This is my morning," same as v2. The before film, ticks at the desks, nothing between, the trolley that turns behind the racks and gets no mark, is still my 10:17 scan and my 10:18 trolley. Read twice: "AmIMotion is spatial intelligence for factories and warehouses." (8 words). Still no noun I know. The next sentence rescues it at once, so I lose two seconds, not the reader. Did not know: "spatial intelligence". Did not trust: nothing this time.
- **Screen 2, Find it.** Felt: yes. "A scan tells you where it passed. A tag tells you where it stopped." This is the fix I asked for. It does not knock my barcodes, and "where it stopped" is true for a parked trolley. "You see where it was last seen, and when." That is my stale-data line, now on the screen I actually read. "So nobody scans it along the way" answers "do I have to scan anything?" and "it goes on the trolley, not on the person pushing it" saves me a talk with the supervisors. Read twice: nothing. Did not trust: the picture, same as v2. If the real AmIHub capture ships with one named trolley and a last-seen time, this is my AirTag moment. If the fallback ships (pale floor, one blue trolley, no screen), nobody on this page finds anything.
- **Screen 3, See where work waits.** Felt: this is now mostly my screen. "You see how long each one has waited, while it is still waiting" is still the best line on the page for me. "Link each trolley to its job, and its wait becomes the job's wait" is the association story told straight, on the right screen, in one breath. That is what file 03 wants and it is what I want: the job comes from the link, not from the place. Then two lines let me down. Read twice: "Your supervisor can see it during the shift, not at the next morning's review." (13 words). Can see it if he is looking at the map. He is not looking at the map. He is at the line with a shortage. Nobody is told. It names a person this time, which is better than v2's "shows you where to look", but it is still a person who has to go and look. Read twice: "We agree with you how to link them before the pilot." (11 words). So the "how" is still not on the page. Once at the cell? At every op? A scan? Typed? From the MES? I read this as "we have not decided" or "it will be a scan". Did not trust: "agree with you how", because it sounds like the answer is more data entry for my people and nobody wants to say it.
- **Screen 4, Ask your floor.** Felt: the question is word for word mine. "Asking changes nothing" is plain and good. Read twice: "Any change, such as raising a work order, needs a person to approve it." (14 words). Better than v2's "A person approves any action", because I now know what a change is. Still: which person? Me? Maintenance? And I still have to ask. I want it to tell me before I think to ask. The IT block I skipped, as they planned. Did not know: "MCP". I do not need it.
- **Screen 5, One system.** Felt: I read the headline and the AmIGo block. "While it sleeps, the map shows where it was last seen" agrees with screen 2 now, so the page no longer argues with itself. My job line is no longer buried here; it moved to screen 3. Good. "Your MES stays in charge of every job" is right and my MES owner will like it. Did not know: "PoE", "REST", "MQTT", "WebSocket", "omlox", "FiRa". Not my block, I did not mind.
- **Screen 6, Start with one bay.** Felt: relief, again. "You choose the flow": CNC to washing to inspection. "The first waits it times are today's, so you can use them as your baseline" is useful: I can show my plant head real waits, not a vendor slide. Read twice: "Before it starts, we agree with you how each wait counts, even one still open at shift end." (18 words). I got there on the second read, and I like that someone thought about the open wait at shift end, but it is long for a phone. "The pilot tags trolleys, bins and pallets, not people" is good. Still missing: "you can stop at any stage". My plant head will ask. "One AmIHub console can also run more than one site" is not for me.
- **Footer.** "Production and planning: Work in progress." Fine. "Which job is on the trolley?" still goes only to "MES and ERP owners". It is my question first. The entity paragraph still says the association straight: "the jobs you link to each carrier". Did not know: "Physical AI", "NXP Trimension UWB".

## 3. Where I would have stopped

I would not have stopped. Screen 2 and the first half of screen 3 carried me hard. I slowed at "We agree with you how to link them" and thought "here comes the scanning". I kept going to screen 6 to see what the pilot asks of my people, and it answered that. Screen 5 I read one block only.

## 4. The question I still have

"When three trolleys sit at inspection past an hour, who gets told, on which phone, without anyone looking at the map? And how is the job card linked to the trolley: once at the cell, by whom, and is it one more scan?"

Same two questions as v2. They are smaller now, because the page admits both exist, but neither is answered.

## 5. Score

**8 / 10.** It finds my trolley honestly ("where it stopped", "last seen, and when"), it shows what is waiting while it waits, and it says the wait becomes the job's wait only through a link. It still does not tell anyone, and it still does not say how the link is made.

The pass test: can I say "it finds my trolleys and tells me what is waiting before it is late"? I can say "it finds my trolleys and shows my supervisor what is waiting, during the shift". "Tells" is still not earned. Four lines read twice, one of them the hero's first.

My one-line WhatsApp: "Sir, see this, trolley found on a map with last-seen time, waits timed per job while still waiting, pilot on one bay, MES untouched. Worth a call?" One line. He will reply "ask them who gets the alert and who links the job", same as last time.

---

## 6. Compared with v2 for me (v2: 7/10)

Better. Three of my five flags are fixed: the hero and screen 2 no longer say "where it is" for a sleeping tag, the job link is now on screen 3 where I read it, and "shows you where to look" is gone and a supervisor is named.
Not a 10, because the named person still only "can see it", nobody is told, and "we agree how to link them" pushes the scanning question to the call instead of answering it.

## 7. Best and worst lines

- **Best:** "Link each trolley to its job, and its wait becomes the job's wait." (Screen 3). Close second: "A scan tells you where it passed. A tag tells you where it stopped." (Screen 2).
- **Worst:** "Your supervisor can see it during the shift, not at the next morning's review." (Screen 3). It sits exactly where the alert should be, and "can see" means someone still has to watch a screen. Runner-up: "We agree with you how to link them before the pilot." (Screen 3), because it hides the answer to "do I have to scan anything?"

## 8. One change that would make it a 10 for me

On screen 3, replace the supervisor line and the "we agree" line with the two steps that are missing, plainly, and show the first one as a real AmIHub capture:
1. **The wait reaches a named person.** "Set a limit for each zone. When a trolley passes it, the person you name is told: Last seen at Inspection, 10:42. Waiting 52 min, limit 30." If AmIHub cannot push that today, say so plainly, and say who looks and how often. Honest is still better than "can see it".
2. **The link, in one sentence.** "Link the job card to the trolley once, when it leaves the cell. After that, nobody scans it again." Or whatever is true today, said in one line, even if the true answer is "one scan at the cell".

Then I can say "it finds my trolleys and tells the right person what is waiting before it is late", and I would forward it before lunch.

### Flags for the makers (production-control reasons)
- No limit, no alert, no owner who is told. Screen 3 ("can see it") and screen 4 ("a person to approve it") both stop before a named person acts on a wait.
- Association: now on screen 3 and honest (job only through the link). PASS on wording. The "how" is still missing, and "we agree with you how" will read as "more data entry" to PPC and supervisors.
- Stale data: hero, screen 2 and screen 5 now agree ("where it went", "where it stopped", "last seen, and when"). PASS.
- Screen 2 fallback: if it ships without the real capture, the page still has no finding moment.
- Footer: offer "Which job is on the trolley?" to production and planning too, not only MES owners.
- Barcodes and RFID never said to fail. "Everything you tag", not "every part". PASS.
- Lines read twice: hero line 1 (8 words), screen 3 supervisor line (13), screen 3 "we agree" line (11), screen 4 change line (14), screen 6 shift-end line (18).
