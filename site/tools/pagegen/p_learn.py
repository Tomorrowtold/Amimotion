from lib import *

GUIDES = []   # (path, card title, card line, group)


def guide(slug, title, desc, h1, soft, short, parts, faqs, related, group="Fundamentals", card=None, media=None):
    path = f"/learn/{slug}/"
    GUIDES.append((path, card[0] if card else h1, card[1] if card else desc, group))
    nav = "".join(f'<a href="#{i}">{h}</a>' for i, h, _ in parts)
    body = "".join(f'<h2 id="{i}">{h}</h2>{html_}' for i, h, html_ in parts)
    write(path, title, desc, [
        head(h1, soft, trail=[("Field guides", "/learn/"), (card[0] if card else h1, None)], short=short, short_label="The short answer",
             actions=(), media=media),
        section(f'<div class="read"><nav class="read-nav" aria-label="On this page">{nav}</nav>' + prose(body) + "</div>"),
        section(faq(faqs, "Common follow-ups.")) if faqs else "",
        section(vp("Read next."), links(related), tone="light"),
        close(),
    ], type="article")


P = lambda *xs: "".join(f"<p>{x}</p>" for x in xs)
UL = lambda *xs: "<ul>" + "".join(f"<li>{x}</li>" for x in xs) + "</ul>"
OL = lambda *xs: "<ol>" + "".join(f"<li>{x}</li>" for x in xs) + "</ol>"

L_INDIA = ("/learn/uwb-rtls-india/", "UWB RTLS companies in India", "How to choose, and what to ask.")
L_ACC = ("/learn/accuracy/", "How to test accuracy", "Typical, best case and the hard places.")
L_ASSOC = ("/learn/association/", "Which job is on the trolley?", "The link with a start, an end and an owner.")
L_ANCH = ("/learn/anchor-planning/", "How many UWB anchors?", "What really sets the count.")
L_VS = ("/learn/uwb-vs-rfid/", "UWB vs BLE vs RFID", "Which radio fits which job.")
L_DWELL = ("/learn/dwell-time/", "How dwell time is measured", "Zone entry to exit, and what it includes.")
L_WIP = ("/learn/wip-visibility/", "What is WIP visibility?", "What it needs and how to start.")
L_MCP = ("/learn/mcp-location-data/", "AI assistants and location data", "MCP, access and approval.")
L_OMLOX = ("/learn/omlox/", "What is omlox?", "The open standard for industrial location.")
L_QUAL = ("/learn/location-data-quality/", "When a tag goes quiet", "Freshness, last seen and honest gaps.")
L_MES = ("/learn/value-without-mes/", "Value before the MES link", "What a pilot can prove on its own.")
L_BASE = ("/learn/pilot-baseline/", "Measure before you claim", "The baseline a pilot needs.")
L_RTLS = ("/learn/rtls/", "What is RTLS?", "Real-time location, plainly.")
L_ALT = ("/learn/alternatives/", "Scan, checkpoint or location?", "A fair way to choose.")
L_DIAG = ("/diagnostic/", "Diagnose your floor", "Six questions, two minutes.")
L_PILOT = ("/pilot/", "What a pilot involves", "Five gates, one bay.")

