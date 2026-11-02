# Reader panel, homepage v5: P5 OT and Maintenance Reader

SIMULATION. This is a simulated buyer reading, built on a hypothesis profile (kit 09 section 6). No interviews yet.

Same phone, same crane bay. Last round I sent back three things: the Wi-Fi backhaul line with no fallback, the "times... the angle" grammar, and two labels for /technology/. I checked those first, then read the page cold.

---

## 1. After the hero only

**Said back:** "A small tag goes on each trolley, bin and tool, anchors on my columns pick up its signal, and one live map shows where each thing went and how long it has sat there, so nobody walks the floor looking for it."

**Is that right?** Yes. Unchanged, and still right. "Anchors on your columns" tells me in the first screen that hardware goes on my steel, which is the honest thing to say to someone like me. "Spatial intelligence" still does nothing for me. The next sentence does the work.

## 2. Screen by screen

- **Nav.** "How it locates a tag: Steel, racking, signal and outages." My door, in my words. Nothing read twice.
- **Screen 1, Hero.** Dark boxes on columns, no rings, no glow. Nothing read twice.
- **Screen 2, Find it.** "You see where it was last seen, and when." That's the honest version of a sleeping tag, and I'll be the one explaining sleep to the supervisors, so I like it. "The tag sends a signal as it moves, so nobody scans it along the way" agrees with screen 5. The phone clause is gone and I don't miss it. Nothing read twice.
- **Screen 3, See where work waits.** Not my screen, but two lines land on me. "AmIHub streams zone events to any system you name." "Any system" makes me wince a little: I'm the one who has to keep that stream alive, and the line still doesn't hint at what happens when an event fires twice or the receiver is down. "Set rules for each zone" is vaguer than v4's "Set a limit for each zone". A limit I understood. "Rules" could mean anything. The zone-boundary case (a trolley parked across the line) is still not named. A homepage doesn't have to, as long as /learn/dwell-time/ does. Nothing read twice.
- **Screen 4, Ask your floor.** Skimmed. "Asking changes nothing" and "needs a person's approval" are what I want if an AI is anywhere near my line. "It can run on a PC inside your plant" and "Every request it makes is logged" are fine. Nothing read twice.
- **Screen 5, One system.** My screen. Better than v4, and not finished.
  - AmIGo: "Sends a short UWB radio pulse when it moves and sleeps when it stops." "While it sleeps, the map shows where it was last seen." That's the sleep behaviour stated, not hidden. "1 to 3 years, depending on use" plus battery level in AmIHub. Pass.
  - Method: "Records when each pulse arrives and the angle it came from." Fixed. One verb, two objects, and it parses: it records the arrival time and the angle. Read once. Pass.
  - Power: "Needs only power, from DC or PoE." "No separate data or sync cabling." Pass.
  - Backhaul: "It syncs over the air and sends its data to AmIHub over Wi-Fi. No separate data or sync cabling. The specifications also list an Ethernet option." This is the line I asked for, and I got half of it. Now I know an Ethernet option exists, so in my crane bay I'm not stuck on Wi-Fi. But I **read it twice** with the line before it: "No separate data or sync cabling" and then "an Ethernet option". Ethernet is data cabling. The two don't contradict, but I had to stop and work out that the first is the default and the second is the alternative. And "the specifications also list" sounds like the page is pointing at a document instead of telling me what it does. Is the Ethernet the same RJ45 that takes PoE? Is it for backhaul only, or sync too? I'll find out on /specs/, but the sentence reads like a lawyer wrote it, not an engineer.
  - Still missing from the page: what happens to positions while Wi-Fi or power is down. Buffered on the anchor, or lost? The page doesn't promise either way, which is honest. But it's still a gap.
  - Coverage: "Each reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count." Still the best coverage line I've read on a vendor homepage. Pass.
  - Accuracy: "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor." Pass.
  - Setup and health: "You set anchors up from a phone app. AmIHub finds each one on its own and raises an alert if one goes dark." Detection, yes. Recovery, no. It stays on the right side of "plug and play" because the survey sentence sits just before it.
  - AmIHub: "Runs on a PC inside your plant, with no internet needed." Good for me: no cloud dependency when the uplink drops. "Your MES stays in charge of every job" is not my line, but it stops an argument I'd otherwise have to referee.
  - Link: "How it locates a tag", same as the nav and footer. Fixed. I preferred "Anchors, steel and outages" as words, but one label for one page is right, and the nav line under it still says "outages".
  - Didn't trust: "Built on the FiRa and omlox specifications." I still can't tell whether that means certified, compliant, or inspired by.
  - Density: 117 words in the anchor block. I read every word because it's my job. Nobody else on the panel will, and that's fine, because it's mine.
