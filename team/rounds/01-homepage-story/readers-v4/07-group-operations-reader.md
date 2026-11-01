# Reader panel, round 1, v4: Group Operations Reader (P8, expansion sponsor)

**SIMULATION.** This is a hypothesis buyer from kit 09 section 6, read by the panel. No real interviews sit behind it.

Same read as before: on my phone, in the car between a Chennai plant visit and a steering committee. I read only section 3 (the screens) and section 4 (the nav and footer). I want three things: the category in one line, a story that repeats across eleven plants, and an AI line I can take to the board without it blowing up on me.

---

## 1. After the hero only
Say-back: "AmIMotion is spatial intelligence for factories and warehouses: a tag on what moves, anchors on the columns that hear it, and one live map of where it went and how long it has waited."

Is that right? Yes. It is the same hero as v3, and it still works. The category comes first. Physical AI is not in the opening. Hardware and software read as one chain in four sentences. I can say it back to my board.

## 2. Screen by screen
- **Nav.** The same four words. "Trust and data" now sits under How it works. My CIO will look there first, so that is the right place. "Robotics and AMRs: Robots and carriers on one map" is still location only. Good.
- **Hero.** Calm. The poster is still my "why" slide.
- **Screen 2, "A scan tells you where it last passed. A tag tells you where it stopped."** They made my small fix, and I did not re-read it. "Last passed" settles which checkpoint. It is quotable to a board now: scan versus tag in two lines. "On a screen or on your phone" is for my supervisors, and I skim it. "It goes on the trolley, not on the person pushing it" still saves me a works-committee meeting in two plants.
- **Screen 3, See where work waits.** This is the screen that grew most for me. "When a trolley passes it, AmIHub sends the event to the system you name." That is interoperability in a sentence I can use, with no vendor names and no lock-in. "Link each trolley to its job once, in AmIHub or from your own system." That answers my v3 template worry in part: the link can come from our own MES, so the method can be a group standard. "Why it waited stays your team's call" is honest. It tells me nobody is selling me AI root cause.
- **Screen 4, Ask your floor.** Still my board screen. "Asking changes nothing." Three words, and the AI question is answered without overclaim. "Any change, such as raising a work order in AmIHub, needs a supervisor's approval." "In AmIHub" is better than v3. It tells my MES owner that nothing is written into his system. I read the IT block, because AI readiness is my mandate. "Each assistant gets its own access: read-only, or only the actions you allow. Every request it makes is logged." My IT head can sign that. "We show it live on a call" keeps it AMBER. No veto.
- **Screen 5, Three parts work as one system.** "Your team, your systems and AI assistants read the same live map." It is still my steering-deck line. Open REST, MQTT, WebSocket and omlox hub, and "Built on the FiRa and omlox specifications": that is the no-lock-in case, and it never says the word "lock-in". "Your MES stays in charge of every job" keeps the MES owner calm. "Runs on a PC inside your plant, with no internet needed." I noted that line, and it caught me later on screen 6. I skipped the 111-word anchor block. It is my OT head's.
- **Screen 6, Start with one bay.** "Then grow plant-wide on the same AmIHub, without re-fitting the first bay." That is the lighthouse that can be copied, inside one plant. Then: **"A second plant joins the same console, with its own survey."** I read it twice. It is the first time the page names plant two's effort (a survey), which I asked for. But two words snagged. "Console": every other line says "AmIHub", so is a console a different product, a licence tier, or a group view? And "joins": screen 5 told me AmIHub runs on a PC inside my plant with no internet. How does Pithampur join a console that sits on a PC in Pune? Over our WAN? Through a cloud? Its own AmIHub reporting up? My CIO will ask this in the first minute, and the page sets up the question without answering it. "Designed and built in India, with local stock and local engineers on your site" matters across three clusters. "One contract and one support line cover every layer" next to "your team or your integrator can build on it at any layer" is the balance I need: one throat to choke, no lock-in.
- **Footer.** "Group operations and digital: How to buy." They made that fix too. "Call, NDA pack, survey, pilot" is a sequence I can put in a rollout plan. Physical AI appears once, as direction ("the first layer of"). That passes.

