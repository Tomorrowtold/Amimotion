from lib import *

AMIGO = '/assets/img/amigo-card-900.webp 900w, /assets/img/amigo-card-1600.webp 1600w'
AMIGO_TOP = '/assets/img/amigo-top-900.webp 900w, /assets/img/amigo-top-1600.webp 1600w'
AMIMO = '/assets/img/amimo-a-900.webp 900w, /assets/img/amimo-a-1600.webp 1600w'
AMIMO_SIDE = '/assets/img/amimo-side-900.webp 900w, /assets/img/amimo-side-1600.webp 1600w'
AMIMO_3Q = '/assets/img/amimo-3q-900.webp 900w, /assets/img/amimo-3q-1600.webp 1600w'


BLOCKS = Path(__file__).resolve().parent / "blocks"


def block(name):
    return (BLOCKS / f"{name}.html").read_text()


def stage(src, srcset, alt, w, h, ground):
    return (f'<div class="card ground-{ground} product-stage" data-reveal-scale><img src="{src}" srcset="{srcset}" sizes="(max-width: 900px) 90vw, 900px" '
            f'alt="{alt}" width="{w}" height="{h}" fetchpriority="high" decoding="async"></div>')


# ---------------- platform ----------------
write("/platform/", "UWB RTLS platform: tags, anchors and software",
      "AmIMotion is one UWB location system: AmIGo tags, AmIMo anchors and AmIHub software. Positions down to ±10 cm in 3D, on-premise or cloud.",
      [
          head("Three parts.", "One live picture of your floor.", "A tag rides on whatever carries the work. Anchors on your columns hear it. AmIHub turns what they hear into a place and a time your people, your systems and your AI can use.",
               short="AmIMotion is a complete ultra-wideband (UWB) real-time location system from Bengaluru: AmIGo tags, AmIMo anchors and AmIHub software. "
                     "It locates tagged trolleys, bins, tools and vehicles down to ±10 cm in 3D (with AmIMo anchors), and records which zone each one is in and for how long.",
               trail=[("Platform", None)], actions=(("Book a call", "/contact/"), ("Diagnose your floor", "/diagnostic/")),
               media=ph("Wide view over a working machining hall from a mezzanine: cells, aisles, trolleys and people moving, anchors visible high on two columns. Late afternoon light through high windows. 21:9.", "hall", "cine")),
          block("amigo"),
          block("amimo"),
          block("precision"),
          section(
              vp("How a position is made.", "A pulse, a time, an angle.", "Nothing here is magic. A tag sends a very short radio pulse, anchors time it and note where it came from, and AmIHub does the geometry."),
              steps([("The tag speaks", "When it moves, AmIGo sends a pulse that lasts a few billionths of a second."),
                     ("Anchors listen", "Every AmIMo in range notes when the pulse arrived and the angle it came in at."),
                     ("AmIHub solves", "Times and angles from several anchors pin the tag to one spot in 3D."),
                     ("Your systems hear", "When the tag crosses into a zone, your MES, ERP or WMS hears about it.")]),
              tone="light", flush=True),
          section(
              vp("AmIHub watches.", "Your MES decides.", "We record where things are and when they moved. Your business systems stay the boss of jobs, orders and status. That split keeps everyone honest."),
              tiles([("AmIHub keeps", "Tag, position, time and zone history", "Every enter, exit, idle and dwell, with the time it was seen."),
                     ("Your MES or ERP keeps", "Job, batch, routing and status", "Location adds where and when. It never marks work as done by itself."),
                     ("Agreed together", "Which job is on which trolley", "A link with a start, an end and an owner, set by a scan or by your records.")]),
              links([("/learn/association/", "How jobs get linked", "Why a trolley’s position doesn’t tell you its job."),
                     ("/learn/location-data-quality/", "When a tag goes quiet", "The map says “last seen”, never a guess."),
                     ("/products/amihub/", "AmIHub", "The map, the records and the interfaces.")]),
              tone="dark"),
          section(
              vp("Runs in your plant.", "Or in the cloud, if you prefer."),
              tiles([("On-premise", "An industrial PC on your network", "No internet needed. Your location data never leaves the site."),
                     ("Cloud", "A cloud tenant", "Hosting terms are set in your contract."),
                     ("Either way", "Controls built in", "TLS encryption, role-based access, API keys, audit logs and retention rules.")]),
              stats([("±10 cm", "Down to, in 3D", "With AmIMo anchors, site-dependent"), ("~50 m", "Anchor reach", "Line of sight, site-dependent"),
                     ("1–3 yrs", "Tag battery", "Typical, usage-dependent"), ("3 radios", "UWB, BLE, Wi-Fi FTM", "On the same anchors")])),
          section(faq([
              ("Does ±10 cm mean every reading is within 10 cm?", "No. Down to ±10 cm in 3D is the figure with AmIMo anchors. Your pilot measures it on your floor, in the hard spots as well as the easy ones."),
              ("Is AmIMotion open or proprietary?", "Open. AmIMotion is built on the FiRa and omlox specifications, and AmIHub speaks REST, MQTT and WebSocket and has an omlox hub interface. Your data is not tied to one vendor."),
              ("Do the anchors need cables?", "No data or sync cables. AmIMo anchors sync over the air and send data over Wi-Fi, or Ethernet if you prefer. Each one needs power, from DC or PoE."),
              ("Can AI assistants use the data?", "AmIHub has a built-in MCP server, so MCP-capable AI assistants can query live positions, zones and history. A person approves any action. Shown in a live demo."),
          ])),
          close(),
      ], tone="light")

