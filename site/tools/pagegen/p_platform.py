"""How it works: the product squad's round 07 copy (team/rounds/07-pages/product/*.md), nine pages:
/platform/, /products/amigo/, /products/amimo/, /products/amihub/, /technology/, /specs/, /developers/,
/what-is-amimotion/ and /industrial-spatial-intelligence/."""
import json
from pathlib import Path
from lib import *

ENTITY = json.loads((Path(__file__).resolve().parents[2] / "src" / "data" / "entity.json").read_text())
HOW = ("How it works", "/platform/")
PRODUCTS = ("Products", "/products/")
ABOUT = ("About us", "/company/")
HALL = "Model-hall still, build_hall.py camera A (11 m up, 45° down, 35 mm, yaw 34°), t = 0.0."
SHORT = lambda h, text: vp(h) + f'<p class="lead short-answer">{text}</p>'

# ---------------- platform ----------------
write("/platform/", "AmIMotion platform: AmIGo tags, AmIMo anchors and AmIHub",
      "AmIMotion is one system in three parts: AmIGo tags on what moves, AmIMo anchors on your columns, and AmIHub, one live map of where work waits.",
      [
          head("Three parts.", "One live map.", "A tag rides on what moves. Anchors on your columns hear it. AmIHub shows where it is and how long it has waited.",
               short="AmIMotion is spatial intelligence for factories and warehouses, built from three parts. AmIGo tags ride on trolleys, bins, tools and vehicles. "
                     "AmIMo anchors, fixed high on columns and walls, record when each tag's UWB pulse arrives and the angle it came from. "
                     "AmIHub software works out each position and keeps one live map that your team, your systems and AI assistants all read. "
                     "With AmIMo anchors, AmIHub places a tag down to ±10 cm in 3D. How close depends on your floor.",
               trail=[("How it works", None)],
               actions=(("How it locates a tag", "/technology/"), ("Specifications", "/specs/"), ("For developers", "/developers/")),
               media=hallslot("hall-all", "The whole model hall, the after state: blue trails behind every moving thing, three trolleys on amber in the inspection queue, one pallet on amber in the staging lane, AmIMo blocks visible on the columns. "
                          + HALL + " Rendered 3840 x 2160 at 16:9 with the same camera.", "cine",
                          "A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. Three trolleys at inspection and one pallet in a staging lane are marked amber because they are waiting.")),
          section(vp("What each part does."),
                  cards([
                      ("/products/amigo/", still("amigo-side", "(max-width:639px) 100vw, (max-width:1023px) 50vw, 31vw"), "AmIGo tag", "Screws or sticks onto the trolley. Sends a short pulse when it moves and sleeps when it stops."),
                      ("/products/amimo/", still("amimo", "(max-width:639px) 100vw, (max-width:1023px) 50vw, 31vw"), "AmIMo anchor", "Fixed to a column 3 to 8 m up. Needs only power, from DC or PoE."),
                      ("/products/amihub/", hallslot("hall-waits-32", "The inspection bay, cropped close: one trolley in the inspection zone on blue, three in the queue on amber. " + HALL + " Crop of the poster master, the homepage screen 3 crop. Never called AmIHub (O5).", "still",
                                                 "A model inspection station. Three trolleys in the queue in front of it are marked amber because they are waiting."), "AmIHub", "Works out where each tag is and keeps the live map, on a PC inside your plant."),
                  ], 3)),
          section(vp("How a position is made."),
                  steps([("The tag sends.", "An AmIGo tag sends a UWB pulse a few nanoseconds long when it moves. When it stops, it sleeps."),
                         ("Anchors listen.", "Each AmIMo anchor in range records when the pulse arrives and the angle it came from."),
                         ("AmIHub works it out.", "AmIHub turns those times and angles into a 3D position on the live map, stamped with the time it was seen."),
                         ("Your systems hear.", "AmIHub sends each zone entry and exit to the systems you name, as it happens.")]),
                  more([("How it locates a tag", "/technology/")])),
          section(vp("Who keeps what.", lede="AmIHub records where and when. Your MES stays in charge of every job."),
                  tiles([("AmIHub keeps", "Each tag, its position, the time it was seen, and every zone it entered and left."),
                         ("Your MES or ERP keeps", "The job, the batch, the routing and the status. Location alone does not mark work as done."),
                         ("You link the two", "Link each trolley to the job it carries, in AmIHub or from your own system. Its wait then counts as that job's wait.")], 3),
                  links([("/learn/association/", "Which job is on the trolley?", "Linking trolleys to jobs"),
                         ("/learn/location-data-quality/", "When a tag goes quiet", "Last seen, sleep and gaps")])),
          section(vp("Inside your plant.", "Or in the cloud."),
                  tiles([("On-premise", "AmIHub runs on an industrial PC inside your plant, with no internet needed. Location data stays on site."),
                         ("Cloud", "AmIHub can also run in the cloud. Ask on the call which model fits your IT rules."),
                         ("Either way", "TLS on every interface, access set by role, API keys, audit logs and data retention rules.")], 3),
                  links([("/trust/", "Trust and data", "Where your data lives")])),
          section(vp("The figures, with their conditions."),
                  figures([("±10 cm", "Down to, in 3D", "With AmIMo anchors. How close depends on your floor."),
                           ("About 50 m", "Each anchor's reach", "In clear line of sight. A survey sets the count."),
                           ("1 to 3 years", "AmIGo battery", "Typical, depending on use."),
                           ("3 radios", "UWB, BLE and Wi-Fi FTM", "On the same anchors. Wi-Fi device support is confirmed per site.")]),
                  more([("Specifications", "/specs/")])),
          section(vp("Open at every layer."),
                  prose("<p>AmIMotion is built on the FiRa and omlox specifications. AmIHub speaks REST, MQTT and WebSocket, and has an omlox hub interface, so your MES, ERP and WMS connect to it through open interfaces.</p>"
                        "<p>AmIHub also has an MCP server built in. Any AI assistant that supports MCP can ask the live map a question in plain words. Asking changes nothing. Any change needs a person's approval. We show it live on a call.</p>"),
                  more([("Ask your floor", "/use-cases/ask-your-plant/"), ("For developers", "/developers/")])),
          section(faq([
              ("What are the parts of AmIMotion?", "Three. AmIGo tags ride on trolleys, bins, tools and vehicles. AmIMo anchors, fixed 3 to 8 m up, hear each tag. AmIHub software works out where each tag is and keeps the live map."),
              ("Does ±10 cm mean every reading is within 10 cm?", "No. With AmIMo anchors, AmIHub places a tag down to ±10 cm in 3D. How close depends on your floor, so you measure it on yours in the pilot."),
              ("Do AmIMo anchors need data cables?", "No data or sync cable. Each AmIMo anchor syncs over the air and sends its data to AmIHub over Wi-Fi. Ethernet is also an option. Each one needs power, from DC or PoE."),
              ("Does AmIMotion replace our MES?", "No. Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited, over open interfaces."),
          ], "Questions about the platform.")),
          close(),
      ], type="article", og="/assets/home/og-home.jpg")

