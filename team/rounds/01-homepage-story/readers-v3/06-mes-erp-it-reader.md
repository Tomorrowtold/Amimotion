# Reader 06, v3: MES, ERP and IT reader (P6 application owner, P7 security head)

SIMULATION. I'm a hypothesis buyer built from kit 09 section 6, not someone who was interviewed. I read sections 3 and 4 only, cold, on a phone. I read in two voices: **App** (the MES/ERP owner, asking "who owns status?") and **Sec** (the security head, asking "where does data go?").

---

## 1. After the hero only

Say-back: "A tag on each trolley, bin and tool, anchors on the columns that hear it, and one live map that shows where each thing went and how long it has waited."

Is that right? Yes. "Where it went" instead of v2's "where it is" is the honest version for a tag that sleeps, and I noticed it. I still skip "spatial intelligence". The four sentences after it do the work. App: there's nothing for my systems here, and that's correct for a hero. Sec: nothing on data yet, which is fine.

## 2. Screen by screen

- **Nav.** "For developers: API and MCP docs" is under How it works, so docs exist. "Which job is on the trolley? Linking trolleys to jobs" is my question, but it's still under "Where it helps", where an app owner doesn't look. "Trust and data" is still under "About us", and a security head never opens "About us". The footer rescues both again. "How to buy: Call, NDA pack, survey, pilot" is new and plain. Procurement will ask me about the NDA pack, so I'm glad it's named.
- **Hero.** Clean. Nothing overclaims.
- **Find it.** App: "You see where it was last seen, and when." That fixes my v2 nag, because it's one field now and not "last moved" against "last seen". "Your systems log a scan at each checkpoint" still respects my MES and scanners. "The tag sends a pulse as it moves, so nobody scans it along the way" is the right physics. The tag sends and the hub works out the position. No complaints.
- **See where work waits.** App: this is where the association moved, and it's better here. "Link each trolley to its job, and its wait becomes the job's wait." That's the contract stated: tag to carrier to job, and the job comes only from the link. "We agree with you how to link them before the pilot" means we agree the association before go-live, not after a mess. It still doesn't say whether the link lives in AmIHub or in my MES. The "Which job is on the trolley?" link sits right under it, so I'd tap. "Why it waited stays your team's call" is still the right boundary.
- **Ask your floor.** Sec: still the best MCP block I've read on a vendor homepage, and better than v2. "If the assistant runs inside your network too, nothing has to leave it." That's a condition, honestly stated, and it answers my v2 question. The flip side, that a cloud assistant means data leaves, is implied rather than hidden. I can live with that, and Trust can spell it out. "Each assistant gets its own access: read-only, or only the actions you allow" is per-agent credentials and tool scope in plain words. "Every request it makes is logged" covers the audit trail. "We show it live on a call" keeps it AMBER. **Read twice:** "Any change, such as raising a work order, needs a person to approve it." App: raising a work order *where*? Work orders live in my MES or CMMS. Screen 5 says "Your MES stays in charge of every job." If AmIHub raises a work order inside its own system, then fine, but say so. If it writes into mine, that's a connector, and nobody has shown me one. Sec: "needs a person" every time is stronger than "write actions can require supervisor approval". If I allow an action under "only the actions you allow", does it still need a person? The two sentences don't quite agree.
- **One system.** App: "It connects to your MES, ERP and WMS through open REST, MQTT, WebSocket and omlox hub interfaces." The omlox hub interface is now named, and it's still "interfaces", not "native SAP". "Your MES stays in charge of every job" is the source-of-truth line, and "of every job" is tighter than v2. Good. "Runs on a PC inside your plant with no internet" is the on-prem answer, plain. Sec: "or in the cloud" still says nothing about whose cloud. That's the same gap four rounds running. **Read twice:** "It syncs over the air. No separate data or sync cabling." With DC power and no data cable, how does what the anchor hears reach AmIHub? Over the air to what? Is it a radio onto my plant network, a gateway, or its own mesh? That's a VLAN and IT/OT boundary question, and this sentence opens it without closing it. With PoE the anchor is on my network, so "separate" makes sense for PoE but not for DC. "Built on the FiRa and omlox specifications" is still the right word.
- **Start with one bay.** App: "Your team or your integrator can build on its open interfaces." Good. It's a place for my integrator with no fake partner programme. Sec: "The pilot tags trolleys, bins and pallets, not people. Tagging people is a separate decision, and yours." My privacy colleague will like that. "One team owns every layer, so you have one contract and one support line." I still don't know whether the support line means remote access into the plant PC. "One AmIHub console can also run more than one site." Sec flag: one console across sites means site-to-site traffic over my WAN, or a central hub somewhere. Which one, and is that the cloud option again? It's a new question this version opens.
- **Footer.** "MES and ERP owners: Which job is on the trolley?" and "IT and security: Trust and data" are both my doors, and both are right. The entity paragraph is still careful: "the jobs you link to each carrier". "Physical AI" appears once. I noticed it and moved on.

