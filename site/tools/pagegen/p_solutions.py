"""Where it helps: the solutions squad's round 07 copy (team/rounds/07-pages/solutions/*.md), twelve pages:
/solutions/, /solutions/wip/, /solutions/assets/, /industries/ and its three floors, /use-cases/ and its four jobs.
Use-case heads are model-hall stills, not films (README decision 1): no film(), no VideoObject. One ground, no tone."""
from lib import *

CAM = "Model hall, build_hall.py camera A"
WHERE = ("Where it helps", "/solutions/")
IND = ("Industries", "/industries/")
UC = ("Use cases", "/use-cases/")


FIND_ALT = "A model factory floor. One trolley stopped between the racks is marked blue. A blue line shows its path and ends where it stopped."
PATH_ALT = "A model floor, pale except one trolley's blue path from a press to the inspection queue."
DROP_ALT = "A model floor, all pale except two trolleys at a drop-off point, marked amber because they are waiting."
ASK_ALT = "The same model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited."
# round 08 stills (team/rounds/08-pictures/stills-index.md): code -> (hall base, alt that replaces the brief's, or None)
STILL = {
    "P-SOL-01": ("hall-all", None), "P-SOL-02": ("hall-inspect-43", None),
    "P-SOL-03": ("hall-back-43", "A model factory floor. A tool cart, a fixture, two bins and a robot are marked blue where they stopped."),
    "P-WIP-01": ("hall-wip", None), "P-WIP-02": ("hall-waits-43", None), "P-AST-01": ("hall-assets", None),
    "P-IND-01": ("hall-all", None), "P-IND-02": ("hall-mfg-43", None), "P-IND-03": ("hall-wh-43", None), "P-IND-04": ("hall-back-43", None),
    "P-MFG-01": ("hall-mfg", None), "P-MFG-02": ("hall-waits-43", None), "P-WH-01": ("hall-wh", None),
    "P-ROB-01": ("hall-robot", None), "P-ROB-02": ("hall-dropoff-43", None),
    "P-UC1-01": ("hall-find", FIND_ALT), "P-UC3-01": ("hall-build", None), "P-UC3-02": ("hall-path-43", None),
    "P-UC2-01": ("hall-handoff", None), "P-UC4-01": ("hall-ask", None),
    # /use-cases/ cards: the 4:3 cut nearest each page's head still
    "P-UC1-01c": ("hall-find-43", FIND_ALT), "P-UC3-01c": ("hall-path-43", PATH_ALT), "P-UC2-01c": ("hall-dropoff-43", DROP_ALT), "P-UC4-01c": ("hall-ask-43", ASK_ALT),
}
CARD = "(max-width:639px) 100vw, (max-width:1023px) 50vw, 31vw"


def pic(code, brief, ratio, alt):
    base, alt2 = STILL.get(code, (None, None))
    return slot(brief, ratio, alt2 or alt, code=code, base=base, sizes=CARD if code.endswith("c") or code in ("P-SOL-02", "P-SOL-03", "P-IND-02", "P-IND-03", "P-IND-04") else None)


UC_LINE = {
    "find-the-asset": ("/use-cases/find-the-asset/", "Where is that trolley?", "Find it from a screen."),
    "station-to-station": ("/use-cases/station-to-station/", "Station to station", "Every entry and exit, timed."),
    "amr-hand-off": ("/use-cases/amr-hand-off/", "The hand-off", "What the robot brought, and when."),
    "ask-your-plant": ("/use-cases/ask-your-plant/", "Ask your floor", "AI assistants and MCP."),
}


# round 13 (Boston Dynamics jobs grid): the four jobs as picture tiles, each the 4:3 cut of its own head still
UC_PIC = {
    "/use-cases/find-the-asset/": ("P-UC1-01c", "A model factory floor. One trolley stopped behind the racks is marked blue."),
    "/use-cases/station-to-station/": ("P-UC3-01c", "A model factory floor. Blue lines show each trolley's full path between checkpoint desks."),
    "/use-cases/amr-hand-off/": ("P-UC2-01c", "A model back aisle. A robot and the trolley it tows are marked blue."),
    "/use-cases/ask-your-plant/": ("P-UC4-01c", "A model factory floor, all pale except three trolleys at inspection, marked amber."),
}
ucpics = lambda: {u: pic(c, "4:3 cut of the use case's head still (job tile).", "photo", a) for u, (c, a) in UC_PIC.items()}


def others(slug):
    return section(vp("Other jobs,", "same tags."), links([v for k, v in UC_LINE.items() if k != slug], pics=ucpics()))


# ---------------- /solutions/ ----------------
write("/solutions/", "Where AmIMotion helps: WIP, tools and vehicles",
      "AmIMotion shows where work waits and where tagged trolleys, tools and vehicles are, on one live map. Start with one flow in one bay.",
      [
          head("Two questions.", "One system.", "Where is it? How long has it waited? AmIMotion answers both, for anything you tag.",
               short="AmIMotion is spatial intelligence for factories and warehouses. It answers two questions on one live map in AmIHub. Where is work waiting, and for how long? "
                     "And where is the trolley, tool or forklift someone needs right now? AmIGo tags ride on what moves. AmIMo anchors on your columns hear them. AmIHub places each tag down to ±10 cm. How close depends on your floor.",
               trail=[("Where it helps", None)], actions=(("Plan your first bay", "/diagnostic/"),),
               media=pic("P-SOL-01", f"{CAM}, --t 0.0 --state after, border crop 0.05,0.95,0.25,0.80 at 16:9: the press line, the main aisle and the inspection queue on the left, the racks and staging lane on the right. "
                         "Full after-state colour: blue trails behind the tugger train, forklift, AMR and the trolley leaving press 1; three trolleys in the queue and one pallet in the staging lane on amber.", "wide",
                         "A model factory floor from above. Blue lines show where tagged trolleys and vehicles went. Three trolleys at inspection and one pallet in a staging lane are amber because they are waiting.")),
          section(vp("Start with the question", "your team asks most.", "Most floors start with one of these two. Both run on the same AmIGo tags, AmIMo anchors and AmIHub, so adding the second needs no new system."),
                  cards([
                      ("/solutions/wip/", pic("P-SOL-02", f"{CAM}, --state after, border 0.05,0.50,0.20,0.62 (4:3): inspection station and its queue. One trolley inside the station zone on a blue tint, three in the queue on amber, a short blue trail leading in. Everything else pale.", "photo",
                                              "A model inspection station. Three trolleys in its queue are amber because they are waiting."),
                       "Work in progress", "See which trolley waits where, and for how long, linked to the job it carries."),
                      ("/solutions/assets/", pic("P-SOL-03", f"{CAM}, --state after, border 0.20,0.75,0.55,0.97 (4:3): the back aisle. The tool cart, the fixture and the AMR in colour on blue, each with its trail ending where it stands. Everything else pale.", "photo",
                                                 "A model factory floor. A tool cart, a fixture and a robot are marked blue where they stopped."),
                       "Tools and vehicles", "Find fixtures, tool carts, forklifts and AMRs from a screen, with when each was last seen."),
                  ], 2)),
          section(vp("The same map,", "for each kind of floor."),
                  tiles([("Manufacturing", "AmIMotion follows trolleys and bins between cells, lines and inspection. Link each trolley to its job, and its wait counts as that job's wait."),
                         ("Warehousing", "AmIMotion times tagged pallets and totes from the dock to the staging lane to the rack. Forklifts and tuggers show on the same map."),
                         ("Robotics and AMRs", "AmIMotion puts AMRs and the trolleys they tow on one map with everything else you tag. Your fleet software still drives them.")], 3),
                  more([("Manufacturing", "/industries/manufacturing/"), ("Warehousing", "/industries/warehousing/"), ("Robotics and AMRs", "/industries/robotics/")])),
          section(vp("Four jobs,", "start to finish.", "Each one starts with a walk someone takes today. Each one ends with an answer in AmIHub."),
                  links(list(UC_LINE.values()), pics=ucpics())),
          section(vp("What AmIMotion leaves", "to your systems.", "AmIMotion adds where and how long. It does not take over the records you already trust."),
                  tiles([("Your MES or WMS keeps the job.", "AmIHub adds where its trolley or pallet is and how long it has waited. Orders, routes and status stay where they are."),
                         ("Your team says why.", "AmIHub shows that a load waited and for how long. Why it waited is for your team to say."),
                         ("Your fleet software drives.", "AmIMotion locates robots and vehicles. It does not route, dispatch or stop them.")], 3)),
          section(faq([
              ("What does AmIMotion solve on a factory floor?", "Two things. AmIMotion shows where work in progress waits, and for how long, by timing tagged trolleys and pallets in zones you name. It also finds tagged trolleys, tools and vehicles from a screen, with where and when each was last seen."),
              ("Do we have to choose one?", "No. Both run on the same AmIGo tags, AmIMo anchors and AmIHub. Start with one flow in one bay. Then grow plant-wide on the same AmIHub, without re-fitting the first bay."),
              ("Does AmIMotion track people?", "A pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy."),
          ], "Questions teams ask first.")),
          close(),
      ], page="CollectionPage")

