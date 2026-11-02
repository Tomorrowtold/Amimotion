"""Per-page loop records for the learn squad (round 07). Read by learn_pages.py --md.

Readers are the kit 09 buyer profiles (P1-P12), read cold by the squad against each profile's
"what wins / what loses them". Scores are 1-10. Round 1 is the first merged draft; final is after fixes.
Claim rulings are against kit 03 (claims register), kit 01 sources and open-facts.md / truth-check-v4.md.
"""

COMMON_CLAIMS = [
    ("“down to ±10 cm in 3D with AmIMo anchors, depending on the site”", "PASS", "K03 GREEN with qualifier, [B1] [B3]; charter fixed wording"),
    ("“built on the FiRa and omlox specifications” / “claims no formal certification”", "PASS", "Charter fixed wording; [FR] 29 Oct replaces K03's “compliant”"),
]

R = {}   # url: dict(job, ref, drafts, readers=[(persona, r1, lost, fix, final)], claims=[...], facts=[...])

R["/learn/"] = dict(
    job="Any buyer who arrives from search or the footer and needs the right guide fast. Next step: one guide.",
    ref="Stripe docs and Teenage Engineering guides: an index that answers before it lists. Ours opens with four quick answers, then four groups.",
    drafts="A: the old hub (93 words, three link lists, no answer). B: answer-first hub with four quick answers and grouped guides. Picked B: A failed the 250-word and figure-with-condition checks and answered nothing.",
    readers=[("P2 Production manager", 7, "“Understand it. Then decide.” told me nothing about my floor.", "H1 now names the page; quick answers lead.", 9),
             ("P5 OT engineer", 8, "Groups by type, not by my question.", "Groups now follow the buying order: basics, choosing, on the floor, proving it.", 9),
             ("P8 Digital transformation", 8, "No sign of standards or AI on the index.", "omlox in the basics, MCP under On the floor.", 9)],
    claims=[("“about 15 AmIMo anchors” for an open 5,000 m² hall", "PASS on AMBER", "Labelled as this site's 25 m planning grid, first budget only; same grid as /tools/anchors/; [B4] survey caveat in the guide")],
    facts=[])

R["/learn/rtls/"] = dict(
    job="P1 or P11 new to RTLS: what is it, and is it for me? Next: UWB vs RFID, or WIP visibility.",
    ref="How Search Works: a big system in plain steps.",
    drafts="A: the five-step checklist page. B: definition, then how a position is made from [B2]'s three steps, then can and cannot. Merged: B's order, A's closing checklist.",
    readers=[("P1 Plant head", 7, "“Turn the map into a question” was abstract.", "Replaced by a plain can / cannot pair.", 9),
             ("P11 Promoter", 8, "Wanted to know if this is GPS.", "FAQ “Is RTLS the same as GPS?” added.", 9),
             ("P4 Supervisor", 8, "Checklist read as a vendor test, not my job.", "Kept; the supervisor's task lives in the accuracy guide.", 9)],
    claims=[("Pulse, arrival time, angle, AmIHub combines timing, angle and map", "PASS", "[B2] steps 1-3; no “sub-nanosecond” (AGENTS rule)"),
            ("AmIMo also ranges BLE and Wi-Fi FTM devices, device support confirmed per site", "PASS", "[B4]; Wi-Fi FTM wording rule"),
            ("Indoors and sheltered outdoor areas", "PASS", "[B4]"),
            ("Location alone does not show the job, completion or why", "PASS", "K03 NEVER, stated as a limit")],
    facts=["Picture slot L01 waits on pair_scale.png being graded to the page ground (Realism lab)."])

