# Reader panel, round 1: P5 OT and Maintenance Reader

SIMULATION. This is a simulated buyer reading, built on a hypothesis profile (kit 09 section 6). No interviews yet.

I'm reading this on my phone after a shift. Two breakdowns today, and the PM schedule has slipped again. Eighteen years in maintenance. I've pulled out one RTLS system that died in the racking. Whatever goes on my columns is mine at 2 a.m. I read the footnotes first.

---

## Concept A

**1. After the hero.** "A small tag goes on what moves, anchors on my columns pick it up, and a live map shows where each thing is and how long it's been sitting." That's right. It's the only hero of the three that tells me there's hardware on my steel. "Anchors on your columns" is my word. That's the line I'll be judged on.

**2. Screen by screen.**
- Nav: fine. "Specifications" and "How it works" sit under Platform, which is where I'd look. "Uses" is a weak word, but it doesn't bother me.
- Hero: clear. The film shows anchors on the columns at about 5 m, and nothing glows. Good. The before film shows "scan desks", which I understood. Nothing read twice.
- Screen 2, Where work waits: not my screen, but "The tag reports itself, so nobody feeds the system by hand" is a line my supervisors would like. "One team in India designs, builds and supports every part" gets half a nod from me. Supports it how fast, though? Nothing read twice.
- Screen 3, Ask your floor: I skimmed it. "MCP" is a word I don't know. "The server runs where AmIHub runs, even on a PC in your plant with no internet" is the line I care about. If the internet drops, the floor still works. Good.
- Screen 4, One system: this is my screen, and it's mostly honest. "Down to ±10 cm with AmIMo anchors. Your site sets the final figure." Good: it names the condition and names the anchors. Read twice:
  - "Anchors need only power. They sync over the air, with no data cables." (13 words). The render shows an RJ45 port on the anchor. If I power it over PoE, I'm pulling a network cable to every column. So "no data cables" isn't quite true unless you say DC or PoE, with no separate data or sync run. The page says DC or PoE only on the AmIMo page, not here. Send it back.
  - "Built on the FiRa and omlox specifications, with NXP Trimension UWB silicon inside." (13 words). Does "built on" mean certified, compliant or "inspired by"? I don't trust "built on".
  - "Runs in automotive, robotics and warehousing plants." (7 words). Which plants? Can I call their maintenance head? I don't trust it until there's a name or a count.
- Screen 5, Start with one bay: "We survey the floor and plan the anchors." That's the line that makes it for me. A survey before any anchor count. "Your MES stays in charge" is fine.
- Footer: "OT, IT and security: Trust and data". There's no row for me by name, and Trust and data is the IT man's page, not mine. Read twice: "AmIMotion builds industrial spatial intelligence." (5 words). It's the third time it says this, and I still can't tell you what "spatial intelligence" is. "Specifications are indicative. Final datasheets are shared under NDA." An NDA to see a datasheet makes me wonder what's in it.

Words I didn't know or didn't trust: spatial intelligence, Physical AI, MCP, "built on" (specifications), "over the air" (sync how? UWB? Does it hold if one anchor drops?), indicative.

**3. Where I'd stop.** I wouldn't stop. Screen 4 kept me because it gave a conditioned accuracy line and said anchors sync over the air. Screen 3 nearly lost me.

**4. My question at the end.** "What happens after a power cut? Do the anchors re-sync on their own, and what does the map show for the minutes they were down?" Nothing on the homepage says, and nothing links to it. Second question: "How does it hold up around steel racking and moving forklifts?"

**5. Score: 6/10.** I'd keep reading. I wouldn't forward it yet.

---

## Concept B

**1. After the hero.** "A small tag on each trolley, bin and tool, and a live map that shows where it is and how long it's waited, so nobody walks the floor." That's partly right. The copy never says how the tag is heard, so it could be software sitting on scans. The film fixes that, though: it climbs past an anchor on a column with one power cable running down. That's the best hardware moment of the three, but it's in the picture, not the words.

