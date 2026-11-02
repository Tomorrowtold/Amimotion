# Reader 06: MES, ERP and IT reader (P6 application owner, P7 security head)

SIMULATION. I am a hypothesis buyer built from kit 09 section 6, not an interview. I read sections 3 and 4 only, cold, on a phone between a change-request meeting and a firewall review. Two voices throughout: **App** (the MES/ERP owner: "who owns status?") and **Sec** (the security head: "where does data go?").

My 90-second test: can each voice say how it connects to our systems and where data lives, would I forward it to the plant head with "IT is fine to talk", and did I re-read nothing.

---

## Concept A

### 1. After the hero only
Say-back: "A tag on things that move, anchors on columns, and a live map that shows where each thing is and how long it has sat."
Is that right? Yes, for what it is. It says nothing about my systems, and the hero isn't the place for that. "Spatial intelligence" is a category word I don't trust yet. The three sentences after it carry the meaning, so I can skip it.

### 2. Screen by screen
- **Nav.** Platform, Uses, Pilot, Learn, Company. "For developers" is buried under Platform and "Trust and data" under Company. I found them, but I had to open two menus. "Uses" is an odd word. I read it as a verb at first.
- **Hero.** Clean. 38 words, nothing that overclaims. App: fine. Sec: nothing yet about where data goes, which is OK at this point.
- **Where work waits.** App: "Scans say where it was. Tags say where it is." is smart and doesn't attack my scanners. "Your systems log a scan at each station" respects my MES. Good. But "Search its name" made me ask *whose* name, the asset's or the job's? That is the association question and it isn't answered. "One team in India designs, builds and supports every part" sits inside the WIP block and feels pasted in.
- **Ask your floor.** The best screen in the round for Sec. "Each assistant gets its own access. Every call is logged." and "The server runs where AmIHub runs, even on a PC in your plant with no internet." Those two lines answer the questions I'd normally have to chase in a questionnaire. "A person approves any action" is there. App: the example question is a real one. I relaxed here.
- **One system.** App: "Then it shares them with your MES, ERP, WMS and AI assistants." **Read twice.** "Shares with" plus a list of systems sounds like there are native connectors behind it. Over what? REST? MQTT? Who pushes, who pulls? No protocol is named anywhere on this page. The plain-type row "MES · ERP · WMS · AI assistants" is the logo wall I hate, just without logos. Sec: "on a PC in your plant with no internet, or in the cloud". Whose cloud? "Runs in automotive, robotics and warehousing plants" with no names doesn't prove anything to me. "Every claim on this site says what it rests on" is a promise I'll test on the Trust page.
- **Start with one bay.** App: "Your MES stays in charge." That's the line I came for. It's four words inside a paragraph, but it's there. Sec: nothing new. "Before anyone calls you" is good. If the diagnostic asks for my email first, I'll remember that.
- **Footer.** App: "MES and ERP owners: How tags link to jobs" is exactly my door, and it names the association page. Sec: "OT, IT and security: Trust and data" is also my door. The entity paragraph's "joins that location with your zones and with the jobs you link to each carrier" is the only sentence in the round that states the association contract (tag to carrier to job). It's in the footer, though, where only crawlers and I will find it. "Physical AI" shows up here. It doesn't hurt much in the footer, but I noticed it.

Words I didn't know or didn't trust: "spatial intelligence", "Physical AI", "shares them with", "Uses" (nav).

### 3. Where I'd stop
I wouldn't stop, but screen 4 is where I'd jump to /developers/ to find out whether "shares them with your MES, ERP" means a connector or an API. If the developer page doesn't show a real event, I'm gone.

### 4. Question at the end
App: "What does the event look like, and what happens when it repeats? Does my MES pull, or does AmIHub push?"
Sec: "If it runs in the cloud, whose cloud, and what leaves my plant?"

### 5. Score: 6 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | Respects my MES. Doesn't say how it talks to it. | The MCP screen is better than most vendor security pages. |
| Winning line | "Your MES stays in charge." | "Each assistant gets its own access. Every call is logged." |
| Losing line | "Then it shares them with your MES, ERP, WMS and AI assistants." | "or in the cloud." (whose?) |
| Forward target | Footer link "How tags link to jobs" | Footer link "Trust and data" |
| Open question | Push or pull, and is it idempotent? | Cloud operator and data residency |

---

## Concept B

### 1. After the hero only
Say-back: "A tag on trolleys, bins and tools, and a live map that tells you where they are and how long they've waited, so nobody walks to find them."
Is that right? Yes. It's the plainest hero of the three for a plant head. Nothing in it is for me, and that's fine for a hero.

