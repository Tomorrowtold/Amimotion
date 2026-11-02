from lib import *

# ---------------- technology ----------------
write("/technology/", "How UWB indoor positioning works",
      "How AmIMotion turns a nanosecond UWB pulse into a 3D position down to ±10 cm: timing, angle, modes per zone, multipath, FiRa and omlox.",
      [
          head("Find it first.", "Then add meaning.", "Ultra-wideband radio gives a precise, time-stamped position. Zones and a link to the job make it useful.",
               short="AmIMotion locates tags with ultra-wideband (UWB) radio to IEEE 802.15.4z. AmIMo anchors time each pulse to tens of picoseconds and read the angle it arrives from, "
                     "and AmIHub solves a 3D position down to ±10 cm (with AmIMo anchors). The same anchors also offer BLE ranging and Wi-Fi FTM. AmIMotion is built on the FiRa and omlox specifications.",
               trail=[("Technology", None)], dark=True, actions=(("Book a call", "/contact/"), ("Positioning modes", "#modes"))),
          section(
              vp("Light travels", "about 30 cm a nanosecond.", "So timing a pulse to tens of picoseconds places a tag to centimetres. Angle of arrival adds direction, so fewer anchors fix a point."),
              tiles([("Timing", "Time of flight", "Each anchor records exactly when a pulse arrives. The differences between anchors give the position."),
                     ("Angle", "3D angle of arrival", "An antenna array in each AmIMo reads the direction, horizontal and vertical, so height counts too."),
                     ("Reflections", "Multipath, handled", "The wide band tells the direct signal from echoes off steel. NLOS algorithms keep positions steady.")]),
              tone="dark"),
          section(
              vp("Short pulses", "survive metal.", "Racking and machines bounce radio around. UWB’s very short pulses let the direct path be separated from the reflections."),
              ph("Low angle down a machining aisle lined with steel racking, an anchor high on a column in the foreground, a trolley mid-aisle. Cool, clean, high-contrast light. 21:9.", "steel", "cine"),
              stats([("802.15.4z", "The IEEE UWB standard", "HRP, channels 5 and 9"), ("FiRa · omlox", "Built on the specifications", "Open devices and data"),
                     ("3 radios", "UWB, BLE, Wi-Fi FTM", "From the same anchors"), ("±10 cm", "Down to, in 3D", "With AmIMo anchors, site-dependent")]),
              tone="dark", flush=True),
          section(
              vp("Choose the method", "per zone.", "Switch modes per zone in AmIHub, with no hardware swap. High precision at gates, low power everywhere else."),
              compare(["Mode", "How it works", "Best for"], [
                  ("UL-TDoA", "Uplink time difference of arrival. The tag sends; anchors compare when it arrived.", "Thousands of low-power tags across a floor"),
                  ("DL-TDoA", "Downlink. Anchors send; the device works out its own position.", "Devices that work out their own position"),
                  ("AoA + two-way ranging", "Angle of arrival plus a timed ping and reply.", "Precise gates, docks and cells"),
                  ("BLE · Wi-Fi FTM", "Bluetooth ranging and Wi-Fi fine timing from the same anchors.", "BLE and Wi-Fi devices, and yards. Device support confirmed per site.")]),
              id="modes", tone="light"),
          section(
              vp("Never just a dot."),
              tiles([("Position", "Where it was seen", "On a grid tied to your floor plan, in 3D."),
                     ("Time", "When it was seen", "Not when the screen refreshed. Old data reads “last seen at …”."),
                     ("Quality", "How good it is there", "Metal, blocked views and mounting matter. Measured in the pilot.")], head="over"),
              links([("/learn/accuracy/", "How to test accuracy", "Typical, best case and the hard spots."),
                     ("/learn/anchor-planning/", "How many anchors?", "What really sets the count."),
                     ("/learn/omlox/", "What is omlox?", "The open standard for industrial location.")]),
              tone="light"),
          section(
              vp("Open by design.", "Your data, your systems."),
              split("Link records, keep meaning.",
                    ["AmIHub holds tags, positions, times and zones. Your MES or ERP holds jobs and status.",
                     "Agree the IDs, when a link is valid and which way events flow, so a location never silently overwrites a business record."],
                    ["REST, MQTT and WebSocket", "omlox hub interface", "Built-in MCP server for AI assistants, shown in a live demo"],
                    ph("An OT engineer at an open control cabinet beside the line, a laptop on the cabinet shelf. Warm, low, practical light. 4:3.", "office")),
              id="mcp", tone="light"),
          section(faq([
              ("How does UWB measure position?", "A tag sends a pulse a few nanoseconds wide. AmIMo anchors time its arrival (time of flight and TDoA) and read its angle of arrival. Because light travels about 30 cm a nanosecond, that timing places the tag to centimetres."),
              ("Which UWB RTLS supports FiRa?", "AmIMotion is built on the FiRa and omlox specifications, and its UWB radio follows IEEE 802.15.4z. It claims no formal certification."),
              ("Which RTLS works with UWB, BLE and Wi-Fi on the same anchors?", "AmIMo anchors offer UWB, BLE ranging and Wi-Fi FTM from the same unit, so one installation can serve more than one tag type."),
              ("How accurate is AmIMotion?", "Down to ±10 cm in 3D, with AmIMo anchors. Accuracy depends on the site, so a pilot measures it on your floor."),
              ("Does it integrate with SAP or an MES over MQTT?", "AmIHub publishes zone events over MQTT and offers REST, WebSocket and an omlox hub interface. The connector for your system is confirmed during scoping."),
              ("Does the system run without internet?", "Yes. AmIHub can run on an industrial PC in the plant with no internet, or in the cloud."),
          ], "The fine print, up front.")),
          close(),
      ], tone="dark", type="article")