# ---------------- AmIGo ----------------
write("/products/amigo/", "AmIGo UWB tag for trolleys, bins, tools and vehicles",
      "AmIGo is AmIMotion's UWB tag. It sends a pulse when it moves and sleeps when it stops, so one battery lasts 1 to 3 years, typical, depending on use.",
      [
          localnav("AmIGo tag", (("Overview", "#page-title"), ("Fitted", "#fitted"), ("Specs", "#specs"))),
          head("AmIGo tag.", "It rides on what moves.", "A small UWB tag that screws or sticks onto a trolley, bin, tool or vehicle. It sends a short pulse when it moves and sleeps when it stops.",
               trail=[HOW, PRODUCTS, ("AmIGo tag", None)], actions=(("Specifications", "#specs"), ("AmIMo anchor", "/products/amimo/")),
               media=still("amigo", "(max-width:1023px) 92vw, 76vw", eager=True), stage="AmIGo"),
          section(SHORT("AmIGo, in short.", "AmIGo is AmIMotion's UWB tag for trolleys, bins, tools, fixtures and vehicles. A motion sensor wakes it to send a short ultra-wideband pulse. "
                        "When it stops, it sleeps, so one battery lasts 1 to 3 years, typical and depending on use. With AmIMo anchors, AmIHub places an AmIGo tag down to ±10 cm in 3D. How close depends on your floor."),
                  figures([("±10 cm", "Down to, in 3D", "With AmIMo anchors, depending on your floor"), ("0.1 to 10 Hz", "Update rate", "Set per tag group. Sent when it moves"),
                           ("1 to 3 years", "Battery", "Typical, depending on use"), ("−20 to +60 °C", "Operating range", "Typical")], giant=True)),
          section(vp("Speaks when it moves.", "Sleeps when it stops."),
                  split("Where the battery life comes from.",
                        ["A 3-axis accelerometer wakes AmIGo when the trolley moves. When it stops, the tag goes into deep sleep. While it sleeps, the map shows where it was last seen, and when.",
                         "You set how often each group of tags reports, from once every ten seconds to ten times a second. Busy tags at high rates use more battery. AmIHub tracks each tag's health and battery level, so you plan a change before a tag goes flat."],
                        media=still("amigo-side", alt="The AmIGo tag, a small dark grey tag with amimotion on its cover.")),   # owed: the amigo_trolley CAD shot (Product Render)
                  km("amigo-sleep", "AmIGo battery", "Fewer pulses. Longer life.", [
                      "AmIGo sends only when its accelerometer says it is moving.",
                      "You set the update rate per tag group, from 0.1 to 10 times a second.",
                      "1 to 3 years on one battery is typical. Busy tags at high rates use more.",
                      "Forklift and tugger tags can run off the vehicle instead."], "/learn/location-data-quality/")),
          section(vp("One tag.", "Fitted three ways."),
                  closer([("On a carrier", "For trolleys, bins, racks and WIP carriers. AmIGo screws on through its two moulded ears, or sticks on.",
                           cad("amigo-top", "The AmIGo tag from above, with a screw ear at each end.")),
                          ("On a vehicle", "For forklifts, tuggers and AGVs. It sits in a vehicle cradle and can run off the vehicle's power.",
                           cad("amigo-card", "The AmIGo tag in dark grey, with amimotion debossed on its top cover.")),
                          ("On a tool", "For fixtures, gauges and hand tools. Find the tool from a screen, and see which cell had it last.",
                           cad("amigo-macro", "The AmIGo tag from the side: a low, compact housing on its two moulded ears."))]),
                  links([("/solutions/wip/", "Work in progress", "See where work waits"),
                         ("/solutions/assets/", "Tools and vehicles", "Fixtures, forklifts, AMRs"),
                         ("/learn/association/", "Which job is on the trolley?", "Linking trolleys to jobs")]), id="fitted"),
          section(vp("The tag names the trolley.", "You name the job."),
                  prose("<p>An AmIGo tag tells AmIHub which trolley it is on, not which job the trolley carries. Link each trolley to the job it carries, in AmIHub or from your own system. "
                        "Its wait then counts as that job's wait. When the trolley takes new work, the old link ends before the new one starts.</p>"),
                  more([("Which job is on the trolley?", "/learn/association/")])),
          section(vp("AmIGo, in detail."),
                  spec([("UWB radio", "IEEE 802.15.4z HRP, channels 5 and 9"),
                        ("Positioning modes", "Several UWB modes. The modes for your hardware revision are in the datasheet"),
                        ("Accuracy", "Down to ±10 cm in 3D, typical, with AmIMo anchors. How close depends on your floor"),
                        ("Update rate", "0.1 to 10 Hz, set per tag group; sent on motion"),
                        ("Battery", "1 to 3 years, typical, depending on use; vehicle-powered option"),
                        ("Sensor", "3-axis accelerometer: motion wake, tilt and impact events"),
                        ("Operating temperature", "−20 °C to +60 °C, typical"),
                        ("Mounting", "Adhesive, screw, lanyard or helmet, vehicle cradle"),
                        ("Forms", "Asset tag, vehicle tag, personnel badge"),
                        ("Housing", "Compact and low profile. Size, weight and ingress rating are in the datasheet")],
                       "Indicative values from AmIMotion's published figures. The final datasheet is shared under NDA after the first call."),
                  more([("Specifications", "/specs/")]), id="specs"),
          section(faq([
              ("What is an AmIGo tag?", "AmIGo is AmIMotion's UWB tag for trolleys, bins, tools, fixtures and vehicles. With AmIMo anchors, AmIHub places it down to ±10 cm in 3D, depending on your floor. Its battery lasts 1 to 3 years, typical."),
              ("What battery life does a UWB asset tag have?", "An AmIGo UWB tag lasts 1 to 3 years on one battery, typical. It depends on how often the tag moves and the update rate you set, because AmIGo sleeps when it stops."),
              ("Is AmIGo small enough for totes and hand tools?", "AmIGo is a compact, low-profile tag that screws or sticks on. It is made for bins, totes, tools and fixtures as well as trolleys. Its exact size is in the datasheet, shared under NDA."),
              ("Does every AmIGo tag report at the same rate?", "No. You set the rate per tag group, from 0.1 to 10 times a second. Each tag reports only while it moves."),
              ("Can AmIGo tag people?", "AmIGo also comes as a lanyard or helmet badge. A pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy."),
          ], "Questions about AmIGo.")),
          close("Tag the thing people look for.", "Bring one flow to the call. We show it on the live map."),
      ], type="product", product="AmIGo", category="UWB tag", og="/assets/home/amigo-page-1600.webp")