# ---------------- /solutions/wip/ ----------------
write("/solutions/wip/", "WIP visibility: see where work waits",
      "AmIMotion shows where work in progress waits, and for how long. Tagged trolleys are timed in zones you name and linked to the jobs they carry.",
      [
          head("Find the job.", "Time the wait.", "A tag on each trolley tells AmIHub where it is. Link the trolley to its job, and you see which work waits where.",
               short="WIP visibility means knowing where each job is and how long it has waited, during the shift. AmIMotion gives it in three steps. An AmIGo tag rides on each trolley, bin or pallet. "
                     "AmIMo anchors place it down to ±10 cm, depending on your floor. AmIHub notes when it enters and leaves each zone you name, and links it to the job it carries. Its wait then counts as that job's wait.",
               trail=[WHERE, ("Work in progress", None)], actions=(("How waits are timed", "/learn/dwell-time/"), ("Which job is on the trolley?", "/learn/association/")),
               media=pic("P-WIP-01", f"{CAM}, --t 0.0 --state after, border 0.02,0.55,0.18,0.78 (16:9): press 1, the main aisle and the inspection queue. The trolley leaving press 1 with its blue trail; the three queue trolleys on amber; one trolley inside the inspection zone on a blue tint. Racks, staging lane, vehicles pale.", "wide",
                         "A model factory floor. A trolley leaves a press along a blue line. Three trolleys queued at inspection are amber because they are waiting.")),
          section(vp("Tracking is the dot.", "Visibility is the wait.", "A dot on a map tells you where a trolley is. AmIMotion adds the two things a dot cannot: which job it holds, and how long it has waited."),
                  tiles([("Where is the work?", "AmIHub shows the trolley's place, or where it was last seen and when. Link it to a job and you see the job's place too. Without the link you still see the trolley, which already helps."),
                         ("Where is it waiting?", "You name the zones: stations, queues, staging lanes. AmIHub notes each entry and exit, so every wait has a start and a length."),
                         ("What needs a look?", "A named owner who acts when work waits too long. A long wait means go and look. It does not say why."),
                         ("What happens next?", "A person checks and decides. AmIHub never closes a job on location alone.")], 4)),
          section(vp("Tag. Locate. Link.", "Then time the wait."),
                  steps([("Tag.", "An AmIGo tag screws or sticks onto the trolley. It stays with the trolley through every job it carries."),
                         ("Locate.", "AmIMo anchors on your columns hear the tag as it moves. AmIHub places it down to ±10 cm, depending on your floor."),
                         ("Link.", "Link the trolley to its job in AmIHub, or from your own system. Nobody scans it along the way."),
                         ("Time.", "AmIHub notes each zone entry and exit as it happens. Supervisors see each wait live, during the shift, not at the next morning's review.")])),
          section(vp("Queued is not finished."),
                  split(None, ["AmIHub says where a trolley was seen, and when. Whether the work on it is done comes from your MES or your people.",
                               "Why it waited is for your team to say. The map never claims more than it saw."], (),
                        pic("P-WIP-02", f"The homepage screen 3 still, cut at 4:3 ({CAM}, --state after, isolate pass as homepage screen 3): one trolley inside the inspection zone on blue, three in the queue on amber, one pallet in the staging lane on amber. No labels, no numbers.", "photo",
                            "A model inspection station. One trolley is being worked on. Three trolleys in the queue and one pallet in a staging lane are amber because they are waiting."),
                        flip=True, extra=more([("How waits are timed", "/learn/dwell-time/")]))),
          section(vp("Your MES stays", "in charge of every job.", "AmIHub connects to your MES, ERP and WMS through open REST, MQTT, WebSocket and omlox hub interfaces. Each system keeps what it is best at."),
                  tiles([("AmIHub keeps.", "Where each trolley is, when it entered and left each zone, and how long it waited. AmIHub sends each entry and exit to any system you name, as it happens."),
                         ("Your MES or ERP keeps.", "The job, its route and its status. It stays the record for every job."),
                         ("Agreed together.", "How a job gets onto a trolley, and when it comes off. How to count a wait that runs past shift end. Who acts when work waits too long.")], 3)),
          section(vp("Start with one flow", "in one bay.", "An AmIMotion pilot follows one flow in one bay or line. You choose the flow."),
                  tiles([("One flow.", "Pick the trolleys, the bay and a few zones. AmIMotion surveys that floor and plans the anchors."),
                         ("Today's waits first.", "The pilot times today's waits first, over a window you choose. That is your baseline."),
                         ("Prove it, then decide.", "You see your own waits in one bay, and prove the numbers, before you decide on more. Then grow plant-wide on the same AmIHub.")], 3),
                  more([("How a pilot runs", "/pilot/"), ("Measure before you claim", "/learn/pilot-baseline/"), ("Your pilot on one page", "/tools/pilot/")])),
          section(faq([
              ("Which companies offer real-time WIP tracking for manufacturing?", "Several RTLS makers do, with UWB, BLE or RFID. AmIMotion, from Bengaluru, India, focuses on WIP visibility with UWB. It locates tagged trolleys down to ±10 cm, depending on the floor, times them in zones you name and links them to the jobs they carry."),
              ("How can I see where work in progress is waiting on my shop floor?", "Tag the trolleys, name the zones where work queues, and note every entry and exit. AmIHub shows how long each trolley has waited in each zone, while it is still waiting."),
              ("What is the difference between WIP visibility and WIP tracking?", "Tracking shows where a carrier is. Visibility adds which job it holds and how long it has waited. That needs zones and a link from trolley to job."),
              ("Can we start without connecting our MES?", 'Yes. Start with trolley location and wait times in AmIHub. Make the job link a pilot step before you call any result job-level. <a href="/learn/value-without-mes/">Value without an MES</a>.'),
              ("Does AmIMotion track individual parts?", "No. The AmIGo tag goes on the trolley, bin or pallet that carries the parts. Linked to a job, the trolley's wait counts as that job's wait."),
          ], "Questions teams ask first.")),
          close(),
      ])