Words I did not trust: "console" (screen 6). It appears once, unexplained, in the line that carries the most weight for my role.

## 3. Where I would stop
I did not stop. I leaned in at screens 3, 4 and 5. I slowed at screen 6 on the second-plant line, and that is where I would pick up the phone, which is not the worst outcome for them.

## 4. My question at the end
"When plant two joins the same console, where does that console run, given AmIHub runs on a PC inside each plant with no internet? And what does plant two reuse: our zone names, our job-link method, our AmIHub set-up? Who runs it at group level, us or you?"

## 5. Score: 9 / 10
No veto. Both v3 changes were made: the screen 2 headline and the footer row. Plant two's effort is now named, in one word (survey). Screen 3 adds an interoperability line I can use. I would forward it today to a plant head as a candidate lighthouse, and to my CIO. It is not a 10, because one line was read twice again, so the 90-second test fails narrowly, and plant two is still asserted rather than explained. The new line also rubs against the on-premise line on screen 5.

---

## 6. Compared with v3 (9/10): better, same score
- Better: my smaller fix ("last passed") and the footer row both landed, the multi-site line now says what plant two costs (a survey), and screen 3's "sends the event to the system you name" and "from your own system" make the open-data story concrete.
- Not a 10: the re-read moved from screen 2 to screen 6, onto my most important line, and "console" next to "a PC inside your plant, no internet" opens a group-architecture question v3 did not raise.

## 7. Best and worst lines
- **Best:** "Your team, your systems and AI assistants read the same live map." (screen 5). It is still the steering-deck slide, with the hero poster. Close second: "Asking changes nothing." (screen 4).
- **Worst:** "A second plant joins the same console, with its own survey." (screen 6). It is the right idea in the wrong noun. "Console" is undefined, and "joins" contradicts the on-premise, no-internet line unless something else is explained.

## 8. One change that would make it a 10
Replace "console" with the product name and say how the plants connect. For example: "A second plant gets its own survey and its own AmIHub. Both show on one group view across your network." **Truth flag:** the topology (one AmIHub per plant with a group view, or one AmIHub over the WAN) needs a founders' source. [B5] says only "multi-site from one console" and is indicative. If the founders cannot confirm the topology, use the plain fallback, which needs no new claim: "A second plant starts with its own survey. Ask us how it joins the first." The /trust/ build note already promises "how one console reaches a second site". Link that page from the line, so my CIO gets the answer one tap away. The reuse sentence I asked for in v3 ("Plant two starts from the same zones and the same way of linking trolleys to jobs") still waits on a source. Do not add it without one.

---

### Re-read log
| Screen | Line | Words |
|---|---|---|
| 6 | "A second plant joins the same console, with its own survey." | 11 |

### Veto check
- Leads with Physical AI: no. It appears once, in the footer, as direction.
- Implies lock-in: no. Open interfaces, events sent "to the system you name", jobs linked "from your own system", the FiRa and omlox specification wording, "your team or your integrator can build on it", and the MES stays in charge.
- Plans shown as live: conditional, as in v3. "A second plant joins the same console" is present tense on AMBER ([B5] indicative), covered only by the footer's "Specifications are indicative". That covers a figure, not a capability. If the founders do not confirm multi-site today, I send screen 6 back. There is no robotics control, no dispatch, no digital twin and no roadmap date.
- WIP door first: yes. Screen 3 is the first use. Robotics and warehousing sit in the nav only, as location.
- Board-slide test: pass. The hero poster plus "Your team, your systems and AI assistants read the same live map." Second slide: "Asking changes nothing."
- 90-second pass test: the category, repeatability within a plant, and plant two's effort (a survey) pass. It fails narrowly on "no line read twice".
