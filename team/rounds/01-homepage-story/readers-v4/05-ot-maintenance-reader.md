# Reader panel, homepage v4: P5 OT and Maintenance Reader

SIMULATION. This is a simulated buyer reading, built on a hypothesis profile (kit 09 section 6). No interviews yet.

I'm reading this on my phone in the crane bay, the one where the Wi-Fi drops every time the 10-tonne crane goes over. Last round I sent back "hears", the missing UWB and the missing recovery answer. I checked those first, then read the page cold.

---

## 1. After the hero only

**Said back:** "They put a small tag on each trolley, bin and tool, anchors on my columns pick up its signal, and one live map shows where each thing went and how long it has been waiting, so nobody has to walk the floor."

**Is that right?** Yes. The hero hasn't changed and it still works. "Anchors on your columns" tells me straight away that hardware goes on my steel, and "where it went and how long it has waited" is honest about a tag that sleeps. "Spatial intelligence" still does nothing for me, but the next sentence carries the meaning.

## 2. Screen by screen

- **Nav.** "How it locates a tag: Steel, racking, signal and outages". That's the line I asked for, and it's in my words. "Trust and data" moving under How it works makes no difference to me. Nothing read twice.
- **Screen 1, Hero.** Unchanged and clear. Dark boxes on the columns, no rings and no glow. Nothing read twice.
- **Screen 2, Find it.** "The tag sends a signal as it moves" agrees with the hero and with screen 5. "It goes on the trolley, not on the person pushing it" is still good. "On a screen or on your phone": fine. Nothing read twice.
- **Screen 3, See where work waits.** Not my screen, but one line is for me: "AmIHub sends the event to the system you name." That's an integration event I'll end up owning. If it fires twice, who de-duplicates it? The page doesn't say, and a homepage doesn't have to. My zone-boundary case (a trolley parked on the line) still isn't named here. "Set a limit for each zone" is plain. Nothing read twice.
- **Screen 4, Ask your floor.** Skimmed it. "Asking changes nothing" and "needs a supervisor's approval" are what I want if an AI gets anywhere near my line. "It can run on a PC inside your plant" and "Every request it makes is logged" are fine. Nothing read twice.
- **Screen 5, One system.** My screen. Mostly better again, and one line worries me.
  - AmIGo: "Sends a short UWB pulse when it moves". UWB is finally named in the body, not only the footer. "1 to 3 years, depending on use" carries its condition. "AmIHub shows each battery's level" answers how I plan tag swaps. Pass.
  - AmIMo method: "Times each pulse as it arrives, and the angle it came from." That's a measurement now, not "hears", and it's what I asked for. But I read it twice: "times... the angle" doesn't parse as one verb. You time the pulse and you measure the angle. (11 words.)
  - Power: "Needs only power, from DC or PoE." "No separate data or sync cabling." Pass.
  - Backhaul: **"It syncs over the air and sends its data to AmIHub over Wi-Fi."** It's honest, and it explains why there's no data cabling. But I'm standing in a bay where the Wi-Fi died last night. The line has no condition and no fallback. Is it my plant's Wi-Fi, which IT owns, or their own? What happens to the positions when the Wi-Fi drops? Are they buffered or lost? And is there an Ethernet option? The source apparently has one, on the specs page, but the homepage doesn't show it. This is the first line on this screen that reads like a promise I'll have to keep at 2 a.m.
  - Coverage: "Each reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count." Still the best coverage line on any vendor homepage I've read. Pass.
  - Accuracy: "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor." Pass.
  - Setup and health: "You set anchors up from a phone app. AmIHub finds each one on its own and raises an alert if one goes dark." "Raises an alert" is better than v3's "flags it". It's close to "plug and play", but it stays on the right side because the survey sits two sentences earlier. It still doesn't say what happens when power comes back.
  - Link: "Anchors, steel and outages" goes to /technology/. Good, that's the recovery door I asked for. But the nav and footer call the same page "How it locates a tag". Two labels for one page, and I noticed.
  - Didn't trust: "Built on the FiRa and omlox specifications." I still don't know if that means certified or not.
  - Density: 111 words in the anchor block is a lot on a phone. I read every word because it's my job. Nobody else will.
- **Screen 6, Start with one bay.** "plus our survey and an anchor plan for your floor" is better than v3. An anchor plan is something I can check against my trusses. "local engineers on your site" is the nearest thing to who swaps a dead anchor, but there's still no spares stock or response time. "Then grow plant-wide... without re-fitting the first bay" is good. I don't want to drill the same columns twice. "A second plant joins the same console, with its own survey" is honest. The v3 baseline line I tripped on is fixed: "The pilot times today's waits first" reads fine. New re-read: **"Before it starts, we agree with you how a wait still open at shift end counts."** (16 words). I had to find where the "how" clause ends. There's still no technical gate in the pilot.
- **Footer.** "Maintenance and OT: How it locates a tag" is my row. I still don't like "Specifications are indicative. Final datasheets are shared under NDA." A datasheet behind an NDA makes me think the footnotes are bad. I skipped "Physical AI".

**Words I didn't know or didn't trust:** spatial intelligence, "built on" (specifications), indicative, Physical AI, "over Wi-Fi" (whose Wi-Fi, and what if it drops), "raises an alert" (to whom, at night?).