# ---------------- /solutions/assets/ ----------------
write("/solutions/assets/", "Find tools, fixtures and forklifts from a screen",
      "AmIMotion finds tagged tools, fixtures, trolleys, forklifts and AMRs on one live map, with where and when each was last seen. The search starts on a screen.",
      [
          head("Find it from a screen.", "Not a walk.", "Tag the fixtures, tool carts, trolleys and vehicles your team looks for. AmIHub shows where each one is, or where it was last seen.",
               short="To cut the time spent searching for trolleys, bins and tools, AmIMotion puts a small AmIGo tag on each one. AmIMo anchors on your columns hear it as it moves. "
                     "AmIHub's live map shows where each one is now, which zone had it last, and when it was last seen. Forklifts, tuggers and AMRs carry a vehicle tag on the same map.",
               trail=[WHERE, ("Tools and vehicles", None)], actions=(("Time spent searching", "/tools/search-time/"),),
               media=pic("P-AST-01", f"{CAM}, --state after, border 0.10,0.95,0.40,0.97 (16:9): racks and the back aisle. Everything pale except the tool cart, the fixture and the forklift, each on a blue floor tint with its blue trail ending where it stands.", "wide",
                         "A model factory floor. A tool cart, a fixture and a forklift are marked blue, each at the end of the line it travelled.")),
          section(vp("Where was it", "last seen?", "Things that move all day get lost all day. AmIHub keeps a last-seen place and time for every AmIGo tag, so the search starts on a screen."),
                  tiles([("Tools and fixtures.", "A small AmIGo tag screws on where work won't knock it. AmIHub keeps a history of which cell had each fixture, and when."),
                         ("Trolleys, bins and kit racks.", "Search AmIHub for the trolley. You see its zone and when it was last seen. Walk straight there."),
                         ("Forklifts, tuggers and AMRs.", "A vehicle tag rides on each one, with a vehicle-powered option. AmIHub shows where each vehicle is, and its trips over any time window.")], 3)),
          section(vp("When a tag", "goes quiet."),
                  split(None, ["An AmIGo tag sends a short UWB pulse when it moves and sleeps when it stops. While it sleeps, AmIHub shows where it was last seen, and when. It never guesses where the item is now.",
                               "If a tag comes off, the map still shows its last-seen spot. AmIHub tracks each tag's health and battery level. One battery lasts 1 to 3 years, depending on use."], (),
                        still("amigo-side"), extra=more([("When a tag goes quiet", "/learn/location-data-quality/"), ("AmIGo tag", "/products/amigo/")]))),
          section(vp("Four things", "to agree first.", "AmIMotion sets these with you before a pilot, so the answer on the map is one your team will use."),
                  tiles([("Which tag is on what.", "Each AmIGo tag is assigned to one tool, trolley or vehicle in AmIHub. Name who keeps that list right."),
                         ("How close is close enough.", "Some jobs need the bay. Some need the shelf. With AmIMo anchors, AmIHub places a tag down to ±10 cm, and we check what your floor gives."),
                         ("How old is too old.", "Decide how long a last-seen time stays useful for the job. AmIHub shows old data as old."),
                         ("Who acts on it.", "Name who uses the answer, and what they will do differently.")], 4)),
          section(vp("Count today's search", "before you change it.", "Put your own figures into the AmIMotion search-time calculator. It assumes no savings."),
                  links([("/tools/search-time/", "Time spent searching", "Your own numbers."),
                         ("/use-cases/find-the-asset/", "Where is that trolley?", "Find it from a screen."),
                         ("/industries/robotics/", "Robotics and AMRs", "Robots and carriers on one map."),
                         ("/learn/pilot-baseline/", "Measure before you claim", "Set a baseline first.")])),
          section(faq([
              ("How do I reduce time spent searching for trolleys and bins in a plant?", "Tag what people search for and put it on a live map. With AmIMotion the search starts in AmIHub, with the zone and the last-seen time, instead of a walk around the hall. Count today's search time first, so you can show what changed."),
              ("How do you track tools on a factory floor?", "Fix an AmIGo tag to the tool, fixture or gauge case with adhesive or a screw. AmIMo anchors hear it as it moves. AmIHub keeps a history of which cell had it, and when."),
              ("How do you track forklifts and AMRs indoors to within a few centimetres?", "Fit each one with an AmIGo vehicle tag. AmIMo anchors place it down to ±10 cm, depending on your floor, on the same AmIHub map as trolleys and tools."),
              ("What happens if an RTLS tag is not seen for a while?", "AmIHub shows where and when it was last seen. It does not guess where the item is now."),
              ("Hamare plant mein forklifts aur trolleys ka pata nahi chalta. Iska kya solution hai?", "Forklifts aur trolleys par AmIMotion ka AmIGo UWB tag lagaiye. AmIMo anchors unhe ±10 cm tak locate karte hain, floor ke hisaab se. AmIHub ke live map par dikhta hai ki har ek abhi kahan hai, ya aakhri baar kahan aur kab dikha."),
          ], "Questions teams ask first.")),
          close(),
      ])