# ---------------- AmIGo ----------------
write("/products/amigo/", "AmIGo UWB tag for trolleys, tools and vehicles",
      "AmIGo is AmIMotion’s UWB tag for trolleys, bins, tools, forklifts and badges: down to ±10 cm in 3D, 0.1–10 Hz, 1–3 years battery (typical).",
      [
          head("AmIGo", "The tag that rides with the work.", "Small enough for a tote, tough enough for a forklift. It talks when things move and sleeps when they don’t, which is how one battery lasts one to three years, depending on use.",
               trail=[("Platform", "/platform/"), ("AmIGo", None)], product=True,
               actions=(("Book a call", "/contact/"), ("Specifications", "#specs")),
               media=stage("/assets/img/amigo-card-1600.webp", AMIGO, "AmIGo tag with two screw tabs and an embossed amimotion logo", 1600, 1079, "champagne")),
          section(
              '<div class="answer-tile" data-reveal><p>AmIGo in short</p><p class="short-answer">AmIGo is AmIMotion’s UWB tag, built to IEEE 802.15.4z HRP on channels 5 and 9. '
              'With AmIMo anchors it is located down to ±10 cm in 3D. It reports 0.1 to 10 times a second when it moves and lasts 1 to 3 years on battery, typical and usage-dependent.</p></div>',
              stats([("±10 cm", "Down to, in 3D", "With AmIMo anchors, site-dependent"), ("0.1–10 Hz", "Update rate", "Set per tag group, motion-triggered"),
                     ("1–3 yrs", "Battery", "Typical, usage-dependent"), ("−20–60 °C", "Operating range", "Typical")]), flush=False),
          section(
              vp("Talks when it moves.", "Sleeps when it doesn’t.", more="amigo-sleep"),
              split("Where the battery life comes from.",
                    ["A small motion sensor inside wakes the tag the moment its trolley moves, and notes tilts and knocks. When the trolley parks, the tag goes back to deep sleep.",
                     "It also tells AmIHub how much battery it has left, so you change batteries on a schedule, not when a trolley goes missing."],
                    ["Whole groups of tags are set up from AmIHub", "Vehicle-powered option for forklifts and tuggers", "Several UWB positioning modes; confirm them for your hardware revision"],
                    img("/assets/img/amigo-top-900.webp", "AmIGo tag seen from above with its embossed logo", 900, 599, "stone", srcset=AMIGO_TOP)),
              km("amigo-sleep", "AmIGo battery", "Fewer pulses. Longer life.", [
                  "The tag sends only when the accelerometer says it is moving.",
                  "Update rate is set per tag group, from 0.1 to 10 times a second.",
                  "1 to 3 years on battery is typical. Busy tags at high rates use more.",
                  "Forklift and tugger tags can run off the vehicle instead."], "/learn/location-data-quality/", "#ffb36b", "#f2a33a")),
          section(
              vp("One radio.", "Three ways to wear it."),
              cards([
                  ("/solutions/wip/", ph("A tote of machined parts on a trolley rail, an AmIGo screwed to the frame. Clean daylight, shallow depth. 4:3.", "steel"), "Carriers and bins", "Follow the work from station to station. This is where most plants start."),
                  ("/industries/warehousing/", ph("A forklift mast and cab in a racked aisle, a tag in a cradle on the overhead guard. Cool LED light. 4:3.", "cool"), "Forklifts and tuggers", "A vehicle tag that can run off the truck’s own power, in a cradle."),
                  ("/solutions/assets/", ph("A gauge case and a fixture on a shadow board, a small tag on each. Soft warm light. 4:3.", "office"), "Tools and fixtures", "Find the tool, and see which cell had it last."),
              ]),
              tiles([("Badges", "A lanyard or helmet badge for zone presence, under your site’s policy and with people’s consent."),
                     ("The carrier stays", "A tag names the trolley. Which job is on it comes from a link with a start and an end."),
                     ("Reused trolleys", "When a carrier is reused, the old job link closes before the new one begins.")]), tone="light", flush=True),
          section(
              vp("AmIGo, in detail."),
              spec([("UWB radio", "IEEE 802.15.4z HRP, channels 5 and 9"), ("Accuracy", "Down to ±10 cm in 3D, with AmIMo anchors; site-dependent"),
                    ("Update rate", "0.1–10 Hz, set per tag group; motion-triggered"), ("Battery", "1–3 years typical, usage-dependent; vehicle-powered option"),
                    ("Sensors", "3-axis accelerometer: motion wake, tilt and impact events"), ("Operating temperature", "−20 °C to +60 °C, typical"),
                    ("Mounting", "Adhesive, screw, lanyard or helmet, vehicle cradle"), ("Forms", "Asset tag, vehicle tag, personnel badge"),
                    ("Size and weight", "Shared under NDA with the datasheet"), ("Ingress rating", "Shared under NDA with the datasheet")],
                   "Indicative values from AmIMotion’s published brochure. The final datasheet is shared under NDA. Confirm the hardware revision for your evaluation."),
              id="specs", tone="light"),
          section(faq([
              ("What is an AmIGo tag?", "AmIGo is AmIMotion’s UWB tag for trolleys, bins, tools, forklifts and badges. With AmIMo anchors it is located down to ±10 cm in 3D, and its battery lasts 1 to 3 years, typical."),
              ("What battery life does a UWB asset tag have?", "An AmIGo UWB tag lasts 1 to 3 years on battery, typical. It depends on how often the tag moves and the update rate you set, because AmIGo sleeps when still."),
              ("Is AmIGo small enough for totes and hand tools?", "It is a compact tag with adhesive and screw mounts, made for trolleys, bins, tools and fixtures. Exact dimensions are on the datasheet, shared under NDA."),
              ("Does every tag report at the same rate?", "No. Update rate is set per tag group, from 0.1 to 10 times a second, and tags report only when they move."),
              ("Can AmIGo track people?", "A badge form shows zone presence, under your site’s policy and with people’s consent. AmIMotion locates badges, not bodies or movements."),
          ])),
          close("Tag the thing people go looking for.", "Bring one flow to the call. We’ll show it to you on the live map."),
      ], type="product", product="AmIGo", category="UWB tag", og="/assets/img/amigo-card-1600.webp")