- **Screen 6, Start with one bay.** "Before it starts, we agree how to count a wait that runs past shift end." Fixed. Read once. "plus our survey and an anchor plan for your floor" stays good. "local stock and local engineers on your site" is the closest thing to my spares question. Local stock tells me a dead anchor isn't shipped from abroad. Still no response time. "Then grow plant-wide on the same AmIHub, without re-fitting the first bay" means I don't drill the same columns twice. Good. "A second plant gets its own survey, and AmIHub can run both from one console. Ask us how the two connect." The first half is honest. "Ask us how the two connect" reads like a dodge to me, because the link between two sites is my network and IT's firewall. I'd rather it said nothing than say "ask us". There's still no technical gate in the pilot: nothing that says the pilot checks the hard cases (a tag behind a load, a trolley at a zone edge, an anchor that loses power) on purpose. The leaders' names don't matter to me. "Not slides" on the call does.
- **Footer.** "Maintenance and OT: How it locates a tag." My row. "Designed and built in India on NXP Trimension UWB silicon" tells me what the radio is, which I respect. I still don't like "Specifications are indicative. Final datasheets are shared under NDA." A datasheet behind an NDA makes me think the footnotes are bad. Skipped "Physical AI".

**Words I didn't know or didn't trust:** spatial intelligence, "built on" (specifications), "any system you name", "rules" (for a zone), "also list" (an Ethernet option), "Ask us how the two connect", indicative, Physical AI.

## 3. Where I'd stop scrolling

I wouldn't stop. I'd slow right down on screen 5, and after the Ethernet line I'd tap "Specifications" before I finished the page, to see whether the Ethernet option is real backhaul on the same port. If /specs/ shows it, and /technology/ says what happens in an outage, they keep me.

## 4. My question at the end

"When the Wi-Fi drops under a crane, or the power cuts, what happens to the positions in that gap? Are they buffered on the anchor or lost? How long until anchors rejoin and re-sync by themselves? Is the Ethernet option on the same RJ45 as PoE, so one cable does power and data in a bad bay?" Then, still: who swaps a failed anchor, and how fast?

## 5. Score

**9/10.** In 90 seconds I can tell my plant head how it locates a tag: a UWB pulse, anchors record its arrival time and angle, AmIHub works out the position on a PC inside the plant. I can also say what the site needs: columns at 3 to 8 m, DC or PoE, about 50 m line of sight subject to racking and steel, Wi-Fi or Ethernet back to AmIHub, and a survey that sets the count. Every number carries its condition. I'd forward it and ask for a survey. Not a 10: the Ethernet option is stated as a pointer, not as what it does, and nothing on the page says what happens to positions in an outage.

---

## 6. Compared with version 4 (9/10)

**Better, same score.** The method line parses, the /technology/ label is one label, the shift-end line reads once, and the Wi-Fi line now has an Ethernet escape route.
But that escape route is worded as "the specifications also list", which tells me it exists without telling me what it's for, and outage behaviour is still only a link.

## 7. Best and worst lines

- **Best:** "Racking and steel change that, so we survey your floor and set the count." Still the line that makes me trust the rest of the screen. Steel sets the count, and the survey comes before any number.
- **Worst:** "The specifications also list an Ethernet option." It answers my v4 complaint in the weakest form it could, it sits right after "No separate data or sync cabling", and it made me read the pair twice.

