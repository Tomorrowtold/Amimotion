# Reader panel, round 2 (homepage v2): Industrial Engineer Reader (P3)

SIMULATION. Hypothesis buyer from kit 09 section 6, not an interview. Read cold on a phone after a shift, section 3 copy and pictures plus the nav and footer only. Cold read reported first, then a second pass that only audits definitions.

What I read for, same as last time: in 90 seconds, can I say what this measures and how it defines a wait? Entry event, exit event, time window, what happens to a carrier still in the zone at shift end.

---

## 1. After the hero only

"AmIMotion puts a small tag on each trolley, bin and tool, anchors on the columns hear it, and one live map shows where each thing is and how long it has waited."

Right, and better than last round. "Waited" has replaced "stood still", so the hero no longer mixes idle time with dwell. What it still lacks is the zone. "How long it has waited", counted from what? The hero can't answer that in 46 words and doesn't try. It only has to get me to screen 3, and it does.

## 2. Screen by screen

- **Nav.** Plain. "How waits are timed" with "Zones, entries and exits" under it. That line names the parts of a definition. "When a tag goes quiet: Last seen, sleep and gaps" and "Specifications: Every figure and its condition" are what I look for on a vendor site and almost never find. "Measure before you claim: Set a baseline first" made me trust the nav more than the page. One worry: "Time spent searching: Your own numbers". A search-time calculator is one step from an ROI figure. If it ever prints "you will save X hours", I'm gone.
- **Hero.** The before/after film is still the right picture of MES data: a tick at each desk, nothing between them, and a trolley that vanishes behind the racks. I believed it. The fixed counts (three trolleys and one pallet waiting, nobody jumping the queue) mean the pictures will agree with each other. Last round they didn't. The trails have no time window, but this is clearly a model hall and a story device, so I let it go on the hero. "You find out from a screen, not a walk." describes how, and makes no claim about saving anything. Pass.
- **Find it.** "A scan tells you where it was. A tag tells you where it is." Clean. "The walk. The calls to stores. The second walk." That's a spaghetti diagram in words and I still like it. "When it last moved" is honest. Did not trust: "The tag reports its own position". On screen 5, AmIHub "works out where each tag is" from pulses the anchors hear. So the tag doesn't know its own position, the hub works it out. I went back to this line from screen 5 (see re-read log). It's a small thing, but my OT engineer will catch it in five seconds and then doubt everything else.
- **See where work waits.** This is my screen, and it's nearly there. "Each move into and out of a zone gets a time." Entry and exit, kept from round 1. "You name the zones." The zone model is mine. "You see how long each one has waited, while it is still waiting." That's the open visit, shown live, not dropped. Nobody gave me that in round 1. The picture separates the trolley being worked on (blue, inside the station zone) from the three in the queue zone (amber). Queue time and process time are different zones. That's right, and the copy never says it. You get it from the picture, and I only got it because I already know it. Still missing: what happens at shift end, and how a carrier sitting on the zone boundary is counted. "Set the limits" from round 1 is gone. I miss it, because a limit is what turns a wait into something someone acts on. "Why it waited stays your team's call." is honest. A wait time is a symptom, and the line doesn't pretend it's a root cause.
- **Ask your floor.** "Which trolleys have waited at inspection for more than an hour?" A zone, a threshold and a unit. I can test it on the call, and the page says I will ("We show it live on a call"). The picture has the same three trolleys, so it agrees with screen 3. MCP is defined now ("an open standard that lets AI assistants use other software"), so I didn't skip the IT block this time. "Every request it makes is logged" is the kind of line that matters on a floor that already thinks numbers mean surveillance.
- **One system.** "While it sleeps, the map shows where it was last seen." That answers my round-1 question about a sleeping tag in a queue. A waiting trolley is a still trolley, and a still tag is asleep, so this line holds up screen 3. "Down to ±10 cm with AmIMo anchors. Your site sets the final figure." Correct shape, the conditions are attached. "You link each tagged carrier to its job." The association is named and the customer does it. Location only becomes job status through that link, and the page says so. "Open REST, MQTT and WebSocket interfaces" is the nearest thing to "can I export the raw events". It's close enough to ask on the call. FiRa and omlox mean nothing to me, and they aren't for me.
- **Start with one bay.** "A pilot watches one flow in one bay or line. You choose the flow you want to see." Bounded, and the flow is mine. "A pilot tags carriers, not people." That's the line I'd show the floor before the first tag goes on. Then: "Then grow plant-wide on the same AmIHub." Grow on what evidence? The baseline is now a link ("Measure before you claim"), not a sentence. That's progress, and it's still one click away from the screen where the plant head decides. The before-and-after story stays unanchored on the page itself.
- **Footer.** "Lean and IE leads: How waits are timed". My row, my page, kept. The entity paragraph says "everything you tag in a plant", not "everything that moves". Good. I skimmed past "Physical AI".

