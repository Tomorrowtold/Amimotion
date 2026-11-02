import json, re
from pathlib import Path
from lib import *

ENTITY = json.loads((Path(__file__).resolve().parents[2] / "src" / "data" / "entity.json").read_text())
LONG = ENTITY["long"]


def seg(name, opts, stack=False):
    return f'<div class="seg{" stack" if stack else ""}">' + "".join(
        f'<label><input type="radio" name="{name}" value="{v}" data-label="{e(l)}"{" checked" if i == 0 else ""}><span>{l}{f"<i>{s}</i>" if s else ""}</span></label>'
        for i, (v, l, s) in enumerate(opts)) + "</div>"


def rng(id_, name, label, lo, hi, step, val, unit="", small=None):
    return (f'<label class="field"><span class="field-row"><span>{label}</span><output for="{id_}"></output></span>'
            f'<input type="range" id="{id_}" name="{name}" min="{lo}" max="{hi}" step="{step}" value="{val}" data-unit="{unit}">'
            + (f"<small>{small}</small>" if small else "") + "</label>")


def numf(name, label, val, small=None, step="1"):
    return (f'<label class="field"><span>{label}</span><input type="number" name="{name}" value="{val}" min="0" step="{step}" inputmode="decimal">'
            + (f"<small>{small}</small>" if small else "") + "</label>")


# ---------------- tools ----------------
write("/tools/anchors/", "UWB anchor estimator: a first range for your floor",
      "Enter your floor size and racking to get a first range of UWB anchors before a site survey. Assumptions shown. AmIMo reaches ~50 m line of sight.",
      [
          head("How many anchors?", "A first range.", "Your floor in, a first anchor range out, before anyone visits. A site survey sets the real number.",
               short="AmIMotion plans the final anchor count from a site survey. This estimator gives a first budget range from floor size and racking, using planning grids of about 25 m for an open hall, 18 m with some racking and 12 m with dense high racking. "
                     "An AmIMo anchor reaches about 50 m in line of sight (indicative, site-dependent).",
               trail=[("Tools", "/tools/"), ("Anchor estimator", None)], actions=()),
          section(
              '<div class="tool-shell"><form class="tool-form" data-tool="anchors" aria-label="Anchor estimator">'
              + rng("a-len", "flen", "Floor length", 10, 400, 5, 100, " m") + rng("a-wid", "fwid", "Floor width", 10, 300, 5, 50, " m")
              + rng("a-h", "height", "Ceiling height", 3, 20, 1, 9, " m")
              + '<fieldset class="field"><legend>What is on the floor?</legend>' + seg("env", [("mixed", "Some racking", None), ("open", "Open hall", None), ("dense", "Dense high racking", None)]) + "</fieldset>"
              + '<fieldset class="field"><legend>Position needed</legend>' + seg("dim", [("3d", "3D, with height", None), ("2d", "2D, floor only", None)]) + "</fieldset>"
              + '</form><div class="tool-out dark" aria-live="polite"><p class="over">First budget range</p><p class="big" data-out="range">—</p>'
              '<div class="lines"><p>Floor area <b data-out="area">—</b></p><p>Planning grid <b data-out="grid">—</b></p><p>Floor type <b data-out="env">—</b></p><p>Fewest in view for this mode <b data-out="min">—</b></p></div>'
              '<p class="note">A planning estimate from this site’s rule-of-thumb grids, not a quote or an AmIMotion specification. Angle of arrival can need fewer anchors; aisles between high racks can need more. A site survey sets the count.</p>'
              + btns((("Plan a site survey", "/contact/"), ("Anchor planning, explained", "/learn/anchor-planning/")), True) + "</div></div>"),
          close(),
      ], scripts="tools")

write("/tools/search-time/", "What searching costs: a search-time calculator",
      "Put a number on the hours your team spends looking for trolleys, bins and tools, from your own figures. Runs in your browser. No savings are assumed.",
      [
          head("What searching", "costs you.", "Put a number on the time your team spends looking, from your own figures.",
               short="Searching for trolleys, bins, tools and forklifts costs hours every shift. This calculator multiplies your own figures, people, searches and minutes, into hours a year. "
                     "AmIMotion’s tags put each item on a live map, located down to ±10 cm in 3D, so a search starts on a screen. The calculator assumes no savings.",
               trail=[("Tools", "/tools/"), ("Search-time calculator", None)], actions=()),
          section(
              '<div class="tool-shell"><form class="tool-form" data-tool="search" aria-label="Search-time calculator">'
              + rng("s-p", "people", "People who search, per shift", 1, 200, 1, 12)
              + rng("s-n", "per", "Searches per person, per shift", 1, 40, 1, 4)
              + rng("s-m", "mins", "Minutes per search", 1, 60, 1, 8, " min")
              + rng("s-s", "shifts", "Shifts per day", 1, 3, 1, 2)
              + rng("s-d", "days", "Working days a year", 200, 365, 1, 300)
              + numf("rate", "Loaded cost per hour, ₹ (optional)", "", "Leave empty to see hours only.")
              + '</form><div class="tool-out dark" aria-live="polite"><p class="over">Time spent searching</p><p class="big" data-out="hours">—</p>'
              '<div class="lines"><p>Per day <b data-out="day">—</b></p><p>Full-time people, equivalent <b data-out="fte">—</b></p><p>Cost a year <b data-out="cost">—</b></p></div>'
              '<p class="note">Your numbers, multiplied out. This is the cost of searching today, not a forecast of savings. A pilot measures the change on your floor.</p>'
              + btns((("Book a call", "/contact/"), ("Measure a baseline", "/learn/pilot-baseline/")), True) + "</div></div>"),
          close(),
      ], scripts="tools")

