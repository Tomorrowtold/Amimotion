from lib import *

PACK = "In the detailed pack"

# ---------------- specs ----------------
write("/specs/", "AmIMotion specifications: AmIGo, AmIMo and AmIHub",
      "Public specifications for AmIGo tags, AmIMo anchors and AmIHub software: radio, positioning modes, accuracy, update rate, power, interfaces and hosting.",
      [
          head("Specifications.", "Everything we publish, on one page.",
               "The figures below come from AmIMotion’s published brochure and are indicative. Where a figure is not public yet, the table says where to get it.",
               short="AmIMotion is an ultra-wideband (UWB) location system built on IEEE 802.15.4z HRP and on the FiRa and omlox specifications. "
                     "AmIGo tags report 0.1 to 10 times a second, AmIMo anchors combine time difference of arrival with 3D angle of arrival, and AmIHub locates tags down to ±10 cm in 3D, on-premise or in the cloud.",
               trail=[("Platform", "/platform/"), ("Specifications", None)], actions=(("Ask for the detailed pack", "/contact/"), ("How it works", "/technology/"))),
          section(
              vp("How a position is solved."),
              spec([("Radio", "Ultra-wideband, IEEE 802.15.4z HRP, channels 5 and 9"),
                    ("Positioning modes", "UL-TDoA (tags send, anchors time), DL-TDoA (anchors send, the device solves its own position), two-way ranging and 3D angle of arrival. Chosen per zone."),
                    ("Accuracy", "Down to ±10 cm in 3D, with AmIMo anchors. Site-dependent: a pilot measures it on your floor."),
                    ("Update rate", "0.1 to 10 Hz, set per tag group; tags send more when they move"),
                    ("Latency", "Sub-second from pulse to position, indicative"),
                    ("Additional ranging", "BLE-based ranging and Wi-Fi FTM (IEEE 802.11mc) on the same anchors. Device support confirmed per site."),
                    ("Standards", "Built on the FiRa and omlox specifications. Not a certification claim.")]),
              tone="light"),
          section(
              vp("AmIGo tag."),
              spec([("Forms", "Asset tag, vehicle tag, personnel badge"),
                    ("Battery", "1 to 3 years, typical and usage-dependent; vehicle-powered option"),
                    ("Sensors", "3-axis accelerometer: motion wake, tilt and impact events"),
                    ("Operating temperature", "−20 °C to +60 °C, typical"),
                    ("Mounting", "Adhesive, screw, lanyard or helmet, vehicle cradle"),
                    ("Size, weight and ingress rating", PACK)]),
              links([("/products/amigo/", "AmIGo in full", "What it rides on and how it lasts.")]),
              tone="light", flush=True),
          section(
              vp("AmIMo anchor."),
              spec([("Antenna", "3D angle-of-arrival array"),
                    ("Coverage", "About 50 m line-of-sight radius, indicative and site-dependent"),
                    ("Synchronisation", "Over the air; no sync cable"),
                    ("Backhaul", "Wi-Fi 2.4 / 5 GHz to AmIHub; Ethernet option"),
                    ("Power", "DC adapter or PoE"),
                    ("Mounting height", "3 to 8 m recommended; wall, column, ceiling and pole brackets"),
                    ("Tag capacity", "Hundreds of active tags per anchor cell in UL-TDoA, indicative. The figure for your update rates is in the detailed pack."),
                    ("Commissioning", "Phone app; found automatically by AmIHub"),
                    ("Silicon", "NXP Trimension UWB")]),
              links([("/products/amimo/", "AmIMo in full", "Where anchors go and why."), ("/tools/anchors/", "How many anchors?", "A first range from your floor size.")]),
              tone="light", flush=True),
          section(
              vp("AmIHub software."),
              spec([("Hosting", "Industrial PC on your network with no internet dependency, or a cloud tenant"),
                    ("Interfaces", "REST, MQTT, WebSocket, omlox hub interface and a built-in MCP server"),
                    ("Records", "Position, time and zone history; every enter, exit, idle and dwell, time-stamped"),
                    ("Export", "CSV and Parquet"),
                    ("Security", "TLS, role-based access, API keys, audit logs and retention rules"),
                    ("Devices", "Health and battery monitoring; over-the-air firmware updates"),
                    ("Scale", "Thousands of tags and hundreds of anchors per site, indicative")]),
              links([("/products/amihub/", "AmIHub in full", "The map, the records and the interfaces."), ("/developers/", "For developers", "APIs, events and the MCP server.")]),
              tone="light", flush=True),
          section(
              vp("Not public yet.", "Shared under NDA, before a pilot.", "The detailed pack has the final datasheets and the architecture for your site."),
              tiles([("Datasheets", "Final figures", "Size, weight, ingress rating and the hardware revision for your evaluation."),
                     ("Capacity", "Your mix of tags", "Tags per anchor cell at the update rates your flows need."),
                     ("Accuracy", "How it is measured", "The test method a pilot uses, with anchor count and geometry, so you can check the figure yourself.")])),
          section(faq([
              ("Which positioning scheme does AmIMotion use?", "Several, chosen per zone: UL-TDoA, DL-TDoA, two-way ranging and 3D angle of arrival. Most asset tracking uses UL-TDoA, where tags send and anchors time the pulse."),
              ("What update rate do AmIGo tags support?", "0.1 to 10 Hz, set per tag group. Tags sleep when still and send when they move, which is why one battery lasts 1 to 3 years, typical."),
              ("How accurate is AmIMotion?", "Down to ±10 cm in 3D with AmIMo anchors. The figure depends on the site, so a pilot measures it on your floor, including near racking and machines."),
              ("Does AmIMotion hold FiRa or omlox certification?", "It is built on the FiRa and omlox specifications. It does not claim certification. AmIHub has an omlox hub interface for mixing vendors."),
          ])),
          close(),
      ], tone="light")