## 3. Where I would stop

I wouldn't stop. I'd slow down at screen 6 on "Then grow plant-wide" and open "Measure before you claim" in a new tab before I booked anything. I'd open "How waits are timed" from screen 3 too. This page gets me to both doors with my trust intact.

## 4. The question I still have

"A trolley enters the inspection queue at 21:50 and is still there at the 22:00 shift change. In the report, is that a 10-minute wait, an open visit carried into the next shift, or dropped? And what does the pilot measure in its first weeks, before anyone changes anything?"

## 5. Score

**8/10.** In 90 seconds I can say what it measures (time from zone entry to zone exit, in zones I name, shown live while the visit is still open) and that it doesn't tell me why. I'd forward screens 3 and 6 to my production manager today, with the baseline link. Not a 10, because the baseline and shift end are both behind links and not on the page.

## 6. Compared with the best of round 1 (Concept A, 7/10)

Better. The hero now says "waited", not "stood still". Screen 3 shows open visits live. Screen 5 explains last seen for a sleeping tag and names who links a carrier to its job. The pictures now agree on counts and order in the queue. MCP is defined.
What's still the same: no baseline sentence on the page, nothing on shift end, and "set the limits" was lost on the way.

## 7. Best and worst line

**Best:** "You see how long each one has waited, while it is still waiting." (Screen 3). It's the open visit, counted live, not dropped. That's the first time any version has told me that.

**Worst:** "The tag reports its own position, so nobody scans it along the way." (Screen 2). Screen 5 says AmIHub works out where each tag is. Both can't be true as written, and it's the one physics claim on the page that an engineer will check.

## 8. One change that would make it a 10

Put the baseline on screen 6 as a sentence, after "You choose the flow you want to see.":

> "First the pilot times today's waits in each zone. Visits still open at shift end are kept, not dropped. That is your baseline."

That gives me the measurement before the before-and-after, and it answers shift end in the same place. Then I could build the pilot scorecard from the page. It has to be true first. The Truth and Quality Lead and the founders have to confirm that AmIHub keeps open visits across a shift change and that the pilot starts with a measured baseline. If it isn't true, say what AmIHub actually does with an open visit. I'd rather have the true answer than this one.

(The second fix is smaller: "The tag sends a pulse as it moves, so nobody scans it along the way." That matches screen 5.)

---

## Re-read log (cold read only)

| Screen | Line | Words | Why |
|---|---|---|---|
| 2 | "The tag reports its own position, so nobody scans it along the way." | 13 | Went back from screen 5, which says AmIHub works out the position |

One line, against five last round.

Words I didn't know or didn't trust: FiRa, omlox, Trimension (not for me, I didn't need them), Physical AI (skimmed), "reports its own position" (didn't trust). MCP is now defined on the page.

## Metric audit (second pass)

| Metric shown | Entry event | Exit event | Time window | Open visits | Verdict |
|---|---|---|---|---|---|
| Hero: "how long it has waited" | not on hero | not on hero | none | not on hero | Pass as a promise. Screen 3 defines it |
| Screen 3: wait in a zone | zone entry | zone exit | live | shown while open | Nearly pass. Shift end and boundary not said |
| Screen 4: "more than an hour" | implied zone (inspection queue) | n/a | 1 hour | yes, by its nature | Pass as a story question, demoed live on the call |
| Screen 5: "last seen" for a sleeping tag | n/a | n/a | n/a | n/a | Pass. It holds up screen 3 |
| Screen 5: "±10 cm" | n/a | n/a | n/a | n/a | Pass. Tied to AmIMo anchors and the site |
| Trails (hero, screen 6) | n/a | n/a | not shown | n/a | Acceptable as a model hall, story device. Any real capture must show its window |
| Pilot | no baseline sentence on the page, link only | | | | Partial |

Little's Law: no WIP, throughput or lead-time figures on the page, so there's nothing to break. Three trolleys waiting over an hour in front of one station with one in work is a plausible slow inspection, and nothing contradicts it. No OEE claim anywhere. No "up to". No percentages.
