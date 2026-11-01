# Reader panel, homepage v3: P5 OT and Maintenance Reader

SIMULATION. This is a simulated buyer reading, built on a hypothesis profile (kit 09 section 6). No interviews yet.

I'm on my phone between two breakdown calls. One crane bay dropped Wi-Fi again last night, so I'm in no mood for anything that "just works". I read their v2 last round and sent back three lines. This time I checked first whether those three lines were fixed, then read the whole page cold.

---

## 1. After the hero only

**Said back:** "They stick a small tag on each trolley, bin and tool, put anchors on my columns that pick up its signal, and one live map shows where each thing went and how long it has been waiting."

**Is that right?** Yes. "Anchors on your columns hear its signal" tells me in the first screen that hardware goes on my steel. "Shows where it went and how long it has waited" is more honest than v2's "where it is", because a sleeping tag isn't telling anyone where it is right now. "Spatial intelligence" still opens the paragraph and still does nothing for me, but the next sentence names the tag, so I keep going. "Its signal" is fine for a hero, but note that the word UWB never appears on any screen. I only find it in the footer.

## 2. Screen by screen

- **Nav.** "How it locates a tag: Steel, racking and signal" is still my page, in my words. "How many anchors you need: A first estimate, before the survey". That's the fix I asked for: the survey comes first in the label itself. Still nothing in the nav for anchor outage or power-cut recovery. "When a tag goes quiet" covers the tag side, not the anchor side. Nothing read twice.
- **Screen 1, Hero.** Clear. In the before film, the trolley turns behind the racks and no mark follows it. That's my 2 a.m. call. There are dark boxes on columns and no rings or glow. Good. Nothing read twice.
- **Screen 2, Find it.** Fixed. "The tag sends a pulse as it moves, so nobody scans it along the way." That's right on the physics. The tag transmits, and screen 5 says AmIHub works out the position, so the two screens agree now. "It goes on the trolley, not on the person pushing it" is a good line for the union room too. Nothing read twice.
- **Screen 3, See where work waits.** Not my screen. Honest: "Why it waited stays your team's call." My hard case is still unanswered: a trolley parked right on a zone line. Does it flicker in and out and rack up false entries? Neither this screen nor its link labels name it. I'd hope "How waits are timed: Zones, entries and exits" covers it. Nothing read twice.
- **Screen 4, Ask your floor.** I skimmed it. Two lines matter to me: "The server is part of AmIHub, so it can run on a PC inside your plant" and "Every request it makes is logged." "Asking changes nothing" and "needs a person to approve it" are what I'd want if an AI is anywhere near a work order on my line. Nothing read twice.
- **Screen 5, One system.** My screen, and now the best anchor block I've read from any vendor's homepage.
  - AmIGo: "Sends a short pulse when it moves and sleeps when it stops. While it sleeps, the map shows where it was last seen." "1 to 3 years, depending on use." Conditioned. Pass.
  - AmIMo: "3 to 8 m up." "Needs only power, from DC or PoE." "No separate data or sync cabling." That's the word "separate" I asked for twice. My electrician won't be misled now. Pass.
  - Coverage: "Each covers about 50 m in clear line of sight. Racking and steel change that, so we survey your floor and set the count." This is the line I've been waiting two rounds for. It gives a number, the condition and the survey in one breath. Pass.
  - Accuracy: "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor." It names the anchors and the site carries the condition. Pass.
  - "If an anchor goes dark, AmIHub flags it." Good, that's half my outage question: I'll know it's down. It still doesn't tell me what happens when the power comes back, or what the map shows for tags that anchor couldn't hear.
  - Read twice: **"Hears each pulse as it arrives."** (6 words). Same complaint as v2. Hears it and measures what? The AmIHub block now says "Works out where each tag is from what the anchors hear", which closes the chain, so it's less bad. But "hear" isn't a measurement. "Times each pulse as it arrives" would be enough.
  - Didn't trust: "Built on the FiRa and omlox specifications." I still don't know if "built on" means certified, compliant or just inspired by.
  - Renders: the anchor is fixed by its own tab, RJ45 facing down, with one plain power cable, so it's a DC install, which the copy allows. The tag is screwed through its own ears with the deboss on the cover. Nothing invented that I can see.
- **Screen 6, Start with one bay.** "plus our survey of your floor" is still a line item. Good. "Local stock and local engineers on site" is the closest anything on the page gets to "who replaces a failed anchor and how fast". It's a start, but it gives no spares or response time. The stop-at-any-stage gate is still gone, so there's no technical gate on the homepage. Read twice: **"The first waits it times are today's, so you can use them as your baseline."** (15 words). "The first waits it times" trips me up because "times" reads as a noun first.
- **Footer.** "Maintenance and OT: How it locates a tag" is my row. "Designed and built in India on NXP Trimension UWB silicon" is the first time I see UWB on the page, and it's in the footer. Still don't trust "Specifications are indicative. Final datasheets are shared under NDA." Hiding a datasheet behind an NDA makes me think the footnotes are bad. I skipped "Physical AI".