# ---------------- solutions hub ----------------
write("/solutions/", "RTLS solutions for WIP, tools and vehicles",
      "What AmIMotion solves on a manufacturing floor: see where work in progress waits, and find trolleys, tools and vehicles down to ±10 cm in 3D.",
      [
          head("Two questions.", "One system.", "Where is it? And how long has it waited? AmIMotion answers both on one live map.",
               short="AmIMotion is a UWB real-time location system for manufacturing. Teams use it for two jobs: work-in-progress visibility, which shows where jobs wait between operations, "
                     "and finding tagged tools, trolleys and vehicles from a screen. Positions are accurate down to ±10 cm in 3D, with AmIMo anchors.",
               trail=[("Solutions", None)]),
          section(cards([
              ("/solutions/wip/", ph("Three loaded trolleys in a queue beside an inspection station, one person walking past without looking. Amber late light. 4:3.", "amber"), "Work in progress", "See which job waits where, and for how long.", "WIP visibility"),
              ("/solutions/assets/", ph("A supervisor walking fast between tall racks, looking side to side for something. Cool aisle light. 4:3.", "steel"), "Tools, vehicles and carriers", "Find it from a screen instead of walking the hall.", "Find it fast"),
          ], 2),
              links([("/use-cases/", "Use cases", "Four jobs, as short films."), ("/industries/", "Industries", "Manufacturing, warehousing and robotics."), ("/diagnostic/", "Diagnose your floor", "Six questions. A pilot scope that fits.")])),
          close(),
      ])

