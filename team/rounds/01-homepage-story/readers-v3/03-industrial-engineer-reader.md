# Reader panel, round 3 (homepage v3): Industrial Engineer Reader (P3)

SIMULATION. This is a hypothesis buyer from kit 09 section 6, not an interview. I read it cold on a phone after a shift: section 3 copy and pictures, plus the nav and footer, nothing else. The cold read comes first. A second pass after it only audits definitions.

Same test as before. In 90 seconds, can I say what this measures and how it defines a wait? That means the entry event, the exit event, the time window, and what happens to a carrier still in the zone at shift end. Then: is there a baseline before any before-and-after?

---

## 1. After the hero only

"AmIMotion puts a small tag on each trolley, bin and tool, anchors on the columns hear its signal, and one live map shows where each thing went and how long it has waited."

Right. "Where it went" is more honest than v2's "where it is", because a sleeping tag has no "is", only a "last seen". The hero still doesn't tell me what "waited" is counted from. That's fine. It's a promise, and screen 3 has to pay it.

## 2. Screen by screen

- **Nav.** Same bar and the same rows I liked last time. "How waits are timed: Zones, entries and exits", "When a tag goes quiet: Last seen, sleep and gaps", "Specifications: Every figure and its condition", "Measure before you claim: Set a baseline first". New: "Which job is on the trolley? Linking trolleys to jobs". Good, the association now has its own door. "How many anchors you need: A first estimate, before the survey" is the honest order. "Time spent searching: Your own numbers" still worries me. One "you will save" on that tool and I'm out.
- **Hero.** Same film and same fixed counts, and I still believe the before/after: ticks at desks, nothing between them. The trails carry no time window, but it's a model hall and it reads as a story device, so it passes on the hero. "You find out from a screen, not a walk." says how, not how much. Pass.
- **Find it.** "A scan tells you where it passed. A tag tells you where it stopped." That's sharper than v2 and true for a sleeping tag. "The tag sends a pulse as it moves, so nobody scans it along the way." The physics line is fixed and agrees with screen 5. I didn't go back to it this time. "You see where it was last seen, and when." uses one field, last-observed. Good. "The walk. The calls to stores. The second walk." still works on me.
- **See where work waits.** My screen, and better. "The map notes when each trolley or pallet enters a zone and when it leaves." Entry and exit, in floor words. "You name the zones." "You see how long each one has waited, while it is still waiting." The open visit is still counted live. New: "Link each trolley to its job, and its wait becomes the job's wait. We agree with you how to link them before the pilot." That's step 4 of how I work: location only becomes job status through an agreed association. The page says exactly that, and on the screen where it matters. "Why it waited stays your team's call." Symptom, not root cause. Still missing here: how a carrier sitting on a zone boundary is counted, and "set the limits" is still gone. The picture still separates the trolley in work (blue, station zone) from three in the queue (amber, queue zone). Queue time and process time are different zones, but only the picture says so.
- **Ask your floor.** "Which trolleys have waited at inspection for more than an hour?" Zone, threshold and unit, all there, and demoed live on the call. "Asking changes nothing." and "needs a person to approve it" are what my floor needs to hear before anything with "AI" on it goes near a supervisor. I read the IT block because MCP is defined. "Every request it makes is logged." Good.
- **One system.** "One battery lasts 1 to 3 years, depending on use." A range with its condition. "Each covers about 50 m in clear line of sight. Racking and steel change that, so we survey your floor and set the count." Conditioned. Did not fully trust: "covers about 50 m". Is that range from the anchor, radius or spacing? The unit's there, the definition isn't. My OT engineer will ask. "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor." Correct shape: AmIMo anchors and site-dependent, both in the same block. And the zone logic on screen 3 doesn't lean on that precision. A queue zone is metres wide. "If an anchor goes dark, AmIHub flags it." That's the data-quality line I want before I trust a dwell number from a zone with a dead anchor. "Open REST, MQTT, WebSocket and omlox hub interfaces" is still the closest thing to "can I export the raw events". FiRa and omlox aren't for me.
- **Start with one bay.** This is where v3 earns its score. "The first waits it times are today's, so you can use them as your baseline." The baseline is on the page now, before the before-and-after. "Before it starts, we agree with you how each wait counts, even one still open at shift end." Shift end is named, on the page, for the first time in three rounds. I had to read the baseline line twice (see the log). "The first waits it times are today's" is loose. How many first waits? Over what window? A baseline needs a window and a sample size, and "the first waits" gives neither. The shift-end line promises we'll agree a rule. It doesn't say what AmIHub does with an open visit. That's honest, because the founders still owe that answer (item 9), but it's a process promise, not a definition. "You see your own waits in one bay before you decide on more." Evidence before scale, and that answers my v2 "grow on what evidence?". "The pilot tags trolleys, bins and pallets, not people." I'd show that line to the floor on day one.
- **Footer.** "Lean and IE leads: How waits are timed". My row, kept. The entity paragraph: "time-stamped location", "zones", "jobs you link to each carrier". In one paragraph that's the right three-part model: location, zone, association. I skimmed past "Physical AI".