write("/tools/pilot/", "Pilot planner: a one-page RTLS pilot brief",
      "Three choices become a one-page brief for an AmIMotion pilot: the question, the starting area and how jobs are linked. Download it or email it.",
      [
          head("Your pilot", "on one page.", "Three answers become a brief for the first call. Nothing leaves your browser.",
               short="An AmIMotion pilot starts in one bay or one line with one question, a few zones and one owner. Choose what you need to understand, where to begin and how work is linked to trolleys today, "
                     "and the planner writes the brief, with the points to settle before hardware arrives.",
               trail=[("Tools", "/tools/"), ("Pilot planner", None)], actions=()),
          section(
              '<div class="tool-shell"><form class="tool-form" data-tool="pilot" aria-label="Pilot planner">'
              '<fieldset class="field"><legend>What do you need to understand?</legend>' + seg("q", [("find", "Find tagged trolleys", "Where a trolley was last seen."), ("link", "Link trolleys to jobs", "Which job is on which trolley, and where."), ("wait", "See where work waits", "Zones, visits and how long work sits.")], True) + "</fieldset>"
              '<fieldset class="field"><legend>Where would you begin?</legend>' + seg("area", [("bay", "One production bay", None), ("line", "One line-side flow", None), ("tools", "One tools or fixtures area", None), ("unsure", "Not sure yet", None)]) + "</fieldset>"
              '<fieldset class="field"><legend>How is work linked to trolleys today?</legend>' + seg("link", [("none", "Not defined yet", None), ("scan", "Manual or scanned", None), ("mes", "A record in our MES or ERP", None), ("na", "Not needed", None)]) + "</fieldset>"
              '</form><div class="tool-out dark" aria-live="polite"><p class="over">Your brief</p><p class="brief" data-out="brief"></p>'
              '<div class="actions"><button class="btn btn-white btn-sm" type="button" data-download>Download</button><button class="btn btn-line btn-sm" type="button" data-copy>Copy</button><a class="btn btn-line btn-sm" data-out="mail" href="mailto:sales@amimotion.com">Email it</a></div>'
              '<p class="note">Made in this browser. Not a quote, a feasibility result or a commitment. Email opens your own mail app.</p></div></div>'),
          close(),
      ], scripts="tools")

write("/tools/", "Free RTLS planning tools",
      "Three free tools from AmIMotion: a UWB anchor estimator, a search-time calculator and a one-page pilot planner. Plus the six-question floor diagnostic.",
      [
          head("Plan it", "before the call.", "Free tools that run in your browser. No sign-up.",
               short="AmIMotion offers four free planning tools: a floor diagnostic, a UWB anchor estimator, a search-time calculator and a pilot planner. Each runs in the browser and nothing is stored.",
               trail=[("Tools", None)], actions=()),
          section('<div class="tools">'
                  '<a class="tool" href="/diagnostic/" data-reveal><div><b>Diagnose your floor</b><p>Six questions. A visibility profile and a pilot scope that fits.</p></div><span class="go">Start</span></a>'
                  '<a class="tool" href="/tools/anchors/" data-reveal><div><b>How many anchors you need</b><p>Your floor size in, a first anchor range out, before a site survey.</p></div><span class="go">Plan anchors</span></a>'
                  '<a class="tool" href="/tools/search-time/" data-reveal><div><b>What searching costs you</b><p>Put a number on the time your team spends looking.</p></div><span class="go">Work it out</span></a>'
                  '<a class="tool" href="/tools/pilot/" data-reveal><div><b>Your pilot on one page</b><p>Describe one bay. Get a pilot brief to bring to the call.</p></div><span class="go">Build the brief</span></a></div>'),
          close(),
      ])

# ---------------- diagnostic ----------------
# the diagnostic markup, kept from the old homepage (the new homepage links here instead of embedding it)
diag = (Path(__file__).resolve().parent / "diag_block.html").read_text().rstrip()
write("/diagnostic/", "WIP visibility floor diagnostic",
      "Six questions about how work moves on your floor. Your plant builds itself as you answer, and you get a visibility profile and a pilot scope that fits.",
      [
          head("Your floor,", "diagnosed.", "Six questions on how work moves. Your profile appears at once, before we ask for anything.",
               short="AmIMotion’s floor diagnostic asks six questions about what your team looks for and where work waits. It sketches your floor as you answer and ends with a visibility profile and a pilot scope for one bay or line. Answers stay in your browser.",
               trail=[("Diagnose your floor", None)], actions=()),
          section(diag, flush=True),
          section(vp("Useful on its own."),
                  tiles([("A visibility profile", "Where work is likely hiding, and how your team finds it today."),
                         ("A pilot that fits", "One flow, its zones, one rule and one owner. Small enough to prove, big enough to matter."),
                         ("The right questions", "What we would ask on a floor walk, so the first call starts in the right place.")])),
          close(),
      ], scripts="diag")