# ---------------- WIP ----------------
write("/solutions/wip/", "WIP visibility and tracking with UWB RTLS",
      "AmIMotion shows where work in progress is and where it waits: tagged trolleys down to ±10 cm in 3D, linked to jobs, timed in every zone.",
      [
          head("Find the job.", "Time the wait.", "A tag shows where the trolley is. Link it to the job, and you see which work waits where.", amber=True,
               short="AmIMotion gives manufacturers real-time WIP visibility. AmIGo tags ride on trolleys and bins, AmIMo anchors locate them down to ±10 cm in 3D, "
                     "and AmIHub records every zone entry and exit with its time. Linked to the job through an agreed carrier-to-job association, that shows which job waits where, and for how long.",
               trail=[("Solutions", "/solutions/"), ("Work in progress", None)], actions=(("Book a call", "/contact/"), ("Diagnose your floor", "/diagnostic/")),
               media=ph("A loaded trolley of machined parts parked between two cells, an AmIGo on its frame, nobody near it. Amber afternoon light raking across the floor. 21:9.", "amber", "cine")),
          section(
              vp("Four questions.", "Four needs.", "A dot on a map answers the first one. The rest need agreements you make once, at the start.", more="wip-four"),
              tiles([("Where is the work?", "The tag’s position plus a link from trolley to job. Without the link you see the trolley, which still helps."),
                     ("Where is it waiting?", "Zones you name, such as stations and queues, with entry times. Zones follow the process, not the radio."),
                     ("What needs a look?", "A named owner who acts when work waits too long. A long wait means “go and look”. It does not say why."),
                     ("What happens next?", "A person checks and decides. Any automation comes later, with its own approval.")], 4),
              km("wip-four", "WIP visibility", "Tracking is the dot. Visibility is the wait.", [
                  "WIP tracking tells you where a carrier is.",
                  "WIP visibility adds which job it holds and how long it has waited in each zone.",
                  "The job link comes from your MES, ERP or a scan step, for a set time.",
                  "Being in a zone does not prove work started or finished."], "/learn/wip-visibility/", "#f2a33a", "#f46f5e")),
          section(
              vp("Tag. Locate. Link.", "Watch. Act."),
              steps([("Tag", "An AmIGo rides on the trolley. It stays with the trolley through every job it carries."),
                     ("Locate and link", "AmIMo anchors place it in 3D with the time. A scan or MES event puts the job on it."),
                     ("Watch the wait", "AmIHub times every zone entry and exit, so you see how long the job has waited."),
                     ("Act early", "Production control sees job, place and wait on one screen. Nothing is closed on location alone.")]),
              tone="light", flush=True),
          section(
              vp("Queued is not assembled.", lede="Location says where something was seen. Whether work is finished comes from your MES or your people. The map never claims more than that.", center=True),
              ph("Production control desk at shift change: two people looking at a large screen with a floor map, the real line visible through glass behind. Dusk blue outside, warm desk light. 21:9.", "night", "cine"),
              tone="dark"),
          section(
              vp("Start with one question.", "Pilot one bay or line."),
              tiles([("Scope", "One flow", "Pick the trolleys, the area, a few zones and one question."),
                     ("Data", "One agreed link", "Decide how a job gets onto a trolley, and when it comes off."),
                     ("Acceptance", "A fair baseline", "Measure tag identity, position quality, freshness and what people did differently.")]),
              links([("/learn/dwell-time/", "How dwell time is measured", "Zone entry to exit, and what it includes."),
                     ("/learn/association/", "Which job is on the trolley?", "The link with a start, an end and an owner."),
                     ("/tools/pilot/", "Your pilot on one page", "Three choices, one brief for the call.")])),
          section(faq([
              ("Which companies offer real-time WIP tracking for manufacturing?", "Several RTLS vendors do, using UWB, BLE or RFID. AmIMotion, from Bengaluru, focuses on WIP visibility with UWB: trolleys located down to ±10 cm in 3D, linked to jobs and timed in each zone."),
              ("How can I see where WIP is waiting on my shop floor?", "Tag the carriers, name the zones where work queues, and record every entry and exit. AmIHub shows the time in each zone, so long waits stand out."),
              ("What is the difference between WIP visibility and WIP tracking?", "Tracking shows where a carrier is. Visibility adds which job it holds and how long it has waited, which needs zones and a carrier-to-job link."),
              ("Can we start without connecting our MES?", "Yes. Start with trolley location and wait times. Make the job link a pilot step before calling any result job-level."),
          ])),
          close(),
      ])