# ---------------- AmIMo ----------------
write("/products/amimo/", "AmIMo UWB anchor: power only, no sync cable, 3D angle",
      "AmIMo is AmIMotion's UWB anchor. It times each tag pulse and reads its angle, syncs over the air, sends data over Wi-Fi and needs only DC or PoE power.",
      [
          localnav("AmIMo anchor", (("Overview", "#page-title"), ("Mounting", "#mounting"), ("Survey", "#survey"), ("Specs", "#specs"))),
          head("AmIMo anchor.", "It needs only power.", "Fixed to a column or wall 3 to 8 m up, AmIMo hears each tag's pulse and the angle it came from. It syncs over the air, so there is no sync cable to run.",
               trail=[HOW, PRODUCTS, ("AmIMo anchor", None)], actions=(("Specifications", "#specs"), ("How many anchors you need", "/tools/anchors/")),
               media=still("amimo", "(max-width:1023px) 92vw, 76vw", eager=True), stage="AmIMo"),
          section(SHORT("AmIMo, in short.", "AmIMo is AmIMotion's UWB anchor. It records when each AmIGo pulse arrives and reads the angle it came from, in 3D, so fewer anchors fix a position. "
                        "AmIMo keeps time with the other anchors over the air, sends its data to AmIHub over Wi-Fi, with an Ethernet option, and needs only power, from DC or PoE. "
                        "Each AmIMo anchor reaches about 50 m in clear line of sight. A site survey sets how many your floor needs."),
                  figures([("3D", "Angle of arrival", "Direction as well as time"), ("About 50 m", "Reach in line of sight", "Site-dependent. The survey sets the count"),
                           ("DC or PoE", "Power", "With Wi-Fi backhaul, no data or sync cable"), ("3 to 8 m", "Mounting height", "Recommended. Wall, column, ceiling or pole")])),
          section(vp("What you run to it.", "Power, and nothing else."),
                  prose("<p>AmIMo needs only power, from a DC adapter or PoE. It keeps time with the other anchors over the air, with no sync cable. It sends its data to AmIHub over Wi-Fi, so it needs no separate data cable. Ethernet is also an option.</p>"
                        "<p>You set each AmIMo up from a phone app. AmIHub finds each anchor on its own and raises an alert if one goes dark.</p>"),
                  closer([("On a column, wall or ceiling, or on a pole, 3 to 8 m up.", "", cad("amimo-3q", "The AmIMo anchor, a dark grey box with amimotion on its side and a mounting tab.")),
                          ("Set up from a phone app. AmIHub finds each anchor itself.", "", cad("amimo-side", "The AmIMo anchor from the side, amimotion on its long face.")),
                          ("Each anchor reaches about 50 m in line of sight. Steel and racking set the final count.", "", cad("amimo-a", "The AmIMo anchor from the end, with its network port and a mounting tab.")),
                          ("Prefer a wired network? Ethernet is also an option.", "", still("amimo", alt="The AmIMo anchor, a dark grey box with a network port."))], h3="Where and how anchors mount."),
                  more([("How it locates a tag", "/technology/")]), id="mounting"),
          section(vp("Three radios.", "One anchor."),
                  tiles([("UWB", "AmIGo tags on carriers, tools and vehicles, down to ±10 cm in 3D with AmIMo anchors, depending on your floor."),
                         ("BLE ranging", "Zone-level presence for BLE devices and beacons that carry no UWB tag."),
                         ("Wi-Fi FTM", "Ranging with compatible Wi-Fi devices, from the same AmIMo anchors. Device support is confirmed for each site.")], 3)),
          section(vp("Every floor starts with a survey.", lede="Racking, ceiling height and steel decide where anchors go. Floor area alone does not."),
                  split("Where AmIMo anchors go.",
                        ["Each AmIMo reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count."],
                        ["High on columns or walls, 3 to 8 m up, clear of moving vehicles.",
                         "Spread around the area a tag moves in, not in one straight line.",
                         "Where the angle helps, as few as two anchors in view can fix a position.",
                         "Over dense racking, the survey measures the steel first."],
                        hallslot("hall-bay-32", "The whole model hall pale, one bay (inspection station and its queue) in full colour with its trails, its waits and the two AmIMo blocks on its columns. " + HALL + " The homepage screen 6 frame (bay mask on).", "still",
                             "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors.")),
                  links([("/tools/anchors/", "How many anchors you need", "A first estimate, before the survey"),
                         ("/learn/anchor-planning/", "Anchor planning", "What sets the count on a real floor"),
                         ("/technology/", "How it locates a tag", "Steel, racking, signal and outages")]), id="survey"),
          section(vp("AmIMo, in detail."),
                  spec([("UWB radio", "IEEE 802.15.4z HRP, with a 3D angle-of-arrival antenna array"),
                        ("Positioning modes", "UL-TDoA, DL-TDoA, two-way ranging and 3D AoA, chosen per zone in AmIHub"),
                        ("Additional ranging", "BLE ranging; Wi-Fi FTM (IEEE 802.11mc). Device support confirmed per site"),
                        ("Coverage", "About 50 m line-of-sight radius, indicative and site-dependent"),
                        ("Synchronisation", "Over the air; no sync cable"),
                        ("Backhaul", "Wi-Fi 2.4 / 5 GHz to AmIHub; Ethernet option"),
                        ("Power", "DC adapter or PoE"),
                        ("Tag capacity", "Hundreds of active tags per anchor cell (UL-TDoA), indicative"),
                        ("Mounting", "3 to 8 m recommended; wall, column, ceiling and pole brackets"),
                        ("Operating temperature", "−20 °C to +60 °C, typical; indoor and sheltered outdoor"),
                        ("Commissioning", "Phone app; found by AmIHub on its own"),
                        ("Silicon", "NXP Trimension UWB")],
                       "Indicative values. Coverage and spacing change with ceiling height, racking and metal. The final count comes from a site survey. Full datasheets are shared under NDA."),
                  id="specs"),
          section(faq([
              ("What is an AmIMo anchor?", "AmIMo is AmIMotion's UWB anchor. It times each tag pulse and reads its 3D angle of arrival. It offers BLE ranging and Wi-Fi FTM from the same unit, and needs only DC or PoE power, with no data or sync cable."),
              ("Does an RTLS anchor need data cabling?", "Not AmIMo. It syncs over the air and sends its data to AmIHub over Wi-Fi, with an Ethernet option. Each AmIMo anchor still needs power, from DC or PoE."),
              ("How far does one AmIMo anchor reach?", "About 50 m in clear line of sight, indicative and site-dependent. Racking, machines and steel shorten it, so a site survey sets the count."),
              ("How many AmIMo anchors does a floor need?", "It depends on the accuracy you need, the ceiling height and how much racking blocks the view. Where the angle helps, as few as two anchors in view can fix a position. A site survey sets the count."),
              ("What happens if an anchor loses power?", "AmIHub raises an alert when an AmIMo anchor goes dark, so your team knows which one to check."),
          ], "Questions about AmIMo.")),
          close("Plan the anchors for one bay.", "Enter your floor and racking, and get a first range of AmIMo anchors before the survey.", (("How many anchors you need", "/tools/anchors/"),)),
      ], type="product", product="AmIMo", category="UWB anchor", og="/assets/home/amimo-page-1200.webp")