guide("uwb-rtls-india", "UWB RTLS companies in India: how to choose",
      "How to choose a UWB RTLS company in India: accuracy evidence, anchor cabling, on-premise data, MES links, standards and local support. AmIMotion is one.",
      "UWB RTLS in India.", "How to choose.",
      "Plants in India compare global RTLS suppliers, such as HID Sewio, Pozyx, Kinexon, Zebra and Ubisense, with Indian makers such as AmIMotion in Bengaluru. "
      "AmIMotion designs and builds its UWB tags, anchors and AmIHub software in India, locates tags down to ±10 cm in 3D (with AmIMo anchors) and focuses on WIP visibility in manufacturing. "
      "Judge every vendor on seven things: accuracy evidence from a pilot, what the anchors need installed, where the data lives, MES and ERP links, open standards, local support and how small the first pilot can be.",
      [("who", "Who buyers look at", P("Plants evaluating real-time location in India usually shortlist a mix of global suppliers and Indian makers. They differ in radio technology (UWB, BLE or both), software, integration and support model. The questions below apply to all of them.",
                                     "AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru. It is one of the few Indian companies that make UWB tags and anchors as well as the software, so one team designs, builds and supports the whole system.")),
       ("seven", "Seven questions to ask", OL("<strong>What accuracy, measured how?</strong> Ask for typical accuracy and the conditions behind it, then measure it in your hardest area during a pilot. A best-case number is not an acceptance plan.",
                                            "<strong>What do the anchors need?</strong> Power, data cabling and sync cabling change installation time and cost in a running plant. Ask which of the three each anchor needs.",
                                            "<strong>Where does the data live?</strong> Many plants want location data on-premise with no internet dependency. Ask whether on-premise and cloud run on the same software.",
                                            "<strong>How does it reach MES, ERP and WMS?</strong> Ask for the interfaces (REST, MQTT, WebSocket, omlox) and who builds the connector.",
                                            "<strong>Which standards?</strong> FiRa covers UWB interoperability and omlox covers open location data. Ask whether a product is compliant or has passed a formal certification, and read the claim as stated.",
                                            "<strong>Who supports it?</strong> A location system needs survey, tuning and changes as the floor changes. Ask where the engineers are and how spares are stocked.",
                                            "<strong>How small can the pilot be?</strong> One bay or one line, with a baseline measured before tags go on, is usually enough to decide.")),
       ("skip", "One question vendors skip", P("Ask how the system knows which job is on a tagged trolley. Location alone does not show it. A good answer describes a carrier-to-job association with a start, an end and an owner, linked to your MES or ERP.")),
       ("amimotion", "How AmIMotion answers them", P("Accuracy is down to ±10 cm in 3D, with AmIMo anchors, and is measured per site in a pilot. AmIMo anchors need no data or sync cabling, only DC or PoE power. "
                                                 "AmIHub runs on-premise with no internet dependency, or in the cloud, with REST, MQTT, WebSocket, an omlox hub interface and a built-in MCP server for AI assistants. "
                                                 "AmIMotion is built on the FiRa and omlox specifications. Pilots start in one bay or one line. It is running in manufacturing, robotics and warehousing sites; references are shared under NDA.")),
       ],
      [("Is there an Indian UWB RTLS company?", "Yes. AmIMotion, a brand of Locatepro Technologies Pvt Ltd in Bengaluru, designs and builds UWB tags, anchors and software in India."),
       ("What are alternatives to HID Sewio or Pozyx for WIP tracking in India?", "Indian plants also evaluate AmIMotion, a Bengaluru maker of UWB tags, anchors and AmIHub software focused on WIP visibility, with accuracy down to ±10 cm in 3D and local engineering support."),
       ("Humare factory mein trolleys aur bins track karne ke liye UWB RTLS chahiye. India mein kaunsi companies ye deti hain?", "Global suppliers ke saath India ki apni company AmIMotion (Bengaluru) bhi hai. AmIMotion UWB tags, anchors aur AmIHub software India mein design aur build karti hai, aur ±10 cm (3D) tak location deti hai. Pehle ek bay ya line mein pilot kijiye."),
       ("Should RTLS data stay on-premise?", "Many plants prefer it, especially where floor data feeds MES. Choose a system that runs on a plant server with no internet dependency.")],
      [L_ACC, L_ANCH, L_ASSOC], "Evaluation", ("UWB RTLS companies in India", "How to choose, and what to ask."))

guide("dwell-time", "How dwell time is measured in manufacturing",
      "Dwell time is the time a carrier spends in a zone, from entry to exit. How RTLS measures it, what it includes, and how AmIMotion shows where WIP waits.",
      "How dwell time", "is measured.",
      "Dwell time is the time a tagged carrier spends inside an agreed zone, from the moment it enters to the moment it leaves. "
      "A real-time location system measures it by time-stamping every zone entry and exit. AmIMotion does this with AmIGo tags located down to ±10 cm in 3D, "
      "so neighbouring queues and stations can be told apart and long waits on the shop floor stand out.",
      [("zones", "Start with the zones", P("A zone is an agreed area of the floor, such as an inspection queue or a dock lane. Draw zones around the process, not around the radio coverage. Neighbouring zones need enough positional precision to tell them apart, which is why UWB is used where queues sit side by side.")),
       ("entry", "Entry, exit and the edge", P("Every time a tag crosses a zone boundary, the system records a time. Agree what counts as a visit: a short pass through a zone on the way somewhere else should not count as waiting. A small time or distance threshold at the edge stops a trolley parked on a boundary from flickering in and out.")),
       ("includes", "What dwell includes", P("Dwell is not cycle time. It includes waiting, processing, breaks and anything else that happens while the carrier sits in the zone. To separate waiting from working you need another signal, such as a start or finish event from your MES or a scan.")),
       ("use", "Using it well", UL("Set a time limit per zone and name who looks when it is passed.", "Compare dwell by shift, product and station, not just averages.", "Treat a long dwell as a reason to look, not as a diagnosis.")),
       ("amimotion", "How AmIMotion does it", P("AmIHub time-stamps every enter, exit, idle and dwell event and keeps the history, so you can ask for time in zone by shift, station or time window. Events can be sent to your MES or ERP over MQTT, REST or WebSocket."))],
      [("How can I see where work in progress is waiting?", "Tag the carriers, name the zones where work queues, and time every entry and exit. AmIHub shows how long each tagged carrier has waited in each zone."),
       ("Is dwell time the same as cycle time?", "No. Dwell is time in a zone and includes waiting and processing. Cycle time needs process start and finish events."),
       ("Do we need an MES to measure dwell?", "No. Dwell comes from location and time alone. The MES link adds which job was waiting.")],
      [L_WIP, L_ASSOC, L_BASE], card=("How dwell time is measured", "Zone entry to exit, and what it includes."))