# ---------------- assets ----------------
write("/solutions/assets/", "Find tools, trolleys and forklifts with UWB",
      "Stop walking the hall to look. AmIMotion finds tagged trolleys, bins, tools and forklifts on a live map, down to ±10 cm in 3D, with last-seen times.",
      [
          head("Find it from a screen.", "Not a walk.", "Tag the tools, fixtures, carriers and vehicles your team looks for. Find each one in seconds.",
               short="To cut the time spent searching for trolleys, bins and tools, AmIMotion puts a small AmIGo tag on each one. AmIMo anchors locate them down to ±10 cm in 3D, "
                     "and the AmIHub map shows where each is now, which zone had it last and when it was last seen.",
               trail=[("Solutions", "/solutions/"), ("Tools, vehicles and carriers", None)],
               media=ph("A supervisor in a long aisle between racks, tablet in hand, turning toward a trolley half-hidden behind a column. Cool light with a warm pool where the trolley is. 21:9.", "cool", "cine")),
          section(
              vp("Where was it", "last seen?", "Trolleys and carriers move all day. The map shows the last zone, the time, and how long each one has sat."),
              tiles([("Trolleys and carriers", "Search by name or tag. Walk straight there."),
                     ("Tools and fixtures", "History shows which cell used a fixture, and when. Screw-mount where work won’t knock it."),
                     ("Forklifts and tuggers", "Zone, trips and parked time. A vehicle-powered tag needs no battery swaps.")])),
          section(
              vp("Four things", "to agree first."),
              tiles([("Identity", "Which tag sits on which object, and who keeps that right."),
                     ("Precision", "How precise the position must be for the job, checked on your floor."),
                     ("Freshness", "How old a position can be before it stops helping. Old data is shown as old."),
                     ("Owner", "Who uses the answer, and what they will do differently.")], 4),
              links([("/tools/search-time/", "What searching costs you", "Your own numbers, worked out."),
                     ("/use-cases/find-the-asset/", "Watch: Where is that trolley?", "A 1:10 film."),
                     ("/products/amigo/", "The AmIGo tag", "Mounts, battery and forms.")]),
              tone="light"),
          section(faq([
              ("How do I reduce time spent searching for trolleys and bins?", "Tag what people search for and put it on a live map. With AmIMotion the search starts on a screen, with the zone and the last-seen time, instead of a walk around the hall."),
              ("How do you track tools on a factory floor?", "Fix an AmIGo tag to the tool, fixture or gauge case with adhesive or a screw. AmIMo anchors locate it, and AmIHub keeps a history of which cell had it."),
              ("Hamare plant mein forklifts aur trolleys ka pata nahi chalta. Iska kya solution hai?", "Forklifts aur trolleys par AmIGo UWB tag lagaiye. AmIMo anchors unhe ±10 cm tak locate karte hain, aur AmIHub map par dikhta hai ki har ek abhi kahan hai aur kab se wahan khada hai."),
              ("What if a tag goes quiet?", "The map shows when it was last seen. It does not guess where the item is now."),
          ])),
          close(),
      ])

