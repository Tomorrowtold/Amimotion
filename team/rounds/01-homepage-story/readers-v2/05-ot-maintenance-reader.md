# Reader panel, homepage v2: P5 OT and Maintenance Reader

SIMULATION. This is a simulated buyer reading, built on a hypothesis profile (kit 09 section 6). No interviews yet.

I'm on my phone in the maintenance office. A conveyor drive tripped twice this morning and the PM list slipped again. Anything that goes up on my columns, I own at 2 a.m. I read the footnotes first, and I went through this the same way.

---

## 1. After the hero only

**Said back:** "They put a small tag on each trolley, bin and tool, anchors on my columns pick it up, and one live map shows where each thing is and how long it has been sitting."

**Is that right?** Yes. "Anchors on your columns hear it" is the line I'm looking for. It tells me in the first screen that there's hardware on my steel and that it's mine to mount and power. The first words are still "spatial intelligence", and they don't help me, but the next three sentences fix that. The film shows four dark boxes on the columns at about 5 m, with no rings and no glow. That's how it should be.

## 2. Screen by screen

- **Nav.** "How it works" comes first, and under it are "How it locates a tag: Steel, racking and signal" and "When a tag goes quiet: Last seen, sleep and gaps". Those are my two pages, in my words. "How many anchors you need: A first estimate" made me wary. An estimate before a survey is how anchor counts get promised in a sales meeting and then broken in the racking. It's only acceptable if that page says straight away that the survey sets the count. Nothing read twice.
- **Screen 1, Hero.** Clear. The before film with checkpoint desks and a trolley vanishing behind the racks is real. That's the trolley I get a call about. Nothing read twice. I don't trust the word "spatial intelligence" yet.
- **Screen 2, Find it.** "The walk. The calls to stores. The second walk." That's true on my floor too. Read twice: **"The tag reports its own position, so nobody scans it along the way."** (13 words). The tag doesn't know its position. It sends a pulse, the anchors hear it, and AmIHub works the position out. Screen 5 says exactly that, so this line contradicts it. Write "The tag reports itself" or "The tag sends its own signal". An engineer reading this will think somebody doesn't know how their own system works.
- **Screen 3, See where work waits.** Not my screen, but it's honest: "Why it waited stays your team's call." My one question is a trolley parked right on a zone line. Does it flicker in and out and rack up false entries? That's a hard case, and I'd expect it on the "How waits are timed" page. Nothing read twice.
- **Screen 4, Ask your floor.** I skimmed it. MCP is defined now ("an open standard that lets AI assistants use other software"), so I don't need to look it up. "The server runs where AmIHub runs, including on a PC inside your plant" and "every request it makes is logged" are the two lines that matter to me. If an AI is near my floor, I want it logged and inside the fence. Nothing read twice.
- **Screen 5, One system.** My screen, and the best spec block I've seen from them.
  - AmIGo: "While it sleeps, the map shows where it was last seen." That answers the question I had in round 1 about dwell on a sleeping tag. "1 to 3 years, depending on use" has its condition. Pass.
  - AmIMo: "3 to 8 m up". "DC or PoE". "They sync over the air." "We survey your floor and plan the anchors." Height, power, sync and a survey all fit in one block. That's what I'd write.
  - AmIHub: "down to ±10 cm with AmIMo anchors. Your site sets the final figure." It's conditioned and names the anchors. Pass. "Runs on a PC inside your plant with no internet" is good.
  - Render: the anchor's RJ45 port faces down, it's fixed by its own tab, and there's one plain power cable. On the tag, the deboss is on the cover. Nothing invented that I can see. The alt text says "network port", which is honest.
  - Read twice: **"No data or sync cables to run."** (7 words). This is the same complaint as round 1, and it still isn't fixed. The sentence before it says PoE, and PoE is a network cable to every column. My electrician will read "no data cables" and then pull Cat6. Write "No separate data or sync cabling." It's one word.
  - Read twice: **"Hears each pulse as it arrives."** (6 words). Hears it and does what? Round 1 B said "hears each pulse and the angle it came from", and that told me how it locates. This version tells me nothing about how, so the reader who wants the physics is left at "it hears". Give it back the time and the angle, or say "times each pulse as it arrives".
  - Didn't trust: "Built on the FiRa and omlox specifications." I still don't know if "built on" means certified, compliant or neither.
  - Missing: coverage. There's no "about 50 m line of sight, depending on your site". Without it I can't even guess the anchor spacing for a 120 m hall before the survey.
- **Screen 6, Start with one bay.** "plus our survey of your floor" is in the list of what I buy. Good: the survey is a line item, not a favour. "One contract and one support line" is good, but who replaces a failed anchor, and how fast? The line I liked in round 1, "Each stage has a check before the next, and you can stop at any of them", is gone, and I miss it. It was the technical gate. Nothing read twice.
- **Footer.** "Maintenance and OT: How it locates a tag". It's my row, my name, and a page I'd open. Still don't trust: "Specifications are indicative. Final datasheets are shared under NDA." I've said it before: making me sign an NDA to read a datasheet makes me think the footnotes are bad. "Physical AI" appears once at the bottom, and I skipped it.