# ---------------- AmIHub ----------------
write("/products/amihub/", "AmIHub software: live map, zone events and open APIs",
      "AmIHub is AmIMotion's software. It works out where each tag is, times every zone entry and exit, and runs inside your plant with no internet needed.",
      [
          localnav("AmIHub", (("Overview", "#page-title"), ("Interfaces", "#interfaces"))),
          head("AmIHub.", "One live map of your floor.", "AmIHub turns each tag's pulse into a place and a time. Your team, your systems and AI assistants read the same map.",
               trail=[HOW, PRODUCTS, ("AmIHub", None)], actions=(("Interfaces", "#interfaces"), ("For developers", "/developers/")),
               media=hallslot("hall-waits", "Fallback until a real AmIHub capture is cleared (O5): the hero poster crop of the inspection bay, the trail of one trolley into the queue, three trolleys and one pallet on amber, everything else pale. "
                          + HALL + " 16:9 crop of the poster master. Never called AmIHub.", "cine",
                          "A model factory floor with paths in blue and waits in amber.")),
          section(SHORT("AmIHub, in short.", "AmIHub is AmIMotion's software: the positioning engine and the record of where every tag has been. "
                        "It works out each AmIGo tag's position from AmIMo timing and angle, and keeps a live map of your floor and its zones. "
                        "AmIHub notes when each tagged item enters and leaves a zone, so you see how long it has waited, while it is still waiting. "
                        "It runs on an industrial PC inside your plant with no internet needed, or in the cloud. It speaks REST, MQTT, WebSocket and omlox, and has an MCP server built in.")),
          section(vp("What AmIHub does."),
                  tiles([("Works out positions", "From each pulse's arrival times and angles, filtered against your floor map. Positions update in under a second, indicative."),
                         ("Keeps the live map", "Your floor plan, zones and racking, with every tagged item, its trail and where it was last seen."),
                         ("Times every zone", "AmIHub time-stamps each entry and exit. You name the zones. You see how long each item has waited."),
                         ("Answers by time window", "Ask for any item's trail, trips and waits over the hours you choose. Export to CSV or Parquet."),
                         ("Looks after the devices", "Finds each anchor on its own, tracks tag health and battery, updates firmware over the air, and raises an alert if an anchor goes dark."),
                         ("Grows with you", "From one bay to the whole plant on the same AmIHub, without re-fitting the first bay. Thousands of tags per site, indicative.")], 3)),
          section(vp("Your systems keep their jobs.", lede="AmIHub adds where and when. Your MES, ERP and WMS stay in charge of jobs and status."),
                  compare(["Interface", "What it carries", "Typical use"], [
                      ("REST", "Positions, zones, history and device state", "Queries from MES, ERP, WMS and BI tools"),
                      ("MQTT", "Each zone entry and exit, as it happens", "Events into plant systems"),
                      ("WebSocket", "Live positions", "Screens and your own apps"),
                      ("omlox hub interface", "Location data in the open omlox model", "Data that is not tied to one vendor"),
                      ("MCP server", "Positions, zones and history", "AI assistants; any change needs a person's approval")],
                      "Which systems connect, and with which fields, is agreed for your site."),
                  more([("For developers", "/developers/"), ("Which job is on the trolley?", "/learn/association/")]), id="interfaces"),
          section(vp("Ask your floor a question."),
                  prose('<p class="lead">“Which trolleys have waited at inspection for more than an hour?”</p>'),
                  tiles([("Ask", "Any AI assistant that supports MCP can ask AmIHub in plain words. Asking changes nothing."),
                         ("Scoped", "Each assistant gets its own access: read-only, or only the actions you allow."),
                         ("Logged", "Every request is logged: who asked, what was called and what changed."),
                         ("Approved", "Any change, such as raising a work order, needs a person's approval. You can require it from a supervisor.")], 4),
                  prose("<p>The MCP server is part of AmIHub, so it runs where AmIHub runs. If the assistant runs inside your network too, nothing has to leave it. We show it live on a call.</p>"),
                  more([("Ask your floor", "/use-cases/ask-your-plant/"), ("Trust and data", "/trust/")])),
          section(vp("Inside your plant.", "Or in the cloud."),
                  tiles([("On-premise", "AmIHub runs on an industrial PC inside your plant, with no internet needed. Location data stays on site."),
                         ("Cloud", "AmIHub can also run in the cloud. Ask on the call which model fits your IT rules."),
                         ("Either way", "TLS on every interface, access set by role, API keys, audit logs and data retention rules.")], 3)),
          section(vp("AmIHub, in detail."),
                  spec([("Positioning", "UL-TDoA, DL-TDoA, two-way ranging and AoA solvers, filtered against the floor map"),
                        ("Accuracy", "Down to ±10 cm in 3D, typical, with AmIMo anchors; depends on your floor"),
                        ("Updates", "Under a second from pulse to map, indicative"),
                        ("Scale", "Thousands of tags and hundreds of anchors per site, indicative"),
                        ("Records", "Every entry, exit, idle and dwell, time-stamped and queryable by time window"),
                        ("Interfaces", "REST, MQTT, WebSocket, omlox hub interface, built-in MCP server"),
                        ("Hosting", "Industrial PC inside your plant with no internet needed, or cloud"),
                        ("Security", "TLS, role-based access, API keys, audit logs, data retention rules"),
                        ("Export", "CSV and Parquet"),
                        ("Devices", "Anchor auto-discovery, tag health and battery, over-the-air firmware, dark-anchor alert"),
                        ("Standards", "Data and device model built on the FiRa and omlox specifications")],
                       "Indicative values. Ask on the call for a live demo of the views that matter on your floor.")),
          section(faq([
              ("What is AmIHub?", "AmIHub is AmIMotion's software. It is the positioning engine, the live map of your floor and the record of every zone entry and exit. It has open APIs (REST, MQTT, WebSocket, omlox) and a built-in MCP server, and runs on-premise or in the cloud."),
              ("Which RTLS can run on-premise without internet?", "AmIHub, AmIMotion's software, runs on an industrial PC inside your plant with no internet needed, so location data stays on site. It can also run in the cloud if your IT rules prefer that."),
              ("Does AmIHub replace our MES or WMS?", "No. Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited, and feeds your MES, ERP or WMS over open interfaces."),
              ("Can AmIHub send zone events to SAP or an MES over MQTT?", "AmIHub sends each zone entry and exit over MQTT, as it happens, and offers REST, WebSocket and an omlox hub interface. The connector for your SAP, MES or ERP is confirmed for your site."),
              ("Does AmIMotion have an MCP server?", "Yes. AmIHub has an MCP server built in, so AI assistants that support MCP can ask the live map a question. Any change needs a person's approval. We show it live on a call."),
          ], "Questions about AmIHub.")),
          close("See your floor on AmIHub.", "On the call: the live map and an AI query, on real AmIHub data."),
      ], type="software", product="AmIHub")

# ---------------- /products/ (round 13: the lineup page; it was a directory listing) ----------------
# Every sentence here is the platform's or the specs' own, reused word for word: the lineup row (Apple iPhone), the
# compare table as text (Apple compare), Product data per part without prices.
LINE = "(max-width:639px) 100vw, (max-width:1023px) 50vw, 31vw"
write("/products/", "AmIMotion products: AmIGo tag, AmIMo anchor, AmIHub",
      "The three AmIMotion products side by side: AmIGo tags on what moves, AmIMo anchors on your columns, and AmIHub, the live map of where work waits.",
      [
          head("Products.", "Three parts. One live map.", "A tag rides on what moves. Anchors on your columns hear it. AmIHub shows where it is and how long it has waited.",
               short="AmIMotion is spatial intelligence for factories and warehouses, built from three parts. AmIGo tags ride on trolleys, bins, tools and vehicles. "
                     "AmIMo anchors, fixed high on columns and walls, record when each tag's UWB pulse arrives and the angle it came from. "
                     "AmIHub software works out each position and keeps one live map that your team, your systems and AI assistants all read. "
                     "With AmIMo anchors, AmIHub places a tag down to ±10 cm in 3D. How close depends on your floor.",
               trail=[HOW, ("Products", None)], media=render("family-31", "(max-width:1023px) 150vw, 100vw")),   # round 11 R3 on the sweep
          section(cards([
                      ("/products/amigo/", still("amigo", LINE), "AmIGo tag", "Screws or sticks onto the trolley. Sends a short pulse when it moves and sleeps when it stops."),
                      ("/products/amimo/", still("amimo", LINE), "AmIMo anchor", "Fixed to a column 3 to 8 m up. Needs only power, from DC or PoE."),
                      ("/products/amihub/", hallslot("hall-waits-32", "The inspection bay, cropped close. " + HALL + " Never called AmIHub (O5).", "still",
                                                 "A model inspection station. Three trolleys in the queue in front of it are marked amber because they are waiting."), "AmIHub", "Works out where each tag is and keeps the live map, on a PC inside your plant."),
                  ], 3), label="The three parts"),
          section(vp("Side by side."),
                  compare(["", "AmIGo tag", "AmIMo anchor", "AmIHub"], [
                      ("What it does", "Sends a short pulse when it moves and sleeps when it stops.", "Records when the pulse arrives and the angle it came from.", "Works out where each tag is and keeps the live map."),
                      ("Where it goes", "Screws or sticks onto the trolley.", "Fixed to a column 3 to 8 m up.", "Industrial PC inside your plant, with no internet needed; or cloud"),
                      ("Radio", "IEEE 802.15.4z HRP, channels 5 and 9", "IEEE 802.15.4z HRP, with a 3D angle-of-arrival antenna array", "—"),
                      ("Accuracy", "Down to ±10 cm in 3D, typical, with AmIMo anchors. How close depends on your floor", "About 50 m line-of-sight radius, indicative and site-dependent", "—"),
                      ("Power", "1 to 3 years, typical, depending on use; vehicle-powered option", "DC adapter or PoE", "—"),
                      ("Interfaces", "—", "—", "REST, MQTT, WebSocket, omlox hub interface and a built-in MCP server"),
                      ("Operating temperature", "−20 °C to +60 °C, typical", "−20 °C to +60 °C, typical; indoor and sheltered outdoor", "—"),
                  ], "Indicative values. Full datasheets are shared under NDA.", cls="lineup"),
                  more([("Specifications", "/specs/")]), band="surface"),
          section(vp("How a position is made."),
                  links([("/technology/", "How it locates a tag", "UWB timing, angle and steel"),
                         ("/platform/", "How it works", "Three parts, one live map"),
                         ("/tools/anchors/", "How many anchors you need", "A first estimate, before the survey")])),
          jsonld({"@context": "https://schema.org", "@type": "ItemList", "name": "AmIMotion products", "itemListElement": [
              {"@type": "ListItem", "position": i + 1, "item": {"@type": "Product", "name": n, "url": "https://www.amimotion.com" + u, "description": d,
                                                                 "brand": {"@type": "Brand", "name": "AmIMotion"}, "category": c}}
              for i, (n, u, d, c) in enumerate([
                  ("AmIGo", "/products/amigo/", "AmIGo is AmIMotion's UWB tag. It sends a pulse when it moves and sleeps when it stops, so one battery lasts 1 to 3 years, typical, depending on use.", "UWB tag"),
                  ("AmIMo", "/products/amimo/", "AmIMo is AmIMotion's UWB anchor. It times each tag pulse and reads its angle, syncs over the air, sends data over Wi-Fi and needs only DC or PoE power.", "UWB anchor"),
                  ("AmIHub", "/products/amihub/", "AmIHub is AmIMotion's software. It works out where each tag is, times every zone entry and exit, and runs inside your plant with no internet needed.", "Location software")])]}),
          close(),
      ], page="CollectionPage")