# ---------------- /industries/ ----------------
write("/industries/", "AmIMotion for manufacturing, warehousing and robotics",
      "AmIMotion is built for manufacturing, warehousing and robotics floors. One system of tags, anchors and AmIHub, set up for how your floor runs.",
      [
          head("Different floors.", "One live map.", "A machining hall and a dock look nothing alike. To AmIMotion, both are tags, zones and waits.",
               short="AmIMotion is built for manufacturing, warehousing and robotics floors. The same AmIGo tags, AmIMo anchors and AmIHub software locate trolleys, bins, pallets, tools, vehicles and robots down to ±10 cm, depending on the floor. "
                     "AmIHub times each one in the zones you name. Your MES, ERP, WMS or fleet software stays in charge of its own records.",
               trail=[("Industries", None)], actions=(("Plan your first bay", "/diagnostic/"),),
               media=pic("P-IND-01", f"{CAM}, full frame at 16:9 (border 0.0,1.0,0.22,0.78), --t 0.0 --state after. The one frame holds all three floors: presses and inspection (manufacturing), racks and the staging-lane pallet (warehousing), the AMR in the back aisle (robotics). Full after-state colour.", "wide",
                         "A model floor from above with presses, racks, a staging lane and a robot. Blue lines show where tagged things went. Amber marks the ones waiting.")),
          section(vp("Start from", "your kind of floor."),
                  cards([
                      ("/industries/manufacturing/", pic("P-IND-02", f"{CAM}, --state after, border 0.02,0.50,0.30,0.80 (4:3): the two presses, the main aisle, the inspection queue on amber. Rest pale.", "photo",
                                                         "A model press line and inspection queue. Three trolleys waiting at inspection are amber."), "Manufacturing", "Trolleys and bins between cells, lines and inspection."),
                      ("/industries/warehousing/", pic("P-IND-03", f"{CAM}, --state after, border 0.45,0.95,0.22,0.70 (4:3): the staging lane, its pallet on amber, the forklift's blue trail beside the racks. Rest pale.", "photo",
                                                       "A model staging lane beside tall racks. One pallet is amber because it is waiting. A blue line shows a forklift's path."), "Warehousing", "Pallets, staging lanes and docks, with forklifts on the same map."),
                      ("/industries/robotics/", pic("P-IND-04", f"{CAM}, --state after, border 0.10,0.90,0.62,0.97 (4:3): the back aisle, the AMR with its blue trail, the bins and tool cart. Rest pale.", "photo",
                                                    "A model back aisle. A robot moves along a blue line past tagged bins."), "Robotics and AMRs", "Robots and the trolleys they tow, beside everything else you tag."),
                  ], 3)),
          section(vp("What changes", "from floor to floor.", "AmIMotion uses the same parts on every floor. What changes is what you tag, the zones you name and the system that stays in charge."),
                  compare(["", "Manufacturing", "Warehousing", "Robotics and AMRs"], [
                      ("What you tag", "Trolleys, bins, kit racks, fixtures", "Pallets, totes, forklifts, tuggers", "AMRs, AGVs and the trolleys they tow"),
                      ("Zones you name", "Stations, queues, inspection", "Docks, staging lanes, put-away", "Pick-up and drop-off points"),
                      ("What AmIHub adds", "Where each job waits, and for how long", "How long each load waits, dock to stock", "What arrived where, and when"),
                      ("Stays in charge", "Your MES or ERP", "Your WMS", "Your fleet software")],
                      "AmIMotion locates and times. It does not route vehicles, dispatch robots or close jobs.")),
          section(vp("One system,", "set up zone by zone.", "AmIMotion is set up for the floor you have. We survey it first, then plan the anchors."),
                  tiles([("Steel and racking.", "UWB's wide bandwidth separates the direct path from reflections. Racking and steel still change how far an AmIMo anchor reaches, so the survey sets the count."),
                         ("A mode for each zone.", "AmIMo anchors run the positioning mode each zone needs, chosen in AmIHub, with no hardware swap. Docks and gates can use angle and two-way ranging."),
                         ("Covered yards.", "AmIMo anchors also work in sheltered outdoor areas, so a covered yard can join the same AmIHub map."),
                         ("Inside your plant.", "AmIHub runs on an industrial PC inside your plant, with no internet needed. Cloud is also an option.")], 4)),
          section(faq([
              ("Which industries is AmIMotion built for?", "Manufacturing, warehousing and robotics floors. The same AmIGo tags, AmIMo anchors and AmIHub locate trolleys, pallets, vehicles and robots, and time them in the zones you name."),
              ("Can one AmIMotion system cover a factory and its warehouse?", "Yes. The same tags, anchors and AmIHub cover the machining hall and the dock. A second plant gets its own survey, and AmIHub can run both from one console."),
              ("Is AmIMotion made in India?", "Yes. AmIMotion is designed and built in India, with local stock and local engineers on your site."),
          ], "Questions teams ask first.")),
          close(),
      ], page="CollectionPage")

# ---------------- /industries/manufacturing/ ----------------
write("/industries/manufacturing/", "UWB RTLS for manufacturing plants",
      "AmIMotion for manufacturing plants: find trolleys, bins and fixtures between cells, and see where each job waits and for how long, during the shift.",
      [
          head("Work waits between cells.", "Now you see where.", "Your MES knows the job. Between scans, nobody knows where its trolley stands. AmIMotion shows you, and how long it has waited.",
               short="AmIMotion is spatial intelligence for manufacturing plants. AmIGo tags ride on the trolleys, bins and kit racks that carry work between cells. AmIMo anchors place each one down to ±10 cm, depending on your floor. "
                     "AmIHub notes when it enters and leaves each station and queue, and links it to the job it carries. Your MES stays in charge of every job.",
               trail=[IND, ("Manufacturing", None)], actions=(("Work in progress", "/solutions/wip/"), ("Plan your first bay", "/diagnostic/")),
               media=pic("P-MFG-01", f"{CAM}, --state after, border 0.02,0.60,0.18,0.82 (16:9): both presses, the main aisle and the inspection queue. Trolley leaving press 1 on its blue trail, the fixture's short blue line at the cross aisle, three queue trolleys on amber. Racks and vehicles pale.", "wide",
                         "A model press line. Blue lines show where tagged trolleys and a fixture went. Three trolleys waiting at inspection are amber.")),
          section(vp("Good first flows", "on a plant floor.", "An AmIMotion pilot follows one flow in one bay or line. These three are clear to scope and quick to read on the map."),
                  tiles([("Work between operations.", "Trolleys between machining and assembly, timed in every queue. AmIHub shows which job waits where."),
                         ("Line-side supply.", "Where the next kit, bin or tugger train is, and how long it has waited near the line."),
                         ("Shared fixtures and gauges.", "Which cell has the fixture now, and which had it before. AmIHub keeps the history.")], 3)),
          section(vp("Inspection is", "where queues hide."),
                  split(None, ["Trolleys queue at inspection, rework and shared stations. AmIHub times each one in the queue and at the station, so a long queue shows while it is still long.",
                               "Before the pilot starts, we agree how to count a wait that runs past shift end. We also agree who on your team acts when work waits too long.",
                               "Being in a zone does not prove work started or finished. AmIHub says where and when. Your MES and your people say the rest."], (),
                        pic("P-MFG-02", f"The homepage screen 3 still at 4:3 ({CAM}, --state after, isolate pass): inspection station, one trolley on blue inside, three queued on amber.", "photo",
                            "A model inspection station. Three trolleys in the queue in front of it are marked amber because they are waiting."),
                        extra=more([("How waits are timed", "/learn/dwell-time/")]))),
          section(vp("Your MES stays", "in charge.", "AmIHub adds where each trolley is and how long it has waited. Jobs, routes and status stay in your MES or ERP, which connect through open REST, MQTT, WebSocket and omlox hub interfaces."),
                  stats([("±10 cm", "Down to, per AmIGo tag", "With AmIMo anchors. Depends on your floor."),
                         ("3 to 8 m", "AmIMo anchor height", "On a column or wall, recommended."),
                         ("About 50 m", "Reach of each anchor", "In clear line of sight. Racking and steel change it."),
                         ("1 to 3 years", "AmIGo battery", "Depending on use.")]),
                  more([("Which job is on the trolley?", "/learn/association/"), ("Specifications", "/specs/")])),
          section(vp("Steel, presses", "and racking."),
                  split(None, ["A plant floor is hard on radio. UWB's wide bandwidth separates the direct path from reflections off steel.",
                               "AmIMotion surveys your floor and sets the anchor count. Before the pilot, we agree the hard spots to test: a trolley at a zone edge, a tag hidden by its load, two cells side by side.",
                               "Each AmIMo anchor needs only power, from DC or PoE. It syncs over the air and sends its data to AmIHub over Wi-Fi. Ethernet is also an option."], (),
                        still("amimo"), flip=True, extra=more([("How it locates a tag", "/technology/")]))),
          section(faq([
              ("What is the best indoor positioning system for a manufacturing plant in India?", "The one that answers your floor's question at the accuracy it needs, measured on your floor. AmIMotion, from Bengaluru, offers UWB positioning down to ±10 cm with AmIMo anchors, depending on the floor. Anchors need only power and sync over the air, and local engineers come to your site."),
              ("Which RTLS vendors track carriers and WIP on an assembly line in India?", 'Plants compare global RTLS makers with Indian ones. AmIMotion designs and builds its UWB tags, anchors and AmIHub software in India, and focuses on WIP visibility. See the guide to <a href="/learn/uwb-rtls-india/">UWB RTLS in India</a>.'),
              ("Can AmIMotion tell which job is on a trolley?", "Through a link, not the radio. The tag names the trolley. You link the trolley to its job in AmIHub, or from your own system."),
              ("Does UWB work around machining centres and racking?", "UWB's wide bandwidth separates the direct path from reflections off steel. AmIMotion sets the anchor count from a survey of your floor, and the pilot tests the hardest spots."),
              ("Does AmIMotion track people?", "A pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy."),
          ], "Questions plants ask first.")),
          close(),
      ])

