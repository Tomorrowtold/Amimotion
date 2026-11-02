# Reader 06, v4: MES, ERP and IT reader (P6 application owner, P7 security head)

SIMULATION. I'm a hypothesis buyer built from kit 09 section 6, not someone who was interviewed. I read sections 3 and 4 only, cold, on a phone. I read in two voices: **App** (the MES/ERP owner, asking "who owns status?") and **Sec** (the security head, asking "where does data go?").

---

## 1. After the hero only

Say-back: "Small tags on trolleys, bins and tools, anchors on the columns that hear them, and one live map showing where each thing went and how long it has waited."

Is that right? Yes. The hero is the same as v3 and still honest. I skip "spatial intelligence" again and the next four sentences carry it. App: there's nothing for my systems here, which is correct for a hero. Sec: nothing on data yet, which is also fine.

## 2. Screen by screen

- **Nav.** "Trust and data: Where your data lives" now sits under How it works, so the security head finds it where he looks. That's fixed. "For developers: API and MCP docs" is in the same panel. "Which job is on the trolley?" is still under "Where it helps", but the footer gives it to MES owners by name, so I can live with it.
- **Hero.** Clean. Nothing overclaims.
- **Find it.** App: "You see where it was last seen, and when" is still one field, which is good. Sec: **didn't trust** "on a screen or on your phone". Screen 5 says no internet is needed, so how does my supervisor's phone reach a hub inside the plant? Over plant Wi-Fi, a VPN, or some relay you run? That's one word away from a cloud question. It's not a re-read, but it is a flag.
- **See where work waits.** App: this is the screen I came for, and it answered both my v3 questions. "Link each trolley to its job once, in AmIHub or from your own system" says where the association lives and that my system can push it. "When a trolley passes it, AmIHub sends the event to the system you name" is an event leaving AmIHub for a system, not "alerts", and that's the right shape. I want to see that event, with its zone, its ID and an observed-at timestamp, and to know what happens when it arrives twice. That belongs on /learn/dwell-time/ and /developers/, not here. "Why it waited stays your team's call" is still the right boundary.
- **Ask your floor.** Sec: still the best MCP block I've read on a vendor homepage. "Asking changes nothing" is new, and it's the read/write split in three words. "In AmIHub" closes my v3 worst line: the work order lands in AmIHub, not my MES. The approval is now "a supervisor's" and "any change", and with "only the actions you allow" the two finally fit: you allow the action, and the supervisor approves each use. Without "can require", it's stronger than the soft source line. If the product can be configured to skip approval, this line becomes a lie in someone's audit.
- **One system.** App: **read twice:** "Your MES stays in charge of every job." Two screens ago AmIHub raises work orders and holds the trolley-to-job link. So there are now job-shaped records in two systems. Which one wins when they disagree? "In charge of every job" is the right intent, but next to "raising a work order in AmIHub" I had to stop and reconcile it. Say AmIHub work orders are floor tasks, or say the MES job ID is the key AmIHub links to. "Open REST, MQTT, WebSocket and omlox hub interfaces" is still interfaces, not "native SAP". Good. Sec: the cloud clause is gone. "Runs on a PC inside your plant, with no internet needed" is now the only deployment story, and that ends four rounds of "whose cloud". "Sends its data to AmIHub over Wi-Fi" answers my v3 re-read. Now I know it's a Wi-Fi client on my network, which brings its own questions: which SSID, WPA2-Enterprise or PSK, and which VLAN. Those are Trust-page questions, and at least it's honest, not "fully wireless". "Raises an alert if one goes dark" is the device health I want.
- **Start with one bay.** App: "Your team or your integrator can build on it at any layer, through open interfaces" is a place for my integrator with no fake partner programme. Sec: "Tagging people would be a separate project. It would need its own policy and the consent of the people tagged." That's better than v3's "yours", and my privacy colleague will forward that line herself. **Didn't trust** "A second plant joins the same console": over what link? Does plant two's hub talk to plant one's across my WAN, or do both report to a central console? With "no internet needed" on screen 5, I need to know which. "One support line" is still silent on remote access into the plant PC. The build notes say /trust/ will answer both, but a buyer doesn't see the build notes.
- **Footer.** "MES and ERP owners: Which job is on the trolley?" and "IT and security: Trust and data" are both the right doors. The entity paragraph is careful: "the jobs you link to each carrier". "Physical AI" appears once, and I moved on.

Words I didn't know or didn't trust: "spatial intelligence" (skipped), "on your phone" (over what network?), "same console" for a second plant (over what link?), "one support line" (remote access?), "work order" in AmIHub against "MES stays in charge of every job" (two job records?).

## 3. Where I'd stop

I wouldn't stop. I'd slow once at screen 5 on the MES line, then tap "For developers" for a real event and "Trust and data" for the Wi-Fi and remote-access answers. The homepage has now earned those taps, and if those pages are thin it loses them.

## 4. The question I still have at the end

App: "What does the zone event look like, with ID, zone and observed-at, and what happens when it's sent twice? When AmIHub raises a work order, how does it tie back to my MES job number?"
Sec: "How do the phone and a second plant reach a hub that needs no internet, and what can your support line reach inside my plant?"

## 5. Score: 9 / 10

| | App (P6) | Sec (P7) |
|---|---|---|
| First reaction | Where the link lives, and that an event goes to my system: both answered in one screen. | The cloud is gone and the anchor backhaul is named. Four rounds of nagging paid off. |
| Winning line | "Link each trolley to its job once, in AmIHub or from your own system." | "If the assistant runs inside your network too, nothing has to leave it." |
| Losing line | "Your MES stays in charge of every job." (next to work orders raised in AmIHub) | "A second plant joins the same console, with its own survey." (over what link?) |
| Forward target | "Which job is on the trolley?" | "Trust and data" |
| Open question | Sample event, idempotency, MES job key | Phone and multi-site path, support remote access, Wi-Fi security |

My test: within 90 seconds both voices can say how it connects (open interfaces, events to a named system, link in AmIHub or pushed in) and where data lives (a PC in the plant, no internet). Would I forward it to the plant head with "IT is fine to talk"? Yes, today, without the caveat I attached in v3. Did I read nothing twice? No, one line. So it's a near pass, not a clean one.

## 6. Compared with v3 (8/10)

Better. v4 fixed all three things I asked for: the cloud clause is cut, the work order is "in AmIHub", and the anchor backhaul is named as Wi-Fi. It also says where the job link lives and moves Trust where security looks.
It isn't a 10 because "work order in AmIHub" now sits awkwardly beside "MES in charge of every job", and the phone and second-plant lines quietly reopen the network-path question the cloud cut closed.

## 7. Best line and worst line

**Best:** "Link each trolley to its job once, in AmIHub or from your own system." (screen 3). It's the association contract, its owner and my system's way in, in fourteen words.

**Worst:** "Your MES stays in charge of every job." (screen 5). It's the right intent, but two screens after AmIHub raises work orders it reads as a contradiction until you work it out. It's the one line I read twice.

## 8. One change that would make it a 10 for me

On screen 5, make the source-of-truth line name the key: "Your MES stays in charge of every job. AmIHub links to its job number." (or similar). Then the AmIHub work order on screen 4 reads as a floor task tied to my job, not a second job record.

(Smaller items, not the 10: on screen 6, add five words on how a second plant connects ("over your own network"), if the source supports it. On screen 2, "on a phone on your plant network" if true. Make "For developers" a "See a real event" link.)

## Re-read log

| Screen | Line | Words |
|---|---|---|
| 5 | "Your MES stays in charge of every job." | 8 |