# ---------------- technology ----------------
write("/technology/", "How AmIMotion locates a tag: UWB timing, angle and steel",
      "An AmIGo tag sends a UWB pulse. AmIMo anchors time it and read its angle. AmIHub works out a 3D position. How it works, and what steel does to it.",
      [
          localnav("How it locates a tag", (("Time and angle", "#light-travels-about-30-cm"), ("Steel and racking", "#steel-and-racking"), ("When something goes quiet", "#when-something-goes-quiet"),
                                            ("Positioning modes", "#modes"), ("Open standards", "#open-standards")), sections=True),
          head("How AmIMotion locates a tag.", None, "A tag sends a pulse a few nanoseconds long. Anchors note when it arrives and where it came from. AmIHub works out the spot.",
               short="AmIMotion locates tags with ultra-wideband (UWB) radio, to IEEE 802.15.4z. An AmIGo tag sends a pulse a few nanoseconds long. "
                     "Each AmIMo anchor in range records its time of arrival and its angle of arrival. AmIHub compares the times between anchors (time difference of arrival, TDoA) and the angles, and works out a 3D position. "
                     "With AmIMo anchors that is down to ±10 cm, typical. How close depends on your floor. AmIMotion is built on the FiRa and omlox specifications.",
               trail=[HOW, ("How it locates a tag", None)], actions=(("Positioning modes", "#modes"), ("Specifications", "/specs/")),
               media=render("hall-lines", "100vw")),   # round 11 R12, the hall line drawing
          section(vp("Light travels about 30 cm", "in a nanosecond.", "So the time a pulse takes to reach each anchor says how far it went. Small timing differences between anchors become a position."),
                  explain([("Time", "Each AmIMo anchor records when the pulse arrives. The differences between anchors place the tag. This is time difference of arrival, TDoA."),
                           ("Angle", "An antenna array in each AmIMo reads the direction the pulse came from, side to side and up and down. So fewer anchors fix a position, and height counts."),
                           ("The map", "AmIHub combines the times, the angles and your floor map into one 3D position, stamped with the time it was seen.")],
                          "A drawing of one bay from above: three anchors and one tagged trolley. Bars show when the pulse reaches each anchor; lines show the angle each one reads."),
                  hallslot("hall-plan", "A plan of one bay seen from straight above: two AmIMo anchors on columns and one AmIGo tag on a trolley; nothing else. No arcs, no rings, no glow. The only marks are the anchors, the tag and one thin unlabelled line from the tag to each anchor. "
                       "Model-hall still, new camera P in build_hall.py: orthographic, straight down (pitch 90°), over the inspection bay, ortho scale 14 m, t = 0.0, blue trails off, one 30 mm #3a3d42 floor line from the tagged trolley to the foot of each anchor column. Not drawn in code.", "wide",
                       "A model inspection bay seen from above: one tagged trolley and the two anchors on the columns that hear it.", "Explainer diagram designer with the Realism lab")),
          section(vp("Steel and racking."),
                  split("What they do to the signal.",
                        ["Steel and racking bounce radio around a hall. Each echo arrives a little after the direct signal. A UWB pulse is so short that the direct signal and its echoes arrive apart, so AmIMo can tell them apart.",
                         "AmIHub adds filters for places where the direct path is blocked. Racking, ceiling height and steel still change how far each anchor reaches. That is why every floor starts with a survey, and why the final anchor count comes from it.",
                         "How close a position is depends on your floor. You measure it on yours in the pilot, in the hard spots as well as the easy ones."],
                        media=hallslot("hall-racks-43", "The racks of the model hall from camera A, cropped tight: the tall racking rows, an aisle, one AmIMo block high on a column at the aisle end. No trail. " + HALL + " 4:3 crop of the 6400 x 8000 poster master over the racks.", "photo",
                                   "Rows of tall racking in a model factory hall, with an anchor high on a column at the end of the aisle.")),
                  more([("How many anchors you need", "/tools/anchors/"), ("AmIMo anchor", "/products/amimo/")])),
          section(vp("When something goes quiet."),
                  tiles([("A tag at rest", "AmIGo sleeps when it stops. The map shows where it was last seen, and when."),
                         ("A tag out of view", "If a load hides a tag, or it leaves the area the anchors cover, the map keeps its last-seen spot and time."),
                         ("An anchor goes dark", "AmIHub raises an alert when an AmIMo anchor stops reporting, so your team knows which one to check.")], 3),
                  prose("<p>AmIMo sends its data to AmIHub over Wi-Fi, and Ethernet is also an option. How your network design handles an outage is part of the site survey.</p>"),
                  more([("When a tag goes quiet", "/learn/location-data-quality/")])),
          section(vp("Choose the method per zone.", lede="You switch modes per zone in AmIHub, with no hardware swap."),
                  compare(["Mode", "How it works", "Best for"], [
                      ("UL-TDoA", "The tag sends; anchors compare when it arrived", "Thousands of low-power tags across a floor"),
                      ("DL-TDoA", "Anchors send; the device works out its own position", "Devices that work out their own position"),
                      ("AoA with two-way ranging", "The angle, plus a timed ping and reply", "Precise gates, docks and cells"),
                      ("BLE and Wi-Fi FTM", "Bluetooth ranging and Wi-Fi fine timing from the same anchors", "BLE and Wi-Fi devices, and yards. Device support confirmed per site")],
                      "Which modes your hardware revision supports is in the datasheet, shared under NDA."), id="modes"),
          section(vp("Open standards."),
                  prose("<p>AmIMotion is built on the FiRa and omlox specifications. Its UWB radio follows IEEE 802.15.4z HRP on channels 5 and 9, on NXP Trimension UWB silicon. "
                        "AmIHub has an omlox hub interface, so your location data is not tied to one vendor's format. AmIMotion claims no formal certification.</p>"),
                  figures([("802.15.4z", "The IEEE UWB standard", "HRP, channels 5 and 9"), ("FiRa · omlox", "Built on the specifications", "No certification claimed"),
                           ("3 radios", "UWB, BLE, Wi-Fi FTM", "On the same anchors"), ("±10 cm", "Down to, in 3D", "Typical, with AmIMo anchors. Depends on your floor")]),
                  links([("/learn/accuracy/", "How to test accuracy", "Typical, best case and the hard spots"),
                         ("/learn/anchor-planning/", "Anchor planning", "What sets the count"),
                         ("/learn/omlox/", "What is omlox?", "The open standard for industrial location")])),
          section(faq([
              ("How does UWB measure position?", "An AmIGo tag sends a pulse a few nanoseconds long. AmIMo anchors record its time of arrival (time difference of arrival, TDoA) and its angle of arrival. Light travels about 30 cm in a nanosecond, so that timing places the tag to centimetres. AmIHub works out the 3D position."),
              ("Which UWB RTLS supports FiRa?", "AmIMotion is built on the FiRa and omlox specifications, and its UWB radio follows IEEE 802.15.4z. It claims no formal certification."),
              ("Which RTLS works with UWB, BLE and Wi-Fi on the same anchors?", "AmIMotion. AmIMo anchors offer UWB, BLE ranging and Wi-Fi FTM from the same unit, so one install can serve more than one kind of device. Wi-Fi device support is confirmed per site."),
              ("How accurate is AmIMotion?", "Down to ±10 cm in 3D, typical, with AmIMo anchors. How close depends on your floor, so you measure it on yours in the pilot."),
              ("Does UWB work in a factory full of steel and racking?", "A UWB pulse is short enough that AmIMo can tell the direct signal from its echoes off steel, and AmIHub filters places where the direct path is blocked. Racking and steel still change each anchor's reach, so a site survey sets the anchor count."),
              ("Does AmIMotion integrate with SAP or an MES over MQTT?", "AmIHub sends each zone entry and exit over MQTT and offers REST, WebSocket and an omlox hub interface. The connector for your SAP, MES or ERP is confirmed for your site."),
          ], "Questions about the technology.")),
          close(),
      ], type="article")