# ---------------- use cases ----------------
UC = [
    ("find-the-asset", 1, "Find a trolley or tool fast with UWB", "Where is that trolley?", None,
     "Today someone walks the hall to find it. With a tag on it, the trolley is a spot on the map.",
     "With AmIMotion, every tagged trolley, tool, fixture and bin shows on one live map, located down to ±10 cm in 3D (with AmIMo anchors). Finding one starts with a search, not a walk.",
     "A worker needs one trolley. Nobody knows where it is, so someone walks the hall, asks around and checks a clipboard. It happens many times a shift.",
     "The worker searches the live map. It shows the zone, the bay and when the trolley was last seen. The worker walks straight there.",
     [("Does anyone scan the trolley to find it?", "No. The anchors locate its tag whenever it moves. At rest, the map keeps its last position."),
      ("What if a tag goes quiet?", "The map shows when it was last seen. It does not guess where the trolley is now."),
      ("What else can carry a tag?", "Bins, kit racks, fixtures, tools, forklifts and tuggers.")]),
    ("amr-hand-off", 2, "AMR hand-off: see what robots carry", "The hand-off,", "on the map.",
     "Tag the robot and the trolley. The map shows them move together, and where they arrive.",
     "With AmIMotion, robots, forklifts, trolleys and people share one live map, each located down to ±10 cm in 3D. Each arrival gets a time and a place, with no scan.",
     "Robots move material, but the plant knows what a robot carried only if someone scanned it. A missed scan means a wrong record.",
     "The robot tows a tagged trolley from pick-up to the line. Both tags move together on the map, and the destination zone records the arrival time.",
     [("Do we need to integrate with the robot?", "To locate it, the robot only needs a tag. Any deeper link with your fleet software is scoped per site."),
      ("Does AmIMotion dispatch the robot?", "No. Your fleet software drives, routes and dispatches. AmIMotion shows where the robot and its load are."),
      ("How do you track forklifts and AMRs indoors to a few centimetres?", "Fit each with a UWB tag. AmIMo anchors locate them down to ±10 cm in 3D, on the same map as trolleys and people.")]),
    ("station-to-station", 3, "WIP by zone, station to station", "Every station move,", "timed.",
     "Each station is a zone. When a tagged trolley enters or leaves, AmIHub records the time.",
     "With AmIMotion, each tagged trolley is located down to ±10 cm in 3D and timed at every station zone. AmIHub can send each zone event to your ERP or MES under rules your plant agrees.",
     "Work status lives in the ERP, but it changes only when someone scans or types. Between scans the order is out of sight.",
     "Kitting, Machining, Assembly and Dispatch are zones on the map. Each time the trolley enters or leaves one, AmIHub records the time and can send the event on.",
     [("Which ERP does it work with?", "AmIHub sends events over REST, MQTT, WebSocket and the omlox hub interface. The connector for your ERP is confirmed during scoping."),
      ("Does entering a zone mean the step is done?", "Only if your plant says so. What counts as done is a rule you set, such as “entering Assembly ends Machining”."),
      ("What if a trolley sits too long?", "Time in each zone is recorded, so long waits are easy to see. Who on your team acts when work waits too long is agreed before the pilot.")]),
    ("ask-your-plant", 4, "Ask your plant: AI answers over MCP", "Ask your plant", "a question.",
     "Type a plain question. An AI assistant answers from live positions. A person approves any action.",
     "AmIHub, AmIMotion’s software, has a built-in MCP server, so an AI assistant can answer questions from live positions located down to ±10 cm in 3D. Every call is logged, and a person approves any action. Shown in a live demo.",
     "Questions travel one radio call at a time. “Where is it?” “Who is free?” Someone has to go and look, and the answer is old when it arrives.",
     "A supervisor asks in a chat panel beside the map. The assistant reads positions, zones and history through AmIHub’s MCP server and highlights the answer.",
     [("What is MCP?", "Model Context Protocol: an open standard that lets AI assistants use software tools. AmIHub has an MCP server built in."),
      ("Can the assistant act on its own?", "Not in the setup we show. It reads only what you allow, and write actions wait for a person’s approval."),
      ("Which assistants work with it?", "Any MCP-capable client. Each assistant gets its own access rights.")]),
]
UC_DESC = {
    "find-the-asset": "Find a tagged trolley, tool or bin on AmIMotion’s live map instead of walking the hall. Located down to ±10 cm in 3D. Watch the 1:10 film.",
    "amr-hand-off": "Record what an AMR carried and where it arrived, with no scan: tagged robots, trolleys and forklifts on one AmIMotion map. Watch the 1:17 film.",
    "station-to-station": "Time each tagged trolley at every station zone and send zone events to your ERP or MES with AmIMotion. Watch the 1:25 film.",
    "ask-your-plant": "Ask an AI assistant where tagged work is, answered from live AmIHub data over MCP. A person approves any action. Watch the 1:24 film.",
}
for slug, n, title, h1, soft, lede, short, today, withit, qs in UC:
    others = [u for u in UC if u[0] != slug]
    write(f"/use-cases/{slug}/", title, UC_DESC[slug],
          [
              head(h1, soft, lede, short=short, trail=[("Use cases", "/use-cases/"), (FILMS[n][0], None)], dark=True,
                   media=film(n)),
              section(
                  vp("Today,", "and with AmIMotion."),
                  tiles([("Today", today), ("With AmIMotion", withit)], 2), tone="dark"),
              section(faq(qs, "Common questions.")),
              section(vp("Other jobs,", "same tags."),
                      cards([(f"/use-cases/{o[0]}/", poster(o[1]),
                              FILMS[o[1]][0], FILMS[o[1]][3] + " film", "Watch") for o in others]), tone="light"),
              close(),
          ], tone="dark")

write("/use-cases/", "RTLS use cases: tools, WIP, AMRs and AI",
      "Four AmIMotion use cases as short films: find a trolley, follow a robot hand-off, time work station to station, ask the plant a question.",
      [
          head("Four jobs.", "One map.", "Each starts with a walk someone takes today, and ends with an answer on a screen.",
               short="AmIMotion is used to find tagged assets, record robot hand-offs, time work at each station and let AI assistants answer questions about the floor. "
                     "All four run on the same AmIGo tags, AmIMo anchors and AmIHub software, with positions down to ±10 cm in 3D.",
               trail=[("Use cases", None)], dark=True),
          section(cards([(f"/use-cases/{u[0]}/", poster(u[1]),
                          FILMS[u[1]][0], u[5], "Watch the film") for u in UC], 2), tone="dark"),
          close(),
      ], tone="dark")