**2. Screen by screen.**
- Nav: "How it works" first, and in the footer there's "Automation and OT: How it works on a steel floor". That's my row, with my words. Best routing for me in any concept. Nothing read twice.
- Hero: "You find out from a screen, not a walk." I like it. It's my supervisors' life. In the film, the anchor has "debossed 'amimotion' on its side". As far as I know the deboss is on the tag's top cover. The anchor is body, cap and RJ45 port. Check it against the CAD. If it isn't in the CAD, it's invented, and I'll notice. Also, the film shows one power cable and no RJ45 cable. Is that DC? Then say so somewhere.
- Screen 2, Find it: "The walk. The calls to stores. The second walk." That's real. A real AmIHub screen capture beats any drawing. Nothing read twice.
- Screen 3, Ask your floor: "We show it live on the call." Fair: no promise beyond a demo. "MCP" is still a word I don't know.
- Screen 4, How it knows: the most useful screen across all three concepts. Mounting "3 to 8 m up". "Hears each pulse and the angle it came from." Finally, how it locates a tag. Battery "1 to 3 years, depending on use", with its condition. Then it slips. Read twice:
  - "Every trolley tells the room where it is." (8 words). Tells the room? The tag sends a pulse and anchors hear it. Say that. It's a headline pretending to be technical.
  - "Works out where each tag is, down to ±10 cm depending on your site." (14 words). It drops "with AmIMo anchors". Without that, ±10 cm reads like a system-wide claim. Send it back.
  - "Needs only power. No data cables to run." (7 words). Power how, DC or PoE? Same problem as A, and worse, because it doesn't even say it on the screen. Send it back.
  - "Sends a short pulse when it moves and sleeps when it stops." (12 words). Fine, but it raised a question: if a tag on a stopped trolley is asleep, is "how long it has waited" the time since its last pulse? Then say "last seen".
  - The closing paragraph ("This is spatial intelligence… Physical AI…") lost me. 60 words of category talk at the bottom of my screen.
- Screen 5, Start with one bay: "We survey your floor and plan the anchors." Good. "Each stage has a check before the next, and you can stop at any of them." Good. That's the technical gate I look for. "Which walk would you cut first?" is a nice question, but not for me.
- Footer: my row exists. Same distrust of "indicative… under NDA".

Words I didn't know or didn't trust: spatial intelligence, Physical AI, MCP, "tells the room", the anchor deboss.

**3. Where I'd stop.** At the bottom of screen 4, in the category paragraph. By then I'd have what I came for, and I'd jump to "How it works on a steel floor".

**4. My question at the end.** Same as A: "What happens after a power cut, and how do the anchors sync?" B says how a tag is heard (pulse and angle) but never how anchors keep time together, and never what happens after an outage. Also: "What's the anchor spacing, roughly, before the survey?"

**5. Score: 7/10.** It's the only concept where, inside 90 seconds, I could tell my plant head how it locates a tag (pulse, time and angle at anchors 3 to 8 m up) and what my site needs (power at each anchor, a survey first). Three lines need fixing before I'd forward it.

---

## Concept C

**1. After the hero.** "Some software that shows where every tagged trolley, pallet and tool is and how long it's waited." Half right. No tag, no anchor, no "how" in the hero copy. It could be a dashboard on top of my scanners. The split-floor film is clever, and it has no radio cartoon. That I respect.

**2. Screen by screen.**
- Nav: "Start small" is a good label. "How it works" is first. Fine.
- Hero: the "seam is a real painted aisle line" film is smart. Two people walking the floor in a render will look fake, and I'd cut them. Nothing read twice.
- Screen 2, the camera comes down to the trolley: the best spec block of the three. "Down to ±10 cm, with AmIMo anchors. Your site sets the final figure." Conditioned, with the anchors named. "Tags sleep when still, so a battery lasts 1 to 3 years, depending on use." Conditioned. "No data or sync cables to run. Anchors need only power, DC or PoE." It names DC or PoE. The anchor still has the RJ45 port facing down, the way the CAD shows it. Good. Read twice: "No data or sync cables to run." (7 words). With PoE I'm still running a network cable. Say "no separate data or sync cabling". Close, but not exact. What's missing is mounting height. The copy says "on the columns" but never 3 to 8 m. The 5 m in the still is the only clue.
- Screen 3, rise over the whole floor: "A long wait shows you where to look. Why it waited stays your team's call." That's honest. "Anchors visible as small dark boxes on the column tops. No coverage circles." Good, no rings. Nothing read twice.
- Screen 4, Ask your floor: read twice: "This is spatial intelligence. AmIHub keeps the place and time of everything tagged, joined with your zones, so people, your systems and AI assistants read the same floor." (30 words). It's too long, and I still can't define "spatial intelligence". MCP, again.
- Screen 5, Start with one bay: "Talks to MES, ERP and WMS over REST, MQTT and WebSocket." That's specific, and my MES colleague will like it. "Runs on a PC inside your plant, with no internet." Good. But **there's no site survey anywhere on this homepage.** A pilot "watches one flow in one bay", and nobody says who comes and looks at my steel first. For me that's the gap. It's the line that tells me you've been burned by racking before. Read twice: "Runs in automotive manufacturing, robotics and warehousing." (6 words). Which sites?
- Footer: plain index. No row for OT, but "Specifications" is in column 1. No "indicative" line, which I don't miss.

Words I didn't know or didn't trust: spatial intelligence, Physical AI, MCP, "Runs in…".

**3. Where I'd stop.** I wouldn't stop. But I'd finish without knowing anyone surveys my floor.

**4. My question at the end.** "Who surveys the floor before you tell me how many anchors I need, and what happens after a power cut?"