R["/learn/uwb-vs-rfid/"] = dict(
    job="P5 and P2 who already scan or use RFID: do we need UWB? Next: alternatives or the India supplier guide.",
    ref="A fair comparison by workflow ([CW]); Waymo's habit of a condition next to every figure.",
    drafts="A: the old table page. B: lead with the question each radio answers, keep the workflow table. Picked B with A's table: B answers in the first line.",
    readers=[("P5 OT engineer", 8, "“anchors also read BLE and Wi-Fi FTM” sounded unconditional.", "Device support confirmed per site, every time.", 9),
             ("P2 Production manager", 9, "None.", "", 9),
             ("P9 Procurement", 7, "No word on why UWB costs more and when it is worth it.", "FAQ “When is UWB worth the extra cost?” added.", 9)],
    claims=[("Never says RFID or barcodes fail", "PASS", "K03 NEVER respected; RFID and scans framed as right for passage"),
            ("UWB IEEE 802.15.4z", "PASS", "[B3] [B4]"),
            ("AmIMotion is an Indian maker of UWB tags, anchors and software", "PASS", "[B1] [B8]")],
    facts=[])

R["/learn/alternatives/"] = dict(
    job="P3 and P9 comparing approaches before they buy. Next: UWB vs RFID, or the pilot.",
    ref="Gartner 'solution exploration' job (kit 09 section 5): the approaches side by side.",
    drafts="A: five short headed lines (223 words, failed the word and figure checks). B: side-by-side table first, then when each is right. Picked B: a table is what this buyer screenshots.",
    readers=[("P3 IE / lean lead", 7, "“Compare the whole effort” had no AmIMotion fact in it.", "Added AmIMo's power and cabling line.", 9),
             ("P9 Procurement", 8, "Wanted to know we can keep the scanners.", "FAQ “Do we have to replace barcode scanning?”", 9),
             ("P1 Plant head", 9, "None.", "", 9)],
    claims=[("AmIMo needs DC or PoE power, no data or sync cabling", "PASS on AMBER", "K03 AMBER wording; never “wireless”"),
            ("“AmIMotion does not replace a scan that confirms a step”", "PASS", "Positioning stance, no capability claimed")],
    facts=[])

R["/learn/uwb-rtls-india/"] = dict(
    job="P1, P11 and P8 in India asking “who makes UWB RTLS here?” Next: accuracy, anchors, job links.",
    ref="A buyer's guide that names the field fairly, then gives a checklist any supplier can be held to.",
    drafts="A: the old page with five competitor names and “one of the few Indian companies”. B: the seven questions, then AmIMotion's answers as a table. Merged: B's table, A's questions; competitor line cut to what kit 09 states.",
    readers=[("P11 Promoter", 8, "“one of the few Indian companies” felt like a boast I could not check.", "Cut. Now “designs and builds its tags, anchors and software in India”.", 9),
             ("P1 Plant head", 8, "Answers were a paragraph; I wanted them against each question.", "AmIMotion's answers now sit in a table, one row per question.", 9),
             ("P5 OT engineer", 9, "None.", "", 9)],
    claims=[("HID acquired the UWB maker Sewio in 2024; Ubisense, KINEXON, Pozyx and Zebra as RTLS suppliers", "PASS", "Kit 09 section 10 vendor table ([Web: HID newsroom], vendor pages). Named only as suppliers; no comparison (K03 RED bars the [D8] comparison)"),
            ("“one of the few Indian companies that make UWB tags and anchors”", "STOP", "Unverified superlative; cut"),
            ("Designed and built in India, local stock and local engineers on site", "PASS", "[B8]"),
            ("No data or sync cabling; DC or PoE; Wi-Fi with an Ethernet option", "PASS on AMBER", "[B4]; F8 release check: cut “Ethernet option” if /specs/ lacks the row"),
            ("On-premise with no internet dependency, or cloud", "PASS", "K03 GREEN; who runs the cloud not said (C21)"),
            ("REST, MQTT, WebSocket, omlox hub; connectors confirmed per site", "PASS", "K03 GREEN with qualifier"),
            ("Pilot one bay or line, scale on the same AmIHub", "PASS", "K03 GREEN")],
    facts=["O12 (who installs, who supplies the PC): page says only “local engineers on site” and the survey; no install scope."])