# ---------------- industries ----------------
IND = [
    ("manufacturing", "UWB RTLS for manufacturing plants", "Find work", "between cells.", "steel",
     "Work crosses many cells. See where each trolley is, which job it holds, and how long it waited.",
     "AmIMotion is a UWB real-time location system for manufacturing. Tags locate carriers between operations down to ±10 cm in 3D, and a link from your MES says which job each one holds.",
     "Machining cells with totes of parts between operations, a person working at one cell, a loaded trolley in the foreground. Clean, cool daylight. 21:9.",
     [("WIP carriers and bins", "Find the job, see the wait", "Carriers between machining and assembly, with time in each zone."),
      ("Line-side supply", "See the next delivery", "Where the next kit, tugger or bin is waiting."),
      ("Tools and fixtures", "Find shared fixtures", "Fixtures and gauges, and which cell used them last.")],
     "Your MES stays in charge.", "AmIHub adds where and when. Jobs and status stay in your MES or ERP.",
     [("What is the best indoor positioning system for a manufacturing plant in India?", "The one that answers your floor’s question at the accuracy it needs, measured on your floor. AmIMotion, from Bengaluru, offers UWB positioning down to ±10 cm in 3D, anchors without data cabling and local engineers on site."),
      ("Which RTLS vendors track carriers and WIP on an assembly line in India?", "Plants compare global RTLS suppliers with Indian makers. AmIMotion designs and builds its UWB tags, anchors and AmIHub software in India, and focuses on WIP visibility. See the guide to UWB RTLS companies in India."),
      ("Can AmIMotion tell which job is on a carrier?", "Through a link, not the radio. The tag names the trolley. Your MES or a scan step says which job it holds, and for how long."),
      ("Does UWB work around machining centres and racking?", "UWB’s very short pulses help tell the direct signal from reflections off steel. Your pilot measures it in the hardest spots.")]),
    ("warehousing", "UWB RTLS for warehousing and intralogistics", "Every dock and vehicle,", "one map.", "cool",
     "Forklifts and pallets rarely stay where the system last saw them. The map shows where each one is now.",
     "In warehousing, AmIMotion shows where forklifts, tuggers, robots and tagged pallets are, down to ±10 cm in 3D, and how long loads wait at docks and staging lanes.",
     "A dock door at dawn, pallets staged in lanes, a forklift crossing with motion blur. Cool blue hour with warm dock light. 21:9.",
     [("Forklifts and tuggers", "See every vehicle", "Running, idle or parked, and how long each one dwells."),
      ("Docks and staging", "See how long loads wait", "Time at each dock door and staging lane, from dock to stock."),
      ("Pallets and totes", "Find the load", "Tagged pallets, totes and high-value goods through put-away, staging and storage.")],
     "Your WMS stays in charge.", "AmIHub adds where and how long. Orders and stock stay in your WMS.",
     [("Can AmIMotion track forklifts and AMRs together?", "Yes. Tags fit forklifts, tuggers and robots, and all of them appear on one live map."),
      ("Does it replace our WMS?", "No. AmIHub feeds your WMS over REST, MQTT, WebSocket or omlox. The WMS stays the record."),
      ("Can AmIMotion time dock-to-stock?", "Yes. Each tagged pallet or tote is time-stamped as it enters and leaves the dock, staging lanes and put-away zones, so you see where loads wait.")]),
    ("robotics", "UWB location for robotics and AMR floors", "Robots, vehicles, people.", "One map.", "night",
     "Tag robots, forklifts, trolleys and people, and see them all on one map.",
     "On robotics floors, every tagged robot, vehicle and badge shares one map and one time-stamped history, with positions down to ±10 cm in 3D.",
     "An AMR towing a trolley along a yellow lane, a person working at a bench beside it. Warm and blue mixed light, night shift. 21:9.",
     [("Mixed traffic", "One map for everything that moves", "Tagged AMRs, forklifts, trolleys and badges on the same map."),
      ("Hand-offs", "See where robots wait", "Time at pick-up and drop-off points, and where hand-offs stall."),
      ("AI assistants", "Ready for what comes next", "AI assistants can query the same map through AmIHub’s MCP server. Shown in a live demo.")],
     "Your fleet software stays in charge.", "AmIMotion locates and records. Driving, routing and safety stay with your fleet system.",
     [("Why not use each robot’s own localisation?", "A robot’s own map covers that vendor’s robots. A shared layer also covers forklifts, trolleys and people, in data you own."),
      ("How precise is a robot’s position?", "The same as any tag: down to ±10 cm in 3D, with AmIMo anchors. Your site sets the final figure."),
      ("Is the MCP server available today?", "It is built into AmIHub and shown in a live demo. The setup for your site is confirmed during scoping.")]),
]
IND_DESC = {
    "manufacturing": "UWB real-time location for manufacturing: find WIP carriers, line-side supply and tools down to ±10 cm in 3D, and see where jobs wait.",
    "warehousing": "UWB location for warehouses: forklifts, tuggers, pallets and AMRs on one AmIMotion map, with dock and staging wait times.",
    "robotics": "A shared UWB location layer for robotics and AMR floors: robots, forklifts, trolleys and badges on one AmIMotion map and history.",
}
IND_CRUMB = {"manufacturing": "Manufacturing", "warehousing": "Warehousing", "robotics": "Robotics and AMRs"}
for slug, title, h1, soft, mood, lede, short, brief, three, h2b, ledeb, qs in IND:
    write(f"/industries/{slug}/", title, IND_DESC[slug],
          [
              head(h1, soft, lede, short=short, trail=[("Industries", "/industries/"), (IND_CRUMB[slug], None)],
                   actions=(("Book a call", "/contact/"), ("Diagnose your floor", "/diagnostic/")), media=ph(brief, mood, "cine")),
              section(vp("Where teams start."), tiles(three)),
              section(vp(h2b, lede=ledeb),
                      stats([("±10 cm", "Down to, in 3D", "With AmIMo anchors, site-dependent"), ("REST · MQTT", "WebSocket and omlox", "Open interfaces"),
                             ("On-premise", "Or cloud", "No internet needed on site"), ("One bay", "First", "Then grow on the same AmIHub")]), tone="dark"),
              section(faq(qs)),
              close(),
          ])