## 3. Where I'd stop scrolling

I wouldn't stop. I'd slow right down on screen 5, and at the Wi-Fi line I'd tap "Anchors, steel and outages" before finishing screen 6. If that page doesn't answer Wi-Fi loss and power loss, that's where they'd lose me.

## 4. My question at the end

"When the plant Wi-Fi drops under a crane, or the power cuts, what happens to the positions in that gap? Are they buffered on the anchor or lost? How long do the anchors take to rejoin and re-sync on their own? And can I run Ethernet from the RJ45 instead in the bays where Wi-Fi is bad?" Then, as last time: who swaps a failed anchor, and how fast?

## 5. Score

**9/10.** In 90 seconds I can tell my plant head how it works: a UWB pulse, anchors time it and take its angle, AmIHub works out the position. I can also say what the site needs: columns at 3 to 8 m, DC or PoE, about 50 m line of sight subject to racking and steel, and a survey that sets the count. Every number carries its condition. I'd forward it and ask for a survey. It isn't a 10 because Wi-Fi backhaul is now stated with no condition and no fallback, and recovery is only a link, with no answer on the page.

---

## 6. Compared with version 3 (9/10)

**Better, same score.** "Hears" became a real measurement, UWB is in the body, the outage link and nav line are in, and "raises an alert" replaced "flags it".
But the new Wi-Fi backhaul line opened a fresh worry for exactly my kind of plant, and that gives back what the fixes gained.

## 7. Best and worst lines

- **Best:** "Racking and steel change that, so we survey your floor and set the count." The steel sets the count, and the survey comes before any number. That's the line that makes me trust everything else on the screen.
- **Worst:** "It syncs over the air and sends its data to AmIHub over Wi-Fi." It's the one infrastructure dependency on the page with no condition attached, and Wi-Fi in a steel bay with cranes is the thing I've already pulled out once.

## 8. One change that would make it a 10

Give the Wi-Fi line its condition and fallback, and fix the grammar of the method line:

> Times each pulse as it arrives and measures the angle it came from. ... It syncs over the air and sends its data to AmIHub over Wi-Fi, or over Ethernet from the same port where Wi-Fi is weak. [What happens when Wi-Fi or power drops](/technology/)

The Ethernet clause goes in only if engineering confirms the option the build notes point to. If they can't, keep the link and put the honest answer (buffering, rejoin and recovery time measured in the pilot) on /technology/. Use one label for that page everywhere. Then I'd send it to my plant head without a note.

---

## Re-read log (sentences read twice, with word count)

| Screen | Sentence | Words | Why |
|---|---|---|---|
| 5 | "Times each pulse as it arrives, and the angle it came from." | 11 | "Times" can't take "the angle" as its object. It needs a second verb. |
| 6 | "Before it starts, we agree with you how a wait still open at shift end counts." | 16 | The "how" clause runs on, and "counts" lands late. |

Two re-reads, same count as v3. Both v3 re-reads are fixed ("Hears each pulse", "The first waits it times").

## Spec audit, numbers and their conditions

| Number or claim | Condition on the page | Verdict |
|---|---|---|
| ±10 cm | "With these anchors... How close depends on your floor." | Pass |
| 3 to 8 m mounting | Column or wall | Pass |
| 1 to 3 years battery | "depending on use", plus battery level shown in AmIHub | Pass (improved) |
| Power | "Needs only power, from DC or PoE" | Pass |
| Cabling | "No separate data or sync cabling" | Pass. Now explained by Wi-Fi backhaul. |
| Backhaul | "over Wi-Fi" | Fail on condition: no fallback, no ownership, no behaviour on loss. Ethernet option not shown. |
| Sync | "over the air" | Pass as wording. Behaviour after an outage isn't stated. |
| Coverage, about 50 m | "in clear line of sight. Racking and steel change that, so we survey your floor and set the count." | Pass |
| Survey | Anchor block, plus "our survey and an anchor plan" in "What you buy" | Pass (improved) |
| Measurement method | "Times each pulse... and the angle it came from" | Pass on substance, re-read on grammar |
| Radio named (UWB) | Tag block and footer | Pass (fixed from v3) |
| Anchor failure | "raises an alert if one goes dark" | Partial: detection only. Recovery and replacement are not stated. |
| Recovery after power loss | Link "Anchors, steel and outages" and the nav line only | Partial: there's a door but no answer on the page |
| Commissioning | "set anchors up from a phone app", "finds each one on its own" | Pass. The survey line keeps it from reading as plug and play. |
| Hard cases: zone boundary, hidden tag, repeated event | Not named on the homepage | Acceptable for a homepage, if /learn/dwell-time/ covers them |
| UWB, BLE and Wi-Fi FTM on the same anchors | Not mentioned | Neutral for a homepage |
| Label consistency | /technology/ is "Anchors, steel and outages" on screen 5 but "How it locates a tag" in the nav and footer | Fail against the page's own one-label rule |

Renders, as v3. The AmIGo is screwed through its own ears. The AmIMo is fixed by its own tab, RJ45 facing down, with one DC cable. Nothing invented. If the copy adds an Ethernet fallback, the render should still show DC, or show the one cable going into the RJ45 for PoE.