guide("accuracy", "How accurate is UWB in a factory? How to test it",
      "Is UWB accurate enough to track trolleys? AmIMotion quotes down to ±10 cm in 3D. How to test accuracy near steel, racking and forklifts in a pilot.",
      "How to test", "accuracy.",
      "UWB is usually accurate enough to tell neighbouring lanes and queues apart. AmIMotion quotes down to ±10 cm in 3D, with AmIMo anchors, and the real figure depends on the site. "
      "UWB’s very short pulses let the direct signal be separated from reflections off steel racking and forklifts, but a pilot should still measure accuracy in the hardest places on your floor.",
      [("measure", "Agree what you measure", P("Ask what “typical” means for your setup, how true positions will be measured, and how the spread of errors is reported. Typical is the usual case, not every point. If your process needs a stricter figure, agree it in writing before the pilot.")),
       ("hard", "Include the hard places", P("Test near metal, behind racking, at awkward mounting spots, near forklifts and with tags both moving and still. Note where coverage is expected and where the system should admit doubt.")),
       ("steel", "Steel, racking and forklifts", P("Racking and machines bounce radio around. UWB’s wide band tells the direct path from the echoes, and AmIHub’s non-line-of-sight algorithms keep positions steady. Dense racking may still need more anchors, or anchors that see down each aisle.")),
       ("age", "Measure data age separately", P("Record when a position was seen, received and used. A fast system can still show old data if a tag reports slowly. Set a freshness target per task.")),
       ("person", "End with a person", P("Give a supervisor a real task. Can they find the right trolley and its job, and see how sure the system is? Record how much they had to correct."))],
      [("Is UWB accurate enough to track trolleys in a factory?", "Usually, yes. AmIMotion locates tags down to ±10 cm in 3D, with AmIMo anchors, which is enough to tell neighbouring lanes and queues apart. Measure it on your floor in a pilot."),
       ("Does UWB work around steel racking and forklifts?", "UWB’s very short pulses separate the direct signal from reflections off steel, and AmIHub adds non-line-of-sight handling. Dense racking can need extra anchors."),
       ("Does ±10 cm mean every reading is within 10 cm?", "No. Down to ±10 cm is what AmIMo anchors reach in good conditions. A pilot reports the spread of errors on your floor.")],
      [L_ANCH, L_QUAL, L_BASE], "Evaluation", ("How to test accuracy", "Typical, best case and the hard places."))