# ---------------- /industries/warehousing/ ----------------
write("/industries/warehousing/", "UWB RTLS for warehousing and intralogistics",
      "AmIMotion for warehouses: pallets, totes, forklifts and tuggers on one live map, with how long each load waits at docks and staging lanes.",
      [
          head("Know where each pallet is.", "And how long it has waited.", "Your WMS knows where a pallet should be. AmIMotion shows where it is, and how long it has stood there.",
               short="In warehousing, AmIMotion shows where tagged pallets, totes, forklifts and tuggers are, and how long loads wait at docks and staging lanes. AmIGo tags ride on the loads and vehicles. "
                     "AmIMo anchors place each tag down to ±10 cm, depending on the floor. AmIHub times every entry and exit, and your WMS stays the record for orders and stock.",
               trail=[IND, ("Warehousing", None)], actions=(("Plan your first bay", "/diagnostic/"),),
               media=pic("P-WH-01", f"{CAM}, --state after, border 0.40,1.00,0.20,0.80 (16:9): the staging lane, both rack rows and the cross aisle. The pallet in the staging lane on amber; the forklift's blue trail from the racks to the lane; the tugger train's trail down the main aisle. Presses and inspection pale.", "wide",
                         "A model warehouse aisle between tall racks. One pallet in a staging lane is amber because it is waiting. Blue lines show a forklift's and a tugger's paths.")),
          section(vp("Good first flows", "in a warehouse.", "An AmIMotion pilot follows one flow, such as inbound from the dock to the rack. These three are where warehouses look first."),
                  tiles([("Docks and staging lanes.", "AmIHub times each tagged pallet at every dock door and staging lane. You see which load has waited longest, while it waits."),
                         ("Forklifts and tuggers.", "A vehicle tag rides on each one, with a vehicle-powered option. AmIHub shows where each one is now, and its trips over any time window."),
                         ("Pallets and totes.", "Find a tagged load through put-away, staging and storage. AmIHub shows where it was last seen, and when.")], 3)),
          section(vp("Dock to stock,", "timed.", "Name the dock, the staging lane and the put-away zone in AmIHub. It notes when each tagged pallet enters and leaves each one."),
                  steps([("Dock.", "A tagged pallet enters the dock zone. AmIHub records the time."),
                         ("Staging lane.", "It waits in a lane. Its wait shows live, during the shift."),
                         ("Put-away.", "A forklift picks it up. Both tags move together toward the racks."),
                         ("Rack.", "It leaves the last zone. AmIHub sends each entry and exit to your WMS, as it happens.")])),
          section(vp("Docks, aisles", "and covered yards."),
                  tiles([("Docks and gates.", "AmIMo anchors can use angle and two-way ranging at docks and gates. The mode is set per zone in AmIHub, with no hardware swap."),
                         ("Tall racking.", "Racking changes how far a signal reaches. AmIMotion surveys your floor and sets the anchor count."),
                         ("Covered yards.", "AmIMo anchors also work in sheltered outdoor areas, so a covered yard can join the same map.")], 3)),
          section(vp("Your WMS stays", "in charge.", "AmIHub adds where each load is and how long it waited. Orders and stock stay in your WMS, which connects through open REST, MQTT, WebSocket and omlox hub interfaces."),
                  stats([("±10 cm", "Down to, per AmIGo tag", "With AmIMo anchors. Depends on your floor."),
                         ("About 50 m", "Reach of each AmIMo anchor", "In clear line of sight. Racking changes it."),
                         ("Hundreds", "Active tags per anchor cell", "Indicative, in UL-TDoA mode.")]),
                  more([("Specifications", "/specs/"), ("How many anchors you need", "/tools/anchors/")])),
          section(faq([
              ("Can AmIMotion track forklifts and AMRs together?", "Yes. AmIGo vehicle tags fit forklifts, tuggers and AMRs, and all of them appear on one AmIHub map with the pallets they move."),
              ("Does AmIMotion replace our WMS?", "No. AmIHub sends positions and events to your WMS over REST, MQTT, WebSocket or omlox. Your WMS stays the record. The connector for your WMS is confirmed when we scope the pilot."),
              ("Can AmIMotion time dock-to-stock?", "Yes, for tagged pallets and totes. AmIHub notes each entry and exit at the dock, the staging lanes and the put-away zones, so you see where loads wait."),
              ("Do the anchors need data cables?", "No data or sync cable. Each AmIMo anchor needs only power, from DC or PoE, syncs over the air and sends its data over Wi-Fi. Ethernet is also an option."),
          ], "Questions warehouses ask first.")),
          close(),
      ])