# ---------------- pilot ----------------
write("/pilot/", "What an RTLS pilot involves",
      "An AmIMotion RTLS pilot runs in one bay or line: scope, baseline, survey and install, operational review, then a decision on evidence.",
      [
          head("A pilot", "worth running.", "One flow, a few zones and one rule, measured on your floor.",
               short="An RTLS pilot with AmIMotion covers one bay or one line. It runs through five steps: agree the question and area, measure a baseline, survey and install the anchors, review the results with the people who act, "
                     "then decide on evidence whether to extend on the same AmIHub. Positions are accurate down to ±10 cm in 3D, measured on your floor.",
               trail=[("Pilot", None)], actions=(("Book a call", "/contact/"), ("Build your brief", "/tools/pilot/")),
               media=ph("A site survey walk: an engineer and a production lead looking up at a column, a tablet in hand, the line running behind them. Clear daylight. 21:9.", "dawn", "cine")),
          section(vp("Five steps.", "Each one earns the next."),
                  tiles([("1 · Scope", "The question", "Agree the question, the area and the trolleys."),
                         ("2 · Baseline", "Today, measured", "How work is found and chased before tags go on."),
                         ("3 · Technical", "Survey and install", "Anchors planned for your floor and tested in the hard places."),
                         ("4 · Operational", "Used by people", "Reviewed with the people who act on it."),
                         ("5 · Commercial", "A decision", "Decide on evidence whether to extend.")], 3)),
          section(vp("What you get.", "What you bring. What your team does.", "So you know the effort before you say yes."),
                  '<div class="pilot-split three" data-reveal>'
                  '<div class="tile"><h3>What you get</h3><ul role="list"><li>An anchor plan from a site survey</li><li>Tags and anchors for one bay or line</li><li>AmIHub on a PC in your plant, or in the cloud</li><li>A baseline before tags go on, and the same numbers after</li><li>A review of the results with your team</li></ul></div>'
                  '<div class="tile"><h3>What you bring</h3><ul role="list"><li>One flow you want to see, such as trolleys between two stations</li><li>An owner on the floor who acts on what the map shows</li><li>Power at the anchor points, DC or PoE</li><li>The zones that matter, and the time limit for each</li></ul></div>'
                  '<div class="tile"><h3>What your team does</h3><ul role="list"><li>Walks the site survey with our engineer</li><li>Fixes tags to the trolleys or tools in scope: adhesive, screw or cradle</li><li>Uses the live map and the wait times in the daily routine</li><li>Joins the review and decides on the numbers</li></ul></div>'
                  '</div>'
                  '<p class="note" data-reveal>Duration and price depend on the area, the tag count and the anchor plan, so the quote follows the survey. Anchors mount on columns and walls and need only power, with no data or sync cables to run.</p>',
                  tone="light", flush=True),
          section(faq([
              ("What does an RTLS pilot involve?", "An AmIMotion pilot covers one bay or line, a few zones, one question and one owner. It has a baseline before tags go on, an anchor survey and install, a review with the people who use it, then a decision."),
              ("How big should the first pilot be?", "One main problem in one bounded area. Tag count, anchor plan and duration follow your site."),
              ("What if we can’t link jobs to carriers yet?", "Start with trolley location and wait times. Make the job link a pilot step before calling any result job-level."),
              ("What should success mean?", "Agree it up front: the right tags, useful position quality, fresh data, correct zones, and the effort for a person to respond."),
          ])),
          close(),
      ])

# ---------------- films ----------------
write("/films/", "Films: AmIMotion use cases in motion",
      "Four short AmIMotion films about one plant: finding a trolley, a robot hand-off, station-to-station timing and asking the plant a question.",
      [
          head("Watch the floor", "change.", "Four short films about one plant: finding work, moving it, timing it and asking about it.",
               short="These four AmIMotion films show one simulated plant. A worker finds a trolley on the live map, a robot hand-off is recorded without a scan, a trolley is timed station to station, and a supervisor asks an AI assistant a question.",
               trail=[("Films", None)], dark=True, actions=()),
          section('<div class="cards two">' + "".join(film(n) for n in (1, 2, 3, 4)) + "</div>", tone="dark"),
          section(links([("/use-cases/", "Use cases", "Each film, with the story around it."), ("/platform/", "The platform", "Tags, anchors and AmIHub."), ("/contact/", "See it live", "The real map, on a call.")]), tone="dark"),
          close(),
      ], tone="dark")

# ---------------- resources ----------------
write("/resources/", "AmIMotion resources: tools, guides and films",
      "Everything to plan a UWB location project with AmIMotion: the floor diagnostic, planning tools, field guides, films, FAQ and glossary.",
      [
          head("Everything", "to plan with.", "Tools, guides and films. No sign-up.",
               short="AmIMotion’s resources help plants plan real-time location: a floor diagnostic, an anchor estimator, a search-time calculator, a pilot planner, field guides, four short films, an FAQ and a glossary.",
               trail=[("Resources", None)], actions=()),
          section(links([("/diagnostic/", "Diagnose your floor", "Six questions, two minutes."), ("/tools/", "Planning tools", "Anchors, search time and pilot brief."), ("/films/", "Films", "Four jobs, in motion.")]),
                  links([("/learn/", "Field guides", "RTLS, UWB and WIP, explained."), ("/faq/", "Questions and answers", "AmIMotion, answered plainly."), ("/glossary/", "Glossary", "34 terms in plain words.")])),
          close(),
      ])