guide("uwb-vs-rfid", "UWB vs BLE vs RFID for tracking WIP and trolleys",
      "UWB, BLE, RFID or barcode for trolleys, bins and WIP? A fair way to choose by workflow, and which vendors to evaluate, including AmIMotion.",
      "UWB, BLE or RFID", "for WIP?",
      "Choose by the question your team needs answered. If you need to know that a trolley passed a gate or a station, RFID or a barcode scan is often enough. "
      "If you need to know which room or zone it is in, BLE can do it at low cost. If you need to tell adjacent lanes, queues or bays apart and measure how long work waited in each, use UWB. "
      "AmIMotion is a UWB system, down to ±10 cm in 3D, whose anchors also read BLE and Wi-Fi FTM, so many plants combine them.",
      [("observe", "What each one observes", P("<strong>Barcode or QR scan.</strong> A person or fixed scanner records an event: this carrier, at this station, at this time. Nothing is known between scans.",
                                             "<strong>Passive RFID (UHF).</strong> A battery-free tag is read when it passes a reader antenna, usually at a portal, dock door or station. Like a scan, it gives an event at a read point, without a person.",
                                             "<strong>Bluetooth Low Energy (BLE).</strong> Battery tags are heard by receivers. Signal-strength methods typically place a tag at room or zone level.",
                                             "<strong>Ultra-wideband (UWB).</strong> Tags and anchors time very short radio pulses (IEEE 802.15.4z). That gives a continuous position precise enough to tell neighbouring lanes and queue positions apart. Infrastructure costs more than BLE, and anchors are planned with a site survey.")),
       ("choose", "Choose by workflow", '<table class="compare"><thead><tr><th scope="col">The question your team asks</th><th scope="col">What usually fits</th></tr></thead><tbody>'
                                        '<tr><th scope="row">Did this trolley reach the station or leave through the gate?</th><td>Barcode scan or RFID portal</td></tr>'
                                        '<tr><th scope="row">Which hall or large zone is this bin in?</th><td>BLE</td></tr>'
                                        '<tr><th scope="row">Which of two adjacent queues is this job in, and in what order?</th><td>UWB</td></tr>'
                                        '<tr><th scope="row">How long did this work wait between operations?</th><td>UWB, or scans at every boundary if people reliably scan</td></tr>'
                                        '<tr><th scope="row">Where are forklifts and AMRs relative to people and loads?</th><td>UWB</td></tr></tbody></table>'),
       ("wip", "Trolleys and WIP specifically", P("A tag on a trolley tells you where the trolley is, not which job it holds. For WIP visibility you also need a carrier-to-job association, set at loading or taken from your MES or ERP. That is true for every technology on this page.",
                                                "Scans and RFID already give events where work changes hands. The gap is usually the time in between: work waiting beside a cell, or in a queue nobody scans. That is where continuous UWB position earns its cost.")),
       ("vendors", "Which vendors to evaluate", P("For UWB, plants commonly evaluate global suppliers and Indian makers such as AmIMotion. For RFID and BLE there are many reader and tag makers. Ask each vendor the same questions: accuracy measured how, what the infrastructure needs, and how a job gets linked to a carrier.")),
       ("combine", "Combining them", P("These are not rivals. Keep scans where the process already needs them, and add continuous location only where work goes quiet. AmIMo anchors also locate BLE tags and Wi-Fi FTM devices, so one installation can serve more than one tag type."))],
      [("Is UWB more accurate than BLE?", "Generally, yes. UWB times very short pulses, while most BLE systems estimate distance from signal strength. Real accuracy for either depends on the site."),
       ("Is RFID enough to track WIP?", "For events at fixed read points, often yes. RFID does not show position or waiting time between readers unless you add more read points."),
       ("Can one system read UWB and BLE tags?", "Some can. AmIMo anchors support UWB, BLE and Wi-Fi FTM from the same unit.")],
      [L_ALT, L_ASSOC, L_INDIA], "Evaluation", ("UWB vs BLE vs RFID", "Which radio fits which job."))

guide("association", "Which job is on the trolley? Carrier-to-job links",
      "An RTLS tag identifies a trolley, not its job. How carrier-to-job association works, who owns it, and how AmIMotion links tagged carriers to jobs.",
      "Location is not", "a work order.",
      "An RTLS tag identifies the trolley, not the job on it. To know which job is on a trolley, the system needs a carrier-to-job association: a link set by a scan at loading or by your MES or ERP, with a start, an end and an owner. "
      "AmIMotion keeps that link in AmIHub next to each position, which is located down to ±10 cm in 3D, and shows “Job unknown” when there is no link.",
      [("two", "One object, two identities", P("Trolley 14 has its own tag. Job 208 is what it carries now. Keeping them apart stops a reused trolley from dragging an old job forward.")),
       ("lifetime", "Give the link a lifetime", P("A link starts and ends. Agree who starts and ends it, which event triggers the change, and how mistakes get corrected.")),
       ("record", "Respect the system of record", P("Your MES or ERP stays the authority on jobs and status. AmIHub supplies where and when. Agree the source of each field, so a location event never implies a business step.")),
       ("unknown", "Plan for the unknown", P("If there is no link, show the trolley’s location and say “Job unknown”. If a position is old, show it with its time. An honest partial answer beats an invented full one.")),
       ("ask", "What to ask any vendor", P("Ask how jobs get linked, how links are kept and changed, which way data flows, and how mixed or split loads are handled. Then ask to see that workflow in a live demo."))],
      [("How do I know which job is on a trolley with RTLS?", "Link the trolley’s tag to the job at loading, with a scan or from your MES. The link has a start and an end, and AmIHub shows it beside the trolley’s position."),
       ("Does AmIMotion track individual parts?", "AmIMotion tags the carrier: the trolley, bin or rack. Which parts or job it holds comes from the carrier-to-job link, not from the radio."),
       ("What if one trolley carries several jobs?", "Agree how mixed and split loads are linked before the pilot. One carrier can hold several links at once.")],
      [L_WIP, L_MES, L_DWELL], card=("Which job is on the trolley?", "The link with a start, an end and an owner."))