### 2. Screen by screen
- **Nav.** How it works, Where it helps, Your floor, Company. Clear. "Ask your floor (MCP)" and "For developers" sit under How it works, good. "Trust and data" is under Company. I'd rather it were one level up.
- **Hero.** Fine. The anchor on the column in the film is a nice touch for my OT colleague.
- **Find it.** App: "The map shows where it is, when it was last seen and how long it has stood there." "When it was last seen" is honest about stale data, which I like. A real AmIHub screen capture would get more trust from me than any render. Not my screen, though.
- **Ask your floor.** Sec: "AmIHub has a built-in MCP server, so the assistant your team already uses can connect." **Read twice.** Our assistant is whatever group IT approved, and it might not speak MCP. That's an "integrates with everything" sentence wearing AI clothes. There are no per-agent credentials and nothing on where it runs. "Every request is logged" is good. "We show it live on the call" is honest.
- **How it knows.** App: "Sends what it knows to your MES, ERP and WMS. Your MES stays in charge." The second sentence is right. The first has the same no-protocol problem as A. Then the category paragraph: "This is spatial intelligence: the exact place and time of everything that moves in your plant, joined with jobs and zones." **Read twice.** *Everything* that moves? Only what's tagged. *Joined with jobs*? Joined how, by whom? Location isn't job status until we agree an association, and this sentence skips that step. This is the line I'd send back. Sec: "Runs on a PC inside your plant with no internet, or in the cloud." Fine. Whose cloud is unanswered again. "Physical AI" in the body copy made me roll my eyes. Tag specs (battery, 3 to 8 m, power only) will please OT.
- **Start with one bay.** App: "Your MES stays in charge" again, good. "You can stop at any of them" is good for the plant head. "Which walk would you cut first?" isn't for me but it's a good close.
- **Footer.** App: "MES and ERP: For developers." That's OK, but no association page is offered anywhere, so I'm left guessing how tags link to work orders. Sec: "IT and security: Trust and data" is my door. "Safety: People and privacy" matters to me too. The company paragraph says "one live map, inside your plant", which contradicts the cloud option two screens up. Pick one or say both.

Words I didn't know or didn't trust: "spatial intelligence", "Physical AI", "everything that moves", "joined with jobs", "the assistant your team already uses".

### 3. Where I'd stop
At screen 4, on "joined with jobs and zones". Silently turning location into job status is the exact pattern that ends with me owning the reconciliation. I'd keep scrolling only to see whether the MES line saves it, and it does, partly.

### 4. Question at the end
App: "Who links a tag to a job, and where does that link live, in AmIHub or in my MES?"
Sec: "What credentials does an assistant get, and what can it call?"

### 5. Score: 4 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | Written for the plant head. I'm an afterthought. | Friendly, but the MCP screen hand-waves access. |
| Winning line | "When it was last seen" (honest staleness) | "Every request is logged." |
| Losing line | "...everything that moves in your plant, joined with jobs and zones." | "...so the assistant your team already uses can connect." |
| Forward target | None I'd forward as IT | Footer "Trust and data" |
| Open question | Association ownership | Agent credentials and scope |

---

## Concept C

### 1. After the hero only
Say-back: "Spatial intelligence for plants: it shows where every tagged trolley, pallet and tool is and how long it has waited."
Is that right? Yes, and the word "tagged" is in it, which tells me someone careful wrote it. It opens on the category word, which I don't trust, but the sentence after it does the work.

### 2. Screen by screen
- **Nav.** How it works, Where it helps, Start small, Company. In the menu, "Trust and data (where your data lives)" is the best nav description in the round. It's my question, worded my way. "For developers (API and MCP docs)" tells me docs exist. Good.
- **Hero.** The split floor is clear. Sec: the scene brief puts two untagged people walking on the floor. On a phone, I can't tell they aren't tracked. My privacy colleague will ask. Either cut them or make it obvious they carry nothing.
- **Your trolleys say where they are.** App: three parts in three sentences. Clear. OT will like "No data or sync cables to run. Anchors need only power, DC or PoE." Sec: PoE means it's on my network, and that's the right thing to tell me early.
- **See where work waits.** App: "A long wait shows you where to look. Why it waited stays your team's call." That's the right boundary. It doesn't pretend dwell is diagnosis.
- **Ask your floor a question.** Sec: "Each assistant gets its own access, and every call is logged." Good. "A person approves any action." Good. Unlike A, it doesn't say here where the MCP server runs. App: "so people, your systems and AI assistants read the same floor" is a good, quiet source-of-truth-adjacent line. The category paragraph says "joined with your zones" and leaves jobs out, which is honest. "Physical AI" is in the body again. I skimmed past it.
- **Start with one bay.** This is the screen that wins me. "Your MES stays in charge." "Runs on a PC inside your plant, with no internet. Or in the cloud." "Talks to MES, ERP and WMS over REST, MQTT and WebSocket." It's the only concept that names a protocol. That's what lets me say "IT is fine to talk." Sec: whose cloud is still unsaid. "Runs in automotive manufacturing, robotics and warehousing" means nothing without a name, so cut it or prove it. The stack of four claim lines reads like a spec list. That's fine for me, but the plant head might glaze.
- **Footer.** App: there's no association page ("How tags link to jobs") anywhere in the nav or footer. That's the one gap. Sec: "Trust and data" is listed, and specs and developers are one tap away.