# ---------------- /industries/robotics/ ----------------
write("/industries/robotics/", "UWB location for robotics and AMR floors",
      "AmIMotion puts AMRs, AGVs, forklifts and the trolleys they move on one live map, with a time for every arrival. Your fleet software still drives them.",
      [
          head("Your robots know where they are.", "Do your trolleys?", "AMRs keep their own map. Forklifts, tuggers and the trolleys they tow are not on it. AmIMotion puts all of them on one.",
               short="On robotics floors, AmIMotion gives every tagged AMR, AGV, forklift and trolley one shared map and one time-stamped history. AmIMo anchors place each AmIGo tag down to ±10 cm, depending on the floor. "
                     "AmIHub notes when each one enters a zone and leaves it. Your fleet software still drives, routes and dispatches the robots.",
               trail=[IND, ("Robotics and AMRs", None)], actions=(("The hand-off", "/use-cases/amr-hand-off/"),),
               media=pic("P-ROB-01", f"{CAM}, --state after, border 0.05,0.95,0.60,0.97 (16:9): the back aisle. The AMR on its blue trail, towing one trolley (needs a trolley hitched behind P['amr'] in the hall), the bins and tool cart ahead of it, the tugger train crossing at the main aisle. Front half of the hall pale.", "wide",
                         "A model back aisle from above. A robot tows a trolley along a blue line. A tugger crosses at the main aisle.")),
          section(vp("A shared map,", "beside the robots' own.", "A robot's map covers that maker's robots. AmIHub covers everything you tag, on a map that runs inside your plant."),
                  tiles([("Mixed traffic.", "AMRs, AGVs, forklifts, tuggers and trolleys on one AmIHub map. Each vehicle carries an AmIGo vehicle tag, with a vehicle-powered option."),
                         ("Hand-offs.", "Tag the robot and the trolley. When both arrive in a drop-off zone, AmIHub records the time and the place. Nobody scans it."),
                         ("Waits at pick-up and drop-off.", "AmIHub times each pick-up and drop-off zone, so you see where robots and trolleys wait.")], 3)),
          section(vp("AmIMotion locates.", "Your fleet software drives.", "AmIMotion does not route, dispatch or stop a robot. It shows where the robot and its load are, and when they arrived."),
                  tiles([("AmIMotion keeps.", "Where each robot, vehicle and trolley is, its trips over any time window, and every zone entry and exit. AmIHub sends those events to any system you name, as they happen."),
                         ("Your fleet software keeps.", "Driving, routing, dispatch, charging and safety. Any deeper link with it is scoped for your site.")], 2)),
          section(vp("AI assistants can ask", "the same map."),
                  split(None, ["AmIHub has an MCP server built in. An AI assistant can ask which trolleys have waited at a drop-off point, and answer from AmIHub's live map.",
                               "Asking changes nothing. Any change, such as raising a work order in AmIHub, needs a person's approval. We show it live on a call."], (),
                        pic("P-ROB-02", f"{CAM}, --state after, isolate pass: everything pale except one drop-off zone at the line end of the back aisle, where two trolleys stand on amber (needs the drop-off zone outline added to the hall). No answer card, no data.", "photo",
                            "A model floor, all pale except two trolleys at a drop-off point, marked amber because they are waiting."),
                        extra=more([("Ask your floor", "/use-cases/ask-your-plant/")]))),
          section(faq([
              ("Why not use each robot's own localisation?", "A robot's own map covers that maker's robots. AmIHub also covers forklifts, tuggers and trolleys, on one map that runs inside your plant."),
              ("How precise is a robot's position on AmIHub?", "The same as any AmIGo tag: down to ±10 cm, with AmIMo anchors. How close depends on your floor."),
              ("Does AmIMotion control or dispatch robots?", "No. Your fleet software drives, routes and dispatches. AmIMotion shows where the robot and its load are."),
              ("Do we need to integrate with the robot?", "To locate it, the robot only needs a tag. Any deeper link with your fleet software is scoped for your site."),
              ("Is the MCP server available today?", "It is built into AmIHub, and we show it live on a call. The setup for your site is confirmed when we scope it."),
          ], "Questions robotics teams ask first.")),
          close(),
      ])

# ---------------- /use-cases/ ----------------
write("/use-cases/", "AmIMotion use cases: find, time, hand off, ask",
      "Four AmIMotion use cases: find a trolley from a screen, time work station to station, see what an AMR brought, and ask your floor a question.",
      [
          head("Four jobs.", "One live map.", "Each one starts with a walk someone takes today. Each one ends with an answer in AmIHub.",
               short="AmIMotion is used for four jobs on factory and warehouse floors. Find a tagged trolley or tool from a screen. Time each trolley from station to station. See what an AMR brought, and when. "
                     "Ask an AI assistant about the floor, answered from AmIHub's live map. All four run on the same AmIGo tags, AmIMo anchors and AmIHub.",
               trail=[("Use cases", None)], actions=(("Plan your first bay", "/diagnostic/"),)),
          section(cards([
              ("/use-cases/find-the-asset/", pic("P-UC1-01c", "4:3 cut of the /use-cases/find-the-asset/ head still (P-UC1-01): one trolley stopped behind the racks on blue, its trail from the press; everything else pale.", "photo",
                                                 "A model factory floor. One trolley stopped behind the racks is marked blue."), "Where is that trolley?", "Someone walks the hall to find it. AmIHub shows where it was last seen."),
              ("/use-cases/station-to-station/", pic("P-UC3-01c", "4:3 cut of the /use-cases/station-to-station/ head still (P-UC3-01): checkpoint ticks joined into continuous blue lines.", "photo",
                                                     "A model factory floor. Blue lines show each trolley's full path between checkpoint desks."), "Station to station", "Status changes when someone scans. AmIHub times every station in between."),
              ("/use-cases/amr-hand-off/", pic("P-UC2-01c", "4:3 cut of the /use-cases/amr-hand-off/ head still (P-UC2-01): the AMR and its towed trolley on blue, two trails side by side to the drop-off zone.", "photo",
                                               "A model back aisle. A robot and the trolley it tows are marked blue."), "The hand-off", "A robot brings a trolley. AmIHub records where and when it arrived."),
              ("/use-cases/ask-your-plant/", pic("P-UC4-01c", "4:3 cut of the /use-cases/ask-your-plant/ head still (P-UC4-01): everything pale, only the three inspection-queue trolleys on amber.", "photo",
                                                 "A model factory floor, all pale except three trolleys at inspection, marked amber."), "Ask your floor", "Someone goes to look. An AI assistant answers from the live map instead."),
          ], 2), label="The four use cases"),
          section(vp("Pick the one", "your team lives with.", "Each AmIMotion use case answers a question someone on your floor asks every shift."),
                  compare(["Use case", "Who asks it most", "Today", "In AmIHub"], [
                      ("Where is that trolley?", "Supervisors and material coordinators", "A walk and calls to stores", "Its zone, and when it was last seen"),
                      ("Station to station", "Production control and IE leads", "A scan at each desk, and a gap between", "Every entry and exit, timed"),
                      ("The hand-off", "Logistics and robotics teams", "A scan, if someone remembers", "Arrival time and place, with no scan"),
                      ("Ask your floor", "Supervisors, IT and developers", "Someone goes and looks", "An answer from the live map. Changes need a person's approval")])),
          section(faq([
              ("What can you do with an RTLS in a factory?", "With AmIMotion, four things. Find tagged trolleys and tools from a screen. Time work at every station. See what robots brought, and when. Ask an AI assistant about the floor, answered from live data in AmIHub."),
              ("Which use case should we start with?", 'The one where people walk most to find out what is happening. <a href="/diagnostic/">Plan your first bay</a> asks six questions about how work moves in your plant and suggests where to start.'),
              ("Do the four need different hardware?", "No. All four run on the same AmIGo tags, AmIMo anchors and AmIHub. A forklift, tugger or AMR takes the vehicle form of the tag."),
          ], "Questions teams ask first.")),
          close(),
      ], page="CollectionPage")