## 3. Where I would stop

I wouldn't stop. I'd slow down on the baseline line on screen 6, read it twice, and open "Measure before you claim" and "How waits are timed" in new tabs before booking. Nothing on the page broke my trust.

## 4. The question I still have

"A trolley enters the inspection queue at 21:50 and is still there at the 22:00 shift change. What does AmIHub itself do with that visit, carry it, split it or drop it? And how long is the baseline window, and who decides it?" The page now promises we'll agree the rule. It doesn't yet say what the system does by default.

## 5. Score

**9/10.** In 90 seconds I can say what it measures: time from entry to exit in zones I name, shown live while the visit is open, tied to a job only through a link we agree. The baseline and shift end are now on the page and not behind links. I'd forward screens 3 and 6 to my production manager today. Not a 10, because the shift-end answer is a promise to agree, not a definition, and the baseline has no window.

## 6. Compared with v2 (8/10)

Better. The baseline sentence and shift end are now on screen 6, the job link sits on the wait screen as an agreed association, and the "reports its own position" physics error is gone.
Same: no boundary rule, "set the limits" is still lost, and the baseline is still loose on window and sample size.

## 7. Best and worst line

**Best:** "Link each trolley to its job, and its wait becomes the job's wait." (Screen 3.) In 13 words it says location becomes job status only through a link, on the screen where the wait is shown. No vendor page I've read says that.

**Worst:** "The first waits it times are today's, so you can use them as your baseline." (Screen 6.) It's the most important sentence on the page for me, and the weakest written. I read it twice, and it names no window and no sample. "The first waits" could mean an hour or a month.

## 8. One change that would make it a 10

Replace the two baseline sentences on screen 6 with a definition, once the founders confirm what AmIHub does (item 9):

> "The pilot first times today's waits, over a window you set. That is your baseline. A wait still open at shift end stays open and keeps counting. It is never dropped."

It has to be true first. If AmIHub splits the visit at shift change, or closes it, say that instead. I'd rather have the true rule than a nice one. "Over a window you set" gives the baseline a window without the page naming a duration.

(A smaller fix, for my OT colleague more than for me: say whether "covers about 50 m" is range from the anchor or spacing between anchors.)

---

## Re-read log (cold read only)

| Screen | Line | Words | Why |
|---|---|---|---|
| 6 | "The first waits it times are today's, so you can use them as your baseline." | 15 | "it times are today's" parses slowly, and on the second read I was looking for the window |

One line, same count as v2, and the v2 line is fixed. This one is on the sentence that carries the most weight for me.

Words I didn't know or didn't trust: FiRa, omlox, Trimension (not for me, didn't need them), Physical AI (skimmed), "covers about 50 m" (unit given, meaning not defined).

## Metric audit (second pass)

| Metric shown | Entry event | Exit event | Time window | Open visits | Verdict |
|---|---|---|---|---|---|
| Hero: "how long it has waited" | not on hero | not on hero | none | not on hero | Pass as a promise. Screen 3 defines it |
| Screen 2: "last seen, and when" | n/a | n/a | n/a | n/a | Pass. One field, last observed |
| Screen 3: wait in a zone | zone entry | zone exit | live | shown while open | Pass. Boundary rule not said |
| Screen 3: job's wait | via agreed link | via agreed link | live | as above | Pass. Association named, agreed before pilot |
| Screen 4: "more than an hour" | inspection queue zone | n/a | 1 hour | yes, by its nature | Pass as a story question, demoed live |
| Screen 5: "1 to 3 years" | n/a | n/a | n/a | n/a | Pass. "Depending on use" attached |
| Screen 5: "about 50 m" | n/a | n/a | n/a | n/a | Amber. Conditioned, but range vs spacing not defined |
| Screen 5: "±10 cm" | n/a | n/a | n/a | n/a | Pass. AmIMo anchors and site-dependent |
| Screen 6: baseline | today's first waits | | no window, no sample | shift end to be agreed | Nearly pass. On the page, needs window and default rule |
| Trails (hero, screen 6) | n/a | n/a | not shown | n/a | Acceptable as a model-hall story device. Any real capture must show its window |

Little's Law: there are still no WIP, throughput or lead-time figures, so nothing to break. One trolley in work and three queued for over an hour in front of one station is a plausible slow inspection, the same on screens 1, 3 and 4. No OEE claim, no "up to", no percentages. One thing for the pilot design, not the page: tagging a bay changes how people behave in it, so the baseline window should start after the floor has stopped noticing the tags.