# ---------------- developers ----------------
write("/developers/", "AmIHub for developers: APIs, events and MCP",
      "How to connect to AmIHub: REST queries, MQTT and WebSocket events, an omlox hub interface and a built-in MCP server, with API keys, roles and audit logs.",
      [
          head("For developers.", "Five ways in.",
               "AmIHub keeps one record of where things are and when they moved. Your systems read it over open interfaces. Nothing you build is tied to one vendor.",
               short="AmIHub exposes location data over REST, MQTT, WebSocket, an omlox hub interface and a built-in MCP server for AI assistants. "
                     "Access uses API keys and role-based permissions over TLS, and every call is written to an audit log.",
               trail=[("Platform", "/platform/"), ("Developers", None)], actions=(("Ask for API access", "/contact/"), ("Specifications", "/specs/"))),
          section(
              vp("What you can read.", "Records, not raw radio."),
              tiles([("Positions", "Where each tag is", "A 3D position with the time it was seen, for every tracked item."),
                     ("Zone events", "Entered, left, idle, waiting", "Each event carries the tag, the zone and its time stamps."),
                     ("History", "Trips and dwell", "Trajectory, trip and dwell queries by time window. CSV and Parquet export."),
                     ("Devices", "Tags and anchors", "Health, battery level and firmware state."),
                     ("Map", "Your floor model", "Plan, zones, geofences and racking."),
                     ("Links", "Which job rides where", "A job linked to a carrier, with a start, an end and an owner, set by a scan or your records.")])),
          section(
              vp("Pick the interface.", "By what your system needs."),
              compare(["Interface", "Pattern", "Use it for"], [
                  ("REST", "Request and response", "Queries from MES, ERP, WMS and BI tools"),
                  ("MQTT", "Publish and subscribe", "Zone events into plant systems as they happen"),
                  ("WebSocket", "Live stream", "Screens and custom apps that show live positions"),
                  ("omlox hub interface", "Open location model", "Combining vendors and location technologies"),
                  ("MCP server", "Tools for AI assistants", "Plain-language questions, with a person approving any action")],
                  "The integration contract (topics, fields and rates) is agreed for each site. The full API reference comes with the detailed pack."),
              tone="dark"),
          section(
              vp("AI assistants, with limits.", "Built in, not bolted on.", "AmIHub has its own MCP server, so an MCP-capable assistant can ask the floor a question."),
              tiles([("Scoped", "Each assistant has its own key", "You choose which tools and zones it may use."),
                     ("Logged", "Every call recorded", "Who asked, what was read and when."),
                     ("Approved", "A person decides", "Any write action waits for a supervisor’s approval.")]),
              links([("/learn/mcp-location-data/", "MCP and location data", "What an assistant can and cannot do."), ("/products/amihub/", "AmIHub", "The software behind the interfaces.")])),
          section(
              vp("Security.", "The same controls on every interface."),
              tiles([("In transit", "TLS", "Every interface is encrypted."),
                     ("Access", "API keys and roles", "Keys per system or assistant; roles per person."),
                     ("Record", "Audit logs and retention", "Every call logged; retention rules set by you.")]),
              links([("/trust/", "Trust and data", "Where your data lives and what each claim rests on.")]),
              tone="light", flush=True),
          section(faq([
              ("Does AmIHub have an API?", "Yes. REST for queries, MQTT and WebSocket for live events and positions, an omlox hub interface, and a built-in MCP server for AI assistants."),
              ("Can AmIHub send zone events to our MES?", "Yes, over MQTT or REST. Which fields and topics your MES receives is agreed during scoping."),
              ("Where is the API reference?", "It comes with the detailed pack, shared under NDA before a pilot. Ask on a call."),
              ("Does it work without internet?", "Yes. On-premise, AmIHub runs on an industrial PC in your plant and every interface stays on your network."),
          ])),
          close(),
      ], tone="light")