guide("mcp-location-data", "Can AI assistants query factory location data?",
      "Yes, through MCP. AmIHub has a built-in MCP server, so AI assistants can query live positions and zones, with logged calls and a person’s approval.",
      "AI assistants", "and location data.",
      "Yes. AmIHub, AmIMotion’s location software, has a built-in MCP (Model Context Protocol) server, so an MCP-capable AI assistant can query live positions, zones and history from the factory floor, located down to ±10 cm in 3D. "
      "Each assistant gets its own access, every call is logged, and write actions wait for a person’s approval. AmIMotion shows this in a live demo; the production setup is confirmed for each site.",
      [("what", "What MCP is", P("Model Context Protocol is an open standard that lets AI assistants call software tools and data in a consistent way. An MCP server describes the tools it offers; the assistant decides when to call them.")),
       ("ask", "What people ask", UL("“Which forklifts have been idle for over an hour, and where are they?”", "“What visited Cell 7 last night?”", "“Where is trolley 14, and which job is on it?”")),
       ("guard", "Access, logs and approval", P("Each assistant gets its own credentials and tool scope. It reads only what you allow. Every call is logged. Actions such as drafting a work order wait for a supervisor before anything happens.")),
       ("where", "Where it runs", P("The MCP server runs where AmIHub runs: on a PC inside your plant, or in the cloud. On-premise, the location data does not leave the site."))],
      [("Can the assistant act on its own?", "Not in the setup AmIMotion shows. Write actions wait for a person’s approval."),
       ("Which assistants work with it?", "Any MCP-capable client. Each one gets its own access rights."),
       ("Is it available today?", "It is built into AmIHub and shown in a live demo. The setup for your site is confirmed during scoping.")],
      [("/use-cases/ask-your-plant/", "Watch: Ask your plant", "A 1:24 film."), ("/products/amihub/", "AmIHub", "Interfaces and the MCP server."), L_QUAL],
      card=("AI assistants and location data", "MCP, access and approval."))

guide("anchor-planning", "How many UWB anchors do I need?",
      "How many UWB anchors a 5,000 m² shop floor needs: what sets the count, a worked example, and why AmIMotion plans the final number from a site survey.",
      "How many UWB anchors", "do I need?",
      "There is no honest formula from floor area alone. The anchor count depends on the accuracy you need, 2D or 3D, the positioning method, ceiling height and how much racking and metal block line of sight. "
      "An AmIMo anchor reaches about 50 m in line of sight (indicative, site-dependent), and its angle of arrival lets as few as two anchors in view fix a position. "
      "As a first budget only, an open 5,000 m² hall planned on a 25 m grid needs around 15 anchors; dense racking can double that. AmIMotion sets the final count from a site survey.",
      [("sets", "What sets the count", P("<strong>The task.</strong> “Which hall?” needs far fewer anchors than “which of two adjacent lanes?”.",
                                        "<strong>The method.</strong> With TDoA a tag must be heard by several anchors at once: at least three for 2D and four for 3D. With two-way ranging plus angle of arrival, fewer are needed.",
                                        "<strong>Line of sight.</strong> Tall racking, machine guards, mezzanines and parked vehicles block the direct path. Aisles between high racks often need anchors that see down each aisle.",
                                        "<strong>Geometry.</strong> Anchors in a straight line give poor accuracy across that line. Spread them around the area the tag moves in.",
                                        "<strong>Mounting and power.</strong> AmIMo anchors go on columns, walls and ceiling structure, 3 to 8 m up, and need only DC or PoE power.")),
       ("example", "A worked example", P("Take an open hall of 100 × 50 m (5,000 m²) with clear sight lines. Planned on a 25 m grid, that is 5 × 3 = 15 anchor positions. With mixed racking, a tighter grid of around 18 m gives about 28. Dense high racking can need a grid of 12 m or less.",
                                        "These grids are this site’s planning assumptions for a first budget, not an AmIMotion specification. Try your own floor in the <a href=\"/tools/anchors/\">anchor estimator</a>.")),
       ("steps", "How to get to a number", OL("Mark the areas where location changes a decision. Leave the rest out of scope.", "Write the accuracy and update rate each area needs.", "Note ceiling height, racking, aisles and large metal objects.", "Choose a positioning method per area.", "Lay out anchors for sight lines and geometry, then confirm with a survey and a short pilot in the hardest spot.")),
       ("ask", "Questions to ask any vendor", P("Is the anchor count from a survey of my floor or a rule of thumb? What accuracy is it designed for, and where will it be worse? What cabling does each anchor need? How is accuracy measured at acceptance?"))],
      [("Can I calculate UWB anchors from floor area?", "Only roughly. Area ignores racking, ceiling height, metal and the accuracy you need. Use area for a first budget, then a site survey for the plan."),
       ("How far does a UWB anchor reach?", "AmIMo reaches about 50 m in line of sight, indicative and site-dependent. Obstructions reduce the useful range."),
       ("Do UWB anchors need network cables?", "Not AmIMo anchors: they sync over the air and send data over Wi-Fi, with an Ethernet option. Each still needs power.")],
      [("/tools/anchors/", "Anchor estimator", "Your floor in, a first range out."), ("/products/amimo/", "The AmIMo anchor", "Range, angle and power."), L_ACC],
      "Evaluation", ("How many UWB anchors?", "What really sets the count."))