# ---------------- what is AmIMotion ----------------
write("/what-is-amimotion/", "What is AmIMotion? UWB RTLS from Bengaluru",
      "AmIMotion, a Bengaluru company, builds spatial intelligence for factories and warehouses: AmIGo tags, AmIMo anchors and AmIHub software, down to ±10 cm in 3D.",
      [
          head("What is", "AmIMotion?", trail=[("What is AmIMotion?", None)], short_label="The short answer", actions=(("Book a call", "/contact/"), ("See the platform", "/platform/")),
               short="AmIMotion is a Bengaluru company that builds spatial intelligence for factories and warehouses, using UWB indoor positioning: AmIGo tags, AmIMo anchors and AmIHub software. "
                     "Tags are located down to ±10 cm in 3D (with AmIMo anchors), and a built-in MCP server lets AI assistants query live location. It is a brand of Locatepro Technologies Pvt Ltd."),
          section('<div class="read"><nav class="read-nav" aria-label="On this page"><a href="#definition">Definition</a><a href="#not">What it is not</a><a href="#name">The name</a><a href="#for">Who it is for</a><a href="#does">What it does</a><a href="#facts">Facts</a></nav>'
                  + prose(f'<h2 id="definition">The definition, in one paragraph</h2><p>{LONG}</p>'
                          '<h2 id="not">What AmIMotion is not</h2><p>The name gets confused with others. AmIMotion is an industrial UWB indoor positioning company in Bengaluru, India. It is not related to Animotion, the presentation and video maker, to AIMotion or AI Motion video tools, or to any consumer or lifestyle brand. It does not track people’s bodies. It locates tagged objects, vehicles and badges on an indoor floor.</p>'
                          '<h2 id="name">The name</h2><p>AmIMotion is written with a capital A, I and M. The products carry the same prefix: AmIGo, the tag; AmIMo, the anchor; and AmIHub, the software.</p>'
                          '<h2 id="for">Who it is for</h2><p>Manufacturing and intralogistics teams who spend time walking the floor to find things: plant and production heads, operations and industrial engineering, intralogistics and warehouse managers, and the IT and OT teams who connect floor data to MES, ERP and WMS. AmIMotion runs in manufacturing, robotics and warehousing sites. Customer references are shared under NDA.</p>'
                          '<h2 id="does">What it does</h2><ul><li><strong>Finds tagged things.</strong> Trolleys, bins, tools, fixtures and forklifts carry AmIGo tags, so a team sees each one on a live map instead of walking the hall.</li>'
                          '<li><strong>Shows where work waits.</strong> AmIHub turns positions into time-stamped zone entries and dwell. Linked to a job, that becomes work-in-progress visibility.</li>'
                          '<li><strong>Puts vehicles, robots and people on one map.</strong> Forklifts, AMRs and badges share the same location layer.</li>'
                          '<li><strong>Answers AI assistants.</strong> AmIHub’s built-in MCP server lets MCP-capable assistants query live positions, with a person’s approval for any action. Shown in a live demo.</li></ul>'
                          '<h2 id="facts">Facts, with their qualifiers</h2><ul>' + "".join(f"<li>{x}</li>" for x in ENTITY["facts"]) + "</ul>") + "</div>"),
          section(faq([
              ("What is AmIMotion?", LONG),
              ("What does AmIMotion do?", "AmIMotion shows factories and warehouses where work is and where it waits. AmIGo tags on trolleys, bins, pallets, totes, tools and forklifts are located by AmIMo anchors down to ±10 cm in 3D, and AmIHub puts them on a live map of the factory or warehouse."),
              ("Are there Indian companies making UWB tags and anchors?", "Yes. AmIMotion designs and builds UWB tags (AmIGo), anchors (AmIMo) and software (AmIHub) in India, on NXP Trimension UWB silicon."),
              ("Is AmIMotion the same as Animotion or AIMotion?", "No. AmIMotion is an industrial UWB indoor positioning company in Bengaluru, India, and is not related to them."),
              ("Where is AmIMotion based?", "Bengaluru, India. AmIMotion is a brand of Locatepro Technologies Pvt Ltd."),
          ], "Quick answers.")),
          close("See it on a live map.", "A short call: the live map, an AI query on AmIHub data, and the questions that scope a pilot."),
      ], type="article")

# ---------------- industrial spatial intelligence ----------------
write("/industrial-spatial-intelligence/", "What is Industrial Spatial Intelligence?",
      "Industrial Spatial Intelligence turns precise, time-stamped location of work, tools and vehicles into answers for people, systems and AI. AmIMotion builds it.",
      [
          head("Industrial Spatial", "Intelligence.", trail=[("Industrial Spatial Intelligence", None)], short_label="The short answer", actions=(("Book a call", "/contact/"), ("See the platform", "/platform/")),
               short="Industrial spatial intelligence is precise, time-stamped location of everything that moves in a plant, such as carriers, pallets, tools, vehicles and robots, joined with jobs and zones, "
                     "so people, systems and AI assistants can answer where work is and where it waits. AmIMotion builds it for factories and warehouses, on UWB positioning down to ±10 cm in 3D. It is the first layer of Physical AI, built and supported in India."),
          section(vp("Three layers.", "One answer."),
                  tiles([("Location", "Where, precisely", "UWB positions to centimetres, each with the time it was seen."),
                         ("Context", "What it means", "Zones, jobs and rules: which job is on the trolley in the inspection queue, and how long it has waited."),
                         ("Answers", "Who can ask", "Supervisors on a map, MES and ERP over open interfaces, and AI assistants over MCP.")]),
                  links([("/solutions/wip/", "Where it starts: WIP visibility", "Which job waits where, and for how long."), ("/learn/mcp-location-data/", "AI assistants and location", "MCP, access and approval."), ("/technology/", "The location layer", "How UWB works.")])),
          section(faq([
              ("What is Industrial Spatial Intelligence?", "Precise, time-stamped location of what moves in a plant, joined with context such as jobs and zones, so people, systems and AI can answer where work is and where it waits."),
              ("How is it different from RTLS?", "RTLS is the location layer. Spatial intelligence adds the context and the answers on top of it."),
              ("Where does AmIMotion start?", "With WIP visibility in factories: tagged carriers, linked to jobs, timed in every zone. In warehouses the same records time pallets and totes from dock to stock."),
          ])),
          close(),
      ], type="article")