**5. Score: 5/10.** It has the cleanest spec wording on the page, but the hero doesn't say there's hardware, and there's no survey. Without a survey I don't believe the ±10 cm, however well it's worded.

---

## 6. Ranking: B, A, C

1. **B** is the only one that tells me how it locates a tag (pulse, time and angle) and where the anchor goes (3 to 8 m on a column), then promises a survey and a stop gate. It also gives me my own footer row: "How it works on a steel floor".
2. **A** has honest accuracy, a survey and "sync over the air", but it never says mounting height or DC or PoE, and "no data cables" fights the RJ45 port in the render.
3. **C** has the best-worded specs, but it has no survey and no hardware in the hero. For the man who owns the ceiling, that's the one that matters.

## 7. Best and worst lines

- **Best:** "We survey the floor and plan the anchors." (A, screen 5; B says the same.) It's the sentence that tells me the numbers have conditions behind them.
- **Worst:** "Needs only power. No data cables to run." (B, screen 4). It names no DC or PoE, and the anchor in the render has an RJ45 port. It's the kind of line I've heard before, from people who said "plugs right in".

## 8. One change that would make B a 10

Rewrite B's AmIMo block on screen 4 to carry every condition. Put the outage answer one link away. Something like:

> **AmIMo anchor.** Fixed to a column or wall 3 to 8 m up. Hears each pulse, its arrival time and its angle. About 50 m line of sight, depending on your site. A site survey sets the final anchor count. Powered by DC or PoE, with no separate data or sync cabling. [How it works on a steel floor, and after a power cut]

That one block, plus "down to ±10 cm with AmIMo anchors" restored and the anchor deboss checked against the CAD, and I'd forward it to my plant head with "let's get them in for a survey".

---

## Re-read log (sentences read twice, with word count)

| Concept | Sentence | Words | Why |
|---|---|---|---|
| A | "Anchors need only power. They sync over the air, with no data cables." | 13 | PoE with an RJ45 port is a data cable. DC or PoE isn't stated. |
| A | "Built on the FiRa and omlox specifications, with NXP Trimension UWB silicon inside." | 13 | "Built on" could mean certified or not. |
| A | "Runs in automotive, robotics and warehousing plants." | 7 | Unverified. No site named. |
| A | "AmIMotion builds industrial spatial intelligence." | 5 | Third time I've read the category. Still undefined. |
| B | "Every trolley tells the room where it is." | 8 | Vague physics. |
| B | "Works out where each tag is, down to ±10 cm depending on your site." | 14 | "With AmIMo anchors" is missing. |
| B | "Needs only power. No data cables to run." | 7 | Says neither DC nor PoE. Clashes with the RJ45 port. |
| B | "Sends a short pulse when it moves and sleeps when it stops." | 12 | Is dwell counted from the last pulse? |
| C | "No data or sync cables to run." | 7 | With PoE there's still a network cable. Say "separate". |
| C | "This is spatial intelligence. AmIHub keeps the place and time of everything tagged, joined with your zones, so people, your systems and AI assistants read the same floor." | 30 | Too long. Category still undefined. |
| C | "Runs in automotive manufacturing, robotics and warehousing." | 6 | Unverified. No site named. |

## Spec audit, numbers and their conditions

| Concept | Number | Condition on the page | Verdict |
|---|---|---|---|
| A | ±10 cm | "with AmIMo anchors. Your site sets the final figure" | Pass |
| A | Power | "need only power… no data cables" | Fail: DC or PoE not stated |
| A | Mounting height, coverage | Not stated | Gap |
| B | ±10 cm | "depending on your site" | Fail: "with AmIMo anchors" missing |
| B | 3 to 8 m | Stated | Pass |
| B | 1 to 3 years battery | "depending on use" | Pass |
| B | Power | "Needs only power. No data cables" | Fail: DC or PoE not stated |
| C | ±10 cm | "with AmIMo anchors. Your site sets the final figure" | Pass |
| C | 1 to 3 years battery | "depending on use" | Pass |
| C | Power | "DC or PoE" | Pass, but "separate" is wanted before "data or sync cables" |
| C | Mounting height | Not stated in copy | Gap |
| All | Coverage about 50 m line of sight, site-dependent | Not on any homepage | Gap |
| All | Recovery after power loss | Not on any homepage, not linked | Gap, flagged |
| All | Hard cases (zone boundary, load blocking the tag, signal loss, leaving coverage) | Not named | Gap (acceptable for a homepage if linked) |
| All | UWB, BLE and Wi-Fi FTM on the same anchors | Not mentioned | Neutral for a homepage |

Renders against the CAD: A and C stay within the CAD (tag top cover deboss, anchor RJ45 port). In B's hero film, the anchor shows a debossed "amimotion" on its side, which I couldn't match to the CAD parts list. Check it before render.
