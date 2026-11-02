# Reader panel, round 5 (homepage v5): Industrial Engineer Reader (P3)

SIMULATION. This is a hypothesis buyer from kit 09 section 6, not an interview. I read it cold on a phone: section 3 screen copy and pictures, plus the nav and footer, nothing else. The cold read comes first. A second pass after it only audits definitions.

The test is the same as last round. In 90 seconds, can I say what this measures and how it defines a wait: entry event, exit event, time window, and what happens to a carrier still in the zone at shift end? Is there a baseline, with a window, before any before-and-after?

---

## 1. After the hero only

"AmIMotion puts a small tag on each trolley, bin and tool, anchors on the columns hear it, and one live map shows where each thing went and how long it has waited."

Right. The hero is unchanged, so my sentence is too. "How long it has waited" is still a promise with no definition on this screen. That's fine for a hero, because screen 3 pays it.

## 2. Screen by screen

- **Nav.** "How waits are timed: Zones, rules, entries and exits." Last round it said "limits". "Rules" is wider and vaguer. A limit is a number I can put on a Yamazumi chart. A rule could be anything. "Measure before you claim: Set a baseline first" and "Specifications: Every figure and its condition" are still the two rows that make me trust the rest. "Time spent searching: Your own numbers" still makes me nervous. If that tool prints a "you will save" figure, I'm gone.
- **Hero.** Unchanged and still passes. The trails have no time window, but it's a model hall, so they read as a story device.
- **Find it.** Cleaner without the phone clause. "You see where it was last seen, and when." One field, last observed, with its time. "It goes on the trolley, not on the person pushing it." Still the line I'd pin on the floor's notice board. Nothing re-read. The picture's trail ending where the trolley stands is honest: the end of the line is the last fix, not a claim.
- **See where work waits.** Still my screen, and the big v4 fault is fixed. "Link a trolley to each job it carries, in AmIHub or from your own system." "Each job it carries" admits one trolley carries many jobs. "Once" is gone. Read once. "Its wait becomes that job's wait." Only through the link. Good. It still doesn't say when the link ends, so the hand-off from job A to job B is implied, not stated. I'll take that to the association page. "Supervisors see each wait live, during the shift, not at the next morning's review." Good for my supervisors, and it doesn't claim any outcome. Then I re-read this: "Set rules for each zone. AmIHub streams zone events to any system you name." In v4 the limit fired the event. Here they're two sentences side by side, and I read them twice to work out whether the rule triggers the stream or the stream is every entry and exit. On the second read I decided it's every zone event, and the rules are something else I'm not told. Streaming every entry and exit is actually better for me: that's my raw event export, which is one of my standing questions. But "rules" has lost the threshold I liked. "Why it waited is for your team to say." Symptom, not root cause. Still holds. Still missing in words: how a carrier on a zone boundary counts, and the queue versus in-process split. The picture does that split (one blue at the station, three amber in the queue). The words still don't.
- **Ask your floor.** "Which trolleys have waited at inspection for more than an hour?" Zone, threshold and unit, in one question. In v4 it matched the zone limit on screen 3. Now screen 3 has no limit, so this question is the only place a threshold appears. It still works as a query. "Asking changes nothing." "Any change ... needs a person's approval." "A person's" instead of "a supervisor's" is fine. The floor has to hear those two lines before "AI" gets near them. The IT block isn't for me. I read "Every request it makes is logged." and stopped.
- **One system.** I read the anchor block, because a dwell figure is only as good as the zone's coverage. "Each reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count." Radius, condition, survey. "Down to ±10 cm. How close depends on your floor." AmIMo anchors and site-dependent in one block. Zone logic on screen 3 still doesn't lean on that precision. "Raises an alert if one goes dark." Still the data-quality line I need. Still doesn't say what happens to waits timed in that zone while it's dark, but that belongs on "When a tag goes quiet". "The specifications also list an Ethernet option." is an odd sentence. It tells me where a fact is, not the fact. Not my problem. "Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited." That's the right split of ownership, and my production manager will like it.
- **Start with one bay.** "The pilot times today's waits first, over a window you choose. That is your baseline." Still the best line on the page. "Before it starts, we agree how to count a wait that runs past shift end." Shorter and clearer than v4's "still open at shift end counts". It's still a promise to agree, not a default. "You see your own waits in one bay, and prove the numbers, before you decide on more." "Prove the numbers" is still there. Which numbers, against what? The page makes no number claim, so there's nothing to prove. I read it as "check the waits are right", and I wish it said that. "Tagging people would be a separate project. It would need its own policy." Honest, and less than v4 said. Fine by me. "Prices and pilot options are shared under NDA, after the first call." Fine. Not my budget.
- **Footer.** "Lean and IE leads: How waits are timed." My row, kept. The entity paragraph still has the three-part model: time-stamped location, your zones, the jobs you link to each carrier. I skipped "Physical AI" again.

## 3. Where I would stop