Words I didn't know or didn't trust: "spatial intelligence" (skipped), "or in the cloud" (whose?), "raising a work order" (in which system?), "syncs over the air" (onto what network?), "one support line" (remote access?), "more than one site" from one console (over what link?).

## 3. Where I'd stop

I wouldn't stop. I'd slow down at screen 4 over the work-order line, then at screen 5 I'd tap "For developers" to look for a real event with an ID, a zone and an observed-at timestamp. Then I'd open "Which job is on the trolley?". If those pages are thin, the homepage's goodwill goes with them.

## 4. The question I still have at the end

App: "Does the trolley-to-job link live in AmIHub or in my MES? When the same zone-entry event arrives twice, what happens? And when the assistant 'raises a work order', whose system does it land in?"
Sec: "Who runs the cloud option, and how does a DC-powered anchor get its data to AmIHub without touching my network?"

## 5. Score: 8 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | The association moved to where the wait is, and "last seen" is one field now. They listened. | They answered my assistant question with a condition instead of a promise. That's the right instinct. |
| Winning line | "Link each trolley to its job, and its wait becomes the job's wait." | "If the assistant runs inside your network too, nothing has to leave it." |
| Losing line | "Any change, such as raising a work order, needs a person to approve it." (whose system?) | "Runs on a PC inside your plant with no internet, or in the cloud." (whose cloud, again) |
| Forward target | "Which job is on the trolley?" | "Trust and data" |
| Open question | Where the link lives, idempotency, where the work order lands | Cloud operator, anchor backhaul path, multi-site link |

My test: within 90 seconds both voices can say how it connects and where data lives, except for the cloud. Would I forward it to the plant head with "IT is fine to talk"? Yes, with one caveat attached. Did I read nothing twice? No, two lines. That's not a clean pass.

## 6. Compared with v2 (8/10)

Better, though the score is the same. v3 fixed both things I asked for: one "last seen" field, and the assistant condition on screen 4. It also put the association contract beside the wait and named the omlox hub interface.
It isn't higher because it fixed two lines and opened two new ones ("raising a work order", "syncs over the air"), and the cloud is still nobody's.

## 7. Best line and worst line

**Best:** "If the assistant runs inside your network too, nothing has to leave it." (screen 4). It's a condition, not a promise, and it answers the one question every security questionnaire asks about AI.

**Worst:** "Any change, such as raising a work order, needs a person to approve it." (screen 4). Without saying which system, it implies a write into my MES or CMMS that no connector backs. And "needs a person" every time is stronger than the source's "can require approval".

## 8. One change that would make it a 10 for me

On screen 5, say who runs the cloud in five words ("or in a cloud we host", or "or in your own cloud"), or cut "or in the cloud" from the homepage. It's the only "where does data go" gap left, and it's been open for four rounds.

(Smaller items, not the 10: on screen 4, say where the work order is raised ("in AmIHub") or swap in an example that stays inside AmIHub, and match the approval wording to the source. On screen 5, say how anchor data reaches AmIHub with DC power, or keep only "Needs only power, from DC or PoE." Make "For developers" a "See a real event" link.)

## Re-read log

| Screen | Line | Words |
|---|---|---|
| 4 | "Any change, such as raising a work order, needs a person to approve it." | 14 |
| 5 | "It syncs over the air. No separate data or sync cabling." | 11 |