# ---------------- FAQ ----------------
FAQS = [
    ("The company.", [
        ("What is AmIMotion?", LONG),
        ("Who makes AmIMotion and where is it based?", "Locatepro Technologies Pvt Ltd, in Bengaluru, India. AmIMotion is its brand, and the tags, anchors and software are designed and built in India."),
        ("Who uses AmIMotion, and what does it cost?", "AmIMotion runs in manufacturing, robotics and warehousing sites. References, results and pricing are shared under NDA after a first call."),
        ("Can we start small?", "Yes. Start with a pilot in one bay or line, then scale on the same AmIHub without re-instrumenting."),
    ]),
    ("How it works.", [
        ("How accurate is AmIMotion?", "Down to ±10 cm in 3D, with AmIMo anchors. Accuracy depends on the site, so a pilot measures it on your floor."),
        ("Do the anchors need cables?", "No data or sync cabling. Anchors sync over the air and send data over Wi-Fi, with an Ethernet option. Each anchor needs power, from DC or PoE."),
        ("Does UWB work in a factory full of steel and racking?", "UWB’s wide bandwidth separates the direct signal from reflections. AmIMotion adds non-line-of-sight algorithms and plans anchor density per zone."),
        ("How long do tag batteries last?", "1 to 3 years, typical and usage-dependent. Tags sleep when still and send when they move."),
        ("Does AmIMotion track individual parts?", "It tags the carrier: the trolley, bin or rack. Which parts or job it holds comes from a carrier-to-job link, not from the radio."),
    ]),
    ("Systems, data and AI.", [
        ("Can it run without the internet?", "Yes. AmIHub can run on an industrial PC inside your plant with no internet dependency, or in the cloud."),
        ("Does it connect to our MES or ERP?", "AmIHub offers REST, MQTT and WebSocket and an omlox hub interface, and can push events to MES, ERP, WMS, SCADA or BI. Connectors are confirmed for each site."),
        ("Does AmIMotion hold FiRa or omlox certification?", "AmIMotion is built on the FiRa and omlox specifications. That is a compliance statement, not a formal certification."),
        ("Does AmIMotion have an MCP server for AI assistants?", "Yes. AmIHub has a built-in MCP server, so MCP-capable AI assistants can query live positions, zones and history. Actions need a person’s approval, and every call is logged. Shown in a live demo."),
    ]),
]
write("/faq/", "AmIMotion FAQ: UWB indoor positioning, answered",
      "Plain answers about AmIMotion: down to ±10 cm in 3D, anchors and cabling, steel and racking, MES and ERP links, FiRa and omlox, MCP for AI, pilots.",
      [
          head("AmIMotion,", "answered plainly.", trail=[("FAQ", None)], short=LONG, actions=()),
          *[section(faq(items, title)) for title, items in FAQS],
          close("Ask us the next one.", "On a call an engineer answers the questions specific to your floor."),
      ], type="faq")