# ---------------- /use-cases/find-the-asset/ ----------------
write("/use-cases/find-the-asset/", "Find a trolley or tool from a screen",
      "Find a tagged trolley, tool or bin on AmIMotion's live map instead of walking the hall. You see where it was last seen, and when.",
      [
          head("Where is that trolley?", "Look it up.", "Today someone walks the hall to find it. With an AmIGo tag on it, the trolley is a place on AmIHub's map.",
               short="With AmIMotion, every tagged trolley, bin, tool and fixture shows on one live map in AmIHub. AmIMo anchors place each tag down to ±10 cm, depending on your floor. "
                     "You see where it is, or where it was last seen and when. Finding one starts with a search, not a walk.",
               trail=[UC, ("Where is that trolley?", None)], actions=(("Tools and vehicles", "/solutions/assets/"),),
               media=pic("P-UC1-01", f"The homepage screen 2 still, recut 16:9: {CAM}, --state after, isolate pass, border 0.25,0.95,0.30,0.85. The press line on the left, the racks on the right. Everything pale except one trolley stopped behind the racks, on a blue floor tint. Its one blue trail runs from the press and ends where it stands. No UI, no phone, no numbers.", "wide",
                         "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped.")),
          section(vp("Today,", "and with AmIMotion."),
                  tiles([("Today.", "A worker needs one trolley. Nobody knows where it is. Someone walks the hall, calls stores and checks a clipboard. Then walks again."),
                         ("With AmIMotion.", "The worker looks it up in AmIHub. The map shows the zone, and when the trolley was last seen. The worker walks straight there.")], 2)),
          section(vp("How a trolley", "stays findable."),
                  steps([("It moves.", "The AmIGo tag sends a short UWB pulse as the trolley moves. Nobody scans it."),
                         ("Anchors hear it.", "AmIMo anchors on your columns record when each pulse arrives, and the angle it came from."),
                         ("AmIHub places it.", "AmIHub works out where the tag is and puts it on the live map."),
                         ("It stops.", "The tag sleeps. AmIHub keeps its last-seen place and time.")])),
          section(vp("Measure the walk", "first.", "Count how long your team spends searching today. Then you can show what AmIMotion changed, in your own numbers, not ours."),
                  tiles([("Who searches.", "Supervisors, material coordinators, drivers. Count the people who go looking."),
                         ("How often.", "Count the searches in one shift, for one kind of thing: trolleys, fixtures or bins."),
                         ("How long.", "Time a few searches from the first question to the find. That is your baseline.")], 3),
                  more([("Time spent searching", "/tools/search-time/"), ("Measure before you claim", "/learn/pilot-baseline/")])),
          section(faq([
              ("Does anyone scan the trolley to find it?", "No. AmIMo anchors hear its AmIGo tag whenever it moves. At rest, AmIHub keeps its last-seen place."),
              ("What if a tag goes quiet?", "AmIHub shows where and when it was last seen. It does not guess where the trolley is now."),
              ("What else can carry a tag?", "Bins, kit racks, fixtures, tool carts, forklifts and tuggers. Each one gets its own AmIGo tag in AmIHub."),
              ("How close does it place the trolley?", "Down to ±10 cm with AmIMo anchors. How close depends on your floor, so the survey checks it."),
          ], "Common questions.")),
          others("find-the-asset"),
          close("What does searching cost you?", "Put in your own figures. AmIMotion assumes no savings.", (("Time spent searching", "/tools/search-time/"),)),
      ])

# ---------------- /use-cases/station-to-station/ ----------------
write("/use-cases/station-to-station/", "Time work station to station with UWB",
      "AmIMotion times each tagged trolley at every station zone, from kitting to dispatch, and sends each entry and exit to your MES or ERP as it happens.",
      [
          head("Each station is a zone.", "Each move gets a time.", "Your ERP changes a job's status when someone scans or types. AmIHub times the trolley at every station in between.",
               short="With AmIMotion, each station is a zone you name in AmIHub: kitting, machining, assembly, dispatch. An AmIGo tag rides on each trolley, and AmIMo anchors place it down to ±10 cm, depending on your floor. "
                     "AmIHub notes when the trolley enters and leaves each zone, and sends each entry and exit to your MES or ERP as it happens.",
               trail=[UC, ("Station to station", None)], actions=(("Work in progress", "/solutions/wip/"), ("How waits are timed", "/learn/dwell-time/")),
               media=pic("P-UC3-01", f"{CAM}, --t 6.2 --state build, border 0.0,1.0,0.22,0.78 (16:9). The moment the checkpoint ticks have joined into lines: at the three checkpoint desks the short blue ticks, and between them the trolleys' blue lines now continuous. The fixture, tool cart and vehicles not yet in colour.", "wide",
                         "A model factory floor. Short blue marks at three checkpoint desks have joined into continuous blue lines that show each trolley's full path.")),
          section(vp("Today,", "and with AmIMotion."),
                  tiles([("Today.", "Status lives in the ERP. It changes only when someone scans at a desk or types. Between scans, the order is out of sight."),
                         ("With AmIMotion.", "Kitting, machining, assembly and dispatch are zones in AmIHub. Each time the trolley enters or leaves one, AmIHub records the time and sends the event on.")], 2)),
          section(vp("Entering a zone", "is not finishing a step.", "AmIHub records where a trolley was and when. Whether a step is done comes from your MES or your people."),
                  tiles([("What AmIHub records.", "Each zone entry and exit, its time, and how long the trolley stayed."),
                         ("What your MES records.", "The job, its route and its status. AmIMotion adds the times in between."),
                         ("What you agree first.", "Which zones count, how to count a wait that runs past shift end, and who acts when work waits too long.")], 3)),
          section(vp("Events your systems", "can use."),
                  split(None, ["AmIHub sends each entry and exit over open REST, MQTT, WebSocket and omlox hub interfaces. The connector for your ERP or MES is confirmed when we scope the pilot.",
                               "Link each trolley to its job in AmIHub, or from your own system. Its wait then counts as that job's wait."], (),
                        pic("P-UC3-02", f"{CAM}, --state after, isolate pass, border 0.02,0.50,0.20,0.85 (4:3): one trolley's whole path from press 2, past checkpoint desk 1, into the inspection queue, as a single blue line. Everything else pale.", "photo",
                            "A model floor, pale except one trolley's blue path from a press to the inspection queue."),
                        extra=more([("Which job is on the trolley?", "/learn/association/"), ("For developers", "/developers/")]))),
          section(faq([
              ("Which ERP or MES does it work with?", "AmIHub sends events over REST, MQTT, WebSocket and the omlox hub interface. The connector for your system is confirmed when we scope the pilot."),
              ("Does entering a zone mean the step is done?", "No. AmIHub records a time and a place. Whether a step is done comes from your MES or your people."),
              ("What if a trolley sits too long?", "AmIHub records the time in each zone, so a long wait shows while it is still waiting. Who on your team acts when work waits too long is agreed before the pilot."),
              ("How is dwell time measured in manufacturing?", 'With AmIMotion, from the moment a tagged trolley enters a zone to the moment it leaves. AmIHub keeps both times, so every wait has a start and a length. <a href="/learn/dwell-time/">How waits are timed</a>.'),
              ("UWB or RFID for this?", 'An RFID read records a pass at a gate. With AmIMotion, a UWB tag is placed as it moves, so AmIHub sees the time between gates too. Compare the two on one workflow of yours. <a href="/learn/uwb-vs-rfid/">UWB vs RFID</a>.'),
          ], "Common questions.")),
          others("station-to-station"),
          close(),
      ])