R["/learn/accuracy/"] = dict(
    job="P5 sceptical of radio near steel: is ±10 cm real, and how do I test it? Next: anchor planning, baseline.",
    ref="Waymo data hub: the number and its condition in the same sentence.",
    drafts="A: the old page (“UWB is usually accurate enough”). B: condition-first short answer and a test plan. Picked B: A's opening claimed more than the register allows.",
    readers=[("P5 OT engineer", 7, "“usually accurate enough” with no condition.", "Now “when its anchors are planned for it”, and the figure is typical and site-dependent.", 9),
             ("P3 IE / lean lead", 8, "No word on how often positions update.", "Update rate 0.1-10 Hz per tag group added under data age.", 9),
             ("P4 Supervisor", 9, "None.", "", 9)],
    claims=[("Multipath and non-line-of-sight algorithms keep positions stable", "PASS", "[B8]"),
            ("Final anchor plan from a site survey", "PASS", "[B4]"),
            ("Update rate 0.1-10 Hz per tag group", "PASS", "[B3], indicative"),
            ("Pilot hard-case list", "PASS", "Advice to the reader from [CW]; not stated as AmIMotion's named checks (O6)")],
    facts=["O6: no named pilot checks are promised. The page tells the reader to put hard spots in the plan."])

R["/learn/anchor-planning/"] = dict(
    job="P5 and P9 budgeting a 5,000 m² floor. Next: the anchor estimator, AmIMo, accuracy.",
    ref="A worked example in plain numbers, like How Search Works' steps.",
    drafts="A: old page. B: short answer with the 50 m and two-in-view facts, worked example kept. Merged: A's example, B's opening and a cleaner cabling FAQ.",
    readers=[("P5 OT engineer", 8, "“Not AmIMo anchors: they need no network cables” ignored PoE.", "FAQ now says PoE runs over a network cable.", 9),
             ("P9 Procurement", 8, "Wanted the grid labelled as an assumption, not a spec.", "Kept and made explicit in the short answer.", 9),
             ("P7 IT / network", 9, "None.", "", 9)],
    claims=[("About 50 m line of sight, indicative and site-dependent", "PASS on AMBER", "[B4], C17; survey caveat beside it"),
            ("Works with as few as two anchors in view", "PASS", "[B4]"),
            ("Mounted 3-8 m on walls, columns, ceiling, poles", "PASS", "[B4]"),
            ("Mode selected per zone", "PASS on AMBER", "[B2] [B4]; C9 says “multiple modes”, no mode named as live"),
            ("Grids 25 / 18 / 12 m and the 15 / 28 counts", "PASS on AMBER", "This site's planning assumptions, labelled; identical to /tools/anchors/")],
    facts=[])

R["/learn/omlox/"] = dict(
    job="P8 and P6 asking what omlox is and whether AmIMotion is locked in. Next: technology, UWB vs RFID.",
    ref="A definition page an AI can quote in one sentence.",
    drafts="A: old page. B: definition, why it exists, FiRa beside it, spec versus certification. Picked B: it answers the FiRa question buyers ask next.",
    readers=[("P8 Digital transformation", 8, "No line on why it matters for my next system.", "“keep its other location sources in the same model”.", 9),
             ("P6 MES owner", 9, "None.", "", 9),
             ("P7 IT / network", 8, "“Is omlox required?” unanswered.", "FAQ added: no, REST, MQTT and WebSocket too.", 9)],
    claims=[("AmIHub omlox hub interface", "PASS", "[B5] “omlox-compatible hub interface”"),
            ("Data and device model follow the FiRa and omlox specifications", "PASS (reworded)", "[B5] “compliant” replaced by the fixed wording"),
            ("No formal certification claimed", "PASS", "Roadmap certification is a plan ([D13]); not mentioned")],
    facts=[])

R["/learn/wip-visibility/"] = dict(
    job="P2 and P1 searching “WIP visibility vs tracking”. Next: dwell time, job links, the diagnostic.",
    ref="Our own homepage voice: where work is, where it waits.",
    drafts="A: old page. B: definition in one paragraph, the three parts, then the [CW] opening question as the way to start. Picked B: the opening question is the best line a P2 reads.",
    readers=[("P2 Production manager", 8, "“With an agreed time limit” style flag felt like an alert promise.", "Only “name who acts when work waits too long”.", 9),
             ("P1 Plant head", 9, "None.", "", 9),
             ("P4 Supervisor", 8, "Did not say I see it during the shift.", "Live during the shift line added (V26).", 9)],
    claims=[("Supervisors see each wait live during the shift", "PASS", "V26, [B5]"),
            ("Link each trolley to the job it carries, in AmIHub or from your own system", "PASS on AMBER", "F3, V27"),
            ("No zone time limit or alert", "PASS", "O2 kept out")],
    facts=["O2 kept out: the safe line “name who acts when work waits too long” ships."])