Line read twice: "Built on the FiRa and omlox specifications. Talks to MES, ERP and WMS over REST, MQTT and WebSocket." I re-read it because it's two sentences jammed into one line and my eye merged them. It wasn't a meaning problem. 18 words.
Words I didn't know or didn't trust: "spatial intelligence", "Physical AI", "Or in the cloud" (whose).

### 3. Where I'd stop
I wouldn't stop. Screen 5 is where I'd tap "For developers" to check whether a real event payload with an observed-at timestamp sits behind "REST, MQTT and WebSocket".

### 4. Question at the end
App: "How does a tag get linked to a carrier and a carrier to a job, and which system holds that link?"
Sec: "Who runs the cloud option, and does the on-prem PC need any outbound connection at all, even for licensing or updates?"

### 5. Score: 7 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | Someone here has met an MES owner. | It answers "where does data go" before I ask. |
| Winning line | "Talks to MES, ERP and WMS over REST, MQTT and WebSocket." | "Trust and data (where your data lives)" |
| Losing line | (missing) no word on how tags link to jobs | "Or in the cloud." |
| Forward target | Screen 5 plus "For developers" | "Trust and data" |
| Open question | Association contract | Cloud operator, outbound traffic |

---

## 6. Ranking: C, A, B

1. **C** is the only one that names protocols and puts on-prem, MES-in-charge and interfaces in one place. In 90 seconds it gives me both answers: how it connects and where data lives.
2. **A** has the best MCP security block and the only association link ("How tags link to jobs"), but "shares them with your MES, ERP, WMS" with no protocol reads like a native-connector claim.
3. **B** is written for the plant head. It says "joined with jobs" without an association, and "the assistant your team already uses can connect" is the integrates-with-everything line I veto.

## 7. Best and worst line

**Best:** "Talks to MES, ERP and WMS over REST, MQTT and WebSocket." (C, screen 5). It's the one sentence that turns "integrates" into something I can test. Runner-up: "The server runs where AmIHub runs, even on a PC in your plant with no internet." (A, screen 3)

**Worst:** "This is spatial intelligence: the exact place and time of everything that moves in your plant, joined with jobs and zones." (B, screen 4). "Everything" isn't true (only tagged things), and "joined with jobs" hides the association step and the question of who owns status. Send it back. Correct wording: "AmIHub keeps the place and time of everything you tag. You link each tagged carrier to a job, and your MES keeps the job's status."

## 8. One change to make C a 10 for me

Add one line to screen 5, right after "Your MES stays in charge.", and make it a link to a real sample event on /developers/:

> "You link each tag to a carrier and each carrier to a job. AmIHub sends a time-stamped event; your MES decides the status. [See a real event](/developers/)"

That states the association contract and the source-of-truth line, and it proves the payload exists. Also, carry A's "even on a PC in your plant with no internet" into C's MCP screen, and say who runs the cloud or drop "Or in the cloud."

## Re-read log
| Concept | Line | Words |
|---|---|---|
| A | "Then it shares them with your MES, ERP, WMS and AI assistants." | 11 |
| B | "AmIHub has a built-in MCP server, so the assistant your team already uses can connect." | 15 |
| B | "This is spatial intelligence: the exact place and time of everything that moves in your plant, joined with jobs and zones." | 21 |
| C | "Built on the FiRa and omlox specifications. Talks to MES, ERP and WMS over REST, MQTT and WebSocket." | 18 |

Pass/fail against my test: no concept passes cleanly. C comes closest: both voices get their answers, but the association contract is missing and one line needed a re-read.