# ---------------- AmIMo ----------------
write("/products/amimo/", "AmIMo UWB anchor: 3D angle of arrival, no sync cable",
      "AmIMo is AmIMotion’s UWB anchor. Range and 3D angle, no data or sync cabling, Wi-Fi backhaul, DC or PoE, about 50 m line of sight (site-dependent).",
      [
          head("AmIMo", "Anchors that need only power.", "It goes up on a column, hears every tag in reach, and notes when each pulse arrived and which way it came from. Anchors keep time with each other over the air, so the only thing you run to one is power.",
               trail=[("Platform", "/platform/"), ("AmIMo", None)], product=True, dark=True,
               actions=(("Plan a site survey", "/contact/"), ("Specifications", "#specs")),
               media=stage("/assets/img/amimo-a-1600.webp", AMIMO, "AmIMo anchor: a dark-grey box with a network port, a mounting tab and an embossed amimotion logo", 1600, 982, "cobalt")),
          section(
              '<div class="answer-tile" data-reveal><p>AmIMo in short</p><p class="short-answer">AmIMo is AmIMotion’s UWB anchor. A 3D angle-of-arrival antenna array reads direction as well as arrival time, so as few as two anchors in view can fix a position. '
              'The same unit offers BLE ranging and Wi-Fi FTM. Each anchor reaches about 50 m in line of sight (indicative, site-dependent) and needs only DC or PoE power.</p></div>',
              stats([("3D AoA", "Angle of arrival", "Direction as well as time"), ("~50 m", "Line-of-sight radius", "Indicative, site-dependent"),
                     ("0 cables", "For data or sync", "Wi-Fi backhaul, Ethernet option"), ("3–8 m", "Mounting height", "Wall, column, ceiling or pole")]), tone="dark"),
          section(
              vp("Three radios.", "One box on the column.", "So you don’t install a second network later."),
              tiles([("UWB", "Tagged carriers, vehicles and tools down to ±10 cm in 3D."),
                     ("BLE ranging", "Zone-level presence and search for BLE beacons and devices without a UWB tag."),
                     ("Wi-Fi FTM", "Ranging with compatible Wi-Fi devices. Device support is confirmed for each site.")]), tone="dark", flush=True),
          section(
              vp("Every floor gets a survey.", "Not a formula.", more="amimo-survey"),
              split("Your racking, roof height and steel decide where anchors go.",
                    ["Because each anchor reads angle as well as time, you often need fewer of them. Each one is set up from a phone app, and AmIHub finds it on its own."],
                    ["DC adapter or PoE power", "Hundreds of active tags per anchor cell in UL-TDoA, indicative", "Indoor and sheltered outdoor use, −20 °C to +60 °C typical"],
                    img("/assets/img/amimo-side-900.webp", "AmIMo anchor side view with the embossed amimotion logo", 900, 495, "graphite", srcset=AMIMO_SIDE), flip=True),
              km("amimo-survey", "Plan anchors", "Where anchors go.", [
                  "High on columns above machining halls, clear of moving vehicles.",
                  "Over dense racking, where the survey measures the steel first.",
                  "Spread around the area a tag moves in. A straight line of anchors gives poor accuracy across it.",
                  "The final count comes from a site survey, not from floor area."], "/learn/anchor-planning/", "#3b6ef5", "#66a5fa"),
              links([("/tools/anchors/", "How many anchors?", "A first range from your floor size, before a survey."),
                     ("/learn/anchor-planning/", "Anchor planning, explained", "What sets the count on a real floor."),
                     ("/technology/", "Timing and angle", "How AmIMo turns a pulse into a place.")])),
          section(
              vp("AmIMo, in detail."),
              spec([("UWB radio", "IEEE 802.15.4z HRP with a 3D angle-of-arrival antenna array"), ("Positioning modes", "UL-TDoA, DL-TDoA, two-way ranging and 3D AoA, chosen per zone"),
                    ("Additional ranging", "BLE-based ranging; Wi-Fi FTM (IEEE 802.11mc)"), ("Coverage", "About 50 m line-of-sight radius, indicative and site-dependent"),
                    ("Synchronisation", "Over-the-air timing sync; no sync cable"), ("Backhaul", "Wi-Fi 2.4 / 5 GHz to AmIHub; Ethernet option"),
                    ("Power", "DC adapter or PoE"), ("Tag capacity", "Hundreds of active tags per anchor cell (UL-TDoA), indicative"),
                    ("Mounting", "3–8 m recommended; wall, column, ceiling and pole brackets"), ("Commissioning", "Phone app; found automatically by AmIHub"),
                    ("Silicon", "NXP Trimension UWB")],
                   "Indicative values from AmIMotion’s published brochure. Coverage and spacing change with ceiling height, racking and metal. Final anchor counts come from a site survey."),
              id="specs", tone="light"),
          section(faq([
              ("What is an AmIMo anchor?", "AmIMo is AmIMotion’s UWB anchor. It times each tag pulse and reads its 3D angle of arrival, offers BLE and Wi-Fi FTM from the same unit, and needs only DC or PoE power, with no data or sync cabling."),
              ("Does an RTLS anchor need data cabling?", "Not AmIMo. It syncs over the air and sends data over Wi-Fi, with an Ethernet option. Each anchor still needs power, from DC or PoE."),
              ("How far does one AmIMo anchor reach?", "About 50 m in line of sight, indicative and site-dependent. Racking, machines and metal reduce the useful range."),
              ("How many anchors does a floor need?", "It depends on the accuracy you need, ceiling height and how much racking blocks line of sight. Angle of arrival lets as few as two anchors in view fix a position. A site survey sets the count."),
              ("Can AmIMo work with phones?", "AmIMo offers Wi-Fi FTM ranging from the same anchors, and in downlink mode a device works out its own position, which keeps it on the device. Which phones and laptops are supported depends on their chipset, so it is confirmed for each site."),
          ])),
          close("Mount it. Power it. That’s it.", "A site survey plans the anchors for one bay of your floor."),
      ], tone="dark", type="product", product="AmIMo", category="UWB anchor", og="/assets/img/amimo-a-1600.webp")

