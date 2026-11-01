# Reader panel, round 1 v2: Partner and EHS reader (P12 integrator, P10 EHS)

SIMULATION. This is a hypothesis buyer from kit 09 section 6. No interviews behind it.

I read the page cold on my phone, twice: once in each voice. **Integrator voice:** I want to know what is standard, who commissions it, who supports it, where the docs are, and whether there is anything here I can sell again. **EHS voice:** I sit across from a works committee. I want to know whether it tracks people and where the line is drawn.

I read only section 3 (the screens) and section 4 (the nav and footer). I skipped the claim tables and the build notes.

---

## 1. After the hero only

**Say-back:** "Small tags go on trolleys, bins and tools, anchors on the columns pick them up, and one live map shows where each thing is and how long it has waited."

**Is that right?** Yes. The integrator voice gets the three parts and the column mount from one paragraph. The EHS voice notices that the list is "trolley, bin and tool" and that the film has vehicles and an AMR but no people. It is still only implied, though. The hero shows no people but never says it doesn't track them. I have to wait until screen 6 for the actual line.

## 2. Screen by screen

- **Nav.** "How it works · Where it helps · Start small · About us". The words are plain. For EHS, "People and privacy, Carriers, not people" under About us is the first time anyone on this site has said my line out loud, even in a menu. It's buried in About us, but it's there. For the integrator, "For developers, API and MCP docs" promises docs by name. There's still no Partners entry anywhere in the nav. "Tools and vehicles: Fixtures, forklifts, AMRs" reads as a list of things you can tag, not as a result, which is fine. "Robotics and AMRs: Where robots and carriers meet" made the EHS ear twitch slightly ("meet" sounds like collision or proximity), but it's a menu line, not a promise.
- **Screen 1, Hero.** Clean. "Anchors on your columns hear it" is a site-survey picture. The before and after film reads without a caption this time: ticks at desks, then lines. There are no people in the frame. Good.
- **Screen 2, Find it.** "A scan tells you where it was. A tag tells you where it is." Still lands. "The walk. The calls to stores. The second walk." Every supervisor I commissioned for lives that. The trolley is found by name, with no codes and no person attached. Nothing here to object to.
- **Screen 3, See where work waits.** "Why it waited stays your team's call." For EHS this matters: the wait is pinned on the trolley, not on the operator. Nobody on the works committee can read this as timing a worker. Good.
- **Screen 4, Ask your floor.** "MCP is an open standard that lets AI assistants use other software." Now the EHS voice knows the word. Round 1's distrust is gone. "A person approves any action" and "every request it makes is logged" are the right boundaries. The question is about trolleys, not people. Good.
- **Screen 5, Three parts.** The integrator voice is at its best here. "Fixed to a column or wall 3 to 8 m up." "Anchors need only power, from DC or PoE." "No data or sync cables to run." "We survey your floor and plan the anchors." "Open REST, MQTT and WebSocket interfaces." I can draft a survey and a quote from this screen. What's missing: no interface version, and "Built on the FiRa and omlox specifications." doesn't say which part of omlox. I want "omlox hub interface" in the charter wording, because that's the part I'd build against. **Read twice:** "Your MES stays in charge." (5 words). It's the same as round 1: in charge of what? Dispatch? Job status? I'd like four more words.
- **Screen 6, Start with one bay.** This is where both voices react, in opposite directions.
  - EHS: "A pilot tags carriers, not people." Finally. It's plain and on the page, and it links straight to People and privacy. This is the line I came for. **Read twice:** "A pilot tags carriers, not people. Then grow plant-wide on the same AmIHub." (13 words). The very next sentence after my line is about growing. My works committee will ask: "the pilot doesn't track people, but does plant-wide?" The line is scoped to "a pilot", and that scoping reads like a door left open. It needs its second half: tracking people is a separate scope with its own policy and consent.
  - Integrator: **Read twice:** "One team owns every layer, so you have one contract and one support line." (14 words). I read it again looking for myself and I'm not there. The plant head will love it. To me it says the vendor surveys, the vendor owns every layer, the vendor supports, and nobody else is needed. "What you buy" is actually the standard kit I wanted ("AmIGo tags, AmIMo anchors and AmIHub, plus our survey of your floor"). That's the first time the standard core is named. But nothing says who commissions or who supports after handover, beyond "one support line".
  - "Running more than one plant? Ask us how the second one starts." is an honest question. It doesn't overclaim.