R["/learn/dwell-time/"] = dict(
    job="P3 and P2: how is dwell measured, and what does it include? Next: WIP visibility, job links, baseline.",
    ref="P3's test from kit 09: a number with a definition; unfinished visits named.",
    drafts="A: old page. B: definition, zones, the boundary case, shift end, then how AmIHub does it. Picked B: V107 asks for the boundary case or an honest “open”.",
    readers=[("P3 IE / lean lead", 8, "Shift-end waits not covered.", "O7 safe line added as its own section and FAQ.", 9),
             ("P2 Production manager", 9, "None.", "", 9),
             ("P6 MES owner", 8, "Did not say how events reach my system.", "Entry and exit streamed to any named system, over MQTT, REST or WebSocket (F2).", 9)],
    claims=[("AmIHub time-stamps enter, exit, idle and dwell; history by time window", "PASS", "[B5]"),
            ("Sends each entry and exit to any system you name, as it happens", "PASS", "F2, [B5] day one"),
            ("Boundary case: “ask any supplier, AmIMotion included, to show how”", "PASS", "V107: the case is named and left open, no rule claimed"),
            ("Shift-end rule agreed before the pilot", "PASS", "O7 safe line"),
            ("“a limit becomes an event”", "STOP (kept out)", "V25, V107")],
    facts=["O2 and O7: safe lines only. If a founder confirms O7's default, add it in one line under “Waits that cross a shift”."])

R["/learn/association/"] = dict(
    job="P6 and P2: which job is on the trolley? Next: WIP visibility, value without MES, dwell.",
    ref="[CW] association contract: identities kept apart, a lifetime for each link.",
    drafts="A: old page, which claimed AmIHub keeps a start, an end and “Job unknown”. B: why a link needs a start and an end, then what AmIHub does ([B5], [B7]). Picked B under V108.",
    readers=[("P6 MES owner", 8, "Wanted to know who owns status.", "System-of-record section: agree that movement never changes status on its own.", 9),
             ("P2 Production manager", 9, "None.", "", 9),
             ("P12 Integrator", 7, "Which interface carries the link?", "REST and MQTT named; method agreed during scoping (Q5).", 9)],
    claims=[("AmIHub keeps the link with a start, an end and an owner", "STOP (reworded)", "V108: says why a link needs them, without claiming AmIHub records them"),
            ("“shows Job unknown”", "STOP (reworded)", "No source; now advice: “a good system says the job is unknown”"),
            ("“One carrier can hold several links at once”", "STOP", "O10 open; now “settled during scoping”"),
            ("Work orders as objects, tags assigned; same tools over REST and MQTT", "PASS on AMBER", "[B5], [B7], V108"),
            ("“AmIMotion does not change a job's status because a trolley moved”", "STOP (reworded)", "[B6] says work orders can close on completion; now an agreement the reader makes")],
    facts=["O10: no MES job-number method and no one-to-many rule. Q5 (how links are made today) stays open."])

R["/learn/location-data-quality/"] = dict(
    job="P4 and P5: what does a quiet tag mean? Next: accuracy, job links, MCP.",
    ref="[CW] “Last observed in Zone B at 10:42”: old data shown as old.",
    drafts="A: old page. B: last seen first, battery and health, anchors going dark. Picked B: it answers P5's outage worry as far as sources go.",
    readers=[("P4 Supervisor", 9, "None.", "", 9),
             ("P5 OT engineer", 7, "What happens when an anchor dies?", "Dark-anchor alert added; recovery time left out (O8).", 9),
             ("P10 EHS lead", 9, "None.", "", 9)],
    claims=[("Last seen, and when", "PASS", "V14, [CW]"),
            ("AmIHub tracks each tag's health and battery level", "PASS", "F7, [B5]; “ahead of time” cut"),
            ("If it comes off the trolley, the map still shows its last-seen spot", "PASS on AMBER", "F6"),
            ("Alerts when an anchor goes dark", "PASS", "[B5]"),
            ("Tilt or impact reported to AmIHub", "STOP (kept out)", "O4")],
    facts=["O4 kept out. O8 (outage behaviour, rejoin time) kept out; only the dark-anchor alert ships."])