write("/industries/", "UWB RTLS for manufacturing, warehousing, AMRs",
      "AmIMotion for manufacturing, robotics and warehousing floors: one UWB system, down to ±10 cm in 3D, set up for how your floor runs.",
      [
          head("Built for floors", "that move.", "One system, set up for how your floor runs.",
               short="AmIMotion is built for manufacturing, robotics and warehousing floors. The same AmIGo tags, AmIMo anchors and AmIHub software locate carriers, pallets, totes, vehicles and robots "
                     "down to ±10 cm in 3D.", trail=[("Industries", None)]),
          section(cards([
              ("/industries/manufacturing/", ph("Parts on carriers between machining cells. Clean, cool light. 4:3.", "steel"), "Manufacturing", "Work between cells, lines and stores."),
              ("/industries/warehousing/", ph("A tall racked warehouse, one picker at mid height on a lift. Blue daylight. 4:3.", "cool"), "Warehousing", "Docks, staging, forklifts and milk runs."),
              ("/industries/robotics/", ph("An AMR towing a trolley along a yellow lane, people working beside it. 4:3.", "night"), "Robotics and AMRs", "Robots, vehicles and people on one map."),
          ])),
          section(vp("Factories and warehouses.", "The same system for both.", "The same tags, anchors and map, from the machining hall to the dock."),
                  tiles([("Work in progress and tools", "Tag the trolley, bin or fixture that carries the work. See where it is and how long it has waited at each station."),
                         ("Warehouse, from dock to stock", "Pallets, totes and staging lanes, located from the dock to put-away. See where loads wait and how long forklifts dwell."),
                         ("Forklifts and AMRs", "Vehicles and robots on the same map as the people around them."),
                         ("Yards", "Sheltered outdoor areas, on the same system.")], 4), id="applications"),
          close(),
      ])