- **Footer.** EHS: "Safety and EHS: People and privacy". It's my own row, and the same page as the screen 6 link. Good. Integrator: "Developers and integrators: For developers". I share a row with developers and get an API page. That's the same dead end as round 1, A. The entity paragraph says "everything you tag in a plant" and "Your team, your systems and AI assistants". The round-1 line about "everything that moves" is gone, and "people" no longer sits next to "tagged". Both fixes landed. **Word I don't trust:** "Physical AI". It's in the footer only now, but it still says nothing to either of my roles.

## 3. Where I'd have stopped

**EHS voice:** I didn't stop. Nothing on the page crossed my line, and screen 6 gave me the line in words. My only hesitation was the "Then grow plant-wide" sentence right after it.

**Integrator voice:** this voice stops at "One team owns every layer, so you have one contract and one support line." That's the moment I learn the page is selling past me. I skim the rest, find "For developers" in the footer, and leave with good specs and nothing to resell.

## 4. The question I still have

Integrator: "Is there a partner path: who commissions, who supports after handover, and where are the versioned interface docs, omlox hub interface included?" EHS: "The pilot tags carriers, not people. What would it take to tag people later, and who decides?"

## 5. Score: **7/10**

The EHS voice is close to forwarding it. The line is on the page, the footer row exists, and no scene or sentence implies people tracking. The integrator voice has the best hardware and protocol facts yet, but the page now actively tells him the vendor does everything.

---

## 6. Compared with the best of round 1 for me (Concept B, 6/10)

**Better.** Every EHS fault I logged is fixed: "carriers, not people" is in the copy with a link, "everything you tag" replaces "everything that moves", MCP is defined, and the footer gives Safety its own row.
For the integrator it's only the same: the hardware and protocols are stronger (DC or PoE, 3 to 8 m, REST, MQTT and WebSocket), but there's still no partner row and no commissioning split, and "one support line" now shuts the door harder.

## 7. Best and worst lines

**Best:** "A pilot tags carriers, not people." (Screen 6.) It's six words, it's plain, and it links to the policy page. My works committee can read it aloud and nobody objects.

**Worst:** "One team owns every layer, so you have one contract and one support line." (Screen 6.) It's right for the plant head, but for an integrator it says "you are not needed". It's also the claim I'd most want checked: the page never says who commissions.

## 8. One change that would make it a 10

On screen 6, turn "What you buy" into a two-part "Who does what, and where the line is", in plain sentences with no icons:
- **What you buy, and who does what:** "AmIGo tags, AmIMo anchors and AmIHub, plus our survey of your floor. We commission it. You, or an integrator you choose, can run and extend it on versioned interface docs, including the omlox hub interface." Change the footer row to "Integrators: Partners", pointing at a real page, never a fallback to Contact.
- **The line:** after "A pilot tags carriers, not people." add "Tracking people is a separate scope, with its own policy and consent." Do it before "Then grow plant-wide".

With that, the integrator asks for the partner kit, and the EHS lead forwards the page to the plant head with no objection.

The wording in brackets is an open question for the Truth and Quality Lead and the founders, not a fact. Nothing I read confirms who commissions, whether integrators may support it, or whether a partner model exists. Do not name any partner or show any logo until that is settled.

---

## Re-read log

| Screen | Line | Words |
|---|---|---|
| 5 | "Your MES stays in charge." | 5 |
| 6 | "A pilot tags carriers, not people. Then grow plant-wide on the same AmIHub." | 13 |
| 6 | "One team owns every layer, so you have one contract and one support line." | 14 |

That's three re-reads, down from nine across round 1 (three in B).

**Words I didn't know or didn't trust:** "Physical AI" (footer). "Built on the FiRa and omlox specifications": I trust it, but it's incomplete for me, because it doesn't say which omlox interface or which version. "Where robots and carriers meet" (nav): it sounds slightly like proximity safety. Keep it away from any safety reading.

## Safety and scope check (file 03 lens)

- **Safety outcomes:** none claimed. There are no fewer-incidents lines and no live alerts. Good.
- **Safety features:** restricted-zone, proximity, near-miss and muster are not mentioned anywhere. That's acceptable for a homepage, and nothing is shown as live.
- **Fleet:** forklifts, tuggers and AMRs appear as tagged things and as a nav list ("Fixtures, forklifts, AMRs"). There's no delivered result and no robot control. Good.
- **People:** no people in any scene, by art direction. "Carriers, not people" appears in the nav, on screen 6 and on the footer route. The entity paragraph says "everything you tag". The one gap is that the line is scoped to "a pilot" and the next sentence is "grow plant-wide". The screen 2 and screen 5 AmIHub captures must not show any personnel badge from the demo floor.
- **Partners:** none named, no logos. Good. But there's no standard, configurable or custom split, no commissioning or support owner, and no partner path. The integrator half of my 90-second test still fails.
- **Margins and channel economics:** not mentioned. Good.