# ---------------- AmIHub ----------------
write("/products/amihub/", "AmIHub RTLS software: live map, zones and APIs",
      "AmIHub is AmIMotion’s RTLS software: live 3D map, time-stamped zones, REST, MQTT, WebSocket, omlox and a built-in MCP server. On-premise or cloud.",
      [
          head("AmIHub", "Where a position becomes a record.", "It does the maths that turns timings and angles into a spot on the map. Then it does the useful part: it remembers when each thing arrived, left, sat idle or waited, so anyone can ask.",
               trail=[("Platform", "/platform/"), ("AmIHub", None)], product=True,
               actions=(("See a live demo", "/contact/"), ("Interfaces", "#interfaces")),
               media=ph("Over the shoulder of a production lead at a laptop: the live map of a floor with zones and a few highlighted trolleys, the real floor soft in the background. 21:9. Screen content to be supplied by AmIMotion; no partner names on screen.", "night", "cine")),
          section(
              '<div class="answer-tile" data-reveal><p>AmIHub in short</p><p class="short-answer">AmIHub is AmIMotion’s positioning engine and system of record. '
              'It keeps a live map of zones and tracked items, time-stamps every enter, exit, idle and dwell event, and shares them over REST, MQTT, WebSocket and an omlox hub interface. '
              'It runs on an industrial PC in your plant with no internet dependency, or in the cloud, and has a built-in MCP server for AI assistants.</p></div>',
              tiles([("Positioning engine", "TDoA, AoA and two-way ranging solvers. Non-line-of-sight algorithms keep positions steady around racking and metal."),
                     ("Live map", "Your floor as a 3D model: plan, zones, geofences and racking, with every tracked item, its trail and history."),
                     ("Zones and events", "Every enter, exit, idle and dwell is time-stamped and queryable, for assets, vehicles, people and work orders."),
                     ("History", "Trajectory, trip and dwell queries by time window. CSV and Parquet export."),
                     ("Devices", "Auto-discovery, health and battery monitoring and over-the-air firmware, from one console."),
                     ("Scale", "From one bay to many sites. Thousands of tags and hundreds of anchors per site, indicative.")])),
          section(
              vp("Plug in anywhere.", "Your systems keep their jobs.", "Push to, or pull from, your MES, ERP, WMS, SCADA or BI. We agree exactly what flows where with your team, site by site."),
              compare(["Interface", "What it carries", "Typical use"], [
                  ("REST", "Positions, zones, history and device state", "Queries from MES, ERP and BI tools"),
                  ("MQTT", "Zone entries, exits and alerts as they happen", "Event streams into plant systems"),
                  ("WebSocket", "Live positions", "Screens and custom apps"),
                  ("omlox hub interface", "Location data in the open omlox model", "Mixing vendors and location technologies"),
                  ("MCP server", "Positions, zones, history; actions with approval", "AI assistants, shown in a live demo")]),
              id="interfaces", tone="dark"),
          section(
              vp("Ask the floor a question.", "We’ll show you live.", more="amihub-mcp"),
              tiles([("Ask", "Plain questions", "Any MCP-capable assistant can query positions, zones, fleets and work orders."),
                     ("Logged", "Every call recorded", "Each assistant gets its own credentials and tool scope, and every call is logged."),
                     ("Approve", "A person decides", "Write actions can wait for a supervisor’s approval. It runs where AmIHub runs.")]),
              km("amihub-mcp", "AmIHub and AI", "Your floor, in plain words.", [
                  "MCP (Model Context Protocol) is an open standard that lets AI assistants use software tools.",
                  "Ask: “What visited Cell 7 last night?”",
                  "The assistant reads only what you allow.",
                  "Shown in a live demo. The production setup is confirmed during pilot scoping."], "/learn/mcp-location-data/", "#8f7cf6", "#f08bbd")),
          section(
              vp("AmIHub, in detail."),
              spec([("Positioning", "UL-TDoA, DL-TDoA, two-way ranging and AoA solvers; NLOS handling"), ("Accuracy", "Down to ±10 cm in 3D, with AmIMo anchors; site-dependent"),
                    ("Updates", "Sub-second, indicative"), ("Scale", "Thousands of tags and hundreds of anchors per site, indicative"),
                    ("Interfaces", "REST, MQTT, WebSocket, omlox hub interface, built-in MCP server"), ("Hosting", "On-premise industrial PC with no internet dependency, or cloud"),
                    ("Security", "TLS, role-based access, API keys, audit logs, retention rules"), ("Export", "CSV and Parquet"),
                    ("Standards", "data and device model built on the FiRa and omlox specifications")],
                   "Analytics views for flow, vehicles and work orders sit on the same records. Ask for a current demo of the views that matter for your floor."),
              tone="light"),
          section(faq([
              ("What is AmIHub?", "AmIHub is AmIMotion’s RTLS software: the positioning engine, live 3D map, time-stamped zone events and open APIs (REST, MQTT, WebSocket, omlox and a built-in MCP server). It runs on-premise or in the cloud."),
              ("Which RTLS can run on-premise without internet?", "AmIHub runs on an industrial PC inside your plant with no internet dependency. Location data stays on site. A cloud option is there if you prefer it."),
              ("Does AmIHub replace our MES or WMS?", "No. AmIHub adds where and when. Jobs, orders and status stay in your MES, ERP or WMS, which AmIHub feeds over open interfaces."),
              ("Does AmIHub integrate with SAP or MES over MQTT?", "AmIHub publishes zone events over MQTT and offers REST, WebSocket and an omlox hub interface. The connector for your SAP, MES or ERP is confirmed during scoping."),
              ("Does AmIMotion have an MCP server?", "Yes, AmIHub has a built-in MCP server, so MCP-capable AI assistants can query live location data, with a person’s approval for any action. Shown in a live demo."),
          ])),
          close("See your floor on AmIHub.", "On the call we show the live map and an AI question, on real AmIHub data."),
      ], type="software", product="AmIHub")