# ---------------- /use-cases/amr-hand-off/ ----------------
write("/use-cases/amr-hand-off/", "AMR hand-off: see what a robot brought",
      "Tag the AMR and the trolley it tows. AmIMotion shows both moving together and records where and when they arrive, with no scan. Your fleet still drives.",
      [
          head("The robot brings a trolley.", "AmIHub records the arrival.", "Tag the AMR and the trolley it tows. AmIMotion shows them move together, and where they arrive.",
               short="With AmIMotion, an AMR and the trolley it tows each carry an AmIGo tag. AmIMo anchors place both down to ±10 cm, depending on your floor. "
                     "AmIHub shows them move together and records when they arrive in the drop-off zone. Nobody scans the trolley. Your fleet software still drives, routes and dispatches the robot.",
               trail=[UC, ("The hand-off", None)], actions=(("Robotics and AMRs", "/industries/robotics/"),),
               media=pic("P-UC2-01", f"{CAM}, --state after, isolate pass, border 0.05,0.95,0.60,0.97 (16:9). Everything pale except the AMR and the one trolley it tows (towed-trolley addition), both on blue, their two trails running side by side down the back aisle and ending in the drop-off zone outline at the line end.", "wide",
                         "A model back aisle. A robot and the trolley it tows are marked blue. Their two blue lines run side by side and end at a drop-off point.")),
          section(vp("Today,", "and with AmIMotion."),
                  tiles([("Today.", "Robots move material, but the plant knows what a robot brought only if someone scanned it. A missed scan means a wrong record."),
                         ("With AmIMotion.", "The robot tows a tagged trolley from pick-up to the line. Both tags move together on AmIHub's map. The drop-off zone records the arrival time.")], 2)),
          section(vp("From pick-up", "to drop-off."),
                  steps([("Pick-up.", "The robot's tag and the trolley's tag enter the pick-up zone. AmIHub notes the time."),
                         ("Together.", "Both tags move along the aisle together, on one map."),
                         ("Drop-off.", "Both enter the drop-off zone. AmIHub records where and when they arrived."),
                         ("Wait.", "The robot leaves. The trolley waits at the line, and its wait shows live, during the shift.")])),
          section(vp("AmIMotion watches.", "It does not drive.", "AmIMotion adds a second record beside your fleet's: where each robot and its load went, and when."),
                  tiles([("AmIMotion keeps.", "Where the robot and its trolley are, when they entered and left each zone, and their trips over any time window. AmIHub sends each event to any system you name, as it happens."),
                         ("Your fleet software keeps.", "Driving, routing, dispatch and safety. Any deeper link with it is scoped for your site.")], 2)),
          section(faq([
              ("Do we need to integrate with the robot?", "To locate it, the robot only needs an AmIGo tag. Any deeper link with your fleet software is scoped for your site."),
              ("Does AmIMotion dispatch the robot?", "No. Your fleet software drives, routes and dispatches. AmIMotion shows where the robot and its load are."),
              ("Can forklifts and tuggers hand off the same way?", "Yes. A forklift or tugger with an AmIGo vehicle tag shows on the same AmIHub map, and its arrivals are timed the same way."),
              ("Does AmIHub know which job the trolley carries?", 'Only through a link. You <a href="/learn/association/">link the trolley to its job</a> in AmIHub, or from your own system. The robot\'s tag says where, not what.'),
          ], "Common questions.")),
          others("amr-hand-off"),
          close(),
      ])

# ---------------- /use-cases/ask-your-plant/ ----------------
write("/use-cases/ask-your-plant/", "Ask your floor: AI assistants over MCP",
      "Ask an AI assistant where tagged work is and how long it has waited, answered from AmIHub's live map over MCP. Any change needs a person's approval.",
      [
          head("Ask your floor a question.", "The live map answers.", "Ask in plain words. An AI assistant answers from AmIHub's live map. Asking changes nothing.",
               short="AmIHub, AmIMotion's software, has an MCP server built in. MCP is an open standard that lets AI assistants use other software. "
                     "Any assistant that supports MCP can ask AmIHub where tagged work is and how long it has waited, and answer from the live map. Asking changes nothing. Any change needs a person's approval. Every request is logged. We show it live on a call.",
               trail=[UC, ("Ask your floor", None)], actions=(("Trust and data", "/trust/"), ("For developers", "/developers/")),
               media=pic("P-UC4-01", f"The homepage screen 4 still at 16:9: {CAM}, full frame, isolate pass. Everything pale, no trails. Only the three trolleys in the inspection queue keep their amber. No answer card, no data.", "wide",
                         "The same model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited.")),
          section(vp("Today,", "and with AmIMotion."),
                  tiles([("Today.", "Questions travel one radio call at a time. Where is it? How long has it sat there? Someone goes to look, and the answer is old when it arrives."),
                         ("With AmIMotion.", "A supervisor asks: which trolleys have waited at inspection for more than an hour? The assistant reads AmIHub's live map and answers with those trolleys.")], 2)),
          section(vp("Questions it can answer", "from the map.", "Each answer comes from what AmIHub already holds: live positions, zones, waits and history."),
                  tiles([("Which trolleys have waited at inspection for more than an hour?", "AmIHub answers from its zones and the wait of each tagged trolley."),
                         ("Where was the gauge cart last seen?", "AmIHub answers from live location, with the time it was last seen."),
                         ("What came through the dock door this morning?", "AmIHub answers from the zone entries in that time window.")], 3)),
          section(vp("Asking changes nothing.", "Acting needs a person."),
                  tiles([("Its own access.", "Each assistant gets its own access to AmIHub: read-only, or only the actions you allow."),
                         ("A person approves.", "Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor."),
                         ("Every request logged.", "AmIHub logs every request an assistant makes: who asked, what was called and what changed.")], 3)),
          section(vp("It can stay", "inside your plant."),
                  split(None, ["The MCP server is part of AmIHub, so it can run on a PC inside your plant. If the assistant runs inside your network too, nothing has to leave it.",
                               "The same tools are open over REST and MQTT, so your own software can ask the same questions."], (), None,
                        extra=more([("Trust and data", "/trust/"), ("For developers", "/developers/")]))),
          section(faq([
              ("Can AI assistants query factory location data through MCP?", 'Yes, with AmIMotion. AmIHub has an MCP server built in, so any assistant that supports MCP can read live positions, zones and waits. Asking changes nothing. Any change needs a person\'s approval, and every request is logged. We show it live on a call. <a href="/learn/mcp-location-data/">MCP and location data</a>.'),
              ("What is MCP?", "Model Context Protocol, an open standard that lets AI assistants use other software. AmIHub has an MCP server built in."),
              ("Can the assistant act on its own?", "Not without a person. Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor."),
              ("Which assistants work with it?", "Any assistant that supports MCP. Each one gets its own access to AmIHub."),
              ("Does our data leave the plant?", "It does not have to. AmIHub can run inside your plant. If the assistant runs inside your network too, nothing has to leave it."),
          ], "Common questions.")),
          others("ask-your-plant"),
          close("See it answer on real data.", "On a short call we show an AI assistant working on real AmIHub data."),
      ])