## 8. One change that would make it a 10

Say what the Ethernet option does, in the anchor's voice, and give outages one sentence on the page:

> It syncs over the air and sends its data to AmIHub over Wi-Fi, or over Ethernet where Wi-Fi is weak. [What happens when Wi-Fi or power drops](/technology/)

Drop "No separate data or sync cabling" if Ethernet stays, because the two now fight. The "or over Ethernet" clause goes in only if the Release Judge finds the option on /specs/ in [B4]. If they can't, cut the Ethernet sentence entirely rather than keep "also list". And /technology/ must answer buffering and rejoin, or say plainly that the pilot measures them. Then I'd send it to my plant head without a note.

---

## Re-read log (sentences read twice, with word count)

| Screen | Sentence | Words | Why |
|---|---|---|---|
| 5 | "The specifications also list an Ethernet option." | 7 | Read back against "No separate data or sync cabling." just before it. Ethernet is data cabling, so I had to work out which is the default and which is the alternative. |

One re-read, down from two in v4. Both v4 re-reads are fixed ("Times each pulse... and the angle", "we agree with you how a wait still open at shift end counts").

## Spec audit, numbers and their conditions

| Number or claim | Condition on the page | Verdict |
|---|---|---|
| ±10 cm | "With these anchors... How close depends on your floor." | Pass |
| 3 to 8 m mounting | Column or wall | Pass |
| 1 to 3 years battery | "depending on use", plus battery level shown in AmIHub | Pass |
| Tag sleep | "While it sleeps, the map shows where it was last seen." | Pass (honest about sleep) |
| Power | "Needs only power, from DC or PoE" | Pass |
| Cabling | "No separate data or sync cabling" | Pass on its own, but now in tension with the Ethernet line |
| Backhaul | "over Wi-Fi", plus "The specifications also list an Ethernet option." | Partial: an alternative now exists on the page, but its use (backhaul? same port as PoE?) isn't stated, and there's no behaviour on loss |
| Sync | "over the air" | Pass as wording. Behaviour after an outage isn't stated. |
| Coverage, about 50 m | "in clear line of sight. Racking and steel change that, so we survey your floor and set the count." | Pass |
| Survey | Anchor block, plus "our survey and an anchor plan" in "What you buy" | Pass |
| Measurement method | "Records when each pulse arrives and the angle it came from." | Pass (grammar fixed) |
| Radio named (UWB) | Tag block, footer (NXP Trimension) | Pass |
| AmIHub location | "Runs on a PC inside your plant, with no internet needed." | Pass. Removes a cloud dependency from my outage list. |
| Anchor failure | "raises an alert if one goes dark" | Partial: detection only. Replacement: "local stock and local engineers", no response time. |
| Recovery after power or Wi-Fi loss | Link "How it locates a tag" and the nav line "...and outages" only | Partial: a door, no answer on the page |
| Commissioning | "set anchors up from a phone app", "finds each one on its own" | Pass. The survey line keeps it from reading as plug and play. |
| Hard cases: zone boundary, hidden tag, repeated event | Not named on the homepage. "streams zone events to any system you name" raises the repeated-event case. | Acceptable for a homepage, if /learn/dwell-time/ covers them |
| Technical gate in the pilot | Not present | Gap. The pilot tests waits, not the hard radio cases. |
| UWB, BLE and Wi-Fi FTM on the same anchors | Not mentioned | Neutral for a homepage |
| Label consistency | /technology/ is "How it locates a tag" everywhere | Pass (fixed from v4) |

Renders, as v4. The AmIGo is screwed through its own ears. The AmIMo is fixed by its own tab, RJ45 facing down, with one DC cable. Nothing invented. If the copy says Ethernet backhaul, the render can stay as it is: the RJ45 is already shown, and showing a cable in it would be a claim the source has to back.