# ---------------- specs ----------------
write("/specs/", "AmIMotion specifications: AmIGo, AmIMo and AmIHub",
      "Every published figure for AmIGo tags, AmIMo anchors and AmIHub software, each with its condition: radio, accuracy, battery, power, interfaces, hosting.",
      [
          head("Specifications.", "Every figure, with its condition.", "These are AmIMotion's published figures. Each one carries what it depends on. The final datasheets come under NDA after the first call.",
               short="AmIMotion is a UWB location system in three parts. AmIGo tags use IEEE 802.15.4z HRP radio on channels 5 and 9 and report 0.1 to 10 times a second. "
                     "AmIMo anchors time each pulse, read its 3D angle of arrival and need only DC or PoE power. "
                     "AmIHub places tags down to ±10 cm in 3D with AmIMo anchors, depending on your floor, and runs inside your plant or in the cloud. AmIMotion is built on the FiRa and omlox specifications.",
               trail=[HOW, ("Specifications", None)], actions=(("How it locates a tag", "/technology/"), ("For developers", "/developers/")),
               media=still("pair", eager=True, alt="The AmIGo tag and the AmIMo anchor side by side, both dark grey with amimotion on the cover.")),
          section(vp("The system."),
                  spec([("Radio", "Ultra-wideband, IEEE 802.15.4z HRP, channels 5 and 9"),
                        ("Positioning modes", "UL-TDoA, DL-TDoA, two-way ranging and 3D angle of arrival, chosen per zone in AmIHub"),
                        ("Accuracy", "Down to ±10 cm in 3D, typical, with AmIMo anchors. Depends on your floor; you measure it in the pilot"),
                        ("Update rate", "0.1 to 10 Hz, set per tag group; tags send when they move"),
                        ("Latency", "Under a second from pulse to map, indicative"),
                        ("Additional ranging", "BLE ranging and Wi-Fi FTM (IEEE 802.11mc) on the same anchors. Device support confirmed per site"),
                        ("Silicon", "NXP Trimension UWB"),
                        ("Standards", "Built on the FiRa and omlox specifications. No certification claimed")])),
          section(vp("AmIGo tag."),
                  spec([("Forms", "Asset tag, vehicle tag, personnel badge"),
                        ("Positioning modes", "Several UWB modes; the modes for your hardware revision are in the datasheet"),
                        ("Battery", "1 to 3 years, typical, depending on use; vehicle-powered option"),
                        ("Sensor", "3-axis accelerometer: motion wake, tilt and impact events"),
                        ("Operating temperature", "−20 °C to +60 °C, typical"),
                        ("Mounting", "Adhesive, screw, lanyard or helmet, vehicle cradle"),
                        ("Housing", "Compact and low profile"),
                        ("Size, weight, ingress rating", "In the datasheet, under NDA")]),
                  more([("AmIGo tag", "/products/amigo/")])),
          section(vp("AmIMo anchor."),
                  spec([("Antenna", "3D angle-of-arrival array"),
                        ("Coverage", "About 50 m line-of-sight radius, indicative and site-dependent; the count comes from a site survey"),
                        ("Synchronisation", "Over the air; no sync cable"),
                        ("Backhaul", "Wi-Fi 2.4 / 5 GHz to AmIHub; Ethernet option"),
                        ("Power", "DC adapter or PoE"),
                        ("Mounting height", "3 to 8 m recommended; wall, column, ceiling and pole brackets"),
                        ("Tag capacity", "Hundreds of active tags per anchor cell (UL-TDoA), indicative"),
                        ("Operating temperature", "−20 °C to +60 °C, typical; indoor and sheltered outdoor"),
                        ("Commissioning", "Phone app; found by AmIHub on its own")]),
                  more([("AmIMo anchor", "/products/amimo/"), ("How many anchors you need", "/tools/anchors/")])),
          section(vp("AmIHub software."),
                  spec([("Hosting", "Industrial PC inside your plant, with no internet needed; or cloud"),
                        ("Interfaces", "REST, MQTT, WebSocket, omlox hub interface and a built-in MCP server"),
                        ("Records", "Position, time and zone history; every entry, exit, idle and dwell, time-stamped"),
                        ("Export", "CSV and Parquet"),
                        ("Security", "TLS, role-based access, API keys, audit logs and data retention rules"),
                        ("Devices", "Anchor auto-discovery, tag health and battery, over-the-air firmware, dark-anchor alert"),
                        ("Scale", "Thousands of tags and hundreds of anchors per site, indicative")]),
                  more([("AmIHub", "/products/amihub/"), ("For developers", "/developers/")])),
          section(vp("Not published yet.", lede="After the first call, we share datasheets, architecture, prices and pilot options under NDA."),
                  tiles([("Datasheets", "Size, weight, ingress rating and the hardware revision for your evaluation."),
                         ("Capacity", "Tags per anchor cell at the update rates your flows need."),
                         ("Your floor", "An anchor plan from the site survey, and the architecture for your network.")], 3)),
          section(faq([
              ("Which positioning methods does AmIMotion use?", "Several, chosen per zone in AmIHub: UL-TDoA, DL-TDoA, two-way ranging and 3D angle of arrival. Most asset tracking uses UL-TDoA, where AmIGo tags send and AmIMo anchors time the pulse."),
              ("What update rate do AmIGo tags support?", "0.1 to 10 Hz, set per tag group. AmIGo tags sleep when still and send when they move, which is why one battery lasts 1 to 3 years, typical."),
              ("How accurate is AmIMotion?", "Down to ±10 cm in 3D, typical, with AmIMo anchors. It depends on your floor, so you measure it on yours in the pilot, near racking and machines too."),
              ("Why are size and weight not listed?", "AmIMotion shares them in the final datasheet, under NDA after the first call, with the hardware revision you would evaluate."),
              ("Does AmIMotion hold a formal certification?", "AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification."),
          ], "Questions about the figures.")),
          close("Ask for the full datasheets.", "We share them after the first call, with the architecture for your site."),
      ], type="article")