**Words I didn't know or didn't trust:** spatial intelligence (it's still the first thing I read), "reports its own position", "built on" (specifications), indicative, "a first estimate" (anchors), Physical AI.

## 3. Where I'd stop scrolling

I wouldn't stop. I'd skim screen 4 and slow down on screen 5. From screen 5 I'd jump to "How it locates a tag" before reaching screen 6, because that's where I expect the steel, racking and outage answers.

## 4. My question at the end

"What happens after a power cut? Do the anchors re-sync over the air on their own, how long does that take, and what does the map show for the tags it couldn't see in that time?" "When a tag goes quiet" covers the tag side. Nothing on the page or in the nav covers the anchor side: what happens when an anchor drops, or when the whole bay loses power.

## 5. Score

**8/10.** In 90 seconds I can tell my plant head what goes on the columns, how high, what power it needs and that they survey first, and every number has its condition. I'd forward it once the PoE line and the "reports its own position" line are fixed and recovery is linked.

---

## 6. Compared with the best of round 1 (Concept B, 7/10)

**Better.** It keeps B's height, survey and pulse, and adds what B was missing: DC or PoE, "with AmIMo anchors" on the ±10 cm, "last seen" for a sleeping tag, and a nav that names steel, racking and quiet tags.
It loses B's "pulse and angle" explanation and the stop-at-any-stage gate, and "no data or sync cables" still clashes with PoE.

## 7. Best and worst lines

- **Best:** "Anchors need only power, from DC or PoE. They sync over the air." It's the first time a homepage has told me what each column needs, with the power named.
- **Worst:** "The tag reports its own position, so nobody scans it along the way." It's wrong about the physics, and screen 5 contradicts it.

## 8. One change that would make it a 10

Rewrite the AmIMo block so it carries the coverage condition, the method and the outage link, and fix the cabling word:

> **AmIMo anchor.** Fixed to a column or wall 3 to 8 m up. Times each pulse and the angle it arrives from. About 50 m line of sight, depending on your site. Powered by DC or PoE, with no separate data or sync cabling. Anchors sync over the air and rejoin on their own after a power cut. We survey your floor and plan the anchors. [What happens after a power cut](/technology/)

The rejoin sentence only goes in if engineering confirms it. If it can't be confirmed, keep the link and put the honest answer on that page. Also change screen 2 to "The tag sends its own signal". With those two changes I'd send it to my plant head today with "let's get them in for a survey".

---

## Re-read log (sentences read twice, with word count)

| Screen | Sentence | Words | Why |
|---|---|---|---|
| 2 | "The tag reports its own position, so nobody scans it along the way." | 13 | The tag doesn't compute its position. Anchors and AmIHub do. Screen 5 contradicts it. |
| 5 | "No data or sync cables to run." | 7 | With PoE there's a network cable. Say "separate". Not fixed since round 1. |
| 5 | "Hears each pulse as it arrives." | 6 | Doesn't say what it measures (time, angle). Weaker than round 1 B. |

## Spec audit, numbers and their conditions

| Number or claim | Condition on the page | Verdict |
|---|---|---|
| ±10 cm | "with AmIMo anchors. Your site sets the final figure" | Pass |
| 3 to 8 m mounting | Stated, column or wall | Pass |
| 1 to 3 years battery | "depending on use" | Pass |
| Power | "DC or PoE" | Pass |
| Cabling | "No data or sync cables to run" | Fail: needs "separate", because PoE is a network cable |
| Sync | "over the air" | Pass as wording. Behaviour after an outage isn't stated. |
| Survey | "We survey your floor and plan the anchors", and the survey is listed in what you buy | Pass |
| Coverage, about 50 m line of sight, site-dependent | Not on the page | Gap |
| Recovery after power loss | Not on the page or in the nav | Gap, flagged |
| Hard cases (steel, racking, signal loss, quiet tag) | Linked by name in the nav ("Steel, racking and signal", "Last seen, sleep and gaps") | Acceptable for a homepage |
| Anchor count tool | "A first estimate" | Watch: that page must put the survey above the estimate |
| UWB, BLE and Wi-Fi FTM on the same anchors | Not mentioned | Neutral for a homepage |

Renders against the CAD. AmIGo has the deboss on its cover and is screwed through its own ears. AmIMo is fixed by its own tab, has the RJ45 port facing down and one plain power cable. Nothing invented. One note: one plain power cable means a DC install. If the render is ever redone as PoE, the single cable is the network cable into the RJ45, and the copy has to match whichever it shows.