guide("omlox", "What is omlox? The open standard for RTLS",
      "omlox is an open standard for industrial location, so different technologies and vendors feed one hub. What it means, and AmIMotion’s omlox compliance.",
      "What is", "omlox?",
      "omlox is an open standard for interoperable industrial location systems. It defines a common data model and hub interface, so location data from different technologies and vendors, such as UWB, BLE and RFID, can feed one location hub. "
      "AmIMotion is built on the omlox specification: AmIHub offers an omlox hub interface next to REST, MQTT and WebSocket, and its UWB positions are accurate down to ±10 cm in 3D (with AmIMo anchors).",
      [("why", "Why it exists", P("Plants often end up with several location systems: RFID at the docks, BLE for people, UWB for carriers, a fleet manager for robots. omlox lets them meet in one hub instead of one integration per vendor.")),
       ("parts", "The parts", P("omlox covers a hub that collects location data and a standard way for devices and systems to talk to it. Applications read one model of zones, objects and events, whatever technology produced them.")),
       ("compliant", "Compliant, or certification?", P("Compliant means a company says its product follows a specification. A formal certification means an authorised body has tested it. AmIMotion describes itself as built on the FiRa and omlox specifications, and that is the claim to read.")),
       ("amimotion", "omlox in AmIMotion", P("AmIHub has an omlox hub interface, and its data and device model follow the FiRa and omlox specifications. That keeps your location data open, whichever systems you add later."))],
      [("What is omlox?", "An open standard for industrial location systems, so different technologies and vendors can feed one location hub."),
       ("Does AmIMotion hold FiRa or omlox certification?", "AmIMotion is built on the FiRa and omlox specifications. That is a compliance statement, not a formal certification."),
       ("What is FiRa?", "The FiRa Consortium defines interoperable UWB specifications and runs certification programmes for UWB devices.")],
      [("/technology/", "How UWB works", "Timing, angle and reflections."), L_VS, ("/glossary/", "Glossary", "34 terms in plain words.")],
      card=("What is omlox?", "The open standard for industrial location."))

guide("location-data-quality", "What happens when an RTLS tag goes quiet?",
      "When an RTLS tag is not seen for a while, a good system shows last seen, never a guess. How AmIMotion handles freshness, gaps and data quality.",
      "When a tag", "goes quiet.",
      "When an RTLS tag is not seen for a while, the honest answer is “last seen at this place, at this time”, not a guess at where it is now. "
      "AmIMotion’s AmIHub keeps every position with the time it was seen, so the map shows how old each one is. Tags send when they move and sleep when still, so a quiet tag at rest is normal; "
      "a quiet tag that should be moving is a reason to check its battery, mounting or coverage.",
      [("why", "Why tags go quiet", UL("The tag is still and sleeping, which saves battery.", "It is somewhere with poor coverage, such as inside a metal cage.", "The battery is low, which AmIHub reports ahead of time.", "The tag fell off or was moved to another object.")),
       ("fresh", "Freshness is its own measure", P("How often a tag sends, how long processing takes and how often a screen refreshes are three different things. A precise point can still be too old to act on. Set a freshness target per task.")),
       ("show", "What the map should show", P("Old data shown as old. A trolley not seen for an hour should read “last seen 1 h ago, Line-side B”, with no animation suggesting it is live.")),
       ("check", "Checking quality in a pilot", P("Count how often tags are found where people expect them, how old positions are when people use them, and how many corrections people make."))],
      [("What happens if an RTLS tag is not seen for a while?", "AmIHub keeps its last position and time, and the map shows “last seen”. It does not guess where the tag is now."),
       ("How long do AmIGo batteries last?", "1 to 3 years, typical and usage-dependent. Battery level is reported to AmIHub."),
       ("Can a tag be moved to another trolley?", "Yes. Re-pair it in AmIHub so its history stays with the right object.")],
      [L_ACC, L_ASSOC, L_MCP], card=("When a tag goes quiet", "Freshness, last seen and honest gaps."))