# ---------------- developers ----------------
write("/developers/", "AmIHub for developers: REST, MQTT, WebSocket and MCP",
      "Build on AmIHub: REST queries, MQTT and WebSocket events, an omlox hub interface and a built-in MCP server, with API keys, roles, TLS and audit logs.",
      [
          head("For developers.", "Five ways into AmIHub.", "AmIHub keeps one record of where each tag is and when it moved. Your code reads it over open interfaces, inside your plant or in the cloud.",
               short='<a href="/products/amihub/">AmIHub</a>, AmIMotion\'s software, gives developers location data over REST, MQTT, WebSocket and an omlox hub interface, and has an MCP server built in for AI assistants. '
                     "Every interface runs over TLS, with API keys and access by role, and every call is logged. On-premise, AmIHub runs on a PC inside your plant, so every interface stays on your network.",
               trail=[HOW, ("For developers", None)], actions=(("Specifications", "/specs/"), ("Trust and data", "/trust/"))),
          section(vp("What you can read.", "Records, not raw radio."),
                  tiles([("Positions", "A 3D position for every tracked item, with the time AmIHub saw it."),
                         ("Zone events", "Each entry, exit, idle and dwell, with the tag, the zone and the time stamps."),
                         ("History", "Trails, trips and waits for any item, over the time window you ask for. CSV and Parquet export."),
                         ("Devices", "Health, battery level and firmware state for each AmIGo tag and AmIMo anchor."),
                         ("The map", "Your floor plan, zones, fences and racking."),
                         ("Trackables", "Assets, vehicles and work orders are objects in AmIHub. You assign tags to them, in AmIHub or over the API.")], 3)),
          section(vp("Pick the interface.", "By what your system needs."),
                  compare(["Interface", "Pattern", "Use it for"], [
                      ("REST", "Request and response", "Queries from MES, ERP, WMS and BI tools"),
                      ("MQTT", "Publish and subscribe", "Zone events into plant systems, as they happen"),
                      ("WebSocket", "Live stream", "Screens and your own apps that show live positions"),
                      ("omlox hub interface", "The open omlox location model", "Data that is not tied to one vendor's format"),
                      ("MCP server", "Tools for AI assistants", "Questions in plain words; any change needs a person's approval")],
                      "Which topics, fields and rates your systems receive is agreed for your site. The architecture for your site comes with the datasheets, under NDA.")),
          section(vp("A zone event, in words."),
                  prose("<p>When a tagged trolley enters a zone, AmIHub records an event. It names the tag, the zone, the kind of event (entered, left, idle or dwell) and the time. "
                        "When the trolley leaves, a second event closes the visit, so the wait is the time between them. You can take these events as they happen over MQTT or WebSocket, or ask AmIHub for them by time window over REST.</p>"
                        "<p>Link each trolley to the job it carries, in AmIHub or from your own system. AmIHub then reports the wait against that job. Your MES stays in charge of the job itself.</p>")),
          section(vp("AI assistants, with limits.", lede="AmIHub has an MCP server built in. MCP is an open standard that lets AI assistants use other software."),
                  tiles([("Scoped", "Each assistant gets its own access: read-only, or only the actions you allow."),
                         ("Logged", "Every request is logged: who asked, what was called and what changed."),
                         ("Approved", "Any change, such as raising a work order, needs a person's approval. You can require it from a supervisor.")], 3),
                  prose("<p>AmIHub's MCP tools cover live positions, history by time window, zones and fences, and the tags assigned to things. The same tools are there over REST and MQTT. Any assistant that supports MCP can connect. We show it live on a call.</p>"),
                  links([("/learn/mcp-location-data/", "MCP and location data", "What an assistant can and cannot do"),
                         ("/use-cases/ask-your-plant/", "Ask your floor", "AI assistants and MCP")])),
          section(vp("Security.", "The same on every interface."),
                  tiles([("In transit", "TLS on every interface."),
                         ("Access", "API keys per system or assistant. Access set by role for people."),
                         ("Record", "Every call logged. Data retention rules for how long AmIHub keeps history.")], 3),
                  links([("/trust/", "Trust and data", "Where your data lives")])),
          section(vp("Build on any layer."),
                  prose("<p>Your team or your integrator can build on AmIMotion at any layer, through open interfaces: the tags and anchors, AmIHub's records, or the MCP tools. One contract and one support line cover every layer.</p>")),
          section(faq([
              ("Does AmIHub have an API?", "Yes. AmIHub has REST for queries, MQTT and WebSocket for live events and positions, an omlox hub interface, and an MCP server built in for AI assistants."),
              ("Can AmIHub send zone events to our MES?", "Yes, over MQTT as they happen, or over REST when your MES asks. Which fields and topics your MES receives is agreed for your site."),
              ("Where is the AmIHub API reference?", "Ask on the first call. AmIMotion shares the architecture for your site with the datasheets, under NDA."),
              ("Does AmIHub work without internet?", "Yes. On-premise, AmIHub runs on an industrial PC inside your plant, and every interface stays on your network."),
              ("Can an integrator build on AmIMotion?", "Yes. Your team or your integrator can build on AmIMotion at any layer, through open interfaces."),
          ], "Questions developers ask.")),
          close(),
      ], type="article")

