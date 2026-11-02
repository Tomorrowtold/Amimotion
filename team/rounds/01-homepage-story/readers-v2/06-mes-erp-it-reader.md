# Reader 06, v2: MES, ERP and IT reader (P6 application owner, P7 security head)

SIMULATION. I'm a hypothesis buyer built from kit 09 section 6, not someone who was interviewed. I read sections 3 and 4 only, cold, on a phone between a change-request meeting and a firewall review. I read in two voices: **App** (the MES/ERP owner, asking "who owns status?") and **Sec** (the security head, asking "where does data go?").

---

## 1. After the hero only

Say-back: "A small tag on each trolley, bin and tool, anchors on the columns, and one live map that shows where each thing is and how long it has waited."

Is that right? Yes. It's the same as round 1, and the hero isn't where my systems belong. "Spatial intelligence" still opens the paragraph. I still don't trust it, but the four sentences after it do the work, so I skip past it. "Each trolley, bin and tool" is fine. The footer later says "everything you tag", which is the careful version.

## 2. Screen by screen

- **Nav.** How it works, Where it helps, Start small, About us. "For developers: API and MCP docs" is under How it works, so I know docs exist. "Which job is on the trolley? Linking tags to jobs" is my question, worded my way. In round 1 C lacked that page and only A had it. But it sits under "Where it helps", where I wouldn't look first. "Trust and data: Where your data lives" is still under "About us", and a security head doesn't open "About us". The footer rescues both.
- **Hero.** Clean. Nothing overclaims. App: nothing for me, which is fine. Sec: nothing yet on data, which is OK at this point.
- **Find it.** App: "Your systems log a scan at each checkpoint" respects my MES and my scanners, and "A scan tells you where it was. A tag tells you where it is." doesn't attack them. "Look it up on the map" no longer raises "search *whose* name?", so that problem from round 1 A is gone. Small nag: this screen says "when it last moved", and screen 5 says "where it was last seen". To me, last moved and last observed are different fields. Pick one.
- **See where work waits.** App: "Why it waited stays your team's call." That's the right boundary, because dwell isn't diagnosis. "You name the zones" tells me the zone model is ours to configure. No complaints.
- **Ask your floor.** Sec: this is the best MCP block I've seen on a vendor homepage. "MCP is an open standard that lets AI assistants use other software" is a plain definition with no hype. "Any assistant that supports MCP can connect" is conditional, so it fixes round 1 B's "the assistant your team already uses". "We show it live on a call" is honest AMBER. "Each assistant gets its own access, and every request it makes is logged" covers per-agent credentials and the audit trail. "A person approves any action" is good. **Read twice:** "The server runs where AmIHub runs, including on a PC inside your plant." Round 1 A said "with no internet" here, and this version drops it. I went back over it because the real Sec question is the assistant, not the server. If our approved assistant is a cloud model, the answer about my floor leaves the plant through it. The page doesn't say what data the assistant receives. App: the question in bold is a real one I'd get from a plant head.
- **One system.** This is the screen that wins me. "Open REST, MQTT and WebSocket interfaces connect it to your MES, ERP and WMS. You link each tagged carrier to its job. Your MES stays in charge." That's three sentences, and they cover protocol, association and source of truth, the three things I came for. It's almost the line I asked for in round 1. "Open ... interfaces" tells me it's an API I wire up, not a native connector someone is pretending exists. "Runs on a PC inside your plant with no internet" is the on-prem answer, stated plainly. Sec: "or in the cloud" still doesn't say whose cloud. It's the same gap for the third round running. "Anchors need only power, from DC or PoE" tells me early that the anchors are on my network, which is good. "Built on the FiRa and omlox specifications" uses the right word. It doesn't claim certified or compliant. App: the AmIHub block is the longest of the three (about 50 words), and my lines sit at its end, under the ±10 cm figure. An app owner skimming at 15 seconds may never reach them.
- **Start with one bay.** App: nothing new for me here. "Your MES stays in charge" isn't repeated, which is fine since screen 5 carries it. Sec: "A pilot tags carriers, not people" is a real answer for my privacy colleague. "One team owns every layer, so you have one contract and one support line" leaves me asking whether the support line means remote access into my plant PC. That's for the Trust page, not here. "Before anyone calls you" is good. If the diagnostic asks for my email first, I'll remember it.
- **Footer.** App: "MES and ERP owners: Which job is on the trolley?" is exactly my door. Sec: "IT and security: Trust and data" is my door too. The entity paragraph "a time-stamped location to everything you tag ... joins that location with your zones and with the jobs you link to each carrier" is correct and careful. "Physical AI" appears once here and nowhere else. I noticed it and moved on.