**Words I didn't know or didn't trust:** spatial intelligence, "hears" (as a measurement), "built on" (specifications), indicative, Physical AI, "flags it" (flags it how: an alert, or just a red dot on a screen nobody watches at night?).

## 3. Where I'd stop scrolling

I wouldn't stop. I'd skim screens 3 and 4, slow right down on screen 5, and then jump from there to "How it locates a tag" to look for steel, moving vehicles and the outage answer.

## 4. My question at the end

"After a power cut, do the anchors come back and re-sync over the air on their own, how long does that take, and what does the map show for the tags it couldn't hear in that gap? And when an anchor fails outright, who swaps it and how fast?" The page now says it will tell me an anchor went dark. It still doesn't say what happens next.

## 5. Score

**9/10.** In 90 seconds I can tell my plant head how it locates a tag (tag pulses, anchors hear, AmIHub works it out) and what the site needs: columns at 3 to 8 m, DC or PoE, about 50 m line of sight subject to racking and steel, and a survey that sets the count. Every number carries its condition. I'd forward it today with "let's get them in for a survey". It isn't a 10 because recovery after an outage is still nowhere on the page or in the nav.

---

## 6. Compared with v2 (8/10)

**Better.** Both lines I sent back are fixed ("sends a pulse", "No separate data or sync cabling"), and the coverage line I asked for is in, with its condition and the survey right beside it.
Still open: "hears" is not a measurement, there's no recovery link, there's no technical gate, and UWB is only named in the footer.

## 7. Best and worst lines

- **Best:** "Each covers about 50 m in clear line of sight. Racking and steel change that, so we survey your floor and set the count." It's the first vendor homepage line I've read that admits the steel sets the anchor count.
- **Worst:** "Hears each pulse as it arrives." It's the one place on my screen where the engineering goes vague.

## 8. One change that would make it a 10

Finish the anchor block with the method and the outage answer, and link it:

> Times each pulse as it arrives. If an anchor goes dark, AmIHub flags it, and it rejoins on its own when power returns. [What happens after a power cut](/technology/)

The "rejoins on its own" clause only goes in if engineering confirms it. If they can't confirm it, keep the link and put the honest answer on that page. Add the matching nav line under "How it works" ("Outages and recovery"). Then I'd send it to my plant head without a note.

---

## Re-read log (sentences read twice, with word count)

| Screen | Sentence | Words | Why |
|---|---|---|---|
| 5 | "Hears each pulse as it arrives." | 6 | Doesn't say what it measures. Unchanged since v2. |
| 6 | "The first waits it times are today's, so you can use them as your baseline." | 15 | "it times" reads as a noun first. |

Two re-reads, down from three in v2. Both v2 re-reads I raised for physics and cabling are fixed.

## Spec audit, numbers and their conditions

| Number or claim | Condition on the page | Verdict |
|---|---|---|
| ±10 cm | "With these anchors... How close depends on your floor." | Pass |
| 3 to 8 m mounting | Column or wall | Pass |
| 1 to 3 years battery | "depending on use" | Pass |
| Power | "Needs only power, from DC or PoE" | Pass |
| Cabling | "No separate data or sync cabling" | Pass (fixed from v2) |
| Sync | "over the air" | Pass as wording. Behaviour after an outage isn't stated. |
| Coverage, about 50 m | "in clear line of sight. Racking and steel change that, so we survey your floor and set the count." | Pass (new) |
| Survey | In the anchor block and in "What you buy" | Pass |
| Anchor failure | "If an anchor goes dark, AmIHub flags it." | Partial: detection only, no recovery or replacement |
| Recovery after power loss | Not on the page or in the nav | Gap, flagged again |
| Anchor count tool | "A first estimate, before the survey" | Pass (fixed from v2) |
| Radio named (UWB) | Footer only | Weak: the body never says UWB |
| UWB, BLE and Wi-Fi FTM on the same anchors | Not mentioned | Neutral for a homepage |
| Hard cases: zone boundary, hidden tag, signal loss | Only "Steel, racking and signal" and "Last seen, sleep and gaps" in the nav | Acceptable for a homepage. The zone-boundary case should be on /learn/dwell-time/. |

Renders against the CAD. The AmIGo is screwed through its own ears with the deboss on its cover. The AmIMo is fixed by its own tab with the RJ45 port facing down and one plain power cable (DC). Nothing invented. If it's re-rendered as PoE, the single cable has to go into the RJ45.