# ---------------- what is AmIMotion ----------------
ASSOC = "Location alone does not show which job is on a carrier. You link each carrier to its job, in AmIHub or from your own system."
FACTS = [ASSOC if "association" in x else x for x in ENTITY["facts"]]
write("/what-is-amimotion/", "What is AmIMotion? Spatial intelligence from Bengaluru",
      "AmIMotion, from Bengaluru, India, makes spatial intelligence for factories and warehouses: AmIGo UWB tags, AmIMo anchors and AmIHub software.",
      [
          head("What is AmIMotion?", None, trail=[ABOUT, ("What is AmIMotion?", None)],
               short="AmIMotion is a Bengaluru company that makes spatial intelligence for factories and warehouses. Its AmIGo tags ride on trolleys, bins, tools and vehicles. "
                     "Its AmIMo anchors hear each tag's ultra-wideband (UWB) signal. Its AmIHub software shows on one live map where work is and how long it has waited, down to ±10 cm in 3D with AmIMo anchors, depending on the floor. "
                     "AmIMotion is a brand of Locatepro Technologies Pvt Ltd. It designs and builds its tags and anchors in India.",
               actions=(("How it works", "/platform/"), ("About us", "/company/"))),
          section(read([
              ("does", "What AmIMotion does",
               "<p>AmIMotion answers two questions a plant asks every shift: where is it, and how long has it waited.</p><ul>"
               '<li><strong>Find it.</strong> A tagged trolley, bin, tool or forklift shows on <a href="/products/amihub/">AmIHub</a>\'s live map, with where it was last seen, and when. You find out from a screen, not a walk.</li>'
               "<li><strong>See where work waits.</strong> AmIHub notes when each tagged carrier enters and leaves a zone you name. Link a trolley to the job it carries, and its wait counts as that job's wait.</li>"
               "<li><strong>Ask your floor.</strong> AmIHub has an MCP server built in, so AI assistants can ask the live map a question. Asking changes nothing. Any change needs a person's approval.</li>"
               '<li><strong>Vehicles on the same map.</strong> Forklifts, tuggers and AGVs carry vehicle tags and share the same anchors.</li></ul>'),
              ("for", "Who it is for",
               "<p>Manufacturing and warehouse teams who walk the floor to find out what is happening: plant heads, production control, industrial engineering and lean leads, supervisors and line-side logistics, and the OT, IT and MES teams who connect floor data to MES, ERP and WMS.</p>"),
              ("start", "How it starts",
               '<p>A pilot follows one flow in one bay or line. You see your own waits in that bay, and prove the numbers, before you decide on more. Then AmIMotion grows plant-wide on the same AmIHub, without re-fitting the first bay. <a href="/pilot/">How a pilot runs</a>.</p>'),
              ("who", "Who leads it",
               "<p>AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO. Its tags and anchors are designed and built in India on NXP Trimension UWB silicon, with local stock and local engineers on your site.</p>"),
              ("name", "The name",
               '<p>Say it "Ammy-Motion". It is written with a capital A, I and M. The products share the prefix: <a href="/products/amigo/">AmIGo</a>, the tag; <a href="/products/amimo/">AmIMo</a>, the anchor; AmIHub, the software.</p>'),
              ("not", "What AmIMotion is not",
               "<p>AmIMotion is an industrial UWB indoor positioning company in Bengaluru, India. It is not a video or presentation maker, and not an AI video tool with a similar name. It locates tagged trolleys, bins, tools and vehicles on an indoor floor.</p>"),
              ("facts", "Facts, with their conditions", "<ul>" + "".join(f"<li>{x}</li>" for x in FACTS) + "</ul>"),
          ]), label="What is AmIMotion"),
          section(faq([
              ("What is AmIMotion?", "AmIMotion is a Bengaluru company that makes spatial intelligence for factories and warehouses: AmIGo UWB tags, AmIMo anchors and AmIHub software, which shows on one live map where work is and how long it has waited."),
              ("What does AmIMotion do?", "AmIMotion shows factories and warehouses where work is and where it waits. AmIGo tags on trolleys, bins, tools and forklifts are heard by AmIMo anchors, and AmIHub places them on a live map down to ±10 cm in 3D, depending on the floor."),
              ("Are there Indian companies making UWB tags and anchors?", "Yes. AmIMotion designs and builds UWB tags (AmIGo) and anchors (AmIMo) in India, on NXP Trimension UWB silicon, with its own AmIHub software."),
              ("Is AmIMotion the same as Animotion?", "No. AmIMotion is an industrial UWB indoor positioning company in Bengaluru, India, and is not related to any video or presentation tool with a similar name."),
              ("Where is AmIMotion based?", "Bengaluru, India. AmIMotion is a brand of Locatepro Technologies Pvt Ltd."),
              ("How do you say AmIMotion?", "Ammy-Motion."),
          ], "Quick answers.")),
          close("See it on a live map.", "A short call: the live map, an AI question on real AmIHub data, and the questions that scope a pilot."),
      ], type="article", page="AboutPage")

# ---------------- industrial spatial intelligence ----------------
write("/industrial-spatial-intelligence/", "What is industrial spatial intelligence?",
      "Industrial spatial intelligence is the time-stamped location of what moves in a plant, joined with zones and jobs, so teams can see where work waits.",
      [
          head("What is spatial intelligence?", None, trail=[ABOUT, ("What is spatial intelligence?", None)],
               short="Industrial spatial intelligence is a time-stamped location for every trolley, bin, tool and vehicle you tag in a factory or warehouse, joined with your zones and with the jobs each carrier holds. "
                     "With it, people, plant systems and AI assistants can answer where work is and where it waits. AmIMotion builds it, on UWB positioning down to ±10 cm in 3D with AmIMo anchors, depending on the floor.",
               actions=(("Work in progress", "/solutions/wip/"), ("How it works", "/platform/")),
               media=hallslot("hall-ask", "The model hall, everything pale except the three trolleys in the inspection queue on amber: the answer to one question, and nothing else. " + HALL + " The homepage screen 4 frame, 16:9 crop.", "cine",
                          "The same model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited.")),
          section(vp("Three layers.", "One answer."),
                  tiles([("Location", "Where each tagged thing is, down to centimetres, and the time it was seen. AmIMotion gets it from UWB: AmIGo tags and AmIMo anchors."),
                         ("Context", "The zones you name and the job each carrier holds. A position becomes: this job's trolley is waiting at inspection, and this is how long."),
                         ("Answers", 'Supervisors read it on <a href="/products/amihub/">AmIHub</a>\'s live map. Your MES and ERP read it over open interfaces. AI assistants ask it over MCP.')], 3)),
          section(vp("How it differs.", "From a scan, and from RTLS."),
                  compare(["", "What you know", "When you know it", "The question it answers"], [
                      ("A barcode or RFID scan", "Where a thing was when someone or something scanned it", "At each checkpoint", "“Did it pass this point?”"),
                      ("RTLS", "Where a tagged thing is now", "All the time, as it moves", "“Where is it?”"),
                      ("Spatial intelligence", "Where it is, which zone it is in, which job it holds, and for how long", "All the time, with time stamps", "“Where is work waiting, and for how long?”")],
                      "Each fits a different job. Where a record at each checkpoint is all you need, a scan is enough. AmIMotion is for the gaps between checkpoints.")),
          section(vp("What location alone cannot tell you."),
                  tiles([("Which job", 'A tag names the trolley, not the job on it. <a href="/learn/association/">You link each trolley to its job</a>, in AmIHub or from your own system.'),
                         ("Whether work is done", "A trolley in a zone does not prove the work there started or finished. Your MES stays in charge of every job."),
                         ("Why it waited", "The map shows the wait. Why it waited is for your team to say.")], 3)),
          section(vp("Where AmIMotion starts."),
                  prose("<p>AmIMotion starts with work in progress in one bay of a factory. Tagged trolleys and bins, linked to their jobs, are timed in every zone you name. You see your own waits in that bay before you decide on more.</p>"
                        "<p>The same AmIHub then grows plant-wide without re-fitting the first bay. In a warehouse it times pallets and totes from dock to stock. Forklifts, tuggers and AGVs carry vehicle tags on the same anchors, so work and vehicles share one map.</p>"),
                  more([("Work in progress", "/solutions/wip/"), ("How a pilot runs", "/pilot/"), ("Ask your floor", "/use-cases/ask-your-plant/")])),
          section(faq([
              ("What is industrial spatial intelligence?", "It is the time-stamped location of what moves in a plant, joined with your zones and jobs, so people, systems and AI assistants can answer where work is and where it waits. AmIMotion builds it for factories and warehouses."),
              ("How is spatial intelligence different from RTLS?", "RTLS is the location layer: where a tagged thing is. Spatial intelligence adds the zones and the jobs, so the answer is where work waits and for how long. AmIMotion's AmIHub does both."),
              ("Does spatial intelligence need AI?", "No. A supervisor reads AmIHub's live map. AI assistants are one more way to ask it, through AmIHub's MCP server, and any change needs a person's approval."),
              ("Where does AmIMotion start?", "With work in progress in one bay: tagged carriers, linked to their jobs, timed in every zone. Then plant-wide on the same AmIHub."),
          ], "Questions about the category.")),
          close("See where location would help first.", "Six questions about how work moves in your plant. You get a plan for where to start.", (("Plan your first bay", "/diagnostic/"),)),
      ], type="article", term="Industrial Spatial Intelligence")