Words I didn't know or didn't trust: "spatial intelligence" (category word, skipped), "or in the cloud" (whose?), "support line" (does it mean remote access?), "last moved" against "last seen" (two fields or one?).

## 3. Where I'd stop

I wouldn't stop. At screen 5 I'd tap "For developers" to check that a real event, with an ID, a zone and an observed-at timestamp, sits behind "REST, MQTT and WebSocket". Then I'd open "Which job is on the trolley?" to see where the tag-to-job link lives. If either page is thin, I'm gone, but the homepage has done its job.

## 4. The question I still have at the end

App: "When I link a carrier to a job, does that link live in AmIHub or in my MES, and what happens when the same zone-entry event arrives twice?"
Sec: "Who runs the cloud option? And when an assistant asks the floor a question, what data goes to that assistant's model, and from there out of my plant?"

## 5. Score: 8 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | Protocol, association and MES in charge, all in one block. Someone listened. | The MCP block reads like it was written for my questionnaire. |
| Winning line | "Open REST, MQTT and WebSocket interfaces connect it to your MES, ERP and WMS." | "Each assistant gets its own access, and every request it makes is logged." |
| Losing line | "Look it up on the map. You see where it is and when it last moved." ("last moved" against "last seen") | "Runs on a PC inside your plant with no internet, or in the cloud." (whose?) |
| Forward target | Screen 5, then "Which job is on the trolley?" | "Trust and data" |
| Open question | Where the job link lives, and idempotency | Cloud operator, and what data the assistant sends out |

My test: within 90 seconds both voices can say how it connects and where data lives, so that's a pass. Would I forward it to the plant head with "IT is fine to talk"? Nearly. Did I read nothing twice? No: one line. That's not a clean pass, but it's the closest yet.

## 6. Compared with the best of round 1 (C, 7/10)

Better. v2 keeps C's protocol line and on-prem line, takes A's MCP security block and A's association door, and adds "You link each tagged carrier to its job". That was the association contract I asked for, and no round 1 concept had it on a screen.
It's not a 10 because the cloud is still nobody's, and the MCP line lost round 1 A's "with no internet".

## 7. Best line and worst line

**Best:** "You link each tagged carrier to its job. Your MES stays in charge." (screen 5). These nine words state the association step and the source-of-truth line, which is what keeps me from owning a reconciliation.

**Worst:** "The server runs where AmIHub runs, including on a PC inside your plant." (screen 4). It swaps round 1's "with no internet" for "including", which tells me less. It also answers where the server runs while Sec is asking about the assistant.

## 8. One change that would make it a 10 for me

On screen 4, replace the server line with: "The server runs where AmIHub runs, even on a PC in your plant with no internet. You choose which assistant connects and what it can read." That one change answers the Sec question v2 leaves open.

(Smaller items, not the 10: name who runs the cloud on screen 5 or cut "or in the cloud", and make "For developers" a "See a real event" link to a sample payload with an observed-at timestamp.)

## Re-read log

| Screen | Line | Words |
|---|---|---|
| 4 | "The server runs where AmIHub runs, including on a PC inside your plant." | 13 |
