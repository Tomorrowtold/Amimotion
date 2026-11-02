# Reader panel, round 4 (homepage v4): Industrial Engineer Reader (P3)

SIMULATION. This is a hypothesis buyer from kit 09 section 6, not an interview. I read it cold on a phone: section 3 screen copy and pictures, plus the nav and footer, nothing else. The cold read comes first. A second pass after it only audits definitions.

The test hasn't changed. In 90 seconds, can I say what this measures and how it defines a wait: entry event, exit event, time window, and what happens to a carrier still in the zone at shift end? Is there a baseline, with a window, before any before-and-after?

---

## 1. After the hero only

"AmIMotion puts a small tag on each trolley, bin and tool, anchors on the columns hear its signal, and one live map shows where each thing went and how long it has waited."

Right. Same as v3, because the hero didn't change. "How long it has waited" is still a promise with no definition behind it on this screen. That's fine for a hero, as long as screen 3 pays it, and it does.

## 2. Screen by screen

- **Nav.** "How waits are timed: Zones, limits, entries and exits." Limits are back in the label, which tells me they're back in the model. "Measure before you claim: Set a baseline first" and "Specifications: Every figure and its condition" are still the two rows that make me trust the rest. "Time spent searching: Your own numbers" still makes me nervous. If that tool prints a "you will save" figure, I'm out.
- **Hero.** Unchanged and still passes. The trails have no time window, but it's a model hall, so they read as a story device. "You find out from a screen, not a walk." says how, not how much. Good.
- **Find it.** "A scan tells you where it last passed. A tag tells you where it stopped." "Last passed" is more exact than v3: a scan is an event at a point, not a state. "You see where it was last seen, and when." One field, last observed, with its timestamp. Nothing to re-read. "It goes on the trolley, not on the person pushing it." I'd want that line on the floor's notice board.
- **See where work waits.** Still my screen. "The map notes when each trolley or pallet enters a zone and when it leaves." Entry and exit. "You see how long each one has waited, while it is still waiting." Open visits counted live. New, and I asked for it in v2: "Set a limit for each zone." Then I had to read the next line twice: "When a trolley passes it, AmIHub sends the event to the system you name." "Passes it" first read as "passes the zone", as in drives by it. Only on the second read did "it" become the limit, meaning the wait goes over the limit. Write "When a trolley's wait goes over it". "Sends the event to the system you name" is right. It's an event, not an alarm, and I can ask what is in it. Then the line that bothered me most: "Link each trolley to its job once, in AmIHub or from your own system." Once? A trolley carries a dozen jobs a shift. The association has to start when the job goes on and end when it comes off, or the second job inherits the first job's wait. "Once" reads like one-time setup. I think it means "once per job, not at every station", but a production manager will read it the way I did. "Its wait becomes the job's wait." still holds. "Why it waited stays your team's call." still holds: symptom, not root cause. Still missing on the page: how a carrier sitting on a zone boundary is counted. The picture still does the queue-versus-process split (one trolley blue at the station, three amber in the queue). Words never say it.
- **Ask your floor.** "Which trolleys have waited at inspection for more than an hour?" Zone, threshold and unit. It now matches the limit idea on screen 3, so the two screens agree. "Asking changes nothing." "Needs a supervisor's approval." My floor has to hear those two lines before "AI" goes anywhere near them. I read the IT block because MCP is defined in one sentence. "Every request it makes is logged." Good.
- **One system.** "Each reaches about 50 m around it in clear line of sight." "Around it" makes it a radius from the anchor, not spacing between anchors. That fixes my v3 amber. "Racking and steel change that, so we survey your floor and set the count." Conditioned. "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor." AmIMo anchors and site-dependent, in one block, which is the shape I check for. Zone logic on screen 3 still doesn't lean on that precision. "AmIHub finds each one on its own and raises an alert if one goes dark." That's the data-quality line I need before I trust a dwell figure from a zone with a dead anchor. It doesn't say what happens to the waits timed in that zone while the anchor is dark. That's for the "When a tag goes quiet" page, not the homepage. "1 to 3 years, depending on use": a range with its condition. Pass. FiRa and omlox aren't for me. Skipped.
- **Start with one bay.** "The pilot times today's waits first, over a window you choose. That is your baseline." This is close to the line I wrote for them last round. The baseline has a window now, I set it, and the page invents no duration. It reads once. "Before it starts, we agree with you how a wait still open at shift end counts." It's shorter, and it's still a promise to agree, not a definition of what AmIHub does by default. "You see your own waits in one bay, and prove the numbers, before you decide on more." Evidence before scale, good. "Prove the numbers" is loose, though. Prove which numbers, against what? The page has made no number claim, so there's nothing to prove yet. Read in context it means "check the waits are right", and I'd rather it said that. "The pilot tags trolleys, bins and pallets, not people." I'd show that line on day one. The people block is new and honest: "would need its own policy and the consent of the people tagged."
- **Footer.** "Lean and IE leads: How waits are timed". My row, kept. The entity paragraph still has the right three-part model: "time-stamped location", "your zones", "the jobs you link to each carrier". I skimmed past "Physical AI" again.