R["/learn/mcp-location-data/"] = dict(
    job="P8, P7 and P6: can an AI assistant read our floor, safely? Next: Ask your floor, AmIHub.",
    ref="Stripe: a capability shown plainly, with its limits next to it.",
    drafts="A: old page. B: yes-first answer, the tool families from [B7], guardrails, where it runs. Picked B: it names the tools a developer looks for.",
    readers=[("P7 IT / network", 7, "“On-premise, the location data does not leave the site” ignored where the assistant runs.", "Now: the MCP server runs inside the plant; where the assistant runs is IT's choice.", 9),
             ("P8 Digital transformation", 9, "None.", "", 9),
             ("P2 Production manager", 8, "“write actions” is developer talk.", "“Any change, such as raising a work order, needs a person's approval.”", 9)],
    claims=[("Built-in MCP server, any MCP-capable client", "PASS on AMBER", "[B7]; K03 AMBER: demo on request, site setup confirmed in scoping"),
            ("Per-assistant credentials and tool scope; every call logged", "PASS", "[B7]"),
            ("Any change needs a person's approval; can require a supervisor", "PASS (reworded)", "V38, F5; O15 noted"),
            ("Tool families and example tool names", "PASS on AMBER", "[B7]; fleet family left out (C18)"),
            ("Assistant product names", "Left out", "No partner or brand names")],
    facts=["O15: “needs a person's approval” ships as on the homepage."])

R["/learn/value-without-mes/"] = dict(
    job="P1 and P6: can we prove it before IT builds an MES connector? Next: baseline, job links, pilot.",
    ref="Kit 09 objection table: offer a baseline first.",
    drafts="A: old page (“AmIMotion pilots often start this way”). B: yes-first, then what needs the job link. Picked B: A claimed a pattern no source states.",
    readers=[("P1 Plant head", 8, "Who has to be involved, when?", "Section added: IT now, MES owner later, production owns the baseline.", 9),
             ("P6 MES owner", 9, "None.", "", 9),
             ("P3 IE / lean lead", 7, "Said AmIHub gives search counts. It cannot.", "Fixed: AmIHub gives position and zone time; your team counts searches.", 9)],
    claims=[("“AmIMotion pilots often start this way”", "STOP", "No source; cut"),
            ("First bay with tags on one flow", "PASS", "[B8] pilot one bay or line"),
            ("Connectors confirmed per site", "PASS", "K03 GREEN qualifier")],
    facts=[])

R["/learn/pilot-baseline/"] = dict(
    job="P3 and P1: what to measure so the result stands up. Next: value without MES, the pilot, the calculator.",
    ref="[CW] three levels of measurement; claims only after evidence.",
    drafts="A: old page. B: question H1, then measures, fairness, what you may claim. Picked B: the H1 is the question buyers type.",
    readers=[("P3 IE / lean lead", 8, "Said AmIHub produces all four measures.", "Fixed: zone time from AmIHub, searches and walks counted by hand both times.", 9),
             ("P1 Plant head", 9, "None.", "", 9),
             ("P9 Procurement", 9, "None.", "", 9)],
    claims=[("No ROI, saving or payback", "PASS", "K03 NEVER respected"),
            ("“You see your own waits in one bay, and prove the numbers, before you decide on more.”", "PASS", "O6 safe line"),
            ("Stop right after the bay", "STOP (kept out)", "O6")],
    facts=["O6 kept out: no stop right is promised."])

