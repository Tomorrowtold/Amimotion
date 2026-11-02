# Reader 06, v5: MES, ERP and IT reader (P6 application owner, P7 security head)

SIMULATION. I'm a hypothesis buyer built from kit 09 section 6, not someone who was interviewed. I read sections 3 and 4 only, cold, on a phone. I read in two voices: **App** (the MES/ERP owner, asking "who owns status?") and **Sec** (the security head, asking "where does data go?").

---

## 1. After the hero only

Say-back: "Tags on trolleys, bins and tools, anchors on the columns that hear them, and one live map showing where each thing went and how long it has waited."

Is that right? Yes. It's the same hero as v4 and it's still honest. I skip "spatial intelligence" and the next four sentences do the work. App: nothing for my systems yet, which is correct for a hero. Sec: nothing about data yet, which is fine.

## 2. Screen by screen

- **Nav.** Unchanged and still right. "Trust and data: Where your data lives" and "For developers: API and MCP docs" are under How it works, where I look. "How waits are timed: Zones, rules, entries and exits" is a better label than v4's. It tells me the dwell page has the event model, so it's a page I'd open.
- **Hero.** Clean. Nothing overclaims.
- **Find it.** Sec: the phone clause is gone, and with it my "how does a phone reach a hub that needs no internet" flag. App: "You see where it was last seen, and when" is still one field with a timestamp. That's what I want. "It goes on the trolley, not on the person pushing it" saves my privacy colleague a question. Nothing read twice.
- **See where work waits.** App: "AmIHub streams zone events to any system you name" is the right shape. It's events leaving AmIHub for my system, with no "native SAP". "Streams" tells me MQTT or WebSocket rather than polling, and I'll check that on /learn/dwell-time/. **Read twice:** "Link a trolley to each job it carries ... Its wait becomes that job's wait." "Each job" is plural, "that job" is singular. Can one trolley carry three jobs at once? If so, does each of them get the full wait? That's a real association question (one carrier to many orders), and the line half-raises it and then drops it. v4's "link each trolley to its job once" was cleaner for me, even if "once" was ambiguous. **Didn't trust:** "Set rules for each zone." Rules that do what? Raise an event, set a threshold, send an alert? Three words that mean nothing to a reader, so they read as filler. "Why it waited is for your team to say" is still the right boundary.
- **Ask your floor.** Sec: still the best MCP block I've read on a vendor homepage. "Asking changes nothing" is the read/write split. "Raising a work order in AmIHub" keeps the write inside AmIHub, not my MES. Per-assistant access, read-only or allowed actions, and every request logged: that's my questionnaire answered in one line. "Needs a person's approval" is now "a person's" rather than "a supervisor's". That's fine, but it's still absolute. If approval can be configured off for any action, this line fails an audit. The /trust/ page has to show that it can't be.
- **One system.** App: "Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited." This isn't a re-read any more. The second sentence tells me what AmIHub adds to the job, not what it owns. It still doesn't name the key (my job number), so the AmIHub "work order" on screen 4 is still a slightly separate record in my head. But I can reconcile it now without stopping. **Didn't fully trust:** "It connects to your MES, ERP and WMS through open REST, MQTT, WebSocket and omlox hub interfaces." "Connects to your MES" is one step stronger than "offers interfaces your MES can use". Someone in my team will read it as "there's a connector for our SAP". "Can connect" or "Your MES, ERP and WMS connect through..." would close that. Sec: "Runs on a PC inside your plant, with no internet needed" is still the only deployment story. Good. **Read twice:** "The specifications also list an Ethernet option." "Also list" sounds like a footnote written by a lawyer. Is there an Ethernet anchor or not? I care, because a wired anchor on my OT VLAN is a very different conversation from a Wi-Fi client. Either say "Ethernet backhaul is an option" or leave it to /specs/. As written, it makes me suspicious that it exists on paper only. "Raises an alert if one goes dark" is the device health I want.
- **Start with one bay.** Sec: "A second plant gets its own survey, and AmIHub can run both from one console. Ask us how the two connect." That's honest. It doesn't pretend to answer the WAN question, and it tells me to ask, which I will. I'd rather have five words of fact ("over your own network"), but a deferral beats v4's silent "joins the same console". "One contract and one support line" is still silent on remote access into the plant PC. That's the first thing my vendor-access policy asks. App: "Your team or your integrator can build on it at any layer, through open interfaces" is still good. The people lines are now shorter and still right.
- **Footer.** "MES and ERP owners: Which job is on the trolley?" and "IT and security: Trust and data" are both the right doors. The entity paragraph says "the jobs you link to each carrier", which is careful. "Physical AI" appears once, and I moved on.