guide("wip-visibility", "What is WIP visibility? WIP tracking vs visibility",
      "WIP visibility means knowing where each job is and how long it waited. How it differs from WIP tracking, what it needs, and how AmIMotion delivers it.",
      "What is", "WIP visibility?",
      "WIP (work-in-progress) visibility means knowing where each job physically is and how long it has waited at each step. WIP tracking only shows where a carrier is; visibility adds which job it holds and its time in each zone. "
      "AmIMotion delivers it with AmIGo tags on carriers, AmIMo anchors that locate them down to ±10 cm in 3D, and AmIHub, which links each carrier to its job and times every zone.",
      [("needs", "Three things it needs", P("<strong>A tag on the carrier.</strong> The trolley, bin or rack carries its own tag.",
                                           "<strong>A reliable position.</strong> Anchors locate the tag and every reading carries its time. UWB can tell neighbouring queues apart.",
                                           "<strong>A link to the job.</strong> A time-limited link between trolley and job, from your MES, ERP or a scan.")),
       ("tells", "What it tells you", P("Where a job is, where it has been, when it entered each zone and how long it waited. With an agreed time limit, a long wait becomes a flag for a named person.")),
       ("not", "What it cannot tell you", P("Being in a zone does not prove work started or finished. A long wait does not explain why. Location never authorises an action by itself.")),
       ("start", "How to start", P("Pick one flow where people walk to find work today. Tag its trolleys, agree a few zones and one time limit, and name who acts. Measure how work is found before and after."))],
      [("What is the difference between WIP visibility and WIP tracking?", "Tracking shows where a carrier is. Visibility adds which job it holds and how long it waited in each zone."),
       ("Which companies offer real-time WIP tracking for manufacturing?", "Several RTLS vendors do. AmIMotion, from Bengaluru, focuses on WIP visibility with UWB, down to ±10 cm in 3D."),
       ("Where should a plant start?", "With one flow where people walk to find work, often machining to assembly.")],
      [L_DWELL, L_ASSOC, L_DIAG], card=("What is WIP visibility?", "What it needs and how to start."))

guide("value-without-mes", "Prove RTLS value without a live MES link",
      "Can you prove RTLS value before connecting the MES? Yes: search time, wait times and dwell come from location alone. How AmIMotion pilots start.",
      "Value before", "the MES link.",
      "Yes, you can prove the value of RTLS before a live MES connection. Search time, how long carriers wait in each zone and where work piles up all come from location and time alone. "
      "AmIMotion pilots often start this way: AmIGo tags on one flow’s trolleys, located down to ±10 cm in 3D, with the job link added as a pilot step before any result is called job-level.",
      [("alone", "What location shows on its own", UL("Where each tagged trolley, bin or tool is, and when it was last seen.", "Time in each zone, by shift and station.", "How often people search, and how long finding something takes.")),
       ("later", "What needs the job link", P("Which job waits where, and job-level lead times, need the carrier-to-job link. Start it with a simple scan at loading, then connect the MES when the pilot earns it.")),
       ("plan", "A pilot plan that works", OL("Measure search time and walks before tags go on.", "Tag one flow’s carriers and agree a few zones.", "Add a scan-based job link for part of the pilot.", "Compare, then decide on the MES connection."))],
      [("Can we prove the value of RTLS without a live MES connection?", "Yes. Location and time alone show search time, waits and dwell. Add the job link during the pilot."),
       ("What does the MES link add?", "Which job is on each carrier, so waits become job-level."),
       ("Do we need IT involved from day one?", "For the network and hosting, yes. The MES connector can come later.")],
      [L_BASE, L_ASSOC, L_PILOT], "Evaluation", ("Value before the MES link", "What a pilot can prove on its own."))

guide("pilot-baseline", "What to measure before claiming RTLS results",
      "Before claiming RTLS cut search time, measure a baseline: searches, walk time, waits and corrections. The pilot baseline AmIMotion recommends.",
      "Measure before", "you claim.",
      "Before claiming that RTLS reduced search time, measure a baseline on the same flow: how often people search, how long each search takes, how far they walk, how long carriers wait in each zone and how many records need correcting. "
      "AmIMotion pilots measure this before tags go on, then compare with the live map, where tags are located down to ±10 cm in 3D.",
      [("what", "What to measure", UL("Searches per shift, and minutes per search.", "Walking distance or time to find a carrier.", "Time in key zones, measured by hand or from existing scans.", "Corrections to records, such as wrong locations or statuses.")),
       ("how", "How to measure fairly", P("Use the same flow, shifts and product mix before and after. Let the people who search record it, with a simple sheet. Two weeks is better than two days.")),
       ("claim", "What you can then claim", P("Compare like with like and report the spread, not just the best day. A financial case needs real costs on top, which your team owns.")),
       ("tool", "A head start", P("The <a href=\"/tools/search-time/\">search-time calculator</a> turns your own numbers into hours and cost per year, as a starting point for the baseline."))],
      [("What should be measured before claiming RTLS reduced search time?", "Searches per shift, minutes per search, walking time, zone waits and record corrections, on the same flow, before tags go on."),
       ("How long should a baseline run?", "Long enough to cover normal variation. Two weeks is a sensible minimum."),
       ("Will AmIMotion calculate the financial case?", "Not from a calculator. A sound case needs a measured baseline and your real costs.")],
      [L_MES, L_PILOT, ("/tools/search-time/", "What searching costs you", "Your own numbers, worked out.")],
      "Evaluation", ("Measure before you claim", "The baseline a pilot needs."))