R["/glossary/"] = dict(
    job="Any buyer or AI assistant looking up one term. Next: RTLS, WIP visibility, FAQ.",
    ref="DefinedTermSet pages: one plain sentence a machine can lift.",
    drafts="A: 34 terms. B: 39 terms, adding site survey, PoE, geofence, last seen and freshness, and AmIHub and AmIMo definitions that answer the branded questions. Picked B.",
    readers=[("P5 OT engineer", 9, "None.", "", 9),
             ("P4 Supervisor", 8, "“Exception: dwell above an agreed limit” sounded like an alarm.", "Now “work that has waited longer than the team agreed”, a reason to look.", 9),
             ("P7 IT / network", 8, "AmIHub entry did not say where it runs.", "On-premise or cloud, and the interfaces, added.", 9)],
    claims=[("DL-TDoA “which helps privacy”", "Cut", "Avoids a phone-location claim"),
            ("Exception “rule breach, dwell above an agreed limit”", "REWORD", "O2: no zone limit implied"),
            ("AmIMo needs DC or PoE, no data or sync cabling", "PASS on AMBER", "K03 AMBER"),
            ("AmIGo 1-3 years, typical and usage-dependent", "PASS on AMBER", "[B3]")],
    facts=["Other squads' lines that say “34 terms” should read “39 terms” (nav.json and any related list)."])

R["/faq/"] = dict(
    job="Branded questions from buyers and AI assistants. Next: a call.",
    ref="Stripe's FAQ habit: one answer, one paragraph, no link needed to understand it.",
    drafts="A: 13 answers under the entity paragraph as the short answer. B: 18 answers in four groups, a short answer without “Physical AI”, and the three parts defined. Picked B: the footer already carries the entity paragraph, and B adds the branded questions the panel failed (B02, B07, B08).",
    readers=[("P11 Promoter", 8, "Who runs the company?", "“Who leads AmIMotion?” with V95's wording.", 9),
             ("P9 Procurement", 9, "None.", "", 9),
             ("P7 IT / network", 9, "None.", "", 9)],
    claims=[("“Is AmIMotion FiRa or omlox certified?” as a question", "REWORD", "Pickability bars a bare “certified”; asked as “hold … certification?”"),
            ("Who leads AmIMotion", "PASS (V95)", "Names and titles only; no photos, years or employers"),
            ("“…without re-instrumenting”", "Cut", "Not stated; GREEN line kept"),
            ("What does AmIMotion cost?", "PASS", "F13, locked homepage line"),
            ("“Physical AI” in the head", "Cut", "Once per page, in the footer")],
    facts=["Panel B03 expects the word “compliant”, which the founders' review retired. Update tools/panel.json B03 to “built on|specification”."])

R["/resources/"] = dict(
    job="A buyer planning before the first call: what can I use without talking to anyone? Next: the diagnostic.",
    ref="Lead magnets that give value before asking (charter Inbound): each resource says what you get.",
    drafts="A: old page, 61 words of links. B: tools and reading as described tiles, then four steps to begin. Picked B: A failed the word check and described nothing.",
    readers=[("P2 Production manager", 8, "Which one first?", "“Where to begin” steps added.", 9),
             ("P9 Procurement", 9, "None.", "", 9),
             ("P12 Integrator", 8, "Wanted developer docs here.", "Left to /developers/ in the bar; not a planning resource.", 9)],
    claims=[("No email asked, nothing stored", "PASS", "As stated on each tool page"),
            ("Films", "Left out", "/films/ held (V103); film looks unresolved")],
    facts=[])


def block(url):
    r = R[url]
    out = ["## Checks", "", f"**Job of the page.** {r['job']}", f"**Reference.** {r['ref']}", f"**Drafts.** {r['drafts']}", "",
           "**Readers** (kit 09 profiles, read cold):", "", "| Reader | Round 1 | Line that lost them | Fix | Final |", "|---|---|---|---|---|"]
    out += [f"| {p} | {a} | {l} | {f or 'none needed'} | {b} |" for p, a, l, f, b in r["readers"]]
    out += ["", f"Final mean: {sum(x[4] for x in r['readers']) / len(r['readers']):.1f}", "", "**Claim rulings:**", "", "| Claim | Ruling | Source |", "|---|---|---|"]
    out += [f"| {c} | {d} | {s} |" for c, d, s in COMMON_CLAIMS + r["claims"]]
    out += ["", "**Open facts used:** " + ("; ".join(r["facts"]) if r["facts"] else "none touched. O1, O2, O3, O4 and O6 stay out."), ""]
    return out


CHECKS = {u: block(u) for u in R}