# ---------------- glossary ----------------
TERMS = [
    ("Positioning", [
        ("rtls", "RTLS", "Real-time location system: fixed infrastructure and software that continuously locate tagged objects or people, usually indoors where GPS does not work."),
        ("uwb", "UWB", "Ultra-wideband: radio that sends very short pulses across a wide band of frequencies. Short pulses allow precise timing, so distance can be measured to centimetres and echoes told apart."),
        ("tag", "Tag", "The small device attached to whatever is tracked: a carrier, tool, vehicle or badge. AmIMotion’s tag is AmIGo."),
        ("anchor", "Anchor", "A fixed reference device at a known position that receives or sends UWB signals. AmIMotion’s anchor is AmIMo, with a 3D angle-of-arrival antenna array."),
        ("tof", "Time of flight", "The time a radio signal takes to travel from transmitter to receiver. Multiplied by the speed of light, about 30 cm per nanosecond, it gives distance."),
        ("twr", "TWR", "Two-way ranging: tag and anchor exchange messages and measure the round trip to compute distance."),
        ("tdoa", "TDoA", "Time difference of arrival: position computed from the differences in when one signal reaches several synchronised receivers."),
        ("ul-tdoa", "UL-TDoA", "Uplink TDoA: the tag sends a short blink and anchors compute its position. Tags only transmit, so many low-power tags can be tracked."),
        ("dl-tdoa", "DL-TDoA", "Downlink TDoA: anchors transmit and the device computes its own position, like GPS indoors, which helps privacy."),
        ("aoa", "AoA", "Angle of arrival: an antenna array measures the direction a signal comes from. 3D AoA measures horizontal and vertical angle."),
        ("multipath", "Multipath", "Copies of a signal that arrive late after bouncing off metal, walls or racking."),
        ("nlos", "NLOS", "Non-line-of-sight: the direct path between tag and anchor is blocked, so the strongest signal may be a reflection."),
        ("ota-sync", "Over-the-air sync", "Synchronising anchor clocks by radio instead of timing cables."),
        ("ftm", "Wi-Fi FTM", "Fine Timing Measurement (IEEE 802.11mc): Wi-Fi round-trip timing that lets compatible Wi-Fi devices estimate distance without a separate tag."),
        ("ble", "BLE ranging", "Estimating proximity to Bluetooth Low Energy devices; coarse and typically zone-level."),
        ("update-rate", "Update rate", "How often a tag reports per second. 0.1 Hz is once every 10 seconds; 10 Hz is ten times a second."),
    ]),
    ("Standards", [
        ("802154z", "IEEE 802.15.4z", "The UWB standard amendment that adds enhanced and secure ranging. HRP is the high-rate pulse physical layer used by most current UWB chips."),
        ("fira", "FiRa", "The FiRa Consortium, an industry body that defines interoperable UWB specifications and runs certification programmes."),
        ("omlox", "omlox", "An open standard for interoperable industrial location systems, so different location technologies and vendors can feed one location hub."),
        ("compliant", "Compliant", "A company states that its product follows a specification. A formal certification means an authorised body has tested it. AmIMotion describes itself as built on the FiRa and omlox specifications."),
    ]),
    ("Operations", [
        ("wip", "WIP", "Work in progress: partly finished goods moving through production."),
        ("wip-visibility", "WIP visibility", "Knowing where work in progress physically is, which job each carrier holds and how long it has waited in each zone."),
        ("carrier", "Carrier", "The trolley, bin, rack or container that holds WIP. In a WIP visibility system the carrier carries the tag."),
        ("association", "Association", "The time-bounded link tag to carrier to job that gives a location its work meaning. It has a start, an end and an owner."),
        ("zone", "Zone", "An agreed area of the floor, such as an assembly queue. Entering or leaving it creates a time-stamped event."),
        ("dwell", "Dwell", "Time spent in a zone, from entry to exit. It includes waiting, processing and breaks, so it is not the same as cycle time."),
        ("exception", "Exception", "A rule breach, such as dwell above an agreed limit, that asks a person to look. It is not a diagnosis."),
        ("mes", "MES, ERP, WMS", "Manufacturing execution, enterprise resource planning and warehouse management systems: the systems of record for jobs, orders and stock."),
        ("amr", "AGV and AMR", "Automated guided vehicle, which follows fixed paths, and autonomous mobile robot, which navigates freely."),
        ("milk-run", "Milk run", "A fixed-route delivery loop, often by tugger, feeding line-side stations."),
    ]),
    ("Software and AI", [
        ("amihub", "AmIHub", "AmIMotion’s software: it works out positions and keeps the live map, zones, time-stamped events and interfaces."),
        ("mcp", "MCP", "Model Context Protocol: an open protocol that lets AI assistants call external tools and data. AmIHub has a built-in MCP server."),
        ("isi", "Industrial Spatial Intelligence", "Precise, time-stamped location of what moves in a plant, joined with context such as jobs and zones, so people, systems and AI can answer where work is and where it waits."),
        ("edge", "Edge", "Computing done on site, near the equipment, rather than in a remote cloud."),
    ]),
]
n_terms = sum(len(t) for _, t in TERMS)
write("/glossary/", "Glossary of RTLS and UWB terms",
      "Plain definitions of industrial location terms: RTLS, UWB, TDoA, angle of arrival, multipath, omlox, FiRa, WIP visibility, dwell and association.",
      [
          head("The words,", "without the jargon.", f"{n_terms} terms you will hear when people talk about location on a factory floor.", trail=[("Glossary", None)], actions=(),
               short="This glossary from AmIMotion defines the terms used in real-time location on factory floors, from RTLS and UWB to dwell and carrier-to-job association. AmIMotion locates tags down to ±10 cm in 3D, with AmIMo anchors."),
          section('<nav class="term-index" aria-label="Terms">' + "".join(f'<a href="#{i}">{n}</a>' for _, ts in TERMS for i, n, _ in ts) + "</nav>"
                  + "".join(f'<div class="term-group"><h2 class="h3">{g}</h2><dl class="terms">' + "".join(f'<dt id="{i}">{n}</dt><dd>{dd}</dd>' for i, n, dd in ts) + "</dl></div>" for g, ts in TERMS)),
          close(),
      ], type="glossary")

# ---------------- company ----------------
write("/company/", "About AmIMotion: UWB RTLS from Bengaluru",
      "AmIMotion, a brand of Locatepro Technologies, designs and builds UWB tags, anchors and software in Bengaluru, India. One team, one contract, one support line.",
      [
          head("Designed in Bengaluru.", "Built in India.", short=LONG, trail=[("Company", None)],
               media=ph("The AmIMotion team at work in the Bengaluru lab: a bench with anchors and tags, a laptop with the map, two engineers talking. Natural window light. 21:9. Real photo to be supplied by AmIMotion.", "office", "cine")),
          section(stats([("Bengaluru", "Designed and built in India", "Engineers on site"), ("End to end", "Tags, anchors and AmIHub", "From one team"),
                         ("Open", "built on the FiRa and omlox specifications", "REST, MQTT, WebSocket"), ("In the field", "Manufacturing, robotics, warehousing", "References under NDA")])),
          section(vp("Every position", "has an age.", "A position helps only when people know where it came from, how old it is and what work it belongs to. So every record carries a time, unknown is shown as unknown, and nothing is dispatched on location alone."),
                  tiles([("We start from your floor", "Pilots are scoped from a survey of the flow you care about."),
                         ("One contract, one support line", "Hardware, software and integration from the people who built them."),
                         ("We say what location can’t do", "Location is not completion, cause or permission. We design around that."),
                         ("Pilot first", "Pilot one bay or line, then scale on the same AmIHub.")], 4), tone="dark", id="work-with-us"),
          section(links([("/what-is-amimotion/", "What is AmIMotion?", "The definition, the name and the facts."), ("/trust/", "Scope and evidence", "What each claim rests on."), ("/contact/", "Contact", "sales@amimotion.com")])),
          close(),
      ])