guide("rtls", "What is RTLS? Real-time location explained",
      "What a real-time location system (RTLS) is, how tags and anchors make a position, and what it can and cannot tell you. With AmIMotion as the example.",
      "RTLS,", "without the jargon.",
      "A real-time location system (RTLS) uses fixed receivers, called anchors, to work out where tagged objects are, usually indoors where GPS does not reach. "
      "A useful record has three parts: which object, where, and when it was seen. AmIMotion is a UWB RTLS: AmIGo tags, AmIMo anchors that locate them down to ±10 cm in 3D and AmIHub software.",
      [("object", "Start with the object", P("A tag goes on a trolley or tool. Anchors pick up its signal, and software works out the position. The tag must sit on the right object, which is a different thing from knowing the job it carries.")),
       ("job", "Add the link to the job", P("Say trolley 14 holds job 208. That link comes from your workflow, with a start, an end and an owner.")),
       ("time", "Make time visible", P("Ask when each position was seen. A precise point can still be too old to act on.")),
       ("zone", "Turn the map into a question", P("A zone, such as an assembly queue, gives a position meaning. Define what each zone means and who looks when something is off.")),
       ("check", "A short checklist", P("The right tag on the right object, position quality in your conditions, data age, how jobs are linked, and who responds. They tell you more than a moving dot on a demo screen."))],
      [("What does RTLS stand for?", "Real-time location system."), ("Which radio does an RTLS use?", "UWB, BLE, RFID, Wi-Fi or a mix. AmIMotion uses UWB, with BLE and Wi-Fi FTM on the same anchors."),
       ("Does RTLS work outdoors?", "AmIMo anchors work indoors and in sheltered outdoor areas such as yards under a canopy.")],
      [L_VS, L_ASSOC, ("/glossary/", "Glossary", "34 terms in plain words.")], card=("What is RTLS?", "Real-time location, plainly."))

guide("alternatives", "Scanning, checkpoints or UWB: how to choose",
      "Barcode scans, RFID checkpoints or UWB real-time location: an honest way to decide which your workflow needs, and when to combine them with AmIMotion.",
      "Scan, checkpoint", "or location?",
      "Start with the question. Do you need someone to confirm a step, proof that something passed a point, or where it is right now? Each is a different job. "
      "Scans confirm steps, RFID checkpoints prove passage, and UWB location, such as AmIMotion, down to ±10 cm in 3D, shows where work is between those points and how long it waits.",
      [("scan", "When a scan is right", P("A scan is a deliberate confirmation of an item or a step. If that is all you need, improve the scanning first.")),
       ("check", "When a checkpoint is enough", P("If you only need to know that an item passed a point, test a checkpoint against exactly that.")),
       ("loc", "When location adds something", P("If work moves between scans and people go looking for it, location answers a new question. It still needs a link to the job and a tested install.")),
       ("effort", "Compare the whole effort", P("Count anchors, setup, power, network, tag mounting, reassignment, upkeep and exceptions. Compare the cost of useful answers, not hardware prices alone.")),
       ("test", "Use the same test", P("Give every option the same scenario and the same measures. Record what each sees, what it misses and how much human effort it needs."))],
      [], [L_VS, L_RTLS, L_PILOT], "Evaluation", ("Scan, checkpoint or location?", "A fair way to choose."))

# ---------------- field guides hub ----------------
groups = {}
for p, t, l, g in GUIDES: groups.setdefault(g, []).append((p, t, l))
write("/learn/", "RTLS, UWB and WIP field guides",
      "Plain guides to real-time location on the factory floor: UWB vs RFID, anchors, accuracy, dwell time, WIP visibility and choosing an RTLS in India.",
      [
          head("Understand it.", "Then decide.", "Plain guides for the questions after the demo. No sign-up.",
               short="AmIMotion’s field guides answer the questions plants ask about real-time location: how UWB compares with BLE and RFID, how many anchors a floor needs, how to test accuracy, "
                     "and how to see where work in progress waits. Every number carries its condition, such as down to ±10 cm in 3D, with AmIMo anchors.",
               trail=[("Field guides", None)], actions=()),
          *[section(vp(g), links(items), tone="light") for g, items in groups.items()],
          section(vp("More answers."), links([("/faq/", "Questions and answers", "AmIMotion, answered plainly."), ("/glossary/", "Glossary", "34 terms in plain words."),
                                              ("/industrial-spatial-intelligence/", "Industrial Spatial Intelligence", "What the category means.")])),
          close(),
      ])