## 3. Where I would stop

I wouldn't stop. I'd slow down twice on screen 3, at "passes it" and at "once". I'd open "How waits are timed" and "Which job is on the trolley?" in new tabs to check the link has a start and an end. Nothing broke my trust, but "once" is the kind of word my production manager would circle.

## 4. The question I still have

"A trolley enters the inspection queue at 21:50 on job A and is still there at the 22:00 shift change. At 22:10 job A comes off and job B goes on, still in the queue. What does AmIHub do by default with the shift-end visit (carry, split or close it), and how does the 20 minutes divide between job A and job B?" The page promises we'll agree the shift-end rule. It still doesn't say the default, and it now says the job link happens "once".

## 5. Score

**9/10.** In 90 seconds I can say what it measures: time from entry to exit in zones I name, shown live while open, with a limit that sends an event, tied to a job only through a link. The baseline now has a window I choose. I'd forward screens 3 and 6 to my production manager. Not a 10. "Once" on the job link reads wrong to anyone who has watched one trolley carry many jobs, and the shift-end default is still a promise, not a rule.

## 6. Compared with v3 (9/10)

Better on the page. The baseline has a window, "set a limit" is back with an event that goes to a named system, and "about 50 m around it" defines a radius.
Same score. The shift-end default is still unstated, there's no boundary rule, and v4 adds two loose words on my own screen: "passes it" and "once".

## 7. Best and worst line

**Best:** "The pilot times today's waits first, over a window you choose. That is your baseline." (Screen 6.) 16 words. It gives a baseline before any claim, with a window, and with no invented duration. I can design the pilot scorecard's first row from it.

**Worst:** "Link each trolley to its job once, in AmIHub or from your own system." (Screen 3.) It's the association line, the one that turns location into job status, and "once" makes it sound permanent. A trolley-to-job link that never ends gives job B job A's wait.

## 8. One change that would make it a 10

Fix the association line on screen 3, then state the shift-end default once the founders confirm it:

> "Link each trolley to its job when the job goes on, and unlink it when the job comes off, in AmIHub or from your own system. Nobody scans it along the way. While they are linked, its wait is the job's wait."

On screen 6, replace the agree-later line with the true default when it is known, for example: "A wait still open at shift end stays open and keeps counting, unless you agree another rule with us." Only if that's what AmIHub does. If it splits or closes the visit, say that.

(Smaller: "When a trolley's wait goes over it" for "When a trolley passes it". "Check the numbers" or "check the waits are right" for "prove the numbers".)

---

## Re-read log (cold read only)

| Screen | Line | Words | Why |
|---|---|---|---|
| 3 | "When a trolley passes it, AmIHub sends the event to the system you name." | 14 | "passes it" read first as passing the zone, then as passing the limit |
| 3 | "Link each trolley to its job once, in AmIHub or from your own system." | 14 | "once" didn't fit what I know of trolleys carrying many jobs. I re-read it to see whether it meant once per job |

Two lines, up from one in v3. The v3 line (baseline) is fixed and read once.

Words I didn't know or didn't trust: "once" (screen 3, not trusted), "prove the numbers" (screen 6, vague), FiRa, omlox, Trimension (not for me), Physical AI (skimmed), MCP (defined on the page, fine).

## Metric audit (second pass)

| Metric shown | Entry event | Exit event | Time window | Open visits | Verdict |
|---|---|---|---|---|---|
| Hero: "how long it has waited" | not on hero | not on hero | none | not on hero | Pass as a promise. Screen 3 defines it |
| Screen 2: "last seen, and when" | n/a | n/a | n/a | n/a | Pass. One field, last observed |
| Screen 3: wait in a zone | zone entry | zone exit | live | shown while open | Pass. Boundary rule not said |
| Screen 3: zone limit | wait over limit | n/a | per zone | yes, fires while open | Pass. Sends an event to a named system, not an alert. "Passes it" needs rewording |
| Screen 3: job's wait | via link | via link | live | as above | Amber. Association named, but "once" implies the link never ends |
| Screen 4: "more than an hour" | inspection queue zone | n/a | 1 hour | yes | Pass as a story question. Consistent with the limit |
| Screen 5: "1 to 3 years" | n/a | n/a | n/a | n/a | Pass. "Depending on use" attached |
| Screen 5: "about 50 m around it" | n/a | n/a | n/a | n/a | Pass. Radius, line of sight, survey condition in the same block |
| Screen 5: "±10 cm" | n/a | n/a | n/a | n/a | Pass. AmIMo anchors and site-dependent |
| Screen 6: baseline | today's waits | | window you choose | shift-end rule to be agreed | Pass on window. Default open-visit rule still not stated |
| Trails (hero, screen 6) | n/a | n/a | not shown | n/a | Acceptable as a model-hall story device. Any real capture must show its window |

Little's Law: still no WIP, throughput or lead-time figures, so nothing can contradict anything. One trolley in work and three queued for over an hour at one inspection station is a plausible slow station, the same on screens 1, 3 and 4. No OEE claim, no "up to", no percentages, no before-and-after figure. "Prove the numbers" is the only phrase that edges towards an outcome, and it attaches to no number.