# ---------------- contact ----------------
write("/contact/", "Book a call with AmIMotion",
      "Book a call with AmIMotion: see the live map and an AI query on real AmIHub data, and scope a UWB pilot for one bay or line. sales@amimotion.com",
      [
          head("Book a call.", None, "Tell us where your team walks to check. We show the live map on real AmIHub data.", trail=[("Contact", None)], actions=()),
          section('<div class="contact"><div>'
                  '<form class="form" data-contact novalidate>'
                  '<label>Your name<input name="name" autocomplete="name" required></label>'
                  '<label>Work email<input name="email" type="email" autocomplete="email" required></label>'
                  '<label>Company<input name="company" autocomplete="organization" required></label>'
                  '<label>Role (optional)<input name="role" autocomplete="organization-title"></label>'
                  '<label>Which part of your flow needs someone to go and check?<textarea name="flow"></textarea></label>'
                  '<button class="btn btn-fill" type="submit">Book a call</button><p class="small">Opens a draft to sales@amimotion.com in your mail app. This site stores nothing.</p></form>'
                  '<div class="draft" data-draft hidden><p><b>Your draft is ready.</b></p><p class="small" style="white-space:pre-wrap;margin-top:10px" data-draft-text></p><div class="actions"><a class="btn btn-fill btn-sm" data-draft-mail href="mailto:sales@amimotion.com">Open email draft</a><button class="btn btn-line btn-sm" type="button" data-draft-copy>Copy text</button></div></div>'
                  '</div><div>'
                  '<h2 class="h3">What happens next</h2><ol class="next-steps"><li>A call, with a live demo of the map.</li><li>NDA and the detailed pack: datasheets, architecture, pricing.</li><li>A site survey and a pilot in one bay or line.</li><li>Scale on the same AmIHub, if the pilot earns it.</li></ol>'
                  '<h2 class="h3" style="margin-top:48px">Write directly</h2><p class="lede" style="margin-top:10px"><a href="mailto:sales@amimotion.com">sales@amimotion.com</a></p>'
                  '<p class="small" style="margin-top:16px">AmIMotion · Locatepro Technologies Pvt Ltd · Bengaluru, India</p>'
                  '</div></div>'),
          section(faq([
              ("Do you work with plants outside India?", "AmIMotion is based in Bengaluru, India. For plants elsewhere, including the Gulf, write to sales@amimotion.com and we will set out how survey, installation and support would work for your site."),
              ("What do you need from us for the first call?", "One flow where people walk to find work, and roughly how big the area is. The pilot planner helps you prepare."),
              ("Is the demo on real data?", "Yes. The call shows the live map and an AI query on real AmIHub data, not slides."),
          ], "Before you write.")),
      ], scripts="tools")

# ---------------- trust ----------------
write("/trust/", "Scope and evidence: what AmIMotion’s claims rest on",
      "What AmIMotion’s claims rest on, where your data lives and how access is secured: on-premise or cloud, TLS, roles, API keys and audit logs.",
      [
          head("Clear claims.", "Clear boundaries.", "What each claim on this site rests on, and what your floor still has to show.", trail=[("Scope and evidence", None)], actions=(),
               short="AmIMotion’s product figures, such as down to ±10 cm in 3D (with AmIMo anchors) and 1 to 3 years of tag battery (typical), come from its published brochure and are indicative. A pilot measures them on your floor."),
          section(tiles([("Product facts", "From the brochure", "Figures are indicative, not independently measured. Confirm hardware revision, software version and setup in your evaluation."),
                         ("Pictures and films", "Made to explain", "Pictures, films and scenes on this site explain the product. They are not customer sites or live data."),
                         ("What location does not prove", "Its limits", "Which job is on a trolley, that work is done, why something waited, or that an action is allowed. Those need agreed links, rules and permissions."),
                         ("Standards", "Built on the specifications", "AmIMotion is built on the FiRa and omlox specifications. This site does not claim FiRa or omlox certification."),
                         ("Interfaces and hosting", "Confirmed per site", "REST, MQTT, WebSocket and an omlox hub interface, on-premise or cloud. Connectors and responsibilities are confirmed per site."),
                         ("Analytics and AI", "Shown in a demo", "Analytics views and MCP assistants are shown in a live, scoped demo. This site claims no robot control or measured business gains.")])),
          section(vp("Security and your data.", "Where it lives, who can read it.", "The same controls apply on-premise and in the cloud."),
                  tiles([("Data residency", "On-premise", "AmIHub runs on an industrial PC on your network with no internet dependency. Positions, zones and history stay on your site."),
                         ("Data residency", "Cloud", "A cloud tenant, with the hosting region and terms set in your contract."),
                         ("In transit", "TLS", "Every interface, from REST and MQTT to the MCP server, is encrypted."),
                         ("Access", "Roles and API keys", "Roles per person, keys per system or AI assistant, each with its own scope."),
                         ("Record", "Audit logs and retention", "Every call is logged. You set how long history is kept."),
                         ("Updates", "Over the air", "Anchor and tag firmware is updated from AmIHub. Release notes and the update process are in the detailed pack.")]),
                  links([("/developers/", "For developers", "Interfaces, events and the MCP server."), ("/specs/", "Specifications", "Every figure we publish, and where it comes from.")]),
                  id="security", tone="light", flush=True),
          section(vp("Customers and sites.", "Named only with permission."),
                  tiles([("Customer names", "With written permission", "This site names no customer. Names and outcomes appear only when a customer agrees in writing."),
                         ("Wording", "Pilot or production", "We say a pilot is a pilot. This site does not use “deployed at” for any customer."),
                         ("References", "On a call", "Ask on a call which references can speak to your kind of floor.")], 3),
                  tone="light", flush=True),
          close(),
      ])