I wouldn't stop. I'd slow once on screen 3, at "Set rules for each zone", and open "How waits are timed" and "Which job is on the trolley?" in new tabs. Nothing broke my trust. Unlike v4, nothing on my screen is wrong. The issue now is a word that's too vague, not a word that's wrong.

## 4. The question I still have

"A trolley enters the inspection queue at 21:50 on job A and is still there at the 22:00 shift change. At 22:10 job A comes off and job B goes on, still in the queue. What does AmIHub do by default with the shift-end visit (carry it, split it or close it)? Is the 20 minutes split between job A and job B at the moment of the unlink? And what is a 'rule' on a zone: a time limit, a capacity limit, or both?"

## 5. Score

**9/10.** In 90 seconds I can say what it measures: time from entry to exit in zones I name, shown live while still open, every zone event streamed to my own system, tied to a job only through a link, per job. The baseline has a window I choose. I'd forward screens 3 and 6 to my production manager today. Not a 10, because the shift-end default is still only a promise, and "rules" took the threshold away from the screen where I define my waits.

## 6. Compared with version 4 (9/10)

Better. "Once" is gone, so the job link now reads as per job, and the events stream to any named system, which is my raw export. The shift-end line is clearer.
Same score. The shift-end default is still unstated, there's still no boundary rule, the link's end is still implied, and "rules" is vaguer than the "limit" it replaced.

## 7. Best and worst line

**Best:** "The pilot times today's waits first, over a window you choose. That is your baseline." (Screen 6.) 16 words. It sets a baseline before any claim, with a window and no invented duration. It's the first row of my pilot scorecard.

**Worst:** "Set rules for each zone." (Screen 3.) 5 words, on the screen that defines my metric, and it defines nothing. A rule for what? Time, count, alert? In v4 it was a limit that sent an event. Now it's a word I can't put on a scorecard.

## 8. One change that would make it a 10

State the shift-end default on screen 6 once the founders confirm it, in place of the agree-later line. For example, only if it's true: "A wait still open at shift end stays open and keeps counting, unless you agree another rule with us." If AmIHub splits or closes the visit, say that instead.

(Smaller, on screen 3: give "rules" one concrete example from the source, such as "Set rules for each zone, such as a time limit." Make the link's end explicit: "While a trolley and a job are linked, its wait is that job's wait." On screen 6, "check the waits are right" for "prove the numbers".)

---

## Re-read log (cold read only)

| Screen | Line | Words | Why |
|---|---|---|---|
| 3 | "Set rules for each zone. AmIHub streams zone events to any system you name." | 14 | I re-read to work out whether the rule triggers the stream or every zone event streams. Decided the second, and that "rules" is undefined |

One line, down from two in v4. Both v4 lines ("passes it", "once") are gone and their replacements read once.

Words I didn't know or didn't trust: "rules" (screen 3 and nav, too vague to define a metric), "prove the numbers" (screen 6, still vague), "streams" (fine, but I'd want to know the event schema), FiRa, omlox, Trimension, MCP (not for me), Physical AI (skipped).

## Metric audit (second pass)

| Metric shown | Entry event | Exit event | Time window | Open visits | Verdict |
|---|---|---|---|---|---|
| Hero: "how long it has waited" | not on hero | not on hero | none | not on hero | Pass as a promise. Screen 3 defines it |
| Screen 2: "last seen, and when" | n/a | n/a | n/a | n/a | Pass. One field, last observed |
| Screen 3: wait in a zone | zone entry | zone exit | live | shown while open | Pass. Boundary rule not said |
| Screen 3: zone rules | not said | not said | not said | not said | Amber. Named, undefined. v4's limit was clearer |
| Screen 3: zone events streamed | entry | exit | live | n/a | Pass. Raw events to a named system answers "Can I export the raw events?" in principle. Schema on /learn/dwell-time/ |
| Screen 3: job's wait | via link | via link (implied) | live | as above | Pass, was amber. "Each job it carries" is per job. The link's end is still implied |
| Screen 4: "more than an hour" | inspection queue zone | n/a | 1 hour | yes | Pass as a story question. Now the only threshold on the page |
| Screen 5: "1 to 3 years" | n/a | n/a | n/a | n/a | Pass. "Depending on use" attached |
| Screen 5: "about 50 m around it" | n/a | n/a | n/a | n/a | Pass. Radius, line of sight, survey condition |
| Screen 5: "±10 cm" | n/a | n/a | n/a | n/a | Pass. AmIMo anchors and site-dependent |
| Screen 6: baseline | today's waits | | window you choose | shift-end rule to be agreed | Pass on window. Default open-visit rule still not stated |
| Trails (hero, screen 2, screen 6) | n/a | n/a | not shown | n/a | Acceptable as model-hall story devices. Any real capture must show its window |

Little's Law: still no WIP, throughput or lead-time figures, so nothing can contradict anything. One trolley in work and three queued past an hour at one inspection station is a plausible slow station, and the counts match across screens 3 and 4. No OEE claim, no "up to", no percentages, no before-and-after figure. "Prove the numbers" is still the only phrase that leans towards an outcome, and it's attached to no number.