Words I didn't know or didn't trust: "spatial intelligence" (skipped), "set rules" (rules for what?), "each job it carries" against "that job" (one carrier, many orders?), "connects to your MES" (connector or interface?), "also list an Ethernet option" (real or on paper?), "one support line" (remote access?).

## 3. Where I'd stop

I wouldn't stop. I'd slow at screen 3 on the job link and at screen 5 on the Ethernet sentence. Then I'd tap "Which job is on the trolley?" and "For developers" for a real event, and "Trust and data" for remote access and Wi-Fi security. The homepage has earned those taps. If those pages are thin, it loses them.

## 4. The question I still have at the end

App: "Show me one zone event, with tag ID, carrier ID, zone, entered and exited, observed-at, and tell me what happens when it's sent twice. When a trolley carries several of my orders, what does AmIHub link it to: my MES job number, and how many?"
Sec: "How does the second plant's hub reach the console, and what can your support line reach inside my plant?"

## 5. Score: 9 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | The MES line now says what AmIHub adds, so I don't have to reconcile two job records. | The phone is gone and the second-plant line admits it's a question. Nothing quietly reopens the network path. |
| Winning line | "AmIHub adds where its trolley is and how long it has waited." | "Each assistant gets its own access: read-only, or only the actions you allow. Every request it makes is logged." |
| Losing line | "Link a trolley to each job it carries ... Its wait becomes that job's wait." | "The specifications also list an Ethernet option." |
| Forward target | "Which job is on the trolley?" | "Trust and data" |
| Open question | Sample event, idempotency, the MES job key, one carrier to many orders | Multi-site path, support remote access, Wi-Fi security |

My test: within 90 seconds both voices can say how it connects (open interfaces, zone events streamed to a named system, the link in AmIHub or pushed from mine) and where data lives (a PC in the plant, no internet). Would I forward it to the plant head with "IT is fine to talk"? Yes, today. Did I read nothing twice? No. Two short lines, but neither one is a source-of-truth problem any more. So it's still a near pass, not a clean one.

## 6. Compared with version 4 (9/10)

Slightly better, same score. v5 fixed my v4 worst line (the MES line now says what AmIHub adds), dropped the phone, and was honest about the second plant.
It isn't a 10 because the job-link sentence got blurrier ("each job it carries"), and the new Ethernet sentence hedges so hard I doubt the option exists.

## 7. Best line and worst line

**Best:** "Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited." (screen 5). It's the source-of-truth line done right: who owns status, and what location adds, in 19 words.

**Worst:** "The specifications also list an Ethernet option." (screen 5). It's a sentence about a document, not about the product. To a security head, a hedged sentence about the network is worse than no sentence.

## 8. One change that would make it a 10 for me

On screen 3, name the key and the cardinality: "Link a trolley to the jobs it carries, by your MES job number, in AmIHub or from your own system." (Or whatever the source supports.) That one line is the association contract I came for. With it, the screen 4 work order and the screen 5 MES line both fall into place.

(Smaller items, not the 10: on screen 5, either "Ethernet backhaul is an option" or cut the sentence and leave it to /specs/. Change "connects to your MES" to "your MES, ERP and WMS connect through". Give "Set rules for each zone" one example, such as "a time limit". Make "For developers" a "See a real event" link.)

## Re-read log

| Screen | Line | Words |
|---|---|---|
| 3 | "Link a trolley to each job it carries, in AmIHub or from your own system. ... Its wait becomes that job's wait." | 21 |
| 5 | "The specifications also list an Ethernet option." | 7 |