# ---------------- privacy ----------------
write("/privacy/", "Privacy",
      "This site works without sign-up or advertising pixels. Diagnostic answers, planner briefs and email drafts stay in your browser until you send them.",
      [
          head("A useful visit,", "without a profile.", "Everything on this site works without signing up or handing over contact details.", trail=[("Privacy", None)], actions=()),
          section(prose('<h2>Advertising and tracking</h2><p>This site has no advertising pixels and no cross-site tracking. The host may process technical request data to serve and secure the site.</p>'
                        '<h2>Floor diagnostic</h2><p>Your answers stay in this browser tab, so you can pick up where you left off. They leave your browser only if you choose to send your profile.</p>'
                        '<h2>Tools and pilot briefs</h2><p>The anchor estimator, search-time calculator and pilot planner run in your browser. Downloading a brief saves a local file. Nothing is sent to AmIMotion unless you email it.</p>'
                        '<h2>Enquiries</h2><p>The contact form prepares an email draft in your own mail app. Sending is a step you take.</p>'
                        '<h2>Questions</h2><p>For questions about information you send to AmIMotion, write to <a href="mailto:sales@amimotion.com">sales@amimotion.com</a>. This page covers this website only.</p>')),
      ])

# ---------------- 404 ----------------
write("/404.html", "Page not found",
      "This page has moved. Return to the AmIMotion homepage or the platform overview.",
      [
          head("This page", "has moved.", "We’d rather say so than guess. Try the homepage or the platform.", dark=True, actions=(("Return home", "/"), ("Platform", "/platform/"))),
      ], tone="dark", noindex="true")


# ---------------- stubs for nav targets that homepage-final.md defines and the site lacked (round 04) ----------------
# Minimal pages. Every line is a locked line from homepage-final.md (screens 3 and 6, nav lines), so no new claim is made.
NAV = json.loads((Path(__file__).resolve().parents[2] / "src" / "data" / "nav.json").read_text())
_start = next(s for s in NAV["sections"] if s["url"] == "/start/")
write("/start/", "Start small: one bay first",
      "Start with one bay. How a pilot runs, how to buy, and the tools and guides that help you plan your first bay with AmIMotion.",
      [
          head("Start with one bay.", None, "A pilot follows one flow in one bay or line. You choose the flow.",
               short="AmIMotion pilots start in one bay or line. You see your own waits in one bay, and prove the numbers, before you decide on more. "
                     "Then grow plant-wide on the same AmIHub, without re-fitting the first bay.",
               trail=[("Start small", None)], actions=(("Book a call", "/contact/"), ("Plan your first bay", "/diagnostic/"))),
          section(vp("Start small."), links([(u, l, line) for l, u, line in _start["items"]])),
      ])

write("/how-to-buy/", "How to buy AmIMotion: call, NDA pack, survey, pilot",
      "What you buy from AmIMotion: AmIGo tags, AmIMo anchors and AmIHub, plus our survey and an anchor plan for your floor. One contract.",
      [
          head("How to buy.", None, "Call, NDA pack, survey, pilot.",
               short="What you buy. AmIGo tags, AmIMo anchors and AmIHub, plus our survey and an anchor plan for your floor. Designed and built in India, with local stock and local engineers on your site. "
                     "One contract and one support line cover every layer.",
               trail=[("How to buy", None)], actions=(("Book a call", "/contact/"),)),
          section(vp("Four steps."),
                  steps([("Call", "The call is a live demo on real AmIHub data, not slides."),
                         ("NDA pack", "After the first call, we share datasheets, architecture, prices and pilot options under NDA."),
                         ("Survey", "We survey your floor and set the anchor count."),
                         ("Pilot", "A pilot follows one flow in one bay or line. You see your own waits in one bay, and prove the numbers, before you decide on more.")]),
                  prose("<p>Your team or your integrator can build on it at any layer, through open interfaces. AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.</p>"),
                  links([("/pilot/", "How a pilot runs", "One flow, one bay"), ("/diagnostic/", "Plan your first bay", "Six questions, a plan back"), ("/contact/", "Book a call", "Talk to the team")])),
      ])

write("/trust/people/", "People and privacy: what a pilot tags",
      "An AmIMotion pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project, with its own policy.",
      [
          head("People and privacy.", None, "What a pilot tags, and why.",
               short="The AmIMotion pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy. You also set how long the map keeps its history.",
               trail=[("Trust and data", "/trust/"), ("People and privacy", None)], actions=(("Book a call", "/contact/"),)),
          section(vp("On the trolley, not the person."),
                  prose("<p>A small tag rides on each trolley, bin and tool. It goes on the trolley, not on the person pushing it.</p>"
                        "<p>You set who sees what, by role. Why it waited is for your team to say.</p>"),
                  links([("/trust/", "Trust and data", "Where your data lives"), ("/pilot/", "How a pilot runs", "One flow, one bay")])),
      ])
